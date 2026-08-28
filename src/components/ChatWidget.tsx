import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { answer, buildBrain, type Answer, type AnswerBlock } from "../chat/answer";
import type { ProjectGovernance } from "../template/types";

type Message =
  | { id: number; role: "user"; text: string }
  | { id: number; role: "bot"; answer: Answer };

function greeting(project: ProjectGovernance): Answer {
  return {
    blocks: [
      {
        kind: "text",
        text: `Ask me anything about ${project.name}. I read this board's governance data — sprint, tickets, risks, architecture, deployment, roadmap, stakeholders and priorities — and quote it back rather than guessing.`,
      },
    ],
    sources: [],
  };
}

export function ChatWidget({ project }: { project: ProjectGovernance }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [, setParams] = useSearchParams();
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(0);

  // Rebuilt after a sync, so answers use the freshest tickets rather than the
  // payload the page first loaded with.
  const brain = useMemo(() => buildBrain(project), [project]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const ask = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;
    const userId = nextId.current++;
    const botId = nextId.current++;
    setMessages((current) => [
      ...current,
      { id: userId, role: "user", text: trimmed },
      { id: botId, role: "bot", answer: answer(brain, trimmed) },
    ]);
    setDraft("");
  };

  if (!open) {
    return (
      <button
        type="button"
        className="chat-launch"
        onClick={() => setOpen(true)}
        aria-label={`Ask a question about ${project.name}`}
      >
        Ask about {project.name}
      </button>
    );
  }

  return (
    <section className="chat" role="dialog" aria-label={`${project.name} assistant`}>
      <header className="chat-head">
        <div>
          <strong>Ask {project.name}</strong>
          <span className="chat-sub">Answers quoted from this board</span>
        </div>
        <button type="button" className="chat-close" onClick={() => setOpen(false)} aria-label="Close assistant">
          ×
        </button>
      </header>

      <div className="chat-log" ref={logRef} aria-live="polite">
        <BotBubble answer={greeting(project)} onTab={(tab) => setParams({ tab })} />
        {messages.map((message) =>
          message.role === "user" ? (
            <p key={message.id} className="chat-you">
              {message.text}
            </p>
          ) : (
            <BotBubble key={message.id} answer={message.answer} onTab={(tab) => setParams({ tab })} />
          ),
        )}
      </div>

      {messages.length === 0 ? (
        <div className="chat-chips">
          {brain.suggestions.map((suggestion) => (
            <button key={suggestion} type="button" onClick={() => ask(suggestion)}>
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}

      <form
        className="chat-form"
        onSubmit={(event) => {
          event.preventDefault();
          ask(draft);
        }}
      >
        <input
          ref={inputRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={`Ask about ${project.name}…`}
          aria-label="Your question"
        />
        <button type="submit" disabled={!draft.trim()}>
          Ask
        </button>
      </form>
    </section>
  );
}

function BotBubble({ answer: reply, onTab }: { answer: Answer; onTab: (tab: string) => void }) {
  return (
    <div className="chat-bot">
      {reply.blocks.map((block, index) => (
        <Block key={index} block={block} />
      ))}
      {reply.sources.length ? (
        <p className="chat-sources">
          {reply.sources.map((source, index) => (
            <span key={`${source.label}-${index}`}>
              {source.tab ? (
                <button type="button" onClick={() => onTab(source.tab as string)}>
                  {source.label}
                </button>
              ) : source.href ? (
                <a href={source.href} target="_blank" rel="noreferrer">
                  {source.label}
                </a>
              ) : (
                <span className="chat-source-flat">{source.label}</span>
              )}
            </span>
          ))}
        </p>
      ) : null}
    </div>
  );
}

function Block({ block }: { block: AnswerBlock }) {
  if (block.kind === "text") return <p>{block.text}</p>;
  return (
    <ul className="chat-list">
      {block.items.map((item, index) => (
        <li key={index} className={item.tone ? `chat-${item.tone}` : undefined}>
          {item.href ? (
            <a href={item.href} target="_blank" rel="noreferrer">
              {item.title}
            </a>
          ) : (
            <strong>{item.title}</strong>
          )}
          {item.detail ? <span className="chat-detail">{item.detail}</span> : null}
        </li>
      ))}
    </ul>
  );
}
