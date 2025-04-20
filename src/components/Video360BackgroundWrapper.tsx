'use client'

import dynamic from 'next/dynamic'

const Video360Background = dynamic(() => import('./Video360Background'), { ssr: false })

const ClientVideo360Wrapper = ({ playbackId }: { playbackId: string }) => {
  return <Video360Background playbackId={playbackId} />
}

export default ClientVideo360Wrapper