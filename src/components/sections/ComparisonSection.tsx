import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { createQuickWhatsAppUrl } from '../../utils/contactUtils';

interface ComparisonRow {
  axis: string;
  traditional: string;
  tcai: string;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    axis: 'Alinhamento & Comunicação',
    traditional: 'Gerentes de conta e intermediários que não entendem de código nem de produto.',
    tcai: 'Conversa direta com Thiago Cassol Antunes. Zero ruído, decisões imediatas.',
  },
  {
    axis: 'Velocidade & Prazos de Entrega',
    traditional: 'Semanas perdidas em reuniões vazias com entregas de 45 a 90 dias.',
    tcai: 'Ciclos ágeis e sprint focado com entrega garantida de 3 a 10 dias úteis.',
  },
  {
    axis: 'Arquitetura & Propriedade do Código',
    traditional: 'Templates prontos de WordPress pesados, lentos e reféns de mensalidades.',
    tcai: 'Código 100% proprietário, limpo, ultra-rápido e totalmente seu. Sem mensalidade surpresa.',
  },
  {
    axis: 'Inteligência Artificial & Automação',
    traditional: 'Uso amador de prompts genéricos sem nenhuma integração com seu negócio.',
    tcai: 'Agentes autônomos e automações integradas a bancos de dados, APIs e WhatsApp.',
  },
];

export const ComparisonSection: React.FC = () => {
  return (
    <section
      id="why-us"
      className="relative w-full bg-[#08131F] text-[#F3F5F7] py-24 sm:py-32 px-4 sm:px-6 md:px-10 border-t border-white/[0.06] overflow-hidden z-10"
    >
      {/* Subtle Studio Glow */}
      <div
        className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0, 210, 246, 0.04) 0%, transparent 70%)',
          filter: 'blur(140px)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Lado A: Grande Afirmação Editorial & Manifesto Comercial (5 cols on lg) */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col items-start space-y-5 lg:sticky lg:top-32"
          >
            {/* Eyebrow Chip */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1624] border border-[#00D2F6]/25 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D2F6]" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#00D2F6] uppercase">
                02 / DIFERENCIAIS ESTRATÉGICOS
              </span>
            </div>

            {/* Headline Editorial */}
            <h2 className="font-kanit font-black text-3xl sm:text-4xl md:text-[42px] uppercase tracking-tight text-[#F8FAFC] leading-[1.08]">
              NÃO CONTRATE MAIS UMA AGÊNCIA. <br />
              <span className="bg-gradient-to-r from-[#00D2F6] via-[#0096F5] to-[#015EEF] bg-clip-text text-transparent">
                FALE DIRETO COM QUEM CONSTRÓI.
              </span>
            </h2>

            {/* Subtexto Estratégico */}
            <p className="text-sm sm:text-base text-[#94A3B8] font-light leading-relaxed max-w-[48ch]">
              O modelo tradicional de agência é lento, inflado e distancia você do desenvolvedor. Na TCAI, eliminei as camadas burocráticas para entregar engenharia de alto nível com velocidade recorde e foco total em retorno financeiro.
            </p>

            {/* Selo de Garantia Técnica */}
            <div className="p-4 rounded-2xl bg-[#0A1624] border border-white/[0.06] flex items-center gap-3.5 w-full">
              <div className="w-9 h-9 rounded-xl bg-[#00D2F6]/10 border border-[#00D2F6]/25 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-[#00D2F6]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white uppercase tracking-tight font-kanit">
                  CÓDIGO 100% PROPRIETÁRIO
                </span>
                <span className="text-[11px] text-[#64748B] font-mono">
                  Sua empresa dona de cada linha criada.
                </span>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={createQuickWhatsAppUrl('Diferenciais TCAI')}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold font-mono text-[#00D2F6] hover:text-white transition-colors group pt-2"
            >
              <span>INICIAR PROJETO COM O ARQUITETO</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

          {/* Lado B: Lista Editorial de Princípios com Hairline Dividers (7 cols on lg) */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col divide-y divide-white/[0.06] rounded-3xl bg-[#0A1624]/60 border border-white/[0.06] p-6 sm:p-8 backdrop-blur-xl"
          >
            {COMPARISON_ROWS.map((row, idx) => (
              <div key={idx} className={`py-6 ${idx === 0 ? 'pt-2' : ''} ${idx === COMPARISON_ROWS.length - 1 ? 'pb-2' : ''}`}>
                {/* Axis Header */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#00D2F6] font-bold">
                    0{idx + 1} • {row.axis}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Agências Tradicionais */}
                  <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white/[0.01] border border-white/[0.04]">
                    <XCircle className="w-4 h-4 text-rose-400/80 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-mono text-rose-400/90 uppercase font-bold block mb-1">
                        Modelo Tradicional
                      </span>
                      <p className="text-xs text-[#94A3B8] font-light leading-relaxed">
                        {row.traditional}
                      </p>
                    </div>
                  </div>

                  {/* Método TCAI */}
                  <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#00D2F6]/[0.03] border border-[#00D2F6]/20">
                    <CheckCircle2 className="w-4 h-4 text-[#00D2F6] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-mono text-[#00D2F6] uppercase font-bold block mb-1">
                        Padrão TCAI
                      </span>
                      <p className="text-xs text-[#F1F5F9] font-medium leading-relaxed">
                        {row.tcai}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
