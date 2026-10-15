# 手机端：让 Web 应用像装好的应用

面向手机构建或审查 Web 应用、做 PWA、底部面板、轮播、全屏布局或任何触摸交互，或者"Chrome 里没问题、手机上感觉不对"时读。改编自 `mobile-native`（MIT，Emil Kowalski）。

这个镜头只管平台层：视口、触摸、滚动、安全区、浏览器外壳。几行代码决定应用像装好的还是像嵌在网页里。动效本身看 [motion.md](motion.md)；React Native 不在本 Skill 范围内。

## 立场

大多数"手机上发卡"的反馈不是动画问题，而是 300ms 点击延迟、点击时的灰色闪烁，或者松不开的 hover 状态。用户的手机才是事实来源。不能上真机时，说清哪些修复能从代码确认，哪些需要真机。

两种失败，第一种更糟：

1. **修桌面上看到的东西。** 这里的问题在 Chrome 设备模拟里都不复现。只在那里测，就会全部带上线。
2. **CSS 或 meta 标签能做的事去用 JavaScript。** 这里几乎每一项都是一条声明。用 `useIsTouchDevice()` hook 隐藏 hover 是错的工具，媒体查询才是对的。

## 硬规则

1. **每个修复都带原因。** 下面每条规则都有原因。在原因成立的地方用，而不是出于习惯全局用：`user-select: none` 用在正文上是缺陷，用在按钮上是对的。
2. **用媒体查询，不嗅探设备。** `(hover: hover)`、`(pointer: fine)`、`env()`、`dvh`：平台会告诉你它能做什么。永远不要根据 user agent 或屏幕宽度猜是不是触屏。
3. **触摸和鼠标不互斥。** 带触控板的 iPad、带触屏的笔记本、接鼠标的手机。同时为两者写，按能力门控，不按设备。
4. **永远不禁用缩放。** `user-scalable=no` 和 `maximum-scale=1` 是可访问性失败。改输入框字号，那才是导致缩放的原因。
5. **说完成之前上真机测。** 连上手机，用 IP 打开开发服务器，用 Safari Web Inspector 或 Chrome 远程调试。模拟复现不了粘住的 hover、点击延迟、橡皮筋回弹、安全区和软键盘。

## 症状表

从这里开始。对上用户看到的现象，再读对应小节的原因和代码。

| 问题 | 解法 |
| --- | --- |
| 点完 hover 状态粘住 | 包进 `@media (hover: hover) and (pointer: fine)` |
| 点击时灰色/蓝色闪一下 | 去掉 `-webkit-tap-highlight-color` |
| 布局高度不对 | `100dvh`（应用）或 `100svh`（首屏） |
| 页面放大到输入框 | 输入框字号至少 16px |
| 点击发钝 | 按下时反馈 + `touch-action: manipulation` |
| 下拉刷新劫持滚动 | `html, body` 上 `overscroll-behavior: none` |
| 内容停在刘海处 | `viewport-fit=cover` + `env(safe-area-inset-*)` |
| 长按选中按钮文字 | 加 `user-select: none` |
| 轮播带着页面纵向滚 | 手势区域上 `touch-action: pan-y` |
| 状态栏颜色不匹配 | 每种配色方案一个 `theme-color` |
| Chrome 里对、手机上错 | 上真机测 |

## 修法

### 1. 点完 hover 状态粘住

触屏没有 hover，浏览器就模拟一个：第一次点击给元素加上 `:hover`，直到用户点别处才去掉。hover 时放大的按钮，点完一直是放大的。所有 hover 样式都放在能力查询后面。

```css
@media (hover: hover) and (pointer: fine) {
  .button:hover {
    background: var(--gray-3);
    transform: scale(1.02);
  }
}
```

两个条件都要。`(hover: hover)` 表示主输入能悬停；`(pointer: fine)` 表示它是精确的（如鼠标），排除触控笔和少数自称支持 hover 的 Android 设备。Tailwind v4 的 `hover:` 变体已经编译成 `@media (hover: hover)`；v3 设 `future.hoverOnlyWhenSupported`。

触屏用户仍然需要按下反馈，通过 `:active` 给（见第 5 节），它对所有输入类型都有效。

### 2. 点击时灰色/蓝色闪一下

iOS Safari 和 Android Chrome 会在任何有点击处理的元素上画一层半透明高亮。这是最响亮的"这是个网站"信号，还会和你设计的按下反馈打架。

```css
html {
  -webkit-tap-highlight-color: transparent;
}
```

全局设一次。然后确保每个可点元素都有自己的 `:active` 状态，因为你刚去掉了浏览器给的唯一反馈。

### 3. 布局高度不对

手机上的 `100vh` 是*最大*视口：浏览器外壳收起时的高度。页面加载时地址栏是显示的，所以 `100vh` 的元素会多出一个地址栏的高度，固定在底部的按钮被压在下面。用动态和小视口单位：

```css
/* App shell, drawers, anything that should track the visible area as chrome shows/hides */
.app { height: 100dvh; }

/* Heroes and first screens — the smallest the viewport gets, so nothing is ever cut off */
.hero { min-height: 100svh; }
```

`dvh` 随地址栏收起而变化，适合应用外壳，但在营销内容滚动中会造成布局偏移。`svh` 稳定，永不溢出，适合首屏。`lvh` 就是旧的 `vh`，几乎不需要。只有项目支持范围要求时，才在上面保留一行 `100vh` 回退给旧浏览器。

### 4. 页面放大到输入框

焦点落到字号小于 16px 的输入框时，iOS Safari 会放大页面，失焦后也不缩回去，用户看到的是被裁切、偏移的布局。人们因此去用 `maximum-scale=1`，那是错的修法（硬规则 4）。

```css
input, textarea, select {
  font-size: 16px; /* the minimum; 1rem at the default root size */
}
```

如果设计要求桌面上输入框字更小，只在需要的地方放大：

```css
@media (pointer: coarse) {
  input, textarea, select { font-size: 16px; }
}
```

顺便把键盘设好：验证码用 `inputmode="numeric"`，金额用 `inputmode="decimal"`，邮箱和电话用 `type="email"`、`type="tel"`，用户名和验证码加 `autocapitalize="none"`、`autocorrect="off"`，用 `enterkeyhint="send"` / `"search"` / `"done"` 让回车键说明它做什么。

### 5. 点击发钝

两个原因叠在一起。

**300ms 点击延迟。** 浏览器在点击后会等一下，看是不是双击（双击会缩放）。视口是 `width=device-width` 时现代浏览器会跳过等待，但不是所有情况都跳过（iOS Safari 在某些元素上仍有延迟）。`touch-action: manipulation` 告诉浏览器这个元素从不双击缩放，于是立刻触发 `click`：

```css
button, a, [role="button"], .tappable {
  touch-action: manipulation;
}
```

**松手时才反馈，而不是按下时。** 原生按钮在手指落下的瞬间响应。只在 `click` 时变化的 Web 按钮，在手指*离开*时才响应，即使 0ms 也读起来像延迟。给 `:active` 加样式；需要 JavaScript 时监听 `pointerdown`，不是 `click`：

```css
.button {
  transition: transform 100ms var(--ease-out), background 100ms;
}
.button:active {
  transform: scale(0.97);
  background: var(--gray-4);
}
```

按下反馈保持 100–160ms、`ease-out`。项目已经有动效 token 就用它们，不另起一条曲线。

### 6. 下拉刷新劫持滚动

滚过页面顶部，Android Chrome 会触发下拉刷新，iOS 会整页橡皮筋回弹。对文档来说没问题；对有自己滚动容器的应用、用户往下拖的抽屉、画布来说是错的。

```css
html, body {
  overscroll-behavior: none;
}
```

然后在每个内部滚动区（面板内容、聊天列表、侧栏）上，阻止滚到尽头时串到页面：

```css
.sheet-content {
  overflow-y: auto;
  overscroll-behavior: contain;
}
```

`contain` 保留容器自己的回弹（显得原生），但阻止后面的页面跟着动。根上用 `none`，子容器用 `contain`。永远不要为此用 `touchmove` + `preventDefault()` 监听：它会完全阻止滚动，还让监听变成非 passive，损失帧率。

### 7. 内容停在刘海处

默认情况下浏览器把页面框在安全区里，刘海、灵动岛和底部指示条区域只露出 body 的背景色。原生应用是铺满边缘、再把*内容*从这些区域里垫开。两步：

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

```css
.app-header {
  padding-top: env(safe-area-inset-top);
}
.bottom-bar {
  padding-bottom: env(safe-area-inset-bottom);
}
.sheet {
  padding-bottom: calc(1rem + env(safe-area-inset-bottom));
}
```

`viewport-fit=cover` 让页面伸到刘海下面；`env(safe-area-inset-*)` 给出要垫回来的距离。没有这个 meta 标签，`env()` 的值都是 `0px`。需要处理的是固定头部、底部标签栏、toast 和面板；普通页面内容通常通过头部的内边距自然得到。值用在 calc 里时给 `env()` 一个回退值（`env(safe-area-inset-bottom, 0px)`）。

### 8. 长按选中按钮文字

手指按住 Web 按钮，iOS 会选中它的标签，或在链接上弹出复制/分享菜单。原生控件从不这样。作为*控件*的文字不该能选；作为*内容*的文字必须能选。

```css
button, [role="button"], .tab, .chip, .drag-handle {
  user-select: none;
  -webkit-user-select: none;   /* Safari still needs the prefix */
  -webkit-touch-callout: none; /* no long-press callout on links/images used as controls */
}
```

永远不要在 `body` 上设 `user-select: none`。用户会复制地址、错误信息和订单号，那是内容。

### 9. 轮播带着页面纵向滚

在轮播上横向滑动，对浏览器来说有歧义：它不知道你是在滚页面还是滚轨道，于是去猜，结果常常是轮播在动、页面也在上下抖。告诉它这个元素负责哪个方向：

```css
.carousel {
  touch-action: pan-y; /* the carousel handles horizontal; the browser keeps vertical */
}
.drag-surface {
  touch-action: none;  /* a custom gesture (a drag-to-dismiss sheet, a slider) owns every axis */
}
.vertical-sheet-handle {
  touch-action: pan-x; /* the sheet handles vertical drags; horizontal stays with the browser */
}
```

这些值说的是*浏览器*还能做什么。横向轮播上的 `pan-y` 意思是"浏览器，你继续管纵向，横向我来"。`none` 表示元素处理所有方向，只用在确实如此的元素上，否则用户滚不过去。

如果轮播是原生滚动而不是 JS 手势，优先在轨道上用 `scroll-snap-type: x mandatory`、在每张上用 `scroll-snap-align: start`：浏览器自己的物理效果胜过手写的弹簧，也不再需要 `touch-action`。

### 10. 状态栏颜色不匹配

状态栏和浏览器外壳的颜色取自 `theme-color`。只给一个值，浅色模式会得到深色栏，或深色模式得到白色栏。每种配色方案给一个：

```html
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0a0a0a" />
<meta name="color-scheme" content="light dark" />
```

值要匹配页面最顶部的颜色（头部背景），不是品牌色。Next.js 里通过 `viewport` 导出设置（`themeColor: [{ media, color }]`）。如果应用用 class 而不是系统设置切换主题，切换时用 JavaScript 更新这个标签。对已安装的 PWA，`apple-mobile-web-app-status-bar-style` 和 manifest 的 `theme_color`/`background_color` 是同一个决定。

### 11. Chrome 里对、手机上错

上面没有一项能在设备模拟里复现。粘住的 hover、点击高亮、地址栏对 `vh` 的影响、输入框缩放、点击延迟、过度滚动、安全区、软键盘，都是真机行为。

- 用 USB 连上手机，开发服务器跑在 `0.0.0.0`，用电脑的局域网 IP 打开。
- iOS：Safari → 开发 → 设备。Android：`chrome://inspect`。
- 用一台用了几年的手机测，不只用桌上最新的那台。打开键盘测。横屏测一次。
- 如果目标包括已安装的 PWA，就以 PWA 方式测；独立模式会改变视口、安全区和状态栏行为。

Xcode 模拟器比浏览器模拟好一步，但仍然缺少触摸手感。真机才是标准。

## 底线配置

开始一个面向手机的应用时，这是最低配置，在第一个组件之前就加上：

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content" />
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0a0a0a" />
```

```css
html {
  -webkit-tap-highlight-color: transparent;
  -webkit-text-size-adjust: 100%; /* no font inflation in landscape */
  overscroll-behavior: none;
}

input, textarea, select {
  font-size: 16px;
}

button, a, [role="button"] {
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
}

@media (hover: hover) and (pointer: fine) {
  /* all :hover rules live here */
}
```

`interactive-widget=resizes-content` 让 Android Chrome 上的软键盘缩小布局视口，于是 `100dvh` 和固定在底部的输入框像在 iOS 上一样响应键盘。如果应用是欢迎下拉刷新的滚动文档，从 `html` 上去掉 `overscroll-behavior: none`。

## 绝不交付

完成前自查：

| 不要 | 改为 |
| --- | --- |
| `user-scalable=no` 或 `maximum-scale=1` | 16px 输入框，修原因 |
| 没有门控的 `:hover` | `@media (hover: hover) and (pointer: fine)` |
| 应用外壳或底部固定界面用 `100vh` | `100dvh` |
| 营销首屏用 `100dvh` | `100svh`（滚动时不偏移） |
| 只在 `click` 时给按下反馈 | `:active` / `pointerdown` |
| 用 `touchmove` + `preventDefault()` 阻止过度滚动 | `overscroll-behavior` |
| `body` 上 `user-select: none` | 只用在控件上 |
| 用户需要滚过的东西上 `touch-action: none` | `pan-x` / `pan-y` |
| 用 `env(safe-area-inset-*)` 却没有 `viewport-fit=cover` | 加上 meta 标签，否则值为 `0` |
| 两种配色方案共用一个 `theme-color` | 每个 `prefers-color-scheme` 一个 |
| 嗅探 user agent 判断触屏 | `(hover)` / `(pointer)` 媒体查询 |
| 凭设备模拟宣布修好 | 真机 |

## 交付

做和改的模式下应用修复，然后最多几行：

- **哪里不对**：对上的症状和一句话原因。
- **改了什么**：文件和声明，各一行。
- **需要手机确认的**：哪些能从代码确认，哪些要用户在真机上确认。

不要扩成报告，代码就是交付物。大多数修复只有一行：说这一行和原因，然后继续。诚实答案是"没有设备我确认不了"时，就这样说，不要宣称已修好。审查模式下，这些条目按 SKILL.md 的分级进报告：挡住输入或主操作的（输入框缩放、禁用缩放、底部按钮被压住）按后果升到 P1/P2，其余默认 P3。
