const { execSync } = require('child_process');

function run(cmd) {
  console.log(`\n> ${cmd}`);
  try {
    const out = execSync(cmd, { stdio: 'pipe' }).toString();
    console.log(out);
    return out;
  } catch (err) {
    if (err.stdout) console.log(err.stdout.toString());
    if (err.stderr) console.error(err.stderr.toString());
    throw err;
  }
}

try {
  run('git add -A');
  try {
    run('git commit -m "feat: portfolio completo thiago cassol antunes tcai v1.1.0"');
  } catch (e) {
    console.log('No new changes to commit or commit succeeded');
  }
  console.log('Git commit ready!');
} catch (e) {
  console.error('Error during git commit:', e.message);
}
