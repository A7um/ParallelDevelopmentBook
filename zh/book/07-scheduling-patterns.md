# 第 7 章：调度模式

> **论点**：并行有四种模式，粒度从粗到细，分别对应不同的磨合阶段。别在第一阶段就去用模式四，也别在第三阶段还停留在模式一。

---

## 这里"调度"是什么意思

三把钥匙到位、廉价失败理解之后，剩下的问题是*怎么真正让多个 Agent 同时跑*。"开五个 Claude Code 窗口往里面敲字"算一种策略，而且是差的那种。不同粒度的并行有不同的协调成本、不同的失败模式、对你磨合阶段有不同的前置要求。

四种模式，从粗到细：

| 模式 | 粒度 | 协调成本 | 适用阶段 |
|---|---|---|---|
| 1 | 跨独立项目 | 非常低 | 第 1 阶段及以上 |
| 2 | 同一项目内不重叠功能 | 低（通过 `git worktree`） | 第 2 阶段及以上 |
| 3 | 同一功能内不同事务类型 | 中 | 第 3 阶段及以上 |
| 4 | 同一任务内拆子 Agent | 设置成本高，运行成本低 | 主要是第 3–4 阶段，前沿 |

你会同时用多种模式。一个忙周里的第四阶段工程师可能在三个项目上跑模式 1，在其中一个项目内部跑模式 2，在其中一个功能里跑模式 3。那已经是六个 Agent 在跑，还没动模式 4。

## 模式 1：跨项目并行

**动作**：你有两三个独立项目（不同 repo、不同产品）。每个项目跑一个 Agent，各自做自己的 backlog。项目之间不共享代码，Agent 之间不干扰。

**为什么容易**：没有协调。每个项目有自己的 skill、自己的约定、自己的需求。并行的唯一一份是*你的注意力*，你通过在对齐阶段在项目之间轮转、让每个项目异步执行来管理它。

**能跑的节奏**：

1. 对齐项目 A 的需求（20–30 分钟深度注意力）。
2. 把 A 交给 Agent 做规划和测试计划生成。
3. A 在工作时，切到项目 B。对齐。
4. 把 B 交出去。
5. B 在规划时，查 A 的测试计划，批准或调整。
6. 轮转。

这是"多会议室"模式。你是在它们之间走的 tech lead。如果你磨合出的结晶能干净交接，这个模式几乎零成本，给你一份工程师时间上的两三个项目吞吐。

**前置**：项目本身得在可以干净交接的状态。成熟项目有约定有 skill 的：trivial。你还在琢磨架构的新项目：模式 1 帮不上忙，因为深度注意力本来就在 A 项目上，不在轮转里。

## 模式 2：Worktree 并行——同项目内、不重叠工作

**动作**：在同一代码库里，你有两三个互不触碰同一文件的功能。你用 `git worktree` 为每一个建独立目录，每个 checkout 不同分支，每个 worktree 里跑一个 Agent。它们不干扰是因为在分开的目录里。

**`git worktree` 为什么重要**：多个 Agent 跑在同一 checkout 上很快变得一团糟。它们争着改工作树，测试重叠，一个 Agent 的 WIP 改动破坏另一个的测试跑。Worktree 给每个 Agent 自己的隔离目录同时绑到同一 repo，干净解决机械问题。

**流程**：

1. `git worktree add ../project-featureA featureA-branch`
2. `git worktree add ../project-featureB featureB-branch`
3. 每个 worktree 启动一个 Agent，各自加载同一套共享 skill 和 `AGENTS.md`。
4. 每个 Agent 独立跑第 3–5 章的流程。
5. Agent 完成后，把分支合回 main。解决合并冲突——理想情况让 Agent 处理机械的，你处理策略冲突。

Claude Code 为这件事有快捷：`claude -w` 标志（见 Cherny 的 [15 条提示](https://www.reddit.com/r/ClaudeCode/comments/1s8oqfn/btw_boris_cherny_shared_15_new_tips_to_use_claude/)）自动为一个 session 建 worktree，你不用手动管目录。用别的 Agent 的话，上面的 shell 命令照样能用；机制是 git 的，不是任何具体工具的。

**正交性的经验法则**：两个功能主要触碰不同文件（比如 <20% 重叠），模式 2 能跑。重叠很重（>50%）的话，要么串行做，要么重新拆分任务边界。合并冲突吃掉的时间能轻易抹掉并行的收益。

**磨合前置**：你需要足够多的共享 skill（第 5 章），让两个并行 Agent 产出同一风格的代码。没有它，合并清理被风格不一致主导，令人沮丧且难自动化。这也是模式 2 大多出现在第 2 阶段及以上的原因。

## 模式 3：跨事务类型并行——同一功能内

**动作**：在*同一个*功能内，**不同类**的工作可以在同一功能上下文里并行。你为每类工作启动一个 Agent。

具体例子。你在做"订单导出 CSV"功能。三个 Agent 同时跑：

- **Agent A — 后端正确性。** 围绕导出逻辑构造单元和集成测试：空输入、巨大输入、并发导出、损坏的订单。写后端实现。关上测试计划。
- **Agent B — UI 端到端。** 围绕导出按钮构造 Playwright 测试：点击、验证下载、检查错误态、测试加载中的禁用态。写和调 UI 粘合代码。
- **Agent C — 已知 bug backlog。** 把你一直搁着的那堆小 bug（和这个功能无关但在同一区域）清一清，这样功能发布时它们也没了。

这三个 Agent 在同一功能分支，但触不同层。协调成本中：它们共享一个分支，所以集成顺序重要。通常 A 和 C 先合进去，B 等 A 稳定后在其上跑。

**这个模式为什么重要**：很多功能工作都是这个形状——后端逻辑、UI 粘合、不同级别的测试、附带的 bug 清单——一个工程师天然会串行做。按事务类型拆，给你同一功能内部真实的并行，而不用付模式 2 的合并代价。

**磨合前置**：你要有提前把模块间接口定下来的纪律，这样 Agent B 不会一直被 Agent A 的决定堵住。这是第 5 章架构步的回报：接口预先规定的话，模式 3 跑得干净。

## 模式 4：Agent 内部并行——单任务内拆子 Agent

**动作**：你把一个大任务交给 Agent。*Agent* 把它拆成子任务，在每一个上跑一个 sub-Agent，合并结果。你不管分解，顶层 Agent 管。

Claude Code 的 "team" 模式和类似的 "orchestrator + workers" 模式就是实现。吸引力显然：你不用预先规划并行，Agent 自己搞定。

**为什么是最难的模式**：Agent 的分解只有它定义的接口契约那么好。如果 sub-Agent 得在执行途中协调（"你那个函数到底返回什么？"），它们会撞、合得差、或产出不兼容输出。你又回到了协调问题，只是现在由 Agent 解决——它可能擅长、也可能不。

**当前诚实状态**：模式 4 是真的——在边界清晰、范围明确的任务上能跑。在混乱的现实任务上（分解本身就是难的），模式 4 常常比单 Agent 串行跑更差，因为合并成本压倒了并行收益。

Cognition 的 *[Devin can now Manage Devins](https://cognition.ai/blog/devin-can-now-manage-devins)* 从内部描述了他们的模式 4 实现：一个协调者 Devin 给每个受托 Devin 分配工作，每个跑在自己的隔离 VM 里。关键是同一团队发表了 *[Don't Build Multi-Agents](https://cognition.ai/blog/dont-build-multi-agents)* —— 两者并不矛盾。后者是反对**幼稚**多 Agent 模式（不共享上下文）；前者是一个共享的实现。他们的明确原则：**"共享上下文，不是只共享消息"** 和 **"动作携带隐含决策；冲突决策导致失败"**。如果顶层 Agent 不能把推理轨迹和 sub-Agent 共享，sub-Agent 不能收敛到兼容决策，模式 4 就会退化成多数怀疑报告描述的那种"混乱"。

**什么时候真值得做**：与模式 3 相同的条件，但在更小粒度上。如果架构步（第 5 章）把模块边界定得清楚，而每个子任务都装进一个模块，Agent 内部分解是可靠的。如果架构模糊，就不是。

**对第 5 章的直接依赖**：模式 4 基本是"架构设计做得好"的分红。一个模块边界定义清楚、接口契约明确的代码库**自动**适合并行分解。一个 Agent"边写边设计"的代码库不适合。这是"别跳过架构步、即便很想跳"最强的实用论据。

**什么时候伸手**：第 3 阶段及以上，在分解明显的任务上（你本可以手工用模式 3，但很烦）。把它当作替代模式 3 的省力工具，不是神奇的生产力乘数。

## 一次最多开几个

实用上限，粗略：

- **第 2 阶段**：一到两个 Agent。超过两个会崩。
- **第 3 阶段**：三到四个比较舒服。第五个开始要刻意的注意力纪律。
- **第 4 阶段**：五到八个，搭配模式组合。超过八个，经验丰富的工程师也会掉线。

Cherny 报告同时跑 10 到 15 个 Claude Code session。那是一个经过深度磨合的操作者、在一个成熟代码库上的高端值；不是基线。读一下他的工作流（[Educative](https://www.educative.io/newsletter/artificial-intelligence/claude-code-creators-workflow)），你会看到配套机械——编号终端标签、系统通知、`/commit-push-pr` slash 命令、让 Claude 能测它刚造出的 UI 的 Chrome 扩展——这些存在就是为了让 15 个 Agent 能被*一份注意力*管得过来。没这些机械，上限会陡降。

限速的几乎从来不是 Agent 算力或工具。是**你在对齐和审查阶段、在任务之间轮转时保持上下文的能力**。多开 Agent 让 Agent 更多，但让人机协作时刻的决策更差——第 1 章说过，那才是真正瓶颈所在。

> **并行 Agent 的合适数量，就是"你的对齐和审查质量还不退化"的最大那个数。**

## 范例——Geoffrey Huntley 的 Ralph 循环作为最小调度原语

Ralph 循环在 [ghuntley.com/ralph](https://ghuntley.com/ralph/) 和 [`how-to-ralph-wiggum`](https://github.com/ghuntley/how-to-ralph-wiggum) 有公开记录，值得研究，因为它是有人发表过的**最简单可用的并行 Agent 调度器**。剥到最核心：

```bash
while :; do cat PROMPT.md | claude-code ; done
```

那一行就是全部调度器。让它工作的是它依赖的东西：

- **`PROMPT.md`** —— 一份确定性 prompt，告诉 Agent 在每次重新启动时查看 repo 状态、挑恰好一个让它能推进的任务。
- **`specs/`** —— 规格目录，Agent 用来知道"完成"长什么样的可持久产物。
- **`IMPLEMENTATION_PLAN.md`** —— Agent 在多次迭代之间读写的动态计划。
- **测试作为反向压力** —— Agent 不能 commit 一个测试失败的任务，所以坏状态自然地在那个任务上停下，直到被修好。

每次迭代都是**全新**上下文窗口。没有对话历史在迭代之间传递。这刻意地阻止了 Huntley 命名的主要失败模式——"上下文腐败"：Agent 在几小时来回之后开始重复早期错误或漂离原任务。把上下文每轮扔掉，换来新鲜度的保证，代价是一点启动成本。

Huntley 的 [`how-to-ralph-wiggum`](https://github.com/ghuntley/how-to-ralph-wiggum) 把循环进一步分为两种模式：

- **规划模式** —— 读 `specs/` 和当前 `src/`，做差距分析，更新 `IMPLEMENTATION_PLAN.md`。
- **建造模式** —— 读 `IMPLEMENTATION_PLAN.md`，挑最重要的任务，实现、跑测试、commit。

你定期跑规划保持计划对 spec 新鲜，大部分时间跑建造。这是第 3 章 Plan Mode 那个"先规格后执行"分裂的原始版本。

为什么放在这一章而不是更早？因为 **Ralph 是把 shell 循环当成模式 2 / 模式 3 调度器来用**，不绑工具。你可以对着 Claude Code、Codex、任何 Agent CLI 跑。两个 Ralph 循环在两个 worktree 里是模式 2。两个 Ralph 循环在同一 worktree 里对着不同的 `PROMPT.md`（一个后端、一个 UI）是模式 3。值得理解是因为每一个托管产品（Claude Code 的 team 模式、Cursor 的背景 Agent、Devin 的 managed Devins）本质上都是这个模式加一层人机工学。

## 范例——Armin Ronacher 的 "Pi" 最小 harness（2026 年 1–2 月）

如果 Ralph 是最简单调度原语，**Pi** 是相反动作的最干净范例：通过一个刻意最小化、Agent 可以自己修改的 harness 跑并行 Agent。Armin Ronacher 的三篇帖——[*Pi: The Minimal Agent Within OpenClaw*](https://lucumr.pocoo.org/2026/1/31/pi/)（1 月 31）、[*Porting MiniJinja to Go With an Agent*](https://lucumr.pocoo.org/2026/1/14/minijinja-go-port/)（1 月 14）、[*A Language For Agents*](https://lucumr.pocoo.org/2026/2/9/a-language-for-agents/)（2 月 9）——描述的工作流围绕：

- **微小核心**，只有四个工具（Read、Write、Edit、Bash）。其他一切都是 Agent 自己能写的扩展。
- **自修改扩展。** Pi 热加载 Agent 在 session 里写的扩展——所以 Agent 真的在学任务的同时扩展自己的 harness。
- **分支作为一等操作。** Pi 让 Ronacher 把 Agent session rewind 到更早的消息，然后在那里分一条新路——避免他称之为 *vision quest* 的失败模式，即 Agent 因为早期上下文已经漂离而重新从头来过。
- **语言无关的重新实现。** Ronacher 从 MiniJinja 移植里的一个观察：当代码便宜，把一个库*在目标语言里由 Agent 重新实现*经常比跨语言构建系统搏斗容易。这是第 6 章廉价失败原则的直接后果。

对本章要紧的是：**Pi 是把模式 2 和模式 3 实现为 harness 设计，而不是工具特性。** 它证明你可以不依赖任何厂商的 team 模式拿到强并行——如果你把 harness 当作自己拥有的东西，原语是便宜的。

## 范例——Cherny 的 15 session 设置（2025 年晚期快照）

> **时效说明**：下面的细节来自 Cherny 2025 年 12 月的公开分享。Claude Code 在四个月里已发了大量 Plan Mode、subagents、skills 的改动；把它当作这种模式的**美学**范例，不是当前命令参考。

美学谱的另一端是 Boris Cherny 公开分享过的工作流，它用 Claude Code 的托管特性而非 bash 循环。这个配置，从他的 [X 推文](https://x.com/bcherny/status/2007179833990885678)、他的 [15 条提示汇编](https://www.reddit.com/r/ClaudeCode/comments/1s8oqfn/btw_boris_cherny_shared_15_new_tips_to_use_claude/) 和 [Educative 整理](https://www.educative.io/newsletter/artificial-intelligence/claude-code-creators-workflow) 拼出来，大约是这样：

- **五个终端标签** 编号 1–5，每个跑一个 Claude Code session，通常在由 `claude -w` 创建的独立 worktree 上。
- **另外五到十个 session** 跑在 `claude.ai` 浏览器标签上，用 `claude --teleport`（或 session 里的 `/teleport`）在终端和 web 之间移动 session。
- **移动 session** 从他手机上启动和查看。
- 每个 repo 根目录的 **`CLAUDE.md`**，每次 Agent 犯一次值得阻止的错就多一条。
- **Slash 命令** 处理交接里可重复的部分—— `/commit-push-pr` 一把完成 stage、commit、push、开 PR；定制的命令处理那个代码库里常见的工作流。
- **Subagent** 做专门角色——code simplifier、test verifier——在主 session 里需要时被调起。
- **生命周期钩子**—— `PreToolUse` 记录 shell 命令，`Stop` 在 Agent 早早宣布完成时让它继续跑。
- **`/loop` 和 `/schedule`**—— 把工作流变成持久运行的 skill。Cherny 的例子是 `/loop 5m /babysit` 每 5 分钟跑一次维护任务。
- **一个 Chrome 扩展** 让 Claude 看和点击它刚建的 UI —— Cherny 说这是 UI 工作质量的 2–3 倍乘数。
- **系统通知** 只用于"Agent 需要输入"，绝不用于"Agent 完成"。这把 inbox 模式转成 pull 模式，是他配置里被抄得最多的一个细节。

注意这个配置实际在做什么。`CLAUDE.md` 是钥匙 #3 编码成的动态文档。slash 命令和钩子是在执行边界上机制化对齐和交接。Chrome 扩展是第 4 章的 Agent 当用户测试。编号标签 + 通知是调度原语。`claude -w` worktree 标志是模式 2。Cherny 基本上把这本书的主论点烤进了他的日常人机工学，15 session 的吞吐就是结果。

你不需要 Claude Code 的具体特性来复现。上面每一条都有 shell 脚本对应；Huntley 的 Ralph 循环是存在性证明。**"边界机制化，注意力在中间轮转"** 这个模式才是要紧的。

## 完整一天范例——混合模式

具体化一下，第四阶段一天大概是这样：

- 早晨 9:00–9:30：对齐项目 A 功能 1（模式 1）。交给 Agent A1。
- 9:30–10:00：对齐项目 A 功能 2（模式 2——独立 worktree）。交给 A2。
- 10:00–10:20：对齐项目 B（模式 1）。交给 Agent B1。
- 10:20–10:45：Agent A1 带着测试计划回来。按复杂度分层审。批准。A1 开始实现。
- 10:45–11:15：并行地，A2 带计划回来，B1 对 spec 有问题。答 B1；批 A2。
- 11:15 往后：A1 在实现。对 A1 启动一个模式 3 子并行做 UI 测试（同一功能上第二个 Agent）。同时在项目 B 上对一个小重构启动 best-of-N（第 6 章）——两个替代尝试，各 30 分钟。
- 下午：读报告。批准合并。挑 best-of-N 赢家。开始下一轮。

那是一天里七八次 Agent 运行、三个项目、四种模式在用。限速器不是工具。是你保持每个交接形状在脑子里、再干净地回到它的能力。

## 反模式

- **在第一阶段就伸手抓模式 4。** 你会看到 sub-Agent 在从未定义过的接口上撞车，得出"Agent 内部并行没用"的结论，然后怪这个特性。特性没问题；你还没准备好。
- **不用 `worktree`（或等效隔离）做模式 2。** 两个 Agent 在一个 checkout 上是合并冲突制造机。别。
- **没做架构步就跑模式 3。** 没定义接口的同功能 sub-Agent 会漂、会打架。先定义。
- **在其实真正瓶颈是某个项目早期需要你注意力的时候做模式 1。** 跨项目并行帮不了——如果一个项目吸收了 80% 的认知预算。

---

## 外部声音

- **支持**：`git worktree` 在 AI 辅助开发圈子里是已知技巧有一段时间了；值得搜从业者的自建设置脚本帖。Anthropic 的 Claude Code 团队文档从内部描述了模式 4。
- **反驳**：大量（HN、X）报告模式 4 在真实工作上失败。这些几乎都是准确的报告，应读作"模式 4 需要架构前置"，不是"模式 4 坏了"。

## 下一章

第 8 章讲并行执行跑通之后冒出来的瓶颈：产出多到你读不过来。解法是把同一把戏再往上套一层——让 Agent 分诊 Agent。
