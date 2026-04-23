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

- **Supporting**: spec-first tools (Amazon's Kiro, various "spec-as-input" pipelines) and the `aider` architect/editor split both land on the same insight: separating specification from execution is the single highest-leverage structural move in agentic coding.
- **Challenging**: some practitioners argue that spec-first is overkill for exploratory or prototype work, where the point is to discover the requirement by writing code. This critique is mostly right for Phase 1 prototyping and mostly wrong for anything that will be maintained.

> TODO (author's note): pick your favorite links on spec-first development — particularly any on how Claude Code / Cursor users handle requirement capture.

## What's next

Chapter 4 covers Key #2: how to replace line-by-line code review with a test plan written *before* coding starts, and audited at a depth proportional to the complexity of the work.
