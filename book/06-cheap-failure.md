# Chapter 6: The Cheap Failure Principle

> **Thesis**: When an attempt costs minutes instead of hours, the whole economics of exploration flip. Best-of-N stops being a luxury move and becomes a default — and the anti-pattern this invites is skipping the steps that made it work.

---

## The phase change

Before AI agents, every attempt to write a feature cost a human several hours. That cost shaped every decision: you picked the safest path, you didn't spike risky ideas, you didn't try a second implementation "just to compare." Exploration was rationed.

With agents running the three keys (Chapters 3–5), an attempt costs minutes to an hour. The cost curve has moved by one or two orders of magnitude. And when execution cost drops by an order of magnitude, **the decision cost of "try another approach" starts to exceed the execution cost of actually doing it.**

That's the phase change. It sounds like a quantitative shift; it's a qualitative one. A different class of strategy becomes rational that wasn't before.

> **Before**: deciding what to build is cheap; building is expensive; therefore, think hard before building, build once.
> **Now**: deciding what to build remains cost; building is cheap; therefore, try several things, pick a winner.

## Best-of-N as a daily move

The direct consequence: **best-of-N stops being an occasional technique and becomes a default.**

In a best-of-N workflow, you spec a feature once (Chapter 3), write a test plan once (Chapter 4), and then launch **N parallel attempts** — possibly using different agents, different prompts, or different architectural approaches. Each attempt runs against the same test plan. You read the winners, compare, and pick.

This sounds expensive in agent cost. It is. It is radically cheaper in *your* cost, because:

- One of the three attempts will almost always pass the tests first, and you review that one.
- The other two give you a cheap comparison — you see three design choices for the same contract, and you can tell which feels cleanest in thirty seconds.
- If all three fail, you've learned something real about the requirement that one attempt would have hidden.

Best-of-N is especially useful for:

- **Ambiguous architectural choices.** When you don't know the right abstraction, let three attempts show you.
- **Risky refactors.** The safe path and the aggressive path, run in parallel, compared on the test plan.
- **"I want the good one."** Tone of copy, UX flow choices, any place where you'd recognize quality faster than you'd specify it.

It is not useful for:

- **Tasks with one right answer** (CRUD, bug fixes with a known cause). N attempts just wastes compute.
- **Tasks where the contract itself is unclear.** Best-of-N finds variation on the implementation, not the spec. If the spec is wrong, all N attempts are wrong.

## A concrete example — parallel attempts via git worktrees

The cheapest way to run best-of-N on a real feature today is to combine cheap failure with mode 2 from Chapter 7. Concretely:

```bash
# Align requirements once, produce spec.md and prompt_plan.md.
# (See Chapter 3's worked example — Harper Reed's flow.)

# Now launch three parallel attempts at the same feature.
git worktree add ../feature-attempt-a attempt-a
git worktree add ../feature-attempt-b attempt-b
git worktree add ../feature-attempt-c attempt-c

# In attempt-a: hand the agent spec.md + prompt_plan.md with no extra instructions.
# In attempt-b: same inputs, but prepend a hint that pushes toward a different
#   architectural choice ("prefer a state machine here even if it feels heavy").
# In attempt-c: same inputs, different agent entirely — e.g., Codex instead of
#   Claude Code — to get a genuinely independent attempt.
```

Each attempt runs against the same test plan. Run them in parallel; wall-clock time is roughly the time of one attempt. When two or three have produced green suites, you read them side-by-side and pick.

The diversity trick matters. Three runs of the same agent with the same prompt against the same spec converge to nearly identical output; you learn very little. The real leverage is when each attempt varies on *one* axis — the agent, the architectural hint, or the temperature — so the differences between the attempts carry information.

Simon Willison's *[Embracing the parallel coding agent lifestyle](https://simonwillison.net/2025/Oct/5/parallel-coding-agents/)* and Mitchell Hashimoto's *[Vibing a Non-Trivial Ghostty Feature](https://mitchellh.com/writing/non-trivial-vibing)* both describe using parallel attempts against the same spec specifically to see *variance across agents* — which implementation seems cleaner, which caught an edge case the others missed. That variance is the product you are buying with the extra compute.

## The "exploration becomes the default" shift

There's a second, subtler consequence of cheap failure that I think is more important than best-of-N itself.

In the old economy, when you had a vague idea — "I wonder if we should switch from approach A to approach B" — the cost of finding out was writing approach B, which meant days or weeks, which meant you almost always didn't. The question died unanswered. Approaches stuck because no one could afford to check.

In the new economy, finding out is a thirty-minute agent run. Most vague ideas can be checked. This changes the cadence of decision-making: you stop relying on debate to resolve "should we" questions and start relying on *cheap experiments*. An engineer in Phase 4 resolves more architectural debates in a day than a team used to resolve in a quarter — not because the engineer is smarter, but because the cost curve of "find out" has collapsed.

This is the real productivity gain, and it's not captured in any "lines of code per day" metric. It's captured in "decisions made per week with actual evidence behind them."

## The anti-patterns cheap failure invites

Every phase change creates new ways to fail. The two most common ones here:

### Anti-pattern 1: Skipping requirement alignment because "we'll try a few and see"

This is the Phase 1 failure. "Why spend thirty minutes on requirement alignment when I can just run three agents and pick the best?" The answer: because all three agents will produce coherent work against *different misinterpretations* of the ambiguous requirement. You'll end up with three working implementations of three subtly different features, and the choice between them is a choice between three things you didn't want.

**Cheap failure is leverage on top of good alignment. It does not replace alignment.** If Chapter 3 isn't done, Chapter 6 actively hurts.

### Anti-pattern 2: Letting best-of-N substitute for test plans

"I'll just pick the one that looks best." This works for UI tone; it doesn't work for correctness. Without a test plan, "best" collapses to "the one that compiles and looks familiar," which is the agent's favorite attempt, not the correct one. Chapter 4 is a precondition for Chapter 6; skipping it means best-of-N degenerates into aesthetic voting.

### Anti-pattern 3: Running N forever

N attempts is fine. N + M attempts, chasing the *perfect* implementation, is a compute-burning habit that produces diminishing returns. In practice N = 2 or 3 covers 90% of the cases where variance matters; beyond 3, the marginal attempts almost never change the pick. The rule of thumb is: if the first two attempts disagree meaningfully, run a third to break the tie; if they agree, one attempt would have been fine.

### Anti-pattern 4: Forgetting the human bottleneck is still there

Three parallel attempts produce three things *you* still have to compare. If comparison takes as long as reading one implementation three times, you've just tripled your review load. The fix is either (a) make the test plan do the comparison for you (all three passed; pick either based on test-suite winners or code-aesthetic signal) or (b) don't use best-of-N on tasks where you can't compare quickly.

## Cost math, roughly

For a working engineer in Phase 3+, the rough numbers:

- One agent attempt on a medium feature: 30–90 minutes of agent time, ~$1–5 of compute.
- Three parallel attempts: same wall clock, 3× agent time, 3× compute, same human attention at alignment + test-plan stages, maybe 20% extra at pick-a-winner stage.
- Expected value of "one of three attempts teaches you something about the problem you didn't know": hard to quantify, but anecdotally, high on novel work and low on routine work.

The dominant cost is *not compute*. It's whether your human attention budget has room for "look at three things instead of one." Plan accordingly.

## Interaction with the scheduling patterns

Best-of-N is one of four parallel modes discussed in Chapter 7, but it differs from the other three in a key way: **the other three modes parallelize across *different* tasks; best-of-N parallelizes across *alternative attempts at the same task*.**

In practice, a mature parallel workflow uses both at once. You might have three agents on three different features (Chapter 7 mode 2) and *within* one of those features, three attempts in best-of-N (this chapter). That's nine agent-runs in flight. Chapter 8 will talk about what happens to the flood of output this creates.

---

## External voices

- **Supporting**: ML practitioners have used best-of-N sampling on model outputs for years; applying the same pattern at the task level is the natural generalization. Chase-Lambert, Anthropic, and others have discussed "draft multiple, pick one" workflows; Geoffrey Huntley's posts on agent-of-agents patterns touch the same territory.
- **Challenging**: some practitioners caution that best-of-N can mask systematic errors (if all N attempts share the model's blind spot, you pick the best wrong answer with high confidence). This is a real critique and the mitigation is diversity — different agents, different prompts, different starting architectures — not just N runs of the same prompt.

> TODO (author's note): pioneer links where someone actually ran best-of-N in production and reported the cost/benefit; any Anthropic/OpenAI posts on sampling-for-coding that fit.

## What's next

Chapter 7 covers the four scheduling patterns for running parallel agents — from cross-project coordination (coarsest) down to agent-internal parallelism (finest) — and which patterns match which break-in phase.
