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
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
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
      {/* Editorial Floating Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-8 pt-3 sm:pt-4 transition-all duration-300 pointer-events-none">
        <div
          className={`max-w-7xl mx-auto pointer-events-auto rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isScrolled
              ? 'bg-[#07111F]/92 backdrop-blur-2xl border border-white/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] py-2 px-3.5 sm:px-6'
              : 'bg-[#07111F]/40 backdrop-blur-md border border-white/[0.04] shadow-[0_8px_24px_rgba(0,0,0,0.4)] py-2.5 sm:py-3 px-3.5 sm:px-6'
          } flex items-center justify-between gap-3 sm:gap-6`}
        >
          {/* 1. Brand Lockup: Logo + Thiago Cassol Antunes + Tecnologia & IA */}
          <a
            href="#hero"
            className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D2F6] rounded-lg"
            aria-label="Thiago Cassol Antunes — Página Inicial"
          >
            {/* Logo Oficial com Dimensões Controladas */}
            <div className="h-7 sm:h-8 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <img
                src="/logo_tca.png"
                alt="Logo TCA"
                className="h-full w-auto max-h-7 sm:max-h-8 object-contain block drop-shadow-[0_2px_10px_rgba(0,210,246,0.25)]"
                loading="eager"
              />
            </div>

            {/* Tipografia de Marca: Autoridade Discreta */}
            <div className="flex flex-col text-left">
              <span className="font-kanit font-extrabold text-xs sm:text-[13px] tracking-wide text-[#F8FAFC] uppercase group-hover:text-[#00D2F6] transition-colors leading-tight">
                THIAGO CASSOL ANTUNES
              </span>
              <span className="text-[9px] font-mono text-[#00D2F6] tracking-widest uppercase font-semibold leading-tight mt-0.5">
                TECNOLOGIA & IA
              </span>
            </div>
          </a>

          {/* 2. Desktop Centered Navigation Links with Editorial Hover Indicator */}
          <nav
            className="hidden lg:flex items-center gap-1 xl:gap-1.5 px-3 py-1 rounded-full bg-white/[0.02] border border-white/[0.05]"
            aria-label="Navegação principal"
          >
            {navLinks.map((link) => {
              const isHovered = hoveredLink === link.label;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onMouseEnter={() => setHoveredLink(link.label)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="relative px-3 py-1 text-[11px] xl:text-[12px] uppercase font-medium tracking-wider text-[#94A3B8] hover:text-[#F8FAFC] transition-colors duration-200 whitespace-nowrap focus:outline-none focus-visible:text-[#00D2F6]"
                >
                  {isHovered && (
                    <motion.div
                      layoutId="navHoverPill"
                      className="absolute inset-0 rounded-full bg-white/[0.06] border border-white/[0.08]"
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              );
            })}
          </nav>

          {/* 3. Right Action Area: Scarcity Badge + WhatsApp Action + Mobile Trigger */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Scarcity Pill: Discreta, Controlada, Elegante */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1624] border border-[#00D2F6]/25 text-[10px] font-mono text-[#00D2F6] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D2F6] animate-pulse" />
              <span>2 VAGAS ESTE MÊS</span>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-[#94A3B8] hover:text-white hover:border-[#00D2F6]/40 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D2F6]"
              aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Editorial Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-18 z-40 bg-[#07111F]/98 border border-white/10 backdrop-blur-3xl rounded-3xl p-5 lg:hidden flex flex-col gap-2 shadow-[0_20px_50px_rgba(5,11,20,0.9)] pointer-events-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-1">
              <span className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-widest">
                NAVEGAÇÃO TCA
              </span>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00D2F6]/10 border border-[#00D2F6]/30 text-[10px] font-mono text-[#00D2F6] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D2F6]" />
                <span>2 Vagas</span>
              </div>
            </div>

            {navLinks.map((link, idx) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="text-xs uppercase font-semibold text-[#F8FAFC] hover:text-[#00D2F6] transition-colors py-2.5 border-b border-white/[0.04] flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#64748B]" />
              </motion.a>
            ))}

            <a
              href={createQuickWhatsAppUrl('Novo Projeto Mobile')}
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-full text-center font-bold text-xs uppercase tracking-wider text-white flex items-center justify-center gap-2 shadow-lg bg-gradient-to-r from-[#00D2F6] via-[#0096F5] to-[#015EEF] border border-white/20 mt-3"
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
