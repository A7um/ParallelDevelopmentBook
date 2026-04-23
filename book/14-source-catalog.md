# Source Catalog

A working bibliography for *The Parallel Development Book*. Every pioneer reference, tool link, and companion resource in one place. Entries marked **TODO** are placeholders for links the author wants to curate before publication; entries without marks are stable references used in the current text.

---

## Companion Skills

The `zero-review` skills are the author's reference implementations of the mechanisms in Part III. They are not required reading, but they show what the three keys look like as runnable documents.

- [`zero-review/auto-req`](https://github.com/A7um/zero-review/tree/main/skills/auto-req) — referenced in **Chapter 3**, requirement alignment.
- [`zero-review/auto-dev`](https://github.com/A7um/zero-review/tree/main/skills/auto-dev) — referenced in **Chapters 4 and 5**, TPD loop + architecture + self-audit.
- [`zero-review/auto-test`](https://github.com/A7um/zero-review/tree/main/skills/auto-test) — referenced in **Chapter 4**, agent-as-user testing.
- [`zero-review/auto-triage`](https://github.com/A7um/zero-review/tree/main/skills/auto-triage) — referenced in **Chapter 8**, output digestion (in development).

## Companion Book

- [*The Skill Design Book*](https://github.com/A7um/SkillDesignBook) — the author's prior book on writing SKILL.md files for long-running agents. Essential background for readers who want to write their own skills as part of their break-in residue (Chapters 2 and 5).

## Foundational Texts on Software Design

- **John Ousterhout — *A Philosophy of Software Design*.** Core source for the engineering-discipline principles encoded into skills in **Chapter 5** (deep modules, information hiding, layered abstraction, strategic vs tactical).
- **Kent Beck — *Test-Driven Development: By Example*.** The TDD reference that TPD (**Chapter 4**) contrasts with.
- **Will Larson — *An Elegant Puzzle* and *Staff Engineer*.** Background on the transition from "doing" to "deciding" that **Chapter 9** invokes.

## Pioneer Voices — Books and Long-Form

- **Ethan Mollick — *Co-Intelligence*.** General framing for human-AI collaboration; light touchpoint for **Chapter 10**.
- **TODO**: Addy Osmani — AI-assisted lifecycle engineering skills and posts.
- **TODO**: Simon Willison — running blog on LLM-assisted development, as a worked example of a multi-year break-in.

## Pioneer Voices — Short-Form (posts, threads, talks)

Entries here are the author's running bookmarks for pioneer writing. Most have been deferred to placeholders so they can be curated with specific quotes in a later revision.

- **TODO**: Boris Cherny (Claude Code) — public talks on agent autonomy and the "direct, don't dictate" stance. Relevant to **Chapter 1**.
- **TODO**: Geoffrey Huntley — "stop reviewing code" series. Relevant to **Chapter 4**.
- **TODO**: Armin Ronacher — Twitter threads on AI coding workflows. Relevant to **Chapter 9** (cost honesty).
- **TODO**: Mitchell Hashimoto — AI coding workflow posts. Relevant to **Chapter 7** (practical setups).
- **TODO**: Cognition (Devin) — blog posts on long-task context management. Relevant to **Chapter 5**.
- **TODO**: Anthropic Engineering — posts on subagents, Claude Code team mode, skills. Relevant to **Chapters 5, 7, 8**.
- **TODO**: Aider team — architect/editor mode documentation. Relevant to **Chapter 3**.

## Tools Referenced

- [**Cursor**](https://cursor.com) — primary development environment for most parallel workflows described in the book.
- [**Claude Code**](https://www.anthropic.com/claude/code) — mentioned throughout; mode 4 reference in **Chapter 7**.
- [**Codex**](https://openai.com/codex/) — mentioned as an alternative primary agent.
- [**Devin**](https://devin.ai) — mentioned in **Chapter 1** and **Chapter 5**.
- [**Aider**](https://aider.chat) — mentioned in **Chapter 3** for the architect/editor pattern.
- [**Playwright**](https://playwright.dev) — referenced in **Chapter 7** for UI E2E testing in mode 3.
- [**`git worktree`**](https://git-scm.com/docs/git-worktree) — core mechanism for **Chapter 7 Mode 2**.

## Research / Conceptual

- Literature on best-of-N sampling in LLMs. Relevant to **Chapter 6**.
- Burnout and decision-fatigue research in knowledge work. Relevant to **Chapter 9**.
- Incident-management triage models (PagerDuty-style, ITIL). Relevant to **Chapter 8** analogy.

## Placeholders for Counter-Voices

Deliberately kept separate — the book's credibility depends on engaging real critique.

- **TODO**: skeptic posts on multi-agent work collapsing under real-world complexity (especially Phase 1 reports mislabeled as general disproofs). Relevant to **Chapters 1 and 2**.
- **TODO**: Hillel Wayne or similar voices on the limits of tests as correctness evidence. Relevant to **Chapter 4**.
- **TODO**: honest "mode 4 didn't work for us" post-mortems. Relevant to **Chapter 7**.

---

*The catalog will be filled in across revisions. If you are reading this book on GitHub and know of a source that belongs here, pull requests are welcome.*
