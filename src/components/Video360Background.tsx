import { useEffect, useRef } from 'react';
import * as PANOLENS from 'panolens';

const Video360Background: React.FC = () => {
   const containerRef = useRef<HTMLDivElement>(null);
   // Use a development vs production path to handle different environments
   const videoPath = process.env.NODE_ENV === 'development' 
     ? 'http://localhost:3000/videos/20250418125205.mp4'  // Absolute URL for development
     : '/videos/20250418125205.mp4';  // Relative URL for production

  useEffect(() => {
    if (!containerRef.current) return;
    
    console.log('Loading video from:', videoPath);
    
    // Create a test video element to check if the video is accessible
    const testVideo = document.createElement('video');
    testVideo.src = videoPath;
    testVideo.muted = true;
    testVideo.load();
    
    testVideo.addEventListener('canplaythrough', () => {
      console.log('Video can play through, initializing panorama');
      initializePanorama();
    });
    
    testVideo.addEventListener('error', (e) => {
      console.error('Test video load error:', e);
    });
    
    function initializePanorama() {
      // Create the panorama with the video path - must be accessible!
      const panorama = new PANOLENS.VideoPanorama(videoPath);
      
      // Create viewer with minimal controls
      const viewer = new PANOLENS.Viewer({
        container: containerRef.current,
        autoRotate: false,
        controlBar: true,
        cameraFov: 75,
        output: 'console', // Enable console output for debugging
      });

      viewer.add(panorama);
      
      // Video playback handling with aggressive autoplay
      panorama.addEventListener('enter', () => {
        console.log('Panorama entered');
        const video = panorama.getVideo();
        console.log('Video element:', video);
        
        if (video) {
          // Set all video attributes for best playback
          video.muted = true;  // Mute to increase chances of autoplay
          video.loop = true;
          video.playsInline = true;
          video.crossOrigin = 'anonymous';
          
          // Force play with timeout to ensure DOM is ready
          setTimeout(() => {
            console.log('Attempting to play video');
            video.play()
              .then(() => console.log('Video playing successfully'))
              .catch((err: unknown) => {
                console.error('Video autoplay failed:', err);
                
                // Add click handler to entire document for best mobile compatibility
                const playOnAnyInteraction = () => {
                  console.log('User interaction detected, trying to play');
                  video.muted = false;  // Try to unmute after interaction
                  video.play()
                    .then(() => console.log('Video playing after interaction'))
                    .catch((e: unknown) => console.error('Play after interaction failed:', e));
                };
                
                window.addEventListener('click', playOnAnyInteraction, { once: true });
                window.addEventListener('touchstart', playOnAnyInteraction, { once: true });
              });
          }, 1000);
        }
      });
      
      // Fix pointerEvents issues with MutationObserver
      const observer = new MutationObserver(() => {
        fixPointerEvents();
      });
      
      function fixPointerEvents() {
        if (!containerRef.current) return;
        
        const elements = containerRef.current.querySelectorAll('*');
        elements.forEach(el => {
          if (el instanceof HTMLElement && el.style.pointerEvents === 'none') {
            console.log('Fixed pointer-events on element:', el);
            el.style.pointerEvents = 'auto';
          }
        });
      }
      
      if (containerRef.current) {
         observer.observe(containerRef.current, {
         attributes: true,
         attributeFilter: ['style'],
         childList: true,
         subtree: true
         });
      }
      
      // Initial fix
      fixPointerEvents();
      
      // Clean up on unmount
      return () => {
        observer.disconnect();
        viewer.dispose();
      };
    }
  }, [videoPath]);

  return (
    <div className="fixed inset-0 z-0">
      <div 
        ref={containerRef} 
        className="w-full h-full" 
        style={{ pointerEvents: 'auto' }}
      />
    </div>
  );
};

export default Video360Background;