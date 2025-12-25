import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { AppState, ColorTheme } from '../types';

const LEAF_COUNT = 10000;
const GLINT_COUNT = 1200;
const SPACE_STAR_COUNT = 600;
const ORBIT_PARTICLE_COUNT = 3000;

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

export const InstancedTree = ({ appState, colorTheme, gestureData }: any) => {
  const leafRef = useRef<THREE.InstancedMesh>(null);
  const glintRef = useRef<THREE.InstancedMesh>(null);
  const spaceStarsRef = useRef<THREE.InstancedMesh>(null);
  const orbitRef = useRef<THREE.InstancedMesh>(null);
  const rotationGroup = useRef<THREE.Group>(null);

  // ✨ 颜色配置
  const colors = useMemo(() => ({
    leaf: {
      PINK: new THREE.Color("#FFD1DC"),
      GOLD: new THREE.Color("#FFD700"),
      BLUE: new THREE.Color("#00F0FF"),
      PURPLE: new THREE.Color("#BD00FF")
    },
    emissive: {
      PINK: new THREE.Color("#FFB2D0"),
      GOLD: new THREE.Color("#FFA500"),
      BLUE: new THREE.Color("#0066FF"),
      PURPLE: new THREE.Color("#6600FF")
    }
  }), []);

  // ✨ 粒子生成算法
  const data = useMemo(() => {
    // 1. 树叶 & 炸开目标
    const leafTargets = [];
    const leafRandoms = [];
    const explodeTargets = [];
    
    for (let i = 0; i < LEAF_COUNT; i++) {
      const height = Math.random() * 10;
      
      const radius = (1 - height / 10) * 4 * Math.pow(Math.random(), 0.6);
      const angle = Math.random() * Math.PI * 2;
      leafTargets.push(new THREE.Vector3(Math.cos(angle) * radius, height, Math.sin(angle) * radius));
      leafRandoms.push(Math.random());
      
      // 炸开位置 (球形分布)
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 18 + Math.random() * 25;
      explodeTargets.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      ));
    }

    // 2. 闪光点 (Glints)
    const glintTargets = [];
    for (let i = 0; i < GLINT_COUNT; i++) {
      const h = Math.random() * 9.8;
      const r = (1 - h / 10) * 3.8 * Math.pow(Math.random(), 0.35);
      const a = Math.random() * Math.PI * 2;
      glintTargets.push(new THREE.Vector3(Math.cos(a) * r, h, Math.sin(a) * r));
    }

    // 3. 螺旋轨道 (Orbits) - 3条旋臂
    const orbitData = [];
    for (let i = 0; i < ORBIT_PARTICLE_COUNT; i++) {
      const t = i / ORBIT_PARTICLE_COUNT;
      orbitData.push({
        t,
        drift: (Math.random() - 0.5) * 0.25,
        gap: 1.8 + Math.random() * 0.5,
        twinkle: Math.random() * Math.PI * 2,
        offsetY: (Math.random() - 0.5) * 0.15,
      });
    }

    // 4. 背景星空
    const spaceStarPositions = [];
    for (let i = 0; i < SPACE_STAR_COUNT; i++) {
      const r = 150 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      spaceStarPositions.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      ));
    }

    return { leafTargets, leafRandoms, explodeTargets, glintTargets, orbitData, spaceStarPositions };
  }, []);

  // 预计算位置数组 (性能优化)
  const currentPositions = useMemo(() => {
    const arr = new Float32Array((LEAF_COUNT + ORBIT_PARTICLE_COUNT) * 3);
    for (let i = 0; i < LEAF_COUNT; i++) {
      arr[i * 3] = data.leafTargets[i].x;
      arr[i * 3 + 1] = data.leafTargets[i].y;
      arr[i * 3 + 2] = data.leafTargets[i].z;
    }
    return arr;
  }, [data]);

  useFrame((state, delta) => {
    const isTree = appState === AppState.TREE;
    const time = state.clock.getElapsedTime();

    // 旋转逻辑
    if (rotationGroup.current) {
       rotationGroup.current.rotation.y += delta * 0.15;
       rotationGroup.current.rotation.x = THREE.MathUtils.lerp(rotationGroup.current.rotation.x, 0, 0.05);
    }

    // ------------------------------------
    // 1. 更新树叶 (Leaves)
    // ------------------------------------
    if (leafRef.current) {
        const leafMat = leafRef.current.material as THREE.MeshStandardMaterial;
        // 颜色平滑过渡
        const targetBase = colors.leaf[colorTheme as keyof typeof colors.leaf] || colors.leaf.PINK;
        const targetEmissive = colors.emissive[colorTheme as keyof typeof colors.emissive] || colors.emissive.PINK;
        leafMat.color.lerp(targetBase, 0.05);
        leafMat.emissive.lerp(targetEmissive, 0.05);

        const lerpSpeed = isTree ? 0.08 : 0.04;
        
        for (let i = 0; i < LEAF_COUNT; i++) {
            const target = isTree ? data.leafTargets[i] : data.explodeTargets[i];
            const idx = i * 3;
            
            // 位置插值
            currentPositions[idx] = THREE.MathUtils.lerp(currentPositions[idx], target.x, lerpSpeed);
            currentPositions[idx+1] = THREE.MathUtils.lerp(currentPositions[idx+1], target.y, lerpSpeed);
            currentPositions[idx+2] = THREE.MathUtils.lerp(currentPositions[idx+2], target.z, lerpSpeed);

            tempObject.position.set(currentPositions[idx], currentPositions[idx+1], currentPositions[idx+2]);
            
        
            const s = (0.008 + data.leafRandoms[i] * 0.01) * (isTree ? 1 : 1.5);
            tempObject.scale.setScalar(s);
            tempObject.updateMatrix();
            leafRef.current.setMatrixAt(i, tempObject.matrix);
        }
        leafRef.current.instanceMatrix.needsUpdate = true;
    }

    // ------------------------------------
    // 2. 更新螺旋 (Orbit)
    // ------------------------------------
    if (orbitRef.current) {
        const orbitPosStart = LEAF_COUNT * 3;
        for (let i = 0; i < ORBIT_PARTICLE_COUNT; i++) {
            const d = data.orbitData[i];
            const idx = orbitPosStart + i * 3;
            
            // 螺旋计算公式 (6 * PI = 3圈)
            const h = d.t * 10.5;
            const baseR = (1 - h / 10) * 4;
            const radius = baseR + d.gap;
            const angle = d.t * Math.PI * 6 + time * 0.5 + d.drift;
            
            const treePos = new THREE.Vector3(
                Math.cos(angle) * radius,
                h - 0.5 + d.offsetY,
                Math.sin(angle) * radius
            );
            
            // 炸开时跟随对应的叶子炸开方向
            const explodeTarget = data.explodeTargets[i % LEAF_COUNT].clone().multiplyScalar(1.2);
            const target = isTree ? treePos : explodeTarget;

            // 移动
            currentPositions[idx] = THREE.MathUtils.lerp(currentPositions[idx] || 0, target.x, 0.04);
            currentPositions[idx+1] = THREE.MathUtils.lerp(currentPositions[idx+1] || 0, target.y, 0.04);
            currentPositions[idx+2] = THREE.MathUtils.lerp(currentPositions[idx+2] || 0, target.z, 0.04);

            tempObject.position.set(currentPositions[idx], currentPositions[idx+1], currentPositions[idx+2]);
            
            // 闪烁大小
            const s = (0.012 + Math.sin(time * 4 + d.twinkle) * 0.005) * (isTree ? 1 : 1.8);
            tempObject.scale.setScalar(s);
            tempObject.updateMatrix();
            orbitRef.current.setMatrixAt(i, tempObject.matrix);
        }
        orbitRef.current.instanceMatrix.needsUpdate = true;
    }

    // ------------------------------------
    // 3. 更新闪光点 (Glints) - 那些特别亮的大点
    // ------------------------------------
    if (glintRef.current) {
        for (let i = 0; i < GLINT_COUNT; i++) {
            const target = isTree ? data.glintTargets[i] : data.explodeTargets[i % LEAF_COUNT];
            tempObject.position.set(target.x, target.y, target.z);
            
            // 呼吸闪烁
            const s = isTree ? (0.006 + Math.sin(time * 5 + i) * 0.006) : 0;
            tempObject.scale.setScalar(s);
            tempObject.updateMatrix();
            glintRef.current.setMatrixAt(i, tempObject.matrix);
        }
        glintRef.current.instanceMatrix.needsUpdate = true;
    }

    // 4. 背景星星 (简单旋转)
    if (spaceStarsRef.current) {
        for (let i = 0; i < SPACE_STAR_COUNT; i++) {
            const pos = data.spaceStarPositions[i];
            tempObject.position.set(pos.x, pos.y, pos.z);
            tempObject.scale.setScalar(0.04 + Math.sin(time * 0.3 + i) * 0.04);
            tempObject.updateMatrix();
            spaceStarsRef.current.setMatrixAt(i, tempObject.matrix);
        }
        spaceStarsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={rotationGroup}>
      {/* 1. 树叶：八面体，金属感，高发光 */}
      <instancedMesh ref={leafRef} args={[undefined, undefined, LEAF_COUNT]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial metalness={0.9} roughness={0.1} emissiveIntensity={6} />
      </instancedMesh>

      {/* 2. 闪光点：二十面体，纯白超高亮 */}
      <instancedMesh ref={glintRef} args={[undefined, undefined, GLINT_COUNT]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={20} />
      </instancedMesh>

      {/* 3. 螺旋轨道：球体，AdditiveBlending (叠加发光模式) */}
      <instancedMesh ref={orbitRef} args={[undefined, undefined, ORBIT_PARTICLE_COUNT]}>
        <sphereGeometry args={[1, 5, 5]} />
        <meshBasicMaterial 
            color="#FFFFFF" 
            transparent 
            opacity={0.8} 
            depthWrite={false} 
            blending={THREE.AdditiveBlending} 
        />
      </instancedMesh>

      {/* 4. 背景星星 */}
      <instancedMesh ref={spaceStarsRef} args={[undefined, undefined, SPACE_STAR_COUNT]}>
        <sphereGeometry args={[1, 4, 4]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.1} />
      </instancedMesh>
    </group>
  );
};