import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CORTEX — Coming Soon',
  description: 'Photograph a whiteboard, receipt, or handwritten note. AI extracts, organizes, and makes it searchable. Instantly.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
