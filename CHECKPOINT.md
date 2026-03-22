---
title: CORTEX — Checkpoint
type: checkpoint
updated: 2026-03-21
---

# CHECKPOINT.md

HIL_DEV: OFF

---

## CP-001 — MVP Stabilization (DONE)

**Status:** ✅ DONE — 2026-03-21
**What:** Fix missing dependencies and get Cortex running locally + pushed to GitHub.
**Actions taken:**
- Installed missing deps: `@react-navigation/native`, `@react-navigation/bottom-tabs`, `react-native-safe-area-context`, `react-native-screens`, `expo-crypto`, `react-dom`, `react-native-web`
- Verified web bundle succeeds (562 modules, 621ms)
- Pushed to GitHub: `ahfeiathome/cortex` (private)
**Result:** MVP runs on web at localhost:8081. 4 screens functional: Capture, Library, Detail, Settings.

---

## CP-002 — Product Differentiation: Cortex vs Notion

**Status:** 📋 DOCUMENTED — strategic context for all future CPs
**What:** Define what makes Cortex different from Notion and worth building.

### The Thesis

Notion is a **workspace** — you build structure, organize manually, collaborate.
Cortex is a **capture-first AI inbox** — you dump things in, AI does the filing.

### Differentiators (the moat)

| Dimension | Notion | Cortex |
|-----------|--------|--------|
| Capture speed | Open app → find page → paste → tag manually | Screenshot → share → done (AI auto-files) |
| Organization | User builds structure | AI auto-tags, summarizes, clusters |
| Agent-native | No agent integration | Koda/Felix/Mika write directly |
| OCR + context | Manual | Photo of whiteboard → structured notes |
| Search | Keyword | Semantic ("that auth thing from last week") |

### North Star

**Zero-effort capture + AI organization + agent integration.** If the user has to think about where to put something, we've failed.

---

## CP-003 — iOS Share Sheet Extension

**Status:** ⏳ TODO — P0 killer feature
**What:** Enable "Take screenshot → Share → Send to Cortex" workflow on iOS.
**Why:** This is the #1 differentiator vs Notion. Frictionless capture from anywhere on the device. Apple Notes does this. We must too.
**Approach:**
1. Expo doesn't support Share Extensions natively — requires **bare workflow** or a **config plugin**
2. Options:
   - `expo-share-intent` community library — handles share sheet receipt in Expo managed workflow
   - Custom native module (Swift) — more control, more work
   - Bare workflow eject — full native access, but lose Expo managed convenience
3. Recommended: Start with `expo-share-intent` — if it covers image + text sharing, ship it. Eject later only if needed.
**Depends on:** Backend API (CP-006) for cloud sync, but can work locally first via AsyncStorage.
**Constraints:** Needs Expo SDK compatibility check. Test on real device (simulator doesn't have share sheet from other apps).

---

## CP-004 — Bulk Photo Import

**Status:** ⏳ TODO — P0 onboarding hook
**What:** Allow importing multiple photos from iPhone camera roll at once, not one-by-one.
**Why:** Current `expo-image-picker` only supports single selection. Users with existing photos (receipts, whiteboards, screenshots) need batch import to see immediate value. This is the onboarding hook — "import your last 7 days and see Cortex organize them."
**Approach:**
1. Replace/supplement `expo-image-picker` with `expo-media-library`
   - Grants access to full camera roll with album browsing
   - Multi-select support
   - Can filter by date range, media type
2. UX flow:
   - "Import Photos" button on Library screen
   - Show albums / date groups (Last 7 days, Last 30 days, By Album)
   - Multi-select with preview
   - "Import & Analyze" → background AI processing queue
3. AI processing: batch queue with progress indicator — don't block UI while Claude analyzes each photo
**Depends on:** Need to handle API rate limits if analyzing 50+ photos via Claude Haiku.

---

## CP-005 — Semantic Search

**Status:** ⏳ TODO — P1
**What:** Replace keyword search with semantic/natural language search ("find that restaurant menu from Tuesday").
**Why:** Keyword search is what Notion does. Semantic search is the AI-native differentiator. Users describe what they're looking for in natural language, Cortex understands context, tags, dates, and content.
**Approach:**
1. On capture: generate embedding via Claude or a lightweight embedding model
2. Store embeddings alongside captures in local DB (or vector store once backend exists)
3. On search: embed the query → cosine similarity against stored embeddings
4. Fallback: hybrid search (semantic + keyword) for reliability
**Depends on:** Backend (CP-006) for server-side embeddings at scale. Can prototype locally with on-device embeddings or API calls.

---

## CP-006 — Backend API (Oracle Cloud)

**Status:** ⏳ TODO — BLOCKED on CEO confirmation
**What:** Stand up backend for cloud sync, agent write API, and server-side AI processing.
**Why:** Without a backend, Cortex is local-only — no sync across devices, no agent integration, no shared knowledge base.
**Blocker:** Oracle Cloud home region selection — needs Michael's confirmation (originally CP-037 in company CHECKPOINT).
**Approach:**
- Oracle Cloud free tier (ARM VM, 24GB RAM)
- Simple REST API: POST /captures, GET /captures, GET /search
- Auth: API key initially, Auth0 later
- Bridge script `scripts/kh-to-cortex.py` already exists — just needs the endpoint

---

## CP-007 — Agent Write API

**Status:** ⏳ TODO — P1, depends on CP-006
**What:** API endpoint so Koda, Felix, and Mika can write discoveries directly to Cortex.
**Why:** This is the "agent-native" differentiator. When Felix finds something during patrol, or Koda relays a discovery from Telegram, it goes straight into Cortex — not lost in chat logs.
**Approach:**
- POST /captures with agent auth token
- Auto-tag with source agent (koda, felix, mika)
- Bridge: `docs/knowledge/KNOWLEDGE_HUB.md` → Cortex API (script exists)

---

## Priority Queue

| Priority | CP | Feature | Status |
|----------|----|---------|--------|
| P0 | CP-003 | iOS Share Sheet Extension | TODO |
| P0 | CP-004 | Bulk Photo Import | TODO |
| P1 | CP-005 | Semantic Search | TODO |
| P1 | CP-006 | Backend API | BLOCKED — needs CEO |
| P1 | CP-007 | Agent Write API | TODO (after CP-006) |

---

## Blockers

1. **Oracle Cloud home region** — Michael must confirm region for CP-006
2. **Expo SDK compatibility** — Share Sheet extension needs `expo-share-intent` or bare workflow evaluation
3. **RADAR venv** — `alpaca-py` won't install on managed macOS Python (PEP 668). Needs venv setup — not Cortex-specific but noted during this session.
