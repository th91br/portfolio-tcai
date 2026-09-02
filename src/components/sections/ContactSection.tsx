import React, { useState } from 'react';
import { Mail, ArrowUpRight, MessageCircle, Sparkles, Send, ShieldCheck, Clock, CheckCircle2, ChevronUp } from 'lucide-react';
import {
  CONTACT_CONFIG,
  createWhatsAppLeadUrl,
  submitLeadByEmail,
  openWhatsApp,
} from '../../utils/contactUtils';

interface ContactSectionProps {
  onDirectContactClick?: () => void;
}

const PROJECT_OPTIONS = [
  { label: '⚡ Sites & Landing Pages (3 Dias Úteis)', value: 'Sites & Landing Pages (3 Dias Úteis)' },
  { label: '🤖 Automações & Agentes IA (7 Dias Úteis)', value: 'Automações & Agentes IA (7 Dias Úteis)' },
  { label: '💻 Software & Sistemas Sob Medida (10 Dias Úteis)', value: 'Software & Sistemas Sob Medida (10 Dias Úteis)' },
  { label: '🚀 Plataforma SaaS & Produtos Digitais', value: 'Plataforma SaaS & Produtos Digitais' },
  { label: '🔌 Integrações & APIs Especializadas', value: 'Integrações & APIs Especializadas' },
  { label: '💡 Outro Projeto / Consultoria Estratégica', value: 'Outro Projeto / Consultoria' },
];

export const ContactSection: React.FC<ContactSectionProps> = ({
  onDirectContactClick,
}) => {
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [interest, setInterest] = useState(PROJECT_OPTIONS[0].value);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionType, setSubmissionType] = useState<'whatsapp' | 'email'>('whatsapp');

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contactInfo) {
      alert('Por favor, preencha seu nome e contato (WhatsApp ou e-mail).');
      return;
    }

    const url = createWhatsAppLeadUrl({
      name,
      contact: contactInfo,
      interest,
      message,
      origin: 'Formulário Principal de Contato (TCAI)',
    });

    window.open(url, '_blank', 'noopener,noreferrer');
    setIsSubmitted(true);
    setSubmissionType('whatsapp');
  };

  const handleSendEmail = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!name || !contactInfo) {
      alert('Por favor, preencha seu nome e contato (WhatsApp ou e-mail).');
      return;
    }

    setIsSubmitting(true);
    await submitLeadByEmail({
      name,
      contact: contactInfo,
      interest,
      message,
      origin: 'Formulário Principal de Contato (via E-mail)',
    });

    setIsSubmitting(false);
    setIsSubmitted(true);
    setSubmissionType('email');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      id="contact"
      className="relative w-full bg-[#07111F] text-[#F3F5F7] pt-20 sm:pt-28 pb-8 sm:pb-10 px-4 sm:px-6 md:px-10 border-t border-white/[0.06] overflow-hidden z-10"
    >
      {/* Background ambient accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-br from-[#00D2F6]/10 via-[#015EEF]/5 to-transparent blur-[180px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        {/* Top Call to Action Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1624] border border-[#00D2F6]/25 shadow-sm mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D2F6]" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#00D2F6] uppercase">
              09 / VAMOS CONVERSAR SOBRE SEU PROJETO
            </span>
          </div>

          <h2 className="font-kanit font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#F8FAFC] mb-3 leading-tight">
            PRONTO PARA CONSTRUIR EM TEMPO RECORDE?
          </h2>

          <p className="text-sm sm:text-base text-[#94A3B8] font-light leading-relaxed max-w-2xl mx-auto">
            Fale diretamente com Thiago Cassol Antunes. Receba direcionamento técnico, viabilidade e proposta em menos de 2 horas.
          </p>
        </div>

        {/* Lead Form & Channels Card */}
        <div className="bg-[#08131F]/80 border border-white/[0.08] rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center backdrop-blur-xl">
          
          {/* Left Column: Direct Channels & Guarantees */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#00D2F6]">
              <Sparkles className="w-4 h-4" />
              <span>ATENDIMENTO DIRETO</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight font-kanit uppercase">
              Alinhamento Sem Intermediários
            </h3>

            <p className="text-xs sm:text-sm text-[#94A3B8] font-light leading-relaxed">
              Você conversa com quem realmente vai desenhar, arquitetar e programar a sua solução.
            </p>

            {/* SLA recap chips */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 text-xs text-[#F1F5F9]">
                <Clock className="w-3.5 h-3.5 text-[#00D2F6] shrink-0" />
                <span>Sites em 3 dias • IA em 7 dias • Softwares em 10 dias</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#F1F5F9]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>100% Código Proprietário (Sem Mensalidades Ocultas)</span>
              </div>
            </div>

            {/* Direct Quick Buttons */}
            <div className="space-y-2.5 pt-2">
              <a
                href={`https://wa.me/${CONTACT_CONFIG.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#050B14] border border-white/[0.06] hover:border-[#00D2F6]/50 transition-all text-xs font-mono text-white group shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-[#00D2F6]" />
                  <span>WhatsApp Direto</span>
                </div>
                <span className="text-[11px] text-[#00D2F6] font-bold group-hover:translate-x-0.5 transition-transform">
                  {CONTACT_CONFIG.whatsappDisplay}
                </span>
              </a>

              <a
                href={`mailto:${CONTACT_CONFIG.email}`}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#050B14] border border-white/[0.06] hover:border-[#00D2F6]/50 transition-all text-xs font-mono text-white group shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#00D2F6]" />
                  <span className="font-bold">E-mail Profissional</span>
                </div>
                <span className="text-xs text-[#94A3B8] group-hover:text-[#00D2F6]">{CONTACT_CONFIG.email}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Proposal Form */}
          <div className="lg:col-span-7 bg-[#050B14] rounded-2xl border border-white/[0.06] p-5 sm:p-7 shadow-inner">
            {isSubmitted ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#00D2F6]/10 border border-[#00D2F6] text-[#00D2F6] flex items-center justify-center mx-auto shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold uppercase text-white font-kanit">Solicitação Encaminhada!</h4>
                <p className="text-xs sm:text-sm text-[#94A3B8] max-w-sm mx-auto font-light">
                  {submissionType === 'whatsapp'
                    ? 'Você foi direcionado ao WhatsApp do Thiago. O retorno ocorrerá em instantes.'
                    : 'E-mail enviado com sucesso para thiago91cassol@hotmail.com. Retornarei em breve.'}
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs font-mono text-[#00D2F6] underline pt-2 cursor-pointer font-bold"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendWhatsApp} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-mono text-[#94A3B8] block uppercase mb-1 font-medium">
                      Seu Nome ou Empresa *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Carlos Silva / Nexus"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#07111F] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D2F6] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-[#94A3B8] block uppercase mb-1 font-medium">
                      WhatsApp ou E-mail *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="(54) 99999-9999 ou email"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      className="w-full bg-[#07111F] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D2F6] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#94A3B8] block uppercase mb-1 font-medium">
                    Solução de Interesse & Prazo
                  </label>
                  <select
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full bg-[#07111F] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00D2F6] transition-colors"
                  >
                    {PROJECT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-[#07111F] text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#94A3B8] block uppercase mb-1 font-medium">
                    Resumo do Objetivo ou Dúvida
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Conte brevemente o que você deseja construir ou automatizar..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-[#07111F] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D2F6] transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    type="submit"
                    className="w-full rounded-full text-white font-bold uppercase tracking-wider py-3 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg hover:scale-102 active:scale-98 bg-gradient-to-r from-[#00D2F6] via-[#0096F5] to-[#015EEF] border border-white/20"
                  >
                    <MessageCircle className="w-4 h-4 text-white" />
                    <span>ENVIAR NO WHATSAPP</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendEmail}
                    disabled={isSubmitting}
                    className="w-full rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-[#CBD5E1] hover:text-white font-bold uppercase tracking-wider py-3 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'ENVIANDO...' : 'ENVIAR POR E-MAIL'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ContactSection;
