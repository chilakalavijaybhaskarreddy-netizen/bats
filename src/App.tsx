import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="h-screen w-screen bg-black text-[#00ffff] font-mono flex flex-col overflow-hidden crt-flicker relative">
      <div className="absolute inset-0 scanlines z-50"></div>
      
      <header className="h-[60px] border-b-4 border-dashed border-[#ff00ff] flex items-center justify-between px-6 bg-black relative z-40">
        <div className="font-extrabold text-[28px] tracking-[4px] text-[#00ffff] glitch" data-text="SYS.TERMINAL // SNAKE">
          SYS.TERMINAL // SNAKE
        </div>
        <div className="text-[16px] text-[#ff00ff] animate-pulse">STATUS: CORRUPTED</div>
      </header>

      <div className="flex-1 grid grid-cols-[280px_1fr_240px] bg-black min-h-0 relative z-40">
        {/* Sidebar */}
        <aside className="border-r-4 border-double border-[#00ffff] p-5 bg-black overflow-y-auto">
          <div className="text-[16px] uppercase tracking-[2px] text-[#ff00ff] mb-4 border-b-2 border-[#ff00ff] pb-2">DATA.STREAM</div>
          
          <div className="flex items-center p-2 mb-4 border-2 border-[#00ffff] bg-[#00ffff]/10 hover:bg-[#ff00ff]/20 hover:border-[#ff00ff] transition-all cursor-pointer">
            <div className="text-[24px] mr-3 text-[#ff00ff]">{'>'}</div>
            <div className="flex-1">
              <div className="text-[18px] font-bold text-[#00ffff]">SECTOR_01</div>
              <div className="text-[14px] text-[#ff00ff]">CORRUPT_AUDIO.WAV</div>
            </div>
          </div>

          <div className="flex items-center p-2 mb-4 border-2 border-[#222] hover:border-[#00ffff] transition-all cursor-pointer">
            <div className="text-[24px] mr-3 text-[#555]">{'>'}</div>
            <div className="flex-1">
              <div className="text-[18px] font-bold text-[#555]">SECTOR_02</div>
              <div className="text-[14px] text-[#555]">VOID_NOISE.MP3</div>
            </div>
          </div>

          <div className="flex items-center p-2 mb-4 border-2 border-[#222] hover:border-[#00ffff] transition-all cursor-pointer">
            <div className="text-[24px] mr-3 text-[#555]">{'>'}</div>
            <div className="flex-1">
              <div className="text-[18px] font-bold text-[#555]">SECTOR_03</div>
              <div className="text-[14px] text-[#555]">NULL_POINTER.FLAC</div>
            </div>
          </div>
        </aside>

        {/* Game Area */}
        <main className="flex flex-col items-center justify-center p-5 relative">
          <div className="relative">
            <div className="absolute -inset-2 bg-[#ff00ff] opacity-20 blur-md animate-pulse"></div>
            <SnakeGame onScoreChange={setScore} />
          </div>
          <p className="mt-6 text-[#ff00ff] text-[18px] tracking-widest glitch" data-text="INPUT: ARROW_KEYS">INPUT: ARROW_KEYS</p>
        </main>

        {/* Status Panel */}
        <aside className="border-l-4 border-dashed border-[#ff00ff] bg-black p-5 flex flex-col gap-8">
          <div className="p-4 border-2 border-[#00ffff] relative">
            <div className="absolute -top-3 left-2 bg-black px-2 text-[14px] text-[#ff00ff]">MEMORY.ALLOC</div>
            <div className="text-[40px] font-bold text-[#00ffff] glitch" data-text={score.toString().padStart(5, '0')}>{score.toString().padStart(5, '0')}</div>
          </div>
          
          <div className="p-4 border-2 border-[#555] relative">
            <div className="absolute -top-3 left-2 bg-black px-2 text-[14px] text-[#555]">MAX.OVERFLOW</div>
            <div className="text-[40px] font-bold text-[#555]">08950</div>
          </div>

          <div className="p-4 border-2 border-[#ff00ff] relative bg-[#ff00ff]/10">
            <div className="absolute -top-3 left-2 bg-black px-2 text-[14px] text-[#00ffff]">THREAT.LEVEL</div>
            <div className="text-[24px] font-bold text-[#ff00ff] animate-pulse">CRITICAL</div>
          </div>
        </aside>
      </div>

      {/* Footer Player Bar */}
      <footer className="h-[100px] border-t-4 border-double border-[#00ffff] bg-black flex items-center px-6 relative z-40">
        <MusicPlayer />
      </footer>
    </div>
  );
}
