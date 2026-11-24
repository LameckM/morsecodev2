# Morse Code Learning Studio

A browser-based learning environment for studying International Morse Code through guided lessons, active recall, practice, listening exercises, assessments, and progress tracking.

## Features

- **Guided lessons:** Learn the alphabet in seven progressive groups, with memory phrases and recall checks.
- **Morse visualizer:** Explore mnemonic patterns and hear their dot-and-dash rhythm.
- **Practice:** Switch between decoding Morse signals and encoding characters, with letter, number, and punctuation filters.
- **Listening:** Identify characters from audio signals with adjustable playback speed and tone frequency.
- **Assessments:** Complete ten-question tests and review your answers.
- **Reference library:** Search the International Morse Code character set.
- **Progress dashboard:** Review lesson completion, practice accuracy, assessment results, and listening performance.

## Tech stack

- React 19
- TypeScript
- Vite
- Oxlint
- Web Audio API

## Requirements

- Node.js (current LTS recommended)
- npm

## Getting started

Clone the repository and install its dependencies:

```bash
git clone https://github.com/LameckM/morsecodev2.git
cd morsecodev2
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will print the local development URL in the terminal.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Type-check and create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |

Before submitting changes, run:

```bash
npm run build
npm run lint
```

## Progress and browser storage

Learning progress and activity are stored in the browser's local storage. The app currently uses these keys:

- `morsecodev2-completed-lessons`
- `morsecodev2-practice-stats`
- `morsecodev2-assessment-attempts`
- `morsecodev2-listening-attempts`

This means progress is local to the browser and device. It is not synced between browsers or devices. Clearing site data may remove saved progress.

## Project structure

```text
src/
  data/
    lessons.ts
    mnemonics.ts
    morseCode.ts
  App.tsx
  App.css
  index.css
  main.tsx
index.html
package.json
```

## Morse code conventions

The reference and training activities use International Morse Code. In the mnemonic lessons, uppercase words represent dashes and lowercase words represent dots. The visualizer and audio activities help connect those memory cues to the corresponding signals.

## License

No license has been specified for this repository yet. Contact the repository owner before redistributing or reusing the project.
