export type LetterLesson = {
  id: number
  title: string
  focus: string
  letters: string[]
}

export const LETTER_LESSONS: LetterLesson[] = [
  { id: 1, title: 'First signals', focus: 'Meet the shortest and longest signals, then learn two simple characters.', letters: ['E', 'T'] },
  { id: 2, title: 'Two-beat patterns', focus: 'Recognise patterns made from two short or long signals.', letters: ['I', 'M', 'A', 'N'] },
  { id: 3, title: 'Three-beat patterns', focus: 'Build confidence with familiar three-signal rhythms.', letters: ['S', 'O', 'R', 'K'] },
  { id: 4, title: 'Mixing the rhythm', focus: 'Notice how changing the order of dots and dashes changes a letter.', letters: ['D', 'U', 'G', 'W'] },
  { id: 5, title: 'Four-signal patterns', focus: 'Learn longer patterns without rushing the sequence.', letters: ['H', 'V', 'F', 'L'] },
  { id: 6, title: 'Distinctive patterns', focus: 'Separate patterns that can look similar at first glance.', letters: ['P', 'J', 'B', 'X'] },
  { id: 7, title: 'Complete the alphabet', focus: 'Finish the alphabet with the remaining four-signal patterns.', letters: ['C', 'Y', 'Z', 'Q'] },
]
