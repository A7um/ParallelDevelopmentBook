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

**When it actually pays off**: the same conditions that make mode 3 work, but at a smaller granularity. If the architecture step (Chapter 5) has pinned down module boundaries clearly, and each sub-task fits inside a module, agent-internal decomposition is reliable. If the architecture is vague, it isn't.

**The direct dependency on Chapter 5**: mode 4 is basically the payoff for doing architecture design well. A codebase with well-defined module boundaries and interface contracts is *automatically* amenable to parallel decomposition. A codebase where agents "code-as-they-design" isn't. This is the strongest practical argument for not skipping the architecture step, even when you're tempted.

**When to reach for it**: Phase 3 and up, on tasks where the decomposition is obvious (you could have done it by hand with mode 3 but it's tedious). Treat it as a labor-saver for cases you'd otherwise run mode 3, not as a magic productivity multiplier.

## How many agents at once?

A practical upper bound, roughly:

- **Phase 2**: one or two agents. More than two breaks.
- **Phase 3**: three to four agents comfortably. Five starts requiring deliberate attention discipline.
- **Phase 4**: five to eight, with mode combinations. Past eight, even experienced engineers lose the thread.

The limiting factor is almost never agent compute or tooling. It's **your ability to keep context while rotating between tasks at the alignment and review stages**. Running too many agents produces more agents but worse decisions at the human-in-the-loop moments — which, from Chapter 1, is where the real bottleneck lives.

> **The right number of parallel agents is the largest number where your alignment and review quality don't degrade.**

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
