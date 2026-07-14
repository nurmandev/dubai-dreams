const { Client } = require('ssh2');
const c = new Client();

function run(cmd) {
  return new Promise((resolve) => {
    c.exec(cmd, { pty: true }, (e, s) => {
      if (e) { console.error(e.message); resolve(); return; }
      let o = '';
      s.on('data', d => o += d.toString());
      s.stderr.on('data', d => o += d.toString());
      s.on('close', () => { console.log(o); resolve(); });
    });
  });
}

c.on('ready', async () => {
  console.log('[1/4] Checking nginx config...');
  await run('ls -la /etc/nginx/sites-enabled/ 2>/dev/null; echo "---"; cat /etc/nginx/sites-enabled/omnisrealty 2>/dev/null || echo "NO NGINX CONF"');

  console.log('\n[2/4] Building backend...');
  await run('cd /var/www/omnis-app/backend && npx tsc 2>&1 | tail -3');
  
  console.log('\n[3/4] Restarting...');
  await run('pm2 restart all && pm2 save');
  
  console.log('\n[4/4] Verifying...');
  await new Promise(r => setTimeout(r, 3000));
  await run('curl -s http://localhost:8000/health');
  await run('curl -s -o /dev/null -w "Frontend: HTTP %{http_code}\n" http://localhost:8080');
  
  console.log('\nDONE');
  c.end();
}).connect({ host: '187.127.187.155', port: 22, username: 'root', password: 'Omnis@4429#2026', readyTimeout: 30000 });
