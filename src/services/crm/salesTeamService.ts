export interface SalesRep {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  avatar: string;
  role: 'closer' | 'sdr' | 'account_executive' | 'manager';
  roleTitle: string;
  status: 'active' | 'busy' | 'away' | 'inactive';
  weight: number; // 1 = padrão, 2 = dobro de leads
  leadsAssignedCount: number;
  dealsWonCount: number;
  totalRevenueWon: number;
  lastAssignedAt?: string;
  isHead?: boolean;
  // Biometria Vocal & Clonagem Multi-Vendedor
  voiceId?: string;
  voiceName?: string;
  voiceStatus?: 'not_configured' | 'active' | 'revoked';
  voiceSampleUrl?: string;
  voiceClonedAt?: string;
  voiceConsentAccepted?: boolean;
}

export type RoundRobinMode = 'circular' | 'capacity';

export interface SalesTeamSettings {
  roundRobinMode: RoundRobinMode;
  onlyActiveReps: boolean;
  notifyRepOnWhatsApp: boolean;
  autoReassignHours: number; // Reatribuir se não atender em X horas
}

const STORAGE_KEY_SALES_TEAM = 'tcai_sales_team_members';
const STORAGE_KEY_TEAM_SETTINGS = 'tcai_sales_team_settings';
const STORAGE_KEY_RR_INDEX = 'tcai_sales_team_rr_index';

export function getSalesTeam(): SalesRep[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SALES_TEAM);
    if (raw) return JSON.parse(raw);
  } catch {}

  const defaultTeam: SalesRep[] = [
    {
      id: 'rep_thiago',
      name: 'Thiago Cassol Antunes',
      email: 'thiago91cassol@hotmail.com',
      phone: '+55 (11) 98844-3210',
      whatsapp: '5511988443210',
      avatar: '👨‍💼',
      role: 'closer',
      roleTitle: 'Head Comercial & Arquiteto',
      status: 'active',
      weight: 1,
      leadsAssignedCount: 14,
      dealsWonCount: 8,
      totalRevenueWon: 68000,
      isHead: true,
      lastAssignedAt: new Date(Date.now() - 3600000).toISOString(),
      voiceId: 'voice-thiago-fundador',
      voiceName: 'Thiago Cassol (Fundador)',
      voiceStatus: 'active',
      voiceConsentAccepted: true,
      voiceClonedAt: '2026-03-01T10:00:00Z',
    },
    {
      id: 'rep_rafael',
      name: 'Rafael Mendonça',
      email: 'rafael.vendas@tcai.com.br',
      phone: '+55 (11) 97755-4321',
      whatsapp: '5511977554321',
      avatar: '🚀',
      role: 'sdr',
      roleTitle: 'SDR Senior • Inbound',
      status: 'active',
      weight: 1,
      leadsAssignedCount: 11,
      dealsWonCount: 5,
      totalRevenueWon: 42500,
      lastAssignedAt: new Date(Date.now() - 7200000).toISOString(),
      voiceId: 'voice-rafael-closer',
      voiceName: 'Rafael Mendonça',
      voiceStatus: 'active',
      voiceConsentAccepted: true,
      voiceClonedAt: '2026-03-05T14:30:00Z',
    },
    {
      id: 'rep_camila',
      name: 'Camila Duarte',
      email: 'camila.closer@tcai.com.br',
      phone: '+55 (47) 98822-1100',
      whatsapp: '5547988221100',
      avatar: '💼',
      role: 'closer',
      roleTitle: 'Closer B2B • Enterprise',
      status: 'active',
      weight: 1,
      leadsAssignedCount: 9,
      dealsWonCount: 6,
      totalRevenueWon: 51000,
      lastAssignedAt: new Date(Date.now() - 10800000).toISOString(),
      voiceId: 'voice-camila-closer',
      voiceName: 'Camila Duarte',
      voiceStatus: 'not_configured',
      voiceConsentAccepted: false,
    },
  ];

  saveSalesTeam(defaultTeam);
  return defaultTeam;
}

export function saveSalesTeam(team: SalesRep[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_SALES_TEAM, JSON.stringify(team));
  } catch (err) {
    console.warn('Erro ao salvar time de vendas:', err);
  }
}

export function getSalesTeamSettings(): SalesTeamSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TEAM_SETTINGS);
    if (raw) return JSON.parse(raw);
  } catch {}

  const defaults: SalesTeamSettings = {
    roundRobinMode: 'circular',
    onlyActiveReps: true,
    notifyRepOnWhatsApp: true,
    autoReassignHours: 4,
  };
  saveSalesTeamSettings(defaults);
  return defaults;
}

export function saveSalesTeamSettings(settings: SalesTeamSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_TEAM_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.warn('Erro ao salvar configurações de vendas:', err);
  }
}

/**
 * Algoritmo de Roteamento Round Robin
 * Seleciona o próximo vendedor elegível (circular ou por capacidade) e incrementa métricas.
 */
export function assignNextLead(
  leadId: string,
  pipelineId?: string
): { repId: string; repName: string; repPhone: string } | null {
  const team = getSalesTeam();
  const settings = getSalesTeamSettings();

  const eligibleReps = team.filter((r) => {
    if (settings.onlyActiveReps && r.status !== 'active') return false;
    return true;
  });

  if (eligibleReps.length === 0) {
    const head = team.find((r) => r.isHead) || team[0];
    if (head) return { repId: head.id, repName: head.name, repPhone: head.phone };
    return null;
  }

  let selectedRep: SalesRep;

  if (settings.roundRobinMode === 'capacity') {
    // Escolhe quem tem menos leads atribuídos
    eligibleReps.sort((a, b) => a.leadsAssignedCount - b.leadsAssignedCount);
    selectedRep = eligibleReps[0];
  } else {
    // Round Robin Circular Estrito
    let lastIndex = 0;
    try {
      lastIndex = parseInt(localStorage.getItem(STORAGE_KEY_RR_INDEX) || '0', 10);
    } catch {}

    const targetIndex = (lastIndex + 1) % eligibleReps.length;
    selectedRep = eligibleReps[targetIndex];
    try {
      localStorage.setItem(STORAGE_KEY_RR_INDEX, targetIndex.toString());
    } catch {}
  }

  // Atualiza métricas do vendedor
  const updatedTeam = team.map((r) => {
    if (r.id === selectedRep.id) {
      return {
        ...r,
        leadsAssignedCount: r.leadsAssignedCount + 1,
        lastAssignedAt: new Date().toISOString(),
      };
    }
    return r;
  });

  saveSalesTeam(updatedTeam);

  return {
    repId: selectedRep.id,
    repName: selectedRep.name,
    repPhone: selectedRep.phone,
  };
}

/**
 * Gerador de Link Direto de Transferência para WhatsApp do Vendedor
 */
export function generateWhatsAppHandoffUrl(
  rep: SalesRep,
  leadName: string,
  leadCompany?: string,
  score?: number
): string {
  const cleanPhone = rep.whatsapp.replace(/\D/g, '');
  const message = `Olá ${rep.name}! A IA do CRM acabou de qualificar o lead *${leadName}*${
    leadCompany ? ` (${leadCompany})` : ''
  }${score ? ` com Score Comercial de ${score}%` : ''}. O contato foi atribuído a você para continuidade no fechamento!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Atualiza e Ativa a Biometria Vocal de um Vendedor
 */
export function updateSalesRepVoice(
  repId: string,
  voiceData: {
    voiceId: string;
    voiceName: string;
    voiceSampleUrl?: string;
    voiceConsentAccepted: boolean;
  }
): SalesRep[] {
  const team = getSalesTeam();
  const updated = team.map((r) => {
    if (r.id === repId) {
      return {
        ...r,
        voiceId: voiceData.voiceId,
        voiceName: voiceData.voiceName,
        voiceStatus: 'active' as const,
        voiceSampleUrl: voiceData.voiceSampleUrl,
        voiceClonedAt: new Date().toISOString(),
        voiceConsentAccepted: voiceData.voiceConsentAccepted,
      };
    }
    return r;
  });
  saveSalesTeam(updated);
  return updated;
}

/**
 * Revoga e Exclui a Biometria Vocal de um Vendedor (Desligamento / LGPD)
 */
export function revokeSalesRepVoice(repId: string): SalesRep[] {
  const team = getSalesTeam();
  const updated = team.map((r) => {
    if (r.id === repId) {
      return {
        ...r,
        voiceId: undefined,
        voiceName: undefined,
        voiceStatus: 'revoked' as const,
        voiceSampleUrl: undefined,
        voiceClonedAt: undefined,
        voiceConsentAccepted: false,
      };
    }
    return r;
  });
  saveSalesTeam(updated);
  return updated;
}
