import { useEffect, useRef } from 'react';
import * as PANOLENS from 'panolens';

const Video360Background: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const panorama = new PANOLENS.VideoPanorama('/videos/20250418125205.mp4')

    const viewer = new PANOLENS.Viewer({
      container: containerRef.current,
      autoRotate: true,
      autoRotateSpeed: 0.2,
      controlBar: false,
    })

    viewer.add(panorama)


    return () => {
      viewer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default Video360Background;