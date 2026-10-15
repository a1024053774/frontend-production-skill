# 规则迁移记录

合并时每条规则都移到了新位置，没有静默删除。下面列出去向和**有意没带过来的内容**（删除候选，待你确认）。

## 去向

| 原 Skill | 原位置 | 新位置 |
|---|---|---|
| frontend-less-ai-tone | SKILL.md 全文 | references/look-and-copy.md（原文迁入） |
| frontend-less-ai-tone | examples.md | references/look-examples.md（相对链接改成 GitHub Pages） |
| same-visual-family | SKILL.md 全文 | references/visual-family.md（原文迁入） |
| same-visual-family | examples.md | references/family-examples.md（同上） |
| animate | Hard Rules、Build Sequence 1–7、Never Ship、Output、Tone | motion.md §1–3、§7 |
| animate | RECIPES.md | motion-recipes.md |
| review-animations | Ten Standards、Escalation Triggers、Remedial Hierarchy、Output Format、Guidelines | motion.md §5 |
| review-animations | STANDARDS.md | motion.md §4、§8 |
| improve-animations | Hard Rules、Workflow Phase 1–4、Invocation Variants、Tone | motion.md §2、§6 |
| improve-animations | AUDIT.md | motion.md §4（值）、§6.2（各类搜什么） |
| improve-animations | PLAN-TEMPLATE.md | plan-template.md（扩到所有镜头） |
| mobile-native | 全文 | mobile-web.md |
| BadGoods review-frontend-production | 方法（不含文本） | SKILL.md §1、§3；review-workflow.md；engineering-checks.md |

## 机械核对

`coverage.py`（在会话 scratchpad 中，未随包分发）对比了：Emil 四个 Skill 的所有代码块行和行内代码 token，以及你两个 Skill 的每个句子是否出现在新文件里。未出现的只有下面这些有意改动。

## 删除候选（有意没带过来）

| 内容 | 来源 | 理由 |
|---|---|---|
| "Initial Response"：首次调用只回一句固定开场白 | animate、review-animations、improve-animations、mobile-native | 合并后入口是一个 Skill，固定开场白会挡住用户的实际请求 |
| 按类别分派最多 4–8 个并行只读子代理 | improve-animations Phase 2 | 与全局"默认不开多个代理"冲突；改为单代理按八类审 |
| `execute <plan>` 分派执行子代理到隔离 worktree | improve-animations | 同上；保留为"在隔离工作区实施后按 §5 审 diff" |
| 指向 `pick-ui-library`、`find-animation-opportunities`、`animate-expo` | animate、mobile-native | 本机未安装这些 Skill；改成"用项目已有组件库或无样式 primitives"和"React Native 不在范围内" |
| "不要把本 Skill 名称写进用户可见选项"中的"本 Skill" | 你的两个 Skill | 改成"Skill 名称"，意思不变 |
| same-visual-family 的 `v1.2` 版本号和"若已安装 frontend-less-ai-tone" | same-visual-family | 合并后两者同在一个 Skill，改成指向 look-and-copy.md |
| 计划模板里动效专用的 HIGH/MEDIUM/LOW 作为唯一级别 | improve-animations | 统一成 P0–P3，HIGH/MEDIUM/LOW 作为动效审计的附注保留 |

## 有意改变的规则

- 动效审查的"Block"不再等于整站不能上线，按 SKILL.md §3 换算（Block 本身在 motion.md §5 原样保留）。
- 营销页"最多一次进场"与动效 stagger 配方的关系写明：stagger 算在那一次里。
