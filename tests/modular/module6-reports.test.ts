import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Módulo 6: Relatórios e Analytics - Conformidade Visual e Verdade Operacional', async (t) => {
  const analyticsPath = path.resolve('src/components/dashboard/views/AnalyticsView.tsx');
  const analyticsContent = fs.readFileSync(analyticsPath, 'utf8');

  await t.test('AnalyticsView deve exibir selo de proveniência de dados (Verdade de Dados)', () => {
    // Deve conter badges ou legendas explícitas de proveniência operacional
    assert.match(
      analyticsContent,
      /Selo de Proveniência|Proveniência de Dados|Auditoria de Dados|Realizado|Qualidade do dado/i,
      'AnalyticsView deve indicar explicitamente a procedência dos dados'
    );
    // Deve ter indicador de dado Realizado vs Estimado
    assert.match(
      analyticsContent,
      /Realizado|Estimado/i,
      'Deve classificar métricas de faturamento e impacto como Realizado ou Estimado'
    );
  });

  await t.test('AnalyticsView deve possuir ação primária clara de exportação ou período', () => {
    assert.match(
      analyticsContent,
      /Exportar Relatório|Exportar Indicadores|Baixar Relatório/i,
      'AnalyticsView deve conter ação primária de exportação ou relatório'
    );
  });

  await t.test('AnalyticsView deve possuir empty state orientador geral quando não há leads', () => {
    assert.match(
      analyticsContent,
      /leads\.length === 0|totalExecutions === 0/i,
      'AnalyticsView deve conter tratamento de estado vazio orientando início da operação'
    );
  });

  await t.test('AnalyticsView não deve conter classes roxas/purples ou neons', () => {
    assert.doesNotMatch(
      analyticsContent,
      /text-purple-|bg-purple-|border-purple-|to-purple-|from-purple-/,
      'AnalyticsView não deve conter classes roxas'
    );
  });
});
