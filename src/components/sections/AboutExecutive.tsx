import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ABOUT_DATA } from '../../data/portfolioData';
import { createQuickWhatsAppUrl } from '../../utils/contactUtils';

export const AboutExecutive: React.FC = () => {
  const competencies = [
    'Arquitetura Full-Stack Moderna',
    'Inteligência Artificial & Agentes Autônomos',
    'Design de Alta Conversão (UI/UX)',
    'APIs, Bancos de Dados & Cloud',
    'Estratégia de Negócios & Escala',
    'Segurança & Código 100% Proprietário',
  ];

  return (
    <section
      id="about"
      className="relative w-full bg-[#08131F] text-[#F3F5F7] py-24 sm:py-32 px-4 sm:px-6 md:px-10 border-t border-white/[0.06] overflow-hidden z-10"
    >
      {/* Ambient background studio glow */}
      <div
        className="absolute top-1/3 right-1/4 translate-x-1/2 w-[550px] h-[550px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0, 210, 246, 0.04) 0%, transparent 70%)',
          filter: 'blur(160px)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Human Editorial Portrait (5 cols on lg) */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 relative flex justify-center"
          >
            <div className="relative w-full max-w-[420px]">
              {/* Studio Frame with Chiaroscuro Tone */}
              <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden bg-[#050B14] border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.85)] group hover:border-[#00D2F6]/40 transition-colors duration-500">
                {/* 2ª Imagem: quem.novo */}
                <img
                  src="/quem.novo.png"
                  alt="Thiago Cassol Antunes — Arquiteto de Software & Engenheiro de IA"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-102 select-none"
                  style={{
                    imageRendering: '-webkit-optimize-contrast',
                    transform: 'translateZ(0)',
                  }}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />

                {/* Scrim Overlay with Identity Details */}
                <div className="absolute inset-x-0 bottom-0 pt-16 pb-5 px-5 bg-gradient-to-t from-[#050B14] via-[#050B14]/80 to-transparent flex flex-col justify-end text-left text-white">
                  <div className="text-xs font-bold text-[#00D2F6] uppercase tracking-wider mb-0.5">
                    Thiago Cassol Antunes • 35 Anos
                  </div>
                  <div className="text-sm font-bold text-white uppercase tracking-tight font-kanit">
                    Tecnologia & IA • Caxias do Sul / Global
                  </div>
                </div>
              </div>

              {/* Proven Experience Badge */}
              <div className="absolute -bottom-3 -right-3 px-3.5 py-1.5 rounded-xl bg-[#0A1624] border border-[#00D2F6]/30 shadow-2xl flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold text-[#00D2F6] z-20">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00D2F6]" />
                <span>EXPERIÊNCIA PRÁTICA 5+ ANOS</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Narrative & Technical Authority (7 cols on lg) */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 flex flex-col items-start space-y-5"
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1624] border border-[#00D2F6]/25 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D2F6]" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#00D2F6] uppercase">
                06 / IDENTIDADE & FUNDADOR
              </span>
            </div>

            {/* Headline */}
            <h2 className="font-kanit font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#F8FAFC] leading-[1.08]">
              QUEM ESTÁ POR TRÁS DA <br />
              <span className="bg-gradient-to-r from-[#00D2F6] via-[#0096F5] to-[#015EEF] bg-clip-text text-transparent">
                SUA SOLUÇÃO DIGITAL
              </span>
            </h2>

            <div className="text-xs font-mono text-[#00D2F6] font-bold uppercase tracking-wider">
              {ABOUT_DATA.role}
            </div>

            {/* Narrative Manifesto */}
            <div className="space-y-3.5 text-sm sm:text-base text-[#94A3B8] font-light leading-relaxed">
              <p>
                Sou Thiago Cassol Antunes, tenho 35 anos e sou movido pela curiosidade por tecnologia, inovação e Inteligência Artificial. Há mais de 5 anos estudo, desenvolvo e aplico tecnologia na teoria e na prática, transformando ideias e problemas reais em soluções digitais funcionais.
              </p>
              <p>
                Meu trabalho combina estratégia, agilidade, segurança e experiência do usuário, sempre preservando o branding, a identidade e os objetivos de cada projeto. Não acredito em tecnologia apenas por tecnologia. Acredito em criar aquilo que realmente faz sentido para o negócio e gera retorno financeiro.
              </p>
            </div>

            {/* Technical Pillars Grid */}
            <div className="w-full pt-2">
              <div className="text-xs font-mono text-[#AEB7C4] uppercase font-bold tracking-wider mb-2.5">
                Especialidades Técnicas de Execução:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                {competencies.map((comp, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-2.5 rounded-xl bg-[#0A1624]/70 border border-white/[0.06] flex items-center gap-2.5 text-xs text-[#F1F5F9] font-medium shadow-sm hover:border-[#00D2F6]/30 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00D2F6] shrink-0" />
                    <span>{comp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct WhatsApp Action */}
            <div className="pt-3 w-full sm:w-auto">
              <a
                href={createQuickWhatsAppUrl('Conversa com Thiago')}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl hover:scale-102 transition-all duration-300 cursor-pointer bg-gradient-to-r from-[#00D2F6] via-[#0096F5] to-[#015EEF] border border-white/20"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span className="font-kanit tracking-wide">CONVERSAR DIRETAMENTE COM THIAGO</span>
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AboutExecutive;
