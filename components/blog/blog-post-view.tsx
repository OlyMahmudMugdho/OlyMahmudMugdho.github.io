"use client"

import { useState, useEffect } from "react"
import type { Post, PostLang } from "@/lib/blog"
import type { PostCourseContext } from "@/lib/courses"
import { getPostVisual } from "@/lib/card-themes"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    CalendarIcon,
    ClockIcon,
    UserIcon,
    ChevronLeft,
    ChevronRight,
    Languages,
    GraduationCap,
    Settings2,
    RotateCcw,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"

type FontSizeKey = "sm" | "base" | "lg" | "xl"
type EnFontKey = "inconsolata" | "sans" | "serif"
type BnFontKey = "noto-sans-bn" | "hind-siliguri" | "noto-serif-bn" | "system"

interface ReadingSettings {
    enFont: EnFontKey
    bnFont: BnFontKey
    fontSize: FontSizeKey
}

const DEFAULT_SETTINGS: ReadingSettings = {
    enFont: "inconsolata",
    bnFont: "noto-sans-bn",
    fontSize: "lg",
}

const EN_FONTS: Record<EnFontKey, { label: string; family: string }> = {
    inconsolata: {
        label: "Inconsolata (Mono)",
        family: "'Inconsolata', ui-monospace, SFMono-Regular, Menlo, monospace",
    },
    sans: {
        label: "Inter (Sans)",
        family: "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
    },
    serif: {
        label: "Merriweather (Serif)",
        family: "'Merriweather', Georgia, Cambria, 'Times New Roman', serif",
    },
}

const BN_FONTS: Record<BnFontKey, { label: string; family: string }> = {
    "noto-sans-bn": {
        label: "Noto Sans Bengali",
        family: "'Noto Sans Bengali', ui-sans-serif, system-ui, sans-serif",
    },
    "hind-siliguri": {
        label: "Hind Siliguri",
        family: "'Hind Siliguri', ui-sans-serif, system-ui, sans-serif",
    },
    "noto-serif-bn": {
        label: "Noto Serif Bengali",
        family: "'Noto Serif Bengali', Georgia, serif",
    },
    system: {
        label: "System Default",
        family: "ui-sans-serif, system-ui, sans-serif",
    },
}

const FONT_SIZE_OPTIONS: Array<{ key: FontSizeKey; label: string; proseClass: string }> = [
    { key: "sm", label: "S", proseClass: "prose-sm" },
    { key: "base", label: "M", proseClass: "prose-base" },
    { key: "lg", label: "L", proseClass: "prose-lg" },
    { key: "xl", label: "XL", proseClass: "prose-xl" },
]

interface BlogPostViewProps {
    enPost: Post
    bnPost?: Post | null
    courseContext?: PostCourseContext | null
}

export function BlogPostView({ enPost, bnPost, courseContext }: BlogPostViewProps) {
    const [lang, setLang] = useState<PostLang>("en")
    const [settings, setSettings] = useState<ReadingSettings>(DEFAULT_SETTINGS)

    useEffect(() => {
        try {
            const rawSettings = localStorage.getItem("blog-reading-settings")
            if (rawSettings) {
                const parsed = JSON.parse(rawSettings)
                setSettings((prev) => ({
                    enFont: parsed.enFont in EN_FONTS ? parsed.enFont : prev.enFont,
                    bnFont: parsed.bnFont in BN_FONTS ? parsed.bnFont : prev.bnFont,
                    fontSize: FONT_SIZE_OPTIONS.some((o) => o.key === parsed.fontSize)
                        ? parsed.fontSize
                        : prev.fontSize,
                }))
            }
        } catch {
            // Ignore malformed localStorage
        }

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

    const updateSettings = (patch: Partial<ReadingSettings>) => {
        setSettings((prev) => {
            const next = { ...prev, ...patch }
            localStorage.setItem("blog-reading-settings", JSON.stringify(next))
            return next
        })
    }

    const handleLanguageChange = (nextLang: PostLang) => {
        setLang(nextLang)
        localStorage.setItem("blog-lang", nextLang)
        const url = new URL(window.location.href)
        url.searchParams.set("lang", nextLang)
        window.history.replaceState({}, "", url.toString())
    }

    const post = lang === "bn" && bnPost ? bnPost : enPost
    const { theme } = getPostVisual(enPost.slug)

    const activeFontFamily =
        lang === "bn"
            ? BN_FONTS[settings.bnFont].family
            : EN_FONTS[settings.enFont].family

    const activeProseSize =
        FONT_SIZE_OPTIONS.find((o) => o.key === settings.fontSize)?.proseClass || "prose-lg"

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

                <div className="flex flex-wrap items-center gap-2">
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

                    {/* Reading Settings Popover */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 gap-1.5 text-xs"
                                aria-label="Reading settings"
                            >
                                <Settings2 className="h-3.5 w-3.5" />
                                <span>{lang === "bn" ? "সেটিংস" : "Settings"}</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-72 space-y-4">
                            <div className="flex items-center justify-between border-b pb-2">
                                <h4 className="font-semibold text-sm">
                                    {lang === "bn" ? "পড়ার সেটিংস" : "Reading Settings"}
                                </h4>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs text-muted-foreground"
                                    onClick={() => {
                                        setSettings(DEFAULT_SETTINGS)
                                        localStorage.setItem(
                                            "blog-reading-settings",
                                            JSON.stringify(DEFAULT_SETTINGS)
                                        )
                                    }}
                                >
                                    <RotateCcw className="h-3 w-3 mr-1" />
                                    Reset
                                </Button>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">
                                    English Font
                                </Label>
                                <Select
                                    value={settings.enFont}
                                    onValueChange={(val) => updateSettings({ enFont: val as EnFontKey })}
                                >
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(EN_FONTS).map(([key, item]) => (
                                            <SelectItem key={key} value={key} className="text-xs">
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">
                                    Bengali Font (বাংলা ফন্ট)
                                </Label>
                                <Select
                                    value={settings.bnFont}
                                    onValueChange={(val) => updateSettings({ bnFont: val as BnFontKey })}
                                >
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(BN_FONTS).map(([key, item]) => (
                                            <SelectItem key={key} value={key} className="text-xs">
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">
                                    {lang === "bn" ? "ফন্ট সাইজ" : "Font Size"}
                                </Label>
                                <div className="grid grid-cols-4 gap-1 rounded-md border bg-muted/40 p-0.5">
                                    {FONT_SIZE_OPTIONS.map((opt) => (
                                        <Button
                                            key={opt.key}
                                            type="button"
                                            variant={settings.fontSize === opt.key ? "default" : "ghost"}
                                            size="sm"
                                            className="h-7 text-xs"
                                            onClick={() => updateSettings({ fontSize: opt.key })}
                                        >
                                            {opt.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <article lang={lang} style={{ fontFamily: activeFontFamily }}>
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

                <header
                    className="mb-10 rounded-xl border border-black/15 px-6 py-8 text-center text-white"
                    style={{ backgroundColor: theme.bannerHex }}
                >
                    <Badge
                        variant="secondary"
                        className="mb-4 bg-black/25 text-white border border-white/15 hover:bg-black/35"
                    >
                        {post.category}
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-4 text-white/80 text-sm mb-6">
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

                    <div className="flex flex-wrap gap-2 justify-center">
                        {post.tags.map((tag) => (
                            <Link key={tag} href={`/blog?tag=${tag}`}>
                                <Badge
                                    variant="outline"
                                    className="bg-black/20 border-white/20 text-white/90 hover:bg-black/35"
                                >
                                    #{tag}
                                </Badge>
                            </Link>
                        ))}
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

                <div
                    className={`prose ${activeProseSize} prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-none`}
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
