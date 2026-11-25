function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/^https?:\/\//, "").replace(/\/$/, "")}`
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "").replace(/\/$/, "")}`
  }
  if (process.env.GITHUB_REPOSITORY_OWNER) {
    return `https://${process.env.GITHUB_REPOSITORY_OWNER.toLowerCase()}.github.io`
  }
  return "https://mahmud.is-a.dev"
}

export const SITE_URL = resolveSiteUrl()

export const SITE_NAME = "M. Oly Mahmud"
export const SITE_TITLE = "M. Oly Mahmud — Back-End, DevOps & AI Engineer"
export const SITE_DESCRIPTION =
  "Back-End Software & DevOps Engineer working with Java, Python, Node.js, Go, Cloud, and Gen AI, with active research in Distributed Systems and Artificial Intelligence."
export const SITE_KEYWORDS = [
  "M. Oly Mahmud",
  "Back-End Engineer",
  "DevOps Engineer",
  "Software Engineer",
  "Java",
  "Python",
  "Node.js",
  "Go",
  "Golang",
  "Cloud Infrastructure",
  "Gen AI",
  "Distributed Systems",
  "Artificial Intelligence",
  "Networking",
  "Data Structures and Algorithms",
  "Technical Blog",
]
export const SITE_PROFILES = [
  "https://github.com/OlyMahmudMugdho/",
  "https://www.linkedin.com/in/olymahmud/",
  "https://dev.to/olymahmud/",
]
