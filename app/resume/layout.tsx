import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Curriculum vitae and engineering experience of M. Oly Mahmud — Back-End Software & DevOps Engineer.",
  openGraph: {
    type: "profile",
    title: "Resume | M. Oly Mahmud",
    description:
      "Curriculum vitae and engineering experience of M. Oly Mahmud — Back-End Software & DevOps Engineer.",
  },
  twitter: {
    card: "summary",
    title: "Resume | M. Oly Mahmud",
    description:
      "Curriculum vitae and engineering experience of M. Oly Mahmud — Back-End Software & DevOps Engineer.",
  },
}

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
