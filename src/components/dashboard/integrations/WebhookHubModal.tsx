import React, { useState } from 'react';
import {
  X,
  Radio,
  Copy,
  Check,
  Zap,
  Play,
  RefreshCw,
  ShieldCheck,
  ExternalLink,
  Layers,
  Code2,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  WebhookConfig,
  WebhookLogEntry,
  getWebhookConfig,
  saveWebhookConfig,
  rotateWebhookToken,
  getWebhookLogs,
  processInboundWebhook,
} from '../../../services/integrations/webhookService';

interface WebhookHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadCreated?: () => void;
}

export const WebhookHubModal: React.FC<WebhookHubModalProps> = ({
  isOpen,
  onClose,
  onLeadCreated,
}) => {
  const [config, setConfig] = useState<WebhookConfig>(getWebhookConfig());
  const [logs, setLogs] = useState<WebhookLogEntry[]>(getWebhookLogs());
  const [copied, setCopied] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'meta' | 'google' | 'elementor'>('meta');
  const [activeLogPayload, setActiveLogPayload] = useState<Record<string, any> | null>(null);

  if (!isOpen) return null;

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://portfolio-tcai.vercel.app';
  const webhookUrl = `${baseUrl}/api/webhooks/lead?token=${config.token}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRotateToken = () => {
    if (confirm('Tem certeza que deseja renovar o token? A URL anterior deixará de funcionar.')) {
      const newToken = rotateWebhookToken();
      setConfig({ ...config, token: newToken });
    }
  };

  const handleToggleActive = () => {
    const updated = { ...config, isActive: !config.isActive };
    saveWebhookConfig(updated);
    setConfig(updated);
  };

  const handleSimulateMetaAds = async () => {
    setIsSimulating(true);
    const mockMetaPayload = {
      ad_id: 'meta_ad_889922',
      ad_name: 'Criativo 03 - VSL Conversão Rápida',
      campaign_name: 'Campanha Fundo de Funil - São Paulo',
      form_id: 'form_lead_ads_tcai',
      full_name: 'Dra. Beatriz Menezes',
      email: 'beatriz.menezes@clinicasorriso.com.br',
      phone_number: '+55 11 98765-4321',
      empresa: 'Instituto Menezes Odontologia',
      interesse: 'Automação de Atendimento WhatsApp e Sistema de Agendamentos',
    };

    const res = await processInboundWebhook(mockMetaPayload, 'meta_ads');
    setIsSimulating(false);
    setLogs(getWebhookLogs());
    setConfig(getWebhookConfig());

    if (res.success && onLeadCreated) {
      onLeadCreated();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#07111F]/80 backdrop-blur-md font-kanit">
      <div className="relative w-full max-w-4xl bg-[#091524] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Cabeçalho Executivo */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0A1624]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00D2F6]/10 border border-[#00D2F6]/30 flex items-center justify-center text-[#00D2F6]">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Hub de Webhooks & Entrada de Leads em 1 Clique
                </h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#00D2F6]/15 text-[#00D2F6] border border-[#00D2F6]/30 uppercase">
                  Universal Gateway v3.0
                </span>
              </div>
              <p className="text-xs text-slate-400 font-light">
                Pluge Meta Ads (Instagram/Facebook), Google Ads, Elementor e formulários externos diretamente no funil e na IA.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Modal com Scroll */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Card Principal: URL do Webhook Inbound */}
          <div className="p-5 rounded-2xl bg-[#0A1624] border border-white/10 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  Sua URL de Webhook Oficial (POST Inbound):
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  SSL / HTTPS ATIVO
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleActive}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    config.isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {config.isActive ? 'ENDPOINT ATIVO' : 'PAUSADO'}
                </button>
              </div>
            </div>

            {/* Input com botão Copiar */}
            <div className="flex items-center gap-2 bg-[#07111F] p-1.5 rounded-xl border border-white/10">
              <input
                type="text"
                readOnly
                value={webhookUrl}
                className="flex-1 bg-transparent px-3 py-1 text-xs font-mono text-cyan-300 focus:outline-none select-all"
              />
              <button
                type="button"
                onClick={handleCopyUrl}
                className="px-3 py-1.5 rounded-lg bg-[#00D2F6] hover:bg-[#00B4D8] text-[#07111F] text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar URL'}</span>
              </button>

              <button
                type="button"
                onClick={handleRotateToken}
                title="Renovar Token de Segurança"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
              <span>Leads Recebidos no Gateway: <strong className="text-white">{config.totalReceived}</strong></span>
              <span>Última Transmissão: <strong className="text-emerald-400">{config.lastWebhookAt ? new Date(config.lastWebhookAt).toLocaleTimeString() : 'Aguardando'}</strong></span>
            </div>
          </div>

          {/* Simulador Interativo de Disparo (Meta Ads / Instagram) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#00D2F6]/10 to-purple-500/10 border border-[#00D2F6]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00D2F6]" />
                <h4 className="font-bold text-white text-sm">Simulador de Teste ao Vivo</h4>
              </div>
              <p className="text-xs text-slate-300 max-w-xl font-light">
                Dispare um payload real de anúncio do <strong>Instagram Lead Ads</strong> agora mesmo para ver o lead entrar no Kanban, receber pontuação de score e ser atribuído ao vendedor.
              </p>
            </div>

            <button
              type="button"
              disabled={isSimulating}
              onClick={handleSimulateMetaAds}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D2F6] to-[#015EEF] hover:opacity-95 text-[#07111F] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#00D2F6]/20 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Play className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Processando...' : 'Disparar Lead Teste (Meta)'}</span>
            </button>
          </div>

          {/* Guias Rápidos de Conexão em 1 Clique */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Instruções de Conexão por Provedor:
            </h4>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {(['meta', 'google', 'elementor'] as const).map((prov) => (
                <button
                  key={prov}
                  type="button"
                  onClick={() => setSelectedProvider(prov)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                    selectedProvider === prov
                      ? 'bg-[#00D2F6] text-[#07111F]'
                      : 'bg-[#0A1624] text-slate-400 border border-white/5 hover:text-white'
                  }`}
                >
                  {prov === 'meta' && 'Meta Ads (Insta/Face)'}
                  {prov === 'google' && 'Google Ads Leads'}
                  {prov === 'elementor' && 'Elementor / Webflow / Forms'}
                </button>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-[#0A1624] border border-white/5 text-xs text-slate-300 leading-relaxed font-sans">
              {selectedProvider === 'meta' && (
                <ol className="list-decimal list-inside space-y-1.5">
                  <li>Acesse o <strong>Gerenciador de Anúncios da Meta</strong> ➔ Ferramentas ➔ Leads.</li>
                  <li>Em <strong>Webhooks</strong> ou via Zapier/Make/Webhook nativo, cole a URL acima no campo <em>Callback URL</em>.</li>
                  <li>Nosso normalizador mapeará automaticamente <code>full_name</code>, <code>phone_number</code> e <code>email</code>.</li>
                  <li>O lead entra no Kanban com tag de anúncio e o motor de IA dispara o atendimento imediato no WhatsApp.</li>
                </ol>
              )}
              {selectedProvider === 'google' && (
                <ol className="list-decimal list-inside space-y-1.5">
                  <li>Na sua campanha do <strong>Google Ads</strong>, crie uma extensão de Formulário de Lead.</li>
                  <li>Nas opções de webhook do formulário, cole a URL acima e use a chave de autenticação informada.</li>
                  <li>Os leads de pesquisa com alta intenção de compra caem direto na etapa de Qualificação por IA.</li>
                </ol>
              )}
              {selectedProvider === 'elementor' && (
                <ol className="list-decimal list-inside space-y-1.5">
                  <li>No seu formulário do Elementor / WordPress, vá em <strong>Actions After Submit</strong> e adicione <strong>Webhook</strong>.</li>
                  <li>Cole a URL acima no campo Webhook URL. Pronto!</li>
                  <li>Qualquer campo com nome <code>nome</code>, <code>telefone</code>, <code>whatsapp</code> ou <code>empresa</code> é reconhecido automaticamente.</li>
                </ol>
              )}
            </div>
          </div>

          {/* Log de Auditoria de Webhooks Recentes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Histórico de Transmissões & Auditoria ({logs.length}):
              </h4>
              <span className="text-[10px] font-mono text-slate-400">
                JSON Normalizado Automaticamente
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-[#0A1624] border border-white/5 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-white">{log.parsedData.name}</strong>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#00D2F6] border border-white/10">
                          {log.provider.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {log.parsedData.phone} • {log.parsedData.company || 'Empresa'} • Atribuído a: <span className="text-emerald-400">{log.assignedRepName || 'Vendedor'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500">{log.receivedAt}</span>
                    <button
                      type="button"
                      onClick={() => setActiveLogPayload(log.rawPayload)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Ver JSON bruto recebido"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Modal Viewer de JSON Bruto */}
          {activeLogPayload && (
            <div className="p-4 rounded-xl bg-[#07111F] border border-[#00D2F6]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#00D2F6] uppercase">Payload JSON Bruto Recebido:</span>
                <button
                  type="button"
                  onClick={() => setActiveLogPayload(null)}
                  className="text-xs font-mono text-slate-400 hover:text-white"
                >
                  Fechar JSON
                </button>
              </div>
              <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto p-3 bg-black/40 rounded-lg max-h-40">
                {JSON.stringify(activeLogPayload, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="p-4 border-t border-white/10 bg-[#0A1624] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
