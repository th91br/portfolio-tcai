import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  Smartphone,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Zap,
  BatteryCharging,
  Wifi,
  AlertCircle,
  ExternalLink,
  Lock,
} from 'lucide-react';

interface WhatsAppConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectionChange?: (connected: boolean) => void;
  initialConnected?: boolean;
}

export const WhatsAppConnectModal: React.FC<WhatsAppConnectModalProps> = ({
  isOpen,
  onClose,
  onConnectionChange,
  initialConnected = true,
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(initialConnected);
  const [pairingState, setPairingState] = useState<'idle' | 'scanning' | 'syncing' | 'connected'>(
    initialConnected ? 'connected' : 'idle'
  );
  const [countdown, setCountdown] = useState(30);
  const [qrHash, setQrHash] = useState('tcai-wa-gateway-auth-v3-8820491');
  const [phoneNumber, setPhoneNumber] = useState('+55 11 98844-3210');

  useEffect(() => {
    setIsConnected(initialConnected);
    setPairingState(initialConnected ? 'connected' : 'idle');
  }, [initialConnected]);

  // Contador de renovação do QR Code
  useEffect(() => {
    if (!isOpen || isConnected) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setQrHash(`tcai-wa-auth-${Date.now()}`);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isConnected]);

  if (!isOpen) return null;

  const handleSimulatePairing = () => {
    setPairingState('scanning');
    setTimeout(() => {
      setPairingState('syncing');
      setTimeout(() => {
        setPairingState('connected');
        setIsConnected(true);
        if (onConnectionChange) onConnectionChange(true);
      }, 1500);
    }, 1500);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setPairingState('idle');
    setCountdown(30);
    setQrHash(`tcai-wa-auth-${Date.now()}`);
    if (onConnectionChange) onConnectionChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07111F]/80 backdrop-blur-md font-kanit">
      <div className="relative w-full max-w-xl bg-[#091524] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0A1624]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00D2F6]/10 border border-[#00D2F6]/30 flex items-center justify-center text-[#00D2F6]">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Pareamento WhatsApp Web Gateway
                </h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#00D2F6]/10 text-[#00D2F6] border border-[#00D2F6]/20">
                  SOCKET V3.2
                </span>
              </div>
              <p className="text-xs text-slate-400 font-light">
                Integração segura em tempo real para sincronização de mensagens do agente.
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

        {/* Corpo do Modal */}
        <div className="p-6 space-y-6">
          {isConnected ? (
            /* Estado: Conectado com Sucesso */
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm">Dispositivo Pareado & Operante</h4>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <p className="text-xs font-mono text-emerald-300 mt-0.5">{phoneNumber}</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Conexão criptografada via Signal Protocol. Agente apto a ler e responder leads.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold transition-all cursor-pointer shrink-0"
                >
                  Desconectar
                </button>
              </div>

              {/* Grid de Telemetria do Aparelho */}
              <div className="grid grid-cols-3 gap-3 font-mono">
                <div className="p-3.5 rounded-xl bg-[#0A1624] border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <Wifi className="w-3.5 h-3.5 text-[#00D2F6]" />
                    <span>Socket Latency</span>
                  </div>
                  <p className="text-base font-bold text-white">12ms</p>
                  <p className="text-[10px] text-emerald-400">Excelente</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0A1624] border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Bateria</span>
                  </div>
                  <p className="text-base font-bold text-white">92%</p>
                  <p className="text-[10px] text-slate-400">Carregando</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0A1624] border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>Criptografia</span>
                  </div>
                  <p className="text-base font-bold text-white">E2EE</p>
                  <p className="text-[10px] text-purple-300">Ponta a ponta</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0A1624] border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Sessão Ativa:</span>
                  <span className="font-mono text-white">Chrome 128 (Windows NT)</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Última Sincronização:</span>
                  <span className="font-mono text-emerald-400">Agora mesmo (0s atrás)</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Proteção Anti-Ban:</span>
                  <span className="font-mono text-[#00D2F6]">Ativa (Pacing Inteligente)</span>
                </div>
              </div>
            </div>
          ) : (
            /* Estado: Desconectado / Escanear QR Code */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-white/20 shadow-inner relative group">
                {pairingState === 'scanning' ? (
                  <div className="w-52 h-52 flex flex-col items-center justify-center text-[#07111F] space-y-3">
                    <RefreshCw className="w-10 h-10 animate-spin text-[#00D2F6]" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider">
                      Lendo QR Code...
                    </span>
                  </div>
                ) : pairingState === 'syncing' ? (
                  <div className="w-52 h-52 flex flex-col items-center justify-center text-[#07111F] space-y-3">
                    <Zap className="w-10 h-10 animate-bounce text-emerald-500" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider">
                      Sincronizando Sessão...
                    </span>
                  </div>
                ) : (
                  <>
                    {/* SVG QR Code Estilizado e Nítido */}
                    <svg
                      viewBox="0 0 100 100"
                      className="w-52 h-52 cursor-pointer transition-transform group-hover:scale-[1.02]"
                      onClick={handleSimulatePairing}
                    >
                      {/* Padrões dos cantos do QR Code */}
                      <rect x="5" y="5" width="26" height="26" fill="#07111F" rx="3" />
                      <rect x="9" y="9" width="18" height="18" fill="#FFFFFF" rx="2" />
                      <rect x="13" y="13" width="10" height="10" fill="#07111F" rx="1.5" />

                      <rect x="69" y="5" width="26" height="26" fill="#07111F" rx="3" />
                      <rect x="73" y="9" width="18" height="18" fill="#FFFFFF" rx="2" />
                      <rect x="77" y="13" width="10" height="10" fill="#07111F" rx="1.5" />

                      <rect x="5" y="69" width="26" height="26" fill="#07111F" rx="3" />
                      <rect x="9" y="73" width="18" height="18" fill="#FFFFFF" rx="2" />
                      <rect x="13" y="77" width="10" height="10" fill="#07111F" rx="1.5" />

                      {/* Blocos de Dados simulados */}
                      <rect x="36" y="8" width="6" height="6" fill="#07111F" />
                      <rect x="46" y="8" width="8" height="6" fill="#07111F" />
                      <rect x="58" y="8" width="6" height="6" fill="#07111F" />

                      <rect x="36" y="20" width="10" height="6" fill="#07111F" />
                      <rect x="50" y="20" width="6" height="6" fill="#07111F" />
                      <rect x="60" y="20" width="4" height="6" fill="#07111F" />

                      <rect x="8" y="36" width="6" height="6" fill="#07111F" />
                      <rect x="18" y="36" width="10" height="6" fill="#07111F" />
                      <rect x="32" y="36" width="6" height="6" fill="#07111F" />
                      <rect x="44" y="36" width="12" height="6" fill="#07111F" />
                      <rect x="62" y="36" width="8" height="6" fill="#07111F" />
                      <rect x="74" y="36" width="18" height="6" fill="#07111F" />

                      <rect x="8" y="46" width="12" height="6" fill="#07111F" />
                      <rect x="24" y="46" width="6" height="6" fill="#07111F" />
                      <rect x="34" y="46" width="6" height="6" fill="#07111F" />
                      <rect x="60" y="46" width="14" height="6" fill="#07111F" />
                      <rect x="78" y="46" width="14" height="6" fill="#07111F" />

                      <rect x="8" y="56" width="6" height="6" fill="#07111F" />
                      <rect x="18" y="56" width="8" height="6" fill="#07111F" />
                      <rect x="30" y="56" width="16" height="6" fill="#07111F" />
                      <rect x="52" y="56" width="10" height="6" fill="#07111F" />
                      <rect x="66" y="56" width="8" height="6" fill="#07111F" />
                      <rect x="80" y="56" width="12" height="6" fill="#07111F" />

                      <rect x="36" y="68" width="10" height="6" fill="#07111F" />
                      <rect x="50" y="68" width="16" height="6" fill="#07111F" />
                      <rect x="70" y="68" width="10" height="6" fill="#07111F" />
                      <rect x="84" y="68" width="8" height="6" fill="#07111F" />

                      <rect x="36" y="80" width="8" height="12" fill="#07111F" />
                      <rect x="48" y="80" width="10" height="6" fill="#07111F" />
                      <rect x="62" y="80" width="14" height="6" fill="#07111F" />
                      <rect x="80" y="80" width="12" height="12" fill="#07111F" />
                      <rect x="50" y="90" width="8" height="5" fill="#07111F" />
                      <rect x="62" y="90" width="10" height="5" fill="#07111F" />

                      {/* Emblema Central */}
                      <rect x="42" y="42" width="16" height="16" fill="#00D2F6" rx="3" />
                      <path
                        d="M47 48 L53 48 M47 52 L51 52"
                        stroke="#07111F"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>

                    <div className="mt-2 text-center">
                      <span className="text-[10px] font-mono text-slate-500">
                        Expira em: <strong className="text-slate-900">{countdown}s</strong>
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Instruções passo a passo */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#00D2F6]" />
                  <span>Como Conectar seu Aparelho:</span>
                </h4>

                <ol className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-white/10 text-white font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <span>Abra o <strong>WhatsApp</strong> no seu celular.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-white/10 text-white font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      Toque em <strong>Mais opções</strong> (Android) ou <strong>Configurações</strong> (iPhone).
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-white/10 text-white font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <span>Toque em <strong>Aparelhos conectados</strong> e depois em <strong>Conectar um aparelho</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-white/10 text-white font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      4
                    </span>
                    <span>Aponte a câmera do seu celular para este código QR ao lado.</span>
                  </li>
                </ol>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSimulatePairing}
                    className="w-full py-2.5 rounded-xl bg-[#00D2F6] hover:bg-[#00B4D8] text-[#07111F] text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#00D2F6]/20 transition-all cursor-pointer"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Parear Agora (Simular Leitura)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Rodapé de Segurança e Blindagem */}
          <div className="p-3.5 rounded-xl bg-[#07111F] border border-white/5 flex items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[11px]">
                Protocolo Baileys / Signal Oficial. As chaves privadas nunca saem do seu dispositivo.
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest shrink-0">
              Zero Storage
            </span>
          </div>
        </div>

        {/* Rodapé de Ações */}
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
