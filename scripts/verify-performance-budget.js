import fs from 'node:fs';
import path from 'node:path';

/**
 * ============================================================================
 * TCAI — VALIDADOR DE ORÇAMENTO DE PERFORMANCE (PERFORMANCE BUDGET GATE)
 * ============================================================================
 * Assegura que nenhum chunk exceda os limites estritos de peso estipulados na Fase 6.
 * ============================================================================
 */

const DIST_ASSETS = path.resolve(process.cwd(), 'dist/assets');

const BUDGET_LIMITS = {
  // O bundle de entrada principal (index.js) não pode passar de 250 KB
  mainEntry: {
    pattern: /^index-.*\.js$/,
    maxKb: 250,
    label: 'Main Entry Shell (index.js)',
  },
  // O router do dashboard não pode passar de 120 KB
  dashboardRouter: {
    pattern: /^DashboardRouter-.*\.js$/,
    maxKb: 120,
    label: 'Dashboard Router (DashboardRouter.js)',
  },
  // Views individuais do admin não podem passar de 160 KB
  views: {
    pattern: /(OverviewView|WhatsAppAgentView|PipelineKanbanView|LeadsListView|FollowUpsView|AnalyticsView|AgentsMarketplaceView)-.*\.js$/,
    maxKb: 160,
    label: 'Admin View Chunks',
  },
};

export function verifyPerformanceBudget() {
  if (!fs.existsSync(DIST_ASSETS)) {
    return {
      success: false,
      errors: [`Diretório ${DIST_ASSETS} não encontrado. Execute 'npm run build' primeiro.`],
      table: [],
    };
  }

  const files = fs.readdirSync(DIST_ASSETS);
  const errors = [];
  const table = [];

  for (const file of files) {
    if (!file.endsWith('.js')) continue;
    const filePath = path.join(DIST_ASSETS, file);
    const stat = fs.statSync(filePath);
    const kb = parseFloat((stat.size / 1024).toFixed(2));

    let matchedLimit = null;

    if (BUDGET_LIMITS.mainEntry.pattern.test(file)) {
      matchedLimit = BUDGET_LIMITS.mainEntry;
    } else if (BUDGET_LIMITS.dashboardRouter.pattern.test(file)) {
      matchedLimit = BUDGET_LIMITS.dashboardRouter;
    } else if (BUDGET_LIMITS.views.pattern.test(file)) {
      matchedLimit = BUDGET_LIMITS.views;
    }

    if (matchedLimit) {
      const passed = kb <= matchedLimit.maxKb;
      table.push({
        file,
        kb,
        limit: matchedLimit.maxKb,
        status: passed ? 'PASSED' : 'EXCEEDED',
      });

      if (!passed) {
        errors.push(
          `[BUDGET EXCEEDED] ${file} (${kb} KB) excedeu o limite de ${matchedLimit.maxKb} KB estipulado para ${matchedLimit.label}.`
        );
      }
    }
  }

  return {
    success: errors.length === 0,
    errors,
    table,
  };
}

if (process.argv[1] && process.argv[1].includes('verify-performance-budget')) {
  console.log('\n=============================================================');
  console.log('  TCAI — AUDITORIA DE ORÇAMENTO DE PERFORMANCE (FASE 6)');
  console.log('=============================================================\n');

  const result = verifyPerformanceBudget();

  console.table(result.table);

  if (!result.success) {
    console.error('\n✖ FALHA NO ORÇAMENTO DE PERFORMANCE:');
    result.errors.forEach((err) => console.error('  - ' + err));
    process.exit(1);
  }

  console.log('\n✓ Todos os pacotes auditados estão rigorosamente dentro dos limites de performance!\n');
  process.exit(0);
}
