import React from 'react';
import { ZoomReveal } from '../common/ZoomReveal';
import { XCircle, CheckCircle2, AlertTriangle, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { openWhatsApp } from '../../utils/contactUtils';

export const ManifestoSection: React.FC = () => {
  return (
    <section
      id="manifesto"
      className="relative w-full h-full min-h-[100dvh] bg-transparent text-[#F3F5F7] px-4 sm:px-8 md:px-12 lg:px-16 py-6 sm:py-8 overflow-y-auto overflow-x-hidden flex flex-col justify-center select-none"
    >
      <div className="max-w-6xl mx-auto w-full relative z-10 my-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <ZoomReveal delay={0.05} className="inline-block mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#060B18]/90 border border-[#00D2F6]/30 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D2F6]" />
              <span className="text-[10px] sm:text-[11px] font-mono uppercase font-bold tracking-widest text-[#00D2F6]">
                FILOSOFIA DE ENGENHARIA
              </span>
            </div>
          </ZoomReveal>

          <ZoomReveal delay={0.15}>
            <h2 className="font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tight text-white mb-2 leading-tight">
              Software genérico gera dívida. Código sob medida constrói patrimônio.
            </h2>
          </ZoomReveal>

          <ZoomReveal delay={0.25}>
            <p className="text-[#CBD5E1] text-xs sm:text-sm font-light leading-relaxed max-w-2xl mx-auto">
              Soluções de prateleira cobram mensalidades por usuário que crescem com sua escala, impõem limites operacionais e deixam sua empresa refém. O desenvolvimento sob medida cria um ativo definitivo que valoriza seu negócio.
            </p>
          </ZoomReveal>
        </div>

        {/* Contrast Grid: Generic vs Custom Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
          {/* Card 1: O Custo do Comum */}
          <ZoomReveal delay={0.35} className="w-full">
            <div className="h-full p-5 sm:p-7 rounded-2xl bg-[#060B18]/80 border border-red-500/20 flex flex-col justify-between space-y-4 backdrop-blur-xl shadow-xl">
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-mono font-bold tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>SISTEMAS GENÉRICOS &amp; TEMPLATES</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  O Custo Oculto da Solução Pronta
                </h3>
                <p className="text-xs text-[#94A3B8] font-light leading-relaxed">
                  Ferramentas prontas forçam sua empresa a adaptar processos internos às limitações do sistema, gerando custos infinitos e dependência técnica.
                </p>
              </div>

              <div className="space-y-2 font-mono text-xs text-[#CBD5E1]">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#020408]/90 border border-white/5">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-[11px]">Mensalidades caras por usuário que penalizam o crescimento da equipe.</span>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#020408]/90 border border-white/5">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-[11px]">Falta de integração nativa com seus canais de venda e banco de dados.</span>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#020408]/90 border border-white/5">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-[11px]">Carregamento lento, segurança compartilhada e visual padronizado.</span>
                </div>
              </div>
            </div>
          </ZoomReveal>

          {/* Card 2: Engenharia Sob Medida TCAI */}
          <ZoomReveal delay={0.45} className="w-full">
            <div className="h-full p-5 sm:p-7 rounded-2xl bg-[#060B18]/90 border border-[#00D2F6]/40 flex flex-col justify-between space-y-4 backdrop-blur-xl shadow-[0_0_30px_rgba(0,210,246,0.12)]">
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D2F6]/10 border border-[#00D2F6]/30 text-[#00D2F6] text-[11px] font-mono font-bold tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ENGENHARIA SOB MEDIDA TCAI</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  Propriedade Total, Velocidade &amp; Escala
                </h3>
                <p className="text-xs text-[#94A3B8] font-light leading-relaxed">
                  Arquitetura construída exatamente para a lógica operacional da sua empresa, garantindo controle irrestrito, velocidade extrema e segurança.
                </p>
              </div>

              <div className="space-y-2 font-mono text-xs text-[#F1F5F9]">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#020408]/90 border border-[#00D2F6]/25">
                  <CheckCircle2 className="w-4 h-4 text-[#00D2F6] flex-shrink-0 mt-0.5" />
                  <span className="text-[11px]">Propriedade 100% sua: código-fonte limpo sem taxas por usuário.</span>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#020408]/90 border border-[#00D2F6]/25">
                  <CheckCircle2 className="w-4 h-4 text-[#00D2F6] flex-shrink-0 mt-0.5" />
                  <span className="text-[11px]">Automações conectadas diretamente ao seu WhatsApp, APIs e CRM.</span>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#020408]/90 border border-[#00D2F6]/25">
                  <CheckCircle2 className="w-4 h-4 text-[#00D2F6] flex-shrink-0 mt-0.5" />
                  <span className="text-[11px]">Performance 100/100, design cinematográfico e escalabilidade na nuvem.</span>
                </div>
              </div>
            </div>
          </ZoomReveal>
        </div>
      </div>
    </section>
  );
};
