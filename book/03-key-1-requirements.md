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

Harper Reed's widely-shared *[My LLM codegen workflow atm](https://harper.blog/2025/02/16/my-llm-codegen-workflow-atm/)* codified this exact move into a publishable prompt. He opens every project with:

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

## Worked example — Harper Reed's three-stage flow

The single most-copied alignment workflow in public practice is the one Harper Reed published as *[My LLM codegen workflow atm](https://harper.blog/2025/02/16/my-llm-codegen-workflow-atm/)*. It's worth walking through end-to-end because it is a complete, runnable shape — not a sketch.

**Stage 1 — Idea honing → `spec.md`.**
Open a conversation with a capable general model (Reed uses ChatGPT 4o/o3; Claude and Gemini work equivalently). Paste:

> Ask me one question at a time so we can develop a thorough, step-by-step spec for this idea. Each question should build on my previous answers, and our end goal is to have a detailed specification I can hand off to a developer. Let's do this iteratively and dig into every relevant detail. Remember, only one question at a time.
>
> Here's the idea: `<IDEA>`

Answer the questions until the model stops finding new ones. Then close with:

> Now that we've wrapped up the brainstorming process, can you compile our findings into a comprehensive, developer-ready specification? Include all relevant requirements, architecture choices, data handling details, error handling strategies, and a testing plan so a developer can immediately begin implementation.

Save the output as `spec.md` in the repo. That file is the stable artifact — not the conversation that produced it.

**Stage 2 — Planning → `prompt_plan.md` + `todo.md`.**
Open a fresh session with a reasoning model (`o1`/`o3`/`r1` in Reed's setup). Paste the contents of `spec.md`, then:

> Draft a detailed, step-by-step blueprint for building this project. Then, once you have a solid plan, break it down into small, iterative chunks that build on each other. Look at these chunks and then go another round to break it into small steps. Review the results and make sure that the steps are small enough to be implemented safely with strong testing, but big enough to move the project forward. Iterate until you feel that the steps are right sized for this project.
>
> From here you should have the foundation to provide a series of prompts for a code-generation LLM that will implement each step in a test-driven manner. Prioritize best practices, incremental progress, and early testing, ensuring no big jumps in complexity at any stage. Make sure that each prompt builds on the previous prompts, and ends with wiring things together. There should be no hanging or orphaned code that isn't integrated into a previous step.
>
> Make sure and separate each prompt section. Use markdown. Each prompt should be tagged as text using code tags. The goal is to output prompts, but context, etc is important as well.
>
> <SPEC>

Save as `prompt_plan.md`. Then ask the same model: *"Can you make a `todo.md` that I can use as a checklist? Be thorough."*

You now have three files in the repo — `spec.md` describing the feature, `prompt_plan.md` describing how it decomposes into test-driven steps, `todo.md` as the execution checklist.

**Stage 3 — Execution.**
Hand `prompt_plan.md` + `todo.md` to an execution agent (Aider, Cursor, Claude Code, Codex). The agent works through the checklist. Your involvement from here is complexity-triaged review, not implementation.

The structural claim Reed's flow demonstrates: **requirement alignment produces three files, each with a distinct role, all living in the repo.** The conversations that produced them are disposable. The files are not.

Addy Osmani's [*My LLM coding workflow going into 2026*](https://addyosmani.com/blog/ai-coding-workflow/) lands on nearly the same shape — his vocabulary is "spec → project plan → iterative refinement" — which is why I'm confident the pattern is structural rather than personal to Reed.

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

- **Supporting — the architect/editor split**: Aider's *[Separating code reasoning and editing](https://aider.chat/2024/09/26/architect.html)* (2024) is the cleanest articulation of the "specify first, implement second" pattern in a production tool. The Aider team showed measurable benchmark gains by pairing a reasoning model (the *architect*) with an editor model, which is the same structural move this chapter advocates at the human-agent boundary. Configuration details are in the [chat modes docs](https://aider.chat/docs/usage/modes.html).
- **Supporting — "plan-first" from inside Anthropic**: Boris Cherny's workflow, summarized in the [Educative recap](https://www.educative.io/newsletter/artificial-intelligence/claude-code-creators-workflow), describes using *Plan Mode* checkpoints to validate intent before execution — essentially the one-shot question-loop described in this chapter, wired into the tool. His [Lenny's interview](https://www.lennysnewsletter.com/p/head-of-claude-code-what-happens) repeats the point: humans design intent, agents execute and verify.
- **Supporting — harness, don't prompt**: Mitchell Hashimoto in *[My AI Adoption Journey](https://mitchellh.com/writing/my-ai-adoption-journey)* reports that `AGENTS.md`-style constraint documents plus deterministic hooks matter more than any individual prompt. Requirement alignment, in his framing, is partly a document the agent reads and partly a harness that catches the classes of mistake documents can't.
- **Challenging — "requirements change until they don't"**: Hillel Wayne's *[Requirements change until they don't](https://buttondown.com/hillelwayne/archive/requirements-change-until-they-dont/)* is the right push-back on spec-first purism — when the requirement is genuinely fluid, heavy up-front specification is expensive and often wrong. His point does not invalidate this chapter's technique; it tightens the scope: use the deepest alignment on the parts of the requirement you believe won't move, and keep the mobile parts light.

## What's next

Chapter 4 covers Key #2: how to replace line-by-line code review with a test plan written *before* coding starts, and audited at a depth proportional to the complexity of the work.
