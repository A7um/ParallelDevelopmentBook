# Chapter 3: Key #1 — Requirement Alignment

> **Thesis**: Requirements are the one step in the workflow that genuinely cannot be parallelized. Invest deeply here, up-front, or pay for it downstream — across every agent, every test plan, every review.

---

## Why this is the key that can't be avoided

Chapter 1 named three chokepoints that had to be mechanized for parallel dev to pay off. Chapters 4 and 5 will show how to mechanize correctness and maintainability. This chapter has a harder job, because requirement alignment cannot be mechanized. It can only be *compressed* — made faster and more thorough per unit of human attention — so that the unavoidable serial step is as short and as final as possible.

The failure mode of ignoring this chapter is specific and nasty: five agents working in parallel, each with a *slightly* different interpretation of what was asked for, each producing internally consistent code that doesn't fit together. The bug is not in any single agent's output. The bug is in the requirement itself, and it has been copied five times.

> **Ambiguity multiplied by parallelism equals divergence.** You pay for every unresolved requirements gap once per running agent.

## Why one-shot specs aren't enough

The instinct of most engineers, confronted with "write down the requirement," is to open a doc and describe the feature. This is necessary and insufficient. What you write down is the requirement *as it exists in your head*. The problem is that what's in your head is full of gaps you can't see, because they are filled in automatically by your context, your taste, and your knowledge of the codebase. The agent has none of that and will make different fill-in choices than you would.

The job of requirement alignment is not to "write a good spec." It is to **surface and decide every gap that the agent would otherwise guess about.**

Two techniques do most of the work. They are complementary.

## Technique 1: Exhaustive questioning

The move: describe the feature as best you can in natural language, then — *before* the agent starts planning or coding — explicitly tell it:

> Do not begin work. First, list every question you still have about this requirement. Include things that seem small or obvious. I'll answer them, and then you will ask me more questions based on my answers. Continue until you have no more.

Harper Reed's widely-copied Feb 2025 post [*My LLM codegen workflow atm*](https://harper.blog/2025/02/16/my-llm-codegen-workflow-atm/) (ancestral to today's Plan Mode consensus) codified this exact move into a publishable prompt. The prompts remain structurally sound and still circulate in 2026 practice. He opens every project with:

> Ask me one question at a time so we can develop a thorough, step-by-step spec for this idea. Each question should build on my previous answers, and our end goal is to have a detailed specification I can hand off to a developer. Let's do this iteratively and dig into every relevant detail. Remember, only one question at a time. Here's the idea: `<IDEA>`

And closes with:

> Now that we've wrapped up the brainstorming process, can you compile our findings into a comprehensive, developer-ready specification? Include all relevant requirements, architecture choices, data handling details, error handling strategies, and a testing plan so a developer can immediately begin implementation.

The two-prompt pair produces a `spec.md` that is already in the right shape to feed into Chapter 4's test-plan step. Adopt his prompts verbatim if you don't want to roll your own; the mechanic is what matters, not the wording.

The agent will produce a list. Some of the questions will feel pedantic. Most of them are the gaps you couldn't see. Answer them. Then:

> Given my answers, list any new questions that have surfaced.

Repeat until the questions go trivial or repetitive. For a medium feature, 10–30 minutes. For a complex one, an hour. This feels long until you compare it to the cost of an agent interpreting the gap three different ways in three different branches.

When it's done, have the agent produce a structured spec document, not prose. Sections for: user goal, inputs, outputs, happy path, error cases, edge cases, non-goals. That document becomes the input to everything downstream — test plan, architecture, scheduling.

### Why this works

Agents are good at generating candidate questions from a requirement description. They've seen millions of requirements and they pattern-match well. They are *not* good at making silent decisions that match your taste — but you never asked them to make silent decisions. You asked them to expose every decision point.

The role swap is the critical thing: **you stop being the writer of the spec and become the answerer of questions.** Answering is a cheaper cognitive operation than composing. You can answer forty questions in the time it would take you to write a spec that would have covered fifteen of them.

## Technique 2: Solution generation + human filter

The move, for requirements where you genuinely don't care much about some of the details: describe the feature as before, but this time tell the agent:

> Identify the decision points in this requirement — the places where a reasonable engineer would have to decide between multiple plausible options. For each, propose the top three options, drawing on how comparable products handle this (search the web if needed). Recommend one, with a one-line rationale. I will pick.

The agent comes back with decision points you hadn't thought of — "should unregistered users get a preview of this?" "what does the error state look like when the payment provider times out?" — each with three options and a recommendation. You read the recommendations, agree with most of them, overrule one or two, and in twenty minutes you have an aligned spec for something that would have taken an hour of questions-and-answers.

### When to prefer this over Technique 1

Technique 1 is heavier and more thorough. Technique 2 is lighter but leans on the agent's prior — its model of how similar products behave. Use Technique 1 when:

- the requirement is core to the product (you have taste here and need to express it)
- the domain is unusual (the agent's prior won't match your reality)
- the stakes of getting a minor decision wrong are high

Use Technique 2 when:

- the requirement is auxiliary (auth flow, export format, pagination style)
- you genuinely don't have strong opinions on most of the details
- you'd rather spend your attention on something else

In practice, most serious features use both: Technique 1 for the core, Technique 2 for the edges.

## Complexity-triaged depth

Chapter 2 introduced a heuristic from the author's own practice:

> **The higher the complexity, the deeper you audit. The lower the complexity, let it go.**

This applies directly to requirement alignment. Signals for "go deep":

- irreversible actions (payments, deletions, external API calls with side effects)
- cross-team dependencies (someone else has to integrate with what you build)
- novel problem domains (agent's prior is probably wrong)
- anything touching auth, permissions, or billing

Signals for "let it go":

- CRUD features with well-understood patterns
- internal tools or one-off scripts
- anything easily reversible

For "let it go" work, fifteen minutes of Technique 2 is often enough. For "go deep" work, budget an hour and use both techniques in sequence: Technique 1 first to expose everything, Technique 2 second to resolve the long tail you don't care about.

## The deliverable

The output of requirement alignment is a document, not a conversation. The conversation is the means; the document is the artifact. The document has to be crisp enough that:

- a different agent, given only this document, would build the same thing
- the test plan in Chapter 4 can be written directly from it
- when the agent returns halfway through execution with a question, you can point at a section of the document and say "answered."

The last property is especially important. The whole reason you're doing this step is so the agent doesn't need you mid-execution. If the document doesn't answer the mid-execution questions, you haven't finished alignment — you've just delayed the conversation.

## Worked example — the 2026 Plan Mode + Spec-Driven Development flow

The industry has converged, in the six months before this chapter was written, on a specific shape for requirement alignment. It goes by two names that refer to the same structural move: **Plan Mode** (in tool vocabulary — Claude Code, Cursor's planning step, Gemini's antigravity) and **Spec-Driven Development (SDD)** (in methodology vocabulary — see the [Augment Code practitioner's guide, April 2026](https://www.augmentcode.com/guides/what-is-spec-driven-development) and the Jan 2026 [arxiv paper of the same name](https://arxiv.org/abs/2602.00180)).

Both crystallize a pattern earlier practitioners were hand-rolling in 2025. The authoritative shape today is a four-phase cycle, well-documented in the [*Plan Mode in Claude Code* guide (Feb 2026)](https://codewithmukesh.com/blog/plan-mode-claude-code/) and [Addy Osmani's late-2025 workflow post](https://addyosmani.com/blog/ai-coding-workflow/):

**Phase 1 — Explore (read-only).** Enter the agent's Plan Mode — a read-only context where it can grep the codebase, map dependencies, and read specs, but cannot modify files. You narrate what you want; the agent explores the terrain and surfaces what it already knows and what it needs to ask. This is where Technique 1's exhaustive-questioning loop runs.

**Phase 2 — Plan (spec + implementation plan).** The agent produces an implementation plan against the spec. In SDD vocabulary, a plan-ready spec now requires six concrete elements (paraphrased from the [Augment guide](https://www.augmentcode.com/guides/what-is-spec-driven-development)):

1. *Outcomes and scope* — what to build, explicit about what's out.
2. *Constraints and prior decisions* — hard pins on libraries, schemas, non-negotiables, so the agent doesn't re-invent them.
3. *Task breakdown* — decomposition into discrete sub-tasks small enough to fit one context.
4. *Verification criteria* — explicit, testable acceptance conditions for each sub-task. These become the contract for a separate Verifier agent in Chapter 4.
5. *Interfaces between sub-tasks* — so that parallel execution (Chapter 7) becomes safe.
6. *Model tiering* — which roles use which models. Current 2026 convention: use your most capable model for *spec writing*, mid-range for *implementation*, fast/cheap for *verification*.

Write the spec to a file — the community has largely unified on `docs/plans/<feature>.md` or `spec.md` in the feature worktree. `AGENTS.md` (covered in Chapter 5) references it. The conversation that produced it is disposable; the file is not.

**Phase 3 — Implement (small chunks).** Hand the plan to an execution agent. The agent works one sub-task at a time, with the spec's verification criteria as its red/green signal.

**Phase 4 — Commit.** Structured PR (see the `end-of-task-report` skill in Chapter 8) referencing the plan file.

### The "one-sentence rule"

A useful micro-practice from the [Plan Mode guide](https://codewithmukesh.com/blog/plan-mode-claude-code/): **if you can describe the required diff in one sentence, skip the plan. Otherwise, Plan Mode is mandatory.** That rule sets a clean cutoff between "alignment is overhead" and "alignment is the work." It's the practical answer to the critique that spec-first is too heavy for small changes.

### What this looks like historically

This shape did not appear from nowhere. Harper Reed's Feb 2025 post *[My LLM codegen workflow atm](https://harper.blog/2025/02/16/my-llm-codegen-workflow-atm/)* was the first widely-copied public write-up of the three-file pattern (`spec.md` + `prompt_plan.md` + `todo.md`). His prompts are still circulating and are structurally sound — they're the 2025 ancestors of the 2026 Plan Mode convention. If you want a runnable starting point for a tool that doesn't have Plan Mode built in, Reed's [original prompts](https://harper.blog/2025/02/16/my-llm-codegen-workflow-atm/) are a solid place to start; just know that the 2026 convention adds verification criteria and interface specification as mandatory elements Reed's original prompts underweighted.

The structural claim the Plan Mode / SDD consensus makes — and that I'm endorsing here — is: **requirement alignment produces a file with six specific elements, the agent's implementation is contractual against that file, and the file is a first-class repo artifact reviewed at complexity-triaged depth.**

## A second pattern worth stealing: specs-as-files

Reed's workflow puts the output of the alignment step into `spec.md` and the planning output into `prompt_plan.md` + `todo.md`. Addy Osmani's [*My LLM coding workflow going into 2026*](https://addyosmani.com/blog/ai-coding-workflow/) lands on the same structure independently, and Geoffrey Huntley's Ralph loop is built on `PROMPT.md` plus a `specs/` directory. Three pioneers, three independent workflows, one shared move:

> **The alignment artifact is a file, not a conversation.** Files are portable across agents, they survive session compaction, and they make "what we agreed" legible to a future sub-agent that wasn't present when you agreed it.

If there's one thing you steal from this section, let it be that: the deliverable of requirement alignment is a document named `spec.md` (or whatever your project's convention is), sitting in the repo, referenced by every downstream step. The conversation is the means; the file is the artifact.

## Why requirement alignment cannot be parallelized

Everything else in this book can be parallelized. Requirement alignment cannot. It requires:

- your deepest attention (you are making decisions that shape everything downstream)
- your serial cognitive bandwidth (you can only think deeply about one feature at a time)
- your taste (which the agent doesn't have)

This constraint has a practical consequence for scheduling. When running three or four agents in parallel, the realistic cadence looks like this:

1. Align requirements on task A (30 min of your attention)
2. Hand off to agent A for planning + test-plan generation (agent's work, you're free)
3. While agent A works, start aligning requirements on task B
4. Hand off to agent B
5. While B plans, check on A's test plan, approve or adjust
6. Continue the rotation

You are serial on alignment, parallel on everything else. Think of alignment as the loading step and execution as the firing step of a rifle: the rifle fires many rounds at once; it loads one at a time.

## A checklist for "alignment is done"

Before you let an agent move from "planning" to "coding":

- [ ] The spec names the user goal in one sentence.
- [ ] Every input to the feature has a defined type, default, and validation rule.
- [ ] Every output has a defined type and format.
- [ ] The happy path is described end-to-end.
- [ ] Every error case has a defined behavior — user-facing message, retry policy, or escalation.
- [ ] Non-goals are listed (things an agent might plausibly add that you don't want).
- [ ] Every decision the agent asked about has an answer written in the document.
- [ ] If another agent, not the one you're working with, were handed only this document, you'd expect them to build the same thing.

If any box is unchecked, you are not done aligning. If you hand off now, you will pay for it in Chapter 4 or later.

## The zero-review reference

The `zero-review/auto-req` skill is the author's concrete encoding of the two techniques above into a runnable skill that an agent can follow. It's referenced throughout the book; it's worth reading to see what "requirement alignment encoded as a skill" looks like end-to-end.

*Reference*: [`zero-review/auto-req`](https://github.com/A7um/zero-review/tree/main/skills/auto-req)

---

## External voices

- **Supporting — 2026 SDD consensus**: the [Augment Code Spec-Driven Development guide (April 2026)](https://www.augmentcode.com/guides/what-is-spec-driven-development) codifies the six-element spec and the spec-first / spec-anchored / spec-as-source rigor levels. The Jan 2026 paper of the [same name](https://arxiv.org/abs/2602.00180) is the academic companion.
- **Supporting — Plan Mode as a tool primitive**: [*Plan Mode in Claude Code* (Feb 2026)](https://codewithmukesh.com/blog/plan-mode-claude-code/) and the [Get AI Perks complete guide (Mar 2026)](https://www.getaiperks.com/en/articles/claude-code-plan-mode) are the current how-tos. Plan Mode essentially turns the exhaustive-questioning loop of this chapter into a tool feature; if you're using Claude Code, use Plan Mode every time the change exceeds the one-sentence rule.
- **Supporting — harness, don't prompt**: Mitchell Hashimoto in [*My AI Adoption Journey* (Feb 2026)](https://mitchellh.com/writing/my-ai-adoption-journey) reports that `AGENTS.md`-style constraint documents plus deterministic hooks matter more than any individual prompt. Requirement alignment, in his framing, is partly a document the agent reads and partly a harness that catches the classes of mistake documents can't.
- **Challenging — "requirements change until they don't"**: Hillel Wayne's *[Requirements change until they don't](https://buttondown.com/hillelwayne/archive/requirements-change-until-they-dont/)* is the right push-back on spec-first purism — when the requirement is genuinely fluid, heavy up-front specification is expensive and often wrong. His point does not invalidate this chapter's technique; it tightens the scope: use the deepest alignment on the parts of the requirement you believe won't move, and keep the mobile parts light. The one-sentence rule above is one practical response to his critique.

## What's next

Chapter 4 covers Key #2: how to replace line-by-line code review with a test plan written *before* coding starts, and audited at a depth proportional to the complexity of the work.
