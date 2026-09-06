export type SpineTexture = 'linen' | 'leather' | 'woven' | 'ribbed' | 'brushed' | 'matte'

export interface Book {
  isbn: string
  title: string
  author: string
  description: string
  personalNote?: string
  spineColor: string
  accentColor: string
  thickness?: number
  texture?: SpineTexture
}

export function getCoverUrl(isbn: string, size: 'S' | 'M' | 'L' = 'L'): string {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`
}

/** SVG noise grain — unique per book via seed */
export function getNoiseBg(isbn: string): string {
  const seed = parseInt(isbn.slice(-4), 10) || 42
  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' seed='${seed}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`
}

/** CSS background for each spine texture — layered over the solid spineColor */
export function getTextureCSS(texture: SpineTexture): string {
  switch (texture) {
    case 'linen':
      return [
        'repeating-linear-gradient(0deg, transparent, transparent 1.5px, rgba(255,255,255,0.04) 1.5px, rgba(255,255,255,0.04) 3px)',
        'repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(0,0,0,0.02) 8px, rgba(0,0,0,0.02) 9px)',
      ].join(', ')
    case 'leather':
      return [
        'radial-gradient(ellipse 3px 2px at 20% 30%, rgba(255,255,255,0.05) 0%, transparent 100%)',
        'radial-gradient(ellipse 2px 3px at 70% 60%, rgba(0,0,0,0.06) 0%, transparent 100%)',
        'radial-gradient(ellipse 4px 2px at 45% 80%, rgba(255,255,255,0.03) 0%, transparent 100%)',
        'radial-gradient(ellipse 2px 4px at 85% 15%, rgba(0,0,0,0.04) 0%, transparent 100%)',
      ].join(', ')
    case 'woven':
      return [
        'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.035) 2px, rgba(255,255,255,0.035) 3.5px)',
        'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.035) 2px, rgba(255,255,255,0.035) 3.5px)',
      ].join(', ')
    case 'ribbed':
      return 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(255,255,255,0.05) 4px, rgba(255,255,255,0.05) 5.5px)'
    case 'brushed':
      return [
        'repeating-linear-gradient(135deg, transparent, transparent 1px, rgba(255,255,255,0.03) 1px, rgba(255,255,255,0.03) 2.5px)',
        'repeating-linear-gradient(135deg, transparent, transparent 5px, rgba(0,0,0,0.02) 5px, rgba(0,0,0,0.02) 7px)',
      ].join(', ')
    case 'matte':
      return [
        'repeating-linear-gradient(160deg, transparent, transparent 3px, rgba(255,255,255,0.02) 3px, rgba(255,255,255,0.02) 4px)',
        'repeating-linear-gradient(70deg, transparent, transparent 5px, rgba(0,0,0,0.015) 5px, rgba(0,0,0,0.015) 6px)',
      ].join(', ')
  }
}

export const books: Book[] = [
  // ── 1. Sync ────────────────────────────────────────────────────
  {
    isbn: '9780786868445',
    title: 'Sync',
    author: 'Steven Strogatz',
    description:
      'Explores how order emerges spontaneously across nature, from fireflies flashing in unison to cardiac pacemakers and superconductors. A mathematical tour of how synchrony arises without any central conductor.',
    spineColor: '#0B1A3B',
    accentColor: '#3ABFBF',
    thickness: 1.0,
    texture: 'ribbed',
  },
  // ── 2. Crying in H Mart ────────────────────────────────────────
  {
    isbn: '9780525657743',
    title: 'Crying in H Mart',
    author: 'Michelle Zauner',
    description:
      'A memoir about grief, Korean-American identity, and the way food carries the memory of those we\'ve lost. Zauner traces her mother\'s death and her own recovery through the aisles of H Mart.',
    spineColor: '#B82A2A',
    accentColor: '#E8604A',
    thickness: 0.85,
    texture: 'brushed',
  },
  // ── 3. Tomorrow, and Tomorrow, and Tomorrow ────────────────────
  {
    isbn: '9780593321201',
    title: 'Tomorrow, and Tomorrow, and Tomorrow',
    author: 'Gabrielle Zevin',
    description:
      'Two friends become creative partners building video games over decades, navigating love, ambition, and loss. A novel about making things and what it costs.',
    spineColor: '#1A2D5A',
    accentColor: '#7B8FC7',
    thickness: 1.15,
    texture: 'woven',
  },
  // ── 4. Bad Blood ───────────────────────────────────────────────
  {
    isbn: '9781524731656',
    title: 'Bad Blood',
    author: 'John Carreyrou',
    description:
      'The definitive account of Theranos and Elizabeth Holmes, how a Silicon Valley startup defrauded investors and endangered patients through years of deliberate deception.',
    spineColor: '#1A1A1A',
    accentColor: '#B8002A',
    thickness: 1.0,
    texture: 'matte',
  },
  // ── 5. The Silent Patient ──────────────────────────────────────
  {
    isbn: '9781250301697',
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    description:
      'A famous painter shoots her husband and never speaks again. A criminal psychotherapist becomes obsessed with uncovering her motive. A psychological thriller with a devastating twist.',
    spineColor: '#6B5D45',
    accentColor: '#D4B896',
    thickness: 0.95,
    texture: 'brushed',
  },
  // ── 6. Far from the Tree ───────────────────────────────────────
  {
    isbn: '9780743236720',
    title: 'Far from the Tree',
    author: 'Andrew Solomon',
    description:
      'A paradigm-shifting work exploring how families navigate children who are radically different from their parents, across deafness, autism, dwarfism, prodigy, and more.',
    spineColor: '#111111',
    accentColor: '#C8D4CC',
    thickness: 1.5,
    texture: 'linen',
  },
  // ── 7. Children of Time ────────────────────────────────────────
  {
    isbn: '9780316452502',
    title: 'Children of Time',
    author: 'Adrian Tchaikovsky',
    description:
      'On a terraformed planet, an uplifted spider civilization rises to sentience across millennia while the last remnants of humanity search for a new home. An epic about consciousness and evolution.',
    spineColor: '#0D2B2B',
    accentColor: '#4DB89E',
    thickness: 1.35,
    texture: 'ribbed',
  },
  // ── 8. Creativity, Inc. ────────────────────────────────────────
  {
    isbn: '9780812993011',
    title: 'Creativity, Inc.',
    author: 'Ed Catmull',
    description:
      'Pixar\'s co-founder traces the management philosophy that made Pixar a creative institution, about building cultures where creativity survives commercial pressure.',
    spineColor: '#1B6BA0',
    accentColor: '#5BAFD6',
    thickness: 1.05,
    texture: 'woven',
  },
  // ── 9. Lessons in Chemistry ────────────────────────────────────
  {
    isbn: '9780385547345',
    title: 'Lessons in Chemistry',
    author: 'Bonnie Garmus',
    description:
      'In the early 1960s, a female chemist who can\'t get respect in the lab becomes an accidental cooking show host, turning housewives into students of science.',
    spineColor: '#B55540',
    accentColor: '#F5A87C',
    thickness: 1.1,
    texture: 'matte',
  },
  // ── 10. Born a Crime ───────────────────────────────────────────
  {
    isbn: '9780399590443',
    title: 'Born a Crime',
    author: 'Trevor Noah',
    description:
      'Trevor Noah\'s memoir about growing up mixed-race under apartheid in South Africa, where his very existence was technically a crime. Deeply funny and deeply serious.',
    spineColor: '#B87A20',
    accentColor: '#F0C040',
    thickness: 0.95,
    texture: 'brushed',
  },
  // ── 11. Anxious People ─────────────────────────────────────────
  {
    isbn: '9781501160837',
    title: 'Anxious People',
    author: 'Fredrik Backman',
    description:
      'A failed bank robber accidentally takes apartment-hunters hostage, forcing a set of strangers to confront their anxieties and hidden lives. Dark comedy with profound empathy.',
    spineColor: '#9A7A18',
    accentColor: '#F7DFA0',
    thickness: 1.0,
    texture: 'linen',
  },
  // ── 12. Recursion ──────────────────────────────────────────────
  {
    isbn: '9781524759780',
    title: 'Recursion',
    author: 'Blake Crouch',
    description:
      'A neuroscientist builds a chair that lets people relive memories, but the technology fractures reality itself. Timelines collapse and the same moments are lived again with devastating consequences.',
    spineColor: '#0A0E1A',
    accentColor: '#1ECAD3',
    thickness: 0.95,
    texture: 'matte',
  },
  // ── 13. Ready Player One ───────────────────────────────────────
  {
    isbn: '9780307887436',
    title: 'Ready Player One',
    author: 'Ernest Cline',
    description:
      'In a dystopian 2044, a teenager competes in a massive virtual reality treasure hunt driven by 1980s pop culture. A love letter to gamer subculture wrapped in high-stakes adventure.',
    spineColor: '#0D0D0D',
    accentColor: '#00CFFF',
    thickness: 1.05,
    texture: 'ribbed',
  },
  // ── 14. Rich Dad Poor Dad ──────────────────────────────────────
  {
    isbn: '9781612680194',
    title: 'Rich Dad Poor Dad',
    author: 'Robert Kiyosaki',
    description:
      'Contrasts two financial philosophies: one paycheck-dependent, one asset-focused. A foundational personal finance text arguing that financial literacy is not taught in school.',
    spineColor: '#1A1A1A',
    accentColor: '#C9A84C',
    thickness: 1.0,
    texture: 'leather',
  },
  // ── 15. Don't Make Me Think ────────────────────────────────────
  {
    isbn: '9780321965516',
    title: "Don't Make Me Think",
    author: 'Steve Krug',
    description:
      'The foundational UX book arguing that good web design should be self-evident. Users should never have to think about how to use an interface.',
    spineColor: '#C43A08',
    accentColor: '#F0906A',
    thickness: 0.75,
    texture: 'woven',
  },
  // ── 16. Why We Sleep ───────────────────────────────────────────
  {
    isbn: '9781501144318',
    title: 'Why We Sleep',
    author: 'Matthew Walker',
    description:
      'Neuroscientist Matthew Walker synthesizes decades of research to explain what sleep does for the brain and body, and what sleep deprivation costs us.',
    spineColor: '#0D1B3E',
    accentColor: '#3A4F8A',
    thickness: 1.05,
    texture: 'matte',
  },
  // ── 17. Know My Name ───────────────────────────────────────────
  {
    isbn: '9780735223721',
    title: 'Know My Name',
    author: 'Chanel Miller',
    description:
      'The memoir of the woman known as "Emily Doe" in the Brock Turner case, reclaiming her identity and voice. Simultaneously a survivor\'s account and a critique of institutional failure.',
    spineColor: '#2D5F3E',
    accentColor: '#4A8C62',
    thickness: 1.05,
    texture: 'linen',
  },
  // ── 18. Shoe Dog ───────────────────────────────────────────────
  {
    isbn: '9781501135927',
    title: 'Shoe Dog',
    author: 'Phil Knight',
    description:
      'Phil Knight\'s memoir traces the founding of Nike from a Stanford business school idea through decades of near-bankruptcy and relentless hustle. Honest, self-deprecating, and surprisingly literary.',
    spineColor: '#2C2C2C',
    accentColor: '#E8E0D4',
    thickness: 1.1,
    texture: 'leather',
  },
  // ── 19. Articulating Design Decisions ──────────────────────────
  {
    isbn: '9781492079224',
    title: 'Articulating Design Decisions',
    author: 'Tom Greever',
    description:
      'A practical guide for UX designers on communicating design choices to stakeholders. Turns subjective reactions into reasoned arguments grounded in user needs.',
    spineColor: '#1B5E5A',
    accentColor: '#7EB8B3',
    thickness: 0.85,
    texture: 'woven',
  },
  // ── 20. Attached ───────────────────────────────────────────────
  {
    isbn: '9781585429134',
    title: 'Attached',
    author: 'Amir Levine & Rachel Heller',
    description:
      'Explains how adults fall into three attachment styles and how identifying yours can radically improve your relationships. Applies academic science to real-world partnership.',
    spineColor: '#6B2D47',
    accentColor: '#C4788C',
    thickness: 0.9,
    texture: 'linen',
  },
]
