import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('PERF-01: dist/assets deve conter chunk isolado de three.js separado do dashboard', () => {
  const distDir = path.resolve(process.cwd(), 'dist/assets');
  assert.equal(fs.existsSync(distDir), true, 'Diretório dist/assets deve existir após build');

  const files = fs.readdirSync(distDir);
  const threeChunk = files.find((f) => f.includes('vendor-three') || f.includes('HeroScene'));
  const dashboardChunk = files.find((f) => f.includes('DashboardRouter'));

  assert.equal(Boolean(threeChunk), true, 'Deve existir chunk isolado para Three.js');
  assert.equal(Boolean(dashboardChunk), true, 'Deve existir chunk isolado para Dashboard');
  assert.notEqual(threeChunk, dashboardChunk, 'Three.js e Dashboard não podem estar no mesmo arquivo');
});
