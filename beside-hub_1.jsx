import React, { useState, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar,
  AreaChart, Area, Cell,
} from "recharts";
import {
  Star, Trophy, Bell, AlertTriangle, Target, Lightbulb, BookOpen,
  LayoutDashboard, Users, ClipboardCheck, ChevronDown, ChevronRight,
  Lock, Mail, Check, Award, Send, Home, LogOut, Heart, Sparkles,
} from "lucide-react";

/* ============================== TOKENS / DADOS ============================== */

const INK = "#191D30";
const SLATE = "#5B6480";
const AMBER = "#D99A3C";
const TEAL = "#3E8E7E";
const ROSE = "#C76B6B";
const CHART = [INK, SLATE, AMBER, TEAL, ROSE, "#8A7BB0"];

const PORTAIS = ["Manual da Web", "GuiaDin", "Embarkei", "Syne"];
const CARGOS = ["Redator(a)", "Redator(a) Sênior", "Revisor(a)", "Estagiário(a)"];

const TEAM = [
  { id: 1, name: "Ana Beatriz Lima", cargo: "Redator(a) Sênior", textos: 92 },
  { id: 2, name: "Bruno Tavares", cargo: "Redator(a)", textos: 140 },
  { id: 3, name: "Carla Mendonça", cargo: "Redator(a)", textos: 120 },
  { id: 4, name: "Diego Souza", cargo: "Redator(a)", textos: 110 },
  { id: 5, name: "Eduarda Pires", cargo: "Estagiário(a)", textos: 58 },
  { id: 6, name: "Felipe Castro", cargo: "Redator(a) Sênior", textos: 88 },
  { id: 7, name: "Giovana Reis", cargo: "Redator(a)", textos: 132 },
  { id: 8, name: "Henrique Alves", cargo: "Redator(a)", textos: 125 },
  { id: 9, name: "Isabela Nunes", cargo: "Revisor(a)", textos: 76 },
  { id: 10, name: "João Pedro Rocha", cargo: "Redator(a)", textos: 148 },
  { id: 11, name: "Karina Dias", cargo: "Estagiário(a)", textos: 54 },
  { id: 12, name: "Lucas Ferreira", cargo: "Redator(a) Sênior", textos: 96 },
  { id: 13, name: "Marina Costa", cargo: "Redator(a)", textos: 134 },
  { id: 14, name: "Nathalia Gomes", cargo: "Revisor(a)", textos: 70 },
  { id: 15, name: "Otávio Ramos", cargo: "Redator(a)", textos: 152 },
  { id: 16, name: "Patrícia Melo", cargo: "Redator(a)", textos: 128 },
];
const MANAGER = { id: 0, name: "Beatriz Andrade", cargo: "Coordenação de Redação", isManager: true };

const ASPECTS = [
  { key: "volume", label: "Volume de trabalho", help: "Foi adequado?" },
  { key: "briefings", label: "Clareza dos briefings", help: "" },
  { key: "distribuicao", label: "Organização da distribuição de pautas", help: "" },
  { key: "comlideranca", label: "Comunicação com a liderança", help: "" },
  { key: "comequipe", label: "Comunicação com a equipe", help: "" },
  { key: "motivacao", label: "Nível de motivação", help: "" },
  { key: "produtividade", label: "Produtividade", help: "" },
  { key: "concentracao", label: "Concentração durante a semana", help: "" },
  { key: "equilibrio", label: "Equilíbrio entre qualidade e velocidade", help: "" },
  { key: "estresse", label: "Nível de estresse", help: "1 = muito alto · 5 = sob controle" },
  { key: "confianca", label: "Confiança para tirar dúvidas", help: "" },
  { key: "satisfacao", label: "Satisfação geral com a semana", help: "" },
];

const MOODS = [
  { key: "motivado", emoji: "😊", label: "Muito motivado(a)", color: TEAL },
  { key: "feliz", emoji: "😄", label: "Feliz", color: "#4BA88E" },
  { key: "tranquilo", emoji: "😌", label: "Tranquilo(a)", color: "#6FA8C7" },
  { key: "neutro", emoji: "😐", label: "Neutro(a)", color: SLATE },
  { key: "desafiado", emoji: "🤔", label: "Desafiado(a)", color: "#8A7BB0" },
  { key: "sobrecarregado", emoji: "😓", label: "Sobrecarregado(a)", color: "#C98A3C" },
  { key: "desmotivado", emoji: "😞", label: "Desmotivado(a)", color: ROSE },
  { key: "frustrado", emoji: "😣", label: "Frustrado(a)", color: "#B05757" },
  { key: "cansado", emoji: "😴", label: "Cansado(a)", color: "#9398A8" },
  { key: "orgulhoso", emoji: "🚀", label: "Orgulhoso(a)", color: AMBER },
];
const moodOf = (k) => MOODS.find((m) => m.key === k) || MOODS[3];

const COMPETENCIAS = [
  "Qualidade da escrita", "Atenção às diretrizes dos briefings", "Organização",
  "Cumprimento de prazos", "Comunicação", "Proatividade", "Autonomia",
  "Evolução em relação às últimas semanas", "Colaboração com a equipe", "Confiabilidade",
];

const POS_POOL = [
  "Entreguei todas as pautas no prazo sem precisar correr no fim.",
  "Os briefings dessa semana vieram muito mais claros.",
  "Consegui manter o foco mesmo com bastante demanda.",
  "Recebi um feedback ótimo do cliente do Manual da Web.",
  "A troca com a equipe destravou um texto difícil.",
  "Bati minha meta de prints sem perder qualidade.",
  "Aprendi bastante revisando os textos da Carla.",
  "Ritmo equilibrado, deu pra respirar entre as entregas.",
];
const MELHORIA_POOL = [
  "A distribuição de pautas chegou meio em cima da hora.",
  "Poderíamos alinhar melhor o tom antes de começar.",
  "Faltou clareza em um dos briefings de SEO.",
  "Tive retrabalho por mudança de escopo no meio.",
  "Senti falta de um momento de revisão coletiva.",
  "O volume na quinta ficou concentrado demais.",
];
const SUG_POOL = [
  "Um template fixo de briefing por portal ajudaria muito.",
  "Que tal um canal só pra dúvidas rápidas de SEO?",
  "Reunião de pauta na segunda de manhã, curtinha.",
  "Banco de títulos aprovados pra consultar.",
  "Revisão em dupla nas semanas mais pesadas.",
];

/* RNG determinístico pra dados de exemplo estáveis */
function rng(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

const WEEKS = Array.from({ length: 12 }, (_, i) => `S${i + 1}`);

/* Gera avaliações dos redatores: persons x weeks x aspectos */
function buildData() {
  const evals = {}; // evals[personId][weekIdx] = { aspect:val, mood, pos, melhoria, destaqueId }
  TEAM.forEach((p, i) => {
    evals[p.id] = [];
    const base = 3.1 + (i % 4) * 0.35;
    const r = rng(p.id * 97 + 7);
    for (let w = 0; w < WEEKS.length; w++) {
      const trend = w * 0.04;
      const row = {};
      ASPECTS.forEach((a, ai) => {
        let v = Math.round(base + trend + (r() - 0.5) * 1.6 + (ai % 3 === 0 ? 0.2 : 0));
        row[a.key] = clamp(v, 2, 5);
      });
      // moods ponderados pela satisfação
      const sat = row.satisfacao;
      const pool = sat >= 4 ? ["motivado", "feliz", "orgulhoso", "tranquilo"]
        : sat === 3 ? ["neutro", "tranquilo", "desafiado", "cansado"]
        : ["sobrecarregado", "desmotivado", "frustrado", "cansado"];
      row.mood = pool[Math.floor(r() * pool.length)];
      row.pos = POS_POOL[Math.floor(r() * POS_POOL.length)];
      row.melhoria = MELHORIA_POOL[Math.floor(r() * MELHORIA_POOL.length)];
      // vota num destaque (alguém diferente de si)
      let target = TEAM[Math.floor(r() * TEAM.length)];
      if (target.id === p.id) target = TEAM[(i + 1) % TEAM.length];
      row.destaqueId = target.id;
      row.destaqueMotivo = "Sempre ajuda quando o time precisa e entrega com consistência.";
      row.sugestao = r() > 0.6 ? SUG_POOL[Math.floor(r() * SUG_POOL.length)] : "";
      evals[p.id].push(row);
    }
  });
  // Casos plantados pra disparar alertas (última semana)
  const last = WEEKS.length - 1;
  evals[4][last].motivacao = 1;
  evals[4][last].mood = "sobrecarregado";
  evals[7][last].comequipe = 2; evals[7][last - 1].comequipe = 2;
  evals[7][last].comlideranca = 2;
  evals[11][last].mood = "sobrecarregado";

  // Avaliações de competência do gestor (por pessoa: atual + anterior)
  const comp = {};
  TEAM.forEach((p, i) => {
    const r = rng(p.id * 31 + 13);
    const prev = {}, now = {};
    COMPETENCIAS.forEach((c) => {
      const v = clamp(Math.round(3 + (i % 3) * 0.4 + (r() - 0.4) * 1.5), 2, 5);
      prev[c] = v;
      now[c] = clamp(v + (r() > 0.5 ? 1 : 0), 2, 5);
    });
    comp[p.id] = {
      prev, now,
      feedback:
        "Sua escrita está mais limpa e direta a cada semana — dá pra ver a evolução. " +
        "Atenção aos prazos das pautas mais longas: comece o rascunho um dia antes. " +
        "Continue puxando as dúvidas de SEO, isso fortalece o time todo.",
    };
  });
  return { evals, comp };
}
const DATA = buildData();

/* ============================== CÁLCULOS ============================== */

const weekAvg = (row) => {
  const vals = ASPECTS.map((a) => row[a.key]);
  return vals.reduce((s, v) => s + v, 0) / vals.length;
};
const personWeekAvg = (pid, w) => weekAvg(DATA.evals[pid][w]);

function teamWeeklyAvg() {
  return WEEKS.map((wk, w) => {
    const vals = TEAM.map((p) => personWeekAvg(p.id, w));
    return { week: wk, media: +(vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(2) };
  });
}
function destaqueTally(w) {
  const t = {};
  TEAM.forEach((p) => { const d = DATA.evals[p.id][w].destaqueId; t[d] = (t[d] || 0) + 1; });
  return t;
}
function topDestaque(w) {
  const t = destaqueTally(w);
  let best = null, n = -1;
  Object.entries(t).forEach(([id, c]) => { if (c > n) { n = c; best = +id; } });
  return { person: TEAM.find((p) => p.id === best), count: n };
}
function moodCountsWeek(w) {
  const c = {};
  TEAM.forEach((p) => { const m = DATA.evals[p.id][w].mood; c[m] = (c[m] || 0) + 1; });
  return c;
}
function teamMoodWeek(w) {
  const c = moodCountsWeek(w);
  let best = "neutro", n = -1;
  Object.entries(c).forEach(([m, k]) => { if (k > n) { n = k; best = m; } });
  return best;
}

/* ============================== UI BÁSICOS ============================== */

const Logo = ({ light }) => (
  <div className="logo">
    <svg width="34" height="34" viewBox="0 0 100 100" aria-hidden>
      <path
        d="M20 88 C20 50 20 30 36 18 C50 8 72 12 78 30 C84 48 70 62 52 60 C38 58 30 48 34 36"
        fill="none" stroke={light ? "#fff" : INK} strokeWidth="11"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
    <div className="logo-txt">
      <span className="logo-1" style={{ color: light ? "#fff" : INK }}>beside</span>
      <span className="logo-2" style={{ color: light ? "#A9AEC2" : SLATE }}>hub</span>
    </div>
  </div>
);

function Stars({ value, onChange, size = 22 }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="stars" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => {
        const active = (hover || value) >= n;
        return (
          <button
            key={n} type="button" className="starbtn"
            onMouseEnter={() => onChange && setHover(n)}
            onClick={() => onChange && onChange(n)}
            style={{ cursor: onChange ? "pointer" : "default" }}
            aria-label={`${n} estrela${n > 1 ? "s" : ""}`}
          >
            <Star size={size} fill={active ? AMBER : "none"} color={active ? AMBER : "#CDD0DA"} strokeWidth={1.6} />
          </button>
        );
      })}
    </div>
  );
}

const Avatar = ({ name, size = 36, color = INK }) => {
  const initials = name.split(" ").map((x) => x[0]).slice(0, 2).join("");
  return (
    <div className="avatar" style={{ width: size, height: size, background: color, fontSize: size * 0.38 }}>
      {initials}
    </div>
  );
};

const Card = ({ children, className = "", style }) => (
  <div className={`card ${className}`} style={style}>{children}</div>
);
const Eyebrow = ({ children }) => <div className="eyebrow">{children}</div>;
const Stat = ({ value, label, sub, accent }) => (
  <div className="stat">
    <div className="stat-v" style={{ color: accent || INK }}>{value}</div>
    <div className="stat-l">{label}</div>
    {sub && <div className="stat-s">{sub}</div>}
  </div>
);

const scoreColor = (v) =>
  v >= 4.3 ? TEAL : v >= 3.6 ? "#7BA88E" : v >= 3 ? AMBER : v >= 2.4 ? "#C98A3C" : ROSE;

/* ============================== TELAS — REDATOR ============================== */

function WriterHome({ me }) {
  const w = WEEKS.length - 1;
  const td = topDestaque(w);
  const teamAvg = teamWeeklyAvg();
  const mediaSemana = teamAvg[w].media;
  const moodK = teamMoodWeek(w);
  const respondentes = TEAM.length;
  const minhasCitacoes = TEAM.filter((p) => DATA.evals[p.id][w].destaqueId === me.id).length;
  const frase = useMemo(() => {
    const all = TEAM.map((p) => DATA.evals[p.id][w].pos);
    return all[Math.floor(Math.random() * all.length)];
  }, [w]);
  const sou = td.person.id === me.id;

  return (
    <div className="stack">
      <div className="banner">
        <div>
          <Eyebrow>Resumo de sexta · 18h00</Eyebrow>
          <h2 className="h2">A semana fechou com média {mediaSemana.toFixed(1)} ⭐</h2>
          <p className="muted">Resultado coletivo, sem nomes. {respondentes} pessoas responderam o check-in desta semana.</p>
        </div>
        <div className="banner-mood">
          <div className="big-emoji">{moodOf(moodK).emoji}</div>
          <div className="muted sm">sentimento médio do time</div>
          <div className="strong">{moodOf(moodK).label}</div>
        </div>
      </div>

      {minhasCitacoes > 0 && (
        <Card className="notif">
          <Bell size={20} color={AMBER} />
          <div>
            <strong>Você foi lembrado(a) {minhasCitacoes}x esta semana</strong>
            <div className="muted sm">{minhasCitacoes} {minhasCitacoes > 1 ? "colegas escolheram" : "colega escolheu"} você como destaque. 👏</div>
          </div>
        </Card>
      )}

      <div className="grid-2">
        <Card>
          <Eyebrow><Trophy size={13} /> Menção honrosa da semana</Eyebrow>
          <div className="honra">
            <Avatar name={td.person.name} size={56} color={AMBER} />
            <div>
              <div className="honra-nome">{sou ? "Você! 🎉" : td.person.name}</div>
              <div className="muted sm">{td.person.cargo} · {td.person.textos} textos/mês</div>
              <div className="pill amber" style={{ marginTop: 8 }}>{td.count} votos como destaque</div>
            </div>
          </div>
        </Card>

        <Card>
          <Eyebrow><Heart size={13} /> Frase positiva da semana</Eyebrow>
          <p className="quote">“{frase}”</p>
          <div className="muted sm">— escolhida ao acaso entre os comentários da equipe</div>
        </Card>
      </div>

      <Card>
        <Eyebrow><Target size={13} /> Metas da semana</Eyebrow>
        <p className="muted sm" style={{ marginTop: -2, marginBottom: 14 }}>
          O quanto a equipe acredita que cumprimos cada objetivo (média das respostas).
        </p>
        {SEED_GOALS.map((g, i) => (
          <div key={i} className="goal">
            <div className="goal-top"><span>{g.text}</span><strong>{g.crenca.toFixed(1)}/5</strong></div>
            <div className="bar"><div className="bar-fill" style={{ width: `${(g.crenca / 5) * 100}%`, background: scoreColor(g.crenca) }} /></div>
          </div>
        ))}
      </Card>
    </div>
  );
}

const SEED_GOALS = [
  { text: "Reduzir atrasos nas entregas", crenca: 3.8, ativo: true },
  { text: "Melhorar a comunicação entre portais", crenca: 3.2, ativo: true },
  { text: "Aumentar a qualidade dos prints", crenca: 4.1, ativo: true },
];

function WriterForm({ me, onSubmit }) {
  const [ratings, setRatings] = useState({});
  const [mood, setMood] = useState(null);
  const [pos, setPos] = useState("");
  const [melhoria, setMelhoria] = useState("");
  const [destaque, setDestaque] = useState(null);
  const [motivo, setMotivo] = useState("");
  const [goals, setGoals] = useState({});
  const [sugestao, setSugestao] = useState("");
  const [done, setDone] = useState(false);

  const total = ASPECTS.length;
  const filled = Object.keys(ratings).length;
  const ok = filled === total && mood && pos.trim() && melhoria.trim() && destaque;

  if (done) {
    return (
      <Card className="center-card">
        <div className="check-circle"><Check size={30} color="#fff" /></div>
        <h2 className="h2">Check-in enviado 🙌</h2>
        <p className="muted">Obrigada por reservar esse minuto. Suas respostas vão direto e em sigilo para a coordenação — só a média aparece para o time. Seu histórico já foi atualizado.</p>
        <button className="btn btn-primary" onClick={() => { setDone(false); setRatings({}); setMood(null); setPos(""); setMelhoria(""); setDestaque(null); setMotivo(""); setGoals({}); setSugestao(""); }}>
          Ver de novo
        </button>
      </Card>
    );
  }

  return (
    <div className="stack">
      <div className="form-head">
        <Eyebrow>Disponível toda sexta-feira</Eyebrow>
        <h2 className="h2">Como foi sua semana, {me.name.split(" ")[0]}?</h2>
        <p className="muted">De 1 a 5 estrelas — 1 é ruim, 5 é perfeito. Leva uns 3 minutos.</p>
        <div className="progress"><div className="progress-fill" style={{ width: `${(filled / total) * 100}%` }} /></div>
        <div className="muted sm">{filled} de {total} aspectos avaliados</div>
      </div>

      <Card>
        {ASPECTS.map((a) => (
          <div key={a.key} className="rate-row">
            <div>
              <div className="rate-label">{a.label}</div>
              {a.help && <div className="muted sm">{a.help}</div>}
            </div>
            <Stars value={ratings[a.key] || 0} onChange={(v) => setRatings({ ...ratings, [a.key]: v })} />
          </div>
        ))}
      </Card>

      <Card>
        <div className="rate-label">Escolha um sentimento para definir a semana</div>
        <div className="mood-grid">
          {MOODS.map((m) => (
            <button key={m.key} type="button" className={`moodchip ${mood === m.key ? "on" : ""}`} onClick={() => setMood(m.key)}>
              <span className="moodchip-e">{m.emoji}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </Card>

      <div className="grid-2">
        <Card>
          <div className="rate-label">✅ 1 ponto positivo da semana</div>
          <textarea className="input" rows={3} value={pos} onChange={(e) => setPos(e.target.value)} placeholder="O que funcionou bem?" />
        </Card>
        <Card>
          <div className="rate-label">🔧 1 melhoria identificada</div>
          <textarea className="input" rows={3} value={melhoria} onChange={(e) => setMelhoria(e.target.value)} placeholder="O que poderia ter sido melhor?" />
        </Card>
      </div>

      <Card>
        <div className="rate-label"><Trophy size={15} color={AMBER} /> Destaque da semana</div>
        <p className="muted sm">Escolha uma pessoa do time que merece reconhecimento.</p>
        <select className="input select" value={destaque || ""} onChange={(e) => setDestaque(+e.target.value)}>
          <option value="">Selecione um(a) colega…</option>
          {TEAM.filter((p) => p.id !== me.id).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <textarea className="input" rows={2} value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Por quê? (justificativa curta)" style={{ marginTop: 10 }} />
      </Card>

      <Card>
        <div className="rate-label"><Target size={15} /> Metas da semana</div>
        <p className="muted sm">O quanto você acredita que a equipe cumpriu cada objetivo?</p>
        {SEED_GOALS.map((g, i) => (
          <div key={i} className="rate-row">
            <div className="rate-label" style={{ fontWeight: 500 }}>{g.text}</div>
            <Stars value={goals[i] || 0} onChange={(v) => setGoals({ ...goals, [i]: v })} />
          </div>
        ))}
      </Card>

      <Card>
        <div className="rate-label"><Lightbulb size={15} color={AMBER} /> Existe algo que poderia facilitar seu trabalho?</div>
        <textarea className="input" rows={3} value={sugestao} onChange={(e) => setSugestao(e.target.value)} placeholder="Resposta aberta — ideias e sugestões são bem-vindas." />
      </Card>

      <div className="submit-bar">
        <span className="muted sm">{ok ? "Tudo pronto para enviar." : "Preencha os aspectos, o sentimento, os comentários e o destaque."}</span>
        <button className="btn btn-primary" disabled={!ok} onClick={() => { onSubmit && onSubmit(); setDone(true); }}>
          <Send size={16} /> Enviar check-in da semana
        </button>
      </div>
    </div>
  );
}

function WriterHistory({ me }) {
  const semanal = WEEKS.map((wk, w) => ({ week: wk, media: +personWeekAvg(me.id, w).toFixed(2) }));
  const meses = [0, 1, 2].map((m) => {
    const ws = [0, 1, 2, 3].map((k) => m * 4 + k);
    const v = ws.reduce((s, w) => s + personWeekAvg(me.id, w), 0) / ws.length;
    return { mes: `Mês ${m + 1}`, media: +v.toFixed(2) };
  });
  const sentimentos = WEEKS.map((wk, w) => ({ week: wk, mood: DATA.evals[me.id][w].mood }));
  const elogios = [];
  TEAM.forEach((p) => WEEKS.forEach((wk, w) => {
    if (DATA.evals[p.id][w].destaqueId === me.id)
      elogios.push({ from: p.name, week: wk, text: DATA.evals[p.id][w].destaqueMotivo });
  }));
  const vezesDestaque = WEEKS.map((wk, w) =>
    ({ week: wk, n: TEAM.filter((p) => DATA.evals[p.id][w].destaqueId === me.id).length }));
  const totalDestaque = vezesDestaque.reduce((s, x) => s + x.n, 0);
  const mediaGeral = (semanal.reduce((s, x) => s + x.media, 0) / semanal.length).toFixed(2);

  return (
    <div className="stack">
      <div className="row-3">
        <Card><Stat value={mediaGeral} label="Sua média geral" sub="nas 12 semanas" accent={scoreColor(+mediaGeral)} /></Card>
        <Card><Stat value={totalDestaque} label="Vezes como destaque" sub="lembrado pelo time" accent={AMBER} /></Card>
        <Card><Stat value={elogios.length} label="Elogios recebidos" sub="reconhecimentos" accent={TEAL} /></Card>
      </div>

      <Card>
        <Eyebrow>Sua média semana a semana</Eyebrow>
        <ResponsiveContainer width="100%" height={230}>
          <LineChart data={semanal} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="#EDEEF2" vertical={false} />
            <XAxis dataKey="week" tick={tick} axisLine={axL} tickLine={false} />
            <YAxis domain={[1, 5]} tick={tick} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tt} />
            <Line type="monotone" dataKey="media" stroke={INK} strokeWidth={2.5} dot={{ r: 3, fill: INK }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid-2">
        <Card>
          <Eyebrow>Evolução mês a mês</Eyebrow>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={meses} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
              <CartesianGrid stroke="#EDEEF2" vertical={false} />
              <XAxis dataKey="mes" tick={tick} axisLine={axL} tickLine={false} />
              <YAxis domain={[0, 5]} tick={tick} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tt} cursor={{ fill: "#F3F4F7" }} />
              <Bar dataKey="media" radius={[6, 6, 0, 0]}>
                {meses.map((m, i) => <Cell key={i} fill={scoreColor(m.media)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <Eyebrow>Histórico de sentimentos</Eyebrow>
          <div className="mood-strip">
            {sentimentos.map((s, i) => (
              <div key={i} className="mood-cell" title={`${s.week}: ${moodOf(s.mood).label}`}>
                <span>{moodOf(s.mood).emoji}</span>
                <small>{s.week}</small>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <Eyebrow><Award size={13} /> Elogios que você recebeu</Eyebrow>
        {elogios.length === 0 && <p className="muted">Ainda sem elogios registrados.</p>}
        <div className="stack-sm">
          {elogios.slice(0, 6).map((e, i) => (
            <div key={i} className="elogio">
              <Avatar name={e.from} size={32} color={SLATE} />
              <div>
                <div className="sm strong">{e.from} <span className="muted">· {e.week}</span></div>
                <div className="muted sm">“{e.text}”</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function WriterFeedback({ me }) {
  const c = DATA.comp[me.id];
  const radar = COMPETENCIAS.map((k) => ({ comp: k.length > 16 ? k.slice(0, 15) + "…" : k, full: k, atual: c.now[k], anterior: c.prev[k] }));
  return (
    <div className="stack">
      <Card className="private-head">
        <Lock size={18} color={INK} />
        <div>
          <strong>Feedback privado da coordenação</strong>
          <div className="muted sm">Só você enxerga esta página. Nenhum colega tem acesso à sua avaliação individual.</div>
        </div>
      </Card>

      <Card>
        <Eyebrow>Suas competências — avaliação atual vs. anterior</Eyebrow>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={radar} outerRadius="72%">
            <PolarGrid stroke="#E3E4EA" />
            <PolarAngleAxis dataKey="comp" tick={{ fontSize: 10, fill: SLATE }} />
            <Radar name="Anterior" dataKey="anterior" stroke={SLATE} fill={SLATE} fillOpacity={0.12} />
            <Radar name="Atual" dataKey="atual" stroke={INK} fill={INK} fillOpacity={0.28} />
            <Tooltip contentStyle={tt} />
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid-2">
        <Card>
          <Eyebrow>Notas por competência</Eyebrow>
          <div className="stack-sm">
            {COMPETENCIAS.map((k) => (
              <div key={k} className="comp-row">
                <span className="sm">{k}</span>
                <div className="comp-right">
                  <Stars value={c.now[k]} size={15} />
                  {c.now[k] > c.prev[k] && <span className="pill teal sm">↑</span>}
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="feedback-card">
          <Eyebrow><Sparkles size={13} /> Feedback privado</Eyebrow>
          <p className="feedback-txt">{c.feedback}</p>
          <div className="muted sm">— reconhecimento, orientação ou ponto de desenvolvimento da coordenação.</div>
        </Card>
      </div>
    </div>
  );
}

/* ============================== GUIA DA REDAÇÃO ============================== */

const GUIA = [
  { t: "Como funciona nossa operação", b: "Visão geral do fluxo: do planejamento de pauta à publicação. Quem faz o quê em cada portal e os SLAs internos de cada etapa." },
  { t: "Fluxo da pauta", b: "Pauta nasce no Monday → briefing → produção → revisão → prints → publicação. Cada card tem responsável e prazo visível." },
  { t: "Como usar o Monday", b: "Onde encontrar suas pautas, como mover os cards de status, anexar prints e marcar a revisão. Sempre atualize o status ao terminar." },
  { t: "Como preencher um briefing", b: "Objetivo do texto, palavra-chave, intenção de busca, links internos obrigatórios, tom e referências. Sem briefing claro, não comece — pergunte." },
  { t: "Manual de SEO", b: "Estrutura de títulos H1–H3, densidade de palavra-chave, meta description, links internos e boas práticas de escaneabilidade." },
  { t: "Guia de prints", b: "Resolução mínima, enquadramento, ferramentas aprovadas e onde salvar. Print é parte da entrega, não um extra." },
  { t: "Checklist antes de entregar um texto", b: "Revisão ortográfica, links funcionando, palavra-chave no título e na intro, prints anexados, formatação no padrão do portal." },
  { t: "Erros mais comuns", b: "Título genérico, intro longa demais, ausência de links internos, esquecer a meta description e prints fora do padrão." },
  { t: "Guia de tom de voz", b: "Como falamos em cada portal: Manual da Web é didático e próximo; GuiaDin é direto; Embarkei é leve; Syne é técnico-elegante." },
  { t: "Padrões de títulos", b: "Fórmulas que funcionam, limite de caracteres, uso de número e promessa clara. Evite clickbait sem entrega." },
  { t: "FAQ", b: "Dúvidas recorrentes do dia a dia: prazos, férias, ferramentas, acesso, processo de revisão e quem procurar para cada coisa." },
  { t: "Novidades da semana", b: "Mudanças de processo, novos portais, ajustes no fluxo. Leia toda segunda para não perder nada." },
  { t: "Comunicados da coordenação", b: "Avisos oficiais, metas do mês, reconhecimentos e recados importantes da liderança." },
];

function Guia({ canEdit }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="stack">
      <div className="form-head">
        <Eyebrow><BookOpen size={13} /> Conhecimento da redação</Eyebrow>
        <h2 className="h2">Guia da Redação</h2>
        <p className="muted">O lugar onde todo redator tira dúvidas. {canEdit && "Como coordenação, você pode editar cada seção."}</p>
      </div>
      {GUIA.map((g, i) => (
        <div key={i} className={`accordion ${open === i ? "open" : ""}`}>
          <button className="acc-head" onClick={() => setOpen(open === i ? -1 : i)}>
            <span className="acc-i">{String(i + 1).padStart(2, "0")}</span>
            <span className="acc-t">{g.t}</span>
            {open === i ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
          {open === i && (
            <div className="acc-body">
              <p>{g.b}</p>
              {canEdit && <button className="btn btn-ghost sm-btn">Editar seção</button>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ============================== TELAS — GESTOR ============================== */

const tick = { fontSize: 11, fill: SLATE };
const axL = { stroke: "#D9DAE1" };
const tt = { borderRadius: 10, border: "1px solid #E3E4EA", fontSize: 12, boxShadow: "0 8px 24px rgba(25,29,48,.08)" };

function ManagerDashboard() {
  const [fVolume, setFVolume] = useState("Todos");
  const [fCargo, setFCargo] = useState("Todos");
  const [fPessoa, setFPessoa] = useState("Todas");
  const [fMood, setFMood] = useState("Todos");

  const volOk = (t) =>
    fVolume === "Todos" ||
    (fVolume === "ate100" && t <= 100) ||
    (fVolume === "100a150" && t > 100 && t <= 150) ||
    (fVolume === "150mais" && t > 150);

  const filtered = useMemo(() =>
    TEAM.filter((p) =>
      volOk(p.textos) &&
      (fCargo === "Todos" || p.cargo === fCargo) &&
      (fPessoa === "Todas" || p.id === +fPessoa)
    ), [fVolume, fCargo, fPessoa]);

  const w = WEEKS.length - 1;
  const evolEquipe = WEEKS.map((wk, wi) => {
    const ids = filtered.map((p) => p.id);
    const v = ids.length ? ids.reduce((s, id) => s + personWeekAvg(id, wi), 0) / ids.length : 0;
    return { week: wk, media: +v.toFixed(2) };
  });
  const sentSemana = WEEKS.slice(-6).map((wk, idx) => {
    const wi = WEEKS.length - 6 + idx;
    const c = moodCountsWeek(wi);
    const pos = (c.motivado || 0) + (c.feliz || 0) + (c.orgulhoso || 0) + (c.tranquilo || 0);
    const neu = (c.neutro || 0) + (c.desafiado || 0);
    const neg = (c.sobrecarregado || 0) + (c.desmotivado || 0) + (c.frustrado || 0) + (c.cansado || 0);
    return { week: wk, Positivo: pos, Neutro: neu, Atenção: neg };
  });
  const ranking = TEAM.map((p) => ({
    name: p.name.split(" ")[0],
    votos: WEEKS.reduce((s, _, wi) => s + TEAM.filter((q) => DATA.evals[q.id][wi].destaqueId === p.id).length, 0),
  })).sort((a, b) => b.votos - a.votos).slice(0, 6);
  const compMedia = COMPETENCIAS.map((c) => {
    const v = filtered.reduce((s, p) => s + DATA.comp[p.id].now[c], 0) / (filtered.length || 1);
    return { comp: c.length > 22 ? c.slice(0, 21) + "…" : c, full: c, media: +v.toFixed(2) };
  }).sort((a, b) => a.media - b.media).slice(0, 6);
  const heat = ASPECTS.map((a) => ({
    aspect: a.label,
    vals: WEEKS.slice(-8).map((_, idx) => {
      const wi = WEEKS.length - 8 + idx;
      const ids = filtered.map((p) => p.id);
      const v = ids.length ? ids.reduce((s, id) => s + DATA.evals[id][wi][a.key], 0) / ids.length : 0;
      return +v.toFixed(1);
    }),
  }));
  const participacao = WEEKS.map((wk, wi) => ({ week: wk, taxa: 72 + ((wi * 7) % 26) }));
  const mediaAtual = evolEquipe[w].media;

  return (
    <div className="stack">
      <div className="form-head">
        <Eyebrow><LayoutDashboard size={13} /> Visão da coordenação</Eyebrow>
        <h2 className="h2">Painel do gestor</h2>
        <p className="muted">Dados agregados das avaliações. Só você tem acesso a esta visão detalhada.</p>
      </div>

      <Card className="filters">
        <FilterSel label="Pessoa" value={fPessoa} onChange={setFPessoa} options={[["Todas", "Todas"], ...TEAM.map((p) => [p.id, p.name])]} />
        <FilterSel label="Cargo" value={fCargo} onChange={setFCargo} options={[["Todos", "Todos"], ...CARGOS.map((c) => [c, c])]} />
        <FilterSel label="Volume mensal" value={fVolume} onChange={setFVolume} options={[["Todos", "Todos"], ["ate100", "Até 100 textos"], ["100a150", "100 a 150"], ["150mais", "150+"]]} />
        <FilterSel label="Sentimento" value={fMood} onChange={setFMood} options={[["Todos", "Todos"], ...MOODS.map((m) => [m.key, `${m.emoji} ${m.label}`])]} />
      </Card>

      <div className="row-4">
        <Card><Stat value={mediaAtual.toFixed(1)} label="Média da semana" accent={scoreColor(mediaAtual)} /></Card>
        <Card><Stat value={filtered.length} label="Pessoas no recorte" /></Card>
        <Card><Stat value={`${participacao[w].taxa}%`} label="Taxa de participação" accent={TEAL} /></Card>
        <Card><Stat value={moodOf(teamMoodWeek(w)).emoji} label="Sentimento médio" sub={moodOf(teamMoodWeek(w)).label} /></Card>
      </div>

      <div className="grid-2">
        <Card>
          <Eyebrow>Evolução da equipe</Eyebrow>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={evolEquipe} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
              <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={INK} stopOpacity={0.22} /><stop offset="100%" stopColor={INK} stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid stroke="#EDEEF2" vertical={false} />
              <XAxis dataKey="week" tick={tick} axisLine={axL} tickLine={false} />
              <YAxis domain={[1, 5]} tick={tick} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tt} />
              <Area type="monotone" dataKey="media" stroke={INK} strokeWidth={2.5} fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <Eyebrow>Sentimentos por semana</Eyebrow>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={sentSemana} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
              <CartesianGrid stroke="#EDEEF2" vertical={false} />
              <XAxis dataKey="week" tick={tick} axisLine={axL} tickLine={false} />
              <YAxis tick={tick} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tt} cursor={{ fill: "#F3F4F7" }} />
              <Bar dataKey="Positivo" stackId="a" fill={TEAL} radius={[0, 0, 0, 0]} />
              <Bar dataKey="Neutro" stackId="a" fill={SLATE} />
              <Bar dataKey="Atenção" stackId="a" fill={ROSE} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <Eyebrow>Mapa de calor das avaliações <span className="muted sm">· média por aspecto, últimas 8 semanas</span></Eyebrow>
        <div className="heat">
          <div className="heat-row heat-head">
            <div className="heat-label" />
            {WEEKS.slice(-8).map((wk) => <div key={wk} className="heat-cell heat-wk">{wk}</div>)}
          </div>
          {heat.map((r) => (
            <div key={r.aspect} className="heat-row">
              <div className="heat-label">{r.aspect}</div>
              {r.vals.map((v, i) => (
                <div key={i} className="heat-cell" style={{ background: scoreColor(v), color: v >= 3 ? "#fff" : "#fff" }}>{v}</div>
              ))}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid-2">
        <Card>
          <Eyebrow>Ranking de destaques</Eyebrow>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart layout="vertical" data={ranking} margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
              <CartesianGrid stroke="#EDEEF2" horizontal={false} />
              <XAxis type="number" tick={tick} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={tick} axisLine={false} tickLine={false} width={64} />
              <Tooltip contentStyle={tt} cursor={{ fill: "#F3F4F7" }} />
              <Bar dataKey="votos" radius={[0, 6, 6, 0]} fill={AMBER} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <Eyebrow>Competências com menor média</Eyebrow>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart layout="vertical" data={compMedia} margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
              <CartesianGrid stroke="#EDEEF2" horizontal={false} />
              <XAxis type="number" domain={[0, 5]} tick={tick} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="comp" tick={{ fontSize: 10, fill: SLATE }} axisLine={false} tickLine={false} width={130} />
              <Tooltip contentStyle={tt} cursor={{ fill: "#F3F4F7" }} />
              <Bar dataKey="media" radius={[0, 6, 6, 0]}>
                {compMedia.map((c, i) => <Cell key={i} fill={scoreColor(c.media)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <Eyebrow>Taxa de participação</Eyebrow>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={participacao} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="#EDEEF2" vertical={false} />
            <XAxis dataKey="week" tick={tick} axisLine={axL} tickLine={false} />
            <YAxis domain={[0, 100]} tick={tick} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tt} formatter={(v) => `${v}%`} />
            <Line type="monotone" dataKey="taxa" stroke={TEAL} strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function FilterSel({ label, value, onChange, options }) {
  return (
    <div className="filter">
      <label>{label}</label>
      <select className="input select" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );
}

function ManagerAlerts() {
  const w = WEEKS.length - 1;
  const alerts = [];
  TEAM.forEach((p) => {
    const cur = DATA.evals[p.id][w], prev = DATA.evals[p.id][w - 1];
    if (cur.motivacao === 1) alerts.push({ p, type: "crit", txt: "Deu nota 1 em motivação nesta semana." });
    if (cur.mood === "sobrecarregado") alerts.push({ p, type: "warn", txt: "Marcou o sentimento “sobrecarregado(a)”." });
    if (cur.comequipe <= 2 || cur.comlideranca <= 2) alerts.push({ p, type: "warn", txt: "Nota baixa em comunicação." });
    if (cur.satisfacao <= 2 && prev.satisfacao <= 2) alerts.push({ p, type: "crit", txt: "Satisfação baixa por 2 semanas seguidas." });
  });
  return (
    <div className="stack">
      <div className="form-head">
        <Eyebrow><AlertTriangle size={13} /> Sinais de atenção</Eyebrow>
        <h2 className="h2">Alertas automáticos</h2>
        <p className="muted">Disparados quando alguém sinaliza algo que merece um olhar próximo. Só você vê.</p>
      </div>
      {alerts.length === 0 && <Card><p className="muted">Nenhum alerta no momento. 🌿</p></Card>}
      <div className="stack-sm">
        {alerts.map((a, i) => (
          <Card key={i} className={`alert ${a.type}`}>
            <div className={`alert-dot ${a.type}`} />
            <Avatar name={a.p.name} size={38} color={SLATE} />
            <div className="alert-body">
              <div className="strong">{a.p.name} <span className="muted sm">· {a.p.cargo} · {a.p.textos} textos/mês</span></div>
              <div className="muted sm">{a.txt}</div>
            </div>
            <span className={`pill ${a.type === "crit" ? "rose" : "amber"} sm`}>{a.type === "crit" ? "Crítico" : "Atenção"}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ManagerEvaluate() {
  const [sel, setSel] = useState(TEAM[0].id);
  const [ratings, setRatings] = useState({});
  const [fb, setFb] = useState("");
  const [saved, setSaved] = useState(false);
  const p = TEAM.find((x) => x.id === sel);
  return (
    <div className="stack">
      <div className="form-head">
        <Eyebrow><ClipboardCheck size={13} /> Avaliação individual</Eyebrow>
        <h2 className="h2">Avaliar redatores</h2>
        <p className="muted">Sua avaliação fica visível <strong>apenas para a própria pessoa</strong> — nunca para o resto do time.</p>
      </div>
      <Card>
        <FilterSel label="Quem você quer avaliar?" value={sel} onChange={(v) => { setSel(+v); setRatings({}); setFb(""); setSaved(false); }} options={TEAM.map((x) => [x.id, `${x.name} · ${x.cargo}`])} />
      </Card>
      <Card>
        <div className="eval-person"><Avatar name={p.name} size={44} /><div><div className="strong">{p.name}</div><div className="muted sm">{p.cargo} · {p.textos} textos/mês</div></div></div>
        {COMPETENCIAS.map((c) => (
          <div key={c} className="rate-row">
            <div className="rate-label" style={{ fontWeight: 500 }}>{c}</div>
            <Stars value={ratings[c] || 0} onChange={(v) => setRatings({ ...ratings, [c]: v })} />
          </div>
        ))}
      </Card>
      <Card>
        <div className="rate-label">Feedback privado</div>
        <p className="muted sm">Escreva um reconhecimento, orientação ou ponto de desenvolvimento. Só {p.name.split(" ")[0]} vê isto.</p>
        <textarea className="input" rows={4} value={fb} onChange={(e) => setFb(e.target.value)} placeholder="Seu feedback…" />
      </Card>
      <div className="submit-bar">
        <span className="muted sm">{saved ? "Salvo — visível só para o colaborador." : "Avalie as competências e escreva o feedback."}</span>
        <button className="btn btn-primary" onClick={() => setSaved(true)} disabled={Object.keys(ratings).length < COMPETENCIAS.length}>
          <Lock size={15} /> Salvar avaliação privada
        </button>
      </div>
    </div>
  );
}

function ManagerGoals() {
  const [goals, setGoals] = useState(SEED_GOALS.map((g) => ({ ...g })));
  const [draft, setDraft] = useState("");
  return (
    <div className="stack">
      <div className="form-head">
        <Eyebrow><Target size={13} /> Foco coletivo</Eyebrow>
        <h2 className="h2">Metas da semana</h2>
        <p className="muted">Cadastre os objetivos. Na sexta, todos avaliam o quanto acreditam que a equipe cumpriu.</p>
      </div>
      <Card>
        <div className="add-goal">
          <input className="input" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ex.: reduzir atrasos nas entregas" />
          <button className="btn btn-primary" onClick={() => { if (draft.trim()) { setGoals([...goals, { text: draft, crenca: 0, ativo: true }]); setDraft(""); } }}>Adicionar meta</button>
        </div>
      </Card>
      <Card>
        <Eyebrow>Esta semana queremos:</Eyebrow>
        <div className="stack-sm" style={{ marginTop: 10 }}>
          {goals.map((g, i) => (
            <div key={i} className="goal-edit">
              <span className="goal-check">☐</span>
              <span className="goal-txt">{g.text}</span>
              {g.crenca > 0 && <span className="pill sm" style={{ background: "#F1F2F5", color: SLATE }}>crença atual {g.crenca.toFixed(1)}/5</span>}
              <button className="x" onClick={() => setGoals(goals.filter((_, k) => k !== i))}>remover</button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ManagerSuggestions() {
  const items = [];
  TEAM.forEach((p) => WEEKS.forEach((wk, w) => {
    if (DATA.evals[p.id][w].sugestao) items.push({ p, week: wk, txt: DATA.evals[p.id][w].sugestao });
  }));
  return (
    <div className="stack">
      <div className="form-head">
        <Eyebrow><Lightbulb size={13} /> Vindas do time</Eyebrow>
        <h2 className="h2">Sugestões recebidas</h2>
        <p className="muted">Respostas para “algo que poderia facilitar seu trabalho?”.</p>
      </div>
      <div className="stack-sm">
        {items.slice(0, 12).map((s, i) => (
          <Card key={i} className="sugg">
            <Lightbulb size={18} color={AMBER} />
            <div><div className="muted sm strong">{s.p.name} · {s.week}</div><div>{s.txt}</div></div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============================== LOGIN ============================== */

function Login({ onLogin }) {
  const [tab, setTab] = useState("colab");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const corp = /@(beside|besidemedia)\.(com|com\.br)$/i.test(email);
  const err = email && !corp;

  const [lEmail, setLEmail] = useState("");
  const [lPass, setLPass] = useState("");
  const [code, setCode] = useState("");
  const lCorp = /@(beside|besidemedia)\.(com|com\.br)$/i.test(lEmail);
  const codeOk = code === "liderancabeside";
  const codeErr = code.length > 0 && !codeOk;

  const Google = () => (
    <svg width="17" height="17" viewBox="0 0 48 48"><path fill="#4285F4" d="M45 24c0-1.6-.1-2.8-.4-4H24v7.6h12c-.5 3-2.3 6.4-6.6 8.6l6.4 5C42 43.5 45 35.3 45 24z" /><path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-6.4-5c-1.8 1.2-4.1 2-8.1 2-6.2 0-11.4-4.1-13.3-9.8l-6.6 5C9.6 41 16.2 46 24 46z" /><path fill="#FBBC05" d="M10.7 27.9c-.5-1.4-.7-2.9-.7-4.4s.3-3 .7-4.4l-6.6-5C2.7 16.9 2 20.3 2 23.5s.7 6.6 2.1 9.4l6.6-5z" /><path fill="#EA4335" d="M24 9.5c3.5 0 5.9 1.5 7.3 2.8l5.4-5.3C33 3.9 29 2 24 2 16.2 2 9.6 7 6.1 14.1l6.6 5C14.6 13.6 17.8 9.5 24 9.5z" /></svg>
  );

  return (
    <div className="login">
      <div className="login-card">
        <Logo />
        <h1 className="login-h">Onde a redação se encontra toda semana.</h1>
        <p className="muted">Seu check-in, seu histórico e o guia da redação — num lugar só.</p>

        <div className="tabs">
          <button className={`tab ${tab === "colab" ? "on" : ""}`} onClick={() => setTab("colab")}>Colaborador</button>
          <button className={`tab ${tab === "lider" ? "on" : ""}`} onClick={() => setTab("lider")}>Cadastro de liderança</button>
        </div>

        {tab === "colab" ? (
          <>
            <button className="btn btn-google" onClick={() => onLogin("writer")}>
              <Google /> Entrar com Google corporativo
            </button>
            <div className="divisor"><span>ou</span></div>
            <label className="field-l">E-mail corporativo</label>
            <div className="field"><Mail size={16} color={SLATE} /><input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@beside.com.br" /></div>
            {err && <div className="field-err">Use um e-mail corporativo @beside.com.br</div>}
            <label className="field-l">Senha</label>
            <div className="field"><Lock size={16} color={SLATE} /><input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" /></div>
            <button className="btn btn-primary full" onClick={() => onLogin("writer")} disabled={!corp || !pass}>Entrar</button>
            <p className="muted sm center">Primeira vez? <span className="link">Complete seu perfil</span> (nome, cargo e textos/mês).</p>
          </>
        ) : (
          <>
            <div className="lead-note"><Lock size={14} color={INK} /> Espaço exclusivo da liderança. Use o código fornecido pela coordenação.</div>
            <label className="field-l">E-mail corporativo</label>
            <div className="field"><Mail size={16} color={SLATE} /><input value={lEmail} onChange={(e) => setLEmail(e.target.value)} placeholder="lider@beside.com.br" /></div>
            <label className="field-l">Senha</label>
            <div className="field"><Lock size={16} color={SLATE} /><input type="password" value={lPass} onChange={(e) => setLPass(e.target.value)} placeholder="••••••••" /></div>
            <label className="field-l">Código de acesso da liderança</label>
            <div className="field"><Award size={16} color={SLATE} /><input value={code} onChange={(e) => setCode(e.target.value)} placeholder="digite o código exato" /></div>
            {codeErr && <div className="field-err">Código incorreto.</div>}
            {codeOk && <div className="field-ok">Código válido ✓</div>}
            <button className="btn btn-primary full" onClick={() => onLogin("manager")} disabled={!lCorp || !lPass || !codeOk}>Criar acesso de liderança</button>
            <p className="muted sm center">O acesso de liderança libera o painel, os alertas e as avaliações da equipe.</p>
          </>
        )}
        <div className="demo-note">Protótipo · clique em qualquer botão de acesso para entrar e explorar.</div>
      </div>
    </div>
  );
}

/* ============================== SHELL ============================== */

const WRITER_NAV = [
  { k: "home", label: "Início", icon: Home },
  { k: "form", label: "Avaliação da semana", icon: Star },
  { k: "history", label: "Meu histórico", icon: ClipboardCheck },
  { k: "feedback", label: "Meu feedback", icon: Lock },
  { k: "guia", label: "Guia da Redação", icon: BookOpen },
];
const MANAGER_NAV = [
  { k: "dash", label: "Painel", icon: LayoutDashboard },
  { k: "alerts", label: "Alertas", icon: AlertTriangle },
  { k: "evaluate", label: "Avaliar redatores", icon: ClipboardCheck },
  { k: "goals", label: "Metas da semana", icon: Target },
  { k: "suggestions", label: "Sugestões", icon: Lightbulb },
  { k: "guia", label: "Guia da Redação", icon: BookOpen },
];

export default function App() {
  const [logged, setLogged] = useState(false);
  const [identity, setIdentity] = useState(TEAM[0].id); // 0 = gestor
  const isManager = identity === 0;
  const me = isManager ? MANAGER : TEAM.find((p) => p.id === identity);
  const nav = isManager ? MANAGER_NAV : WRITER_NAV;
  const [view, setView] = useState("home");

  if (!logged) return (<><Styles /><Login onLogin={(role) => { const mgr = role === "manager"; setLogged(true); setIdentity(mgr ? 0 : TEAM[0].id); setView(mgr ? "dash" : "home"); }} /></>);

  const activeView = nav.find((n) => n.k === view) ? view : nav[0].k;

  const render = () => {
    if (isManager) {
      switch (activeView) {
        case "dash": return <ManagerDashboard />;
        case "alerts": return <ManagerAlerts />;
        case "evaluate": return <ManagerEvaluate />;
        case "goals": return <ManagerGoals />;
        case "suggestions": return <ManagerSuggestions />;
        case "guia": return <Guia canEdit />;
        default: return <ManagerDashboard />;
      }
    }
    switch (activeView) {
      case "home": return <WriterHome me={me} />;
      case "form": return <WriterForm me={me} />;
      case "history": return <WriterHistory me={me} />;
      case "feedback": return <WriterFeedback me={me} />;
      case "guia": return <Guia />;
      default: return <WriterHome me={me} />;
    }
  };

  return (
    <>
      <Styles />
      <div className="app">
        <aside className="sidebar">
          <div className="side-top"><Logo light /></div>
          <nav className="nav">
            {nav.map((n) => {
              const Ico = n.icon;
              const on = activeView === n.k;
              return (
                <button key={n.k} className={`navitem ${on ? "on" : ""}`} onClick={() => setView(n.k)}>
                  <Ico size={17} /> <span>{n.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="side-bot">
            <button className="navitem" onClick={() => setLogged(false)}><LogOut size={17} /> <span>Sair</span></button>
          </div>
        </aside>

        <main className="main">
          <header className="topbar">
            <div className="topbar-l">
              <span className="muted sm">Você está vendo como</span>
              <select className="ident" value={identity} onChange={(e) => { setIdentity(+e.target.value); setView(+e.target.value === 0 ? "dash" : "home"); }}>
                <option value={0}>👑 {MANAGER.name} (Coordenação)</option>
                <optgroup label="Redatores">
                  {TEAM.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </optgroup>
              </select>
            </div>
            <div className="topbar-r">
              <div className="who">
                <div className="who-name">{me.name}</div>
                <div className="muted sm">{me.cargo}</div>
              </div>
              <Avatar name={me.name} size={40} color={isManager ? AMBER : INK} />
            </div>
          </header>
          <div className="content">{render()}</div>
        </main>
      </div>
    </>
  );
}

/* ============================== ESTILOS ============================== */

function Styles() {
  return (
    <style>{`
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{--ink:#191D30;--ink2:#2A3047;--slate:#5B6480;--muted:#7A8093;--paper:#F4F4F2;--card:#fff;--line:#E6E7EC;--amber:#D99A3C;--teal:#3E8E7E;--rose:#C76B6B}
.app,.login,*{font-family:'Inter',system-ui,sans-serif}
body{background:var(--paper)}
.app{display:flex;min-height:100vh;background:var(--paper);color:var(--ink)}
.h2{font-family:'Space Grotesk';font-weight:600;font-size:24px;letter-spacing:-.02em;line-height:1.15;color:var(--ink)}
.muted{color:var(--muted)}.sm{font-size:12.5px}.strong{font-weight:600}
.eyebrow{font-family:'Space Grotesk';font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--slate);display:flex;align-items:center;gap:6px;margin-bottom:12px}

/* LOGO */
.logo{display:flex;align-items:center;gap:10px}
.logo-txt{display:flex;flex-direction:column;line-height:1}
.logo-1{font-family:'Space Grotesk';font-weight:700;font-size:19px;letter-spacing:-.01em}
.logo-2{font-family:'Space Grotesk';font-weight:500;font-size:11px;letter-spacing:.18em;text-transform:uppercase}

/* SIDEBAR */
.sidebar{width:248px;flex-shrink:0;background:var(--ink);color:#fff;display:flex;flex-direction:column;padding:22px 16px;position:sticky;top:0;height:100vh}
.side-top{padding:6px 8px 22px}
.nav{display:flex;flex-direction:column;gap:3px;flex:1}
.navitem{display:flex;align-items:center;gap:11px;width:100%;padding:11px 13px;border:none;background:transparent;color:#B9BDCC;border-radius:10px;font-size:14px;font-weight:500;cursor:pointer;text-align:left;transition:.15s}
.navitem:hover{background:rgba(255,255,255,.06);color:#fff}
.navitem.on{background:#fff;color:var(--ink);font-weight:600}
.side-bot{border-top:1px solid rgba(255,255,255,.1);padding-top:10px;margin-top:10px}

/* MAIN */
.main{flex:1;min-width:0;display:flex;flex-direction:column}
.topbar{display:flex;justify-content:space-between;align-items:center;padding:14px 28px;background:rgba(255,255,255,.85);backdrop-filter:blur(8px);border-bottom:1px solid var(--line);position:sticky;top:0;z-index:5;gap:12px;flex-wrap:wrap}
.topbar-l{display:flex;flex-direction:column;gap:3px}
.ident{font-family:'Inter';font-weight:600;font-size:14px;border:1px solid var(--line);border-radius:9px;padding:7px 10px;background:#fff;color:var(--ink);cursor:pointer;max-width:300px}
.topbar-r{display:flex;align-items:center;gap:12px}
.who{text-align:right}.who-name{font-weight:600;font-size:14px}
.content{padding:28px;max-width:1080px;width:100%;margin:0 auto}

/* CARDS / LAYOUT */
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:20px}
.stack{display:flex;flex-direction:column;gap:18px}
.stack-sm{display:flex;flex-direction:column;gap:10px}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.row-3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.row-4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
@media(max-width:880px){.grid-2,.row-3,.row-4{grid-template-columns:1fr}.sidebar{width:74px;padding:18px 10px}.navitem span,.logo-txt,.side-top .logo-txt{display:none}.content{padding:18px}}

/* AVATAR / STAT */
.avatar{border-radius:50%;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;text-transform:uppercase}
.stat-v{font-family:'Space Grotesk';font-size:32px;font-weight:700;letter-spacing:-.02em;line-height:1}
.stat-l{font-size:13px;color:var(--ink);font-weight:600;margin-top:8px}
.stat-s{font-size:11.5px;color:var(--muted);margin-top:2px}

/* BANNER */
.banner{background:var(--ink);color:#fff;border-radius:18px;padding:26px 28px;display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap}
.banner .eyebrow{color:#9097AD}.banner .h2{color:#fff;margin:6px 0}.banner .muted{color:#AAB0C4}
.banner-mood{text-align:center;background:rgba(255,255,255,.07);padding:14px 22px;border-radius:14px}
.big-emoji{font-size:40px;line-height:1}.banner-mood .strong{color:#fff;font-size:13px;margin-top:4px}.banner-mood .sm{color:#9097AD;margin-top:6px}

/* BUTTONS */
.btn{font-family:'Inter';font-weight:600;font-size:14px;border:none;border-radius:10px;padding:11px 18px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;justify-content:center;transition:.15s}
.btn-primary{background:var(--ink);color:#fff}.btn-primary:hover{background:#10131f}
.btn-primary:disabled{background:#C9CBD4;cursor:not-allowed}
.btn-ghost{background:#F1F2F5;color:var(--ink)}
.btn-google{background:#fff;color:var(--ink);border:1px solid var(--line);width:100%}
.btn-google:hover{background:#FAFAFB}
.full{width:100%;margin-top:6px}.sm-btn{padding:7px 12px;font-size:12.5px;margin-top:10px}

/* STARS */
.stars{display:flex;gap:3px}.starbtn{background:none;border:none;padding:1px;line-height:0}

/* RATE ROWS */
.rate-row{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:13px 0;border-bottom:1px solid #F0F1F4}
.rate-row:last-child{border-bottom:none}
.rate-label{font-weight:600;font-size:14px;color:var(--ink)}

/* FORM HEAD / PROGRESS */
.form-head{padding:4px 2px}.form-head .h2{margin:4px 0}
.progress{height:7px;background:#EBECF0;border-radius:99px;margin:14px 0 6px;overflow:hidden}
.progress-fill{height:100%;background:var(--ink);border-radius:99px;transition:width .3s}

/* MOOD */
.mood-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:9px;margin-top:14px}
@media(max-width:680px){.mood-grid{grid-template-columns:repeat(2,1fr)}}
.moodchip{display:flex;flex-direction:column;align-items:center;gap:6px;padding:13px 8px;border:1.5px solid var(--line);border-radius:13px;background:#fff;cursor:pointer;font-size:12px;font-weight:500;color:var(--ink);transition:.15s;text-align:center}
.moodchip:hover{border-color:#C9CBD4}
.moodchip.on{border-color:var(--ink);background:#F6F6F8;box-shadow:0 0 0 3px rgba(25,29,48,.07)}
.moodchip-e{font-size:26px;line-height:1}

/* INPUTS */
.input{width:100%;border:1.5px solid var(--line);border-radius:10px;padding:11px 13px;font-family:'Inter';font-size:14px;color:var(--ink);background:#fff;resize:vertical;margin-top:8px}
.input:focus{outline:none;border-color:var(--ink)}
.select{cursor:pointer;margin-top:8px}

/* SUBMIT BAR */
.submit-bar{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:4px 4px 10px;flex-wrap:wrap}

/* PILLS */
.pill{display:inline-block;padding:4px 11px;border-radius:99px;font-size:12px;font-weight:600}
.pill.amber{background:#F8EBD4;color:#9A6A1C}.pill.teal{background:#DDF0EA;color:#236554}.pill.rose{background:#F6E0E0;color:#8E3636}

/* CENTER / NOTIF */
.center-card{text-align:center;padding:48px 28px;align-items:center;display:flex;flex-direction:column;gap:8px}
.center-card .btn{margin-top:14px}
.check-circle{width:62px;height:62px;border-radius:50%;background:var(--teal);display:flex;align-items:center;justify-content:center;margin-bottom:6px}
.notif{display:flex;align-items:center;gap:14px;background:#FCF6EA;border-color:#F0E0C2}

/* HONRA / QUOTE / GOALS */
.honra{display:flex;align-items:center;gap:16px;margin-top:4px}
.honra-nome{font-family:'Space Grotesk';font-weight:700;font-size:20px;color:var(--ink)}
.quote{font-family:'Space Grotesk';font-size:17px;line-height:1.5;color:var(--ink);font-weight:500;margin:6px 0 10px}
.goal{margin-bottom:14px}.goal:last-child{margin-bottom:0}
.goal-top{display:flex;justify-content:space-between;font-size:14px;margin-bottom:7px;font-weight:500}
.bar{height:9px;background:#EBECF0;border-radius:99px;overflow:hidden}.bar-fill{height:100%;border-radius:99px}

/* HISTORY */
.mood-strip{display:flex;flex-wrap:wrap;gap:8px;margin-top:6px}
.mood-cell{display:flex;flex-direction:column;align-items:center;gap:2px;width:44px;padding:8px 0;background:#F7F7F9;border-radius:10px}
.mood-cell span{font-size:20px}.mood-cell small{font-size:9px;color:var(--muted)}
.elogio{display:flex;gap:11px;align-items:flex-start;padding:11px;background:#F8F8FA;border-radius:11px}
.comp-row{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid #F2F3F5}
.comp-row:last-child{border-bottom:none}.comp-right{display:flex;align-items:center;gap:8px}

/* FEEDBACK PRIVADO */
.private-head{display:flex;align-items:center;gap:13px;background:#F6F6F8;border-color:#E6E7EC}
.feedback-card{background:#FBFAF6;border-color:#EDE7D8}
.feedback-txt{font-size:15px;line-height:1.6;color:var(--ink2);margin:4px 0 12px}

/* ACCORDION */
.accordion{background:#fff;border:1px solid var(--line);border-radius:13px;overflow:hidden}
.accordion.open{border-color:#D6D8E0;box-shadow:0 6px 20px rgba(25,29,48,.05)}
.acc-head{width:100%;display:flex;align-items:center;gap:14px;padding:16px 18px;background:none;border:none;cursor:pointer;text-align:left}
.acc-i{font-family:'Space Grotesk';font-weight:700;font-size:13px;color:var(--amber);width:24px}
.acc-t{flex:1;font-weight:600;font-size:15px;color:var(--ink)}
.acc-body{padding:0 18px 18px 56px;color:var(--ink2);font-size:14px;line-height:1.6}

/* FILTERS */
.filters{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
@media(max-width:880px){.filters{grid-template-columns:1fr 1fr}}
.filter{display:flex;flex-direction:column}
.filter label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--slate);margin-bottom:2px}

/* HEAT */
.heat{display:flex;flex-direction:column;gap:5px;margin-top:8px;overflow-x:auto}
.heat-row{display:flex;gap:5px;align-items:center;min-width:560px}
.heat-label{width:200px;flex-shrink:0;font-size:12px;color:var(--ink2);text-align:right;padding-right:8px}
.heat-cell{flex:1;min-width:34px;height:34px;display:flex;align-items:center;justify-content:center;border-radius:7px;font-size:12px;font-weight:600}
.heat-head .heat-cell{background:transparent;color:var(--slate);height:auto}
.heat-wk{font-weight:600}

/* ALERTS */
.alert{display:flex;align-items:center;gap:13px}
.alert.crit{border-color:#EAC9C9;background:#FCF4F4}.alert.warn{border-color:#EFDFC0;background:#FCF8EF}
.alert-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.alert-dot.crit{background:var(--rose)}.alert-dot.warn{background:var(--amber)}
.alert-body{flex:1}

/* EVAL / GOALS / SUGG */
.eval-person{display:flex;align-items:center;gap:13px;padding-bottom:14px;margin-bottom:6px;border-bottom:1px solid #F0F1F4}
.add-goal{display:flex;gap:10px}.add-goal .input{margin-top:0}
@media(max-width:560px){.add-goal{flex-direction:column}}
.goal-edit{display:flex;align-items:center;gap:10px;padding:11px 13px;background:#F8F8FA;border-radius:10px}
.goal-check{font-size:18px;color:var(--slate)}.goal-txt{flex:1;font-weight:500}
.x{background:none;border:none;color:var(--rose);font-size:12px;cursor:pointer;font-weight:600}
.sugg{display:flex;gap:13px;align-items:flex-start}

/* LOGIN */
.login{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--paper);padding:20px}
.login-card{background:#fff;border:1px solid var(--line);border-radius:20px;padding:38px;width:100%;max-width:412px;box-shadow:0 20px 60px rgba(25,29,48,.08)}
.login-h{font-family:'Space Grotesk';font-weight:600;font-size:22px;letter-spacing:-.02em;margin:22px 0 4px;line-height:1.2}
.divisor{text-align:center;margin:18px 0;position:relative;color:var(--muted);font-size:12px}
.divisor:before{content:'';position:absolute;left:0;top:50%;width:100%;height:1px;background:var(--line)}
.divisor span{background:#fff;padding:0 12px;position:relative}
.field-l{display:block;font-size:12.5px;font-weight:600;color:var(--ink);margin:12px 0 6px}
.field{display:flex;align-items:center;gap:9px;border:1.5px solid var(--line);border-radius:10px;padding:11px 13px;background:#fff}
.field:focus-within{border-color:var(--ink)}
.field input{border:none;outline:none;flex:1;font-family:'Inter';font-size:14px;color:var(--ink)}
.field-err{color:var(--rose);font-size:12px;margin-top:6px}
.field-ok{color:var(--teal);font-size:12px;margin-top:6px;font-weight:600}
.tabs{display:flex;gap:5px;background:#F1F2F5;padding:4px;border-radius:11px;margin:20px 0 18px}
.tab{flex:1;border:none;background:transparent;padding:9px;border-radius:8px;font-family:'Inter';font-weight:600;font-size:13px;color:var(--slate);cursor:pointer;transition:.15s}
.tab.on{background:#fff;color:var(--ink);box-shadow:0 1px 3px rgba(25,29,48,.1)}
.lead-note{display:flex;align-items:center;gap:8px;background:#F6F6F8;border:1px solid var(--line);border-radius:10px;padding:11px 13px;font-size:12.5px;color:var(--ink2);margin-bottom:4px;line-height:1.4}
.center{text-align:center}.link{color:var(--ink);font-weight:600;text-decoration:underline;cursor:pointer}
.demo-note{margin-top:18px;text-align:center;font-size:11.5px;color:var(--muted);background:#F6F6F8;padding:8px;border-radius:8px}
button:focus-visible,select:focus-visible,input:focus-visible{outline:2px solid var(--ink);outline-offset:2px}
@media(prefers-reduced-motion:reduce){*{transition:none!important}}
`}</style>
  );
}
