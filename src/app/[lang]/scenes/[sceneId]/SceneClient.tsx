'use client'

import Card from '@/components/Card'
import { Trigger } from '@/types/followly'
import { PortableText } from '@portabletext/react'
import { Frame, Scene } from '@sanity-types'
import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

type Props = {
	scene: Scene
	stack: Array<{ frame: Frame; triggers: Array<Trigger> }>
	params: {
		lang: string
	}
}

export default function SceneClient({ params, scene, stack }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [nextIndex, setNextIndex] = useState<number | null>(null)
  const [animDirection, setAnimDirection] = useState<'onScrollUp' | 'onScrollDown' | null>(null)
  const touchStartY = useRef<number | null>(null)
  const current = stack[currentIndex]
  const scrollLockRef = useRef(false)
  const lastScrollTime = useRef(0)
  const cardRef = useRef<HTMLDivElement>(null)
  const nextCardRef = useRef<HTMLDivElement>(null)

  // Animate transition between cards
  const animateTransition = useCallback(
    (dir: 'onScrollUp' | 'onScrollDown', targetIndex: number) => {
      if (!cardRef.current || targetIndex === null) {
        setCurrentIndex(targetIndex)
        setIsAnimating(false)
        setNextIndex(null)
        setAnimDirection(null)
        return
      }
      setIsAnimating(true)
      setNextIndex(targetIndex)
      setAnimDirection(dir)
    },
    []
  )

  // Run GSAP animation when isAnimating, nextIndex, and animDirection are set
  useEffect(() => {
    if (!isAnimating || nextIndex === null || animDirection === null) return;
    if (!cardRef.current || !nextCardRef.current) return;
    // Prepare next card position
    gsap.set(nextCardRef.current, {
      y: animDirection === 'onScrollUp' ? 60 : -60,
      opacity: 0,
      position: 'absolute',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
    });
    gsap.set(cardRef.current, {
      position: 'absolute',
      width: '100%',
      height: '100%',
    });
    // Animate current card out, next card in
    gsap.to(cardRef.current, {
      y: animDirection === 'onScrollUp' ? -60 : 60,
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        gsap.to(nextCardRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.4,
          onComplete: () => {
            setCurrentIndex(nextIndex)
            setIsAnimating(false)
            setNextIndex(null)
            setAnimDirection(null)
            // Reset transforms
            if (cardRef.current) gsap.set(cardRef.current, { clearProps: 'all' })
            if (nextCardRef.current) gsap.set(nextCardRef.current, { clearProps: 'all' })
          },
        })
      },
    })
  }, [isAnimating, nextIndex, animDirection])

  // Navigation logic
  const navigate = useCallback(
    (eventName: string) => {
      if (isAnimating) return
      const trigger = current?.triggers?.find(t => t.standardEvent === eventName)
      const targetId = trigger?.goTo?._id
      const targetIndex = stack.findIndex(f => f.frame._id === targetId)
      if (targetIndex !== -1 && targetIndex !== currentIndex) {
        animateTransition(eventName as 'onScrollUp' | 'onScrollDown', targetIndex)
      }
    },
    [current, stack, currentIndex, animateTransition, isAnimating]
  )

  // Scroll and swipe logic
  useEffect(() => {
    if (!current) return
    const handleScroll = (e: WheelEvent) => {
      e.preventDefault(); // Prevent browser scroll/bounce
      const now = Date.now()
      if (Math.abs(e.deltaY) < 10) return
      if (scrollLockRef.current && now - lastScrollTime.current < 400) return
      const dir = e.deltaY > 0 ? 'onScrollDown' : 'onScrollUp'
      lastScrollTime.current = now
      scrollLockRef.current = true
      navigate(dir)
      setTimeout(() => {
        scrollLockRef.current = false
      }, 400)
    }
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault(); // Prevent browser scroll/bounce
      touchStartY.current = e.touches[0].clientY
    }
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault(); // Prevent browser scroll/bounce
      const start = touchStartY.current
      const end = e.changedTouches[0].clientY
      if (start === null) return
      const delta = start - end
      // Swipe up means next card (onScrollDown), swipe down means previous card (onScrollUp)
      const dir = delta > 30 ? 'onScrollDown' : delta < -30 ? 'onScrollUp' : null
      if (dir) navigate(dir)
    }
    window.addEventListener('wheel', handleScroll, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: false })
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('wheel', handleScroll)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      document.body.style.overflow = '';
    }
  }, [current, navigate, stack])

  if (!scene || !stack.length) {
    return (
      <main>
        <p className="text-gray-400">Loading...</p>
      </main>
    )
  }

  const localized = current.frame.text?.find(
    (entry) => entry._key === params.lang
  )
  let next = null
  let nextLocalized = null
  if (nextIndex !== null) {
    next = stack[nextIndex]
    nextLocalized = next?.frame.text?.find((entry) => entry._key === params.lang)
  }

  return (
    <main style={{ position: 'relative', minHeight: '100vh', height: '100vh' }}>
      <h1 className="text-2xl font-bold mb-4">{scene.title}</h1>
      <div
        style={{
          position: 'relative',
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          touchAction: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* Current card: always absolutely positioned during animation, relative otherwise */}
        <div
          ref={cardRef}
          style={{
            position: isAnimating ? 'absolute' : 'relative',
            width: '100%',
            height: '100%',
            zIndex: 2,
            top: 0,
            left: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: isAnimating ? undefined : 'all 0.2s',
          }}
        >
          <div style={{ width: '100%', height: '100%' }}>
            <Card>
              {localized?.value ? (
                <PortableText value={localized.value} />
              ) : (
                <p className="italic text-gray-400">No {params.lang} translation.</p>
              )}
            </Card>
          </div>
        </div>
        {/* Next card for animation */}
        {isAnimating && next && (
          <div
            ref={nextCardRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: '100%', height: '100%' }}>
              <Card>
                {nextLocalized?.value ? (
                  <PortableText value={nextLocalized.value} />
                ) : (
                  <p className="italic text-gray-400">No {params.lang} translation.</p>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}