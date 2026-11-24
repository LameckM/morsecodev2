import { useState } from 'react'
import './App.css'
import { MORSE_CHARACTERS, type MorseCategory } from './data/morseCode'

type Page = 'Overview' | 'Learn' | 'Practice' | 'Morse Visualizer' | 'Reference' | 'Progress'

const navigation: { label: Page; icon: string; description: string }[] = [
  { label: 'Overview', icon: '◫', description: 'Your learning dashboard' },
  { label: 'Learn', icon: '▤', description: 'Build your Morse foundations' },
  { label: 'Practice', icon: '⌁', description: 'Train your recognition' },
  { label: 'Morse Visualizer', icon: '◉', description: 'See and hear Morse signals' },
  { label: 'Reference', icon: '▦', description: 'Letters, numbers and symbols' },
  { label: 'Progress', icon: '↗', description: 'Your learning journey' },
]


function ReferencePage() {
  const [category, setCategory] = useState<'All' | MorseCategory>('All')
  const [search, setSearch] = useState('')
  const categories: ('All' | MorseCategory)[] = ['All', 'Letter', 'Number', 'Punctuation']

  const filteredCharacters = MORSE_CHARACTERS.filter((item) => {
    const matchesCategory = category === 'All' || item.category === category
    const term = search.trim().toLowerCase()
    const matchesSearch = !term ||
      item.character.toLowerCase().includes(term) ||
      item.code.includes(term) ||
      item.name.toLowerCase().includes(term)
    return matchesCategory && matchesSearch
  })

  const counts = {
    All: MORSE_CHARACTERS.length,
    Letter: MORSE_CHARACTERS.filter((item) => item.category === 'Letter').length,
    Number: MORSE_CHARACTERS.filter((item) => item.category === 'Number').length,
    Punctuation: MORSE_CHARACTERS.filter((item) => item.category === 'Punctuation').length,
  }

  return (
    <section className="reference-page">
      <div className="reference-intro">
        <div className="eyebrow">THE INTERNATIONAL MORSE CODE</div>
        <h1>Know your <em>signals.</em></h1>
        <p>One character, one pattern. Explore the standard code for letters, numbers and common punctuation.</p>
      </div>

      <div className="reference-toolbar">
        <label className="reference-search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search a character, name or code..."
            aria-label="Search Morse code reference"
          />
          {search && <button type="button" onClick={() => setSearch('')} aria-label="Clear search">×</button>}
        </label>
        <div className="reference-filters" role="group" aria-label="Filter by category">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={category === item ? 'filter-chip selected' : 'filter-chip'}
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
            >
              {item === 'All' ? 'All' : item === 'Letter' ? 'Letters' : item === 'Number' ? 'Numbers' : 'Punctuation'}
              <span>{counts[item]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="reference-results-heading">
        <div><span className="eyebrow">REFERENCE LIBRARY</span><h2>{category === 'All' ? 'All characters' : category === 'Letter' ? 'Letters' : category === 'Number' ? 'Numbers' : 'Punctuation'}</h2></div>
        <span className="results-count">{filteredCharacters.length} {filteredCharacters.length === 1 ? 'RESULT' : 'RESULTS'}</span>
      </div>

      {filteredCharacters.length > 0 ? (
        <div className="character-grid">
          {filteredCharacters.map((item) => (
            <article className="character-card" key={item.character}>
              <div className="character-card-top"><span>{item.category.toUpperCase()}</span><span className="character-index">{item.code.length} {item.code.length === 1 ? 'SIGN' : 'SIGNS'}</span></div>
              <div className="character-symbol">{item.character === ' ' ? 'SPACE' : item.character}</div>
              <div className="character-name">{item.name}</div>
              <div className="character-code" aria-label={item.code.split('').map((sign) => sign === '.' ? 'dot' : 'dash').join(', ')}>
                {item.code.split('').map((sign, index) => (
                  <span className={sign === '.' ? 'morse-dot' : 'morse-dash'} key={index} />
                ))}
              </div>
              <div className="character-code-text">{item.code.replaceAll('.', '·').replaceAll('-', '−')}</div>
            </article>
          ))}
        </div>
      ) : (
        <div className="reference-empty">
          <span>⌕</span><strong>No matching characters</strong><p>Try another letter, number, punctuation mark or Morse pattern.</p>
          <button type="button" onClick={() => { setSearch(''); setCategory('All') }}>Clear filters</button>
        </div>
      )}

      <div className="reference-note">
        <span className="note-symbol">i</span>
        <p><strong>Reading the code:</strong> A dot (·) is a short signal. A dash (−) is a signal three times as long. The spaces between signals are just as important as the signals themselves.</p>
      </div>
    </section>
  )
}

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
          ) : activePage === 'Reference' ? (
            <ReferencePage />
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
