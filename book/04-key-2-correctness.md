# Chapter 4: Key #2 — Correctness as Contract, Not Review

> **Thesis**: Stop reviewing code line-by-line. Write a test plan *before* coding starts, treat it as the acceptance contract, let the agent close the correctness loop itself, and audit the plan at a depth proportional to the complexity of the work.

---

## Why line-by-line review is dead at scale

In a one-agent workflow, reading the diff is tractable. The agent generates fifty lines, you read fifty lines, you approve. Even here it's slow — but it's possible.

In a three-agent workflow, a full day's output is maybe two or three thousand lines across different PRs, different branches, and different parts of the codebase. If you try to read all of it with the same attention, two things happen:

1. You become the bottleneck again. All the parallel speedup you gained in execution is lost in review.
2. Your attention degrades. Somewhere around the eighth PR of the day, you start skimming. You approve something you shouldn't have. Skim-reviewing at three-agent scale is worse than careful-reviewing at one-agent scale.

The way out is not "review harder." The way out is **stop reviewing the implementation and start reviewing the contract.**

## What "correctness as contract" means

The correctness of a piece of code is, operationally, the set of behaviors it must exhibit. Tests encode behaviors. A sufficient set of tests, verified green, is evidence of correctness.

> **If the tests you wrote before coding express the full correctness contract, and the tests pass, the implementation is correct by construction.**

That single sentence is the whole frame. The agent writes the code. The agent runs the tests. If the tests pass, you don't need to read the diff. If the tests fail, the agent debugs and re-runs them until they don't fail. You have been removed from the inner loop of correctness verification.

The human role has moved: from **reviewing implementations** (which you had to do because the agent's output might be wrong) to **reviewing the test plan** (which the agent couldn't have written without your taste and domain understanding in the first place).

## The Adversarial Agent Pattern — 2026 consensus for correctness

The cleanest current practice for correctness-as-contract is the **Adversarial Agent Pattern**, crystallized in the [Augment Code Spec-Driven Development guide (April 2026)](https://www.augmentcode.com/guides/what-is-spec-driven-development). It formalizes what several 2025 practitioners were doing ad-hoc, and — because it assigns the verification role to a *separate* agent with *different context and often a different model* — it directly addresses the blind-spot problem described later in this chapter.

The pattern has three roles:

- **Coordinator.** Reads the spec (from Chapter 3), decomposes it into sub-tasks, assigns them.
- **Implementor(s).** One or more agents, each working on an isolated sub-task in its own git worktree. They cannot see each other's context — only the spec's interface contracts.
- **Verifier.** A *separate* agent whose only job is to check each Implementor's output against the spec's verification criteria. It has not seen the implementation process — only the spec and the final diff.

Model tiering has emerged as the convention: the most capable model writes the spec, a mid-tier model implements, and a fast low-cost model verifies. Cost-wise, this is cheaper than running your top model on everything. Correctness-wise, it is substantially *stronger* than a single agent writing code and its own tests, because the Verifier never shared an understanding with the Implementor — it can only check the spec against reality.

This directly answers the concern you'll see below about "tests and code sharing a blind spot." When the Verifier is independent, a shared misunderstanding between the Implementor's implementation and the Implementor's tests still gets caught — because the Verifier is reading the spec fresh and checking what reality actually does against it.

> **Adopt the Adversarial Agent Pattern explicitly for any non-trivial correctness surface.** Model it as three roles with three separate contexts. A single agent writing code *and* tests *and* grading itself is a regression, not a workflow.

### The prompt that turns a spec into a test plan

If your tool doesn't have a built-in Verifier role, you can still create one manually — start a fresh session with *only* the spec loaded (no implementation context), and ask:

> You are the Verifier. You will receive a spec and a diff. Your job: for each verification criterion in the spec, state whether the diff satisfies it (YES / NO / PARTIAL), and for each NO or PARTIAL, cite the specific file and behavior that falls short. You do not have access to the Implementor's reasoning — only the spec, the diff, and the repo as-shipped. Prefer skepticism over agreement.

That prompt, paired with the six-element spec from Chapter 3, is the minimum viable Verifier. It is an hour of work to set up and catches a meaningful percentage of the "implementation drifted from spec, but the Implementor's own tests passed" failures.

## TPD vs TDD

Test-driven development, in its classic red-green-refactor form, is a *human* discipline: one test at a time, one small behavior increment, tight feedback loop, the test exists to guide the writing.

Test-Plan-Driven Development (TPD) is different. You produce, in one up-front pass, **a full test plan that covers the behaviors the feature must exhibit**. Then you hand the whole thing to the agent, which writes the implementation and the test bodies together and closes the loop against the plan.

| | TDD (human) | TPD (agent-assisted) |
|---|---|---|
| Granularity | One test at a time | Whole-feature test plan |
| Purpose | Guide *writing* incrementally | Define a *correctness boundary* for autonomous execution |
| Feedback cadence | Red-green per test | Red-green per full suite |
| Primary beneficiary | The human developer | The agent closing its own loop |

TPD is not a replacement for TDD as an intellectual practice. It's a different shape, adapted to the situation where the implementation is going to be written in one go by something that *can* run the whole suite every thirty seconds.

> **TDD is a programming discipline for humans. TPD is an acceptance contract for agents.**

(The name "TPD" is a convenience coined to contrast with TDD. It isn't a term of art in the wider industry. Don't fight about the label.)

## What pioneers are already doing (last six months)

Current practice — pinned explicitly to the November 2025 through April 2026 window:

- **Mitchell Hashimoto, in [*My AI Adoption Journey* (Feb 2026)](https://mitchellh.com/writing/my-ai-adoption-journey)**, treats failures as occasions to add *deterministic hooks* and tests that prevent the failure class from recurring. The tests are not a development byproduct — they're the permanent harness.
- **The Opus 4.5 "No Restart" workflow**, documented in [*Claude Opus 4.5 Unlocks the "No Restart" Workflow* (Dec 2025)](https://bytesizedbrainwaves.substack.com/p/claude-opus-45-unlocks-the-no-restart), makes extended autonomous test-fix-test-fix loops practical for the first time. The implication is direct: if the agent can run a suite, debug failures, and re-run without losing context for hours, you genuinely can stop reading the diff.
- **Geoffrey Huntley's Ralph loop** uses tests (and builds, and lints) as explicit *backpressure*: the loop is structurally incapable of advancing past a failing suite. Documentation current through [late 2025](https://ghuntley.com/ralph/).
- **Claude Code's Plan Mode**, formalized across late 2025 and early 2026 ([2026 complete guide](https://codewithmukesh.com/blog/plan-mode-claude-code/)), bakes the "plan before code, verify against plan" loop into the tool itself. You're no longer applying TPD on top of a generic chatbot; the tool now enforces it.
- **The Adversarial Agent Pattern** (above) is the consensus formalization. Separate Implementor from Verifier, tier models by role, never let one agent grade its own work.

The convergence is notable because these practitioners are not copying each other. Each arrived at "tests before code, verification by a role that didn't write the code" as the obvious fix to the same underlying problem: line-by-line review is the thing that stops scaling first.

## What a good test plan covers

The test plan is the deliverable. It should cover three layers:

1. **Unit tests.** Individual function and module behaviors. "Given this input, this function returns this output." The agent will write these against pure logic.
2. **Integration tests.** Interactions between modules. "When the job scheduler calls the retry handler, retries are scheduled on the expected backoff schedule." The agent will write these against the module boundaries defined in the architecture step.
3. **End-to-end / functional tests.** The user path. "A user can upload a file, wait for processing, and download the result, and the file they download matches what they uploaded after the expected transformation."

Each layer has a different sensitivity. Unit tests catch logic bugs. Integration tests catch wiring bugs. E2E tests catch real-world composition bugs. Missing any layer leaves a class of mistakes uncaught.

A good test plan also names **what is *not* covered** — behaviors you're explicitly not testing (performance, rare concurrency paths, visual regressions). Naming non-coverage prevents the illusion of completeness.

## The hidden risk: tests and code sharing a blind spot

This is the part almost nobody writes about. If the agent writes *both* the implementation *and* the tests from the same understanding of the requirement, and that understanding is wrong, **the tests will pass and the code will still be wrong**. The tests verify what the code does, not what it should do. They lock in the misunderstanding.

The mitigation is structural:

1. **The test plan is reviewed by a human, before implementation starts.** Not the test bodies — the test plan. The plan describes *what should be true*; the bodies describe *how we verify it*. Reviewing the plan is reviewing the intent.
2. **The test plan is written from the requirement spec, not from the proposed implementation.** If you let the agent write the plan *after* it has written the code (or worse, at the same time), you have lost this property entirely. Order of operations matters.
3. **A human audits test coverage of high-risk behaviors at complexity-triaged depth.** This is the complexity heuristic applied again.

## Complexity-triaged review depth

From the author's own practice: **the higher the complexity of the change, the deeper the audit. Low complexity, let it go.**

Applied to test plans:

**Go deep on**:
- irreversible actions (payment, deletion, data migration)
- cross-module changes
- security and auth paths
- anything with a hard-to-rollback failure mode
- domains where the agent's prior is known to be weak

**Let it go on**:
- CRUD
- internal tools and one-off scripts
- low-stakes, well-understood patterns
- changes easily rolled back

"Let it go" does not mean "no test plan." It means: skim the plan, make sure the shape looks right, trust the agent to fill in the details, don't audit every test case. You are still requiring tests; you're just not spending your attention on them at the same depth as on a payment flow.

This heuristic is the single practical instruction I'd most want a Phase 2 reader to internalize. The naive Phase 1 failure is to audit everything equally hard; the naive Phase 4 failure is to audit nothing. Triaging by complexity is the middle path that scales.

## Agent-as-user testing for UI work

Automated unit, integration, and E2E tests miss the UI-layer complaints: bad copy, cluttered layout, error messages that are technically correct but useless, flows that "work" but require too many clicks. For these the agent can act as a user — driving a browser, filling forms, reporting what the experience was like. The single trick worth knowing: **make the agent play a specific named user role** (novice / power user / adversarial), and constrain it to *only the senses that role has*. A novice-role agent can only report "I clicked save and the page went blank for five seconds" — not "the init failed with a 500," because it can't see the console. That constraint is what makes the reports real-user-shaped instead of engineer-shaped. The implementation details live in [`zero-review/auto-test`](https://github.com/A7um/zero-review/tree/main/skills/auto-test).

## What you stop doing

To make this concrete, the review practices you are *retiring* at Phase 3+:

- Reading every diff line-by-line. Gone.
- Catching bugs by reading code. Gone. The tests should catch bugs; if they don't, the plan is incomplete and *that* is what you fix.
- Style nitpicks in PR comments. Replaced by skill-enforced conventions (Chapter 5).
- Checking that the code runs. Replaced by CI + agent-run suite.

What remains:

- Reviewing test plans for coverage adequacy.
- Spot-checking implementation on high-risk changes only.
- Reading agent-as-user reports.
- Final green-light approval.

## The zero-review reference

The `zero-review/auto-dev` skill encodes the TPD loop end-to-end, including the architecture step described in the next chapter. Together with `auto-req` (Chapter 3) and `auto-test`, they form the author's working skill stack for single-agent execution. Parallel scheduling (Chapter 7) runs these skills across multiple agents simultaneously.

*Reference*: [`zero-review/auto-dev`](https://github.com/A7um/zero-review/tree/main/skills/auto-dev)

---

## External voices

- **Supporting — the Adversarial Agent Pattern**: the [Augment Code SDD practitioner's guide (April 2026)](https://www.augmentcode.com/guides/what-is-spec-driven-development) is the definitive current reference for the Coordinator / Implementors / Verifier split with model tiering. The Jan 2026 [*Spec-Driven Development* paper](https://arxiv.org/abs/2602.00180) is the academic companion.
- **Supporting — extended autonomous loops**: Opus 4.5's [No Restart workflow](https://bytesizedbrainwaves.substack.com/p/claude-opus-45-unlocks-the-no-restart) (Dec 2025) is the capability that makes TPD-style unattended test-fix-test-fix loops genuinely practical at scale.
- **Supporting — stop reviewing, start engineering**: Geoffrey Huntley's [Ralph Loop](https://ghuntley.com/ralph/) argues that line-by-line review is structurally obsolete once agents can self-verify against backpressure; the engineer's job becomes designing guardrails — pre-commit hooks, property-based tests, snapshot tests — not reading diffs.
- **Challenging — tests don't prove correctness**: Hillel Wayne's [*Why Don't People Use Formal Methods?*](https://www.hillelwayne.com/post/why-dont-people-use-formal-methods/) remains the sharpest articulation of the limit TPD inherits. The Adversarial Agent Pattern narrows the gap considerably (independent Verifier, spec as contract) but does not close it. For genuinely high-stakes correctness surfaces, testing remains a *correctness toolkit* item, not a proof.
- **Challenging — "you don't know if you have the right spec"**: Wayne's fundamental verification problem — any test suite is only as good as the requirement it encodes — is why the 2026 consensus spec has six mandatory elements (Chapter 3) rather than three. Verification criteria without explicit outcomes and constraints still lock misunderstandings in.

## What's next

Chapter 5 covers Key #3: how to encode engineering discipline — naming, layering, module design, commit style — as skills the agent enforces on itself, and where that still isn't enough.
