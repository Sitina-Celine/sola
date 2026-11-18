// Single source of truth for flavours, plans and prices.
// The page reads this file to show prices, and the server reads it again to charge.

export const PRODUCT_NAME = "sola. sparkling fruit soda";
export const CANS_PER_CASE = 12;

export const FLAVOURS = [
  { id: "yuzu-hibiscus", name: "Yuzu Hibiscus", color: "#FF7A59", soft: "#FFD9C9", notes: "Bright, floral and a little tart.", img: "/img/yuzu.jpg", alt: "Pink sparkling drink with an orange slice in a wine glass on a blue background" },
  { id: "blood-orange", name: "Blood Orange", color: "#E8452C", soft: "#FFD2C4", notes: "Juicy, deep and sunny.", img: "/img/blood-orange.jpg", alt: "Blood oranges, mandarins and fresh juice on pink tiles" },
  { id: "cucumber-mint", name: "Cucumber Mint", color: "#3FA36B", soft: "#D7F0DD", notes: "Cool, green and crisp.", img: "/img/cucumber.jpg", alt: "Pale green drink with a slice of cucumber on the glass" },
  { id: "passion-fruit", name: "Passion Fruit", color: "#F2A900", soft: "#FFEBB3", notes: "Tropical, golden and bold.", img: "/img/passion.jpg", alt: "A hand holding an open passion fruit on a yellow background" },
];

// "Mixed" means three cans of each flavour
export const MIXED = { id: "mixed", name: "Mixed case", color: "#1F2A1C", soft: "#F1E7D3", notes: "Three of each flavour." };

export const PLANS = {
  subscribe: { id: "subscribe", label: "Subscribe and save 20%", price: 28.8, was: 36, per: "every month", detail: "A fresh case every month. Skip or cancel any time." },
  once: { id: "once", label: "One-time case", price: 36, was: null, per: "", detail: "12 cans, one delivery." },
};

// Given to visitors who join the waitlist. Applies once, to the first case.
export const WAITLIST = { code: "SUNNY20", percent: 20 };

export const FIRST_BATCH = "10,000";

export const findFlavour = (id) => (id === MIXED.id ? MIXED : FLAVOURS.find((f) => f.id === id));

// For a real launch, set a fixed date, for example "2026-12-04T14:00:00Z".
// Left empty, the demo always counts down to the next Friday at 14:00 UTC (9am New York).
export const LAUNCH_AT = "";

// Worked out the same way on the page and on the server
export function nextLaunch(now = new Date()) {
  if (LAUNCH_AT) return new Date(LAUNCH_AT);
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 14, 0, 0));
  const add = (5 - d.getUTCDay() + 7) % 7;
  d.setUTCDate(d.getUTCDate() + add);
  if (d <= now) d.setUTCDate(d.getUTCDate() + 7);
  return d;
}

export const launchLabel = (d = nextLaunch()) =>
  d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" });
