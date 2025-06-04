
import { serial, text, pgTable, timestamp, boolean, integer, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password_hash: text('password_hash').notNull(),
  is_admin: boolean('is_admin').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

export const blogPostsTable = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  author_id: integer('author_id').notNull().references(() => usersTable.id),
  is_published: boolean('is_published').notNull().default(false),
  published_at: timestamp('published_at'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

export const mediaFilesTable = pgTable('media_files', {
  id: serial('id').primaryKey(),
  filename: varchar('filename', { length: 255 }).notNull(),
  original_name: varchar('original_name', { length: 255 }).notNull(),
  mime_type: varchar('mime_type', { length: 100 }).notNull(),
  file_size: integer('file_size').notNull(),
  file_path: text('file_path').notNull(),
  post_id: integer('post_id').references(() => blogPostsTable.id),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  blog_posts: many(blogPostsTable)
}));

export const blogPostsRelations = relations(blogPostsTable, ({ one, many }) => ({
  author: one(usersTable, {
    fields: [blogPostsTable.author_id],
    references: [usersTable.id]
  }),
  media_files: many(mediaFilesTable)
}));

export const mediaFilesRelations = relations(mediaFilesTable, ({ one }) => ({
  blog_post: one(blogPostsTable, {
    fields: [mediaFilesTable.post_id],
    references: [blogPostsTable.id]
  })
}));

// Export all tables
export const tables = {
  users: usersTable,
  blog_posts: blogPostsTable,
  media_files: mediaFilesTable
};
