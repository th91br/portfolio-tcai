import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageCircle, CheckCircle2, ShieldCheck, Terminal, Cpu } from 'lucide-react';
import { ABOUT_DATA } from '../../data/portfolioData';
import { createQuickWhatsAppUrl } from '../../utils/contactUtils';

export const AboutExecutive: React.FC = () => {
  const competencies = [
    'Arquitetura Full-Stack Moderna',
    'Inteligência Artificial Aplicada',
    'Design de Alta Conversão (UI/UX)',
    'APIs, Bancos de Dados & Cloud',
    'Estratégia de Negócios & Escala',
    'Segurança & Código Proprietário',
  ];

  return (
    <section
      id="about"
      className="relative w-full bg-[#F8FAFC] text-[#0F172A] py-24 sm:py-32 px-4 sm:px-6 md:px-10 border-t border-slate-200/80 overflow-hidden z-10"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 w-[550px] h-[550px] bg-sky-100/50 blur-[180px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Thiago Skyline Portrait (5 cols on lg) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 relative flex justify-center"
          >
            <div className="relative w-full max-w-[420px]">
              <div className="relative w-full aspect-[4/5] rounded-[32px] sm:rounded-[40px] overflow-hidden bg-white border-2 border-slate-200/90 p-2 shadow-[0_20px_50px_rgba(15,23,42,0.08)] group hover:border-[#0284C7]/50 transition-all duration-500">
                <div className="relative w-full h-full rounded-[26px] sm:rounded-[34px] overflow-hidden bg-slate-100">
                  <img
                    src="/assets/branding/thiago_sunset.jpg"
                    alt="Thiago Cassol Antunes - Fundador & Desenvolvedor Estratégico TCAI"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Scrim overlay */}
                  <div className="absolute inset-x-0 bottom-0 pt-16 pb-5 px-5 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex flex-col justify-end text-left text-white">
                    <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">
                      Thiago Cassol Antunes • 35 Anos
                    </div>
                    <div className="text-sm font-bold text-white uppercase tracking-tight font-kanit">
                      Diretor de Tecnologia & Engenharia de IA
                    </div>
                    <div className="text-xs text-slate-300 font-light">
                      Caxias do Sul / Atendimento Global
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Verified Badge */}
              <div className="absolute -bottom-3 -right-3 px-3.5 py-1.5 rounded-xl bg-white border border-[#0284C7]/50 backdrop-blur-md shadow-xl flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold text-[#0284C7] z-20">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>EXPERIÊNCIA PRÁTICA 5+ ANOS</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Founder Story & Authority (7 cols on lg) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 flex flex-col items-start space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
              <span className="text-xs font-mono font-bold tracking-widest text-[#0284C7] uppercase">
                QUEM ESTÁ POR TRÁS DA SUA SOLUÇÃO
              </span>
            </div>

            <h2 className="font-kanit font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#090D1A] leading-tight">
              {ABOUT_DATA.heading}
            </h2>

            <div className="text-xs font-mono text-[#0284C7] font-bold uppercase tracking-wider">
              {ABOUT_DATA.role}
            </div>

            <div className="space-y-4 text-sm sm:text-base text-[#475569] font-normal leading-relaxed">
              <p>
                Sou Thiago Cassol Antunes, tenho 35 anos e sou movido pela curiosidade por tecnologia, inovação e Inteligência Artificial. Há mais de 5 anos estudo, desenvolvo e aplico tecnologia na teoria e na prática, transformando ideias e problemas reais em soluções digitais funcionais.
              </p>
              <p>
                Meu trabalho combina estratégia, agilidade, segurança e experiência do usuário, sempre preservando o branding, a identidade e os objetivos de cada projeto. Não acredito em tecnologia apenas por tecnologia. Acredito em criar aquilo que realmente faz sentido para o negócio.
              </p>
            </div>

            {/* Competencies Grid */}
            <div className="w-full pt-2">
              <div className="text-xs font-mono text-slate-800 uppercase font-bold tracking-wider mb-3">
                Pilares de Especialidade Técnica:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
                {competencies.map((comp, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2.5 text-xs text-slate-800 font-medium shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                    <span>{comp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct CTA */}
            <div className="pt-4 w-full sm:w-auto">
              <a
                href={createQuickWhatsAppUrl('Conversa Direta com Thiago')}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-full text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer bg-gradient-to-r from-[#0284C7] via-[#0096F5] to-[#015EEF]"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span className="font-kanit tracking-wide">{ABOUT_DATA.ctaButton}</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutExecutive;
