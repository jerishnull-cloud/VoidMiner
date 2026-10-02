import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Gamepad2, 
  Flame, 
  Cpu, 
  Monitor, 
  Layers, 
  Youtube, 
  MessageSquare, 
  Instagram, 
  Twitter, 
  ExternalLink 
} from 'lucide-react';
import { CHANNEL_CONFIG } from '../config/channelConfig';
import { Logo } from './Logo';

export const AboutSection: React.FC = () => {
  const focusAreas = [
    { name: 'Minecraft', desc: 'Java Edition 1.21+ Survival and Hardcore worlds' },
    { name: 'Survival', desc: '100 Days challenges, Void dimension, ultra hardcore' },
    { name: 'Challenges', desc: 'Pitch black, speedruns, restricted weapon runs' },
    { name: 'PvP', desc: 'Netherite crystal arena, SMP faction wars & duels' },
    { name: 'Mods', desc: 'Custom void dimensions, shaders, new biomes & mobs' },
    { name: 'Funny Moments', desc: 'Community trolling, fail compilations, voice chat chaos' },
  ];

  return (
    <section id="about" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Decorative Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-[#7B00FF]/15 via-[#B026FF]/10 to-transparent blur-[120px] pointer-events-none rounded-full" />

      {/* Main Glass Panel */}
      <div className="relative rounded-3xl bg-[#12001F]/70 border border-[#B026FF]/35 p-6 sm:p-10 lg:p-12 backdrop-blur-2xl shadow-[0_20px_60px_rgba(18,0,31,0.9)] overflow-hidden">
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#B026FF]" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#B026FF]" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#B026FF]" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#B026FF]" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Brand Identity & Mascot */}
          <div className="lg:col-span-5 flex flex-col items-center text-center">
            <div className="relative group flex items-center justify-center">
              <Logo variant="about" className="w-44 h-44 sm:w-52 sm:h-52 transform group-hover:scale-105 transition-transform duration-300" />
            </div>

            <h3 className="mt-6 font-heading text-3xl sm:text-4xl font-black uppercase text-white tracking-wider">
              VOID <span className="text-[#B026FF]">miner</span>
            </h3>
            <p className="font-heading text-sm uppercase tracking-widest text-[#D9B3FF] font-semibold">
              Official Gaming Channel
            </p>

            {/* Social Buttons Matrix */}
            <div className="mt-6 flex flex-wrap justify-center gap-2.5">
              <a
                href={CHANNEL_CONFIG.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube"
                className="p-3 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 transition-all duration-200"
              >
                <Youtube className="w-5 h-5" />
              </a>

              <a
                href={CHANNEL_CONFIG.socials.discord}
                target="_blank"
                rel="noopener noreferrer"
                title="Discord Community"
                className="p-3 rounded-xl bg-[#5865F2]/20 hover:bg-[#5865F2] text-[#5865F2] hover:text-white border border-[#5865F2]/30 transition-all duration-200"
              >
                <MessageSquare className="w-5 h-5" />
              </a>

              <a
                href={CHANNEL_CONFIG.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="p-3 rounded-xl bg-pink-600/20 hover:bg-pink-600 text-pink-400 hover:text-white border border-pink-500/30 transition-all duration-200"
              >
                <Instagram className="w-5 h-5" />
              </a>

              <a
                href={CHANNEL_CONFIG.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                title="X / Twitter"
                className="p-3 rounded-xl bg-sky-600/20 hover:bg-sky-600 text-sky-400 hover:text-white border border-sky-500/30 transition-all duration-200"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right: Bio & Content Focus */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B026FF]/20 border border-[#B026FF]/40 text-[#D9B3FF] text-xs font-mono-gaming mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#B026FF]" />
                <span>ABOUT THE CREATOR</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
                Crafting Epic Adventures in the Deep Void
              </h2>
            </div>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              {CHANNEL_CONFIG.description}
            </p>

            {/* Focus Pillars Grid */}
            <div>
              <h4 className="font-heading text-sm uppercase tracking-widest text-purple-300 font-bold mb-3 flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-[#B026FF]" />
                <span>Gaming Creator Focused On:</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {focusAreas.map((item) => (
                  <div
                    key={item.name}
                    className="p-3 rounded-xl bg-[#050507]/60 border border-purple-900/40 hover:border-[#B026FF]/60 transition-all group"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-heading font-bold text-white group-hover:text-[#D9B3FF] uppercase mb-1">
                      <Flame className="w-3 h-3 text-[#B026FF]" />
                      <span>{item.name}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-tight">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Creator HUD Specifications */}
            <div className="p-4 rounded-xl bg-[#050507]/80 border border-purple-900/50">
              <div className="flex items-center gap-2 text-xs font-mono-gaming uppercase text-purple-300 mb-2">
                <Cpu className="w-4 h-4 text-[#B026FF]" />
                <span>Creator Specs & In-Game Profile</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono-gaming">
                <div>
                  <span className="text-gray-500">IGN: </span>
                  <span className="text-white font-bold">{CHANNEL_CONFIG.creatorSpecs.ign}</span>
                </div>
                <div>
                  <span className="text-gray-500">Game: </span>
                  <span className="text-white">{CHANNEL_CONFIG.creatorSpecs.game}</span>
                </div>
                <div>
                  <span className="text-gray-500">Quality: </span>
                  <span className="text-purple-300">{CHANNEL_CONFIG.creatorSpecs.resolution}</span>
                </div>
              </div>
            </div>

            {/* Direct Channel CTA */}
            <div className="pt-2">
              <a
                href={CHANNEL_CONFIG.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl font-heading font-bold text-sm tracking-wider uppercase text-white bg-gradient-to-r from-red-600 to-[#B026FF] hover:from-red-500 hover:to-[#D9B3FF] shadow-[0_0_25px_rgba(176,38,255,0.4)] transition-all active:scale-95"
              >
                <Youtube className="w-5 h-5 fill-current" />
                <span>VISIT OFFICIAL YOUTUBE CHANNEL</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
