const { Client } = require('ssh2');
const c = new Client();
function run(cmd) {
  return new Promise((resolve) => {
    c.exec(cmd, { pty: true }, (e, s) => {
      if (e) { resolve(); return; }
      let o = '';
      s.on('data', d => o += d.toString());
      s.stderr.on('data', d => o += d.toString());
      s.on('close', () => { console.log(o); resolve(); });
    });
  });
}
c.on('ready', async () => {
  console.log('=== PM2 ===');
  await run('pm2 list');
  console.log('\n=== HEALTH ===');
  await run('curl -s http://localhost:8000/health');
  console.log('\n=== FRONTEND ===');
  await run('curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:8080');
  console.log('\n=== DIST CONTENTS ===');
  await run('ls -la /var/www/omnis-app/frontend/dist/');
  c.end();
}).connect({ host: '187.127.187.155', port: 22, username: 'root', password: 'Omnis@4429#2026', readyTimeout: 30000 });
