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
      className="relative w-full bg-[#050914] text-[#F3F5F7] py-24 sm:py-32 px-4 sm:px-6 md:px-10 border-t border-[#151F38] overflow-hidden z-10"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 w-[550px] h-[550px] bg-[#00D2F6]/5 blur-[180px] pointer-events-none rounded-full" />

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
              <div className="relative w-full aspect-[4/5] rounded-[32px] sm:rounded-[40px] overflow-hidden bg-[#080D18] border border-[#151F38] p-2 shadow-2xl group hover:border-[#00D2F6]/50 transition-all duration-500">
                <div className="relative w-full h-full rounded-[26px] sm:rounded-[34px] overflow-hidden">
                  <img
                    src="/assets/branding/thiago_sunset.jpg"
                    alt="Thiago Cassol Antunes - Fundador & Desenvolvedor Estratégico TCAI"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Scrim overlay */}
                  <div className="absolute inset-x-0 bottom-0 pt-16 pb-5 px-5 bg-gradient-to-t from-[#050914] via-[#050914]/85 to-transparent flex flex-col justify-end text-left">
                    <div className="text-xs font-bold text-[#00D2F6] uppercase tracking-wider mb-1">
                      Thiago Cassol Antunes • 35 Anos
                    </div>
                    <div className="text-sm font-bold text-white uppercase tracking-tight font-kanit">
                      Diretor de Tecnologia & Engenharia de IA
                    </div>
                    <div className="text-xs text-[#AEB7C4] font-light">
                      Caxias do Sul / Atendimento Global
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Verified Badge */}
              <div className="absolute -bottom-3 -right-3 px-3.5 py-1.5 rounded-xl bg-[#050914] border border-[#00D2F6]/50 backdrop-blur-md shadow-2xl flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold text-[#00D2F6] z-20">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00D2F6]" />
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#080D18] border border-[#151F38] shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-[#00D2F6]" />
              <span className="text-xs font-mono font-bold tracking-widest text-[#00D2F6] uppercase">
                QUEM ESTÁ POR TRÁS DA SUA SOLUÇÃO
              </span>
            </div>

            <h2 className="font-kanit font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white leading-tight">
              {ABOUT_DATA.heading}
            </h2>

            <div className="text-xs font-mono text-[#00D2F6] font-bold uppercase tracking-wider">
              {ABOUT_DATA.role}
            </div>

            <div className="space-y-4 text-sm sm:text-base text-[#AEB7C4] font-light leading-relaxed">
              <p>
                Sou Thiago Cassol Antunes, tenho 35 anos e sou movido pela curiosidade por tecnologia, inovação e Inteligência Artificial. Há mais de 5 anos estudo, desenvolvo e aplico tecnologia na teoria e na prática, transformando ideias e problemas reais em soluções digitais funcionais.
              </p>
              <p>
                Meu trabalho combina estratégia, agilidade, segurança e experiência do usuário, sempre preservando o branding, a identidade e os objetivos de cada projeto. Não acredito em tecnologia apenas por tecnologia. Acredito em criar aquilo que realmente faz sentido para o negócio.
              </p>
            </div>

            {/* Competencies Grid */}
            <div className="w-full pt-2">
              <div className="text-xs font-mono text-white uppercase font-bold tracking-wider mb-3">
                Pilares de Especialidade Técnica:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
                {competencies.map((comp, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-2.5 rounded-xl bg-[#080D18] border border-[#151F38] flex items-center gap-2.5 text-xs text-[#F3F5F7]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#00D2F6] shrink-0" />
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
                className="w-full sm:w-auto px-8 py-4 rounded-full text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #00D2F6 0%, #0096F5 50%, #015EEF 100%)',
                  boxShadow: '0px 4px 22px rgba(0, 210, 246, 0.45), inset 0px 1px 2px rgba(255, 255, 255, 0.6)',
                  outline: '2px solid white',
                  outlineOffset: '-2px',
                }}
              >
                <MessageCircle className="w-4 h-4" />
                <span>{ABOUT_DATA.ctaButton}</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
