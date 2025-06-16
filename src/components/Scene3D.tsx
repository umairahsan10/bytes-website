'use client';

import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber'
import { MeshTransmissionMaterial, useGLTF, Text, Environment } from "@react-three/drei";
import { useFrame, useThree } from '@react-three/fiber'
import { useRef, Suspense } from 'react'
import { GLTF } from 'three-stdlib'
import * as THREE from 'three'

type GLTFResult = GLTF & {
  nodes: {
    Torus002: THREE.Mesh
  }
}

const Model = () => {
    const { nodes } = useGLTF("/medias/torrus.glb") as GLTFResult;
    const { viewport } = useThree()
    const torus = useRef<THREE.Mesh>(null);
    
    useFrame(() => {
        if (torus.current) {
            torus.current.rotation.x += 0.02
        }
    })

    const materialProps = {
        thickness: 0.2,
        roughness: 0,
        transmission: 1,
        ior: 1.2,
        chromaticAberration: 0.02,
        backside: true,
        distortionScale: 0.1,
        temporalDistortion: 0.2
    }
    
    return (
        <group scale={viewport.width / 3.75}>
            <Text 
                font={'/fonts/PPNeueMontreal-Bold.otf'} 
                position={[0, 0, -1]} 
                fontSize={0.5} 
                color="white" 
                anchorX="center" 
                anchorY="middle"
                
            >
                Bytes Platform
            </Text>
            <mesh ref={torus} {...nodes.Torus002}>
                <MeshTransmissionMaterial {...materialProps}/>
            </mesh>
        </group>
    )
}

const Scene3DContent = () => {
    return (
        <Canvas style={{ background: 'transparent' }}>
            <Suspense fallback={null}>
                <Model />
                <directionalLight intensity={2} position={[0, 2, 3]}/>
                <Environment preset="city" />
            </Suspense>
        </Canvas>
    )
}

// Use dynamic import with no SSR
const Scene3D = dynamic(() => Promise.resolve(Scene3DContent), {
    ssr: false,
    loading: () => <div className="absolute inset-0 -z-10" />
})

export { Scene3D } 