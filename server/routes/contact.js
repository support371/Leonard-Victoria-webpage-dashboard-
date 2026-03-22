const router = require('express').Router();
const { validate, contactSchema } = require('../validation/schemas');
const { strictRateLimiter } = require('../middleware/rateLimiter');
const db = require('../services/db');

// POST /api/contact — public contact form
router.post('/', strictRateLimiter, validate(contactSchema), async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    await db.query(
      `INSERT INTO contact_requests (name, email, subject, message)
       VALUES ($1, $2, $3, $4)`,
      [name, email, subject, message]
    );
    res.json({ message: 'Message received. We will be in touch within 2–3 business days.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
