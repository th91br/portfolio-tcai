import React from 'react';
import { Printer, ArrowLeft, ShieldCheck, CheckCircle2, Building2, Calendar, Clock } from 'lucide-react';
import { CommercialProposal } from '../../../services/crm/proposalsService';

interface ProposalPrintViewProps {
  proposal: CommercialProposal;
  onClose: () => void;
}

export const ProposalPrintView: React.FC<ProposalPrintViewProps> = ({ proposal, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const upfrontAmount = (proposal.investmentTotal * (proposal.paymentTerms.upfrontPercent || 50)) / 100;
  const deliveryAmount = (proposal.investmentTotal * (proposal.paymentTerms.deliveryPercent || 50)) / 100;

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="fixed inset-0 z-[100] bg-[#07111F]/90 backdrop-blur-md overflow-y-auto flex flex-col items-center p-4 sm:p-6 font-kanit">
      {/* Barra de Ações (Ocultada na Impressão via print:hidden) */}
      <div className="w-full max-w-4xl flex items-center justify-between bg-[#0A1624] border border-[#16273C] p-3 rounded-xl mb-4 print:hidden shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 text-xs text-[#94A3B8] hover:text-white px-3 py-1.5 rounded-lg hover:bg-[#16273C] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao CRM</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#00D2F6]">
            {proposal.proposalNumber} • {proposal.company}
          </span>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-[#00D2F6] hover:bg-[#00D2F6]/90 text-[#07111F] transition-all shadow-lg shadow-[#00D2F6]/20"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Salvar em PDF</span>
          </button>
        </div>
      </div>

      {/* Folha Oficial da Proposta (Estilo Papel Executivo Branco/Claro para Impressão Perfeita) */}
      <div className="w-full max-w-4xl bg-white text-[#0F172A] p-8 sm:p-12 rounded-xl shadow-2xl space-y-8 border border-slate-200 print:p-0 print:border-0 print:shadow-none print:m-0 print:w-full">
        {/* Cabeçalho da Empresa */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-6 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-[#0F172A]">TCAI</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-bold">
                SOFTWARE & IA
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Thiago Cassol Antunes — Arquitetura de Software & IA</p>
            <p className="text-[11px] text-slate-400">thiago91cassol@hotmail.com • +55 54 98116-7720</p>
          </div>

          <div className="text-left sm:text-right space-y-0.5">
            <p className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">
              PROPOSTA TÉCNICO-COMERCIAL
            </p>
            <p className="text-sm font-mono font-black text-[#0284C7]">{proposal.proposalNumber}</p>
            <p className="text-[11px] text-slate-500">
              Emitida em: {new Date(proposal.createdAt).toLocaleDateString('pt-BR')}
            </p>
            <p className="text-[11px] text-slate-500">
              Válida até: {new Date(proposal.validUntil).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Dados do Cliente */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Cliente / Decisor:</span>
            <p className="font-bold text-slate-800 text-sm">{proposal.clientName}</p>
            <p className="text-slate-600 font-medium">{proposal.company}</p>
            {proposal.cnpj && <p className="text-slate-500 font-mono text-[11px]">CNPJ: {proposal.cnpj}</p>}
          </div>

          <div className="space-y-1 sm:text-right">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Contato & SLA:</span>
            {proposal.phone && <p className="text-slate-700 font-mono">{proposal.phone}</p>}
            <p className="font-semibold text-slate-800">Prazo Contratual: {proposal.slaDays} dias úteis</p>
            <p className="text-[11px] text-emerald-700 font-semibold">Garantia Técnica: 90 dias inclusa</p>
          </div>
        </div>

        {/* Resumo e Objeto da Proposta */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-2">
            <span>1. Objeto & Escopo do Projeto</span>
          </h3>
          <p className="text-sm font-bold text-[#0284C7]">{proposal.title}</p>
          {proposal.summary && <p className="text-xs text-slate-600 leading-relaxed">{proposal.summary}</p>}

          {/* Lista de Entregáveis */}
          <div className="space-y-2.5 pt-2">
            {proposal.scopeItems.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1 text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                  <span>{item.title}</span>
                </div>
                <p className="text-slate-600 pl-6 leading-relaxed text-[11px]">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Stacks Tecnológicas */}
          {proposal.techStack && proposal.techStack.length > 0 && (
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-600">Tecnologias Utilizadas: </span>
              <span className="text-[11px] text-slate-500 font-mono">{proposal.techStack.join(' • ')}</span>
            </div>
          )}
        </div>

        {/* Condições de Investimento */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-2">
            <span>2. Condições de Investimento & Pagamento</span>
          </h3>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-200 gap-2">
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Investimento Total do Projeto</p>
                <p className="text-2xl font-black text-slate-900 font-mono">{formatBRL(proposal.investmentTotal)}</p>
              </div>

              {proposal.paymentTerms.pixDiscountPercent && (
                <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  {proposal.paymentTerms.pixDiscountPercent}% de desconto à vista via PIX
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-bold">1ª Parcela (Início):</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">
                  {formatBRL(upfrontAmount)} ({proposal.paymentTerms.upfrontPercent}%)
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">Sinal para início imediato do desenvolvimento.</p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-bold">2ª Parcela (Entrega):</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">
                  {formatBRL(deliveryAmount)} ({proposal.paymentTerms.deliveryPercent}%)
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">Após homologação e deploy em produção.</p>
              </div>
            </div>

            {proposal.paymentTerms.customNotes && (
              <p className="text-[11px] text-slate-600 italic">Nota: {proposal.paymentTerms.customNotes}</p>
            )}
          </div>
        </div>

        {/* Cláusulas de Garantia */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-2">
            <span>3. Garantias Contratuais & Propriedade</span>
          </h3>

          <div className="space-y-2 text-xs text-slate-600">
            {proposal.guarantees.map((g, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px]">{g}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Assinaturas */}
        <div className="pt-8 border-t border-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-12 text-center text-xs">
          <div className="space-y-1">
            <div className="border-b border-slate-400 w-3/4 mx-auto pb-8 mb-2"></div>
            <p className="font-bold text-slate-800">Thiago Cassol Antunes</p>
            <p className="text-slate-500 text-[11px]">TCAI — Inteligência Artificial & Software</p>
          </div>

          <div className="space-y-1">
            <div className="border-b border-slate-400 w-3/4 mx-auto pb-8 mb-2"></div>
            <p className="font-bold text-slate-800">{proposal.clientName}</p>
            <p className="text-slate-500 text-[11px]">{proposal.company}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
