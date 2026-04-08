# CORTEX — S3 PRD (Product Requirements Document)

**Date:** 2026-04-08 | **Stage:** S4 BUILD (visual/OCR pivot)
**Owner:** Axiom
**Scope:** Visual Capture lane only. Text/URL lane = Readwise Reader.

---

## P0 — Core Visual Capture

| ID | Item | Category | Status | Owner | Target |
|----|------|----------|--------|-------|--------|
| CX-001 | Camera Capture — photo whiteboard/slide/card/note | Functional | In Progress | Code CLI | Apr 2026 |
| CX-002 | OCR Extraction — Apple Vision or Google ML Kit on-device | AI/ML | In Progress | Code CLI | Apr 2026 |
| CX-003 | Structured Knowledge Item — title, text, tags, source photo | Functional | Not Started | Code CLI | May 2026 |
| CX-004 | Tag System — manual + auto-suggested tags | Functional | Not Started | Code CLI | May 2026 |
| CX-005 | Search — full-text search across captured items | Functional | Not Started | Code CLI | May 2026 |
| CX-006 | Item List — chronological, filterable by tag | UI/UX | Not Started | Code CLI | May 2026 |
| CX-007 | Offline-first — capture without internet | Infrastructure | Not Started | Code CLI | May 2026 |

## P1 — Enhanced Capture

| ID | Item | Category | Status | Owner | Target |
|----|------|----------|--------|-------|--------|
| CX-008 | Bulk Camera Roll Import — select multiple photos | Functional | Not Started | Code CLI | May 2026 |
| CX-009 | Handwriting Recognition — beyond printed OCR | AI/ML | Not Started | Code CLI | Q3 2026 |
| CX-010 | Business Card Mode — extract name/email/phone | AI/ML | Not Started | Code CLI | Q3 2026 |
| CX-011 | Export — share to Obsidian, Notion, Readwise | Functional | Not Started | Code CLI | Q3 2026 |
| CX-012 | StoreKit 2 Pro Tier — $3.99/mo | Revenue | Not Started | Code CLI | Q3 2026 |

## P2 — Knowledge Graph

| ID | Item | Category | Status | Owner | Target |
|----|------|----------|--------|-------|--------|
| CX-013 | Auto-linking — related items by content similarity | AI/ML | Not Started | Code CLI | Q4 2026 |
| CX-014 | Collections — group items by project/subject | UI/UX | Not Started | Code CLI | Q4 2026 |
| CX-015 | Weekly Digest — resurface old captures | Marketing | Not Started | Code CLI | Q4 2026 |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Expo / React Native |
| OCR | Apple Vision (iOS) / Google ML Kit (Android) |
| Storage | Core Data + iCloud (or AsyncStorage + Neon) |
| Hosting | Vercel (web companion) |
| IAP | StoreKit 2 (shared FOUNDRY wrapper) |
