import { useEffect, useRef } from 'react';
import * as PANOLENS from 'panolens';
import Hls from 'hls.js'

const Video360Background: React.FC<{ playbackId: string }> = ({ playbackId }) => {
   const containerRef = useRef<HTMLDivElement>(null)

   useEffect(() => {
     if (!containerRef.current) return;

     const videoElement = document.createElement('video');
     videoElement.crossOrigin = 'anonymous';
     videoElement.muted = true;
     videoElement.loop = true;
     videoElement.playsInline = true;
     videoElement.setAttribute('webkit-playsinline', 'true');
     videoElement.style.display = 'none';

     document.body.appendChild(videoElement);
     
     const videoPath = `https://stream.mux.com/${playbackId}.m3u8`;

     if (Hls.isSupported()) {
       const hls = new Hls();
       hls.loadSource(videoPath);
       hls.attachMedia(videoElement);
       hls.on(Hls.Events.MANIFEST_PARSED, () => {
         initializePanorama(videoElement);
         videoElement.play().catch(console.error);
       });
     } else {
       videoElement.src = videoPath;
       videoElement.addEventListener('loadedmetadata', () => {
         initializePanorama(videoElement);
         videoElement.play().catch(console.error);
       });
     }

     function initializePanorama(video: HTMLVideoElement) {
       const panorama = new PANOLENS.VideoPanorama(video);
       const viewer = new PANOLENS.Viewer({
         container: containerRef.current!,
         autoRotate: false,
         controlBar: true,
         cameraFov: 75,
         output: 'console',
       });

       viewer.add(panorama);

       const observer = new MutationObserver(() => fixPointerEvents());

       function fixPointerEvents() {
         const elements = containerRef.current?.querySelectorAll('*');
         elements?.forEach(el => {
           if (el instanceof HTMLElement && el.style.pointerEvents === 'none') {
             el.style.pointerEvents = 'auto';
           }
         });
       }

       if (containerRef.current) {
         observer.observe(containerRef.current, {
           attributes: true,
           attributeFilter: ['style'],
           childList: true,
           subtree: true,
         });
       }

       fixPointerEvents();

       panorama.addEventListener('enter', () => {
         videoElement.muted = true;
         videoElement.loop = true;
         setTimeout(() => {
            videoElement.play().catch(err => {
            console.error(err);
             const playOnAnyInteraction = () => {
               videoElement.muted = false;
               videoElement.play().catch(console.error);
             };
             window.addEventListener('click', playOnAnyInteraction, { once: true });
             window.addEventListener('touchstart', playOnAnyInteraction, { once: true });
           });
         }, 1000);
       });

       return () => {
         observer.disconnect();
         viewer.dispose();
         videoElement.remove();
      };
     }
   }, [playbackId]);

   return (
     <div className="fixed inset-0 z-0">
       <div ref={containerRef} className="w-full h-full" style={{ pointerEvents: 'auto' }} />
     </div>
   )
 }

 export default Video360Background