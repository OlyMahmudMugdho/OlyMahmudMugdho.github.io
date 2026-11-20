export interface CardTheme {
    bannerHex: string
    medallionHex: string
    iconHex: string
}

export const CARD_THEMES: CardTheme[] = [
    {
        bannerHex: "#5c3224",
        medallionHex: "#d4b0a2",
        iconHex: "#3b1f16",
    },
    {
        bannerHex: "#0d5449",
        medallionHex: "#a7c2bc",
        iconHex: "#08362f",
    },
    {
        bannerHex: "#3d3158",
        medallionHex: "#beb3d4",
        iconHex: "#251c38",
    },
    {
        bannerHex: "#223b52",
        medallionHex: "#adc2d6",
        iconHex: "#142535",
    },
]

const POST_EMOJIS = [
    "🧠",
    "⚡",
    "🌳",
    "🔗",
    "📚",
    "🧩",
    "🚀",
    "🧭",
    "🎯",
    "🛠️",
    "💡",
    "📦",
]

export function hashSlug(slug: string): number {
    let hash = 0
    for (let i = 0; i < slug.length; i++) {
        hash = (hash * 31 + slug.charCodeAt(i)) >>> 0
    }
    return hash
}

export function getPostVisual(slug: string): { theme: CardTheme; emoji: string } {
    const h = hashSlug(slug)
    return {
        theme: CARD_THEMES[h % CARD_THEMES.length],
        emoji: POST_EMOJIS[(h >>> 2) % POST_EMOJIS.length],
    }
}
