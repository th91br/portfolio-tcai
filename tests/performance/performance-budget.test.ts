import test from 'node:test';
import assert from 'node:assert/strict';
import { verifyPerformanceBudget } from '../../scripts/verify-performance-budget.js';

test('PERF-03: Orçamento de performance deve cumprir todos os limites estabelecidos na Fase 6', () => {
  const result = verifyPerformanceBudget();

  assert.equal(
    result.success,
    true,
    `Falha no orçamento de performance:\n${result.errors.join('\n')}`
  );
  assert.ok(result.table.length > 0, 'A tabela de auditoria deve conter chunks analisados');

  const mainChunk = result.table.find((item: { file: string }) => item.file.startsWith('index-'));
  const routerChunk = result.table.find((item: { file: string }) => item.file.startsWith('DashboardRouter-'));

  assert.ok(mainChunk, 'Deve encontrar o bundle principal index.js');
  assert.ok(routerChunk, 'Deve encontrar o bundle do DashboardRouter');

  // Limites estritos
  assert.ok(mainChunk.kb <= 250, `index.js (${mainChunk.kb} KB) deve ser <= 250 KB`);
  assert.ok(routerChunk.kb <= 120, `DashboardRouter.js (${routerChunk.kb} KB) deve ser <= 120 KB`);
});
