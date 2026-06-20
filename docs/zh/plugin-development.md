# 插件开发指南

本指南介绍如何为 ai-viz 创建新的输出格式插件。

## 插件结构

每个插件位于 `plugins/<name>/` 目录下：

```
plugins/my-plugin/
├── plugin.json              # 插件清单（必须）
├── instructions.md          # AI 指令 - 英文（必须）
├── instructions.zh-CN.md   # AI 指令 - 中文（可选）
├── schema.md                # 格式 Schema 参考（可选）
└── export.js                # 导出驱动（可选）
```

## plugin.json Schema

清单文件定义插件的元数据和能力。

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "displayName": "My Plugin Diagrams",
  "displayName_zh": "我的插件图表",
  "description": "Generate diagrams in My Format",
  "description_zh": "生成 My Format 格式的图表",
  "capabilities": ["generate", "edit"],
  "triggers": {
    "en": ["my-format", "custom diagram"],
    "zh": ["我的格式", "自定义图表"]
  },
  "export": {
    "formats": ["png", "svg"],
    "driver": "./export.js",
    "requires": "my-tool-cli"
  },
  "files": {
    "instructions": "./instructions.md",
    "instructions_zh": "./instructions.zh-CN.md",
    "schema": "./schema.md"
  }
}
```

### 字段说明

| 字段 | 类型 | 必须 | 说明 |
|------|------|:----:|------|
| `name` | string | ✅ | 插件唯一标识符（小写，无空格） |
| `version` | string | ✅ | 语义化版本号 |
| `displayName` | string | ✅ | 人类可读名称（英文） |
| `displayName_zh` | string | | 人类可读名称（中文） |
| `description` | string | ✅ | 一行描述（英文） |
| `description_zh` | string | | 一行描述（中文） |
| `capabilities` | string[] | ✅ | 支持的操作：`generate`、`edit`、`export` |
| `triggers.en` | string[] | ✅ | 激活此插件的英文关键词 |
| `triggers.zh` | string[] | | 激活此插件的中文关键词 |
| `export` | object | | 导出配置（仅当 `capabilities` 包含 `export` 时） |
| `export.formats` | string[] | | 支持的导出格式（如 `png`、`svg`、`pdf`） |
| `export.driver` | string | | 导出驱动脚本路径 |
| `export.requires` | string | | 导出所需的外部工具 |
| `files.instructions` | string | ✅ | 英文指令文件路径 |
| `files.instructions_zh` | string | | 中文指令文件路径 |
| `files.schema` | string | | 格式 Schema 参考路径 |

## 编写 instructions.md

指令文件是插件最重要的部分，它告诉 AI **如何**生成你格式的图表。

### 最佳实践

1. **具体明确** — 包含精确的输出格式规则，而非模糊描述
2. **展示示例** — 包含 AI 可参考的最小完整示例
3. **定义约束** — 明确 AI 必须做什么、不能做什么
4. **引用设计语言** — 说明如何应用 `design-language.yaml` 中的颜色/字体
5. **覆盖双模式** — 描述创建模式和编辑模式的行为

### 推荐结构

```markdown
# {插件名} 生成指令

## 输出格式
- 文件扩展名: `.xxx`
- 编码: UTF-8
- 基本结构概述

## 生成规则
1. 节点创建规则
2. 连接/边的规则
3. 标签规则
4. 布局规则

## 设计语言映射
- `colors.primary` 如何应用 → ...
- `colors.secondary` 如何应用 → ...
- `layout.direction` 如何应用 → ...

## 创建模式
从知识源全量生成的流程。

## 编辑模式
如何在保持布局的前提下进行定向修改。

## 质量检查清单
- [ ] 所有节点有标签
- [ ] 连接线标注传输内容
- [ ] 颜色遵循语义映射
- [ ] 布局遵循方向偏好

## 最小完整示例

{展示格式结构的骨架示例}
```

### 语言支持

如果提供了 `instructions.zh-CN.md`，当用户配置语言为 `zh-CN` 时会使用它。否则使用英文版作为兜底。

两个文件内容应对等 — 只是翻译不同。

## 添加导出支持

导出是可选的。如果你的格式可以转换为图片，可以提供导出驱动。

### 导出驱动接口

创建 `export.js` 并导出一个函数：

```javascript
'use strict';

const { execSync } = require('child_process');
const path = require('path');

/**
 * 将图表文件导出为指定格式。
 * @param {string} inputFile - 源图表文件的绝对路径
 * @param {Object} options - 导出选项
 * @param {string} options.format - 目标格式（'png', 'svg', 'pdf'）
 * @param {string} options.scale - 缩放倍数（默认 '2'）
 * @param {string} options.output - 输出文件路径（可选，未提供则自动生成）
 * @returns {string} 导出文件的路径
 */
module.exports = function exportDiagram(inputFile, options = {}) {
  const { format = 'png', scale = '2', output } = options;

  // 确定输出路径
  const outputFile = output || inputFile.replace(
    path.extname(inputFile),
    `.${format}`
  );

  // 调用外部工具（示例）
  execSync(`my-tool-cli export "${inputFile}" --format ${format} --scale ${scale} --output "${outputFile}"`, {
    stdio: 'inherit',
  });

  return outputFile;
};
```

### 要求

- `plugin.json` 中的 `export.requires` 字段应注明所需的外部 CLI 工具
- 导出驱动应在所需工具未安装时抛出清晰的错误信息
- 至少支持 `png` 格式；推荐同时支持 `svg` 和 `pdf`

## 编写 schema.md

Schema 文件提供格式参考，帮助 AI 生成有效输出。应包含：

- 文件格式规范（XML 结构、JSON Schema、语法规则）
- 有效的元素类型及其属性
- 连接/边类型
- 样式属性
- 常见模式

### 示例（简化版）

```markdown
# My Format Schema 参考

## 文件结构
输出文件是一个 JSON 对象，顶层结构如下：
...

## 元素类型
### 矩形
- `type`: "rectangle"
- `x`, `y`: 位置（数字）
- `width`, `height`: 尺寸（数字）
- `label`: 显示文本（字符串）
- `fill`: 背景颜色（十六进制字符串）
...

## 连接类型
### 箭头
- `type`: "arrow"
- `source`: 源元素 ID
- `target`: 目标元素 ID
- `label`: 边标签（字符串）
...
```

## 测试你的插件

### 手动测试

1. 将插件添加到 `plugins/` 目录
2. 创建测试项目并运行 `npx ai-viz init`
3. 在设置过程中选择你的插件
4. 验证编译后的指令出现在 AI 工具的目录中
5. 用 AI 工具测试 — 要求它生成一张图表

### 验证清单

- [ ] `plugin.json` 是有效的 JSON 且包含所有必须字段
- [ ] `instructions.md` 存在且非空
- [ ] 插件出现在 `npx ai-viz init` 的交互选择中
- [ ] 编译输出包含插件的指令
- [ ] AI 工具能读取并遵循指令
- [ ] 生成的图表能在目标查看器中正确打开
- [ ] （如有导出）`npx ai-viz export` 能正常工作

## 发布

将你的插件贡献到主仓库：

1. **Fork** ai-viz 仓库
2. **创建**插件到 `plugins/<name>/`
3. **测试**至少在两个 AI 工具上完成验证
4. **提交** Pull Request，包含：
   - 插件目录及所有必须文件
   - 格式和使用场景的简要描述
   - 示例输出文件（放在 test/ 目录中）

### 贡献准则

- 插件名应为格式的通用名称（小写）
- 指令应简洁但完整
- 尽可能同时提供中英文指令
- 导出驱动应优雅地处理错误
- 以现有插件作为参考实现
