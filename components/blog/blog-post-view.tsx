"use client"

import { useState, useEffect } from "react"
import type { Post, PostLang } from "@/lib/blog"
import type { PostCourseContext } from "@/lib/courses"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, ClockIcon, UserIcon, ChevronLeft, ChevronRight, Languages, GraduationCap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"

interface BlogPostViewProps {
    enPost: Post
    bnPost?: Post | null
    courseContext?: PostCourseContext | null
}

export function BlogPostView({ enPost, bnPost, courseContext }: BlogPostViewProps) {
    const [lang, setLang] = useState<PostLang>("en")

    useEffect(() => {
        if (!bnPost) return
        const params = new URLSearchParams(window.location.search)
        const urlLang = params.get("lang")
        if (urlLang === "bn" || urlLang === "en") {
            setLang(urlLang)
            return
        }
        const saved = localStorage.getItem("blog-lang")
        if (saved === "bn") {
            setLang("bn")
        }
    }, [bnPost])

    const handleLanguageChange = (nextLang: PostLang) => {
        setLang(nextLang)
        localStorage.setItem("blog-lang", nextLang)
        const url = new URL(window.location.href)
        url.searchParams.set("lang", nextLang)
        window.history.replaceState({}, "", url.toString())
    }

    const post = lang === "bn" && bnPost ? bnPost : enPost

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <Link
                    href="/blog"
                    className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    {lang === "bn" ? "ব্লগে ফিরে যান" : "Back to Blog"}
                </Link>

                {bnPost && (
                    <div className="flex items-center gap-2" role="group" aria-label="Language selector">
                        <Languages className="h-4 w-4 text-muted-foreground" />
                        <div className="inline-flex rounded-md border bg-muted/40 p-0.5">
                            <Button
                                type="button"
                                variant={lang === "en" ? "default" : "ghost"}
                                size="sm"
                                className="h-7 px-3 text-xs"
                                onClick={() => handleLanguageChange("en")}
                            >
                                English
                            </Button>
                            <Button
                                type="button"
                                variant={lang === "bn" ? "default" : "ghost"}
                                size="sm"
                                className="h-7 px-3 text-xs"
                                onClick={() => handleLanguageChange("bn")}
                            >
                                বাংলা
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <article lang={lang}>
                {courseContext && (
                    <div className="mb-8 rounded-lg border bg-muted/30 p-4 flex flex-wrap items-center justify-between gap-3 text-sm">
                        <div className="flex items-center gap-2 min-w-0">
                            <GraduationCap className="h-4 w-4 text-primary shrink-0" />
                            <div className="truncate">
                                <Link
                                    href={`/courses/${courseContext.courseSlug}`}
                                    className="font-semibold hover:text-primary transition-colors"
                                >
                                    {courseContext.courseTitle}
                                </Link>
                                <span className="text-muted-foreground"> · {courseContext.unitTitle}</span>
                            </div>
                        </div>
                        <Badge variant="outline">
                            Lesson {courseContext.lessonNumber} of {courseContext.totalLessons}
                        </Badge>
                    </div>
                )}

                <header className="mb-10 text-center">
                    <Badge variant="secondary" className="mb-4">
                        {post.category}
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-4 text-muted-foreground text-sm">
                        <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            <time dateTime={post.date}>
                                {(() => {
                                    try {
                                        const d = new Date(post.date)
                                        if (isNaN(d.getTime())) return "Invalid Date"
                                        return format(d, "MMMM dd, yyyy")
                                    } catch {
                                        return "Invalid Date"
                                    }
                                })()}
                            </time>
                        </div>
                        <div className="flex items-center gap-1">
                            <ClockIcon className="h-4 w-4" />
                            <span>{post.readingTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <UserIcon className="h-4 w-4" />
                            <span>{post.author}</span>
                        </div>
                    </div>
                </header>

                {post.coverImage && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-none border mb-10">
                        <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                <div className="flex flex-wrap gap-2 mb-10 justify-center">
                    {post.tags.map((tag) => (
                        <Link key={tag} href={`/blog?tag=${tag}`}>
                            <Badge variant="outline">#{tag}</Badge>
                        </Link>
                    ))}
                </div>

                <div
                    className="prose prose-lg prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </article>

            <div className="mt-16 pt-8 border-t">
                {courseContext && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                        {courseContext.prevLesson ? (
                            <Link href={`/blog/${courseContext.prevLesson.slug}`} className="flex-1">
                                <Button variant="outline" className="w-full justify-start h-auto py-3 px-4">
                                    <ChevronLeft className="mr-2 h-4 w-4 shrink-0" />
                                    <div className="text-left min-w-0">
                                        <div className="text-xs text-muted-foreground">Previous Lesson</div>
                                        <div className="font-medium truncate">{courseContext.prevLesson.title}</div>
                                    </div>
                                </Button>
                            </Link>
                        ) : (
                            <div className="flex-1" />
                        )}

                        {courseContext.nextLesson && (
                            <Link href={`/blog/${courseContext.nextLesson.slug}`} className="flex-1">
                                <Button variant="outline" className="w-full justify-end h-auto py-3 px-4">
                                    <div className="text-right min-w-0">
                                        <div className="text-xs text-muted-foreground">Next Lesson</div>
                                        <div className="font-medium truncate">{courseContext.nextLesson.title}</div>
                                    </div>
                                    <ChevronRight className="ml-2 h-4 w-4 shrink-0" />
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
