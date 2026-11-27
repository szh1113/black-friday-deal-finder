// Product illustrations, drawn here as inline SVG — one simple line drawing per
// category, in the site's own palette. No photos, no copied images, no network.

const S = (inner, label) =>
  `<svg viewBox="0 0 120 90" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#f5b301" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${inner}</g></svg>`;

export function iconFor(category) {
  switch (category) {
    case "Audio":
      return S(
        `<path d="M38 58v-8a22 22 0 0 1 44 0v8"/><rect x="30" y="56" width="16" height="22" rx="7"/><rect x="74" y="56" width="16" height="22" rx="7"/><path d="M38 70h-4M86 70h-4"/>`,
        "Headphones",
      );
    case "Computers":
      return S(
        `<rect x="28" y="20" width="64" height="42" rx="4"/><path d="M18 72h84M52 62h16"/><path d="M44 34h32M44 44h20"/>`,
        "Laptop",
      );
    case "Tablets & Wearables":
      return S(
        `<rect x="42" y="16" width="36" height="52" rx="6"/><circle cx="60" cy="46" r="14"/><path d="M60 38v8l5 3"/>`,
        "Watch and tablet",
      );
    case "TVs":
      return S(
        `<rect x="18" y="18" width="84" height="50" rx="4"/><path d="M52 34l16 9-16 9z"/><path d="M52 68v10M68 68v10M40 78h40"/>`,
        "Television",
      );
    case "Smart Home":
      return S(
        `<path d="M22 48 60 20l38 28"/><path d="M32 44v26h56V44"/><rect x="52" y="52" width="16" height="18" rx="2"/><circle cx="82" cy="30" r="4"/>`,
        "Smart home",
      );
    case "Kitchen":
      return S(
        `<path d="M30 30h60v10a20 20 0 0 1-20 20H50a20 20 0 0 1-20-20z"/><path d="M30 30c0-8 6-12 12-12M60 60v14M42 60v14"/><path d="M78 34h10M78 42h8"/>`,
        "Mixer",
      );
    case "Home":
      return S(
        `<circle cx="56" cy="46" r="24"/><circle cx="56" cy="46" r="8"/><path d="M56 22v-6M80 46h8M56 70v6M32 46h-8"/><path d="M74 30l6-6M38 30l-6-6"/>`,
        "Robot vacuum",
      );
    case "Gaming":
      return S(
        `<path d="M34 34h52a12 12 0 0 1 12 12v6a14 14 0 0 1-24 10l-4-4H50l-4 4a14 14 0 0 1-24-10v-6a12 12 0 0 1 12-12z"/><path d="M40 48h12M46 42v12"/><circle cx="76" cy="46" r="2.5"/><circle cx="84" cy="52" r="2.5"/>`,
        "Game controller",
      );
    default:
      return S(`<rect x="30" y="24" width="60" height="44" rx="6"/><path d="M45 46h30"/>`, "Deal");
  }
}
