import { ReactNode } from 'react'

export default function Card({ children }: { children: ReactNode }) {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
      <div className="max-w-3xl text-center text-xl leading-relaxed">
        {children}
      </div>
    </div>
  )
}