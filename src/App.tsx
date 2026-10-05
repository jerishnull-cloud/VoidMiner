/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ChannelStats } from './components/ChannelStats';
import { WhatsAppChannelSection } from './components/WhatsAppChannelSection';
import { FeaturedVideo } from './components/FeaturedVideo';
import { ContentFeed } from './components/ContentFeed';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { VideoModal } from './components/VideoModal';
import { useYouTubeData } from './services/youtubeClient';
import { YouTubeVideo } from './types/youtube';
import { BellRing } from 'lucide-react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useAuth } from './auth/AuthProvider';

const AuthPages = lazy(() => import('./auth/AuthPages').then(module => ({ default: module.AuthPages })));

function AuthLoadingScreen() {
  return (
    <main
      style={{
        display: 'grid',
        minHeight: '100vh',
        placeItems: 'center',
        background: '#050507',
        color: '#fff',
        fontFamily: 'Rajdhani, sans-serif',
        letterSpacing: '0.08em',
        textAlign: 'center',
      }}
    >
      <div>
        <div style={{ fontSize: '1.1rem', opacity: 0.72, marginBottom: '0.4rem' }}>ENTERING THE VOID...</div>
        <div style={{ fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#bb80ff' }}>Authenticating...</div>
      </div>
    </main>
  );
}

function HomePage() {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const {
    data,
    loading,
    refreshing,
    newUploadDetected,
    refreshNow,
  } = useYouTubeData();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  useEffect(() => {
    const background = backgroundRef.current;
    const finePointer = window.matchMedia('(pointer: fine) and (min-width: 769px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!background || !finePointer.matches || reducedMotion.matches) return;

    let frame = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const renderParallax = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      background.style.setProperty('--parallax-x', `${currentX.toFixed(2)}px`);
      background.style.setProperty('--parallax-y', `${currentY.toFixed(2)}px`);
      background.style.setProperty('--parallax-glow-x', `${(currentX * 0.45).toFixed(2)}px`);
      background.style.setProperty('--parallax-glow-y', `${(currentY * 0.45).toFixed(2)}px`);

      if (Math.abs(targetX - currentX) > 0.02 || Math.abs(targetY - currentY) > 0.02) {
        frame = window.requestAnimationFrame(renderParallax);
      } else {
        frame = 0;
      }
    };

    const updateTarget = (x: number, y: number) => {
      targetX = ((x / window.innerWidth) * 2 - 1) * 6;
      targetY = ((y / window.innerHeight) * 2 - 1) * 5;
      if (!frame) frame = window.requestAnimationFrame(renderParallax);
    };

    const handlePointerMove = (event: PointerEvent) => updateTarget(event.clientX, event.clientY);
    const resetTarget = () => updateTarget(window.innerWidth / 2, window.innerHeight / 2);

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', resetTarget);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', resetTarget);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab !== 'home' && tab !== 'about') {
      const feedElem = document.getElementById('content-feed');
      if (feedElem) {
        feedElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleExploreClick = () => {
    const feedElem = document.getElementById('content-feed');
    if (feedElem) {
      feedElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const fallbackStats = {
    subscribers: 0,
    subscribersFormatted: '0',
    totalViews: 0,
    totalViewsFormatted: '0',
    videoCount: 0,
    shortsCount: 0,
    liveCount: 0,
    lastUpdated: '',
  };

  return (
    <div className="void-miner-page relative min-h-screen bg-[#050507] text-white selection:bg-[#B026FF] selection:text-white flex flex-col justify-between overflow-x-hidden">
      <div ref={backgroundRef} className="void-miner-background" aria-hidden="true">
        <div className="void-miner-base" />
        <div className="void-miner-glow glow-left" />
        <div className="void-miner-glow glow-right" />
        <div className="void-miner-glow glow-center" />
        <div className="void-miner-fog fog-one" />
        <div className="void-miner-fog fog-two" />
        <div className="void-miner-grid" />

        <div className="minecraft-silhouette terrain-back terrain-left" />
        <div className="minecraft-silhouette terrain-back terrain-right" />
        <div className="minecraft-silhouette trees trees-left" />
        <div className="minecraft-silhouette trees trees-right" />

        <div className="floating-cube cube-one" />
        <div className="floating-cube cube-two" />
        <div className="floating-cube cube-three" />
        <div className="floating-cube cube-four" />

        <div className="bg-particle particle-1" />
        <div className="bg-particle particle-2" />
        <div className="bg-particle particle-3" />
        <div className="bg-particle particle-4" />
        <div className="bg-particle particle-5" />
        <div className="bg-particle particle-6" />
        <div className="bg-particle particle-7" />
        <div className="bg-particle particle-8" />
      </div>

      {/* Main App Container */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Sticky Header Navbar */}
        <Navbar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isLive={data?.liveStatus?.isCurrentlyLive || false}
          refreshing={refreshing}
          onRefresh={refreshNow}
        />

        {/* New Upload Notification Toast */}
        {newUploadDetected && (
          <div className="sticky top-24 z-40 max-w-lg mx-auto px-4 animate-in slide-in-from-top duration-300">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#7B00FF] to-[#B026FF] text-white shadow-[0_0_30px_rgba(176,38,255,0.7)] border border-white/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <BellRing className="w-5 h-5 animate-bounce text-amber-300" />
                <span className="font-heading font-bold text-sm">
                  NEW UPLOAD DETECTED! Your latest YouTube video was synced.
                </span>
              </div>
              <button
                onClick={refreshNow}
                className="px-3 py-1 rounded-lg bg-black/30 hover:bg-black/50 text-xs font-mono-gaming font-bold"
              >
                View Now
              </button>
            </div>
          </div>
        )}

        <main className="flex-1">
          {/* Hero Section */}
          <Hero
            onExploreClick={handleExploreClick}
            subscriberCountFormatted={data?.stats?.subscribersFormatted || '25'}
            isCurrentlyLive={data?.liveStatus?.isCurrentlyLive || false}
          />

          {/* Real-time Statistics HUD */}
          <ChannelStats stats={data?.stats || fallbackStats} isLiveApi={data?.isLiveApi || false} />

          {/* Official WhatsApp Channel */}
          <WhatsAppChannelSection />

          {/* Featured Premiere Video (Shown on Home/All) */}
          {(activeTab === 'all' || activeTab === 'home') && data?.featuredVideo && (
            <FeaturedVideo video={data.featuredVideo} onPlay={setSelectedVideo} />
          )}

          {/* Content Feed with Filter Tabs */}
          <ContentFeed
            activeTab={activeTab}
            onTabChange={setActiveTab}
            videos={data?.videos || []}
            shorts={data?.shorts || []}
            liveStatus={data?.liveStatus || { isCurrentlyLive: false, recentLiveVideos: [] }}
            loading={loading}
            error={data?.error}
            lastSynced={data?.lastSynced}
            onRefresh={refreshNow}
            onPlayVideo={setSelectedVideo}
          />

          {/* About Creator Section */}
          <AboutSection />
        </main>

        {/* Footer */}
        <Footer onNavClick={handleTabChange} />
      </div>

      {/* Video Cinema Embed Modal */}
      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
    </div>
  );
}

function HomeRoute() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !session) {
      navigate('/login', { replace: true });
    }
  }, [loading, Boolean(session), navigate]);

  return loading || !session ? <AuthLoadingScreen /> : <HomePage />;
}

function LoginRoute() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const initialCheckComplete = useRef(false);
  const initiallyAuthenticated = useRef(false);

  React.useEffect(() => {
    if (loading) return;
    if (!initialCheckComplete.current) {
      initialCheckComplete.current = true;
      initiallyAuthenticated.current = Boolean(session);
    }
    if (initiallyAuthenticated.current && session) {
      if (import.meta.env.DEV) console.log('[AUTH] Redirecting to home');
      navigate('/', { replace: true });
    }
  }, [loading, Boolean(session), navigate]);

  if (loading || session) return <AuthLoadingScreen />;
  return <AuthPages path="/login" />;
}

function LoginSuccessRoute() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (loading) return;
    if (!session) {
      navigate('/login', { replace: true });
      return;
    }

    if (import.meta.env.DEV) console.log('[AUTH] Redirecting to home');
    const timeout = window.setTimeout(() => navigate('/', { replace: true }), 2000);
    return () => window.clearTimeout(timeout);
  }, [loading, Boolean(session), navigate]);

  if (loading || !session) return <AuthLoadingScreen />;
  return <AuthPages path="/login-success" />;
}

function UnknownRoute() {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate('/', { replace: true });
  }, [navigate]);

  return <AuthLoadingScreen />;
}

export default function App() {
  const { loading, session } = useAuth();

  React.useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[AUTH] loading:', loading);
      console.log('[AUTH] session:', Boolean(session));
      console.log('[AUTH] route:', window.location.pathname);
    }
  }, [loading, Boolean(session)]);

  return (
    <Suspense fallback={<AuthLoadingScreen />}>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/register" element={<AuthPages path="/register" />} />
        <Route path="/forgot-password" element={<AuthPages path="/forgot-password" />} />
        <Route path="/reset-password" element={<AuthPages path="/reset-password" />} />
        <Route path="/login-success" element={<LoginSuccessRoute />} />
        <Route path="/account" element={<AuthPages path="/account" />} />
        <Route path="*" element={<UnknownRoute />} />
      </Routes>
    </Suspense>
  );
}
