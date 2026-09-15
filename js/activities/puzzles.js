import { chime, completeFanfare } from "../audio.js";

export function initPuzzles(stage) {
  build();

  function build() {
    stage.innerHTML = "";
    const note = document.createElement("p");
    note.className = "gentle-note";
    note.textContent = "Tap each piece to build the flower.";

    const scene = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    scene.setAttribute("class", "puzzle-scene");
    scene.setAttribute("viewBox", "0 0 160 170");
    scene.setAttribute("width", "190");
    scene.setAttribute("height", "202");
    scene.innerHTML = `
      <polygon class="pot-shape" points="45,95 115,95 100,155 60,155"/>
      <g class="flower-shape">
        <circle cx="80" cy="55" r="14"/><circle cx="80" cy="35" r="13"/><circle cx="99" cy="49" r="13"/>
        <circle cx="92" cy="71" r="13"/><circle cx="68" cy="71" r="13"/><circle cx="61" cy="49" r="13"/>
      </g>`;

    const tray = document.createElement("div");
    tray.className = "piece-tray";

    const potBtn = document.createElement("button");
    potBtn.className = "piece-btn";
    potBtn.setAttribute("aria-label", "Pot piece");
    potBtn.innerHTML = '<svg viewBox="0 0 80 80"><polygon points="18,20 62,20 52,68 28,68" fill="var(--clay)" stroke="var(--clay-dark)" stroke-width="3"/></svg>';

    const flowerBtn = document.createElement("button");
    flowerBtn.className = "piece-btn";
    flowerBtn.setAttribute("aria-label", "Flower piece");
    flowerBtn.innerHTML = `<svg viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="9" fill="var(--rose)" stroke="var(--rose-dark)" stroke-width="2"/>
      <circle cx="40" cy="26" r="8" fill="var(--rose)" stroke="var(--rose-dark)" stroke-width="2"/>
      <circle cx="52" cy="33" r="8" fill="var(--rose)" stroke="var(--rose-dark)" stroke-width="2"/>
      <circle cx="48" cy="50" r="8" fill="var(--rose)" stroke="var(--rose-dark)" stroke-width="2"/>
      <circle cx="32" cy="50" r="8" fill="var(--rose)" stroke="var(--rose-dark)" stroke-width="2"/>
      <circle cx="28" cy="33" r="8" fill="var(--rose)" stroke="var(--rose-dark)" stroke-width="2"/></svg>`;

    let placed = 0;
    function place(btn, shapeEl) {
      if (btn.classList.contains("placed")) return;
      btn.classList.add("placed");
      shapeEl.classList.add("filled");
      chime();
      placed += 1;
      if (placed === 2) {
        setTimeout(completeFanfare, 200);
        setTimeout(showDone, 700);
      }
    }
    potBtn.addEventListener("click", () => place(potBtn, scene.querySelector(".pot-shape")));
    flowerBtn.addEventListener("click", () => place(flowerBtn, scene.querySelector(".flower-shape")));

    tray.appendChild(potBtn);
    tray.appendChild(flowerBtn);
    stage.appendChild(note);
    stage.appendChild(scene);
    stage.appendChild(tray);
  }

  function showDone() {
    stage.innerHTML = "";
    const banner = document.createElement("div");
    banner.className = "done-banner";
    banner.textContent = "🌸 You grew a flower!";
    const again = document.createElement("button");
    again.className = "btn";
    again.textContent = "Next";
    again.onclick = build;
    stage.appendChild(banner);
    stage.appendChild(again);
  }
}
