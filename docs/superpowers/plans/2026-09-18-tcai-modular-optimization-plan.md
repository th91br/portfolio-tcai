# Plano Executável — Fase 5: Otimização por Módulos (Superpowers)

> **Documento:** `docs/superpowers/plans/2026-09-18-tcai-modular-optimization-plan.md`  
> **Status:** Pronto para Execução com Aprovação  
> **Data:** 18 de Setembro de 2026  
> **Metodologia:** Superpowers (`obra/superpowers`)  
> **Regra de Rigor:** Cada tarefa contém arquivos exatos, comportamento esperado, teste que falha primeiro, implementação mínima, comando de verificação, resultado esperado, commit próprio e instrução de rollback.

---

### Tarefa MOD-F5-01: Otimização do Módulo 1 — Painel (Visão Geral)
- **Arquivos exatos:** `src/components/dashboard/views/OverviewView.tsx`, `tests/modular/module1-overview.test.ts`
- **Comportamento esperado:**
  - Garantir uma única ação primária em destaque no bloco "Próximo Passo" (`#8a5a00`).
  - Remover qualquer resíduo de classes `text-purple-600` ou `bg-purple-` em atalhos.
  - Ajustar terminologia do atalho para "Equipe e Atendentes" com ícone e tonalidade corporativa dourada/slate.
  - Exibir estado vazio orientador caso não haja leads ou eventos, orientando o início da operação.
- **Teste que precisa falhar primeiro:** Teste verificando conformidade visual e de texto: inexistência de classes roxas/purples no módulo e presença de ação primária única.
- **Implementação mínima:** Ajustar estilização dos atalhos e estados vazios em `OverviewView.tsx`.
- **Comando de verificação:** `npx tsx --test tests/modular/module1-overview.test.ts`
- **Resultado esperado:** 100% de aprovação.
- **Commit próprio:** `fix(overview): streamline overview hierarchy, remove purple classes and enforce single primary action`
- **Instrução de rollback:** `git checkout HEAD -- src/components/dashboard/views/OverviewView.tsx`

---

### Tarefa MOD-F5-02: Otimização do Módulo 2 — Conversas (WhatsApp)
- **Arquivos exatos:** `src/components/dashboard/views/WhatsAppAgentView.tsx`, `tests/modular/module2-conversations.test.ts`
- **Comportamento esperado:**
  - Header de conversa 100% humanizado (identifica Thiago / Empresa, sem auto-declaração de robô ou IA).
  - Alternância imediata entre "Atendimento Autônomo" e "Atendimento Manual" em 1 clique claro.
  - Estado vazio orientando a conexão com WhatsApp Web e recepção do primeiro contato real.
  - Tratamento de erro de envio de mensagem explicando motivo e oferecendo botão "Tentar novamente".
- **Teste que precisa falhar primeiro:** Teste verificando ausência de termos de IA proibidos no chat e validação do fluxo de handover humano.
- **Implementação mínima:** Refatorar badges de cabeçalho, empty state e fluxo de erro em `WhatsAppAgentView.tsx`.
- **Comando de verificação:** `npx tsx --test tests/modular/module2-conversations.test.ts`
- **Resultado esperado:** 100% de aprovação.
- **Commit próprio:** `feat(conversations): polish whatsapp view with human-first headers and resilient empty states`
- **Instrução de rollback:** `git checkout HEAD -- src/components/dashboard/views/WhatsAppAgentView.tsx`

---

### Tarefa MOD-F5-03: Otimização do Módulo 3 — Contatos, Funil e Agenda
- **Arquivos exatos:** `src/components/dashboard/views/LeadsListView.tsx`, `src/components/dashboard/views/PipelineKanbanView.tsx`, `src/components/dashboard/views/FollowUpsView.tsx`, `tests/modular/module3-crm-pipeline.test.ts`
- **Comportamento esperado:**
  - Contatos: Ação primária "Novo Contato", campo de busca rápido sem quebras no mobile, empty state orientando cadastro.
  - Funil: Ação primária "Nova Oportunidade", totalizadores transparentes por coluna, empty state por coluna instruindo arraste de oportunidades.
  - Agenda: Ação primária "Agendar Retorno", lista cronológica de follow-ups com indicadores de urgência (Atrasado, Hoje, Próximos dias).
- **Teste que precisa falhar primeiro:** Teste verificando ações primárias únicas e cálculo consistente de oportunidades nos três componentes.
- **Implementação mínima:** Alinhar componentes aos novos padrões de botões, empty states e tipografia Kanit.
- **Comando de verificação:** `npx tsx --test tests/modular/module3-crm-pipeline.test.ts`
- **Resultado esperado:** 100% de aprovação.
- **Commit próprio:** `feat(crm): unify contacts, pipeline kanban and followups with action hierarchy`
- **Instrução de rollback:** `git checkout HEAD -- src/components/dashboard/views/LeadsListView.tsx src/components/dashboard/views/PipelineKanbanView.tsx src/components/dashboard/views/FollowUpsView.tsx`

---

### Tarefa MOD-F5-04: Otimização do Módulo 4 — Equipe e Atendimentos
- **Arquivos exatos:** `src/components/dashboard/views/AgentsMarketplaceView.tsx`, `src/components/dashboard/layout/DashboardSidebar.tsx`, `tests/modular/module4-team.test.ts`
- **Comportamento esperado:**
  - Eliminar qualquer conceito ou aparência de "Marketplace de IA" / "Loja de Bots".
  - Apresentar como **"Equipe de Atendimento Digital"** (atendentes cadastrados na empresa).
  - Sem botões "Comprar" ou "Contratar Robô"; ações focadas em "Adicionar Atendente", "Configurar Atendimento" e "Testar no Treinamento".
  - Eliminação de roxos e neons.
- **Teste que precisa falhar primeiro:** Teste garantindo que não existem strings "Marketplace" ou "Contratar Robô" e validando o cadastro e status do time.
- **Implementação mínima:** Ajustar textos, botões e cards em `AgentsMarketplaceView.tsx` e referências na barra lateral.
- **Comando de verificação:** `npx tsx --test tests/modular/module4-team.test.ts`
- **Resultado esperado:** 100% de aprovação.
- **Commit próprio:** `refactor(team): transform agents marketplace into professional team operation view`
- **Instrução de rollback:** `git checkout HEAD -- src/components/dashboard/views/AgentsMarketplaceView.tsx src/components/dashboard/layout/DashboardSidebar.tsx`

---

### Tarefa MOD-F5-05: Otimização do Módulo 5 — Conhecimento, Integrações e Regras
- **Arquivos exatos:** `src/components/dashboard/knowledge/KnowledgeBaseDrawer.tsx`, `src/components/dashboard/integrations/WebhookHubModal.tsx`, `src/components/dashboard/settings/AgentSettingsModal.tsx`, `tests/modular/module5-knowledge-integrations.test.ts`
- **Comportamento esperado:**
  - Base de Conhecimento: Apresentada como "Orientações e Diretrizes da Empresa", ação primária "Adicionar Orientação".
  - WebhookHub: Remoção do gradiente roxo (`to-purple-500/10`), adoção de paleta dourada/slate corporativa.
  - Regras de Atendimento: Configurações avançadas em gavetas laterais com linguagem simples e clara.
- **Teste que precisa falhar primeiro:** Teste verificando remoção de gradientes roxos e persistência de documentos de orientação.
- **Implementação mínima:** Limpar estilos dissonantes e refinar textos em `WebhookHubModal.tsx` e `KnowledgeBaseDrawer.tsx`.
- **Comando de verificação:** `npx tsx --test tests/modular/module5-knowledge-integrations.test.ts`
- **Resultado esperado:** 100% de aprovação.
- **Commit próprio:** `fix(integrations): remove purple gradients from webhooks and streamline knowledge base`
- **Instrução de rollback:** `git checkout HEAD -- src/components/dashboard/knowledge/KnowledgeBaseDrawer.tsx src/components/dashboard/integrations/WebhookHubModal.tsx`

---

### Tarefa MOD-F5-06: Otimização do Módulo 6 — Relatórios (Analytics)
- **Arquivos exatos:** `src/components/dashboard/views/AnalyticsView.tsx`, `tests/modular/module6-reports.test.ts`
- **Comportamento esperado:**
  - Exibição de selo de proveniência de dados em cada métrica (Realizado vs Demonstrativo vs Estimado).
  - Ação primária "Exportar Relatório" ou seleção de período comercial.
  - Paleta sóbria (esmeralda, dourado, ardósia), sem neons ou gráficos estridentes.
  - Empty state instrutivo caso não existam dados no período filtrado.
- **Teste que precisa falhar primeiro:** Teste verificando que métricas exibem indicador de proveniência e que filtros de data respondem sem erros.
- **Implementação mínima:** Integrar proveniência nos cards de KPI e enriquecer empty state de `AnalyticsView.tsx`.
- **Comando de verificação:** `npx tsx --test tests/modular/module6-reports.test.ts`
- **Resultado esperado:** 100% de aprovação.
- **Commit próprio:** `feat(analytics): add data truth provenance indicators and streamlined reports view`
- **Instrução de rollback:** `git checkout HEAD -- src/components/dashboard/views/AnalyticsView.tsx`

---

### Tarefa MOD-F5-07: Otimização do Módulo 7 — Faturamento e Segurança
- **Arquivos exatos:** `src/components/dashboard/proposals/PixPaymentModal.tsx`, `src/components/dashboard/team/SecurityAlertsDrawer.tsx`, `src/components/dashboard/tenants/TenantMasterModal.tsx`, `tests/modular/module7-billing-security.test.ts`
- **Comportamento esperado:**
  - Propostas & PIX: Ação primária clara "Gerar PIX" e "Copiar Código", valores monetários formatados e nítidos.
  - Segurança: Apresentação limpa de logs de auditoria e status de isolamento de tenants.
  - Confirmações de dupla etapa para ações destrutivas (excluir tenant ou resetar configurações).
- **Teste que precisa falhar primeiro:** Teste validando mascaramento em faturamento para perfis sem permissão e dupla confirmação.
- **Implementação mínima:** Refinar modais de cobrança e segurança com conformidade de layout e paleta.
- **Comando de verificação:** `npx tsx --test tests/modular/module7-billing-security.test.ts`
- **Resultado esperado:** 100% de aprovação.
- **Commit próprio:** `feat(security-billing): polish pix payment and security audit drawer with confirmation guards`
- **Instrução de rollback:** `git checkout HEAD -- src/components/dashboard/proposals/PixPaymentModal.tsx src/components/dashboard/team/SecurityAlertsDrawer.tsx`

---

## Esteira Consolidada de Verificação da Fase 5

Após a conclusão de cada módulo, o pipeline completo será executado:
```bash
npm run verify
```
Garantindo 0 regressões em TypeScript, testes unitários, testes de integração, testes de segurança e testes de navegação Playwright.
