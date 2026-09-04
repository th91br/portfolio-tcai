import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  ExternalLink,
  RefreshCw,
  Radio,
  Zap,
  AlertCircle,
  Clock,
  Maximize2,
  Minimize2,
  Flame,
  Calendar
} from 'lucide-react';

interface AgentStatus {
  online: boolean;
  totalLeads?: number;
  hotLeads?: number;
  meetingsBooked?: number;
  latencyMs?: number;
}

type CockpitView = 'whatsapp' | 'diagnostics' | 'kanban' | 'calendar';

export const WhatsAppAgentView: React.FC = () => {
  const [status, setStatus] = useState<AgentStatus>({ online: false });
  const [isChecking, setIsChecking] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<CockpitView>('whatsapp');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [detectedPort, setDetectedPort] = useState<number>(3080);

  // Define URL base do agente (localhost:3080 como padrão, com fallback para 3000)
  const agentUrl = typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:${detectedPort}`
    : `http://localhost:${detectedPort}`;

  const checkAgentHealth = async () => {
    setIsChecking(true);
    // Testa portas locais comuns (3080, 3000, 3001, 8080, etc.)
    const candidatePorts = [3080, 3000, 3001, 3002, 8080, 8000, 5000, 8765];
    if (typeof window !== 'undefined' && window.location.port) {
      const p = parseInt(window.location.port, 10);
      if (!isNaN(p) && !candidatePorts.includes(p)) candidatePorts.push(p);
    }

    for (const port of candidatePorts) {
      const targetUrl = typeof window !== 'undefined'
        ? `${window.location.protocol}//${window.location.hostname}:${port}`
        : `http://localhost:${port}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 600);
      const start = performance.now();
      try {
        const res = await fetch(`${targetUrl}/api/analytics/kpis`, {
          method: 'GET',
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        const latency = Math.round(performance.now() - start);
        if (res.ok) {
          const data = await res.json();
          setDetectedPort(port);
          setStatus({
            online: true,
            totalLeads: data.totalLeads ?? 0,
            hotLeads: data.hotLeads ?? 0,
            meetingsBooked: data.meetingsBooked ?? 0,
            latencyMs: latency,
          });
          setIsChecking(false);
          return;
        }
      } catch {
        clearTimeout(timeoutId);
        // tenta a próxima porta candidata
      }
    }

    setStatus({ online: false });
    setIsChecking(false);
  };

  useEffect(() => {
    checkAgentHealth();
    const interval = setInterval(checkAgentHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIframeLoaded(false);
    setIframeKey((k) => k + 1);
    checkAgentHealth();
  };

  const handleSwitchTab = (view: CockpitView) => {
    setActiveTab(view);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ action: 'switchView', view }, '*');
    }
  };

  return (
    <div className={`w-full flex flex-col space-y-3.5 transition-all ${isFullscreen ? 'fixed inset-0 z-50 p-4 bg-[#060D17] overflow-hidden' : ''}`}>
      {/* Top Banner de Telemetria e Integração do Agente */}
      <div className="bg-[#0A1624] border border-[#16273C] rounded-2xl p-4 sm:p-5 flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 shadow-xl relative overflow-hidden flex-shrink-0">
        {/* Glow de fundo */}
        <div className="absolute top-0 left-0 w-64 h-full bg-[#00D2F6]/5 blur-3xl pointer-events-none" />

        {/* Lado Esquerdo: Título & Status Operacional */}
        <div className="flex items-center gap-3.5 z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00D2F6] to-[#015EEF] flex items-center justify-center text-slate-950 font-black shadow-[0_0_20px_rgba(0,210,246,0.3)] flex-shrink-0">
            <MessageSquare className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide uppercase">
                Central WhatsApp & Agente IA Autônomo
              </h2>
              {status.online ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE • {status.latencyMs ?? 5}ms
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-[10px] font-mono text-rose-400 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  CONECTANDO...
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Atendimento, triagem com SLA de 3/7/10 dias, CRM integrado e follow-ups em tempo real.
            </p>
          </div>
        </div>

        {/* Lado Direito: Métricas Rápidas & Ações */}
        <div className="flex items-center gap-2 sm:gap-3 z-10">
          {status.online && (
            <div className="hidden md:flex items-center gap-3 bg-[#07111F] px-3.5 py-2 rounded-xl border border-white/[0.06] text-xs font-mono shadow-inner">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Leads Ativos</span>
                <span className="font-bold text-[#00D2F6]">{status.totalLeads ?? 0}</span>
              </div>
              <div className="w-[1px] h-6 bg-white/[0.08]" />
              <div className="text-center">
                <span className="text-[10px] text-slate-400 block uppercase flex items-center gap-0.5 justify-center">
                  <Flame className="w-3 h-3 text-amber-400 inline" /> Quentes
                </span>
                <span className="font-bold text-amber-400">{status.hotLeads ?? 0}</span>
              </div>
              <div className="w-[1px] h-6 bg-white/[0.08]" />
              <div className="text-center">
                <span className="text-[10px] text-slate-400 block uppercase flex items-center gap-0.5 justify-center">
                  <Calendar className="w-3 h-3 text-purple-400 inline" /> Meets
                </span>
                <span className="font-bold text-purple-400">{status.meetingsBooked ?? 0}</span>
              </div>
            </div>
          )}

          {/* Botão Atualizar */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isChecking}
            className="p-2.5 rounded-xl border border-white/[0.08] bg-[#07111F] hover:bg-white/[0.05] text-slate-300 hover:text-white transition-all cursor-pointer shadow"
            title="Recarregar Agente"
          >
            <RefreshCw className={'w-4 h-4 ' + (isChecking ? 'animate-spin text-[#00D2F6]' : '')} />
          </button>

          {/* Botão Tela Cheia */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2.5 rounded-xl border border-white/[0.08] bg-[#07111F] hover:bg-white/[0.05] text-slate-300 hover:text-white transition-all cursor-pointer shadow"
            title={isFullscreen ? 'Sair do Modo Expandido' : 'Expandir Cockpit em Tela Cheia'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-cyan-400" /> : <Maximize2 className="w-4 h-4 text-slate-300" />}
          </button>

          {/* Botão Abrir em Nova Aba */}
          <a
            href={agentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl border border-[#00D2F6]/30 bg-[#00D2F6]/10 hover:bg-[#00D2F6]/20 text-xs font-mono text-[#00D2F6] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,210,246,0.15)]"
            title="Abrir Central em Nova Aba do Navegador"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nova Aba</span>
          </a>
        </div>
      </div>

      {/* Sub-Navegação Rápida com PostMessage ao Iframe */}
      <div className="bg-[#0A1624] border border-[#16273C] p-2 rounded-2xl flex items-center justify-between gap-2 shadow-lg flex-shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          <button
            type="button"
            onClick={() => handleSwitchTab('whatsapp')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'whatsapp'
                ? 'bg-[#00D2F6] text-slate-950 shadow-[0_0_15px_rgba(0,210,246,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp & Chat</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchTab('diagnostics')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'diagnostics'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,210,246,0.2)]'
                : 'text-slate-400 hover:text-cyan-300 hover:bg-white/[0.05]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Hub de Diagnósticos</span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              HOT
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchTab('kanban')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'kanban'
                ? 'bg-[#00D2F6] text-slate-950 shadow-[0_0_15px_rgba(0,210,246,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Pipeline Kanban</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchTab('calendar')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-[#00D2F6] text-slate-950 shadow-[0_0_15px_rgba(0,210,246,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Agenda & Meets</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-400 pr-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Sincronia Iframe Ativa</span>
        </div>
      </div>

      {/* Container Principal do Iframe Seamless */}
      <div className={`w-full relative bg-[#07111F] rounded-2xl border border-[#00D2F6]/25 shadow-[0_0_35px_rgba(0,210,246,0.1)] overflow-hidden flex-1 min-h-[640px] ${isFullscreen ? 'h-full' : 'h-[calc(100vh-250px)]'}`}>
        {/* Loading Overlay */}
        {!iframeLoaded && (
          <div className="absolute inset-0 bg-[#07111F] flex flex-col items-center justify-center gap-3 z-20">
            <RefreshCw className="w-8 h-8 text-[#00D2F6] animate-spin" />
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
              Carregando Cockpit do WhatsApp & Diagnósticos...
            </p>
          </div>
        )}

        {/* Fallback caso o servidor backend do WhatsApp esteja desligado */}
        {!status.online && !isChecking && (
          <div className="absolute inset-0 bg-[#07111F]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="max-w-md space-y-2">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                Servidor do Agente em Inicialização
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                O cockpit do WhatsApp roda no processo backend da porta <code className="text-[#00D2F6]">3080</code>.
                Execute <code className="text-white bg-white/10 px-1.5 py-0.5 rounded font-mono">iniciar-admin.bat</code> ou <code className="text-white bg-white/10 px-1.5 py-0.5 rounded font-mono">npm run dev:all</code> para iniciar o sistema completo em 1 clique.
              </p>
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00D2F6] to-[#015EEF] text-slate-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Tentar Reconectar
            </button>
          </div>
        )}

        {/* O Iframe Imerge a Central de Comando no Próprio Admin */}
        <iframe
          key={iframeKey}
          ref={iframeRef}
          src={agentUrl}
          title="TCA WhatsApp CRM & Agente IA"
          onLoad={() => setIframeLoaded(true)}
          className="w-full h-full border-none block"
          allow="clipboard-read; clipboard-write; microphone; camera"
        />
      </div>
    </div>
  );
};
