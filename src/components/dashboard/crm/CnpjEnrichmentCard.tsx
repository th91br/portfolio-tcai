import React, { useState } from 'react';
import {
  Building2,
  Users,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import {
  CnpjCompanyData,
  fetchCnpjData,
  formatCnpj,
} from '../../../services/crm/cnpjEnrichmentService';

interface CnpjEnrichmentCardProps {
  initialCnpj?: string;
  initialData?: CnpjCompanyData | null;
  onDataEnriched?: (data: CnpjCompanyData) => void;
  compact?: boolean;
}

export const CnpjEnrichmentCard: React.FC<CnpjEnrichmentCardProps> = ({
  initialCnpj = '',
  initialData = null,
  onDataEnriched,
  compact = false,
}) => {
  const [cnpjInput, setCnpjInput] = useState(initialCnpj);
  const [data, setData] = useState<CnpjCompanyData | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (cnpjToQuery?: string) => {
    const target = cnpjToQuery || cnpjInput;
    if (!target) {
      setError('Insira o CNPJ da empresa para consultar.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await fetchCnpjData(target);
    setLoading(false);

    if (res.success && res.data) {
      setData(res.data);
      setCnpjInput(res.data.cnpjFormatado);
      if (onDataEnriched) {
        onDataEnriched(res.data);
      }
    } else {
      setError(res.error || 'Não foi possível obter dados da Receita Federal.');
    }
  };

  return (
    <div className="bg-[#0A1624] border border-[#16273C] rounded-xl p-4 text-xs space-y-3 font-kanit">
      {/* Cabeçalho da Seção */}
      <div className="flex items-center justify-between border-b border-[#16273C] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#00D2F6]/10 border border-[#00D2F6]/30 flex items-center justify-center text-[#00D2F6]">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-[#F3F5F7] text-sm">Raio-X B2B (Receita Federal)</h4>
            <p className="text-[10px] text-[#94A3B8]">Capital social, sócios e dados cadastrais oficiais</p>
          </div>
        </div>

        {data && (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> {data.situacaoCadastral}
          </span>
        )}
      </div>

      {/* Input de Busca de CNPJ */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="00.000.000/0001-00"
            value={cnpjInput}
            onChange={(e) => setCnpjInput(formatCnpj(e.target.value))}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full bg-[#07111F] border border-[#16273C] focus:border-[#00D2F6] rounded-lg px-3 py-1.5 text-xs text-[#F3F5F7] font-mono placeholder:text-[#64748B] outline-none transition-colors"
          />
        </div>
        <button
          type="button"
          onClick={() => handleSearch()}
          disabled={loading}
          className="px-3 py-1.5 bg-[#00D2F6]/15 hover:bg-[#00D2F6]/25 border border-[#00D2F6]/40 text-[#00D2F6] font-medium rounded-lg flex items-center gap-1.5 transition-all text-xs disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Search className="w-3.5 h-3.5" />
          )}
          <span>{loading ? 'Consultando...' : 'Consultar'}</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px]">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Dados Carregados */}
      {data && (
        <div className="space-y-3 pt-1">
          {/* Razão Social & Nome Fantasia */}
          <div className="bg-[#07111F] p-3 rounded-lg border border-[#16273C]/80 space-y-1">
            <p className="font-semibold text-white text-xs">{data.razaoSocial}</p>
            {data.nomeFantasia && data.nomeFantasia !== data.razaoSocial && (
              <p className="text-[11px] text-[#00D2F6]">Nome Fantasia: {data.nomeFantasia}</p>
            )}
            <p className="text-[10px] text-[#94A3B8] font-mono">
              CNPJ: {data.cnpjFormatado} • Início: {data.dataInicioAtividade}
            </p>
          </div>

          {/* Cards Rápidos: Capital Social & Porte */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#07111F] p-2.5 rounded-lg border border-[#16273C]/80">
              <div className="flex items-center gap-1.5 text-[10px] text-[#94A3B8] mb-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Capital Social</span>
              </div>
              <p className="font-mono font-semibold text-emerald-400 text-xs">
                {data.capitalSocialFormatado}
              </p>
            </div>

            <div className="bg-[#07111F] p-2.5 rounded-lg border border-[#16273C]/80">
              <div className="flex items-center gap-1.5 text-[10px] text-[#94A3B8] mb-1">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Porte da Empresa</span>
              </div>
              <p className="font-mono font-semibold text-[#F3F5F7] text-xs">
                {data.porte}
              </p>
            </div>
          </div>

          {/* Atividade Principal (CNAE) */}
          <div className="bg-[#07111F] p-2.5 rounded-lg border border-[#16273C]/80 space-y-0.5">
            <p className="text-[10px] text-[#94A3B8] uppercase font-mono tracking-wider">CNAE Principal</p>
            <p className="text-[11px] text-[#CBD5E1] line-clamp-2">{data.cnaeFiscalDescricao}</p>
          </div>

          {/* Quadro de Sócios e Administradores (QSA) */}
          {data.socios && data.socios.length > 0 && (
            <div className="bg-[#07111F] p-3 rounded-lg border border-[#16273C]/80 space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] text-[#F3F5F7] font-medium border-b border-[#16273C] pb-1.5">
                <Users className="w-3.5 h-3.5 text-[#00D2F6]" />
                <span>Quadro de Sócios & Decisores (QSA):</span>
                <span className="text-[10px] font-mono text-[#94A3B8] ml-auto">
                  {data.socios.length} sócio(s)
                </span>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {data.socios.map((socio, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-1.5 rounded bg-[#0A1624] border border-[#16273C]/60 text-[11px]"
                  >
                    <div className="space-y-0.5 truncate pr-2">
                      <p className="font-medium text-white truncate">{socio.nome}</p>
                      <p className="text-[10px] text-[#94A3B8] truncate">{socio.qualificacao}</p>
                    </div>
                    {socio.faixaEtaria && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#16273C] text-[#94A3B8] whitespace-nowrap">
                        {socio.faixaEtaria}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Endereço & Contato Fiscal (Se não estiver em modo compacto) */}
          {!compact && (
            <div className="space-y-1 text-[10px] text-[#94A3B8] bg-[#07111F] p-2.5 rounded-lg border border-[#16273C]/80">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#00D2F6] shrink-0 mt-0.5" />
                <span>{data.enderecoCompleto}</span>
              </div>
              {data.telefone && (
                <div className="flex items-center gap-1.5 pt-1">
                  <Phone className="w-3 h-3 text-[#94A3B8]" />
                  <span>{data.telefone}</span>
                </div>
              )}
              {data.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-[#94A3B8]" />
                  <span>{data.email}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
