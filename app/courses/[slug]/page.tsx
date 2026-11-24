import type { Metadata } from "next"
import { getAllCourses, getCourseBySlug, getCourseSlugs, type CourseDetail } from "@/lib/courses"
import { getCourseVisual } from "@/components/courses/course-card"
import { SITE_NAME, SITE_URL } from "@/lib/site"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, BookOpen, Clock, GraduationCap, Layers, ChevronRight, Languages } from "lucide-react"
import Link from "next/link"

interface CoursePageProps {
    params: {
        slug: string
    }
}

export async function generateStaticParams() {
    const slugs = getCourseSlugs()
    return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
    try {
        const course = await getCourseBySlug(params.slug)
        const url = `/courses/${course.slug}`
        return {
            title: course.title,
            description: course.description,
            keywords: course.tags,
            alternates: {
                canonical: url,
            },
            openGraph: {
                type: "website",
                url,
                title: course.title,
                description: course.description,
            },
            twitter: {
                card: "summary",
                title: course.title,
                description: course.description,
            },
        }
    } catch {
        return { title: "Course Not Found" }
    }
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
    let course: CourseDetail
    try {
        course = await getCourseBySlug(params.slug)
    } catch {
        notFound()
    }

    const allCourses = getAllCourses()
    const courseIndex = Math.max(
        0,
        allCourses.findIndex((c) => c.slug === course.slug)
    )
    const { theme, Icon } = getCourseVisual(courseIndex)

    const hasBengali = course.units.some((u) =>
        u.lessons.some((l) => l.availableLanguages.includes("bn"))
    )

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        name: course.title,
        description: course.description,
        url: `${SITE_URL}/courses/${course.slug}`,
        provider: {
            "@type": "Person",
            name: SITE_NAME,
            url: SITE_URL,
        },
        ...(course.level ? { educationalLevel: course.level } : {}),
        inLanguage: hasBengali ? ["en", "bn"] : ["en"],
    }

    return (
        <div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Full-bleed colored hero banner */}
            <section
                className="text-white border-b border-black/15"
                style={{ backgroundColor: theme.bannerHex }}
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-1.5 text-sm text-white/75 hover:text-white transition-colors mb-8"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Courses</span>
                        <span className="text-white/40">/</span>
                        <span className="text-white/90 truncate max-w-[260px] sm:max-w-none">{course.title}</span>
                    </Link>

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                                {course.title}
                            </h1>

                            <p className="text-white/85 text-base md:text-lg max-w-2xl leading-relaxed mb-6">
                                {course.description}
                            </p>

                            {/* Metadata pills */}
                            <div className="flex flex-wrap items-center gap-2.5 mb-8">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/20 border border-white/15 px-3 py-1 text-xs font-medium text-white/90">
                                    <BookOpen className="h-3.5 w-3.5" />
                                    {course.lessonCount} {course.lessonCount === 1 ? "lesson" : "lessons"}
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/20 border border-white/15 px-3 py-1 text-xs font-medium text-white/90">
                                    <Layers className="h-3.5 w-3.5" />
                                    {course.unitCount} {course.unitCount === 1 ? "unit" : "units"}
                                </span>
                                {course.level && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/20 border border-white/15 px-3 py-1 text-xs font-medium text-white/90">
                                        <GraduationCap className="h-3.5 w-3.5" />
                                        {course.level}
                                    </span>
                                )}
                                {hasBengali && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/20 border border-white/15 px-3 py-1 text-xs font-medium text-white/90">
                                        <Languages className="h-3.5 w-3.5" />
                                        EN / বাংলা
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                {course.firstLessonSlug && (
                                    <Link href={`/blog/${course.firstLessonSlug}`}>
                                        <Button
                                            size="lg"
                                            className="bg-white text-neutral-900 hover:bg-white/90 font-semibold"
                                        >
                                            Start course
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                )}
                                <a href="#curriculum">
                                    <Button
                                        size="lg"
                                        variant="ghost"
                                        className="bg-black/20 border border-white/15 text-white hover:bg-black/35 hover:text-white"
                                    >
                                        Browse curriculum
                                    </Button>
                                </a>
                            </div>
                        </div>

                        {/* Geometric medallion on the right */}
                        <div className="hidden md:flex shrink-0 items-center justify-center">
                            <div
                                className="h-44 w-44 flex items-center justify-center shadow-lg"
                                style={{
                                    backgroundColor: theme.medallionHex,
                                    clipPath:
                                        "polygon(50% 0%, 75% 7%, 93% 25%, 100% 50%, 93% 75%, 75% 93%, 50% 100%, 25% 93%, 7% 75%, 0% 50%, 7% 25%, 25% 7%)",
                                }}
                            >
                                <Icon className="h-16 w-16 stroke-[1.6]" style={{ color: theme.iconHex }} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Body: Curriculum */}
            <div id="curriculum" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Units & Lessons */}
                <section className="space-y-6" aria-label="Course curriculum">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <h2 className="text-2xl font-bold tracking-tight">Curriculum</h2>
                            <div className="flex flex-wrap gap-2">
                                {course.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                        #{tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {course.units.map((unit, unitIndex) => {
                            const unitTheme = getCourseVisual(courseIndex + unitIndex).theme
                            return (
                            <Card key={unit.id || unitIndex} id={unit.id} className="overflow-hidden scroll-mt-24">
                                <CardHeader
                                    className="border-b text-white"
                                    style={{ backgroundColor: unitTheme.bannerHex }}
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <CardTitle className="text-lg text-white">{unit.title}</CardTitle>
                                        <Badge
                                            variant="outline"
                                            className="text-xs bg-black/20 border-white/20 text-white"
                                        >
                                            {unit.lessons.length} {unit.lessons.length === 1 ? "lesson" : "lessons"}
                                        </Badge>
                                    </div>
                                    {unit.description && (
                                        <CardDescription className="text-white/80">{unit.description}</CardDescription>
                                    )}
                                </CardHeader>

                                <CardContent className="p-0 divide-y">
                                    {unit.lessons.map((lesson) => (
                                        <Link
                                            key={lesson.slug}
                                            href={`/blog/${lesson.slug}`}
                                            className="flex items-center justify-between gap-4 p-4 sm:px-6 hover:bg-muted/30 transition-colors group"
                                        >
                                            <div className="flex items-start gap-4 min-w-0">
                                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold text-muted-foreground group-hover:border-primary group-hover:text-primary transition-colors">
                                                    {lesson.lessonNumber}
                                                </span>
                                                <div className="min-w-0">
                                                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                                                        {lesson.title}
                                                    </h3>
                                                    {lesson.description && (
                                                        <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                                                            {lesson.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 shrink-0">
                                                {lesson.availableLanguages.includes("bn") && (
                                                    <Badge variant="secondary" className="text-[11px]">
                                                        EN / বাংলা
                                                    </Badge>
                                                )}
                                                {lesson.readingTime && (
                                                    <span className="hidden sm:inline-flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        {lesson.readingTime}
                                                    </span>
                                                )}
                                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                                            </div>
                                        </Link>
                                    ))}
                                </CardContent>
                            </Card>
                            )
                        })}
                </section>
            </div>
        </div>
    )
}
