// HTML for each page, built from the deal data. Every value is escaped before it
// goes into the page.
import { iconFor } from "./icons.js";

export const escape = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
export const usd = (n) =>
  `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: n % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}`;
export const percentOff = (d) => Math.round((1 - d.price / d.was) * 100);
export const saveAmt = (d) => d.was - d.price;
export const checkedLabel = (iso) =>
  new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "UTC" }) + " UTC";

const VERDICT = {
  "new-low": { label: "NEW LOW", cls: "v-new", text: "Lowest price ever" },
  strong: { label: "STRONG", cls: "v-strong", text: "A real cut" },
  routine: { label: "ROUTINE", cls: "v-routine", text: "Small cut" },
};

export function verdictBadge(d) {
  const v = VERDICT[d.verdict];
  return `<span class="verdict ${v.cls}" title="${escape(v.text)}">${v.label} · ${percentOff(d)}% off</span>`;
}

export function card(d) {
  return `<article class="card">
  <a class="card-art" href="#/deal/${encodeURIComponent(d.id)}" aria-label="${escape(d.title)}">${iconFor(d.category)}</a>
  <div class="card-body">
    <div class="card-top"><span class="store">${escape(d.store)}</span><span class="cat">${escape(d.category)}</span></div>
    <h3><a href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a></h3>
    ${verdictBadge(d)}
    <p class="price"><strong>${usd(d.price)}</strong> <s>${usd(d.was)}</s> <span class="save">save ${usd(saveAmt(d))}</span></p>
    <p class="note">${escape(d.note)}</p>
    <p class="meta">Checked ${checkedLabel(d.checked)} · ${escape(d.source)}</p>
    <p class="cta"><a href="${escape(d.url)}" rel="noopener" target="_blank">View at ${escape(d.store)} ↗</a></p>
  </div>
</article>`;
}

export function hero(deals) {
  const totalSave = deals.reduce((s, d) => s + saveAmt(d), 0);
  const newLows = deals.filter((d) => d.verdict === "new-low").length;
  const stores = new Set(deals.map((d) => d.store)).size;
  return `<section class="hero">
  <p class="kicker">Black Friday 2026 · Friday, November 27</p>
  <h1>Black Friday deals, <em>checked.</em></h1>
  <p class="lede">Every price on this page was read from a named source this morning and checked against the usual price. No inflated “was” prices, no guesses — each deal carries its verdict.</p>
  <dl class="stats">
    <div><dt>Deals checked</dt><dd>${deals.length}</dd></div>
    <div><dt>Stores</dt><dd>${stores}</dd></div>
    <div><dt>New lows</dt><dd>${newLows}</dd></div>
    <div><dt>Total savings</dt><dd>${usd(Math.round(totalSave))}</dd></div>
  </dl>
  <p class="checked-line">Prices checked ${checkedLabel(deals[0].checked)} · Prices change fast — confirm at checkout.</p>
</section>`;
}

export function filterBar(categories, stores) {
  return `<section class="filters" aria-label="Find a deal">
  <div class="filters-row">
    <label class="search">Search <input id="q" type="search" placeholder="Try “AirPods”, “OLED”, “vacuum”…"></label>
    <label>Store
      <select id="store">
        <option value="">All stores</option>
        ${stores.map((s) => `<option value="${escape(s)}">${escape(s)}</option>`).join("")}
      </select>
    </label>
    <label>Discount
      <select id="minoff">
        <option value="0">Any discount</option>
        <option value="20">20% off or more</option>
        <option value="30">30% off or more</option>
        <option value="40">40% off or more</option>
        <option value="50">50% off or more</option>
      </select>
    </label>
    <label>Sort
      <select id="sort">
        <option value="off">Biggest % off</option>
        <option value="save">Biggest $ saved</option>
        <option value="low">Lowest price</option>
        <option value="new">New lows first</option>
      </select>
    </label>
    <label class="check"><input id="newonly" type="checkbox"> New lows only</label>
  </div>
  <div class="chips" id="chips">
    <button type="button" data-cat="" class="chip on">All</button>
    ${categories.map((c) => `<button type="button" data-cat="${escape(c)}" class="chip">${escape(c)}</button>`).join("")}
  </div>
</section>`;
}

export function listShell(deals, categories, stores) {
  return `${hero(deals)}${filterBar(categories, stores)}
<section aria-live="polite"><p id="count" class="count"></p><div id="grid" class="grid"></div></section>
<section class="method">
  <h2>How a deal gets on this page</h2>
  <ol>
    <li><strong>Read, don't guess.</strong> Each price was read from the named source on Friday 27 November 2026, between 08:30 and 08:45 UTC, and the source named the store.</li>
    <li><strong>Check the “was”.</strong> The usual price is the list price the source printed — not a price we invented. The discount is computed from those two numbers.</li>
    <li><strong>Give a verdict.</strong> <span class="verdict v-new">NEW LOW</span> means the lowest price ever seen for the product. <span class="verdict v-strong">STRONG</span> means a real cut worth buying. <span class="verdict v-routine">ROUTINE</span> means a small cut or a price that has held for weeks.</li>
    <li><strong>Link out.</strong> Every deal links to the store's own search page for the product, so you can check the live price before you buy.</li>
  </ol>
  <p>Prices change through the weekend. If a price has moved since we checked, the store's page wins — never this page.</p>
</section>`;
}

export function dealPage(d, related) {
  const v = VERDICT[d.verdict];
  return `<p class="back"><a href="#/">&larr; All deals</a></p>
<article class="detail">
  <div class="detail-art">${iconFor(d.category)}</div>
  <div>
    <div class="card-top"><span class="store">${escape(d.store)}</span><span class="cat">${escape(d.category)}</span></div>
    <h1>${escape(d.title)}</h1>
    <p class="price big"><strong>${usd(d.price)}</strong> <s>${usd(d.was)}</s></p>
    <p class="save-line">${percentOff(d)}% off · you save ${usd(saveAmt(d))}</p>
    <p><span class="verdict ${v.cls}">${v.label}</span> <strong>${escape(v.text)}.</strong> ${escape(d.note)}</p>
    <dl class="facts">
      <dt>Store</dt><dd>${escape(d.store)}</dd>
      <dt>Category</dt><dd>${escape(d.category)}</dd>
      <dt>Sale price</dt><dd>${usd(d.price)}</dd>
      <dt>Usual price</dt><dd>${usd(d.was)}</dd>
      <dt>Checked</dt><dd>${checkedLabel(d.checked)}</dd>
      <dt>Read in</dt><dd>${escape(d.source)}</dd>
    </dl>
    <p class="cta"><a href="${escape(d.url)}" rel="noopener" target="_blank">Find it at ${escape(d.store)} ↗</a></p>
    <p class="meta">Prices change fast — confirm the price at the store before you buy.</p>
  </div>
</article>
${related.length ? `<section><h2>More ${escape(d.category)} deals</h2><div class="grid">${related.map(card).join("")}</div></section>` : ""}`;
}

export function missing() {
  return `<h1>Not found</h1><p>There is no deal at this address. <a href="#/">See all deals</a>.</p>`;
}
