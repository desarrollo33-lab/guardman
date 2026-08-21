// GuardpodWizard — Cuestionario profundo del producto GuardPod.
//   Carga sesión, muestra 14 secciones con sidebar de progreso,
//   autoguardado por pregunta (debounce 1.5s), indicador visual,
//   help tooltips con icono ?, banner "conocimiento real".
// v5.5.0
import { useEffect, useMemo, useRef, useState } from 'react';

interface Section {
  name: string;
  order: number;
  questions: Question[];
}

interface Question {
  key: string;
  section: string;
  order: number;
  type: string;
  label: string;
  help_text: string | null;
  real_world_prompt: string | null;
  real_world_required: boolean;
  required: boolean;
  options: string[] | null;
}

interface Session {
  id: string;
  admin_email: string;
  active_version: string;
  progress_pct: number;
  answered_count: number;
  total_questions: number;
  last_activity: string;
  started_at: string;
  completed_at: string | null;
}

interface AnswerValue {
  value: string;
  type: string;
  file_url: string | null;
  updated_at: string;
}

interface InitialData {
  session: Session;
  sections: Section[];
  answers: Record<string, AnswerValue>;
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

const fetchOpts = { credentials: 'same-origin' as RequestCredentials };
const headers = { 'Content-Type': 'application/json' };

export default function GuardpodWizard() {
  const [data, setData] = useState<InitialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeQuestionKey, setActiveQuestionKey] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [saveStates, setSaveStates] = useState<Record<string, SaveState>>({});
  const [lastSavedAt, setLastSavedAt] = useState<Record<string, string>>({});
  const [showWelcome, setShowWelcome] = useState(false);
  const [helpOpenKey, setHelpOpenKey] = useState<string | null>(null);
  const debounceRef = useRef<Record<string, number>>({});
  const dirtyRef = useRef<Set<string>>(new Set());

  // Carga inicial
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/guardpod/session', { ...fetchOpts });
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok || !json.ok) {
          setError(json.error || `Error ${res.status}`);
          setLoading(false);
          return;
        }
        setData(json);
        // Inicializar drafts y saveStates desde answers existentes
        const initialDrafts: Record<string, string> = {};
        const initialStates: Record<string, SaveState> = {};
        const initialSavedAt: Record<string, string> = {};
        for (const [k, a] of Object.entries(json.answers as Record<string, AnswerValue>)) {
          initialDrafts[k] = a.value;
          initialStates[k] = 'saved';
          initialSavedAt[k] = a.updated_at;
        }
        setDrafts(initialDrafts);
        setSaveStates(initialStates);
        setLastSavedAt(initialSavedAt);

        // Bienvenida: solo si no hay respuestas todavía y no se aceptó antes
        const accepted = typeof window !== 'undefined' ? window.localStorage.getItem('gp_welcome_accepted') : '1';
        if (!accepted && (json.session.answered_count ?? 0) === 0) {
          setShowWelcome(true);
        }
        // Sección inicial: la primera con respuestas o la primera
        const firstWithAnswers = json.sections.find((s: Section) =>
          s.questions.some((q: Question) => initialDrafts[q.key])
        );
        const firstSection = firstWithAnswers ?? json.sections[0];
        setActiveSection(firstSection.name);
        setActiveQuestionKey(firstSection.questions[0]?.key ?? null);
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Flush al cerrar pestaña
  useEffect(() => {
    const handler = () => {
      if (dirtyRef.current.size === 0 || !data) return;
      const payload = {
        session_id: data.session.id,
        answers: Array.from(dirtyRef.current).map((k) => {
          const q = findQuestion(data.sections, k);
          return q ? { question_key: k, value: drafts[k] ?? '', answer_type: q.type } : null;
        }).filter(Boolean),
      };
      try {
        navigator.sendBeacon(
          '/api/guardpod/answer/batch',
          new Blob([JSON.stringify(payload)], { type: 'application/json' })
        );
      } catch { /* ignore */ }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [data, drafts]);

  // Ctrl+S = save now
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        flushAll();
      } else if (e.key === 'Escape' && helpOpenKey) {
        setHelpOpenKey(null);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [helpOpenKey, data, drafts, dirtyRef]);

  function findQuestion(sections: Section[], key: string): Question | null {
    for (const s of sections) {
      const q = s.questions.find((qq) => qq.key === key);
      if (q) return q;
    }
    return null;
  }

  function scheduleSave(key: string) {
    if (!data) return;
    if (debounceRef.current[key]) window.clearTimeout(debounceRef.current[key]);
    debounceRef.current[key] = window.setTimeout(() => {
      void saveOne(key);
    }, 1500);
  }

  async function saveOne(key: string) {
    if (!data) return;
    const q = findQuestion(data.sections, key);
    if (!q) return;
    const value = drafts[key] ?? '';
    setSaveStates((s) => ({ ...s, [key]: 'saving' }));
    try {
      const res = await fetch('/api/guardpod/answer', {
        method: 'POST',
        ...fetchOpts,
        headers,
        body: JSON.stringify({
          session_id: data.session.id,
          question_key: key,
          value,
          answer_type: q.type,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || `Error ${res.status}`);
      setSaveStates((s) => ({ ...s, [key]: 'saved' }));
      setLastSavedAt((s) => ({ ...s, [key]: json.saved_at }));
      dirtyRef.current.delete(key);
      // Refrescar progreso global
      if (data) {
        setData({
          ...data,
          session: { ...data.session, progress_pct: json.progress_pct, answered_count: json.answered_count, total_questions: json.total_questions },
        });
      }
    } catch (err) {
      setSaveStates((s) => ({ ...s, [key]: 'error' }));
      if (window.gmToast) {
        window.gmToast({ type: 'error', title: 'No se pudo guardar', msg: err instanceof Error ? err.message : String(err) });
      }
    }
  }

  async function flushAll() {
    if (!data) return;
    const dirty = Array.from(dirtyRef.current);
    if (dirty.length === 0) return;
    const payload = {
      session_id: data.session.id,
      answers: dirty.map((k) => {
        const q = findQuestion(data.sections, k);
        return q ? { question_key: k, value: drafts[k] ?? '', answer_type: q.type } : null;
      }).filter(Boolean),
    };
    for (const k of dirty) setSaveStates((s) => ({ ...s, [k]: 'saving' }));
    try {
      const res = await fetch('/api/guardpod/answer/batch', {
        method: 'POST',
        ...fetchOpts,
        headers,
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || `Error ${res.status}`);
      for (const k of dirty) {
        setSaveStates((s) => ({ ...s, [k]: 'saved' }));
        setLastSavedAt((s) => ({ ...s, [k]: json.saved_at }));
        dirtyRef.current.delete(k);
      }
      if (data) {
        setData({
          ...data,
          session: { ...data.session, progress_pct: json.progress_pct, answered_count: json.answered_count, total_questions: json.total_questions },
        });
      }
      if (window.gmToast) {
        window.gmToast({ type: 'success', title: 'Guardado', msg: `${json.saved} respuestas guardadas` });
      }
    } catch (err) {
      for (const k of dirty) setSaveStates((s) => ({ ...s, [k]: 'error' }));
      if (window.gmToast) {
        window.gmToast({ type: 'error', title: 'No se pudo guardar', msg: err instanceof Error ? err.message : String(err) });
      }
    }
  }

  function onChange(key: string, value: string) {
    setDrafts((d) => ({ ...d, [key]: value }));
    setSaveStates((s) => ({ ...s, [key]: 'idle' }));
    dirtyRef.current.add(key);
    scheduleSave(key);
  }

  function acceptWelcome() {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('gp_welcome_accepted', '1');
    }
    setShowWelcome(false);
  }

  async function exportJson() {
    if (!data) return;
    try {
      const res = await fetch('/api/guardpod/export', { ...fetchOpts });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `guardpod-answers-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      if (window.gmToast) window.gmToast({ type: 'success', title: 'Exportado', msg: 'JSON descargado' });
    } catch (err) {
      if (window.gmToast) window.gmToast({ type: 'error', title: 'No se pudo exportar', msg: err instanceof Error ? err.message : String(err) });
    }
  }

  // Cálculo de progreso por sección
  const sectionProgress = useMemo(() => {
    if (!data) return new Map<string, { answered: number; total: number; pct: number }>();
    const map = new Map<string, { answered: number; total: number; pct: number }>();
    for (const s of data.sections) {
      let answered = 0;
      for (const q of s.questions) {
        const v = drafts[q.key];
        if (v !== undefined && v !== null && v !== '') answered++;
      }
      const total = s.questions.length;
      const pct = total > 0 ? Math.round((answered / total) * 1000) / 10 : 0;
      map.set(s.name, { answered, total, pct });
    }
    return map;
  }, [data, drafts]);

  if (loading) {
    return <div className="gp-loading">Cargando cuestionario…</div>;
  }
  if (error || !data) {
    return <div className="gp-error">Error: {error ?? 'sin datos'}</div>;
  }

  const activeSectionObj = data.sections.find((s) => s.name === activeSection) ?? data.sections[0];
  const activeQuestion = activeSectionObj.questions.find((q) => q.key === activeQuestionKey) ?? activeSectionObj.questions[0];

  return (
    <div className="gp-wizard">
      {showWelcome && (
        <div className="gp-welcome-backdrop" role="dialog" aria-modal="true" aria-labelledby="gp-welcome-title">
          <div className="gp-welcome">
            <h2 id="gp-welcome-title">Estás por llenar la base de conocimiento de Guardpod</h2>
            <p>Este cuestionario <strong>no es un formulario de marketing</strong>. No queremos respuestas "bonitas" ni frases pulidas. Queremos la realidad de tu trabajo.</p>
            <p><strong>Responde con lo que has visto en terreno:</strong></p>
            <ul>
              <li>Casos reales (no hipotéticos)</li>
              <li>Frases exactas de clientes (aunque sean ordinarias)</li>
              <li>Objeciones reales (aunque sean injustas)</li>
              <li>Precios reales cobrados (no los "ideales")</li>
              <li>Problemas reales resueltos (no los que el marketing quisiera)</li>
            </ul>
            <p><strong>¿Por qué?</strong> Cada respuesta alimenta directamente la landing <code>guardpod.cl</code>, las respuestas del equipo de ventas, los textos de SEO, las FAQ y los argumentos legales. Una respuesta pulida pero genérica daña el SEO y hace perder ventas. Una respuesta cruda pero específica ranks y convierte.</p>
            <p>Si una pregunta no aplica, márcala como "no sé / saltar" — no inventes. Es mejor un hueco honesto que un dato inventado.</p>
            <div className="gp-welcome-actions">
              <button type="button" className="admin-btn admin-btn-primary" onClick={acceptWelcome}>Entendido, empezar</button>
              <a href="/admin" className="admin-btn admin-btn-secondary">Volver al admin</a>
            </div>
          </div>
        </div>
      )}

      <div className="gp-banner" role="note">
        <span className="gp-banner-icon" aria-hidden="true">💡</span>
        <span>Responde con tu experiencia real. Si no la tienes, márcalo como "no sé". Esto NO es marketing — es la base de <code>guardpod.cl</code>.</span>
      </div>

      <div className="gp-header">
        <div className="gp-header-progress">
          <div className="gp-progress-label">
            <strong>{data.session.answered_count}</strong> / {data.session.total_questions} respuestas
            <span className="gp-progress-pct"> · {data.session.progress_pct}%</span>
          </div>
          <div className="gp-progress-bar">
            <div className="gp-progress-fill" style={{ width: `${data.session.progress_pct}%` }} />
          </div>
        </div>
        <div className="gp-header-actions">
          <button type="button" className="admin-btn admin-btn-secondary" onClick={() => void flushAll()} title="Atajo: Ctrl+S">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Guardar todo
          </button>
          <button type="button" className="admin-btn admin-btn-secondary" onClick={() => void exportJson()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export JSON
          </button>
        </div>
      </div>

      <div className="gp-body">
        <aside className="gp-sidebar" aria-label="Secciones del cuestionario">
          {data.sections.map((s) => {
            const sp = sectionProgress.get(s.name) ?? { answered: 0, total: 0, pct: 0 };
            return (
              <button
                key={s.name}
                type="button"
                className={`gp-section ${s.name === activeSection ? 'active' : ''}`}
                onClick={() => { setActiveSection(s.name); setActiveQuestionKey(s.questions[0]?.key ?? null); }}
              >
                <div className="gp-section-head">
                  <span className="gp-section-name">{s.name.replace(/_/g, ' ')}</span>
                  <span className={`gp-section-badge ${sp.pct === 100 ? 'complete' : sp.pct > 0 ? 'partial' : 'empty'}`}>
                    {sp.answered}/{sp.total}
                  </span>
                </div>
                <div className="gp-section-bar">
                  <div className="gp-section-bar-fill" style={{ width: `${sp.pct}%` }} />
                </div>
              </button>
            );
          })}
        </aside>

        <main className="gp-main">
          {activeQuestion ? (
            <QuestionCard
              key={activeQuestion.key}
              question={activeQuestion}
              value={drafts[activeQuestion.key] ?? ''}
              saveState={saveStates[activeQuestion.key] ?? 'idle'}
              lastSavedAt={lastSavedAt[activeQuestion.key] ?? null}
              helpOpen={helpOpenKey === activeQuestion.key}
              onHelpToggle={() => setHelpOpenKey(helpOpenKey === activeQuestion.key ? null : activeQuestion.key)}
              onChange={(v) => onChange(activeQuestion.key, v)}
              onSkip={() => onChange(activeQuestion.key, '')}
            />
          ) : (
            <div className="gp-empty">No hay preguntas en esta sección.</div>
          )}

          {activeSectionObj && (
            <div className="gp-nav-buttons">
              {(() => {
                const allQuestions = data.sections.flatMap((s) => s.questions);
                const currentIdx = allQuestions.findIndex((q) => q.key === activeQuestion.key);
                const prev = currentIdx > 0 ? allQuestions[currentIdx - 1] : null;
                const next = currentIdx < allQuestions.length - 1 ? allQuestions[currentIdx + 1] : null;
                return (
                  <>
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary"
                      disabled={!prev}
                      onClick={() => prev && (setActiveSection(prev.section), setActiveQuestionKey(prev.key))}
                    >
                      ← Anterior
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-primary"
                      disabled={!next}
                      onClick={() => next && (setActiveSection(next.section), setActiveQuestionKey(next.key))}
                    >
                      Siguiente →
                    </button>
                  </>
                );
              })()}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function QuestionCard(props: {
  question: Question;
  value: string;
  saveState: SaveState;
  lastSavedAt: string | null;
  helpOpen: boolean;
  onHelpToggle: () => void;
  onChange: (v: string) => void;
  onSkip: () => void;
}) {
  const { question: q, value, saveState, lastSavedAt, helpOpen, onHelpToggle, onChange, onSkip } = props;
  const saveText = saveState === 'saving' ? 'Guardando...' : saveState === 'error' ? '⚠ Reintentando' : saveState === 'saved' && lastSavedAt ? `Guardado ✓ ${fmtTime(lastSavedAt)}` : '';
  const canSkip = !q.real_world_required;

  return (
    <article className={`gp-card ${q.real_world_required ? 'critical' : ''}`}>
      <header className="gp-card-header">
        <h3 className="gp-card-label">
          {q.label}
          {q.required && <span className="gp-req" aria-label="requerida">*</span>}
          {q.real_world_required && <span className="gp-tag-critical" title="Requiere respuesta basada en tu experiencia real">Experiencia real</span>}
        </h3>
        {q.help_text && (
          <button
            type="button"
            className="gp-help-trigger"
            aria-label="Ayuda sobre esta pregunta"
            aria-expanded={helpOpen}
            onClick={onHelpToggle}
          >
            ?
          </button>
        )}
      </header>
      {q.real_world_prompt && (
        <p className="gp-rwp">💬 {q.real_world_prompt}</p>
      )}
      <div className="gp-card-body">
        {renderInput(q, value, onChange)}
      </div>
      <footer className="gp-card-footer">
        <span className={`gp-save-state ${saveState}`}>{saveText}</span>
        <div className="gp-card-actions">
          {canSkip && (
            <button type="button" className="gp-skip-btn" onClick={onSkip}>No sé / saltar</button>
          )}
        </div>
      </footer>
      {helpOpen && q.help_text && (
        <div className="gp-help-popover" role="tooltip">
          <button type="button" className="gp-help-close" aria-label="Cerrar ayuda" onClick={onHelpToggle}>×</button>
          <p>{q.help_text}</p>
        </div>
      )}
    </article>
  );
}

function renderInput(q: Question, value: string, onChange: (v: string) => void) {
  if (q.type === 'textarea') {
    return <textarea className="gp-input gp-textarea" value={value} placeholder={q.real_world_prompt ?? ''} onChange={(e) => onChange(e.target.value)} rows={5} />;
  }
  if (q.type === 'number' || q.type === 'slider') {
    return <input className="gp-input" type="number" value={value} placeholder={q.real_world_prompt ?? ''} onChange={(e) => onChange(e.target.value)} />;
  }
  if (q.type === 'boolean') {
    return (
      <div className="gp-boolean">
        <button type="button" className={`gp-bool-btn ${value === 'true' ? 'on' : ''}`} onClick={() => onChange('true')}>Sí</button>
        <button type="button" className={`gp-bool-btn ${value === 'false' ? 'on' : ''}`} onClick={() => onChange('false')}>No</button>
      </div>
    );
  }
  if (q.type === 'select' && q.options) {
    return (
      <select className="gp-input gp-select" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">— Seleccionar —</option>
        {q.options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  }
  if (q.type === 'multiselect' && q.options) {
    let current: string[] = [];
    try { current = value ? JSON.parse(value) : []; } catch { current = []; }
    return (
      <div className="gp-multiselect">
        {q.options.map((o) => {
          const checked = current.includes(o);
          return (
            <label key={o} className={`gp-multi-chip ${checked ? 'on' : ''}`}>
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => {
                  const next = e.target.checked ? [...current, o] : current.filter((x) => x !== o);
                  onChange(JSON.stringify(next));
                }}
              />
              <span>{o}</span>
            </label>
          );
        })}
      </div>
    );
  }
  if (q.type === 'date') {
    return <input className="gp-input" type="date" value={value} onChange={(e) => onChange(e.target.value)} />;
  }
  if (q.type === 'url') {
    return <input className="gp-input" type="url" value={value} placeholder={q.real_world_prompt ?? 'https://...'} onChange={(e) => onChange(e.target.value)} />;
  }
  if (q.type === 'upload') {
    return (
      <div className="gp-upload">
        <input
          className="gp-input"
          type="text"
          value={value}
          placeholder="URL del archivo (subir a R2 en v5.6.0)"
          onChange={(e) => onChange(e.target.value)}
        />
        <p className="gp-upload-hint">Por ahora pegá la URL. La subida a R2 llega en v5.6.0.</p>
      </div>
    );
  }
  // text por defecto
  return <input className="gp-input" type="text" value={value} placeholder={q.real_world_prompt ?? ''} onChange={(e) => onChange(e.target.value)} />;
}

function fmtTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('es-CL', { timeZone: 'America/Santiago', hour: '2-digit', minute: '2-digit' });
  } catch { return ''; }
}
