import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('MÓDULO 1 (PAINEL): Conformidade visual e de linguagem no OverviewView', () => {
  const filePath = path.resolve(process.cwd(), 'src/components/dashboard/views/OverviewView.tsx');
  assert.ok(fs.existsSync(filePath), 'OverviewView.tsx deve existir');

  const content = fs.readFileSync(filePath, 'utf-8');

  // 1. Proibição estrita de cores roxas/violetas/neons no Painel
  const hasPurple = /\b(text-purple-|bg-purple-|border-purple-|text-violet-|bg-violet-|text-fuchsia-)/i.test(content);
  assert.strictEqual(hasPurple, false, 'OverviewView.tsx não deve conter classes roxas/violetas/fuchsia residuais');

  // 2. Proibição de termos de marketplace ou robô em títulos e descrições
  const hasMarketplaceTerms = /\b(marketplace|contratar robô|comprar agente|robô autônomo)\b/i.test(content);
  assert.strictEqual(hasMarketplaceTerms, false, 'OverviewView.tsx não deve conter jargões de marketplace ou robô');

  // 3. Validação de Ação Primária Única no Bloco Próximo Passo
  assert.ok(
    content.includes('Próximo passo') || content.includes('próximo passo'),
    'Deve conter o bloco de Próximo Passo'
  );
  assert.ok(
    content.includes('nextStep.actionText'),
    'Deve renderizar a ação principal única do próximo passo'
  );

  // 4. Estado de orientação de equipe
  assert.ok(
    content.includes('Equipe e atendentes') || content.includes('Equipe de atendimento'),
    'Deve referenciar equipe e atendentes com vocabulário humano'
  );

  // 5. Presença de estados vazios orientadores
  assert.ok(
    content.includes('Nenhum contato registrado') && content.includes('Nenhuma atividade recente registrada'),
    'Deve possuir estados vazios orientadores quando não houver dados no período'
  );
});
