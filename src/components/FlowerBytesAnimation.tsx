'use client';
import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface TextLineProps {
  isVisible?: boolean
  prefersReducedMotion?: boolean
}

function TextLine({ isVisible = true, prefersReducedMotion = false }: TextLineProps) {
  const tubeRefs = useRef<(THREE.Mesh | null)[]>([])
  const sphereRefs = useRef<(THREE.Mesh | null)[]>([])

  // Use refs for animation values to prevent re-renders inside useFrame
  const scrollProgressRef = useRef(0)
  const targetProgressRef = useRef(0)
  const lastProgressRef = useRef(0) // Track if progress changed

  // Update visibility ref when prop changes
  useEffect(() => {
    // Note: visibility check happens in useFrame via isVisible prop
  }, [isVisible])

  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  const tubeRadius = useMemo(() => {
    return dimensions.width < 768 ? 0.2 : 0.4
  }, [dimensions.width])

  // Dynamic segment count based on device capability
  const segmentCount = useMemo(() => {
    if (dimensions.width < 768) {
      // Check for low-end mobile devices
      const isLowEnd = typeof navigator !== 'undefined' && 
        (navigator.hardwareConcurrency <= 4 || /budget|lite/i.test(navigator.userAgent))
      return isLowEnd ? 400 : 600
    }
    return 1000 // Desktop gets full quality
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
    const purple     = new THREE.Color('#F6C324')     
    const pink       = new THREE.Color('#F6C324')    

    return letterCurves.map(curve => {
      // Dynamic segment count for performance
      const geo = new THREE.TubeGeometry(curve, segmentCount, tubeRadius, 16, false)
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
  }, [letterCurves, tubeRadius, bounds, segmentCount])

  // Memoized tube material to prevent recreation every frame
  const tubeMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({ 
      vertexColors: true, 
      transparent: true, 
      opacity: 0.85 
    })
  }, [])

  // Memoized sphere materials to prevent recreation
  const sphereMaterials = useMemo(() => {
    return letterCurves.map(() => 
      new THREE.MeshBasicMaterial({ 
        color: '#F6C324', 
        transparent: true, 
        opacity: 0.85 
      })
    )
  }, [letterCurves.length])

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
  }, [fullGeometries])

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
    // Skip animation if not visible or not started
    if (!animationStarted || !isVisible) return

    // Skip calculations if progress hasn't changed significantly
    const progressDelta = Math.abs(targetProgressRef.current - lastProgressRef.current)
    if (progressDelta < 0.001 && scrollProgressRef.current === targetProgressRef.current) {
      return
    }
    lastProgressRef.current = targetProgressRef.current

    // Use instant reveal for reduced motion, smoother lerp for normal
    const lerpFactor = prefersReducedMotion ? 0.3 : 0.08
    scrollProgressRef.current += (targetProgressRef.current - scrollProgressRef.current) * lerpFactor

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
  
  // Cleanup geometries and materials on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      fullGeometries.forEach(g => g.dispose())
      tubeMaterial.dispose()
      sphereMaterials.forEach(m => m.dispose())
    }
  }, [fullGeometries, tubeMaterial, sphereMaterials])

  return (
    <>
      {letterCurves.map((_, index) => (
        <React.Fragment key={`letter-${index}`}>
          <mesh
            ref={(ref) => { tubeRefs.current[index] = ref }}
            geometry={fullGeometries[index]}
            material={tubeMaterial}
            visible={false}
          />
          <mesh
            ref={(ref) => { sphereRefs.current[index] = ref }}
            position={[0, 0, 0]}
            visible={false}
          >
            <sphereGeometry args={[tubeRadius * 1.5, 16, 16]} />
            <primitive object={sphereMaterials[index]} attach="material" />
          </mesh>
        </React.Fragment>
      ))}
    </>
  )
}

function FlowerBytesAnimation() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
  })

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Viewport visibility detection for performance
  useEffect(() => {
    if (!canvasRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        rootMargin: '100px', // Start animating slightly before visible
      }
    )

    observer.observe(canvasRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div 
      ref={canvasRef}
      style={{ 
        position: 'absolute', 
        top: '10vh', 
        left: 0, 
        width: '100%', 
        height: '90vh', 
        zIndex: -1,
        background: 'transparent'
      }}>
      <Canvas camera={{ position: [0, 0, 25] }}>
        <TextLine isVisible={isVisible} prefersReducedMotion={prefersReducedMotion} />
        <EffectComposer>
          <Bloom 
            intensity={dimensions.width < 768 ? 2.0 : 2.5}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

export default FlowerBytesAnimation