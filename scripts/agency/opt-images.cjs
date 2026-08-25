const sharp = require('sharp');
const fs = require('fs');
const tasks = [
  { in: 'public/images/logo-byn.png', out: 'public/images/logo-byn-1x.png', w: 181, h: 67, q: null },
  { in: 'public/images/logo-byn.png', out: 'public/images/logo-byn-2x.png', w: 362, h: 134, q: null },
  { in: 'public/images/hero-home.webp', out: 'public/images/hero-home.webp', w: null, h: null, q: 58 },
  { in: 'public/images/nosotros_seccion.webp', out: 'public/images/nosotros_seccion.webp', w: null, h: null, q: 55 },
];
(async () => {
  for (const t of tasks) {
    const inName = t.in.split('/').pop();
    const outName = t.out.split('/').pop();
    const s0 = fs.statSync(t.in).size;
    let pipe = sharp(t.in);
    if (t.w && t.h) pipe = pipe.resize(t.w, t.h, { fit: 'fill' });
    if (t.q) pipe = pipe.webp({ quality: t.q });
    const buf = await pipe.toBuffer();
    const tmpOut = t.out + '.new';
    fs.writeFileSync(tmpOut, buf);
    const s1 = fs.statSync(tmpOut).size;
    const delta = ((1 - s1 / s0) * 100).toFixed(1);
    console.log(inName + ' -> ' + outName + ' | ' + (s0 / 1024).toFixed(1) + 'KB -> ' + (s1 / 1024).toFixed(1) + 'KB (-' + delta + '%) [pending replace]');
  }
})();
