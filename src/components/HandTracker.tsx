import { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

export const HandTracker = ({ onGesture }: any) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  
  // ✨ 关键状态：记录"上一帧"是不是捏着的
  const lastState = useRef({ isPinching: false });

  useEffect(() => {
    let handLandmarker: HandLandmarker | null = null;
    let animationFrameId: number;

    const setup = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        
        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1,
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480, facingMode: "user" } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener("loadeddata", () => {
             setIsReady(true);
             predict();
          });
        }
      } catch (err) {
        console.error("Camera Error:", err);
      }
    };

    const predict = () => {
      if (videoRef.current && handLandmarker && videoRef.current.currentTime > 0) {
         const startTimeMs = performance.now();
         const result = handLandmarker.detectForVideo(videoRef.current, startTimeMs);
         
         if (result.landmarks && result.landmarks.length > 0) {
           const lm = result.landmarks[0];
           
           // --- 计算捏合距离 ---
           const dx = lm[4].x - lm[8].x;
           const dy = lm[4].y - lm[8].y;
           const dist = Math.sqrt(dx * dx + dy * dy);
           
           // ✨ 核心优化：粘性阈值 (Hysteresis) ✨
           let newIsPinching = lastState.current.isPinching;

           if (newIsPinching) {
             // 【状态 A：手里正抓着树】
             // 逻辑：想松手？没那么容易！必须张得很大才算松开。
             // 阈值设为 0.25 (约等于手掌张开一半)，防止手指微动导致误炸。
             if (dist > 0.25) { 
               newIsPinching = false; 
             }
           } else {
             // 【状态 B：手是张开的】
             // 逻辑：想抓树？只要稍微靠近一点就开始吸附。
             // 阈值设为 0.12，让你能轻松抓到。
             if (dist < 0.12) { 
               newIsPinching = true; 
             }
           }

           // --- 手指计数逻辑 ---
           let fingers = 0;
           if (lm[8].y < lm[6].y) fingers++;
           if (lm[12].y < lm[10].y) fingers++;
           if (lm[16].y < lm[14].y) fingers++;
           if (lm[20].y < lm[18].y) fingers++;
           if (Math.abs(lm[4].x - lm[2].x) > 0.05) fingers++;

           onGesture({
             isActive: true,
             x: 1 - lm[9].x,
             y: lm[9].y,
             isPinching: newIsPinching, // 输出稳定的状态
             fingerCount: fingers
           });
           
           lastState.current = { isPinching: newIsPinching };

         } else {
           onGesture({ isActive: false });
         }
      }
      animationFrameId = requestAnimationFrame(predict);
    };

    setup();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      if (handLandmarker) handLandmarker.close();
      cancelAnimationFrame(animationFrameId);
    };
  }, [onGesture]);

  return (
    <div className="relative w-full h-full bg-black/40">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted
        className="w-full h-full object-cover scale-x-[-1] opacity-60"
      />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};