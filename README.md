# ParallelDevelopmentBook

**How to Run Multiple AI Agents in Parallel Without the Quality Collapsing** — the break-in period, the three keys, the scheduling patterns, and the honest account of what it actually costs you.

*By [Atum](https://atum.li)*

## Read the Book

- **English**: [book/README.md](book/README.md)
- **中文**: [zh/book/README.md](zh/book/README.md)

The deployed site auto-hosts both editions side by side with a one-click language switcher in the top-right corner. English is served at the site root; Chinese is served under `/zh/`.

## What's Inside

| Chapter | What You'll Learn |
|---------|-------------------|
| [**Ch 1: The Bottleneck Moves**](book/01-bottleneck-moves.md) | Why parallel AI dev isn't about launching more agents — it's about unlocking three human-in-the-loop chokepoints |
| [**Ch 2: The Break-in Period**](book/02-break-in-period.md) | The four-phase learning curve every team walks through — and why skipping it is the #1 reason parallel AI "doesn't work" |
| [**Ch 3: Key #1 — Requirement Alignment**](book/03-key-1-requirements.md) | Exhaustive questioning vs solution-and-filter; why requirements are the one step that cannot be parallelized |
| [**Ch 4: Key #2 — Correctness as Contract**](book/04-key-2-correctness.md) | Test-Plan-Driven Development (TPD) as the acceptance contract; complexity-triaged review; AI-as-user role testing |
| [**Ch 5: Key #3 — Engineering Discipline as Code**](book/05-key-3-discipline.md) | Skills as living residue; Ousterhout's principles applied; where skill injection still isn't enough |
| [**Ch 6: The Cheap Failure Principle**](book/06-cheap-failure.md) | When attempts cost minutes, exploration economics flip — best-of-N as a daily move, and the anti-patterns it invites |
| [**Ch 7: Scheduling Patterns**](book/07-scheduling-patterns.md) | Four parallel modes (cross-project → worktree → cross-transaction-type → agent-internal), matched to your break-in phase |
| [**Ch 8: Digesting the Output**](book/08-digesting-output.md) | The next bottleneck after parallel execution works — and why the fix is the same trick applied one level up |
| [**Ch 9: It Won't Make You Lighter**](book/09-not-lighter.md) | The cognitive cost nobody advertises; why throughput multiplies while cognitive load stays flat or rises |
| [**Ch 10: Beyond Code**](book/10-beyond-code.md) | Why every decomposable knowledge task obeys the same rules; coding is just the first domain where the loop closes |
| [**Source Catalog**](book/14-source-catalog.md) | Pioneer writing, product posts, and research referenced throughout |

## Who This Is For

Engineers who already use Cursor, Claude Code, Codex, or similar agents for single-threaded work, and want to take the next step: running several agents in parallel on real projects without the output quality collapsing under the load. If you have never used an AI coding agent, this book will move too fast; start with one agent first, then come back.
