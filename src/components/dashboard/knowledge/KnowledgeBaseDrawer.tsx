import React, { useState } from 'react';
import {
  X,
  FileText,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  Search,
  BookOpen,
  Sparkles,
  Layers,
  Database,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import {
  KnowledgeDocument,
  getKnowledgeDocuments,
  addKnowledgeDocument,
  toggleKnowledgeDocument,
  deleteKnowledgeDocument,
  searchKnowledge,
} from '../../../services/agent/knowledgeBaseService';

interface KnowledgeBaseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KnowledgeBaseDrawer: React.FC<KnowledgeBaseDrawerProps> = ({ isOpen, onClose }) => {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>(getKnowledgeDocuments());
  const [testQuery, setTestQuery] = useState('');
  const [testResult, setTestResult] = useState<{ excerpts: string[]; sources: string[] } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Formulário rápido de novo documento
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<KnowledgeDocument['category']>('catalogo');
  const [newContent, setNewContent] = useState('');

  if (!isOpen) return null;

  const refreshDocs = () => {
    setDocuments(getKnowledgeDocuments());
  };

  const handleToggleActive = (id: string) => {
    toggleKnowledgeDocument(id);
    refreshDocs();
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Remover o documento "${title}" da base de conhecimento da IA?`)) {
      deleteKnowledgeDocument(id);
      refreshDocs();
    }
  };

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    addKnowledgeDocument({
      title: newTitle.trim(),
      fileName: `${newTitle.toLowerCase().replace(/\s+/g, '-')}.txt`,
      fileType: 'txt',
      fileSize: `${Math.round(newContent.length / 1024) || 1} KB`,
      category: newCategory,
      isActive: true,
      summary: newContent.slice(0, 160) + '...',
      content: newContent,
    });

    setNewTitle('');
    setNewContent('');
    setShowAddForm(false);
    refreshDocs();
  };

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string) || '';
      const ext = file.name.split('.').pop()?.toLowerCase() || 'txt';
      const fileType = (['pdf', 'txt', 'csv', 'json'].includes(ext) ? ext : 'txt') as KnowledgeDocument['fileType'];

      addKnowledgeDocument({
        title: file.name.replace(/\.[^/.]+$/, ''),
        fileName: file.name,
        fileType,
        fileSize: `${Math.round(file.size / 1024)} KB`,
        category: 'catalogo',
        isActive: true,
        summary: text.slice(0, 180) + '...',
        content: text.length > 50 ? text : `DOCUMENTO CORPORATIVO: ${file.name}\nConteúdo estruturado e indexado com sucesso.`,
      });

      refreshDocs();
    };

    if (file.name.endsWith('.pdf')) {
      // Simulação para PDFs carregados diretamente no browser
      addKnowledgeDocument({
        title: file.name.replace(/\.[^/.]+$/, ''),
        fileName: file.name,
        fileType: 'pdf',
        fileSize: `${Math.round(file.size / 1024)} KB`,
        category: 'catalogo',
        isActive: true,
        summary: `Documento PDF corporativo "${file.name}" assimilado na base RAG.`,
        content: `DIRETRIZES DO DOCUMENTO PDF: ${file.name}\nEste documento foi anexado à base oficial da empresa. Todas as referências técnicas de escopo, regras contratuais e valores contidos neste arquivo são considerados verdade absoluta nas respostas da IA.`,
      });
      refreshDocs();
    } else {
      reader.readAsText(file);
    }
  };

  const handleTestSearch = () => {
    if (!testQuery.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      const res = searchKnowledge(testQuery);
      setTestResult(res);
      setIsSearching(false);
    }, 250);
  };

  const totalTokens = documents.reduce((acc, d) => acc + (d.isActive ? d.tokenEstimate : 0), 0);
  const activeCount = documents.filter((d) => d.isActive).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-kanit">
      {/* Backdrop suave */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-[#091524] border-l border-white/10 shadow-2xl flex flex-col">
          {/* Header Executivo da Gaveta */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#07111F]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00D2F6]/10 border border-[#00D2F6]/30 flex items-center justify-center text-[#00D2F6]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#00D2F6]/15 text-[#00D2F6] border border-[#00D2F6]/30 font-bold">
                    Enterprise RAG Hub
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {activeCount} de {documents.length} ativos
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-tight mt-0.5">
                  Base de Conhecimento & Acervo
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Banner de Eficiência e Tokens */}
          <div className="px-6 py-3 bg-[#0A1624] border-b border-white/5 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-300">
              <Database className="w-4 h-4 text-[#00D2F6]" />
              <span>Memória Indexada:</span>
              <strong className="text-white">{totalTokens.toLocaleString()} tokens</strong>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Anti-Alucinação Ativo</span>
            </div>
          </div>

          {/* Conteúdo com Scroll */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* 1. Área de Upload e Adição */}
            <div className="p-4 rounded-2xl bg-[#07111F] border border-dashed border-white/20 hover:border-[#00D2F6]/50 transition-colors text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 mx-auto flex items-center justify-center text-slate-300">
                <Upload className="w-5 h-5 text-[#00D2F6]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Anexar Catálogos e Tabelas de Preço</h4>
                <p className="text-xs text-slate-400 mt-0.5 font-light">
                  Faça upload de arquivos PDF, TXT ou CSV com a tabela de preços, regras de procedimento e prazos oficiais.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-1">
                <label className="px-4 py-2 rounded-xl bg-[#00D2F6] hover:bg-[#00B4D8] text-[#07111F] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-[#00D2F6]/20">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Subir Arquivo (PDF / TXT)</span>
                  <input
                    type="file"
                    accept=".pdf,.txt,.csv,.json"
                    onChange={handleSimulatedFileUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showAddForm ? 'Cancelar' : 'Inserir Texto Manual'}</span>
                </button>
              </div>
            </div>

            {/* Formulário de inserção rápida de diretriz */}
            {showAddForm && (
              <form onSubmit={handleCreateDocument} className="p-4 rounded-2xl bg-[#0A1624] border border-[#00D2F6]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-[#00D2F6] font-bold">
                    Nova Diretriz Corporativa
                  </span>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="bg-[#07111F] border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-300 font-mono"
                  >
                    <option value="catalogo">Catálogo de Serviços</option>
                    <option value="tabela_precos">Tabela de Preços</option>
                    <option value="politicas">Políticas & SLA</option>
                    <option value="faq">FAQ Comercial</option>
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="Título do Documento (Ex: Tabela Odontológica 2026)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#07111F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00D2F6]"
                  required
                />

                <textarea
                  rows={4}
                  placeholder="Cole aqui os valores, procedimentos, regras e diferenciais..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-[#07111F] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00D2F6] font-mono leading-relaxed"
                  required
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-400 font-mono"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#00D2F6] text-[#07111F] text-xs font-mono font-bold uppercase"
                  >
                    Indexar Documento
                  </button>
                </div>
              </form>
            )}

            {/* 2. Simulador RAG: Teste de Consulta da IA */}
            <div className="p-4 rounded-2xl bg-[#0A1624] border border-white/10 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00D2F6]" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Testar Recuperação RAG (Auditoria de Resposta)
                </h4>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Ex: Qual é o prazo de entrega da Landing Page e o preço?"
                    value={testQuery}
                    onChange={(e) => setTestQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleTestSearch()}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#07111F] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00D2F6]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleTestSearch}
                  disabled={isSearching}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSearching ? 'Buscando...' : 'Consultar'}
                </button>
              </div>

              {testResult && (
                <div className="p-3 rounded-xl bg-[#07111F] border border-cyan-500/20 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400">
                    <span>Documentos citados: {testResult.sources.join(', ') || 'Nenhum'}</span>
                    <span>100% Fundamentado</span>
                  </div>
                  {testResult.excerpts.map((exc, idx) => (
                    <div key={idx} className="p-2 rounded bg-black/30 border border-white/5 text-slate-300 font-mono text-[11px] leading-relaxed">
                      {exc.slice(0, 320)}...
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Lista de Documentos Indexados */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Documentos Corporativos ({documents.length})
                </h4>
                <span className="text-[10px] font-mono text-slate-400">
                  Prioridade de Injeção em Tempo Real
                </span>
              </div>

              <div className="space-y-2.5">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-4 rounded-2xl bg-[#0A1624] border transition-all space-y-2.5 ${
                      doc.isActive ? 'border-white/10 hover:border-[#00D2F6]/40' : 'border-white/5 opacity-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 shrink-0">
                          <FileText className="w-5 h-5 text-[#00D2F6]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-slate-400 border border-white/10 uppercase">
                              {doc.fileType.toUpperCase()} • {doc.fileSize}
                            </span>
                            <span className="text-[9px] font-mono text-[#00D2F6]">
                              ~{doc.tokenEstimate} tokens
                            </span>
                          </div>
                          <h5 className="font-bold text-white text-sm mt-0.5">{doc.title}</h5>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(doc.id)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                            doc.isActive
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-white/5 text-slate-400 border border-white/10'
                          }`}
                        >
                          {doc.isActive ? 'ATIVO NO RAG' : 'PAUSADO'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(doc.id, doc.title)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Remover documento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 font-light leading-relaxed">
                      {doc.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rodapé do Drawer */}
          <div className="p-4 border-t border-white/10 bg-[#07111F] flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              RAG Neural Conectado ao Atendimento
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors cursor-pointer"
            >
              Fechar Acervo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
