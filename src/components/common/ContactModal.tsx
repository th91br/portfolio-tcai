import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, Sparkles, Mail, MessageSquare, User, Phone, MessageCircle, ArrowUpRight } from 'lucide-react';
import { CONTACT_DATA } from '../../data/portfolioData';
import { CONTACT_CONFIG, createWhatsAppLeadUrl, submitLeadByEmail } from '../../utils/contactUtils';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultInterest?: string;
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

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  defaultInterest = 'Sites Profissionais',
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState(defaultInterest);
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionType, setSubmissionType] = useState<'whatsapp' | 'email'>('whatsapp');

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const contactInfo = [email, phone].filter(Boolean).join(' | ') || phone || email;

    const url = createWhatsAppLeadUrl({
      name,
      contact: contactInfo,
      interest,
      message,
      origin: 'Modal de Contato do Portfólio',
    });

    // Also trigger background email copy for tracking
    submitLeadByEmail({
      name,
      contact: contactInfo,
      interest,
      message,
      origin: 'Modal de Contato (via WhatsApp)',
    });

    window.open(url, '_blank', 'noopener,noreferrer');
    setIsSubmitted(true);
    setSubmissionType('whatsapp');
  };

  const handleSendEmail = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!name || (!email && !phone)) {
      alert('Por favor, preencha seu nome e pelo menos um contato (e-mail ou telefone).');
      return;
    }

    setIsSubmitting(true);
    const contactInfo = [email, phone].filter(Boolean).join(' | ') || email || phone;

    await submitLeadByEmail({
      name,
      contact: contactInfo,
      interest,
      message,
      origin: 'Modal de Contato (via E-mail)',
    });

    setIsSubmitting(false);
    setIsSubmitted(true);
    setSubmissionType('email');
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#07111F]/90 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-xl bg-[#08131F] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-[#F3F5F7] max-h-[90vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 flex flex-col items-center text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tight text-white">
                  {submissionType === 'whatsapp' ? 'Redirecionando ao WhatsApp!' : 'Mensagem Encaminhada com Sucesso!'}
                </h3>
                <p className="text-sm text-[#AEB7C4] max-w-md font-light leading-relaxed">
                  {submissionType === 'whatsapp'
                    ? `Sua mensagem foi estruturada para o WhatsApp ${CONTACT_CONFIG.whatsappDisplay}. Thiago já vai te atender!`
                    : `Sua solicitação foi enviada diretamente para ${CONTACT_CONFIG.email}. Thiago responderá em breve com uma proposta personalizada.`}
                </p>

                <div className="pt-4 flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full py-3 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer"
                  >
                    Concluir
                  </button>
                </div>
              </motion.div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#00D2F6] mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Vamos Iniciar Seu Projeto</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-2">
                  Solicitar Proposta
                </h2>
                <p className="text-xs sm:text-sm text-[#AEB7C4] mb-5 font-light leading-relaxed">
                  {CONTACT_DATA.description}
                </p>

                {/* Direct Channel Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5 p-3 rounded-2xl bg-[#050B14] border border-white/[0.06] text-xs">
                  <a
                    href={`https://wa.me/${CONTACT_CONFIG.whatsappNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-[#AEB7C4] hover:text-[#00D2F6] transition-colors p-1.5 rounded-lg"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>WhatsApp: <strong>{CONTACT_CONFIG.whatsappDisplay}</strong></span>
                  </a>
                  <a
                    href={`mailto:${CONTACT_CONFIG.email}`}
                    className="flex items-center gap-2 text-[#AEB7C4] hover:text-[#00D2F6] transition-colors p-1.5 rounded-lg"
                  >
                    <Mail className="w-4 h-4 text-[#00D2F6] shrink-0" />
                    <span className="truncate">E-mail: <strong>{CONTACT_CONFIG.email}</strong></span>
                  </a>
                </div>

                <form onSubmit={handleSendWhatsApp} className="space-y-4">
                  {/* Name */}
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
                        className="w-full bg-[#07111F] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-base sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D2F6] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Dual Contact Input */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs uppercase font-medium tracking-wider text-[#AEB7C4] mb-1.5">
                        WhatsApp (com DDD) *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="tel"
                          required
                          placeholder="(54) 99999-9999"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-[#07111F] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-base sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D2F6] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-medium tracking-wider text-[#AEB7C4] mb-1.5">
                        E-mail
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="email"
                          placeholder="carlos@empresa.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[#07111F] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-base sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D2F6] transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Interest Selector */}
                  <div>
                    <label className="block text-xs uppercase font-medium tracking-wider text-[#AEB7C4] mb-1.5">
                      Qual tipo de solução você precisa?
                    </label>
                    <select
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      className="w-full bg-[#07111F] border border-white/[0.08] rounded-xl px-4 py-2.5 sm:py-3 text-base sm:text-sm text-white focus:outline-none focus:border-[#00D2F6] transition-colors cursor-pointer"
                    >
                      {PROJECT_TYPES.map((type) => (
                        <option key={type} value={type} className="bg-[#07111F] text-white">
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs uppercase font-medium tracking-wider text-[#AEB7C4] mb-1.5">
                      Detalhes da Ideia / Desafio
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                      <textarea
                        required
                        rows={3}
                        placeholder="Conte um pouco sobre o projeto, objetivo, prazos ou expectativas..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-[#07111F] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-base sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D2F6] transition-colors resize-none"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 space-y-2.5">
                    {/* Main WhatsApp Button */}
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

                    {/* Alternative Email Submit Button */}
                    <button
                      type="button"
                      onClick={handleSendEmail}
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-full border border-[#151F38] hover:border-[#00D2F6] bg-[#050914] hover:bg-[#00D2F6]/5 text-[#AEB7C4] hover:text-[#00D2F6] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#00D2F6]" />
                      <span>{isSubmitting ? 'Enviando e-mail...' : `Enviar por E-mail (${CONTACT_CONFIG.email})`}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
