export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 bg-white rounded-2xl rounded-bl-sm shadow-sm w-fit">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="typing-dot w-2 h-2 rounded-full bg-ink-300 inline-block"
          style={{ animationDelay: `${i * 0.16}s` }}
        />
      ))}
    </div>
  );
}
