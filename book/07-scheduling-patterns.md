# Chapter 7: Scheduling Patterns

> **Thesis**: There are four parallel modes, from coarsest to finest, and they match different break-in phases. Don't reach for mode 4 from Phase 1. Don't stay on mode 1 once you're in Phase 3.

---

## What "scheduling" means here

With the three keys in place and cheap failure understood, the remaining question is *how you actually run multiple agents at the same time*. "Open five Claude Code windows and type into them" is a strategy, and a bad one. Different granularities of parallelism have different coordination costs, different failure modes, and different prerequisites in your break-in phase.

Four modes, from coarsest to finest:

| Mode | Granularity | Coordination cost | Break-in phase that can use it |
|---|---|---|---|
| 1 | Across separate projects | Very low | Phase 1+ |
| 2 | Within one project, across non-overlapping features | Low (via `git worktree`) | Phase 2+ |
| 3 | Within one feature, across transaction types | Medium | Phase 3+ |
| 4 | Within one task, across sub-agents | High setup, low runtime | Phase 3–4, mostly experimental |

You will use multiple modes at the same time. A Phase 4 engineer in a busy week might be running mode 1 across three projects, mode 2 inside one of those projects, and mode 3 inside one of those features. That's six agents in flight without even reaching for mode 4.

## Mode 1: Cross-project parallelism

**The move**: you have two or three separate projects (different repos, different products). You run one agent per project, each working its own backlog. Projects don't share code, so agents don't interfere.

**Why it's easy**: there is no coordination. Each project has its own skills, its own conventions, its own requirements. The only thing that's parallel is *your attention*, and you manage that by rotating between the projects at the alignment stage and letting each project execute asynchronously.

**The cadence that works**:

1. Align requirements on Project A. (20–30 min of deep attention.)
2. Hand Project A to its agent for planning and test-plan generation.
3. While Project A works, switch to Project B. Align.
4. Hand Project B to its agent.
5. While B plans, check on A's test plan, approve or adjust.
6. Rotate.

This is the "multiple meeting rooms" mode. You are the tech lead walking between them. If you have the break-in residue to hand off cleanly, this mode costs you almost nothing and gives you two or three projects' worth of throughput on one engineer's schedule.

**Prerequisite**: the project itself has to be in good enough shape to hand off cleanly. A mature project with conventions and skills: trivial. A new project where you're still figuring out architecture: mode 1 doesn't help because the deep attention is on Project A, not on the rotation.

## Mode 2: Worktree parallelism — within one project, non-overlapping work

**The move**: within a single codebase, you have two or three features that don't touch the same files. You create a separate `git worktree` for each, check out a separate branch in each, and run one agent per worktree. They don't interfere because they're in separate directories.

**Why `git worktree` matters**: running multiple agents on the same checkout gets chaotic fast. They fight over the working tree, tests overlap, one agent's WIP changes break another's test run. Worktrees give each agent its own isolated directory tied to the same repo, which solves the mechanical problem cleanly.

**The workflow**:

1. `git worktree add ../project-featureA featureA-branch`
2. `git worktree add ../project-featureB featureB-branch`
3. Launch one agent per worktree, each loading the same shared skills and the same `AGENTS.md`.
4. Each agent runs through Chapters 3–5 independently.
5. When an agent finishes, merge its branch back to main. Resolve merge conflicts — ideally by letting an agent handle the mechanical ones and handling strategy conflicts yourself.

Claude Code ships a convenience shortcut for this: the `claude -w` flag (documented in Cherny's [15-tips roundup](https://www.reddit.com/r/ClaudeCode/comments/1s8oqfn/btw_boris_cherny_shared_15_new_tips_to_use_claude/)) automatically creates a worktree for an agent session, so you don't have to manage the worktree directory manually. If you're using a different agent, the shell commands above work identically; the mechanism is git's, not any specific tool's.

**Rule of thumb on orthogonality**: if the two features mostly touch different files (say, <20% overlap), mode 2 works. If they heavily overlap (>50%), either serialize them or redesign the task boundaries. The time you lose to merge conflicts can easily erase the time you gained from parallelism.

**Break-in prerequisite**: you need enough shared skills (Chapter 5) that two agents working in parallel will produce code in the same style. Without that, merge cleanup is dominated by stylistic inconsistency, which is demoralizing and hard to automate. This is why mode 2 mostly shows up in Phase 2+.

## Mode 3: Cross-transaction-type parallelism — within one feature

**The move**: within a *single* feature, different *kinds* of work can run in parallel even though they're all about the same feature. You launch one agent per work type.

An example, concrete: you're building an "export orders to CSV" feature. Three agents run simultaneously:

- **Agent A — backend correctness.** Builds unit and integration tests around the export logic: empty inputs, giant inputs, concurrent exports, corrupted orders. Writes the backend implementation. Closes the test plan.
- **Agent B — UI end-to-end.** Builds Playwright tests around the export button: clicks it, verifies download, checks error states, tests the disabled state while loading. Writes and adjusts the UI glue code.
- **Agent C — known bug backlog.** Takes the list of small bugs you've been sitting on (unrelated to this feature but in the same area), and works through them so they're not still there when the feature ships.

These three live in the same feature branch but touch different layers. The coordination cost is medium: they share a branch, so order of integration matters. Usually A and C merge first; B waits for A to stabilize the backend before running against it.

**Why this mode matters**: a lot of feature work has this shape — backend logic, UI glue, tests at different levels, an ancillary bug list — and naively one engineer does it all serially. Splitting by transaction type gives you real parallelism within a single feature, without the merge complexity of mode 2.

**Break-in prerequisite**: you need the discipline to define the interfaces between the pieces up-front, so agent B isn't constantly blocked on agent A's decisions. This is the payoff from Chapter 5's architecture step: if the interfaces are specified before coding starts, mode 3 runs cleanly.

## Mode 4: Agent-internal parallelism — within one task, across sub-agents

**The move**: you hand the agent one large task. *The agent* decomposes it into sub-tasks and runs sub-agents in parallel on each, merging the results. You don't manage the decomposition; the top-level agent does.

Claude Code's "team" mode and similar "orchestrator + workers" patterns implement this. The appeal is obvious: you don't have to pre-plan the parallelization, the agent figures it out.

**Why it's the hardest mode**: the agent's decomposition is only as good as the interface contracts it defines. If the sub-agents have to coordinate mid-execution ("what does your function return again?"), they collide, merge badly, or produce incompatible outputs. You are back to the coordination problem, but now solved by the agent, which may or may not be good at it.

**Current state, being honest**: mode 4 is real — it works on scoped, well-specified tasks where the boundaries naturally decompose. On messy real-world tasks where the decomposition itself is the hard part, mode 4 often produces worse results than a single agent running sequentially, because the merge cost outweighs the parallelism gain.

Cognition's [*Devin can now Manage Devins*](https://cognition.ai/blog/devin-can-now-manage-devins) describes their mode 4 implementation from the inside: a coordinator Devin scopes work and monitors progress while each delegated Devin runs in its own isolated VM. Crucially, the same team published [*Don't Build Multi-Agents*](https://cognition.ai/blog/dont-build-multi-agents) — the two are not contradictory. The second post is a warning against *naive* multi-agent patterns that don't share context; the first is an implementation that does. Their explicit principle: **"share context, not just messages"** and **"actions carry implicit decisions; conflicting decisions lead to failure."** If the top-level agent can't share its reasoning trace with sub-agents, and the sub-agents can't converge on compatible decisions, mode 4 degrades to exactly the "chaos" that most skeptical reports describe.

**When it actually pays off**: the same conditions that make mode 3 work, but at a smaller granularity. If the architecture step (Chapter 5) has pinned down module boundaries clearly, and each sub-task fits inside a module, agent-internal decomposition is reliable. If the architecture is vague, it isn't.

**The direct dependency on Chapter 5**: mode 4 is basically the payoff for doing architecture design well. A codebase with well-defined module boundaries and interface contracts is *automatically* amenable to parallel decomposition. A codebase where agents "code-as-they-design" isn't. This is the strongest practical argument for not skipping the architecture step, even when you're tempted.

**When to reach for it**: Phase 3 and up, on tasks where the decomposition is obvious (you could have done it by hand with mode 3 but it's tedious). Treat it as a labor-saver for cases you'd otherwise run mode 3, not as a magic productivity multiplier.

## How many agents at once?

A practical upper bound, roughly:

- **Phase 2**: one or two agents. More than two breaks.
- **Phase 3**: three to four agents comfortably. Five starts requiring deliberate attention discipline.
- **Phase 4**: five to eight, with mode combinations. Past eight, even experienced engineers lose the thread.

Cherny reports running ten to fifteen concurrent Claude Code sessions. That is the high end of what one deeply practiced operator does on a mature codebase; it is not a baseline. Read about his workflow ([Educative](https://www.educative.io/newsletter/artificial-intelligence/claude-code-creators-workflow)) and you see the supporting machinery — numbered terminal tabs, system notifications, a `/commit-push-pr` slash command, a Chrome extension that lets Claude test the UI it builds — that is specifically there to make fifteen agents manageable *by one attention*. Without that machinery, the upper bound drops sharply.

The limiting factor is almost never agent compute or tooling. It's **your ability to keep context while rotating between tasks at the alignment and review stages**. Running too many agents produces more agents but worse decisions at the human-in-the-loop moments — which, from Chapter 1, is where the real bottleneck lives.

> **The right number of parallel agents is the largest number where your alignment and review quality don't degrade.**

## Worked example — Geoffrey Huntley's Ralph Loop as a minimal scheduling primitive

The Ralph Loop, documented publicly at [ghuntley.com/ralph](https://ghuntley.com/ralph/) and in [`how-to-ralph-wiggum`](https://github.com/ghuntley/how-to-ralph-wiggum), is worth studying because it's the simplest functional parallel-agent scheduler anyone has published. Strip it down and it's this:

```bash
while :; do cat PROMPT.md | claude-code ; done
```

That one-liner is the whole scheduler. What makes it work is what it relies on:

- **`PROMPT.md`** — a deterministic prompt that tells the agent, on each fresh invocation, to look at the state of the repo and pick exactly one task to make progress on.
- **`specs/`** — the specification directory, the durable artifact the agent reads to know what "done" means.
- **`IMPLEMENTATION_PLAN.md`** — a live plan the agent reads and updates across iterations.
- **Tests as backpressure** — the agent cannot commit a task that fails tests, so a broken state naturally halts progress on that task until fixed.

Each iteration is a *fresh* context window. No conversation history carries across. This deliberately prevents the "context rot" Huntley identifies as the main failure mode of long-running agent sessions — the thing where an agent, after several hours of back-and-forth, starts repeating earlier mistakes or drifting from its original task. By throwing away context every loop, you pay a small startup cost in return for guaranteed freshness.

Huntley's [`how-to-ralph-wiggum`](https://github.com/ghuntley/how-to-ralph-wiggum) repo further splits the loop into two modes:

- **Planning mode** — read `specs/` and the current `src/`, do gap analysis, update `IMPLEMENTATION_PLAN.md`.
- **Building mode** — read `IMPLEMENTATION_PLAN.md`, pick the most important task, implement it, run tests, commit.

You run planning periodically to keep the plan fresh against the spec, and building most of the time. This is a primitive version of the same *specification-then-execution* split that Aider's architect/editor mode implements inside a single session.

Why is this in the scheduling chapter and not earlier? Because **Ralph is a mode-2/mode-3 scheduler implemented as a shell loop**, with no tool lock-in. You can run it against Claude Code, Codex, or any agent CLI. Two Ralph loops in two worktrees is mode 2. Two Ralph loops in the same worktree against different `PROMPT.md` files (one for backend, one for UI) is mode 3. It is worth understanding because every managed product (Claude Code's team mode, Cursor's background agents, Devin's managed Devins) is, at its core, some variant of this pattern with ergonomics on top.

## Worked example — Cherny's fifteen-session setup

On the other end of the aesthetic spectrum is Boris Cherny's publicly-shared workflow, which uses Claude Code's managed features rather than a bash loop. The setup, assembled from his [X thread](https://x.com/bcherny/status/2007179833990885678), his [15-tips roundup](https://www.reddit.com/r/ClaudeCode/comments/1s8oqfn/btw_boris_cherny_shared_15_new_tips_to_use_claude/), and the [Educative recap](https://www.educative.io/newsletter/artificial-intelligence/claude-code-creators-workflow), looks roughly like this:

- **Five terminal tabs** numbered 1–5, each running a Claude Code session, typically on a separate worktree created via `claude -w`.
- **Another five to ten sessions** running on `claude.ai` in browser tabs, with `claude --teleport` (or `/teleport` in-session) used to move a session between the terminal and the web as convenient.
- **Mobile sessions** started and checked from his phone while away from the desk.
- **`CLAUDE.md`** at the root of each repo, growing by one entry every time an agent makes a mistake worth preventing.
- **Slash commands** for the repeatable parts of handoff — `/commit-push-pr` to stage + commit + push + open a PR in one shot, custom ones for the common workflows in that codebase.
- **Subagents** for specialized roles — a code-simplifier, a test-verifier — invoked from the primary session when their role is needed.
- **Lifecycle hooks** — `PreToolUse` to log shell commands, `Stop` to keep an agent running when it prematurely declares itself done.
- **`/loop` and `/schedule`** — convert workflows into persistent, periodically-running skills. Cherny's example is `/loop 5m /babysit` to run a housekeeping task every five minutes.
- **A Chrome extension** that lets Claude view and click through the UI it has just built — Cherny describes this as a 2–3× multiplier on UI work quality.
- **System notifications** used only for "an agent needs input," never for "an agent finished." This converts the inbox pattern into a pull pattern and is the single most-copied detail of his setup.

Notice what this setup is actually doing. The `CLAUDE.md` file is Key #3 encoded as a growing living document. The slash commands and hooks are alignment and handoff mechanization at the execution edges. The Chrome extension is agent-as-user testing from Chapter 4. The numbered tabs + notifications are the scheduling primitive. The `claude -w` worktree flag is mode 2. Cherny has essentially built the book's thesis into his daily ergonomics, and the fifteen-session throughput is the result.

You do not need Claude Code's specific features to replicate this. Everything in the list above has a shell-script equivalent; Huntley's Ralph loop is an existence proof. The *pattern* of "mechanize the edges, rotate attention between middles" is what matters.

## A full-day example — mixed modes

To make this concrete, a day at Phase 4 might look like:

- Morning, 9:00–9:30: align requirements on Project A feature 1 (mode 1). Hand off to agent A1.
- 9:30–10:00: align requirements on Project A feature 2 (mode 2 — separate worktree). Hand off to A2.
- 10:00–10:20: align requirements on Project B (mode 1). Hand off to agent B1.
- 10:20–10:45: Agent A1 returns with a test plan. Audit at complexity-triaged depth. Approve. A1 begins implementation.
- 10:45–11:15: In parallel, A2 returns with a plan, B1 has questions on its spec. Answer B1; approve A2.
- 11:15 onward: A1 is building. Launch a mode-3 sub-parallel on A1 for UI testing (a second agent on the same feature). Meanwhile start best-of-N (Chapter 6) on a small refactor in Project B — two alternative attempts, 30 minutes each.
- Afternoon: read reports. Approve merges. Pick best-of-N winner. Start next round.

That's seven to eight agent-runs in a day, three projects, four modes in use. The rate-limiter is not the tools. It's your ability to hold the shape of each handoff in your head and come back to it cleanly.

## Anti-patterns

- **Reaching for mode 4 from Phase 1.** You'll watch sub-agents collide on interfaces that were never defined, conclude that agent-internal parallelism doesn't work, and blame the feature. The feature is fine; you weren't ready.
- **Using mode 2 without `worktree` (or equivalent isolation).** Two agents on one checkout is a merge-conflict machine. Don't.
- **Running mode 3 without the architecture step.** Sub-agents on the same feature without defined interfaces drift and fight. Define first.
- **Doing mode 1 when the real bottleneck is that one of the projects is early-stage and needs your attention.** Parallelism across projects doesn't help if one project is absorbing 80% of your cognitive budget.

---

## External voices

- **Supporting**: `git worktree` has been a known trick in AI-assisted development circles for a while; worth searching for posts by practitioners who wrote their own setup scripts. Anthropic's Claude Code team docs describe mode 4 from the inside.
- **Challenging**: many reports (HN, X) of mode 4 failing on real work. These are almost universally accurate as reports and should be read as "mode 4 needs architecture prerequisites," not "mode 4 is broken."

> TODO (author's note): link the best `git worktree` writeup you know of; link Anthropic team-mode docs; link at least one honest "mode 4 didn't work for me" post-mortem.

## What's next

Chapter 8 covers the bottleneck that emerges when parallel execution finally works: the output is more than you can read. The fix is the same trick applied one level up — letting agents triage agents.
