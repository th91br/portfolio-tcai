// src/services/voice/voiceStudioService.ts
// Motor Corporativo de Clonagem de Voz & Síntese Estratégica PTT (WhatsApp Voice Engine)

export interface VoiceProfile {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  elevenLabsVoiceId: string;
  description: string;
  isCloned: boolean;
  sampleAudioUrl?: string;
  sampleDurationSec?: number;
  settings: {
    stability: number; // 0.0 a 1.0 (maior = mais estável e formal)
    similarityBoost: number; // 0.0 a 1.0 (maior = mais próximo da voz real)
    style: number; // 0.0 a 1.0 (expressividade emocional)
    speed: number; // 0.8 a 1.2 (ritmo de fala)
  };
}

export interface VoiceStudioConfig {
  elevenLabsApiKey: string;
  activeVoiceId: string;
  modelId: string; // ex: 'eleven_multilingual_v2'
  sendAudioOnLeadAudio: boolean; // Espelhamento: responder por áudio se o lead mandar áudio
  sendAudioOnHotStages: boolean; // Disparar áudio em etapas quentes de fechamento
  hotStageIds: string[];
  maxAudioDurationSec: number;
  fallbackToText: boolean;
  preferredCodec: 'audio/ogg; codecs=opus' | 'audio/mp3';
}

export interface AudioGenerationResult {
  success: boolean;
  audioUrl: string;
  durationSec: number;
  waveformData: number[]; // Array de 20 a 40 números (0 a 100) para desenhar a onda verde PTT
  voiceUsed: VoiceProfile;
  error?: string;
  isSimulated?: boolean;
}

const STORAGE_KEY_VOICE_CONFIG = 'tcai_voice_studio_config_v1';
const STORAGE_KEY_VOICE_PROFILES = 'tcai_voice_profiles_v1';

// Perfis de Voz Oficiais do Sistema
export const DEFAULT_VOICE_PROFILES: VoiceProfile[] = [
  {
    id: 'voice-thiago-fundador',
    name: 'Thiago Cassol Antunes',
    role: 'Fundador & Head de Engenharia Comercial',
    elevenLabsVoiceId: 'pNInz6obpgDQGcFmaJgB', // Adam / Executivo de Alta Autoridade
    description: 'Voz masculina encorpada, tom consultivo de sócio-diretor, ritmo seguro com pausas naturais.',
    isCloned: true,
    sampleDurationSec: 18,
    settings: {
      stability: 0.65,
      similarityBoost: 0.85,
      style: 0.35,
      speed: 0.98,
    },
  },
  {
    id: 'voice-rafael-closer',
    name: 'Rafael Mendes',
    role: 'SDR Executivo & Qualificação Consultiva',
    elevenLabsVoiceId: 'ErXwobaYiN019PkySvjV', // Antoni / Jovem dinâmico
    description: 'Tom ágil, cordial e articulado. Ideal para triagem inicial de alto volume e quebra de objeções.',
    isCloned: false,
    sampleDurationSec: 14,
    settings: {
      stability: 0.55,
      similarityBoost: 0.8,
      style: 0.45,
      speed: 1.05,
    },
  },
  {
    id: 'voice-camila-closer',
    name: 'Camila Rocha',
    role: 'Closer B2B & Negociação de Contratos',
    elevenLabsVoiceId: 'EXAVITQu4vr4xnSDxMaL', // Bella / Executiva formal
    description: 'Voz feminina clara, tom corporativo e persuasivo. Alta taxa de conversão em agendamentos de reuniões.',
    isCloned: false,
    sampleDurationSec: 16,
    settings: {
      stability: 0.6,
      similarityBoost: 0.82,
      style: 0.4,
      speed: 1.0,
    },
  },
];

export const DEFAULT_VOICE_CONFIG: VoiceStudioConfig = {
  elevenLabsApiKey: '',
  activeVoiceId: 'voice-thiago-fundador',
  modelId: 'eleven_multilingual_v2',
  sendAudioOnLeadAudio: true,
  sendAudioOnHotStages: true,
  hotStageIds: ['proposal_sent', 'meeting_booked', 'closed', 'proposta', 'reunioes', 'negociacoes'],
  maxAudioDurationSec: 30,
  fallbackToText: true,
  preferredCodec: 'audio/ogg; codecs=opus',
};

export function getStoredVoiceProfiles(): VoiceProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VOICE_PROFILES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_VOICE_PROFILES, JSON.stringify(DEFAULT_VOICE_PROFILES));
      return DEFAULT_VOICE_PROFILES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_VOICE_PROFILES;
  } catch {
    return DEFAULT_VOICE_PROFILES;
  }
}

export function saveStoredVoiceProfiles(profiles: VoiceProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_VOICE_PROFILES, JSON.stringify(profiles));
  } catch (err) {
    console.error('[voiceStudio] Erro ao salvar perfis:', err);
  }
}

export function getStoredVoiceConfig(): VoiceStudioConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VOICE_CONFIG);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_VOICE_CONFIG, JSON.stringify(DEFAULT_VOICE_CONFIG));
      return DEFAULT_VOICE_CONFIG;
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_VOICE_CONFIG, ...parsed };
  } catch {
    return DEFAULT_VOICE_CONFIG;
  }
}

export function saveStoredVoiceConfig(config: VoiceStudioConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_VOICE_CONFIG, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('tcai_voice_config_changed', { detail: config }));
  } catch (err) {
    console.error('[voiceStudio] Erro ao salvar config:', err);
  }
}

export function getActiveVoiceProfile(): VoiceProfile {
  const config = getStoredVoiceConfig();
  const profiles = getStoredVoiceProfiles();
  const found = profiles.find((p) => p.id === config.activeVoiceId);
  return found || profiles[0] || DEFAULT_VOICE_PROFILES[0];
}

// Gera array de amplitudes realistas para renderização da onda sonora verde PTT
export function generateWaveformData(barsCount = 36, seed = 42): number[] {
  const bars: number[] = [];
  let prev = 40;
  for (let i = 0; i < barsCount; i++) {
    const rand = Math.sin(i * 0.45 + seed) * 35 + Math.cos(i * 0.9) * 20;
    const value = Math.max(15, Math.min(95, Math.round(prev * 0.35 + (50 + rand) * 0.65)));
    bars.push(value);
    prev = value;
  }
  return bars;
}

// Criação de um áudio sintético no navegador (Web Audio API) para testes imediatos sem gastar créditos
function createSyntheticPttAudio(durationSec = 5): Promise<string> {
  return new Promise((resolve) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        resolve('');
        return;
      }

      const sampleRate = 22050;
      const ctx = new AudioCtx({ sampleRate });
      const numSamples = Math.floor(sampleRate * durationSec);
      const buffer = ctx.createBuffer(1, numSamples, sampleRate);
      const channelData = buffer.getChannelData(0);

      // Simula voz humana suave (onda harmônica modulada com envelope de fala)
      for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        const speechEnvelope = Math.sin((t / durationSec) * Math.PI) * (0.5 + 0.5 * Math.sin(t * 8));
        const f0 = 135 + Math.sin(t * 4) * 25; // Frequência fundamental masculina ~135Hz
        const harmonic1 = Math.sin(2 * Math.PI * f0 * t);
        const harmonic2 = Math.sin(2 * Math.PI * f0 * 2 * t) * 0.5;
        const harmonic3 = Math.sin(2 * Math.PI * f0 * 3 * t) * 0.25;
        const breath = (Math.random() * 2 - 1) * 0.05;
        channelData[i] = (harmonic1 + harmonic2 + harmonic3 + breath) * speechEnvelope * 0.35;
      }

      // Converte buffer em WAV em memória
      const wavBytes = audioBufferToWav(buffer);
      const blob = new Blob([wavBytes], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      resolve(url);
    } catch {
      resolve('');
    }
  });
}

// Codificador simples de AudioBuffer para WAV (PCM 16-bit mono)
function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const out = new ArrayBuffer(length);
  const view = new DataView(out);
  const channels = [];
  let sample = 0;
  let offset = 0;
  let pos = 0;

  function setUint16(data: number) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data: number) {
    view.setUint32(pos, data, true);
    pos += 4;
  }

  // RIFF identifier
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"
  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16); // length = 16
  setUint16(1); // PCM (uncompressed)
  setUint16(numOfChan);
  setUint32(buffer.sampleRate);
  setUint32(buffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
  setUint16(numOfChan * 2); // block-align
  setUint16(16); // 16-bit
  setUint32(0x61746164); // "data" chunk
  setUint32(length - pos - 4);

  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (pos < length) {
    for (let i = 0; i < numOfChan; i++) {
      sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      view.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  return out;
}

// Síntese Principal: Conecta na ElevenLabs se houver chave, ou gera áudio sintético local
export async function synthesizeSpeechAudio(
  text: string,
  voiceProfileId?: string
): Promise<AudioGenerationResult> {
  const config = getStoredVoiceConfig();
  const profiles = getStoredVoiceProfiles();
  const profile = profiles.find((p) => p.id === (voiceProfileId || config.activeVoiceId)) || getActiveVoiceProfile();

  // Estima duração: média de 14 caracteres por segundo em fala normal
  const estimatedDuration = Math.max(3, Math.min(config.maxAudioDurationSec, Math.round(text.length / 14)));
  const waveform = generateWaveformData(32, text.length);

  // Se houver chave ElevenLabs configurada, tenta chamada oficial
  const apiKey = (config.elevenLabsApiKey || '').trim();
  if (apiKey && apiKey.startsWith('sk_')) {
    try {
      const voiceId = profile.elevenLabsVoiceId || 'pNInz6obpgDQGcFmaJgB';
      const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text: text.slice(0, 500),
          model_id: config.modelId || 'eleven_multilingual_v2',
          voice_settings: {
            stability: profile.settings.stability,
            similarity_boost: profile.settings.similarityBoost,
            style: profile.settings.style,
            use_speaker_boost: true,
          },
        }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const audioUrl = URL.createObjectURL(blob);
        return {
          success: true,
          audioUrl,
          durationSec: estimatedDuration,
          waveformData: waveform,
          voiceUsed: profile,
          isSimulated: false,
        };
      }
    } catch (err: any) {
      console.warn('[voiceStudio] ElevenLabs API indisponível, acionando fallback local:', err);
    }
  }

  // Fallback / Emulador Local Inteligente de Áudio PTT
  const localAudioUrl = await createSyntheticPttAudio(estimatedDuration);
  return {
    success: true,
    audioUrl: localAudioUrl,
    durationSec: estimatedDuration,
    waveformData: waveform,
    voiceUsed: profile,
    isSimulated: true,
  };
}

// Avaliador de Gatilho Estratégico: Determina se uma mensagem deve ser enviada por voz clonada
export function shouldSendAudioStrategically(options: {
  leadSentAudio?: boolean;
  leadStage?: string;
  leadScore?: number;
}): { shouldSend: boolean; reason: string } {
  const config = getStoredVoiceConfig();

  // Gatilho 1: Espelhamento (Lead mandou áudio)
  if (config.sendAudioOnLeadAudio && options.leadSentAudio) {
    return {
      shouldSend: true,
      reason: 'Espelhamento: Lead enviou áudio recente no WhatsApp.',
    };
  }

  // Gatilho 2: Etapa Quente do Funil
  if (config.sendAudioOnHotStages && options.leadStage) {
    const normalizedStage = options.leadStage.toLowerCase();
    const isHot = config.hotStageIds.some((hotId) => normalizedStage.includes(hotId.toLowerCase()));
    if (isHot) {
      return {
        shouldSend: true,
        reason: `Etapa Quente: Oportunidade em estágio avançado (${options.leadStage}).`,
      };
    }
  }

  return { shouldSend: false, reason: 'Critérios estratégicos não atendidos. Manter formato texto.' };
}
