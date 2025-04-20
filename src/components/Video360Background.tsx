import { useEffect, useRef } from 'react';
import * as PANOLENS from 'panolens';

const Video360Background: React.FC<{ playbackId: string }> = ({ playbackId }) => {
   const containerRef = useRef<HTMLDivElement>(null)
 
   const videoPath = `https://stream.mux.com/${playbackId}.m3u8`  // use Mux streaming URL
 
   useEffect(() => {
     if (!containerRef.current) return;
 
     const testVideo = document.createElement('video')
     testVideo.src = videoPath
     testVideo.muted = true
     testVideo.load()
 
     testVideo.addEventListener('canplaythrough', () => {
       console.log('Video can play through, initializing panorama')
       initializePanorama()
     })
 
     testVideo.addEventListener('error', (e) => {
       console.error('Test video load error:', e)
     })
 
     function initializePanorama() {
       const panorama = new PANOLENS.VideoPanorama(videoPath)
       const viewer = new PANOLENS.Viewer({
         container: containerRef.current,
         autoRotate: false,
         controlBar: true,
         cameraFov: 75,
         output: 'console',
       })
 
       viewer.add(panorama)
 
       panorama.addEventListener('enter', () => {
         const video = panorama.getVideo()
         if (video) {
           video.muted = true
           video.loop = true
           video.playsInline = true
           video.crossOrigin = 'anonymous'
           setTimeout(() => {
             video.play().catch((err: unknown) => {
               console.error('Autoplay failed:', err)
               const playOnAnyInteraction = () => {
                 video.muted = false
                 video.play().catch((e: unknown) => console.error('Interaction play failed:', e))
               }
               window.addEventListener('click', playOnAnyInteraction, { once: true })
               window.addEventListener('touchstart', playOnAnyInteraction, { once: true })
             })
           }, 1000)
         }
       })
 
       const observer = new MutationObserver(() => fixPointerEvents())
 
       function fixPointerEvents() {
         const elements = containerRef.current?.querySelectorAll('*')
         elements?.forEach(el => {
           if (el instanceof HTMLElement && el.style.pointerEvents === 'none') {
             el.style.pointerEvents = 'auto'
           }
         })
       }
 
       if (containerRef.current) {
         observer.observe(containerRef.current, {
           attributes: true,
           attributeFilter: ['style'],
           childList: true,
           subtree: true,
         })
       }
 
       fixPointerEvents()
 
       return () => {
         observer.disconnect()
         viewer.dispose()
       }
     }
   }, [videoPath])
 
   return (
     <div className="fixed inset-0 z-0">
       <div ref={containerRef} className="w-full h-full" style={{ pointerEvents: 'auto' }} />
     </div>
   )
 }

 export default Video360Background