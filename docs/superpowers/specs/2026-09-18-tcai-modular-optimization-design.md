# Especificação Técnica — Fase 5: Otimização por Módulos do Admin TCAI

> **Documento:** `docs/superpowers/specs/2026-09-18-tcai-modular-optimization-design.md`  
> **Programa:** Evolução Arquitetural do Admin TCAI (Fases 0 a 7)  
> **Fase:** 5 — Otimização por Módulos  
> **Metodologia:** Superpowers (`obra/superpowers`)  
> **Gate:** Nenhuma implementação em código inicia antes da aprovação formal desta especificação e do respectivo plano executável.

---

## 1. Objetivo

A **Fase 5** tem como propósito a otimização visual, funcional e operacional do Admin TCAI em seus **7 módulos fundamentais**, transformando cada tela em uma ferramenta de trabalho de padrão enterprise, com clareza imediata, linguagem humana, foco no próximo passo e ausência total de elementos que descaracterizem o sistema como infraestrutura estratégica (eliminação de estética de "marketplace de IA", remoção de tons roxos/neon, supressão de glassmorphism excessivo e emojis decorativos).

---

## 2. Ordem de Execução dos Módulos

Seguindo a diretriz formal do projeto, os módulos serão otimizados rigorosamente na seguinte sequência:

1. **Módulo 1: Painel (Visão Geral / Home do Admin)**
2. **Módulo 2: Conversas (WhatsAppAgentView & Atendimento)**
3. **Módulo 3: Contatos, Funil e Agenda (LeadsListView, PipelineKanbanView, FollowUpsView)**
4. **Módulo 4: Equipe e Atendimentos (Organograma, Perfis de Atendentes, Gestão do Time)**
5. **Módulo 5: Conhecimento, Integrações e Regras (Base de Conhecimento, Webhooks, Regras de Atendimento)**
6. **Módulo 6: Relatórios (AnalyticsView & Proveniência de Métricas)**
7. **Módulo 7: Faturamento e Segurança (Propostas/PIX, Alertas de Segurança, RBAC & Tenants)**

---

## 3. Critérios Visuais e Operacionais Obrigatórios

Para garantir consistência absoluta em todas as telas, cada módulo deve atender estritamente aos seguintes critérios:

| Critério | Regra Arquitetural | O Que é Proibido | O Que é Exigido |
| :--- | :--- | :--- | :--- |
| **Ação Principal Única** | Hierarquia de Botões | Múltiplos botões primários competindo pelo clique do usuário no mesmo contexto | Apenas **um botão primário** em destaque (`#8a5a00` ou `bg-emerald-600`); ações secundárias usam contorno ou texto neutro |
| **Linguagem Humana** | Tom de Comunicação | Termos robóticos ("Sou uma IA", "Prompt do Agente", "Comprar Robô") | Linguagem em primeira pessoa, profissional e acolhedora ("Equipe de Atendimento", "Orientações da Empresa", "Conversas em Aberto") |
| **Identidade Sóbria** | Paleta e Estilo | Tons roxos/violetas/fúcsia, neons brilhantes, fundos transparentes ilegíveis (glassmorphism) e emojis decorativos | Paleta institucional TCAI: carvão `#111512` / `#161B14`, dourado `#C08E3A` / `#8a5a00`, verde esmeralda `#059669`, ardósia `#334155` e branco papel |
| **Estados Vazios** | Experiência de Início | Telas cinzas sem texto ou mensagens genéricas ("Nada aqui") | **Estado vazio orientador**: explica o que é a seção, por que ela importa e fornece botão de ação imediata para o próximo passo |
| **Tratamento de Erros** | Resiliência Operacional | Mensagens crípticas ("Error 500", "Object reference not set") | Mensagem explicativa em português claro detalhando o que houve e como resolver imediatamente |
| **Configurações Avançadas** | Densidade Cognitiva | Telas poluídas com dezenas de campos técnicos avançados na visão principal | Painéis laterais (*drawers*) ou modais dedicados para parâmetros técnicos, mantendo a visão principal desobstruída |
| **Consistência de Navegação** | Design System | Botões com tamanhos díspares, ícones inconsistentes | Componentes padronizados com bordas arredondadas uniformes (`rounded-xl` / `rounded-2xl`), fontes Kanit/Sans e estados de foco/hover acessíveis |

---

## 4. Detalhamento por Módulo

### 4.1. Módulo 1: Painel (Visão Geral)
- **Diagnóstico:** Presença residual de classes roxas (`text-purple-600` no atalho de atendentes) e menção de agentes que pode soar impessoal.
- **Otimização:**
  - Bloco "Próximo Passo" consolidado como elemento dominante de tela.
  - Substituição de `text-purple-600` pela cor sóbria institucional (`#C08E3A` / slate).
  - Ajuste de textos para "Equipe de Atendimento" e atalhos limpos.
  - Refinamento do checklist de ativação progressiva com navegação direta.

### 4.2. Módulo 2: Conversas (WhatsApp)
- **Diagnóstico:** Detalhes de inteligência artificial ou terminologia fria no cabeçalho do chat.
- **Otimização:**
  - Header de conversa humanizado: identifica quem está atendendo ou a empresa de forma acolhedora.
  - Alternância de 1 clique entre "Atendimento Autônomo" e "Assumir Conversa Manualmente".
  - Estado vazio orientando a conexão do WhatsApp e o recebimento de mensagens.
  - Remoção de termos robóticos e balões de chat com alta legibilidade.

### 4.3. Módulo 3: Contatos, Funil e Agenda
- **Diagnóstico:** Heterogeneidade visual e colunas do Kanban com empty states genéricos.
- **Otimização:**
  - Contatos: Ação primária "Novo Contato", campo de busca rápida instantânea, filtros por status operacionais reais.
  - Funil: Ação primária "Nova Oportunidade", totalizadores claros por etapa, empty states instrutivos de arraste.
  - Agenda: Ação primária "Novo Agendamento", lista cronológica com indicador de urgência (Atrasado, Hoje, Próximos dias).

### 4.4. Módulo 4: Equipe e Atendimentos
- **Diagnóstico:** O componente `AgentsMarketplaceView.tsx` possui vocabulário remanescente de "marketplace de IA".
- **Otimização:**
  - Transformação conceitual e visual de "Marketplace de IA" para **"Equipe de Atendimento Digital"**.
  - Perfis de atendentes apresentados como membros da equipe comercial da empresa.
  - Eliminação de roxos e botões de compra; foco em: Configurar Orientações, Testar Atendimento, Ativar/Pausar.
  - Estados vazios orientando a criação do primeiro atendente.

### 4.5. Módulo 5: Conhecimento, Integrações e Regras
- **Diagnóstico:** Presença de gradientes roxos (`to-purple-500/10`) e bordas violetas em `WebhookHubModal.tsx`.
- **Otimização:**
  - Base de Conhecimento: Apresentada como "Orientações e Diretrizes da Empresa", permitindo cadastrar perguntas frequentes, políticas e tabelas de preços com ação principal única "Adicionar Orientação".
  - Integrações (Webhooks): Visual executivo institucional (dourado/slate/verde), documentação clara de endpoints e payloads.
  - Regras de Atendimento: Painel simplificado de horários, mensagens de saudação e limites de autonomia.

### 4.6. Módulo 6: Relatórios (Analytics)
- **Diagnóstico:** Falta de indicador visual evidente de proveniência dos dados (Realizado vs Demonstrativo) nos cards principais.
- **Otimização:**
  - Selo de proveniência e integridade em cada KPI (conforme Fase 4).
  - Paleta sóbria (verde esmeralda para conversão positiva, dourado para receita, ardósia para volumes).
  - Ação principal: "Exportar Relatório" / Seleção de período.
  - Empty state com sugestão de ajuste de período.

### 4.7. Módulo 7: Faturamento e Segurança
- **Diagnóstico:** Visual de propostas e telas de segurança precisam manter o rigor sóbrio do design system.
- **Otimização:**
  - Propostas & PIX: Ação primária única "Gerar Cobrança PIX", dados de pagamento em destaque, cópia com 1 clique.
  - Segurança: Exibição transparente da trilha de auditoria e controle de permissões (RBAC) sem termos crípticos.
  - Mascaramento ativo de PII respeitando o perfil logado.

---

## 5. Ciclo de Implementação por Módulo (Superpowers TDD)

Cada um dos 7 módulos seguirá obrigatoriamente:
1. **Teste Falhando:** Criação/atualização de teste unitário/integração ou teste de interface demonstrando o critério não atendido.
2. **Implementação Mínima:** Ajuste focado nos arquivos específicos do módulo.
3. **Teste Passando:** Execução do teste e confirmação de sucesso.
4. **Refinamento:** Polimento visual e de código sem desvios.
5. **Revisão de Conformidade:** Verificação dos critérios (uma ação, sem roxo, sem marketplace, linguagem humana).
6. **Revisão de Qualidade:** `npm run typecheck` e `npm run test:security`.
7. **Validação Desktop e Mobile:** Teste de layout nas duas resoluções canônicas (1280px e 375px).
8. **Commit Isolado:** Registro com mensagem descritiva clara.

---

## 6. Critérios de Aceite da Fase 5

- [ ] Todos os 7 módulos otimizados na ordem estabelecida.
- [ ] 0 ocorrências de `purple`, `violet`, `fuchsia` ou neon nas telas do dashboard.
- [ ] 0 referências a "Marketplace de IA" ou botões de "Comprar Agente".
- [ ] 100% das telas com exatamente 1 ação primária destacada por contexto.
- [ ] Estados vazios e de erro operacionais e autoexplicativos em todos os módulos.
- [ ] Configurações avançadas preservadas em painéis laterais/modals.
- [ ] 100% de aprovação na esteira `npm run verify` (6 barreiras verdes).
