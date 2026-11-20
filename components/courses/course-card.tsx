import Link from "next/link"
import { Bookmark, Code2, GitBranch, Layers, Terminal, Cpu } from "lucide-react"
import type { CourseSummary } from "@/lib/courses"
import { CARD_THEMES } from "@/lib/card-themes"

interface CourseCardProps {
    course: CourseSummary
    index?: number
}

const CARD_ICONS = [Code2, GitBranch, Terminal, Cpu, Layers]

export function getCourseVisual(index: number) {
    return {
        theme: CARD_THEMES[index % CARD_THEMES.length],
        Icon: CARD_ICONS[index % CARD_ICONS.length],
    }
}

export function CourseCard({ course, index = 0 }: CourseCardProps) {
    const { theme, Icon } = getCourseVisual(index)

    return (
        <Link
            href={`/courses/${course.slug}`}
            className="group block h-full rounded-xl overflow-hidden border border-border/70 bg-card text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/40"
        >
            {/* Top colored banner with centered geometric medallion */}
            <div
                className="relative h-44 w-full flex items-center justify-center"
                style={{ backgroundColor: theme.bannerHex }}
            >
                <div
                    className="h-24 w-24 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                    style={{
                        backgroundColor: theme.medallionHex,
                        clipPath:
                            "polygon(50% 0%, 75% 7%, 93% 25%, 100% 50%, 93% 75%, 75% 93%, 50% 100%, 25% 93%, 7% 75%, 0% 50%, 7% 25%, 25% 7%)",
                    }}
                >
                    <Icon className="h-9 w-9 stroke-[1.75]" style={{ color: theme.iconHex }} />
                </div>

                <span
                    aria-hidden="true"
                    className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-md bg-black/25 text-white/80 backdrop-blur-xs transition-colors group-hover:bg-black/40 group-hover:text-white"
                >
                    <Bookmark className="h-4 w-4" />
                </span>
            </div>

            {/* Bottom content area */}
            <div className="p-5 flex flex-col justify-between gap-3">
                <div>
                    <h3 className="text-lg font-semibold tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                        {course.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {course.description}
                    </p>
                </div>

                <div className="pt-1 text-xs text-muted-foreground flex flex-wrap items-center gap-x-1.5 gap-y-1">
                    <span>
                        {course.lessonCount} {course.lessonCount === 1 ? "lesson" : "lessons"}
                    </span>
                    <span>·</span>
                    <span>
                        {course.unitCount} {course.unitCount === 1 ? "unit" : "units"}
                    </span>
                    {course.level && (
                        <>
                            <span>·</span>
                            <span>{course.level}</span>
                        </>
                    )}
                </div>
            </div>
        </Link>
    )
}
