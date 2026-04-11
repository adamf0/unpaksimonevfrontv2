type QuoteBlockProps = {
  quote: string;
  author: string;
};

export default function QuoteBlock({ quote, author }: QuoteBlockProps) {
  return (
    <blockquote className="space-y-4">
      <p className="text-2xl font-medium italic leading-relaxed opacity-90">
        "{quote}"
      </p>
      <footer className="text-lg font-bold tracking-wide uppercase">
        — {author}
      </footer>
    </blockquote>
  );
}