import type { Metadata } from "next"
import { getPostBySlug, getPostSlugs, getAvailableLanguages } from "@/lib/blog"
import { getCourseContextForPost } from "@/lib/courses"
import { SITE_NAME, SITE_URL } from "@/lib/site"
import { notFound } from "next/navigation"
import { BlogPostView } from "@/components/blog/blog-post-view"

interface PostPageProps {
    params: {
        slug: string[]
    }
}

export async function generateStaticParams() {
    const slugs = getPostSlugs()
    return slugs.map((slug) => ({
        slug: slug.replace(/\.md$/, "").replace(/\/article$/, "").split("/"),
    }))
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const slug = params.slug.join("/")
    try {
        const post = await getPostBySlug(slug, "en")
        const url = `/blog/${post.slug}`
        return {
            title: post.title,
            description: post.excerpt,
            keywords: post.tags,
            authors: [{ name: post.author || SITE_NAME }],
            alternates: {
                canonical: url,
            },
            openGraph: {
                type: "article",
                url,
                title: post.title,
                description: post.excerpt,
                publishedTime: post.date,
                authors: [post.author || SITE_NAME],
                tags: post.tags,
                ...(post.coverImage ? { images: [{ url: post.coverImage, alt: post.title }] } : {}),
            },
            twitter: {
                card: post.coverImage ? "summary_large_image" : "summary",
                title: post.title,
                description: post.excerpt,
                ...(post.coverImage ? { images: [post.coverImage] } : {}),
            },
        }
    } catch {
        return { title: "Post Not Found" }
    }
}

export default async function PostPage({ params }: PostPageProps) {
    const slug = params.slug.join("/")

    let enPost
    try {
        enPost = await getPostBySlug(slug, "en")
    } catch {
        notFound()
    }

    if (!enPost) {
        notFound()
    }

    const availableLangs = getAvailableLanguages(slug)
    const [bnPost, courseContext] = await Promise.all([
        availableLangs.includes("bn") ? getPostBySlug(slug, "bn") : Promise.resolve(null),
        getCourseContextForPost(slug),
    ])

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: enPost.title,
        description: enPost.excerpt,
        datePublished: enPost.date,
        author: {
            "@type": "Person",
            name: enPost.author || SITE_NAME,
            url: SITE_URL,
        },
        url: `${SITE_URL}/blog/${enPost.slug}`,
        keywords: enPost.tags.join(", "),
        inLanguage: availableLangs,
        ...(enPost.coverImage
            ? {
                  image: enPost.coverImage.startsWith("http")
                      ? enPost.coverImage
                      : `${SITE_URL}${enPost.coverImage}`,
              }
            : {}),
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BlogPostView enPost={enPost} bnPost={bnPost} courseContext={courseContext} />
        </>
    )
}
