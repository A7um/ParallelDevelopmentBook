# 第 3 章：钥匙 #1 — 需求对齐

> **论点**：需求对齐是整个工作流里唯一真正无法并行的一步。要么在这里深度投入，要么就在下游把这笔账一遍一遍地还——每个 Agent 还一次、每份测试计划还一次、每次审查还一次。

---

## 为什么这把钥匙躲不掉

第 1 章点名了三个必须被机制化才能让并行开发回本的卡点。第 4 章和第 5 章会讲怎么机制化正确性和可维护性。这一章任务更难，因为需求对齐*无法*机制化。它只能被**压缩**——单位注意力里做得更快、更彻底——让这一不可避免的串行步骤尽量短、尽量终局。

忽略这一章的失败模式具体而难看：五个 Agent 并行工作，每一个都对同一个需求有*略微*不同的解读，各自产出内部自洽但彼此拼不到一起的代码。bug 不在任何一个 Agent 的产出里，bug 在需求本身，而且被复制了五份。

> **模糊性 × 并行度 = 发散。** 每一个未解决的需求缝隙，你都要按 Agent 数量重复支付。

## 为什么一次性写 spec 不够

大多数工程师面对"把需求写下来"的第一反应是打开一个文档、描述这个功能。这是必要的，但不够。你写下来的是**你脑子里**那份需求。问题是你脑子里那份充满你看不见的缝隙——那些缝隙被你的上下文、你的品味、你对代码库的了解自动填上了。Agent 没有这些，它填空填出来的选择跟你的不会一样。

需求对齐的任务不是"写一份好 spec"。它是**把 Agent 本来会自己猜的每一个缝隙都暴露出来、一一决策掉**。

两种技术做了大部分工作，彼此互补。

## 技术一：穷尽式追问

动作：尽你所能地用自然语言描述功能。然后在 Agent 开始规划或编码**之前**，明确告诉它：

> 先不要开始做任何事。先列出你对这个需求还有哪些问题。小的、看起来显而易见的都算。我会回答它们，然后你根据我的回答继续问新的问题，直到你没有新问题为止。

Harper Reed 在 2025 年 2 月那篇广为流传的 [*My LLM codegen workflow atm*](https://harper.blog/2025/02/16/my-llm-codegen-workflow-atm/)（今日 Plan Mode 共识的祖先）把这一动作固化成了一份发表过的 prompt。他每个新项目都这样起头：

> Ask me one question at a time so we can develop a thorough, step-by-step spec for this idea. Each question should build on my previous answers, and our end goal is to have a detailed specification I can hand off to a developer. Let's do this iteratively and dig into every relevant detail. Remember, only one question at a time. Here's the idea: `<IDEA>`

结尾用：

> Now that we've wrapped up the brainstorming process, can you compile our findings into a comprehensive, developer-ready specification? Include all relevant requirements, architecture choices, data handling details, error handling strategies, and a testing plan so a developer can immediately begin implementation.

这一对 prompt 会产出一份 `spec.md`，它的形状正好可以直接喂到第 4 章的测试计划步骤。如果你不想自己造轮子，照抄这两个 prompt 没问题——重要的是机制，不是措辞。

### 为什么它管用

Agent 擅长从需求描述里生成**候选问题**。它见过无数份需求，模式匹配很好。它**不**擅长做符合你品味的**静默**决定——但你本来也没让它做静默决定，你让它把每个决策点暴露出来。

角色互换是关键：**你从"写 spec 的人"变成"回答问题的人"**。回答比起草在认知上便宜得多。你能在"起草一份 spec 覆盖 15 个决策点"的时间里回答 40 个问题。

## 技术二：方案生成 + 人类筛选

动作，针对那些你确实不太在乎细节的需求：还是先用自然语言描述功能。但这次你不是让它问，而是：

> 分析我的需求描述，找出里面模糊的、未定义的、或者有多种合理解读的部分。对每一个这样的点，基于你的知识（有需要的话去网上搜同类产品怎么处理），给出 top 3 选项，并说明推荐理由。我会挑。

Agent 会把你没想到但必须拍板的决策点甩到你面前——"未注册用户能不能看预览？""支付服务商超时的错误态是什么样？"——每一个都附三个选项和一条推荐。你扫一眼，大多数点头，一两个改掉，二十分钟内你就得到了一份本来要花一小时问答才能拿到的对齐文档。

### 什么时候用技术二而不是技术一

技术一更彻底、更重。技术二更轻，但依赖 Agent 的先验——它对"类似产品怎么做"的模型。在下列情况用技术一：

- 需求是产品的核心（你有品味，需要表达）
- 领域不常规（Agent 的先验跟你的现实不匹配）
- 小决定做错的代价很高

在下列情况用技术二：

- 需求是外围的（登录流、导出格式、分页风格）
- 你对大部分细节真的没有强意见
- 你宁愿把注意力花在别处

实践里，大多数认真做的功能两者都用：核心用技术一，边缘用技术二。

## 按复杂度分层的深度

第 2 章引用了作者自己的一条启发式：

> **复杂度越高，审得越深。复杂度低，放手。**

这条直接适用于需求对齐。"要深审"的信号：

- 不可逆的动作（支付、删除、对外 API 的副作用）
- 跨团队依赖（别人要和你的产出对接）
- 新问题域（Agent 的先验大概率不准）
- 涉及鉴权、权限、计费的任何东西

"可以放手"的信号：

- 模式成熟的 CRUD
- 内部工具或一次性脚本
- 容易回滚的改动

"放手"的工作上，15 分钟技术二往往就够。"深审"的工作上，预算一小时，先技术一再技术二——技术一把能想到的都摆出来，技术二在长尾上你不关心的地方收尾。

## 交付物

需求对齐的产出是一份文档，不是一次对话。对话是手段，文档是物件。文档要清晰到：

- 另一个 Agent 只拿到这份文档，也会做出同样的东西
- 第 4 章的测试计划可以直接从它写出来
- 当 Agent 在执行过半时带着问题回来，你能指着文档的某一节说"这里答过了"

最后一条尤其重要。你做这一步的全部理由就是让 Agent 在执行过程中不再需要你。如果文档回答不了执行中途的问题，那对齐就没做完——你只是把对话推迟了。

## 2026 年的示范例子：Plan Mode + SDD 流程

本章写作前的六个月里，业界在需求对齐上收敛到了一个非常具体的形状。它有两个名字指向同一个结构动作：**Plan Mode**（工具语汇——Claude Code、Cursor 的规划步、Gemini antigravity）和 **Spec-Driven Development（SDD）**（方法论语汇——见 Augment 2026 年 4 月的[实践者指南](https://www.augmentcode.com/guides/what-is-spec-driven-development) 以及 2026 年 1 月的[同名 arxiv 论文](https://arxiv.org/abs/2602.00180)）。

两者把 2025 年实践者们手工做的东西结晶成了标准形。今天的权威形状是四阶段循环，在 [*Plan Mode in Claude Code*（2026 年 2 月）](https://codewithmukesh.com/blog/plan-mode-claude-code/) 和 [Addy Osmani 2025 年底的工作流帖](https://addyosmani.com/blog/ai-coding-workflow/) 里都有详细说明：

**阶段 1 — 探索（只读）。** 进入 Agent 的 Plan Mode——一个只读上下文，它可以 grep 代码、映射依赖、读 spec，但不能改文件。你讲你想要什么，Agent 探地形并把"它已经知道的"和"它需要问的"摆到台面上。技术一的穷尽式追问循环就在这里跑。

**阶段 2 — 规划（spec + 实施计划）。** Agent 对着 spec 产出一份实施计划。SDD 语汇里，一份 Plan-ready 的 spec 现在要求六个具体元素（据 [Augment 指南](https://www.augmentcode.com/guides/what-is-spec-driven-development) 转述）：

1. *结果和边界* — 要建什么、哪些明确不建。
2. *约束和先前决定* — 对库、schema、不可妥协项的硬约束，避免 Agent 自行发明。
3. *任务分解* — 拆成离散的、小到能装进一个上下文的子任务。
4. *验收标准* — 每个子任务明确可测的验收条件。它们会在第 4 章成为独立 Verifier Agent 的契约。
5. *子任务之间的接口* — 让并行执行（第 7 章）安全可行。
6. *模型分层* — 哪些角色用哪些模型。2026 年当前约定：*写 spec* 用最强模型，*实现* 用中等模型，*验证* 用快而便宜的模型。

把 spec 写到一个文件里——社区基本统一到 `docs/plans/<feature>.md` 或功能 worktree 里的 `spec.md`。`AGENTS.md`（第 5 章会讲）引用它。生成它的那段对话是一次性的，文件不是。

**阶段 3 — 实施（小块推进）。** 把计划交给执行 Agent。Agent 一个子任务接一个子任务地推进，用 spec 的验收标准作为自己的红绿信号。

**阶段 4 — 提交。** 结构化 PR（参考第 8 章的 `end-of-task-report` skill），引用计划文件。

### "一句话规则"

从 [Plan Mode 指南](https://codewithmukesh.com/blog/plan-mode-claude-code/) 里来的一条好用的小实践：**如果你能用一句话把需要的 diff 说清楚，就跳过 Plan。否则 Plan Mode 必须做。** 这条规则给"对齐是额外成本"和"对齐就是工作"划出了一条干净的切线。这也是对"spec-first 对小改动太重"这种批评的实际回应。

### 这个形状从哪来

这个形状不是凭空出现的。Harper Reed 2025 年 2 月的 *[My LLM codegen workflow atm](https://harper.blog/2025/02/16/my-llm-codegen-workflow-atm/)* 是三文件模式（`spec.md` + `prompt_plan.md` + `todo.md`）第一次被广泛复制的公开写法。他的 prompts 今天还在用，结构上是稳的——它们是 2026 Plan Mode 共识的 2025 年祖先。如果你用的工具没有内建 Plan Mode，Reed 那套 [prompts](https://harper.blog/2025/02/16/my-llm-codegen-workflow-atm/) 是一个能跑的起点；但知道：2026 的约定在 Reed 的原 prompts 基础上额外必须包含"验收标准"和"接口规格"。

Plan Mode / SDD 共识给出的结构主张——也就是我在这里背书的——是：**需求对齐产出一份包含六个具体元素的文件，Agent 的实现对这个文件契约式地负责，这个文件是代码库里的一等公民，按复杂度分层地审查。**

## 值得偷的第二个模式：把 spec 当文件

Reed 的工作流把对齐步骤的产出放进 `spec.md`，把规划步骤的产出放进 `prompt_plan.md` + `todo.md`。Addy Osmani 的 [*My LLM coding workflow going into 2026*](https://addyosmani.com/blog/ai-coding-workflow/) 独立收敛到同样的结构，Geoffrey Huntley 的 Ralph 循环建立在 `PROMPT.md` 加一个 `specs/` 目录之上。三位先驱、三套工作流、一个共同动作：

> **对齐的产物是文件，不是对话。** 文件跨 Agent 可移植、能在 session 压缩中幸存、在未来一个没在场的 sub-Agent 眼里也能看懂"我们达成了什么"。

本节里如果只偷一件事，就偷这件：需求对齐的交付物是一份在 repo 里、文件名叫 `spec.md`（或者你们项目约定的名字），被每一个下游步骤引用。对话是手段，文件是物件。

## 为什么需求对齐不能并行

本书的其它一切都能并行。需求对齐不行。它要求：

- 你最深的注意力（你在做一批塑造下游一切的决定）
- 你串行的认知带宽（你一次只能深想一个功能）
- 你的品味（Agent 没有）

这条限制在调度上有一个实操后果。同时跑三四个 Agent 时，真实的节奏是这样的：

1. 对齐任务 A 的需求（30 分钟深度注意力）
2. 把 A 交给它的 Agent 做规划和测试计划（Agent 的工作，你空了）
3. A 在工作期间，开始对齐任务 B 的需求
4. 把 B 交出去
5. B 在规划时，回去看 A 的测试计划，批准或调整
6. 继续轮转

**你在对齐上是串行的，在其它一切上是并行的。** 把对齐想成步枪的装弹、把执行想成扣扳机：步枪能连发，但它要一颗一颗装。

## "对齐完成"的检查清单

在让 Agent 从"规划"进入"编码"之前：

- [ ] spec 用一句话写出用户目标。
- [ ] 每一个输入都有定义好的类型、默认值、校验规则。
- [ ] 每一个输出都有定义好的类型和格式。
- [ ] 正路被端到端写出来了。
- [ ] 每一个错误情形都有定义好的行为——面向用户的提示、重试策略、或升级路径。
- [ ] 非目标被列出来了（那些 Agent 可能添、但你不想要的东西）。
- [ ] Agent 问过的每一个问题都有一个写在文档里的答案。
- [ ] 假设把这份文档交给另一个（不是你当前在用的）Agent，你会预期它做出同一样东西。

只要有一条没勾，你就没对齐完。现在交出去，账会在第 4 章或更后面付。

## zero-review 参考

`zero-review/auto-req` skill 是作者把上述两种技术编码成一条可跑 skill 的参考实现。书里会多次引用；值得一读，看看"把需求对齐编码为 skill"是什么样子。

*参考*：[`zero-review/auto-req`](https://github.com/A7um/zero-review/tree/main/skills/auto-req)

---

## 外部声音

- **支持 — 2026 SDD 共识**：[Augment Code Spec-Driven Development 指南（2026 年 4 月）](https://www.augmentcode.com/guides/what-is-spec-driven-development) 把六元素 spec 和 spec-first / spec-anchored / spec-as-source 的严格度分层固化下来。[2026 年 1 月同名论文](https://arxiv.org/abs/2602.00180) 是它的学术版本。
- **支持 — Plan Mode 作为工具原语**：[*Plan Mode in Claude Code*（2026 年 2 月）](https://codewithmukesh.com/blog/plan-mode-claude-code/) 和 [Get AI Perks 完整指南（2026 年 3 月）](https://www.getaiperks.com/en/articles/claude-code-plan-mode) 是当前的上手指南。Plan Mode 本质上把本章的"穷尽式追问"做成了一个工具特性；用 Claude Code 时，改动超出"一句话规则"就进 Plan Mode。
- **支持 — 打磨 harness，不打磨 prompt**：Mitchell Hashimoto 在 [*My AI Adoption Journey*（2026 年 2 月）](https://mitchellh.com/writing/my-ai-adoption-journey) 里说 `AGENTS.md` 风格的约束文档加确定性钩子，比任何一个 prompt 都重要。在他的表述里，需求对齐一半是 Agent 读的文档、一半是捕捉文档抓不到的那类错误的 harness。
- **反驳 — "需求会变，直到它不变"**：Hillel Wayne 的 *[Requirements change until they don't](https://buttondown.com/hillelwayne/archive/requirements-change-until-they-dont/)* 是对 spec-first 原教旨主义最到位的反推——当需求真的流变时，重的前置规格成本昂贵且经常出错。他的观点不否定本章的技术；它收紧了边界：在你相信不会变的部分做最深的对齐，在流动的部分留轻。上面的一句话规则就是对他的一条实际回应。

## 下一章

第 4 章讲钥匙 #2：怎么用一份在编码前写好的测试计划替代逐行代码审查，并按工作的复杂度决定审得多深。
