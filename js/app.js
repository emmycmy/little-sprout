import * as store from "./storage.js";
import { softTick } from "./audio.js";
import { TILE_ICONS } from "./icons.js";
import { initShapes } from "./activities/shapes.js";
import { initCounting } from "./activities/counting.js";
import { initLetters } from "./activities/letters.js";
import { initMatching } from "./activities/matching.js";
import { initColors } from "./activities/colors.js";
import { initPatterns } from "./activities/patterns.js";
import { initPuzzles } from "./activities/puzzles.js";
import { initFeelings } from "./activities/feelings.js";

const app = document.getElementById("app");

const CATEGORY_NAMES = ["Letters, Colors & Shapes", "Numbers & Puzzles", "Matching & Feelings"];

const ACTIVITIES = [
  { id: "shapes", label: "Shapes", icon: TILE_ICONS.shapes, pebbleCls: "pebble-sage", pebbleVariant: "pebble-v1", group: 0, init: initShapes },
  { id: "counting", label: "Counting", icon: TILE_ICONS.counting, pebbleCls: "pebble-clay", pebbleVariant: "pebble-v2", group: 1, init: initCounting },
  { id: "letters", label: "Letters", icon: TILE_ICONS.letters, pebbleCls: "pebble-sky", pebbleVariant: "pebble-v3", group: 0, init: initLetters },
  { id: "matching", label: "Matching", icon: TILE_ICONS.matching, pebbleCls: "pebble-honey", pebbleVariant: "pebble-v4", group: 2, init: initMatching },
  { id: "colors", label: "Colors", icon: TILE_ICONS.colors, pebbleCls: "pebble-lavender", pebbleVariant: "pebble-v5", group: 0, init: initColors },
  { id: "patterns", label: "Patterns", icon: TILE_ICONS.patterns, pebbleCls: "pebble-moss", pebbleVariant: "pebble-v6", group: 1, init: initPatterns },
  { id: "puzzles", label: "Puzzles", icon: TILE_ICONS.puzzles, pebbleCls: "pebble-rose", pebbleVariant: "pebble-v7", group: 1, init: initPuzzles },
  { id: "feelings", label: "Feelings", icon: TILE_ICONS.feelings, pebbleCls: "pebble-stone", pebbleVariant: "pebble-v8", group: 2, init: initFeelings },
];

function render(node) {
  app.innerHTML = "";
  app.appendChild(node);
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const child of [].concat(children)) {
    if (child == null) continue;
    node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return node;
}

function tap(fn) {
  return (e) => {
    softTick();
    fn(e);
  };
}

function router() {
  const active = store.getActiveProfile();
  if (!active) return renderProfilePicker();
  return renderHome(active);
}

function renderProfilePicker() {
  const { profiles } = store.getState();
  const rows = profiles.map((p) =>
    el("div", { class: "profile-row", onclick: tap(() => { store.setActiveProfile(p.id); router(); }) }, [
      el("div", { class: "avatar", style: "background: var(--bg-soft)" }, p.avatar),
      el("div", { class: "name" }, p.name),
      el("div", { class: "age" }, p.band === "young" ? "2–3 yrs" : "4–5 yrs"),
      el("button", {
        class: "delete-btn",
        "aria-label": `Remove ${p.name}`,
        onclick: (e) => {
          e.stopPropagation();
          softTick();
          if (confirm(`Remove ${p.name}'s profile? This can't be undone.`)) {
            store.removeProfile(p.id);
            renderProfilePicker();
          }
        },
      }, "×"),
    ])
  );

  render(
    el("div", { class: "screen" }, [
      el("h1", {}, "Little Sprout"),
      el("p", { class: "sub" }, "A calm place to explore, at your own pace."),
      el("div", { class: "profile-list" }, rows),
      el("button", { class: "btn", onclick: tap(renderAddProfile) }, "+ Add a child"),
    ])
  );
}

function renderAddProfile() {
  let band = "young";
  let avatar = store.AVATARS[0];
  const nameInput = el("input", { type: "text", placeholder: "First name" });

  const bandBtns = el("div", { class: "age-pick" }, [
    el("button", {
      class: "selected",
      onclick: tap((e) => {
        band = "young";
        [...e.target.parentElement.children].forEach((c) => c.classList.remove("selected"));
        e.target.classList.add("selected");
      }),
    }, "2–3 years"),
    el("button", {
      onclick: tap((e) => {
        band = "older";
        [...e.target.parentElement.children].forEach((c) => c.classList.remove("selected"));
        e.target.classList.add("selected");
      }),
    }, "4–5 years"),
  ]);

  const avatarBtns = el("div", { class: "avatar-pick" },
    store.AVATARS.map((a, i) =>
      el("button", {
        class: i === 0 ? "selected" : "",
        type: "button",
        "aria-label": `Choose avatar ${a}`,
        onclick: tap((e) => {
          avatar = a;
          [...avatarBtns.children].forEach((c) => c.classList.remove("selected"));
          e.target.classList.add("selected");
        }),
      }, a)
    )
  );

  render(
    el("div", { class: "screen" }, [
      el("h2", {}, "Add a child"),
      el("div", { class: "field" }, [el("label", {}, "Name"), nameInput]),
      el("div", { class: "field" }, [el("label", {}, "Age"), bandBtns]),
      el("div", { class: "field" }, [el("label", {}, "Avatar"), avatarBtns]),
      el("button", {
        class: "btn",
        onclick: tap(() => {
          store.addProfile({ name: nameInput.value, band, avatar });
          router();
        }),
      }, "Start exploring"),
      el("button", { class: "btn", style: "background:transparent;box-shadow:none;color:var(--ink-soft)", onclick: tap(router) }, "Back"),
    ])
  );
  setTimeout(() => nameInput.focus(), 50);
}

function groupByCategory(activities) {
  const count = Math.max(...activities.map((a) => a.group)) + 1;
  const groups = Array.from({ length: count }, () => []);
  activities.forEach((a) => groups[a.group].push(a));
  return groups;
}

function renderHome(profile) {
  const top = el("div", { class: "topbar" }, [
    el("button", { class: "switch-btn", "aria-label": "Switch or add a child", onclick: tap(() => { store.setActiveProfile(null); router(); }) }, [
      el("span", { class: "switch-avatar" }, profile.avatar),
      el("span", { class: "switch-label" }, "Switch"),
    ]),
    el("div", {}, [el("h2", { style: "text-align:center" }, `Hi, ${profile.name}`)]),
    el("button", { class: "icon-btn", "aria-label": "Sound", onclick: tap((e) => {
      const on = !store.isSoundOn();
      store.setSoundOn(on);
      e.target.textContent = on ? "🔊" : "🔇";
    }) }, store.isSoundOn() ? "🔊" : "🔇"),
  ]);

  const compartments = groupByCategory(ACTIVITIES).map((activities, i) => {
    const items = activities.map((a) => {
      const iconDiv = el("div", { class: "tile-icon" });
      iconDiv.innerHTML = a.icon;
      const pebble = el("button", { class: `pebble ${a.pebbleVariant} ${a.pebbleCls}`, onclick: tap(() => openActivity(a, profile)) }, [
        iconDiv,
        el("div", {}, a.label),
      ]);
      return el("div", { class: "shelf-item-wrap" }, pebble);
    });
    const rowInner = el("div", { class: "shelf-row-inner" }, [...items, el("div", { class: "shelf-board" })]);
    return el("div", { class: "shelf-compartment" }, [
      el("div", { class: "shelf-tag" }, CATEGORY_NAMES[i]),
      el("div", { class: "shelf-row" }, rowInner),
    ]);
  });

  const bookcase = el("div", { class: "bookcase" }, el("div", { class: "bookcase-inner" }, compartments));

  render(
    el("div", { class: "screen", style: "justify-content:flex-start;padding-top:0" }, [
      top,
      el("div", { class: "home-scroll" }, bookcase),
    ])
  );
}

function openActivity(activity, profile) {
  const stage = el("div", { class: "activity-stage" });
  const top = el("div", { class: "topbar" }, [
    el("button", { class: "icon-btn", "aria-label": "Home", onclick: tap(() => router()) }, "🏠"),
    el("h2", {}, activity.label),
    el("div", { style: "width:52px" }),
  ]);
  render(el("div", { class: "screen", style: "justify-content:flex-start;padding-top:0" }, [top, stage]));
  activity.init(stage, profile, { el, tap, goHome: router });
}

router();
