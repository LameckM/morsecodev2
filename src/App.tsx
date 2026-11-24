import { useState } from 'react'
import './App.css'

type Page = 'Overview' | 'Learn' | 'Practice' | 'Morse Visualizer' | 'Reference' | 'Progress'

const navigation: { label: Page; icon: string; description: string }[] = [
  { label: 'Overview', icon: '◫', description: 'Your learning dashboard' },
  { label: 'Learn', icon: '▤', description: 'Build your Morse foundations' },
  { label: 'Practice', icon: '⌁', description: 'Train your recognition' },
  { label: 'Morse Visualizer', icon: '◉', description: 'See and hear Morse signals' },
  { label: 'Reference', icon: '▦', description: 'Letters, numbers and symbols' },
  { label: 'Progress', icon: '↗', description: 'Your learning journey' },
]

function App() {
  const [activePage, setActivePage] = useState<Page>('Overview')
  const [menuOpen, setMenuOpen] = useState(false)

  const selectPage = (page: Page) => {
    setActivePage(page)
    setMenuOpen(false)
  }

  return (
    <div className="app-shell">
      {menuOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark" aria-hidden="true"><span /> <span /> <span /></div>
          <div><strong>MORSE<span>CODE</span></strong><small>LEARNING STUDIO</small></div>
        </div>

        <div className="nav-label">WORKSPACE</div>
        <nav className="main-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <button
              className={`nav-item ${activePage === item.label ? 'active' : ''}`}
              key={item.label}
              onClick={() => selectPage(item.label)}
              aria-current={activePage === item.label ? 'page' : undefined}
            >
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
              {item.label === 'Morse Visualizer' && <span className="nav-new">TOOL</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="daily-card">
            <div className="daily-icon">✳</div>
            <strong>Small steps. Clear signals.</strong>
            <p>A little practice every day builds lasting fluency.</p>
            <div className="daily-dots" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></div>
          </div>
          <div className="profile">
            <div className="avatar">M</div>
            <div><strong>Learner</strong><small>Beginner level</small></div>
            <span className="profile-menu">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu" aria-label="Open navigation" onClick={() => setMenuOpen(true)}>☰</button>
          <div className="breadcrumb"><span>Workspace</span><b>/</b><strong>{activePage}</strong></div>
          <div className="topbar-right"><span className="status-dot" /> <span>YOUR LEARNING SPACE</span></div>
        </header>

        <div className="page-content">
          {activePage === 'Overview' ? (
            <>
              <section className="welcome-row">
                <div>
                  <div className="eyebrow">YOUR MORSE JOURNEY STARTS HERE</div>
                  <h1>Decode the world,<br /><em>one signal at a time.</em></h1>
                  <p className="welcome-copy">Learn Morse code through guided lessons, focused practice and interactive tools.</p>
                </div>
                <div className="signal-art" aria-label="Morse code signal pattern" role="img">
                  <div className="signal-orbit orbit-one" /><div className="signal-orbit orbit-two" />
                  <div className="signal-center"><span>·</span><span>−</span><span>·</span></div>
                  <div className="signal-caption">SIGNAL / 001</div>
                </div>
              </section>

              <section className="section-heading">
                <div><div className="eyebrow">PICK UP WHERE YOU LEFT OFF</div><h2>Your workspace</h2></div>
                <span className="section-note">A clear path from beginner to confident</span>
              </section>

              <section className="feature-grid">
                <button className="feature-card learn-card" onClick={() => selectPage('Learn')}>
                  <div className="card-topline"><span className="card-icon">▤</span><span className="card-index">01 / LEARN</span></div>
                  <div><h3>Learn the language</h3><p>Start with the building blocks. Move through short, structured lessons at your own pace.</p></div>
                  <div className="card-action">Explore lessons <span>↗</span></div>
                </button>
                <button className="feature-card practice-card" onClick={() => selectPage('Practice')}>
                  <div className="card-topline"><span className="card-icon">⌁</span><span className="card-index">02 / PRACTICE</span></div>
                  <div><h3>Train your instincts</h3><p>Strengthen recognition with listening, decoding and recall exercises.</p></div>
                  <div className="card-action">Start practicing <span>↗</span></div>
                </button>
                <button className="feature-card visualizer-card" onClick={() => selectPage('Morse Visualizer')}>
                  <div className="card-topline"><span className="card-icon">◉</span><span className="card-index">03 / EXPLORE</span></div>
                  <div><h3>See every signal</h3><p>Explore dots, dashes, timing and sound with the dedicated Morse visualizer.</p></div>
                  <div className="card-action">Open visualizer <span>↗</span></div>
                </button>
              </section>

              <section className="bottom-grid">
                <div className="panel journey-panel">
                  <div className="panel-heading"><div><div className="eyebrow">YOUR FOUNDATION</div><h2>The learning path</h2></div><span className="quiet-tag">GET STARTED</span></div>
                  <div className="path-row"><div className="path-number">01</div><div className="path-copy"><strong>Meet the signals</strong><span>Understand dots, dashes and timing.</span></div><span className="path-state">READY</span></div>
                  <div className="path-row"><div className="path-number muted">02</div><div className="path-copy"><strong>Learn letters and numbers</strong><span>Build a reliable mental reference.</span></div><span className="path-lock">—</span></div>
                  <div className="path-row"><div className="path-number muted">03</div><div className="path-copy"><strong>Listen and decode</strong><span>Connect the sound to the symbol.</span></div><span className="path-lock">—</span></div>
                </div>
                <div className="panel principle-panel">
                  <div className="eyebrow">THE MORSE PRINCIPLE</div>
                  <div className="principle-symbol">· − · ·</div>
                  <h3>Pattern becomes language.</h3>
                  <p>Every character is a unique sequence of short and long signals. Learn the rhythm, then the code starts to make sense.</p>
                  <button className="text-link" onClick={() => selectPage('Reference')}>Explore the reference <span>→</span></button>
                </div>
              </section>
            </>
          ) : (
            <section className="placeholder-page">
              <div className="eyebrow">MORSECODE LEARNING STUDIO</div>
              <h1>{activePage === 'Morse Visualizer' ? <>Morse <em>Visualizer.</em></> : <>{activePage}<em>.</em></>}</h1>
              <p>This section is part of the learning studio. Its interactive features will be built in the next development steps.</p>
              <div className="placeholder-line"><span>·</span><span>−</span><span>·</span><span>·</span></div>
              <button className="return-button" onClick={() => selectPage('Overview')}>← Back to overview</button>
            </section>
          )}
          <footer className="page-footer"><span>MORSECODE LEARNING STUDIO</span><span>LEARN AT YOUR OWN RHYTHM <b>·</b> 01</span></footer>
        </div>
      </main>
    </div>
  )
}

export default App
