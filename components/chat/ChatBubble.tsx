import { Message } from "@/types";
import { LANGUAGE_NAMES } from "@/types";
import clsx from "clsx";

interface Props {
  message: Message;
}

export function ChatBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div
      className={clsx(
        "flex animate-slide-up",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-saffron-500 flex items-center justify-center mr-2 mt-1 text-white text-xs font-bold shadow-sm">
          म
        </div>
      )}

      <div className="max-w-[80%] flex flex-col gap-1">
        <div
          className={clsx(
            "px-4 py-3 rounded-2xl text-sm leading-relaxed devanagari",
            isUser
              ? "bg-saffron-500 text-white rounded-br-sm"
              : "bg-white text-ink-800 rounded-bl-sm shadow-sm"
          )}
        >
          {/* Render newlines as paragraphs */}
          {message.content.split("\n").map((line, i) =>
            line.trim() === "" ? (
              <br key={i} />
            ) : (
              <p key={i} className={i > 0 ? "mt-1" : ""}>
                {line}
              </p>
            )
          )}
        </div>

        <div
          className={clsx(
            "text-[10px] text-ink-400 px-1",
            isUser ? "text-right" : "text-left"
          )}
        >
          {message.language && !isUser && (
            <span className="mr-2 bg-ink-100 px-1.5 py-0.5 rounded text-ink-500">
              {LANGUAGE_NAMES[message.language]}
            </span>
          )}
          {message.timestamp.toLocaleTimeString("hi-IN", {
            hour: "2-digit",
            minute: "2-digit"
          })}
        </div>
      </div>
    </div>
  );
}
