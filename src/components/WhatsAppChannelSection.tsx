import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { MessageCircle, Phone, Sparkles } from 'lucide-react';
import { WHATSAPP_CHANNEL_URL } from '../config/channelConfig';

export const WhatsAppChannelSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  const handleJoinClick = () => {
    window.open(
      WHATSAPP_CHANNEL_URL,
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <motion.section
      aria-labelledby="whatsapp-channel-heading"
      className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.65, ease: 'easeOut' }}
    >
      <div className="pointer-events-none absolute inset-x-8 inset-y-12 rounded-[3rem] bg-[#A832FF]/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-3xl border border-[#A832FF]/35 bg-[linear-gradient(125deg,rgba(18,0,31,0.9),rgba(11,3,24,0.88)_58%,rgba(32,7,37,0.82))] p-6 shadow-[0_0_40px_rgba(123,25,255,0.16),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl transition-all duration-500 hover:border-[#A832FF]/60 hover:shadow-[0_0_52px_rgba(123,25,255,0.25),inset_0_1px_0_rgba(255,255,255,0.1)] sm:p-9 lg:p-10">
        <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-[#B026FF]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-red-500/[0.07] blur-3xl" />
        <div className="whatsapp-pixel whatsapp-pixel-one" aria-hidden="true" />
        <div className="whatsapp-pixel whatsapp-pixel-two" aria-hidden="true" />
        <div className="whatsapp-pixel whatsapp-pixel-three" aria-hidden="true" />

        <div className="relative mx-auto mb-7 max-w-3xl text-center sm:mb-9">
          <p className="mb-2 inline-flex items-center gap-2 font-mono-gaming text-[10px] font-bold uppercase tracking-[0.24em] text-[#D9B3FF]/75 sm:text-xs">
            <Sparkles className="h-3.5 w-3.5 text-[#B026FF]" aria-hidden="true" />
            VOID miner community signal
          </p>
          <h2
            id="whatsapp-channel-heading"
            className="font-heading text-2xl font-black uppercase tracking-wide text-white sm:text-3xl lg:text-4xl"
          >
            JOIN THE VOID MINER WHATSAPP CHANNEL
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-purple-100/75 sm:text-base">
            Stay updated with the latest Void Miner videos, Shorts, Minecraft content, announcements, events and gaming updates.
          </p>
        </div>

        <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center gap-6 rounded-2xl border border-white/10 bg-[#05020B]/55 p-5 shadow-[inset_0_0_28px_rgba(123,25,255,0.08)] sm:flex-row sm:gap-7 sm:p-7 lg:gap-9 lg:p-8">
          <motion.div
            className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-emerald-300/30 bg-[linear-gradient(145deg,rgba(16,185,129,0.19),rgba(123,25,255,0.2))] text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.13),0_0_36px_rgba(123,25,255,0.2)] sm:h-28 sm:w-28"
            animate={prefersReducedMotion ? undefined : { y: [0, -5, 0] }}
            transition={prefersReducedMotion ? undefined : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            <MessageCircle className="h-14 w-14 fill-emerald-400/15 stroke-[1.5] sm:h-16 sm:w-16" />
            <Phone className="absolute h-6 w-6 -rotate-12 stroke-[2.5] sm:h-7 sm:w-7" />
            <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-[3px] border-[#12001F] bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
          </motion.div>

          <div className="flex w-full min-w-0 flex-1 flex-col items-center text-center sm:w-auto sm:items-start sm:text-left">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/[0.08] px-2.5 py-1 font-mono-gaming text-[9px] font-bold tracking-[0.16em] text-emerald-300 sm:text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              OFFICIAL CHANNEL
            </span>
            <h3 className="font-heading text-xl font-black uppercase tracking-wider text-white sm:text-2xl">
              VOID MINER OFFICIAL
            </h3>
            <p className="mt-1 text-sm font-semibold text-[#D9B3FF] sm:text-base">
              WhatsApp Channel
            </p>
            <p className="mt-1 text-xs text-purple-100/60 sm:text-sm">
              Latest Gaming Updates
            </p>

            <button
              type="button"
              onClick={handleJoinClick}
              aria-label="Join Void Miner WhatsApp Channel"
              className="mt-5 inline-flex min-h-12 w-full self-stretch items-center justify-center gap-2.5 rounded-xl border border-[#FF4D7D]/45 bg-[linear-gradient(100deg,rgba(123,25,255,0.94),rgba(176,38,255,0.95)_58%,rgba(219,39,119,0.9))] px-6 py-3 font-heading text-xs font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_0_22px_rgba(176,38,255,0.28)] transition-all duration-300 hover:scale-[1.025] hover:border-[#FF8AA8]/75 hover:shadow-[0_0_32px_rgba(219,39,119,0.36),0_0_28px_rgba(123,25,255,0.36)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B3FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0318] active:scale-[0.99] sm:w-auto sm:self-auto"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              JOIN WHATSAPP CHANNEL
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
