import React, { useState } from 'react';
import {
  X,
  FileText,
  DollarSign,
  Clock,
  CheckCircle2,
  Plus,
  Trash2,
  Send,
  Printer,
  ShieldCheck,
  Building2,
  Sparkles,
  QrCode,
} from 'lucide-react';
import {
  CommercialProposal,
  ScopeDeliverable,
  generateProposalNumber,
  getDefaultGuarantees,
  saveProposal,
  formatProposalWhatsAppMessage,
} from '../../../services/crm/proposalsService';
import { addTimelineEvent } from '../../../services/crm/timelineService';
import { ChatContact } from '../../../services/agent/agentChatService';
import { PixPaymentModal } from './PixPaymentModal';

interface ProposalModalProps {
  proposal?: CommercialProposal | null;
  initialContact?: ChatContact | null;
  availableContacts?: ChatContact[];
  onClose: () => void;
  onSaved: (proposal: CommercialProposal) => void;
  onSendWhatsApp?: (text: string, contactId: string) => void;
  onOpenPrintView: (proposal: CommercialProposal) => void;
}

const SCOPE_PRESETS: ScopeDeliverable[] = [
  {
    title: 'Landing Page de Alta Conversão',
    description: 'Interface responsiva, arquitetura mobile-first, performance 100/100 no Google e formulários de captura com disparo em tempo real.',
  },
  {
    title: 'Central de WhatsApp com Agente de IA Multimodal',
    description: 'Atendimento cognitivo 24/7, compreensão de áudios de voz, visão computacional de fotos/documentos e qualificação automática de leads.',
  },
  {
    title: 'Painel Administrativo & Gestão CRM',
    description: 'Cockpit privado com login seguro, visualização de métricas em tempo real, gestão de propostas e funil Kanban.',
  },
  {
    title: 'Banco de Dados & Autenticação Segura',
    description: 'Estruturação de banco relacional PostgreSQL (Supabase) com Row Level Security (RLS) e criptografia de credenciais.',
  },
  {
    title: 'Deploy em Produção & CDN Global',
    description: 'Publicação assistida em infraestrutura Vercel com CDN global, apontamento de domínio próprio e certificado SSL ilimitado.',
  },
];

export const ProposalModal: React.FC<ProposalModalProps> = ({
  proposal,
  initialContact,
  availableContacts = [],
  onClose,
  onSaved,
  onSendWhatsApp,
  onOpenPrintView,
}) => {
  const isEditing = Boolean(proposal?.id);

  const [contactId, setContactId] = useState(
    proposal?.contactId || initialContact?.id || (availableContacts[0]?.id ?? '')
  );
  const [clientName, setClientName] = useState(
    proposal?.clientName || initialContact?.name || (availableContacts[0]?.name ?? '')
  );
  const [company, setCompany] = useState(
    proposal?.company || initialContact?.company || (availableContacts[0]?.company ?? '')
  );
  const [cnpj, setCnpj] = useState(proposal?.cnpj || '');
  const [phone, setPhone] = useState(proposal?.phone || initialContact?.phone || '');
  const [title, setTitle] = useState(
    proposal?.title || `Projeto Digital Sob Medida — ${company || 'Cliente'}`
  );
  const [summary, setSummary] = useState(
    proposal?.summary ||
      'Desenvolvimento de software de alta performance com arquitetura moderna, interface responsiva e garantia contratual de entrega ágil.'
  );
  const [scopeItems, setScopeItems] = useState<ScopeDeliverable[]>(
    proposal?.scopeItems || [SCOPE_PRESETS[0], SCOPE_PRESETS[1]]
  );
  const [techStack, setTechStack] = useState<string[]>(
    proposal?.techStack || ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Gemini IA', 'Supabase']
  );
  const [slaDays, setSlaDays] = useState<number>(proposal?.slaDays || 7);
  const [investmentTotal, setInvestmentTotal] = useState<number>(proposal?.investmentTotal || 8500);
  const [upfrontPercent, setUpfrontPercent] = useState<number>(
    proposal?.paymentTerms?.upfrontPercent || 50
  );
  const [deliveryPercent, setDeliveryPercent] = useState<number>(
    proposal?.paymentTerms?.deliveryPercent || 50
  );
  const [pixDiscountPercent, setPixDiscountPercent] = useState<number>(
    proposal?.paymentTerms?.pixDiscountPercent || 5
  );
  const [status, setStatus] = useState<CommercialProposal['status']>(proposal?.status || 'draft');

  const [showPixModal, setShowPixModal] = useState(false);

  // Ao trocar de contato selecionado
  const handleSelectContact = (cId: string) => {
    setContactId(cId);
    const found = availableContacts.find((c) => c.id === cId);
    if (found) {
      setClientName(found.name);
      setCompany(found.company || '');
      setPhone(found.phone || '');
      if (!title || title.includes('Projeto Digital')) {
        setTitle(`Desenvolvimento & Software — ${found.company || found.name}`);
      }
    }
  };

  const handleAddPreset = (preset: ScopeDeliverable) => {
    if (!scopeItems.some((item) => item.title === preset.title)) {
      setScopeItems([...scopeItems, preset]);
    }
  };

  const handleRemoveScopeItem = (idx: number) => {
    setScopeItems(scopeItems.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    const validUntilDate = new Date();
    validUntilDate.setDate(validUntilDate.getDate() + 10);

    const saved: CommercialProposal = {
      id: proposal?.id || `prop_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      proposalNumber: proposal?.proposalNumber || generateProposalNumber(),
      contactId,
      clientName,
      company,
      cnpj,
      phone,
      title,
      summary,
      scopeItems,
      techStack,
      slaDays,
      investmentTotal,
      paymentTerms: {
        upfrontPercent,
        deliveryPercent,
        pixDiscountPercent,
      },
      guarantees: proposal?.guarantees || getDefaultGuarantees(),
      status,
      publicSlug: proposal?.publicSlug || `tcai-${company.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      createdAt: proposal?.createdAt || new Date().toISOString(),
      validUntil: proposal?.validUntil || validUntilDate.toISOString(),
    };

    saveProposal(saved);

    // Registra na timeline do cliente
    if (contactId) {
      addTimelineEvent(contactId, {
        type: 'proposal_sent',
        title: `Proposta Gerada (${saved.proposalNumber})`,
        description: `Proposta de ${new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(saved.investmentTotal)} com prazo de ${saved.slaDays} dias úteis salva no CRM.`,
        author: 'Thiago (TCAI)',
      });
    }

    onSaved(saved);
    return saved;
  };

  const handleSendWhatsApp = () => {
    const saved = handleSave();
    const message = formatProposalWhatsAppMessage(saved);
    if (onSendWhatsApp && contactId) {
      onSendWhatsApp(message, contactId);
    }
    saved.status = 'sent';
    saveProposal(saved);
    onClose();
  };

  const upfrontAmount = (investmentTotal * upfrontPercent) / 100;
  const deliveryAmount = (investmentTotal * deliveryPercent) / 100;

  const effectiveContacts = React.useMemo(() => {
    const list = [...availableContacts];
    if (initialContact && !list.some((c) => c.id === initialContact.id)) {
      list.unshift(initialContact);
    }
    return list;
  }, [availableContacts, initialContact]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-kanit">
      <div className="bg-[#0A1624] border border-[#16273C] rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#16273C] bg-[#07111F]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00D2F6]/10 border border-[#00D2F6]/30 flex items-center justify-center text-[#00D2F6]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {isEditing ? 'Editar Proposta Técnico-Comercial' : 'Nova Proposta Comercial Executiva'}
              </h3>
              <p className="text-xs text-[#94A3B8]">
                {proposal?.proposalNumber || 'Gerador de Propostas TCAI'} • SLA & Garantias Contratuais
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#16273C] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Modal (Scrollável) */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#CBD5E1]">
          {/* Seção 1: Cliente & Empresa */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#00D2F6] font-bold">
              1. Dados do Cliente & Contato
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-[#94A3B8] mb-1">Contato no CRM</label>
                <select
                  value={contactId}
                  onChange={(e) => handleSelectContact(e.target.value)}
                  className="w-full bg-[#07111F] border border-[#16273C] focus:border-[#00D2F6] rounded-lg p-2 text-xs text-[#F3F5F7] outline-none"
                >
                  {effectiveContacts.length === 0 ? (
                    <option value={contactId}>{clientName || 'Cliente Direto'}</option>
                  ) : (
                    effectiveContacts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.company || 'TCAI'})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-[#94A3B8] mb-1">Nome do Decisor</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-[#07111F] border border-[#16273C] focus:border-[#00D2F6] rounded-lg p-2 text-xs text-[#F3F5F7] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#94A3B8] mb-1">Empresa / Razão Social</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-[#07111F] border border-[#16273C] focus:border-[#00D2F6] rounded-lg p-2 text-xs text-[#F3F5F7] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-[#94A3B8] mb-1">CNPJ (Opcional)</label>
                <input
                  type="text"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  placeholder="00.000.000/0001-00"
                  className="w-full bg-[#07111F] border border-[#16273C] focus:border-[#00D2F6] rounded-lg p-2 text-xs text-[#F3F5F7] font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#94A3B8] mb-1">Telefone WhatsApp</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+55 (00) 00000-0000"
                  className="w-full bg-[#07111F] border border-[#16273C] focus:border-[#00D2F6] rounded-lg p-2 text-xs text-[#F3F5F7] font-mono outline-none"
                />
              </div>
            </div>
          </div>

          {/* Seção 2: Título do Projeto e SLA */}
          <div className="space-y-3 pt-2 border-t border-[#16273C]">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#00D2F6] font-bold">
              2. Objeto do Contrato & SLA Garantido
            </h4>

            <div>
              <label className="block text-[11px] text-[#94A3B8] mb-1">Título do Projeto</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#07111F] border border-[#16273C] focus:border-[#00D2F6] rounded-lg p-2 text-xs text-[#F3F5F7] font-semibold outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#94A3B8] mb-1">Resumo Executivo</label>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full bg-[#07111F] border border-[#16273C] focus:border-[#00D2F6] rounded-lg p-2 text-xs text-[#F3F5F7] outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#94A3B8] mb-1">
                Prazo SLA Garantido em Contrato (Dias Úteis)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[3, 7, 10, 15].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSlaDays(d)}
                    className={`py-2 rounded-lg font-mono font-bold text-xs border transition-all ${
                      slaDays === d
                        ? 'bg-[#00D2F6]/20 border-[#00D2F6] text-[#00D2F6]'
                        : 'bg-[#07111F] border-[#16273C] text-[#94A3B8] hover:border-slate-600'
                    }`}
                  >
                    {d} Dias Úteis
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Seção 3: Escopo e Módulos Entregáveis */}
          <div className="space-y-3 pt-2 border-t border-[#16273C]">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#00D2F6] font-bold">
                3. Entregáveis & Módulos Funcionais
              </h4>
              <span className="text-[10px] text-[#94A3B8]">{scopeItems.length} módulo(s) adicionados</span>
            </div>

            {/* Presets Rápidos de Adição */}
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] text-[#64748B] self-center">Adicionar rápido:</span>
              {SCOPE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddPreset(preset)}
                  className="px-2 py-0.5 rounded bg-[#16273C] hover:bg-[#16273C]/80 text-[#94A3B8] hover:text-[#00D2F6] text-[10px] flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-2.5 h-2.5" />
                  <span>{preset.title.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Lista Atual de Entregáveis */}
            <div className="space-y-2">
              {scopeItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#07111F] rounded-lg border border-[#16273C] flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 flex-1">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const updated = [...scopeItems];
                        updated[idx].title = e.target.value;
                        setScopeItems(updated);
                      }}
                      className="w-full bg-transparent font-bold text-white text-xs border-b border-transparent focus:border-[#00D2F6] outline-none"
                    />
                    <textarea
                      rows={2}
                      value={item.description}
                      onChange={(e) => {
                        const updated = [...scopeItems];
                        updated[idx].description = e.target.value;
                        setScopeItems(updated);
                      }}
                      className="w-full bg-transparent text-[11px] text-[#94A3B8] border-b border-transparent focus:border-[#00D2F6] outline-none resize-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveScopeItem(idx)}
                    className="text-rose-400 hover:text-rose-300 p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Seção 4: Condições Financeiras */}
          <div className="space-y-3 pt-2 border-t border-[#16273C]">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#00D2F6] font-bold">
              4. Investimento & Condições de Pagamento
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-[#94A3B8] mb-1">Investimento Total (R$)</label>
                <div className="relative">
                  <DollarSign className="w-3.5 h-3.5 absolute left-3 top-2.5 text-emerald-400" />
                  <input
                    type="number"
                    step="500"
                    value={investmentTotal}
                    onChange={(e) => setInvestmentTotal(Number(e.target.value) || 0)}
                    className="w-full bg-[#07111F] border border-[#16273C] focus:border-emerald-400 rounded-lg pl-8 pr-3 py-2 text-xs font-mono font-bold text-emerald-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[#94A3B8] mb-1">Entrada (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={upfrontPercent}
                  onChange={(e) => {
                    const up = Number(e.target.value) || 0;
                    setUpfrontPercent(up);
                    setDeliveryPercent(100 - up);
                  }}
                  className="w-full bg-[#07111F] border border-[#16273C] focus:border-[#00D2F6] rounded-lg p-2 text-xs font-mono text-[#F3F5F7] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#94A3B8] mb-1">Desconto PIX à Vista (%)</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={pixDiscountPercent}
                  onChange={(e) => setPixDiscountPercent(Number(e.target.value) || 0)}
                  className="w-full bg-[#07111F] border border-[#16273C] focus:border-[#00D2F6] rounded-lg p-2 text-xs font-mono text-[#F3F5F7] outline-none"
                />
              </div>
            </div>

            {/* Resumo do Pagamento Calculado */}
            <div className="bg-[#07111F] p-3 rounded-lg border border-[#16273C] flex items-center justify-between text-xs">
              <div>
                <span className="text-[#94A3B8] text-[11px]">1ª Parcela (Entrada):</span>
                <p className="font-bold text-emerald-400 font-mono">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    upfrontAmount
                  )}{' '}
                  ({upfrontPercent}%)
                </p>
              </div>

              <div className="text-right">
                <span className="text-[#94A3B8] text-[11px]">2ª Parcela (Na Entrega):</span>
                <p className="font-bold text-cyan-400 font-mono">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    deliveryAmount
                  )}{' '}
                  ({deliveryPercent}%)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé com Ações */}
        <div className="px-6 py-4 border-t border-[#16273C] bg-[#07111F]/50 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-[#94A3B8] hover:text-white transition-colors"
          >
            Cancelar
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const saved = handleSave();
                onOpenPrintView(saved);
              }}
              className="px-3.5 py-2 bg-[#16273C] hover:bg-[#16273C]/80 border border-[#16273C] text-[#F3F5F7] rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-[#00D2F6]" />
              <span>Ver PDF / Imprimir</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPixModal(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
              title="Gerar chave e QR Code PIX oficial para o sinal"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-400" />
              <span>Gerar PIX</span>
            </button>

            {onSendWhatsApp && (
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="px-3.5 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar no WhatsApp</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                handleSave();
                onClose();
              }}
              className="px-4 py-2 bg-[#00D2F6] hover:bg-[#00D2F6]/90 text-[#07111F] rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#00D2F6]/20"
            >
              Salvar Proposta
            </button>
          </div>
        </div>
      </div>

      {/* Modal Integrado de Cobrança PIX */}
      {showPixModal && (
        <PixPaymentModal
          isOpen={showPixModal}
          onClose={() => setShowPixModal(false)}
          contact={
            initialContact || {
              id: contactId || 'lead-generic',
              name: clientName,
              company,
              phone,
              status: 'proposal_sent',
              statusLabel: 'Proposta Enviada',
              avatar: '💼',
              unread: 0,
              score: 90,
              slaTimeline: `${slaDays} DIAS ÚTEIS`,
              projectType: title,
              lastMessage: 'Proposta emitida',
              lastMessageTime: 'Hoje',
              messages: [],
            }
          }
          amount={investmentTotal * (upfrontPercent / 100)}
          proposalNumber={proposal?.proposalNumber || 'PROP-2026-001'}
          onSendWhatsApp={(msg) => {
            if (onSendWhatsApp && contactId) {
              onSendWhatsApp(msg, contactId);
            }
          }}
          onPaymentConfirmed={() => {
            setStatus('accepted');
            handleSave();
          }}
        />
      )}
    </div>
  );
};
