import React, { useState } from 'react';
import { Mail, ArrowUpRight, MessageCircle, Sparkles, Send } from 'lucide-react';
import { FINAL_CTA_DATA, CONTACT_DATA } from '../../data/portfolioData';
import { FadeIn } from '../common/FadeIn';
import {
  CONTACT_CONFIG,
  createWhatsAppLeadUrl,
  submitLeadByEmail,
  openWhatsApp,
} from '../../utils/contactUtils';

interface ContactSectionProps {
  onDirectContactClick?: () => void;
}

const PROJECT_TYPES = [
  'Sistemas & Painéis Web',
  'Plataformas SaaS',
  'Websites & Landing Pages',
  'Automações & IA Aplicada',
  'Integrações & APIs',
  'Outro / Consultoria',
];

export const ContactSection: React.FC<ContactSectionProps> = ({
  onDirectContactClick,
}) => {
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [interest, setInterest] = useState('Sistemas & Painéis Web');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionType, setSubmissionType] = useState<'whatsapp' | 'email'>('whatsapp');

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contactInfo) {
      alert('Por favor, preencha seu nome e contato (e-mail ou telefone/whatsapp).');
      return;
    }

    const url = createWhatsAppLeadUrl({
      name,
      contact: contactInfo,
      interest,
      message,
      origin: 'Formulário Principal (via WhatsApp)',
    });

    window.open(url, '_blank', 'noopener,noreferrer');
    setIsSubmitted(true);
    setSubmissionType('whatsapp');
  };

  const handleSendEmail = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!name || !contactInfo) {
      alert('Por favor, preencha seu nome e contato (e-mail ou telefone/whatsapp).');
      return;
    }

    setIsSubmitting(true);
    await submitLeadByEmail({
      name,
      contact: contactInfo,
      interest,
      message,
      origin: 'Formulário Principal (via E-mail)',
    });

    setIsSubmitting(false);
    setIsSubmitted(true);
    setSubmissionType('email');
  };

  const handleQuickWhatsApp = () => {
    openWhatsApp('project');
  };

  const handleSecondaryContact = () => {
    if (onDirectContactClick) {
      onDirectContactClick();
    } else {
      openWhatsApp('general');
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full h-full min-h-[100dvh] bg-transparent text-[#F3F5F7] px-4 sm:px-8 md:px-12 lg:px-16 py-4 sm:py-6 flex flex-col justify-center items-center select-none"
    >
      <div className="max-w-5xl mx-auto w-full relative z-10 my-auto">
        
        {/* 1. Top Call to Action Header */}
        <div className="text-center max-w-3xl mx-auto mb-3 sm:mb-4">
          <FadeIn delay={0} y={15} className="inline-block mb-1">
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#00D2F6] uppercase">
              VAMOS CONVERSAR SOBRE SEU PROJETO
            </span>
          </FadeIn>

          <FadeIn delay={0.1} y={15}>
            <h2 className="font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tight text-white mb-1 leading-tight">
              Pronto para construir o próximo nível digital da sua empresa?
            </h2>
          </FadeIn>

          <FadeIn delay={0.15} y={15}>
            <p className="text-[11px] sm:text-xs text-[#CBD5E1] font-light leading-relaxed max-w-2xl mx-auto mb-2.5">
              Entre em contato diretamente comigo. Retorno com viabilidade técnica, proposta de arquitetura e estimativa de prazo.
            </p>
          </FadeIn>

          <FadeIn delay={0.2} y={15} className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleQuickWhatsApp}
              className="rounded-full bg-[#00D2F6] hover:bg-[#38bdf8] text-black font-extrabold uppercase tracking-wider px-5 py-2 text-xs cursor-pointer shadow-lg shadow-[#00D2F6]/20 inline-flex items-center gap-1.5 transition-all hover:scale-102 active:scale-98"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chamar no WhatsApp Direto</span>
            </button>

            <button
              type="button"
              onClick={handleSecondaryContact}
              className="rounded-full border border-white/10 hover:border-[#00D2F6] text-[#CBD5E1] hover:text-[#00D2F6] font-medium uppercase tracking-wider px-4 py-2 text-xs cursor-pointer hover:bg-[#00D2F6]/5 transition-all inline-flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-[#00D2F6]" />
              <span>Enviar E-mail Corporativo</span>
            </button>
          </FadeIn>
        </div>

        {/* 2. Direct Lead Form & Channels Card */}
        <FadeIn delay={0.2} y={15} className="w-full">
          <div className="bg-[#060B18]/90 border border-white/10 rounded-2xl p-4 sm:p-5 md:p-6 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-5 items-center backdrop-blur-xl">
            
            {/* Left Column: Direct Channels */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[#00D2F6]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>CANAIS DIRETOS</span>
              </div>

              <h3 className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-white leading-tight">
                Atendimento Direto com o Arquiteto
              </h3>

              <p className="text-xs text-[#94A3B8] font-light leading-relaxed">
                Sem filas ou intermediários. Explique a necessidade da sua empresa e receba um direcionamento técnico claro.
              </p>

              {/* Direct Quick Buttons */}
              <div className="space-y-1.5 pt-1">
                <a
                  href={`https://wa.me/${CONTACT_CONFIG.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#020408] border border-white/10 hover:border-[#00D2F6] transition-all text-xs font-mono text-white group"
                >
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#00D2F6]" />
                    <span className="font-bold">WhatsApp</span>
                  </div>
                  <span className="text-[11px] text-[#94A3B8] group-hover:text-[#00D2F6]">{CONTACT_CONFIG.whatsappDisplay}</span>
                </a>

                <a
                  href={`mailto:${CONTACT_CONFIG.email}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#020408] border border-white/10 hover:border-[#00D2F6] transition-all text-xs font-mono text-white group"
                >
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#00D2F6]" />
                    <span className="font-bold">E-mail</span>
                  </div>
                  <span className="text-[11px] text-[#94A3B8] group-hover:text-[#00D2F6]">{CONTACT_CONFIG.email}</span>
                </a>
              </div>
            </div>

            {/* Right Column: Proposal Form */}
            <div className="lg:col-span-7 bg-[#020408]/90 rounded-xl border border-white/5 p-3.5 sm:p-4.5">
              {isSubmitted ? (
                <div className="py-6 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-[#00D2F6]/20 border border-[#00D2F6] text-[#00D2F6] flex items-center justify-center mx-auto">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold uppercase text-white">Mensagem Encaminhada!</h4>
                  <p className="text-xs text-[#CBD5E1] max-w-sm mx-auto">
                    {submissionType === 'whatsapp'
                      ? 'Você foi direcionado ao WhatsApp do Thiago. O atendimento começará em instantes.'
                      : 'E-mail enviado com sucesso. Thiago retornará em breve.'}
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-[11px] font-mono text-[#00D2F6] underline pt-2 cursor-pointer"
                  >
                    Enviar outra mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendWhatsApp} className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono text-[#94A3B8] block uppercase mb-1">
                        Seu Nome ou Empresa *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Carlos Silva / Minha Empresa"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#060B18] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00D2F6] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-[#94A3B8] block uppercase mb-1">
                        WhatsApp ou E-mail *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="(54) 99999-9999 ou email"
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        className="w-full bg-[#060B18] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00D2F6] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono text-[#94A3B8] block uppercase mb-1">
                        Tipo de Projeto
                      </label>
                      <select
                        value={interest}
                        onChange={(e) => setInterest(e.target.value)}
                        className="w-full bg-[#060B18] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00D2F6] transition-colors"
                      >
                        {PROJECT_TYPES.map((type) => (
                          <option key={type} value={type} className="bg-[#060B18] text-white">
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-[#94A3B8] block uppercase mb-1">
                        Resumo do Objetivo
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Novo sistema de gestão ou site"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-[#060B18] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00D2F6] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <button
                      type="submit"
                      className="w-full rounded-xl bg-[#00D2F6] hover:bg-[#38bdf8] text-black font-extrabold uppercase tracking-wider py-2 text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-[#00D2F6]/20 active:scale-98"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>ENVIAR NO WHATSAPP</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSendEmail}
                      disabled={isSubmitting}
                      className="w-full py-2 rounded-xl border border-white/10 hover:border-[#00D2F6] bg-[#060B18] text-[#CBD5E1] hover:text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#00D2F6]" />
                      <span>{isSubmitting ? 'Enviando...' : 'Enviar por E-mail'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </FadeIn>

        {/* 3. Footer Signature */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-[#94A3B8] font-mono">
          <div>
            © {new Date().getFullYear()} <span className="text-white font-medium">Thiago Cassol Antunes (TCAI)</span>. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#00D2F6]">• Caxias do Sul / RS • Atendimento Global</span>
          </div>
        </div>

      </div>
    </section>
  );
};
