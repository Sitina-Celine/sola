// Brand text used by the shared thank-you page
import { launchLabel } from "./offer.js";

export const BRAND = {
  name: "sola.",
  thanksTitle: (first) => (first ? `You're in, ${first}.` : "You're in."),
  backLabel: "Back to sola.",
  nextSteps: (order) => [
    `Your case ships on launch day, ${launchLabel()}. You'll get a tracking link by email.`,
    "Keep the cans cold. sola. tastes best at fridge temperature.",
    order.subscription
      ? "Your next case comes a month later. Reply to your receipt email to skip or cancel any time."
      : "Want it every month? Subscribe on your next order and save 20%.",
  ],
};
