/**
 * TCAI — Serviço de Enriquecimento de Dados B2B via BrasilAPI (CNPJ)
 * Consulta gratuita e em tempo real de dados cadastrais, capital social e quadro societário (QSA).
 */

export interface SocioQSA {
  nome: string;
  qualificacao: string;
  faixaEtaria?: string;
  dataEntrada?: string;
}

export interface CnpjCompanyData {
  cnpj: string;
  cnpjFormatado: string;
  razaoSocial: string;
  nomeFantasia: string;
  situacaoCadastral: string;
  dataInicioAtividade: string;
  cnaeFiscal: string;
  cnaeFiscalDescricao: string;
  capitalSocial: number;
  capitalSocialFormatado: string;
  porte: string;
  naturezaJuridica: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  enderecoCompleto: string;
  telefone: string;
  email: string;
  socios: SocioQSA[];
  consultadoEm: string;
}

const CACHE_KEY_PREFIX = 'tcai_cnpj_cache_';

export function formatCnpj(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 14);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
}

export function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Consulta dados fiscais e societários de uma empresa pelo CNPJ via BrasilAPI.
 */
export async function fetchCnpjData(rawCnpj: string): Promise<{ success: boolean; data?: CnpjCompanyData; error?: string }> {
  const clean = rawCnpj.replace(/\D/g, '');

  if (clean.length !== 14) {
    return { success: false, error: 'O CNPJ deve conter exatamente 14 dígitos numéricos.' };
  }

  // 1. Verificar cache local
  const cacheKey = `${CACHE_KEY_PREFIX}${clean}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed: CnpjCompanyData = JSON.parse(cached);
      return { success: true, data: parsed };
    }
  } catch {
    // ignorar erro de cache
  }

  // 2. Consulta à BrasilAPI com timeout de 8 segundos
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${clean}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: 'CNPJ não encontrado na base da Receita Federal.' };
      }
      return { success: false, error: `Erro na consulta da Receita Federal (${response.status}).` };
    }

    const json = await response.json();

    const capital = Number(json.capital_social) || 0;
    const enderecoCompleto = [
      `${json.descricao_tipo_de_logradouro || ''} ${json.logradouro || ''}, ${json.numero || 'S/N'}`.trim(),
      json.complemento ? `(${json.complemento})` : '',
      json.bairro || '',
      `${json.municipio || ''} - ${json.uf || ''}`,
      json.cep ? `CEP: ${json.cep}` : '',
    ]
      .filter(Boolean)
      .join(', ');

    const socios: SocioQSA[] = (json.qsa || []).map((s: Record<string, unknown>) => ({
      nome: String(s.nome_socio || s.nome || 'Sócio / Administrador'),
      qualificacao: String(s.qualificacao_socio || s.qualificacao_representante_legal || 'Administrador'),
      faixaEtaria: s.faixa_etaria ? String(s.faixa_etaria) : undefined,
      dataEntrada: s.data_entrada_sociedade ? String(s.data_entrada_sociedade) : undefined,
    }));

    const result: CnpjCompanyData = {
      cnpj: clean,
      cnpjFormatado: formatCnpj(clean),
      razaoSocial: json.razao_social || 'Razão Social não informada',
      nomeFantasia: json.nome_fantasia || json.razao_social || '',
      situacaoCadastral: json.descricao_situacao_cadastral || 'ATIVA',
      dataInicioAtividade: json.data_inicio_atividade || '',
      cnaeFiscal: String(json.cnae_fiscal || ''),
      cnaeFiscalDescricao: json.cnae_fiscal_descricao || 'Atividade principal não informada',
      capitalSocial: capital,
      capitalSocialFormatado: formatCurrencyBRL(capital),
      porte: json.porte || 'Não especificado',
      naturezaJuridica: json.natureza_juridica || '',
      logradouro: json.logradouro || '',
      numero: json.numero || '',
      complemento: json.complemento || '',
      bairro: json.bairro || '',
      municipio: json.municipio || '',
      uf: json.uf || '',
      cep: json.cep || '',
      enderecoCompleto,
      telefone: json.ddd_telefone_1 || json.ddd_telefone_2 || '',
      email: json.email || '',
      socios,
      consultadoEm: new Date().toISOString(),
    };

    // Salvar em cache
    try {
      localStorage.setItem(cacheKey, JSON.stringify(result));
    } catch {
      // ignore quota errors
    }

    return { success: true, data: result };
  } catch (err: unknown) {
    const isAbort = err instanceof Error && err.name === 'AbortError';
    return {
      success: false,
      error: isAbort
        ? 'A consulta ao CNPJ excedeu o tempo limite. Tente novamente.'
        : 'Não foi possível conectar à base pública da Receita Federal.',
    };
  }
}
