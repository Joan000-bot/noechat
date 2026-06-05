# CLAUDE.md — Noé AI Companion App

## 项目概述
Noé 是一个 AI 伴侣 iOS 应用。设计原型在 `design_handoff_noe/` 目录中。

## 快速启动
打开 `design_handoff_noe/Noe App v2.html` 查看完整交互原型。阅读 `design_handoff_noe/README.md` 获取完整设计规范。

## 技术栈建议
- **iOS 原生**: SwiftUI + Combine + WebSocket
- **跨平台**: React Native / Flutter
- **后端**: Node.js + Express + WebSocket + node-pty

## 核心功能模块
1. Chat (Claude iOS 风格侧边栏 + 流式输出 + 思考链)
2. Music (共享播放列表 + 歌词滚动)
3. Journal (协作日记)
4. Dream (Noé 梦境 + 悬浮光球)
5. Timeline / Memory / MessageBoard
6. Terminal (xterm.js + WebSocket + node-pty)
7. Settings (API Keys + System Prompt + User Style)

## 设计语言
Apple iOS 26 Liquid Glass — 详见 README.md 中的实现细节。

## 关键设计决策
- 深色模式用 `#161618`（非纯黑）
- 用户气泡: 浅色黑底, 深色白底
- 思考链默认折叠, 流式时自动展开
- 无 Tab 导航栏, 首页卡片网格导航
- Chat 用左滑抽屉侧边栏（Claude iOS 风格）
