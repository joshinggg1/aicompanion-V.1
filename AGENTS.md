# Developer Brief — Living Master Prompt System

## Core Product Definition

Build a conversational prompt-generation system whose primary purpose is to help a user progressively develop, refine, validate, and finalize an optimized master prompt for an AI software project.

The conversation is the working environment. The master prompt is the evolving specification produced from that conversation.

The system must not behave as a generic chatbot that simply waits for a request and generates a build prompt. It must maintain continuity across the conversation and continuously incorporate accepted project decisions into the current master prompt.

---

## 1. Living Master Prompt

Maintain one canonical, evolving master prompt for the current project.

As the conversation progresses:
- New accepted requirements are incorporated.
- Existing requirements are refined when the user changes them.
- Rejected requirements are not retained as active requirements.
- Superseded decisions are replaced by their latest accepted version.
- Earlier generated prompts are not treated as the source of truth.
- The latest canonical project definition is always authoritative.

The master prompt should represent the current state of the project, not merely summarize the original request.

---

## 2. Conversation Lifecycle (5 Stages)

Use the following lifecycle:

1. **UNDERSTAND**: Establish what the user is actually trying to create.
2. **EXPLORE**: Identify missing workflows, mechanics, constraints, dependencies, capabilities, and consequential decisions.
3. **DEFINE**: Continuously update the canonical project definition and living master prompt as decisions are accepted.
4. **READINESS GATE**: Determine whether the current project definition is sufficiently complete and internally consistent to produce an implementation prompt.
5. **GENERATE**: When the project is ready, produce the implementation prompt from the current master prompt.

These stages describe the reasoning process, not separate projects or conversations.

---

## 3. Readiness is a Quality Gate

Do not generate an implementation prompt merely because the user has described an interesting idea.

Before generation, verify:
- Core purpose is understood.
- Primary user workflow is defined.
- Inputs and outputs are known.
- Important capabilities are explicitly established.
- Consequential architectural decisions are resolved or deliberately chosen for the prototype.
- Important ambiguities have been addressed.
- Accepted decisions are internally consistent.
- No previously accepted requirement has been lost.

If these conditions are not met, withhold the implementation prompt and continue the conversation with targeted questions.

A blank implementation-prompt area when the project is not ready is correct behavior.

---

## 4. Scope Change and Continuity

When the user introduces a new requirement, determine whether it:
- Extends an existing workflow.
- Creates an alternative workflow.
- Changes the project's core identity.
- Introduces a consequential architectural decision.
- Supersedes an existing requirement.

Do not silently append major changes.

If a change affects the project definition, incorporate it into the canonical state before continuing.

Never revert to an earlier project definition simply because it is easier to describe or generate.

---

## 5. Master Prompt Achieved

The system should support a deliberate state in which the user can recognize that the current master prompt has reached the required level of completeness.

**Prompt Achieved** means the current master prompt represents the agreed project definition and has passed the readiness and consistency checks.

This is a state of the evolving specification, not a new project.

If the user subsequently changes a consequential requirement, the master prompt must be updated and the project may leave the achieved state until it is validated again.

---

## 6. Target-Specific Projections (BUILD / DEV / CREATE)

The system has three interaction/output modes, because the target AI creation environment changes the language, structure, and level of instruction required:

| Mode | Target | Internal Distinction | What the output needs to be |
|---|---|---|---|
| **BUILD** | Google AI Studio / AI app builders | **Detail** ("Build this application") | A detailed implementation/build prompt: architecture, UI, behavior, data, technical constraints, etc. |
| **DEV** | LLM / coding agent (Cursor, Claude Code, Copilot, Aider) | **Plan** ("Develop this software/system") | A developer-oriented specification: technical plan, implementation instructions, files, APIs, code behavior, testing, constraints. |
| **CREATE** | Creative AI tools such as Suno, Midjourney, ElevenLabs | **Brief** ("Create this creative output") | A creative-generation brief: style, content, parameters, creative direction, structure, and tool-specific language. |

### Internal Distinction: Detail / Plan / Brief
- **Build** → Build this application.
- **Dev** → Develop this software/system.
- **Brief** → Create this creative output.

### Architectural Principle: Separation of Project Definition from Output Format
**The system must separate project definition from output format. The canonical master prompt describes what the user wants to create. Target-specific generation determines how that intent must be expressed for the selected creation environment.**

Conceptually:
```
Conversation
↓
Living Master Prompt (Canonical Specification)
↓
Select Creation Target
↓
BUILD / DEV / CREATIVE BRIEF
↓
Target-specific optimized output
```

The master prompt remains the same underlying project definition, but the system creates a target-specific projection of that master prompt.

---

## 7. Downstream Project Representation

Once a master prompt is achieved, it may be used to produce a structured representation of the intended software project, such as:
- Project architecture.
- Repository structure (file and folder tree).
- Component or module relationships.
- Implementation plan.

This representation must be derived from the achieved master prompt.

It must never invent project requirements that are absent from the canonical definition.

A future version may connect this representation to a live GitHub repository, allowing the repository structure to evolve alongside the master prompt. Live GitHub integration is not a required V1 capability.

---

## 8. Anti-Hallucination

Never fill gaps in the project definition with generic software architecture.

Do not invent:
- CRUD entities.
- ItemRecord-style generic models.
- Storage systems.
- Authentication.
- APIs.
- Database schemas.
- UI controls.
- Workflows.
- Features.

unless they are required by the established project definition or explicitly chosen by the user.

When information is genuinely consequential and missing, ask for it rather than inventing it.

---

## 9. Pre-Generation Consistency Check

Immediately before producing an implementation prompt, reconstruct the current canonical project definition.

Verify that the generated prompt:
1. Contains all currently accepted requirements.
2. Reflects the latest decisions.
3. Excludes superseded or rejected requirements.
4. Preserves all established workflows.
5. Does not regress to an earlier project version.
6. Does not introduce unsupported architecture.

The implementation prompt is a derived output of the master prompt, not a fresh interpretation of the conversation.

---

## 10. Core Principle

The system's job is not simply to produce prompts.

Its job is to help the user progressively create a correct, complete, current, and internally consistent master prompt.

The quality of the system is therefore measured not only by the quality of the final implementation prompt, but by its ability to:

`understand → retain → refine → reconcile → validate → finalize`

the user's project without losing decisions, inventing requirements, or reverting to earlier versions.

- The conversation develops the specification.
- The master prompt is the canonical specification.
- The target output (BUILD / DEV / CREATE) is the derived projection.
- The repository/project representation is a downstream artifact.

---

## 11. Operational Guidelines

### Build Loop
1. Start project
2. Understand what we're building
3. Develop Master Prompt & verify Readiness Gate
4. Generate Implementation Prompt for AI Studio
5. Copy to AI Studio (`https://ai.studio/build`)
6. Build / test in AI Studio
7. Return with feedback / observation
8. Orchestrator retains project continuity & targets only what changed
9. Repeat until Master Prompt Achieved & project complete

### Principle: Sniper Continuity
- **ESTABLISH ONCE.**
- **PRESERVE WHAT IS KNOWN.**
- **INVESTIGATE WHAT CHANGED.**
- **MODIFY PRECISELY.**


