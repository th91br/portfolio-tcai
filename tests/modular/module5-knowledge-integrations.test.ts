import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Módulo 5: Conhecimento, Integrações e Regras - Conformidade Visual e Operacional', async (t) => {
  const webhookHubPath = path.resolve('src/components/dashboard/integrations/WebhookHubModal.tsx');
  const agentSettingsPath = path.resolve('src/components/dashboard/settings/AgentSettingsModal.tsx');
  const knowledgeDrawerPath = path.resolve('src/components/dashboard/knowledge/KnowledgeBaseDrawer.tsx');

  const webhookContent = fs.readFileSync(webhookHubPath, 'utf8');
  const agentSettingsContent = fs.readFileSync(agentSettingsPath, 'utf8');
  const knowledgeContent = fs.readFileSync(knowledgeDrawerPath, 'utf8');

  await t.test('WebhookHubModal não deve conter classes roxas/purples ou gradientes estridentes', () => {
    assert.doesNotMatch(
      webhookContent,
      /to-purple-500|bg-purple-|text-purple-|border-purple-/,
      'WebhookHubModal contém classes roxas que devem ser substituídas pela paleta corporativa'
    );
  });

  await t.test('AgentSettingsModal não deve conter classes roxas residuais', () => {
    assert.doesNotMatch(
      agentSettingsContent,
      /text-purple-|bg-purple-|border-purple-/,
      'AgentSettingsModal contém classes text-purple que devem ser substituídas por text-[#C08E3A]'
    );
  });

  await t.test('KnowledgeBaseDrawer deve usar títulos humanizados de diretrizes e possuir empty state orientador', () => {
    assert.match(
      knowledgeContent,
      /Orientações e Diretrizes/i,
      'KnowledgeBaseDrawer deve intitular o módulo como Orientações e Diretrizes da Empresa'
    );

    assert.match(
      knowledgeContent,
      /documents\.length === 0|!documents\.length/i,
      'KnowledgeBaseDrawer deve tratar estado vazio quando não houver documentos'
    );

    assert.doesNotMatch(
      knowledgeContent,
      /base de conhecimento da IA\?/i,
      'Deve usar vocabulário humanizado ao invés de "da IA"'
    );
  });
});
