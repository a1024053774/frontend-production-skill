# Frontend Production

把 Web 前端做到能上线、也审到能上线的一个 Skill。一个入口，五个镜头：

| 镜头 | 管什么 |
|---|---|
| 样子与文案 | 主行动、视觉方向、一个记忆点、按钮与空状态文案、AI 默认皮否决 |
| 同族 | 多来源区块装进已选体系，借结构不借皮 |
| 动效 | 该不该动、曲线与时长、中断、减弱动效；单次审查与代码库改进计划 |
| 手机端 | 视口、触摸、滚动、安全区；必须真机确认的部分 |
| 工程 | 页面与组件分母、场景、状态与数据、可访问性、性能、安全边界 |

四种模式：做 `build`、快审 `quick`（默认）、全审 `full`、改 `implement`。所有镜头共用 P0–P3 分级。审查默认只读；事实只来自给定材料，没有的数字、客户、认证写成缺口，不编。

## 对照

同一个虚构夹具：精工减速机询价页，读者是采购，主要在手机上用。页面里埋了 18 个缺陷，答案键先于夹具写成，审查代理看不到。两个子代理用同一提示词快审，只读源码、不跑浏览器；一个读本 Skill，一个禁用所有 Skill。

| | 用了 Skill | 未用 Skill |
|---|---|---|
| 检出 | 18/18 | 16.5/18 |
| 只有一方命中 | 键盘高频的命令面板不该有打开动画；下拉菜单的 `transform-origin` | — |

基线模型本身已经很强，这个夹具区分度有限。可见差别在：动效频率规则和具体目标值、族卡逐值对照、"源码确证/源码推理"分开标注、级别按后果定并写明升降条件。两份报告都没把未运行的结论写成通过。

夹具、提示词、两份报告和逐项评分在 [`evals/quick-review-order-page/`](evals/quick-review-order-page/)，复跑方法见其中的 [`PROMPTS.md`](evals/quick-review-order-page/PROMPTS.md)。这证明 Skill 被执行时能改输出，不是审美或上线通过证明。

## 适用范围

- 新建或改样式、写界面文案、去 AI 味
- 从多个模板、组件库或参考站拼一页，各块不像一家
- 加动效、审动效、给代码库出动效改进计划
- 手机 Web / PWA 在手机上感觉不对
- 前端体检、全站 review、上线前交接

不要用：React Native、纯后端、纯文档。

## 使用

安装：

```bash
npx skills add a1024053774/frontend-production-skill --skill frontend-production -g -y
```

然后直接告诉 Agent：

```text
用 frontend-production 快审这个询价页：读者是采购，主行动是提交询价，主要在手机上用。先不要改代码。
```

它取代 [`frontend-less-ai-tone`](https://github.com/a1024053774/frontend-less-ai-tone-skill)、[`same-visual-family`](https://github.com/a1024053774/same-visual-family-skill)，以及 Emil Kowalski 的 `animate`、`review-animations`、`improve-animations`、`mobile-native`。同时装着原来的 Skill 会重复触发；每条规则的去向和有意没带过来的内容见 [COVERAGE.md](COVERAGE.md)。

## 设计依据

样子与文案、同族两个镜头原样迁入 [frontend-less-ai-tone](https://github.com/a1024053774/frontend-less-ai-tone-skill) 和 [same-visual-family](https://github.com/a1024053774/same-visual-family-skill)。动效和手机端改编自 [emilkowalski/skills](https://github.com/emilkowalski/skills)（MIT），代码、曲线、时长、阈值原样保留。工程审查方法参考 [BadbotAI/BadGoods](https://github.com/BadbotAI/BadGoods) 的 review-frontend-production；该项目未授予开放许可，本仓库只借用方法，不包含其文本、脚本或示例。来源钉死见 [`frontend-production/SOURCE.md`](frontend-production/SOURCE.md)。

仓库地址：[github.com/a1024053774/frontend-production-skill](https://github.com/a1024053774/frontend-production-skill)

## License

MIT. Third-party notices: [NOTICE](NOTICE).
