import React, { useRef, useEffect, useState } from 'react';
import {
  Activity,
  Zap,
  ShieldCheck,
  Radio,
  Cpu,
  RefreshCw,
  Layers,
  Database,
  QrCode,
  DollarSign,
  CheckCircle2,
} from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  subtitle: string;
  role: string;
  x: number;
  y: number;
  color: string;
  accentHex: string;
  status: 'ONLINE' | 'PROCESSANDO' | 'STANDBY';
  latencyMs: number;
  throughput: string;
  icon: string;
}

interface GraphEdge {
  from: string;
  to: string;
  label: string;
}

interface PulseParticle {
  fromId: string;
  toId: string;
  progress: number;
  speed: number;
  color: string;
}

export const AgentNetworkGraph: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('sdr_triage');
  const [activePacketsCount, setActivePacketsCount] = useState<number>(42);
  const [globalUptime, setGlobalUptime] = useState<string>('99.98%');
  const [simulatedPulse, setSimulatedPulse] = useState(false);

  // Nós Executivos de Precisão
  const nodes: GraphNode[] = [
    {
      id: 'whatsapp_socket',
      label: 'Canal WhatsApp & Socket',
      subtitle: 'Gateway Oficial de Mensagens',
      role: 'Entrada / Saída em Tempo Real',
      x: 0.18,
      y: 0.5,
      color: 'text-emerald-400',
      accentHex: '#10B981',
      status: 'ONLINE',
      latencyMs: 18,
      throughput: '14 msg/min',
      icon: '💬',
    },
    {
      id: 'sentinel_sre',
      label: 'Sentinela Cyber SRE',
      subtitle: 'Firewall Layer-7 & Anti-Jailbreak',
      role: 'Auditoria de Segurança Contínua',
      x: 0.38,
      y: 0.22,
      color: 'text-cyan-400',
      accentHex: '#00D2F6',
      status: 'ONLINE',
      latencyMs: 14,
      throughput: '100% inspecionado',
      icon: '🛡️',
    },
    {
      id: 'sdr_triage',
      label: 'SDR Executivo (Thiago)',
      subtitle: 'Triagem & Voz Humanizada 1ª Pessoa',
      role: 'Linha de Frente & Qualificação',
      x: 0.5,
      y: 0.5,
      color: 'text-white',
      accentHex: '#F3F5F7',
      status: 'ONLINE',
      latencyMs: 65,
      throughput: '7 leads ativos',
      icon: '👔',
    },
    {
      id: 'knowledge_hub',
      label: 'Base RAG & Acervo',
      subtitle: 'Catálogos, Preços & Políticas',
      role: 'Memória Anti-Alucinação',
      x: 0.62,
      y: 0.22,
      color: 'text-indigo-400',
      accentHex: '#818CF8',
      status: 'ONLINE',
      latencyMs: 24,
      throughput: '3.550 tokens',
      icon: '📚',
    },
    {
      id: 'sales_copilot',
      label: 'TCA Sales Copilot',
      subtitle: 'Inteligência Comercial & Fechamento',
      role: 'Margens & Quebra de Objeções',
      x: 0.78,
      y: 0.5,
      color: 'text-amber-400',
      accentHex: '#FBBF24',
      status: 'ONLINE',
      latencyMs: 82,
      throughput: '4 propostas ativas',
      icon: '📊',
    },
    {
      id: 'pix_settlement',
      label: 'Motor de Cobrança PIX',
      subtitle: 'BR Code EMVCo & Baixa Automática',
      role: 'Conciliação Bancária Instantânea',
      x: 0.5,
      y: 0.82,
      color: 'text-emerald-400',
      accentHex: '#34D399',
      status: 'STANDBY',
      latencyMs: 45,
      throughput: 'Baixa em 3s',
      icon: '⚡',
    },
  ];

  // Arestas de Conexão de Dados
  const edges: GraphEdge[] = [
    { from: 'whatsapp_socket', to: 'sentinel_sre', label: 'Inspeção L7' },
    { from: 'sentinel_sre', to: 'sdr_triage', label: 'Payload Seguro' },
    { from: 'sdr_triage', to: 'knowledge_hub', label: 'Consulta RAG' },
    { from: 'knowledge_hub', to: 'sdr_triage', label: 'Contexto Oficial' },
    { from: 'sdr_triage', to: 'sales_copilot', label: 'Sinal Comercial' },
    { from: 'sales_copilot', to: 'pix_settlement', label: 'Gera Sinal PIX' },
    { from: 'pix_settlement', to: 'sdr_triage', label: 'Baixa Kanban' },
    { from: 'sdr_triage', to: 'whatsapp_socket', label: 'Despacho Final' },
  ];

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[2];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = Math.max(380, canvas.parentElement?.clientHeight || 420));

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = Math.max(380, canvas.parentElement.clientHeight || 420);
    };

    window.addEventListener('resize', handleResize);

    // Partículas de fluxo de dados
    const particles: PulseParticle[] = [
      { fromId: 'whatsapp_socket', toId: 'sentinel_sre', progress: 0.1, speed: 0.008, color: '#00D2F6' },
      { fromId: 'sentinel_sre', toId: 'sdr_triage', progress: 0.4, speed: 0.009, color: '#10B981' },
      { fromId: 'sdr_triage', toId: 'knowledge_hub', progress: 0.2, speed: 0.007, color: '#818CF8' },
      { fromId: 'knowledge_hub', toId: 'sdr_triage', progress: 0.7, speed: 0.008, color: '#818CF8' },
      { fromId: 'sdr_triage', toId: 'sales_copilot', progress: 0.5, speed: 0.006, color: '#FBBF24' },
      { fromId: 'sales_copilot', toId: 'pix_settlement', progress: 0.3, speed: 0.007, color: '#34D399' },
      { fromId: 'sdr_triage', toId: 'whatsapp_socket', progress: 0.8, speed: 0.009, color: '#00D2F6' },
    ];

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Fundo suave de grade suíça (Grid lines de 1px com espaçamento de 40px)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Mapeamento das coordenadas reais dos nós em pixels
      const nodeCoords: Record<string, { x: number; y: number }> = {};
      nodes.forEach((node) => {
        nodeCoords[node.id] = {
          x: node.x * width,
          y: node.y * height,
        };
      });

      // 1. Desenhar Arestas (Linhas finas com gradiente e flechas sutis)
      edges.forEach((edge) => {
        const from = nodeCoords[edge.from];
        const to = nodeCoords[edge.to];
        if (!from || !to) return;

        const isSelectedEdge = edge.from === selectedNodeId || edge.to === selectedNodeId;

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = isSelectedEdge
          ? 'rgba(0, 210, 246, 0.35)'
          : 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = isSelectedEdge ? 1.5 : 1;
        ctx.setLineDash(isSelectedEdge ? [] : [4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // 2. Desenhar Partículas de Dados Trafegando
      particles.forEach((p) => {
        const from = nodeCoords[p.fromId];
        const to = nodeCoords[p.toId];
        if (!from || !to) return;

        p.progress += p.speed;
        if (p.progress >= 1) {
          p.progress = 0;
        }

        const curX = from.x + (to.x - from.x) * p.progress;
        const curY = from.y + (to.y - from.y) * p.progress;

        // Ponto de luz com brilho suave
        ctx.beginPath();
        ctx.arc(curX, curY, 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 3. Desenhar Nós Executivos (Estilo Círculo de Precisão com anel concêntrico)
      nodes.forEach((node) => {
        const pos = nodeCoords[node.id];
        if (!pos) return;

        const isSelected = node.id === selectedNodeId;
        const radius = isSelected ? 26 : 22;

        // Pulsação sutil no nó ativo
        const pulse = Math.sin(tick * 0.05) * 2;

        // Anel Externo de Precisão
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius + 4 + (isSelected ? pulse : 0), 0, Math.PI * 2);
        ctx.strokeStyle = isSelected ? node.accentHex : 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Corpo do Nó
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#07111F';
        ctx.fill();
        ctx.strokeStyle = isSelected ? node.accentHex : 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.stroke();

        // Texto / Emoji do Ícone
        ctx.font = `${isSelected ? '16px' : '14px'} monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(node.icon, pos.x, pos.y);

        // Rótulo Inferior do Nó
        ctx.font = 'bold 10px Kanit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = isSelected ? node.accentHex : 'rgba(255, 255, 255, 0.85)';
        ctx.fillText(node.label, pos.x, pos.y + radius + 15);

        // Subtítulo de latência
        ctx.font = '9px monospace';
        ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
        ctx.fillText(`${node.latencyMs}ms`, pos.x, pos.y + radius + 27);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Tratamento de clique no Canvas para selecionar nós
    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      nodes.forEach((node) => {
        const nodeX = node.x * width;
        const nodeY = node.y * height;
        const dist = Math.hypot(clickX - nodeX, clickY - nodeY);
        if (dist <= 35) {
          setSelectedNodeId(node.id);
        }
      });
    };

    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [selectedNodeId]);

  const handleTriggerTestPulse = () => {
    setSimulatedPulse(true);
    setActivePacketsCount((prev) => prev + 12);
    setTimeout(() => setSimulatedPulse(false), 2000);
  };

  return (
    <div className="space-y-4 font-kanit">
      {/* Barra Superior de Telemetria e Controles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#091524] border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00D2F6]/10 border border-[#00D2F6]/30 flex items-center justify-center text-[#00D2F6]">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 uppercase">
                Swiss Data Architecture • 60 FPS
              </span>
              <span className="text-xs text-slate-400 font-mono">Uptime: {globalUptime}</span>
            </div>
            <h3 className="text-base font-bold text-white uppercase tracking-tight mt-0.5">
              Telemetria & Grafo Neural da Empresa
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300">
            Pacotes: <strong className="text-cyan-400">{activePacketsCount} req/m</strong>
          </div>

          <button
            type="button"
            onClick={handleTriggerTestPulse}
            disabled={simulatedPulse}
            className="px-3.5 py-1.5 rounded-xl bg-[#00D2F6]/10 hover:bg-[#00D2F6]/20 text-[#00D2F6] border border-[#00D2F6]/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-[#00D2F6]/10 disabled:opacity-50"
          >
            <Zap className={`w-3.5 h-3.5 ${simulatedPulse ? 'animate-spin text-amber-400' : ''}`} />
            <span>{simulatedPulse ? 'Disparando Pulso...' : 'Simular Tráfego'}</span>
          </button>
        </div>
      </div>

      {/* Canvas Interativo do Grafo */}
      <div className="relative w-full rounded-2xl bg-[#07111F] border border-white/10 overflow-hidden shadow-2xl min-h-[380px] sm:min-h-[420px]">
        <canvas ref={canvasRef} className="w-full h-full block cursor-pointer" />

        {/* Legenda Flutuante Discreta */}
        <div className="absolute bottom-3 left-3 bg-[#0A1624]/90 backdrop-blur-md border border-white/10 px-3 py-2 rounded-xl text-[10px] font-mono text-slate-400 flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> WhatsApp
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" /> Segurança L7
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-indigo-400" /> RAG Acervo
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Vendas
          </span>
        </div>
      </div>

      {/* Dossiê do Nó Selecionado */}
      <div className="p-4 rounded-2xl bg-[#091524] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center text-2xl"
            style={{ borderColor: selectedNode.accentHex }}
          >
            {selectedNode.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                {selectedNode.role}
              </span>
              <span
                className="px-2 py-0.2 rounded text-[9px] font-bold uppercase"
                style={{
                  backgroundColor: `${selectedNode.accentHex}20`,
                  color: selectedNode.accentHex,
                  border: `1px solid ${selectedNode.accentHex}40`,
                }}
              >
                {selectedNode.status}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mt-0.5">{selectedNode.label}</h4>
            <p className="text-[11px] text-slate-400 font-sans">{selectedNode.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0 border-white/5">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block uppercase">Latência</span>
            <span className="text-white font-bold">{selectedNode.latencyMs} ms</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block uppercase">Vazão</span>
            <span className="text-[#00D2F6] font-bold">{selectedNode.throughput}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
