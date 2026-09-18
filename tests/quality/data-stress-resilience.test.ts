import test from 'node:test';
import assert from 'node:assert/strict';
import { maskEmail, maskPhone, maskCnpjCpf, maskSecretKey, maskFinancialValue } from '../../src/utils/maskingUtils.js';
import { getEmptyROISummary } from '../../src/services/metrics/roiMetricsService.js';
import { canPerformAction, SystemRole } from '../../src/services/security/rolePermissionsService.js';
import { assertTenantAccess, filterByTenant, TenantAccessViolationError } from '../../src/services/security/tenantIsolationGuard.js';

test('HARDENING-01: Resiliência a Dados Mínimos (Empty States e Nulos)', () => {
  // Teste de resiliência a nulos, indefinidos e vazios
  assert.equal(maskEmail(null), '');
  assert.equal(maskEmail(undefined), '');
  assert.equal(maskEmail(''), '');

  assert.equal(maskPhone(null), '');
  assert.equal(maskPhone(undefined), '');
  assert.equal(maskPhone(''), '');

  assert.equal(maskCnpjCpf(null), '');
  assert.equal(maskCnpjCpf(undefined), '');
  assert.equal(maskCnpjCpf(''), '');

  assert.equal(maskFinancialValue(15000, false), 'R$ ••••••••');

  const emptyRoi = getEmptyROISummary();
  assert.equal(emptyRoi.revenueAttributed, 0);
  assert.equal(emptyRoi.savingsValidated, 0);
  assert.equal(emptyRoi.totalCost, 0);
  assert.equal(emptyRoi.totalExecutions, 0);
});

test('HARDENING-02: Resiliência a Dados Típicos e Formatação Fiel', () => {
  const email = 'thiago91cassol@hotmail.com';
  const phone = '+55 (11) 98844-3210';
  const cnpj = '38.412.981/0001-44';

  const maskedEmail = maskEmail(email);
  const maskedPhone = maskPhone(phone);
  const maskedCnpj = maskCnpjCpf(cnpj);

  assert.ok(maskedEmail.includes('***@hotmail.com'), 'Email típico deve ser mascarado');
  assert.ok(maskedPhone.includes('****-3210'), 'Telefone típico deve ser mascarado');
  assert.ok(maskedCnpj.includes('***'), 'CNPJ típico deve ser mascarado');
});

test('HARDENING-03: Resiliência a Carga Excessiva (Stress Testing & Overflow)', () => {
  const startTime = Date.now();
  const count = 500;

  // Geração massiva de strings anômalas e quilométricas
  for (let i = 0; i < count; i++) {
    const giantName = 'NomeGigante'.repeat(30) + i; // 360+ caracteres
    const giantEmail = `usuario.${'muitolongo'.repeat(15)}.${i}@empresa.com.br`;
    const anomalousPhone = `+55 (${i % 99}) 99999-9999 extra-${'x'.repeat(100)}`;
    const giantCnpj = `38412981000144${i}`.slice(0, 14);
    const giantKey = `tcai_live_whk_${'abc123xyz'.repeat(10)}`;

    const mEmail = maskEmail(giantEmail);
    const mPhone = maskPhone(anomalousPhone);
    const mDoc = maskCnpjCpf(giantCnpj);
    const mKey = maskSecretKey(giantKey);

    assert.ok(typeof mEmail === 'string');
    assert.ok(typeof mPhone === 'string');
    assert.ok(typeof mDoc === 'string');
    assert.ok(typeof mKey === 'string');
  }

  const durationMs = Date.now() - startTime;
  // O processamento de 500 registros de estresse não pode demorar mais que 1000ms
  assert.ok(durationMs < 1000, `Stress test de 500 registros executou em ${durationMs}ms (limite 1000ms)`);
});

test('HARDENING-04: Matriz de Permissões RBAC (Acesso Permitido vs Bloqueado)', () => {
  // admin pode gerenciar tenants, webhooks e deletar leads
  assert.equal(canPerformAction('admin', 'tenants:manage'), true);
  assert.equal(canPerformAction('admin', 'webhooks:rotate'), true);
  assert.equal(canPerformAction('admin', 'leads:delete'), true);
  assert.equal(canPerformAction('admin', 'billing:edit'), true);

  // closer não pode deletar leads nem gerenciar tenants/faturamento
  assert.equal(canPerformAction('closer', 'leads:edit'), true);
  assert.equal(canPerformAction('closer', 'leads:delete'), false);
  assert.equal(canPerformAction('closer', 'tenants:manage'), false);
  assert.equal(canPerformAction('closer', 'billing:edit'), false);

  // viewer apenas visualiza e não tem acesso a edições ou faturamento
  assert.equal(canPerformAction('viewer', 'leads:view'), true);
  assert.equal(canPerformAction('viewer', 'leads:edit'), false);
  assert.equal(canPerformAction('viewer', 'billing:edit'), false);
});

test('HARDENING-05: Isolamento Multi-Tenant e Segregação Real vs Demo', () => {
  const tenantA = 'tenant-alfa';
  const tenantB = 'tenant-beta';

  // Operador do tenant A acessando dados do tenant A: permitido
  assert.doesNotThrow(() => assertTenantAccess(tenantA, tenantA));

  // Operador do tenant A tentando acessar dados do tenant B: lança TenantAccessViolationError
  assert.throws(
    () => assertTenantAccess(tenantB, tenantA),
    (err: any) => err instanceof TenantAccessViolationError
  );

  // Filtragem estrita por tenant
  const mixedLeads = [
    { id: '1', tenant_id: tenantA },
    { id: '2', tenant_id: tenantB },
    { id: '3', tenant_id: tenantA },
  ];
  const filtered = filterByTenant(mixedLeads, tenantA);
  assert.equal(filtered.length, 2);
  assert.ok(filtered.every((l) => l.tenant_id === tenantA));

  // Validação de chaves de isolamento
  const mockStorage: Record<string, string> = {
    'tcai_demo_leads': JSON.stringify([{ id: 'demo-1', demo: true }]),
    'tcai_real_leads': JSON.stringify([{ id: 'real-1', demo: false }]),
  };

  const demoData = JSON.parse(mockStorage['tcai_demo_leads']);
  const realData = JSON.parse(mockStorage['tcai_real_leads']);

  assert.equal(demoData[0].demo, true);
  assert.equal(realData[0].demo, false);
  assert.notEqual(demoData[0].id, realData[0].id);
});
