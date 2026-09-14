# Developer Brief — AI Studio Project Orchestrator

## Objective

Strip the product back to its actual purpose:

A conversational project manager that helps a user turn an idea into a finished build prompt for Google AI Studio — and stays with that same project across its entire build lifecycle.

The user should not have to manage a workflow, analyze dashboards, allocate credits, or perform prompt engineering.

## Product Definition

> **Conversation + persistent understanding + targeted intelligence → Build Prompt.**
> 
> The user never needs to see or manage any of that machinery. They just talk to the PM.
> 
> **The important word isn't really prompt. It's continuity.**

---

## Core Lifecycle: The Build Loop

This is not a tool you use for one quick idea and throw away. It is built around an ongoing project that may take a week or longer to construct and iterate in Google AI Studio.

```
Start project
    ↓
Understand what we're building
    ↓
Develop Build Prompt
    ↓
Copy to AI Studio
    ↓
Build / test in AI Studio
    ↓
Come back with what happened
    ↓
Orchestrator understands the existing project + new feedback
    ↓
Target only what needs changing
    ↓
Updated Build Prompt
    ↓
Back to AI Studio (repeat until finished)
```

The user builds something in AI Studio, observes what happened, returns to the Orchestrator, explains what happened, and the Orchestrator incorporates that feedback into the same ongoing project.

---

## 1. Conversation — Primary Interface

This is the main product.

The user speaks naturally about an idea, a problem, or feedback from AI Studio.

The conversational LLM should:
- Understand what the user actually means.
- Ask useful questions when necessary.
- Challenge weak assumptions.
- Investigate existing products and approaches.
- Identify genuine opportunities or gaps.
- Discuss findings with the user.
- Progressively establish what should actually be built.
- Handle subsequent iterations: *"I know where we are with this project. What's changed?"*

### Introductory Instruction:
> *"Talk naturally about what you want to build. I'll help you understand the problem, investigate what already exists, identify opportunities, and develop the build prompt."*

Keep the existing Try suggestions because they help the user begin.
Do not turn the conversation into a form or wizard.

---

## 2. Build Prompt — The Product's Output

The right-hand panel is the important secondary surface.

It contains the current build prompt being developed from the conversation.

Before enough information exists:
- **No build prompt yet.**
- *Continue the conversation to develop the project.*

As understanding develops, the prompt is progressively synthesized and refined.

When the user says:
> *"Okay. Build this"*

The system produces the best current version of the build prompt.

When the user returns with feedback:
- *"The auth works, but data import is broken."*
- *"AI Studio changed this part, but now the dashboard isn't behaving correctly."*
- *"Actually, I want this particular workflow to work differently."*

The system updates only the relevant sections of the Build Prompt or provides a targeted resolution prompt for AI Studio without starting over.

Provide:
- **Copy Prompt for AI Studio**
- **Open Google AI Studio ↗** (`https://ai.studio/build`)

The user manually copies the prompt into AI Studio and builds there.
Do not pretend to directly control AI Studio if the application does not actually have that capability.

---

## 3. Intelligence Efficiency / Project Continuity (Core Developer Rule)

Once the user and conversational brain establish what is being built, treat that understanding as persistent project context across days or weeks.

- **Do not repeatedly regenerate full analyses, research, architecture, or build prompts when nothing relevant has changed.**
- When the user introduces a new requirement, correction, question, or change, **identify precisely what is affected and reason specifically about that change. Preserve everything else that remains valid.**
- **Use deeper/high-intelligence reasoning when it is actually valuable** — for example, resolving ambiguity, evaluating a significant architectural change, investigating an unknown market or technical issue, or reconciling conflicting requirements.
- **For straightforward continuation**, use the already-established project knowledge rather than starting from scratch.
- The Build Prompt should therefore behave as an **evolving project artifact**, not a completely regenerated document after every message.

> **Principle: Establish once, preserve what is known, investigate what changed, modify precisely.**
> 
> The goal is not to maximize the amount of intelligence used. The goal is to maximize the value obtained from the intelligence available.

---

## 4. No Pre-Populated Knowledge

A new project must actually be new.

- Do not hard-code example research such as *"92% High Opportunity Wedge"* or pre-existing Salesforce/ServiceNow analysis.
- Do not present personas, market gaps, competitive claims, architectural decisions, or test results until they have actually been established.
- The initial workspace should feel like an intelligent blank workspace, not a project that has already been analyzed.

---

## 5. Remove the Dashboard

No visible Database / Statistics section.
Do not display:
- Market Gap Viability scores
- Target Persona cards
- Unfair Advantage cards
- Competitor dashboards
- Commercial viability ratings
- Credit allocations or model allocation plans
- Project statistics, research tabs, ideas tabs, projects tabs, tests tabs, results tabs

These are not necessary for the user's interaction.
If research produces useful information, it should appear naturally in the conversation.

---

## 6. The Product Test

The implementation succeeds if a user can:
1. Start with a rough idea.
2. Talk naturally about it.
3. Have the system investigate and challenge the idea.
4. Reach an agreed understanding of what is worth building.
5. Receive a coherent build prompt.
6. Copy that prompt into Google AI Studio and build.
7. Return to the Orchestrator with what happened in AI Studio (e.g. "auth works, but data import is broken").
8. Have the Orchestrator retain context, diagnose the change, and produce a targeted update.
9. Copy and iterate in AI Studio until the project is complete.

Nothing else needs to be proven in the first version.

---

## 7. Persistent Project Model & Continuity Architecture

### Core Mental Model
This application is a persistent project environment, similar in mental model to opening a software project in an IDE.
The user is not chatting with a generic AI. The user is working on **ONE ongoing project**.
The conversational PM is the interface through which the user works on that project.

Internally structured as:
```
PROJECT
  ├── project identity (id, title, timestamps)
  ├── accumulated understanding
  ├── conversation / history
  ├── decisions and established requirements (architecture, stack, data models, non-goals)
  ├── current Build Prompt (living implementation specification for Google AI Studio)
  └── latest feedback / change state (AI Studio iteration logs)
```

### The Critical "Sniper" Principle
Continuity is more important than prompt generation.
The system must NOT behave like:
`User message → regenerate everything from scratch`

It must behave like:
`Existing project state + New information → Determine delta → Apply targeted change → Updated project state`

> **ESTABLISH ONCE.**  
> **PRESERVE WHAT IS KNOWN.**  
> **INVESTIGATE WHAT CHANGED.**  
> **MODIFY PRECISELY.**

### Targeted Iteration & Significant Changes
- **Targeted Refinement**: Change the smallest valid set of project decisions necessary to keep the whole project coherent.
- **Handling AI Studio Feedback**: (e.g. *"The login works, but data import is broken"*, *"AI Studio changed the dashboard and now export is broken"*). Retain working components, isolate the problem area, and update only the relevant parts of the specification.
- **Major Architectural Shifts**: If the user makes a significant pivot (e.g. switching from local storage to a hosted cloud database), identify which decisions depend on the old model, preserve unaffected decisions, revise dependent architecture, and maintain internal consistency without creating contradictory stacking.
- **No Project Reset**: The active project remains authoritative across browser sessions and days until the user deliberately starts a new project.

