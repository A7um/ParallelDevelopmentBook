# Chapter 8: Digesting the Output

> **Thesis**: Once parallel execution works, the bottleneck migrates to report digestion. The fix is the same trick applied one level up: let agents triage agents.

---

## The problem nobody warns you about

By Phase 3 you have three or four agents producing genuinely useful work per day. The three keys from Part III have moved you out of the live loop on alignment, correctness, and maintainability. The scheduling patterns in Chapter 7 let you spread them across projects, features, and transaction types. The throughput is real.

And then you hit a new wall. Not code. Reports.

Each agent produces, per day:

- a pull request or two
- a set of test results
- an agent-as-user testing report
- a design/architecture summary
- a list of things it couldn't do and wants input on
- sometimes a follow-up suggestion list

Multiply by four agents and you have a couple dozen artifacts to process per day, each of which demands some amount of your attention. You used to bottleneck on writing code; now you bottleneck on *reading your agents' output*. Chapter 1's theme returns with full force: **the bottleneck moves, it doesn't disappear**. You've just moved it again.

This is the point where engineers who've broken into parallel dev start burning out. Not because the work is bad — the throughput is better than it's ever been — but because reading twenty-four mixed-quality reports a day is cognitively expensive in a way that reading one PR isn't.

## The structure of the new bottleneck

Unlike the three chokepoints from Chapter 1, this one is not about judgment. It's about **volume of undifferentiated information**. The job is:

- Skim everything that came in.
- Notice when two reports are about the same underlying issue.
- Notice when one is a critical blocker and another is a "nice to have."
- Route things to the right follow-up (another agent, yourself, ignore).
- Preserve what needs to be preserved, drop what doesn't.

This is classically *triage*. And triage, structurally, is a job that *agents are good at* — provided you give them the right inputs. Parsing reports, clustering by theme, ranking by severity, writing a one-line summary per item: this is within the capability of any modern agent. What's missing is not the capability but the *structure* of the pipeline.

## The trick: agents triage agents

The move is to treat the agent output stream the same way you treated the source code: as something that shouldn't require you in the inner loop.

A triage agent sits downstream of the execution agents. Its job is:

1. **Read all new reports since last pass.** PRs, test results, user-testing reports, bug lists, design summaries.
2. **Cluster.** Group reports describing the same underlying issue (two agents both reporting that the staging DB is slow; three UI reports all about the same copy issue; etc.).
3. **Prioritize.** Rank clusters by a simple two-axis rubric — user impact × whether a workaround exists, or similar. For Phase 3+ engineers, the specific rubric matters less than consistency.
4. **Route.** Each cluster gets a disposition: *escalate to you*, *send back to an execution agent for fix*, *file as known issue*, *drop*.
5. **Summarize.** Produce one short human-readable report: the things that need your attention today, ranked, with a one-line reason each.

You read the triage agent's summary. Maybe ten items instead of a hundred. You make calls on the escalated ones. The rest are already routed.

This is the same pattern as the three keys: you are removed from the undifferentiated-volume stage and placed at the *decision points only*.

## Why it works

The triage agent has three advantages over you doing the same job:

1. **Unlimited patience.** It reads all twenty-four reports at the same attentional depth. You don't.
2. **Pattern-matching at volume.** Clustering fifty items by theme is a task that degrades sharply for humans and doesn't for agents. The twenty-ninth item of the day gets the same analysis quality as the first.
3. **Consistency.** The rubric it uses is applied identically across items. Your own rubric degrades as you get tired; theirs doesn't.

It has real limitations too: the triage agent is as good as its inputs, and if the execution agents produce garbage reports, triage makes garbage piles. This is another argument for skills — the execution agents' reports should follow a structured shape.

## Honesty about maturity

This chapter is the one where I have to be most honest about where the state of the art is: **the triage layer is not a solved product**. You can build one. I've built one (the `zero-review/auto-triage` skill is the reference implementation and it is still in active development). But you can't currently pick it up pre-built.

What you can do:

- Define a structured report format your execution agents must produce (loaded as a skill).
- Run a triage skill as a distinct agent at the end of each work cycle.
- Iterate on the rubric. The first version will over-escalate or under-escalate; tune over weeks.

This is, appropriately, another place where the break-in period shows up. The triage layer matures as you learn what your particular agents tend to get wrong.

*Reference*: [`zero-review/auto-triage`](https://github.com/A7um/zero-review/tree/main/skills/auto-triage) *(in development — partial reference only)*

## What to do until the triage layer is mature

Short-term defenses you can deploy today, while the triage idea is still evolving:

- **Batch your reading.** Don't look at agent reports as they land. Set two or three inbox-processing windows per day. Trying to treat reports like chat messages shatters your attention. Mitchell Hashimoto [explicitly describes](https://mitchellh.com/writing/my-ai-adoption-journey) turning off notifications during deep work and running "end-of-day agents" that finish their reports overnight, so he reads batched output once rather than in real time.
- **Force-structure reports at the source.** Every execution agent should produce reports in a consistent format: status, what was done, what failed, what needs your input, what can wait. A skill that enforces this format pays back immediately.
- **Use system notifications only for "needs input," not for "done."** Cherny's setup, public on [X](https://x.com/bcherny/status/2007179833990885678), uses system notifications explicitly as the *bounce-back* signal — tell me only when an agent needs me, not when it finishes. This single change turns an inbox pattern into a pull pattern and is often the difference between "five agents feels like chaos" and "five agents feels like supervision."
- **Be ruthless about the "what can wait" bucket.** Many reports need acknowledgment, not action. A one-line "logged, moving on" is often the right response.
- **Maintain a visible queue.** A simple spreadsheet of open items, with agent source, date, and status, gives you a coarse triage layer even without an agent. Reviewing the queue once a day — rather than responding to each arrival — is already a big win.

## A minimal structured-report skill

The highest-leverage thing you can add early, before any real triage layer exists, is a skill that forces every execution agent to end its work with a *structured* report. The minimum viable version specifies six sections — `Status` (COMPLETE / NEEDS_INPUT / BLOCKED), `What was done`, `Tests` (green/red/not run), `What I was unsure about`, `What needs human input`, `Follow-ups I would recommend` — and forbids free-form prose outside them.

Loaded on every execution agent, that single skill turns twenty free-form reports into twenty reports with the same six sections. A triage agent — or you, scanning by eye — can process the batch in a fraction of the time, because you know *where in the report* the parts you care about live. The authoring details for such a skill belong to [*The Skill Design Book*](https://github.com/A7um/SkillDesignBook); what matters here is the mechanism. It's the same shape as Cherny's [`/commit-push-pr` slash command](https://x.com/bcherny/status/2007179833990885678) at smaller scale — forcing the output into a predictable form so the consumer downstream doesn't have to read each one from scratch.

> **Structured reports are the single biggest digestion-layer win you can deploy while the full triage layer is still maturing.** If you do nothing else from this chapter, do this.

## The second-order effect

When the triage layer works, something non-obvious happens. Your execution agents start producing *better* reports, because:

- You're no longer reading individual reports. You're reading the triage summary.
- The triage agent is therefore the primary consumer of execution-agent output.
- So execution-agent skills evolve to produce reports the triage layer can cleanly ingest.

This is a virtuous cycle. The structure of the pipeline starts to encode a shared report schema without anyone needing to design one top-down. You'll notice it a few weeks in: reports from your agents start feeling like they were written for a machine, because they were.

## Where the bottleneck moves next

If you've been reading carefully, you already know: **the bottleneck moves again**. Once triage works, the next place it shows up is at the decision level — the items the triage layer escalates to you are, by construction, the hardest ones. You don't spend less cognitive energy per item; you spend it on a smaller pile of harder items. Total wall-clock time goes down; per-decision load goes up.

Chapter 9 will deal with this directly. The point for now: **there is no final bottleneck. There are only bottlenecks you've handled and bottlenecks you haven't yet. The sequence is what this book is really about.**

---

## External voices

- **Supporting**: the general pattern of "route decisions through an automated triage layer" is well-known in incident management (PagerDuty-style), in customer support (Zendesk-style), and in code review at scale (pull-request bots). Applying the same pattern to agent output is the natural translation.
- **Challenging**: skeptics (rightly) point out that triage agents can systematically miss novel failure modes — they route by pattern, and a genuinely new problem doesn't match any pattern. This is a real limit. Mitigation: a periodic full-stream review (say, weekly) where you read the raw reports, not the triage output, specifically to catch what the triage missed.

> TODO (author's note): any pioneer posts on building their own triage layer for agent output? Screenshots of auto-triage in action would be great here.

## What's next

Chapter 9 closes with the honest account: this whole setup won't make you more relaxed. You've traded muscle memory for continuous judgment, and the cognitive cost is real — even when the throughput gain is.
