import { chime } from "../audio.js";

const SHAPE_COLORS = {
  circle: { fill: "var(--sage)", stroke: "#7f9878" },
  square: { fill: "var(--clay)", stroke: "#c17f65" },
  triangle: { fill: "var(--sky)", stroke: "#7ea3ab" },
};

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shapeSVG(kind) {
  const c = SHAPE_COLORS[kind];
  if (kind === "circle") return `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" fill="${c.fill}" stroke="${c.stroke}" stroke-width="3"/></svg>`;
  if (kind === "square") return `<svg viewBox="0 0 40 40"><rect x="7" y="7" width="26" height="26" rx="6" fill="${c.fill}" stroke="${c.stroke}" stroke-width="3"/></svg>`;
  return `<svg viewBox="0 0 40 40"><polygon points="20,6 34,32 6,32" fill="${c.fill}" stroke="${c.stroke}" stroke-width="3" stroke-linejoin="round"/></svg>`;
}

export function initPatterns(stage, profile) {
  const kinds = profile.band === "young"
    ? ["circle", "square", "triangle"].slice(0, 2)
    : ["circle", "square", "triangle"];

  round();

  function round() {
    stage.innerHTML = "";
    const [a, b] = shuffle(kinds).slice(0, 2);
    const cycle = kinds.length === 3 ? shuffle(kinds) : [a, b];
    const seq = [0, 1, 2, 3].map((i) => cycle[i % cycle.length]);
    const next = cycle[seq.length % cycle.length];

    const note = document.createElement("p");
    note.className = "gentle-note";
    note.textContent = "What comes next?";

    const row = document.createElement("div");
    row.className = "pattern-row";
    seq.forEach((k) => {
      const slot = document.createElement("div");
      slot.className = "pattern-slot";
      slot.innerHTML = shapeSVG(k);
      row.appendChild(slot);
    });
    const empty = document.createElement("div");
    empty.className = "pattern-slot empty";
    row.appendChild(empty);

    const tray = document.createElement("div");
    tray.className = "pattern-tray";
    shuffle(["circle", "square", "triangle"]).forEach((k) => {
      const btn = document.createElement("button");
      btn.className = "pattern-opt";
      btn.innerHTML = shapeSVG(k);
      btn.addEventListener("click", () => {
        if (k !== next) {
          wobble(btn);
          return;
        }
        empty.classList.remove("empty");
        empty.classList.add("filled-correct");
        empty.innerHTML = shapeSVG(k);
        chime();
        setTimeout(showDone, 550);
      });
      tray.appendChild(btn);
    });

    stage.appendChild(note);
    stage.appendChild(row);
    stage.appendChild(tray);
  }

  function showDone() {
    stage.innerHTML = "";
    const banner = document.createElement("div");
    banner.className = "done-banner";
    banner.textContent = "✨ Pattern complete!";
    const again = document.createElement("button");
    again.className = "btn";
    again.textContent = "Next";
    again.onclick = round;
    stage.appendChild(banner);
    stage.appendChild(again);
  }
}

function wobble(btn) {
  btn.classList.remove("shake");
  void btn.offsetWidth;
  btn.classList.add("shake");
  setTimeout(() => btn.classList.remove("shake"), 500);
}
