// src/components/ModelSonic.tsx

import { useRef, useEffect, useMemo } from 'react';
import { useGLTF, useAnimations, Center } from '@react-three/drei';
import * as THREE from 'three'; // <-- Impor three.js

import sonicModelPath from '../assets/sonic_forces_sonic_rig.glb';

function ModelSonic() {
  // Beri tipe spesifik <THREE.Group> dan nilai awal null
  // Tanda seru (!) di akhir memberitahu TS bahwa kita yakin ini tidak akan null saat digunakan
  const group = useRef<THREE.Group>(null!);
  
  const { scene, animations } = useGLTF(sonicModelPath);
  const { actions } = useAnimations(animations, group);

  // Langkah 1: Gunakan useMemo untuk memilih animasi acak HANYA SEKALI.
  const animationName = useMemo(() => {
    const animations_keys = Object.keys(actions);
    if (animations_keys.length > 0) {
      const random = Math.floor(Math.random() * animations_keys.length);
      return animations_keys[random];
    }
    return null; // Kembalikan null jika tidak ada animasi
  }, [actions]);

  // Langkah 2: Modifikasi useEffect untuk mengatur pose awal
  useEffect(() => {
    // Pastikan nama animasi sudah terpilih
    if (animationName) {
      // Hentikan semua animasi lain untuk memastikan state bersih
      Object.values(actions).forEach(action => action?.stop());

      // Ambil action dari animasi yang terpilih
      const action = actions[animationName];
      if (action) {
        // Mainkan lalu langsung jeda untuk membekukan di frame pertama
        action.play();
        action.paused = true;
      }
    }
  }, [actions, animationName]); // Tambahkan animationName sebagai dependensi

  const handleModelClick = () => {
    if (animationName) {
      console.log(`Memainkan animasi: ${animationName}`);
      const action = actions[animationName];
      if (action) {
        // Saat diklik, pastikan animasi tidak lagi dijeda dan mainkan dari awal.
        action.paused = false;
        action.reset().play();
      }
    }
  };

  return (
    <group ref={group} dispose={null} onClick={handleModelClick}>
        <Center>
            <primitive 
                object={scene} 
                scale={2} 
                position={[0, -2, 0]} 
            />
        </Center>
    </group>
  );
}

useGLTF.preload(sonicModelPath);

export default ModelSonic;