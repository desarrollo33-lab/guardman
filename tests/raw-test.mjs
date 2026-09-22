// Test raw con http2 para controlar EXACTAMENTE los headers
import http2 from 'node:http2';

const url = process.argv[2] || 'https://guardman-astro.oficinadesarrollo33.workers.dev/?v=rawtest';

const cases = [
  { label: 'NO Accept-Encoding', headers: { ':method': 'GET', ':path': new URL(url).pathname + new URL(url).search, ':authority': new URL(url).host, ':scheme': 'https' } },
  { label: 'Accept-Encoding: gzip', headers: { ':method': 'GET', ':path': new URL(url).pathname + new URL(url).search, ':authority': new URL(url).host, ':scheme': 'https', 'accept-encoding': 'gzip' } },
  { label: 'Accept-Encoding: identity', headers: { ':method': 'GET', ':path': new URL(url).pathname + new URL(url).search, ':authority': new URL(url).host, ':scheme': 'https', 'accept-encoding': 'identity' } },
  { label: 'Chrome-like UA + Accept-Encoding: gzip, deflate, br', headers: { ':method': 'GET', ':path': new URL(url).pathname + new URL(url).search, ':authority': new URL(url).host, ':scheme': 'https', 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', 'accept-encoding': 'gzip, deflate, br' } },
];

for (const c of cases) {
  console.log(`\n=== ${c.label} ===`);
  await new Promise((resolve) => {
    const client = http2.connect(new URL(url).origin);
    const req = client.request(c.headers);
    let body = Buffer.alloc(0);
    req.on('response', (headers) => {
      const interesting = ['content-encoding', 'content-type', 'content-length', 'transfer-encoding', 'vary', 'cache-control', ':status'];
      for (const k of interesting) {
        if (headers[k]) console.log(`  ${k}: ${headers[k]}`);
      }
    });
    req.on('data', (chunk) => { body = Buffer.concat([body, chunk]); });
    req.on('end', () => {
      const first4 = body.slice(0, 4).toString('hex').toUpperCase().match(/.{2}/g).join(' ');
      console.log(`  Body size: ${body.length} bytes`);
      console.log(`  First 4 bytes: ${first4}`);
      if (first4 === '1F 8B 08 00') console.log('  >>> BODY IS GZIP');
      if (first4.startsWith('3C 21 44') || first4.startsWith('3C 68 74')) console.log('  >>> BODY IS HTML');
      client.close();
      resolve();
    });
    req.on('error', (err) => { console.log(`  ERROR: ${err.message}`); client.close(); resolve(); });
    req.end();
  });
}
