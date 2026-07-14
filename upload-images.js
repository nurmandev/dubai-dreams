const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');
const PROJECT_DIR = __dirname;

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
  const sftp = await new Promise((res, rej) => c.sftp((e, s) => e ? rej(e) : res(s)));

  const distDir = path.join(PROJECT_DIR, 'frontend', 'dist');

  async function uploadDir(localDir, remoteDir) {
    for (const f of fs.readdirSync(localDir)) {
      const fp = path.join(localDir, f);
      const rp = remoteDir + '/' + f;
      if (fs.statSync(fp).isFile()) {
        const size = fs.statSync(fp).size;
        process.stdout.write(`  ${f} (${(size/1024).toFixed(0)}KB)\n`);
        await new Promise((res, rej) => {
          const rs = fs.createReadStream(fp);
          const ws = sftp.createWriteStream(rp);
          ws.on('close', res); ws.on('error', rej); rs.on('error', rej);
          rs.pipe(ws);
        });
      } else if (fs.statSync(fp).isDirectory()) {
        await run(`mkdir -p ${rp}`);
        await uploadDir(fp, rp);
      }
    }
  }

  console.log('[UPLOAD] images/...');
  await uploadDir(path.join(distDir, 'images'), '/var/www/omnis-app/frontend/dist/images');
  console.log('\n[UPLOAD] LOGOS/...');
  await uploadDir(path.join(distDir, 'LOGOS'), '/var/www/omnis-app/frontend/dist/LOGOS');

  console.log('\n[DONE]');
  sftp.end();
  c.end();
}).connect({ host: '187.127.187.155', port: 22, username: 'root', password: 'Omnis@4429#2026', readyTimeout: 60000, keepaliveInterval: 15000 });
