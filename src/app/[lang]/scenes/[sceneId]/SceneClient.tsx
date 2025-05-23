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
  const [animDirection, setAnimDirection] = useState<'onSwipeUp' | 'onSwipeDown' | 'onSwipeLeft' | 'onSwipeRight' | null>(null)
  const touchStartY = useRef<number | null>(null)
  const touchStartX = useRef<number | null>(null)
  const current = stack[currentIndex]
  const scrollLockRef = useRef(false)
  const lastScrollTime = useRef(0)
  const cardRef = useRef<HTMLDivElement>(null)
  const nextCardRef = useRef<HTMLDivElement>(null)
  // Mouse swipe state
  const mouseStartX = useRef<number | null>(null)
  const mouseStartY = useRef<number | null>(null)
  const mouseDragging = useRef(false)

  // Animate transition between cards
  const animateTransition = useCallback(
    (dir: 'onSwipeUp' | 'onSwipeDown' | 'onSwipeLeft' | 'onSwipeRight', targetIndex: number) => {
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
    let gsapPropsOut, gsapPropsIn;
    if (animDirection === 'onSwipeUp') {
      // Reverse: up now animates as down
      gsapPropsOut = { y: 60, opacity: 0 };
      gsapPropsIn = { y: -60, opacity: 0 };
    } else if (animDirection === 'onSwipeDown') {
      // Reverse: down now animates as up
      gsapPropsOut = { y: -60, opacity: 0 };
      gsapPropsIn = { y: 60, opacity: 0 };
    } else if (animDirection === 'onSwipeLeft') {
      gsapPropsOut = { x: -120, opacity: 0 };
      gsapPropsIn = { x: 120, opacity: 0 };
    } else if (animDirection === 'onSwipeRight') {
      gsapPropsOut = { x: 120, opacity: 0 };
      gsapPropsIn = { x: -120, opacity: 0 };
    }
    gsap.set(nextCardRef.current, {
      ...gsapPropsIn,
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
    gsap.to(cardRef.current, {
      ...gsapPropsOut,
      duration: 0.4,
      onComplete: () => {
        gsap.to(nextCardRef.current, {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 0.4,
          onComplete: () => {
            // Hide the previous card immediately after animation
            if (cardRef.current) {
              cardRef.current.style.visibility = 'hidden';
            }
            setTimeout(() => {
              setCurrentIndex(nextIndex)
              setIsAnimating(false)
              setNextIndex(null)
              setAnimDirection(null)
              // Reset transforms
              if (cardRef.current) gsap.set(cardRef.current, { clearProps: 'all', visibility: '' })
              if (nextCardRef.current) gsap.set(nextCardRef.current, { clearProps: 'all' })
            }, 0)
          },
        })
      },
    })
  }, [isAnimating, nextIndex, animDirection])

  // Navigation logic
  type AnimDir = 'onSwipeUp' | 'onSwipeDown' | 'onSwipeLeft' | 'onSwipeRight';
  const navigate = useCallback(
    (eventName: AnimDir) => {
			console.log('navigate', eventName)
      if (isAnimating) return
      // Reverse mapping for up/down
      const animDirToStandardEvent: Record<AnimDir, string> = {
        onSwipeUp: 'onScrollDown',
        onSwipeDown: 'onScrollUp',
        onSwipeLeft: 'onSwipeLeft',
        onSwipeRight: 'onSwipeRight',
      }
      // Try both mapped and original event names for compatibility
      const possibleEvents = [animDirToStandardEvent[eventName], eventName]
      const trigger = current?.triggers?.find(
        t => possibleEvents.includes(t.standardEvent)
      )
      const targetId = trigger?.goTo?._id
      const targetIndex = stack.findIndex(f => f.frame._id === targetId)
      if (targetIndex !== -1 && targetIndex !== currentIndex) {
        animateTransition(eventName, targetIndex)
      }
    },
    [current, stack, currentIndex, animateTransition, isAnimating]
  )

  // Scroll, swipe, and mouse gesture logic
  useEffect(() => {
    if (!current) return
    const handleScroll = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now()
      if (Math.abs(e.deltaY) < 10) return
      if (scrollLockRef.current && now - lastScrollTime.current < 400) return
      const dir = e.deltaY > 0 ? 'onSwipeDown' : 'onSwipeUp'
      lastScrollTime.current = now
      scrollLockRef.current = true
      navigate(dir)
      setTimeout(() => {
        scrollLockRef.current = false
      }, 400)
    }
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      touchStartY.current = e.touches[0].clientY
      touchStartX.current = e.touches[0].clientX
    }
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      const startY = touchStartY.current
      const endY = e.changedTouches[0].clientY
      const startX = touchStartX.current
      const endX = e.changedTouches[0].clientX
      if (startY === null || startX === null) return
      const deltaY = endY - startY
      const deltaX = endX - startX
      let dir: AnimDir | null = null
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        if (deltaY < -30) dir = 'onSwipeUp'
        else if (deltaY > 30) dir = 'onSwipeDown'
      } else {
        if (deltaX < -30) dir = 'onSwipeLeft'
        else if (deltaX > 30) dir = 'onSwipeRight'
      }
      if (dir) navigate(dir)
    }
    // Mouse gesture handlers for desktop swipe left/right
    const handleMouseDown = (e: MouseEvent) => {
      // Only left mouse button
      if (e.button !== 0) return
      mouseStartX.current = e.clientX
      mouseStartY.current = e.clientY
      mouseDragging.current = true
    }
    const handleMouseUp = (e: MouseEvent) => {
      if (!mouseDragging.current || mouseStartX.current === null || mouseStartY.current === null) return
      const deltaX = e.clientX - mouseStartX.current
      const deltaY = e.clientY - mouseStartY.current
      let dir: AnimDir | null = null
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
        if (deltaX < 0) dir = 'onSwipeLeft'
        else dir = 'onSwipeRight'
      }
      if (dir) navigate(dir)
      mouseDragging.current = false
      mouseStartX.current = null
      mouseStartY.current = null
    }
    const handleMouseLeave = () => {
      mouseDragging.current = false
      mouseStartX.current = null
      mouseStartY.current = null
    }
    // Attach listeners
    window.addEventListener('wheel', handleScroll, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: false })
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mouseleave', handleMouseLeave)
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('wheel', handleScroll)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mouseleave', handleMouseLeave)
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