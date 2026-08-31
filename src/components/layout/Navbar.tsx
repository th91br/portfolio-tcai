import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageCircle, Sparkles, ArrowUpRight } from 'lucide-react';
import { CONTACT_CONFIG, createQuickWhatsAppUrl } from '../../utils/contactUtils';

interface NavbarProps {
  onContactClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onContactClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
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
            ? 'bg-[#050914]/90 backdrop-blur-md border-b border-[#151F38]/80 py-3.5 shadow-2xl'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#hero"
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D2F6] via-[#0096F5] to-[#015EEF] p-[1.5px] shadow-lg shadow-[#00D2F6]/20 group-hover:shadow-[#00D2F6]/40 transition-all">
              <div className="w-full h-full bg-[#050914] rounded-[10px] flex items-center justify-center font-kanit font-black text-lg text-white group-hover:text-[#00D2F6] transition-colors">
                TCA
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-kanit font-bold text-sm tracking-wider text-white uppercase group-hover:text-[#00D2F6] transition-colors">
                THIAGO CASSOL ANTUNES
              </span>
              <span className="text-[10px] font-mono text-[#00D2F6] tracking-widest uppercase">
                TECNOLOGIA & IA
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 px-5 py-2 rounded-full bg-[#080D18]/80 border border-[#151F38] backdrop-blur-md">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs uppercase font-medium tracking-wider text-[#AEB7C4] hover:text-[#00D2F6] transition-colors relative py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action CTA & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* Availability Pill on Desktop */}
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#080D18] border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>2 VAGAS ESTE MÊS</span>
            </div>

            <a
              href={createQuickWhatsAppUrl('Novo Projeto')}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-[#00D2F6]/20"
              style={{
                background: 'linear-gradient(135deg, #00D2F6 0%, #0096F5 50%, #015EEF 100%)',
                outline: '2px solid white',
                outlineOffset: '-2px',
              }}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>FALAR NO WHATSAPP</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#080D18] border border-[#151F38] text-[#AEB7C4] hover:text-white"
              aria-label="Abrir menu"
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[65px] z-40 bg-[#050914]/98 border-b border-[#151F38] backdrop-blur-2xl p-6 lg:hidden flex flex-col gap-4 shadow-2xl"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base uppercase font-bold text-[#F3F5F7] hover:text-[#00D2F6] transition-colors py-2 border-b border-[#151F38]/50 flex items-center justify-between"
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
              className="w-full mt-2 py-3.5 rounded-full text-center font-bold text-xs uppercase tracking-wider text-white flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #00D2F6 0%, #0096F5 50%, #015EEF 100%)',
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
