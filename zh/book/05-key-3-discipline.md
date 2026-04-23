# 第 5 章：钥匙 #3 — 用工程纪律约束 Agent

> **论点**：Skill 不是一次性安装的东西。它是你磨合过程中沉淀下来的"活档案"，专门编码**你这个项目**里特定的坏习惯。通用的工程原则只是起点，不是终点。

---

## 为什么只保证正确性不够

第 4 章把正确性做成了机制。一段代码可以正确但对代码库是灾难——结构糟糕、过度耦合、混用三套命名、在两个目录之外已经存在的工具函数被它重新发明一遍。正确性让你扛过今天；**可维护性**决定下周的 Agent 能不能在你这周交付的代码里工作。

单 Agent、人审的工作流里，可维护性由你在审查中执行。你会说"这里别用继承，用策略对象"，Agent 就改。这条路径 scale 不到三个 Agent 在同一小时里交出三个 PR。要么机制化，要么它停止被执行。

机制就是 **skill**。Skill 是在 Agent 启动时加载的结构化文档，它塑造 Agent 如何做设计、如何审自己的产出。它把"你在审查里会说的话"变成"Agent 交付前会自检的东西"。

## 通用原则——起点

项目 skill 集合的前一半，是你在任何 code review 里都会提的通用软件设计纪律。这部分大多来自 Ousterhout 的 *A Philosophy of Software Design*，可以干净地编码成一份短 skill，把 Agent 的初版架构从*默认值*抬到*可用的中等水平*：

- **深模块。** 接口简单，内部功能深厚。Agent 天然倾向拆过细；skill 要显式把它推回来。
- **信息隐藏。** 模块不应该泄露内部。Agent 这一条最常见的失败是按执行顺序拆模块（"A 步模块、B 步模块"），而不是按知识归属拆——后者几乎必然泄露。
- **抽象分层。** 每一层提供一种不同的思维模型。一层只把调用转给下一层，这一层就没挣到工钱。
- **内聚与分离。** 必须同时被理解的代码留在一起；通用和特例混一起让两者都难懂的，该分开。
- **通过定义处理错误。** 偏好通过"让错误消失"（默认行为、语义简化）的设计，而不是到处 `try/catch`。
- **命名和显而易见。** 读者不应该惊讶。命名要具体、跨代码库一致、不自造缩写。
- **文档增量信息。** 注释应描述代码无法表达的——意图、权衡、不变式。不是字面复述代码做什么。
- **战略优于战术设计。** 每一次改动都是对结构的投资。短平快最终以复利利息堆出技术债。

这些是好默认。编码成 skill 后，Agent 的初版架构会明显高于它未经训练的基线。

但通用原则有上限。一个"知道"这些原则的 Agent，仍然可能漏掉你代码库已有的工具函数自己造一遍、用一种两年前你某个文件里用过但代码库其它地方都不用的命名风格、或选一个抽象上正确但不匹配你所用框架约定的设计模式。通用 skill 抓不到这些，因为它们**特定于你的项目**。通用线以外，skill 必须是你的。

> 单份 skill 文档本身的写作工艺——结构、描述用词、触发条件、失败模式——是 *[The Skill Design Book](https://github.com/A7um/SkillDesignBook)* 的主题。本章关心的是 skill **在并行工作流里作为可维护性机制**如何起作用，不是教你怎么写一份。

## 先驱们怎么真正积累他们的 skill（以及 2026 年的研究说了什么）

本章写作前的六个月里，业界已把 `AGENTS.md` 标准化为跨工具的上下文文件。Claude Code（通过 `CLAUDE.md` 符号链接）、Cursor、Codex、Gemini 的 antigravity 和大多数主流 Agent 都采纳了。最有用的当前参考是 Augment 团队（2026 年 3 月）的 *[How to Build Your AGENTS.md (2026)](https://www.augmentcode.com/guides/how-to-build-agents-md)*。

最近六个月里几项值得内化的发现：

- **保持在 150 行以下。** ETH Zurich 2026 年 2 月的研究（在 Paul Withers 的 *[Is AGENTS.md Engineering the next optimisation approach?](https://paulswithers.github.io/blog/2026/02/23/agentsmd-engineering/)* 有总结）发现冗长或 LLM 生成的 `AGENTS.md` 反而会**降低**任务成功率、推高成本——原因是长上下文上的"lost in the middle"退化。人类手作、简洁的文件性能明显更好。
- **嵌套用于模块化。** Agent 优先读取当前工作目录最近的那个 `AGENTS.md`。根目录放一个短的、覆盖代码库范围的文件，然后在需要不同规则的子目录里放聚焦的 `AGENTS.md`。
- **符号链接解决跨工具。** 2026 年的常规动作是 `ln -s AGENTS.md CLAUDE.md`——这样你用的每一个 Agent 不管它偏爱哪个文件名都读同一份。这现在是标准做法。
- **把它当代码对待。** 检入 git、版本控制、在 PR 中审查。Mitchell Hashimoto 在 *[My AI Adoption Journey*（2026 年 2 月）](https://mitchellh.com/writing/my-ai-adoption-journey) 里把 `AGENTS.md` 当作一份每次观察到新失败类别就更新的活合同——不是一次写完的东西。
- **Skill 是另一个通道。** Anthropic 的 [Agent Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) 和 Addy Osmani 的 [2026 同一模式写法](https://beyond.addy.ie/2026-trends/) 把*总是加载*的上下文（`AGENTS.md`）和*按需加载*的 skill（`SKILL.md` 在自己的目录里，按任务相关性触发）分开。这个切分很重要，因为它让你拥有五十条特化 skill 而不会撑爆每一个 session。

2026 共识压缩一句：**根目录一份精干的 `AGENTS.md` 承载持久的代码库范围规则，一个聚焦 `SKILL.md` 包的库承载任务专用工作流，都检入 git，都纳入版本控制，都在 PR 中审。** 成熟项目最后大概是一份 60–120 行左右的根 `AGENTS.md` 加十到四十条聚焦 skill，每条都绑定到 Agent 犯过一次、不该再犯的一类具体错误上。单条 skill 的形状——描述、触发、正文、检查表——在 *[The Skill Design Book](https://github.com/A7um/SkillDesignBook)* 里有详尽处理；这里要紧的是**文件里每一条规则都来自一次具体失败、携带它的原因，并且如果你没亲眼看 Agent 犯错，它就不会出现**。

真正把质量抬上去的 skill，是那些编码"**你的** Agent 在**你的**代码库里犯过的错"的 skill。"遵守好命名约定"是无用的——Agent 本来就在试。"这个代码库的 handler 命名约定是 `handle<EntityName><Action>`——Agent 倾向写 `<entityName>Handler` 而写错"是金子。这种具体性就是全部要点。

> **通用 skill 是默认配置。特定 skill 是磨合结晶所在。** 前者你写一次，后者你一次一个失败地积累。

## 三阶段执行流

skill 到位后，Agent 对一个功能的工作长这样：

1. **架构设计。** 给定需求 spec（第 3 章）和测试计划（第 4 章），Agent 提出模块边界、接口、文件组织、抽象。它是在加载 skill 集合的情况下做这件事——所以设计已经反映了深模块、信息隐藏、命名一致性。人按复杂度分层审查这份设计。这一步做对了，是第 7 章模式 4（Agent 内部并行）能够成立的前提——这里定义的接口契约让 sub-Agent 能并行而不撞车。
2. **实现与验证。** Agent 写代码和测试，跑套件，调试失败，迭代到绿（第 4 章）。
3. **自审。** 在宣布完成前，Agent 在加载 skill 的情况下重读自己的 diff，检查违规：浅模块、冗余层、只转发的中间层、命名不一致、和已有工具的重复。它自己修好。

第 1 步和第 3 步是新的。它们替代你原本在审查时应用的架构判断和最后打磨。你仍然参与——你批准架构、在高复杂度工作上抽查自审——但你不再是**唯一**的防线。

## Skill 注入仍然不够的地方

诚实谈极限：

- **原则之间的冲突。** 深模块 vs 小可组合件；战略设计 vs YAGNI。这些真的会冲突，skill 仲裁不了——判断才行。有争议的场景里，Agent 需要 skill 里的明确指导："在*这个*代码库里，宁可深模块即使单测更难做；我们更看重接口简洁。"
- **横切关注点。** 安全、可观测性、性能——它们不住在一个模块里，"考虑一下安全"这种 skill 太虚。这些通常需要（a）专门的工具（linter、scanner）或（b）非常具体的 skill（"任何写 DB 的端点，要求调用者的权限在 handler 里、DB 调用之前已经检查过"）。
- **Agent 之间的品味漂移。** 不同训练数据的不同 Agent 偏差不同。为 Claude 调好的 skill 集，用 Codex 模型读起来可能不一样。这是可移植故事的一条真实极限；切主力 Agent 时预留重新调优的时间。
- **全新子系统。** 第一次碰一个新框架、新语言、新服务，你还不知道失败模式。还没有 skill 可以写。你要在那个子系统上先交学费（第 2 章），然后从学到的东西里写 skill。

哪一条都不致命。每一条都意味着"skill 能带你走很远，不是全部路"。

## 与并行调度的关系

本章属于本书第三部分——解锁并行工作。和第 7 章（调度模式）的关系直接：

- 模式 1–3 在 Agent 加载共享 skill 集时更好工作。没有它，三个 Agent 会产出三种风格的代码、合并时一团乱。
- **模式 4——Agent 内部并行——在架构步没有定义接口契约的情况下基本做不到。** 并行工作的 sub-Agent 只能在接口被预先定下时干净地合并。这是钥匙 #3 的直接红利：你执行的架构纪律是让并行分解可行的东西。

跳过架构、让 Agent"边写边设计"是最快丢失并行收益的办法。小功能单 Agent 能撑；中等功能三 Agent 会灾难性失败。

## zero-review 参考

`zero-review/auto-dev` skill 把这个三阶段循环——架构设计、实现与验证、自审——编码成一条可跑 skill，包括 Ousterhout 衍生的设计原则和一份具体自审清单。值得一读，是"把工程纪律编码为 skill"的范例。

*参考*：`[zero-review/auto-dev](https://github.com/A7um/zero-review/tree/main/skills/auto-dev)`

---

## 外部声音

- **支持**：*A Philosophy of Software Design*（Ousterhout）仍是底层原则最好的单一来源。Anthropic 的 [Agent Skills 文档](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) 把注入机制固化。关于单份 skill 文档本身的写作工艺，参见 *[The Skill Design Book](https://github.com/A7um/SkillDesignBook)*。
- **反驳**：基于规则的设计的批评者主张编码的原则会僵化成形式主义检查表、失去本意。这是真实风险，尤其对通用 skill。反驳是：项目特定的 skill 不泛化、因此不僵化——它们和它们所由之来的伤疤绑定。

## 下一章

第三部分完成。第 6 章开启第四部分，讲经济学相变：当尝试成本从小时降到分钟，探索变得便宜，best-of-N 不再是奢侈品。