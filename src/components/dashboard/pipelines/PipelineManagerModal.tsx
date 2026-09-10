import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Check,
  Layers,
  ArrowUp,
  ArrowDown,
  Sparkles,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import {
  PipelineDefinition,
  PipelineStageDefinition,
  INDUSTRY_PIPELINE_PRESETS,
  getPipelines,
  savePipelines,
  getActivePipeline,
  setActivePipelineId,
} from '../../../services/crm/customPipelinesService';

interface PipelineManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPipelinesUpdated: () => void;
}

const BADGE_COLOR_OPTIONS = [
  { label: 'Azul', value: 'border-blue-500/40 text-blue-400 bg-blue-500/10' },
  { label: 'Ciano', value: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10' },
  { label: 'Teal', value: 'border-teal-500/40 text-teal-400 bg-teal-500/10' },
  { label: 'Âmbar', value: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
  { label: 'Índigo', value: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10' },
  { label: 'Roxo', value: 'border-purple-500/40 text-purple-400 bg-purple-500/10' },
  { label: 'Rosa', value: 'border-pink-500/40 text-pink-400 bg-pink-500/10' },
  { label: 'Esmeralda', value: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
  { label: 'Vermelho', value: 'border-rose-500/40 text-rose-400 bg-rose-500/10' },
];

export const PipelineManagerModal: React.FC<PipelineManagerModalProps> = ({
  isOpen,
  onClose,
  onPipelinesUpdated,
}) => {
  const [pipelines, setPipelines] = useState<PipelineDefinition[]>(getPipelines());
  const [activePipeline, setActivePipeline] = useState<PipelineDefinition>(getActivePipeline());
  const [editingPipeline, setEditingPipeline] = useState<PipelineDefinition | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleSelectActivePipeline = (pipeline: PipelineDefinition) => {
    setActivePipelineId(pipeline.id);
    setActivePipeline(pipeline);
    onPipelinesUpdated();
    showNotification(`Funil ativo definido para "${pipeline.name}"`);
  };

  const handleStartEdit = (pipeline: PipelineDefinition) => {
    setEditingPipeline(JSON.parse(JSON.stringify(pipeline)));
    setIsCreatingNew(false);
  };

  const handleCreateFromPreset = (preset: PipelineDefinition) => {
    const newPipeline: PipelineDefinition = {
      ...JSON.parse(JSON.stringify(preset)),
      id: `pipeline_${Date.now()}`,
      name: `${preset.name} (Novo)`,
      isDefault: false,
      createdAt: new Date().toISOString(),
    };
    setEditingPipeline(newPipeline);
    setIsCreatingNew(true);
  };

  const handleSaveEditingPipeline = () => {
    if (!editingPipeline) return;

    if (!editingPipeline.name.trim()) {
      alert('Por favor, informe o nome do funil.');
      return;
    }

    if (editingPipeline.stages.length < 2) {
      alert('O funil deve conter pelo menos 2 etapas operacionais.');
      return;
    }

    const updatedPipelines = isCreatingNew
      ? [...pipelines, editingPipeline]
      : pipelines.map((p) => (p.id === editingPipeline.id ? editingPipeline : p));

    savePipelines(updatedPipelines);
    setPipelines(updatedPipelines);
    setActivePipelineId(editingPipeline.id);
    setActivePipeline(editingPipeline);
    setEditingPipeline(null);
    setIsCreatingNew(false);
    onPipelinesUpdated();
    showNotification(`Funil "${editingPipeline.name}" salvo com sucesso!`);
  };

  const handleDeletePipeline = (id: string) => {
    if (pipelines.length <= 1) {
      alert('Não é possível excluir o único funil restante do sistema.');
      return;
    }

    const target = pipelines.find((p) => p.id === id);
    if (!target) return;

    if (confirm(`Tem certeza que deseja excluir o funil "${target.name}"?`)) {
      const remaining = pipelines.filter((p) => p.id !== id);
      savePipelines(remaining);
      setPipelines(remaining);

      if (activePipeline.id === id) {
        const nextActive = remaining[0];
        setActivePipelineId(nextActive.id);
        setActivePipeline(nextActive);
      }

      onPipelinesUpdated();
      showNotification(`Funil "${target.name}" removido.`);
    }
  };

  const handleResetToPresets = () => {
    if (
      confirm(
        'Deseja restaurar todos os 4 modelos industriais padrão? Isso adicionará os modelos recomendados.'
      )
    ) {
      savePipelines(INDUSTRY_PIPELINE_PRESETS);
      setPipelines(INDUSTRY_PIPELINE_PRESETS);
      setActivePipeline(INDUSTRY_PIPELINE_PRESETS[0]);
      setActivePipelineId(INDUSTRY_PIPELINE_PRESETS[0].id);
      onPipelinesUpdated();
      showNotification('Modelos industriais restaurados!');
    }
  };

  // Stage Manipulation in Editor
  const handleStageChange = (
    index: number,
    field: keyof PipelineStageDefinition,
    value: any
  ) => {
    if (!editingPipeline) return;
    const updatedStages = [...editingPipeline.stages];
    updatedStages[index] = { ...updatedStages[index], [field]: value };
    setEditingPipeline({ ...editingPipeline, stages: updatedStages });
  };

  const handleAddStage = () => {
    if (!editingPipeline) return;
    const newStage: PipelineStageDefinition = {
      id: `STAGE_${Date.now()}`,
      name: 'NOVA ETAPA',
      badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
      defaultProb: 50,
    };
    setEditingPipeline({
      ...editingPipeline,
      stages: [...editingPipeline.stages, newStage],
    });
  };

  const handleRemoveStage = (index: number) => {
    if (!editingPipeline) return;
    if (editingPipeline.stages.length <= 2) {
      alert('Um funil necessita de pelo menos 2 etapas.');
      return;
    }
    const updatedStages = editingPipeline.stages.filter((_, i) => i !== index);
    setEditingPipeline({ ...editingPipeline, stages: updatedStages });
  };

  const handleMoveStage = (index: number, direction: 'up' | 'down') => {
    if (!editingPipeline) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= editingPipeline.stages.length) return;

    const updatedStages = [...editingPipeline.stages];
    const temp = updatedStages[index];
    updatedStages[index] = updatedStages[targetIndex];
    updatedStages[targetIndex] = temp;

    setEditingPipeline({ ...editingPipeline, stages: updatedStages });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#07111F]/80 backdrop-blur-md font-kanit">
      <div className="relative w-full max-w-4xl bg-[#091524] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header do Modal */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0A1624]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00D2F6]/10 border border-[#00D2F6]/30 flex items-center justify-center text-[#00D2F6]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white uppercase tracking-tight">
                  Múltiplos Funis Dinâmicos
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-bold">
                  ENTERPRISE 3.0
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Adapte as etapas do CRM para o nicho específico de qualquer empresa cliente
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notificação Temporária */}
        {successMessage && (
          <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-5 py-2.5 flex items-center gap-2 text-emerald-300 text-xs font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Conteúdo Principal */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {editingPipeline ? (
            /* ========================================================================= */
            /* MODO EDITOR DE FUNIL                                                      */
            /* ========================================================================= */
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h4 className="font-bold text-white text-sm uppercase tracking-wide">
                    {isCreatingNew ? 'Criar Novo Funil' : `Editando: ${editingPipeline.name}`}
                  </h4>
                  <p className="text-[11px] font-mono text-slate-400">
                    Defina o nome, ícone e a cadência de etapas operacionais
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPipeline(null);
                      setIsCreatingNew(false);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/10 text-xs font-mono text-slate-300 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEditingPipeline}
                    className="px-4 py-1.5 rounded-xl bg-[#00D2F6] hover:bg-[#00B4D8] text-black font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_0_15px_rgba(0,210,246,0.25)]"
                  >
                    <Check className="w-4 h-4" />
                    <span>Salvar Funil</span>
                  </button>
                </div>
              </div>

              {/* Informações Básicas */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white/[0.02] p-4 rounded-xl border border-white/10">
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Ícone Emoji
                  </label>
                  <input
                    type="text"
                    value={editingPipeline.icon}
                    onChange={(e) =>
                      setEditingPipeline({ ...editingPipeline, icon: e.target.value })
                    }
                    placeholder="Ex: 🚀"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-center text-lg focus:outline-none focus:border-[#00D2F6]"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Nome do Funil Comercial
                  </label>
                  <input
                    type="text"
                    value={editingPipeline.name}
                    onChange={(e) =>
                      setEditingPipeline({ ...editingPipeline, name: e.target.value })
                    }
                    placeholder="Ex: Clínicas & Consultórios de Alto Padrão"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#00D2F6]"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Descrição do Pipeline
                  </label>
                  <input
                    type="text"
                    value={editingPipeline.description}
                    onChange={(e) =>
                      setEditingPipeline({
                        ...editingPipeline,
                        description: e.target.value,
                      })
                    }
                    placeholder="Ex: Focado em triagem de leads, agendamento de consultas presenciais e fechamento."
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300 font-mono text-xs focus:outline-none focus:border-[#00D2F6]"
                  />
                </div>
              </div>

              {/* Editor de Etapas */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00D2F6]">
                      Etapas Operacionais ({editingPipeline.stages.length})
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      (Arraste ou use as setas para reordenar o fluxo)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddStage}
                    className="px-3 py-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Etapa</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {editingPipeline.stages.map((stage, idx) => (
                    <div
                      key={stage.id}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      {/* Posição & Nome */}
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-white/[0.05] flex items-center justify-center text-[10px] font-mono text-slate-400 font-bold shrink-0">
                          {idx + 1}
                        </span>

                        <input
                          type="text"
                          value={stage.name}
                          onChange={(e) =>
                            handleStageChange(idx, 'name', e.target.value.toUpperCase())
                          }
                          placeholder="Nome da etapa"
                          className="flex-1 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-white font-mono text-xs uppercase focus:outline-none focus:border-[#00D2F6]"
                        />
                      </div>

                      {/* Configurações de Probabilidade e Cor */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Probabilidade */}
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-mono text-slate-400">Prob:</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={stage.defaultProb}
                            onChange={(e) =>
                              handleStageChange(
                                idx,
                                'defaultProb',
                                parseInt(e.target.value, 10) || 0
                              )
                            }
                            className="w-14 px-2 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-cyan-400 font-mono text-xs text-center focus:outline-none focus:border-[#00D2F6]"
                          />
                          <span className="text-[10px] font-mono text-slate-500">%</span>
                        </div>

                        {/* Cor do Badge */}
                        <select
                          value={stage.badgeColor}
                          onChange={(e) =>
                            handleStageChange(idx, 'badgeColor', e.target.value)
                          }
                          className="px-2 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-slate-300 font-mono text-[11px] focus:outline-none focus:border-[#00D2F6] cursor-pointer"
                        >
                          {BADGE_COLOR_OPTIONS.map((c) => (
                            <option key={c.value} value={c.value} className="bg-[#091524]">
                              {c.label}
                            </option>
                          ))}
                        </select>

                        {/* Flags de Ganho / Perda */}
                        <label className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!stage.isWon}
                            onChange={(e) =>
                              handleStageChange(idx, 'isWon', e.target.checked)
                            }
                            className="accent-emerald-500 rounded"
                          />
                          <span>Ganho</span>
                        </label>

                        <label className="flex items-center gap-1 text-[10px] font-mono text-rose-400 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!stage.isLost}
                            onChange={(e) =>
                              handleStageChange(idx, 'isLost', e.target.checked)
                            }
                            className="accent-rose-500 rounded"
                          />
                          <span>Perda</span>
                        </label>

                        {/* Reordenar */}
                        <div className="flex items-center gap-1 pl-1 border-l border-white/10">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveStage(idx, 'up')}
                            className="p-1 rounded bg-white/[0.04] hover:bg-white/10 text-slate-400 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            title="Mover para cima"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === editingPipeline.stages.length - 1}
                            onClick={() => handleMoveStage(idx, 'down')}
                            className="p-1 rounded bg-white/[0.04] hover:bg-white/10 text-slate-400 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            title="Mover para baixo"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveStage(idx)}
                            className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                            title="Excluir etapa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* MODO VISUALIZAÇÃO DOS FUNIS EXISTENTES & PRESETS                           */
            /* ========================================================================= */
            <div className="space-y-6">
              {/* Presets Industriais Prontos */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/20 via-cyan-950/20 to-transparent border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#00D2F6]" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                      Presets Industriais Prontos (Ativação em 1 Clique)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetToPresets}
                    className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restaurar Presets</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {INDUSTRY_PIPELINE_PRESETS.map((preset) => (
                    <div
                      key={preset.id}
                      className="p-3 rounded-xl bg-[#07111F]/70 border border-white/10 hover:border-[#00D2F6]/50 transition-all flex flex-col justify-between gap-3 group"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{preset.icon}</span>
                          <h5 className="font-bold text-xs text-white group-hover:text-[#00D2F6] transition-colors truncate">
                            {preset.name.split('(')[0].trim()}
                          </h5>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono line-clamp-2">
                          {preset.description}
                        </p>
                        <div className="mt-2 text-[9px] font-mono text-cyan-400">
                          {preset.stages.length} etapas no fluxo
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCreateFromPreset(preset)}
                        className="w-full py-1.5 rounded-lg bg-white/[0.04] hover:bg-[#00D2F6] hover:text-black border border-white/10 text-[10px] font-mono font-bold text-slate-300 transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Usar este Modelo</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lista de Funis Cadastrados no CRM */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Seus Funis Comerciais Configurados ({pipelines.length})
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      const blank: PipelineDefinition = {
                        id: `pipeline_custom_${Date.now()}`,
                        name: 'Novo Funil Sob Medida',
                        description: 'Funil personalizado de vendas.',
                        icon: '🎯',
                        stages: [
                          {
                            id: 'NOVO',
                            name: 'NOVO LEAD',
                            badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
                            defaultProb: 10,
                          },
                          {
                            id: 'QUALIFICADO',
                            name: 'QUALIFICADO',
                            badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
                            defaultProb: 30,
                          },
                          {
                            id: 'PROPOSTA',
                            name: 'PROPOSTA ENVIADA',
                            badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
                            defaultProb: 70,
                          },
                          {
                            id: 'FECHADO',
                            name: 'CONTRATO FECHADO',
                            badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
                            defaultProb: 100,
                            isWon: true,
                          },
                          {
                            id: 'PERDIDO',
                            name: 'PERDIDO',
                            badgeColor: 'border-rose-500/40 text-rose-400 bg-rose-500/10',
                            defaultProb: 0,
                            isLost: true,
                          },
                        ],
                        createdAt: new Date().toISOString(),
                      };
                      setEditingPipeline(blank);
                      setIsCreatingNew(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/10 text-white border border-white/10 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#00D2F6]" />
                    <span>Criar Funil do Zero</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {pipelines.map((pipeline) => {
                    const isActive = activePipeline.id === pipeline.id;

                    return (
                      <div
                        key={pipeline.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isActive
                            ? 'bg-[#00D2F6]/5 border-[#00D2F6]/40 shadow-[0_0_20px_rgba(0,210,246,0.08)]'
                            : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2.5 mb-1">
                            <span className="text-xl">{pipeline.icon}</span>
                            <h4 className="font-bold text-sm text-white truncate">
                              {pipeline.name}
                            </h4>
                            {isActive && (
                              <span className="px-2 py-0.5 rounded-full bg-[#00D2F6]/20 border border-[#00D2F6]/40 text-[9px] font-mono text-[#00D2F6] font-bold">
                                FUNIL ATIVO NO KANBAN
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 font-mono mb-3">
                            {pipeline.description}
                          </p>

                          {/* Visualizador Rápido das Etapas */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {pipeline.stages.map((st, i) => (
                              <div key={st.id} className="flex items-center gap-1">
                                <span
                                  className={`text-[9px] font-mono px-2 py-0.5 rounded border ${st.badgeColor}`}
                                >
                                  {st.name} ({st.defaultProb}%)
                                </span>
                                {i < pipeline.stages.length - 1 && (
                                  <span className="text-slate-600 text-[10px]">➔</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Ações do Funil */}
                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                          {!isActive && (
                            <button
                              type="button"
                              onClick={() => handleSelectActivePipeline(pipeline)}
                              className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-[#00D2F6]/20 hover:text-[#00D2F6] hover:border-[#00D2F6]/30 border border-white/10 text-xs font-mono text-slate-300 transition-colors cursor-pointer"
                            >
                              Ativar no Kanban
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleStartEdit(pipeline)}
                            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                            title="Editar etapas e configurações"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {pipelines.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeletePipeline(pipeline.id)}
                              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
                              title="Excluir este funil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer do Modal */}
        <div className="p-4 border-t border-white/10 bg-[#0A1624] flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sincronização em tempo real ativa com o Kanban comercial</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/10 text-white transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
