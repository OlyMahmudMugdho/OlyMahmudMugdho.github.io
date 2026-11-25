import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import readingTime from 'reading-time';
import { transformTreeDiagrams } from '@/lib/tree-diagram';
import { transformFlowDiagrams } from '@/lib/flow-diagram';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export type PostLang = 'en' | 'bn';

export interface PostMeta {
    title: string;
    slug: string;
    date: string;
    updated?: string;
    excerpt: string;
    category: string;
    tags: string[];
    featured: boolean;
    coverImage?: string;
    author: string;
    readingTime?: string;
    availableLanguages?: PostLang[];
}

export interface Post extends PostMeta {
    content: string;
}

interface PostIndexEntry {
    publicSlug: string;
    diskSlug: string;
}

function getAllDiskSlugs(): string[] {
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    const collect = (dirPath: string, acc: string[] = []): string[] => {
        const files = fs.readdirSync(dirPath).sort();
        for (const file of files) {
            const full = path.join(dirPath, file);
            if (fs.statSync(full).isDirectory()) {
                collect(full, acc);
            } else if (file.endsWith('.md') && !file.endsWith('.bn.md')) {
                const relativePath = path.relative(postsDirectory, full).replace(/\\/g, '/');
                const cleanDiskSlug = relativePath.replace(/\.md$/, '').replace(/\/article$/, '');
                acc.push(cleanDiskSlug);
            }
        }
        return acc;
    };

    return collect(postsDirectory);
}

let cachedPostIndex: PostIndexEntry[] | null = null;

function buildPostIndex(): PostIndexEntry[] {
    if (process.env.NODE_ENV === 'production' && cachedPostIndex) {
        return cachedPostIndex;
    }

    const diskSlugs = getAllDiskSlugs();
    const leafGroups = new Map<string, string[]>();

    for (const diskSlug of diskSlugs) {
        const leaf = diskSlug.split('/').pop() || diskSlug;
        const group = leafGroups.get(leaf) || [];
        group.push(diskSlug);
        leafGroups.set(leaf, group);
    }

    const entries: PostIndexEntry[] = [];
    for (const diskSlug of diskSlugs) {
        const leaf = diskSlug.split('/').pop() || diskSlug;
        const group = leafGroups.get(leaf) || [diskSlug];
        let publicSlug = leaf;

        if (group.length > 1) {
            const preferred = group.find((d) => d.startsWith('neetcode-150/')) || group[0];
            if (diskSlug !== preferred) {
                publicSlug = diskSlug.replace(/\//g, '-');
            }
        }

        entries.push({ publicSlug, diskSlug });
    }

    if (process.env.NODE_ENV === 'production') {
        cachedPostIndex = entries;
    }
    return entries;
}

export function resolvePostSlug(slug: string): PostIndexEntry | null {
    const normalized = slug.replace(/\.md$/, '').replace(/\/article$/, '');
    const entries = buildPostIndex();
    return (
        entries.find((e) => e.publicSlug === normalized) ||
        entries.find((e) => e.diskSlug === normalized) ||
        null
    );
}

export function toPublicSlug(slug: string): string {
    return resolvePostSlug(slug)?.publicSlug ?? slug.replace(/\.md$/, '').replace(/\/article$/, '');
}

export function getPostSlugs(): string[] {
    return buildPostIndex().map((e) => e.publicSlug);
}

export function getAvailableLanguages(slug: string): PostLang[] {
    const resolved = resolvePostSlug(slug);
    const diskSlug = resolved?.diskSlug ?? slug.replace(/\.md$/, '').replace(/\/article$/, '');
    const langs: PostLang[] = ['en'];
    const bnPath = path.join(postsDirectory, `${diskSlug}/article.bn.md`);
    if (fs.existsSync(bnPath)) {
        langs.push('bn');
    }
    return langs;
}

export async function getPostBySlug(slug: string, lang: PostLang = 'en'): Promise<Post> {
    const resolved = resolvePostSlug(slug);
    const diskSlug = resolved?.diskSlug ?? slug.replace(/\.md$/, '').replace(/\/article$/, '');
    const publicSlug = resolved?.publicSlug ?? diskSlug;

    const bnPath = path.join(postsDirectory, `${diskSlug}/article.bn.md`);
    let fullPath = path.join(postsDirectory, `${diskSlug}/article.md`);
    let postFolder = diskSlug;

    if (lang === 'bn' && fs.existsSync(bnPath)) {
        fullPath = bnPath;
    }

    if (!fs.existsSync(fullPath)) {
        fullPath = path.join(postsDirectory, `${diskSlug}.md`);
        postFolder = path.dirname(diskSlug);
    }

    if (!fs.existsSync(fullPath)) {
        const directPath = path.join(postsDirectory, `${slug.replace(/\.md$/, '')}.md`);
        if (fs.existsSync(directPath)) {
            fullPath = directPath;
            postFolder = path.dirname(slug.replace(/\.md$/, ''));
        } else {
            throw new Error(`Post not found for slug: ${slug}`);
        }
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Strip a leading H1 heading from markdown body so it doesn't duplicate the page header title
    const cleanedContent = transformFlowDiagrams(
        transformTreeDiagrams(
            content.replace(/^\s*#\s+[^\r\n]+(\r?\n)+/, '')
        )
    );

    const processedContent = await remark()
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeHighlight)
        .use(rehypeStringify, { allowDangerousHtml: true })
        .process(cleanedContent);
    let contentHtml = processedContent.toString();

    // Rewrite relative image paths in the HTML content
    contentHtml = contentHtml.replace(/src="(\.\/)?([^":]+)"/g, (match, dotSlash, filename) => {
        if (filename.startsWith('http') || filename.startsWith('/') || filename.startsWith('data:')) {
            return match;
        }
        const assetPath = postFolder === '.' ? filename : `${postFolder}/${filename}`;
        return `src="/api/blog/assets/${encodeURIComponent(assetPath).replace(/%2F/g, '/')}"`;
    });

    const stats = readingTime(content);

    // Ensure all required fields exist with defaults if missing
    const meta: PostMeta = {
        title: data.title || 'Untitled Post',
        slug: publicSlug,
        date: data.date ? (data.date instanceof Date ? data.date.toISOString() : String(data.date)) : new Date().toISOString(),
        excerpt: data.excerpt || '',
        category: data.category || 'Uncategorized',
        tags: Array.isArray(data.tags) ? data.tags : [],
        featured: !!data.featured,
        author: data.author || 'Anonymous',
        coverImage: data.coverImage,
    };

    // Handle cover image if it's a local relative path
    if (meta.coverImage && !meta.coverImage.startsWith('http') && !meta.coverImage.startsWith('/')) {
        const assetPath = postFolder === '.' ? meta.coverImage : `${postFolder}/${meta.coverImage}`;
        meta.coverImage = `/api/blog/assets/${encodeURIComponent(assetPath).replace(/%2F/g, '/')}`;
    }

    return {
        ...meta,
        slug: publicSlug,
        content: contentHtml,
        readingTime: stats.text,
        availableLanguages: getAvailableLanguages(publicSlug),
    } as Post;
}

export async function getAllPosts(): Promise<PostMeta[]> {
    const slugs = getPostSlugs();
    const posts = await Promise.all(
        slugs.map(async (slug) => {
            const { content, ...meta } = await getPostBySlug(slug);
            return meta;
        })
    );

    // Sort posts by date in descending order
    return posts.sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
}

export async function getFeaturedPosts(): Promise<PostMeta[]> {
    const allPosts = await getAllPosts();
    return allPosts.filter((post) => post.featured);
}

export async function getPostsByCategory(category: string): Promise<PostMeta[]> {
    const allPosts = await getAllPosts();
    return allPosts.filter((post) => post.category === category);
}

export async function getPostsByTag(tag: string): Promise<PostMeta[]> {
    const allPosts = await getAllPosts();
    return allPosts.filter((post) => post.tags.includes(tag));
}

export async function getAllCategories(): Promise<string[]> {
    const allPosts = await getAllPosts();
    const categories = allPosts.map((post) => post.category);
    return Array.from(new Set(categories));
}

export async function getAllTags(): Promise<string[]> {
    const allPosts = await getAllPosts();
    const tags = allPosts.flatMap((post) => post.tags);
    return Array.from(new Set(tags));
}

export async function getPaginatedPosts(
    page: number,
    perPage: number,
    category?: string,
    tag?: string
): Promise<{ posts: PostMeta[]; totalPages: number; currentPage: number }> {
    let allPosts = await getAllPosts();

    if (category) {
        allPosts = allPosts.filter((p) => p.category === category);
    }
    if (tag) {
        allPosts = allPosts.filter((p) => p.tags.includes(tag));
    }

    const totalPages = Math.ceil(allPosts.length / perPage);
    const offset = (page - 1) * perPage;
    const paginatedPosts = allPosts.slice(offset, offset + perPage);

    return {
        posts: paginatedPosts,
        totalPages,
        currentPage: page,
    };
}
