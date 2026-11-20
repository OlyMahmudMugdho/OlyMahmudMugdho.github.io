import { getPostBySlug, getPostSlugs, getAvailableLanguages } from "@/lib/blog"
import { getCourseContextForPost } from "@/lib/courses"
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

    return <BlogPostView enPost={enPost} bnPost={bnPost} courseContext={courseContext} />
}
