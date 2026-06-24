"use client";

const BOOKS = [
  { title: "Invisible Man", color: "#8B4513", h: 82 },
  { title: "Parable", color: "#2E5A3C", h: 74 },
  { title: "Alchemist", color: "#D4845A", h: 78 },
  { title: "Between", color: "#1A3A5C", h: 88, wide: true },
  { title: "Design", color: "#6B3A6B", h: 70 },
  { title: "Sapiens", color: "#8B2500", h: 84 },
  { title: "Meaning", color: "#2C4A6E", h: 76 },
  { title: "Thinking", color: "#4A6741", h: 82 },
  { title: "Art of War", color: "#8C1C13", h: 64 },
  { title: "Habits", color: "#C4A35A", h: 80 },
  { title: "Meditations", color: "#3D3D5C", h: 68 },
  { title: "Creativity", color: "#C67D4A", h: 72 },
];

export function GoodreadsPreview() {
  return (
    <svg
      viewBox="0 0 480 360"
      className="w-full h-full"
      style={{ backgroundColor: "#F7F3EE" }}
    >
      {/* Shelf board */}
      <rect x="30" y="260" width="420" height="4" rx="1" fill="#C4A882" />
      <rect x="26" y="264" width="428" height="7" rx="1" fill="#D4C4A8" />

      {/* Books standing on shelf */}
      {BOOKS.map((book, i) => {
        const bookWidth = book.wide ? 30 : 22;
        const x = 42 + i * 34;
        const y = 260 - book.h;
        return (
          <g key={book.title}>
            {/* Book spine */}
            <rect
              x={x}
              y={y}
              width={bookWidth}
              height={book.h}
              rx="2"
              fill={book.color}
            />
            {/* Top detail line */}
            <line
              x1={x + 4}
              y1={y + book.h * 0.1}
              x2={x + bookWidth - 4}
              y2={y + book.h * 0.1}
              stroke="white"
              strokeWidth="0.5"
              opacity="0.35"
            />
            {/* Bottom detail line */}
            <line
              x1={x + 4}
              y1={y + book.h * 0.9}
              x2={x + bookWidth - 4}
              y2={y + book.h * 0.9}
              stroke="white"
              strokeWidth="0.5"
              opacity="0.35"
            />
            {/* Title text (vertical) */}
            <text
              x={x + bookWidth / 2}
              y={y + book.h / 2}
              fill="white"
              fillOpacity="0.7"
              fontSize="5.5"
              fontFamily="monospace"
              textAnchor="middle"
              dominantBaseline="central"
              transform={`rotate(-90, ${x + bookWidth / 2}, ${y + book.h / 2})`}
              letterSpacing="0.5"
            >
              {book.title}
            </text>
          </g>
        );
      })}

      {/* One book leaning against the rest */}
      <g transform="rotate(18, 460, 260)">
        <rect x="448" y="188" width="22" height="72" rx="2" fill="#5B3A29" />
        <line x1="452" y1="195" x2="466" y2="195" stroke="white" strokeWidth="0.5" opacity="0.35" />
        <text
          x="459"
          y="224"
          fill="white"
          fillOpacity="0.7"
          fontSize="5.5"
          fontFamily="monospace"
          textAnchor="middle"
          dominantBaseline="central"
          transform="rotate(-90, 459, 224)"
          letterSpacing="0.5"
        >
          Range
        </text>
      </g>

      {/* Goodreads label */}
      <text
        x="455"
        y="345"
        fill="#8B7355"
        fillOpacity="0.6"
        fontSize="9"
        fontFamily="monospace"
        textAnchor="end"
        letterSpacing="2"
      >
        GOODREADS
      </text>
    </svg>
  );
}
