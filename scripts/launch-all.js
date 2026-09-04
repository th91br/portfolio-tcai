import { spawn, exec } from 'child_process';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

console.log(`\n============================================================`);
console.log(`⚡ TCAI — INICIALIZADOR UNIFICADO 1-CLIQUE`);
console.log(`   Iniciando: Frontend Vite + Servidor Agente WhatsApp (3080)`);
console.log(`============================================================\n`);

// 1. Iniciar o Servidor do Agente WhatsApp na porta 3080
const agentProcess = spawn('node', [path.join(ROOT_DIR, 'scripts', 'whatsapp-agent-server.js')], {
  cwd: ROOT_DIR,
  stdio: 'inherit',
  shell: true,
});

// 2. Iniciar o Vite Dev Server (Frontend + Admin)
const viteProcess = spawn('npx', ['vite', '--port', '5173'], {
  cwd: ROOT_DIR,
  stdio: 'inherit',
  shell: true,
});

// Função para verificar se a porta HTTP está respondendo
function checkPort(port, callback) {
  const req = http.get(`http://localhost:${port}`, () => {
    callback(true);
  });
  req.on('error', () => {
    callback(false);
  });
  req.setTimeout(1000, () => {
    req.destroy();
    callback(false);
  });
}

// Aguarda os servidores subirem e abre o navegador automaticamente no Admin com Preview ativo
let openedBrowser = false;
const checkInterval = setInterval(() => {
  checkPort(5173, (isViteReady) => {
    if (isViteReady && !openedBrowser) {
      openedBrowser = true;
      clearInterval(checkInterval);

      const targetUrl = 'http://localhost:5173/?admin=true&preview=true#admin';
      console.log(`\n✅ AMBOS OS SERVIÇOS ONLINE COM SUCESSO!`);
      console.log(`🌐 Abrindo Admin Dashboard: ${targetUrl}\n`);

      // Comando multiplataforma para abrir a URL no navegador padrão
      const openCommand =
        process.platform === 'win32'
          ? `start "" "${targetUrl}"`
          : process.platform === 'darwin'
          ? `open "${targetUrl}"`
          : `xdg-open "${targetUrl}"`;

      exec(openCommand, (err) => {
        if (err) {
          console.warn(`(Acesse manualmente pelo navegador: ${targetUrl})`);
        }
      });
    }
  });
}, 1000);

// Tratamento de encerramento limpo (Ctrl + C)
function cleanExit() {
  console.log(`\nEncerrando servidores da TCAI...`);
  try {
    agentProcess.kill();
    viteProcess.kill();
  } catch {}
  process.exit(0);
}

process.on('SIGINT', cleanExit);
process.on('SIGTERM', cleanExit);
process.on('exit', cleanExit);
