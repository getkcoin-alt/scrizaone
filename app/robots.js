import { SITE_URL } from "@/lib/site";

// Search and AI-search crawlers are allowed on the production domain.
// Preview deployments (*.vercel.app) are noindexed by middleware.js.
export default function robots() {
  const agents = [
    "Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "GPTBot", "PerplexityBot", "Perplexity-User",
    "ClaudeBot", "Claude-SearchBot", "Claude-User", "Applebot", "Applebot-Extended", "Google-Extended",
  ];
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...agents.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
