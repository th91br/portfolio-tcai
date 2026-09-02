import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Globe,
  Bot,
  Cpu,
} from 'lucide-react';
import { CORE_OFFERS } from '../../data/portfolioData';
import { createWhatsAppLeadUrl } from '../../utils/contactUtils';

export const CoreServicesSection: React.FC = () => {
  const handleServiceClick = (serviceName: string, sla: string) => {
    const url = createWhatsAppLeadUrl({
      name: '',
      contact: '',
      interest: `${serviceName} (${sla})`,
      message: `Olá Thiago! Gostaria de alinhar o escopo para contratação de ${serviceName} com prazo de ${sla}.`,
      origin: 'Seção de Soluções & Prazos (TCAI)',
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getIconForIndex = (index: number) => {
    switch (index) {
      case 0:
        return <Globe className="w-5 h-5 text-[#00D2F6]" />;
      case 1:
        return <Bot className="w-5 h-5 text-[#0096F5]" />;
      case 2:
        return <Cpu className="w-5 h-5 text-[#015EEF]" />;
      default:
        return <Globe className="w-5 h-5 text-[#00D2F6]" />;
    }
  };

  return (
    <section
      id="services"
      className="relative w-full bg-[#07111F] text-[#F3F5F7] py-24 sm:py-32 px-4 sm:px-6 md:px-10 border-t border-white/[0.06] overflow-hidden z-10"
    >
      {/* Ambient background glows */}
      <div
        className="absolute top-1/3 right-1/4 translate-x-1/2 w-[550px] h-[550px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0, 210, 246, 0.04) 0%, transparent 70%)',
          filter: 'blur(160px)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Header Editorial */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1624] border border-[#00D2F6]/25 shadow-sm mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D2F6]" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#00D2F6] uppercase">
                03 / CAPACIDADES & PRAZOS
              </span>
            </div>

            <h2 className="font-kanit font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#F8FAFC] leading-[1.08]">
              O QUE EU CONSTRUO & <br />
              <span className="bg-gradient-to-r from-[#00D2F6] via-[#0096F5] to-[#015EEF] bg-clip-text text-transparent">
                PRAZOS GARANTIDOS EM CONTRATO
              </span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#94A3B8] font-light leading-relaxed max-w-[42ch]">
            Ativos digitais de alta conversão e software proprietário. Três pilares de especialização técnica com cronogramas objetivos e zero enrolação.
          </p>
        </div>

        {/* 3 Architectural Columns with Monumental Typography */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-white/[0.08] rounded-3xl bg-[#08131F]/70 backdrop-blur-xl overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08]">
          {CORE_OFFERS.map((offer, index) => {
            // Extract numeric days (03, 07, 10)
            const dayNumber = offer.sla.replace(/\D/g, '').padStart(2, '0');
            
            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className="p-7 sm:p-9 flex flex-col justify-between group hover:bg-white/[0.015] transition-colors duration-300"
              >
                <div>
                  {/* Top Row: Index + Icon */}
                  <div className="flex items-center justify-between gap-4 mb-8">
                    <span className="text-xs font-mono font-bold text-[#64748B] tracking-widest uppercase">
                      ESPECIALIDADE {offer.number}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center group-hover:border-[#00D2F6]/40 transition-colors">
                      {getIconForIndex(index)}
                    </div>
                  </div>

                  {/* Monumental SLA Timeline Display */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="font-kanit font-black text-5xl sm:text-6xl text-[#F8FAFC] tracking-tight group-hover:text-[#00D2F6] transition-colors">
                        {dayNumber}
                      </span>
                      <div className="flex flex-col text-left">
                        <span className="font-mono font-bold text-xs text-[#00D2F6] uppercase tracking-wider leading-tight">
                          DIAS ÚTEIS
                        </span>
                        <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider leading-tight">
                          ENTREGA GARANTIDA
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="font-kanit font-black text-xl sm:text-2xl text-white uppercase tracking-tight mb-2 group-hover:text-[#00D2F6] transition-colors">
                    {offer.name}
                  </h3>

                  <p className="text-xs sm:text-[13px] text-[#94A3B8] font-light leading-relaxed mb-6">
                    {offer.tagline}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="space-y-2.5 mb-8 border-t border-white/[0.06] pt-5">
                    {offer.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-[#AEB7C4]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00D2F6] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Trigger */}
                <button
                  type="button"
                  onClick={() => handleServiceClick(offer.name, offer.sla)}
                  className="w-full py-3 px-4 rounded-xl bg-white/[0.03] hover:bg-[#00D2F6] text-white hover:text-black border border-white/[0.08] hover:border-[#00D2F6] text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-between transition-all duration-300 cursor-pointer group/btn"
                >
                  <span>ALINHAR ESCOPO DESTE PILAR</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Assurance Banner */}
        <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-[#08131F]/60 border border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm text-[#AEB7C4] font-medium text-center sm:text-left">
              Prazos calculados a partir da aprovação do escopo. Cronograma diário com acompanhamento em tempo real.
            </span>
          </div>
          <span className="text-xs font-mono text-[#00D2F6] font-semibold whitespace-nowrap">
            Zero intermediários • Alinhamento Direto
          </span>
        </div>

      </div>
    </section>
  );
};

export default CoreServicesSection;
