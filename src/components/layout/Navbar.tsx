import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageCircle, ArrowUpRight } from 'lucide-react';
import { createQuickWhatsAppUrl } from '../../utils/contactUtils';

interface NavbarProps {
  onContactClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onContactClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Início', href: '#hero' },
    { label: 'Soluções & Prazos', href: '#services' },
    { label: 'Por Que a TCAI', href: '#why-us' },
    { label: 'Cases Reais', href: '#projects' },
    { label: 'Método', href: '#process' },
    { label: 'Sobre Mim', href: '#about' },
    { label: 'Contato', href: '#contact' },
  ];

  return (
    <>
      {/* Floating Island Header Container */}
      <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 pt-3 sm:pt-4 transition-all duration-300 pointer-events-none">
        <div
          className={`max-w-[1300px] mx-auto pointer-events-auto rounded-full transition-all duration-500 ${
            isScrolled
              ? 'bg-[#050914]/90 backdrop-blur-2xl border border-white/12 shadow-[0_16px_40px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] py-2 px-3 sm:px-6'
              : 'bg-[#050914]/75 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] py-2.5 px-3 sm:px-6'
          } flex items-center justify-between gap-2 sm:gap-4`}
        >
          {/* 1. Official Brand Logo Lockup */}
          <a
            href="#hero"
            className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer shrink-0"
            aria-label="Thiago Cassol Antunes - Página Inicial"
          >
            {/* Logo Oficial Transparente com Glow Dinâmico */}
            <div className="h-9 sm:h-11 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <img
                src="/logo_tca.png"
                alt="Logo Oficial TCA - Thiago Cassol Antunes"
                className="h-full w-auto max-h-8 sm:max-h-10 object-contain block drop-shadow-[0_2px_14px_rgba(0,210,246,0.35)]"
                loading="eager"
              />
            </div>

            {/* Brand Typography */}
            <div className="flex flex-col text-left">
              <span className="font-kanit font-extrabold text-xs sm:text-sm tracking-wider text-white uppercase group-hover:text-[#00D2F6] transition-colors leading-tight">
                THIAGO CASSOL ANTUNES
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono text-[#00D2F6] tracking-widest uppercase font-bold leading-tight mt-0.5">
                TECNOLOGIA & IA
              </span>
            </div>
          </a>

          {/* 2. Desktop Centered Navigation Links with Interactive Hover Indicator */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
            {navLinks.map((link) => {
              const isHovered = hoveredLink === link.label;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onMouseEnter={() => setHoveredLink(link.label)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="relative px-3 py-1.5 text-[11px] xl:text-xs uppercase font-semibold tracking-wider text-[#AEB7C4] hover:text-white transition-colors duration-200 whitespace-nowrap"
                >
                  {isHovered && (
                    <motion.div
                      layoutId="navHoverPill"
                      className="absolute inset-0 rounded-full bg-white/[0.08] border border-white/10"
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              );
            })}
          </nav>

          {/* 3. Right Action CTAs & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Availability Pill on Desktop with Harmonized Brand Glow */}
            <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00D2F6]/10 border border-[#00D2F6]/30 text-[10px] font-mono text-[#00D2F6] font-bold shadow-[0_0_15px_rgba(0,210,246,0.15)]">
              <span className="w-2 h-2 rounded-full bg-[#00D2F6] animate-pulse" />
              <span>2 VAGAS ESTE MÊS</span>
            </div>

            {/* Primary Action Button: Button-in-Button Luxury Pattern */}
            <a
              href={createQuickWhatsAppUrl('Novo Projeto pelo Cabeçalho')}
              target="_blank"
              rel="noreferrer"
              className="group relative hidden sm:inline-flex items-center gap-2.5 pl-4 pr-1.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider text-white transition-all duration-300 hover:scale-105 active:scale-[0.98] shadow-xl shadow-[#00D2F6]/25 shrink-0 cursor-pointer whitespace-nowrap bg-gradient-to-r from-[#00D2F6] via-[#0096F5] to-[#015EEF] border border-white/20"
            >
              <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                FALAR NO WHATSAPP
              </span>
              {/* Nested Button-in-Button Circular Icon Pod */}
              <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-white/30 shadow-inner">
                <MessageCircle className="w-3.5 h-3.5 text-white" />
              </span>
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full bg-white/[0.05] border border-white/10 text-[#AEB7C4] hover:text-white hover:border-[#00D2F6]/50 transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu with Staggered Reveals */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 sm:inset-x-6 top-20 z-40 bg-[#050914]/95 border border-white/15 backdrop-blur-3xl rounded-[28px] p-6 lg:hidden flex flex-col gap-3 shadow-2xl"
          >
            {navLinks.map((link, idx) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="text-sm uppercase font-bold text-[#F3F5F7] hover:text-[#00D2F6] transition-colors py-2 border-b border-white/[0.06] flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-4 h-4 text-slate-500" />
              </motion.a>
            ))}

            <div className="flex items-center justify-center gap-2 py-2 px-3 mt-2 rounded-full bg-[#00D2F6]/10 border border-[#00D2F6]/30 text-[11px] font-mono text-[#00D2F6] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#00D2F6] animate-pulse" />
              <span>DISPONIBILIDADE: 2 VAGAS ESTE MÊS</span>
            </div>

            <a
              href={createQuickWhatsAppUrl('Novo Projeto Mobile')}
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 rounded-full text-center font-bold text-xs uppercase tracking-wider text-white flex items-center justify-center gap-2 shadow-lg bg-gradient-to-r from-[#00D2F6] via-[#0096F5] to-[#015EEF] border border-white/20 mt-1"
            >
              <MessageCircle className="w-4 h-4" />
              <span>FALAR COM THIAGO NO WHATSAPP</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
