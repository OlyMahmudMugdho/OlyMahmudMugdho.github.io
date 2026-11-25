import fs from 'fs';
import path from 'path';
import { getPostBySlug, getAvailableLanguages, toPublicSlug, type PostMeta, type PostLang } from './blog';

const coursesDirectory = path.join(process.cwd(), 'content/courses');

export interface CourseLesson {
    title: string;
    slug: string;
    description?: string;
}

export interface CourseUnit {
    id: string;
    title: string;
    description?: string;
    lessons: CourseLesson[];
}

export interface CourseDefinition {
    title: string;
    description: string;
    level?: string;
    coverImage?: string;
    tags?: string[];
    units: CourseUnit[];
}

export interface ResolvedLesson extends CourseLesson {
    readingTime?: string;
    excerpt?: string;
    availableLanguages: PostLang[];
    lessonNumber: number;
}

export interface ResolvedUnit extends Omit<CourseUnit, 'lessons'> {
    lessons: ResolvedLesson[];
}

export interface CourseSummary {
    slug: string;
    title: string;
    description: string;
    level?: string;
    coverImage?: string;
    tags: string[];
    unitCount: number;
    lessonCount: number;
    firstLessonSlug?: string;
}

export interface CourseDetail extends CourseSummary {
    units: ResolvedUnit[];
}

export interface PostCourseContext {
    courseSlug: string;
    courseTitle: string;
    unitTitle: string;
    lessonNumber: number;
    totalLessons: number;
    prevLesson: ResolvedLesson | null;
    nextLesson: ResolvedLesson | null;
}

function readCourseFiles(): string[] {
    if (!fs.existsSync(coursesDirectory)) {
        return [];
    }
    return fs.readdirSync(coursesDirectory).filter((f) => f.endsWith('.json')).sort();
}

export function getCourseSlugs(): string[] {
    return readCourseFiles().map((f) => f.replace(/\.json$/, ''));
}

export function getAllCourses(): CourseSummary[] {
    const files = readCourseFiles();

    return files.map((file) => {
        const slug = file.replace(/\.json$/, '');
        const raw = fs.readFileSync(path.join(coursesDirectory, file), 'utf8');
        const data: CourseDefinition = JSON.parse(raw);

        const units = Array.isArray(data.units) ? data.units : [];
        const lessonCount = units.reduce((acc, u) => acc + (u.lessons?.length || 0), 0);
        const rawFirstSlug = units[0]?.lessons?.[0]?.slug;
        const firstLessonSlug = rawFirstSlug ? toPublicSlug(rawFirstSlug) : undefined;

        return {
            slug,
            title: data.title,
            description: data.description,
            level: data.level,
            coverImage: data.coverImage,
            tags: Array.isArray(data.tags) ? data.tags : [],
            unitCount: units.length,
            lessonCount,
            firstLessonSlug,
        };
    });
}

export async function getCourseBySlug(slug: string): Promise<CourseDetail> {
    const cleanSlug = slug.replace(/\.json$/, '');
    const fullPath = path.join(coursesDirectory, `${cleanSlug}.json`);

    if (!fs.existsSync(fullPath)) {
        throw new Error(`Course not found: ${slug}`);
    }

    const raw = fs.readFileSync(fullPath, 'utf8');
    const data: CourseDefinition = JSON.parse(raw);
    const units = Array.isArray(data.units) ? data.units : [];

    let lessonCounter = 0;

    const resolvedUnits: ResolvedUnit[] = await Promise.all(
        units.map(async (unit) => {
            const lessons = await Promise.all(
                (unit.lessons || []).map(async (lesson) => {
                    lessonCounter += 1;
                    const currentNumber = lessonCounter;
                    let meta: Partial<PostMeta> = {};
                    try {
                        const post = await getPostBySlug(lesson.slug, 'en');
                        meta = post;
                    } catch {
                        // Keep lesson resilient if a post slug is missing
                    }

                    const publicSlug = toPublicSlug(lesson.slug);
                    return {
                        title: lesson.title || meta.title || publicSlug,
                        slug: publicSlug,
                        description: lesson.description || meta.excerpt,
                        readingTime: meta.readingTime,
                        excerpt: meta.excerpt,
                        availableLanguages: getAvailableLanguages(publicSlug),
                        lessonNumber: currentNumber,
                    };
                })
            );

            return {
                id: unit.id,
                title: unit.title,
                description: unit.description,
                lessons,
            };
        })
    );

    const firstLessonSlug = resolvedUnits[0]?.lessons?.[0]?.slug;

    return {
        slug: cleanSlug,
        title: data.title,
        description: data.description,
        level: data.level,
        coverImage: data.coverImage,
        tags: Array.isArray(data.tags) ? data.tags : [],
        unitCount: resolvedUnits.length,
        lessonCount: lessonCounter,
        firstLessonSlug,
        units: resolvedUnits,
    };
}

export async function getCourseContextForPost(postSlug: string): Promise<PostCourseContext | null> {
    const cleanPostSlug = toPublicSlug(postSlug);
    const courseSlugs = getCourseSlugs();

    for (const courseSlug of courseSlugs) {
        const course = await getCourseBySlug(courseSlug);
        const flatLessons: Array<{ unitTitle: string; lesson: ResolvedLesson }> = [];

        for (const unit of course.units) {
            for (const lesson of unit.lessons) {
                flatLessons.push({ unitTitle: unit.title, lesson });
            }
        }

        const idx = flatLessons.findIndex((item) => item.lesson.slug === cleanPostSlug);
        if (idx !== -1) {
            return {
                courseSlug: course.slug,
                courseTitle: course.title,
                unitTitle: flatLessons[idx].unitTitle,
                lessonNumber: flatLessons[idx].lesson.lessonNumber,
                totalLessons: flatLessons.length,
                prevLesson: idx > 0 ? flatLessons[idx - 1].lesson : null,
                nextLesson: idx < flatLessons.length - 1 ? flatLessons[idx + 1].lesson : null,
            };
        }
    }

    return null;
}
