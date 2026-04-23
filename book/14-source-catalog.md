# Source Catalog

A working bibliography for *The Parallel Development Book*. Every pioneer reference, tool link, and companion resource in one place.

---

## Companion Skills

The `zero-review` skills are the author's reference implementations of the mechanisms in Part III. They are not required reading, but they show what the three keys look like as runnable documents.

- [`zero-review/auto-req`](https://github.com/A7um/zero-review/tree/main/skills/auto-req) — referenced in **Chapter 3**, requirement alignment.
- [`zero-review/auto-dev`](https://github.com/A7um/zero-review/tree/main/skills/auto-dev) — referenced in **Chapters 4 and 5**, TPD loop + architecture + self-audit.
- [`zero-review/auto-test`](https://github.com/A7um/zero-review/tree/main/skills/auto-test) — referenced in **Chapter 4**, agent-as-user testing.
- [`zero-review/auto-triage`](https://github.com/A7um/zero-review/tree/main/skills/auto-triage) — referenced in **Chapter 8**, output digestion (in development).

## Companion Book

- [*The Skill Design Book*](https://github.com/A7um/SkillDesignBook) — the author's prior book on writing SKILL.md files for long-running agents. Essential background for readers who want to write their own skills as part of their break-in residue (Chapters 2 and 5).

---

## Pioneer Voices and Their Practices

Entries here are grouped by pioneer, with the specific artifacts cited in the book. Every practice quoted in the chapters is sourced from something in this list.

### Boris Cherny (creator of Claude Code, Anthropic)

The single most publicly-studied parallel-agent workflow at the time of writing. Cherny's practices show up in Chapters 1, 2, 5, 7, 8.

- [Boris Cherny's X thread on running 5 Claudes in parallel](https://x.com/bcherny/status/2007179833990885678) — the origin of the numbered-tabs + system-notifications pattern.
- [*"Claude Code creator" reports 259 PRs in 30 days*](https://www.reddit.com/r/ClaudeAI/comments/1px44q0/claude_code_creator_boris_cherny_reports_a_full/) — the monthly throughput numbers cited in Chapter 2.
- [15 Claude Code tips shared by Cherny](https://www.reddit.com/r/ClaudeCode/comments/1s8oqfn/btw_boris_cherny_shared_15_new_tips_to_use_claude/) — covers `claude --teleport`, `claude -w` (worktree), `/loop`, `/schedule`, hooks, and subagents.
- [Educative — *Master this workflow from the creator of Claude Code*](https://www.educative.io/newsletter/artificial-intelligence/claude-code-creators-workflow) — the most thorough third-party writeup, including the Chrome extension for UI testing and the slash commands.
- [*Boris Cherny's Claude Code Workflow That 5× Developer Productivity*](https://www.theautomated.co/p/boris-cherny-s-claude-code-workflow-that-5-developer-productivity) — secondary summary with useful consolidation.
- [Threads summary — 10 to 15 Claude sessions in parallel with `CLAUDE.md` as learning substrate](https://www.threads.com/@blueviper.ai/post/DV0PiVsCZ_j/) — the clearest articulation of "every mistake, written back into `CLAUDE.md`."
- [*Head of Claude Code: What happens after coding is solved*](https://www.lennysnewsletter.com/p/head-of-claude-code-what-happens) — Lenny's Newsletter podcast interview, Feb 2026.
- [*Boris Cherny: "code is not the bottleneck"*](https://www.frenxt.com/cables/claude-code/cherny-01-origin-story) — origin story and philosophical stance.

### Simon Willison

Running record of one engineer's multi-year break-in; cited in Chapters 2, 4, 6, 9.

- [ai-assisted-programming tag](https://simonwillison.net/tags/ai-assisted-programming/) — 345+ posts and counting; the real-time chronicle.
- [*Embracing the parallel coding agent lifestyle*](https://simonwillison.net/2025/Oct/5/parallel-coding-agents/) — Oct 2025; the clearest public "I was wrong, here's why I changed my mind" piece.
- [*Agentic Engineering Patterns*](https://simonw.substack.com/p/agentic-engineering-patterns) — 2026; opens with "Red/Green TDD" as a first-class agentic pattern.
- [*Here's how I use LLMs to help me write code*](https://simonwillison.net/2025/Mar/11/using-llms-for-code/) — the "context is king" writeup.
- [*An AI agent coding skeptic tries AI agent coding, in excessive detail*](https://simonwillison.net/2026/Feb/27/ai-agent-coding-in-excessive-detail/) — Willison's summary of Max Woolf's skeptic-turned-convert post.

### Mitchell Hashimoto

The most honest public break-in memoir; cited in Chapters 2, 5, 8, 9.

- [*My AI Adoption Journey*](https://mitchellh.com/writing/my-ai-adoption-journey) — the "excruciating period of inefficiency," the harness-engineering shift, `AGENTS.md` as a living artifact, end-of-day agents.
- [*Vibing a Non-Trivial Ghostty Feature*](https://mitchellh.com/writing/non-trivial-vibing) — honest cost accounting for a real feature built with agents.
- [Pragmatic Engineer — *Mitchell Hashimoto's new way of writing code*](https://newsletter.pragmaticengineer.com/p/mitchell-hashimoto) — long-form interview on daily workflow.
- [Zed — *Agentic Engineering in Action with Mitchell Hashimoto*](https://zed.dev/blog/agentic-engineering-with-mitchell-hashimoto) — talk on maintaining architectural control, prompt-as-coaching, parallel work.

### Geoffrey Huntley

The Ralph Loop and associated harness-building practice; cited in Chapters 1, 4, 7.

- [*Ralph Wiggum as a "software engineer"*](https://ghuntley.com/ralph/) — the canonical description of the loop.
- [`how-to-ralph-wiggum` repo](https://github.com/ghuntley/how-to-ralph-wiggum) — the runnable methodology, including the `PROMPT.md` and `specs/*` patterns and the planning/building split.
- [*how to build a coding agent: free workshop*](https://ghuntley.com/agent/) — the argument that agents are "300 lines running in a loop."
- [`how-to-build-a-coding-agent` workshop repo](https://github.com/ghuntley/how-to-build-a-coding-agent) — six progressive versions of a DIY coding agent.
- [*I dream about AI subagents*](https://ghuntley.com/subagents/) — on context rot and the subagent pattern as a fix.
- [Dev Interrupted — *Inventing the Ralph Wiggum Loop*](https://linearb.io/dev-interrupted/podcast/inventing-the-ralph-wiggum-loop) — podcast covering the philosophy.
- [*AI Giants: What Everyone Gets Wrong About The Ralph Loop*](https://blog.codacy.com/what-everyone-gets-wrong-about-the-ralph-loop) — critical recap.

### Harper Reed

The single most-copied public alignment workflow; cited in Chapters 1, 3, 4.

- [*My LLM codegen workflow atm*](https://harper.blog/2025/02/16/my-llm-codegen-workflow-atm/) — the three-stage flow (idea honing → blueprint → execution), including verbatim prompts.
- [*An LLM Codegen Hero's Journey*](https://harper.blog/2025/04/17/an-llm-codegen-heros-journey/) — the adoption-arc companion piece.

### Addy Osmani

Lifecycle engineering for AI-assisted development; cited in Chapters 3, 5, 10.

- [*My LLM coding workflow going into 2026*](https://addyosmani.com/blog/ai-coding-workflow/) — the specs-first, human-director framing.
- [*Top AI Coding Trends for 2026 — Beyond Vibe Coding*](https://beyond.addy.ie/2026-trends/) — formalization of Agent Skills as portable `SKILL.md` packages, and the Ralph Wiggum pattern as a generic primitive.

### Armin Ronacher

Honest accounts of comprehension debt and testing as the hardest problem; cited in Chapter 9.

- [*The 80% Problem: Why AI Coding Agents Stall*](https://tianpan.co/blog/2026-02-21-ai-coding-agent-best-practices) — Ronacher-inspired writeup on assumption propagation and comprehension debt.
- [Pi — Ronacher's minimal custom agent architecture experiments](https://www.linkedin.com/posts/peterfriese_armin-ronacher-details-the-architecture-of-activity-7431646543574700032-nYTJ) — the argument that SDK abstractions are premature.

### Cognition / Devin

The inside view on multi-agent architecture; cited in Chapter 7.

- [*Don't Build Multi-Agents*](https://cognition.ai/blog/dont-build-multi-agents) — the context-sharing principles and warnings about naive multi-agent systems.
- [*Devin can now Manage Devins*](https://cognition.ai/blog/devin-can-now-manage-devins) — the managed multi-agent implementation that followed.

### Aider

The architect/editor pattern; cited in Chapter 3.

- [*Separating code reasoning and editing*](https://aider.chat/2024/09/26/architect.html) — the original writeup, including benchmark results.
- [Chat modes documentation](https://aider.chat/docs/usage/modes.html) — usage details for architect mode.
- [Aider blog](https://aider.chat/blog/) — ongoing updates.

---

## Critical / Skeptical Voices (Deliberately Cited)

- Harper Foley — [*Ten AI Agents Destroyed Production. Zero Postmortems.*](https://www.harperfoley.com/blog/ai-agents-destroyed-production-zero-postmortems) — the disaster catalog. Cited in **Chapter 1** as forecast of what happens when you skip mechanization.
- Marc Nuri — [*The Missing Levels of AI-Assisted Development: From Agent Chaos to Orchestration*](https://blog.marcnuri.com/missing-levels-ai-assisted-development) — the "ladder becomes a drop" argument. Cited in **Chapters 1 and 2**.
- Medium / Data Science Collective — [*Why AI Agents Keep Failing in Production*](https://medium.com/data-science-collective/why-ai-agents-keep-failing-in-production-cdd335b22219) — compounding-error analysis. Relevant to **Chapters 1 and 8**.
- The Pragmatic Engineer — [*New trend: programming by kicking off parallel AI agents*](https://blog.pragmaticengineer.com/new-trend-programming-by-kicking-off-parallel-ai-agents/) — surveys skeptic-to-convert arc across multiple practitioners.
- Reddit — [*Is "reviewing what parallel AI agents actually built" a better wedge?*](https://www.reddit.com/r/ClaudeAI/comments/1rzym3f/is_reviewing_what_parallel_ai_agents_actually/) — discussion of "agentic drift" and the review bottleneck.

---

## Foundational Texts on Software Design

- John Ousterhout — *A Philosophy of Software Design*. Core source for the engineering-discipline principles encoded into skills in **Chapter 5** (deep modules, information hiding, layered abstraction, strategic vs tactical).
- Kent Beck — *Test-Driven Development: By Example*. The TDD reference that TPD (**Chapter 4**) contrasts with.
- Will Larson — *An Elegant Puzzle* and *Staff Engineer*. Background on the transition from "doing" to "deciding" that **Chapter 9** invokes.

## Hillel Wayne on the Limits of Testing

Cited in **Chapter 4** as the sharpest public articulation of the limit that TPD inherits from any test-based approach.

- [*Why Don't People Use Formal Methods?*](https://www.hillelwayne.com/post/why-dont-people-use-formal-methods/)
- [*Why TDD Isn't Crap*](https://www.hillelwayne.com/post/why-tdd-isnt-crap/)
- [*Requirements change until they don't*](https://buttondown.com/hillelwayne/archive/requirements-change-until-they-dont/) — the cost-of-correctness argument cited in **Chapter 3**.

## Other Long-Form

- Ethan Mollick — *Co-Intelligence*. General framing for human-AI collaboration; touchpoint for **Chapter 10**.

---

## Tools Referenced

- [**Cursor**](https://cursor.com) — primary development environment for most parallel workflows described in the book.
- [**Claude Code**](https://www.anthropic.com/claude/code) — mentioned throughout; mode 4 reference in **Chapter 7**.
- [**Codex**](https://openai.com/codex/) — alternative primary agent.
- [**Devin**](https://devin.ai) — mentioned in Chapters 1, 5, 7.
- [**Aider**](https://aider.chat) — architect/editor pattern, Chapter 3.
- [**Playwright**](https://playwright.dev) — referenced in Chapter 7 for UI E2E testing in mode 3.
- [**`git worktree`**](https://git-scm.com/docs/git-worktree) — core mechanism for **Chapter 7 Mode 2** and the best-of-N worked example in Chapter 6.

## Research / Conceptual

- Ranganathan & Ye — work intensification research cited via Simon Willison's [blogmarks](https://simonwillison.net/dashboard/blogmarks-that-use-markdown/); relevant to **Chapter 9**.
- Literature on best-of-N sampling in LLMs. Relevant to **Chapter 6**.
- Incident-management triage models (PagerDuty-style, ITIL). Relevant to **Chapter 8** analogy.

---

*If you are reading this book on GitHub and know of a source that belongs here, pull requests are welcome.*
