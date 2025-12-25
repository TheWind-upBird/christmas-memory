import { useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Image, Text } from '@react-three/drei';
import * as THREE from 'three';
import { AppState } from '../types';

// ✨ 定义一些不会变的辅助向量，避免在循环里重复创建
const upVec = new THREE.Vector3(0, 1, 0);
const tempCamVec = new THREE.Vector3();
const tempRadialVec = new THREE.Vector3();
const tempCamTargetVec = new THREE.Vector3();
const finalLookAtVec = new THREE.Vector3();
const treeCenter = new THREE.Vector3(0, 0, 0);

interface PhotoGalleryProps {
  photos: string[];
  appState: AppState;
}

export const PhotoGallery = ({ photos, appState }: PhotoGalleryProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const textGroupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  
  const [focusIdx, setFocusIdx] = useState<number | null>(null);

  const daysCount = useMemo(() => {
    const start = new Date('2022-09-20').getTime();
    const now = new Date().getTime();
    return Math.floor((now - start) / (1000 * 60 * 60 * 24));
  }, []);

  const layout = useMemo(() => {
    const count = photos.length || 1;
    const goldenRatio = 1.61803398875;
    const goldenAngle = Math.PI * 2 * goldenRatio;

    return photos.map((_, i) => {
      // --- 1. 树上的位置 (斐波那契螺旋) ---
      const t = i / count; 
      const treeY = 6.5 - t * 12; 
      const treeRadius = 1.5 + (1 - (treeY + 5.5) / 12) * 4.5; 
      const treeTheta = i * goldenAngle;
      
      const treePos = new THREE.Vector3(
        Math.cos(treeTheta) * treeRadius,
        treeY,
        Math.sin(treeTheta) * treeRadius
      );
      
      // --- 2. 炸开的位置 (心形) ---
      const theta = i * goldenAngle;
      const rSpread = 0.6 + 0.4 * Math.sqrt((i + 1) / count);
      const xBase = 16 * Math.pow(Math.sin(theta), 3);
      const yBase = 13 * Math.cos(theta) - 5 * Math.cos(2 * theta) - 2 * Math.cos(3 * theta) - Math.cos(4 * theta);
      const scale = 0.85; 
      const zLayer = (i % 3) * 0.5;
      
      const viewPos = new THREE.Vector3(
        xBase * rSpread * scale, 
        (yBase * rSpread * scale) + 3.5, 
        14 - zLayer 
      );

      return { treePos, viewPos };
    });
  }, [photos]);

  const handlePhotoClick = (index: number, e: any) => {
    e.stopPropagation();
    if (focusIdx === index) setFocusIdx(null);
    else setFocusIdx(index);
  };

  const handleMiss = () => {
    if (focusIdx !== null) setFocusIdx(null);
  };

  useFrame((state) => {
    const isExplode = appState === AppState.EXPLODE;
    const hasFocus = focusIdx !== null;
    
    // ✨ 核心算法：计算相机角度混合因子 ✨
    // 1. 获取相机方向向量并归一化
    tempCamVec.copy(camera.position).normalize();
    // 2. 计算相机向量与向上向量的点积 (1=正上方俯视, 0=正侧面平视)
    const dot = tempCamVec.dot(upVec);
    // 3. 计算混合因子 t。
    // 我们希望：侧面看(dot=0)时 t=1，头顶看(dot=1)时 t=0。
    // 使用 Math.pow 让过渡更平滑，侧面效果保持得更久一点
    const blendFactor = Math.pow(1.0 - Math.abs(dot), 1.5);

    // 1. 照片动画
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        if (!layout[i]) return;

        const { treePos, viewPos } = layout[i];
        
        let target = isExplode ? viewPos : treePos;
        let targetScale = isExplode ? 2.2 : 1.4;
        const isFocused = focusIdx === i;

        if (isFocused) {
           target = new THREE.Vector3(0, 6, 16); 
           targetScale = 4.5; 
        } else if (hasFocus) {
           targetScale = 0.5; 
        }

        // 移动和缩放
        child.position.lerp(target, 0.08);
        const currentScale = child.scale.x;
        child.scale.setScalar(THREE.MathUtils.lerp(currentScale, targetScale, 0.08));

        // ✨✨✨ 旋转逻辑大重构 ✨✨✨
        if (isExplode || isFocused) {
          // 情况A: 炸开或聚焦时，始终简单地面向相机
          child.lookAt(camera.position); 
        } else {
          // 情况B: 在树上时，执行动态混合旋转算法
          
          // 目标1 (Radial): 之前的效果，水平背对树心向外看
          // 计算方法：取当前位置，Y轴设为树心高度，得到的向量就是水平向外的方向
          tempRadialVec.copy(child.position).setY(treeCenter.y);
          // 让目标点远离树心，形成朝向
          tempRadialVec.add(child.position); 

          // 目标2 (Billboard): 像挂牌一样面向相机，但保持垂直
          // 计算方法：取相机位置，但Y轴强制设为照片当前高度。这样看过去就是水平的。
          tempCamTargetVec.copy(camera.position).setY(child.position.y);

          // 混合: 在两个目标点之间根据 blendFactor 进行插值
          finalLookAtVec.lerpVectors(tempRadialVec, tempCamTargetVec, blendFactor);
          
          // 应用旋转
          child.lookAt(finalLookAtVec);
        }
      });
      
      // 整体旋转
      if (!isExplode && focusIdx === null) {
         groupRef.current.rotation.y += 0.001; 
      } else {
         groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.05);
      }
    }

    // 2. 文字动画
    if (textGroupRef.current) {
        const targetScale = (isExplode && focusIdx === null) ? 1 : 0;
        textGroupRef.current.scale.setScalar(
            THREE.MathUtils.lerp(textGroupRef.current.scale.x, targetScale, 0.05)
        );
        textGroupRef.current.position.y = 3.5 + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <>
      <group ref={groupRef} onClick={handleMiss}>
        {photos.map((url, i) => (
          <group 
            key={i} 
            onClick={(e) => handlePhotoClick(i, e)}
            visible={true}
          >
              <Image 
                url={url} 
                transparent 
                side={THREE.DoubleSide} 
                toneMapped={false} 
                color={focusIdx !== null && focusIdx !== i ? '#808080' : '#ffffff'}
              />
              <mesh position={[0, 0, -0.01]}>
                <planeGeometry args={[1.05, 1.05]} />
                <meshBasicMaterial 
                  color="#fff" 
                  transparent 
                  opacity={focusIdx === i ? 0.5 : 0.2} 
                />
              </mesh>
          </group>
        ))}
      </group>

      <group ref={textGroupRef} position={[0, 3.5, 14]}>
         <Text
            fontSize={0.5}
            color="#ffecf2"
            position={[0, 0.8, 0]}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#ff69b4"
         >
            LOVE ANNIVERSARY
         </Text>

         <Text
            fontSize={1.8}
            color="#fff"
            position={[0, -0.2, 0]}
            anchorX="center"
            anchorY="middle"
            characters="0123456789"
            outlineWidth={0.05}
            outlineColor="#ea58a8"
         >
            {daysCount}
         </Text>

         <Text
             fontSize={0.4}
             color="#ffecf2"
             position={[0, -1.2, 0]}
             anchorX="center"
             anchorY="middle"
             outlineWidth={0.01}
             outlineColor="#ff69b4"
         >
            DAYS WITH TONG
         </Text>
         
         <mesh position={[0, 0, -0.5]}>
            <circleGeometry args={[2.5, 32]} />
            <meshBasicMaterial color="#000" transparent opacity={0.4} />
         </mesh>
      </group>
    </>
  );
};