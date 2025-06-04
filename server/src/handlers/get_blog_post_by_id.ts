
import { type BlogPostWithMedia } from '../schema';

export declare function getBlogPostById(id: number): Promise<BlogPostWithMedia | null>;
