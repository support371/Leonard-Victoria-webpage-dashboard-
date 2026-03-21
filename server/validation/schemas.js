const { z } = require('zod');

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10),
});

const memberApplicationSchema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  membership_tier: z.enum(['community', 'stewardship', 'legacy']),
  motivation: z.string().min(20),
  referral: z.string().optional(),
});

const documentSchema = z.object({
  title: z.string().min(2),
  category: z.enum(['legal', 'governance', 'finance', 'operations', 'member']),
  description: z.string().optional(),
  storage_path: z.string().optional(),
  filename: z.string().optional(),
  size_bytes: z.number().optional(),
  content_type: z.string().optional(),
});

const checkoutSchema = z.object({
  plan: z.enum(['community', 'stewardship', 'legacy', 'donation']),
  amount: z.number().positive().optional(),
});

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }
    req.body = result.data;
    next();
  };
}

module.exports = {
  contactSchema,
  memberApplicationSchema,
  documentSchema,
  checkoutSchema,
  validate,
};
