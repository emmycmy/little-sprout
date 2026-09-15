import { chime, speak } from "../audio.js";

const EMOTIONS = {
  happy: { eyebrows: "", eyes: '<circle cx="38" cy="46" r="4.5" fill="#4a4238"/><circle cx="62" cy="46" r="4.5" fill="#4a4238"/>', mouth: '<path d="M34 60 Q50 76 66 60" stroke="#4a4238" stroke-width="4" fill="none" stroke-linecap="round"/>' },
  sad: { eyebrows: '<path d="M28 38 L42 31" stroke="#4a4238" stroke-width="3.5" stroke-linecap="round"/><path d="M72 38 L58 31" stroke="#4a4238" stroke-width="3.5" stroke-linecap="round"/>', eyes: '<circle cx="38" cy="47" r="4.5" fill="#4a4238"/><circle cx="62" cy="47" r="4.5" fill="#4a4238"/>', mouth: '<path d="M34 66 Q50 54 66 66" stroke="#4a4238" stroke-width="4" fill="none" stroke-linecap="round"/>' },
  sleepy: { eyebrows: "", eyes: '<path d="M32 46 Q38 50 44 46" stroke="#4a4238" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M56 46 Q62 50 68 46" stroke="#4a4238" stroke-width="3.5" fill="none" stroke-linecap="round"/>', mouth: '<path d="M40 62 Q50 58 60 62" stroke="#4a4238" stroke-width="3.5" fill="none" stroke-linecap="round"/>' },
  surprised: { eyebrows: '<path d="M28 28 Q35 22 44 26" stroke="#4a4238" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M72 28 Q65 22 56 26" stroke="#4a4238" stroke-width="3.5" fill="none" stroke-linecap="round"/>', eyes: '<circle cx="38" cy="47" r="6.5" fill="none" stroke="#4a4238" stroke-width="3"/><circle cx="62" cy="47" r="6.5" fill="none" stroke="#4a4238" stroke-width="3"/><circle cx="38" cy="47" r="2.2" fill="#4a4238"/><circle cx="62" cy="47" r="2.2" fill="#4a4238"/>', mouth: '<circle cx="50" cy="65" r="7" fill="none" stroke="#4a4238" stroke-width="3.5"/>' },
  frustrated: { eyebrows: '<path d="M28 28 L42 36" stroke="#4a4238" stroke-width="3.5" stroke-linecap="round"/><path d="M72 28 L58 36" stroke="#4a4238" stroke-width="3.5" stroke-linecap="round"/>', eyes: '<circle cx="38" cy="47" r="4.5" fill="#4a4238"/><circle cx="62" cy="47" r="4.5" fill="#4a4238"/>', mouth: '<path d="M37 63 Q50 60 63 63" stroke="#4a4238" stroke-width="4.5" fill="none" stroke-linecap="round"/>' },
  curious: { eyebrows: '<path d="M30 35 L42 35" stroke="#4a4238" stroke-width="3.5" stroke-linecap="round"/><path d="M58 27 Q65 22 72 27" stroke="#4a4238" stroke-width="3.5" fill="none" stroke-linecap="round"/>', eyes: '<circle cx="40" cy="47" r="4.5" fill="#4a4238"/><circle cx="64" cy="47" r="4.5" fill="#4a4238"/>', mouth: '<circle cx="52" cy="63" r="4" fill="#4a4238"/>' },
  disappointed: { eyebrows: '<path d="M30 34 L42 36" stroke="#4a4238" stroke-width="3.5" stroke-linecap="round"/><path d="M70 34 L58 36" stroke="#4a4238" stroke-width="3.5" stroke-linecap="round"/>', eyes: '<circle cx="38" cy="49" r="4.5" fill="#4a4238"/><circle cx="62" cy="49" r="4.5" fill="#4a4238"/>', mouth: '<path d="M38 62 Q50 67 62 62" stroke="#4a4238" stroke-width="3.5" fill="none" stroke-linecap="round"/>' },
};
const WORDS = { happy: "Happy", sad: "Sad", sleepy: "Sleepy", surprised: "Surprised", frustrated: "Frustrated", curious: "Curious", disappointed: "Disappointed" };

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function faceSVG(key, size) {
  const e = EMOTIONS[key];
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}"><circle cx="50" cy="50" r="38" fill="#fdfaf4" stroke="#7f9878" stroke-width="4"/>${e.eyebrows}${e.eyes}${e.mouth}</svg>`;
}

export function initFeelings(stage) {
  round();

  function round() {
    stage.innerHTML = "";
    const picks = shuffle(Object.keys(EMOTIONS)).slice(0, 4);
    const target = picks[0];
    const options = shuffle(picks).map((k) => ({ key: k, correct: k === target }));

    const note = document.createElement("p");
    note.className = "gentle-note";
    note.textContent = "Find the matching feeling.";

    const targetBtn = document.createElement("button");
    targetBtn.className = "feel-target";
    targetBtn.innerHTML = faceSVG(target, 108);
    targetBtn.addEventListener("click", () => speak(WORDS[target]));

    const wordRow = document.createElement("div");
    wordRow.className = "feel-word-row";
    wordRow.innerHTML = `<span class="word-label">${WORDS[target]}</span>`;
    const speakerBtn = document.createElement("button");
    speakerBtn.className = "speaker-btn";
    speakerBtn.setAttribute("aria-label", "Hear the word");
    speakerBtn.textContent = "🔊";
    speakerBtn.addEventListener("click", () => speak(WORDS[target]));
    wordRow.appendChild(speakerBtn);

    const tray = document.createElement("div");
    tray.className = "feel-tray";
    options.forEach((o) => {
      const btn = document.createElement("button");
      btn.className = "feel-btn";
      btn.innerHTML = faceSVG(o.key, 36);
      btn.addEventListener("click", () => {
        if (!o.correct) {
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
    stage.appendChild(targetBtn);
    stage.appendChild(wordRow);
    stage.appendChild(tray);

    speak(WORDS[target]);
  }

  function showDone() {
    stage.innerHTML = "";
    const banner = document.createElement("div");
    banner.className = "done-banner";
    banner.textContent = "💛 Well noticed!";
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
