import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Best Microsoft Lens Alternative 2026 — CORTEX AI Photo Text Extraction',
  description: 'Microsoft Lens retired March 2026. CORTEX is the AI-powered alternative — capture text from whiteboards, receipts, and notes with Claude vision. Smarter than OCR.',
  openGraph: {
    title: 'Microsoft Lens Alternative 2026 — CORTEX',
    description: 'Microsoft Lens retired March 2026. CORTEX uses AI vision to extract, organize, and search text from your photos.',
    url: 'https://cortex-bigclaw.vercel.app/lens-alternative',
  },
}

export default function LensAlternativePage() {
  return (
    <main className="page" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      <h1 className="hero-title" style={{ textAlign: 'center', marginBottom: '1rem' }}>
        Microsoft Lens Alternative for 2026
      </h1>
      <p className="section-sub" style={{ marginBottom: '3rem' }}>
        Microsoft retired Lens on March 9, 2026. If you relied on it for capturing whiteboards,
        receipts, or documents — here&apos;s what comes next.
      </p>

      {/* What happened */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
          What happened to Microsoft Lens?
        </h2>
        <p style={{ color: '#a1a1aa', marginBottom: '1rem' }}>
          Microsoft discontinued the standalone Lens app in March 2026. The scanning functionality
          was folded into OneDrive — but the replacement is limited. OneDrive scanning requires
          a Microsoft account, saves only to the cloud, and offers basic OCR with no AI features.
        </p>
        <p style={{ color: '#a1a1aa' }}>
          For millions of users who used Lens as a quick, offline-capable capture tool,
          the OneDrive replacement falls short.
        </p>
      </section>

      {/* Comparison table */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '1.5rem' }}>
          How alternatives compare
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #27272a' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#a1a1aa', fontWeight: 600 }}>Feature</th>
                <th style={{ textAlign: 'center', padding: '0.75rem', color: '#52525b', fontWeight: 600 }}>Lens (retired)</th>
                <th style={{ textAlign: 'center', padding: '0.75rem', color: '#52525b', fontWeight: 600 }}>OneDrive</th>
                <th style={{ textAlign: 'center', padding: '0.75rem', color: '#52525b', fontWeight: 600 }}>Adobe Scan</th>
                <th style={{ textAlign: 'center', padding: '0.75rem', color: '#60a5fa', fontWeight: 700 }}>CORTEX</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Photo capture', '✅', '✅', '✅', '✅'],
                ['Whiteboard mode', '✅', '❌', '❌', '✅'],
                ['Text extraction (OCR)', '✅', '✅', '✅', '✅'],
                ['AI summarization', '❌', '❌', '❌', '✅'],
                ['Auto-tagging & categorization', '❌', '❌', '❌', '✅'],
                ['Full-text search', '❌', 'Limited', '❌', '✅'],
                ['Bulk photo import', '❌', '❌', '❌', '✅'],
                ['Share sheet integration', '✅', '❌', '✅', '✅'],
                ['Works offline', '✅', '❌', '✅', '✅'],
                ['No account required', '❌', '❌', '❌', '✅'],
                ['PDF export', '✅', '✅', '✅', 'Coming'],
              ].map(([feature, ...vals], i) => (
                <tr key={i} style={{ borderBottom: '1px solid #1e1e24' }}>
                  <td style={{ padding: '0.625rem 0.75rem', color: '#d4d4d8' }}>{feature}</td>
                  {vals.map((v, j) => (
                    <td key={j} style={{ padding: '0.625rem 0.75rem', textAlign: 'center', color: v === '✅' ? '#22c55e' : v === '❌' ? '#52525b' : '#f59e0b' }}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Why CORTEX */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
          Why CORTEX is different
        </h2>
        <p style={{ color: '#a1a1aa', marginBottom: '1rem' }}>
          Every Lens alternative on the market is a <strong style={{ color: '#d4d4d8' }}>document scanner</strong> — they
          capture an image and save it as a PDF. That&apos;s it.
        </p>
        <p style={{ color: '#a1a1aa', marginBottom: '1rem' }}>
          CORTEX is a <strong style={{ color: '#60a5fa' }}>visual knowledge capture</strong> tool. When you take a photo,
          AI reads the content, extracts the text, writes a summary, assigns tags, and makes
          everything searchable. You don&apos;t organize your captures — the AI does it for you.
        </p>
        <p style={{ color: '#a1a1aa' }}>
          Three months from now, when you need to find that whiteboard from Tuesday&apos;s meeting,
          you search &ldquo;Q3 roadmap&rdquo; and it&apos;s there. No folders. No filenames. Just content.
        </p>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', background: '#111118', margin: '0 -1.5rem', padding: '3rem 1.5rem', borderRadius: '12px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '0.75rem' }}>
          Ready to try CORTEX?
        </h2>
        <p style={{ color: '#a1a1aa', marginBottom: '1.5rem' }}>Coming to iOS first. Android to follow.</p>
        <a href="/#waitlist" className="cta-btn">Get Early Access</a>
      </section>
    </main>
  )
}
