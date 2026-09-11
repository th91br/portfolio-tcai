// src/components/dashboard/voice/SalesRepVoiceModal.tsx
// Modal de Biometria Vocal & Clonagem Individual por Vendedor (Multi-Seller Voice Studio)

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Mic,
  Square,
  Play,
  Pause,
  Upload,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Volume2,
  FileAudio,
  Sparkles,
  Info,
  Clock,
  RotateCcw,
} from 'lucide-react';
import {
  SalesRep,
  updateSalesRepVoice,
  revokeSalesRepVoice,
} from '../../../services/crm/salesTeamService';

interface SalesRepVoiceModalProps {
  rep: SalesRep | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (updatedTeam: SalesRep[]) => void;
}

export const SalesRepVoiceModal: React.FC<SalesRepVoiceModalProps> = ({
  rep,
  isOpen,
  onClose,
  onSaved,
}) => {
  if (!isOpen || !rep) return null;

  // Recording & Audio states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(rep.voiceSampleUrl || null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);

  // Form & Consent states
  const [consentAccepted, setConsentAccepted] = useState(rep.voiceConsentAccepted || false);
  const [voiceCustomName, setVoiceCustomName] = useState(rep.voiceName || rep.name);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // References
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Clean up on unmount or close
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // Format seconds mm:ss
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start browser audio recording
  const handleStartRecording = async () => {
    try {
      setErrorMessage(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        // Stop all tracks in stream
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(100);
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Erro ao acessar microfone:', err);
      setErrorMessage(
        'Não foi possível acessar seu microfone. Verifique as permissões do navegador ou faça o upload de um arquivo de áudio gravado.'
      );
    }
  };

  // Stop recording
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsRecording(false);
  };

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      setErrorMessage('Por favor, selecione um arquivo de áudio válido (.mp3, .wav, .m4a, .ogg).');
      return;
    }

    setErrorMessage(null);
    setAudioBlob(file);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
  };

  // Play / pause audio sample
  const togglePlayAudio = () => {
    if (!audioUrl) return;

    if (!audioPlayerRef.current) {
      const audio = new Audio(audioUrl);
      audioPlayerRef.current = audio;

      audio.ontimeupdate = () => {
        if (audio.duration) {
          setPlaybackProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      audio.onended = () => {
        setIsPlayingPreview(false);
        setPlaybackProgress(0);
      };
    }

    if (isPlayingPreview) {
      audioPlayerRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlayingPreview(true);
    }
  };

  // Reset audio
  const handleResetAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    setIsPlayingPreview(false);
    setPlaybackProgress(0);
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingSeconds(0);
  };

  // Save cloned voice
  const handleSaveVoice = async () => {
    if (!consentAccepted) {
      setErrorMessage('É obrigatório dar o aceite no termo de consentimento biométrico LGPD.');
      return;
    }

    if (!audioUrl && !rep.voiceSampleUrl) {
      setErrorMessage('É necessário gravar ou fazer o upload de uma amostra de voz de no mínimo 30 segundos.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Simula processamento neural de alta fidelidade
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const generatedVoiceId = rep.voiceId || `voice-${rep.id}-${Date.now().toString(36)}`;
      const updatedTeam = updateSalesRepVoice(rep.id, {
        voiceId: generatedVoiceId,
        voiceName: voiceCustomName || rep.name,
        voiceSampleUrl: audioUrl || rep.voiceSampleUrl || '',
        voiceConsentAccepted: true,
      });

      setSuccessMessage('Voz neural calibrada e ativada com sucesso!');
      setTimeout(() => {
        onSaved(updatedTeam);
        onClose();
      }, 900);
    } catch (err: any) {
      setErrorMessage('Erro ao processar biometria vocal. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Revoke voice (LGPD Offboarding)
  const handleConfirmRevoke = () => {
    setIsProcessing(true);
    try {
      const updatedTeam = revokeSalesRepVoice(rep.id);
      setSuccessMessage('Biometria vocal revogada e excluída conforme LGPD.');
      setTimeout(() => {
        onSaved(updatedTeam);
        onClose();
      }, 800);
    } catch {
      setErrorMessage('Erro ao revogar voz.');
    } finally {
      setIsProcessing(false);
      setShowRevokeConfirm(false);
    }
  };

  const isVoiceActive = rep.voiceStatus === 'active';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-3xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/40">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 via-zinc-900 to-indigo-500/20 border border-emerald-500/30 flex items-center justify-center text-2xl shadow-inner">
              {rep.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">{rep.name}</h2>
                {isVoiceActive ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Voz Clonada Ativa
                  </span>
                ) : rep.voiceStatus === 'revoked' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    Biometria Revogada
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">
                    Voz Padrão da Empresa
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {rep.roleTitle} • Biometria Vocal Dedicada para Áudios PTT no WhatsApp
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-zinc-300 custom-scrollbar">
          {/* Status Alert / Feedback */}
          {errorMessage && (
            <div className="p-3.5 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300 text-xs flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Intro Context Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/20 via-zinc-900 to-indigo-950/20 border border-zinc-800/90 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-semibold text-white">
                Princípio de Continuidade: 1 Lead = 1 Vendedor = 1 Voz
              </p>
              <p className="text-zinc-400 leading-relaxed">
                Quando o agente de IA enviar áudios automáticos ou sugestões de copilot para os leads atribuídos a{' '}
                <strong className="text-zinc-200">{rep.name}</strong>, o WhatsApp sintetizará a voz exata deste vendedor, garantindo autenticidade e humanização total.
              </p>
            </div>
          </div>

          {/* Section 1: Roteiro Guiado de 90s */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="font-semibold text-white text-xs uppercase tracking-wider">
                  Roteiro Guiado de Treinamento (Leia em Voz Alta)
                </h3>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400" /> Amostra Ideal: 60 a 90 segundos
              </span>
            </div>

            <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2.5 text-xs text-zinc-300 leading-relaxed select-text font-serif italic">
              <p className="text-emerald-300/90 font-sans not-italic font-semibold text-[11px]">
                💡 Dica: Mantenha um tom comercial consultivo, seguro e amigável. Não corra, faça pausas naturais.
              </p>
              <p>
                "Olá, tudo bem? Aqui é o <strong className="not-italic text-white underline decoration-emerald-500/50">{rep.name.split(' ')[0]}</strong> da equipe comercial. Estou enviando este áudio diretamente para entender melhor as metas que vocês definiram para este mês e verificar o andamento do projeto."
              </p>
              <p>
                "Nós estruturamos a esteira de inteligência artificial com foco total em reduzir o tempo de resposta e acelerar o fechamento de oportunidades de alto valor. Nosso objetivo não é substituir o atendimento humano, mas sim capacitar você e sua equipe com copilotos precisos que qualificam leads 24 horas por dia."
              </p>
              <p>
                "Fiz questão de reservar um momento exclusivo na minha agenda para te apresentar os números e tirar qualquer dúvida estratégica. Me avisa qual horário fica mais confortável para conversarmos hoje ou amanhã!"
              </p>
            </div>
          </div>

          {/* Section 2: Gravação ou Upload */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h3 className="font-semibold text-white text-xs uppercase tracking-wider">
                Captura da Amostra Biometrizada
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option A: Gravador no Navegador */}
              <div
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  isRecording
                    ? 'border-red-500/80 bg-red-950/20 shadow-lg shadow-red-900/20'
                    : audioBlob && !isRecording
                    ? 'border-emerald-500/40 bg-zinc-900/40'
                    : 'border-zinc-800 bg-zinc-900/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Mic className={`w-4 h-4 ${isRecording ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`} />
                      Gravação Direta no Microfone
                    </span>
                    {isRecording && (
                      <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 text-xs font-mono font-bold animate-pulse">
                        ● REC {formatTime(recordingSeconds)}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Clique abaixo e leia o roteiro acima com seu fone de ouvido ou microfone de boa qualidade em ambiente silencioso.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center gap-3">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={handleStartRecording}
                      disabled={isProcessing}
                      className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-red-900/30"
                    >
                      <Mic className="w-4 h-4" />
                      Iniciar Gravação
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStopRecording}
                      className="flex-1 py-2.5 px-4 bg-zinc-100 hover:bg-white text-zinc-950 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all animate-bounce"
                    >
                      <Square className="w-4 h-4 fill-zinc-950" />
                      Parar e Salvar Áudio ({formatTime(recordingSeconds)})
                    </button>
                  )}
                </div>
              </div>

              {/* Option B: Upload de Arquivo */}
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-indigo-400" />
                      Upload de Áudio Pré-gravado
                    </span>
                    <span className="text-[10px] text-zinc-500">.mp3, .wav, .m4a</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Se você já possui um áudio enviado no WhatsApp ou gravado profissionalmente em estúdio, anexe o arquivo aqui.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/80">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="audio/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isRecording || isProcessing}
                    className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-200 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all border border-zinc-700"
                  >
                    <FileAudio className="w-4 h-4 text-indigo-400" />
                    Selecionar Arquivo do Computador
                  </button>
                </div>
              </div>
            </div>

            {/* Audio Preview Bar (If recorded or uploaded) */}
            {audioUrl && (
              <div className="p-3.5 bg-zinc-900 border border-emerald-500/30 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={togglePlayAudio}
                    className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 flex items-center justify-center flex-shrink-0 transition-transform active:scale-95 shadow-md shadow-emerald-950"
                  >
                    {isPlayingPreview ? (
                      <Pause className="w-4 h-4 fill-zinc-950" />
                    ) : (
                      <Play className="w-4 h-4 fill-zinc-950 ml-0.5" />
                    )}
                  </button>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      Amostra de Voz Carregada
                    </p>
                    <div className="w-48 bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                      <div
                        className="bg-emerald-400 h-full transition-all duration-200"
                        style={{ width: `${playbackProgress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetAudio}
                    className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition-colors text-xs flex items-center gap-1"
                    title="Gravar novamente"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Regravar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: LGPD & Termo Biométrico */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h3 className="font-semibold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Segurança Jurídica & Termo de Consentimento Biométrico (LGPD)
              </h3>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/90 space-y-3">
              <div className="text-[11px] text-zinc-400 space-y-2 leading-relaxed">
                <p>
                  A clonagem de voz envolve o processamento de dados biométricos sensíveis protegidos pela Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018).
                </p>
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 text-zinc-300 space-y-1">
                  <p className="font-medium text-white">Garantias de Privacidade & Offboarding:</p>
                  <ul className="list-disc pl-4 space-y-0.5 text-zinc-400">
                    <li>A voz clonada será utilizada exclusivamente em nome da empresa nas interações comerciais com leads designados ao vendedor.</li>
                    <li>Em caso de desligamento, rescisão contratual ou solicitação voluntária, a biometria vocal pode ser revogada com um único clique, cessando imediatamente a síntese e restabelecendo a voz padrão corporativa.</li>
                  </ul>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer pt-1 group select-none">
                <input
                  type="checkbox"
                  checked={consentAccepted}
                  onChange={(e) => setConsentAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-zinc-900 cursor-pointer"
                />
                <span className="text-xs text-zinc-300 group-hover:text-white transition-colors">
                  Eu, na qualidade de titular dos dados e vendedor da empresa, autorizo expressamente a captura, modelagem e síntese da minha biometria vocal para finalidade de atendimento e apoio comercial via IA.
                </span>
              </label>
            </div>
          </div>

          {/* Revoke confirmation banner */}
          {showRevokeConfirm && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-700/60 space-y-3">
              <div className="flex items-center gap-2 text-red-400 text-xs font-bold">
                <AlertTriangle className="w-4 h-4" />
                Atenção: Confirmação de Exclusão da Biometria Vocal
              </div>
              <p className="text-xs text-zinc-300">
                Tem certeza que deseja revogar e excluir a biometria vocal de{' '}
                <strong className="text-white">{rep.name}</strong>? Os leads atribuídos a este vendedor voltarão a receber áudios com a voz institucional padrão da empresa.
              </p>
              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleConfirmRevoke}
                  disabled={isProcessing}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold transition-all"
                >
                  Sim, Revogar e Excluir Biometria
                </button>
                <button
                  type="button"
                  onClick={() => setShowRevokeConfirm(false)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-medium transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800/80 bg-zinc-900/50">
          <div>
            {isVoiceActive && !showRevokeConfirm && (
              <button
                type="button"
                onClick={() => setShowRevokeConfirm(true)}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-red-950/30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Revogar Biometria (Offboarding)
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 rounded-xl transition-colors"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={handleSaveVoice}
              disabled={isProcessing || !consentAccepted || (!audioUrl && !rep.voiceSampleUrl)}
              className="px-5 py-2 text-xs font-bold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 disabled:hover:bg-emerald-400 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-emerald-950"
            >
              {isProcessing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  Calibrando Modelo...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  {isVoiceActive ? 'Atualizar Voz Clonada' : 'Salvar & Ativar Voz'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
