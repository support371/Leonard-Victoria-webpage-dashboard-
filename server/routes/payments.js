const router = require('express').Router();
const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { validate, checkoutSchema } = require('../validation/schemas');
const { createCheckoutSession, handleWebhookEvent } = require('../services/stripeService');

// POST /api/payments/checkout — create Stripe checkout session
// This endpoint is intentionally guest-safe: donations are initiated from the public
// /donate page without requiring authentication. Stripe will collect the email
// on the checkout page. requireAuth is deliberately absent here.
router.post('/checkout', validate(checkoutSchema), async (req, res, next) => {
  try {
    const { plan, amount, workspace_slug } = req.body;
    const session = await createCheckoutSession({
      plan,
      amount,
      customerEmail: null, // collected by Stripe on the checkout page
      workspaceSlug: workspace_slug || null,
    });
    res.json({ url: session.url, session_id: session.id });
  } catch (err) {
    next(err);
  }
});

// POST /api/payments/webhook — Stripe webhook (raw body required)
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res, next) => {
    try {
      const sig = req.headers['stripe-signature'];
      await handleWebhookEvent(req.body, sig);
      res.json({ received: true });
    } catch (err) {
      console.error('Webhook error:', err.message);
      res.status(400).json({ error: err.message });
    }
  }
);

module.exports = router;
