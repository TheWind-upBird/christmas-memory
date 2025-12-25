import { useState, useRef, useEffect, useCallback } from 'react';
import { Experience } from './components/Experience';
import { Overlay } from './components/Overlay';
import { HandTracker } from './components/HandTracker';
import { AppState, ColorTheme } from './types';

function App() {
  const [started, setStarted] = useState(false);
  const [treeState, setTreeState] = useState<AppState>(AppState.TREE);
  const [colorTheme, setColorTheme] = useState<ColorTheme>(ColorTheme.PINK);
  const [isMuted, setIsMuted] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [gestureMode, setGestureMode] = useState(true);
  
  // ✨ 播放列表逻辑 ✨
  // 1. 默认歌单 (Jingle Bells)
  const [playlist, setPlaylist] = useState<string[]>(["https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kevin_MacLeod/Jazz_Sampler/Kevin_MacLeod_-_Jingle_Bells.mp3?v=2"]);
  // 2. 当前播放的索引
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const [gestureData, setGestureData] = useState({ 
    isActive: false, x: 0.5, y: 0.5, isPinching: false, fingerCount: 0 
  });

  const audioRef = useRef<HTMLAudioElement>(null);

  // 监听索引变化，自动切歌
  useEffect(() => {
    if (started && audioRef.current) {
        audioRef.current.src = playlist[currentTrackIndex];
        audioRef.current.play().catch(e => console.log("Auto play next failed", e));
    }
  }, [currentTrackIndex, playlist, started]);

  // 监听静音
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleGesture = useCallback((data: any) => {
    setGestureData(data);
    if (data.isActive) {
      if (data.isPinching) {
         setTreeState(AppState.TREE);
      } else {
         setTreeState(AppState.EXPLODE);
      }
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setColorTheme(prev => {
      if (prev === ColorTheme.PINK) return ColorTheme.GOLD;
      if (prev === ColorTheme.GOLD) return ColorTheme.BLUE;
      if (prev === ColorTheme.BLUE) return ColorTheme.PURPLE;
      return ColorTheme.PINK;
    });
  }, []);

  const handlePhotosUploaded = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  // ✨ 多首音乐上传 ✨
  const handleMusicUploaded = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // 把所有文件转成 URL
      const newMusicUrls = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      
      // 替换整个播放列表
      setPlaylist(newMusicUrls);
      // 重置到第一首
      setCurrentTrackIndex(0);
      setIsMuted(false); // 贴心解除静音
      
      console.log("Uploaded songs:", newMusicUrls.length);
    }
  };
  
  // ✨ 自动播放下一首 ✨
  const handleTrackEnded = () => {
    setCurrentTrackIndex(prev => {
      // 循环逻辑：如果是最后一首，就回到 0，否则 +1
      return (prev + 1) % playlist.length;
    });
  };

  const toggleState = () => {
    setTreeState(prev => prev === AppState.TREE ? AppState.EXPLODE : AppState.TREE);
  };

  const handleStart = () => {
    setStarted(true);
    setGestureMode(true);
    
    // 初次播放
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.src = playlist[0]; // 确保加载第一首
      audioRef.current.play().catch(error => {
        console.error("Audio play failed:", error);
      });
    }
  };

  return (
    <div className="w-full h-screen relative bg-[#010001] overflow-hidden select-none font-sans">
      
      {/* ✨ 播放器：去掉了 loop 属性，改用 onEnded 处理列表循环 ✨ */}
      <audio 
        ref={audioRef} 
        onEnded={handleTrackEnded} // 这一步很关键
        preload="auto"
        crossOrigin="anonymous"
      />

      <Experience 
        appState={treeState} 
        colorTheme={colorTheme}
        gestureData={gestureData}
        photos={photos} 
        onCanvasClick={() => {}} 
      />

      <Overlay 
        started={started}
        setStarted={handleStart}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        appState={treeState}
        colorTheme={colorTheme}
        gestureMode={gestureMode}
        setGestureMode={setGestureMode}
        gestureData={gestureData}
        onPhotosUploaded={handlePhotosUploaded}
        onMusicUploaded={handleMusicUploaded}
        photoCount={photos.length}
        onToggleState={toggleState} 
        onToggleTheme={toggleTheme}
      />
      
      {started && gestureMode && (
        <div className="fixed bottom-10 right-10 w-48 h-36 rounded-3xl overflow-hidden border border-white/10 shadow-2xl z-40 bg-black/40 backdrop-blur-md">
           <HandTracker onGesture={handleGesture} />
           <div className="absolute bottom-2 left-0 w-full text-center pointer-events-none">
              <p className={`text-[9px] tracking-widest uppercase font-bold ${gestureData.isActive ? (gestureData.isPinching ? "text-green-400" : "text-pink-400") : "text-white/30"}`}>
                {gestureData.isActive ? (gestureData.isPinching ? "● HOLDING" : "○ RELEASED") : "NO HAND"}
              </p>
           </div>
        </div>
      )}
    </div>
  );
}

export default App;