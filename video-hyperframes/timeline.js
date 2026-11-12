/* ================================================================
   Pokédex de Cartas — Análisis técnico
   Línea de tiempo HyperFrames (determinista, seek-safe)
   1920×1080 · 30 fps · 45 s · 1350 frames

   Escena 1  frames    0– 240  · 0.00– 8.00 s
   Escena 2  frames  241– 630  · 8.03–21.00 s
   Escena 3  frames  631–1080  ·21.03–36.00 s
   Escena 4  frames 1081–1350  ·36.03–45.00 s
   ================================================================ */

const tl = gsap.timeline({ paused: true });
const F = 1 / 30; // duración de un frame

/* ----------------------------------------------------------------
   Helpers
   ---------------------------------------------------------------- */

/** Entrada de un elemento: fade + desplazamiento (+ escalado opcional). */
function inAt(target, at, opts = {}) {
  tl.fromTo(
    target,
    { opacity: 0, y: opts.y ?? 26, x: opts.x ?? 0, scale: opts.scale ?? 1 },
    {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      duration: opts.duration ?? 0.55,
      ease: opts.ease ?? "power3.out",
    },
    at,
  );
}

/** Salida de un elemento. */
function outAt(target, at, opts = {}) {
  tl.to(
    target,
    {
      opacity: 0,
      y: opts.y ?? -18,
      x: opts.x ?? 0,
      scale: opts.scale ?? 1,
      duration: opts.duration ?? 0.4,
      ease: opts.ease ?? "power2.in",
    },
    at,
  );
}

/** Subtítulo lower-third: entra, se mantiene y sale antes de la siguiente pista. */
function cue(target, inAtTime, outAtTime) {
  tl.fromTo(
    target,
    { opacity: 0, x: -28 },
    { opacity: 1, x: 0, duration: 0.45, ease: "power3.out" },
    inAtTime,
  );
  if (outAtTime != null) {
    tl.to(target, { opacity: 0, x: 18, duration: 0.35, ease: "power2.in" }, outAtTime);
  }
}

/** Resalta un bloque de líneas de código y atenúa el resto. */
function focusLines(from, to, at) {
  const ids = [];
  for (let i = 1; i <= 15; i++) ids.push("#cl-" + i);
  const focus = ids.slice(from - 1, to);
  const rest = ids.filter((id) => !focus.includes(id));
  tl.to(focus, { opacity: 1, duration: 0.4, ease: "power2.out", stagger: 0.02 }, at);
  tl.to(rest, { opacity: 0.28, duration: 0.4, ease: "power2.out" }, at);
}

/** Mueve la banda de resaltado sobre las líneas [from..to] (34 px por línea). */
function bandTo(from, to, at) {
  const lineas = to - from + 1;
  tl.to(
    "#focus-band",
    {
      y: (from - 1) * 34,
      scaleY: lineas / 8,
      duration: 0.5,
      ease: "power3.inOut",
    },
    at,
  );
}

/** Anillo de foco sobre un nodo + atenuación del resto. */
function focusNodes(activeIds, at, holdUntil) {
  const all = ["#node-vista", "#node-ctrl", "#node-repo", "#node-dao"];
  const dim = all.filter((id) => !activeIds.includes(id));

  activeIds.forEach((id) => {
    tl.to(id + " .node-ring", { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }, at);
  });
  tl.to(dim, { opacity: 0.3, duration: 0.5, ease: "power2.out" }, at);

  if (holdUntil != null) {
    activeIds.forEach((id) => {
      tl.to(id + " .node-ring", { opacity: 0, scale: 0.97, duration: 0.4 }, holdUntil);
    });
    tl.to(all, { opacity: 1, duration: 0.4, ease: "power2.out" }, holdUntil);
  }
}

/* ================================================================
   HUD GLOBAL · barra de progreso y deriva del fondo
   ================================================================ */

tl.fromTo(
  "#progress-fill",
  { scaleX: 0 },
  { scaleX: 1, duration: 45, ease: "none" },
  0,
);

tl.to("#glow-blue", { x: 150, y: 90, duration: 45, ease: "none" }, 0);
tl.to("#glow-green", { x: -140, y: -80, duration: 45, ease: "none" }, 0);

/* ================================================================
   ESCENA 1 · INTRODUCCIÓN Y PROPÓSITO   (0.00 – 8.00 s)
   ================================================================ */

inAt("#s1", 0, { y: 34, duration: 0.6 });
outAt("#s1", 7.5, { y: -26, duration: 0.5 });

inAt("#s1-eyebrow", 0.3, { y: 14, duration: 0.5 });
inAt("#s1-title", 0.55, { y: 40, duration: 0.75 });
tl.fromTo(
  "#s1-rule",
  { scaleX: 0, opacity: 0 },
  { scaleX: 1, opacity: 1, duration: 0.7, ease: "power3.out" },
  1.05,
);
inAt("#s1-lede", 1.35, { y: 24, duration: 0.65 });
tl.fromTo(
  "#s1-badges .badge",
  { opacity: 0, y: 22, scale: 0.94 },
  {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.5,
    ease: "back.out(1.6)",
    stagger: 0.13,
  },
  2.05,
);

cue("#s1-lt", 4.3, 7.1);

/* ================================================================
   ESCENA 2 · ARQUITECTURA Y FLUJO MVC   (8.00 – 21.00 s)
   ================================================================ */

inAt("#s2", 8.0, { x: 70, duration: 0.6 });
outAt("#s2", 20.5, { y: -30, duration: 0.5 });

inAt("#s2-head", 8.25, { y: 24, duration: 0.55 });

tl.fromTo(
  ["#node-vista", "#link-1", "#node-ctrl", "#link-2", "#node-repo", "#link-3", "#node-dao"],
  { opacity: 0, y: 30 },
  { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.1 },
  8.45,
);

/* Pulsos de datos recorriendo los conectores */
["#link-1", "#link-2", "#link-3"].forEach((id, i) => {
  tl.fromTo(
    id + " .link-dot",
    { x: 0 },
    {
      x: 100,
      duration: 1.5,
      ease: "none",
      repeat: 5,
    },
    9.2 + i * 0.45,
  );
});

/* Fase A — la vista (9.9 – 13.0) */
focusNodes(["#node-vista"], 9.9, 12.55);
cue("#s2-lt-1", 8.9, 12.6);

/* Tarjetas de contexto del diagrama */
inAt("#sub-model", 9.55, { y: 26, duration: 0.55 });
inAt("#sub-files", 9.85, { y: 26, duration: 0.55 });

/* Fase B — el controlador (13.0 – 17.0) */
focusNodes(["#node-ctrl"], 13.0, 16.6);
cue("#s2-lt-2", 13.0, 16.7);

/* Fase C — repository + DAO + persistencia (17.0 – 21.0) */
focusNodes(["#node-repo", "#node-dao"], 17.0, null);
cue("#s2-lt-3", 17.0, 20.4);

/* ================================================================
   ESCENA 3 · CÓDIGO CLAVE EN ACCIÓN   (21.00 – 36.00 s)
   ================================================================ */

inAt("#s3", 21.0, { scale: 0.985, duration: 0.6 });
outAt("#s3", 35.5, { y: -26, duration: 0.5 });

inAt("#s3-head", 21.2, { y: 22, duration: 0.5 });
inAt("#s3-editor", 21.4, { y: 34, duration: 0.6 });

tl.fromTo(
  ".code-line",
  { opacity: 0, x: -14 },
  { opacity: 1, x: 0, duration: 0.35, ease: "power2.out", stagger: 0.045 },
  21.75,
);

/* Banda inicial sobre las líneas 1–5 */
tl.fromTo(
  "#focus-band",
  { opacity: 0, y: 0, scaleY: 5 / 8 },
  { opacity: 1, duration: 0.5, ease: "power2.out" },
  22.9,
);

/* PASO 01 · validación (líneas 1–5) */
focusLines(1, 5, 22.9);
inAt("#ex-1", 23.05, { x: 40, duration: 0.55 });
cue("#s3-lt-1", 23.4, 26.55);
outAt("#ex-1", 26.55, { x: 30, duration: 0.35 });

/* PASO 02 · polimorfismo (líneas 6–13) */
bandTo(6, 13, 26.9);
focusLines(6, 13, 26.9);
inAt("#ex-2", 27.05, { x: 40, duration: 0.55 });
cue("#s3-lt-2", 26.9, 31.15);
outAt("#ex-2", 31.15, { x: 30, duration: 0.35 });

/* PASO 03 · persistencia (líneas 14–15) */
bandTo(14, 15, 31.5);
focusLines(14, 15, 31.5);
inAt("#ex-3", 31.65, { x: 40, duration: 0.55 });
cue("#s3-lt-3", 31.5, 35.3);

/* ================================================================
   ESCENA 4 · RESUMEN Y CIERRE   (36.00 – 45.00 s)
   ================================================================ */

inAt("#s4", 36.0, { y: 38, duration: 0.6 });

inAt("#s4-head", 36.25, { y: 24, duration: 0.55 });

tl.fromTo(
  ".sum-item",
  { opacity: 0, x: -46 },
  { opacity: 1, x: 0, duration: 0.55, ease: "power3.out", stagger: 0.26 },
  36.55,
);

cue("#s4-lt", 37.2, 40.4);

/* El resumen cede el paso al cierre */
tl.to(
  ".sum-item",
  { opacity: 0, x: 40, duration: 0.4, ease: "power2.in", stagger: 0.09 },
  40.5,
);
outAt("#s4-head", 40.5, { y: -20, duration: 0.4 });

tl.fromTo(
  "#s4-closing",
  { opacity: 0, y: 34, scale: 0.955 },
  { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: "power3.out" },
  41.15,
);

/* Fundido final a negro */
tl.to("#blackout", { opacity: 1, duration: 0.5, ease: "power2.in" }, 44.4);

/* ================================================================
   Registro del timeline (la clave debe coincidir con data-composition-id)
   ================================================================ */
window.__timelines = window.__timelines || {};
window.__timelines.main = tl;
