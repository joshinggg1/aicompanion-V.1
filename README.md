# AI Studio Project Orchestrator

> **A conversational project manager that decides when an AI build prompt is actually ready to exist.**

Turn an idea into a finished build prompt for [Google AI Studio](https://ai.studio/build) — and maintain deep project continuity across your build lifecycle.

---

## The Problem

Most AI prompt generators behave like stateless vending machines:
1. You provide a rough prompt or keywords.
2. The tool immediately dumps a massive, unsolicited boilerplate prompt.
3. Every subsequent message or bug report causes the tool to hallucinate or regenerate from scratch, discarding working architecture.

True craftsmanship in software development requires the opposite: **judgment, restraint, and continuity.**

---

## Core Product Proposition

The Orchestrator acts as a conversational partner and technical project manager:

```
Start project
    ↓
Understand the core problem
    ↓
Challenge weak assumptions & evaluate competitive reality
    ↓
Hold restraint until problem & workflow are concrete
    ↓
Synthesize Build Prompt (Copy to Google AI Studio)
    ↓
Build / test in AI Studio (https://ai.studio/build)
    ↓
Return with what happened ("The capture works, but CSV export is broken")
    ↓
Orchestrator recognizes ongoing project (The "Sniper" Principle)
    ↓
Target ONLY what needs changing (Preserve working code & schemas)
    ↓
Updated Build Prompt / Targeted Resolution
    ↓
Back to AI Studio (repeat until finished)
```

---

## The 5 Behavioral Dimensions

1. **🧠 Understanding:** Understands the actual problem behind the user's words rather than latching onto surface-level buzzwords.
2. **🔎 Critical Reasoning:** Challenges weak assumptions. Discerns saturated markets from viable niches without pretending to perform live web crawl audits.
3. **💡 Opportunity:** Identifies where a focused, lightweight tool actually wins over bloated enterprise suites or spreadsheets.
4. **🏗️ Architecture:** Produces a clean, single-screen implementation specification for Google AI Studio with explicit schemas and anti-drift non-goals.
5. **🎯 Restraint (Knowing when to produce the prompt):** Refuses to generate a premature specification when an idea is vague, unformed, or fundamentally unviable. The build pane remains intentionally empty until the concept is ready.

---

## The "Sniper" Principle (Project Continuity)

Continuity is more important than raw prompt generation.

```
Establish once.
Preserve what is known.
Investigate what changed.
Modify precisely.
```

When you return with feedback from AI Studio:
- **It does NOT regenerate from scratch.**
- It isolates the failing component or regression.
- It preserves all working data structures, styling, and decisions.
- It applies targeted fix directives directly to the living build prompt.

---

## Architecture & Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend:** Express with Vite middleware, running Node.js / TypeScript.
- **Intelligence Model:** Google GenAI SDK (`gemini-2.5-flash` / `gemini-3.8-flash`) with structured schema output.
- **Fail-Safe Continuity:** Deterministic sniper fallback engine ensuring 100% uptime and context preservation even during upstream API demand spikes.
- **Persistence:** LocalStorage project state engine (`ProjectState`) tracking project identity, accumulated requirements, interaction logs, and iteration history.

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- `npm` or `yarn`
- Optional: `GEMINI_API_KEY` for live AI generation. If omitted, the orchestrator operates using its built-in continuity engine.

### Installation & Run
```bash
# Install dependencies
npm install

# Start development server (binds to http://localhost:3000)
npm run dev

# Build for production
npm run build
```

---

## License
MIT
