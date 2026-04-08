import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CORTEX — AI Photo Text Extraction | Microsoft Lens Alternative',
  description: 'Capture text from photos using AI vision. Whiteboards, receipts, handwritten notes — extracted, organized, and searchable instantly. The intelligent Microsoft Lens replacement.',
  keywords: ['Microsoft Lens alternative', 'OCR app', 'photo to text', 'whiteboard capture', 'AI document capture', 'text extraction'],
  openGraph: {
    title: 'CORTEX — AI Photo Text Extraction',
    description: 'Microsoft Lens is gone. CORTEX captures text from photos using AI vision — whiteboards, receipts, notes. Extracted and searchable instantly.',
    url: 'https://cortex-bigclaw.vercel.app',
    siteName: 'CORTEX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CORTEX — AI Photo Text Extraction',
    description: 'Microsoft Lens is gone. CORTEX captures text from photos using AI — whiteboards, receipts, notes.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'CORTEX',
              applicationCategory: 'UtilitiesApplication',
              operatingSystem: 'iOS',
              description: 'AI-powered visual knowledge capture. Extract text from photos of whiteboards, receipts, and handwritten notes.',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
