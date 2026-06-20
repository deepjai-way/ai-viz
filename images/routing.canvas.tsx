import { useState } from "react";

const C = {
  bg: "#0f172a",
  card: "#1e293b",
  primary: "#60a5fa",
  green: "#34d399",
  amber: "#fbbf24",
  rose: "#fb7185",
  purple: "#a78bfa",
  text: "#f1f5f9",
  muted: "#94a3b8",
  dim: "#64748b",
};

const Pill = ({ x, y, w, h, label, color, r = 16 }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={r} fill={`${color}18`} stroke={color} strokeWidth="1.2" />
    <text x={x + w / 2} y={y + h / 2 + 1} textAnchor="middle" dominantBaseline="middle" fill={color} fontSize="11" fontWeight="500" fontFamily="sans-serif">{label}</text>
  </g>
);

const RouteLine = ({ x1, y1, x2, y2, color, label }) => (
  <g>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.3" opacity="0.6" />
    <circle cx={x2} cy={y2} r="3" fill={color} />
    {label && <text x={(x1 + x2) / 2 + 6} y={(y1 + y2) / 2 - 5} fill={C.dim} fontSize="8" fontFamily="sans-serif">{label}</text>}
  </g>
);

export default function RoutingConcept() {
  const sources = [
    { label: "系统设计文档", color: C.primary },
    { label: "API 规范 / 调用链", color: C.primary },
    { label: "业务规则 / 需求", color: C.green },
    { label: "代码 (类/接口)", color: C.green },
    { label: "科普文章 / 博客", color: C.rose },
    { label: "概念解释 / 教程", color: C.rose },
  ];

  const diagramTypes = [
    { label: "架构图", color: C.primary, y: 50 },
    { label: "时序图", color: C.primary, y: 100 },
    { label: "流程图", color: C.green, y: 150 },
    { label: "类图 / ER图", color: C.green, y: 200 },
    { label: "文章配图", color: C.rose, y: 250 },
    { label: "概念可视化", color: C.rose, y: 300 },
  ];

  const plugins = [
    { label: "drawio", color: C.amber, sub: "XML 专业图表" },
    { label: "excalidraw", color: C.purple, sub: "JSON 手绘风格" },
    { label: "mermaid", color: C.green, sub: "文本图表" },
    { label: "ian-illustrator", color: C.rose, sub: "小黑 IP 配图" },
  ];

  const outputs = [
    { label: ".drawio → PNG/SVG", color: C.amber },
    { label: ".excalidraw", color: C.purple },
    { label: "Mermaid code", color: C.green },
    { label: ".png 手绘图", color: C.rose },
  ];

  return (
    <div
      style={{
        width: 960,
        height: 440,
        background: `linear-gradient(180deg, ${C.bg} 0%, #0c1425 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "sans-serif",
        overflow: "hidden",
      }}
    >
      <div style={{ marginTop: 24, fontSize: 20, fontWeight: 700, color: C.text }}>
        Smart Routing Engine
      </div>
      <div style={{ fontSize: 12, color: C.dim, marginBottom: 16 }}>
        Content analysis → diagram type decision → best plugin → output
      </div>

      <svg width="900" height="370" viewBox="0 0 900 370">
        {/* Column headers */}
        <text x="100" y="20" textAnchor="middle" fill={C.muted} fontSize="10" fontWeight="600" fontFamily="sans-serif">KNOWLEDGE SOURCE</text>
        <text x="350" y="20" textAnchor="middle" fill={C.muted} fontSize="10" fontWeight="600" fontFamily="sans-serif">DIAGRAM TYPE</text>
        <text x="600" y="20" textAnchor="middle" fill={C.muted} fontSize="10" fontWeight="600" fontFamily="sans-serif">PLUGIN</text>
        <text x="810" y="20" textAnchor="middle" fill={C.muted} fontSize="10" fontWeight="600" fontFamily="sans-serif">OUTPUT</text>

        {/* Vertical separator lines */}
        <line x1="220" y1="30" x2="220" y2="340" stroke={C.dim} strokeWidth="0.5" opacity="0.3" />
        <line x1="480" y1="30" x2="480" y2="340" stroke={C.dim} strokeWidth="0.5" opacity="0.3" />
        <line x1="710" y1="30" x2="710" y2="340" stroke={C.dim} strokeWidth="0.5" opacity="0.3" />

        {/* Source pills */}
        {sources.map((s, i) => (
          <Pill key={`s${i}`} x="20" y={35 + i * 52} w="160" h="36" label={s.label} color={s.color} />
        ))}

        {/* Diagram type pills */}
        {diagramTypes.map((d, i) => (
          <Pill key={`d${i}`} x="280" y={35 + i * 52} w="140" h="36" label={d.label} color={d.color} />
        ))}

        {/* Route lines: sources → diagram types */}
        <RouteLine x1="180" y1="53" x2="280" y2="53" color={C.primary} label="结构视角" />
        <RouteLine x1="180" y1="105" x2="280" y2="105" color={C.primary} label="行为视角" />
        <RouteLine x1="180" y1="157" x2="280" y2="157" color={C.green} label="流程视角" />
        <RouteLine x1="180" y1="209" x2="280" y2="209" color={C.green} label="数据视角" />
        <RouteLine x1="180" y1="261" x2="280" y2="261" color={C.rose} label="教学视角" />
        <RouteLine x1="180" y1="313" x2="280" y2="313" color={C.rose} label="认知视角" />

        {/* Plugin boxes */}
        {plugins.map((p, i) => (
          <g key={`p${i}`}>
            <rect x="510" y={35 + i * 80} width="170" height="55" rx="10" fill={C.card} stroke={p.color} strokeWidth="1.5" />
            <text x="595" y={55 + i * 80} textAnchor="middle" fill={p.color} fontSize="13" fontWeight="600" fontFamily="sans-serif">{p.label}</text>
            <text x="595" y={72 + i * 80} textAnchor="middle" fill={C.dim} fontSize="9" fontFamily="sans-serif">{p.sub}</text>
          </g>
        ))}

        {/* Route lines: diagram types → plugins */}
        <RouteLine x1="420" y1="53" x2="510" y2="62" color={C.amber} />
        <RouteLine x1="420" y1="53" x2="510" y2="142" color={C.purple} />
        <RouteLine x1="420" y1="105" x2="510" y2="222" color={C.green} />
        <RouteLine x1="420" y1="157" x2="510" y2="62" color={C.amber} />
        <RouteLine x1="420" y1="157" x2="510" y2="222" color={C.green} />
        <RouteLine x1="420" y1="209" x2="510" y2="62" color={C.amber} />
        <RouteLine x1="420" y1="261" x2="510" y2="282" color={C.rose} />
        <RouteLine x1="420" y1="313" x2="510" y2="282" color={C.rose} />

        {/* Output pills */}
        {outputs.map((o, i) => (
          <Pill key={`o${i}`} x="720" y={42 + i * 80} w="160" h="40" label={o.label} color={o.color} r={8} />
        ))}

        {/* Route lines: plugins → outputs */}
        <RouteLine x1="680" y1="62" x2="720" y2="62" color={C.amber} />
        <RouteLine x1="680" y1="142" x2="720" y2="142" color={C.purple} />
        <RouteLine x1="680" y1="222" x2="720" y2="222" color={C.green} />
        <RouteLine x1="680" y1="302" x2="720" y2="302" color={C.rose} />

        {/* Confidence badges */}
        <g>
          <rect x="245" y="345" width="10" height="10" rx="2" fill={C.green} opacity="0.8" />
          <text x="260" y="354" fill={C.dim} fontSize="9" fontFamily="sans-serif">Strong mapping (auto-execute)</text>

          <rect x="430" y="345" width="10" height="10" rx="2" fill={C.amber} opacity="0.8" />
          <text x="445" y="354" fill={C.dim} fontSize="9" fontFamily="sans-serif">Multiple options (recommend + confirm)</text>

          <rect x="660" y="345" width="10" height="10" rx="2" fill={C.rose} opacity="0.8" />
          <text x="675" y="354" fill={C.dim} fontSize="9" fontFamily="sans-serif">Article content (illustration)</text>
        </g>
      </svg>
    </div>
  );
}
