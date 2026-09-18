import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('MÓDULO 2 (CONVERSAS): Conformidade visual e humana no WhatsAppAgentView e modais', () => {
  const viewPath = path.resolve(process.cwd(), 'src/components/dashboard/views/WhatsAppAgentView.tsx');
  const meetingModalPath = path.resolve(process.cwd(), 'src/components/dashboard/views/whatsapp/MeetingEditModal.tsx');

  assert.ok(fs.existsSync(viewPath), 'WhatsAppAgentView.tsx deve existir');
  assert.ok(fs.existsSync(meetingModalPath), 'MeetingEditModal.tsx deve existir');

  const viewContent = fs.readFileSync(viewPath, 'utf-8');
  const meetingContent = fs.readFileSync(meetingModalPath, 'utf-8');

  // 1. Proibição de classes roxas/violetas e neon shadows no WhatsAppAgentView
  const viewHasPurple = /\b(text-purple-|bg-purple-|border-purple-|text-violet-|bg-violet-|text-fuchsia-)/i.test(viewContent);
  assert.strictEqual(viewHasPurple, false, 'WhatsAppAgentView.tsx não deve conter classes roxas/violetas residuais');

  const viewHasNeon = /rgba\(168,\s*85,\s*247/i.test(viewContent);
  assert.strictEqual(viewHasNeon, false, 'WhatsAppAgentView.tsx não deve conter sombras neon roxas');

  // 2. Proibição de classes roxas no MeetingEditModal
  const modalHasPurple = /\b(text-purple-|bg-purple-|border-purple-|text-violet-|bg-violet-)/i.test(meetingContent);
  assert.strictEqual(modalHasPurple, false, 'MeetingEditModal.tsx não deve conter classes roxas residuais');

  // 3. Verificação de controle de atendimento (Piloto Autônomo vs Atendimento Humano)
  assert.ok(
    viewContent.includes('human_only') || viewContent.includes('autopilot') || viewContent.includes('copilot'),
    'WhatsAppAgentView deve suportar alternância entre atendimento autônomo e humano'
  );

  // 4. Presença de empty state de conversas orientando conexão
  assert.ok(
    viewContent.includes('Nenhuma conversa') || viewContent.includes('nenhuma conversa') || viewContent.includes('Nenhum contato encontrado'),
    'Deve apresentar empty state claro quando não houver conversas'
  );
});
