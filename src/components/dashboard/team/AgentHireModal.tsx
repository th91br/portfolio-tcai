import React, { useState } from 'react';
import {
  X,
  UserPlus,
  ShieldCheck,
  Bot,
  Sparkles,
  Save,
  Briefcase,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import {
  SubagentRole,
  SubagentDepartment,
  SubagentCapability,
} from '../../../services/agent/subagentTypes';
import { saveSubagent } from '../../../services/agent/subagentStorage';
import { hireSubagent } from '../../../services/agent/agentOrchestratorService';

interface AgentHireModalProps {
  agentToEdit?: SubagentRole | null;
  onClose: () => void;
  onSaved: (agent: SubagentRole) => void;
}

const DEPARTMENT_OPTIONS: SubagentDepartment[] = [
  'Comercial',
  'Estratégia',
  'Marketing',
  'Segurança',
  'Operações',
  'Atendimento',
  'Customizado',
];

const AVATAR_OPTIONS = ['👔', '📊', '✍️', '🛡️', '⚖️', '💡', '💰', '🩺', '🏗️', '🤖'];

const ROLE_PRESETS = [
  {
    title: 'Especialista em Cobrança Amigável',
    roleTitle: 'Analista de Negociação Financeira',
    department: 'Operações' as SubagentDepartment,
    avatar: '💰',
    description: 'Aborda clientes com faturas pendentes de forma educada, negociando parcelamento via PIX com foco em retenção.',
    prompt: `Você é o Especialista em Negociação e Cobrança Humanizada da empresa.
Seu tom é sempre cordial, empático e resolutivo. Nunca use tom acusatório. Proponha condições facilitadas e parcelamento PIX com foco em manter a parceria ativa.`,
  },
  {
    title: 'Assistente de Onboarding & Boas-Vindas',
    roleTitle: 'Guia de Sucesso do Cliente (CS)',
    department: 'Atendimento' as SubagentDepartment,
    avatar: '💡',
    description: 'Recebe novos clientes após o fechamento, envia o passo a passo de implantação e coleta os primeiros requisitos.',
    prompt: `Você é o Especialista de Sucesso do Cliente e Onboarding.
Seu papel é acolher o cliente recém-fechado, dar as boas-vindas com energia e profissionalismo, e orientar sobre os próximos passos da entrega.`,
  },
  {
    title: 'Auditor Jurídico de Contratos',
    roleTitle: 'Consultor de Conformidade Contratual',
    department: 'Estratégia' as SubagentDepartment,
    avatar: '⚖️',
    description: 'Revisa minutas de contratos e propostas, validando garantias de prazo, escopo e cláusulas de segurança.',
    prompt: `Você é o Consultor de Conformidade e Auditor de Contratos da empresa.
Sua função é validar se as propostas e minutas respeitam os prazos de entrega, SLAs e cláusulas de confidencialidade acordadas.`,
  },
];

export const AgentHireModal: React.FC<AgentHireModalProps> = ({
  agentToEdit,
  onClose,
  onSaved,
}) => {
  const isEditing = Boolean(agentToEdit);

  const [name, setName] = useState(agentToEdit?.name || '');
  const [roleTitle, setRoleTitle] = useState(agentToEdit?.roleTitle || '');
  const [department, setDepartment] = useState<SubagentDepartment>(
    agentToEdit?.department || 'Comercial'
  );
  const [avatar, setAvatar] = useState(agentToEdit?.avatar || '🤖');
  const [description, setDescription] = useState(agentToEdit?.description || '');
  const [systemPrompt, setSystemPrompt] = useState(agentToEdit?.systemPrompt || '');
  const [selectedCapabilities, setSelectedCapabilities] = useState<SubagentCapability[]>(
    agentToEdit?.capabilities || ['read_crm']
  );

  const handleApplyPreset = (preset: (typeof ROLE_PRESETS)[0]) => {
    setName(preset.title);
    setRoleTitle(preset.roleTitle);
    setDepartment(preset.department);
    setAvatar(preset.avatar);
    setDescription(preset.description);
    setSystemPrompt(preset.prompt);
  };

  const toggleCapability = (cap: SubagentCapability) => {
    if (selectedCapabilities.includes(cap)) {
      setSelectedCapabilities(selectedCapabilities.filter((c) => c !== cap));
    } else {
      setSelectedCapabilities([...selectedCapabilities, cap]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !roleTitle.trim() || !systemPrompt.trim()) return;

    if (isEditing && agentToEdit) {
      const updated: SubagentRole = {
        ...agentToEdit,
        name: name.trim(),
        roleTitle: roleTitle.trim(),
        department,
        avatar,
        description: description.trim(),
        systemPrompt: systemPrompt.trim(),
        capabilities: selectedCapabilities,
      };
      saveSubagent(updated);
      onSaved(updated);
    } else {
      const created = hireSubagent({
        name,
        roleTitle,
        department,
        avatar,
        description,
        systemPrompt,
        capabilities: selectedCapabilities,
      });
      onSaved(created);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-kanit">
      <div className="bg-[#0A1624] border border-[#16273C] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#16273C] bg-[#07111F]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00D2F6]/10 border border-[#00D2F6]/30 flex items-center justify-center text-[#00D2F6]">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {isEditing ? 'Configurar Funcionário de IA' : 'Contratar Novo Agente de IA'}
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Organograma Corporativo • Definição de Papel, Prompt & Permissões
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#16273C] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 text-xs text-[#CBD5E1]">
          {/* Presets Rápidos */}
          {!isEditing && (
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-[#00D2F6] font-bold uppercase">
                Modelos Rápidos de Cargo:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {ROLE_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#00D2F6]/40 hover:bg-[#00D2F6]/10 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span>{p.avatar}</span>
                      <span className="font-bold text-white text-[11px] truncate group-hover:text-[#00D2F6]">
                        {p.title}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2">{p.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Nome e Cargo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-[#94A3B8] mb-1">Nome do Agente *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Consultor Financeiro"
                className="w-full bg-[#07111F] border border-[#16273C] focus:border-[#00D2F6] rounded-lg p-2.5 text-xs text-[#F3F5F7] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#94A3B8] mb-1">Cargo / Título Oficial *</label>
              <input
                type="text"
                required
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="Ex: Analista de Cobrança & Retenção"
                className="w-full bg-[#07111F] border border-[#16273C] focus:border-[#00D2F6] rounded-lg p-2.5 text-xs text-[#F3F5F7] outline-none"
              />
            </div>
          </div>

          {/* Departamento e Avatar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-[#94A3B8] mb-1">Departamento</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as SubagentDepartment)}
                className="w-full bg-[#07111F] border border-[#16273C] focus:border-[#00D2F6] rounded-lg p-2.5 text-xs text-[#F3F5F7] outline-none cursor-pointer"
              >
                {DEPARTMENT_OPTIONS.map((dep) => (
                  <option key={dep} value={dep} className="bg-[#0A1624]">
                    {dep}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-[#94A3B8] mb-1">Avatar / Ícone</label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setAvatar(av)}
                    className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center transition-all cursor-pointer ${
                      avatar === av
                        ? 'bg-[#00D2F6]/20 border border-[#00D2F6] scale-110'
                        : 'bg-white/[0.03] border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Breve Descrição */}
          <div>
            <label className="block text-[11px] text-[#94A3B8] mb-1">Missão / Descrição Curta</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Atendimento focado em sanar dúvidas contratuais e pós-venda"
              className="w-full bg-[#07111F] border border-[#16273C] focus:border-[#00D2F6] rounded-lg p-2.5 text-xs text-[#F3F5F7] outline-none"
            />
          </div>

          {/* Prompt de Especialidade */}
          <div>
            <label className="block text-[11px] text-[#94A3B8] mb-1">
              Instruções de Personalidade & Prompt do Agente *
            </label>
            <textarea
              rows={4}
              required
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Defina como o agente deve agir, tom de voz, regras e limites..."
              className="w-full bg-[#07111F] border border-[#16273C] focus:border-[#00D2F6] rounded-lg p-2.5 text-xs text-[#F3F5F7] font-mono outline-none leading-relaxed"
            />
          </div>

          {/* Permissões / Capacidades */}
          <div>
            <label className="block text-[11px] text-[#94A3B8] mb-2 font-mono uppercase">
              Permissões Operacionais:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'read_crm' as SubagentCapability, label: 'Consultar Dados de Leads no CRM' },
                { id: 'write_proposals' as SubagentCapability, label: 'Gerar e Modificar Propostas' },
                { id: 'whatsapp_reply' as SubagentCapability, label: 'Interagir na Linha de Frente WhatsApp' },
                { id: 'generate_copy' as SubagentCapability, label: 'Elaborar Roteiros de Marketing & Copies' },
              ].map((cap) => (
                <button
                  key={cap.id}
                  type="button"
                  onClick={() => toggleCapability(cap.id)}
                  className={`p-2 rounded-lg text-left flex items-center gap-2 border transition-all cursor-pointer ${
                    selectedCapabilities.includes(cap.id)
                      ? 'bg-[#00D2F6]/10 border-[#00D2F6]/40 text-white'
                      : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      selectedCapabilities.includes(cap.id) ? 'text-[#00D2F6]' : 'text-slate-600'
                    }`}
                  />
                  <span className="text-[11px]">{cap.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Rodapé de Ações */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#16273C]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-mono text-[#94A3B8] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#00D2F6] hover:bg-[#00B4D8] text-[#07111F] font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#00D2F6]/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Salvar Configurações' : 'Efetivar Contratação'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
