import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('MÓDULO 3 (CONTATOS, FUNIL E AGENDA): Conformidade visual e operacional', () => {
  const leadsPath = path.resolve(process.cwd(), 'src/components/dashboard/views/LeadsListView.tsx');
  const kanbanPath = path.resolve(process.cwd(), 'src/components/dashboard/views/PipelineKanbanView.tsx');
  const followUpsPath = path.resolve(process.cwd(), 'src/components/dashboard/views/FollowUpsView.tsx');

  assert.ok(fs.existsSync(leadsPath), 'LeadsListView.tsx deve existir');
  assert.ok(fs.existsSync(kanbanPath), 'PipelineKanbanView.tsx deve existir');
  assert.ok(fs.existsSync(followUpsPath), 'FollowUpsView.tsx deve existir');

  const kanbanContent = fs.readFileSync(kanbanPath, 'utf-8');
  const followUpsContent = fs.readFileSync(followUpsPath, 'utf-8');
  const leadsContent = fs.readFileSync(leadsPath, 'utf-8');

  // 1. Proibição de classes roxas no Funil Kanban
  const kanbanHasPurple = /\b(text-purple-|bg-purple-|border-purple-|text-violet-|bg-violet-)/i.test(kanbanContent);
  assert.strictEqual(kanbanHasPurple, false, 'PipelineKanbanView.tsx não deve conter classes roxas no funil');

  // 2. Proibição de classes roxas na Agenda de Follow-ups
  const followUpsHasPurple = /\b(text-purple-|bg-purple-|border-purple-|text-violet-|bg-violet-)/i.test(followUpsContent);
  assert.strictEqual(followUpsHasPurple, false, 'FollowUpsView.tsx não deve conter classes roxas');

  // 3. Validação de Ação Primária em Contatos
  assert.ok(
    leadsContent.includes('Novo Contato') || leadsContent.includes('Cadastrar') || leadsContent.includes('Adicionar'),
    'LeadsListView deve ter botão de criação de contato evidente'
  );

  // 4. Validação de Ação Primária no Funil
  assert.ok(
    kanbanContent.includes('Nova Oportunidade') || kanbanContent.includes('Criar Negócio') || kanbanContent.includes('Adicionar'),
    'PipelineKanbanView deve ter ação de nova oportunidade'
  );

  // 5. Validação de Empty States orientadores
  assert.ok(
    leadsContent.includes('Nenhum lead') || leadsContent.includes('Nenhum contato') || leadsContent.includes('nenhum contato'),
    'LeadsListView deve possuir empty state orientador'
  );
  assert.ok(
    followUpsContent.includes('Nenhum acompanhamento') || followUpsContent.includes('nenhum acompanhamento') || followUpsContent.includes('Nenhum follow-up'),
    'FollowUpsView deve possuir empty state orientador'
  );
});
