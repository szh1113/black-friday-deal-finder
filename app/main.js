// A deal finder: every deal and a page for each, on hash routes. The deals are in
// data.js, so the site needs no network to show them; each deal links out to its
// store. Filters (search, category, store, discount, new-lows-only) and sorting
// all work on the list page.
//
//   #/            the board: hero, filters, deal grid
//   #/deal/<id>   one deal, with its verdict and evidence
//
// window.__dealcheck exposes the current state for tests, and window.__shotReady
// is false while a page renders and true once it is on screen, so a screenshot
// script knows when to capture.

import { deals, categories, stores } from "./data.js";
import { card, listShell, dealPage, missing, percentOff, saveAmt } from "./views.js";

const app = document.getElementById("app");

const state = { q: "", cat: "", store: "", minoff: 0, newonly: false, sort: "off" };

function applyFilters(list) {
  const q = state.q.trim().toLowerCase();
  let out = list.filter((d) => {
    if (state.cat && d.category !== state.cat) return false;
    if (state.store && d.store !== state.store) return false;
    if (percentOff(d) < state.minoff) return false;
    if (state.newonly && d.verdict !== "new-low") return false;
    if (q && !`${d.title} ${d.store} ${d.category} ${d.note}`.toLowerCase().includes(q)) return false;
    return true;
  });
  const by = {
    off: (a, b) => percentOff(b) - percentOff(a) || saveAmt(b) - saveAmt(a),
    save: (a, b) => saveAmt(b) - saveAmt(a),
    low: (a, b) => a.price - b.price,
    new: (a, b) => (a.verdict === "new-low" ? 0 : 1) - (b.verdict === "new-low" ? 0 : 1) || percentOff(b) - percentOff(a),
  }[state.sort];
  return out.sort(by);
}

function renderGrid() {
  const grid = document.getElementById("grid");
  const count = document.getElementById("count");
  if (!grid) return;
  const shown = applyFilters(deals);
  count.textContent =
    shown.length === deals.length
      ? `${deals.length} deals, checked this morning`
      : `${shown.length} of ${deals.length} deals match`;
  grid.innerHTML = shown.length ? shown.map(card).join("") : "<p>No deal matches. Try clearing a filter.</p>";
}

function wireFilters() {
  const q = document.getElementById("q");
  const store = document.getElementById("store");
  const minoff = document.getElementById("minoff");
  const sort = document.getElementById("sort");
  const newonly = document.getElementById("newonly");
  const chips = document.getElementById("chips");
  if (q) q.addEventListener("input", () => { state.q = q.value; renderGrid(); });
  if (store) store.addEventListener("change", () => { state.store = store.value; renderGrid(); });
  if (minoff) minoff.addEventListener("change", () => { state.minoff = Number(minoff.value); renderGrid(); });
  if (sort) sort.addEventListener("change", () => { state.sort = sort.value; renderGrid(); });
  if (newonly) newonly.addEventListener("change", () => { state.newonly = newonly.checked; renderGrid(); });
  if (chips) {
    chips.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-cat]");
      if (!btn) return;
      state.cat = btn.dataset.cat;
      chips.querySelectorAll(".chip").forEach((c) => c.classList.toggle("on", c === btn));
      renderGrid();
    });
  }
}

function render() {
  window.__shotReady = false;
  const match = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (match) {
    const found = deals.find((d) => d.id === decodeURIComponent(match[1]));
    document.title = `${found ? found.title : "Not found"} | DealCheck`;
    app.innerHTML = found
      ? dealPage(found, deals.filter((d) => d.category === found.category && d.id !== found.id).slice(0, 3))
      : missing();
  } else {
    document.title = "DealCheck — Black Friday deals, checked";
    app.innerHTML = listShell(deals, categories, stores);
    wireFilters();
    renderGrid();
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.__dealcheck = {
  state: () => ({
    shown: document.querySelectorAll("#grid .card").length,
    total: deals.length,
    firstTitle: document.querySelector("#grid .card h3")?.textContent ?? "",
    countText: document.getElementById("count")?.textContent ?? "",
  }),
};

window.addEventListener("hashchange", render);
render();
