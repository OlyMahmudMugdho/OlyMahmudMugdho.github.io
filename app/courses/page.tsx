import type { Metadata } from "next"
import { getAllCourses } from "@/lib/courses"
import { CourseCard } from "@/components/courses/course-card"
import { GraduationCap } from "lucide-react"

export const metadata: Metadata = {
    title: "Courses",
    description: "Structured technical courses on networking, HTTP from TCP in Go, data structures, and algorithms.",
    alternates: {
        canonical: "/courses",
    },
    openGraph: {
        title: "Courses | M. Oly Mahmud",
        description: "Structured technical courses on networking, HTTP from TCP in Go, data structures, and algorithms.",
        url: "/courses",
    },
}

export default function CoursesPage() {
    const courses = getAllCourses()

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
            <div className="mb-10">
                <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-2">
                    <GraduationCap className="h-4 w-4" />
                    <span>Structured Learning Paths</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                    Start your journey
                </h1>
                <p className="text-muted-foreground max-w-2xl">
                    Organized series of articles grouped into units and step-by-step lessons so you can learn topics in a clear order.
                </p>
            </div>

            {courses.length === 0 ? (
                <div className="text-center py-20 border rounded-xl">
                    <p className="text-muted-foreground">No courses available yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course, index) => (
                        <CourseCard key={course.slug} course={course} index={index} />
                    ))}
                </div>
            )}
        </div>
    )
}
