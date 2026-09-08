import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Mic,
  Square,
  Sparkles,
  Zap,
  Radio,
  Calendar,
  Clock,
  ExternalLink,
  Flame,
  CheckCheck,
  Maximize2,
  Minimize2,
  RefreshCw,
  Settings,
  X,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  UserCheck,
  Bot,
  Building,
  Phone,
  Layers,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Check,
  Filter,
  FileText,
} from 'lucide-react';
import {
  ChatContact,
  ChatMessage,
  WhatsAppKPIs,
  DiagnosticItem,
  MeetingItem,
  fetchAgentKPIs,
  fetchContacts,
  saveContactsLocally,
  sendChatMessage,
  generateAiReply,
  fetchDiagnostics,
  saveDiagnostics,
  fetchMeetings,
  saveMeetings,
  updateContactDetails,
  saveAllContacts,
} from '../../../services/agent/agentChatService';
import { loadAgentConfig } from '../../../services/agent/agentConfigStorage';
import { AgentConfigStore } from '../../../services/agent/agentConfigTypes';
import { AgentSettingsModal } from '../settings/AgentSettingsModal';
import { DiagnosticEditModal } from './whatsapp/DiagnosticEditModal';
import { MeetingEditModal } from './whatsapp/MeetingEditModal';
import { ContactEditModal } from './whatsapp/ContactEditModal';
import { syncWhatsAppContactsToCrm } from '../../../services/crm/unifiedCrmService';
import { ProposalModal } from '../proposals/ProposalModal';
import { ProposalPrintView } from '../proposals/ProposalPrintView';
import { CommercialProposal } from '../../../services/crm/proposalsService';
import { LeadTimelineFeed } from '../crm/LeadTimelineFeed';
import { Lead } from '../../../lib/supabase';

type SubView = 'chat' | 'diagnostics' | 'kanban' | 'calendar';

interface WhatsAppAgentViewProps {
  leads?: Lead[];
}

const KANBAN_STAGES: Array<{
  key: ChatContact['status'];
  label: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}> = [
  { key: 'triage', label: 'Triagem Inicial', color: 'border-slate-500', badgeBg: 'bg-slate-500/15', badgeBorder: 'border-slate-500/30', badgeText: 'text-slate-300' },
  { key: 'ai_qualified', label: 'Qualificado por IA', color: 'border-[#00D2F6]', badgeBg: 'bg-[#00D2F6]/15', badgeBorder: 'border-[#00D2F6]/30', badgeText: 'text-[#00D2F6]' },
  { key: 'proposal_sent', label: 'Proposta Enviada', color: 'border-amber-400', badgeBg: 'bg-amber-400/15', badgeBorder: 'border-amber-400/30', badgeText: 'text-amber-300' },
  { key: 'meeting_booked', label: 'Reunião Agendada', color: 'border-purple-400', badgeBg: 'bg-purple-400/15', badgeBorder: 'border-purple-400/30', badgeText: 'text-purple-300' },
  { key: 'closed', label: 'Fechado / Ganho', color: 'border-emerald-400', badgeBg: 'bg-emerald-400/15', badgeBorder: 'border-emerald-400/30', badgeText: 'text-emerald-300' },
];

export const WhatsAppAgentView: React.FC<WhatsAppAgentViewProps> = ({ leads = [] }) => {
  // Configurações e Telemetria
  const [config, setConfig] = useState<AgentConfigStore | null>(null);
  const [kpis, setKpis] = useState<WhatsAppKPIs>({
    totalLeads: 26,
    hotLeads: 9,
    meetingsBooked: 5,
    conversionRate: '29.2%',
    activeChats: 6,
    avgResponseTimeSec: 8,
  });
  const [latencyMs, setLatencyMs] = useState<number>(6);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeSubView, setActiveSubView] = useState<SubView>('chat');

  // Feedback Toast Rápido
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Contatos e Mensagens
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'hot' | 'meeting'>('all');

  // Estado do Chat
  const [inputText, setInputText] = useState('');
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [aiPaused, setAiPaused] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);

  // Mídias e Gravação de Áudio
  const [stagedMedia, setStagedMedia] = useState<{
    type: 'image' | 'audio';
    base64?: string;
    previewUrl: string;
    filename: string;
    sizeBytes?: number;
    mimeType?: string;
  } | null>(null);

  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  // Diagnósticos State & Modais
  const [diagnostics, setDiagnostics] = useState<DiagnosticItem[]>([]);
  const [diagSearch, setDiagSearch] = useState('');
  const [diagStatusFilter, setDiagStatusFilter] = useState<'ALL' | 'HOT' | 'QUALIFICADO' | 'TRIAGEM'>('ALL');
  const [isDiagModalOpen, setIsDiagModalOpen] = useState(false);
  const [editingDiagnostic, setEditingDiagnostic] = useState<DiagnosticItem | null>(null);

  // Agenda State & Modais
  const [meetings, setMeetings] = useState<MeetingItem[]>([]);
  const [meetingSearch, setMeetingSearch] = useState('');
  const [meetingStatusFilter, setMeetingStatusFilter] = useState<'ALL' | 'AGENDADO' | 'REALIZADO' | 'CANCELADO'>('ALL');
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<MeetingItem | null>(null);

  // Contato / Oportunidade Modal
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ChatContact | null>(null);

  // Proposta & Timeline Modais
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [selectedProposalToPrint, setSelectedProposalToPrint] = useState<CommercialProposal | null>(null);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);

  // Referências
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  // Carregamento Inicial
  const loadInitialData = async () => {
    setIsRefreshing(true);
    const start = performance.now();

    try {
      const [loadedConfig, loadedKpis, loadedContacts, loadedDiagnostics, loadedMeetings] = await Promise.all([
        loadAgentConfig(),
        fetchAgentKPIs(),
        fetchContacts(),
        fetchDiagnostics(),
        fetchMeetings(),
      ]);

      setConfig(loadedConfig);
      setKpis(loadedKpis);
      setContacts(loadedContacts);
      setDiagnostics(loadedDiagnostics);
      setMeetings(loadedMeetings);

      // Sincroniza contatos do WhatsApp com o CRM global 360°
      syncWhatsAppContactsToCrm(loadedContacts);

      if (loadedContacts.length > 0 && !selectedContactId) {
        setSelectedContactId(loadedContacts[0].id);
      }
      setLatencyMs(Math.max(4, Math.round(performance.now() - start)));
    } catch {
      // Falha silenciosa com dados locais
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Rolar para a última mensagem ao trocar de contato ou receber mensagens
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedContactId, contacts, isAiResponding]);

  // Contato Ativo
  const activeContact = contacts.find((c) => c.id === selectedContactId) || contacts[0];

  // Contatos Filtrados
  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.company.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.phone.includes(searchFilter);

    if (!matchesSearch) return false;

    if (categoryFilter === 'hot') {
      return c.score >= 85;
    }
    if (categoryFilter === 'meeting') {
      return c.status === 'meeting_booked';
    }
    return true;
  });

  // Gravação de Áudio com Web Audio API
  const handleToggleAudioRecording = async () => {
    if (isRecordingAudio) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      clearInterval(recordingTimerRef.current);
      setIsRecordingAudio(false);
    } else {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          audioChunksRef.current = [];
          const recorder = new MediaRecorder(stream);
          mediaRecorderRef.current = recorder;

          recorder.ondataavailable = (e) => {
            if (e.data.size > 0) audioChunksRef.current.push(e.data);
          };

          recorder.onstop = () => {
            const blob = new Blob(audioChunksRef.current, { type: 'audio/ogg; codecs=opus' });
            const reader = new FileReader();
            reader.onloadend = () => {
              const fullDataUrl = reader.result as string;
              const pureBase64 = fullDataUrl.split(',')[1];
              setStagedMedia({
                type: 'audio',
                base64: pureBase64,
                previewUrl: fullDataUrl,
                filename: 'audio-' + Date.now() + '.ogg',
                sizeBytes: blob.size,
                mimeType: 'audio/ogg',
              });
            };
            reader.readAsDataURL(blob);
            stream.getTracks().forEach((t) => t.stop());
          };

          recorder.start();
          setIsRecordingAudio(true);
          setRecordingSeconds(0);
          recordingTimerRef.current = setInterval(() => {
            setRecordingSeconds((sec) => sec + 1);
          }, 1000);
        } catch {
          audioInputRef.current?.click();
        }
      } else {
        audioInputRef.current?.click();
      }
    }
  };

  // Upload de Imagem
  const handleImageSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const fullDataUrl = evt.target?.result as string;
      const pureBase64 = fullDataUrl.split(',')[1];
      setStagedMedia({
        type: 'image',
        base64: pureBase64,
        previewUrl: fullDataUrl,
        filename: file.name,
        sizeBytes: file.size,
        mimeType: file.type || 'image/png',
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Upload de Arquivo de Áudio alternativo
  const handleAudioFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const fullDataUrl = evt.target?.result as string;
      const pureBase64 = fullDataUrl.split(',')[1];
      setStagedMedia({
        type: 'audio',
        base64: pureBase64,
        previewUrl: fullDataUrl,
        filename: file.name,
        sizeBytes: file.size,
        mimeType: file.type || 'audio/mp3',
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Enviar Mensagem no Chat
  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText !== undefined ? customText.trim() : inputText.trim();
    const mediaToSend = customText !== undefined ? null : stagedMedia;

    if (!textToSend && !mediaToSend) return;
    if (!activeContact) return;

    const now = new Date();
    const timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

    const clientMessage: ChatMessage = {
      sender: 'agent',
      text: textToSend,
      time: timeStr,
      media: mediaToSend
        ? {
            type: mediaToSend.type,
            url: mediaToSend.previewUrl,
            filename: mediaToSend.filename,
            caption: textToSend,
          }
        : undefined,
    };

    const updatedContacts = contacts.map((c) => {
      if (c.id === activeContact.id) {
        return {
          ...c,
          messages: [...c.messages, clientMessage],
          lastMessage: textToSend || (mediaToSend?.type === 'audio' ? '🎙️ Mensagem de voz' : '📷 Foto enviada'),
          lastMessageTime: timeStr,
        };
      }
      return c;
    });

    setContacts(updatedContacts);
    saveContactsLocally(updatedContacts);
    if (!customText) {
      setInputText('');
      setStagedMedia(null);
    }

    sendChatMessage({
      contactId: activeContact.id,
      text: textToSend,
      sender: 'agent',
      media: mediaToSend || undefined,
    });

    if (!aiPaused) {
      setIsAiResponding(true);
      setTimeout(async () => {
        const aiReply = await generateAiReply(activeContact, textToSend);
        const replyTime = String(new Date().getHours()).padStart(2, '0') + ':' + String(new Date().getMinutes()).padStart(2, '0');

        const leadReplyMsg: ChatMessage = {
          sender: 'lead',
          text: aiReply,
          time: replyTime,
        };

        setContacts((prev) => {
          const nextContacts = prev.map((c) => {
            if (c.id === activeContact.id) {
              return {
                ...c,
                messages: [...c.messages, leadReplyMsg],
                lastMessage: aiReply,
                lastMessageTime: replyTime,
              };
            }
            return c;
          });
          saveContactsLocally(nextContacts);
          return nextContacts;
        });

        setIsAiResponding(false);

        sendChatMessage({
          contactId: activeContact.id,
          text: aiReply,
          sender: 'lead',
        });
      }, 1400);
    }
  };

  const handleApplySuggestion = (suggestion: string) => {
    setInputText(suggestion);
  };

  // ========================================================
  // Handlers para Diagnósticos
  // ========================================================
  const handleSaveDiagnostic = (item: DiagnosticItem) => {
    let nextList: DiagnosticItem[] = [];
    const exists = diagnostics.some((d) => d.id === item.id);
    if (exists) {
      nextList = diagnostics.map((d) => (d.id === item.id ? item : d));
      showToast('Diagnóstico atualizado com sucesso!');
    } else {
      nextList = [item, ...diagnostics];
      showToast('Novo diagnóstico registrado com sucesso!');
    }
    setDiagnostics(nextList);
    saveDiagnostics(nextList);
  };

  const handleDeleteDiagnostic = (id: string) => {
    const nextList = diagnostics.filter((d) => d.id !== id);
    setDiagnostics(nextList);
    saveDiagnostics(nextList);
    showToast('Diagnóstico removido.');
  };

  const handleSendDiagnosticToChat = (diag: DiagnosticItem) => {
    const matchingContact =
      contacts.find((c) => diag.client.toLowerCase().includes(c.name.toLowerCase())) || activeContact;

    if (!matchingContact) {
      showToast('Nenhum contato selecionado.');
      return;
    }

    const notePart = diag.notes ? '\n📝 *Observações:* ' + diag.notes : '';
    const formattedMessage = '📋 *DIAGNÓSTICO TÉCNICO & PROPOSTA - TCAI*\n📌 *Projeto:* ' + diag.title + '\n👤 *Cliente:* ' + diag.client + '\n⚡ *SLA Garantido:* ' + diag.sla + '\n💰 *Investimento Estimado:* ' + diag.budget + '\n🛠️ *Stack Tecnológica:* ' + diag.stack.join(', ') + '\n🎯 *Score de Viabilidade:* ' + diag.score + notePart + '\n\nConfirmamos a prontidão da nossa engenharia para implantação imediata.';

    const now = new Date();
    const timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

    const msg: ChatMessage = {
      sender: 'agent',
      text: formattedMessage,
      time: timeStr,
    };

    const nextContacts = contacts.map((c) => {
      if (c.id === matchingContact.id) {
        return {
          ...c,
          messages: [...c.messages, msg],
          lastMessage: 'Diagnóstico enviado: ' + diag.title,
          lastMessageTime: timeStr,
        };
      }
      return c;
    });

    setContacts(nextContacts);
    saveContactsLocally(nextContacts);
    sendChatMessage({
      contactId: matchingContact.id,
      text: formattedMessage,
      sender: 'agent',
    });

    setSelectedContactId(matchingContact.id);
    setActiveSubView('chat');
    showToast('Diagnóstico enviado no chat de ' + matchingContact.name + '!');
  };

  // ========================================================
  // Handlers para Kanban
  // ========================================================
  const handleMoveContactStage = (contactId: string, newStage: ChatContact['status']) => {
    const stageMeta = KANBAN_STAGES.find((s) => s.key === newStage);
    const updated = contacts.map((c) => {
      if (c.id === contactId) {
        return {
          ...c,
          status: newStage,
          statusLabel: stageMeta?.label || c.statusLabel,
        };
      }
      return c;
    });

    setContacts(updated);
    saveContactsLocally(updated);
    updateContactDetails({
      id: contactId,
      status: newStage,
      statusLabel: stageMeta?.label,
    });
    showToast('Lead movido para ' + (stageMeta?.label || newStage) + '!');
  };

  const handleSaveContact = (contactData: Partial<ChatContact> & { id: string }) => {
    const exists = contacts.some((c) => c.id === contactData.id);
    let nextList: ChatContact[] = [];

    if (exists) {
      nextList = contacts.map((c) => (c.id === contactData.id ? { ...c, ...contactData } : c));
      showToast('Dossiê do lead atualizado!');
    } else {
      const newContact: ChatContact = {
        id: contactData.id,
        name: contactData.name || 'Novo Lead',
        company: contactData.company || 'Empresa',
        phone: contactData.phone || '+55 54 99123-4567',
        status: contactData.status || 'triage',
        statusLabel: contactData.statusLabel || 'Triagem Inicial',
        avatar: contactData.avatar || '💼',
        unread: 0,
        score: contactData.score ?? 80,
        slaTimeline: contactData.slaTimeline || '7 DIAS ÚTEIS',
        projectType: contactData.projectType || 'Automação com IA',
        lastMessage: 'Lead cadastrado no pipeline.',
        lastMessageTime: 'Agora',
        messages: [],
      };
      nextList = [newContact, ...contacts];
      setSelectedContactId(newContact.id);
      showToast('Nova oportunidade criada no Kanban!');
    }

    setContacts(nextList);
    saveContactsLocally(nextList);
    syncWhatsAppContactsToCrm(nextList);
    updateContactDetails(contactData);
  };

  // ========================================================
  // Handlers para Agenda & Reuniões
  // ========================================================
  const handleSaveMeeting = (item: MeetingItem) => {
    const exists = meetings.some((m) => m.id === item.id);
    let nextList: MeetingItem[] = [];

    if (exists) {
      nextList = meetings.map((m) => (m.id === item.id ? item : m));
      showToast('Reunião atualizada na agenda!');
    } else {
      nextList = [item, ...meetings];
      showToast('Nova reunião agendada no Google Meet!');
    }

    setMeetings(nextList);
    saveMeetings(nextList);
  };

  const handleDeleteMeeting = (id: string) => {
    const nextList = meetings.filter((m) => m.id !== id);
    setMeetings(nextList);
    saveMeetings(nextList);
    showToast('Reunião removida da agenda.');
  };

  const handleToggleMeetingStatus = (meeting: MeetingItem) => {
    const newStatus: 'AGENDADO' | 'REALIZADO' = meeting.status === 'REALIZADO' ? 'AGENDADO' : 'REALIZADO';
    const nextList: MeetingItem[] = meetings.map((m) => (m.id === meeting.id ? { ...m, status: newStatus } : m));
    setMeetings(nextList);
    saveMeetings(nextList);
    showToast('Status atualizado para ' + newStatus + '!');
  };

  const handleSendMeetingReminder = (m: MeetingItem) => {
    const matchingContact =
      contacts.find((c) => m.client.toLowerCase().includes(c.name.toLowerCase()) || (m.phone && c.phone.includes(m.phone))) ||
      activeContact;

    if (!matchingContact) {
      showToast('Nenhum contato vinculado à reunião.');
      return;
    }

    const cleanLink = m.link.replace(/^https?:\/\//, '');
    const notePart = m.notes ? '\n📝 *Notas:* ' + m.notes : '';
    const reminderText = '🗓️ *LEMBRETE DE REUNIÃO DE ALINHAMENTO - TCAI*\n\nOlá! Confirmando nosso encontro no Google Meet:\n📅 *Horário:* ' + m.time + '\n🎯 *Pauta:* ' + m.topic + '\n🔗 *Link de Acesso:* https://' + cleanLink + notePart + '\n\nQualquer dúvida estou à disposição aqui pelo WhatsApp!';

    const now = new Date();
    const timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

    const msg: ChatMessage = {
      sender: 'agent',
      text: reminderText,
      time: timeStr,
    };

    const nextContacts = contacts.map((c) => {
      if (c.id === matchingContact.id) {
        return {
          ...c,
          messages: [...c.messages, msg],
          lastMessage: 'Lembrete de reunião: ' + m.time,
          lastMessageTime: timeStr,
        };
      }
      return c;
    });

    setContacts(nextContacts);
    saveContactsLocally(nextContacts);
    sendChatMessage({
      contactId: matchingContact.id,
      text: reminderText,
      sender: 'agent',
    });

    setSelectedContactId(matchingContact.id);
    setActiveSubView('chat');
    showToast('Lembrete enviado no WhatsApp de ' + matchingContact.name + '!');
  };

  const handleCopyMeetLink = (link: string) => {
    const cleanLink = link.replace(/^https?:\/\//, '');
    navigator.clipboard.writeText('https://' + cleanLink);
    showToast('Link do Meet copiado para a área de transferência!');
  };

  // Listas Filtradas de Diagnósticos e Agenda
  const filteredDiagnostics = diagnostics.filter((d) => {
    const matches =
      d.title.toLowerCase().includes(diagSearch.toLowerCase()) ||
      d.client.toLowerCase().includes(diagSearch.toLowerCase()) ||
      d.stack.some((s) => s.toLowerCase().includes(diagSearch.toLowerCase()));
    if (!matches) return false;
    if (diagStatusFilter !== 'ALL' && d.status !== diagStatusFilter) return false;
    return true;
  });

  const filteredMeetings = meetings.filter((m) => {
    const matches =
      m.client.toLowerCase().includes(meetingSearch.toLowerCase()) ||
      m.topic.toLowerCase().includes(meetingSearch.toLowerCase());
    if (!matches) return false;
    if (meetingStatusFilter !== 'ALL' && (m.status || 'AGENDADO') !== meetingStatusFilter) return false;
    return true;
  });

  return (
    <div
      className={'w-full flex flex-col space-y-3 transition-all ' + (isFullscreen ? 'fixed inset-0 z-50 p-2 sm:p-4 bg-[#060D17] overflow-hidden' : '')}
    >
      {/* Toast Notification Flutuante */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[100] px-4 py-2.5 rounded-xl bg-[#00D2F6] text-slate-950 font-mono font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP BANNER DE TELEMETRIA NATIVO */}
      <div className="bg-[#0A1624] border border-[#16273C] rounded-2xl p-3 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xl relative overflow-hidden flex-shrink-0">
        <div className="absolute top-0 left-0 w-64 h-full bg-[#00D2F6]/5 blur-3xl pointer-events-none" />

        {/* Lado Esquerdo: Identidade & Status Operacional */}
        <div className="flex items-center gap-3 z-10 w-full md:w-auto">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#00D2F6] to-[#015EEF] flex items-center justify-center text-slate-950 font-black shadow-[0_0_20px_rgba(0,210,246,0.3)] flex-shrink-0">
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base md:text-lg font-extrabold text-white tracking-wide uppercase truncate">
                Central WhatsApp & Agente IA
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-bold whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE • {latencyMs}ms
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 font-sans truncate">
              {(config?.company?.companyName || 'TCAI') + ' • Motor ' + (config?.gemini?.model || 'gemini-2.0-flash') + ' • Visão & Áudio Ativos'}
            </p>
          </div>
        </div>

        {/* Lado Direito: KPIs em Tempo Real & Ações */}
        <div className="flex items-center gap-2 sm:gap-3 z-10 w-full md:w-auto justify-between md:justify-end">
          <div className="hidden lg:flex items-center gap-3 bg-[#07111F] px-3 py-1.5 rounded-xl border border-white/[0.06] text-xs font-mono shadow-inner">
            <div className="text-center">
              <span className="text-[9px] text-slate-400 block uppercase">Leads</span>
              <span className="font-bold text-[#00D2F6]">{contacts.length || kpis.totalLeads}</span>
            </div>
            <div className="w-[1px] h-5 bg-white/[0.08]" />
            <div className="text-center">
              <span className="text-[9px] text-slate-400 block uppercase flex items-center gap-0.5 justify-center">
                <Flame className="w-2.5 h-2.5 text-amber-400 inline" /> HOT
              </span>
              <span className="font-bold text-amber-400">
                {diagnostics.filter((d) => d.status === 'HOT').length || kpis.hotLeads}
              </span>
            </div>
            <div className="w-[1px] h-5 bg-white/[0.08]" />
            <div className="text-center">
              <span className="text-[9px] text-slate-400 block uppercase flex items-center gap-0.5 justify-center">
                <Calendar className="w-2.5 h-2.5 text-purple-400 inline" /> Meets
              </span>
              <span className="font-bold text-purple-400">
                {meetings.filter((m) => m.status !== 'CANCELADO').length || kpis.meetingsBooked}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto md:ml-0">
            {/* Recarregar */}
            <button
              type="button"
              onClick={loadInitialData}
              disabled={isRefreshing}
              className="p-2 sm:p-2.5 rounded-xl border border-white/[0.08] bg-[#07111F] hover:bg-white/[0.05] text-slate-300 hover:text-white transition-all cursor-pointer shadow"
              title="Sincronizar Dados"
            >
              <RefreshCw className={'w-3.5 h-3.5 sm:w-4 sm:h-4 ' + (isRefreshing ? 'animate-spin text-[#00D2F6]' : '')} />
            </button>

            {/* Tela Cheia */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 sm:p-2.5 rounded-xl border border-white/[0.08] bg-[#07111F] hover:bg-white/[0.05] text-slate-300 hover:text-white transition-all cursor-pointer shadow"
              title={isFullscreen ? 'Sair do Modo Expandido' : 'Modo Tela Cheia'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" /> : <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300" />}
            </button>

            {/* Configurações IA */}
            <button
              type="button"
              onClick={() => setShowSettingsModal(true)}
              className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-[#00D2F6]/30 bg-[#00D2F6]/10 hover:bg-[#00D2F6]/20 text-[11px] sm:text-xs font-mono text-[#00D2F6] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,210,246,0.15)] whitespace-nowrap"
            >
              <Settings className="w-3.5 h-3.5 text-[#00D2F6]" />
              <span>Ajustes IA</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SUB-ABAS DE NAVEGAÇÃO INTERNA */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-shrink-0">
        <button
          type="button"
          onClick={() => setActiveSubView('chat')}
          className={'px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ' + (activeSubView === 'chat' ? 'bg-[#00D2F6]/15 border-[#00D2F6] text-[#00D2F6] shadow-[0_0_15px_rgba(0,210,246,0.2)]' : 'bg-[#0A1624] border-[#16273C] text-slate-400 hover:text-white hover:border-white/20')}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Conversas WhatsApp ({contacts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubView('diagnostics')}
          className={'px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ' + (activeSubView === 'diagnostics' ? 'bg-[#00D2F6]/15 border-[#00D2F6] text-[#00D2F6] shadow-[0_0_15px_rgba(0,210,246,0.2)]' : 'bg-[#0A1624] border-[#16273C] text-slate-400 hover:text-white hover:border-white/20')}
        >
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>Diagnósticos HOT ({diagnostics.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubView('kanban')}
          className={'px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ' + (activeSubView === 'kanban' ? 'bg-[#00D2F6]/15 border-[#00D2F6] text-[#00D2F6] shadow-[0_0_15px_rgba(0,210,246,0.2)]' : 'bg-[#0A1624] border-[#16273C] text-slate-400 hover:text-white hover:border-white/20')}
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Kanban de Oportunidades</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubView('calendar')}
          className={'px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ' + (activeSubView === 'calendar' ? 'bg-[#00D2F6]/15 border-[#00D2F6] text-[#00D2F6] shadow-[0_0_15px_rgba(0,210,246,0.2)]' : 'bg-[#0A1624] border-[#16273C] text-slate-400 hover:text-white hover:border-white/20')}
        >
          <Calendar className="w-3.5 h-3.5 text-purple-400" />
          <span>Agenda Google Meet ({meetings.length})</span>
        </button>
      </div>

      {/* 3. PAINEL PRINCIPAL DINÂMICO */}
      <div className="bg-[#0A1624] border border-[#16273C] rounded-2xl flex-1 flex overflow-hidden shadow-2xl min-h-[580px] lg:min-h-[640px]">
        {/* SUB-VISÃO: CHAT WHATSAPP COMPLETO */}
        {activeSubView === 'chat' && (
          <div className="flex-1 flex overflow-hidden">
            {/* COLUNA ESQUERDA: LISTA DE CONTATOS */}
            <div className="w-full sm:w-80 md:w-88 border-r border-[#16273C] bg-[#0A1624] flex flex-col flex-shrink-0">
              {/* Barra de Busca e Filtros */}
              <div className="p-3 border-b border-[#16273C] space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Buscar lead ou empresa..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#07111F] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00D2F6]/50 transition-colors"
                  />
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('all')}
                    className={'flex-1 py-1 rounded-lg transition-colors ' + (categoryFilter === 'all' ? 'bg-[#00D2F6]/20 text-[#00D2F6] font-bold border border-[#00D2F6]/40' : 'text-slate-400 hover:text-white bg-white/[0.02]')}
                  >
                    Todos
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('hot')}
                    className={'flex-1 py-1 rounded-lg transition-colors flex items-center justify-center gap-1 ' + (categoryFilter === 'hot' ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40' : 'text-slate-400 hover:text-white bg-white/[0.02]')}
                  >
                    <Flame className="w-3 h-3" /> HOT
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('meeting')}
                    className={'flex-1 py-1 rounded-lg transition-colors flex items-center justify-center gap-1 ' + (categoryFilter === 'meeting' ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40' : 'text-slate-400 hover:text-white bg-white/[0.02]')}
                  >
                    <Calendar className="w-3 h-3" /> Meet
                  </button>
                </div>
              </div>

              {/* Lista de Contatos */}
              <div className="flex-1 overflow-y-auto divide-y divide-[#16273C]/50">
                {filteredContacts.map((contact) => {
                  const isSelected = contact.id === activeContact?.id;
                  return (
                    <div
                      key={contact.id}
                      onClick={() => setSelectedContactId(contact.id)}
                      className={'p-3 flex items-start gap-3 cursor-pointer transition-colors relative ' + (isSelected ? 'bg-[#0C1E33] border-l-4 border-l-[#00D2F6]' : 'hover:bg-white/[0.02]')}
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#07111F] border border-white/10 flex items-center justify-center text-lg flex-shrink-0">
                        {contact.avatar}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white truncate">{contact.name}</h4>
                          <span className="text-[10px] font-mono text-slate-400">{contact.lastMessageTime}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono truncate">{contact.company}</p>
                        <p className="text-[11px] text-slate-300 truncate mt-0.5">{contact.lastMessage}</p>

                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-[#00D2F6] border border-[#00D2F6]/20 font-bold">
                            {contact.score}% Score
                          </span>
                          <span className="text-[9px] font-mono text-slate-400 truncate">
                            {contact.statusLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* COLUNA CENTRAL: CHAT COM O LEAD */}
            <div className="flex-1 flex flex-col bg-[#07111F] min-w-0">
              {/* Header do Chat Ativo */}
              {activeContact && (
                <div className="px-4 py-3 border-b border-[#16273C] bg-[#0A1624] flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#07111F] border border-[#00D2F6]/30 flex items-center justify-center text-lg flex-shrink-0">
                      {activeContact.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white truncate">{activeContact.name}</h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold">
                          {activeContact.score}% Score
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono truncate">
                        {activeContact.company + ' • ' + activeContact.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setAiPaused(!aiPaused)}
                      className={'px-2.5 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 border transition-all cursor-pointer ' + (aiPaused ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300')}
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>{aiPaused ? 'IA Pausada' : 'IA Autônoma'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Mensagens do Chat */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {activeContact?.messages.map((msg, idx) => {
                  const isAgent = msg.sender === 'agent';
                  return (
                    <div
                      key={idx}
                      className={'flex items-end gap-2 ' + (isAgent ? 'justify-end' : 'justify-start')}
                    >
                      {!isAgent && (
                        <div className="w-6 h-6 rounded-lg bg-[#0A1624] border border-white/10 flex items-center justify-center text-xs flex-shrink-0">
                          {activeContact.avatar}
                        </div>
                      )}

                      <div
                        className={'max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 shadow-md space-y-1.5 ' + (isAgent ? 'bg-gradient-to-r from-[#00D2F6] to-[#015EEF] text-slate-950 font-medium rounded-br-none' : 'bg-[#0A1624] border border-[#16273C] text-slate-100 rounded-bl-none')}
                      >
                        {/* Pré-visualização de Imagem */}
                        {msg.media?.type === 'image' && msg.media.url && (
                          <div
                            onClick={() => setLightboxImageUrl(msg.media?.url || null)}
                            className="cursor-pointer overflow-hidden rounded-xl border border-black/10 hover:opacity-90 transition-opacity"
                          >
                            <img
                              src={msg.media.url}
                              alt={msg.media.caption || 'Foto enviada'}
                              className="max-h-60 w-full object-cover"
                            />
                          </div>
                        )}

                        {/* Pré-visualização de Áudio */}
                        {msg.media?.type === 'audio' && msg.media.url && (
                          <div className="p-2 rounded-xl bg-black/20 space-y-1">
                            <div className="flex items-center gap-2 text-xs font-mono">
                              <Mic className="w-4 h-4" />
                              <span>Áudio de voz ({msg.media.filename || 'gravação'})</span>
                            </div>
                            <audio controls src={msg.media.url} className="w-full h-8" />
                          </div>
                        )}

                        {/* Texto da Mensagem */}
                        {msg.text && (
                          <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                            {msg.text}
                          </p>
                        )}

                        <div
                          className={'flex items-center justify-end gap-1 text-[10px] font-mono ' + (isAgent ? 'text-slate-900/75' : 'text-slate-400')}
                        >
                          <span>{msg.time}</span>
                          {isAgent && <CheckCheck className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Indicador de Digitação da IA */}
                {isAiResponding && (
                  <div className="flex items-center gap-2 text-xs font-mono text-[#00D2F6] animate-pulse">
                    <Bot className="w-4 h-4" />
                    <span>Agente de IA processando resposta contextual...</span>
                  </div>
                )}

                <div ref={chatBottomRef} />
              </div>

              {/* Sugestões Rápidas de Resposta da IA */}
              <div className="px-3 py-1.5 bg-[#0A1624]/70 border-t border-[#16273C] flex items-center gap-1.5 overflow-x-auto scrollbar-none flex-shrink-0">
                <span className="text-[10px] font-mono text-[#00D2F6] font-bold whitespace-nowrap flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#00D2F6]" /> Sugestões IA:
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleApplySuggestion(
                      'Podemos agendar uma demonstração de 20 minutos no Google Meet amanhã às 14h para apresentar a arquitetura do projeto?'
                    )
                  }
                  className="px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-[#00D2F6]/10 border border-white/[0.08] text-[10px] text-slate-300 hover:text-white whitespace-nowrap transition-colors"
                >
                  🗓️ Enviar Link do Meet
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleApplySuggestion(
                      'Já estruturei a proposta executiva com nosso SLA garantido de 7 dias úteis. Posso enviar o PDF detalhado?'
                    )
                  }
                  className="px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-[#00D2F6]/10 border border-white/[0.08] text-[10px] text-slate-300 hover:text-white whitespace-nowrap transition-colors"
                >
                  📄 Enviar Resumo da Proposta
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleApplySuggestion(
                      'Confirmamos o recebimento dos materiais e iniciamos o escopo do desenvolvimento.'
                    )
                  }
                  className="px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-[#00D2F6]/10 border border-white/[0.08] text-[10px] text-slate-300 hover:text-white whitespace-nowrap transition-colors"
                >
                  ⚡ Confirmar Início
                </button>
              </div>

              {/* Barra de Pré-Visualização de Mídia Staged */}
              {stagedMedia && (
                <div className="px-4 py-2 bg-[#0C1B2E] border-t border-[#16273C] flex items-center justify-between gap-2 flex-shrink-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {stagedMedia.type === 'image' ? (
                      <img
                        src={stagedMedia.previewUrl}
                        alt="Preview"
                        className="w-9 h-9 rounded-lg object-cover border border-[#00D2F6]"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-[#00D2F6]/20 flex items-center justify-center text-lg">
                        🎙️
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="text-xs font-mono text-cyan-300 block truncate">
                        {(stagedMedia.type === 'image' ? '📷 Foto selecionada' : '🎙️ Áudio de voz gravado') + ': ' + stagedMedia.filename}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 block">
                        {Math.round((stagedMedia.sizeBytes || 0) / 1024)} KB
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStagedMedia(null)}
                    className="p-1 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Barra de Envio e Gravação de Áudio */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 border-t border-[#16273C] bg-[#0A1624] flex items-center gap-2 flex-shrink-0"
              >
                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/*"
                  onChange={handleImageSelected}
                  className="hidden"
                />
                <input
                  type="file"
                  ref={audioInputRef}
                  accept="audio/*"
                  onChange={handleAudioFileSelected}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="p-2 sm:p-2.5 rounded-xl border border-white/10 hover:border-[#00D2F6]/50 bg-[#07111F] hover:bg-[#00D2F6]/10 text-slate-300 hover:text-[#00D2F6] transition-all cursor-pointer shadow flex-shrink-0"
                  title="Anexar Foto ou Imagem de Projeto"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleToggleAudioRecording}
                  className={'p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer shadow flex-shrink-0 ' + (isRecordingAudio ? 'border-rose-500 bg-rose-500/20 text-rose-400 animate-pulse' : 'border-white/10 hover:border-[#00D2F6]/50 bg-[#07111F] hover:bg-[#00D2F6]/10 text-slate-300 hover:text-[#00D2F6]')}
                  title={isRecordingAudio ? 'Clique para parar a gravação' : 'Gravar Áudio de Voz'}
                >
                  {isRecordingAudio ? <Square className="w-4 h-4 fill-current" /> : <Mic className="w-4 h-4" />}
                </button>

                {isRecordingAudio ? (
                  <div className="flex-1 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      Gravando áudio de voz...
                    </span>
                    <span>00:{String(recordingSeconds).padStart(2, '0')}</span>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Digite uma mensagem ou comande o Agente IA..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#07111F] border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00D2F6]/50 transition-colors"
                  />
                )}

                <button
                  type="submit"
                  disabled={!inputText.trim() && !stagedMedia}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D2F6] to-[#015EEF] text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,210,246,0.3)] hover:opacity-95 disabled:opacity-40 cursor-pointer flex-shrink-0 transition-all"
                >
                  <span>Enviar</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* COLUNA DIREITA: DOSSIÊ DO LEAD */}
            {activeContact && (
              <div className="hidden lg:flex w-72 xl:w-80 border-l border-[#16273C] bg-[#0A1624] flex-col p-4 space-y-3 overflow-y-auto flex-shrink-0">
                <div className="border-b border-[#16273C] pb-3 flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#00D2F6] uppercase tracking-wider block font-bold">
                      Dossiê do Lead & Triagem IA
                    </span>
                    <h4 className="text-base font-extrabold text-white mt-1">{activeContact.name}</h4>
                    <p className="text-xs font-mono text-slate-400">{activeContact.company}</p>
                    <p className="text-xs font-mono text-[#00D2F6] mt-0.5">{activeContact.phone}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingContact(activeContact);
                      setIsContactModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-[#00D2F6]/20 border border-white/10 text-slate-300 hover:text-[#00D2F6] transition-colors cursor-pointer"
                    title="Editar Dossiê do Lead"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Score Comercial */}
                <div className="p-3 rounded-xl bg-[#07111F] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Maturidade & Score Comercial
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-emerald-400">{activeContact.score}%</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                      🔥 Altíssima Qualificação
                    </span>
                  </div>
                </div>

                {/* Escopo Identificado */}
                <div className="p-3 rounded-xl bg-[#07111F] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Escopo Identificado
                  </span>
                  <div className="text-xs font-bold text-white">{activeContact.projectType}</div>
                  <div className="text-[10px] font-mono text-[#00D2F6]">
                    SLA Garantido: {activeContact.slaTimeline}
                  </div>
                </div>

                {/* Empresa & IA Ativa */}
                <div className="p-3 rounded-xl bg-[#07111F] border border-white/[0.06] space-y-1 text-xs">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Empresa & IA Configurada
                  </span>
                  <p className="font-bold text-white">{config?.company?.companyName || 'TCAI Soluções Inteligentes'}</p>
                  <p className="text-[10px] font-mono text-cyan-300">
                    {'Motor: ' + (config?.gemini?.model || 'gemini-2.0-flash') + ' • Visão & Áudio Ativos'}
                  </p>
                </div>

                {/* Ações Rápidas do Dossiê */}
                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingDiagnostic({
                        id: '',
                        title: activeContact.projectType || 'Automação & Atendimento IA 24/7',
                        client: activeContact.name + ' (' + activeContact.company + ')',
                        date: 'Hoje',
                        sla: activeContact.slaTimeline || '7 dias úteis',
                        score: activeContact.score + '%',
                        status: 'HOT',
                        budget: 'R$ 6.800 - R$ 9.500',
                        stack: ['WhatsApp Cloud API', 'Gemini 2.0 Multimodal', 'Node.js / TypeScript'],
                        notes: 'Gerado via Dossiê de Atendimento para ' + activeContact.name,
                      });
                      setIsDiagModalOpen(true);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-[#00D2F6]/10 hover:bg-[#00D2F6]/20 border border-[#00D2F6]/30 text-[#00D2F6] text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>➕ Gerar Diagnóstico Técnico</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingMeeting({
                        id: '',
                        client: activeContact.name + ' (' + activeContact.company + ')',
                        phone: activeContact.phone,
                        time: 'Amanhã, 14:00 - 14:30',
                        topic: 'Alinhamento de Escopo: ' + activeContact.projectType,
                        link: 'meet.google.com/tcai-' + Math.random().toString(36).substring(2, 7),
                        type: 'Google Meet',
                        status: 'AGENDADO',
                      });
                      setIsMeetingModalOpen(true);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>📅 Agendar Google Meet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsProposalModalOpen(true)}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>📄 Gerar Proposta Comercial</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsTimelineModalOpen(true)}
                    className="w-full py-2 px-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>🕒 Timeline & Notas 360°</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAiPaused(!aiPaused)}
                    className={'w-full py-2 px-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ' + (aiPaused ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-slate-300')}
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>{aiPaused ? '▶️ Reativar Agente IA' : '✋ Pausar Agente IA'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUB-VISÃO: DIAGNÓSTICOS HOT */}
        {activeSubView === 'diagnostics' && (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            <div className="max-w-6xl mx-auto space-y-4">
              {/* Header com Filtro e Botão Novo */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0C1B2E] p-4 rounded-2xl border border-[#16273C]">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" />
                    Diagnósticos Comerciais & Requisitos Mapeados por IA
                  </h3>
                  <p className="text-xs text-slate-400">
                    Análise cognitiva de escopo, orçamento estimado e prazos contratuais de SLA.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingDiagnostic(null);
                      setIsDiagModalOpen(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#00D2F6] to-[#015EEF] text-slate-950 font-bold font-mono text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,210,246,0.3)] hover:opacity-95 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Novo Diagnóstico</span>
                  </button>
                </div>
              </div>

              {/* Barra de Pesquisa e Filtros */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={diagSearch}
                    onChange={(e) => setDiagSearch(e.target.value)}
                    placeholder="Pesquisar por projeto, cliente ou stack..."
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#07111F] border border-[#16273C] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00D2F6]"
                  />
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                  {(['ALL', 'HOT', 'QUALIFICADO', 'TRIAGEM'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setDiagStatusFilter(st)}
                      className={'px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-colors whitespace-nowrap ' + (diagStatusFilter === st ? 'bg-[#00D2F6]/20 border-[#00D2F6] text-[#00D2F6]' : 'bg-[#07111F] border-[#16273C] text-slate-400 hover:text-white')}
                    >
                      {st === 'ALL' ? 'Todos' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid de Cards de Diagnósticos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {filteredDiagnostics.map((diag) => {
                  const isHot = diag.status === 'HOT';
                  return (
                    <div
                      key={diag.id}
                      className={'p-4 rounded-2xl bg-[#07111F] border space-y-3 transition-all shadow-lg relative flex flex-col justify-between ' + (isHot ? 'border-amber-500/30 hover:border-amber-400/60' : 'border-[#16273C] hover:border-[#00D2F6]/40')}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span
                            className={'px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold border flex items-center gap-1 ' + (isHot ? 'bg-amber-500/15 border-amber-500/30 text-amber-300' : 'bg-[#00D2F6]/15 border-[#00D2F6]/30 text-[#00D2F6]')}
                          >
                            {isHot && <Flame className="w-3 h-3 text-amber-400" />}
                            {diag.status + ' • SCORE ' + diag.score}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">{diag.date}</span>
                        </div>

                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-white">{diag.title}</h4>
                          <p className="text-xs font-mono text-cyan-300 mt-0.5">Cliente: {diag.client}</p>
                        </div>

                        <div className="p-2.5 rounded-xl bg-[#0A1624] border border-white/[0.04] space-y-1">
                          <div className="text-xs font-bold text-emerald-400">Faixa Orçamentária: {diag.budget}</div>
                          <div className="text-xs font-mono text-cyan-300">Prazo Estimado: {diag.sla}</div>
                        </div>

                        {diag.notes && (
                          <p className="text-[11px] text-slate-400 italic bg-[#0A1624] p-2 rounded-lg border border-white/[0.02]">
                            "{diag.notes}"
                          </p>
                        )}

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {diag.stack.map((item, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 text-[10px] font-mono border border-white/[0.06]"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Botões de Ação do Card */}
                      <div className="pt-3 mt-2 border-t border-[#16273C] flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleSendDiagnosticToChat(diag)}
                          className="px-3 py-1.5 rounded-xl bg-[#00D2F6]/10 hover:bg-[#00D2F6]/20 border border-[#00D2F6]/30 text-[#00D2F6] font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Enviar resumo executivo do diagnóstico direto no WhatsApp"
                        >
                          <Send className="w-3 h-3" />
                          <span>Enviar no Chat</span>
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingDiagnostic(diag);
                              setIsDiagModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] border border-white/[0.06] cursor-pointer"
                            title="Editar Diagnóstico"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDiagnostic(diag.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/[0.06] cursor-pointer"
                            title="Excluir Diagnóstico"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredDiagnostics.length === 0 && (
                <div className="p-8 text-center bg-[#07111F] rounded-2xl border border-[#16273C] space-y-2">
                  <Flame className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-sm font-bold text-white">Nenhum diagnóstico encontrado</p>
                  <p className="text-xs text-slate-400">Tente ajustar seus filtros ou crie um novo diagnóstico técnico.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUB-VISÃO: KANBAN DE LEADS */}
        {activeSubView === 'kanban' && (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col space-y-4">
            {/* Header do Kanban */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0C1B2E] p-4 rounded-2xl border border-[#16273C] flex-shrink-0">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#00D2F6]" />
                  Pipeline de Oportunidades & Qualificação por IA
                </h3>
                <p className="text-xs text-slate-400">
                  Arraste e avance leads entre os estágios comerciais de triagem e fechamento.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingContact(null);
                  setIsContactModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#00D2F6] to-[#015EEF] text-slate-950 font-bold font-mono text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,210,246,0.3)] hover:opacity-95 cursor-pointer w-fit"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Oportunidade</span>
              </button>
            </div>

            {/* Colunas do Kanban */}
            <div className="flex-1 overflow-x-auto pb-2">
              <div className="flex gap-4 min-w-[1050px] h-full items-stretch">
                {KANBAN_STAGES.map((column, colIdx) => {
                  const columnContacts = contacts.filter((c) => c.status === column.key);
                  return (
                    <div
                      key={column.key}
                      className="flex-1 flex flex-col bg-[#07111F] border border-[#16273C] rounded-2xl p-3.5 min-w-[240px] shadow-lg"
                    >
                      <div className={'border-b ' + column.color + ' pb-2.5 mb-3 flex items-center justify-between'}>
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          {column.label}
                        </span>
                        <span className={'text-[10px] font-mono px-2 py-0.5 rounded-full ' + column.badgeBg + ' ' + column.badgeBorder + ' ' + column.badgeText + ' font-bold'}>
                          {columnContacts.length}
                        </span>
                      </div>

                      <div className="flex-1 space-y-3 overflow-y-auto pr-0.5">
                        {columnContacts.map((c) => (
                          <div
                            key={c.id}
                            className="p-3 rounded-xl bg-[#0A1624] border border-white/[0.06] hover:border-[#00D2F6]/50 transition-all space-y-2 shadow-md relative group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white truncate pr-2">{c.name}</span>
                              <span className="text-sm">{c.avatar}</span>
                            </div>

                            <p className="text-[11px] text-slate-400 font-mono truncate">{c.company}</p>
                            <p className="text-[11px] text-slate-300 font-sans line-clamp-1">{c.projectType}</p>

                            <div className="flex items-center justify-between text-[10px] font-mono pt-1">
                              <span className="text-[#00D2F6] font-bold">{c.score}% Score</span>
                              <span className="text-slate-400">{c.slaTimeline}</span>
                            </div>

                            {/* Controles de Movimentação de Estágio e Edição */}
                            <div className="pt-2 border-t border-[#16273C] flex items-center justify-between gap-1 text-[11px] font-mono">
                              <div className="flex items-center gap-1">
                                {colIdx > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleMoveContactStage(c.id, KANBAN_STAGES[colIdx - 1].key)}
                                    className="p-1 rounded bg-white/[0.04] hover:bg-[#00D2F6]/20 border border-white/10 text-slate-300 hover:text-[#00D2F6] cursor-pointer"
                                    title="Mover para estágio anterior"
                                  >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {colIdx < KANBAN_STAGES.length - 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleMoveContactStage(c.id, KANBAN_STAGES[colIdx + 1].key)}
                                    className="p-1 rounded bg-white/[0.04] hover:bg-[#00D2F6]/20 border border-white/10 text-slate-300 hover:text-[#00D2F6] cursor-pointer"
                                    title="Avançar para próximo estágio"
                                  >
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingContact(c);
                                    setIsContactModalOpen(true);
                                  }}
                                  className="p-1 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white cursor-pointer"
                                  title="Editar Lead"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedContactId(c.id);
                                    setActiveSubView('chat');
                                  }}
                                  className="px-2 py-0.5 rounded bg-[#00D2F6]/10 hover:bg-[#00D2F6]/20 border border-[#00D2F6]/30 text-[#00D2F6] font-bold cursor-pointer"
                                  title="Abrir Chat"
                                >
                                  Chat
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        {columnContacts.length === 0 && (
                          <div className="py-8 text-center border border-dashed border-[#16273C] rounded-xl text-slate-500 text-[11px] font-mono">
                            Vazio
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SUB-VISÃO: AGENDA GOOGLE MEET */}
        {activeSubView === 'calendar' && (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            <div className="max-w-4xl mx-auto space-y-4">
              {/* Header com Filtro e Botão Novo */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0C1B2E] p-4 rounded-2xl border border-[#16273C]">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    Próximas Reuniões de Alinhamento (Google Meet)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sincronização com Google Meet, envio de lembretes no WhatsApp e controle de pauta.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingMeeting(null);
                    setIsMeetingModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold font-mono text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:opacity-95 cursor-pointer w-fit"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Agendamento</span>
                </button>
              </div>

              {/* Barra de Pesquisa e Filtros */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={meetingSearch}
                    onChange={(e) => setMeetingSearch(e.target.value)}
                    placeholder="Pesquisar por participante ou pauta..."
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#07111F] border border-[#16273C] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                  {(['ALL', 'AGENDADO', 'REALIZADO', 'CANCELADO'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setMeetingStatusFilter(st)}
                      className={'px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-colors whitespace-nowrap ' + (meetingStatusFilter === st ? 'bg-purple-500/20 border-purple-400 text-purple-300' : 'bg-[#07111F] border-[#16273C] text-slate-400 hover:text-white')}
                    >
                      {st === 'ALL' ? 'Todas' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista de Reuniões */}
              <div className="space-y-3">
                {filteredMeetings.map((m) => {
                  const isDone = m.status === 'REALIZADO';
                  const isCancelled = m.status === 'CANCELADO';
                  return (
                    <div
                      key={m.id}
                      className={'p-4 rounded-2xl bg-[#07111F] border space-y-3 transition-all shadow-lg ' + (isDone ? 'border-emerald-500/30 opacity-80' : isCancelled ? 'border-rose-500/30 opacity-60' : 'border-[#16273C] hover:border-purple-500/40')}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono font-bold text-purple-300 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {m.time}
                            </span>
                            <span
                              className={'text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ' + (isDone ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : isCancelled ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' : 'bg-purple-500/15 text-purple-300 border-purple-500/30')}
                            >
                              {m.status || 'AGENDADO'}
                            </span>
                          </div>

                          <h4 className="text-sm sm:text-base font-bold text-white">{m.client}</h4>
                          <p className="text-xs text-slate-300 font-mono">Pauta: {m.topic}</p>
                          {m.notes && (
                            <p className="text-[11px] text-slate-400 italic bg-[#0A1624] p-2 rounded-lg border border-white/[0.04]">
                              "{m.notes}"
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopyMeetLink(m.link)}
                            className="px-3 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Copiar link da reunião"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar</span>
                          </button>

                          <a
                            href={'https://' + m.link.replace(/^https?:\/\//, '')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:opacity-95"
                          >
                            <span>Entrar no Meet</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>

                      {/* Ações Rápidas da Reunião */}
                      <div className="pt-2.5 border-t border-[#16273C] flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleSendMeetingReminder(m)}
                          className="px-3 py-1.5 rounded-xl bg-[#00D2F6]/10 hover:bg-[#00D2F6]/20 border border-[#00D2F6]/30 text-[#00D2F6] font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Enviar lembrete cordial via WhatsApp"
                        >
                          <Send className="w-3 h-3" />
                          <span>Enviar Lembrete no WhatsApp</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleToggleMeetingStatus(m)}
                            className={'px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold border transition-colors cursor-pointer ' + (isDone ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-white/[0.04] border-white/10 text-slate-300 hover:text-white')}
                          >
                            {isDone ? '✓ Concluído' : 'Marcar Concluído'}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingMeeting(m);
                              setIsMeetingModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] border border-white/[0.06] cursor-pointer"
                            title="Editar Reunião"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteMeeting(m.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/[0.06] cursor-pointer"
                            title="Excluir Reunião"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredMeetings.length === 0 && (
                <div className="p-8 text-center bg-[#07111F] rounded-2xl border border-[#16273C] space-y-2">
                  <Calendar className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-sm font-bold text-white">Nenhuma reunião encontrada</p>
                  <p className="text-xs text-slate-400">Tente ajustar seus filtros ou crie um novo agendamento.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* LIGHTBOX MODAL PARA FOTOS EM ALTA RESOLUÇÃO */}
      {lightboxImageUrl && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxImageUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <button
              type="button"
              onClick={() => setLightboxImageUrl(null)}
              className="absolute -top-10 right-0 text-white hover:text-[#00D2F6] p-1 text-sm font-mono flex items-center gap-1"
            >
              <X className="w-5 h-5" /> Fechar
            </button>
            <img
              src={lightboxImageUrl}
              alt="Foto ampliada"
              className="rounded-2xl max-w-full max-h-[85vh] object-contain shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* MODAIS INTERATIVOS */}
      <AgentSettingsModal
        isOpen={showSettingsModal}
        onClose={() => {
          setShowSettingsModal(false);
          loadInitialData();
        }}
      />

      <DiagnosticEditModal
        isOpen={isDiagModalOpen}
        onClose={() => {
          setIsDiagModalOpen(false);
          setEditingDiagnostic(null);
        }}
        onSave={handleSaveDiagnostic}
        initialData={editingDiagnostic}
        clientSuggestions={contacts.map((c) => c.name + ' (' + c.company + ')')}
      />

      <MeetingEditModal
        isOpen={isMeetingModalOpen}
        onClose={() => {
          setIsMeetingModalOpen(false);
          setEditingMeeting(null);
        }}
        onSave={handleSaveMeeting}
        initialData={editingMeeting}
        clientSuggestions={contacts.map((c) => ({ name: c.name, company: c.company, phone: c.phone }))}
      />

      <ContactEditModal
        isOpen={isContactModalOpen}
        onClose={() => {
          setIsContactModalOpen(false);
          setEditingContact(null);
        }}
        onSave={handleSaveContact}
        initialData={editingContact}
      />

      {/* Modal de Proposta Técnico-Comercial */}
      {isProposalModalOpen && activeContact && (
        <ProposalModal
          initialContact={activeContact}
          availableContacts={contacts}
          onClose={() => setIsProposalModalOpen(false)}
          onSaved={(saved) => {
            setIsProposalModalOpen(false);
            showToast(`Proposta ${saved.proposalNumber} gravada com sucesso!`);
          }}
          onSendWhatsApp={(text) => {
            handleSendMessage(undefined, text);
          }}
          onOpenPrintView={(p) => setSelectedProposalToPrint(p)}
        />
      )}

      {/* Visualização de Impressão / PDF */}
      {selectedProposalToPrint && (
        <ProposalPrintView
          proposal={selectedProposalToPrint}
          onClose={() => setSelectedProposalToPrint(null)}
        />
      )}

      {/* Modal de Timeline & Notas 360° */}
      {isTimelineModalOpen && activeContact && (
        <div className="fixed inset-0 z-50 bg-[#07111F]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 font-kanit">
          <div className="bg-[#0A1624] border border-[#16273C] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#16273C] bg-[#07111F]/50">
              <div className="flex items-center gap-2">
                <span className="text-lg">{activeContact.avatar}</span>
                <div>
                  <h3 className="font-bold text-white text-sm">Linha do Tempo 360° — {activeContact.name}</h3>
                  <p className="text-[10px] text-[#94A3B8]">
                    {activeContact.company} • {activeContact.phone}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTimelineModalOpen(false)}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#16273C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <LeadTimelineFeed
                contactId={activeContact.id}
                leadName={activeContact.name}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
