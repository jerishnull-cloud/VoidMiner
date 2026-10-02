import React from 'react';
import { Youtube, MessageSquare, Instagram, Twitter, ArrowUp, Sparkles, Heart } from 'lucide-react';
import { CHANNEL_CONFIG } from '../config/channelConfig';
import { Logo } from './Logo';

interface FooterProps {
  onNavClick: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'videos', label: 'Videos' },
    { id: 'shorts', label: 'Shorts' },
    { id: 'live', label: 'Live' },
    { id: 'about', label: 'About' },
  ];

  return (
    <footer className="relative bg-[#050507] border-t border-[#7B00FF]/25 pt-16 pb-12 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-[#7B00FF]/15 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-purple-900/30">
          {/* Col 1-5: Brand & Logo */}
          <div className="md:col-span-5 space-y-4">
            <div 
              onClick={scrollToTop}
              className="flex items-center gap-3.5 cursor-pointer group"
            >
              <div className="relative flex items-center justify-center">
                <Logo variant="footer" />
              </div>

              <div>
                <span className="font-heading text-2xl font-black tracking-wider text-white flex items-center gap-1.5">
                  VOID <span className="text-[#B026FF]">miner</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase font-mono-gaming text-purple-300/80 block -mt-1">
                  Official Gaming Channel
                </span>
              </div>
            </div>

            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Official website of VOID miner. Catch all latest Minecraft survival epics, 100 days hardcore runs, PvP challenges, and YouTube Shorts.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={CHANNEL_CONFIG.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube"
                className="p-2.5 rounded-lg bg-[#12001F] hover:bg-red-600 text-purple-300 hover:text-white border border-purple-900/50 hover:border-red-500 transition-all"
              >
                <Youtube className="w-4 h-4" />
              </a>

              <a
                href={CHANNEL_CONFIG.socials.discord}
                target="_blank"
                rel="noopener noreferrer"
                title="Discord"
                className="p-2.5 rounded-lg bg-[#12001F] hover:bg-[#5865F2] text-purple-300 hover:text-white border border-purple-900/50 hover:border-[#5865F2] transition-all"
              >
                <MessageSquare className="w-4 h-4" />
              </a>

              <a
                href={CHANNEL_CONFIG.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="p-2.5 rounded-lg bg-[#12001F] hover:bg-pink-600 text-purple-300 hover:text-white border border-purple-900/50 hover:border-pink-500 transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={CHANNEL_CONFIG.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                title="X / Twitter"
                className="p-2.5 rounded-lg bg-[#12001F] hover:bg-sky-600 text-purple-300 hover:text-white border border-purple-900/50 hover:border-sky-500 transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 6-8: Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-heading text-sm font-bold uppercase tracking-widest text-[#D9B3FF]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs font-mono-gaming text-gray-400">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavClick(link.id)}
                    className="hover:text-white hover:translate-x-1 transition-all inline-block py-0.5"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 9-12: Channel Updates & Back to Top */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-heading text-sm font-bold uppercase tracking-widest text-[#D9B3FF]">
              Auto-Sync System
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              This official website automatically synchronizes directly with the YouTube Data API v3. New uploads, Shorts, and live streams are displayed instantly.
            </p>

            <button
              onClick={scrollToTop}
              className="px-4 py-2 rounded-xl bg-[#12001F] hover:bg-[#7B00FF]/30 border border-[#B026FF]/30 hover:border-[#B026FF] text-xs font-mono-gaming text-purple-200 hover:text-white transition-all flex items-center gap-2 group"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 font-mono-gaming gap-4">
          <p>© 2026 VOID miner. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-purple-400/80">
            <span>Powered by YouTube Data API v3</span>
            <span className="w-1 h-1 rounded-full bg-[#B026FF]" />
            <span>VOID miner Official Channel</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
