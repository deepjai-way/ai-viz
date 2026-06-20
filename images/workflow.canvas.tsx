import { useState } from "react";

const C = {
  bg: "#0f172a",
  card: "#1e293b",
  border: "#334155",
  primary: "#60a5fa",
  green: "#34d399",
  amber: "#fbbf24",
  rose: "#fb7185",
  text: "#f1f5f9",
  muted: "#94a3b8",
  dim: "#64748b",
};

const Box = ({ x, y, w, h, label, sub, color, icon, r = 10 }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={r} fill={C.card} stroke={color} strokeWidth="1.5" />
    {icon && <text x={x + w / 2} y={y + (sub ? h / 2 - 6 : h / 2 + 1)} textAnchor="middle" dominantBaseline="middle" fontSize="22">{icon}</text>}
    <text x={x + w / 2} y={y + (icon ? h / 2 + 16 : sub ? h / 2 - 4 : h / 2 + 1)} textAnchor="middle" dominantBaseline="middle" fill={color} fontSize="13" fontWeight="600" fontFamily="sans-serif">{label}</text>
    {sub && <text x={x + w / 2} y={y + (icon ? h / 2 + 30 : h / 2 + 12)} textAnchor="middle" dominantBaseline="middle" fill={C.dim} fontSize="10" fontFamily="sans-serif">{sub}</text>}
  </g>
);

const Arrow = ({ x1, y1, x2, y2, color = C.dim, label, dashed }) => (
  <g>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.5" strokeDasharray={dashed ? "5,3" : "none"} markerEnd="url(#ah)" />
    {label && (
      <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 8} textAnchor="middle" fill={C.muted} fontSize="9" fontFamily="sans-serif">{label}</text>
    )}
  </g>
);

export default function WorkflowDiagram() {
  return (
    <div
      style={{
        width: 960,
        height: 520,
        background: `linear-gradient(180deg, ${C.bg} 0%, #0c1425 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: 'sans-serif',
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Title */}
      <div style={{ marginTop: 28, fontSize: 22, fontWeight: 700, color: C.text, letterSpacing: "0.5px" }}>
        How ai-viz Works
      </div>
      <div style={{ fontSize: 13, color: C.dim, marginBottom: 20 }}>
        From description to professional diagrams — one command
      </div>

      <svg width="900" height="440" viewBox="0 0 900 440">
        <defs>
          <marker id="ah" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={C.dim} />
          </marker>
        </defs>

        {/* Phase 1: Init */}
        <text x="90" y="24" textAnchor="middle" fill={C.amber} fontSize="11" fontWeight="600" fontFamily="sans-serif">① INIT</text>
        <Box x="20" y="36" w="140" h="60" label="npx ai-viz init" sub="交互式向导" color={C.amber} />

        {/* Phase 2: Compile */}
        <text x="350" y="24" textAnchor="middle" fill={C.primary} fontSize="11" fontWeight="600" fontFamily="sans-serif">② COMPILE</text>

        {/* Core methodology */}
        <Box x="230" y="36" w="100" h="50" label="方法论" sub="core/" color={C.primary} />
        <Box x="345" y="36" w="100" h="50" label="插件指令" sub="plugins/" color={C.green} />
        <Box x="230" y="100" w="100" h="50" label="路由规则" sub="routing" color={C.primary} />
        <Box x="345" y="100" w="100" h="50" label="设计语言" sub="yaml config" color={C.green} />

        {/* Compiler center */}
        <rect x="270" y="170" width="160" height="50" rx="10" fill={`${C.primary}20`} stroke={C.primary} strokeWidth="2" />
        <text x="350" y="195" textAnchor="middle" dominantBaseline="middle" fill={C.primary} fontSize="14" fontWeight="700" fontFamily="sans-serif">Compiler</text>
        <text x="350" y="210" textAnchor="middle" dominantBaseline="middle" fill={C.dim} fontSize="9" fontFamily="sans-serif">编译 + 组装</text>

        {/* Arrows to compiler */}
        <Arrow x1="280" y1="86" x2="310" y2="170" color={C.primary} />
        <Arrow x1="395" y1="86" x2="380" y2="170" color={C.green} />
        <Arrow x1="280" y1="150" x2="310" y2="170" color={C.primary} />
        <Arrow x1="395" y1="150" x2="380" y2="170" color={C.green} />

        {/* Arrow from init to compile */}
        <Arrow x1="160" y1="66" x2="230" y2="60" color={C.amber} label="选择偏好" />

        {/* Phase 3: Adapt */}
        <text x="640" y="24" textAnchor="middle" fill={C.green} fontSize="11" fontWeight="600" fontFamily="sans-serif">③ ADAPT</text>

        {/* Adapter outputs */}
        <Box x="560" y="42" w="160" h="36" label="Claude Code" sub=".claude/skills/ai-viz/" color={C.muted} r={8} />
        <Box x="560" y="86" w="160" h="36" label="Cursor / Windsurf" sub=".cursor/rules/" color={C.muted} r={8} />
        <Box x="560" y="130" w="160" h="36" label="Qoder / Copilot" sub="skills/ai-viz/" color={C.muted} r={8} />
        <Box x="560" y="174" w="160" h="36" label="Aider / Trae / ..." sub="tool-native dirs" color={C.muted} r={8} />

        {/* Compiler to adapters */}
        <Arrow x1="430" y1="190" x2="560" y2="60" color={C.green} />
        <Arrow x1="430" y1="193" x2="560" y2="104" color={C.green} />
        <Arrow x1="430" y1="195" x2="560" y2="148" color={C.green} />
        <Arrow x1="430" y1="198" x2="560" y2="192" color={C.green} />

        <text x="500" y="130" textAnchor="middle" fill={C.dim} fontSize="9" fontFamily="sans-serif" transform="rotate(-25, 500, 130)">Adapter</text>

        {/* Phase 4: Use */}
        <text x="450" y="268" textAnchor="middle" fill={C.rose} fontSize="11" fontWeight="600" fontFamily="sans-serif">④ USE</text>

        {/* User */}
        <Box x="60" y="282" w="140" h="70" label="👤 用户" sub={'"画一个架构图"'} color={C.rose} />

        {/* AI Tool */}
        <Box x="290" y="282" w="160" h="70" label="🤖 AI 编程工具" sub="读取指令 + 生成图表" color={C.primary} />

        {/* Output */}
        <Box x="540" y="282" w="140" h="70" label="📊 专业图表" sub="drawio / excalidraw / mermaid" color={C.green} />

        {/* Arrows for phase 4 */}
        <Arrow x1="200" y1="317" x2="290" y2="317" color={C.rose} label="描述需求" />
        <Arrow x1="450" y1="317" x2="540" y2="317" color={C.green} label="输出文件" />

        {/* Arrow from adapters down to AI tool */}
        <Arrow x1="640" y1="210" x2="430" y2="282" color={C.muted} label="指令注入" dashed />

        {/* Bottom: result examples */}
        <g>
          <text x="130" y="395" textAnchor="middle" fill={C.dim} fontSize="10" fontFamily="sans-serif">架构图</text>
          <rect x="70" y="400" width="120" height="30" rx="5" fill={C.card} stroke={C.primary} strokeWidth="1" />
          <text x="130" y="418" textAnchor="middle" fill={C.primary} fontSize="10" fontFamily="monospace">.drawio</text>
        </g>
        <g>
          <text x="310" y="395" textAnchor="middle" fill={C.dim} fontSize="10" fontFamily="sans-serif">时序图</text>
          <rect x="250" y="400" width="120" height="30" rx="5" fill={C.card} stroke={C.green} strokeWidth="1" />
          <text x="310" y="418" textAnchor="middle" fill={C.green} fontSize="10" fontFamily="monospace">mermaid code</text>
        </g>
        <g>
          <text x="490" y="395" textAnchor="middle" fill={C.dim} fontSize="10" fontFamily="sans-serif">手绘图</text>
          <rect x="430" y="400" width="120" height="30" rx="5" fill={C.card} stroke={C.amber} strokeWidth="1" />
          <text x="490" y="418" textAnchor="middle" fill={C.amber} fontSize="10" fontFamily="monospace">.excalidraw</text>
        </g>
        <g>
          <text x="670" y="395" textAnchor="middle" fill={C.dim} fontSize="10" fontFamily="sans-serif">文章配图</text>
          <rect x="610" y="400" width="120" height="30" rx="5" fill={C.card} stroke={C.rose} strokeWidth="1" />
          <text x="670" y="418" textAnchor="middle" fill={C.rose} fontSize="10" fontFamily="monospace">.png</text>
        </g>

        {/* Arrows from output box to examples */}
        <Arrow x1="590" y1="352" x2="140" y2="400" color={C.dim} dashed />
        <Arrow x1="610" y1="352" x2="320" y2="400" color={C.dim} dashed />
        <Arrow x1="620" y1="352" x2="500" y2="400" color={C.dim} dashed />
        <Arrow x1="640" y1="352" x2="670" y2="400" color={C.dim} dashed />
      </svg>
    </div>
  );
}
