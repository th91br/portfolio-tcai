import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Settings,
  Building2,
  Cpu,
  FileText,
  Smartphone,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Radio,
  Image as ImageIcon,
  Mic,
  MessageSquare,
} from 'lucide-react';
import {
  AgentConfigStore,
  GeminiModel,
  WhatsAppProvider,
} from '../../../services/agent/agentConfigTypes';
import {
  getStoredAgentConfig,
  saveStoredAgentConfig,
  PROMPT_PRESETS,
  testGeminiApiLive,
} from '../../../services/agent/agentConfigStorage';

interface AgentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved?: (config: AgentConfigStore) => void;
}

type TabType = 'company' | 'gemini' | 'prompt' | 'whatsapp';

export const AgentSettingsModal: React.FC<AgentSettingsModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('company');
  const [config, setConfig] = useState<AgentConfigStore>(getStoredAgentConfig());
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTestingGemini, setIsTestingGemini] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
    latencyMs?: number;
  } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [newServiceInput, setNewServiceInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      setConfig(getStoredAgentConfig());
      setTestResult(null);
      setSaveSuccess(false);
    }
  }, [isOpen]);

  const handleSave = () => {
    saveStoredAgentConfig(config);
    setSaveSuccess(true);
    if (onConfigSaved) onConfigSaved(config);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const handleTestGemini = async () => {
    if (!config.gemini.apiKey.trim()) {
      setTestResult({
        success: false,
        error: 'Informe a Chave de API do Gemini antes de testar.',
      });
      return;
    }

    setIsTestingGemini(true);
    setTestResult(null);

    const res = await testGeminiApiLive(config.gemini.apiKey, config.gemini.model);
    setTestResult(res);
    setIsTestingGemini(false);
  };

  const applyPreset = (presetId: string) => {
    const preset = PROMPT_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setConfig((prev) => ({
        ...prev,
        gemini: {
          ...prev.gemini,
          systemPrompt: preset.systemPrompt,
        },
      }));
    }
  };

  const addService = () => {
    if (!newServiceInput.trim()) return;
    setConfig((prev) => ({
      ...prev,
      company: {
        ...prev.company,
        services: [...prev.company.services, newServiceInput.trim()],
      },
    }));
    setNewServiceInput('');
  };

  const removeService = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      company: {
        ...prev.company,
        services: prev.company.services.filter((_, i) => i !== index),
      },
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#060D17]/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-4xl bg-[#091524] border border-white/[0.12] rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden z-10 flex flex-col max-h-[92vh]"
        >
          {/* Top Header */}
          <div className="px-6 py-5 border-b border-white/[0.08] bg-[#0A1624] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00D2F6]/20 to-[#015EEF]/20 border border-[#00D2F6]/30 flex items-center justify-center text-[#00D2F6]">
                <Settings className="w-5 h-5 animate-[spin_12s_linear_infinite]" />
              </div>
              <div>
                <h3 className="font-kanit font-black text-lg sm:text-xl text-white uppercase tracking-tight flex items-center gap-2">
                  <span>Central de Configurações de IA & WhatsApp</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00D2F6]/10 text-[#00D2F6] border border-[#00D2F6]/25">
                    MULTIMODAL 2.0
                  </span>
                </h3>
                <p className="text-xs text-[#94A3B8] font-light">
                  Personalize o cérebro do Gemini, fotos, áudios, perfil da empresa e conectores de envio.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 pt-3 bg-[#07111F] border-b border-white/[0.06] flex gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('company')}
              className={`px-4 py-2.5 rounded-t-xl font-kanit text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
                activeTab === 'company'
                  ? 'bg-[#091524] text-[#00D2F6] border-[#00D2F6]'
                  : 'text-slate-400 hover:text-white border-transparent'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>1. Perfil da Empresa</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('gemini')}
              className={`px-4 py-2.5 rounded-t-xl font-kanit text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
                activeTab === 'gemini'
                  ? 'bg-[#091524] text-[#00D2F6] border-[#00D2F6]'
                  : 'text-slate-400 hover:text-white border-transparent'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>2. Motor de IA</span>
              {config.gemini.apiKey && (
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('prompt')}
              className={`px-4 py-2.5 rounded-t-xl font-kanit text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
                activeTab === 'prompt'
                  ? 'bg-[#091524] text-[#00D2F6] border-[#00D2F6]'
                  : 'text-slate-400 hover:text-white border-transparent'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>3. Prompt do Sistema</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('whatsapp')}
              className={`px-4 py-2.5 rounded-t-xl font-kanit text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
                activeTab === 'whatsapp'
                  ? 'bg-[#091524] text-[#00D2F6] border-[#00D2F6]'
                  : 'text-slate-400 hover:text-white border-transparent'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>4. WhatsApp API</span>
            </button>
          </div>

          {/* Modal Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-[#F3F5F7]">
            {/* TAB 1: PERFIL DA EMPRESA */}
            {activeTab === 'company' && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-[#00D2F6]/08 border border-[#00D2F6]/20 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[#00D2F6] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#CBD5E1] leading-relaxed">
                    Estas informações são injetadas diretamente no contexto do Agente de IA. Assim, qualquer pessoa ou empresa que usar seu sistema terá o agente falando com o nome, nicho, logotipo e catálogo correto.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-1">
                      Razão Social / Nome Oficial da Empresa
                    </label>
                    <input
                      type="text"
                      value={config.company.companyName}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          company: { ...prev.company, companyName: e.target.value },
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-[#00D2F6] focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-1">
                      Nome Fantasia / Marca de Exibição
                    </label>
                    <input
                      type="text"
                      value={config.company.tradingName}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          company: { ...prev.company, tradingName: e.target.value },
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-[#00D2F6] focus:outline-none text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-1">
                      URL da Foto / Logo da Empresa
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                        {config.company.logoUrl ? (
                          <img
                            src={config.company.logoUrl}
                            alt="Logo preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <Building2 className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                      <input
                        type="text"
                        value={config.company.logoUrl}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            company: { ...prev.company, logoUrl: e.target.value },
                          }))
                        }
                        placeholder="/favicon.svg ou https://..."
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-[#00D2F6] focus:outline-none text-sm font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-1">
                      Nicho / Segmento de Atuação
                    </label>
                    <input
                      type="text"
                      value={config.company.niche}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          company: { ...prev.company, niche: e.target.value },
                        }))
                      }
                      placeholder="Ex: Medicina, Advocacia, Software, Imobiliária"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-[#00D2F6] focus:outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-1">
                    Descrição Institucional & Diferenciais
                  </label>
                  <textarea
                    rows={3}
                    value={config.company.description}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        company: { ...prev.company, description: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-[#00D2F6] focus:outline-none text-sm leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-1.5">
                    Serviços & Produtos Oferecidos pelo Agente
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {config.company.services.map((srv, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs text-[#E2E8F0]"
                      >
                        <span>{srv}</span>
                        <button
                          type="button"
                          onClick={() => removeService(idx)}
                          className="text-slate-400 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newServiceInput}
                      onChange={(e) => setNewServiceInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                      placeholder="Adicionar novo serviço ou produto..."
                      className="flex-1 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm"
                    />
                    <button
                      type="button"
                      onClick={addService}
                      className="px-4 py-2 rounded-xl bg-[#00D2F6]/20 text-[#00D2F6] border border-[#00D2F6]/40 hover:bg-[#00D2F6]/30 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adicionar</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-1">
                      Faixa de Preço / Ticket Médio
                    </label>
                    <input
                      type="text"
                      value={config.company.priceRange}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          company: { ...prev.company, priceRange: e.target.value },
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-1">
                      Telefone Oficial de Contato
                    </label>
                    <input
                      type="text"
                      value={config.company.contactPhone}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          company: { ...prev.company, contactPhone: e.target.value },
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-1">
                      Localização / Base
                    </label>
                    <input
                      type="text"
                      value={config.company.location}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          company: { ...prev.company, location: e.target.value },
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MOTOR DE IA */}
            {activeTab === 'gemini' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Chave de API do Google Gemini (GEMINI_API_KEY)</span>
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00D2F6] hover:underline font-normal text-[11px]"
                    >
                      Obter chave gratuita no Google AI Studio ↗
                    </a>
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={config.gemini.apiKey}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          gemini: { ...prev.gemini, apiKey: e.target.value },
                        }))
                      }
                      placeholder="AIzaSy..."
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-[#00D2F6] focus:outline-none text-sm font-mono pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] font-mono text-slate-500 mt-1">
                    Sua chave é salva em cofre local protegido e usada exclusivamente para responder às solicitações.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-1">
                      Modelo do Google Gemini
                    </label>
                    <select
                      value={config.gemini.model}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          gemini: { ...prev.gemini, model: e.target.value as GeminiModel },
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0A1624] border border-white/10 text-white focus:border-[#00D2F6] focus:outline-none text-sm"
                    >
                      <option value="gemini-2.0-flash">
                        gemini-2.0-flash (Recomendado: Ultra-rápido & Multimodal)
                      </option>
                      <option value="gemini-1.5-flash">
                        gemini-1.5-flash (Alta velocidade com estabilidade)
                      </option>
                      <option value="gemini-1.5-pro">
                        gemini-1.5-pro (Raciocínio complexo & documentos densos)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>Temperatura (Criatividade vs Precisão)</span>
                      <span className="text-[#00D2F6] font-bold">{config.gemini.temperature}</span>
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="0.9"
                      step="0.05"
                      value={config.gemini.temperature}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          gemini: { ...prev.gemini, temperature: parseFloat(e.target.value) },
                        }))
                      }
                      className="w-full mt-2 accent-[#00D2F6] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                      <span>0.1 (Fiel & Preciso)</span>
                      <span>0.9 (Criativo & Aberto)</span>
                    </div>
                  </div>
                </div>

                {/* Multimodal Features */}
                <div className="p-4 rounded-2xl bg-[#060D17] border border-white/[0.08] space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#00D2F6] font-bold flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>Recursos Multimodais Ativos</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] cursor-pointer hover:bg-white/[0.06] transition-colors">
                      <input
                        type="checkbox"
                        checked={config.gemini.enableMultimodalVision}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            gemini: { ...prev.gemini, enableMultimodalVision: e.target.checked },
                          }))
                        }
                        className="w-4 h-4 rounded text-[#00D2F6] accent-[#00D2F6]"
                      />
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-emerald-400" />
                        <div>
                          <p className="text-xs font-semibold text-white">Compreender Fotos & Prints</p>
                          <p className="text-[10px] text-slate-400">Analisa telas, documentos e referências</p>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] cursor-pointer hover:bg-white/[0.06] transition-colors">
                      <input
                        type="checkbox"
                        checked={config.gemini.enableAudioTranscription}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            gemini: { ...prev.gemini, enableAudioTranscription: e.target.checked },
                          }))
                        }
                        className="w-4 h-4 rounded text-[#00D2F6] accent-[#00D2F6]"
                      />
                      <div className="flex items-center gap-2">
                        <Mic className="w-4 h-4 text-purple-400" />
                        <div>
                          <p className="text-xs font-semibold text-white">Compreender Áudios de Voz</p>
                          <p className="text-[10px] text-slate-400">Escuta mensagens de voz e responde</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Live Test Button & Feedback */}
                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={handleTestGemini}
                    disabled={isTestingGemini || !config.gemini.apiKey}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00D2F6]/20 to-[#015EEF]/20 hover:from-[#00D2F6]/30 hover:to-[#015EEF]/30 border border-[#00D2F6]/40 text-[#00D2F6] font-mono font-bold text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Radio className={`w-4 h-4 ${isTestingGemini ? 'animate-pulse text-amber-400' : ''}`} />
                    <span>{isTestingGemini ? 'Testando Conexão...' : 'Testar Conexão com Gemini'}</span>
                  </button>

                  {testResult && (
                    <div
                      className={`text-xs font-mono px-3 py-1.5 rounded-xl flex items-center gap-2 ${
                        testResult.success
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {testResult.success ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>Gemini Conectado ({testResult.latencyMs}ms)</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{testResult.error || 'Falha na conexão'}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: PROMPT DO SISTEMA */}
            {activeTab === 'prompt' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-2">
                    Carregar Template Pronto por Nicho
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {PROMPT_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => applyPreset(preset.id)}
                        className="p-3 rounded-xl bg-white/[0.03] hover:bg-[#00D2F6]/10 border border-white/10 hover:border-[#00D2F6]/40 text-left transition-all cursor-pointer group"
                      >
                        <p className="text-xs font-semibold text-white group-hover:text-[#00D2F6] leading-tight">
                          {preset.title}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono mt-1">{preset.niche}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-mono text-[#94A3B8] uppercase tracking-wider">
                      Instrução Mestra do Sistema (System Prompt)
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">
                      Variáveis aceitas: {'{nome_lead}'}, {'{empresa}'}, {'{score}'}, {'{solucao}'}
                    </span>
                  </div>
                  <textarea
                    rows={12}
                    value={config.gemini.systemPrompt}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        gemini: { ...prev.gemini, systemPrompt: e.target.value },
                      }))
                    }
                    className="w-full p-4 rounded-xl bg-[#060D17] border border-white/10 text-white focus:border-[#00D2F6] focus:outline-none text-xs font-mono leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: INTEGRAÇÃO WHATSAPP */}
            {activeTab === 'whatsapp' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-2">
                    Provedor da API de WhatsApp
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { id: 'simulator', title: 'Simulador / Cockpit', desc: 'Atendimento visual completo' },
                      { id: 'evolution', title: 'Evolution API', desc: 'Open Source auto-hospedado' },
                      { id: 'zapi', title: 'Z-API', desc: 'Provedor Oficial Brasil' },
                      { id: 'meta', title: 'Meta Cloud API', desc: 'API Oficial do WhatsApp' },
                    ].map((prov) => (
                      <button
                        key={prov.id}
                        type="button"
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            whatsapp: {
                              ...prev.whatsapp,
                              provider: prov.id as WhatsAppProvider,
                            },
                          }))
                        }
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          config.whatsapp.provider === prov.id
                            ? 'bg-[#00D2F6]/15 border-[#00D2F6] text-white shadow-[0_0_20px_rgba(0,210,246,0.15)]'
                            : 'bg-white/[0.03] border-white/10 text-slate-300 hover:border-white/25'
                        }`}
                      >
                        <p className="text-xs font-bold">{prov.title}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{prov.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-1">
                      Endpoint Base / URL da API
                    </label>
                    <input
                      type="text"
                      value={config.whatsapp.baseUrl}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          whatsapp: { ...prev.whatsapp, baseUrl: e.target.value },
                        }))
                      }
                      placeholder="https://api.evolution.seuservidor.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs focus:border-[#00D2F6] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-1">
                      Token de Autenticação / API Key
                    </label>
                    <input
                      type="password"
                      value={config.whatsapp.apiKey}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          whatsapp: { ...prev.whatsapp, apiKey: e.target.value },
                        }))
                      }
                      placeholder="Token do provedor..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs focus:border-[#00D2F6] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-1">
                      Instância / Nome da Sessão (Evolution / Z-API)
                    </label>
                    <input
                      type="text"
                      value={config.whatsapp.instanceId}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          whatsapp: { ...prev.whatsapp, instanceId: e.target.value },
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-1">
                      Número Conectado do Agente
                    </label>
                    <input
                      type="text"
                      value={config.whatsapp.phoneNumber}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          whatsapp: { ...prev.whatsapp, phoneNumber: e.target.value },
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#060D17] border border-white/[0.08] space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#00D2F6] font-bold">
                    Opções de Disparo Outbound
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.whatsapp.outboundDeliveryEnabled}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            whatsapp: { ...prev.whatsapp, outboundDeliveryEnabled: e.target.checked },
                          }))
                        }
                        className="w-4 h-4 rounded text-[#00D2F6] accent-[#00D2F6]"
                      />
                      <div>
                        <p className="text-xs font-semibold text-white">
                          Ativar envio de mensagens para o WhatsApp real do cliente
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Quando marcado, as respostas do Agente são disparadas via API oficial para o celular do lead.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Footer Actions */}
          <div className="px-6 py-4 border-t border-white/[0.08] bg-[#0A1624] flex items-center justify-between">
            <div className="flex items-center gap-2">
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Configurações salvas e ativas com sucesso!</span>
                </motion.div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-kanit font-semibold text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00D2F6] to-[#015EEF] text-[#07111F] font-kanit font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:opacity-95 shadow-[0_0_25px_rgba(0,210,246,0.3)] transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Configurações</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
