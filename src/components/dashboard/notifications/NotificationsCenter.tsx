import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  TrendingUp,
  XCircle,
  ExternalLink,
  CheckCheck,
} from 'lucide-react';
import {
  NotificationItem,
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../../lib/supabase';

interface NotificationsCenterProps {
  onSelectLead?: (leadId: string) => void;
  refreshTrigger?: number;
}

export const NotificationsCenter: React.FC<NotificationsCenterProps> = ({
  onSelectLead,
  refreshTrigger = 0,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Falha ao carregar notificações:', err);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [refreshTrigger]);

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n))
    );
  };

  const handleMarkAllAsRead = async () => {
    setLoading(true);
    await markAllNotificationsRead();
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
    );
    setLoading(false);
  };

  const handleNotificationClick = (n: NotificationItem) => {
    if (!n.is_read) {
      handleMarkAsRead(n.id);
    }
    if (n.lead_id && onSelectLead) {
      onSelectLead(n.lead_id);
      setIsOpen(false);
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.is_read;
    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alta_prioridade':
        return <Sparkles className="w-4 h-4 text-[#00D2F6] animate-pulse" />;
      case 'fechado':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'followup_atrasado':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'followup_hoje':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'proposta':
        return <TrendingUp className="w-4 h-4 text-purple-400" />;
      case 'perdido':
        return <XCircle className="w-4 h-4 text-slate-400" />;
      default:
        return <Bell className="w-4 h-4 text-[#00D2F6]" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botão do Sino */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
          isOpen
            ? 'bg-[#00D2F6]/20 border-[#00D2F6] text-[#00D2F6]'
            : 'bg-white/[0.04] border-white/10 hover:border-white/20 text-slate-300 hover:text-white'
        }`}
        title="Central de Notificações"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-mono font-black animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0B1522] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 overflow-hidden font-kanit">
          {/* Cabeçalho */}
          <div className="px-4 py-3 bg-white/[0.02] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Notificações
              </span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#00D2F6]/10 border border-[#00D2F6]/30 text-[10px] font-mono text-[#00D2F6] font-bold">
                  {unreadCount} não lida{unreadCount > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                disabled={loading}
                className="text-[11px] font-mono text-slate-400 hover:text-[#00D2F6] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Ler todas</span>
              </button>
            )}
          </div>

          {/* Abas de Filtro */}
          <div className="flex border-b border-white/[0.06] px-4 py-1.5 gap-2 bg-[#08101C]">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-white/10 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todas ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                filter === 'unread'
                  ? 'bg-[#00D2F6]/20 text-[#00D2F6] font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Não lidas ({unreadCount})
            </button>
          </div>

          {/* Lista de Notificações */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-white/[0.04]">
            {filtered.length === 0 ? (
              <div className="px-4 py-10 text-center text-slate-500 text-xs font-mono">
                Nenhuma notificação {filter === 'unread' ? 'não lida' : ''}.
              </div>
            ) : (
              filtered.map((n) => {
                const isHighPriority = n.type === 'alta_prioridade';
                return (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`px-4 py-3 hover:bg-white/[0.04] transition-colors cursor-pointer flex gap-3 items-start ${
                      !n.is_read ? 'bg-[#00D2F6]/[0.03]' : 'opacity-75'
                    } ${isHighPriority ? 'border-l-2 border-l-[#00D2F6]' : ''}`}
                  >
                    <div className="mt-0.5 shrink-0 p-1.5 rounded-lg bg-white/[0.05] border border-white/10">
                      {getTypeIcon(n.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span
                          className={`text-xs font-bold uppercase truncate ${
                            isHighPriority ? 'text-[#00D2F6]' : 'text-white'
                          }`}
                        >
                          {n.title}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 whitespace-nowrap">
                          {new Date(n.created_at).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 font-light line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>

                      <div className="mt-1.5 flex items-center justify-between">
                        {n.lead_id ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#00D2F6] hover:underline">
                            <span>Ver lead</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        ) : (
                          <span />
                        )}

                        {!n.is_read && (
                          <button
                            type="button"
                            onClick={(e) => handleMarkAsRead(n.id, e)}
                            className="text-[10px] font-mono text-slate-400 hover:text-white px-2 py-0.5 rounded hover:bg-white/10 transition-colors"
                          >
                            Marcar lida
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
