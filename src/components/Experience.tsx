import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { InstancedTree } from './InstancedTree';
import { Star } from './Star';
import { PhotoGallery } from './PhotoGallery';
import { AppState, ColorTheme } from '../types';

export const Experience = ({ appState, colorTheme, gestureData, photos, onCanvasClick }: any) => {
  const isGold = colorTheme === ColorTheme.GOLD;
  const isBlue = colorTheme === ColorTheme.BLUE;
  const isPurple = colorTheme === ColorTheme.PURPLE;

  const getThemeColor = () => {
    if (isGold) return "#FFD700";
    if (isBlue) return "#00F0FF";
    if (isPurple) return "#BD00FF";
    return "#FFD1DC"; // Pink
  };

  return (
    <Canvas 
      shadows 
      dpr={[1, 2]} 
      gl={{ antialias: false, stencil: false, depth: true }} 
      onClick={onCanvasClick}
    >
      <PerspectiveCamera makeDefault position={[0, 6, 22]} fov={35} />
      <color attach="background" args={['#050103']} />
      
      <Suspense fallback={null}>
        <Environment preset="city" environmentIntensity={0.01} />
        
        <group position={[0, -5, 0]}>
          <InstancedTree appState={appState} colorTheme={colorTheme} gestureData={gestureData} />
          
          <PhotoGallery photos={photos} appState={appState} />
          
          <Star position={[0, 10.7, 0]} appState={appState} colorTheme={colorTheme} />
          
          <ContactShadows opacity={0.3} scale={40} blur={4} far={15} resolution={512} color="#000000" />
        </group>
        
        {/* 灯光配置 */}
        <spotLight position={[10, 20, 10]} angle={0.15} penumbra={1} intensity={isGold ? 8 : 5} castShadow color={getThemeColor()} />
        <spotLight position={[-15, 10, -10]} angle={0.3} penumbra={1} intensity={2.5} color="#FFB6C1" />
        <pointLight position={[0, -1, 10]} intensity={3} color={getThemeColor()} />

        {/* 后期处理 */}
        <EffectComposer enableNormalPass={false}>
          <Bloom 
            luminanceThreshold={0.15} 
            mipmapBlur 
            intensity={isGold || isBlue || isPurple ? 1.8 : 1.3} 
            radius={0.6} 
          />
          <Noise opacity={0.008} />
          <Vignette eskil={false} offset={0.08} darkness={1.1} />
        </EffectComposer>

        {/* ✨ 关键修改：解锁了 Zoom 和 Pan ✨ */}
        <OrbitControls 
          enablePan={true}  // 允许平移 (右键拖动)，可以看旁边的照片
          enableZoom={true} // 允许缩放 (滚轮)，可以拉近看细节
          minDistance={5}   // 最近只能拉到 5，防止穿模
          maxDistance={50}  // 最远只能拉到 50
          autoRotate={appState === AppState.TREE} // 只有在树模式下才自动旋转
          autoRotateSpeed={0.25} 
          makeDefault 
        />
      </Suspense>
    </Canvas>
  );
};