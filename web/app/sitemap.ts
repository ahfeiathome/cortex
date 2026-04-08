import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://cortex-bigclaw.vercel.app'
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/lens-alternative`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
  ]
}
