'use client';

import { useMemo, useState } from 'react';
import {
  QUESTION_STATS,
  TEXT_QUESTIONS,
  RESPONDENTS,
  FUNNEL,
  TOTAL_VIEWS,
  UNIQUE_RESPONDENTS,
  COMPLETIONS,
} from './data';

const NIMBUS_BLUE = '#0050c3';
const DARK_BLUE = '#171E43';
const GROWTH_PURPLE = '#953e91';

function fmt(n: number) {
  return n.toLocaleString('es-AR');
}

function Pill({ children, color = NIMBUS_BLUE }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 12px',
        borderRadius: 100,
        fontSize: 12,
        fontWeight: 600,
        background: `${color}14`,
        color,
      }}
    >
      {children}
    </span>
  );
}

function ScaleBar({ value, count, max }: { value: number; count: number; max: number }) {
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 14, fontSize: 13, fontWeight: 700, color: DARK_BLUE, textAlign: 'right' }}>
        {value}
      </div>
      <div
        style={{
          flex: 1,
          height: 14,
          background: '#ecebec',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background:
              value >= 4
                ? 'linear-gradient(90deg,#0050c3,#4b9bff)'
                : value === 3
                ? '#A0A3A6'
                : 'linear-gradient(90deg,#ff8f8f,#ef297a)',
            borderRadius: 8,
            transition: 'width 0.6s cubic-bezier(0.19,1,0.22,1)',
          }}
        />
      </div>
      <div style={{ width: 34, fontSize: 13, color: '#6b6e70', textAlign: 'right' }}>{count}</div>
    </div>
  );
}

function QuestionCard({ stat }: { stat: (typeof QUESTION_STATS)[number] }) {
  const max = Math.max(...stat.distribution, 1);
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 16,
        padding: '28px 28px 24px',
        boxShadow:
          '0 24px 48px -12px rgba(50,50,93,0.08), 0 18px 36px -18px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, color: '#8A8D90', fontWeight: 600, marginBottom: 6 }}>
            {stat.step}
          </div>
          <h3 style={{ margin: 0, fontSize: 18, color: DARK_BLUE, lineHeight: 1.3, maxWidth: 460 }}>
            {stat.title}
          </h3>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 34, fontWeight: 800, color: NIMBUS_BLUE, lineHeight: 1 }}>
            {stat.average.toFixed(2)}
          </div>
          <div style={{ fontSize: 12, color: '#8A8D90' }}>promedio actual · sobre 5</div>
        </div>
      </div>

      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[5, 4, 3, 2, 1].map((v) => (
          <ScaleBar key={v} value={v} count={stat.distribution[v - 1]} max={max} />
        ))}
      </div>

      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <Pill>{stat.totalResponses} respuestas totales</Pill>
      </div>
    </div>
  );
}

function TextQuestionCard({ q }: { q: (typeof TEXT_QUESTIONS)[number] }) {
  const answers = RESPONDENTS.map((r) => r[q.key]).filter((a) => a && a.trim().length > 0);
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 16,
        padding: '28px',
        boxShadow: '0 24px 48px -12px rgba(50,50,93,0.08), 0 18px 36px -18px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ fontSize: 12, color: '#8A8D90', fontWeight: 600, marginBottom: 6 }}>{q.step}</div>
      <h3 style={{ margin: '0 0 4px', fontSize: 18, color: DARK_BLUE, lineHeight: 1.3 }}>{q.title}</h3>
      <div style={{ marginBottom: 16 }}>
        <Pill color={GROWTH_PURPLE}>{answers.length} respuestas con contenido</Pill>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 320, overflowY: 'auto' }}>
        {answers.map((a, i) => (
          <div
            key={i}
            style={{
              background: '#f5faff',
              borderRadius: 12,
              padding: '12px 16px',
              fontSize: 14,
              color: '#343537',
              lineHeight: 1.5,
            }}
          >
            “{a}”
          </div>
        ))}
      </div>
    </div>
  );
}

function ScoreBadge({ value }: { value: string }) {
  if (!value) return <span style={{ color: '#c7c9cb' }}>—</span>;
  const n = parseInt(value, 10);
  const color = n >= 4 ? '#0ca76b' : n === 3 ? '#8A8D90' : '#e0334f';
  return (
    <span
      style={{
        display: 'inline-flex',
        width: 26,
        height: 26,
        borderRadius: '50%',
        background: `${color}18`,
        color,
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: 13,
      }}
    >
      {n}
    </span>
  );
}

function RespondentsTable() {
  const [query, setQuery] = useState('');
  const [sortDesc, setSortDesc] = useState(true);

  const filtered = useMemo(() => {
    let rows = RESPONDENTS.filter(
      (r) =>
        r.email.toLowerCase().includes(query.toLowerCase()) ||
        r.storeId.includes(query)
    );
    rows = rows.sort((a, b) => (sortDesc ? (a.fecha < b.fecha ? 1 : -1) : a.fecha < b.fecha ? -1 : 1));
    return rows;
  }, [query, sortDesc]);

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 16,
        padding: 24,
        boxShadow: '0 24px 48px -12px rgba(50,50,93,0.08), 0 18px 36px -18px rgba(0,0,0,0.06)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: 18, color: DARK_BLUE }}>
            Respondientes ({filtered.length})
          </h3>
          <div style={{ fontSize: 13, color: '#8A8D90', marginTop: 2 }}>
            Email, Store ID y respuesta a cada pregunta
          </div>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por email o Store ID..."
          style={{
            border: '1px solid #E7E8E9',
            borderRadius: 100,
            padding: '10px 18px',
            fontSize: 14,
            width: 260,
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #E7E8E9' }}>
              <th
                style={{ padding: '10px 12px', cursor: 'pointer', whiteSpace: 'nowrap', color: '#8A8D90' }}
                onClick={() => setSortDesc((s) => !s)}
              >
                Fecha {sortDesc ? '↓' : '↑'}
              </th>
              <th style={{ padding: '10px 12px', color: '#8A8D90' }}>Email</th>
              <th style={{ padding: '10px 12px', color: '#8A8D90' }}>Store ID</th>
              <th style={{ padding: '10px 12px', color: '#8A8D90', textAlign: 'center' }}>Satisf. Activ.</th>
              <th style={{ padding: '10px 12px', color: '#8A8D90', textAlign: 'center' }}>Ayuda Activ.</th>
              <th style={{ padding: '10px 12px', color: '#8A8D90', textAlign: 'center' }}>Exp. Ventas</th>
              <th style={{ padding: '10px 12px', color: '#8A8D90', minWidth: 220 }}>Qué valora</th>
              <th style={{ padding: '10px 12px', color: '#8A8D90', minWidth: 220 }}>Qué mejorar</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                <td style={{ padding: '10px 12px', whiteSpace: 'nowrap', color: '#8A8D90' }}>
                  {new Date(r.fecha).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td style={{ padding: '10px 12px', fontWeight: 600, color: DARK_BLUE }}>{r.email}</td>
                <td style={{ padding: '10px 12px', color: '#343537' }}>{r.storeId}</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                  <ScoreBadge value={r.q1_satisfaccion_activacion} />
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                  <ScoreBadge value={r.q2_ayuda_activacion} />
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                  <ScoreBadge value={r.q3_experiencia_ventas} />
                </td>
                <td style={{ padding: '10px 12px', color: '#343537' }}>{r.q4_valoras || '—'}</td>
                <td style={{ padding: '10px 12px', color: '#343537' }}>{r.q5_mejorar || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FunnelStrip() {
  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        paddingBottom: 4,
      }}
    >
      {FUNNEL.map((f, i) => (
        <div
          key={f.name}
          style={{
            flex: '1 0 140px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 12,
            padding: '14px 16px',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginBottom: 6 }}>
            Paso {i + 1}
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1 }}>
            {fmt(f.views)}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>{f.name}</div>
        </div>
      ))}
    </div>
  );
}

export default function Page() {
  const [tab, setTab] = useState<'resultados' | 'respondientes'>('resultados');

  return (
    <main style={{ minHeight: '100vh' }}>
      {/* HERO */}
      <div
        style={{
          background:
            'radial-gradient(203.73% 209.35% at 3.75% 130.93%, #0050c3 0%, #00298f 29.81%, #080558 65.38%, #010b23 100%)',
          padding: '56px 24px 40px',
        }}
      >
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <Pill color="#BCDFFD">Pago Nube · AR</Pill>
            <Pill color="#BCDFFD">Lifecycle / Fintech & Growth</Pill>
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(28px, 4vw, 42px)',
              color: '#fff',
              lineHeight: 1.15,
              maxWidth: 760,
            }}
          >
            Encuesta CSAT — Resultados
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, marginTop: 10, maxWidth: 640 }}>
            Encuesta in-app en Userflow que intercepta a merchants activados en Pago Nube para medir
            satisfacción con la activación, el acompañamiento y las primeras ventas.
          </p>

          <div
            style={{
              display: 'flex',
              gap: 32,
              marginTop: 32,
              marginBottom: 24,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ fontSize: 38, fontWeight: 800, color: '#fff' }}>{fmt(TOTAL_VIEWS)}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>Views totales</div>
            </div>
            <div>
              <div style={{ fontSize: 38, fontWeight: 800, color: '#fff' }}>{UNIQUE_RESPONDENTS}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>Merchants que respondieron</div>
            </div>
            <div>
              <div style={{ fontSize: 38, fontWeight: 800, color: '#fff' }}>
                {((COMPLETIONS / TOTAL_VIEWS) * 100).toFixed(1)}%
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>Tasa de finalización</div>
            </div>
          </div>

          <FunnelStrip />
        </div>
      </div>

      {/* TABS */}
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '32px 24px 80px' }}>
        <div
          style={{
            display: 'inline-flex',
            background: '#ecebec',
            borderRadius: 100,
            padding: 4,
            marginBottom: 28,
          }}
        >
          {(
            [
              ['resultados', 'Resultados'],
              ['respondientes', 'Respondientes'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                border: 'none',
                background: tab === key ? '#fff' : 'transparent',
                color: tab === key ? DARK_BLUE : '#6b6e70',
                fontWeight: 600,
                fontSize: 14,
                padding: '10px 22px',
                borderRadius: 100,
                cursor: 'pointer',
                boxShadow: tab === key ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'resultados' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {QUESTION_STATS.map((stat) => (
              <QuestionCard key={stat.key} stat={stat} />
            ))}
            {TEXT_QUESTIONS.map((q) => (
              <TextQuestionCard key={q.key} q={q} />
            ))}
          </div>
        ) : (
          <RespondentsTable />
        )}
      </div>
    </main>
  );
}
