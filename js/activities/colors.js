import { chime } from "../audio.js";

const PALETTE = [
  { fill: "var(--sage)", stroke: "var(--sage-dark)" },
  { fill: "var(--clay)", stroke: "var(--clay-dark)" },
  { fill: "var(--sky)", stroke: "var(--sky-dark)" },
  { fill: "var(--honey)", stroke: "var(--honey-dark)" },
  { fill: "var(--lavender)", stroke: "var(--lavender-dark)" },
];

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function leafSVG(fill, stroke) {
  return `<svg viewBox="0 0 40 40"><path d="M20 4C10 10 6 20 12 30c4 6 12 8 16 2 6-9 2-22-8-28z" fill="${fill}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/><path d="M20 8v24" stroke="${stroke}" stroke-width="2" opacity=".5"/></svg>`;
}

export function initColors(stage) {
  round();

  function round() {
    stage.innerHTML = "";
    const target = PALETTE[Math.floor(Math.random() * PALETTE.length)];

    const note = document.createElement("p");
    note.className = "gentle-note";
    note.textContent = "Find the matching leaf.";

    const targetEl = document.createElement("div");
    targetEl.className = "color-target";
    targetEl.style.background = target.fill;
    targetEl.innerHTML = leafSVG("#fdfaf4", "#ffffff");

    const tray = document.createElement("div");
    tray.className = "color-tray";
    shuffle(PALETTE).forEach((c) => {
      const btn = document.createElement("button");
      btn.className = "leaf-btn";
      btn.style.background = c.fill;
      btn.innerHTML = leafSVG("#fdfaf4", c.stroke);
      btn.addEventListener("click", () => {
        if (c !== target) {
          wobble(btn);
          return;
        }
        btn.classList.add("correct-flash");
        chime();
        setTimeout(showDone, 450);
      });
      tray.appendChild(btn);
    });

    stage.appendChild(note);
    stage.appendChild(targetEl);
    stage.appendChild(tray);
  }

  function showDone() {
    stage.innerHTML = "";
    const banner = document.createElement("div");
    banner.className = "done-banner";
    banner.textContent = "🌈 Colors matched!";
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
