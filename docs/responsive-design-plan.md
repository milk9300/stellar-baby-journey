# 多端响应式适配计划

> 📅 创建日期: 2026-01-28
> 📌 状态: 待实施

本文档规划了将 **Stellar Baby Journey** 项目适配到多种设备（桌面端、平板、手机）的完整方案。

---

## 一、目标设备与断点定义

| 断点名称 | 宽度范围 | 典型设备 |
|---------|---------|---------|
| `xs` | < 480px | 小屏手机 (iPhone SE) |
| `sm` | 480px - 767px | 普通手机 (iPhone 14, Pixel) |
| `md` | 768px - 1023px | 平板 (iPad Mini, iPad) |
| `lg` | 1024px - 1279px | 小型笔记本 |
| `xl` | 1280px+ | 桌面显示器 |

在 `tailwind.config.js` 中已有默认断点，可以直接使用。

---

## 二、组件级适配计划

### 2.1 Navbar.tsx

| 问题 | 解决方案 |
|-----|---------|
| 标题过长在小屏溢出 | 使用 `truncate` 或缩短显示 |
| 导航链接在手机端拥挤 | 改为汉堡菜单 + 侧滑抽屉 |
| 音乐播放器位置 | 固定在右下角或整合进抽屉菜单 |

**修改位置**: `components/Navbar.tsx`

---

### 2.2 VerticalTimeline.tsx (成长轨迹)

| 问题 | 解决方案 |
|-----|---------|
| 左侧高度计 HUD 在手机端遮挡内容 | 添加 `hidden lg:flex`，小屏隐藏 |
| 卡片左右交替布局在窄屏下变形 | 手机端改为单列居中布局 (`flex-col`) |
| 编辑模式开关位置 | 改为固定底部浮动按钮 |
| 气球装饰尺寸 | 使用 `scale-75 sm:scale-100` 缩放 |

**修改位置**: `components/VerticalTimeline.tsx`

---

### 2.3 HorizontalTimeline.tsx (星空全景)

| 问题 | 解决方案 |
|-----|---------|
| 卡片宽度 `min-w-[45vw]` 在手机上过窄 | 改为 `min-w-[85vw] md:min-w-[45vw]` |
| 水平滑动与浏览器手势冲突 | 添加 `touch-pan-x` 并禁用垂直滚动 |
| 里程 HUD 固定位置 | 改为相对定位或隐藏在小屏 |
| 触屏 hover 效果失效 | 添加 `active:scale-[1.02]` 补充反馈 |

**修改位置**: `components/HorizontalTimeline.tsx`

---

### 2.4 MemoryBook.tsx (时空绘本)

| 问题 | 解决方案 |
|-----|---------|
| 左侧目录 (`w-64 fixed`) 占用空间 | 手机端改为底部弹出抽屉 |
| 3D 翻书效果性能问题 | 低端设备降级为 2D 翻页动画 |
| 书本尺寸 (`w-[340px]`) 溢出小屏 | 改为 `w-[90vw] max-w-[340px]` |
| 控制区按钮过小 | 增大触控区域 (`min-w-12 min-h-12`) |

**修改位置**: `components/MemoryBook.tsx`

---

### 2.5 GrowthArchive.tsx (成长档案)

| 问题 | 解决方案 |
|-----|---------|
| 数据卡片网格在小屏拥挤 | 改为 `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` |
| 表格在手机端横向溢出 | 使用 `overflow-x-auto` + 可滚动容器 |
| 图表组件宽度 | 确保 `GrowthChart` 支持 100% 宽度 |

**修改位置**: `components/GrowthArchive.tsx`, `components/GrowthChart.tsx`

---

### 2.6 通用组件

| 组件 | 问题 | 解决方案 |
|-----|-----|---------|
| `ConfirmModal` | 模态框宽度 | `w-[90vw] max-w-md` |
| `MemoryEditor` | 表单在小屏拥挤 | 表单字段改为单列堆叠 |
| `PhotoGallery` | 缩略图导航过小 | 增大触控区域 |
| `CloudBackground` | 粒子过多影响性能 | 使用媒体查询减少数量 |
| `Balloon` | 动画性能 | 低端设备禁用或简化动画 |

---

## 三、性能优化策略

### 3.1 图片优化
- [ ] 实现响应式图片 (`srcset`, `sizes`)
- [ ] 懒加载 (`loading="lazy"`)
- [ ] 复用现有 `compressImage` 函数进一步压缩

### 3.2 动画降级
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 3.3 代码分割
- [ ] 使用 `React.lazy` 延迟加载非首屏组件
- [ ] 考虑按路由拆分 chunk

---

## 四、测试计划

### 4.1 浏览器开发者工具
- Chrome DevTools 设备模拟器
- 测试断点: iPhone SE, iPhone 14 Pro, iPad, Desktop

### 4.2 真机测试 (可选)
- iOS Safari
- Android Chrome
- 微信内置浏览器

### 4.3 性能检测
- Lighthouse 移动端评分
- Web Vitals (LCP, FID, CLS)

---

## 五、实施优先级

| 优先级 | 组件 | 原因 |
|-------|------|-----|
| 🔴 高 | Navbar, VerticalTimeline | 核心入口和主页面 |
| 🟠 中 | HorizontalTimeline, GrowthArchive | 常用功能页 |
| 🟡 低 | MemoryBook | 复杂 3D 效果，可后期优化 |

---

## 六、预估工时

| 阶段 | 工时 |
|-----|-----|
| 断点定义与全局样式 | 2h |
| Navbar 适配 | 2h |
| VerticalTimeline 适配 | 3h |
| HorizontalTimeline 适配 | 2h |
| MemoryBook 适配 | 4h |
| GrowthArchive 适配 | 2h |
| 通用组件适配 | 2h |
| 测试与调优 | 3h |
| **总计** | **~20h** |

---

## 七、参考资源

- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [CSS 3D Transform Performance](https://web.dev/css-triggers/)
- [Touch Events Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)

---

> 💡 **备注**: 本计划为初步设计，实施时可根据实际情况调整。建议从高优先级组件开始，逐步迭代。
