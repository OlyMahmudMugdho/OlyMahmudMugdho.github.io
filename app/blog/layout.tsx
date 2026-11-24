import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/sections/footer"
import { Inconsolata } from 'next/font/google'

const inconsolata = Inconsolata({ subsets: ['latin'] })

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className={`flex min-h-screen flex-col bg-background dark:bg-[#242322] transition-colors duration-300`}>
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Merriweather:wght@400;700&family=Noto+Sans+Bengali:wght@400;500;600;700&family=Noto+Serif+Bengali:wght@400;500;600;700&display=swap"
            />
            <Navbar className="dark:bg-[#242322]/95" />
            <main className={`flex-1 pt-24 pb-12 ${inconsolata.className}`}>
                {children}
            </main>
            <Footer />
        </div>
    )
}
