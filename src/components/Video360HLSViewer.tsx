// This component renders a 360-degree video using Three.js and hls.js
// It supports Mux's .m3u8 streaming format and works across all major browsers

'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import Hls from 'hls.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const Video360HLSViewer: React.FC<{ playbackId: string }> = ({ playbackId }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // === Setup renderer ===
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

    // === Setup scene ===
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.set(0, 0, 0.1) // Just inside the sphere

    // === Setup video ===
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.setAttribute('webkit-playsinline', 'true')
    video.preload = 'auto'

    const videoUrl = `https://stream.mux.com/${playbackId}.m3u8`

    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(videoUrl)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(console.error)
      })
    } else {
      video.src = videoUrl
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(console.error)
      })
    }

    // === Create video texture ===
    const texture = new THREE.VideoTexture(video)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.format = THREE.RGBFormat

    const geometry = new THREE.SphereGeometry(500, 60, 40)
    geometry.scale(-1, 1, 1) // Invert the sphere to view from inside

    const material = new THREE.MeshBasicMaterial({ map: texture })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // === Animate ===
    const animate = () => {
      requestAnimationFrame(animate)
      // mesh.rotation.y += 0.0005 // Subtle auto-rotation
      renderer.render(scene, camera)
    }
    animate()
   

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableZoom = false
    controls.enablePan = false
    
    // === Cleanup ===
    return () => {
      video.pause()
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [playbackId])

  return <div ref={containerRef} className="fixed inset-0 z-0 w-full h-full" />
}

export default Video360HLSViewer
