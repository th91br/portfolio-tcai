import fs from 'fs';
import path from 'path';
import url from 'url';

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

export function viteAgentPlugin() {
  return {
    name: 'vite-agent-backend-plugin',
    configureServer(server) {
      const root = process.cwd();
      const dataDir = path.join(root, 'scripts', 'data');
      const mediaDir = path.join(dataDir, 'media');
      const configFile = path.join(dataDir, 'agent-config.json');
      const conversationsFile = path.join(dataDir, 'whatsapp-conversations.json');

      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });

      server.middlewares.use(async (req, res, next) => {
        const parsedUrl = url.parse(req.url || '', true);
        const pathname = parsedUrl.pathname || '';

        // CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
          res.writeHead(200);
          res.end();
          return;
        }

        // 1. Static media serving from scripts/data/media/
        if (pathname.startsWith('/media/')) {
          const filename = path.basename(pathname);
          const filePath = path.join(mediaDir, filename);
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filename).toLowerCase();
            const mimeTypes = {
              '.png': 'image/png',
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.webp': 'image/webp',
              '.gif': 'image/gif',
              '.ogg': 'audio/ogg',
              '.mp3': 'audio/mpeg',
              '.wav': 'audio/wav',
              '.pdf': 'application/pdf',
            };
            const contentType = mimeTypes[ext] || 'application/octet-stream';
            res.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=86400' });
            fs.createReadStream(filePath).pipe(res);
            return;
          }
        }

        // 2. GET /api/agent/config
        if (pathname === '/api/agent/config' && req.method === 'GET') {
          let config = {};
          if (fs.existsSync(configFile)) {
            try {
              config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
            } catch {}
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(config));
          return;
        }

        // 3. POST /api/agent/config
        if (pathname === '/api/agent/config' && req.method === 'POST') {
          try {
            const body = await parseJsonBody(req);
            const toSave = { ...body, updatedAt: new Date().toISOString() };
            fs.writeFileSync(configFile, JSON.stringify(toSave, null, 2), 'utf8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, config: toSave }));
          } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
          return;
        }

        // 4. POST /api/agent/test-gemini
        if (pathname === '/api/agent/test-gemini' && req.method === 'POST') {
          try {
            const body = await parseJsonBody(req);
            const apiKey = (body.apiKey || '').trim();
            const model = body.model || 'gemini-2.0-flash';

            if (!apiKey) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: 'Chave de API não informada.' }));
              return;
            }

            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            const start = performance.now();
            const geminiRes = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: 'Responda apenas: TCAI_ONLINE_OK' }] }],
                generationConfig: { maxOutputTokens: 20 },
              }),
            });
            const latencyMs = Math.round(performance.now() - start);
            const data = await geminiRes.json();

            if (geminiRes.ok) {
              const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Conexão OK';
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, model, latencyMs, reply }));
            } else {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, latencyMs, error: data.error?.message || 'Falha ao validar com Google Gemini.' }));
            }
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
          return;
        }

        // 5. GET /api/analytics/kpis
        if (pathname === '/api/analytics/kpis' && req.method === 'GET') {
          let kpis = {
            totalLeads: 26,
            hotLeads: 9,
            meetingsBooked: 5,
            conversionRate: '29.2%',
            activeChats: 6,
            avgResponseTimeSec: 8,
          };
          if (fs.existsSync(conversationsFile)) {
            try {
              const fullData = JSON.parse(fs.readFileSync(conversationsFile, 'utf8'));
              if (fullData.kpis) kpis = fullData.kpis;
            } catch {}
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(kpis));
          return;
        }

        // 6. GET /api/contacts
        if (pathname === '/api/contacts' && req.method === 'GET') {
          let contacts = [];
          if (fs.existsSync(conversationsFile)) {
            try {
              const fullData = JSON.parse(fs.readFileSync(conversationsFile, 'utf8'));
              contacts = fullData.contacts || [];
            } catch {}
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(contacts));
          return;
        }

        // 6.1 POST /api/contacts
        if (pathname === '/api/contacts' && req.method === 'POST') {
          try {
            const body = await parseJsonBody(req);
            let fullData = { contacts: [] };
            if (fs.existsSync(conversationsFile)) {
              try {
                fullData = JSON.parse(fs.readFileSync(conversationsFile, 'utf8'));
              } catch {}
            }
            if (Array.isArray(body)) {
              fullData.contacts = body;
            }
            fs.writeFileSync(conversationsFile, JSON.stringify(fullData, null, 2), 'utf8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, contacts: fullData.contacts }));
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
          return;
        }

        // 7. POST /api/media/upload
        if (pathname === '/api/media/upload' && req.method === 'POST') {
          try {
            const body = await parseJsonBody(req);
            const { base64, mimeType = 'image/png', filename = 'upload.png' } = body;
            if (!base64) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: 'Arquivo base64 não informado.' }));
              return;
            }

            const cleanExt = path.extname(filename) || (mimeType.includes('audio') ? '.ogg' : '.png');
            const safeName = `${Date.now()}-${path.basename(filename, cleanExt).replace(/[^a-zA-Z0-9_-]/g, '')}${cleanExt}`;
            const savePath = path.join(mediaDir, safeName);
            const buffer = Buffer.from(base64, 'base64');
            fs.writeFileSync(savePath, buffer);

            const mediaUrl = `/media/${safeName}`;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: true,
              url: mediaUrl,
              filename: safeName,
              sizeBytes: buffer.length,
              mimeType,
            }));
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
          return;
        }

        // 8. POST /api/messages/send
        if (pathname === '/api/messages/send' && req.method === 'POST') {
          try {
            const body = await parseJsonBody(req);
            const { contactId, text = '', sender = 'agent', media } = body;

            if (!contactId) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: 'contactId obrigatório.' }));
              return;
            }

            let fullData = { contacts: [] };
            if (fs.existsSync(conversationsFile)) {
              try {
                fullData = JSON.parse(fs.readFileSync(conversationsFile, 'utf8'));
              } catch {}
            }

            let contact = fullData.contacts.find((c) => c.id === contactId);
            if (!contact) {
              contact = {
                id: contactId,
                name: 'Novo Contato WhatsApp',
                company: 'Lead em Triagem',
                phone: '+55 54 99123-4567',
                status: 'triage',
                statusLabel: 'Triagem Inicial',
                avatar: '💼',
                unread: 0,
                score: 80,
                slaTimeline: '7 DIAS ÚTEIS',
                projectType: 'Automação & Agente IA',
                messages: [],
              };
              fullData.contacts.unshift(contact);
            }

            let savedMediaUrl = media?.url;
            if (media?.base64) {
              const ext = media.mimeType?.includes('audio') ? '.ogg' : (media.mimeType?.includes('jpeg') ? '.jpg' : '.png');
              const safeFileName = `${Date.now()}-${(media.filename || 'media').replace(/[^a-zA-Z0-9_-]/g, '')}${ext}`;
              const filePath = path.join(mediaDir, safeFileName);
              fs.writeFileSync(filePath, Buffer.from(media.base64, 'base64'));
              savedMediaUrl = `/media/${safeFileName}`;
            }

            const now = new Date();
            const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

            const newMsg = {
              sender,
              text,
              time: timeStr,
              media: savedMediaUrl ? {
                type: media.type || (media.mimeType?.includes('audio') ? 'audio' : 'image'),
                url: savedMediaUrl,
                mimeType: media.mimeType,
                filename: media.filename,
                caption: media.caption || text,
              } : undefined,
            };

            contact.messages.push(newMsg);
            contact.lastMessage = text || (newMsg.media?.type === 'audio' ? '🎙️ Mensagem de voz' : '📷 Foto enviada');
            contact.lastMessageTime = timeStr;

            fs.writeFileSync(conversationsFile, JSON.stringify(fullData, null, 2), 'utf8');

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: newMsg, contact }));
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
          return;
        }

        // 9. GET /api/diagnostics & POST /api/diagnostics
        if (pathname === '/api/diagnostics' && req.method === 'GET') {
          let diagnostics = [];
          if (fs.existsSync(conversationsFile)) {
            try {
              const fullData = JSON.parse(fs.readFileSync(conversationsFile, 'utf8'));
              diagnostics = fullData.diagnostics || [];
            } catch {}
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(diagnostics));
          return;
        }

        if (pathname === '/api/diagnostics' && req.method === 'POST') {
          try {
            const body = await parseJsonBody(req);
            let fullData = { diagnostics: [] };
            if (fs.existsSync(conversationsFile)) {
              try {
                fullData = JSON.parse(fs.readFileSync(conversationsFile, 'utf8'));
              } catch {}
            }
            if (Array.isArray(body)) {
              fullData.diagnostics = body;
            } else if (body.id) {
              const idx = (fullData.diagnostics || []).findIndex((d) => d.id === body.id);
              if (idx >= 0) {
                fullData.diagnostics[idx] = { ...fullData.diagnostics[idx], ...body };
              } else {
                fullData.diagnostics = [body, ...(fullData.diagnostics || [])];
              }
            }
            fs.writeFileSync(conversationsFile, JSON.stringify(fullData, null, 2), 'utf8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, diagnostics: fullData.diagnostics }));
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
          return;
        }

        // 10. GET /api/meetings & POST /api/meetings
        if (pathname === '/api/meetings' && req.method === 'GET') {
          let meetings = [];
          if (fs.existsSync(conversationsFile)) {
            try {
              const fullData = JSON.parse(fs.readFileSync(conversationsFile, 'utf8'));
              meetings = fullData.meetings || [];
            } catch {}
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(meetings));
          return;
        }

        if (pathname === '/api/meetings' && req.method === 'POST') {
          try {
            const body = await parseJsonBody(req);
            let fullData = { meetings: [] };
            if (fs.existsSync(conversationsFile)) {
              try {
                fullData = JSON.parse(fs.readFileSync(conversationsFile, 'utf8'));
              } catch {}
            }
            if (Array.isArray(body)) {
              fullData.meetings = body;
            } else if (body.id) {
              const idx = (fullData.meetings || []).findIndex((m) => m.id === body.id);
              if (idx >= 0) {
                fullData.meetings[idx] = { ...fullData.meetings[idx], ...body };
              } else {
                fullData.meetings = [body, ...(fullData.meetings || [])];
              }
            }
            fs.writeFileSync(conversationsFile, JSON.stringify(fullData, null, 2), 'utf8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, meetings: fullData.meetings }));
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
          return;
        }

        // 11. POST /api/contacts/update
        if (pathname === '/api/contacts/update' && req.method === 'POST') {
          try {
            const body = await parseJsonBody(req);
            let fullData = { contacts: [] };
            if (fs.existsSync(conversationsFile)) {
              try {
                fullData = JSON.parse(fs.readFileSync(conversationsFile, 'utf8'));
              } catch {}
            }
            if (body.id) {
              const idx = (fullData.contacts || []).findIndex((c) => c.id === body.id);
              if (idx >= 0) {
                fullData.contacts[idx] = { ...fullData.contacts[idx], ...body };
              } else {
                fullData.contacts = [body, ...(fullData.contacts || [])];
              }
              fs.writeFileSync(conversationsFile, JSON.stringify(fullData, null, 2), 'utf8');
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, contact: fullData.contacts[idx >= 0 ? idx : 0] }));
            } else {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: 'ID do contato obrigatório.' }));
            }
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
          return;
        }

        next();
      });
    },
  };
}
