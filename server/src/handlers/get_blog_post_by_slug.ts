
import { type BlogPostWithMedia } from '../schema';

export declare function getBlogPostBySlug(slug: string): Promise<BlogPostWithMedia | null>;
