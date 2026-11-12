/* ================================================================
   Tutorial JavaFX — Controles y tabla paso a paso
   Línea de tiempo HyperFrames (determinista, seek-safe)
   1920×1080 · 30 fps · 120 s · 3600 frames

   Escena 1   0– 10 s   Introducción y hoja de ruta
   Escena 2  10– 34 s   PASO 01 · ComboBox
   Escena 3  34– 64 s   PASO 02 · Tabla con campo calculado
   Escena 4  64– 84 s   PASO 03 · CheckBox
   Escena 5  84–112 s   PASO 04 · ¿Qué clase uso? + listar
   Escena 6 112–120 s   Cierre
   ================================================================ */

const tl = gsap.timeline({ paused: true });

/* ----------------------------------------------------------------
   Helpers
   ---------------------------------------------------------------- */

/** Entrada de un elemento: fade + desplazamiento (+ escalado opcional). */
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

/** Salida de un elemento. */
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

/** Subtítulo lower-third: entra, se mantiene y sale antes del siguiente. */
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

/** Aparición de líneas de código, una tras otra. */
function reveal(selector, at, stagger = 0.06) {
  tl.fromTo(
    selector + " .cl",
    { opacity: 0, x: -12 },
    { opacity: 1, x: 0, duration: 0.32, ease: "power2.out", stagger },
    at,
  );
}

/**
 * Enfoca grupos de líneas y atenúa el resto.
 * groups = [{ sel: "#s2-java", from: 3, to: 6 }, ...]  (1-based, inclusivo)
 */
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
   HUD GLOBAL · progreso, medidor de pasos y deriva del fondo
   ================================================================ */

tl.fromTo("#progress-fill", { scaleX: 0 }, { scaleX: 1, duration: 120, ease: "none" }, 0);

tl.to("#glow-blue", { x: 150, y: 90, duration: 120, ease: "none" }, 0);
tl.to("#glow-green", { x: -140, y: -80, duration: 120, ease: "none" }, 0);

[10, 34, 64, 84].forEach((t, i) => {
  tl.fromTo(
    "#seg-" + (i + 1),
    { scaleX: 0 },
    { scaleX: 1, duration: 0.55, ease: "power2.out" },
    t,
  );
});

/* ================================================================
   ESCENA 1 · INTRODUCCIÓN   (0 – 10 s)
   ================================================================ */

inAt("#s1", 0, { y: 30 });
outAt("#s1", 9.3, { y: -24 });

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
   ESCENA 2 · PASO 01 · COMBOBOX   (10 – 34 s)
   ================================================================ */

inAt("#s2", 10, { y: 26 });
outAt("#s2", 33.45, { y: -24 });

inAt("#s2-head", 10.2, { y: 20, duration: 0.5 });
inAt("#s2-code", 10.35, { y: 26, duration: 0.55 });
inAt("#s2-mock", 10.55, { x: 28, duration: 0.55 });
inAt("#s2-explain", 10.7, { x: 28, duration: 0.55 });

reveal("#s2-fxml", 10.8, 0.14);
reveal("#s2-java", 10.95, 0.055);

/* Fase A — declarar el control */
inAt("#s2-st1", 11.55, { x: 18, duration: 0.45 });
focus("#s2", [{ sel: "#s2-fxml", from: 1, to: 2 }, { sel: "#s2-java", from: 1, to: 1 }], 12.0);
cue("#s2-lt-1", 10.7, 17.15);

/* Fase B — llenar las opciones */
inAt("#s2-st2", 17.4, { x: 18, duration: 0.45 });
focus("#s2", [{ sel: "#s2-java", from: 3, to: 6 }], 17.3);
tl.fromTo(
  "#s2-combo-list",
  { opacity: 0, scaleY: 0.55, y: -8 },
  { opacity: 1, scaleY: 1, y: 0, duration: 0.5, ease: "back.out(1.4)" },
  17.5,
);
cue("#s2-lt-2", 17.15, 24.35);

/* Fase C — leer el valor */
inAt("#s2-st3", 24.6, { x: 18, duration: 0.45 });
inAt("#s2-st4", 25.3, { x: 18, duration: 0.45 });
focus("#s2", [{ sel: "#s2-java", from: 7, to: 12 }], 24.45);
tl.fromTo(
  "#s2-readout",
  { opacity: 0, y: 10 },
  { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
  24.9,
);
cue("#s2-lt-3", 24.35, 33.3);

/* ================================================================
   ESCENA 3 · PASO 02 · TABLA + CAMPO CALCULADO   (34 – 64 s)
   ================================================================ */

inAt("#s3", 34, { y: 26 });
outAt("#s3", 63.45, { y: -24 });

inAt("#s3-head", 34.2, { y: 20, duration: 0.5 });
inAt("#s3-code", 34.35, { y: 26, duration: 0.55 });
inAt("#s3-table", 34.55, { x: 28, duration: 0.55 });
inAt("#s3-formulas", 34.7, { x: 28, duration: 0.55 });

reveal("#s3-fxml", 34.8, 0.12);
reveal("#s3-java", 35.0, 0.05);

/* Filas de ejemplo */
[36.2, 36.8, 37.4].forEach((t, i) => {
  tl.fromTo(
    "#s3-row-" + (i + 1),
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
    t,
  );
});
tl.fromTo("#s3-caption", { opacity: 0 }, { opacity: 1, duration: 0.45 }, 38.1);

/* Fase A — tipos de la columna */
focus("#s3", [{ sel: "#s3-fxml", from: 1, to: 6 }, { sel: "#s3-java", from: 1, to: 2 }], 39.2);
cue("#s3-lt-1", 34.6, 41.25);

/* Fase B — la función que produce la celda */
focus("#s3", [{ sel: "#s3-java", from: 3, to: 7 }], 41.9);
inAt("#s3-f1", 39.7, { y: 14, duration: 0.45 });
inAt("#s3-f2", 40.3, { y: 14, duration: 0.45 });
inAt("#s3-note", 42.5, { y: 12, duration: 0.45 });
cue("#s3-lt-2", 41.25, 49.15);

/* Fase C — la columna calculada */
focus("#s3", [{ sel: "#s3-java", from: 8, to: 9 }], 49.4);
tl.to(
  "#s3-row-1 .calc",
  { scale: 1.14, duration: 0.35, repeat: 1, yoyo: true, ease: "power2.inOut" },
  49.6,
);
cue("#s3-lt-3", 49.15, 56.85);

/* Fase D — ObservableList conectada */
focus("#s3", [{ sel: "#s3-java", from: 9, to: 9 }], 56.95);
cue("#s3-lt-4", 56.85, 63.4);

/* ================================================================
   ESCENA 4 · PASO 03 · CHECKBOX   (64 – 84 s)
   ================================================================ */

inAt("#s4", 64, { y: 26 });
outAt("#s4", 83.45, { y: -24 });

inAt("#s4-head", 64.2, { y: 20, duration: 0.5 });
inAt("#s4-code", 64.35, { y: 26, duration: 0.55 });
inAt("#s4-mock", 64.55, { x: 28, duration: 0.55 });
inAt("#s4-effect", 64.7, { x: 28, duration: 0.55 });

reveal("#s4-fxml", 64.8, 0.14);
reveal("#s4-java", 65.0, 0.055);

/* El control aparece marcado */
tl.fromTo(
  "#s4-tick-1",
  { scale: 0 },
  { scale: 1, duration: 0.4, ease: "back.out(1.8)" },
  65.6,
);

/* Fase A — declarar el control */
focus("#s4", [{ sel: "#s4-fxml", from: 1, to: 2 }, { sel: "#s4-java", from: 1, to: 2 }], 65.5);
cue("#s4-lt-1", 64.6, 70.45);

/* Fase B — leer el estado */
focus("#s4", [{ sel: "#s4-java", from: 3, to: 5 }], 70.6);
inAt("#s4-eq1", 70.8, { x: 14, duration: 0.45 });
inAt("#s4-effect .effect-text", 71.3, { y: 10, duration: 0.45 });
inAt("#s4-result", 71.9, { y: 10, duration: 0.45 });
cue("#s4-lt-2", 70.45, 76.35);

/* Fase C — habilitar y limpiar */
focus("#s4", [{ sel: "#s4-java", from: 7, to: 10 }], 76.5);
inAt("#s4-note", 76.9, { y: 10, duration: 0.45 });
tl.to("#s4-tick-1", { scale: 0, duration: 0.35, ease: "power2.in" }, 78.3);
cue("#s4-lt-3", 76.35, 83.35);

/* ================================================================
   ESCENA 5 · PASO 04 · ¿QUÉ CLASE USO?   (84 – 112 s)
   ================================================================ */

inAt("#s5", 84, { y: 24 });

inAt("#s5-head", 84.2, { y: 20, duration: 0.5 });

/* Fase A — jerarquía */
inAt("#s5-parent", 84.4, { y: 22, duration: 0.55 });
tl.fromTo(
  ["#s5-child-p", "#s5-child-e"],
  { opacity: 0, y: 24 },
  { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", stagger: 0.18 },
  84.75,
);

tl.fromTo("#s5-l1", { opacity: 0, scaleY: 0 }, { opacity: 1, scaleY: 1, duration: 0.4 }, 85.2);
tl.fromTo("#s5-l2", { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 0.55 }, 85.45);
tl.fromTo("#s5-l3", { opacity: 0, scaleY: 0 }, { opacity: 1, scaleY: 1, duration: 0.4 }, 85.75);
tl.fromTo("#s5-l4", { opacity: 0, scaleY: 0 }, { opacity: 1, scaleY: 1, duration: 0.4 }, 85.9);
inAt("#s5-tag", 85.9, { y: 8, duration: 0.4 });

tl.fromTo(
  "#s5-rules .rule-pill",
  { opacity: 0, y: 18 },
  { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.1 },
  86.2,
);

cue("#s5-lt-1", 84.7, 93.1);

/* La jerarquía cede el paso al código */
outAt("#s5-diagram", 93.25, { y: -22, duration: 0.5 });

/* Fase B — crear y listar */
inAt("#s5-code", 94.05, { y: 24, duration: 0.55 });
inAt("#s5-table", 94.2, { x: 26, duration: 0.55 });
inAt("#s5-tip", 94.35, { y: 18, duration: 0.5 });
inAt("#s5-concept", 94.5, { y: 18, duration: 0.5 });

reveal("#s5-java", 94.45, 0.05);

/* Decidir la clase */
focus("#s5", [{ sel: "#s5-java", from: 1, to: 8 }], 94.95);
cue("#s5-lt-2", 94.35, 101.15);

/* Agregar a la lista */
focus("#s5", [{ sel: "#s5-java", from: 9, to: 11 }], 101.35);
[101.85, 102.45, 103.05].forEach((t, i) => {
  tl.fromTo(
    "#s5-row-" + (i + 1),
    { opacity: 0, x: 14 },
    { opacity: 1, x: 0, duration: 0.45, ease: "power2.out" },
    t,
  );
});
tl.fromTo("#s5-caption", { opacity: 0 }, { opacity: 1, duration: 0.45 }, 103.5);
cue("#s5-lt-3", 101.15, 107.15);

/* Polimorfismo en la tabla */
focus("#s5", [{ sel: "#s5-java", from: 1, to: 11 }], 107.35);
tl.to(
  "#s5-table .calc",
  {
    scale: 1.1,
    duration: 0.3,
    repeat: 1,
    yoyo: true,
    ease: "power2.inOut",
    stagger: 0.08,
  },
  107.5,
);
cue("#s5-lt-4", 107.15, 111.6);

/* ================================================================
   ESCENA 6 · CIERRE   (112 – 120 s)
   ================================================================ */

inAt("#s6", 112.05, { y: 26 });
inAt("#s6-head", 112.2, { y: 20, duration: 0.5 });

tl.fromTo(
  "#s6-cards .know-card",
  { opacity: 0, y: 20 },
  { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.16 },
  112.45,
);

tl.fromTo(
  "#s6-closing",
  { opacity: 0, y: 28, scale: 0.97 },
  { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: "power3.out" },
  113.55,
);

cue("#s6-lt", 113.2, 118.7);

/* Fundido final a negro */
tl.to("#blackout", { opacity: 1, duration: 0.6, ease: "power2.in" }, 119.2);

/* ================================================================
   Registro del timeline (clave = data-composition-id)
   ================================================================ */
window.__timelines = window.__timelines || {};
window.__timelines.main = tl;
