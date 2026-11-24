import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { MORSE_CHARACTERS, type MorseCategory } from './data/morseCode'
import { LETTER_LESSONS } from './data/lessons'
import { LETTER_MNEMONICS } from './data/mnemonics'

type Page = 'Overview' | 'Learn' | 'Practice' | 'Listening' | 'Assessments' | 'Morse Visualizer' | 'Reference' | 'Progress'

const navigation: { label: Page; icon: string; description: string }[] = [
  { label: 'Overview', icon: '◫', description: 'Your learning dashboard' },
  { label: 'Learn', icon: '▤', description: 'Build your Morse foundations' },
  { label: 'Practice', icon: '⌁', description: 'Train your recognition' },
  { label: 'Listening', icon: '♫', description: 'Recognise Morse by sound' },
  { label: 'Assessments', icon: '✓', description: 'Measure your recall' },
  { label: 'Morse Visualizer', icon: '◉', description: 'See and hear Morse signals' },
  { label: 'Reference', icon: '▦', description: 'Letters, numbers and symbols' },
  { label: 'Progress', icon: '↗', description: 'Your learning journey' },
]

type PracticeStats = { answered: number; correct: number; bestStreak: number }
type StoredAttempt = { date: string; score: number; total: number; timestamp?: number }

function formatMorseCode(code: string): string {
  return code.replaceAll('.', '·').replaceAll('-', '−')
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

function isCompletedLessons(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((item) => Number.isInteger(item) && item >= 1 && item <= LETTER_LESSONS.length)
}

function isPracticeStats(value: unknown): value is PracticeStats {
  return isRecord(value) &&
    isNonNegativeNumber(value.answered) &&
    isNonNegativeNumber(value.correct) &&
    value.correct <= value.answered &&
    isNonNegativeNumber(value.bestStreak) &&
    value.bestStreak <= value.answered
}

function isAttemptHistory(value: unknown): value is StoredAttempt[] {
  return Array.isArray(value) && value.every((item) =>
    isRecord(item) &&
    typeof item.date === 'string' &&
    (item.timestamp === undefined || isNonNegativeNumber(item.timestamp)) &&
    isNonNegativeNumber(item.score) &&
    isNonNegativeNumber(item.total) &&
    item.score <= item.total
  )
}

function readStoredValue<T>(key: string, fallback: T, validate: (value: unknown) => value is T): T {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    const parsed: unknown = JSON.parse(raw)
    return validate(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

function writeStoredValue(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    // Storage can be unavailable or full; the app should remain usable in memory.
    return false
  }
}



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
              <div className="character-code-text">{formatMorseCode(item.code)}</div>
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


function LearnPage({ initialLessonIndex = 0 }: { initialLessonIndex?: number }) {
  const [completed, setCompleted] = useState<number[]>(() =>
    readStoredValue('morsecodev2-completed-lessons', [], isCompletedLessons)
  )
  const [selectedLesson, setSelectedLesson] = useState(initialLessonIndex)
  const [reviewIndex, setReviewIndex] = useState(0)
  const [codeRevealed, setCodeRevealed] = useState(false)
  const [learningStage, setLearningStage] = useState<'study' | 'quiz'>('study')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | ''>('')
  const [quizChoices, setQuizChoices] = useState<(typeof MORSE_CHARACTERS)[number][]>([])
  const [quizHadMistake, setQuizHadMistake] = useState(false)
  const [showFoundations, setShowFoundations] = useState(initialLessonIndex === 0 && completed.length === 0)

  const lesson = LETTER_LESSONS[selectedLesson]
  const alphabet = MORSE_CHARACTERS.filter((item) => item.category === 'Letter')
  const lessonCharacters = lesson.letters.map((letter) => alphabet.find((item) => item.character === letter)!).filter(Boolean)
  const studyCharacter = lessonCharacters[reviewIndex]
  const studyMnemonic = studyCharacter ? LETTER_MNEMONICS[studyCharacter.character] ?? [] : []
  const target = lessonCharacters[questionIndex]
  const choices = quizChoices
  const isComplete = completed.includes(lesson.id)
  const completedCount = completed.length
  const progressPercent = Math.round((completedCount / LETTER_LESSONS.length) * 100)

  const chooseLesson = (index: number) => {
    if (index > 0 && !completed.includes(LETTER_LESSONS[index - 1].id)) return
    setSelectedLesson(index)
    setReviewIndex(0)
    setCodeRevealed(false)
    setLearningStage('study')
    setQuestionIndex(0)
    setFeedback('')
    setQuizChoices([])
    setShowFoundations(false)
  }

  const makeQuizChoices = (character: (typeof MORSE_CHARACTERS)[number]) => {
    const distractors = shuffled(alphabet.filter((item) => item.character !== character.character)).slice(0, 3)
    setQuizChoices(shuffled([character, ...distractors]))
  }

  const startQuiz = () => {
    setLearningStage('quiz')
    setQuestionIndex(0)
    setFeedback('')
    setQuizHadMistake(false)
    if (lessonCharacters[0]) makeQuizChoices(lessonCharacters[0])
  }

  const chooseAnswer = (code: string) => {
    if (!target || feedback || isComplete) return
    if (code === target.code) {
      setFeedback('correct')
      if (questionIndex === lessonCharacters.length - 1) {
        const nextCompleted = [...new Set([...completed, lesson.id])]
        setCompleted(nextCompleted)
        writeStoredValue('morsecodev2-completed-lessons', nextCompleted)
      }
    } else {
      // A lesson must be recalled correctly on the first attempt for every question.
      setQuizHadMistake(true)
      setQuizChoices((current) => current.filter((choice) => choice.code !== code))
      setFeedback('incorrect')
    }
  }

  const continueQuiz = () => {
    if (feedback === 'incorrect') {
      setFeedback('')
      return
    }
    if (questionIndex < lessonCharacters.length - 1) {
      const nextIndex = questionIndex + 1
      setQuestionIndex(nextIndex)
      setFeedback('')
      const nextTarget = lessonCharacters[nextIndex]
      if (nextTarget) makeQuizChoices(nextTarget)
    }
  }

  const nextLesson = () => {
    if (selectedLesson < LETTER_LESSONS.length - 1) {
      setSelectedLesson((current) => current + 1)
      setReviewIndex(0)
      setCodeRevealed(false)
      setLearningStage('study')
      setQuestionIndex(0)
      setFeedback('')
      setQuizChoices([])
    }
  }

  const advanceStudy = () => {
    if (reviewIndex < lessonCharacters.length - 1) {
      setReviewIndex((current) => current + 1)
      setCodeRevealed(false)
    } else {
      startQuiz()
    }
  }

  return (
    <section className="learn-page">
      <div className="sr-only" aria-live="polite" aria-atomic="true">{feedback === 'correct' ? `Correct. ${target?.character ?? ''}.` : feedback === 'incorrect' ? `Incorrect answer for ${target?.character ?? 'this character'}. Try again.` : ''}</div>
      <div className="learn-intro">
        <div className="eyebrow">YOUR GUIDED COURSE</div>
        <h1>Learn it <em>step by step.</em></h1>
        <p>First try to remember each pattern. Reveal it only after making a guess, then test your memory without the answers in view.</p>
      </div>

      <div className="learn-progress-panel">
        <div className="learn-progress-copy"><div><span className="eyebrow">COURSE PROGRESS</span><strong>{completedCount} of {LETTER_LESSONS.length} lessons completed</strong></div><b>{progressPercent}%</b></div>
        <div className="learn-progress-track"><span style={{ width: progressPercent + '%' }} /></div>
      </div>

      <div className="learn-layout">
        <aside className="lesson-list">
          <div className="lesson-list-heading"><span className="eyebrow">THE CURRICULUM</span><strong>Letter foundations</strong></div>
          {LETTER_LESSONS.map((item, index) => {
            const done = completed.includes(item.id)
            const locked = index > 0 && !completed.includes(LETTER_LESSONS[index - 1].id)
            return (
              <button key={item.id} className={selectedLesson === index && !showFoundations ? 'lesson-list-item active' : 'lesson-list-item'} disabled={locked} onClick={() => chooseLesson(index)}>
                <span className={done ? 'lesson-number done' : 'lesson-number'}>{done ? '✓' : String(item.id).padStart(2, '0')}</span>
                <span className="lesson-list-copy"><strong>{item.title}</strong><small>{item.letters.join(' · ')}</small></span>
                <span className="lesson-list-state">{done ? 'DONE' : locked ? 'LOCKED' : selectedLesson === index && !showFoundations ? 'OPEN' : 'START'}</span>
              </button>
            )
          })}
        </aside>

        <div className="lesson-workspace">
          {showFoundations ? (
            <div className="lesson-content">
              <div className="lesson-kicker">START HERE · FOUNDATIONS</div>
              <h2>Two signals make the code.</h2>
              <p className="lesson-lead">International Morse code uses just two kinds of signal. Learn their shape and timing before memorising letters.</p>
              <div className="signal-lesson-grid">
                <div className="signal-lesson-card"><span className="signal-demo dot-demo">·</span><strong>Dot</strong><b>Short signal</b><p>Use one basic time unit.</p></div>
                <div className="signal-lesson-card"><span className="signal-demo dash-demo">−</span><strong>Dash</strong><b>Long signal</b><p>Hold for three time units.</p></div>
              </div>
              <div className="timing-note"><strong>Timing matters</strong><p>A gap between parts of the same character is one unit. The gap between letters is three units, and the gap between words is seven units.</p></div>
              <div className="lesson-example"><span className="eyebrow">YOUR FIRST EXAMPLE</span><div className="example-pair"><span className="example-letter">E</span><span className="example-code">·</span><span className="example-divider" /><span className="example-letter">T</span><span className="example-code">−</span></div><p>E is one dot. T is one dash. These are the two simplest letters.</p></div>
              <button className="lesson-primary-button" onClick={() => { setShowFoundations(false); setSelectedLesson(0); setReviewIndex(0); setCodeRevealed(false); setLearningStage('study'); setQuestionIndex(0); setFeedback(''); setQuizChoices([]) }}>Begin lesson 01 <span>→</span></button>
            </div>
          ) : (
            <div className="lesson-content">
              <div className="lesson-content-top"><span className="lesson-kicker">LESSON {String(lesson.id).padStart(2, '0')} / 07</span><span className="lesson-step">{isComplete ? 'COMPLETED' : learningStage === 'study' ? 'MEMORY PRACTICE' : 'RECALL CHECK'}</span></div>
              <h2>{lesson.title}</h2>
              <p className="lesson-lead">{lesson.focus}</p>

              {isComplete ? (
                <div className="quiz-complete lesson-finished-panel"><strong>Lesson completed.</strong><p>You passed the recall check. Your progress is saved on this device.</p>{selectedLesson < LETTER_LESSONS.length - 1 ? <button className="lesson-primary-button" onClick={nextLesson}>Next lesson <span>→</span></button> : <p className="course-finished">You have completed all the letter lessons.</p>}</div>
              ) : learningStage === 'study' ? (
                <div className="study-stage">
                  <div className="study-stage-heading"><span className="eyebrow">CHARACTER {reviewIndex + 1} OF {lessonCharacters.length}</span><span className="study-progress">{reviewIndex + 1} / {lessonCharacters.length}</span></div>
                  <div className="study-card">
                    <span className="study-prompt">Look at the letter. Can you remember its Morse pattern?</span>
                    <strong className="study-letter">{studyCharacter?.character}</strong>
                    <div className="mnemonic-panel">
                      <span className="mnemonic-heading">MEMORY PHRASE</span>
                      <div className="mnemonic-phrase">
                        {studyMnemonic.map((word, index) => {
                          const isDash = /[A-Z]/.test(word) && word === word.toUpperCase()
                          return (
                            <span className={isDash ? 'mnemonic-token dash-token' : 'mnemonic-token dot-token'} key={index}>
                              <strong>{word}</strong>
                              <small>{isDash ? '— DASH' : '· DOT'}</small>
                            </span>
                          )
                        })}
                      </div>
                      <div className="mnemonic-sequence" aria-label={studyMnemonic.map((word) => /[A-Z]/.test(word) && word === word.toUpperCase() ? 'dash' : 'dot').join(', ')}>
                        {studyMnemonic.map((word, index) => {
                          const isDash = /[A-Z]/.test(word) && word === word.toUpperCase()
                          return <span className={isDash ? 'mnemonic-signal dash-signal' : 'mnemonic-signal dot-signal'} key={index}>{isDash ? '—' : '·'}</span>
                        })}
                      </div>
                      <span className="mnemonic-key"><b>UPPERCASE</b> = DASH <i /> <b>lowercase</b> = DOT</span>
                    </div>
                    {codeRevealed ? (
                      <div className="study-reveal">
                        <span className="study-code">{studyCharacter ? formatMorseCode(studyCharacter.code) : ''}</span>
                        <span className="study-rhythm">{studyCharacter?.code.split('').map((signal) => signal === '.' ? 'DIT' : 'DAH').join(' · ')}</span>
                        <p>Say the rhythm, then picture the sequence. Try to recall it once more before moving on.</p>
                      </div>
                    ) : (
                      <button className="study-reveal-button" onClick={() => setCodeRevealed(true)}>Reveal Morse pattern <span>↗</span></button>
                    )}
                  </div>
                  <div className="study-stage-footer">
                    <div className="study-dots">{lessonCharacters.map((item, index) => <span key={item.character} className={index <= reviewIndex ? 'active' : ''} />)}</div>
                    {codeRevealed ? <button className="lesson-primary-button" onClick={advanceStudy}>{reviewIndex === lessonCharacters.length - 1 ? 'Start recall check' : 'Next character'} <span>→</span></button> : <span className="study-hint">Try to recall it before revealing</span>}
                  </div>
                </div>
              ) : (
                <>
                  <div className="recall-banner"><span className="eyebrow">NO PATTERNS SHOWN ABOVE</span><p>Use your memory. Choose the Morse pattern for the letter below.</p></div>
                  <div className="lesson-quiz">
                    <div className="quiz-heading"><div><span className="eyebrow">QUICK CHECK</span><h3>Which pattern belongs to this letter?</h3></div><span>{questionIndex + 1} / {lessonCharacters.length}</span></div>
                    <p className="quiz-question">Choose the Morse code for <strong>{target?.character}</strong>.</p>
                    <div className="quiz-options">
                      {choices.map((choice) => <button key={choice.character} className="quiz-option" disabled={Boolean(feedback)} onClick={() => chooseAnswer(choice.code)}>{formatMorseCode(choice.code)}</button>)}
                    </div>
                    {feedback && <div className={feedback === 'correct' ? 'quiz-feedback good' : 'quiz-feedback retry'}>{feedback === 'correct' ? 'Correct. You recalled the pattern.' : 'Not quite. Think of the sequence, then try again.'}</div>}
                    {feedback === 'correct' && questionIndex < lessonCharacters.length - 1 && <button className="lesson-primary-button" onClick={continueQuiz}>Next question <span>→</span></button>}
                    {feedback === 'correct' && questionIndex === lessonCharacters.length - 1 && quizHadMistake && <button className="lesson-primary-button" onClick={() => { setQuestionIndex(0); setFeedback(''); setQuizHadMistake(false); if (lessonCharacters[0]) makeQuizChoices(lessonCharacters[0]) }}>Retry the full quiz <span>↻</span></button>}
                    {feedback === 'incorrect' && <button className="lesson-secondary-button" onClick={continueQuiz}>Try again</button>}
                  </div>
                  <button className="lesson-back-link" onClick={() => { setLearningStage('study'); setReviewIndex(0); setCodeRevealed(false); setQuestionIndex(0); setFeedback(''); setQuizChoices([]) }}>← Review the characters again</button>
                </>
              )}
              <button className="lesson-back-link" onClick={() => setShowFoundations(true)}>← Back to foundations</button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}


function MorseVisualizerPage() {
  const [selectedLetter, setSelectedLetter] = useState('A')
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(900)
  const audioContextRef = useRef<AudioContext | null>(null)

  const phrase = useMemo(() => LETTER_MNEMONICS[selectedLetter] ?? [], [selectedLetter])
  const alphabet = MORSE_CHARACTERS.filter((item) => item.category === 'Letter')
  const selectedCharacter = alphabet.find((item) => item.character === selectedLetter)
  const signalForWord = (word: string) => /[A-Z]/.test(word) && word === word.toUpperCase() ? '−' : '·'
  const activeWord = phrase[activeIndex]

  const playSignal = (word: string, context: AudioContext) => {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const duration = signalForWord(word) === '−' ? 0.36 : 0.12
    const startAt = context.currentTime

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(650, startAt)
    gain.gain.setValueAtTime(0.0001, startAt)
    gain.gain.exponentialRampToValueAtTime(0.16, startAt + 0.01)
    gain.gain.setValueAtTime(0.16, startAt + duration - 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration)
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(startAt)
    oscillator.stop(startAt + duration)
  }

  useEffect(() => {
    if (!isPlaying) return
    const timer = window.setInterval(() => {
      if (activeIndex >= phrase.length - 1) {
        setIsPlaying(false)
        return
      }

      const nextIndex = activeIndex + 1
      setActiveIndex(nextIndex)

      const context = audioContextRef.current
      const nextSignal = phrase[nextIndex]
      if (context && nextSignal) playSignal(nextSignal, context)
    }, speed)
    return () => window.clearInterval(timer)
  }, [isPlaying, activeIndex, phrase, speed])

  const chooseLetter = (letter: string) => {
    setSelectedLetter(letter)
    setActiveIndex(0)
    setIsPlaying(false)
  }

  const startPlayback = () => {
    if (isPlaying) {
      setIsPlaying(false)
      return
    }

    const context = audioContextRef.current ?? new AudioContext()
    audioContextRef.current = context
    void context.resume()

    const startIndex = activeIndex === phrase.length - 1 ? 0 : activeIndex
    setActiveIndex(startIndex)
    if (phrase[startIndex]) playSignal(phrase[startIndex], context)
    setIsPlaying(true)
  }

  const restart = () => {
    setIsPlaying(false)
    setActiveIndex(0)
  }

  const step = (direction: -1 | 1) => {
    setIsPlaying(false)
    const nextIndex = Math.max(0, Math.min(phrase.length - 1, activeIndex + direction))
    setActiveIndex(nextIndex)

    const word = phrase[nextIndex]
    if (!word) return

    const context = audioContextRef.current ?? new AudioContext()
    audioContextRef.current = context
    void context.resume().then(() => playSignal(word, context))
  }

  return (
    <section className="mnemonic-visualizer-page">
      <div className="visualizer-intro">
        <div className="eyebrow">INTERACTIVE MNEMONIC EXPLORER</div>
        <h1>See the rhythm <em>come alive.</em></h1>
        <p>Choose a letter, follow its memory phrase and watch each syllable turn into a dot or dash.</p>
      </div>

      <div className="visualizer-layout">
        <aside className="visualizer-letter-panel">
          <div className="visualizer-panel-heading"><span className="eyebrow">THE ALPHABET</span><strong>Choose a letter</strong></div>
          <div className="visualizer-letter-grid">
            {alphabet.map((item) => (
              <button key={item.character} className={selectedLetter === item.character ? 'visualizer-letter-button active' : 'visualizer-letter-button'} onClick={() => chooseLetter(item.character)} aria-pressed={selectedLetter === item.character}>{item.character}</button>
            ))}
          </div>
        </aside>

        <div className="visualizer-main-panel">
          <div className="visualizer-character-heading">
            <div><span className="eyebrow">SELECTED CHARACTER</span><strong>{selectedLetter}</strong></div>
            <div className="visualizer-official-code"><span>OFFICIAL MORSE</span><b>{selectedCharacter ? formatMorseCode(selectedCharacter.code) : ''}</b></div>
          </div>

          <div className="visualizer-phrase-card">
            <span className="eyebrow">MEMORY PHRASE</span>
            <div className="visualizer-phrase">
              {phrase.map((word, index) => {
                const isDash = signalForWord(word) === '−'
                return (
                  <div key={index} className={index === activeIndex ? 'visualizer-word active' : 'visualizer-word'}>
                    <strong>{word}</strong>
                    <span className={isDash ? 'visualizer-word-signal dash' : 'visualizer-word-signal dot'}>{isDash ? '—' : '·'}</span>
                    <small>{isDash ? 'DASH' : 'DOT'}</small>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="visualizer-pattern-card">
            <span className="eyebrow">TRANSLATED MORSE PATTERN</span>
            <div className="visualizer-pattern">
              {phrase.map((word, index) => (
                <span key={index} className={index === activeIndex ? 'visualizer-pattern-signal active' : 'visualizer-pattern-signal'}>{signalForWord(word)}</span>
              ))}
            </div>
            <div className="visualizer-pattern-caption">UPPERCASE = DASH <i /> lowercase = DOT</div>
          </div>

          <div className="visualizer-focus">
            <span className="eyebrow">CURRENT SYLLABLE</span>
            <strong>{activeWord}</strong>
            <span className={signalForWord(activeWord ?? '') === '−' ? 'focus-signal dash' : 'focus-signal dot'}>{activeWord ? signalForWord(activeWord) : '·'}</span>
            <b>{activeWord ? signalForWord(activeWord) === '−' ? 'DASH' : 'DOT' : 'DOT'}</b>
          </div>

          <div className="visualizer-controls">
            <div className="visualizer-playback">
              <button type="button" onClick={restart} aria-label="Restart animation">↺</button>
              <button type="button" className="visualizer-play-button" onClick={startPlayback}>{isPlaying ? 'Ⅱ Pause' : '▶ Play phrase'}</button>
              <button type="button" onClick={() => step(-1)} disabled={activeIndex === 0} aria-label="Previous syllable">←</button>
              <button type="button" onClick={() => step(1)} disabled={activeIndex === phrase.length - 1} aria-label="Next syllable">→</button>
            </div>
            <label className="visualizer-speed">STEP SPEED
              <select value={speed} onChange={(event) => setSpeed(Number(event.target.value))}>
                <option value={1300}>Slow</option>
                <option value={900}>Normal</option>
                <option value={550}>Fast</option>
              </select>
            </label>
          </div>
          <div className="visualizer-progress"><span style={{ width: (((activeIndex + 1) / phrase.length) * 100) + '%' }} /></div>
          <div className="visualizer-step-count">SYLLABLE {activeIndex + 1} OF {phrase.length}</div>
        </div>
      </div>
      <div className="visualizer-legend"><span><i className="legend-dot" /> Lowercase syllable = dot (·)</span><span><i className="legend-dash" /> UPPERCASE syllable = dash (—)</span></div>
    </section>
  )
}


type PracticeMode = 'Decode' | 'Encode'
type AssessmentQuestion = { character: (typeof MORSE_CHARACTERS)[number]; choices: (typeof MORSE_CHARACTERS)[number][] }

function shuffled<T,>(items: T[]): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }
  return result
}

function makeAssessmentQuestions(): AssessmentQuestion[] {
  return shuffled(MORSE_CHARACTERS).slice(0, 10).map((character) => ({
    character,
    choices: shuffled([character, ...shuffled(MORSE_CHARACTERS.filter((item) => item.character !== character.character)).slice(0, 3)]),
  }))
}

function PracticePage() {
  const [category, setCategory] = useState<'All' | MorseCategory>('All')
  const [mode, setMode] = useState<PracticeMode>('Decode')
  const [question, setQuestion] = useState(() => shuffled(MORSE_CHARACTERS)[0])
  const [choices, setChoices] = useState(() => shuffled([question, ...shuffled(MORSE_CHARACTERS.filter((item) => item.character !== question.character)).slice(0, 3)]))
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [practiceStats, setPracticeStats] = useState<PracticeStats>(() =>
    readStoredValue('morsecodev2-practice-stats', { answered: 0, correct: 0, bestStreak: 0 }, isPracticeStats)
  )

  const pool = category === 'All' ? MORSE_CHARACTERS : MORSE_CHARACTERS.filter((item) => item.category === category)

  const createQuestion = (nextCategory = category, nextMode = mode) => {
    const nextPool = nextCategory === 'All' ? MORSE_CHARACTERS : MORSE_CHARACTERS.filter((item) => item.category === nextCategory)
    const nextCharacter = shuffled(nextPool)[0]
    const distractors = shuffled(nextPool.filter((item) => item.character !== nextCharacter.character)).slice(0, 3)
    setQuestion(nextCharacter)
    setChoices(shuffled([nextCharacter, ...distractors]))
    setAnswer('')
    setAnswered(false)
    if (nextMode !== mode) setMode(nextMode)
  }

  const selectCategory = (value: 'All' | MorseCategory) => {
    setCategory(value)
    setScore(0)
    setStreak(0)
    createQuestion(value, mode)
  }

  const selectMode = (value: PracticeMode) => {
    setScore(0)
    setStreak(0)
    createQuestion(category, value)
  }

  const submitAnswer = (value: string) => {
    if (answered) return
    setAnswer(value)
    setAnswered(true)
    const correctValue = mode === 'Decode' ? question.character : question.code
    const isCorrectAnswer = value === correctValue
    const nextStreak = isCorrectAnswer ? streak + 1 : 0
    const nextStats = {
      answered: practiceStats.answered + 1,
      correct: practiceStats.correct + (isCorrectAnswer ? 1 : 0),
      bestStreak: Math.max(practiceStats.bestStreak, nextStreak),
    }
    setPracticeStats(nextStats)
    writeStoredValue('morsecodev2-practice-stats', nextStats)
    if (isCorrectAnswer) {
      setScore((current) => current + 1)
      setStreak(nextStreak)
    } else {
      setStreak(0)
    }
  }

  const correctValue = mode === 'Decode' ? question.character : question.code
  const isCorrect = answer === correctValue
  const displayCode = (code: string) => formatMorseCode(code)

  return (
    <section className="training-page">
      <div className="sr-only" aria-live="polite" aria-atomic="true">{answered ? (isCorrect ? 'Correct answer.' : `Incorrect. The correct answer is ${mode === 'Decode' ? question.character : formatMorseCode(question.code)}.`) : ''}</div>
      <div className="training-intro">
        <div className="eyebrow">BUILD SPEED THROUGH REPETITION</div>
        <h1>Make recognition <em>second nature.</em></h1>
        <p>Practise one signal at a time. Switch between decoding Morse and encoding characters, then build a steady streak.</p>
      </div>
      <div className="training-toolbar">
        <div className="training-filter-group">
          <span className="eyebrow">CHARACTER SET</span>
          <div className="training-chips">
            {(['All', 'Letter', 'Number', 'Punctuation'] as const).map((item) => (
              <button key={item} className={category === item ? 'training-chip active' : 'training-chip'} onClick={() => selectCategory(item)}>{item === 'All' ? 'Everything' : item === 'Letter' ? 'Letters' : item === 'Number' ? 'Numbers' : 'Punctuation'}</button>
            ))}
          </div>
        </div>
        <div className="training-filter-group">
          <span className="eyebrow">PRACTICE MODE</span>
          <div className="training-chips">
            {(['Decode', 'Encode'] as const).map((item) => <button key={item} className={mode === item ? 'training-chip active' : 'training-chip'} onClick={() => selectMode(item)}>{item}</button>)}
          </div>
        </div>
      </div>
      <div className="training-stats">
        <div><span className="eyebrow">CORRECT ANSWERS</span><strong>{score}</strong></div>
        <div><span className="eyebrow">CURRENT STREAK</span><strong>{streak} <small>in a row</small></strong></div>
        <div><span className="eyebrow">AVAILABLE CHARACTERS</span><strong>{pool.length}</strong></div>
      </div>
      <div className="practice-card">
        <div className="practice-card-heading"><span className="eyebrow">{mode === 'Decode' ? 'DECODE THE SIGNAL' : 'BUILD THE SIGNAL'}</span><span className="practice-counter">PRACTICE / OPEN SESSION</span></div>
        <div className="practice-prompt">{mode === 'Decode' ? 'Which character does this pattern represent?' : 'Choose the Morse pattern for this character.'}</div>
        <div className={mode === 'Decode' ? 'practice-target code-target' : 'practice-target letter-target'}>{mode === 'Decode' ? displayCode(question.code) : question.character}</div>
        <div className="practice-options">
          {choices.map((choice) => {
            const value = mode === 'Decode' ? choice.character : choice.code
            const isSelected = answer === value
            const isAnswer = correctValue === value
            const stateClass = answered && isAnswer ? ' correct' : answered && isSelected ? ' incorrect' : ''
            return <button key={choice.character} className={'practice-option' + stateClass} disabled={answered} onClick={() => submitAnswer(value)}>{mode === 'Decode' ? choice.character : displayCode(choice.code)}</button>
          })}
        </div>
        {answered ? (
          <div className="practice-feedback">
            <p className={isCorrect ? 'feedback-correct' : 'feedback-incorrect'}>{isCorrect ? 'Correct. Nice recognition.' : 'Not quite. The correct answer is ' + (mode === 'Decode' ? question.character : displayCode(question.code)) + '.'}</p>
            <button className="lesson-primary-button" onClick={() => createQuestion()}>Next question <span>→</span></button>
          </div>
        ) : <p className="practice-hint">Choose an answer to reveal feedback. No hints are shown before you answer.</p>}
      </div>
      <div className="training-note"><strong>Training tip</strong><span>Say the rhythm out loud. For example, · − is “dit-dah”. Connect the sound and the pattern instead of memorising a picture.</span></div>
    </section>
  )
}

function AssessmentsPage() {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [answers, setAnswers] = useState<string[]>([])
  const [finished, setFinished] = useState(false)
  const [attempts, setAttempts] = useState<StoredAttempt[]>(() =>
    readStoredValue('morsecodev2-assessment-attempts', [], isAttemptHistory)
  )

  const startAssessment = () => {
    setQuestions(makeAssessmentQuestions())
    setQuestionIndex(0)
    setSelectedAnswer('')
    setAnswers([])
    setFinished(false)
  }

  const currentQuestion = questions[questionIndex]
  const score = questions.reduce((total, item, index) => total + (answers[index] === item.character.code ? 1 : 0), 0)
  const percent = questions.length ? Math.round((score / questions.length) * 100) : 0
  const bestScore = attempts.reduce((best, item) => Math.max(best, item.score), 0)

  const submitAssessment = () => {
    if (!currentQuestion || !selectedAnswer) return
    const finalAnswers = [...answers, selectedAnswer]
    const finalScore = questions.reduce((total, item, index) => total + (finalAnswers[index] === item.character.code ? 1 : 0), 0)
    const now = new Date()
    const nextAttempts = [{ date: now.toLocaleDateString(), timestamp: now.getTime(), score: finalScore, total: questions.length }, ...attempts].slice(0, 8)
    setAnswers(finalAnswers)
    setAttempts(nextAttempts)
    writeStoredValue('morsecodev2-assessment-attempts', nextAttempts)
    setFinished(true)
  }

  const nextQuestion = () => {
    if (!selectedAnswer) return
    setAnswers((current) => [...current, selectedAnswer])
    setSelectedAnswer('')
    setQuestionIndex((current) => current + 1)
  }

  return (
    <section className="training-page assessment-page">
      <div className="sr-only" aria-live="polite" aria-atomic="true">{finished ? `Assessment complete. You scored ${score} out of ${questions.length}.` : selectedAnswer ? `Answer selected for question ${questionIndex + 1} of ${questions.length}.` : ''}</div>
      <div className="training-intro">
        <div className="eyebrow">CHECK WHAT YOU CAN RECALL</div>
        <h1>Test your <em>Morse memory.</em></h1>
        <p>A focused ten-question assessment. No mnemonic phrases, no hints and no answer reveals until you submit.</p>
      </div>
      {questions.length === 0 ? (
        <div className="assessment-start-card">
          <div className="assessment-start-mark">10</div>
          <div><span className="eyebrow">THE KNOWLEDGE CHECK</span><h2>One test. Ten questions.</h2><p>Questions are drawn from letters, numbers and punctuation. Each attempt uses a fresh set of characters.</p></div>
          <button className="lesson-primary-button" onClick={startAssessment}>Begin assessment <span>→</span></button>
        </div>
      ) : finished ? (
        <div className="assessment-results">
          <div className="assessment-result-top"><span className="eyebrow">ASSESSMENT COMPLETE</span><strong>{percent}<small>%</small></strong><h2>{score} out of {questions.length} correct</h2><p>{percent >= 80 ? 'Strong recall. You are building reliable recognition.' : percent >= 60 ? 'Good progress. Review the patterns you missed and try again.' : 'Keep practising. Revisit the reference and learning lessons, then try another assessment.'}</p></div>
          <div className="assessment-review"><div className="eyebrow">ANSWER REVIEW</div>{questions.map((item, index) => { const correct = answers[index] === item.character.code; return <div className="assessment-review-row" key={item.character.character}><span className={correct ? 'review-status good' : 'review-status bad'}>{correct ? '✓' : '×'}</span><strong>{item.character.character}</strong><span>{formatMorseCode(item.character.code)}</span><small>{correct ? 'CORRECT' : 'MISSED'}</small></div> })}</div>
          <button className="lesson-primary-button" onClick={startAssessment}>Try another assessment <span>↻</span></button>
        </div>
      ) : (
        <div className="assessment-test-card">
          <div className="assessment-test-heading"><span className="eyebrow">QUESTION {questionIndex + 1} OF {questions.length}</span><span>{Math.round((questionIndex / questions.length) * 100)}% COMPLETE</span></div>
          <div className="assessment-progress"><span style={{ width: ((questionIndex / questions.length) * 100) + '%' }} /></div>
          <p className="assessment-question-prompt">Which Morse pattern belongs to this character?</p>
          <strong className="assessment-character">{currentQuestion.character.character}</strong>
          <div className="assessment-options">{currentQuestion.choices.map((choice) => <button key={choice.character} className={selectedAnswer === choice.code ? 'assessment-option selected' : 'assessment-option'} onClick={() => setSelectedAnswer(choice.code)}>{formatMorseCode(choice.code)}</button>)}</div>
          <div className="assessment-test-footer"><span>{selectedAnswer ? 'Answer recorded. You can still change it.' : 'Select one answer to continue.'}</span>{questionIndex < questions.length - 1 ? <button className="lesson-primary-button" disabled={!selectedAnswer} onClick={nextQuestion}>Next question <span>→</span></button> : <button className="lesson-primary-button" disabled={!selectedAnswer} onClick={submitAssessment}>Submit assessment <span>✓</span></button>}</div>
        </div>
      )}
      <div className="assessment-history">
        <div className="assessment-history-heading"><span className="eyebrow">YOUR RECENT ATTEMPTS</span><strong>Best score: {attempts.length ? bestScore + ' / 10' : '—'}</strong></div>
        {attempts.length ? attempts.slice(0, 5).map((attempt, index) => <div className="assessment-history-row" key={index}><span>Attempt {attempts.length - index}</span><span>{attempt.date}</span><strong>{attempt.score} / {attempt.total}</strong></div>) : <p>No attempts yet. Your results will appear here after your first assessment.</p>}
      </div>
    </section>
  )
}


type ListeningQuestion = { character: (typeof MORSE_CHARACTERS)[number]; choices: (typeof MORSE_CHARACTERS)[number][] }


function createListeningQuestion(): ListeningQuestion {
  const character = shuffled(MORSE_CHARACTERS)[0]
  const alternatives = shuffled(MORSE_CHARACTERS.filter((item) => item.character !== character.character)).slice(0, 3)
  return { character, choices: shuffled([character, ...alternatives]) }
}

function playMorseAudio(code: string, context: AudioContext, unitMs: number, frequency: number) {
  const unit = unitMs / 1000
  let cursor = context.currentTime + 0.035
  const oscillators: OscillatorNode[] = []
  code.split('').forEach((signal) => {
    const duration = signal === '.' ? unit : unit * 3
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequency, cursor)
    gain.gain.setValueAtTime(0, cursor)
    gain.gain.linearRampToValueAtTime(0.16, cursor + 0.008)
    gain.gain.setValueAtTime(0.16, cursor + Math.max(0.012, duration - 0.008))
    gain.gain.linearRampToValueAtTime(0, cursor + duration)
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(cursor)
    oscillator.stop(cursor + duration + 0.01)
    oscillators.push(oscillator)
    cursor += duration + unit
  })
  return { duration: Math.max(0, (cursor - context.currentTime) * 1000), oscillators }
}

function ListeningPage() {
  const [selectedCharacter, setSelectedCharacter] = useState(MORSE_CHARACTERS[0].character)
  const [speed, setSpeed] = useState(10)
  const [frequency, setFrequency] = useState(650)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const activeOscillatorsRef = useRef<OscillatorNode[]>([])
  const playbackTimerRef = useRef<number | null>(null)
  const [question, setQuestion] = useState<ListeningQuestion>(() => createListeningQuestion())
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [answered, setAnswered] = useState(false)
  const [questionNumber, setQuestionNumber] = useState(1)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [roundComplete, setRoundComplete] = useState(false)
  const [attempts, setAttempts] = useState<StoredAttempt[]>(() =>
    readStoredValue('morsecodev2-listening-attempts', [], isAttemptHistory)
  )

  const unitMs = 1200 / speed
  const selected = MORSE_CHARACTERS.find((item) => item.character === selectedCharacter) ?? MORSE_CHARACTERS[0]
  const codeText = (code: string) => formatMorseCode(code)

  const playCode = async (code: string) => {
    const context = audioContextRef.current ?? new AudioContext()
    audioContextRef.current = context
    await context.resume()
    if (playbackTimerRef.current !== null) window.clearTimeout(playbackTimerRef.current)
    activeOscillatorsRef.current.forEach((oscillator) => {
      try { oscillator.stop() } catch { /* It may already have stopped. */ }
    })
    activeOscillatorsRef.current = []
    setIsPlaying(true)
    const playback = playMorseAudio(code, context, unitMs, frequency)
    activeOscillatorsRef.current = playback.oscillators
    playbackTimerRef.current = window.setTimeout(() => {
      setIsPlaying(false)
      activeOscillatorsRef.current = []
    }, playback.duration)
  }

  useEffect(() => () => {
    if (playbackTimerRef.current !== null) window.clearTimeout(playbackTimerRef.current)
    activeOscillatorsRef.current.forEach((oscillator) => {
      try { oscillator.stop() } catch { /* It may already have stopped. */ }
    })
    activeOscillatorsRef.current = []
    void audioContextRef.current?.close()
    audioContextRef.current = null
  }, [])

  const chooseAnswer = (character: string) => {
    if (answered || roundComplete) return
    setSelectedAnswer(character)
    setAnswered(true)
    if (character === question.character.character) setScore((current) => current + 1)
    setStreak((current) => character === question.character.character ? current + 1 : 0)
  }

  const nextQuestion = () => {
    if (!answered) return
    if (questionNumber === 10) {
      const finalScore = score
      const now = new Date()
      const nextAttempts = [{ date: now.toLocaleDateString(), timestamp: now.getTime(), score: finalScore, total: 10 }, ...attempts].slice(0, 8)
      setAttempts(nextAttempts)
      writeStoredValue('morsecodev2-listening-attempts', nextAttempts)
      setRoundComplete(true)
      return
    }
    setQuestion(createListeningQuestion())
    setQuestionNumber((current) => current + 1)
    setSelectedAnswer('')
    setAnswered(false)
  }

  const restartRound = () => {
    setQuestion(createListeningQuestion())
    setQuestionNumber(1)
    setSelectedAnswer('')
    setAnswered(false)
    setScore(0)
    setStreak(0)
    setRoundComplete(false)
  }

  const bestScore = attempts.reduce((best, item) => Math.max(best, item.score), 0)

  return (
    <section className="listening-page">
      <div className="sr-only" aria-live="polite" aria-atomic="true">{roundComplete ? `Listening round complete. You scored ${score} out of 10.` : answered ? (selectedAnswer === question.character.character ? `Correct recognition. ${question.character.character}.` : `Incorrect. The answer is ${question.character.character}.`) : ''}</div>
      <div className="training-intro">
        <div className="eyebrow">TRAIN YOUR EAR, NOT YOUR EYES</div>
        <h1>Hear the signal. <em>Know the code.</em></h1>
        <p>Listen to the tone, recognise its rhythm and identify the character. The pattern stays hidden until you answer.</p>
      </div>

      <div className="listening-settings">
        <label><span className="eyebrow">PLAYBACK SPEED</span><select value={speed} onChange={(event) => setSpeed(Number(event.target.value))}><option value={5}>5 WPM · Very slow</option><option value={10}>10 WPM · Slow</option><option value={15}>15 WPM · Normal</option><option value={20}>20 WPM · Fast</option></select></label>
        <label><span className="eyebrow">TONE FREQUENCY</span><select value={frequency} onChange={(event) => setFrequency(Number(event.target.value))}><option value={500}>500 Hz · Low</option><option value={650}>650 Hz · Standard</option><option value={800}>800 Hz · High</option></select></label>
        <div className="listening-timing"><span className="eyebrow">DOT LENGTH</span><strong>{Math.round(unitMs)} ms</strong></div>
      </div>

      <div className="listening-player">
        <div className="listening-section-title"><span className="eyebrow">MORSE SOUND PLAYER</span><span>LEARN THE RHYTHM</span></div>
        <h2>Choose a character to hear</h2>
        <div className="listening-player-controls">
          <select aria-label="Choose a character to play" value={selectedCharacter} onChange={(event) => setSelectedCharacter(event.target.value)}>{MORSE_CHARACTERS.map((item) => <option key={item.character} value={item.character}>{item.character} — {item.name}</option>)}</select>
          <button className="lesson-primary-button" onClick={() => void playCode(selected.code)}>{isPlaying ? '▶ Play again' : '▶ Play signal'}</button>
        </div>
        <div className="listening-reference-reveal"><span>SELECTED CHARACTER</span><strong>{selected.character}</strong><b>{codeText(selected.code)}</b></div>
        <p className="listening-player-note">This player shows the pattern so you can study the sound. The challenge below hides it.</p>
      </div>

      <div className="listening-challenge">
        <div className="listening-challenge-heading"><div><span className="eyebrow">AUDIO RECOGNITION CHALLENGE</span><h2>Can you identify the signal?</h2></div><span className="listening-round-count">{roundComplete ? 'ROUND COMPLETE' : 'QUESTION ' + questionNumber + ' / 10'}</span></div>
        {!roundComplete ? (
          <>
            <div className="listening-score-strip"><span>Correct <strong>{score}</strong></span><span>Streak <strong>{streak}</strong></span><span>Speed <strong>{speed} WPM</strong></span></div>
            <div className="listening-audio-prompt">
              <div className={isPlaying ? 'listening-wave active' : 'listening-wave'} aria-hidden="true">{Array.from({ length: 25 }, (_, index) => <i key={index} style={{ height: (12 + ((index * 17 + questionNumber * 7) % 29)) + 'px' }} />)}</div>
              <button className="listening-replay-button" onClick={() => void playCode(question.character.code)}>{isPlaying ? '▶ Replay tone' : '▶ Listen to the signal'}</button>
              <span className="listening-hidden-note">THE MORSE PATTERN IS HIDDEN</span>
            </div>
            <div className="listening-answer-grid">{question.choices.map((choice) => {
              const correct = choice.character === question.character.character
              const chosen = selectedAnswer === choice.character
              const state = answered && correct ? ' correct' : answered && chosen ? ' incorrect' : ''
              return <button key={choice.character} className={'listening-answer' + state} disabled={answered} onClick={() => chooseAnswer(choice.character)}>{choice.character}</button>
            })}</div>
            {answered ? <div className="listening-feedback"><div><strong className={selectedAnswer === question.character.character ? 'feedback-correct' : 'feedback-incorrect'}>{selectedAnswer === question.character.character ? 'Correct recognition.' : 'Not quite. The answer is ' + question.character.character + '.'}</strong><span>Its Morse pattern: {codeText(question.character.code)}</span></div><button className="lesson-primary-button" onClick={nextQuestion}>{questionNumber === 10 ? 'Finish round' : 'Next signal'} <span>→</span></button></div> : <p className="listening-instruction">Listen as many times as you need, then choose the character. The answer and pattern will appear after your choice.</p>}
          </>
        ) : (
          <div className="listening-round-result"><span className="eyebrow">YOUR LISTENING SCORE</span><strong>{score}<small> / 10</small></strong><h3>{score >= 8 ? 'Excellent listening.' : score >= 6 ? 'Good progress.' : 'Keep training your ear.'}</h3><p>{score >= 8 ? 'You are recognising the rhythm with confidence.' : 'Try a slower speed, listen carefully to each tone, and give it another round.'}</p><button className="lesson-primary-button" onClick={restartRound}>Start another round <span>↻</span></button></div>
        )}
      </div>

      <div className="listening-history"><div className="assessment-history-heading"><span className="eyebrow">RECENT LISTENING ROUNDS</span><strong>Best score: {attempts.length ? bestScore + ' / 10' : '—'}</strong></div>{attempts.length ? attempts.slice(0, 5).map((attempt, index) => <div className="assessment-history-row" key={index}><span>Round {attempts.length - index}</span><span>{attempt.date}</span><strong>{attempt.score} / {attempt.total}</strong></div>) : <p>No completed listening rounds yet.</p>}</div>
    </section>
  )
}



function readProgressData<T,>(key: string, fallback: T, validate: (value: unknown) => value is T): T {
  return readStoredValue(key, fallback, validate)
}

function ProgressPage({ onContinue }: { onContinue: (lessonIndex: number) => void }) {
  const [completedLessons] = useState<number[]>(() => readProgressData('morsecodev2-completed-lessons', [], isCompletedLessons))
  const [practiceStats] = useState(() => readProgressData('morsecodev2-practice-stats', { answered: 0, correct: 0, bestStreak: 0 }, isPracticeStats))
  const [assessmentAttempts] = useState<StoredAttempt[]>(() => readProgressData('morsecodev2-assessment-attempts', [], isAttemptHistory))
  const [listeningAttempts] = useState<StoredAttempt[]>(() => readProgressData('morsecodev2-listening-attempts', [], isAttemptHistory))

  const lessonPercent = Math.round((completedLessons.length / LETTER_LESSONS.length) * 100)
  const practiceAccuracy = practiceStats.answered ? Math.round((practiceStats.correct / practiceStats.answered) * 100) : 0
  const assessmentQuestions = assessmentAttempts.reduce((sum, attempt) => sum + attempt.total, 0)
  const assessmentCorrect = assessmentAttempts.reduce((sum, attempt) => sum + attempt.score, 0)
  const assessmentAccuracy = assessmentQuestions ? Math.round((assessmentCorrect / assessmentQuestions) * 100) : 0
  const listeningQuestions = listeningAttempts.reduce((sum, attempt) => sum + attempt.total, 0)
  const listeningCorrect = listeningAttempts.reduce((sum, attempt) => sum + attempt.score, 0)
  const listeningAccuracy = listeningQuestions ? Math.round((listeningCorrect / listeningQuestions) * 100) : 0
  const totalQuestions = practiceStats.answered + assessmentQuestions + listeningQuestions
  const totalCorrect = practiceStats.correct + assessmentCorrect + listeningCorrect
  const overallAccuracy = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0
  const nextLesson = LETTER_LESSONS.find((lesson) => !completedLessons.includes(lesson.id))
  const activity = [
    ...assessmentAttempts.map((attempt) => ({ ...attempt, kind: 'Assessment' })),
    ...listeningAttempts.map((attempt) => ({ ...attempt, kind: 'Listening' })),
  ].sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0)).slice(0, 6)

  return (
    <section className="progress-page">
      <div className="training-intro">
        <div className="eyebrow">YOUR PERSONAL LEARNING RECORD</div>
        <h1>Progress with <em>purpose.</em></h1>
        <p>See what you have learned, how accurately you recognise Morse, and where to focus next. Your records are stored in this browser.</p>
      </div>
      <div className="progress-overview-grid">
        <article className="progress-stat-card"><span className="eyebrow">OVERALL ACCURACY</span><strong>{overallAccuracy}<small>%</small></strong><span>{totalQuestions} answers recorded</span></article>
        <article className="progress-stat-card"><span className="eyebrow">LESSONS COMPLETED</span><strong>{completedLessons.length}<small> / {LETTER_LESSONS.length}</small></strong><span>{lessonPercent}% of the course</span></article>
        <article className="progress-stat-card"><span className="eyebrow">PRACTICE STREAK</span><strong>{practiceStats.bestStreak}</strong><span>Best consecutive correct answers</span></article>
      </div>
      <div className="progress-main-grid">
        <div className="progress-panel">
          <div className="progress-panel-heading"><div><span className="eyebrow">COURSE COMPLETION</span><h2>Your learning path</h2></div><strong>{lessonPercent}%</strong></div>
          <div className="progress-large-track"><span style={{ width: lessonPercent + '%' }} /></div>
          <div className="progress-lesson-list">{LETTER_LESSONS.map((lesson) => {
            const done = completedLessons.includes(lesson.id)
            return <div className="progress-lesson-row" key={lesson.id}><span className={done ? 'progress-check done' : 'progress-check'}>{done ? '✓' : String(lesson.id).padStart(2, '0')}</span><div><strong>{lesson.title}</strong><small>{lesson.letters.join(' · ')}</small></div><span className={done ? 'progress-state complete' : 'progress-state'}>{done ? 'COMPLETE' : 'UP NEXT'}</span></div>
          })}</div>
        </div>
        <div className="progress-panel progress-skills-panel">
          <span className="eyebrow">SKILL BREAKDOWN</span><h2>How you're doing</h2>
          <div className="progress-skill"><div><span>Quick practice</span><strong>{practiceAccuracy}%</strong></div><div className="progress-skill-track"><span style={{ width: practiceAccuracy + '%' }} /></div><small>{practiceStats.correct} correct of {practiceStats.answered} answers</small></div>
          <div className="progress-skill"><div><span>Assessments</span><strong>{assessmentAccuracy}%</strong></div><div className="progress-skill-track"><span style={{ width: assessmentAccuracy + '%' }} /></div><small>{assessmentAttempts.length} completed {assessmentAttempts.length === 1 ? 'test' : 'tests'}</small></div>
          <div className="progress-skill"><div><span>Listening</span><strong>{listeningAccuracy}%</strong></div><div className="progress-skill-track"><span style={{ width: listeningAccuracy + '%' }} /></div><small>{listeningAttempts.length} completed {listeningAttempts.length === 1 ? 'round' : 'rounds'}</small></div>
        </div>
      </div>
      <div className="progress-bottom-grid">
        <div className="progress-panel progress-next-panel"><span className="eyebrow">YOUR NEXT STEP</span><h2>{nextLesson ? nextLesson.title : 'The alphabet is complete.'}</h2><p>{nextLesson ? nextLesson.focus : 'You have completed all seven guided letter lessons. Keep your skills sharp with practice and listening challenges.'}</p><button className="lesson-primary-button" onClick={() => onContinue(Math.max(0, LETTER_LESSONS.findIndex((lesson) => !completedLessons.includes(lesson.id))))}>Continue learning <span>→</span></button></div>
        <div className="progress-panel"><div className="progress-panel-heading"><div><span className="eyebrow">RECENT ACTIVITY</span><h2>Latest sessions</h2></div></div>{activity.length ? activity.map((attempt,index) => <div className="progress-activity-row" key={attempt.kind + index}><span>{attempt.kind}</span><small>{attempt.date}</small><strong>{attempt.score}/{attempt.total}</strong></div>) : <p className="progress-empty">Your completed assessments and listening rounds will appear here.</p>}</div>
      </div>
      <p className="progress-storage-note">Progress is saved locally in this browser. Clearing browser data or using another device may reset or separate these records.</p>
    </section>
  )
}

function App() {
  const [activePage, setActivePage] = useState<Page>('Overview')
  const [menuOpen, setMenuOpen] = useState(false)
  const [learnStartIndex, setLearnStartIndex] = useState(0)

  const selectPage = (page: Page) => {
    setActivePage(page)
    setMenuOpen(false)
  }

  const getResumeLessonIndex = () => {
    const completed = readStoredValue('morsecodev2-completed-lessons', [], isCompletedLessons)
    const nextIndex = LETTER_LESSONS.findIndex((lesson) => !completed.includes(lesson.id))
    return nextIndex === -1 ? LETTER_LESSONS.length - 1 : nextIndex
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
              onClick={() => {
                if (item.label === 'Learn') setLearnStartIndex(getResumeLessonIndex())
                selectPage(item.label)
              }}
              aria-current={activePage === item.label ? 'page' : undefined}
            >
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
              {item.label === 'Morse Visualizer' && <span className="nav-new">TOOL</span>}{item.label === 'Assessments' && <span className="nav-new">TEST</span>}{item.label === 'Listening' && <span className="nav-new">AUDIO</span>}
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
                <button className="feature-card learn-card" onClick={() => { setLearnStartIndex(getResumeLessonIndex()); selectPage('Learn') }}>
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
          ) : activePage === 'Learn' ? (
            <LearnPage key={learnStartIndex} initialLessonIndex={learnStartIndex} />
          ) : activePage === 'Practice' ? (
            <PracticePage />
          ) : activePage === 'Listening' ? (
            <ListeningPage />
          ) : activePage === 'Assessments' ? (
            <AssessmentsPage />
          ) : activePage === 'Progress' ? (
            <ProgressPage onContinue={(index) => { setLearnStartIndex(index); selectPage('Learn') }} />
          ) : activePage === 'Morse Visualizer' ? (
            <MorseVisualizerPage />
          ) : (
            <section className="placeholder-page">
              <div className="eyebrow">MORSECODE LEARNING STUDIO</div>
              <h1>{activePage}<em>.</em></h1>
              <p>This section is part of the learning studio. Choose a learning activity from the workspace to continue.</p>
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
