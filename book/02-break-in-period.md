# Chapter 2: The Break-in Period — The Hidden Tuition

> **Thesis**: Everything in this book only works *after* you and your workflow have co-adapted. Most people who conclude "parallel AI is hype" are stuck in Phase 1 of a four-phase break-in and don't know there are three more phases ahead.

---

## What "break-in" means

Break a new pair of leather boots in and the first week hurts. Run a new engine for a thousand miles before you trust it at redline. Hire a senior engineer and expect three months before they're producing at their real level. In all three cases, the tool and the environment are *co-adapting* — the tool shaping to the task, the environment learning the tool's real edges.

AI agent workflows are the same. You don't install parallel development; you break into it. The residue of the break-in period — skills you've written, prompt templates you've refined, task-decomposition habits you've learned, failure modes you now know to avoid — is what makes the three keys in Chapters 3, 4, and 5 actually pay off. Without that residue, the mechanisms in those chapters are just words on a page.

This is the chapter most AI development books skip, because it's not flattering to sell. Everyone writes about the destination; almost no one writes about the road.

## The four phases

The break-in isn't gradual in the sense of smooth. It has shape. Four phases, each with a distinct experience and a distinct signal for when you've moved on.

### Phase 1: Chaos

**What it feels like**: You've read this book or something like it. You launch three agents at once. Within an hour, two of them have touched overlapping files, one has interpreted the requirement in a way you didn't intend, and you have three PRs to review that all need substantial rework. By the end of the day, you're more tired than if you'd written the code yourself, and the output is worse.

**The conclusion people draw at this stage**: "Parallel AI is hype. It doesn't work."

**Why they're wrong**: Every step of that disaster was predictable. You hadn't built the shared-context substrate (skills, `AGENTS.md`, architectural norms) that keeps three agents coherent. You hadn't written the test plans that would have caught the interpretation drift early. You hadn't picked orthogonal tasks that wouldn't collide. This isn't the workflow failing — it's you being a Phase 1 user of a Phase 4 workflow.

**Signal you're leaving Phase 1**: You start recognizing *categories* of failure instead of individual bugs. "Oh — the agent does this thing again where it invents a utility function when one already exists." Once you can name a failure mode, you can write a skill for it.

### Phase 2: Awareness

**What it feels like**: You're still mostly running one agent at a time. But you've stopped reacting to each mistake individually. You're starting to notice that the agent keeps getting one particular thing wrong, or keeps making the same architectural guess, or keeps missing one kind of edge case. Your `AGENTS.md` grows. You write your first real skill — probably covering a specific class of mistake that cost you a lot in Phase 1.

**What the work looks like**: Less time typing, more time writing down rules. You feel like you're doing "less engineering," and that feels wrong, but the code quality starts climbing.

**Signal you're leaving Phase 2**: You start *reusing* skills across tasks without modification. The first time you invoke a skill you wrote two weeks ago on a new feature and it Just Works, you've moved on.

### Phase 3: Templating

**What it feels like**: You have a working playbook. Requirement alignment follows a shape you recognize. Test plans come out looking roughly similar in structure. Code review, when you do it, checks the same handful of things the skills should have already covered. You might have two agents running at once regularly now, usually on tasks you deliberately picked because they don't collide.

**What the work looks like**: New skills still get written, but the rate is slowing. You're no longer finding new categories of mistakes; you're refining the skills you have.

**Signal you're leaving Phase 3**: You start successfully running *more than three* agents concurrently on non-trivial work, and you don't spend the whole day context-switching. The scheduling patterns in Chapter 7 start feeling natural rather than effortful.

### Phase 4: Leverage

**What it feels like**: The three keys run on autopilot for most work. Parallel agents produce code in a consistent style. You spend most of your time on requirement alignment and high-level judgment, not execution. When you read tech Twitter claiming "AI doesn't work for real dev," you know they're not lying — they're just describing Phase 1.

**What you can do here that you couldn't do earlier**: best-of-N as a default (Chapter 6), agent-internal parallelism (Chapter 7 mode 4), and — honestly — taking on work that would have been too ambitious for a solo engineer. This is the leverage the book is actually selling.

**The trap of Phase 4**: You forget the break-in. You recommend the workflow to a friend, they land in Phase 1 overnight, and they conclude you were lying.

## How long each phase takes

There is no honest universal answer. Factors that dominate:

- **Codebase maturity.** A codebase with strong conventions, good tests, and a clear module structure shortens every phase.
- **How much you write down.** Phase 2 is essentially "writing things down." Engineers who default to verbal knowledge transfer move through it slowly.
- **Tool churn.** Every time you switch primary agent (Cursor → Claude Code → Codex), you reset somewhere between a full phase and a half.
- **Team size.** A solo developer moves faster through early phases; a team plateaus until the shared skills are written down for everyone.

My rough calibration, and I want to be honest that this is calibration, not measurement: most solo engineers reach Phase 3 with one codebase they care about. Fewer reach Phase 4. Teams reach Phase 4 with a codebase only when someone has explicitly invested in writing skills as a shared asset.

## What to measure

You can't manage what you don't measure. The cheapest break-in-phase metric I know of is **new-skill-per-week rate** on a codebase you work on seriously:

- Phase 1: zero (you don't know what to write yet)
- Phase 2: 2–5 per week (the floodgates open)
- Phase 3: declining, from 2/week toward <1/week
- Phase 4: near zero on steady state; brief spikes when you touch a new subsystem

When the rate drops near zero *and* you're shipping cleanly, you're in Phase 4. When the rate drops near zero *and* you're shipping poorly, you've stopped paying attention.

A secondary signal: **the ratio of time spent on requirement alignment to time spent on review**. In Phase 1, review dominates because you don't trust the output. In Phase 4, alignment dominates because review is mostly automated. The crossover usually happens somewhere in late Phase 2.

## How the Opus 4.5 "inflection" actually works

Chapter 1 hedged carefully about the "late 2025 capability jump." The break-in framework explains the hedge.

Model capability raises *the ceiling of what Phase 4 can do*. It does not shorten Phase 1, Phase 2, or Phase 3 for you. This is why the same model release looks world-changing to one engineer and unremarkable to another. The one who already had a skill library, a test-plan habit, and a worktree-based workflow got more leverage from the better model. The one who'd been typing prompts into a single chat window got a slightly smarter chat window.

> **The model raises the ceiling. The break-in determines how close to the ceiling you actually live.**

## Skills as residue, not recipes

One subtle implication of the break-in frame: **skills are not a library you download; they are the fossil record of your break-in period.**

A skill that encodes a generic engineering principle — "prefer composition over inheritance," say — is close to useless. An agent already knows that. A skill that encodes "in *this* codebase, background jobs are defined in `jobs/*.ts` and must have a corresponding retry policy defined in `jobs/retries.ts`, and the agent keeps forgetting the second part" — that one is gold, because it's specific to your scar tissue.

This is why copying someone else's `AGENTS.md` wholesale rarely works. Their scar tissue isn't yours. The forty lines of hard-won specificity that make their workflow run are specific to their codebase, their tools, and the mistakes their agent made twice before they codified it. You can steal the *shape* of their skills file, but the content has to be yours.

Chapter 5 treats this more formally. For now, the point is: **your skill library is the visible evidence of how far you've broken in.**

## Advice by phase

Since every reader is at a different phase, the rest of this book's advice is not uniform. A partial map:

- **If you're in Phase 1**: don't try to run more than one agent at a time. Pick small, well-scoped tasks. When something goes wrong, resist the urge to fix it by typing the code yourself — instead, write down *why* it went wrong. That note is your first skill.
- **If you're in Phase 2**: the three keys (Chapters 3, 4, 5) are for you. Start with Key #2 (test plans), because it pays back fastest on a single-agent workflow.
- **If you're in Phase 3**: Chapter 7's modes 2 and 3 are for you. You have enough discipline to run two or three agents concurrently on orthogonal work. Don't reach for mode 4 yet.
- **If you're in Phase 4**: Chapter 6 (cheap failure / best-of-N) is where the real leverage is. Also: you are now a teacher, whether you wanted to be or not. The most common mistake at this phase is confusing your current capability with the baseline everyone else has.

## The tuition metaphor

The break-in period is a tuition. You pay it by spending attention on tasks you could have done faster yourself, watching the agent fail in ways you'd never have failed, and writing down what you saw. There is no refund, there is no accelerator. The only variable is whether you notice you're paying tuition — and keep the receipts (the skills) — or whether you conclude the school is bad and drop out.

> **Everyone pays the tuition. The ones who succeed are the ones who treat the receipts as the asset.**

---

## External voices

- **Supporting**: Simon Willison's long-running blog on LLM workflows effectively chronicles his own break-in, including explicit reversals of position as his tooling matured. Addy Osmani's lifecycle-engineering writing captures the same co-adaptation arc for teams.
- **Challenging**: Many published "AI coding doesn't work" case studies are describing Phase 1 experiences with confidence they have generalized. Worth reading specifically to see the pattern.

> TODO (author's note): drop in 2–3 links — one pioneer who explicitly described their own break-in, one who wrote a skeptical post that on inspection is a Phase 1 report, and if you have it, a link where someone measured their own skill-writing rate over time.

## What's next

Chapter 3 begins Part III with Key #1: requirement alignment. The one step in the whole workflow that genuinely cannot be parallelized.
