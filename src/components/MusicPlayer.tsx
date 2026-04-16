import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: "SECTOR_01", artist: "CORRUPT_AUDIO.WAV", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "SECTOR_02", artist: "VOID_NOISE.MP3", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "SECTOR_03", artist: "NULL_POINTER.FLAC", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  }, [currentTrackIndex, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
    }
  };

  return (
    <div className="w-full grid grid-cols-[280px_1fr_240px] items-center font-mono">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        preload="metadata"
      />
      
      {/* Now Playing */}
      <div className="flex items-center">
        <div className="w-14 h-14 border-2 border-[#ff00ff] bg-black text-[#00ffff] flex items-center justify-center text-[24px] mr-4 animate-pulse">
          !
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="text-[18px] font-bold text-[#00ffff] mb-0.5 truncate glitch" data-text={currentTrack.title}>{currentTrack.title}</div>
          <div className="text-[14px] text-[#ff00ff] truncate">{currentTrack.artist}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-6 text-[24px]">
          <button onClick={handlePrev} className="text-[#00ffff] hover:text-[#ff00ff] hover:bg-[#00ffff] px-2 border border-transparent hover:border-[#ff00ff] transition-all">
            {'<<'}
          </button>
          <button onClick={togglePlay} className="text-[#ff00ff] hover:text-[#00ffff] hover:bg-[#ff00ff] px-4 border-2 border-[#ff00ff] hover:border-[#00ffff] transition-all font-bold">
            {isPlaying ? 'HALT' : 'EXEC'}
          </button>
          <button onClick={handleNext} className="text-[#00ffff] hover:text-[#ff00ff] hover:bg-[#00ffff] px-2 border border-transparent hover:border-[#ff00ff] transition-all">
            {'>>'}
          </button>
        </div>
        <div className="w-full max-w-[400px] h-4 border border-[#00ffff] bg-black relative cursor-pointer" onClick={handleProgressClick}>
          <div className="absolute left-0 top-0 h-full bg-[#ff00ff]" style={{ width: `${progress}%` }} />
          <div className="absolute inset-0 flex items-center justify-center text-[10px] text-white mix-blend-difference pointer-events-none">
            {Math.round(progress)}%
          </div>
        </div>
      </div>

      {/* Volume */}
      <div className="flex items-center justify-end gap-3 text-[#00ffff]">
        <span className="text-[14px]">VOL:</span>
        <div className="w-[100px] h-[10px] border border-[#ff00ff] bg-black relative cursor-pointer flex items-center">
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="h-full bg-[#00ffff] pointer-events-none" style={{ width: `${volume * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
