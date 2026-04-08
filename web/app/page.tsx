export default function Home() {
  return (
    <main className="page">
      {/* Hero */}
      <section className="hero">
        <p className="eyebrow">AI Visual Capture</p>
        <h1 className="hero-title">
          Microsoft Lens is gone.<br />
          Your photos still have text in them.
        </h1>
        <p className="hero-sub">
          CORTEX uses AI vision to extract, organize, and search the text in your photos.
          Whiteboards, receipts, handwritten notes — captured and structured instantly.
        </p>
        <a href="#waitlist" className="cta-btn">Get Early Access</a>
      </section>

      {/* Features */}
      <section className="section">
        <h2 className="section-title">What CORTEX does</h2>
        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">📷</div>
            <h3>Photo to Text</h3>
            <p>Point your camera at anything with text. AI extracts it, generates a title, tags, and summary.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Whiteboard Capture</h3>
            <p>Snap a whiteboard after a meeting. Get searchable, structured notes — not just a photo.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📁</div>
            <h3>Bulk Import</h3>
            <p>Import dozens of photos from your camera roll at once. AI organizes them all automatically.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Smart Search</h3>
            <p>Search your captures by content, not filename. Find that receipt from three months ago in seconds.</p>
          </div>
        </div>
      </section>

      {/* Lens migration */}
      <section className="section section-alt">
        <h2 className="section-title">Switching from Microsoft Lens?</h2>
        <p className="section-sub">
          Microsoft Lens was retired in March 2026. CORTEX picks up where Lens left off — but instead
          of just scanning to PDF, CORTEX uses AI to <strong>understand</strong> what&apos;s in your photos.
        </p>
        <div className="compare">
          <div className="compare-col">
            <h4>Microsoft Lens did</h4>
            <ul>
              <li>Capture documents and whiteboards</li>
              <li>Basic OCR text extraction</li>
              <li>Save to OneDrive as PDF</li>
              <li>Manual organization</li>
            </ul>
          </div>
          <div className="compare-col highlight">
            <h4>CORTEX does</h4>
            <ul>
              <li>Capture any visual content</li>
              <li>AI-powered text extraction + summarization</li>
              <li>Auto-generated titles, tags, categories</li>
              <li>Full-text search across all captures</li>
              <li>Bulk import from camera roll</li>
              <li>Share sheet integration</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section">
        <h2 className="section-title">How it works</h2>
        <div className="steps">
          <div className="step">
            <span className="step-num">1</span>
            <h3>Capture</h3>
            <p>Take a photo, pick from your library, or share from another app.</p>
          </div>
          <div className="step">
            <span className="step-num">2</span>
            <h3>AI Analyzes</h3>
            <p>Claude vision extracts text, generates a title, assigns tags, writes a summary.</p>
          </div>
          <div className="step">
            <span className="step-num">3</span>
            <h3>Search &amp; Find</h3>
            <p>Full-text search across all your captures. Find anything by what it says, not what you named it.</p>
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section className="section section-alt" id="waitlist">
        <h2 className="section-title">Get early access</h2>
        <p className="section-sub">
          Coming to iOS first. Join the waitlist to be notified when CORTEX launches on the App Store.
        </p>
        <p style={{ marginTop: '1.5rem', color: '#71717a', fontSize: '0.875rem' }}>
          Waitlist signup coming soon. Follow development at{' '}
          <a href="https://github.com/ahfeiathome/cortex" style={{ color: '#60a5fa' }}>GitHub</a>.
        </p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>CORTEX — A BigClaw AI product</p>
      </footer>
    </main>
  )
}
