import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col pt-6 pb-12 overflow-x-hidden selection:bg-pink-500/30">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-950/20 via-black to-black opacity-80 pointer-events-none z-0"></div>
      
      <header className="relative w-full max-w-6xl mx-auto px-6 mb-10 flex items-center justify-between z-10">
        <div className="flex items-center gap-3 text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)] border-b border-green-900/50 pb-2 border-dashed">
          <Terminal size={32} />
          <h1 className="font-mono text-3xl font-bold tracking-[0.2em] uppercase">Neon <span className="text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]">Synth</span></h1>
        </div>
        <div className="font-mono text-sm tracking-widest hidden sm:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,1)] animate-pulse"></span>
          <span className="text-gray-400 border border-gray-800 rounded px-3 py-1 bg-gray-900/50">SYSTEM_ONLINE</span>
        </div>
      </header>

      <main className="relative flex-1 flex flex-col xl:flex-row items-center xl:items-start justify-center gap-12 max-w-7xl mx-auto w-full px-6 z-10">
        {/* Playable Area */}
        <div className="flex-1 flex justify-center items-start w-full">
          <SnakeGame />
        </div>
        
        {/* Sidebar / Music Player */}
        <div className="flex-none w-full max-w-[340px] flex flex-col gap-8">
          <div className="relative">
            <MusicPlayer />
          </div>
          
          {/* Instructions Panel */}
          <div className="bg-gray-950/80 backdrop-blur border border-gray-800 rounded-lg p-6 font-mono text-sm shadow-[0_0_20px_rgba(0,0,0,0.8)]">
            <h3 className="text-gray-400 mb-4 border-b border-gray-800 pb-2 uppercase tracking-widest font-bold">Initialization Data</h3>
            <ul className="text-gray-400 space-y-4">
              <li className="flex items-center gap-3">
                <span className="text-blue-400 border border-blue-900/50 bg-blue-950/30 px-2 py-1 rounded shadow-[0_0_5px_rgba(96,165,250,0.2)]">W A S D</span> 
                <span>or</span>
                <span className="text-blue-400 border border-blue-900/50 bg-blue-950/30 px-2 py-1 rounded shadow-[0_0_5px_rgba(96,165,250,0.2)]">ARROWS</span>
                <span className="ml-2">— Move</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400 border border-green-900/50 bg-green-950/30 px-2 py-1 rounded shadow-[0_0_5px_rgba(74,222,128,0.2)]">ENTER</span>
                <span className="ml-2">— Restart Match</span>
              </li>
            </ul>

            <div className="mt-8 pt-4 border-t border-gray-800/50 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">AUDIO_SRC</span>
                <span className="text-pink-500/70">AI_SYNTH_WAVE</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">GAME_MODE</span>
                <span className="text-green-500/70">CLASSIC_ROUTINE</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
