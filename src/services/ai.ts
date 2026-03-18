import { File } from 'expo-file-system';
import type { AIAnalysisResult, CategoryType, TagType } from '../types';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

// In production, this should come from a secure backend proxy.
// For MVP, we read from a local config stored via Settings screen.
let apiKey = '';

export function setApiKey(key: string): void {
  apiKey = key;
}

export function getApiKey(): string {
  return apiKey;
}

const VALID_TAGS: TagType[] = [
  'idea',
  'todo',
  'reference',
  'inspiration',
  'quote',
  'screenshot',
  'code',
  'design',
  'article',
  'other',
];

const VALID_CATEGORIES: CategoryType[] = [
  'idea',
  'todo',
  'reference',
  'inspiration',
  'other',
];

function sanitizeResult(raw: Record<string, unknown>): AIAnalysisResult {
  const title =
    typeof raw.title === 'string' ? raw.title : 'Untitled capture';
  const extractedText =
    typeof raw.extracted_text === 'string' ? raw.extracted_text : '';
  const summary =
    typeof raw.summary === 'string' ? raw.summary : 'No summary available';

  let tags: TagType[] = [];
  if (Array.isArray(raw.tags)) {
    tags = raw.tags.filter(
      (t): t is TagType =>
        typeof t === 'string' && VALID_TAGS.includes(t as TagType)
    );
  }
  if (tags.length === 0) tags = ['other'];

  let category: CategoryType = 'other';
  if (
    typeof raw.category === 'string' &&
    VALID_CATEGORIES.includes(raw.category as CategoryType)
  ) {
    category = raw.category as CategoryType;
  }

  return { title, tags, extracted_text: extractedText, category, summary };
}

export async function analyzeImage(
  imageUri: string
): Promise<AIAnalysisResult> {
  if (!apiKey) {
    return {
      title: 'Untitled capture',
      tags: ['screenshot'],
      extracted_text: '',
      category: 'other',
      summary: 'AI analysis unavailable — no API key configured.',
    };
  }

  const file = new File(imageUri);
  const base64 = await file.base64();

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-20250414',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: base64,
              },
            },
            {
              type: 'text',
              text: `Analyze this image. Return ONLY valid JSON with no markdown fences:
{
  "title": "short descriptive title (5-8 words)",
  "tags": ["tag1", "tag2"],
  "extracted_text": "any readable text in the image",
  "category": "idea" | "todo" | "reference" | "inspiration" | "other",
  "summary": "one sentence description"
}

Valid tags: idea, todo, reference, inspiration, quote, screenshot, code, design, article, other.
Valid categories: idea, todo, reference, inspiration, other.`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Claude API error:', errorText);
    return {
      title: 'Untitled capture',
      tags: ['screenshot'],
      extracted_text: '',
      category: 'other',
      summary: 'AI analysis failed.',
    };
  }

  const data = (await response.json()) as {
    content: Array<{ type: string; text?: string }>;
  };

  const textBlock = data.content.find((c) => c.type === 'text');
  if (!textBlock?.text) {
    return {
      title: 'Untitled capture',
      tags: ['screenshot'],
      extracted_text: '',
      category: 'other',
      summary: 'AI returned empty response.',
    };
  }

  // Strip markdown fences if present
  let jsonStr = textBlock.text.trim();
  jsonStr = jsonStr.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');

  try {
    const parsed = JSON.parse(jsonStr) as Record<string, unknown>;
    return sanitizeResult(parsed);
  } catch {
    console.error('Failed to parse AI response:', jsonStr);
    return {
      title: 'Untitled capture',
      tags: ['screenshot'],
      extracted_text: jsonStr,
      category: 'other',
      summary: 'Could not parse AI response.',
    };
  }
}

export async function analyzeText(text: string): Promise<AIAnalysisResult> {
  if (!apiKey) {
    return {
      title: text.slice(0, 40),
      tags: ['idea'],
      extracted_text: text,
      category: 'idea',
      summary: text.slice(0, 100),
    };
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-20250414',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: `Analyze this note/idea. Return ONLY valid JSON with no markdown fences:
{
  "title": "short descriptive title (5-8 words)",
  "tags": ["tag1", "tag2"],
  "extracted_text": "",
  "category": "idea" | "todo" | "reference" | "inspiration" | "other",
  "summary": "one sentence description"
}

Valid tags: idea, todo, reference, inspiration, quote, screenshot, code, design, article, other.
Valid categories: idea, todo, reference, inspiration, other.

Note content:
${text}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    return {
      title: text.slice(0, 40),
      tags: ['idea'],
      extracted_text: text,
      category: 'idea',
      summary: text.slice(0, 100),
    };
  }

  const data = (await response.json()) as {
    content: Array<{ type: string; text?: string }>;
  };

  const textBlock = data.content.find((c) => c.type === 'text');
  if (!textBlock?.text) {
    return {
      title: text.slice(0, 40),
      tags: ['idea'],
      extracted_text: text,
      category: 'idea',
      summary: text.slice(0, 100),
    };
  }

  let jsonStr = textBlock.text.trim();
  jsonStr = jsonStr.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');

  try {
    const parsed = JSON.parse(jsonStr) as Record<string, unknown>;
    return sanitizeResult(parsed);
  } catch {
    return {
      title: text.slice(0, 40),
      tags: ['idea'],
      extracted_text: text,
      category: 'idea',
      summary: text.slice(0, 100),
    };
  }
}
