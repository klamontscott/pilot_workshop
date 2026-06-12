export default function TypographyPage() {
  return (
    <article>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-4">
        Foundations
      </p>
      <h1 className="font-sans text-[32px] font-bold tracking-tight text-foreground mb-4">
        Typography
      </h1>
      <p className="font-sans text-[15px] leading-relaxed text-muted max-w-xl mb-12">
        Two typefaces. <strong className="text-foreground">Aeonik</strong> (sans-serif) for
        headings and body. <strong className="text-foreground">Geist Mono</strong> for
        labels, tags, code, and system text. Never more than two typefaces.
      </p>

      <h2 className="font-sans text-[20px] font-bold text-foreground mb-6">
        Type scale
      </h2>

      <div className="flex flex-col gap-8 mb-12">
        <div className="border-b border-border pb-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted block mb-2">
            Display &mdash; 56px / Bold
          </span>
          <p className="font-sans text-[56px] font-bold leading-[1.1] tracking-tight text-foreground">
            Aa
          </p>
        </div>

        <div className="border-b border-border pb-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted block mb-2">
            Heading 1 &mdash; 32px / Bold
          </span>
          <p className="font-sans text-[32px] font-bold leading-[1.15] tracking-tight text-foreground">
            The quick brown fox
          </p>
        </div>

        <div className="border-b border-border pb-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted block mb-2">
            Heading 2 &mdash; 24px / Bold
          </span>
          <p className="font-sans text-[24px] font-bold leading-[1.2] text-foreground">
            The quick brown fox jumps over
          </p>
        </div>

        <div className="border-b border-border pb-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted block mb-2">
            Heading 3 &mdash; 20px / Bold
          </span>
          <p className="font-sans text-[20px] font-bold leading-[1.3] text-foreground">
            The quick brown fox jumps over the lazy dog
          </p>
        </div>

        <div className="border-b border-border pb-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted block mb-2">
            Body &mdash; 15px / Regular
          </span>
          <p className="font-sans text-[15px] leading-relaxed text-foreground">
            The quick brown fox jumps over the lazy dog. Pack my box with five
            dozen liquor jugs. How vexingly quick daft zebras jump.
          </p>
        </div>

        <div className="border-b border-border pb-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted block mb-2">
            Label &mdash; Geist Mono 11px / Uppercase
          </span>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
            Section label
          </p>
        </div>

        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted block mb-2">
            Code &mdash; Geist Mono 13px
          </span>
          <p className="font-mono text-[13px] text-foreground">
            const tokens = {"{}"};
          </p>
        </div>
      </div>

      <h2 className="font-sans text-[20px] font-bold text-foreground mb-4">
        Font stacks
      </h2>
      <div className="bg-foreground/[0.03] border border-border rounded-lg p-6 font-mono text-[13px] text-foreground leading-relaxed">
        <div>
          <span className="text-muted">--font-sans:</span> &quot;Aeonik&quot;,
          system-ui, sans-serif
        </div>
        <div>
          <span className="text-muted">--font-mono:</span> &quot;Geist
          Mono&quot;, ui-monospace, monospace
        </div>
      </div>
    </article>
  );
}
