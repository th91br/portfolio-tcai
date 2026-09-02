import React from 'react';
import { ChevronUp, MessageCircle, Mail, MapPin, Sparkles, ArrowUpRight } from 'lucide-react';
import { CONTACT_CONFIG, createQuickWhatsAppUrl } from '../../utils/contactUtils';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Início', href: '#hero' },
    { label: 'Soluções & Prazos', href: '#services' },
    { label: 'Por Que a TCAI', href: '#why-us' },
    { label: 'Cases Reais', href: '#projects' },
    { label: 'Método Ágil', href: '#process' },
    { label: 'Sobre Mim', href: '#about' },
    { label: 'Contato', href: '#contact' },
  ];

  return (
    <footer className="relative w-full bg-[#050B14] text-[#F3F5F7] border-t border-white/[0.06] pt-16 sm:pt-20 pb-8 px-4 sm:px-6 md:px-10 overflow-hidden select-none z-20">
      {/* 1. Subtle Background Depth Watermark */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none z-0 opacity-[0.02] flex items-center justify-center"
        aria-hidden="true"
      >
        <span className="font-kanit font-black text-[22vw] leading-none tracking-tighter text-white uppercase whitespace-nowrap">
          TCAI
        </span>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* 2. Main Institutional Grid (12 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/[0.06]">
          
          {/* Column 1: Brand Lockup & Strategic Positioning (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-start space-y-4">
            <a
              href="#hero"
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D2F6] rounded-lg"
              aria-label="Voltar ao início do site TCAI"
            >
              <div className="h-8 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/logo_tca.png"
                  alt="Logo Oficial TCA"
                  className="h-full w-auto max-h-8 object-contain block drop-shadow-[0_2px_10px_rgba(0,210,246,0.25)]"
                  loading="lazy"
                />
              </div>

              <div className="flex flex-col text-left">
                <span className="font-kanit font-extrabold text-sm tracking-wide text-[#F8FAFC] uppercase group-hover:text-[#00D2F6] transition-colors leading-tight">
                  THIAGO CASSOL ANTUNES
                </span>
                <span className="text-[9px] font-mono text-[#00D2F6] tracking-widest uppercase font-semibold leading-tight mt-0.5">
                  TECNOLOGIA & IA
                </span>
              </div>
            </a>

            <p className="text-xs sm:text-[13px] text-[#94A3B8] font-light leading-relaxed max-w-[42ch]">
              Engenharia de software sob medida, ativos digitais de alta conversão e inteligência artificial aplicada. Construído para empresas que exigem excelência técnica sem intermediários.
            </p>

            {/* Availability Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#08131F] border border-[#00D2F6]/20 text-[10px] font-mono text-[#00D2F6] font-semibold shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D2F6] animate-pulse" />
              <span>DISPONIBILIDADE: 2 PROJETOS PARA ESTE MÊS</span>
            </div>
          </div>

          {/* Column 2: Navigation Links (3 cols) */}
          <div className="lg:col-span-3 flex flex-col items-start space-y-3">
            <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-widest font-bold">
              // NAVEGAÇÃO ESTRATÉGICA
            </span>

            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs text-[#94A3B8] hover:text-[#00D2F6] transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-transparent group-hover:bg-[#00D2F6] transition-colors" />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Direct Channels & Location (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-start space-y-4">
            <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-widest font-bold">
              // ALINHAMENTO DIRETO COM O FUNDADOR
            </span>

            <div className="space-y-2.5 w-full">
              {/* WhatsApp Trigger */}
              <a
                href={createQuickWhatsAppUrl('Rodapé TCAI')}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-[#08131F] border border-white/[0.06] hover:border-[#00D2F6]/40 transition-all text-xs font-mono text-white group shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#00D2F6]" />
                  <span className="font-semibold">WhatsApp Direto</span>
                </div>
                <span className="text-[11px] text-[#00D2F6] font-bold group-hover:translate-x-0.5 transition-transform">
                  {CONTACT_CONFIG.whatsappDisplay}
                </span>
              </a>

              {/* Email */}
              <a
                href={`mailto:${CONTACT_CONFIG.email}`}
                className="flex items-center justify-between p-3 rounded-xl bg-[#08131F] border border-white/[0.06] hover:border-[#00D2F6]/40 transition-all text-xs font-mono text-[#94A3B8] hover:text-white group shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#00D2F6]" />
                  <span>E-mail</span>
                </div>
                <span className="text-[11px] text-[#94A3B8] group-hover:text-[#00D2F6] transition-colors truncate max-w-[180px]">
                  {CONTACT_CONFIG.email}
                </span>
              </a>

              {/* Location */}
              <div className="flex items-center gap-2 text-xs font-mono text-[#64748B] pt-1">
                <MapPin className="w-3.5 h-3.5 text-[#00D2F6] shrink-0" />
                <span>Caxias do Sul / RS • Atendimento Global</span>
              </div>
            </div>
          </div>

        </div>

        {/* 3. Bottom Legal & Back to Top Row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#64748B]">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span>© {currentYear} TCAI • Thiago Cassol Antunes. Todos os direitos reservados.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] text-[#94A3B8]">Código 100% Proprietário</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#00D2F6] transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-white/[0.03]"
              aria-label="Voltar ao início da página"
            >
              <span>Voltar ao topo</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
