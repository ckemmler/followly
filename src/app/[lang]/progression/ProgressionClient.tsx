'use client'

import Card from '@/components/Card'
import { Trigger } from '@/types/followly'
import { PortableText } from '@portabletext/react'
import { Frame, Scene } from '@sanity-types'
import { useCallback, useEffect, useRef, useState } from 'react'

type Props = {
	scene: Scene
	stack: Array<{ frame: Frame; triggers: Array<Trigger> }>
	params: {
		lang: string
	}
}

export default function ProgressionClient({ params, scene, stack }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const touchStartY = useRef<number | null>(null)
  const current = stack[currentIndex]
	const scrollLockRef = useRef(false)
	const lastScrollTime = useRef(0)

	const navigate = useCallback((eventName: string) => {
		const trigger = current?.triggers?.find(t => t.standardEvent === eventName)
		const targetId = trigger?.goTo?._id
		const targetIndex = stack.findIndex(f => f.frame._id === targetId)
		if (targetIndex !== -1) {
			setCurrentIndex(targetIndex)
		}
	}, [current, stack])

	useEffect(() => {
		if (!current) return
	
		const handleScroll = (e: WheelEvent) => {
			const now = Date.now()
	
			// Small delta → ignore noise
			if (Math.abs(e.deltaY) < 10) return
	
			// Momentum/lock check
			if (scrollLockRef.current && now - lastScrollTime.current < 400) return
	
			const dir = e.deltaY > 0 ? 'onScrollDown' : 'onScrollUp'
			lastScrollTime.current = now
			scrollLockRef.current = true
	
			navigate(dir)
	
			// Re-enable scroll after delay
			setTimeout(() => {
				scrollLockRef.current = false
			}, 400)
		}
	
		// Touch logic remains the same
		const handleTouchStart = (e: TouchEvent) => {
			touchStartY.current = e.touches[0].clientY
		}
	
		const handleTouchEnd = (e: TouchEvent) => {
			const start = touchStartY.current
			const end = e.changedTouches[0].clientY
			if (start === null) return
	
			const delta = start - end
			const dir = delta > 30 ? 'onScrollDown' : delta < -30 ? 'onScrollUp' : null
			if (dir) navigate(dir)
		}
	
		window.addEventListener('wheel', handleScroll)
		window.addEventListener('touchstart', handleTouchStart)
		window.addEventListener('touchend', handleTouchEnd)
	
		return () => {
			window.removeEventListener('wheel', handleScroll)
			window.removeEventListener('touchstart', handleTouchStart)
			window.removeEventListener('touchend', handleTouchEnd)
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

	return (
    <main>
      <h1 className="text-2xl font-bold mb-4">{scene.title}</h1>
      <Card key={current.frame._id}>
        {localized?.value ? (
          <PortableText value={localized.value} />
        ) : (
          <p className="italic text-gray-400">No {params.lang} translation.</p>
        )}
      </Card>
    </main>
  )
}