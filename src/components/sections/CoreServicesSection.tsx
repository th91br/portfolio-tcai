import React from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Bot,
  Code2,
  CheckCircle2,
  ArrowRight,
  Clock,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import { CORE_OFFERS } from '../../data/portfolioData';
import { createWhatsAppLeadUrl } from '../../utils/contactUtils';

export const CoreServicesSection: React.FC = () => {
  const handleServiceClick = (serviceName: string, sla: string) => {
    const url = createWhatsAppLeadUrl({
      name: '',
      contact: '',
      interest: `${serviceName} (${sla})`,
      message: `Olá Thiago! Tenho interesse na contratação de ${serviceName} com prazo de ${sla}. Gostaria de alinhar o escopo e orçamento.`,
      origin: 'Seção de Soluções & Prazos (TCAI)',
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="services"
      className="relative w-full bg-[#050914] text-[#F3F5F7] py-24 sm:py-32 px-4 sm:px-6 md:px-10 border-t border-[#151F38] overflow-hidden z-10"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[550px] h-[550px] bg-[#00D2F6]/5 blur-[180px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-[550px] h-[550px] bg-[#015EEF]/5 blur-[180px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#080D18] border border-[#151F38] shadow-inner mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#00D2F6]" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#00D2F6] uppercase">
              SOLUÇÕES DE ALTO PADRÃO
            </span>
          </div>

          <h2 className="font-kanit font-black text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white mb-4">
            O QUE EU DESENVOLVO & PRAZOS
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-[#AEB7C4] font-light leading-relaxed">
            Ativos digitais construídos com código limpo, inteligência artificial e foco absoluto em retorno financeiro. Escolha o pilar ideal para sua empresa:
          </p>
        </div>

        {/* 3 Core Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {CORE_OFFERS.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              onClick={() => handleServiceClick(offer.name, offer.sla)}
              className="group relative rounded-3xl bg-[#080D18] border border-[#151F38] hover:border-[#00D2F6]/60 p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
            >
              {/* Card top lighting accent */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#00D2F6]/10 to-transparent rounded-full blur-2xl pointer-events-none group-hover:from-[#00D2F6]/25 transition-all duration-500" />

              <div>
                {/* Header: Number & SLA Badge */}
                <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[#151F38]">
                  <span className="font-kanit font-black text-3xl sm:text-4xl text-[#151F38] group-hover:text-[#00D2F6] transition-colors select-none">
                    {offer.number}
                  </span>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#050914] border border-[#00D2F6]/30 text-xs font-mono font-bold text-[#00D2F6] shadow-sm">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{offer.sla}</span>
                  </div>
                </div>

                {/* Category & Title */}
                <div className="mb-4">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#00D2F6]">
                    {offer.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white mt-1 group-hover:text-[#00D2F6] transition-colors font-kanit">
                    {offer.name}
                  </h3>
                </div>

                {/* Tagline */}
                <p className="text-xs sm:text-sm text-[#AEB7C4] font-light leading-relaxed mb-6">
                  {offer.tagline}
                </p>

                {/* Feature Bullet List */}
                <div className="space-y-2.5 mb-6">
                  {offer.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-[#F3F5F7]/90 font-light">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Footer & Action */}
              <div className="pt-4 border-t border-[#151F38] mt-4 flex items-center justify-between">
                <div className="text-[11px] font-mono text-[#AEB7C4]/70">
                  {offer.slaHighlight}
                </div>
                <div className="w-9 h-9 rounded-full bg-[#050914] border border-[#151F38] group-hover:border-[#00D2F6] group-hover:bg-[#00D2F6]/10 flex items-center justify-center text-[#AEB7C4] group-hover:text-[#00D2F6] transition-all">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-[#080D18] border border-[#151F38] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white uppercase tracking-wider">
                Garantia de Entrega no Prazo ou Ajustes Prioritários Imediatos
              </div>
              <div className="text-xs text-[#AEB7C4] font-light">
                Transparência absoluta, cronograma claro e acompanhamento diário do progresso.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleServiceClick('Consultoria Inicial', 'Análise Express')}
            className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
          >
            TIRAR DÚVIDAS NO WHATSAPP
          </button>
        </div>
      </div>
    </section>
  );
};
