# Source Catalog

A working bibliography for *The Parallel Development Book*.

**Currency policy**: this book's practices are sourced from the **last six months** of public writing at time of drafting — roughly October 2025 through April 2026. AI coding practice moves fast; what was leading-edge in early 2025 is often stale by late 2025. Sources older than six months are included only when (a) the underlying argument is structural and durable (e.g., Hillel Wayne on the limits of testing, Ousterhout on software design) or (b) the piece is the *ancestor* of a current practice and worth citing as history, in which case it is explicitly labeled as such.

Every citation below is dated. If a date is in the past six months relative to April 2026, it is treated as current practice. If it is older, it is explicitly noted as *historical* or *durable structural reference*.

---

## Companion Artifacts

- [`zero-review/auto-req`](https://github.com/A7um/zero-review/tree/main/skills/auto-req) — referenced in **Chapter 3**.
- [`zero-review/auto-dev`](https://github.com/A7um/zero-review/tree/main/skills/auto-dev) — referenced in **Chapters 4 and 5**.
- [`zero-review/auto-test`](https://github.com/A7um/zero-review/tree/main/skills/auto-test) — referenced in **Chapter 4**.
- [`zero-review/auto-triage`](https://github.com/A7um/zero-review/tree/main/skills/auto-triage) — referenced in **Chapter 8**.
- [*The Skill Design Book*](https://github.com/A7um/SkillDesignBook) — the author's companion book on `SKILL.md` authorship. Essential background for **Chapter 5**.

---

## Current Practice (Oct 2025 – April 2026)

### Spec-Driven Development and Plan Mode

The dominant 2026 framework for requirement alignment and correctness contracts.

- [*What Is Spec-Driven Development? A Practitioner's Guide for AI Coding*](https://www.augmentcode.com/guides/what-is-spec-driven-development) (Augment Code, **April 2026**) — defines the six-element spec and the Adversarial Agent Pattern. Cited in **Chapters 3, 4**.
- [*Spec-Driven Development: From Code to Contract in the Age of AI Coding Assistants*](https://arxiv.org/abs/2602.00180) (arXiv, **Jan 2026**) — academic framing of SDD. Cited in **Chapter 3**.
- [*Plan Mode in Claude Code*](https://codewithmukesh.com/blog/plan-mode-claude-code/) (**Feb 2026**) — 4-phase Explore/Plan/Implement/Commit cycle, one-sentence rule. Cited in **Chapters 3, 4**.
- [*Claude Code Plan Mode: Complete Guide (2026)*](https://www.getaiperks.com/en/articles/claude-code-plan-mode) (**Mar 2026**) — more detailed Plan Mode reference.

### AGENTS.md engineering

The 2026 cross-tool standard, replacing tool-specific `CLAUDE.md` / `.cursorrules`.

- [*How to Build Your AGENTS.md (2026)*](https://www.augmentcode.com/guides/how-to-build-agents-md) (Augment Code, **March 2026**) — lean (<150 lines), nested, symlinked, version-controlled. Cited in **Chapter 5**.
- [*Is "AGENTS.md Engineering" The Next Optimisation Approach?*](https://paulswithers.github.io/blog/2026/02/23/agentsmd-engineering/) (**Feb 2026**) — surveys the ETH Zurich research on context-file performance degradation. Cited in **Chapter 5**.
- [Agents.md best practices gist](https://gist.github.com/0xfauzi/7c8f65572930a21efa62623557d83f6e) (**2026**) — working engineer's practical notes on symlinks and cross-tool compatibility.
- [Anthropic Agent Skills documentation](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) (**ongoing, materially updated late 2025**) — on-demand skill loading vs. always-loaded `AGENTS.md`. Cited in **Chapter 5**.

### Recent capability landmarks

- [*Claude Opus 4.5 Unlocks the "No Restart" Workflow*](https://bytesizedbrainwaves.substack.com/p/claude-opus-45-unlocks-the-no-restart) (**Dec 2025**) — the capability that makes extended autonomous test-fix-test loops genuinely practical. Cited in **Chapter 4**.
- [*The Parallel AI Workflow Developer Setup For 2026*](https://bobde-yagyesh.medium.com/the-parallel-ai-workflow-developer-setup-for-2026-5191f3d18e1a) (**March 2026**) — current concrete tooling survey: terminal tabs, worktrees, slash commands.
- [*Best Tools for Running Parallel AI Coding Agents in 2026*](https://nimbalyst.com/blog/best-tools-for-running-parallel-ai-coding-agents/) (**March 2026**) — `ccmanager`, `dmux`, `agentree`, and other emerging orchestrators.
- [*State of AI agent coders April 2026: agents vs skills vs workflows*](https://www.reddit.com/r/AI_Agents/comments/1sjk0fv/state_of_ai_agent_coders_april_2026_agents_vs/) (**April 2026**) — community snapshot of which abstractions still matter.

### Pioneer practices, last six months

Boris Cherny (Claude Code creator) — Dec 2025 X thread and tips:
- [X thread on numbered-tab parallel workflow](https://x.com/bcherny/status/2007179833990885678) (**Nov 2025**). Cited in **Chapters 1, 7**.
- [15 Claude Code tips shared by Cherny](https://www.reddit.com/r/ClaudeCode/comments/1s8oqfn/) (**Dec 2025**) — `claude -w`, `/teleport`, `/loop`, `/schedule`, hooks, subagents. Cited in **Chapter 7**.
- [*Claude Code creator reports 259 PRs in 30 days*](https://www.reddit.com/r/ClaudeAI/comments/1px44q0/) (**Dec 2025**). Cited in **Chapters 1, 2**.
- [Educative — *Master this workflow from the creator of Claude Code*](https://www.educative.io/newsletter/artificial-intelligence/claude-code-creators-workflow) (**Dec 2025** / early 2026). Cited in **Chapter 7**.
- [*Head of Claude Code: What happens after coding is solved*](https://www.lennysnewsletter.com/p/head-of-claude-code-what-happens) (Lenny's Newsletter, **Feb 2026**).

Mitchell Hashimoto — Feb 2026 adoption memoir:
- [*My AI Adoption Journey*](https://mitchellh.com/writing/my-ai-adoption-journey) (**Feb 5, 2026**). Three-phase arc (inefficiency → adequacy → workflow discovery). Cited in **Chapters 2, 5, 8, 9**.
- [Pragmatic Engineer — *Mitchell Hashimoto's new way of writing code*](https://newsletter.pragmaticengineer.com/p/mitchell-hashimoto) (**Feb 2026**).
- [Zed — *Agentic Engineering in Action with Mitchell Hashimoto*](https://zed.dev/blog/agentic-engineering-with-mitchell-hashimoto) (**2026**).

Armin Ronacher — Jan–Feb 2026 Pi/OpenClaw series:
- [*Pi: The Minimal Agent Within OpenClaw*](https://lucumr.pocoo.org/2026/1/31/pi/) (**Jan 31, 2026**). Cited in **Chapter 7**.
- [*Porting MiniJinja to Go With an Agent*](https://lucumr.pocoo.org/2026/1/14/minijinja-go-port/) (**Jan 14, 2026**). Cited in **Chapter 7**.
- [*A Language For Agents*](https://lucumr.pocoo.org/2026/2/9/a-language-for-agents/) (**Feb 9, 2026**) — comprehension debt. Cited in **Chapter 9**.
- [Syntax.fm — *Pi, The AI Harness That Powers OpenClaw*](https://syntax.fm/show/976/pi-the-ai-harness-that-powers-openclaw-w-armin-ronacher-and-mario-zechner/transcript) (**Feb 2026**).
- [*Armin Ronacher Leaning In To Find Out* — PyAI Conf 2026 talk](https://www.youtube.com/watch?v=8RHYyRUxVrA) (**2026**).

Addy Osmani — Dec 2025 / 2026 workflow posts:
- [*My LLM coding workflow going into 2026*](https://addyosmani.com/blog/ai-coding-workflow/) (**Dec 2025**). Cited in **Chapters 3, 5, 10**.
- [*Top AI Coding Trends for 2026 — Beyond Vibe Coding*](https://beyond.addy.ie/2026-trends/) (**early 2026**) — Agent Skills formalization. Cited in **Chapter 5**.

Geoffrey Huntley — Ralph Loop methodology (ongoing, materially current):
- [*Ralph Wiggum as a "software engineer"*](https://ghuntley.com/ralph/) (**ongoing / late 2025**). Cited in **Chapters 1, 4, 7**.
- [`how-to-ralph-wiggum` repo](https://github.com/ghuntley/how-to-ralph-wiggum) (**maintained 2025–2026**).
- [*how to build a coding agent: free workshop*](https://ghuntley.com/agent/).
- [*I dream about AI subagents*](https://ghuntley.com/subagents/).

Cognition / Devin — multi-agent principles:
- [*Don't Build Multi-Agents*](https://cognition.ai/blog/dont-build-multi-agents) (**2025**, argumentative). Cited in **Chapter 7**.
- [*Devin can now Manage Devins*](https://cognition.ai/blog/devin-can-now-manage-devins) (**2025–2026**). Cited in **Chapter 7**.

Simon Willison — ongoing practice blog:
- [*Agentic Engineering Patterns*](https://simonw.substack.com/p/agentic-engineering-patterns) (**2026**) — Red/Green TDD as first-class agentic pattern. Cited in **Chapter 4**.
- [*Embracing the parallel coding agent lifestyle*](https://simonwillison.net/2025/Oct/5/parallel-coding-agents/) (**Oct 5, 2025**) — skeptic-to-convert piece. Cited in **Chapter 2**.

---

## Historical Ancestors (pre-Oct 2025, included for context)

These are the 2024–early 2025 practices that led to the current consensus. Cite them as *history* — they are not current practice.

- Harper Reed — [*My LLM codegen workflow atm*](https://harper.blog/2025/02/16/my-llm-codegen-workflow-atm/) (**Feb 2025**). The three-file pattern (`spec.md` + `prompt_plan.md` + `todo.md`) whose prompts are structurally still sound but whose lack of verification criteria and interface specification make it incomplete by 2026 SDD standards. Cited as ancestor in **Chapter 3**.
- Aider — [*Separating code reasoning and editing*](https://aider.chat/2024/09/26/architect.html) (**Sep 2024**). The architect/editor split was the first production articulation of "specify first, implement second" — but the current consensus (Plan Mode + SDD + Adversarial Agent) has moved substantially beyond it. Not cited in current chapters.

---

## Skeptical / Critical Voices

Deliberately engaged rather than avoided.

- Harper Foley — [*Ten AI Agents Destroyed Production. Zero Postmortems.*](https://www.harperfoley.com/blog/ai-agents-destroyed-production-zero-postmortems) (**2025–2026**). Cited in **Chapter 1** as forecast of skipping mechanization.
- Marc Nuri — [*The Missing Levels of AI-Assisted Development*](https://blog.marcnuri.com/missing-levels-ai-assisted-development) (**2025**). The "ladder becomes a drop" argument. Cited in **Chapters 1, 2**.
- [*Why AI Agents Keep Failing in Production*](https://medium.com/data-science-collective/why-ai-agents-keep-failing-in-production-cdd335b22219) (Data Science Collective, **2026**) — compounding-error analysis.
- [*The 80% Problem: Why AI Coding Agents Stall*](https://tianpan.co/blog/2026-02-21-ai-coding-agent-best-practices) (**Feb 2026**) — Ronacher-inspired analysis of assumption propagation and comprehension debt.

---

## Durable Structural References (intentionally older)

These are older than the six-month window but are cited for *structural* claims that do not become stale.

- John Ousterhout — *A Philosophy of Software Design* (**2018/2021**). Cited in **Chapter 5** for the core engineering-discipline principles.
- Kent Beck — *Test-Driven Development: By Example* (**2002**). Cited in **Chapter 4** as the TDD reference TPD contrasts with.
- Hillel Wayne on the limits of testing and formal methods (**2018–2024**). Cited in **Chapter 4**:
  - [*Why Don't People Use Formal Methods?*](https://www.hillelwayne.com/post/why-dont-people-use-formal-methods/)
  - [*Why TDD Isn't Crap*](https://www.hillelwayne.com/post/why-tdd-isnt-crap/)
  - [*Requirements change until they don't*](https://buttondown.com/hillelwayne/archive/requirements-change-until-they-dont/) (cited in **Chapter 3**).
- Will Larson — *An Elegant Puzzle*, *Staff Engineer*. Background for **Chapter 9**.
- Ethan Mollick — *Co-Intelligence*. Touchpoint for **Chapter 10**.

---

## Tools Referenced

- [**Cursor**](https://cursor.com)
- [**Claude Code**](https://www.anthropic.com/claude/code)
- [**Codex**](https://openai.com/codex/)
- [**Devin**](https://devin.ai)
- [**Pi / OpenClaw**](https://lucumr.pocoo.org/2026/1/31/pi/) — Ronacher's minimal harness, the mode 2/3 exemplar in **Chapter 7**.
- [**Playwright**](https://playwright.dev)
- [**`git worktree`**](https://git-scm.com/docs/git-worktree)

---

*If you are reading this book on GitHub and know of a recent (<6 months) source that belongs here, pull requests are welcome.*
