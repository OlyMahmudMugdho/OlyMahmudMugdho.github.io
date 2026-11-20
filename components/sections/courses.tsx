import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CourseCard } from "@/components/courses/course-card"
import type { CourseSummary } from "@/lib/courses"

interface CoursesSectionProps {
    courses: CourseSummary[]
}

export function CoursesSection({ courses }: CoursesSectionProps) {
    if (!courses.length) return null

    return (
        <section id="courses" className="py-20 px-4">
            <div className="max-w-6xl mx-auto w-full">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">Courses</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Structured learning paths organized into units and lessons from my technical articles.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course, index) => (
                        <CourseCard key={course.slug} course={course} index={index} />
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <Link href="/courses">
                        <Button variant="outline" size="lg">
                            View All Courses
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
