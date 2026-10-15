# 动效配方

最常见情况的现成实现。从配方开始再调整，不要从空白文件重写。改编自 `animate` 的 RECIPES（MIT）。

曲线用 [motion.md](motion.md) 第 4 节定义的 `--ease-out`、`--ease-in-out`、`--ease-drawer` token。

---

## 按钮按下

所有可按元素。即时反馈，告诉用户界面收到了。

```css
.button {
  transition: transform 160ms var(--ease-out);
}

.button:active {
  transform: scale(0.97);
}
```

`scale()` 会连子元素一起缩放：标签和图标跟着动，所以读起来像物理按下。

这里不需要 hover 门控：`:active` 在触屏上是真实的按下。任何 `:hover` 样式另外门控。

---

## 下拉、弹层、菜单、选择器

从触发器缩放出来，而不是凭空出现。

```css
.popover {
  transform-origin: var(--transform-origin); /* Base UI supplies this */
  transition:
    opacity 200ms var(--ease-out),
    transform 200ms var(--ease-out);
}

.popover[data-starting-style],
.popover[data-ending-style] {
  opacity: 0;
  transform: scale(0.95);
}
```

关键就是 `transform-origin`：面板应该看起来是从你点的那个东西里出来的。

---

## 提示（tooltip）

和弹层同样的形状，更快，再加上大多数实现漏掉的细节。

```css
.tooltip {
  transform-origin: var(--transform-origin);
  transition:
    transform 125ms var(--ease-out),
    opacity 125ms var(--ease-out);
}

.tooltip[data-starting-style],
.tooltip[data-ending-style] {
  opacity: 0;
  transform: scale(0.97);
}

/* Once one tooltip is open, neighbours open instantly */
.tooltip[data-instant] {
  transition-duration: 0ms;
}
```

初始延迟防止误触发。之后跳过延迟和动画，整排工具栏会显得更快。

---

## 模态框

唯一保持居中的弹层。

```css
.modal {
  transform-origin: center; /* exempt — not anchored to a trigger */
  transition:
    opacity 250ms var(--ease-out),
    transform 250ms var(--ease-out);
}

.modal[data-starting-style],
.modal[data-ending-style] {
  opacity: 0;
  transform: scale(0.96);
}

.backdrop {
  transition: opacity 250ms var(--ease-out);
}
```

背景遮罩的 opacity 和它一起动，读起来是同一个表面。

---

## 抽屉 / 底部面板

```css
.drawer {
  transform: translateY(0);
  transition: transform 500ms var(--ease-drawer);
}

.drawer[data-closed] {
  transform: translateY(100%);
}
```

Vaul 就是这样在动画入场前藏起抽屉的。

加上拖拽就变成手势问题，见下面的**拖拽关闭**。

---

## Toast

```css
.toast {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 400ms ease,
    transform 400ms ease;

  @starting-style {
    opacity: 0;
    transform: translateY(100%);
  }
}
```

- 用 `ease` 而不是 `ease-out`，比一般界面稍慢：Sonner 显得优雅，部分原因是它的动效按组件性格调，而不是按通用界面预算调。
- 没有 `@starting-style` 时，回退到挂载标记：

```jsx
useEffect(() => { setMounted(true); }, []);
// <div data-mounted={mounted}>
```

toast 堆叠、列表重排时，opacity 变化要和 height 变化配合。这一对没有公式，调到感觉对，第二天再看一遍。

---

## 手风琴 / 折叠

```css
.content {
  overflow: hidden;
  transition:
    height 200ms var(--ease-out),
    opacity 200ms var(--ease-out);
}
```

保持短：这是少数每帧都花布局成本的动画，时长长了既慢又贵。用 JS 测量内容高度（或用能提供高度的无样式 primitive），不要动画到 `auto`。

---

## 成组错开入场

用于用户偶尔看到的列表或网格，不用于每天滚过的列表。

```css
.item {
  opacity: 0;
  transform: translateY(8px);
  animation: fadeIn 300ms var(--ease-out) forwards;
}

.item:nth-child(2) { animation-delay: 50ms; }
.item:nth-child(3) { animation-delay: 100ms; }
.item:nth-child(4) { animation-delay: 150ms; }

@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

错开是装饰，播放时绝不阻塞交互。

---

## 按住确认

用于普通点击太容易误触的危险操作。

```css
.overlay {
  clip-path: inset(0 100% 0 0);
  transition: clip-path 200ms var(--ease-out); /* release: snappy */
}

.button:active .overlay {
  clip-path: inset(0 0 0 0);
  transition: clip-path 2s linear;             /* press: slow and deliberate */
}

.button:active {
  transform: scale(0.97);
}
```

这里用 `linear` 是对的：填充是进度指示，进度不该有缓动。

---

## 带颜色过渡的标签指示器

逐个调标签的颜色过渡永远对不齐。改用裁剪。

复制一份标签列表，把副本样式设成激活态（不同背景、不同文字颜色），裁剪副本只露出当前标签，切换时动画裁剪：

```css
.tabs-active-copy {
  clip-path: inset(0 60% 0 20%); /* driven by the active tab's position */
  transition: clip-path 250ms var(--ease-in-out);
}
```

文字和背景完全同步变化，因为它们是一个元素被显现出来，而不是两种颜色在插值。

---

## 滚动显现

只用于营销页。不要用在用户每天访问的功能界面上。

```css
.reveal {
  clip-path: inset(0 0 100% 0);
  transition: clip-path 600ms var(--ease-in-out);
}

.reveal[data-visible] {
  clip-path: inset(0 0 0 0);
}
```

用 `IntersectionObserver` 触发，或用 Motion 的 `useInView`，参数 `{ once: true, margin: "-100px" }`。只触发一次：每次滚过都重新动画，是界面在和读者作对。

---

## 拖拽关闭

手势配方。用弹簧而不是时长，因为用户可能中途反向。

```js
// Dismiss on a flick, not just on distance
const timeTaken = Date.now() - dragStartTime.current;
const velocity = Math.abs(swipeAmount) / timeTaken;

if (Math.abs(swipeAmount) >= SWIPE_THRESHOLD || velocity > 0.11) {
  dismiss();
}
```

```js
// Set transform on the dragged element directly.
// Driving it through a CSS variable on the parent recalcs styles for every child.
element.style.transform = `translateY(${distance}px)`;
```

区分好拖拽和坏拖拽的四个细节：

- **指针捕获**：拖拽开始后捕获，指针离开元素范围也能继续。
- **多点触控保护**：新触点进来时 `if (isDragging) return`，否则中途换手指会让元素跳动。
- **越界阻尼**：拖过自然边缘后越拖越少。真实物体停下前会减速。
- **摩擦而不是墙**：允许越界拖动但阻力递增，而不是拒绝。

用弹簧收尾，被打断的拖拽能保留速度：

```js
{ type: "spring", duration: 0.5, bounce: 0.2 }
```

---

## 掩盖收不干净的交叉淡入

过渡中两个状态明显重叠，怎么调缓动和时长都不行时，模糊接缝：

```css
.content {
  transition:
    filter 200ms ease,
    opacity 200ms ease;
}

.content.transitioning {
  filter: blur(2px);
  opacity: 0.7;
}
```

没有模糊，眼睛读到的是两个东西在交换；有了模糊，就融成一次变化。保持在 20px 以下，重度模糊很贵，Safari 尤其如此。

---

## 程序化控制，不引库

动作需要 JS 控制但不想加依赖时，WAAPI 给你 CSS 级的性能：

```js
element.animate(
  [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0 0)' }],
  { duration: 1000, fill: 'forwards', easing: 'cubic-bezier(0.77, 0, 0.175, 1)' }
);
```

硬件加速、可中断、不增加包体积。
