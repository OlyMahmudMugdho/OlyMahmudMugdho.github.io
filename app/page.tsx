import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/sections/hero"
import { AboutSection } from "@/components/sections/about"
import { EducationSection } from "@/components/sections/education"
import { ExperienceSection } from "@/components/sections/experience"
import { CertificationsSection } from "@/components/sections/certifications"
import { BadgesSection } from "@/components/sections/badges"
import { ProjectsSection } from "@/components/sections/projects"
import { SkillsSection } from "@/components/sections/skills"
import { NewsletterSection } from "@/components/sections/newsletter"
import { ContactSection } from "@/components/sections/contact"
import { ArticlesSection } from "@/components/sections/articles"
import { CoursesSection } from "@/components/sections/courses"
import { Footer } from "@/components/sections/footer"
import { getAllCourses } from "@/lib/courses"
import { SITE_DESCRIPTION, SITE_NAME, SITE_PROFILES, SITE_URL } from "@/lib/site"

export default function Home() {
  const courses = getAllCourses()

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    jobTitle: "Back-End Software & DevOps Engineer",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    email: "mailto:oly.ice.pust@gmail.com",
    sameAs: SITE_PROFILES,
  }

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <EducationSection />
      <ProjectsSection />
      <CoursesSection courses={courses} />
      <ArticlesSection />
      <CertificationsSection />
      <BadgesSection />
      <SkillsSection />
      <NewsletterSection />
      <ContactSection />
      <Footer />
    </main>
  )
}