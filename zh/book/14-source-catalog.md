# 引用目录

*并行开发之书* 的工作书目。

**时效政策**：本书引用的实践来自写作时过去**六个月**的公开写作——大致 2025 年 10 月到 2026 年 4 月。AI 编程实践演化很快；2025 年初还前沿的东西到 2025 年底经常就过时。超出六个月的来源只在下列情况被引用：（a）底层论点结构性、经久（比如 Hillel Wayne 讲测试的极限、Ousterhout 讲软件设计），或（b）该材料是当前实践的**祖先**、值得作为历史来引用——这时会明确标注。

下面每一条引用都带日期。相对 2026 年 4 月在过去六个月内的视作当前实践。更老的显式标注为*历史*或*经久结构性参考*。

---

## 配套作品

- [`zero-review/auto-req`](https://github.com/A7um/zero-review/tree/main/skills/auto-req) — **第 3 章**。
- [`zero-review/auto-dev`](https://github.com/A7um/zero-review/tree/main/skills/auto-dev) — **第 4、5 章**。
- [`zero-review/auto-test`](https://github.com/A7um/zero-review/tree/main/skills/auto-test) — **第 4 章**。
- [`zero-review/auto-triage`](https://github.com/A7um/zero-review/tree/main/skills/auto-triage) — **第 8 章**。
- [*The Skill Design Book*](https://github.com/A7um/SkillDesignBook) — 作者关于 `SKILL.md` 写作的配套书。**第 5 章**的重要背景。

---

## 当前实践（2025 年 10 月 – 2026 年 4 月）

### Spec-Driven Development 和 Plan Mode

2026 年需求对齐和正确性契约的主导框架。

- [*What Is Spec-Driven Development? A Practitioner's Guide for AI Coding*](https://www.augmentcode.com/guides/what-is-spec-driven-development)（Augment Code，**2026 年 4 月**）— 定义六元素 spec 和 Adversarial Agent Pattern。**第 3、4 章**引用。
- [*Spec-Driven Development: From Code to Contract in the Age of AI Coding Assistants*](https://arxiv.org/abs/2602.00180)（arXiv，**2026 年 1 月**）— SDD 的学术论述。**第 3 章**引用。
- [*Plan Mode in Claude Code*](https://codewithmukesh.com/blog/plan-mode-claude-code/)（**2026 年 2 月**）— 探索 / 规划 / 实施 / 提交四阶段循环，一句话规则。**第 3、4 章**引用。
- [*Claude Code Plan Mode: Complete Guide (2026)*](https://www.getaiperks.com/en/articles/claude-code-plan-mode)（**2026 年 3 月**）— 更详细的 Plan Mode 参考。

### AGENTS.md 工程

2026 年的跨工具标准，替代工具特定的 `CLAUDE.md` / `.cursorrules`。

- [*How to Build Your AGENTS.md (2026)*](https://www.augmentcode.com/guides/how-to-build-agents-md)（Augment Code，**2026 年 3 月**）— <150 行、嵌套、符号链接、版本控制。**第 5 章**引用。
- [*Is "AGENTS.md Engineering" The Next Optimisation Approach?*](https://paulswithers.github.io/blog/2026/02/23/agentsmd-engineering/)（**2026 年 2 月**）— 综述 ETH Zurich 关于上下文文件性能退化的研究。**第 5 章**引用。
- [Agents.md 最佳实践 gist](https://gist.github.com/0xfauzi/7c8f65572930a21efa62623557d83f6e)（**2026**）— 从业工程师关于符号链接和跨工具兼容的实操笔记。
- [Anthropic Agent Skills 文档](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)（**2025 年底实质性更新**）— 按需 skill 加载 vs 总是加载的 `AGENTS.md`。**第 5 章**引用。

### 近期能力里程碑

- [*Claude Opus 4.5 Unlocks the "No Restart" Workflow*](https://bytesizedbrainwaves.substack.com/p/claude-opus-45-unlocks-the-no-restart)（**2025 年 12 月**）— 让长时间自主测-修-测循环真正可行的能力。**第 4 章**引用。
- [*The Parallel AI Workflow Developer Setup For 2026*](https://bobde-yagyesh.medium.com/the-parallel-ai-workflow-developer-setup-for-2026-5191f3d18e1a)（**2026 年 3 月**）— 当前具体工具概览：终端标签、worktree、slash 命令。
- [*Best Tools for Running Parallel AI Coding Agents in 2026*](https://nimbalyst.com/blog/best-tools-for-running-parallel-ai-coding-agents/)（**2026 年 3 月**）— `ccmanager`、`dmux`、`agentree` 等涌现的编排器。
- [*State of AI agent coders April 2026: agents vs skills vs workflows*](https://www.reddit.com/r/AI_Agents/comments/1sjk0fv/state_of_ai_agent_coders_april_2026_agents_vs/)（**2026 年 4 月**）— 社区对哪些抽象仍然重要的快照。

### 最近六个月的先驱实践

Boris Cherny（Claude Code 创建者）— 2025 年 12 月 X 推文和提示：
- [X 推文：编号标签并行工作流](https://x.com/bcherny/status/2007179833990885678)（**2025 年 11 月**）。**第 1、7 章**引用。
- [Cherny 分享的 Claude Code 15 条提示](https://www.reddit.com/r/ClaudeCode/comments/1s8oqfn/)（**2025 年 12 月**）— `claude -w`、`/teleport`、`/loop`、`/schedule`、钩子、subagent。**第 7 章**引用。
- [*Claude Code 创建者报告 30 天 259 PR*](https://www.reddit.com/r/ClaudeAI/comments/1px44q0/)（**2025 年 12 月**）。**第 1、2 章**引用。
- [Educative — *Master this workflow from the creator of Claude Code*](https://www.educative.io/newsletter/artificial-intelligence/claude-code-creators-workflow)（**2025 年 12 月** / 2026 年初）。**第 7 章**引用。
- [*Head of Claude Code: What happens after coding is solved*](https://www.lennysnewsletter.com/p/head-of-claude-code-what-happens)（Lenny's Newsletter，**2026 年 2 月**）。

Mitchell Hashimoto — 2026 年 2 月采用回忆录：
- [*My AI Adoption Journey*](https://mitchellh.com/writing/my-ai-adoption-journey)（**2026 年 2 月 5 日**）。三阶段弧线（低效 → 够用 → 工作流浮现）。**第 2、5、8、9 章**引用。
- [Pragmatic Engineer — *Mitchell Hashimoto's new way of writing code*](https://newsletter.pragmaticengineer.com/p/mitchell-hashimoto)（**2026 年 2 月**）。
- [Zed — *Agentic Engineering in Action with Mitchell Hashimoto*](https://zed.dev/blog/agentic-engineering-with-mitchell-hashimoto)（**2026**）。

Armin Ronacher — 2026 年 1–2 月 Pi / OpenClaw 系列：
- [*Pi: The Minimal Agent Within OpenClaw*](https://lucumr.pocoo.org/2026/1/31/pi/)（**2026 年 1 月 31 日**）。**第 7 章**引用。
- [*Porting MiniJinja to Go With an Agent*](https://lucumr.pocoo.org/2026/1/14/minijinja-go-port/)（**2026 年 1 月 14 日**）。**第 7 章**引用。
- [*A Language For Agents*](https://lucumr.pocoo.org/2026/2/9/a-language-for-agents/)（**2026 年 2 月 9 日**）— 理解力债务。**第 9 章**引用。
- [Syntax.fm — *Pi, The AI Harness That Powers OpenClaw*](https://syntax.fm/show/976/pi-the-ai-harness-that-powers-openclaw-w-armin-ronacher-and-mario-zechner/transcript)（**2026 年 2 月**）。
- [*Armin Ronacher Leaning In To Find Out* — PyAI Conf 2026 演讲](https://www.youtube.com/watch?v=8RHYyRUxVrA)（**2026**）。

Addy Osmani — 2025 年 12 月 / 2026 年工作流帖：
- [*My LLM coding workflow going into 2026*](https://addyosmani.com/blog/ai-coding-workflow/)（**2025 年 12 月**）。**第 3、5、10 章**引用。
- [*Top AI Coding Trends for 2026 — Beyond Vibe Coding*](https://beyond.addy.ie/2026-trends/)（**2026 年初**）— Agent Skills 形式化。**第 5 章**引用。

Geoffrey Huntley — Ralph 循环方法论（持续，实质性更新）：
- [*Ralph Wiggum as a "software engineer"*](https://ghuntley.com/ralph/)（**持续 / 2025 年末**）。**第 1、4、7 章**引用。
- [`how-to-ralph-wiggum` repo](https://github.com/ghuntley/how-to-ralph-wiggum)（**2025–2026 维护**）。
- [*how to build a coding agent: free workshop*](https://ghuntley.com/agent/)。
- [*I dream about AI subagents*](https://ghuntley.com/subagents/)。

Cognition / Devin — 多 Agent 原则：
- [*Don't Build Multi-Agents*](https://cognition.ai/blog/dont-build-multi-agents)（**2025**，论辩）。**第 7 章**引用。
- [*Devin can now Manage Devins*](https://cognition.ai/blog/devin-can-now-manage-devins)（**2025–2026**）。**第 7 章**引用。

Simon Willison — 持续实践博客：
- [*Agentic Engineering Patterns*](https://simonw.substack.com/p/agentic-engineering-patterns)（**2026**）— Red/Green TDD 作为一等 Agent 模式。**第 4 章**引用。
- [*Embracing the parallel coding agent lifestyle*](https://simonwillison.net/2025/Oct/5/parallel-coding-agents/)（**2025 年 10 月 5 日**）— 怀疑转信徒。**第 2 章**引用。

---

## 历史祖先（2025 年 10 月之前，仅作为上下文）

这些是 2024–2025 年初引向当前共识的实践。作为*历史*引用——它们不是当前实践。

- Harper Reed — [*My LLM codegen workflow atm*](https://harper.blog/2025/02/16/my-llm-codegen-workflow-atm/)（**2025 年 2 月**）。三文件模式（`spec.md` + `prompt_plan.md` + `todo.md`）的祖先，prompt 结构上仍然站得住，但按 2026 SDD 标准缺少验收标准和接口规格因而不完整。**第 3 章**作为祖先引用。
- Aider — [*Separating code reasoning and editing*](https://aider.chat/2024/09/26/architect.html)（**2024 年 9 月**）。architect/editor 分裂是"先规格后实现"的第一次生产级表述——但当前共识（Plan Mode + SDD + Adversarial Agent）已走得远远更远。当前章节未引用。

---

## 怀疑 / 批评声音

刻意参与而非回避。

- Harper Foley — [*Ten AI Agents Destroyed Production. Zero Postmortems.*](https://www.harperfoley.com/blog/ai-agents-destroyed-production-zero-postmortems)（**2025–2026**）。**第 1 章**作为"跳过机制化会怎样"的预报引用。
- Marc Nuri — [*The Missing Levels of AI-Assisted Development*](https://blog.marcnuri.com/missing-levels-ai-assisted-development)（**2025**）。"梯子变成跳水"论。**第 1、2 章**引用。
- [*Why AI Agents Keep Failing in Production*](https://medium.com/data-science-collective/why-ai-agents-keep-failing-in-production-cdd335b22219)（Data Science Collective，**2026**）— 复合错误分析。
- [*The 80% Problem: Why AI Coding Agents Stall*](https://tianpan.co/blog/2026-02-21-ai-coding-agent-best-practices)（**2026 年 2 月**）— Ronacher 启发的假设传播和理解力债务分析。

---

## 经久结构性参考（刻意更老）

这些超出六个月窗口但为*结构性*主张被引用，主张本身不过时。

- John Ousterhout — *A Philosophy of Software Design*（**2018/2021**）。**第 5 章**的核心工程纪律原则。
- Kent Beck — *Test-Driven Development: By Example*（**2002**）。**第 4 章** TPD 对照的参考。
- Hillel Wayne 关于测试和形式方法的极限（**2018–2024**）。**第 4 章**引用：
  - [*Why Don't People Use Formal Methods?*](https://www.hillelwayne.com/post/why-dont-people-use-formal-methods/)
  - [*Why TDD Isn't Crap*](https://www.hillelwayne.com/post/why-tdd-isnt-crap/)
  - [*Requirements change until they don't*](https://buttondown.com/hillelwayne/archive/requirements-change-until-they-dont/)（**第 3 章**引用）。
- Will Larson — *An Elegant Puzzle*、*Staff Engineer*。**第 9 章**背景。
- Ethan Mollick — *Co-Intelligence*。**第 10 章**触点。

---

## 工具引用

- [**Cursor**](https://cursor.com)
- [**Claude Code**](https://www.anthropic.com/claude/code)
- [**Codex**](https://openai.com/codex/)
- [**Devin**](https://devin.ai)
- [**Pi / OpenClaw**](https://lucumr.pocoo.org/2026/1/31/pi/) — Ronacher 的最小 harness，**第 7 章**模式 2/3 范例。
- [**Playwright**](https://playwright.dev)
- [**`git worktree`**](https://git-scm.com/docs/git-worktree)

---

*如果你在 GitHub 上读这本书，并知道一条近期（<6 月）来源该加入，欢迎提 PR。*
