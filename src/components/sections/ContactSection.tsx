import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, Sparkles, Mail, MessageSquare, User, ArrowUpRight, Phone, MessageCircle } from 'lucide-react';
import { FINAL_CTA_DATA, CONTACT_DATA } from '../../data/portfolioData';
import { FadeIn } from '../common/FadeIn';
import {
  CONTACT_CONFIG,
  createWhatsAppLeadUrl,
  submitLeadByEmail,
  openWhatsApp,
  getWhatsAppUrl,
} from '../../utils/contactUtils';

interface ContactSectionProps {
  onDirectContactClick?: () => void;
}

const PROJECT_TYPES = [
  'Sites Profissionais',
  'Landing Pages',
  'Software & Sistemas',
  'SaaS / Plataformas',
  'Automação com IA',
  'Integrações & APIs',
  'Outro / Consultoria',
];

export const ContactSection: React.FC<ContactSectionProps> = ({
  onDirectContactClick,
}) => {
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [interest, setInterest] = useState('Sites Profissionais');
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
      className="relative w-full bg-[#050914] text-[#F3F5F7] pt-16 sm:pt-24 md:pt-32 pb-16 px-5 sm:px-8 md:px-10 border-t border-[#151F38] overflow-hidden z-20"
    >
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#00D2F6]/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#015EEF]/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto w-full relative z-10">
        {/* 1. CTA FINAL BLOCK */}
        <FadeIn delay={0} y={30} className="text-center max-w-3xl mx-auto mb-20 sm:mb-28">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#00D2F6] uppercase mb-3 inline-block">
            {FINAL_CTA_DATA.tagline}
          </span>
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight mb-6"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 90px)' }}
          >
            {FINAL_CTA_DATA.headline}
          </h2>
          <p className="text-[#AEB7C4] font-light text-base sm:text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
            {FINAL_CTA_DATA.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <motion.button
              type="button"
              onClick={handleQuickWhatsApp}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="rounded-full text-white font-bold uppercase tracking-wider px-8 py-3.5 sm:px-10 sm:py-4 text-xs sm:text-sm md:text-base cursor-pointer shadow-xl inline-flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #00D2F6 0%, #0096F5 50%, #015EEF 100%)',
                boxShadow: '0px 4px 18px rgba(0, 210, 246, 0.4), inset 0px 1px 2px rgba(255, 255, 255, 0.6)',
                outline: '2px solid white',
                outlineOffset: '-3px',
              }}
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">{FINAL_CTA_DATA.primaryButton}</span>
            </motion.button>

            <motion.button
              type="button"
              onClick={handleSecondaryContact}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-full border-2 border-[#AEB7C4]/40 hover:border-[#00D2F6] text-[#F3F5F7] hover:text-[#00D2F6] font-medium uppercase tracking-wider px-8 py-3.5 sm:px-9 sm:py-4 text-xs sm:text-sm md:text-base cursor-pointer hover:bg-[#00D2F6]/5 transition-all inline-flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-[#00D2F6]" />
              <span>{FINAL_CTA_DATA.secondaryButton}</span>
            </motion.button>
          </div>
        </FadeIn>

        {/* 2. DIRECT CONTACT FORM & STRATEGIC PROPOSAL CARD */}
        <FadeIn delay={0.2} y={30} className="w-full">
          <div className="bg-[#080D18] border border-[#151F38] rounded-[32px] sm:rounded-[44px] p-6 sm:p-10 md:p-14 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Info Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#00D2F6]">
                <Sparkles className="w-4 h-4" />
                <span>Canais de Atendimento</span>
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight text-white leading-tight">
                {CONTACT_DATA.heading}
              </h3>

              <p className="text-[#AEB7C4] font-light text-sm sm:text-base leading-relaxed">
                {CONTACT_DATA.description}
              </p>

              {/* Direct Reach Out Links */}
              <div className="space-y-3 pt-2">
                <a
                  href={getWhatsAppUrl('general')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#050914] border border-[#151F38] hover:border-[#00D2F6] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white uppercase tracking-wider">WhatsApp Direto</div>
                      <div className="text-sm font-mono text-[#00D2F6]">{CONTACT_CONFIG.whatsappDisplay}</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-[#00D2F6] transition-colors" />
                </a>

                <a
                  href={`mailto:${CONTACT_CONFIG.email}`}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#050914] border border-[#151F38] hover:border-[#00D2F6] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#00D2F6]/10 text-[#00D2F6] flex items-center justify-center border border-[#00D2F6]/20">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white uppercase tracking-wider">E-mail Profissional</div>
                      <div className="text-sm font-mono text-[#AEB7C4] truncate">{CONTACT_CONFIG.email}</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-[#00D2F6] transition-colors" />
                </a>
              </div>

              <div className="pt-3 border-t border-[#151F38] space-y-1">
                <div className="text-lg sm:text-xl font-bold text-white uppercase tracking-tight font-kanit">
                  {CONTACT_DATA.name}
                </div>
                <div className="text-xs text-[#AEB7C4] font-light uppercase tracking-wider">
                  {CONTACT_DATA.role}
                </div>
              </div>
            </div>

            {/* Right Interactive Form */}
            <div className="lg:col-span-6 bg-[#050914] border border-[#151F38] rounded-2xl sm:rounded-3xl p-5 sm:p-7">
              {isSubmitted ? (
                <div className="py-12 flex flex-col items-center text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-xl font-bold uppercase tracking-tight text-white">
                    {submissionType === 'whatsapp' ? 'Mensagem Estruturada!' : 'E-mail Enviado!'}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#AEB7C4] max-w-xs font-light leading-relaxed">
                    {submissionType === 'whatsapp'
                      ? `Abrindo o WhatsApp ${CONTACT_CONFIG.whatsappDisplay} com o seu cadastro completo. Thiago responderá em instantes!`
                      : `Recebemos seus dados em ${CONTACT_CONFIG.email}. Retornaremos em breve!`}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setName('');
                      setContactInfo('');
                      setMessage('');
                    }}
                    className="mt-3 px-6 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer"
                  >
                    Enviar Outra Mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendWhatsApp} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase font-medium tracking-wider text-[#AEB7C4] mb-1.5">
                      Seu Nome ou Empresa *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="Ex: Carlos Silva / NextTech"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#080D18] border border-[#151F38] rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-base sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00D2F6] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-medium tracking-wider text-[#AEB7C4] mb-1.5">
                      WhatsApp ou E-mail para Contato *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="(54) 99999-9999 ou carlos@empresa.com"
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        className="w-full bg-[#080D18] border border-[#151F38] rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-base sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00D2F6] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-medium tracking-wider text-[#AEB7C4] mb-1.5">
                      Tipo de Projeto Desejado
                    </label>
                    <select
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      className="w-full bg-[#080D18] border border-[#151F38] rounded-xl px-4 py-2.5 sm:py-3 text-base sm:text-sm text-white focus:outline-none focus:border-[#00D2F6] transition-colors cursor-pointer"
                    >
                      {PROJECT_TYPES.map((type) => (
                        <option key={type} value={type} className="bg-[#080D18] text-white">
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-medium tracking-wider text-[#AEB7C4] mb-1.5">
                      Sobre o Projeto / Desafio
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                      <textarea
                        required
                        rows={3}
                        placeholder="Descreva seu objetivo, prazo ou ideia..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-[#080D18] border border-[#151F38] rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-base sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00D2F6] transition-colors resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 space-y-2.5">
                    <button
                      type="submit"
                      className="w-full rounded-full text-white font-bold uppercase tracking-widest cursor-pointer py-3.5 text-xs sm:text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
                      style={{
                        background: 'linear-gradient(135deg, #00D2F6 0%, #0096F5 50%, #015EEF 100%)',
                        boxShadow: '0px 4px 18px rgba(0, 210, 246, 0.4), inset 0px 1px 2px rgba(255, 255, 255, 0.6)',
                        outline: '2px solid white',
                        outlineOffset: '-3px',
                      }}
                    >
                      <MessageCircle className="w-4 h-4 text-white" />
                      <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                        ENVIAR PELO WHATSAPP (54) 98116-7720
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSendEmail}
                      disabled={isSubmitting}
                      className="w-full py-2.5 rounded-full border border-[#151F38] hover:border-[#00D2F6] bg-[#080D18] hover:bg-[#00D2F6]/5 text-[#AEB7C4] hover:text-[#00D2F6] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#00D2F6]" />
                      <span>{isSubmitting ? 'Enviando e-mail...' : `Enviar por E-mail (${CONTACT_CONFIG.email})`}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </FadeIn>

        {/* 3. FOOTER SIGNATURE */}
        <div className="mt-20 pt-8 border-t border-[#151F38] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#AEB7C4] font-light">
          <div>
            © {new Date().getFullYear()} <span className="text-white font-medium">Thiago Cassol Antunes</span>. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#about"
              className="hover:text-[#00D2F6] transition-colors uppercase tracking-wider"
            >
              Sobre
            </a>
            <a
              href="#services"
              className="hover:text-[#00D2F6] transition-colors uppercase tracking-wider"
            >
              Serviços
            </a>
            <a
              href="#projects"
              className="hover:text-[#00D2F6] transition-colors uppercase tracking-wider"
            >
              Projetos
            </a>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-[#00D2F6] transition-colors uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            >
              <span>Topo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
