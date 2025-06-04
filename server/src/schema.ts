
import { z } from 'zod';

// User schema for administrators
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  password_hash: z.string(),
  is_admin: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// Blog post schema
export const blogPostSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  excerpt: z.string().nullable(),
  slug: z.string(),
  author_id: z.number(),
  is_published: z.boolean(),
  published_at: z.coerce.date().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type BlogPost = z.infer<typeof blogPostSchema>;

// Media file schema
export const mediaFileSchema = z.object({
  id: z.number(),
  filename: z.string(),
  original_name: z.string(),
  mime_type: z.string(),
  file_size: z.number(),
  file_path: z.string(),
  post_id: z.number().nullable(),
  created_at: z.coerce.date()
});

export type MediaFile = z.infer<typeof mediaFileSchema>;

// Input schemas for creating/updating
export const createUserInputSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  is_admin: z.boolean().default(false)
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const loginInputSchema = z.object({
  username: z.string(),
  password: z.string()
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const createBlogPostInputSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().nullable().optional(),
  slug: z.string().min(1),
  author_id: z.number(),
  is_published: z.boolean().default(false)
});

export type CreateBlogPostInput = z.infer<typeof createBlogPostInputSchema>;

export const updateBlogPostInputSchema = z.object({
  id: z.number(),
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().nullable().optional(),
  slug: z.string().min(1).optional(),
  is_published: z.boolean().optional()
});

export type UpdateBlogPostInput = z.infer<typeof updateBlogPostInputSchema>;

export const uploadMediaInputSchema = z.object({
  filename: z.string(),
  original_name: z.string(),
  mime_type: z.string(),
  file_size: z.number(),
  file_path: z.string(),
  post_id: z.number().nullable().optional()
});

export type UploadMediaInput = z.infer<typeof uploadMediaInputSchema>;

// Response schemas
export const authResponseSchema = z.object({
  user: userSchema,
  token: z.string()
});

export type AuthResponse = z.infer<typeof authResponseSchema>;

export const blogPostWithAuthorSchema = blogPostSchema.extend({
  author: userSchema.pick({ id: true, username: true, email: true })
});

export type BlogPostWithAuthor = z.infer<typeof blogPostWithAuthorSchema>;

export const blogPostWithMediaSchema = blogPostSchema.extend({
  media_files: z.array(mediaFileSchema)
});

export type BlogPostWithMedia = z.infer<typeof blogPostWithMediaSchema>;
