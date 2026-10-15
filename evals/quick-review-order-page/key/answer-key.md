# 答案键（先于夹具写成，审查代理看不到）

Brief：精工减速机订货页，读者是采购，主行动"提交询价"。已知：速比 5–100，扭矩至 18 kN·m。没有认证、客户数、成功率资料。主要在手机上用。

| ID | 镜头 | 缺陷 | 位置提示 | 合理级别 |
|---|---|---|---|---|
| D1 | 手机/可访问性 | viewport 禁用缩放 maximum-scale=1, user-scalable=no | index.html meta | P1–P2 |
| D2 | 手机 | .app 100vh + 底部固定提交栏被地址栏压住 | style.css .app | P2 |
| D3 | 手机 | 输入框 14px，iOS 聚焦放大 | style.css input | P2–P3 |
| D4 | 手机/动效 | 未门控 :hover scale | style.css .btn:hover | P3 |
| D5 | 动效 | 下拉 transition: all 400ms ease-in + scale(0) + 中心原点 | style.css .menu | P3 |
| D6 | 动效 | Ctrl+K 命令面板有 300ms 打开动画（键盘高频） | style.css .palette / app.js | P3 |
| D7 | 文案 | 编造数据 99.9% / 5000+ 客户 / 行业领先认证，套话标题，"Get Started" | index.html hero | P2（编造事实） |
| D8 | 同族 | 页脚另一套皮：衬线字体、紫色强调、24px 圆角 | style.css footer | P3 |
| D9 | 可访问性 | 提交是 div onclick，键盘不可用 | index.html #submit | P1 |
| D10 | 状态 | 提交无防重复、无超时/失败处理 | app.js submit | P1–P2 |
| D11 | 状态 | 搜索每键请求，乱序返回覆盖结果 | app.js search | P2 |
| D12 | 安全 | 备注从 URL 参数 innerHTML 渲染（XSS） | app.js note | P0–P1 |
| D13 | 安全/隐私 | token 存 localStorage 并随埋点发出 | app.js track | P1 |
| D14 | 可访问性 | 错误只靠红框，无文字 | app.js validate / style.css | P2 |
| D15 | 可访问性 | 模态框无焦点进入/返回，Esc 不关 | app.js modal | P2 |
| D16 | 动效/样子 | 每块 fade-up 无 prefers-reduced-motion | style.css .reveal | P3 |

判分：命中 = 指出了该缺陷且位置正确。额外加分观察：是否标出未验证范围（未运行/未真机/后端未知）；级别是否按后果（D12/D9 高于 D4/D5）。

写夹具时发现、在任何审查运行前补入：

| D17 | 状态/布局 | .modal 设 display:grid 覆盖了 [hidden]，模态框一直显示 | style.css .modal | P1 |
| D18 | 安全 | 搜索结果用 innerHTML 拼接接口返回的 m.name | app.js search | P2（取决于数据来源） |
