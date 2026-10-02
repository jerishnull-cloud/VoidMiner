import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Tv, 
  Film, 
  Radio, 
  Info, 
  Menu, 
  X, 
  RefreshCw, 
  ExternalLink,
  Sparkles,
  MessageSquare,
  Instagram
} from 'lucide-react';
import { CHANNEL_CONFIG } from '../config/channelConfig';
import { Logo } from './Logo';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isLive: boolean;
  refreshing: boolean;
  onRefresh: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  isLive,
  refreshing,
  onRefresh,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Play },
    { id: 'videos', label: 'Videos', icon: Film },
    { id: 'shorts', label: 'Shorts', icon: Tv, badge: 'HOT' },
    { id: 'live', label: 'Live', icon: Radio, isLivePulse: isLive },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNavClick = (id: string) => {
    onTabChange(id);
    setMobileMenuOpen(false);
    
    // Smooth scroll to top or section if applicable
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#050507]/90 backdrop-blur-xl border-b border-[#B026FF]/25 shadow-[0_10px_30px_rgba(18,0,31,0.8)]'
            : 'bg-[#050507]/60 backdrop-blur-md border-b border-[#7B00FF]/15'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Left: VOID miner Official Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div className="relative flex items-center justify-center">
              <Logo variant="navbar" />
              {isLive && (
                <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border-2 border-[#050507]"></span>
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <span className="font-heading text-xl sm:text-2xl font-bold tracking-wider text-white group-hover:text-[#D9B3FF] transition-colors flex items-center gap-1.5">
                VOID <span className="text-[#B026FF] drop-shadow-[0_0_10px_rgba(176,38,255,0.8)]">miner</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase font-mono-gaming text-purple-300/70 -mt-1">
                Official Gaming Channel
              </span>
            </div>
          </div>

          {/* Center Navigation: Desktop */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 px-3 py-1.5 rounded-full bg-[#12001F]/70 border border-[#B026FF]/20 backdrop-blur-md shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-[#7B00FF] to-[#B026FF] shadow-[0_0_15px_rgba(176,38,255,0.5)]'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-purple-300'}`} />
                  <span>{item.label}</span>

                  {item.badge && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-full bg-[#B026FF]/30 text-[#D9B3FF] border border-[#B026FF]/50">
                      {item.badge}
                    </span>
                  )}

                  {item.isLivePulse && (
                    <span className="flex items-center gap-1 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-red-600/40 text-red-300 border border-red-500/50 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      Live
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Sync button, Settings HUD, and YouTube Subscribe button */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Sync / Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={refreshing}
              title="Refresh / Sync latest YouTube uploads"
              aria-label="Refresh YouTube uploads"
              className="p-2.5 rounded-xl bg-[#12001F]/80 border border-[#B026FF]/30 text-purple-200 hover:text-white hover:border-[#B026FF] hover:bg-[#7B00FF]/20 transition-all duration-200 relative group"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#B026FF]' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              <span className="sr-only">Refresh content</span>
            </button>

            {/* Discord Community Link */}
            <a
              href={CHANNEL_CONFIG.socials.discord}
              target="_blank"
              rel="noopener noreferrer"
              title="Join Discord Community"
              className="p-2.5 rounded-xl bg-[#12001F]/80 border border-[#5865F2]/40 text-[#8891f2] hover:text-white hover:border-[#5865F2] hover:bg-[#5865F2]/20 transition-all duration-200 hidden lg:flex items-center justify-center"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="sr-only">Discord</span>
            </a>

            {/* Instagram Link */}
            <a
              href={CHANNEL_CONFIG.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              title="Follow Instagram"
              className="p-2.5 rounded-xl bg-[#12001F]/80 border border-pink-500/40 text-pink-400 hover:text-white hover:border-pink-500 hover:bg-pink-500/20 transition-all duration-200 hidden lg:flex items-center justify-center"
            >
              <Instagram className="w-4 h-4" />
              <span className="sr-only">Instagram</span>
            </a>

            {/* Watch / Subscribe on YouTube Button */}
            <a
              href={CHANNEL_CONFIG.socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group overflow-hidden px-5 py-2.5 rounded-xl font-heading font-bold text-sm tracking-wide text-white flex items-center gap-2 bg-gradient-to-r from-red-600 to-[#B026FF] hover:from-red-500 hover:to-[#D9B3FF] shadow-[0_0_20px_rgba(239,68,68,0.35)] hover:shadow-[0_0_25px_rgba(176,38,255,0.6)] transition-all duration-300 active:scale-95"
            >
              <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>YOUTUBE</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="p-2 rounded-lg bg-[#12001F] border border-[#B026FF]/30 text-purple-200"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#B026FF]' : ''}`} />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg bg-[#12001F] border border-[#B026FF]/30 text-white hover:border-[#B026FF] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#B026FF]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-[#050507]/95 backdrop-blur-2xl pt-24 px-6 pb-8 flex flex-col justify-between border-b border-[#B026FF]/30 animate-in fade-in duration-200">
          <div className="space-y-3">
            {/* Mobile Branding with VOID miner Logo */}
            <div className="flex items-center gap-4 pb-6 mb-4 border-b border-[#7B00FF]/20">
              <Logo variant="mobile" />
              <div>
                <h3 className="font-heading text-2xl font-bold text-white">VOID miner</h3>
                <p className="text-xs text-purple-300">Official Gaming Channel</p>
              </div>
            </div>

            {/* Mobile Nav Links */}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl font-heading text-lg font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#7B00FF] to-[#B026FF] text-white shadow-[0_0_20px_rgba(176,38,255,0.4)]'
                      : 'bg-[#12001F]/60 border border-purple-900/30 text-gray-200 hover:text-white hover:border-[#B026FF]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-purple-300" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#B026FF] text-white">
                      {item.badge}
                    </span>
                  )}
                  {item.isLivePulse && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-600 text-white animate-pulse">
                      🔴 LIVE
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Mobile Action Buttons */}
          <div className="space-y-3 pt-6 border-t border-purple-950">
            {/* Mobile Discord & Instagram Quick Links */}
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={CHANNEL_CONFIG.socials.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-3 rounded-xl bg-[#5865F2]/15 border border-[#5865F2]/40 text-purple-100 font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#5865F2]/30"
              >
                <MessageSquare className="w-4 h-4 text-[#8891f2]" />
                <span>DISCORD</span>
              </a>

              <a
                href={CHANNEL_CONFIG.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-3 rounded-xl bg-pink-600/15 border border-pink-500/40 text-purple-100 font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-pink-600/30"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
                <span>INSTAGRAM</span>
              </a>
            </div>

            <a
              href={CHANNEL_CONFIG.socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl font-heading font-bold text-center tracking-wide text-white flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-[#B026FF] shadow-[0_0_25px_rgba(176,38,255,0.4)]"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>WATCH ON YOUTUBE</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
};
