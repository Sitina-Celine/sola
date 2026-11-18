// Creates the Stripe Checkout Session for a 12-can case.
// POST /api/create-checkout  { flavour, plan, code }
// plan "subscribe" creates a monthly subscription; plan "once" is a single payment.
// Prices come from src/data/offer.js on the server, never from the browser.

import Stripe from "stripe";
import { PLANS, WAITLIST, PRODUCT_NAME, CANS_PER_CASE, findFlavour, launchLabel } from "../src/data/offer.js";

export function buildCheckout(body) {
  const flavour = findFlavour(body?.flavour);
  if (!flavour) return { error: "Choose a flavour first." };
  const plan = PLANS[body?.plan];
  if (!plan) return { error: "Choose subscribe or one-time." };
  const useCode = typeof body?.code === "string" && body.code.trim().toUpperCase() === WAITLIST.code;
  const subscription = plan.id === "subscribe";

  const priceData = {
    currency: "usd",
    unit_amount: Math.round(plan.price * 100),
    product_data: {
      name: `${PRODUCT_NAME}, ${flavour.name}`,
      description: `${CANS_PER_CASE} cans. Free shipping.${subscription ? " Delivered monthly." : ""}`,
    },
  };
  if (subscription) priceData.recurring = { interval: "month" };

  return {
    subscription,
    useCode,
    lineItems: [{ quantity: 1, price_data: priceData }],
    metadata: {
      flavour: flavour.id,
      plan: plan.id,
      waitlistCode: useCode ? "yes" : "no",
      note: `Pre-order. Your first case ships on launch day, ${launchLabel()}.`,
    },
  };
}

// The waitlist coupon is created in Stripe the first time it's needed
async function ensureCoupon(stripe) {
  try {
    await stripe.coupons.retrieve(WAITLIST.code);
  } catch (err) {
    if (err.code !== "resource_missing") throw err;
    try {
      await stripe.coupons.create({ id: WAITLIST.code, percent_off: WAITLIST.percent, duration: "once", name: "Waitlist: 20% off your first case" });
    } catch (createErr) {
      if (createErr.code !== "resource_already_exists") throw createErr;
    }
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const order = buildCheckout(req.body);
  if (order.error) {
    res.status(400).json({ error: order.error });
    return;
  }

  const protocol = req.headers["x-forwarded-proto"] || "http";
  const origin = `${protocol}://${req.headers.host}`;

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    if (order.useCode) await ensureCoupon(stripe);

    const params = {
      mode: order.subscription ? "subscription" : "payment",
      allowed_payment_method_types: ["card"],
      line_items: order.lineItems,
      discounts: order.useCode ? [{ coupon: WAITLIST.code }] : undefined,
      shipping_address_collection: { allowed_countries: ["US"] },
      metadata: order.metadata,
      success_url: `${origin}/thank-you.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?checkout=cancelled#order`,
    };
    if (order.subscription) {
      params.subscription_data = { metadata: order.metadata };
    } else {
      // Keep the price in US dollars for every visitor
      params.adaptive_pricing = { enabled: false };
    }

    const session = await stripe.checkout.sessions.create(params);
    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err.message);
    res.status(500).json({ error: "Checkout couldn't start. Please try again." });
  }
}
