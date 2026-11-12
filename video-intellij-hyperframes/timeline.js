/* ================================================================
   JavaFX en IntelliJ — Guía completa paso a paso
   Línea de tiempo HyperFrames (determinista, seek-safe)
   1920×1080 · 30 fps · 300 s · 9000 frames

   Escena 1    0– 12 s   Introducción
   Escena 2   12– 56 s   CAP. 01 · Crear el proyecto
   Escena 3   56–112 s   CAP. 02 · module-info y opens
   Escena 4  112–158 s   CAP. 03 · Vista ↔ Controlador
   Escena 4B 158–238 s   CAP. 04 · Inicialización (atributo · constructor · initialize)
   Escena 5  238–294 s   CAP. 05 · Patrón de capas
   Escena 6  294–328 s   CAP. 06 · Organización
   Escena 7  328–368 s   CAP. 07 · Errores comunes
   Escena 8  368–380 s   CAP. 08 · Cierre
   ================================================================ */

const tl = gsap.timeline({ paused: true });

/* ----------------------------------------------------------------
   Helpers
   ---------------------------------------------------------------- */

/** Entrada: fade + desplazamiento (+ escalado opcional). */
function inAt(target, at, opts = {}) {
  tl.fromTo(
    target,
    { opacity: 0, y: opts.y ?? 24, x: opts.x ?? 0, scale: opts.scale ?? 1 },
    {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      duration: opts.duration ?? 0.6,
      ease: opts.ease ?? "power3.out",
    },
    at,
  );
}

/** Salida. */
function outAt(target, at, opts = {}) {
  tl.to(
    target,
    {
      opacity: 0,
      y: opts.y ?? -16,
      x: opts.x ?? 0,
      duration: opts.duration ?? 0.45,
      ease: opts.ease ?? "power2.in",
    },
    at,
  );
}

/** Subtítulo lower-third: entra, se mantiene y sale. */
function cue(target, inTime, outTime) {
  tl.fromTo(
    target,
    { opacity: 0, x: -26 },
    { opacity: 1, x: 0, duration: 0.45, ease: "power3.out" },
    inTime,
  );
  if (outTime != null) {
    tl.to(target, { opacity: 0, x: 16, duration: 0.35, ease: "power2.in" }, outTime);
  }
}

/** Aparición de líneas de código. */
function reveal(selector, at, stagger = 0.06) {
  tl.fromTo(
    selector + " .cl",
    { opacity: 0, x: -12 },
    { opacity: 1, x: 0, duration: 0.32, ease: "power2.out", stagger },
    at,
  );
}

/** Líneas del árbol de archivos. */
function revealTree(selector, at, stagger = 0.08) {
  tl.fromTo(
    selector + " .tree-line",
    { opacity: 0, x: -10 },
    { opacity: 1, x: 0, duration: 0.3, ease: "power2.out", stagger },
    at,
  );
}

/** Enfoca grupos de líneas y atenúa el resto (1-based, inclusivo). */
function focus(scope, groups, at) {
  const all = Array.from(document.querySelectorAll(scope + " .cl"));
  const lit = [];
  groups.forEach((g) => {
    const lines = document.querySelectorAll(g.sel + " .cl");
    for (let i = g.from - 1; i <= g.to - 1; i++) {
      if (lines[i]) lit.push(lines[i]);
    }
  });
  const litSet = new Set(lit);
  const rest = all.filter((el) => !litSet.has(el));
  if (rest.length) {
    tl.to(rest, { opacity: 0.26, duration: 0.45, ease: "power2.out" }, at);
  }
  if (lit.length) {
    tl.to(lit, { opacity: 1, duration: 0.45, ease: "power2.out" }, at);
  }
}

/* ================================================================
   HUD GLOBAL
   ================================================================ */

tl.fromTo("#progress-fill", { scaleX: 0 }, { scaleX: 1, duration: 380, ease: "none" }, 0);

tl.to("#glow-blue", { x: 170, y: 110, duration: 380, ease: "none" }, 0);
tl.to("#glow-green", { x: -160, y: -100, duration: 380, ease: "none" }, 0);

[12, 56, 112, 158, 238, 294, 328, 368].forEach((t, i) => {
  tl.fromTo(
    "#seg-" + (i + 1),
    { scaleX: 0 },
    { scaleX: 1, duration: 0.55, ease: "power2.out" },
    t,
  );
});

/* ================================================================
   ESCENA 1 · INTRODUCCIÓN   (0 – 12 s)
   ================================================================ */

inAt("#s1", 0, { y: 30 });
outAt("#s1", 11.35, { y: -24 });

inAt("#s1-eyebrow", 0.3, { y: 12, duration: 0.5 });
inAt("#s1-title", 0.5, { y: 34, duration: 0.75 });
tl.fromTo(
  "#s1-rule",
  { scaleX: 0, opacity: 0 },
  { scaleX: 1, opacity: 1, duration: 0.7, ease: "power3.out" },
  1.0,
);
inAt("#s1-lede", 1.3, { y: 22, duration: 0.6 });

tl.fromTo(
  "#s1-roadmap .road-item",
  { opacity: 0, y: 20, scale: 0.97 },
  { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.4)", stagger: 0.16 },
  2.1,
);

inAt("#s1-note", 3.3, { y: 14, duration: 0.5 });
cue("#s1-lt", 4.4, 8.9);

/* ================================================================
   ESCENA 2 · CREAR EL PROYECTO   (12 – 56 s)
   ================================================================ */

inAt("#s2", 12, { y: 26 });
outAt("#s2", 55.4, { y: -24 });

inAt("#s2-head", 12.2, { y: 20, duration: 0.5 });

/* --- 2A · asistente New Project (12 – 31 s) --- */
inAt("#s2-wizard", 12.35, { x: -26, duration: 0.6 });
inAt("#s2-steps", 12.5, { x: 26, duration: 0.6 });

tl.fromTo(
  "#s2-steps .step",
  { opacity: 0, x: 18 },
  { opacity: 1, x: 0, duration: 0.45, ease: "power3.out", stagger: 0.28 },
  13.1,
);

tl.to(
  "#s2-create",
  { scale: 1.08, duration: 0.28, repeat: 1, yoyo: true, ease: "power2.inOut" },
  18.4,
);

cue("#s2-lt-1", 12.6, 20.0);
cue("#s2-lt-2", 20.0, 30.5);

/* --- 2B · estructura, pom y ejecución (31 – 56 s) --- */
outAt("#s2-wizard", 30.6, { x: -26, duration: 0.45 });
outAt("#s2-steps", 30.6, { x: 26, duration: 0.45 });

inAt("#s2-tree", 31.3, { x: -24, duration: 0.55 });
revealTree("#s2-tree", 31.6, 0.09);

inAt("#s2-pom", 31.9, { x: 24, duration: 0.55 });
reveal("#s2-pom", 32.15, 0.07);
inAt("#s2-pom-note", 33.15, { y: 10, duration: 0.4 });

inAt("#s2-run", 33.6, { y: 20, duration: 0.55 });
inAt("#s2-run-status", 34.7, { y: 10, duration: 0.45 });

cue("#s2-lt-5", 32.6, 41.5);
cue("#s2-lt-3", 41.5, 50.0);
cue("#s2-lt-4", 50.0, 55.4);

/* ================================================================
   ESCENA 3 · MODULE-INFO Y EL ERROR DE OPENS   (56 – 112 s)
   ================================================================ */

inAt("#s3", 56, { y: 26 });
outAt("#s3", 111.4, { y: -24 });

inAt("#s3-head", 56.2, { y: 20, duration: 0.5 });

/* --- 3A · el error (56 – 76 s) --- */
inAt("#s3-term", 56.35, { x: -26, duration: 0.55 });
tl.fromTo(
  "#s3-term .term-line",
  { opacity: 0, x: -10 },
  { opacity: 1, x: 0, duration: 0.3, ease: "power2.out", stagger: 0.16 },
  56.6,
);

inAt("#s3-why", 56.7, { x: 26, duration: 0.55 });
tl.fromTo(
  "#s3-why .why-item",
  { opacity: 0, y: 14 },
  { opacity: 1, y: 0, duration: 0.45, ease: "power3.out", stagger: 0.34 },
  57.5,
);

cue("#s3-lt-1", 56.6, 66.0);
cue("#s3-lt-2", 66.0, 75.5);

/* --- 3B · el archivo module-info (76 – 96 s) --- */
outAt("#s3-term", 75.6, { x: -26, duration: 0.45 });
outAt("#s3-why", 75.6, { x: 26, duration: 0.45 });

inAt("#s3-code", 76.1, { y: 24, duration: 0.55 });
reveal("#s3-code", 76.3, 0.075);

inAt("#s3-legend", 76.7, { x: 26, duration: 0.55 });
tl.fromTo(
  "#s3-legend .leg-row",
  { opacity: 0, y: 12 },
  { opacity: 1, y: 0, duration: 0.42, ease: "power3.out", stagger: 0.3 },
  77.4,
);
inAt("#s3-leg-note", 78.6, { y: 10, duration: 0.4 });

/* requires → declara dependencias */
focus("#s3", [{ sel: "#s3-java", from: 2, to: 4 }], 77.4);
/* opens … to → autoriza reflexión */
focus("#s3", [{ sel: "#s3-java", from: 6, to: 10 }], 84.2);
/* exports → publica el paquete */
focus("#s3", [{ sel: "#s3-java", from: 12, to: 12 }], 90.4);

cue("#s3-lt-3", 76.4, 86.0);
cue("#s3-lt-4", 86.0, 95.5);

/* --- 3C · opens vs exports (96 – 112 s) --- */
outAt("#s3-code", 95.6, { y: -20, duration: 0.45 });
outAt("#s3-legend", 95.6, { x: 26, duration: 0.45 });

inAt("#s3-cmp", 96.1, { y: 24, duration: 0.55 });
tl.fromTo(
  "#s3-cmp .cmp-row",
  { opacity: 0, y: 14 },
  { opacity: 1, y: 0, duration: 0.45, ease: "power3.out", stagger: 0.3 },
  96.5,
);

inAt("#s3-rules", 96.4, { x: 26, duration: 0.55 });
tl.fromTo(
  "#s3-rules .mini-rule",
  { opacity: 0, x: 14 },
  { opacity: 1, x: 0, duration: 0.42, ease: "power3.out", stagger: 0.3 },
  97.2,
);

cue("#s3-lt-5", 96.4, 104.0);
cue("#s3-lt-6", 104.0, 111.4);

/* ================================================================
   ESCENA 4 · VISTA ↔ CONTROLADOR   (112 – 158 s)
   ================================================================ */

inAt("#s4", 112, { y: 26 });

inAt("#s4-head", 112.2, { y: 20, duration: 0.5 });

/* --- 4A · mapa de conexiones (112 – 131 s) --- */
tl.fromTo(
  "#s4-map .map-row",
  { opacity: 0, y: 18 },
  { opacity: 1, y: 0, duration: 0.45, ease: "power3.out", stagger: 0.95 },
  112.6,
);
inAt("#s4-map-note", 115.6, { y: 12, duration: 0.45 });

cue("#s4-lt-1", 112.6, 121.0);
cue("#s4-lt-2", 121.0, 130.5);

/* --- 4B · initialize y el método del botón (131 – 150 s) --- */
outAt("#s4-map", 130.6, { y: -20, duration: 0.45 });
outAt("#s4-map-note", 130.6, { y: -20, duration: 0.45 });

inAt("#s4-fxml", 131.1, { x: -24, duration: 0.55 });
reveal("#s4-fxml", 131.35, 0.09);

inAt("#s4-java", 131.4, { x: 24, duration: 0.55 });
reveal("#s4-java", 131.7, 0.05);

tl.fromTo(
  "#s4-rules .rule",
  { opacity: 0, y: 14 },
  { opacity: 1, y: 0, duration: 0.42, ease: "power3.out", stagger: 0.14 },
  132.3,
);

focus("#s4", [{ sel: "#s4-fxml", from: 1, to: 3 }, { sel: "#s4-java", from: 1, to: 1 }], 132.8);
focus("#s4", [{ sel: "#s4-java", from: 3, to: 6 }], 136.4);
focus("#s4", [{ sel: "#s4-fxml", from: 4, to: 5 }, { sel: "#s4-java", from: 8, to: 9 }], 141.2);

cue("#s4-lt-3", 132.6, 141.0);
cue("#s4-lt-4", 141.0, 149.4);

/* --- 4C · qué pasa al hacer clic (150 – 158 s) --- */
outAt("#s4-fxml", 149.5, { y: -18, duration: 0.45 });
outAt("#s4-java", 149.5, { y: -18, duration: 0.45 });
outAt("#s4-rules", 149.5, { y: -18, duration: 0.45 });

tl.fromTo(
  "#s4-flow .flow-chip, #s4-flow .flow-arrow",
  { opacity: 0, y: 18 },
  { opacity: 1, y: 0, duration: 0.42, ease: "power3.out", stagger: 0.16 },
  150.3,
);
inAt("#s4-flow-caption", 151.6, { y: 12, duration: 0.45 });

cue("#s4-lt-5", 150.2, 157.4);

/* ================================================================
   ESCENA 4B · INICIALIZACIÓN   (158 – 238 s)
   ================================================================ */

inAt("#s4b", 158, { y: 26 });
outAt("#s4b", 237.4, { y: -24 });

inAt("#s4b-head", 158.2, { y: 20, duration: 0.5 });

/* --- Orden de ejecución (158 – 178 s) --- */
tl.fromTo(
  "#s4b-exec .exec-step",
  { opacity: 0, x: -18 },
  { opacity: 1, x: 0, duration: 0.45, ease: "power3.out", stagger: 0.35 },
  158.6,
);

inAt("#s4b-note", 158.8, { x: 26, duration: 0.55 });

tl.fromTo("#s4b-s1", { opacity: 0, x: 12 }, { opacity: 1, x: 0, duration: 0.35 }, 161.2);
tl.fromTo("#s4b-s2", { opacity: 0, x: 12 }, { opacity: 1, x: 0, duration: 0.35 }, 162.8);
tl.fromTo("#s4b-s3", { opacity: 0, x: 12 }, { opacity: 1, x: 0, duration: 0.35 }, 164.4);
inAt("#s4b-hint", 165.6, { y: 10, duration: 0.4 });

cue("#s4b-lt-1", 158.6, 167.0);
cue("#s4b-lt-2", 167.0, 177.4);

/* --- ComboBox: declarar vs configurar (178 – 202 s) --- */
outAt("#s4b-exec", 177.5, { x: -18, duration: 0.45 });
outAt("#s4b-note", 177.5, { x: 26, duration: 0.45 });

inAt("#s4b-code", 178.0, { y: 24, duration: 0.55 });
reveal("#s4b-code", 178.25, 0.06);

inAt("#s4b-why", 178.15, { x: 26, duration: 0.55 });
tl.fromTo(
  "#s4b-why .why-item",
  { opacity: 0, y: 12 },
  { opacity: 1, y: 0, duration: 0.42, ease: "power3.out", stagger: 0.42 },
  179.1,
);
inAt("#s4b-bad", 180.6, { y: 10, duration: 0.45 });

focus("#s4b", [{ sel: "#s4b-java", from: 1, to: 2 }], 181.8);
focus("#s4b", [{ sel: "#s4b-java", from: 4, to: 12 }], 186.6);

inAt("#s4b-readout", 193.6, { y: 10, duration: 0.45 });

cue("#s4b-lt-3", 177.6, 189.5);
cue("#s4b-lt-4", 189.5, 201.6);

/* --- TableView: columnas y datos (202 – 226 s) --- */
outAt("#s4b-code", 201.7, { y: -20, duration: 0.45 });
outAt("#s4b-why", 201.7, { x: 26, duration: 0.45 });

inAt("#s4b-table", 202.1, { y: 24, duration: 0.55 });
reveal("#s4b-table", 202.35, 0.05);

inAt("#s4b-mock", 202.2, { x: 26, duration: 0.55 });
tl.fromTo(
  "#s4b-mock .mini-row",
  { opacity: 0, x: 14 },
  { opacity: 1, x: 0, duration: 0.4, ease: "power2.out", stagger: 0.25 },
  203.4,
);
inAt("#s4b-mocknote", 204.4, { y: 8, duration: 0.4 });
inAt("#s4b-mocknote2", 205.6, { y: 8, duration: 0.4 });

focus("#s4b", [{ sel: "#s4b-table-java", from: 1, to: 3 }], 204.9);
focus("#s4b", [{ sel: "#s4b-table-java", from: 6, to: 13 }], 209.6);

cue("#s4b-lt-5", 201.6, 213.5);
cue("#s4b-lt-6", 213.5, 225.6);

/* --- Regla de oro (226 – 238 s) --- */
outAt("#s4b-table", 225.7, { y: -20, duration: 0.45 });
outAt("#s4b-mock", 225.7, { x: 26, duration: 0.45 });

inAt("#s4b-place", 226.1, { y: 22, duration: 0.5 });
tl.fromTo(
  "#s4b-place .place-row",
  { opacity: 0, y: 10 },
  { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", stagger: 0.22 },
  226.5,
);
inAt("#s4b-placenote", 229.4, { y: 8, duration: 0.4 });

cue("#s4b-lt-7", 225.6, 237.4);

/* ================================================================
   ESCENA 5 · PATRÓN DE CAPAS   (238 – 294 s)
   ================================================================ */

inAt("#s5", 238, { y: 24 });

inAt("#s5-head", 238.2, { y: 20, duration: 0.5 });

tl.fromTo(
  "#s5-layers .layer",
  { opacity: 0, y: 18, scale: 0.99 },
  { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out", stagger: 0.16 },
  238.8,
);

inAt("#s5-dep", 240.8, { y: 18, duration: 0.5 });

/* Cada bloque de narración ilumina la capa de la que habla */
[
  [238.6, "#s5-l1"],
  [252.0, "#s5-l2"],
  [266.0, "#s5-l3"],
  [280.0, "#s5-l5"],
].forEach(([t, sel]) => {
  tl.to(sel, { borderColor: "rgba(88,166,255,0.55)", duration: 0.3, ease: "power2.out" }, t);
  tl.to(sel, { borderColor: "#30363d", duration: 0.5, ease: "power2.inOut" }, t + 1.6);
});

cue("#s5-lt-1", 238.6, 252.0);
cue("#s5-lt-2", 252.0, 266.0);
cue("#s5-lt-3", 266.0, 280.0);
cue("#s5-lt-4", 280.0, 293.4);

/* ================================================================
   ESCENA 6 · CÓMO ORGANIZAR   (294 – 328 s)
   ================================================================ */

inAt("#s6", 294, { y: 24 });
outAt("#s6", 327.4, { y: -22 });

inAt("#s6-head", 294.2, { y: 20, duration: 0.5 });

inAt("#s6-tree", 294.4, { x: -24, duration: 0.55 });
revealTree("#s6-tree", 294.7, 0.08);

inAt("#s6-rules", 294.7, { x: 24, duration: 0.55 });
tl.fromTo(
  "#s6-rules .mini-rule",
  { opacity: 0, x: 14 },
  { opacity: 1, x: 0, duration: 0.42, ease: "power3.out", stagger: 0.12 },
  295.2,
);

inAt("#s6-dep", 296.2, { y: 18, duration: 0.5 });

cue("#s6-lt-1", 294.6, 304.0);
cue("#s6-lt-2", 304.0, 313.4);
cue("#s6-lt-3", 313.4, 327.4);

/* ================================================================
   ESCENA 7 · ERRORES COMUNES   (328 – 368 s)
   ================================================================ */

inAt("#s7", 328, { y: 24 });
outAt("#s7", 367.4, { y: -22 });

inAt("#s7-head", 328.2, { y: 20, duration: 0.5 });

tl.fromTo(
  "#s7-grid .err-card",
  { opacity: 0, y: 20 },
  { opacity: 1, y: 0, duration: 0.45, ease: "power3.out", stagger: 0.15 },
  328.6,
);

inAt("#s7-note", 330.6, { y: 12, duration: 0.45 });

/* Refuerzo visual del error del que se habla */
[329.6, 341.2, 354.0].forEach((t, i) => {
  const sel = "#s7-e" + (i === 0 ? 1 : i === 1 ? 2 : 4);
  tl.to(sel, { scale: 1.02, borderColor: "rgba(255,123,114,0.5)", duration: 0.32, ease: "power2.out" }, t);
  tl.to(sel, { scale: 1, borderColor: "#30363d", duration: 0.5, ease: "power2.inOut" }, t + 1.4);
});

cue("#s7-lt-1", 328.6, 341.0);
cue("#s7-lt-2", 341.0, 354.0);
cue("#s7-lt-3", 354.0, 367.4);

/* ================================================================
   ESCENA 8 · CIERRE   (368 – 300 s)
   ================================================================ */

inAt("#s8", 368, { y: 24 });

inAt("#s8-head", 368.2, { y: 20, duration: 0.5 });

tl.fromTo(
  "#s8-checks .check-item",
  { opacity: 0, x: -16 },
  { opacity: 1, x: 0, duration: 0.42, ease: "power3.out", stagger: 0.16 },
  368.7,
);

tl.fromTo(
  "#s8-closing",
  { opacity: 0, y: 26, scale: 0.97 },
  { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" },
  370.0,
);

cue("#s8-lt", 373.2, 378.7);

/* Fundido final a negro */
tl.to("#blackout", { opacity: 1, duration: 0.6, ease: "power2.in" }, 379.2);

/* ================================================================
   Registro del timeline (clave = data-composition-id)
   ================================================================ */
window.__timelines = window.__timelines || {};
window.__timelines.main = tl;
