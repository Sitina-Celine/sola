# sola.: a drink launch page

**Sunshine, sparkling.**

A launch page for a new sparkling fruit soda. It builds urgency with a live countdown and a limited first batch, captures emails with a waitlist discount, shows four flavours, and sells a 12-can case as a monthly subscription or a one-time pre-order through Stripe Checkout.

sola. is a fictional brand created for a portfolio demo. Author: Celine Sitina.

## The funnel

```
Ad or social post
  -> Launch page       countdown to Friday, first batch of 10,000 cans
     -> waitlist       email in, code SUNNY20 out (20% off the first case)
  -> Flavours          four flavours, "Choose" sends the flavour to the order box
  -> Never run dry.    Subscribe and save 20% ($28.80/month) or one-time ($36)
  -> Stripe Checkout   subscription or one-time payment, waitlist coupon applied
  -> Thank-you page    order read back from Stripe
```

| Section | Job it does |
|---|---|
| Hero | Coral, full screen. The can photo has the same coral background, so it floats on the page with no visible edge. Countdown, waitlist form. |
| Facts strip | 5g sugar, 35 calories, 0 artificial sweeteners, 100% real fruit juice. |
| Flavours | Four cards. On phones they become a swipe row. |
| Order box | Flavour chips (or a mixed case), subscribe or one-time. The panel tints to the chosen flavour. |

## Design decisions

- **A launch needs a reason to act now.** The countdown and limited first batch create urgency; the waitlist turns visitors who aren't ready yet into emails.
- **Subscription first.** "Subscribe and save 20%" is preselected because a drink is a repeat purchase. The one-time case is there for people who want to try first.
- **One discount, applied honestly.** The waitlist code is a real Stripe coupon (`duration: once`), so it takes 20% off the first case only, on either plan. The page shows the reduced price before checkout.
- **No database.** Waitlist emails go to `/api/lead`. Set `LEADS_WEBHOOK_URL` to forward them to Klaviyo, Mailchimp, Zapier or Make. Without it the email is checked and logged, and the visitor still gets the code.
- **Launch date.** In the demo the countdown always runs to the next Friday at 9am New York time, so it never shows zero. For a real launch, set `LAUNCH_AT` in `src/data/offer.js`.
- **Server-side truth.** Prices live in `src/data/offer.js` and are read again on the server before charging.

## Tech stack

| Part | Choice |
|---|---|
| Interface | React 19 and Vite, two pages (`index.html`, `thank-you.html`) |
| Payments | Stripe Checkout in `subscription` mode (monthly `recurring` price) or `payment` mode, Stripe Coupons |
| Server code | Vercel serverless functions in `/api` |
| Hosting | Vercel |

## Project structure

```
api/
  create-checkout.js   checks flavour and plan, creates the subscription or payment session
  lead.js              accepts waitlist emails, forwards them if LEADS_WEBHOOK_URL is set
  order.js             reads the paid order for the thank-you page
  health.js            shows whether the keys are loaded (never shows them)
src/
  data/offer.js        flavours, plans, prices, waitlist code, launch date
  data/brand.js        text for the thank-you page
  components/          Hero, Countdown, Facts, Flavours, Order, Footer
  pages/ThankYou.jsx
  styles/              base.css, page.css, thank-you.css
public/img/            photos from Unsplash
```

## Run it locally

1. Install Node.js 20 or newer.
2. `npm install`
3. Copy `.env.example` to `.env.local` and add your Stripe **test** secret key.
4. `npm run dev` and open http://localhost:5173
5. Pay with the Stripe test card `4242 4242 4242 4242`, any future date, any CVC.

Subscriptions made in test mode appear under Billing, Subscriptions in the Stripe Dashboard.

## Deploy to Vercel

1. Push the project to GitHub (`.env.local` is ignored by git).
2. Import the repository in Vercel. Framework preset: Vite.
3. Add `STRIPE_SECRET_KEY` (and `LEADS_WEBHOOK_URL` if you use one) under Settings, Environment Variables, then deploy.

## Credits

Photos from Unsplash: Hamza Guner, Muhammad Syahid Abdillah, Mae Mu, Olivie Strauss, Leighann Blackwood, Karolina Kołodziejczak.
