export interface Book {
  isbn: string
  title: string
  author: string
  description: string
  personalNote?: string
  spineColor: string
  accentColor: string
  thickness?: number
}

export function getCoverUrl(isbn: string, size: 'S' | 'M' | 'L' = 'L'): string {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`
}

export const books: Book[] = [
  {
    isbn: '9780743273565',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description:
      'A portrait of the Jazz Age in all of its decadence and excess. Gatsby, the mysterious millionaire, throws lavish parties to win back a lost love.',
    personalNote:
      'The green light at the end of the dock is one of the most powerful symbols in American literature. Fitzgerald captures ambition and longing in a way that still resonates.',
    spineColor: '#2D5F3E',
    accentColor: '#3A7D52',
    thickness: 0.7,
  },
  {
    isbn: '9780061120084',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description:
      'Through the eyes of Scout Finch, a small Southern town confronts deep-seated prejudice when her father defends a Black man accused of a crime he didn\'t commit.',
    spineColor: '#8B4513',
    accentColor: '#A0522D',
    thickness: 0.9,
  },
  {
    isbn: '9780399590528',
    title: 'Educated',
    author: 'Tara Westover',
    description:
      'A memoir about a woman who grows up in a survivalist family in Idaho and, through self-education, earns a PhD from Cambridge. A story about the transformative power of learning.',
    personalNote:
      'This book reframed how I think about the relationship between identity and education. Westover\'s resilience is extraordinary.',
    spineColor: '#1B3A5C',
    accentColor: '#2A5A8C',
    thickness: 1.1,
  },
  {
    isbn: '9780062316110',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    description:
      'A sweeping history of humankind from the Stone Age to the present, exploring how biology and history have defined what it means to be human.',
    spineColor: '#C2553A',
    accentColor: '#D4694F',
    thickness: 1.3,
  },
  {
    isbn: '9780812981605',
    title: 'The Sixth Extinction',
    author: 'Elizabeth Kolbert',
    description:
      'An investigation into the current mass extinction event, weaving field reporting with the science of extinction to paint a vivid picture of life on earth at a crossroads.',
    spineColor: '#4A6741',
    accentColor: '#5C8253',
    thickness: 1.0,
  },
  {
    isbn: '9780374533557',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    description:
      'Nobel laureate Kahneman maps the two systems that drive the way we think: the fast, intuitive system and the slow, deliberate one. A foundational text on decision-making.',
    personalNote:
      'Changed how I approach design decisions. The distinction between System 1 and System 2 thinking is something I reference constantly.',
    spineColor: '#E8A83E',
    accentColor: '#F0BC5E',
    thickness: 1.4,
  },
  {
    isbn: '9780143127741',
    title: 'The Wright Brothers',
    author: 'David McCullough',
    description:
      'The dramatic story of two brothers who taught the world how to fly. McCullough brings their determination and ingenuity to life with his signature narrative craft.',
    spineColor: '#6B3A5D',
    accentColor: '#8A4D78',
    thickness: 0.9,
  },
  {
    isbn: '9780679720201',
    title: 'Invisible Man',
    author: 'Ralph Ellison',
    description:
      'A nameless narrator traces his journey from the rural South to Harlem, grappling with identity, race, and invisibility in American society. A landmark of American fiction.',
    personalNote:
      'Ellison captures something about navigating spaces where you\'re seen but not recognized. This one stays with you.',
    spineColor: '#2C2C2C',
    accentColor: '#404040',
    thickness: 1.2,
  },
]
