# 快速开始

本指南将引导你安装 ai-viz 并生成第一张图表。

## 前置要求

- **Node.js** >= 18.0.0
- 一个 AI 编程工具（Claude Code、Cursor、Windsurf、OpenCode、GitHub Copilot、Qoder 或 Aider）
- （可选）[Draw.io Desktop](https://github.com/jgraph/drawio-desktop) — 导出 PNG/SVG/PDF 时需要

## 安装

ai-viz 使用交互式 CLI 向导，无需全局安装：

```bash
cd your-project
npx ai-viz init
```

### 安装流程详解

```
🎨 AI-Viz 初始化向导
────────────────────────────────────────

? 选择你的 AI 编程工具:
  ❯ Claude Code
    Cursor
    Windsurf
    OpenCode
    GitHub Copilot
    Qoder
    Aider
    多工具 (Multi-tool)

? 选择输出格式插件 (空格选择，回车确认):
  ❯ ◉ drawio - 专业正式图表，支持 PNG/SVG 导出
    ◉ excalidraw - 手绘风格，适合内部讨论
    ◯ mermaid - 轻量文本图表，适合 README

? 选择文档语言:
  ❯ 中文 (zh-CN)
    English (en)
    双语 (both)

? 是否创建设计语言配置文件？(design-language.yaml) Yes

⚙️  正在生成配置...
  ✓ ai-viz.config.json
  ✓ design-language.yaml
📦 正在编译指令文件...
📥 正在安装到 AI 工具...
  ✓ Claude Code (4 个文件)

✅ ai-viz 初始化完成！
```

初始化后，你的项目会新增：

```
your-project/
├── ai-viz.config.json         # ai-viz 配置文件
├── design-language.yaml       # 视觉风格配置（配色、布局）
└── .claude/skills/ai-viz/     # （或对应你工具的等效目录）
    ├── SKILL.md
    ├── drawio-instructions.md
    ├── drawio-schema.md
    └── design-language.yaml
```

## 生成第一张图表

安装完成后，打开你的 AI 编程工具，描述你的需求：

```
你："画一个这个项目的分层架构图，
     展示 API 层、服务层和数据层。"
```

AI 将会：
1. 读取方法论指令（确定画什么类型的图）
2. 遵循路由规则（根据上下文选择最佳格式）
3. 读取插件指令（精确的输出格式规范）
4. 应用设计语言（颜色、间距、字体）
5. 生成图表文件（如 `architecture.drawio`）

### 输出示例

DrawIO 会生成 `.drawio` XML 文件，可用 Draw.io Desktop 或 VS Code 扩展打开。

Excalidraw 会生成 `.excalidraw` JSON 文件，可用 Excalidraw 或其 VS Code 扩展打开。

Mermaid 会生成 Markdown 中的围栏代码块，可在 GitHub、GitLab 和大多数文档工具中渲染。

## 导出为 PNG

如果选择了 drawio 插件，可以将图表导出为图片：

```bash
# 导出为 PNG（默认，2x 缩放）
npx ai-viz export architecture.drawio

# 导出为 SVG
npx ai-viz export architecture.drawio -f svg

# 导出为 PDF
npx ai-viz export architecture.drawio -f pdf

# 自定义缩放倍数
npx ai-viz export architecture.drawio --scale 3
```

> **注意：** 导出功能需要系统安装 [Draw.io Desktop](https://github.com/jgraph/drawio-desktop)。

## 自定义配置

### 设计语言

编辑 `design-language.yaml` 以匹配你项目的视觉风格：

```yaml
# 色彩系统 — 语义映射
colors:
  primary: "#a5d8ff"       # 核心服务/节点
  secondary: "#b2f2bb"     # 外部系统
  accent: "#ffd43b"        # 网关/关键路径
  muted: "#e9ecef"         # 基础设施/背景
  danger: "#ffc9c9"        # 告警/错误

# 布局偏好
layout:
  direction: "top-to-bottom"
  h_gap: 250
  v_gap: 180

# 按使用场景设置默认格式
format_preference:
  internal: "excalidraw"       # 内部文档 → 手绘风格
  external: "drawio"           # 对外文档 → 正式精美
  documentation: "mermaid"     # README → 文本图表
```

编辑后重新编译以传播变更：

```bash
npx ai-viz update
```

### 添加/移除插件

```bash
# 添加新插件
npx ai-viz add mermaid

# 移除插件
npx ai-viz remove excalidraw
```

## 下一步

- [架构文档](./architecture.md) — 了解分层设计和组件交互方式
- [插件开发指南](./plugin-development.md) — 创建自定义输出格式插件
- [渲染规范](../../specs/) — 浏览内置的图表类型规范
