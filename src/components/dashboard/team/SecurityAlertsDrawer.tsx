import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Lock,
  Zap,
  Activity,
  Send,
  Trash2,
} from 'lucide-react';
import { SecurityIncident, SentinelHealthMetrics } from '../../../services/agent/subagentTypes';
import {
  getSecurityIncidents,
  getSentinelMetrics,
  resolveSecurityIncident,
  clearSecurityIncidents,
  generateAdminAlertWhatsAppUrl,
} from '../../../services/security/cyberSentinelService';

interface SecurityAlertsDrawerProps {
  onClose: () => void;
  adminPhone?: string;
}

export const SecurityAlertsDrawer: React.FC<SecurityAlertsDrawerProps> = ({
  onClose,
  adminPhone = '+55 (47) 99999-9999',
}) => {
  const [incidents, setIncidents] = useState<SecurityIncident[]>(getSecurityIncidents());
  const [metrics, setMetrics] = useState<SentinelHealthMetrics>(getSentinelMetrics());

  const handleResolve = (id: string) => {
    resolveSecurityIncident(id);
    setIncidents(getSecurityIncidents());
  };

  const handleClearAll = () => {
    if (confirm('Deseja limpar todos os registros de incidentes de segurança?')) {
      clearSecurityIncidents();
      setIncidents([]);
    }
  };

  const handleDispatchTestAlert = () => {
    const url = generateAdminAlertWhatsAppUrl(
      adminPhone,
      'Teste Operacional do Sentinela SRE',
      'Disparo de teste para validação de canal de contingência e monitoramento proativo 24/7.'
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden flex justify-end font-kanit">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-xl h-full bg-[#07111F] border-l border-white/10 shadow-2xl z-10 flex flex-col overflow-hidden">
        {/* Cabeçalho */}
        <div className="p-5 sm:p-6 bg-[#0A1624] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase">
                  Sentinela 24/7 Ativo
                </span>
                <span className="text-[10px] font-mono text-[#94A3B8]">SRE & Cyber Shield</span>
              </div>
              <h2 className="font-black text-lg text-white uppercase tracking-tight">
                Auditoria de Segurança & Saúde
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/[0.05] hover:bg-white/10 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Métricas do Sentinela */}
        <div className="p-5 bg-[#091524] border-b border-white/10 shrink-0 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase block">Uptime</span>
              <span className="text-base font-bold text-emerald-400">{metrics.uptimePercentage}%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase block">Latência</span>
              <span className="text-base font-bold text-[#00D2F6]">{metrics.avgLatencyMs}ms</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase block">Inspeções</span>
              <span className="text-base font-bold text-white">{metrics.totalInspections}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase block">Bloqueadas</span>
              <span className="text-base font-bold text-amber-400">{metrics.blockedThreats}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Firewall Anti-Jailbreak: <strong>Operando em Camada 7</strong></span>
            </div>
            <button
              type="button"
              onClick={handleDispatchTestAlert}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span>Testar Alerta no WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Lista de Incidentes e Logs */}
        <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Ocorrências & Tentativas Bloqueadas ({incidents.length})
            </h4>
            {incidents.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-[11px] font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Limpar Histórico</span>
              </button>
            )}
          </div>

          {incidents.length === 0 ? (
            <div className="text-center py-16 rounded-2xl bg-[#091524] border border-white/10 p-6 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto opacity-70" />
              <p className="text-sm font-semibold text-white">Nenhuma ameaça detectada no momento</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Todas as requisições de WhatsApp e chamadas de API estão íntegras e em conformidade com as políticas do sistema.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {incidents.map((inc) => (
                <div
                  key={inc.id}
                  className={`p-4 rounded-xl bg-[#091524] border transition-all space-y-2 ${
                    inc.resolved ? 'border-white/5 opacity-75' : 'border-amber-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                          inc.severity === 'high' || inc.severity === 'critical'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {inc.severity}
                      </span>
                      <h5 className="font-bold text-white text-xs">{inc.title}</h5>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(inc.timestamp).toLocaleTimeString('pt-BR')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{inc.description}</p>

                  {inc.payloadSnippet && (
                    <div className="p-2 rounded bg-black/40 border border-white/5 text-[11px] font-mono text-amber-300/90 break-all">
                      Payload: "{inc.payloadSnippet}"
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px] font-mono">
                    <span className="text-emerald-400">
                      Ação: <strong>{inc.actionTaken.toUpperCase()}</strong>
                    </span>

                    {!inc.resolved ? (
                      <button
                        type="button"
                        onClick={() => handleResolve(inc.id)}
                        className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                      >
                        Marcar como Resolvido
                      </button>
                    ) : (
                      <span className="text-slate-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Resolvido
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
