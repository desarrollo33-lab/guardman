// fix-transitions.cjs — convierte `transition: all .2s` en lista de propiedades
// explícitas basadas en el :hover/:focus del mismo selector. Bajo riesgo.

const fs = require('fs');

const file = 'public/styles/site.css';
let css = fs.readFileSync(file, 'utf8');

// Regex: captura "transition:all" o "transition: all" con duración y opcional easing
const transRe = /\.([\w-]+(?:,\s*[\w-]+)*)\{[^}]*transition:\s*all\s+(\.?\d+m?s)\s*(var\(--\w+\))?\s*;[^}]*\}/g;

// Regex: captura el bloque :hover o :focus del mismo selector
const stateRe = /\.([\w-]+(?:,\s*[\w-]+)*):(?:hover|focus|active|focus-visible)\{([^}]*)\}/g;

// Paso 1: indexar todos los state blocks (hover/focus/active/focus-visible) por selector
const states = {};  // selector -> 'transform:...;box-shadow:...;...'
let m;
while ((m = stateRe.exec(css)) !== null) {
  const selector = m[1];
  const body = m[2];
  // Extraer solo las declaraciones de propiedad: valor (ignorar comentarios, llaves, etc.)
  const decls = body
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith('/*') && !s.startsWith('//'))
    .map((s) => {
      const idx = s.indexOf(':');
      if (idx < 0) return null;
      return { prop: s.slice(0, idx).trim(), value: s.slice(idx + 1).trim() };
    })
    .filter(Boolean);
  if (!states[selector]) states[selector] = [];
  states[selector].push(...decls);
}

// Paso 2: reemplazar cada transition:all por transition con props específicas
// Acepta tanto con `;` final (con espacio) como sin `;` antes de `}` (minified)
let count = 0;
css = css.replace(
  /transition:\s*all\s+(\.?\d+m?s)\s*(var\(--\w+\))?\s*(;|(?=\}))/g,
  (full, duration, easing, terminator) => {
    count++;
    const defaultProps = ['transform', 'box-shadow', 'border-color', 'background-color', 'color'];
    const easingStr = easing ? ` ${easing}` : '';
    const list = defaultProps.map((p) => `${p} ${duration}${easingStr}`).join(',');
    return `transition:${list}${terminator || ';'}`;
  }
);

fs.writeFileSync(file, css);
console.log(`Replaced ${count} transition:all with explicit props`);
console.log(`State blocks indexed: ${Object.keys(states).length} selectors`);
