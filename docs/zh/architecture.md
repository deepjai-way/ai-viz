# 架构文档

本文档介绍 ai-viz 的内部设计，面向贡献者和深度用户。

## 设计理念

ai-viz 基于一个核心原则：**将「可视化什么」与「如何可视化」分离**。

- **方法论层**定义*画什么图*和*何时画*
- **插件层**定义*如何生成*特定输出格式
- **适配器层**将编译输出翻译为各 AI 工具的原生格式

这种分离意味着：
- 添加新输出格式只需编写一个插件
- 支持新 AI 工具只需编写一个适配器
- 核心方法论独立于格式和工具演进

## 分层架构

```
┌─────────────────────────────────────────────────────────────┐
│                    CLI 层 (bin/cli.js)                        │
│              命令: init, add, remove, export, update           │
└─────────────────────────────┬───────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                   编译器 (src/compiler/)                       │
│            读取配置 → 加载源文件 → 组装输出                        │
└──────────┬──────────────────┬───────────────────┬───────────┘
           │                  │                   │
┌──────────▼──────┐ ┌────────▼────────┐ ┌────────▼──────────┐
│  核心层         │ │  插件层          │ │  设计语言          │
│  (core/)       │ │  (plugins/)     │ │  (templates/)     │
│                │ │                 │ │                   │
│  · 方法论      │ │  · drawio       │ │  · 配色           │
│  · 路由        │ │  · excalidraw   │ │  · 排版           │
│  · 质量控制    │ │  · mermaid      │ │  · 布局           │
└────────────────┘ └─────────────────┘ └───────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                  适配器层 (src/adapters/)                      │
│                                                              │
│  claude-code │ cursor │ windsurf │ opencode │ copilot │ ... │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                AI 工具的原生指令目录
```

### 职责矩阵

| 职责 | 方法论层 | 插件层 | 适配器层 |
|------|:--------:|:------:|:--------:|
| 决定画什么类型的图 | ✅ | | |
| 决定使用哪种格式 | ✅ | | |
| 定义设计语言契约 | ✅ | | |
| 生成格式化输出（XML/JSON/text） | | ✅ | |
| 质量自检 | | ✅ | |
| 导出为图片文件 | | ✅ | |
| 映射到工具的文件结构 | | | ✅ |
| 处理工具特定的 frontmatter | | | ✅ |
| 检测工具是否存在 | | | ✅ |

## 插件系统

### 概述

每个插件位于 `plugins/<name>/` 目录下，提供：
- 格式特定的 AI 指令（如何生成该格式）
- Schema 参考（格式规范）
- 可选的导出驱动（用于图片转换）

### 插件接口（`plugin.json`）

```json
{
  "name": "drawio",
  "version": "1.0.0",
  "displayName": "Draw.io Professional Diagrams",
  "displayName_zh": "Draw.io 专业图表",
  "description": "Generate Draw.io XML diagrams with CLI export to PNG/SVG/PDF",
  "description_zh": "生成 Draw.io XML 格式图表，支持 CLI 导出 PNG/SVG/PDF",
  "capabilities": ["generate", "edit", "export"],
  "triggers": {
    "en": ["drawio", "professional diagram", "export PNG"],
    "zh": ["drawio", "专业架构图", "导出PNG"]
  },
  "export": {
    "formats": ["png", "svg", "pdf"],
    "driver": "./export.js",
    "requires": "drawio-desktop"
  },
  "files": {
    "instructions": "./instructions.md",
    "instructions_zh": "./instructions.zh-CN.md",
    "schema": "./schema.md"
  }
}
```

### 插件加载流程

编译器根据 `ai-viz.config.json` 中的 `plugins` 数组加载插件：

1. 读取 `plugin.json` 获取元数据
2. 加载 `instructions.md`（或根据语言加载 `instructions.zh-CN.md`）
3. 加载 `schema.md`（如存在）
4. 将结构化数据传递给适配器

## 适配器系统

### 概述

每个适配器将编译输出翻译为特定 AI 编程工具能理解的格式。适配器处理以下差异：
- 文件位置（指令存储在哪里）
- 文件格式（`.mdc`、`.md`、YAML frontmatter 等）
- 文件结构（单文件 vs 多文件）
- 引用机制（文件链接 vs 内联内容）

### 适配器接口

所有适配器继承 `BaseAdapter`：

```javascript
class BaseAdapter {
  getOutputDir(projectRoot)          // → 输出目录路径
  async detect(projectRoot)          // → boolean（该工具是否活跃？）
  async install(projectRoot, compiled) // → string[]（已创建的文件列表）
  async uninstall(projectRoot)       // → string[]（已删除的文件列表）
}
```

### 适配器差异对比

| 适配器 | 输出目录 | 文件格式 | 结构 |
|--------|----------|----------|------|
| Claude Code | `.claude/skills/ai-viz/` | `.md` + YAML frontmatter | 多文件（SKILL.md + 每插件） |
| Cursor | `.cursor/rules/` | `.mdc` + frontmatter | 多文件（核心 + 每插件） |
| Windsurf | `.windsurf/rules/` | `.md` + frontmatter | 多文件（核心 + 每插件） |
| OpenCode | `.opencode/agents/` | `.md` + JSON 配置 | 单 agent 文件 + opencode.json |
| GitHub Copilot | `.github/` | `.md` + 标记符 | 单文件（追加到 copilot-instructions.md） |
| Qoder | `skills/ai-viz/` | `.md` + YAML frontmatter | 多文件（SKILL.md + 每插件） |
| Aider | `.ai-viz/` | `.md` + conf 引用 | 单 instructions.md + .aider.conf.yml |

### 创建新适配器

1. 创建 `src/adapters/<tool-name>.js`
2. 继承 `BaseAdapter`
3. 实现 `getOutputDir`、`detect`、`install`、`uninstall`
4. 在 `src/commands/init.js` 的 ADAPTERS 映射中注册

## 编译器

编译器（`src/compiler/index.js`）是组装引擎：

```javascript
const compiled = compiler.compile();
// 返回:
// {
//   core: { methodology, routing, quality },
//   plugins: [{ name, instructions, schema, pluginJson }],
//   specs: { architecture: {...}, behavior: {...} },
//   designLanguage: "yaml 字符串",
//   config: { tool, plugins, language, ... }
// }
```

### 编译流程

1. **加载配置** — 从项目根读取 `ai-viz.config.json`
2. **加载核心** — 读取方法论/路由/质量文件（语言感知）
3. **加载插件** — 读取每个选中插件的指令 + Schema
4. **加载规范** — 按分类读取渲染规范
5. **加载设计语言** — 读取 `design-language.yaml`（项目 → 配置路径 → 模板兜底）
6. **返回结构化对象** — 适配器消费此对象生成输出

### 语言解析

编译器按语言解析文件，英文作为兜底：
- `zh-CN` → 尝试 `methodology.zh-CN.md`，回退到 `methodology.md`
- `en` → 直接加载 `methodology.md`

## 目录结构（完整）

```
ai-viz/
├── bin/
│   └── cli.js                       # CLI 入口（引用 src/index.js）
├── src/
│   ├── index.js                     # 命令注册（commander）
│   ├── commands/
│   │   ├── init.js                  # 交互式安装向导
│   │   ├── add.js                   # 向现有配置添加插件
│   │   ├── remove.js                # 移除插件
│   │   ├── export.js                # 导出 drawio 为图片
│   │   └── update.js               # 重新编译并安装
│   ├── compiler/
│   │   └── index.js                 # Compiler 类
│   ├── adapters/
│   │   ├── base.js                  # 抽象 BaseAdapter
│   │   ├── claude-code.js           # Claude Code 适配器
│   │   ├── cursor.js                # Cursor 适配器
│   │   ├── windsurf.js              # Windsurf 适配器
│   │   ├── opencode.js              # OpenCode 适配器
│   │   ├── copilot.js               # GitHub Copilot 适配器
│   │   ├── qoder.js                 # Qoder 适配器
│   │   └── aider.js                 # Aider 适配器
│   └── utils/
│       ├── detect-tool.js           # 自动检测活跃的 AI 工具
│       └── detect-drawio.js         # 检测 Draw.io Desktop
├── core/
│   ├── methodology.md               # 核心方法论（英文）
│   ├── methodology.zh-CN.md         # 核心方法论（中文）
│   ├── routing.md                   # 图表类型路由（英文）
│   ├── routing.zh-CN.md             # 图表类型路由（中文）
│   ├── quality.md                   # 质量控制（英文）
│   └── quality.zh-CN.md             # 质量控制（中文）
├── plugins/
│   ├── drawio/
│   │   ├── plugin.json              # 插件清单
│   │   ├── instructions.md          # AI 指令（英文）
│   │   ├── instructions.zh-CN.md    # AI 指令（中文）
│   │   ├── schema.md                # DrawIO XML Schema 参考
│   │   └── export.js                # 导出驱动
│   ├── excalidraw/
│   │   ├── plugin.json
│   │   ├── instructions.md
│   │   ├── instructions.zh-CN.md
│   │   └── schema.md
│   └── mermaid/
│       ├── plugin.json
│       ├── instructions.md
│       └── instructions.zh-CN.md
├── specs/
│   ├── architecture/
│   │   └── layered.md               # 分层架构规范
│   ├── behavior/
│   │   └── sequence.md              # 时序图规范
│   └── concept/
│       ├── comparison.md            # 对比矩阵规范
│       ├── convergence.md           # 聚合/放射规范
│       └── timeline.md              # 时间线规范
├── templates/
│   ├── ai-viz.config.json           # 配置模板
│   └── design-language.yaml         # 设计语言模板
├── package.json
└── LICENSE
```

## 关键设计决策

1. **无运行时依赖** — ai-viz 生成静态文件，无守护进程或后台服务
2. **编译时方案** — 指令编译一次后安装，AI 工具原生读取
3. **兜底链** — 设计语言：项目文件 → 配置路径 → 包模板
4. **标记符更新** — 对单文件适配器（Copilot），标记符确保安全的局部更新
5. **自包含插件** — 每个插件自带指令、Schema 和可选的导出逻辑
