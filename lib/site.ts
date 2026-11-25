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
export const SITE_TITLE = "M. Oly Mahmud - Software & DevOps Engineer"
export const SITE_DESCRIPTION =
  "Portfolio, technical blog, and courses by M. Oly Mahmud covering Go, networking, algorithms, DevOps, and Cloud technologies."
