import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Hand, MousePointer2, Wand2, Fingerprint, Upload, Image as ImageIcon, Palette, Camera, CameraOff, Music } from 'lucide-react';
import { AppState, ColorTheme } from '../types';

interface OverlayProps {
  started: boolean;
  setStarted: (v: boolean) => void;
  isMuted: boolean;
  setIsMuted: (v: boolean) => void;
  appState: AppState;
  gestureMode: boolean;
  setGestureMode: (v: boolean) => void;
  gestureData: any;
  onPhotosUploaded: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMusicUploaded: (e: React.ChangeEvent<HTMLInputElement>) => void;
  photoCount: number;
  onToggleState: () => void;
  onToggleTheme: () => void;
  colorTheme: ColorTheme;
}

export const Overlay = ({ 
  started, setStarted, 
  isMuted, setIsMuted, 
  appState, 
  gestureMode, setGestureMode,
  gestureData,
  onPhotosUploaded, 
  onMusicUploaded,
  photoCount,
  onToggleState,
  onToggleTheme, 
  colorTheme
}: OverlayProps) => {

  const [showGreeting, setShowGreeting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowGreeting(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!started) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-1000">
        <div className="text-center p-8 max-w-sm w-full">
          <h1 className="text-5xl font-serif text-pink-100 mb-12 drop-shadow-[0_0_30px_rgba(255,255,255,0.4)] italic">
            Merry Christmas!
          </h1>
          <div className="flex flex-col gap-5">
            <button 
              onClick={() => setStarted(true)} 
              className="py-4 bg-pink-600/20 border border-pink-500/30 hover:bg-pink-600/40 text-pink-100 font-medium rounded-full transition-all duration-700 tracking-[0.4em] text-[12px] shadow-[0_0_40px_rgba(219,39,119,0.1)]"
            >
              点亮回忆
            </button>
          </div>
          <div className="mt-16 flex justify-center gap-8 opacity-20 text-[8px] tracking-[0.5em] text-white uppercase">
            <span>💫 粒子 / 纪念</span>
            <span>🖐 互动 / 永恒</span>
          </div>
        </div>
      </div>
    );
  }

  const isTree = appState === AppState.TREE;

  const getThemeAccent = () => {
    switch (colorTheme) {
      case ColorTheme.GOLD: return 'text-yellow-400 border-yellow-400/20';
      case ColorTheme.BLUE: return 'text-blue-400 border-blue-400/20';
      case ColorTheme.PURPLE: return 'text-purple-400 border-purple-400/20';
      default: return 'text-pink-400 border-pink-400/20';
    }
  };

  const getThemeName = () => {
    switch (colorTheme) {
      case ColorTheme.GOLD: return '金耀';
      case ColorTheme.BLUE: return '冰蓝';
      case ColorTheme.PURPLE: return '紫罗兰';
      default: return '樱花粉';
    }
  };

  return (
    <>
      {/* 顶部栏 */}
      <div className="absolute top-0 left-0 w-full p-10 flex justify-between items-start pointer-events-none z-30">
        <div className="transition-opacity duration-1000" style={{ opacity: showGreeting ? 1 : 0.6 }}>
          <h2 className={`text-4xl font-serif tracking-tighter italic ${getThemeAccent()}`}>
            Merry Christmas!
          </h2>
          <div className="h-px w-12 bg-white/10 mt-4"></div>
        </div>

        <div className="flex gap-4 pointer-events-auto">
          
          {/* ✨ 1. 上传音乐按钮 (支持多选) */}
          <label className="p-4 bg-white/5 hover:bg-white/10 backdrop-blur-3xl rounded-full text-white/50 hover:text-white transition-all cursor-pointer border border-white/5 group" title="更换背景音乐 (支持多选)">
             <Music size={18} />
             {/* ✨ 关键：添加 multiple 属性 */}
             <input type="file" multiple accept="audio/*" className="hidden" onChange={onMusicUploaded} />
          </label>

          {/* 2. 上传照片按钮 */}
          <label className="p-4 bg-white/5 hover:bg-white/10 backdrop-blur-3xl rounded-full text-white/50 hover:text-white transition-all cursor-pointer border border-white/5 group relative">
             {photoCount > 0 ? <ImageIcon size={18} className={getThemeAccent().split(' ')[0]} /> : <Upload size={18} />}
             <input type="file" multiple accept="image/*" className="hidden" onChange={onPhotosUploaded} />
          </label>

          {/* 3. 摄像头开关 */}
          <button 
            onClick={() => setGestureMode(!gestureMode)} 
            className={`p-4 backdrop-blur-3xl rounded-full transition-all border ${gestureMode ? 'bg-white/20 text-white border-white/20' : 'bg-white/5 text-white/30 border-white/5 hover:text-white'}`}
            title={gestureMode ? "关闭手势控制" : "开启手势控制"}
          >
            {gestureMode ? <Camera size={18} /> : <CameraOff size={18} />}
          </button>

          {/* 4. 静音按钮 */}
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            className="p-4 bg-white/5 hover:bg-white/10 backdrop-blur-3xl rounded-full text-white/50 hover:text-white transition-all border border-white/5"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      {/* 变色按钮 */}
      <div className="absolute bottom-40 left-10 z-30 pointer-events-auto">
        <div 
          onClick={onToggleTheme}
          className="flex items-center gap-6 backdrop-blur-3xl p-5 rounded-[1.5rem] border border-white/5 shadow-xl bg-black/20 cursor-pointer hover:bg-white/10 transition-colors group"
        >
          <div className={`w-10 h-10 flex items-center justify-center rounded-xl text-white/80 border border-white/10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-90`}>
            <Palette size={18} className={getThemeAccent().split(' ')[0]} />
          </div>
          <div className="pr-4">
             <p className="text-white/30 text-[7px] tracking-[0.3em] mb-1 font-bold uppercase">THEME COLOR</p>
             <p className="text-white text-lg font-serif italic tracking-wider leading-none">
               {getThemeName()}
             </p>
          </div>
        </div>
      </div>

      {/* 模式切换按钮 */}
      <div className="absolute bottom-10 left-10 z-30 pointer-events-auto">
        <div 
          onClick={onToggleState}
          className="flex items-center gap-6 backdrop-blur-3xl p-6 rounded-[2rem] border border-white/5 shadow-2xl bg-black/20 cursor-pointer hover:bg-white/5 transition-colors group"
        >
          <div className={`w-12 h-12 flex items-center justify-center rounded-2xl text-white/80 border border-white/10 transition-all duration-500 group-hover:scale-110 ${!isTree ? 'bg-pink-500/20 border-pink-500/50 text-pink-200' : ''}`}>
             {gestureMode ? <Hand size={20} /> : <MousePointer2 size={20} />}
          </div>
          <div className="pr-4">
            <p className="text-white/30 text-[8px] tracking-[0.4em] mb-1 font-bold">
              {gestureMode ? 'GESTURE ON' : 'MANUAL MODE'}
            </p>
            <p className="text-white text-xl font-serif italic tracking-wider leading-none transition-all">
              {isTree ? 'Tree Mode' : 'Heart Mode'}
            </p>
          </div>
        </div>
      </div>

      {/* 手势状态提示 */}
      {gestureMode && (
        <div className="absolute top-40 left-10 pointer-events-none z-30 flex flex-col gap-3">
          <div className="bg-black/40 backdrop-blur-3xl px-6 py-4 rounded-3xl border border-white/5 flex items-center gap-4">
            <Wand2 size={14} className={`${getThemeAccent().split(' ')[0]} ${gestureData?.isPinching ? 'animate-spin' : ''}`} />
            <span className="text-white/60 text-[9px] tracking-[0.3em] font-medium">
              {gestureData?.isPinching ? 'GATHERING' : 'RELEASED'}
            </span>
          </div>
          <div className="bg-black/20 backdrop-blur-xl px-4 py-2 rounded-full border border-white/5 flex items-center gap-3">
            <Fingerprint size={12} className={gestureData?.fingerCount > 0 ? "text-white/80 animate-pulse" : "text-white/10"} />
            <p className="text-[8px] text-white/40 tracking-[0.2em]">HAND DETECTED</p>
          </div>
        </div>
      )}
    </>
  );
};