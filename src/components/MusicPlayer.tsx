import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, VolumeX, Volume2, Disc3 } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'AI Generated Synthwave - Alpha', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'AI Generated Synthwave - Beta', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'AI Generated Synthwave - Gamma', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

interface MusicPlayerProps {
  className?: string;
}

export function MusicPlayer({ className = '' }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error("Playback failed. This is typical and normal before a user interaction.", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div className={`flex flex-col items-center bg-gray-950 border border-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.2)_inset,0_0_12px_rgba(236,72,153,0.3)] rounded-lg p-6 font-mono ${className}`}>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={nextTrack}
        loop={false}
      />
      
      <div className="flex items-center space-x-2 text-pink-400 border-b border-pink-500/30 pb-2 mb-4 w-full justify-center">
        <Disc3 size={16} className={`text-pink-500 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
        <div className="text-xs uppercase tracking-widest opacity-90 drop-shadow-[0_0_5px_rgba(236,72,153,0.8)]">Music System</div>
      </div>
      
      <div className="text-sm text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.6)] mb-6 text-center w-full overflow-hidden">
        <div className="truncate whitespace-nowrap">
          {currentTrack.title}
        </div>
      </div>

      <div className="flex items-center justify-center space-x-6 w-full">
        <button onClick={prevTrack} className="text-pink-500/80 hover:text-pink-300 transition-colors drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]">
          <SkipBack size={24} />
        </button>
        <button onClick={togglePlay} className="w-14 h-14 flex items-center justify-center rounded-full border-2 border-pink-500 text-pink-500 hover:bg-pink-500/10 transition-all drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]">
          {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </button>
        <button onClick={nextTrack} className="text-pink-500/80 hover:text-pink-300 transition-colors drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]">
          <SkipForward size={24} />
        </button>
      </div>

      <div className="flex items-center space-x-3 mt-8 w-full max-w-[200px] border border-gray-800 rounded px-3 py-2 bg-black/50">
        <button onClick={toggleMute} className="text-pink-500 drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]">
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
        />
      </div>
    </div>
  );
}
