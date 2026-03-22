import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const memberApplicationSchema = z.object({
  first_name: z.string().min(2, 'First name required'),
  last_name: z.string().min(2, 'Last name required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  membership_tier: z.enum(['community', 'stewardship', 'legacy']),
  motivation: z.string().min(20, 'Please tell us more about your motivation (min 20 chars)'),
  referral: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const documentUploadSchema = z.object({
  title: z.string().min(2, 'Document title required'),
  // Must match the DB CHECK constraint on documents.category
  category: z.enum(['general', 'legal', 'governance', 'finance', 'operations', 'member']),
  description: z.string().optional(),
  file: z.any(),
});
