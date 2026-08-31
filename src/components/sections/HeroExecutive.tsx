import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import {
  Zap,
  Bot,
  Code2,
  MessageCircle,
  ArrowDown,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { HERO_DATA } from '../../data/portfolioData';
import { ThreeHeroCanvas } from '../common/ThreeHeroCanvas';
import { createQuickWhatsAppUrl } from '../../utils/contactUtils';

interface HeroExecutiveProps {
  onContactClick: () => void;
}

export const HeroExecutive: React.FC<HeroExecutiveProps> = ({ onContactClick }) => {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headlineRef.current) return;
    const letters = headlineRef.current.querySelectorAll('.hero-letter');
    if (!letters || letters.length === 0) return;

    gsap.fromTo(
      letters,
      {
        opacity: 0,
        y: 30,
        rotateX: -50,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        stagger: 0.012,
        duration: 0.75,
        ease: 'power3.out',
        delay: 0.1,
      }
    );
  }, []);

  const renderWords = (text: string, isGradient = false) => {
    return text.split(' ').map((word, wIdx) => (
      <span key={wIdx} className="inline-block whitespace-nowrap mr-2.5 sm:mr-3.5">
        {word.split('').map((char, cIdx) => (
          <span
            key={cIdx}
            className={`hero-letter inline-block transition-transform duration-200 hover:scale-110 ${
              isGradient ? 'text-[#00D2F6] hover:text-white' : 'text-white hover:text-[#00D2F6]'
            }`}
            style={{ transformOrigin: 'bottom' }}
          >
            {char}
          </span>
        ))}
      </span>
    ));
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-[92vh] lg:min-h-screen w-full bg-[#050914] text-[#F3F5F7] pt-28 sm:pt-32 pb-20 px-4 sm:px-6 md:px-10 flex items-center justify-center overflow-hidden z-10"
    >
      {/* 1. Interactive Three.js Constellation Background */}
      <ThreeHeroCanvas />

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-[#00D2F6]/10 blur-[180px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#015EEF]/10 blur-[180px] pointer-events-none rounded-full" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Copywriting & High-Conversion Hooks (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
          {/* Availability Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#080D18]/90 border border-[#00D2F6]/30 shadow-lg shadow-[#00D2F6]/10 backdrop-blur-md"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#00D2F6] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest text-[#00D2F6] uppercase">
              {HERO_DATA.statusBadge}
            </span>
          </motion.div>

          {/* Main Headline */}
          <div className="w-full">
            <h1
              ref={headlineRef}
              className="font-kanit font-black uppercase tracking-tight leading-[1.08] text-left select-none text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[54px]"
            >
              <span className="block text-white mb-1.5 sm:mb-2">
                {renderWords(HERO_DATA.headlineP1, false)}
              </span>
              <span className="block text-[#00D2F6]">
                {renderWords(HERO_DATA.headlineP2, true)}
              </span>
            </h1>
          </div>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[#AEB7C4] text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-2xl"
          >
            {HERO_DATA.subtext}
          </motion.p>

          {/* SLA Delivery Timelines (3, 7, 10 Days Guarantee) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 py-2"
          >
            {HERO_DATA.slaBadges.map((badge, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[#080D18]/90 border border-[#151F38] hover:border-[#00D2F6]/50 transition-all duration-300 group shadow-lg"
              >
                <div className="flex items-center gap-2 mb-1">
                  {badge.icon === 'zap' && <Zap className="w-4 h-4 text-[#00D2F6] group-hover:scale-110 transition-transform" />}
                  {badge.icon === 'bot' && <Bot className="w-4 h-4 text-[#0096F5] group-hover:scale-110 transition-transform" />}
                  {badge.icon === 'code' && <Code2 className="w-4 h-4 text-[#015EEF] group-hover:scale-110 transition-transform" />}
                  <span className="text-[11px] font-mono font-bold text-white uppercase">{badge.time}</span>
                </div>
                <div className="text-xs text-[#AEB7C4] font-medium">{badge.type}</div>
              </div>
            ))}
          </motion.div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto"
          >
            <a
              href={createQuickWhatsAppUrl('Novo Projeto pelo Hero')}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-full text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #00D2F6 0%, #0096F5 50%, #015EEF 100%)',
                boxShadow: '0px 4px 22px rgba(0, 210, 246, 0.45), inset 0px 1px 2px rgba(255, 255, 255, 0.6)',
                outline: '2px solid white',
                outlineOffset: '-2px',
              }}
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                INICIAR PROJETO NO WHATSAPP →
              </span>
            </a>

            <a
              href="#projects"
              className="w-full sm:w-auto px-7 py-4 rounded-full border border-[#151F38] hover:border-[#00D2F6] bg-[#080D18]/80 text-[#AEB7C4] hover:text-[#00D2F6] text-xs sm:text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>{HERO_DATA.secondaryCta}</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        </div>

        {/* Right Column: Executive Portrait in High-Tech Glass Frame (5 cols on lg) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-5 relative flex items-center justify-center"
        >
          {/* Main Frame Container */}
          <div className="relative w-full max-w-[400px]">
            {/* Real Executive Portrait Image Box */}
            <div className="relative w-full aspect-[4/5] rounded-[32px] sm:rounded-[40px] overflow-hidden bg-[#080D18] border border-[#151F38] shadow-2xl p-2 group hover:border-[#00D2F6]/60 transition-all duration-500">
              <div className="relative w-full h-full rounded-[26px] sm:rounded-[34px] overflow-hidden">
                <img
                  src="/assets/branding/thiago_executive.jpg"
                  alt="Thiago Cassol Antunes - Diretor de Tecnologia & Engenharia de IA"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />

                {/* Gradient Bottom Scrim */}
                <div className="absolute inset-x-0 bottom-0 pt-20 pb-5 px-5 bg-gradient-to-t from-[#050914] via-[#050914]/85 to-transparent flex flex-col justify-end text-left">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#00D2F6] uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#00D2F6]" />
                    <span>Thiago Cassol Antunes</span>
                  </div>
                  <div className="text-sm font-bold text-white uppercase tracking-tight font-kanit">
                    Full-Stack & Applied AI Engineer
                  </div>
                  <div className="text-xs text-[#AEB7C4] font-light mt-0.5">
                    5+ Anos Desenvolvendo Ativos Digitais
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Trust Badge 1: Top Right */}
            <div className="absolute -top-3 -right-3 px-3.5 py-1.5 rounded-xl bg-[#050914] border border-[#00D2F6]/50 backdrop-blur-md shadow-2xl flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold text-[#00D2F6] z-20">
              <Clock className="w-3.5 h-3.5 text-[#00D2F6]" />
              <span>3 A 10 DIAS ÚTEIS</span>
            </div>

            {/* Floating Trust Badge 2: Bottom Left */}
            <div className="absolute -bottom-3 -left-3 px-3.5 py-1.5 rounded-xl bg-[#050914] border border-emerald-500/50 backdrop-blur-md shadow-2xl flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold text-emerald-400 z-20">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>CÓDIGO 100% PROPRIETÁRIO</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
