export type MorseCategory = 'Letter' | 'Number' | 'Punctuation'

export type MorseCharacter = {
  character: string
  code: string
  category: MorseCategory
  name: string
}

export const MORSE_CHARACTERS: MorseCharacter[] = [
  // Letters
  { character: 'A', code: '.-', category: 'Letter', name: 'A' },
  { character: 'B', code: '-...', category: 'Letter', name: 'B' },
  { character: 'C', code: '-.-.', category: 'Letter', name: 'C' },
  { character: 'D', code: '-..', category: 'Letter', name: 'D' },
  { character: 'E', code: '.', category: 'Letter', name: 'E' },
  { character: 'F', code: '..-.', category: 'Letter', name: 'F' },
  { character: 'G', code: '--.', category: 'Letter', name: 'G' },
  { character: 'H', code: '....', category: 'Letter', name: 'H' },
  { character: 'I', code: '..', category: 'Letter', name: 'I' },
  { character: 'J', code: '.---', category: 'Letter', name: 'J' },
  { character: 'K', code: '-.-', category: 'Letter', name: 'K' },
  { character: 'L', code: '.-..', category: 'Letter', name: 'L' },
  { character: 'M', code: '--', category: 'Letter', name: 'M' },
  { character: 'N', code: '-.', category: 'Letter', name: 'N' },
  { character: 'O', code: '---', category: 'Letter', name: 'O' },
  { character: 'P', code: '.--.', category: 'Letter', name: 'P' },
  { character: 'Q', code: '--.-', category: 'Letter', name: 'Q' },
  { character: 'R', code: '.-.', category: 'Letter', name: 'R' },
  { character: 'S', code: '...', category: 'Letter', name: 'S' },
  { character: 'T', code: '-', category: 'Letter', name: 'T' },
  { character: 'U', code: '..-', category: 'Letter', name: 'U' },
  { character: 'V', code: '...-', category: 'Letter', name: 'V' },
  { character: 'W', code: '.--', category: 'Letter', name: 'W' },
  { character: 'X', code: '-..-', category: 'Letter', name: 'X' },
  { character: 'Y', code: '-.--', category: 'Letter', name: 'Y' },
  { character: 'Z', code: '--..', category: 'Letter', name: 'Z' },

  // Numbers
  { character: '0', code: '-----', category: 'Number', name: 'Zero' },
  { character: '1', code: '.----', category: 'Number', name: 'One' },
  { character: '2', code: '..---', category: 'Number', name: 'Two' },
  { character: '3', code: '...--', category: 'Number', name: 'Three' },
  { character: '4', code: '....-', category: 'Number', name: 'Four' },
  { character: '5', code: '.....', category: 'Number', name: 'Five' },
  { character: '6', code: '-....', category: 'Number', name: 'Six' },
  { character: '7', code: '--...', category: 'Number', name: 'Seven' },
  { character: '8', code: '---..', category: 'Number', name: 'Eight' },
  { character: '9', code: '----.', category: 'Number', name: 'Nine' },

  // Common punctuation
  { character: '.', code: '.-.-.-', category: 'Punctuation', name: 'Full stop' },
  { character: ',', code: '--..--', category: 'Punctuation', name: 'Comma' },
  { character: '?', code: '..--..', category: 'Punctuation', name: 'Question mark' },
  { character: "'", code: '.----.', category: 'Punctuation', name: 'Apostrophe' },
  { character: '!', code: '-.-.--', category: 'Punctuation', name: 'Exclamation mark' },
  { character: '/', code: '-..-.', category: 'Punctuation', name: 'Slash' },
  { character: '(', code: '-.--.', category: 'Punctuation', name: 'Opening parenthesis' },
  { character: ')', code: '-.--.-', category: 'Punctuation', name: 'Closing parenthesis' },
  { character: '&', code: '.-...', category: 'Punctuation', name: 'Ampersand' },
  { character: ':', code: '---...', category: 'Punctuation', name: 'Colon' },
  { character: ';', code: '-.-.-.', category: 'Punctuation', name: 'Semicolon' },
  { character: '=', code: '-...-', category: 'Punctuation', name: 'Equals sign' },
  { character: '+', code: '.-.-.', category: 'Punctuation', name: 'Plus sign' },
  { character: '-', code: '-....-', category: 'Punctuation', name: 'Hyphen' },
  { character: '_', code: '..--.-', category: 'Punctuation', name: 'Underscore' },
  { character: '"', code: '.-..-.', category: 'Punctuation', name: 'Quotation mark' },
  { character: '$', code: '...-..-', category: 'Punctuation', name: 'Dollar sign' },
  { character: '@', code: '.--.-.', category: 'Punctuation', name: 'At sign' },
]
