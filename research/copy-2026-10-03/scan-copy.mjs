// Barrido de copy corrupto: palabras inglesas dentro de frases en espanol,
// y palabras pegadas sin espacio ("laBSDBs", "empresapcs", "estaFuera").
//
// El guard `tests/anglicismos.test.ts` es una lista fija de terminos. No puede
// atrapar esto: "differentiates", "answered" o "Either" no estan en la lista, y
// una palabra pegada al sustantivo no matchea ningun limite de palabra.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = process.argv[2] || 'src';
const walk = (d) =>
  readdirSync(d).flatMap((n) => {
    const f = join(d, n);
    return statSync(f).isDirectory() ? walk(f) : /\.(ts|astro|tsx|mjs|sql)$/.test(n) ? [f] : [];
  });

// Palabras inglesas que NO son codigo. Se descartan las que son identificadores,
// atributos, rutas o SQL antes de comparar.
const EN = [
  'the', 'and', 'with', 'from', 'that', 'this', 'your', 'their', 'there', 'then', 'than', 'also',
  'which', 'when', 'where', 'what', 'while', 'have', 'has', 'been', 'being', 'will', 'would',
  'should', 'could', 'about', 'after', 'before', 'between', 'during', 'through', 'under', 'over',
  'only', 'other', 'these', 'those', 'both', 'each', 'same', 'first', 'last', 'next', 'more', 'most',
  'less', 'least', 'very', 'really', 'just', 'still', 'even', 'always', 'never', 'without', 'within',
  'answered', 'processes', 'differentiates', 'intermediates', 'either', 'also', 'backups', 'process',
];
const EN_RE = new RegExp(`(?<![\\w'"\`-])(?:${EN.join('|')})(?![\\w'"\`-])`, 'gi');

// Linea que es codigo, no copy: el mismo criterio que usa el guard de anglicismos.
const CODIGO =
  /https?:\/\/|mailto:|tel:|@type|schema\.org|\b(FROM|SELECT|INSERT|UPDATE|DELETE|WHERE|VALUES)\b|\bLIKE\s+\?|class=|aria-|data-[a-z-]+=|type=['"]?password|getElementById|querySelector|^\s*(\/\/|\/\*|--|<!--)|from '|import |export |=>|\.astro['"`]|\.tsx?['"`]|\.sql['"`]|key:\s*'|slug:\s*'|id:\s*'[a-z-]+'|\bconst\b|\blet\b|\bfunction\b|\breturn\b|\bif\s*\(|\bfor\s*\(/i;

// Palabra pegada al sustantivo sin espacio: "laBSDBs", "empresapcs", "estaFuera",
// "conProcesses". Exige minuscula->Mayuscula pegadas, tipico de una sustitucion
// automatica que se comio el espacio.
const PEGADA = /\b[a-záéíóúñ]{2,}[A-Z][a-zA-Záéíóúñ]{2,}\b/g;
const PEGADA_PERMITIDA =
  /\b(Guardpod|GuardPod|GuardMan|OS10|CCTV|NVR|PPI|WebMCP|ChatGPT|ClaudeBot|GPTBot|OAI|CRM|SEO|FAQ|HTML|JSON|QR|LPR|LLA|SSR|D1|KV|CLP|RUT|UF|API|PDF|SSO|SLA|OPAI|RIE|ASAI|AEO|GEO|UTM|IP|PWA|SSR|CSS|DOM|SQL|TLS|HTTPS|AV|LP|ISO|ANSI|NIST|OWASP|ENUSC|CChC|INE|POI|UV|IA|IAI|RPM|KB|MB|GB|MS|URL|URI|DNS|SSL|UDP|TCP|TLS)\w*/g;

const hallazgos = [];

for (const file of walk(RAIZ)) {
  const src = readFileSync(file, 'utf8');
  const lineas = src.split(/\r?\n/);
  let fmEnd = -1;
  if (lineas[0]?.trim() === '---') {
    for (let i = 1; i < lineas.length; i++) if (lineas[i].trim() === '---') { fmEnd = i; break; }
  }
  let script = 0;
  lineas.forEach((l, i) => {
    const abre = (l.match(/<script\b/g) || []).length;
    const cierra = (l.match(/<\/script>/g) || []).length;
    const enScript = script > 0;
    script = Math.max(0, script + abre - cierra);
    if (i <= fmEnd || enScript || abre) return;

    // Solo el texto que leeria una persona: fuera de etiquetas Y fuera de
    // identificadores. El copy vive en literales ('...' o "...") y en el texto
    // de plantilla. Una variable camelCase en una expresion de Astro no es copy:
    // "finalPrimaryText" no es un error, es un nombre.
    const visible = l
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<[^>]*>/g, ' ')
      .trim();
    if (!visible) return;

    // Se queda solo con: literales de cadena y texto suelto de plantilla.
    // Descarta identificadores (precedidos por . { $ o al inicio tras espacio
    // con letra minuscula seguida de otra minuscula) y URLs/rutas.
    const copyLine = visible
      // literales
      .replace(/'([^'\\\n]*)'/g, (m, s) => ` ${s} `)
      .replace(/"([^"\\\n]*)"/g, (m, s) => ` ${s} `)
      // texto visible que quedo tras sacar etiquetas
      .replace(/[{}()[\]=><|&;]/g, ' ')
      .trim();
    if (!copyLine) return;

    // 1) ingles dentro de frase
    if (!CODIGO.test(l)) {
      for (const m of copyLine.matchAll(EN_RE)) {
        hallazgos.push({ file, n: i + 1, tipo: 'ingles', texto: m[0], linea: l.trim().slice(0, 180) });
      }
    }

    // 2) palabra pegada (minuscula->Mayuscula)
    for (const m of copyLine.matchAll(PEGADA)) {
      const w = m[0];
      if (PEGADA_PERMITIDA.test(w)) continue;
      if (CODIGO.test(l)) continue;
      // Ignora identificadores: van precedidos por punto, $ o { en el original.
      const idx = visible.indexOf(w);
      const previo = idx > 0 ? visible[idx - 1] : '';
      if (previo === '.' || previo === '$' || previo === '{' || previo === '?' || previo === ':') continue;
      hallazgos.push({ file, n: i + 1, tipo: 'pegada', texto: w, linea: l.trim().slice(0, 180) });
    }
  });
}

const porTipo = {};
for (const h of hallazgos) (porTipo[h.tipo] ??= []).push(h);

for (const [tipo, hs] of Object.entries(porTipo)) {
  console.log(`\n═══ ${tipo.toUpperCase()} (${hs.length}) ═══`);
  const vistos = new Set();
  for (const h of hs) {
    const k = `${h.file}|${h.texto}`;
    if (vistos.has(k)) continue;
    vistos.add(k);
    console.log(`${h.file}:${h.n}  [${h.texto}]  ${h.linea}`);
  }
}
console.log(`\nTOTAL: ${hallazgos.length}`);
