'use client'

import dynamic from 'next/dynamic'

// Dynamically import the actual video background
const Video360Background = dynamic(() => import('./Video360Background'), { ssr: false })

const ClientVideo360Wrapper = () => {
  return <Video360Background />
}

export default ClientVideo360Wrapper