// Ganti seluruh isi file ModelViewer.tsx dengan kode ini

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Hapus semua kode lain yang tidak perlu dari file ini.
// Cukup gunakan komponen sederhana ini sebagai "panggung".

const ModelViewer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '500px', cursor: 'grab' }}>
      <Canvas
        shadows
        frameloop="demand"
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        {/* Pencahayaan dari lingkungan sekitar, sangat penting untuk warna PBR */}
        <Environment preset="sunset" />
        {/* Sedikit cahaya tambahan agar tidak ada bagian yang terlalu gelap */}
        <ambientLight intensity={0.3} />
        
        <ContactShadows 
          position={[0, -1, 0]} 
          opacity={0.75} 
          scale={10} 
          blur={2.5} 
        />
        
        <Suspense fallback={null}>
            {/* <Bounds fit margin={1.7}> */}
                {children}

            {/* </Bounds> */}
        </Suspense>

        {/* Gunakan OrbitControls standar yang mengizinkan rotasi dan zoom */}
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default ModelViewer;