import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const capturesRouter = Router();

// --- Constants ---

const HOME = process.env.HOME ?? '/Users/michaelliu';

const KNOWLEDGE_HUB_PATH =
  process.env.KNOWLEDGE_HUB_PATH ??
  path.join(HOME, 'Projects/company/docs/knowledge/KNOWLEDGE_HUB.md');

const SERVER_DIR = typeof __dirname !== 'undefined'
  ? __dirname
  : path.dirname(fileURLToPath(import.meta.url));

const LOCAL_STORE_PATH = path.resolve(SERVER_DIR, '../data/captures.json');

const VALID_TYPES = ['LEARN', 'PATTERN', 'RISK', 'OPPORTUNITY'] as const;
const VALID_DOMAINS = ['infra', 'finance', 'product', 'market', 'security', 'dev', 'ops'] as const;

type EntryType = (typeof VALID_TYPES)[number];
type EntryDomain = (typeof VALID_DOMAINS)[number];

interface CaptureRequest {
  title: string;        // maps to "What" field
  content: string;      // additional context (stored locally, not in KH)
  source: string;       // URL citation
  domain: EntryDomain;
  tags: string[];
  type?: EntryType;     // defaults to LEARN
  agent?: string;       // defaults to "agent"
  applied?: string;     // defaults to "not yet"
}

interface CaptureEntry extends CaptureRequest {
  id: string;           // KH-NNN
  createdAt: string;
}

// --- Helpers ---

function getNextKhId(): number {
  try {
    const content = fs.readFileSync(KNOWLEDGE_HUB_PATH, 'utf-8');
    const matches = content.matchAll(/## KH-(\d+)/g);
    let max = 0;
    for (const match of matches) {
      const num = parseInt(match[1], 10);
      if (num > max) max = num;
    }
    return max + 1;
  } catch {
    // If KH file doesn't exist, start at 1
    return 1;
  }
}

function formatDate(): string {
  return new Date().toISOString().split('T')[0];
}

function formatKhEntry(entry: CaptureEntry): string {
  const tags = entry.tags.map((t) => (t.startsWith('#') ? t : `#${t}`)).join(' ');
  return [
    `## ${entry.id} — ${entry.agent ?? 'agent'} — ${formatDate()}`,
    `**Type:** ${entry.type ?? 'LEARN'}`,
    `**Domain:** ${entry.domain}`,
    `**What:** ${entry.title}`,
    `**Source:** ${entry.source}`,
    `**Applied:** ${entry.applied ?? 'not yet'}`,
    `**Tags:** ${tags}`,
    '',
  ].join('\n');
}

function appendToKnowledgeHub(formatted: string): void {
  const content = fs.readFileSync(KNOWLEDGE_HUB_PATH, 'utf-8');
  const marker = '<!-- Agents: add new entries above this line. Newest first. Cite sources always. -->';
  const markerIndex = content.indexOf(marker);

  if (markerIndex === -1) {
    // Fallback: append to end
    fs.appendFileSync(KNOWLEDGE_HUB_PATH, '\n' + formatted);
    return;
  }

  // Insert before the marker, maintaining "newest first" order
  const before = content.slice(0, markerIndex);
  const after = content.slice(markerIndex);
  fs.writeFileSync(KNOWLEDGE_HUB_PATH, before + formatted + '\n' + after, 'utf-8');
}

function saveToLocalStore(entry: CaptureEntry): void {
  const dir = path.dirname(LOCAL_STORE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  let entries: CaptureEntry[] = [];
  if (fs.existsSync(LOCAL_STORE_PATH)) {
    entries = JSON.parse(fs.readFileSync(LOCAL_STORE_PATH, 'utf-8'));
  }
  entries.unshift(entry);
  fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(entries, null, 2), 'utf-8');
}

function validateRequest(body: unknown): { valid: true; data: CaptureRequest } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be a JSON object' };
  }

  const b = body as Record<string, unknown>;

  // Required fields
  if (!b.title || typeof b.title !== 'string' || b.title.trim().length === 0) {
    return { valid: false, error: 'title is required (non-empty string)' };
  }
  if (!b.source || typeof b.source !== 'string' || b.source.trim().length === 0) {
    return { valid: false, error: 'source is required (non-empty string — cite the URL)' };
  }
  if (!b.domain || typeof b.domain !== 'string') {
    return { valid: false, error: `domain is required (one of: ${VALID_DOMAINS.join(', ')})` };
  }
  if (!VALID_DOMAINS.includes(b.domain as EntryDomain)) {
    return { valid: false, error: `domain must be one of: ${VALID_DOMAINS.join(', ')}` };
  }
  if (!b.tags || !Array.isArray(b.tags) || b.tags.length === 0) {
    return { valid: false, error: 'tags is required (non-empty array of strings)' };
  }

  // Optional fields with validation
  if (b.type !== undefined) {
    if (typeof b.type !== 'string' || !VALID_TYPES.includes(b.type as EntryType)) {
      return { valid: false, error: `type must be one of: ${VALID_TYPES.join(', ')}` };
    }
  }

  return {
    valid: true,
    data: {
      title: (b.title as string).trim(),
      content: typeof b.content === 'string' ? b.content.trim() : '',
      source: (b.source as string).trim(),
      domain: b.domain as EntryDomain,
      tags: (b.tags as string[]).map((t) => t.trim()),
      type: (b.type as EntryType) ?? 'LEARN',
      agent: typeof b.agent === 'string' ? b.agent.trim() : 'agent',
      applied: typeof b.applied === 'string' ? b.applied.trim() : 'not yet',
    },
  };
}

// --- Routes ---

// POST /api/captures — Create a new Knowledge Hub entry
capturesRouter.post('/', (req: Request, res: Response): void => {
  const validation = validateRequest(req.body);

  if (!validation.valid) {
    res.status(400).json({ error: validation.error });
    return;
  }

  const data = validation.data;
  const nextId = getNextKhId();
  const khId = `KH-${String(nextId).padStart(3, '0')}`;

  const entry: CaptureEntry = {
    ...data,
    id: khId,
    createdAt: new Date().toISOString(),
  };

  try {
    // Write to KNOWLEDGE_HUB.md
    const formatted = formatKhEntry(entry);
    appendToKnowledgeHub(formatted);

    // Also persist to local JSON store
    saveToLocalStore(entry);

    res.status(201).json({
      created: true,
      entry: {
        id: entry.id,
        title: entry.title,
        type: entry.type,
        domain: entry.domain,
        source: entry.source,
        tags: entry.tags,
        agent: entry.agent,
        applied: entry.applied,
        createdAt: entry.createdAt,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: `Failed to create entry: ${message}` });
  }
});

// GET /api/captures — List all entries from local store
capturesRouter.get('/', (_req: Request, res: Response): void => {
  try {
    if (!fs.existsSync(LOCAL_STORE_PATH)) {
      res.json({ entries: [], count: 0 });
      return;
    }
    const entries: CaptureEntry[] = JSON.parse(fs.readFileSync(LOCAL_STORE_PATH, 'utf-8'));
    res.json({ entries, count: entries.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: `Failed to read entries: ${message}` });
  }
});
