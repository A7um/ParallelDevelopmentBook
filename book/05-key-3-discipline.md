# Chapter 5: Key #3 — Engineering Discipline as Code

> **Thesis**: Skills are not a one-time install. They are the living residue of your break-in process, encoding *this* project's specific bad habits. The generic engineering principles are the starting line, not the finish.

---

## Why correctness isn't enough

Chapter 4 made correctness a mechanism. A piece of code can be correct and still be catastrophic for the codebase — badly structured, overcoupled, using three different naming conventions, inventing utilities that already exist two directories over. Correctness gets you past today; **maintainability** decides whether next week's agent can work in the code you shipped this week.

In a one-agent, human-reviewed workflow, maintainability was enforced by you in review. You'd say "don't use inheritance here, use a strategy object" and the agent would adjust. That path doesn't scale to three agents producing three PRs in the same hour. Either you enforce it by mechanism, or it stops getting enforced.

The mechanism is **skills**. Skills are structured documents, loaded at agent startup, that shape how the agent approaches design and self-reviews its output. They turn "things you'd say in review" into "things the agent checks before it ships."

## Generic principles — the starting line

Good software design has core principles, most sharply articulated by John Ousterhout in *A Philosophy of Software Design* and refined by decades of practice. The agent, like a new hire, benefits from being told these explicitly rather than trusted to infer them from the codebase:

- **Deep modules.** Simple interfaces, significant functionality behind them. Agents default to breaking things into too-small pieces; the skill should push back explicitly.
- **Information hiding.** Modules shouldn't leak internals. The agent's common failure mode here is splitting by execution order ("step A module, step B module") instead of by knowledge ownership — which almost guarantees leakage.
- **Layered abstraction.** Each layer provides a distinct mental model. A layer that only forwards calls to the next layer isn't earning its keep.
- **Cohesion and separation.** Code that must be understood together stays together; generic and special-case logic that confuses each other gets split.
- **Error handling through definition.** Prefer designs that *define errors away* (default behavior, simplified semantics) over designs that spray `try/catch` everywhere.
- **Naming and obviousness.** Readers shouldn't be surprised. Names should be specific, consistent across the codebase, and free of invented abbreviations.
- **Documentation that adds information.** Comments should describe what the code cannot — intent, trade-offs, invariants. Not what it literally does.
- **Strategic over tactical design.** Every change is an investment in the structure. Quick fixes compound into tech debt with interest.

These are good defaults. Encoded as a skill, they put the agent in a place where its first-draft architecture is substantially better than its default.

But generic principles have a ceiling. An agent that "knows" these principles can still:

- Miss that your codebase has an established utility module and invent a parallel one.
- Use a naming style that matches one file you wrote in 2023 but not the rest of the codebase.
- Choose a design pattern that is correct in the abstract but doesn't match the conventions of the framework you're using.

The generic skill can't catch these because they are **specific to your project**. Past the generic line, skills have to be yours.

## Project-specific skills — the real asset

The skills that actually move the quality needle are the ones that encode the mistakes *your* agent made *in your codebase*. Examples, all paraphrased from real cases:

- *"Background jobs go in `jobs/*.ts` and must register a retry policy in `jobs/retries.ts`. The agent has forgotten the registration twice; don't let it ship without checking both files."*
- *"React components in this codebase use `styled-components`, not Tailwind. The agent tends to reach for Tailwind because most of its training data does. Enforce the local choice."*
- *"API routes return `{ok, value}` or `{ok, error}` — never raw payloads, never thrown errors across the boundary. The agent gets this right after being told, but invents variants if not told."*
- *"When adding a new table, also add a seed fixture in `test/fixtures/` or integration tests will fail silently."*

These skills feel almost embarrassingly specific. That specificity is their value. A skill that says "follow good naming conventions" is useless; the agent already tries to. A skill that says "in this codebase the convention for handler names is `handle<EntityName><Action>` — the agent tends to write `<entityName>Handler` and gets it wrong" is gold.

> **The generic skills are the default setup. The specific skills are where the break-in residue lives. A mature project has ten of the first and forty of the second.**

## Writing a skill worth keeping

A skill that survives its first month usually has these traits:

1. **It names the failure mode the agent actually exhibits.** Not an abstract principle; the specific mistake you noticed twice.
2. **It gives the agent a concrete rule or check, not advice.** "Check that `jobs/retries.ts` has a registration for this job before considering the change complete" is actionable. "Be careful with background jobs" is not.
3. **It has an example.** One short example of the right thing, ideally from the codebase. One short counter-example if the mistake is subtle.
4. **It is small.** Five lines, not fifty. Skills that try to cover too much get skimmed by the agent the same way long docs get skimmed by humans.

If you find yourself writing a fifty-line skill, you probably have three skills fighting to get out. Split them.

## The three-stage execution flow

With skills in place, the work an agent does on a feature looks like this:

1. **Architecture design.** Given requirement spec (Ch 3) and test plan (Ch 4), the agent proposes module boundaries, interfaces, file organization, and abstractions. It does this with skills loaded — so the design already reflects the deep-modules, information-hiding, naming-consistency rules. The human reviews this design at complexity-triaged depth. Getting this step right is what makes Chapter 7's mode 4 (agent-internal parallelism) possible at all, because the interface contracts defined here are what let sub-agents work in parallel without colliding.
2. **Implementation and verification.** The agent writes code and tests, runs the suite, debugs failures, iterates to green (Chapter 4).
3. **Self-audit.** Before declaring done, the agent re-reads its own diff with the skill set loaded and checks for violations: shallow modules, redundant layers, inconsistent naming, utilities that duplicate existing ones. It fixes what it finds.

Steps 1 and 3 are new. They replace the architectural judgment and final polish that you'd otherwise apply in review. You're still involved — you approve the architecture, you spot-check the self-audit on high-complexity work — but you are no longer the *only* line of defense.

## Where skill injection still isn't enough

Being honest about the limits:

- **Conflicts between principles.** Deep modules vs small composable pieces; strategic design vs YAGNI. These genuinely conflict, and skills can't arbitrate — judgment does. For contested cases the agent needs explicit guidance in the skill: "in *this* codebase, prefer deep modules even if it means the module is harder to unit-test in isolation; we value the interface simplicity more."
- **Cross-cutting concerns.** Security, observability, performance — they don't live in one module, and a skill that says "think about security" is too vague to act on. These usually need either (a) dedicated tooling (linters, scanners) or (b) very specific skills ("on any endpoint that writes to the database, require that the caller's permission was checked in the handler before the DB call").
- **Taste drift between agents.** Different agents trained on different data have different biases. A skill set tuned to Claude may read differently to a Codex model. This is a real limit of the portability story; budget time for re-tuning when you switch primary agents.
- **Novel subsystems.** The first time you touch a new framework, a new language, or a new service, you don't yet know the failure modes. There are no skills to write yet. You pay tuition (Chapter 2) on that subsystem specifically, then write skills from what you learned.

None of these is fatal. All of them mean "skills get you a long way, not all the way."

## The link to parallel scheduling

This chapter lives in Part III of the book, about unlocking parallel work. The connection to Chapter 7 (scheduling patterns) is direct:

- Modes 1–3 work better when agents load a shared skill set. Without it, three agents produce three styles of code and merges become a mess.
- **Mode 4 — agent-internal parallelism — is essentially impossible without interface contracts defined in the architecture step.** Sub-agents working in parallel on different modules can only merge cleanly if the interfaces between them were pinned down up-front. This is the direct dividend of Key #3: the architectural discipline you enforce is what makes parallel decomposition feasible.

Skipping architecture and letting the agent "just code" is the single fastest way to lose the parallel benefit. It works for one agent on a small feature. It catastrophically fails with three agents on a medium one.

## The zero-review reference

The `zero-review/auto-dev` skill encodes this three-stage loop — architecture design, implementation-and-verification, self-audit — as a runnable skill, including Ousterhout-derived design principles and a concrete self-audit checklist. It's worth reading as the canonical example of "engineering discipline encoded as a skill."

*Reference*: [`zero-review/auto-dev`](https://github.com/A7um/zero-review/tree/main/skills/auto-dev)

---

## External voices

- **Supporting**: *A Philosophy of Software Design* (Ousterhout) remains the best single source on the underlying principles. Anthropic's own "skills" documentation formalizes the injection mechanism; Addy Osmani's lifecycle-engineering skills are a library of worked examples.
- **Challenging**: critics of "rules-based design" argue that encoded principles ossify into cargo-cult checklists that miss the point. This is a real risk, especially for generic skills. The counter is that project-specific skills don't generalize and therefore don't ossify — they stay tied to the scar they came from.

> TODO (author's note): Ousterhout link; Anthropic skill docs; one or two pioneer posts where someone wrote a post-mortem of a skill they wrote, used for a month, and then deleted because it turned into checklist noise.

## What's next

Part III is complete. Chapter 6 opens Part IV with the economic phase-change that unlocks parallel *execution*: when attempts cost minutes instead of hours, exploration gets cheap, and best-of-N stops being a luxury.
