import type { MetadataRoute } from "next"
import { getAllPosts } from "@/lib/blog"
import { getAllCourses } from "@/lib/courses"
import { SITE_URL } from "@/lib/site"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, courses] = await Promise.all([getAllPosts(), Promise.resolve(getAllCourses())])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/courses`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/resume`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ]

  const courseRoutes: MetadataRoute.Sitemap = courses.map((course) => ({
    url: `${SITE_URL}/courses/${course.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }))

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  return [...staticRoutes, ...courseRoutes, ...postRoutes]
}
