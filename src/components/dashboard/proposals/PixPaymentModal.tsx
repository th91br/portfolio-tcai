import React, { useState } from 'react';
import {
  X,
  QrCode,
  Copy,
  Check,
  Send,
  Zap,
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
  Receipt,
  Sparkles,
} from 'lucide-react';
import {
  PixChargeDetails,
  createPixCharge,
  confirmPixPayment,
} from '../../../services/crm/pixPaymentService';
import { ChatContact } from '../../../services/agent/agentChatService';

interface PixPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: ChatContact;
  amount: number;
  proposalNumber?: string;
  onPaymentConfirmed?: () => void;
  onSendWhatsApp?: (messageText: string) => void;
}

export const PixPaymentModal: React.FC<PixPaymentModalProps> = ({
  isOpen,
  onClose,
  contact,
  amount,
  proposalNumber = 'PROP-2026-001',
  onPaymentConfirmed,
  onSendWhatsApp,
}) => {
  const [charge, setCharge] = useState<PixChargeDetails>(() =>
    createPixCharge({
      amount,
      clientName: contact.name,
      description: `Sinal da Proposta ${proposalNumber} (${contact.name})`,
    })
  );

  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(charge.copiaECola);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendToWhatsApp = () => {
    const text = `⚡ *COBRANÇA PIX INSTANTÂNEA — TCAI SOLUÇÕES INTELIGENTES*
📌 *Proposta:* ${proposalNumber}
👤 *Titular:* ${contact.name} (${contact.company})
💰 *Valor do Sinal:* ${charge.amountFormatted}

*Chave PIX Copia e Cola:*
\`\`\`${charge.copiaECola}\`\`\`

Assim que realizar a transferência, a conciliação bancária dará baixa automática no nosso sistema e emitiremos o termo de início de projeto!`;

    if (onSendWhatsApp) {
      onSendWhatsApp(text);
      setFeedback('Cobrança PIX despachada no WhatsApp do cliente!');
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleSimulateBankConfirmation = async () => {
    setIsProcessing(true);
    setFeedback('Aguardando conciliação via API Banco Central / Webhook...');

    setTimeout(async () => {
      const res = await confirmPixPayment({
        contactId: contact.id,
        amount: charge.amount,
        proposalNumber,
        txid: charge.txid,
      });

      setIsProcessing(false);
      if (res.success) {
        setIsPaid(true);
        setFeedback(res.message);
        if (onPaymentConfirmed) {
          onPaymentConfirmed();
        }
      } else {
        setFeedback('Erro ao confirmar: ' + res.message);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-kanit">
      <div className="w-full max-w-lg bg-[#091524] border border-white/15 rounded-3xl overflow-hidden shadow-2xl space-y-0 animate-in fade-in zoom-in-95 duration-200">
        {/* Topo do Modal */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-[#07111F] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                  BACEN EMVCo Instantâneo
                </span>
                <span className="text-xs text-slate-400 font-mono">{proposalNumber}</span>
              </div>
              <h3 className="text-base font-bold text-white uppercase tracking-tight mt-0.5">
                Cobrança PIX & Baixa Automática
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo */}
        <div className="p-5 sm:p-6 space-y-5">
          {isPaid ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-widest block">
                  PAGAMENTO CONCILIADO COM SUCESSO
                </span>
                <h4 className="text-2xl font-black text-white mt-1">
                  {charge.amountFormatted}
                </h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto mt-2 font-light">
                  O lead <strong>{contact.name}</strong> foi movido automaticamente para o estágio{' '}
                  <strong className="text-emerald-400">"Fechado / Ganho"</strong> no Pipeline e no Kanban.
                </p>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#07111F] text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Concluir e Voltar ao CRM
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Valor e Dados do Recebedor */}
              <div className="p-4 rounded-2xl bg-[#07111F] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">
                    Valor do Sinal / Parcela
                  </span>
                  <div className="text-2xl font-black text-white font-mono mt-0.5">
                    {charge.amountFormatted}
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400">
                    Chave CNPJ: {charge.pixKey}
                  </span>
                </div>

                <div className="text-right text-xs font-mono text-slate-400">
                  <span className="text-[10px] text-slate-500 block uppercase">Favorecido:</span>
                  <strong className="text-white block truncate max-w-[170px]">{charge.merchantName}</strong>
                  <span className="text-[10px] text-slate-400">{charge.merchantCity}</span>
                </div>
              </div>

              {/* QR Code Central */}
              <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10">
                <div
                  className="p-3 bg-white rounded-2xl shadow-xl flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: charge.qrCodeSvg }}
                />
                <span className="text-[10px] font-mono text-slate-400 mt-2 flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-amber-400" />
                  QR Code válido por 24 horas • Conciliação em 3 segundos
                </span>
              </div>

              {/* Chave Copia e Cola */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Código PIX Copia e Cola:</span>
                  <span className="text-[10px] text-slate-500">{charge.txid}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={charge.copiaECola}
                    className="flex-1 bg-[#07111F] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 select-all focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopy}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      copied
                        ? 'bg-emerald-500 text-[#07111F]'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                    }`}
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              {/* Feedback */}
              {feedback && (
                <div className="p-3 rounded-xl bg-[#00D2F6]/10 border border-[#00D2F6]/30 text-xs font-mono text-[#00D2F6] text-center">
                  {feedback}
                </div>
              )}

              {/* Ações de Despacho & Simulação */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleSendToWhatsApp}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#07111F] text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Disparar no WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleSimulateBankConfirmation}
                  disabled={isProcessing}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00D2F6]/20 to-[#015EEF]/20 hover:from-[#00D2F6]/30 hover:to-[#015EEF]/30 border border-[#00D2F6]/40 text-[#00D2F6] text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                  title="Simula a confirmação via webhook do banco com baixa automática no Kanban"
                >
                  <Zap className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                  <span>{isProcessing ? 'Conciliando...' : 'Baixa Automática Kanban'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
