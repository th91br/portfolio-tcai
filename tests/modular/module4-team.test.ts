import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('MÓDULO 4 (EQUIPE E ATENDIMENTOS): Conformidade visual e de linguagem', () => {
  const teamViewPath = path.resolve(process.cwd(), 'src/components/dashboard/views/AgentsMarketplaceView.tsx');
  const organogramPath = path.resolve(process.cwd(), 'src/components/dashboard/team/TeamOrganogramView.tsx');

  assert.ok(fs.existsSync(teamViewPath), 'AgentsMarketplaceView.tsx deve existir');
  assert.ok(fs.existsSync(organogramPath), 'TeamOrganogramView.tsx deve existir');

  const teamContent = fs.readFileSync(teamViewPath, 'utf-8');
  const organogramContent = fs.readFileSync(organogramPath, 'utf-8');

  // 1. Proibição de classes roxas no Organograma
  const organogramHasPurple = /\b(text-purple-|bg-purple-|border-purple-|text-violet-|bg-violet-)/i.test(organogramContent);
  assert.strictEqual(organogramHasPurple, false, 'TeamOrganogramView.tsx não deve conter classes roxas');

  // 2. Proibição de termos de marketplace ou loja de robôs
  const hasMarketplacePhrases = /\b(marketplace de ia|loja de robôs|comprar agente|contratar robô)\b/i.test(teamContent);
  assert.strictEqual(hasMarketplacePhrases, false, 'AgentsMarketplaceView.tsx não deve conter termos de marketplace');

  // 3. Validação de título humanizado da equipe
  assert.ok(
    teamContent.includes('Equipe de atendimento'),
    'AgentsMarketplaceView deve exibir título humanizado Equipe de atendimento'
  );
});
