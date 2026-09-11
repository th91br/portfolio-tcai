// src/components/dashboard/voice/VoiceStudioModal.tsx
// Central Executiva de Clonagem de Voz, Síntese PTT e Regras Estratégicas de Áudio

import React, { useState, useRef } from 'react';
import {
  X,
  Mic,
  Volume2,
  Sparkles,
  Sliders,
  CheckCircle2,
  Play,
  Pause,
  Upload,
  Radio,
  ShieldCheck,
  Zap,
  Clock,
  Settings,
  KeyRound,
  FileAudio,
  UserCheck,
  Layers,
} from 'lucide-react';
import {
  VoiceProfile,
  VoiceStudioConfig,
  getStoredVoiceProfiles,
  saveStoredVoiceProfiles,
  getStoredVoiceConfig,
  saveStoredVoiceConfig,
  synthesizeSpeechAudio,
  AudioGenerationResult,
} from '../../../services/voice/voiceStudioService';

interface VoiceStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceStudioModal: React.FC<VoiceStudioModalProps> = ({ isOpen, onClose }) => {
  const [profiles, setProfiles] = useState<VoiceProfile[]>(getStoredVoiceProfiles());
  const [config, setConfig] = useState<VoiceStudioConfig>(getStoredVoiceConfig());
  const [selectedProfileId, setSelectedProfileId] = useState<string>(config.activeVoiceId);

  // Test Playground State
  const [testText, setTestText] = useState(
    'Fala Dr. Marcos, Thiago aqui! Vi sua mensagem sobre a esteira de IA. Fica tranquilo que a gente entrega tudo homologado em 48 horas úteis. Vamos bater um papo rápido amanhã?'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<AudioGenerationResult | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioPlaybackProgress, setAudioPlaybackProgress] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileUploadRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const currentProfile = profiles.find((p) => p.id === selectedProfileId) || profiles[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSetActiveVoice = (voiceId: string) => {
    setSelectedProfileId(voiceId);
    const updatedConfig = { ...config, activeVoiceId: voiceId };
    setConfig(updatedConfig);
    saveStoredVoiceConfig(updatedConfig);
    showToast(`Voz ativa do agente alterada para: ${profiles.find((p) => p.id === voiceId)?.name}`);
  };

  const handleUpdateCurrentProfileSettings = (key: keyof VoiceProfile['settings'], value: number) => {
    const updatedProfiles = profiles.map((p) => {
      if (p.id === selectedProfileId) {
        return {
          ...p,
          settings: {
            ...p.settings,
            [key]: value,
          },
        };
      }
      return p;
    });
    setProfiles(updatedProfiles);
    saveStoredVoiceProfiles(updatedProfiles);
  };

  const handleToggleRule = (key: keyof VoiceStudioConfig, value: any) => {
    const updated = { ...config, [key]: value };
    setConfig(updated);
    saveStoredVoiceConfig(updated);
    showToast('Regras de disparo de áudio atualizadas.');
  };

  const handleGenerateTestAudio = async () => {
    if (!testText.trim()) return;
    setIsGenerating(true);
    setGeneratedResult(null);
    setIsPlayingAudio(false);

    try {
      const result = await synthesizeSpeechAudio(testText, selectedProfileId);
      setGeneratedResult(result);
      showToast('Áudio de voz clonada gerado com sucesso!');
    } catch (err: any) {
      showToast('Erro ao sintetizar áudio. Verifique as configurações.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTogglePlayAudio = () => {
    if (!audioRef.current || !generatedResult?.audioUrl) return;

    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const handleAudioTimeUpdate = () => {
    if (!audioRef.current) return;
    const progress = (audioRef.current.currentTime / (audioRef.current.duration || 1)) * 100;
    setAudioPlaybackProgress(progress);
  };

  const handleAudioEnded = () => {
    setIsPlayingAudio(false);
    setAudioPlaybackProgress(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#091524] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Toast Notificação */}
        {toastMessage && (
          <div className="absolute top-4 right-4 z-50 px-4 py-2 bg-purple-500/90 border border-purple-400 text-white text-xs font-mono rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Áudio Oculto para Reprodução */}
        {generatedResult?.audioUrl && (
          <audio
            ref={audioRef}
            src={generatedResult.audioUrl}
            onTimeUpdate={handleAudioTimeUpdate}
            onEnded={handleAudioEnded}
          />
        )}

        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#07111F]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-[#00D2F6]/20 border border-purple-500/30 text-purple-300">
              <Mic className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Voice Studio & Clonagem de Voz PTT
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-[10px] font-mono text-purple-300 font-bold">
                  WHATSAPP NATIVE PTT
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Respostas em áudio de alta autoridade com a voz do fundador ou de vendedores, enviadas com timing estratégico
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo com Abas / Seções */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Seção 1: Seleção de Perfil de Voz */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#00D2F6]" />
                1. Selecione o Perfil de Voz Ativo
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                A voz selecionada será usada pelo Agente de IA nos momentos estratégicos
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {profiles.map((profile) => {
                const isSelected = profile.id === selectedProfileId;
                return (
                  <div
                    key={profile.id}
                    onClick={() => handleSetActiveVoice(profile.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-purple-500/10 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                        : 'bg-[#07111F] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            isSelected ? 'bg-purple-400 animate-pulse' : 'bg-slate-600'
                          }`}
                        />
                        <span className="text-xs font-bold text-white">{profile.name}</span>
                      </div>
                      {profile.isCloned && (
                        <span className="px-1.5 py-0.5 rounded bg-[#00D2F6]/15 border border-[#00D2F6]/30 text-[9px] font-mono text-[#00D2F6]">
                          CLONADA
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-300 font-mono mb-1.5">{profile.role}</div>
                    <div className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                      {profile.description}
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Estabilidade: {Math.round(profile.settings.stability * 100)}%</span>
                      <span>Similaridade: {Math.round(profile.settings.similarityBoost * 100)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seção 2: Calibração Fina & Parâmetros da Voz */}
          <div className="p-4 rounded-xl bg-[#07111F] border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h4 className="text-xs font-mono font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                2. Calibração da Voz: <span className="text-purple-300">{currentProfile.name}</span>
              </h4>
              <span className="text-[10px] font-mono text-slate-400">
                Ajuste fino de entonação humana e pausas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
              {/* Estabilidade */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Estabilidade</span>
                  <span className="text-purple-300">
                    {Math.round(currentProfile.settings.stability * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={currentProfile.settings.stability}
                  onChange={(e) =>
                    handleUpdateCurrentProfileSettings('stability', parseFloat(e.target.value))
                  }
                  className="w-full accent-purple-400 cursor-pointer"
                />
                <span className="text-[9px] text-slate-500">Mais formal vs Mais dinâmica</span>
              </div>

              {/* Similaridade */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Similaridade Original</span>
                  <span className="text-purple-300">
                    {Math.round(currentProfile.settings.similarityBoost * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={currentProfile.settings.similarityBoost}
                  onChange={(e) =>
                    handleUpdateCurrentProfileSettings('similarityBoost', parseFloat(e.target.value))
                  }
                  className="w-full accent-purple-400 cursor-pointer"
                />
                <span className="text-[9px] text-slate-500">Aderência ao timbre clonado</span>
              </div>

              {/* Expressividade */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Expressividade</span>
                  <span className="text-purple-300">
                    {Math.round(currentProfile.settings.style * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={currentProfile.settings.style}
                  onChange={(e) =>
                    handleUpdateCurrentProfileSettings('style', parseFloat(e.target.value))
                  }
                  className="w-full accent-purple-400 cursor-pointer"
                />
                <span className="text-[9px] text-slate-500">Ênfase em momentos de fechamento</span>
              </div>

              {/* Velocidade / Ritmo */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Velocidade de Fala</span>
                  <span className="text-purple-300">{currentProfile.settings.speed}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.2"
                  step="0.02"
                  value={currentProfile.settings.speed}
                  onChange={(e) =>
                    handleUpdateCurrentProfileSettings('speed', parseFloat(e.target.value))
                  }
                  className="w-full accent-purple-400 cursor-pointer"
                />
                <span className="text-[9px] text-slate-500">Cadência pausada e executiva</span>
              </div>
            </div>
          </div>

          {/* Seção 3: Simulador de Áudio & Test Playground com Waveform PTT */}
          <div className="p-4 rounded-xl bg-[#07111F] border border-white/10 space-y-3">
            <h4 className="text-xs font-mono font-bold text-white flex items-center gap-2">
              <Play className="w-4 h-4 text-emerald-400" />
              3. Teste Imediato de Síntese PTT (Prévia do WhatsApp)
            </h4>

            <div className="space-y-2">
              <textarea
                rows={2}
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                placeholder="Digite uma mensagem para a voz clonada falar..."
                className="w-full px-3 py-2 rounded-xl bg-[#091524] border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
              />

              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-slate-400">
                  {testText.length} caracteres • Estimado em ~{Math.round(testText.length / 14)}s de áudio
                </span>
                <button
                  type="button"
                  onClick={handleGenerateTestAudio}
                  disabled={isGenerating}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-[#00D2F6] text-white text-xs font-mono font-bold hover:brightness-110 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sintetizando Voz...</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Gerar & Ouvir Áudio</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Balão WhatsApp Nativo PTT com Onda Sonora Verde */}
            {generatedResult && (
              <div className="p-4 rounded-2xl bg-[#005c4b]/30 border border-emerald-500/30 max-w-md ml-auto mt-3 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleTogglePlayAudio}
                    className="p-3 rounded-full bg-emerald-500 text-[#07111F] hover:bg-emerald-400 transition-transform active:scale-95 cursor-pointer shadow-lg flex-shrink-0"
                  >
                    {isPlayingAudio ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>

                  <div className="flex-1 space-y-1">
                    {/* Visualizador de Onda Sonora PTT */}
                    <div className="flex items-center gap-0.5 h-7">
                      {generatedResult.waveformData.map((height, i) => {
                        const barProgress = (i / generatedResult.waveformData.length) * 100;
                        const isPlayed = barProgress <= audioPlaybackProgress;

                        return (
                          <div
                            key={i}
                            className={`flex-1 rounded-full transition-all duration-150 ${
                              isPlayed ? 'bg-emerald-400' : 'bg-slate-500/60'
                            }`}
                            style={{ height: `${Math.max(15, height)}%` }}
                          />
                        );
                      })}
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono text-emerald-300">
                      <span>0:0{Math.round(generatedResult.durationSec)}</span>
                      <span className="text-[9px] text-slate-300 flex items-center gap-1">
                        <Mic className="w-2.5 h-2.5 text-emerald-400" />
                        {generatedResult.voiceUsed.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Seção 4: Regras de Disparo Estratégico (Anti-Ban & Anti-Custo) */}
          <div className="p-4 rounded-xl bg-[#07111F] border border-white/10 space-y-3">
            <h4 className="text-xs font-mono font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00D2F6]" />
              4. Regras Estratégicas de Disparo (Anti-Ban & Anti-Custo)
            </h4>
            <p className="text-[11px] text-slate-400">
              Para máxima autoridade e economia de custos, os áudios são enviados apenas nos momentos certos da negociação.
            </p>

            <div className="space-y-2 text-xs font-mono">
              <label className="flex items-start gap-3 p-2.5 rounded-xl bg-[#091524] border border-white/5 cursor-pointer hover:border-white/15">
                <input
                  type="checkbox"
                  checked={config.sendAudioOnLeadAudio}
                  onChange={(e) => handleToggleRule('sendAudioOnLeadAudio', e.target.checked)}
                  className="mt-0.5 rounded accent-purple-400"
                />
                <div>
                  <strong className="text-white block">Espelhamento Humano Instantâneo</strong>
                  <span className="text-slate-400 text-[11px]">
                    Se o cliente mandar um áudio no WhatsApp, a IA transcreve, processa e responde prioritariamente com um áudio curto.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-2.5 rounded-xl bg-[#091524] border border-white/5 cursor-pointer hover:border-white/15">
                <input
                  type="checkbox"
                  checked={config.sendAudioOnHotStages}
                  onChange={(e) => handleToggleRule('sendAudioOnHotStages', e.target.checked)}
                  className="mt-0.5 rounded accent-purple-400"
                />
                <div>
                  <strong className="text-white block">Gatilho de Etapas Quentes de Fechamento</strong>
                  <span className="text-slate-400 text-[11px]">
                    Envia áudio de alta conversão quando a oportunidade alcançar etapas decisivas (Proposta, Reunião, Negociação).
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-2.5 rounded-xl bg-[#091524] border border-white/5 cursor-pointer hover:border-white/15">
                <input
                  type="checkbox"
                  checked={config.fallbackToText}
                  onChange={(e) => handleToggleRule('fallbackToText', e.target.checked)}
                  className="mt-0.5 rounded accent-purple-400"
                />
                <div>
                  <strong className="text-white block">Fallback Automático para Texto</strong>
                  <span className="text-slate-400 text-[11px]">
                    Se a síntese de voz demorar mais de 4 segundos ou falhar, envia a resposta como texto refinado sem deixar o lead esperando.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Seção 5: Chave de API ElevenLabs (Opcional para Produção) */}
          <div className="p-4 rounded-xl bg-[#07111F] border border-white/10 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-bold flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                Chave de API ElevenLabs (Opcional - Ativa Alta Fidelidade Oficial)
              </label>
              <span className="text-[10px] text-slate-400">
                {config.elevenLabsApiKey ? 'Chave Ativa' : 'Emulador Local Ativo'}
              </span>
            </div>
            <input
              type="password"
              placeholder="sk_..."
              value={config.elevenLabsApiKey}
              onChange={(e) => handleToggleRule('elevenLabsApiKey', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#091524] border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-purple-400"
            />
            <p className="text-[10px] text-slate-500">
              Deixe em branco para usar o sintetizador local integrado para testes e demonstrações de portfólio.
            </p>
          </div>
        </div>

        {/* Rodapé */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#07111F] flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            Codec PTT Nativo: <strong className="text-purple-300">Opus / Ogg PTT</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 cursor-pointer font-bold"
          >
            Concluir & Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
