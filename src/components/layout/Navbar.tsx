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
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#050914]/95 backdrop-blur-xl border-b border-[#151F38] py-2.5 shadow-2xl'
            : 'bg-transparent py-4 sm:py-5'
        }`}
      >
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 lg:gap-5">
          
          {/* 1. Official Brand Logo */}
          <a
            href="#hero"
            className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer shrink-0"
            aria-label="Thiago Cassol Antunes - Página Inicial"
          >
            {/* Official Logo Badge */}
            <div className="h-9 sm:h-10 px-2 py-0.5 bg-white rounded-xl shadow-lg shadow-[#00D2F6]/10 border border-white/20 flex items-center justify-center group-hover:scale-105 group-hover:shadow-[#00D2F6]/30 transition-all duration-300">
              <img
                src="/assets/branding/tca_logo.png"
                alt="Logo Oficial TCA - Thiago Cassol Antunes"
                className="h-full w-auto max-h-6 sm:max-h-7 object-contain block"
                loading="eager"
              />
            </div>

            {/* Brand Typography */}
            <div className="flex flex-col">
              <span className="font-kanit font-extrabold text-xs sm:text-sm tracking-wider text-white uppercase group-hover:text-[#00D2F6] transition-colors leading-tight">
                THIAGO CASSOL ANTUNES
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono text-[#00D2F6] tracking-widest uppercase font-bold leading-tight mt-0.5">
                TECNOLOGIA & IA
              </span>
            </div>
          </a>

          {/* 2. Desktop Centered Navigation Links */}
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-5 px-4.5 xl:px-5 py-2 rounded-full bg-[#080D18]/90 border border-[#151F38] backdrop-blur-md shadow-lg shadow-black/40">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[11px] xl:text-xs uppercase font-semibold tracking-wider text-[#AEB7C4] hover:text-[#00D2F6] transition-colors relative py-0.5 whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* 3. Right Action CTAs & Mobile Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Availability Pill on Desktop */}
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#080D18] border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-bold shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>2 VAGAS ESTE MÊS</span>
            </div>

            {/* Primary Action Button */}
            <a
              href={createQuickWhatsAppUrl('Novo Projeto pelo Cabeçalho')}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:scale-105 shadow-xl shadow-[#00D2F6]/25 shrink-0 cursor-pointer whitespace-nowrap"
              style={{
                background: 'linear-gradient(135deg, #00D2F6 0%, #0096F5 50%, #015EEF 100%)',
                outline: '2px solid white',
                outlineOffset: '-2px',
              }}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>FALAR NO WHATSAPP</span>
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#080D18] border border-[#151F38] text-[#AEB7C4] hover:text-white hover:border-[#00D2F6]/50 transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[60px] z-40 bg-[#050914]/98 border-b border-[#151F38] backdrop-blur-2xl p-6 lg:hidden flex flex-col gap-4 shadow-2xl"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base uppercase font-bold text-[#F3F5F7] hover:text-[#00D2F6] transition-colors py-2.5 border-b border-[#151F38]/50 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-4 h-4 text-slate-500" />
              </a>
            ))}

            <a
              href={createQuickWhatsAppUrl('Novo Projeto Mobile')}
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full mt-2 py-3.5 rounded-full text-center font-bold text-xs uppercase tracking-wider text-white flex items-center justify-center gap-2 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #00D2F6 0%, #0096F5 50%, #015EEF 100%)',
                outline: '2px solid white',
                outlineOffset: '-2px',
              }}
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
