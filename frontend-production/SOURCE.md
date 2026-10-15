# 来源与改编

本 Skill 把六个前端 Skill 合成一个入口，并参考一个审查 Skill 的方法。运行时只读 SKILL.md 和用到的参考文件，不需要联网读取上游。本目录不批准任何模板图片、字体、图标或商标。

| 参考文件 | 来源 | 许可 | 怎么用 |
|---|---|---|---|
| look-and-copy.md、look-examples.md | [frontend-less-ai-tone](https://github.com/a1024053774/frontend-less-ai-tone-skill)（LuckyE）及其上游 lieflat-less-ai-tone、Anthropic frontend-design、unslop-ui-skill、web-interface-guidelines | MIT；上游见 NOTICE | 规则原样迁入，只改 Skill 名称引用和链接 |
| visual-family.md、family-examples.md | [same-visual-family](https://github.com/a1024053774/same-visual-family-skill)（LuckyE） | MIT | 规则原样迁入；"若已安装 frontend-less-ai-tone"改成指向同 Skill 的镜头 |
| motion.md、motion-recipes.md | [emilkowalski/skills](https://github.com/emilkowalski/skills) 的 animate、review-animations、improve-animations | MIT（Emil Kowalski） | 三份合并去重并译成中文；代码、曲线、时长、阈值原样保留 |
| mobile-web.md | 同上 mobile-native | MIT（Emil Kowalski） | 译成中文；代码原样保留；补充审查模式下的分级换算 |
| plan-template.md | 同上 improve-animations 的 PLAN-TEMPLATE | MIT（Emil Kowalski） | 从动效扩展到所有镜头 |
| review-workflow.md、engineering-checks.md | 方法参考 [BadbotAI/BadGoods](https://github.com/BadbotAI/BadGoods) 的 review-frontend-production 0.3.0-beta | **未授予开放许可** | 只借用审查方法（快审/全审、页面与组件分母、定义与实例、场景轴、P0–P3、证据边界、四项分开报告），文字为重写，不含其文本、脚本或示例 |

上游钉住的版本：emilkowalski/skills 本地安装时的 skillFolderHash 见 `~/.agents/.skill-lock.json`；BadGoods 参考提交 `76d20b1`（2026-10-10）。

## 合并时定下的取舍

- 级别统一用 P0–P3，按实际后果定。动效审查的"拦下/通过"只针对动效改动本身，进入整体报告时换算成 P 级。
- 营销页最多一次进场（来自样子与文案），产品界面按动效频率表决定（来自动效）；stagger 算在营销页那一次里。
- 动效代码库审计不再分派并行子代理（与使用者的"默认不开多个代理"相冲突）。
- 全审台账用 Markdown 表，暂不提供校验脚本。
