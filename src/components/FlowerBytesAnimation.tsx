'use client';
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

function TextLine() {
  const tubeRefs = useRef<(THREE.Mesh | null)[]>([])
  const sphereRefs = useRef<(THREE.Mesh | null)[]>([])

  // Use refs for animation values to prevent re-renders inside useFrame
  const scrollProgressRef = useRef(0)
  const targetProgressRef = useRef(0)

  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  const tubeRadius = useMemo(() => {
    return dimensions.width < 768 ? 0.2 : 0.4
  }, [dimensions.width])

  // "CACHE IN THE POINTS": The letter path data (the "points") is calculated 
  // only once here or when the window resizes, not on every frame.
  const letterCurves = useMemo(() => {
    let scale = dimensions.width < 768 ? 0.8 : 2.5 // Much larger scale
    
    const letterSpacing = 1 * scale // Increased spacing
    const lineHeight = 6 * scale // Increased line height
    const startX = 0 * scale // Adjusted start position
    const startY = -0.35 * scale
    
    const letters: THREE.CatmullRomCurve3[] = []
    
    // "b" - first letter
    let x = startX
    let y = startY
    const Points: THREE.Vector3[] = []
    // circle before b
    Points.push(new THREE.Vector3((x - 20) * scale, (y + 1) * scale, 0))
    Points.push(new THREE.Vector3((x - 7) * scale, (y + 1) * scale, 0))
    Points.push(new THREE.Vector3((x - 6.5) * scale, (y + 1.2) * scale, 0))
    Points.push(new THREE.Vector3((x - 6) * scale, (y + 2.5) * scale, 0))
    Points.push(new THREE.Vector3((x - 6.5) * scale, (y + 3.75) * scale, 0))
    Points.push(new THREE.Vector3((x - 6.9) * scale, (y + 4) * scale, 0))
    Points.push(new THREE.Vector3((x - 7.8) * scale, (y + 4) * scale, 0))
    Points.push(new THREE.Vector3((x - 9.1) * scale, (y + 2.8) * scale, 0))
    Points.push(new THREE.Vector3((x - 9.5) * scale, (y + 1) * scale, 0))
    Points.push(new THREE.Vector3((x - 8.8) * scale, (y - 0.2) * scale, 0))
    Points.push(new THREE.Vector3((x - 7.4) * scale, (y - 0.9) * scale, 0))
    Points.push(new THREE.Vector3((x - 6.6) * scale, (y - 0.8) * scale, 0))
    Points.push(new THREE.Vector3((x - 6.4) * scale, (y - 0.6) * scale, 0))
    // b line
    Points.push(new THREE.Vector3((x - 6) * scale, (y - 0.2) * scale, 0))
    Points.push(new THREE.Vector3((x - 4.5) * scale, (y + 4) * scale, 0))
    Points.push(new THREE.Vector3((x - 4) * scale, (y + 5) * scale, 0))
    // b upper part
    Points.push(new THREE.Vector3((x - 3.1) * scale, (y + 5.3) * scale, 0))
    // Points.push(new THREE.Vector3((x - 3) * scale, (y + 5.2) * scale, 0))
    Points.push(new THREE.Vector3((x - 2.5) * scale, (y + 4.9) * scale, 0))
    Points.push(new THREE.Vector3((x - 2.4) * scale, (y + 4.5) * scale, 0))
    Points.push(new THREE.Vector3((x - 2.5) * scale, (y + 4.1) * scale, 0))
    // Points.push(new THREE.Vector3((x - 3) * scale, (y + 4) * scale, 0))
    Points.push(new THREE.Vector3((x - 3.5) * scale, (y + 3.2) * scale, 0))
    Points.push(new THREE.Vector3((x - 5.1) * scale, (y + 2.6) * scale, 0))
    // b lower part
    Points.push(new THREE.Vector3((x - 4) * scale, (y + 2.7) * scale, 0))
    // Points.push(new THREE.Vector3((x - 3.8) * scale, (y + 2.72) * scale, 0))
    Points.push(new THREE.Vector3((x - 3.7) * scale, (y + 2.65) * scale, 0))
    Points.push(new THREE.Vector3((x - 2.8) * scale, (y + 2) * scale, 0))
    Points.push(new THREE.Vector3((x - 2.5) * scale, (y + 1.2) * scale, 0))
    // Points.push(new THREE.Vector3((x - 2.6) * scale, (y + 1.1) * scale, 0))
    Points.push(new THREE.Vector3((x - 2.55) * scale, (y + 1) * scale, 0))
    Points.push(new THREE.Vector3((x - 3) * scale, (y + 0) * scale, 0))
    Points.push(new THREE.Vector3((x - 4) * scale, (y - 1) * scale, 0))
    Points.push(new THREE.Vector3((x - 5.5) * scale, (y - 1.5) * scale, 0))
    // b lower round
    Points.push(new THREE.Vector3((x - 6.6) * scale, (y - 1) * scale, 0))
    Points.push(new THREE.Vector3((x - 6.8) * scale, (y - 0.8) * scale, 0))
    Points.push(new THREE.Vector3((x - 6.6) * scale, (y + 0.2) * scale, 0))
    Points.push(new THREE.Vector3((x - 5) * scale, (y + 0.8) * scale, 0))
    Points.push(new THREE.Vector3((x - 4.2) * scale, (y + 0.3) * scale, 0))
    Points.push(new THREE.Vector3((x - 3.4) * scale, (y - 1.2) * scale, 0))
    Points.push(new THREE.Vector3((x - 2.5) * scale, (y - 1) * scale, 0))
    // Points.push(new THREE.Vector3((x - 2) * scale, (y - 0.1) * scale, 0))
    
    // y upper part
    Points.push(new THREE.Vector3((x - 1.8) * scale, (y + 0) * scale, 0))
    Points.push(new THREE.Vector3((x - 1.4) * scale, (y + 1.2) * scale, 0))
    Points.push(new THREE.Vector3((x - 1.7) * scale, (y - 0) * scale, 0))
    Points.push(new THREE.Vector3((x - 1.6) * scale, (y - 0.9) * scale, 0))
    // Points.push(new THREE.Vector3((x - 1.5) * scale, (y - 0.8) * scale, 0))
    Points.push(new THREE.Vector3((x - 1.1) * scale, (y - 0.9) * scale, 0))
    // Points.push(new THREE.Vector3((x - 0.9) * scale, (y + 0.1) * scale, 0))
    Points.push(new THREE.Vector3((x - 0.2) * scale, (y + 1.2) * scale, 0))
    
    //y lower part
    Points.push(new THREE.Vector3((x - 1) * scale, (y - 1.1) * scale, 0))
    Points.push(new THREE.Vector3((x - 1.5) * scale, (y - 3) * scale, 0))
    Points.push(new THREE.Vector3((x - 1.9) * scale, (y - 4) * scale, 0))
    // Points.push(new THREE.Vector3((x - 2) * scale, (y - 4) * scale, 0))
    Points.push(new THREE.Vector3((x - 2.8) * scale, (y - 5) * scale, 0))
    Points.push(new THREE.Vector3((x - 3.5) * scale, (y - 4.8) * scale, 0))
    Points.push(new THREE.Vector3((x - 3.5) * scale, (y - 3.5) * scale, 0))
    Points.push(new THREE.Vector3((x - 2.8) * scale, (y - 2.5) * scale, 0))
    Points.push(new THREE.Vector3((x - 1) * scale, (y - 1.5) * scale, 0))

    // t line
    Points.push(new THREE.Vector3((x + 0.1) * scale, (y - 0.1) * scale, 0))
    Points.push(new THREE.Vector3((x + 0.6) * scale, (y + 1) * scale, 0))
    Points.push(new THREE.Vector3((x + 1) * scale, (y + 2) * scale, 0))
    Points.push(new THREE.Vector3((x + 2) * scale, (y + 4.8) * scale, 0))
    Points.push(new THREE.Vector3((x + 1.2) * scale, (y + 2) * scale, 0))
    Points.push(new THREE.Vector3((x + 0.9) * scale, (y + 1) * scale, 0))
    Points.push(new THREE.Vector3((x + 0.75) * scale, (y + 0) * scale, 0))
    Points.push(new THREE.Vector3((x + 1) * scale, (y - 0.8) * scale, 0))
    Points.push(new THREE.Vector3((x + 1.5) * scale, (y - 0.8) * scale, 0))

    // e line part
    Points.push(new THREE.Vector3((x + 1.9) * scale, (y - 0.5) * scale, 0))
    Points.push(new THREE.Vector3((x + 3) * scale, (y + 0.7) * scale, 0))
    Points.push(new THREE.Vector3((x + 3.4) * scale, (y + 1.4) * scale, 0))
    Points.push(new THREE.Vector3((x + 3.5) * scale, (y + 2) * scale, 0))
    // Points.push(new THREE.Vector3((x + 3.45) * scale, (y + 2.35) * scale, 0))
    // e curve part
    Points.push(new THREE.Vector3((x + 3.4) * scale, (y + 2.2) * scale, 0))
    Points.push(new THREE.Vector3((x + 2.9) * scale, (y + 2) * scale, 0))
    Points.push(new THREE.Vector3((x + 2.4) * scale, (y + 1) * scale, 0))
    Points.push(new THREE.Vector3((x + 2.3) * scale, (y + 0) * scale, 0))
    Points.push(new THREE.Vector3((x + 2.5) * scale, (y - 0.7) * scale, 0))
    Points.push(new THREE.Vector3((x + 3.1) * scale, (y - 0.6) * scale, 0))
    Points.push(new THREE.Vector3((x + 4.3) * scale, (y + 1) * scale, 0))

    // s part
    Points.push(new THREE.Vector3((x + 4.9) * scale, (y + 1.8) * scale, 0))
    Points.push(new THREE.Vector3((x + 5.4) * scale, (y + 2.4) * scale, 0))
    Points.push(new THREE.Vector3((x + 5.9) * scale, (y + 2.45) * scale, 0))
    Points.push(new THREE.Vector3((x + 6) * scale, (y + 2.1) * scale, 0))
    Points.push(new THREE.Vector3((x + 5.8) * scale, (y + 1.8) * scale, 0))
    Points.push(new THREE.Vector3((x + 6) * scale, (y + 2.1) * scale, 0))
    Points.push(new THREE.Vector3((x + 5.9) * scale, (y + 2.45) * scale, 0))
    Points.push(new THREE.Vector3((x + 5.4) * scale, (y + 2.4) * scale, 0))
    Points.push(new THREE.Vector3((x + 5.1) * scale, (y + 1.8) * scale, 0))
    Points.push(new THREE.Vector3((x + 5.5) * scale, (y + 1.5) * scale, 0))
    Points.push(new THREE.Vector3((x + 5.85) * scale, (y + 1) * scale, 0))
    Points.push(new THREE.Vector3((x + 5.9) * scale, (y + 0.3) * scale, 0))
    Points.push(new THREE.Vector3((x + 5.2) * scale, (y - 0.2) * scale, 0))
    Points.push(new THREE.Vector3((x + 4.8) * scale, (y - 0.2) * scale, 0))
    Points.push(new THREE.Vector3((x + 4.4) * scale, (y + 0) * scale, 0))
    Points.push(new THREE.Vector3((x + 4.43) * scale, (y + 0.6) * scale, 0))
    Points.push(new THREE.Vector3((x + 4.75) * scale, (y + 1) * scale, 0))
    
    letters.push(new THREE.CatmullRomCurve3(Points))
    
    const dPoints: THREE.Vector3[] = []
    dPoints.push(new THREE.Vector3((x + 6.9) * scale, (y + 0) * scale, 0))
    dPoints.push(new THREE.Vector3((x + 7) * scale, (y + 0.1) * scale, 0))
    
    letters.push(new THREE.CatmullRomCurve3(dPoints))
    
    const tPoints: THREE.Vector3[] = []
    tPoints.push(new THREE.Vector3((x + 0.5) * scale, (y + 3.5) * scale, 0))
    tPoints.push(new THREE.Vector3((x + 25.5) * scale, (y + 3.5) * scale, 0))
    
    letters.push(new THREE.CatmullRomCurve3(tPoints))
    
    return letters
  }, [dimensions.width])

  // Pre-compute overall x-bounds once so we can create a smooth gradient that spans the whole word
  const bounds = useMemo(() => {
    let minX = Infinity
    let maxX = -Infinity
    letterCurves.forEach(curve => {
      curve.getPoints(50).forEach(p => {
        if (p.x < minX) minX = p.x
        if (p.x > maxX) maxX = p.x
      })
    })
    return { minX, maxX }
  }, [letterCurves])

  const fullGeometries = useMemo(() => {
    const purple     = new THREE.Color('#8b5cf6')      // purple-500
    const pink       = new THREE.Color('#ec4899')      // pink-500

    return letterCurves.map(curve => {
      // High segment count for smooth reveal
      const geo = new THREE.TubeGeometry(curve, 1000, tubeRadius, 16, false)
      geo.setDrawRange(0, 0)

      // Build per-vertex gradient across global X axis
      const posAttr = geo.attributes.position as THREE.BufferAttribute
      const count = posAttr.count
      const colors: number[] = []

      const { minX, maxX } = bounds
      const range = maxX - minX || 1 // guard against zero

      for (let i = 0; i < count; i++) {
        const x = posAttr.getX(i)
        const t = (x - minX) / range // 0 → 1 across whole word

        let color: THREE.Color

        if (t < 0.5) {
          // Purple → Pink (first half)
          const f = t * 2 // 0..1
          color = purple.clone().lerp(pink, f)
        } else {
          // Pink → Purple (second half)
          const f = (t - 0.5) * 2 // 0..1
          color = pink.clone().lerp(purple, f)
        }

        colors.push(color.r, color.g, color.b)
      }

      geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
      return geo
    })
  }, [letterCurves, tubeRadius, bounds])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const section = document.getElementById('about-line')
      if (!section) return

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      // Match the 200% pin span
      end: '+=200%',
      scrub: true,
      onEnter: () => {
        // Reset any progress that may have accumulated before entering
        targetProgressRef.current = 0;
        scrollProgressRef.current = 0;
        fullGeometries.forEach(g => g.setDrawRange(0, 0));
      },
      onUpdate: (self: any) => {
        // Only advance while section is actively pinned
        if (self.isActive) {
          targetProgressRef.current = self.progress;
        }
      },
    })

    return () => {
      st.kill()
    }
  }, [])

  // State flag to start animation after delay
  const [animationStarted, setAnimationStarted] = useState(false)

  // Start animation after a short delay (e.g., 1.5s)
  useEffect(() => {
    const timer = setTimeout(() => setAnimationStarted(true), 2500)
    return () => clearTimeout(timer)
  }, [])

  // "DON'T DRAW IT AGAIN AND AGAIN": Inside the animation loop (useFrame),
  // we are NOT re-creating the geometry. We are just telling the GPU
  // "how much" of the pre-built, cached geometry to render using `setDrawRange`.
  // This is extremely fast and efficient.
  useFrame(() => {
    if (!animationStarted) return // wait for delay before drawing

    // Smaller lerp factor for smoother scrolling animation
    scrollProgressRef.current += (targetProgressRef.current - scrollProgressRef.current) * 0.08

    const totalLetters = letterCurves.length
    // Lower multiplier means letters reveal more slowly
    const revealMultiplier = 0.8

    // Apply 20% scroll delay: ignore first 20% of progress
    const effectiveScroll = Math.max(0, scrollProgressRef.current - 0.15) / 0.8 // 0 ->1 after 20%

    letterCurves.forEach((curve, letterIndex) => {
      const tubeRef = tubeRefs.current[letterIndex]
      const sphereRef = sphereRefs.current[letterIndex]
      const geom = fullGeometries[letterIndex]

      if (!tubeRef || !sphereRef || !geom) return

      const letterProgress = Math.max(0, Math.min(1,
        (effectiveScroll * totalLetters * (revealMultiplier + 0.1)) - letterIndex
      ))

      if (letterProgress > 0) {
        // This is the core optimization: just reveal part of the existing geometry.
        const indexCount = geom.index ? geom.index.count : 0
        const drawCount = Math.floor(indexCount * letterProgress)
        geom.setDrawRange(0, drawCount)
        tubeRef.visible = true

        const headPoint = curve.getPoint(letterProgress)
        sphereRef.position.copy(headPoint)
        sphereRef.visible = letterProgress > 0.02 // Prevents dot appearing too early
      } else {
        tubeRef.visible = false
        sphereRef.visible = false
      }
    })
  })
  
  // Cleanup geometries on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      fullGeometries.forEach(g => g.dispose())
    }
  }, [fullGeometries])

  return (
    <>
      {letterCurves.map((_, index) => (
        <React.Fragment key={`letter-${index}`}>
          <mesh
            ref={(ref) => { tubeRefs.current[index] = ref }}
            geometry={fullGeometries[index]}
            material={new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.85 })}
            visible={false}
          />
          <mesh
            ref={(ref) => { sphereRefs.current[index] = ref }}
            position={[0, 0, 0]}
            visible={false}
          >
            <sphereGeometry args={[tubeRadius * 1.5, 16, 16]} />
            <meshBasicMaterial color="#ec4899" transparent opacity={0.85} />
          </mesh>
        </React.Fragment>
      ))}
    </>
  )
}

function FlowerBytesAnimation() {
  return (
    <div style={{ 
      position: 'absolute', 
      top: '10vh', 
      left: 0, 
      width: '100%', 
      height: '90vh', 
      zIndex: -1,
      background: 'transparent'
    }}>
      <Canvas camera={{ position: [0, 0, 25] }}>
        <TextLine />
        <EffectComposer>
          <Bloom 
            intensity={2.5} 
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

export default FlowerBytesAnimation