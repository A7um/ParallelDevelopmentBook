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

## Agent-as-user testing

Automated unit, integration, and E2E tests catch a lot. They don't catch:

- bad copy
- cluttered layout
- slow interactions that feel slow but don't technically fail
- error messages that are technically correct but useless
- flows that work but require too many clicks

For these, the agent can act as a user. Modern agents can drive a browser, take screenshots, fill forms, and report what the experience was like. The trick is to **make the agent play specific user roles**, because each role sees different things:

- **Novice user**: only sees what's on screen. Doesn't know what a console is. Gives up after two failures. Writes reports like *"I clicked save and the page went blank for five seconds"* — not *"the init failed with a 500."*
- **Power user**: actively looks for shortcuts, tries side paths, notices when a keyboard shortcut would help.
- **Adversarial user**: tries malformed inputs, long strings, clicks in the wrong order, tries to break it.

Each role exposes a different class of bug. A single "test this like a user" instruction collapses into a generic engineer voice and finds none of it. Forcing the agent to *only have the senses the role has* is what makes the reports useful.

*Reference*: [`zero-review/auto-test`](https://github.com/A7um/zero-review/tree/main/skills/auto-test)

## The full shape of the chapter, as a sequence

The whole correctness loop, in order:

1. Requirement spec (from Chapter 3)
2. Test plan written from the spec, reviewed at complexity-triaged depth
3. Architecture step (Chapter 5) produces module boundaries
4. Agent writes implementation + test bodies
5. Agent runs the full suite, debugs failures, re-runs until green
6. Agent performs agent-as-user testing for UI-facing work
7. Human inspects:
   - the test plan coverage at complexity-triaged depth
   - the agent-as-user reports
   - the final green status

Steps 4–6 are unattended. That's the whole point. Your attention goes to steps 2 and 7 — framing the contract, and confirming it closed.

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

- **Supporting**: Kent Beck's original TDD essays frame "tests as specification" — exactly the move TPD inherits, just at coarser granularity. Geoffrey Huntley's "stop reviewing code" posts make the same case more bluntly.
- **Challenging**: Hillel Wayne and others have argued persuasively that tests don't prove correctness — they demonstrate the absence of specific bugs. That critique applies here too. TPD does not prove correctness; it moves the human role from *reviewing implementations you can't fully trust* to *reviewing contracts you can meaningfully audit*. A better ratio; not a guarantee.

> TODO (author's note): drop in links to "stop reviewing code" posts, any TDD classics you want to cite, and any war-story posts where someone discovered the tests-sharing-blind-spots failure mode.

## What's next

Chapter 5 covers Key #3: how to encode engineering discipline — naming, layering, module design, commit style — as skills the agent enforces on itself, and where that still isn't enough.
