import type { Passage } from "./knowledge";

/**
 * BM25 over the passages built from a governance payload. It is deliberately
 * small: a few hundred passages per product means an in-memory scan costs less
 * than the render that follows, and keeping it local means the chat works
 * offline, needs no key, and cannot invent an answer.
 */
const STOPWORDS = new Set([
  "a", "an", "and", "any", "are", "as", "at", "be", "been", "but", "by", "can", "could",
  "did", "do", "does", "for", "from", "get", "give", "had", "has", "have", "how", "i", "if",
  "in", "into", "is", "it", "its", "me", "of", "on", "or", "our", "please", "so", "some",
  "tell", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this",
  "to", "us", "was", "we", "were", "what", "when", "where", "which", "will", "with", "would",
  "you", "your",
]);

/** Question vocabulary mapped onto the words the payload actually uses. */
const SYNONYMS: Record<string, string[]> = {
  blocker: ["blocked", "bottleneck"],
  blocked: ["blocker", "bottleneck"],
  blockers: ["blocked", "bottleneck"],
  late: ["overdue", "slipped", "delayed"],
  delayed: ["overdue", "slipped", "late"],
  owner: ["owned", "assignee", "responsible"],
  owns: ["owned", "owner", "assignee"],
  who: ["owner", "responsible", "accountable"],
  risk: ["risky", "blocked", "bottleneck"],
  ship: ["release", "deliver", "launch"],
  shipping: ["release", "deliver", "launch"],
  timeline: ["roadmap", "schedule", "gantt"],
  priority: ["rice", "important", "ranking"],
  progress: ["status", "state", "done"],
  auth: ["authentication", "authorisation", "authorization", "token", "login"],
  sso: ["authentication", "login", "okta", "keycloak"],
  env: ["environment", "deployment"],
  infra: ["infrastructure", "deployment", "environment"],
  docs: ["documentation", "guide"],
};

const TICKET_KEY = /\b[A-Z][A-Z0-9]+-\d+\b/g;

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\-\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 1 && !STOPWORDS.has(word))
    .map((word) => (word.length > 4 && word.endsWith("s") ? word.slice(0, -1) : word));
}

export type SearchIndex = {
  passages: Passage[];
  /** Per passage: term -> weighted count. */
  terms: Map<string, number>[];
  lengths: number[];
  averageLength: number;
  documentFrequency: Map<string, number>;
  /** Lowercased title+body, kept for phrase matching. */
  plain: string[];
  ticketKeys: Set<string>[];
};

export function buildIndex(passages: Passage[]): SearchIndex {
  const terms: Map<string, number>[] = [];
  const lengths: number[] = [];
  const plain: string[] = [];
  const ticketKeys: Set<string>[] = [];
  const documentFrequency = new Map<string, number>();

  for (const passage of passages) {
    const counts = new Map<string, number>();
    // Title and keywords describe what a passage is *for*, so they outweigh
    // prose where a term may appear only in passing.
    const weighted: [string, number][] = [
      [passage.title, 3],
      [passage.topic, 2],
      [(passage.keywords ?? []).join(" "), 3],
      [passage.body, 1],
    ];

    for (const [text, weight] of weighted) {
      for (const token of tokenize(text)) {
        counts.set(token, (counts.get(token) ?? 0) + weight);
      }
    }

    let length = 0;
    for (const count of counts.values()) length += count;

    for (const token of counts.keys()) {
      documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1);
    }

    const text = `${passage.title} ${passage.body} ${(passage.keywords ?? []).join(" ")}`;
    terms.push(counts);
    lengths.push(length);
    plain.push(text.toLowerCase());
    ticketKeys.push(new Set(text.toUpperCase().match(TICKET_KEY) ?? []));
  }

  const total = lengths.reduce((sum, value) => sum + value, 0);
  return {
    passages,
    terms,
    lengths,
    averageLength: lengths.length ? total / lengths.length : 1,
    documentFrequency,
    plain,
    ticketKeys,
  };
}

function expand(tokens: string[]): string[] {
  const out = new Set(tokens);
  for (const token of tokens) {
    for (const extra of SYNONYMS[token] ?? []) out.add(extra);
  }
  return [...out];
}

export type Hit = {
  passage: Passage;
  score: number;
};

const K1 = 1.5;
const B = 0.75;

export function search(index: SearchIndex, query: string, limit = 5): Hit[] {
  const base = tokenize(query);
  if (!base.length) return [];
  const tokens = expand(base);
  const asked = new Set(query.toUpperCase().match(TICKET_KEY) ?? []);
  const phrase = query.toLowerCase().trim();
  const count = index.passages.length;

  const hits: Hit[] = index.passages.map((passage, i) => {
    let score = 0;

    for (const token of tokens) {
      const frequency = index.terms[i].get(token);
      if (!frequency) continue;
      const documents = index.documentFrequency.get(token) ?? 0;
      const idf = Math.log(1 + (count - documents + 0.5) / (documents + 0.5));
      const norm = 1 - B + (B * index.lengths[i]) / (index.averageLength || 1);
      score += idf * ((frequency * (K1 + 1)) / (frequency + K1 * norm));
    }

    // Naming a ticket is an unambiguous request for that ticket.
    for (const key of asked) {
      if (index.ticketKeys[i].has(key)) score += 25;
    }

    // A literal run of words beats coincidental overlap of the same words.
    if (phrase.length > 8 && index.plain[i].includes(phrase)) score += 6;

    return { passage, score };
  });

  return hits
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function mentionedTicketKeys(query: string): string[] {
  return [...new Set(query.toUpperCase().match(TICKET_KEY) ?? [])];
}
