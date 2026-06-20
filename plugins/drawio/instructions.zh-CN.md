# Draw.io 专业图表生成指令

基于 AI 可视化方法论，生成 Draw.io XML 格式图表。支持 CLI 一键导出 PNG/SVG/PDF，适用于对外方案、正式文档等专业场景。

---

## 一、触发与路由

### 1.1 显式触发

用户说 "画drawio" / "专业架构图" / "导出PNG" / "正式图表" 时直接执行。

### 1.2 自动推荐 Draw.io 的场景

| 场景 | 推荐理由 |
|------|---------|
| 对外客户方案 | 专业正式，可导出高清图 |
| PPT / 汇报材料 | 需要 PNG/SVG 嵌入 |
| 需要精确对齐和布局 | Draw.io 的网格系统更精确 |
| 正式设计评审 | 商务风格更适合 |

### 1.3 与 Excalidraw 的边界

| 场景 | 用 Excalidraw | 用 Draw.io |
|------|--------------|-----------|
| 内部设计文档 | ✅ | |
| 对外客户方案 | | ✅ |
| 快速白板讨论 | ✅ | |
| PPT / 正式汇报 | | ✅ |
| README 级别 | 用 Mermaid | |

---

## 二、执行流程

### 2.1 Create 模式（首次生成）

```
Step 1: 知识源读取
  - 如果用户指定了文档路径 → 阅读文档，提取相关章节
  - 如果是自然语言描述 → 从描述中提取结构

Step 2: 图种确认（置信度分级）
  - 高置信度 → 直接进入 Step 3，附说明理由
  - 低置信度 → 推荐图种 + 备选，等确认

Step 3: 结构提取
  - 识别节点（实体/服务/参与者）
  - 识别关系（调用/依赖/数据流）
  - 识别层次（分层/分组/泳道）

Step 4: 布局规划
  - 加载对应图种的渲染规格（specs/ 目录）
  - 加载设计语言配色（design-language.yaml）
  - 计算坐标网格，应用 Draw.io 自动布局参数

Step 5: 生成 XML
  - 生成 .drawio 文件
  - 执行自检清单
  - 输出文件路径 + 摘要

Step 6: 导出（可选）
  - 用户要求导出时，调用 CLI 导出为 PNG/SVG/PDF
```

### 2.2 Edit 模式（修改已有图）

用户基于已有 .drawio 文件请求修改时：
1. 读取已有 XML
2. 解析 mxCell 结构，定位要修改的元素
3. 仅修改涉及的部分（新增/删除/移动节点）
4. 保留已有样式和布局
5. 不全量重生成

---

## 三、设计语言

### 3.1 色彩映射

优先读取项目中的 `design-language.yaml`。若无，使用默认值：

| 语义槽位 | 默认色 | 用途 |
|---------|--------|------|
| primary | `#dae8fc` | 核心业务服务 |
| secondary | `#d5e8d4` | 外部系统/接入层 |
| accent | `#fff2cc` | 网关/关键节点 |
| muted | `#f5f5f5` | 基础设施 |
| danger | `#f8cecc` | 告警/需关注 |
| text | `#333333` | 文字 |
| stroke | `#333333` | 默认边框色 |

### 3.2 Draw.io 配色与 Excalidraw 对照

Draw.io 配色更柔和，适合专业文档：

| 语义 | Excalidraw | Draw.io |
|------|-----------|---------|
| 主要 | `#a5d8ff` | `#dae8fc` (strokeColor=`#6c8ebf`) |
| 外部 | `#b2f2bb` | `#d5e8d4` (strokeColor=`#82b366`) |
| 重点 | `#ffd43b` | `#fff2cc` (strokeColor=`#d6b656`) |
| 弱化 | `#e9ecef` | `#f5f5f5` (strokeColor=`#666666`) |
| 告警 | `#ffc9c9` | `#f8cecc` (strokeColor=`#b85450`) |

### 3.3 美学原则

1. **分层清晰**：水平分 3-4 层，每层一个色系
2. **颜色克制**：主色不超过 3 种
3. **箭头标注**：每条连接线标明传递内容
4. **留白充分**：元素间保持足够间距
5. **对齐严格**：所有元素网格对齐，不允许错位

---

## 四、XML 技术规范

### 4.1 文件骨架

```xml
<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="ai-viz" agent="ai-viz-plugin">
  <diagram name="架构图" id="diagram-001">
    <mxGraphModel dx="1200" dy="800" grid="1" gridSize="10"
                  guides="1" tooltips="1" connect="1"
                  arrows="1" fold="1" page="1"
                  pageScale="1" pageWidth="1169" pageHeight="827">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <!-- 所有图形元素在这里 -->
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

### 4.2 节点（矩形）

```xml
<mxCell id="node-xxx" value="&lt;b&gt;节点标签&lt;/b&gt;&lt;br&gt;&lt;font style=&quot;font-size:11px&quot;&gt;一句话描述&lt;/font&gt;" style="rounded=1;fillColor=#dae8fc;strokeColor=#6c8ebf;fontColor=#333333;fontSize=14;fontStyle=1;whiteSpace=wrap;html=1;" vertex="1" parent="1">
  <mxGeometry x="100" y="100" width="200" height="60" as="geometry"/>
</mxCell>
```

> **重要**：value 包含 HTML 标签时，style 中必须包含 `html=1;`，否则会显示原始标签文字。

### 4.3 连接线（箭头）

```xml
<mxCell id="edge-xxx" value="标注文字" style="edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor=#333333;fontSize=11;endArrow=blockThin;endFill=1;" edge="1" source="node-a" target="node-b" parent="1">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

### 4.4 常用 style 属性

| 属性 | 说明 | 示例值 |
|------|------|--------|
| rounded | 圆角 | 0/1 |
| fillColor | 填充色 | #dae8fc |
| strokeColor | 边框色 | #6c8ebf |
| fontColor | 文字色 | #333333 |
| fontSize | 字号 | 12-16 |
| fontStyle | 字体样式 | 0=普通, 1=粗体, 2=斜体 |
| dashed | 虚线 | 0/1 |
| edgeStyle | 连线样式 | orthogonalEdgeStyle / elbowEdgeStyle |
| endArrow | 箭头类型 | blockThin / open / classic / none |
| endFill | 箭头填充 | 0/1 |
| shape | 特殊形状 | cylinder3 / hexagon / cloud |
| verticalAlign | 垂直对齐 | top / middle / bottom |
| whiteSpace | 换行 | wrap |
| html | 启用 HTML 渲染 | 1 |

### 4.5 分层背景（容器）

```xml
<mxCell id="layer-xxx" value="接入层" style="rounded=1;fillColor=#f5f5f5;strokeColor=#666666;dashed=1;fontSize=12;fontStyle=2;verticalAlign=top;align=left;spacingLeft=10;spacingTop=5;" vertex="1" parent="1">
  <mxGeometry x="50" y="50" width="900" height="120" as="geometry"/>
</mxCell>
```

子节点通过 `parent` 属性指向容器 id，坐标相对于容器左上角。

### 4.6 数据库形状

```xml
<mxCell id="db-xxx" value="MySQL" style="shape=cylinder3;size=15;fillColor=#f5f5f5;strokeColor=#666666;fontSize=12;whiteSpace=wrap;html=1;" vertex="1" parent="1">
  <mxGeometry x="100" y="400" width="80" height="60" as="geometry"/>
</mxCell>
```

---

## 五、CLI 导出

### 5.1 跨平台导出命令

Draw.io 桌面版支持命令行导出。根据操作系统使用不同命令：

**Windows:**
```bash
"C:\Program Files\draw.io\draw.io.exe" -x -f png -o output.png input.drawio
```

**macOS:**
```bash
/Applications/draw.io.app/Contents/MacOS/draw.io -x -f png -o output.png input.drawio
```

**Linux:**
```bash
drawio -x -f png -o output.png input.drawio
```

**使用 ai-viz CLI（推荐，自动检测平台）：**
```bash
npx ai-viz export input.drawio -f png -o output.png
```

### 5.2 常用导出参数

```bash
# 导出 PNG
draw.io -x -f png -o output.png input.drawio

# 导出 SVG
draw.io -x -f svg -o output.svg input.drawio

# 导出 PDF
draw.io -x -f pdf -o output.pdf input.drawio

# 指定页面（多页图表）
draw.io -x -f png -p 0 -o page1.png input.drawio

# 指定缩放
draw.io -x -f png --scale 2 -o output@2x.png input.drawio
```

### 5.3 导出时机

| 场景 | 是否自动导出 |
|------|------------|
| 用户说"导出PNG" | 是 |
| 对外方案文档 | 推荐导出，等确认 |
| 日常开发文档 | 不导出，直接用 .drawio |

---

## 六、质量自检

生成 XML 后必须检查：

- [ ] XML 标签完整闭合
- [ ] 所有 mxCell id 唯一（无重复）
- [ ] 所有连线有 value 标注（说明传递内容）
- [ ] source/target 引用的 id 存在
- [ ] 布局方向一致（不混合上下和左右）
- [ ] 配色符合设计语言
- [ ] 节点数量合理（单图 ≤ 20 核心节点）
- [ ] 无重叠（通过坐标计算验证）
- [ ] 特殊字符已转义（& → `&amp;`, < → `&lt;`, > → `&gt;`）
- [ ] style 中包含 `html=1`（使用 HTML value 时）

---

## 七、输出规范

每次生成后提供：

1. `.drawio` 文件
2. 摘要：图种 + 节点数 + 关键结构说明
3. 是否需要导出：如果是对外场景，主动询问是否导出 PNG
4. 打开方式：
   - VS Code Draw.io Integration 插件
   - Draw.io Desktop 双击打开
   - 在线版 app.diagrams.net 导入

---

## 八、迭代协议

- 用户反馈修改 → Edit 模式，定向修改 XML 节点
- 保留已有布局，只改变更部分
- 最多 5 轮迭代
- 超过建议拆分或重新梳理需求
- 每次修改后可立即导出 PNG 查看效果

---

## Schema 参考

详见 `schema.md`
