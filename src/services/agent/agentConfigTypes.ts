export type GeminiModel =
  | 'gemini-2.0-flash'
  | 'gemini-1.5-flash'
  | 'gemini-1.5-pro'
  | 'gemini-2.5-flash';

export type WhatsAppProvider =
  | 'evolution'
  | 'zapi'
  | 'meta'
  | 'simulator';

export interface CompanyProfileConfig {
  companyName: string;
  tradingName: string;
  logoUrl: string;
  niche: string;
  description: string;
  services: string[];
  priceRange: string;
  contactEmail: string;
  contactPhone: string;
  businessHours: string;
  location: string;
}

export interface GeminiEngineConfig {
  apiKey: string;
  model: GeminiModel;
  temperature: number;
  maxOutputTokens: number;
  enableMultimodalVision: boolean;
  enableAudioTranscription: boolean;
  systemPrompt: string;
}

export interface WhatsAppIntegrationConfig {
  provider: WhatsAppProvider;
  baseUrl: string;
  apiKey: string;
  instanceId: string;
  phoneNumber: string;
  autoReplyEnabled: boolean;
  outboundDeliveryEnabled: boolean;
  sendAudioAsVoiceNote: boolean;
}

export interface AgentConfigStore {
  company: CompanyProfileConfig;
  gemini: GeminiEngineConfig;
  whatsapp: WhatsAppIntegrationConfig;
  updatedAt: string;
}

export interface PromptTemplatePreset {
  id: string;
  title: string;
  niche: string;
  description: string;
  systemPrompt: string;
}

export interface ChatMessageMedia {
  type: 'image' | 'audio' | 'document';
  url: string;
  mimeType?: string;
  filename?: string;
  durationSec?: number;
  sizeBytes?: number;
  caption?: string;
}
