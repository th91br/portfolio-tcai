import { execSync } from 'node:child_process';

const steps = [
  { name: 'Validação TypeScript', cmd: 'npm run typecheck' },
  { name: 'Testes Unitários', cmd: 'npm run test:unit' },
  { name: 'Testes de Integração', cmd: 'npm run test:integration' },
  { name: 'Testes de Segurança e Isolamento', cmd: 'npm run test:security' },
  { name: 'Testes de Performance e Chunks', cmd: 'npm run test:perf' },
  { name: 'Jornadas de Navegação (Playwright)', cmd: 'npm run test:navigation' },
  { name: 'Hardening Final (Viewports 390-1440px, Teclado, Offline e Rolagem)', cmd: 'npm run test:hardening' },
  { name: 'Build de Produção', cmd: 'npm run build' },
  { name: 'Auditoria de Orçamento de Performance (Budget Gate)', cmd: 'node scripts/verify-performance-budget.js' },
];

console.log('=============================================================');
console.log('--- [TCAI QUALITY PIPELINE] Iniciando Validação Completa ---');
console.log('=============================================================');
const startTime = Date.now();

for (const step of steps) {
  process.stdout.write(`\n-> Executando ${step.name} (${step.cmd})... `);
  try {
    execSync(step.cmd, { stdio: 'pipe' });
    console.log('✓ OK');
  } catch (error) {
    console.error(`\n✖ FALHA em ${step.name}!`);
    if (error.stdout) console.error(error.stdout.toString());
    if (error.stderr) console.error(error.stderr.toString());
    process.exit(1);
  }
}

const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
console.log(`\n=============================================================`);
console.log(`✓ [TCAI QUALITY PIPELINE] Todas as ${steps.length} barreiras passaram com sucesso em ${elapsed}s!`);
console.log(`=============================================================\n`);
process.exit(0);
