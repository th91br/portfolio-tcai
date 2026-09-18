import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Módulo 7: Faturamento e Segurança - Conformidade Visual e Operacional', async (t) => {
  const pixModalPath = path.resolve('src/components/dashboard/proposals/PixPaymentModal.tsx');
  const securityDrawerPath = path.resolve('src/components/dashboard/team/SecurityAlertsDrawer.tsx');
  const tenantModalPath = path.resolve('src/components/dashboard/tenants/TenantMasterModal.tsx');

  const pixContent = fs.readFileSync(pixModalPath, 'utf8');
  const securityContent = fs.readFileSync(securityDrawerPath, 'utf8');
  const tenantContent = fs.readFileSync(tenantModalPath, 'utf8');

  await t.test('PixPaymentModal não deve conter emojis decorativos no despacho de mensagens', () => {
    // Não deve conter emojis nos templates de mensagem
    assert.doesNotMatch(
      pixContent,
      /⚡|📌|👤|💰/,
      'PixPaymentModal contém emojis decorativos proibidos no template'
    );
  });

  await t.test('PixPaymentModal deve prever proteção de permissão ou mascaramento de faturamento', () => {
    assert.match(
      pixContent,
      /userRole|maskCnpjCpf|billing:view|billing:edit|canPerformAction/i,
      'PixPaymentModal deve possuir tratamento de permissões ou mascaramento seguro'
    );
  });

  await t.test('SecurityAlertsDrawer deve implementar guarda de dupla confirmação para expurgo de logs', () => {
    assert.match(
      securityContent,
      /confirmStep|irreversível|dupla confirmação|confirm.*confirm/i,
      'SecurityAlertsDrawer deve exigir dupla confirmação para ações destrutivas'
    );
  });

  await t.test('Modais de Faturamento e Segurança não devem conter classes roxas/purples', () => {
    assert.doesNotMatch(
      pixContent,
      /text-purple-|bg-purple-|border-purple-|to-purple-/,
      'PixPaymentModal contém classes roxas proibidas'
    );
    assert.doesNotMatch(
      securityContent,
      /text-purple-|bg-purple-|border-purple-|to-purple-/,
      'SecurityAlertsDrawer contém classes roxas proibidas'
    );
    assert.doesNotMatch(
      tenantContent,
      /text-purple-|bg-purple-|border-purple-|to-purple-/,
      'TenantMasterModal contém classes roxas proibidas'
    );
  });
});
