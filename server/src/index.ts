
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import {
  createUserInputSchema,
  loginInputSchema,
  createBlogPostInputSchema,
  updateBlogPostInputSchema,
  uploadMediaInputSchema
} from './schema';

// Import handlers
import { createUser } from './handlers/create_user';
import { login } from './handlers/login';
import { createBlogPost } from './handlers/create_blog_post';
import { updateBlogPost } from './handlers/update_blog_post';
import { getBlogPosts } from './handlers/get_blog_posts';
import { getPublishedBlogPosts } from './handlers/get_published_blog_posts';
import { getBlogPostById } from './handlers/get_blog_post_by_id';
import { getBlogPostBySlug } from './handlers/get_blog_post_by_slug';
import { publishBlogPost } from './handlers/publish_blog_post';
import { unpublishBlogPost } from './handlers/unpublish_blog_post';
import { deleteBlogPost } from './handlers/delete_blog_post';
import { uploadMedia } from './handlers/upload_media';
import { getMediaFiles } from './handlers/get_media_files';
import { deleteMediaFile } from './handlers/delete_media_file';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // User management
  createUser: publicProcedure
    .input(createUserInputSchema)
    .mutation(({ input }) => createUser(input)),

  login: publicProcedure
    .input(loginInputSchema)
    .mutation(({ input }) => login(input)),

  // Blog post management (admin)
  createBlogPost: publicProcedure
    .input(createBlogPostInputSchema)
    .mutation(({ input }) => createBlogPost(input)),

  updateBlogPost: publicProcedure
    .input(updateBlogPostInputSchema)
    .mutation(({ input }) => updateBlogPost(input)),

  getBlogPosts: publicProcedure
    .query(() => getBlogPosts()),

  getBlogPostById: publicProcedure
    .input(z.number())
    .query(({ input }) => getBlogPostById(input)),

  getBlogPostBySlug: publicProcedure
    .input(z.string())
    .query(({ input }) => getBlogPostBySlug(input)),

  publishBlogPost: publicProcedure
    .input(z.number())
    .mutation(({ input }) => publishBlogPost(input)),

  unpublishBlogPost: publicProcedure
    .input(z.number())
    .mutation(({ input }) => unpublishBlogPost(input)),

  deleteBlogPost: publicProcedure
    .input(z.number())
    .mutation(({ input }) => deleteBlogPost(input)),

  // Public blog posts (for public users)
  getPublishedBlogPosts: publicProcedure
    .query(() => getPublishedBlogPosts()),

  // Media file management
  uploadMedia: publicProcedure
    .input(uploadMediaInputSchema)
    .mutation(({ input }) => uploadMedia(input)),

  getMediaFiles: publicProcedure
    .input(z.number().optional())
    .query(({ input }) => getMediaFiles(input)),

  deleteMediaFile: publicProcedure
    .input(z.number())
    .mutation(({ input }) => deleteMediaFile(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
