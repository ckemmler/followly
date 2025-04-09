'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LANGUAGES } from '@/utils/languages'

export default function RedirectHomePage() {
  const router = useRouter()

  useEffect(() => {
    const preferred = navigator.language.slice(0, 2)
    const lang = LANGUAGES.includes(preferred) ? preferred : 'en'
    router.replace(`/${lang}`)
  }, [router])

  return (
    <main className="flex items-center justify-center min-h-screen">
      <p>Redirecting to your language...</p>
    </main>
  )
}