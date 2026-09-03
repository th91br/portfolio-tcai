import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Zap,
  Bot,
  Code2,
  Layers,
  ChevronRight,
  Send,
  Target,
  Clock,
  Lock,
  Terminal,
  Activity,
  Cpu,
} from 'lucide-react';
import {
  STEP_1_NECESSIDADE,
  STEP_2_CONDITIONAL,
  STEP_3_ESTAGIO,
  STEP_4_OBJETIVO,
  STEP_5_PRAZO,
  STEP_6_INVESTIMENTO,
  STEP_7_DECISAO,
  DiagnosticOption,
} from '../../services/diagnostic/diagnosticConfig';
import {
  calculateLeadScore,
  determineRecommendation,
  generateDiagnosticWhatsAppUrl,
  DiagnosticAnswersRecord,
  RecommendationResult,
} from '../../services/diagnostic/scoreCalculator';
import {
  submitDiagnostic,
  trackDiagnosticEvent,
} from '../../lib/supabase';
import { DiagnosticStepCard } from './DiagnosticStepCard';
import { TextShimmer } from '../ui/TextShimmer';

export const DiagnosticSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasTrackedView, setHasTrackedView] = useState(false);

  // Estados do fluxo:
  // 0 = Boas-vindas/Intro
  // 1..7 = Perguntas
  // 8 = Captura de Lead (Contato + LGPD)
  // 9 = Resultado do Diagnóstico
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Armazenamento de respostas
  const [answers, setAnswers] = useState<DiagnosticAnswersRecord>({});
  const [answersArray, setAnswersArray] = useState<
    Array<{
      step_number: number;
      question_id: string;
      question_title: string;
      answer_value: string;
      answer_label: string;
    }>
  >([]);

  // Estados do formulário de captura
  const [leadName, setLeadName] = useState('');
  const [leadWhatsapp, setLeadWhatsapp] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [consentLgpd, setConsentLgpd] = useState(false);
  const [honeypot, setHoneypot] = useState(''); // Anti-spam
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Resultado
  const [finalRecommendation, setFinalRecommendation] = useState<RecommendationResult | null>(null);

  // Rastreio de visualização da seção
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasTrackedView) {
          setHasTrackedView(true);
          trackDiagnosticEvent('diagnostic_view');
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasTrackedView]);

  const startTimeRef = useRef<number>(Date.now());

  // Iniciar Diagnóstico
  const handleStart = () => {
    startTimeRef.current = Date.now();
    setCurrentStep(1);
    trackDiagnosticEvent('diagnostic_start');
  };

  // Máscara de WhatsApp
  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    let formatted = raw;

    if (raw.length > 0) {
      formatted = `(${raw.substring(0, 2)}`;
    }
    if (raw.length > 2) {
      formatted += `) ${raw.substring(2, 7)}`;
    }
    if (raw.length > 7) {
      formatted += `-${raw.substring(7, 11)}`;
    }

    setLeadWhatsapp(formatted);
  };

  // Selecionar opção de cada pergunta
  const handleSelectOption = (
    stepNumber: number,
    questionId: string,
    questionTitle: string,
    option: DiagnosticOption
  ) => {
    const updatedAnswers = {
      ...answers,
      [questionId]: option.id,
      [`${questionId}Label`]: option.label,
    };
    setAnswers(updatedAnswers);

    // Atualiza o array de respostas gravadas
    const existingIndex = answersArray.findIndex((a) => a.question_id === questionId);
    const newAnswerEntry = {
      step_number: stepNumber,
      question_id: questionId,
      question_title: questionTitle,
      answer_value: option.id,
      answer_label: option.label,
    };

    if (existingIndex >= 0) {
      const copy = [...answersArray];
      copy[existingIndex] = newAnswerEntry;
      setAnswersArray(copy);
    } else {
      setAnswersArray([...answersArray, newAnswerEntry]);
    }

    // Rastreia evento da etapa
    trackDiagnosticEvent('diagnostic_step', stepNumber, {
      question_id: questionId,
      selected_value: option.id,
    });

    // Avança suavemente para a próxima etapa
    if (stepNumber < 7) {
      setCurrentStep(stepNumber + 1);
    } else {
      // Chegou ao fim das 7 perguntas -> vai para captura
      setCurrentStep(8);
      trackDiagnosticEvent('diagnostic_complete');
    }
  };

  // Submissão do Lead e cálculo final
  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // 1. Anti-spam check: Honeypot preenchido
    if (honeypot && honeypot.trim() !== '') {
      console.warn('Bot submission blocked via honeypot.');
      return;
    }

    // 2. Anti-bot timer check: Mínimo 4 segundos para percorrer todo o fluxo
    const elapsedTime = Date.now() - startTimeRef.current;
    if (elapsedTime < 4000) {
      setSubmitError('Por favor, revise suas respostas antes de finalizar.');
      return;
    }

    // 3. Client-side Rate Limit: Cooldown de 30 segundos
    const lastSubmit = localStorage.getItem('tcai_last_submit_ts');
    if (lastSubmit && Date.now() - parseInt(lastSubmit, 10) < 30000) {
      setSubmitError('Aguarde 30 segundos antes de submeter um novo diagnóstico.');
      return;
    }

    // 4. Validação de Nome
    const trimmedName = leadName.trim().replace(/\s+/g, ' ');
    if (trimmedName.length < 2) {
      setSubmitError('Por favor, informe seu nome completo.');
      return;
    }

    // 5. Validação de Telefone (10 a 15 dígitos numéricos)
    const cleanPhone = leadWhatsapp.replace(/\D/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      setSubmitError('Por favor, informe um WhatsApp válido com DDD (mínimo 10 dígitos).');
      return;
    }

    // 6. Validação de E-mail com Regex RFC
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const trimmedEmail = leadEmail.trim().toLowerCase();
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setSubmitError('Por favor, informe um e-mail válido (ex: seuemail@empresa.com.br).');
      return;
    }

    // 7. Validação mandatória de LGPD
    if (!consentLgpd) {
      setSubmitError('É necessário autorizar o contato para receber o direcionamento técnico.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 8. Calcula Lead Score determinístico (0 a 100)
      const scoreResult = calculateLeadScore(answers);

      // 9. Determina recomendação determinística
      const recommendation = determineRecommendation(answers);
      setFinalRecommendation(recommendation);

      // 10. Submete ao Supabase via RPC segura
      const res = await submitDiagnostic({
        name: trimmedName,
        whatsapp: leadWhatsapp.trim(),
        email: trimmedEmail,
        company: leadCompany.trim() || undefined,
        consent_lgpd: consentLgpd,
        recommended_solution: recommendation.solutionTitle,
        solution_reason: recommendation.reason,
        score: scoreResult.totalScore,
        score_category: scoreResult.category,
        fit_score: scoreResult.fitScore,
        intent_score: scoreResult.intentScore,
        urgency_score: scoreResult.urgencyScore,
        readiness_score: scoreResult.readinessScore,
        score_breakdown: {
          ...scoreResult.breakdown,
          lgpd_consent_at: new Date().toISOString(),
          lgpd_consent_text:
            'Concordo com o uso dos meus dados para receber contato relacionado ao meu projeto e ao direcionamento técnico solicitado.',
        },
        answers: answersArray,
        origin: 'Diagnóstico TCA — Portfólio',
      });

      if (!res.success && res.error) {
        console.warn('Notice from submitDiagnostic:', res.error);
      }

      // Registra timestamp para rate-limit local
      localStorage.setItem('tcai_last_submit_ts', Date.now().toString());

      // Exibe tela de resultado
      setCurrentStep(9);
    } catch (err: any) {
      console.error('Falha ao submeter diagnóstico:', err);
      const rec = determineRecommendation(answers);
      setFinalRecommendation(rec);
      setCurrentStep(9);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clique no WhatsApp do resultado
  const handleOpenWhatsApp = () => {
    if (!finalRecommendation) return;

    trackDiagnosticEvent('diagnostic_whatsapp_click', 9, {
      recommended_solution: finalRecommendation.solutionTitle,
      lead_name: leadName,
    });

    const url = generateDiagnosticWhatsAppUrl({
      leadName,
      answers: {
        ...answers,
        empresa: leadCompany,
      },
      recommendation: finalRecommendation,
    });

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Reiniciar diagnóstico
  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setAnswersArray([]);
    setLeadName('');
    setLeadWhatsapp('');
    setLeadEmail('');
    setLeadCompany('');
    setConsentLgpd(false);
    setFinalRecommendation(null);
  };

  // Helper para obter a pergunta da Etapa 2 condicional
  const getStep2Question = () => {
    const selectedNecessidade = answers.necessidade || 'ainda_nao_sei';
    return STEP_2_CONDITIONAL[selectedNecessidade] || STEP_2_CONDITIONAL.ainda_nao_sei;
  };

  return (
    <section
      ref={sectionRef}
      id="diagnostico"
      className="relative w-full bg-gradient-to-b from-[#07111F] via-[#060E1C] to-[#07111F] text-[#F3F5F7] py-20 sm:py-28 px-4 sm:px-6 md:px-10 border-t border-white/[0.06] overflow-hidden z-20"
    >
      {/* Background ambient lighting — AMPLIFIED royal blue nebula */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-br from-[#00D2F6]/18 via-[#015EEF]/10 to-transparent blur-[130px] pointer-events-none rounded-full" />
      {/* Deep cobalt accent orb top-right */}
      <div className="absolute -top-20 right-0 w-[500px] h-[400px] bg-gradient-to-bl from-[#015EEF]/15 via-[#00D2F6]/08 to-transparent blur-[120px] pointer-events-none rounded-full" />
      {/* Deep cobalt accent orb bottom-left */}
      <div className="absolute bottom-0 left-0 w-[450px] h-[350px] bg-gradient-to-tr from-[#015EEF]/12 via-transparent to-transparent blur-[100px] pointer-events-none rounded-full" />

      <div className={`w-full mx-auto relative z-10 transition-all duration-500 ${currentStep === 0 ? 'max-w-6xl' : 'max-w-4xl'}`}>
        {/* =====================================================================
            ESTADO 0: COCKPIT EXECUTIVO DO DIAGNÓSTICO (Alto Magnetismo & Conversão)
           ===================================================================== */}
        {currentStep === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full relative rounded-3xl bg-gradient-to-br from-[#071526]/98 via-[#060F1E]/95 to-[#050D1A]/98 border border-[#00D2F6]/30 shadow-[0_0_90px_rgba(0,210,246,0.18)] p-6 sm:p-10 lg:p-12 overflow-hidden backdrop-blur-2xl"
          >
            {/* Ambient Background Corner Glows inside Capsule — AMPLIFIED COBALT */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#00D2F6]/22 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#015EEF]/22 rounded-full blur-3xl pointer-events-none" />
            {/* Center aura inside capsule */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[#015EEF]/08 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none opacity-60" />

            {/* Top Scanning Line */}
            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00D2F6] to-transparent pointer-events-none animate-pulse" />

            {/* Cockpit Top Bar: Live Status & Telemetry */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-6 sm:pb-8 mb-6 sm:mb-8 border-b border-white/[0.08]">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0A1624] border border-[#00D2F6]/40 shadow-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-[#00D2F6] uppercase">
                  SISTEMA DE ANÁLISE ATIVO // v2.4
                </span>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs font-mono text-[#94A3B8]">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Zap className="w-3.5 h-3.5" /> 100% GRATUITO
                </span>
                <span className="text-white/20">•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#00D2F6]" /> ~90 SEGUNDOS
                </span>
                <span className="text-white/20 hidden sm:inline">•</span>
                <span className="hidden sm:flex items-center gap-1.5 text-[#CBD5E1]">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" /> SIGILO LGPD
                </span>
              </div>
            </div>

            {/* Main Cockpit Content Grid */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              
              {/* Left Column: High-Impact Persuasion & Directives (7 cols) */}
              <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
                
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 text-[11px] font-mono text-[#00D2F6] font-bold tracking-wider uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-[#00D2F6]" />
                    <span>DIAGNÓSTICO ESTRATÉGICO TCA</span>
                  </div>

                  <motion.h2
                    className="relative font-kanit font-black text-2xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-[#FFFFFF] leading-[1.08] select-none"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.18 } },
                    }}
                  >
                    <motion.span
                      className="inline-block text-[#F3F5F7]"
                      variants={{
                        hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
                        visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
                      }}
                    >
                      QUAL SOLUÇÃO DIGITAL
                    </motion.span>
                    <br className="hidden sm:inline" />

                    <motion.span
                      className="inline-block"
                      variants={{
                        hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
                        visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
                      }}
                    >
                      <span className="text-[#F3F5F7]">FAZ </span>
                      <TextShimmer duration={3.2}>MAIS SENTIDO</TextShimmer>
                    </motion.span>
                    <br className="hidden sm:inline" />

                    <motion.span
                      className="inline-block text-[#F3F5F7]"
                      variants={{
                        hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
                        visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
                      }}
                    >
                      PARA O SEU NEGÓCIO?
                    </motion.span>
                  </motion.h2>

                  <p className="text-[#94A3B8] text-sm sm:text-base font-light leading-relaxed max-w-[50ch]">
                    Não arrisque semanas e verbas na arquitetura errada. Em apenas 7 etapas rápidas, nosso algoritmo executivo mapeia a rota técnica ideal, prazos garantidos e viabilidade sem qualquer custo ou viés de agência.
                  </p>
                </div>

                {/* What you unlock: 4 Clear Value Deliverables */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-1">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] flex items-center gap-2.5">
                    <Target className="w-4 h-4 text-[#00D2F6] shrink-0" />
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-white font-kanit uppercase">Score de Viabilidade</span>
                      <span className="text-[10px] font-mono text-[#94A3B8]">Mapeamento 0 a 100</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-[#00D2F6] shrink-0" />
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-white font-kanit uppercase">Prazo Contratual</span>
                      <span className="text-[10px] font-mono text-[#94A3B8]">Estimativa de 3 a 10 dias</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] flex items-center gap-2.5">
                    <Cpu className="w-4 h-4 text-[#00D2F6] shrink-0" />
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-white font-kanit uppercase">Stack Recomendada</span>
                      <span className="text-[10px] font-mono text-[#94A3B8]">Web, IA ou SaaS</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-white font-kanit uppercase">Código Proprietário</span>
                      <span className="text-[10px] font-mono text-[#94A3B8]">100% de posse sua</span>
                    </div>
                  </div>
                </div>

                {/* Big Magnetic CTA Button */}
                <div className="pt-2 w-full sm:w-auto">
                  <motion.button
                    type="button"
                    onClick={handleStart}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-4.5 rounded-full font-kanit font-extrabold text-sm sm:text-base uppercase tracking-wider text-white flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(0,210,246,0.35)] hover:shadow-[0_0_60px_rgba(0,210,246,0.5)] bg-gradient-to-r from-[#00D2F6] via-[#0096F5] to-[#015EEF] border border-white/25 cursor-pointer transition-all duration-300"
                  >
                    <span>INICIAR DIAGNÓSTICO GRATUITO (90 SEG)</span>
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5 text-white" />
                  </motion.button>
                  <p className="text-[11px] font-mono text-[#64748B] mt-2.5 flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>Dados 100% confidenciais • Sem compromisso contratual</span>
                  </p>
                </div>

              </div>

              {/* Right Column: Live Interactive Telemetry Simulator (5 cols) */}
              <div className="lg:col-span-5 relative w-full">
                <div className="relative rounded-2xl bg-[#030712]/95 border border-white/12 p-5 sm:p-6 shadow-2xl overflow-hidden group">
                  
                  {/* Glass Shimmer on Top */}
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#00D2F6]/60 to-transparent" />

                  {/* Simulator Header */}
                  <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-[#00D2F6]" />
                      <span className="text-[11px] font-mono font-bold text-white tracking-wider">
                        TCA_ENGINE_SIMULATOR
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ONLINE
                    </div>
                  </div>

                  {/* Simulated Metrics Card */}
                  <div className="space-y-3.5">
                    {/* Gauge 1 */}
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#94A3B8]">Índice de Aderência Estimado</span>
                        <span className="text-[#00D2F6] font-bold">96.4%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#00D2F6] to-[#015EEF] w-[96%]" />
                      </div>
                    </div>

                    {/* Output Preview 1 */}
                    <div className="p-3 rounded-xl bg-[#07111F]/80 border border-[#00D2F6]/20 flex items-center justify-between">
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] font-mono text-[#94A3B8] uppercase">Solução Prévia</span>
                        <span className="text-xs font-bold text-white font-kanit">Plataforma Web + IA 24/7</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#00D2F6]/10 text-[10px] font-mono font-bold text-[#00D2F6]">
                        ALTA PRIORIDADE
                      </span>
                    </div>

                    {/* Output Preview 2 */}
                    <div className="p-3 rounded-xl bg-[#07111F]/80 border border-white/[0.06] flex items-center justify-between">
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] font-mono text-[#94A3B8] uppercase">SLA de Entrega</span>
                        <span className="text-xs font-bold text-emerald-400 font-kanit">7 Dias Úteis (Recorde)</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#64748B]">Contrato Blindado</span>
                    </div>

                    {/* Terminal Feed Simulation */}
                    <div className="p-2.5 rounded-lg bg-black/50 border border-white/[0.04] text-[10px] font-mono text-[#64748B] space-y-1">
                      <div className="flex items-center gap-1 text-[#00D2F6]">
                        <span className="animate-pulse">&gt;</span>
                        <span>Aguardando entrada dos parâmetros do projeto...</span>
                      </div>
                      <div className="text-slate-500">
                        Clique ao lado para calibrar o escopo do seu negócio.
                      </div>
                    </div>

                  </div>

                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* =====================================================================
            ESTADOS 1 A 7: FLUXO MULTI-STEP DE PERGUNTAS
           ===================================================================== */}
        {currentStep >= 1 && currentStep <= 7 && (
          <div className="w-full rounded-3xl bg-[#050D1A]/95 border border-[#00D2F6]/30 shadow-[0_0_80px_rgba(0,210,246,0.12)] p-6 sm:p-10 backdrop-blur-xl relative overflow-hidden">
            {/* Header de Progresso */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-between gap-4 mb-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex items-center gap-1.5 text-xs font-mono uppercase text-[#94A3B8] hover:text-[#00D2F6] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Voltar</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#00D2F6] tracking-wider">
                    {String(currentStep).padStart(2, '0')} / 07
                  </span>
                </div>
              </div>

              {/* Barra de Progresso Animada */}
              <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#00D2F6] to-[#015EEF]"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / 7) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Conteúdo da Etapa */}
            <AnimatePresence mode="wait">
              {/* ETAPA 1 */}
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="mb-6">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#00D2F6] font-semibold">
                      {STEP_1_NECESSIDADE.category}
                    </span>
                    <h3 className="font-kanit font-black text-2xl sm:text-3xl text-white uppercase mt-1 leading-snug">
                      {STEP_1_NECESSIDADE.title}
                    </h3>
                    <p className="text-[#94A3B8] text-xs sm:text-sm font-light mt-1.5">
                      {STEP_1_NECESSIDADE.subtitle}
                    </p>
                  </div>

                  <DiagnosticStepCard
                    options={STEP_1_NECESSIDADE.options}
                    selectedId={answers.necessidade}
                    onSelect={(opt) =>
                      handleSelectOption(1, 'necessidade', STEP_1_NECESSIDADE.title, opt)
                    }
                  />
                </motion.div>
              )}

              {/* ETAPA 2 (CONDICIONAL) */}
              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  {(() => {
                    const step2 = getStep2Question();
                    return (
                      <>
                        <div className="mb-6">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#00D2F6] font-semibold">
                            {step2.category}
                          </span>
                          <h3 className="font-kanit font-black text-2xl sm:text-3xl text-white uppercase mt-1 leading-snug">
                            {step2.title}
                          </h3>
                          <p className="text-[#94A3B8] text-xs sm:text-sm font-light mt-1.5">
                            {step2.subtitle}
                          </p>
                        </div>

                        <DiagnosticStepCard
                          options={step2.options}
                          selectedId={answers.problema}
                          onSelect={(opt) =>
                            handleSelectOption(2, 'problema', step2.title, opt)
                          }
                        />
                      </>
                    );
                  })()}
                </motion.div>
              )}

              {/* ETAPA 3 */}
              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="mb-6">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#00D2F6] font-semibold">
                      {STEP_3_ESTAGIO.category}
                    </span>
                    <h3 className="font-kanit font-black text-2xl sm:text-3xl text-white uppercase mt-1 leading-snug">
                      {STEP_3_ESTAGIO.title}
                    </h3>
                    <p className="text-[#94A3B8] text-xs sm:text-sm font-light mt-1.5">
                      {STEP_3_ESTAGIO.subtitle}
                    </p>
                  </div>

                  <DiagnosticStepCard
                    options={STEP_3_ESTAGIO.options}
                    selectedId={answers.estagio}
                    onSelect={(opt) =>
                      handleSelectOption(3, 'estagio', STEP_3_ESTAGIO.title, opt)
                    }
                  />
                </motion.div>
              )}

              {/* ETAPA 4 */}
              {currentStep === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="mb-6">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#00D2F6] font-semibold">
                      {STEP_4_OBJETIVO.category}
                    </span>
                    <h3 className="font-kanit font-black text-2xl sm:text-3xl text-white uppercase mt-1 leading-snug">
                      {STEP_4_OBJETIVO.title}
                    </h3>
                    <p className="text-[#94A3B8] text-xs sm:text-sm font-light mt-1.5">
                      {STEP_4_OBJETIVO.subtitle}
                    </p>
                  </div>

                  <DiagnosticStepCard
                    options={STEP_4_OBJETIVO.options}
                    selectedId={answers.objetivo}
                    onSelect={(opt) =>
                      handleSelectOption(4, 'objetivo', STEP_4_OBJETIVO.title, opt)
                    }
                  />
                </motion.div>
              )}

              {/* ETAPA 5 */}
              {currentStep === 5 && (
                <motion.div
                  key="step-5"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="mb-6">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#00D2F6] font-semibold">
                      {STEP_5_PRAZO.category}
                    </span>
                    <h3 className="font-kanit font-black text-2xl sm:text-3xl text-white uppercase mt-1 leading-snug">
                      {STEP_5_PRAZO.title}
                    </h3>
                    <p className="text-[#94A3B8] text-xs sm:text-sm font-light mt-1.5">
                      {STEP_5_PRAZO.subtitle}
                    </p>
                  </div>

                  <DiagnosticStepCard
                    options={STEP_5_PRAZO.options}
                    selectedId={answers.prazo}
                    onSelect={(opt) =>
                      handleSelectOption(5, 'prazo', STEP_5_PRAZO.title, opt)
                    }
                  />
                </motion.div>
              )}

              {/* ETAPA 6 */}
              {currentStep === 6 && (
                <motion.div
                  key="step-6"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="mb-6">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#00D2F6] font-semibold">
                      {STEP_6_INVESTIMENTO.category}
                    </span>
                    <h3 className="font-kanit font-black text-2xl sm:text-3xl text-white uppercase mt-1 leading-snug">
                      {STEP_6_INVESTIMENTO.title}
                    </h3>
                    <p className="text-[#94A3B8] text-xs sm:text-sm font-light mt-1.5">
                      {STEP_6_INVESTIMENTO.subtitle}
                    </p>
                  </div>

                  <DiagnosticStepCard
                    options={STEP_6_INVESTIMENTO.options}
                    selectedId={answers.investimento}
                    onSelect={(opt) =>
                      handleSelectOption(6, 'investimento', STEP_6_INVESTIMENTO.title, opt)
                    }
                  />
                </motion.div>
              )}

              {/* ETAPA 7 */}
              {currentStep === 7 && (
                <motion.div
                  key="step-7"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="mb-6">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#00D2F6] font-semibold">
                      {STEP_7_DECISAO.category}
                    </span>
                    <h3 className="font-kanit font-black text-2xl sm:text-3xl text-white uppercase mt-1 leading-snug">
                      {STEP_7_DECISAO.title}
                    </h3>
                    <p className="text-[#94A3B8] text-xs sm:text-sm font-light mt-1.5">
                      {STEP_7_DECISAO.subtitle}
                    </p>
                  </div>

                  <DiagnosticStepCard
                    options={STEP_7_DECISAO.options}
                    selectedId={answers.decisao}
                    onSelect={(opt) =>
                      handleSelectOption(7, 'decisao', STEP_7_DECISAO.title, opt)
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* =====================================================================
            ESTADO 8: CAPTURA DO LEAD (NOME, WHATSAPP, EMAIL, EMPRESA, LGPD)
           ===================================================================== */}
        {currentStep === 8 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#091524]/90 border border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <button
                type="button"
                onClick={() => setCurrentStep(7)}
                className="flex items-center gap-1.5 text-xs font-mono uppercase text-[#94A3B8] hover:text-[#00D2F6] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar às perguntas</span>
              </button>

              <span className="text-xs font-mono font-bold text-[#00D2F6]">
                QUASE PRONTO • ETAPA FINAL
              </span>
            </div>

            <div className="mb-8 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D2F6]/10 border border-[#00D2F6]/25 text-[10px] font-mono text-[#00D2F6] font-semibold mb-3">
                <CheckCircle2 className="w-3 h-3" />
                <span>7 DE 7 PERGUNTAS CONCLUÍDAS</span>
              </div>
              <h3 className="font-kanit font-black text-2xl sm:text-3xl text-white uppercase leading-snug">
                ONDE DEVEMOS ENVIAR SEU DIRECIONAMENTO TÉCNICO?
              </h3>
              <p className="text-[#94A3B8] text-xs sm:text-sm font-light mt-1.5 max-w-xl">
                Preencha seus dados de contato direto para desbloquear a recomendação de solução e falar com Thiago.
              </p>
            </div>

            <form onSubmit={handleSubmitLead} className="space-y-4 sm:space-y-5">
              {/* Honeypot anti-spam invisível e inacessível a usuários reais */}
              <input
                type="text"
                name="website_url_field"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{
                  position: 'absolute',
                  left: '-9999px',
                  top: '-9999px',
                  opacity: 0,
                  width: 0,
                  height: 0,
                  pointerEvents: 'none',
                }}
                tabIndex={-1}
                aria-hidden="true"
                autoComplete="off"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#CBD5E1] uppercase tracking-wider mb-1.5">
                    Nome Completo <span className="text-[#00D2F6]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="Ex: João da Silva"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#00D2F6] focus:ring-1 focus:ring-[#00D2F6] transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#CBD5E1] uppercase tracking-wider mb-1.5">
                    WhatsApp <span className="text-[#00D2F6]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={leadWhatsapp}
                    onChange={handleWhatsappChange}
                    placeholder="(54) 99999-9999"
                    maxLength={15}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#00D2F6] focus:ring-1 focus:ring-[#00D2F6] transition-all text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#CBD5E1] uppercase tracking-wider mb-1.5">
                    Seu Melhor E-mail <span className="text-[#00D2F6]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="seuemail@empresa.com.br"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#00D2F6] focus:ring-1 focus:ring-[#00D2F6] transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#CBD5E1] uppercase tracking-wider mb-1.5">
                    Empresa / Negócio <span className="text-slate-500 font-normal">(Opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={leadCompany}
                    onChange={(e) => setLeadCompany(e.target.value)}
                    placeholder="Ex: Minha Empresa S.A."
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#00D2F6] focus:ring-1 focus:ring-[#00D2F6] transition-all text-sm"
                  />
                </div>
              </div>

              {/* Checkbox LGPD Obrigatório */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    required
                    checked={consentLgpd}
                    onChange={(e) => setConsentLgpd(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-white/20 text-[#00D2F6] bg-white/[0.05] focus:ring-[#00D2F6] focus:ring-offset-0 transition-colors cursor-pointer"
                  />
                  <span className="text-xs text-[#94A3B8] group-hover:text-[#CBD5E1] transition-colors leading-relaxed">
                    Concordo com o uso dos meus dados para receber contato relacionado ao meu projeto e
                    ao direcionamento técnico solicitado.
                  </span>
                </label>
              </div>

              {/* Mensagem de Erro */}
              {submitError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                  {submitError}
                </div>
              )}

              {/* Botão de Envio */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full font-kanit font-extrabold text-sm uppercase tracking-wider text-white flex items-center justify-center gap-3 shadow-2xl shadow-[#00D2F6]/25 bg-gradient-to-r from-[#00D2F6] via-[#0096F5] to-[#015EEF] border border-white/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D2F6]"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>PROCESSANDO DIAGNÓSTICO...</span>
                    </>
                  ) : (
                    <>
                      <span>VER RESULTADO DO DIAGNÓSTICO</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* =====================================================================
            ESTADO 9: RESULTADO PERSONALIZADO + CTA DO WHATSAPP
           ===================================================================== */}
        {currentStep === 9 && finalRecommendation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="bg-gradient-to-b from-[#0A1A2E] via-[#091524] to-[#07111F] border border-[#00D2F6]/30 rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_0_50px_rgba(0,210,246,0.15)] relative overflow-hidden"
          >
            {/* Top Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/[0.08] mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00D2F6]/10 border border-[#00D2F6]/30 text-xs font-mono font-bold text-[#00D2F6]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>DIAGNÓSTICO CONCLUÍDO COM SUCESSO</span>
              </div>

              <div className="text-xs font-mono text-[#94A3B8]">
                CLIENTE: <span className="text-white font-semibold">{leadName}</span>
              </div>
            </div>

            {/* Solução Recomendada em Destaque */}
            <div className="mb-6">
              <span className="text-[11px] font-mono text-[#00D2F6] font-semibold uppercase tracking-widest block mb-1">
                SOLUÇÃO TECNOLÓGICA RECOMENDADA
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-kanit font-black text-2xl sm:text-3xl md:text-4xl text-white uppercase tracking-tight">
                  {finalRecommendation.solutionTitle}
                </h3>
                <span className="px-3 py-1 rounded-full bg-[#00D2F6]/20 border border-[#00D2F6]/40 text-[#00D2F6] text-xs font-mono font-bold">
                  SLA: {finalRecommendation.slaTime}
                </span>
              </div>
            </div>

            {/* Motivo do Direcionamento */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] mb-6">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-2">
                POR QUE ESTA SOLUÇÃO?
              </h4>
              <p className="text-sm sm:text-base text-[#E2E8F0] font-light leading-relaxed">
                {finalRecommendation.reason}
              </p>
            </div>

            {/* Prioridades Identificadas */}
            <div className="mb-8">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-3">
                PRIORIDADES TÉCNICAS E ESTRATÉGICAS IDENTIFICADAS
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {finalRecommendation.priorities.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#07111F]/80 border border-white/[0.06] text-xs text-[#CBD5E1] flex items-start gap-2.5 leading-snug"
                  >
                    <span className="w-4 h-4 rounded-full bg-[#00D2F6]/20 text-[#00D2F6] flex items-center justify-center shrink-0 text-[10px] font-mono font-bold mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Próximo Passo */}
            <div className="p-4 rounded-xl bg-[#00D2F6]/5 border border-[#00D2F6]/20 mb-8 flex items-center gap-3">
              <Zap className="w-5 h-5 text-[#00D2F6] shrink-0" />
              <div className="text-xs sm:text-sm text-[#93C5FD]">
                <strong className="text-white font-semibold">Próximo Passo Recomendado: </strong>
                {finalRecommendation.nextStep}
              </div>
            </div>

            {/* Ações Finais: WhatsApp de Thiago + Reiniciar */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="w-full sm:flex-1 py-4 px-6 rounded-full font-kanit font-extrabold text-xs sm:text-sm uppercase tracking-wider text-white flex items-center justify-center gap-3 shadow-2xl shadow-[#00D2F6]/30 bg-gradient-to-r from-[#00D2F6] via-[#0096F5] to-[#015EEF] border border-white/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D2F6]"
              >
                <MessageCircle className="w-5 h-5" />
                <span>CONVERSAR COM THIAGO SOBRE ESTE PROJETO</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto py-4 px-6 rounded-full border border-white/10 hover:border-white/20 bg-white/[0.02] text-[#94A3B8] hover:text-white text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refazer</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default DiagnosticSection;
