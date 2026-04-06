---
title: CORTEX — Checkpoint
type: checkpoint
updated: 2026-04-05
---

# CHECKPOINT.md

HIL_DEV: OFF

---

## Strategic Context — April 2026 Pivot

CORTEX is **shelved** (no active sprint). Strategic pivot recorded below based on
Consultant analysis (2026-04-05). When revived, this is the product and lane.

### Pivot: Text/URL lane → Visual/OCR lane

Readwise Reader now does everything CORTEX planned for text-based content:
- iOS Share Sheet capture → AI summarization (Ghostreader) → Obsidian sync
- MCP integration → any AI can query your library
- 74K users, profitable company, well-maintained

CORTEX's original differentiators (CP-002) are now commoditized by Readwise.
**The remaining genuine gap: photo/visual capture — whiteboards, handwritten notes,
receipts, UI screenshots, camera roll bulk import.**

Readwise is document-and-text-first. It cannot OCR a whiteboard photo or
organize a camera roll by content. That is CORTEX's lane.

### Revised North Star

**Zero-effort visual capture + AI-powered OCR/extraction + agent write API.**
Anything that can be photographed should be searchable and structured.

### How CORTEX and Readwise Coexist

| Content type | Tool |
|---|---|
| Articles, URLs, newsletters, PDFs, tweets | Readwise Reader |
| Screenshots with text, photos of whiteboards | CORTEX |
| Handwritten notes (photo) | CORTEX |
| Camera roll bulk import / organization | CORTEX |
| Agent knowledge write API | CORTEX (CP-007) — Readwise MCP is read-only |

### Competitive Analysis vs Readwise Reader

| Dimension | Readwise Reader | CORTEX (revised) |
|---|---|---|
| URL / article capture | ✅ Best-in-class | ❌ Not the focus |
| iOS Share Sheet | ✅ Native | ✅ Planned (CP-003) |
| AI summarization | ✅ Ghostreader (customizable) | ✅ Claude Vision |
| Obsidian sync | ✅ Official plugin + YAML template | 🔲 Not planned |
| MCP integration | ✅ Official MCP server | 🔲 Agent write API instead |
| Photo / camera roll | ❌ Not supported | ✅ Core differentiator |
| Whiteboard OCR | ❌ Not supported | ✅ Core differentiator |
| Bulk photo import | ❌ Not supported | ✅ CP-004 |
| Agent write API | ❌ Read-only via MCP | ✅ CP-007 (Koda/Felix/Mika write) |
| Pricing | ~$8/month SaaS | TBD — freemium |
| Users | 74K+ | 0 (shelved) |

### Revenue Model (revised)

Freemium: free tier for personal use, paid tier for agent API access + bulk processing.
Not a WhatsApp replacement or Notion replacement. Narrow scope = defensible.

---

## CP-001 — MVP Stabilization (DONE)

**Status:** ✅ DONE — 2026-03-21
**What:** Fix missing dependencies and get Cortex running locally + pushed to GitHub.
**Actions taken:**
- Installed missing deps: `@react-navigation/native`, `@react-navigation/bottom-tabs`,
  `react-native-safe-area-context`, `react-native-screens`, `expo-crypto`,
  `react-dom`, `react-native-web`
- Verified web bundle succeeds (562 modules, 621ms)
- Pushed to GitHub: `ahfeiathome/cortex` (private)
**Result:** MVP runs on web at localhost:8081. 4 screens functional: Capture, Library,
Detail, Settings.

---

## CP-002 — Product Differentiation: Cortex vs Readwise (REVISED)

**Status:** ✅ REVISED — 2026-04-05 (was: vs Notion)
**What:** CORTEX differentiator is visual/OCR capture, NOT text/URL capture.
See Strategic Context above.

---

## CP-003 — iOS Share Sheet Extension

**Status:** ⏳ TODO — P0 killer feature (still valid, now scoped to images)
**What:** Enable "Take screenshot → Share → Send to Cortex" for IMAGE content.
Text URLs → Readwise instead. Images/photos → Cortex.
**Approach:**
1. `expo-share-intent` community library — handles share sheet receipt in Expo managed
2. Custom native module (Swift) — more control, more work
3. Bare workflow eject — full native access, lose Expo convenience
**Recommended:** Start with `expo-share-intent`. Eject only if image handling insufficient.
**Constraint:** Test on real device (simulator has no share sheet from other apps).

---

## CP-004 — Bulk Photo Import

**Status:** ⏳ TODO — P0 onboarding hook (unchanged, now core to lane)
**What:** Import multiple photos from iPhone camera roll at once.
**Why:** This IS the product now. Camera roll → AI organizes → searchable library.
**Approach:**
1. Replace `expo-image-picker` with `expo-media-library`
   - Multi-select, album browsing, date-range filter
2. UX: "Import Photos" → date groups → multi-select → "Import & Analyze"
3. AI processing: batch queue with progress indicator
**Rate limit note:** 50+ photos → need queue + Haiku for efficiency.

---

## CP-005 — Semantic Search

**Status:** ⏳ TODO — P1 (unchanged)
**What:** Natural language search across visual captures.
**Approach:**
1. On capture: generate embedding from extracted text + AI description of image
2. Store embeddings in local DB (pgvector or on-device)
3. On search: embed query → cosine similarity
**Depends on:** Backend (CP-006).

---

## CP-006 — Backend API

**Status:** ⏳ TODO — ~~BLOCKED on AWS~~ AWS blocker CLEARED 2026-04-05
**What:** Cloud sync, agent write API, server-side AI processing.
**Blocker cleared:** Company naming resolved (BML Research). AWS account creation
is a production concern — not a pre-requisite for continued local development.
Build locally first, stand up backend when product validates.
**Approach:**
- AWS (replaces Oracle Cloud)
- REST API: POST /captures, GET /captures, GET /search
- Auth: API key initially
- Bridge script `scripts/kh-to-cortex.py` exists — needs endpoint wired

---

## CP-007 — Agent Write API

**Status:** ⏳ TODO — P1, depends on CP-006
**What:** POST /captures endpoint so Koda, Felix, Mika write discoveries directly.
**Why:** This is now a KEY differentiator vs Readwise MCP (which is read-only).
Agents can push content IN. Readwise MCP only reads out.
**Approach:**
- Agent auth token per agent (koda, felix, mika, sage, rex)
- Auto-tag with source agent
- Bridge: `docs/knowledge/KNOWLEDGE_HUB.md` → Cortex API

---

## Priority Queue (revised)

| Priority | CP | Feature | Status |
|----------|----|---------|--------|
| P0 | CP-003 | iOS Share Sheet (images only) | TODO |
| P0 | CP-004 | Bulk Photo Import | TODO |
| P1 | CP-005 | Semantic Search | TODO |
| P1 | CP-006 | Backend API (AWS) | TODO — blocker cleared |
| P1 | CP-007 | Agent Write API | TODO (after CP-006) |

---

## Open Blockers

1. **Expo SDK compatibility** — `expo-share-intent` needs evaluation for image support
2. **CORTEX transferred to Axiom (2026-04-05)** — lc-axiom session owns this now.
   lc-forge: update COMPANY.md to remove CORTEX. lc-axiom: add to COMPANY.md, resume S4 BUILD.
3. **Shared gate at S6:** Apple Developer account ($99 💳 Michael) — needed for TestFlight.
