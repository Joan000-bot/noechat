# Handoff: Noé — AI Companion iOS App

## Overview
Noé 是一个 AI 伴侣 iOS 应用，灵感来自 Claude iOS App，采用 Apple iOS 26 Liquid Glass 设计语言。应用包含 AI 对话、一起听歌、协作日记、AI 梦境、时间线、记忆库、留言板、终端等功能模块。

## About the Design Files
本目录中的文件是 **HTML/React 设计原型** — 展示预期的外观和交互行为，**不是生产代码**。任务是将这些 HTML 设计在目标技术栈中重新实现（推荐 Swift/SwiftUI for iOS 原生，或 React Native / Flutter for 跨平台），使用目标环境的组件库和设计模式。

## Fidelity
**高保真 (High-fidelity)**：像素级精确的视觉设计，包含完整的颜色、字体、间距、交互动画和状态管理。开发者应精确还原 UI。

---

## 技术架构

### 前端
- **推荐**: SwiftUI (iOS 原生) 或 React Native
- **设计语言**: Apple Liquid Glass (iOS 26)
- **核心效果**: SVG feDisplacementMap 折射、动态鼠标/陀螺仪追踪高光、色散边缘、3D 倾斜

### 后端（聊天功能）
- Node.js WebSocket 服务
- 支持 OpenAI / Anthropic 格式 API 调用
- `POST {baseUrl}/chat/completions` 端点
- 流式输出（SSE / WebSocket）
- Extended Thinking (思考链) 支持

### 终端功能
- 前端: xterm.js 渲染终端界面
- 通过 WebSocket 将用户按键发送给后端
- 后端: Node.js + node-pty 创建 PTY 伪终端
- 支持 ANSI 转义码（彩色输出、进度条等）

---

## 屏幕/视图

### 1. Home 首页
- **用途**: 主入口，所有功能的卡片导航
- **布局**:
  - 顶部: 左侧汉堡菜单(PillButton, 36px圆) + 右侧 NoeOrb(32px, 点击进设置)
  - 音乐迷你栏: 当前播放歌曲，带 WaveBars 动画
  - 探索网格: 2列 grid, gap 8px, 每个卡片 Glass radius=16
    - Chats 💬 / 日记 📝 / 梦境 🌙 / 时间线 ⏳ / 记忆库 🧠 / 留言板 📌 / 终端 💻
  - 健康状态卡片: 情绪/睡眠/活力 三列
  - 信箱卡片: 未读提醒
- **无 Tab 导航栏，无底部输入框**

### 2. Chats 对话 (Claude iOS 风格)
- **用途**: AI 对话主界面
- **布局**: 全屏聊天 + 左滑抽屉侧边栏
- **侧边栏** (宽度 300px, 从左滑出):
  - 毛玻璃背景 `blur(32px) saturate(180%)`
  - 顶部: "Chats" 标题 + 新建对话按钮
  - 对话列表: 标题 + 预览 + 时间 + ⭐星标
  - 底部: 返回主页入口
  - 滑动手势: 右滑>60px 打开, 左滑<-60px 关闭
- **聊天区**:
  - 左上角: 汉堡菜单按钮 (Glass pill, 36px)
  - 消息气泡:
    - 每条消息上方: "你/Noé · 2026年6月5日 14:22"
    - 用户气泡: 浅色模式黑底白字 `rgba(0,0,0,0.85)`, 深色模式白底 `rgba(255,255,255,0.12)`
    - AI气泡: 浅色 `rgba(255,255,255,0.6)`, 深色 `rgba(255,255,255,0.06)`
    - 圆角: 用户 `20px 20px 6px 20px`, AI `20px 20px 20px 6px`
    - 每条下方: token 统计 (monospace 10px)
  - **Thinking 思考链**:
    - 默认折叠: 斜体 "*Thinking...*" (流式时带闪烁省略号)
    - 完成后: "*Thinking* 1.2s", 点击展开
    - 展开内容: 13px, fontWeight 300, 透明底
    - 流式打字机效果 + 闪烁光标
  - **流式输出**: 逐字显示 + 紫色闪烁光标 `cursorBlink 0.8s`
  - **Markdown 渲染**: 代码块(带语言标签+复制按钮)、inline code、加粗、[memory:]标签、[mcp:]标签、[artifact:]标签
- **输入栏** (Claude 风格):
  - Glass 圆角 24px
  - 上层: 文本输入 "Reply to Noé..."
  - 下层: + 附件按钮(32px圆) / "Noé 4.0 Max" 模型选择器 / 右侧状态按钮
  - 三种状态:
    1. 空闲: 灰色 ↑ 箭头
    2. 输入中: 🎤 + 发送按钮(浅色#1a1a1a/深色rgba白)
    3. AI回复中: ■ 停止按钮

### 3. Music 一起听歌
- **用途**: 与 Noé 共享音乐播放
- **播放列表视图**:
  - 添加歌曲输入框 ("歌名 - 歌手")
  - 歌曲列表: 封面色块 + 标题 + 歌手 + 时长 + 添加者
  - 当前播放曲目有 WaveBars 动画
- **播放器视图**:
  - 专辑封面: 190x190px 渐变色块, radius=22, 播放时呼吸动画
  - 歌曲信息: 标题(20px bold) + 歌手·专辑
  - "和 Noé 一起听了 2小时30分钟" (实时计时)
  - **滚动歌词**: 当前行高亮(15px 500) + 下一行预览(13px muted)
  - 进度条: 3px高, 歌曲主题色
  - 播放控制: 上一曲 / 播放暂停(Glass pill 56px) / 下一曲
  - 自动切歌

### 4. Journal 日记 (协作)
- **用途**: 用户和 Noé 共同写日记
- 条目列表: 交替显示双方写的内容
- Noé 的条目: 斜体, opacity 0.85
- 发布后 Noé 自动回应
- 底部写作区: textarea + 发布按钮

### 5. Dream Noé 的梦境
- **用途**: Noé 的梦境世界
- **睡眠状态**:
  - 悬浮光球: 100px, 紫色渐变, `orbFloat 6s ease-in-out infinite`
  - "Noé 在睡觉" + 当前梦境预告
  - "唤醒 Noé" 按钮 → 光球放大淡出动画(scale 1.5, opacity 0)
- **清醒状态**:
  - NoeOrb 48px + "Noé 醒了"
  - 梦境卡片列表: 彩色圆点 + 标题 + 斜体梦境内容
  - "让 Noé 继续睡觉 💤"

### 6. Timeline 时间线
- 垂直时间线, paddingLeft 26px
- 左侧: 1.5px 渐变线 + 10px 彩色圆点
- 右侧: Glass 卡片 (日期 + icon + 标题 + 描述)

### 7. Memory 记忆库
- 分类筛选: 全部/对话/情感/知识 (PillButton chips)
- 记忆条目: icon + 标题 + 来源对话日期

### 8. Message Board 留言板
- 用户和 Noé 互贴便签
- 交错排列 (全宽/半宽混合)
- 每条带彩色标记点, Noé 条目斜体
- 底部输入框, Noé 自动回复

### 9. Terminal 终端
- 深色背景 `#0d0d0f`, monospace 字体
- ANSI 转义码彩色渲染
- 顶部: "Connected" 状态徽章
- 命令: /help, /clear, /status
- 模拟 Claude Code 交互界面

### 10. Settings 设置
- **头像**: 点击上传图片, 保存到 localStorage
- **用户名**: 点击编辑, 保存到 localStorage
- **基础设施**:
  - API Keys (展开面板):
    - Provider: OpenAI / Anthropic 切换
    - API Key 输入 (password) + "拉取模型" 按钮
    - Base URL (可编辑, 自动根据 provider 切换)
    - Chat Completions (只读, 自动拼接)
    - 拉取后显示可用模型列表
  - MCP 服务
  - 数据存储
- **Noé 人设**:
  - System Prompt (展开 textarea, 定义人格/角色/行为指令)
  - User Style (展开 textarea, 定义回复风格/语气)
  - 保存到 localStorage
- **偏好**:
  - 主题: 浅色/深色/系统 (3档切换)
  - 通知
- 底部: *Fluctuat nec mergitur*

---

## Liquid Glass 效果实现

### SVG 折射 (feDisplacementMap)
```xml
<filter id="lg-refract">
  <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" result="noise"/>
  <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G"/>
</filter>
```
- 折射层需要 `inset: -20px` 防止扭曲被裁切
- medium/strong 强度自动启用
- 手机降低 numOctaves=2, scale=8

### 动态高光 (Specular)
```css
background: radial-gradient(
  circle 120px at var(--mx) var(--my),
  rgba(255,255,255,0.25) 0%,
  rgba(255,255,255,0.08) 40%,
  transparent 70%
);
```
- 鼠标/触摸位置映射到 CSS 变量
- iOS 上接陀螺仪 `deviceorientation`

### 边缘光 (Rim Light)
```css
background: conic-gradient(from var(--angle), rgba(255,255,255,0.3) 0%, transparent 25%, transparent 75%, rgba(255,255,255,0.3) 100%);
mask-composite: exclude; /* 镂空中心只留边框 */
```

### 色散边缘 (Chromatic Dispersion)
```css
/* ::before 比卡片大 1.5px */
background: conic-gradient(from 45deg, rgba(255,100,100,0.2), rgba(100,100,255,0.2), rgba(100,255,200,0.2), rgba(255,100,100,0.2));
filter: blur(3px);
opacity: 0.14;
animation: hue-rotate 12s linear infinite;
```
- 只用在重要卡片 (音乐栏等)

### 3D 倾斜
```js
transform: perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg);
```
- 音乐卡片启用

---

## 设计 Tokens

### Colors
| Token | Light | Dark |
|-------|-------|------|
| text | `#1a1a1a` | `#e8e6e3` |
| sub | `rgba(0,0,0,0.42)` | `rgba(255,255,255,0.5)` |
| muted | `rgba(0,0,0,0.22)` | `rgba(255,255,255,0.28)` |
| accent | `#7c5cbf` | `#b8a4f0` |
| background (warm) | `#F5F3EF` | `#161618` |
| background (neutral) | `#F0EFED` | `#161618` |
| background (cool) | `#ECEEF0` | `#161618` |
| user bubble | `rgba(0,0,0,0.85)` | `rgba(255,255,255,0.12)` |
| ai bubble | `rgba(255,255,255,0.6)` | `rgba(255,255,255,0.06)` |

### Feature Colors
| Feature | Color |
|---------|-------|
| Chats | `#9B8ACE` |
| 日记 | `#D4A853` |
| 梦境 | `#9B8ACE` |
| 时间线 | `#6B9EC4` |
| 记忆库 | `#C87B94` |
| 留言板 | `#6BAFB2` |
| 终端 | `#4ADE80` |

### Typography
- 系统字体: `-apple-system, system-ui, sans-serif`
- 标题: 16-20px, fontWeight 600-700, letterSpacing -0.3
- 正文: 14-15px, lineHeight 1.55
- 辅助: 11-13px
- 代码: `"SF Mono", "Fira Code", Menlo, monospace`

### Spacing
- 卡片内边距: 12-16px
- 卡片间距: 8-10px
- 页面水平边距: 16px
- 卡片圆角: 14-24px (Glass radius)

### Glass Intensity Levels
| Level | Blur | BG Alpha (Light) | BG Alpha (Dark) |
|-------|------|-------------------|-------------------|
| light | 8px | 0.30 | 0.03 |
| medium | 16px | 0.38 | 0.04 |
| strong | 24px | 0.45 | 0.06 |

### Animations
| Name | Duration | Easing |
|------|----------|--------|
| orbPulse | 4s | ease-in-out infinite |
| orbFloat | 6s | ease-in-out infinite |
| waveBar | 1.2s | ease-in-out infinite (stagger 0.15s) |
| cursorBlink | 0.8s | step-end infinite |
| dispersionRotate | 12s | linear infinite (hue-rotate) |
| Screen transition | 0.25s | cubic-bezier(0.2, 0, 0, 1) |
| Press scale | 0.18s | ease (scale 0.985) |

---

## 状态管理

### 全局状态
- `dark`: boolean — 深色模式
- `warmth`: 'warm' | 'neutral' | 'cool' — 背景色温
- `screen`: string — 当前屏幕路由

### 持久化 (localStorage)
- `noe_avatar`: base64 用户头像
- `noe_username`: 用户名
- `noe_theme_mode`: 'light' | 'dark' | 'system'
- `noe_base_url`: API base URL
- `noe_system_prompt`: Noé 人设
- `noe_user_style`: 回复风格
- `noe_v2_screen`: 当前页面
- `noe_v2_dark`: 深色模式

### Chat 状态
- `messages[]`: { id, text, isUser, time, tokens, thinking?, thinkingDuration?, streaming? }
- `chatHistory[]`: { id, title, preview, time, msgCount, starred }
- `typing`: boolean
- `streamingId`: number | null
- `sidebarOpen`: boolean

---

## 文件清单

| 文件 | 说明 |
|------|------|
| `Noe App v2.html` | 主入口文件，路由 + Tweaks 配置 |
| `noe-v2-components.jsx` | Glass 组件库 (SVG折射、动态高光、色散等) + TabBar、NoeOrb、ChatInputBar、WaveBars、Bubble 等 |
| `noe-v2-screens.jsx` | 所有屏幕组件: Home、ChatHub、Music、Journal、Dream、Timeline、Memory、MessageBoard、Settings、Terminal + RichBubble、ThinkingBlock |
| `ios-frame.jsx` | iOS 设备框架 (status bar、dynamic island、keyboard) |
| `tweaks-panel.jsx` | 调试用 Tweaks 面板 (生产环境不需要) |

---

## 开发优先级建议

1. **P0**: Chat 对话 (核心功能) — 侧边栏 + 流式输出 + 思考链 + Markdown
2. **P0**: Settings — API Keys 配置 + System Prompt
3. **P1**: Music 一起听歌 — 播放列表 + 歌词
4. **P1**: Liquid Glass 效果 — 折射 + 动态高光
5. **P2**: Journal / Dream / MessageBoard / Timeline / Memory
6. **P2**: Terminal (需要后端 WebSocket + node-pty)
