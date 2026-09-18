import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('PERF-02: cada view do admin deve possuir seu próprio chunk de arquivo no build final', () => {
  const distDir = path.resolve(process.cwd(), 'dist/assets');
  assert.equal(fs.existsSync(distDir), true, 'dist/assets deve existir');
  const files = fs.readdirSync(distDir);

  const expectedViews = [
    'OverviewView',
    'WhatsAppAgentView',
    'PipelineKanbanView',
    'LeadsListView',
    'FollowUpsView',
    'AnalyticsView',
    'AgentsMarketplaceView',
  ];

  for (const viewName of expectedViews) {
    const chunkFound = files.some((f) => f.includes(viewName));
    assert.equal(
      chunkFound,
      true,
      `View ${viewName} precisa gerar chunk dedicado em dist/assets/`
    );
  }
});
