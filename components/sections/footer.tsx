import Link from "next/link"
import { Github, Linkedin, Mail, FileText, BookOpen } from "lucide-react"

const navLinks = [
  { name: "About", href: "/#about" },
  { name: "Experience", href: "/#experience" },
  { name: "Projects", href: "/#projects" },
  { name: "Resume", href: "/resume" },
  { name: "Contact", href: "/#contact" },
]

const learningLinks = [
  { name: "Blog", href: "/blog" },
  { name: "All Courses", href: "/courses" },
  { name: "HTTP from TCP in Go", href: "/courses/http-from-tcp" },
  { name: "NeetCode 150 DSA", href: "/courses/neetcode-150-dsa" },
  { name: "Blind 75 Essentials", href: "/courses/blind-75-essentials" },
]

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/OlyMahmudMugdho/",
    icon: Github,
    external: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/olymahmud/",
    icon: Linkedin,
    external: true,
  },
  {
    name: "Dev.to",
    href: "https://dev.to/olymahmud/",
    icon: BookOpen,
    external: true,
  },
  {
    name: "Email",
    href: "mailto:oly.ice.pust@gmail.com",
    icon: Mail,
    external: false,
  },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/70 [.paper_&]:bg-[#EFE8DA] [.paper_&]:border-t-[1.5px] [.paper_&]:border-[#191715]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand & bio */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-block text-lg font-bold tracking-tight hover:text-primary transition-colors">
              M. Oly Mahmud
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Back-End Software &amp; DevOps Engineer writing about Go, networking, algorithms, and cloud infrastructure.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {socialLinks.map(({ name, href, icon: Icon, external }) => (
                <a
                  key={name}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  aria-label={name}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
              <Link
                href="/resume"
                aria-label="Resume"
                className="inline-flex h-9 items-center gap-1.5 rounded-md border bg-background px-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Resume</span>
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              {navLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learning & Writing */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Writing &amp; Courses
            </h3>
            <ul className="space-y-2.5 text-sm">
              {learningLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {currentYear} M. Oly Mahmud. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a
              href="mailto:oly.ice.pust@gmail.com"
              className="hover:text-foreground transition-colors"
            >
              oly.ice.pust@gmail.com
            </a>
            <span aria-hidden="true">·</span>
            <Link href="/sitemap.xml" className="hover:text-foreground transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
