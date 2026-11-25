"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Linkedin, Mail, FileText } from "lucide-react"

const profileLines = [
  { key: "role", value: "backend · devops · researcher" },
  { key: "core", value: "Java · Python" },
  { key: "also", value: "Node.js · Go" },
  { key: "focus", value: "Cloud · DevOps · Gen AI" },
  { key: "research", value: "Distributed Systems · AI" },
  { key: "writes", value: "Systems & Algorithms" },
]

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-background pt-24 pb-16">
      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left column: Intro & CTAs */}
          <div className="lg:col-span-7 text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-[1.12]">
              Hi, I&apos;m{" "}
              <span className="text-primary italic">M. Oly Mahmud</span>.
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
              Back-End Software &amp; DevOps Engineer building scalable systems
              across Cloud, DevOps, and Gen AI, with active research in
              Distributed Systems and Artificial Intelligence.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-10">
              <a href="/resume" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="px-6 py-5 text-base font-semibold">
                  <FileText className="mr-2 h-4 w-4" />
                  View Resume
                </Button>
              </a>
              <Link href="/blog">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-6 py-5 text-base font-semibold"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit Blog
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-5">
              <a
                href="https://github.com/OlyMahmudMugdho/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/olymahmud/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:oly.ice.pust@gmail.com"
                aria-label="Email"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Right column: Terminal profile card */}
          <div className="lg:col-span-5">
            <div className="rounded-xl bg-[#161514] text-[#FAF6EE] border-[1.5px] border-[#191715] dark:border-white/15 shadow-[6px_6px_0_0_#F16C38] overflow-hidden font-mono text-sm">
              {/* Terminal title bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-[#1D1B1A]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#F16C38]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#8C857B]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#C8C0B4]" />
                <span className="ml-2 text-xs text-[#9C948A]">
                  ~/oly/profile.yml
                </span>
              </div>

              {/* Terminal YAML content */}
              <div className="p-5 sm:p-6 space-y-2.5 leading-relaxed">
                {profileLines.map(({ key, value }) => (
                  <div key={key} className="flex flex-wrap gap-x-2">
                    <span className="text-[#F16C38] font-medium shrink-0">
                      {key}:
                    </span>
                    <span className="text-[#FAF6EE]/95">{value}</span>
                  </div>
                ))}

                <div className="pt-3 flex items-center text-[#FAF6EE]/90">
                  <span className="text-[#9C948A] mr-2">$</span>
                  <span>ship --reliably</span>
                  <span
                    aria-hidden="true"
                    className="ml-1 inline-block h-4 w-2 bg-[#F16C38] animate-pulse"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
