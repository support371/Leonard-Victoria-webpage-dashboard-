const Stripe = require('stripe');
const db = require('./db');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const PLAN_PRICE_MAP = {
  community: process.env.STRIPE_PRICE_COMMUNITY,
  stewardship: process.env.STRIPE_PRICE_STEWARDSHIP,
  legacy: process.env.STRIPE_PRICE_LEGACY,
};

async function createCheckoutSession({ plan, amount, customerEmail, successUrl, cancelUrl, workspaceSlug }) {
  // Build metadata — include workspace_slug if provided so the webhook can attribute the payment
  const metadata = { plan };
  if (workspaceSlug) metadata.workspace_slug = workspaceSlug;

  if (plan === 'donation') {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: customerEmail,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'Donation — Leonard & Victoria' },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      }],
      success_url: successUrl || `${process.env.FRONTEND_URL}/donate?success=1`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/donate`,
      metadata: { ...metadata, amount: amount.toString() },
    });
    return session;
  }

  const priceId = PLAN_PRICE_MAP[plan];
  if (!priceId) throw new Error(`Unknown membership plan: ${plan}`);

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: customerEmail,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl || `${process.env.FRONTEND_URL}/portal?checkout=success`,
    cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/membership`,
    metadata,
  });
  return session;
}

async function handleWebhookEvent(payload, signature) {
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { plan, amount, workspace_slug } = session.metadata || {};

    // Resolve workspace_id from slug if present in session metadata
    let workspaceId = null;
    if (workspace_slug) {
      const { rows } = await db.query(
        `SELECT id FROM workspaces WHERE slug = $1 AND status = 'active'`,
        [workspace_slug]
      );
      if (rows.length) workspaceId = rows[0].id;
    }

    await db.query(
      `INSERT INTO payment_transactions
        (workspace_id, stripe_session_id, stripe_customer_id, plan, amount_cents, status, customer_email, raw_event)
       VALUES ($1, $2, $3, $4, $5, 'completed', $6, $7)
       ON CONFLICT (stripe_session_id) DO NOTHING`,
      [
        workspaceId,
        session.id,
        session.customer || null,
        plan || null,
        session.amount_total || (amount ? Math.round(parseFloat(amount) * 100) : 0),
        session.customer_email || null,
        JSON.stringify(event),
      ]
    );
  }

  return event;
}

module.exports = { stripe, createCheckoutSession, handleWebhookEvent };
