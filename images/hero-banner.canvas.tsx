import { useState } from "react";

const COLORS = {
  bg1: "#0f172a",
  bg2: "#1e293b",
  primary: "#60a5fa",
  secondary: "#34d399",
  accent: "#fbbf24",
  muted: "#94a3b8",
  text: "#f8fafc",
  node: "#1e3a5f",
  nodeBorder: "#60a5fa",
  codeBg: "#0d1117",
  diagramBg: "#0f2942",
};

export default function HeroBanner() {
  return (
    <div
      style={{
        width: 1200,
        height: 480,
        background: `linear-gradient(135deg, ${COLORS.bg1} 0%, ${COLORS.bg2} 50%, #0c1a2e 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background grid pattern */}
      <svg
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.06 }}
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={COLORS.primary} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Glowing orbs background */}
      <div
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.primary}22 0%, transparent 70%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -80,
          left: -40,
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.secondary}18 0%, transparent 70%)`,
        }}
      />

      {/* Title section */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8, zIndex: 1 }}>
        <svg width="48" height="48" viewBox="0 0 48 48">
          <rect x="4" y="4" width="40" height="40" rx="8" fill={COLORS.node} stroke={COLORS.primary} strokeWidth="2" />
          <path d="M14 28 L24 14 L34 28" fill="none" stroke={COLORS.secondary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="24" cy="34" r="3" fill={COLORS.accent} />
          <line x1="14" y1="28" x2="34" y2="28" stroke={COLORS.primary} strokeWidth="1.5" strokeDasharray="3,2" />
        </svg>
        <span
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: COLORS.text,
            letterSpacing: "-1px",
          }}
        >
          ai-viz
        </span>
      </div>

      <div
        style={{
          fontSize: 18,
          color: COLORS.muted,
          marginBottom: 48,
          letterSpacing: "2px",
          zIndex: 1,
        }}
      >
        AI-POWERED VISUALIZATION TOOLKIT
      </div>

      {/* Main visual: Text → AI → Diagram */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 40,
          zIndex: 1,
        }}
      >
        {/* Left: Text/Code input */}
        <div
          style={{
            background: COLORS.codeBg,
            border: `1px solid ${COLORS.primary}40`,
            borderRadius: 12,
            padding: "20px 24px",
            width: 300,
            boxShadow: `0 0 30px ${COLORS.primary}15`,
          }}
        >
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
          </div>
          <div style={{ fontSize: 13, color: COLORS.muted, fontFamily: "monospace", lineHeight: 1.7 }}>
            <span style={{ color: "#7c3aed" }}>描述</span>你的系统架构...
            <br />
            <span style={{ color: COLORS.primary }}>"API 网关 → 用户服务</span>
            <br />
            <span style={{ color: COLORS.primary }}>&nbsp;→ 订单服务 → 数据库"</span>
            <br />
            <span style={{ color: COLORS.muted, opacity: 0.5 }}>▊</span>
          </div>
        </div>

        {/* Center: Arrow + AI brain */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <svg width="160" height="80" viewBox="0 0 160 80">
            {/* Animated-style arrow */}
            <defs>
              <linearGradient id="arrowGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={COLORS.primary} />
                <stop offset="50%" stopColor={COLORS.secondary} />
                <stop offset="100%" stopColor={COLORS.accent} />
              </linearGradient>
            </defs>
            <line x1="0" y1="40" x2="120" y2="40" stroke="url(#arrowGrad)" strokeWidth="2.5" />
            <polygon points="120,30 145,40 120,50" fill={COLORS.accent} />
            {/* AI sparkle */}
            <text x="55" y="25" fontSize="20" textAnchor="middle">
              ✨
            </text>
            <text x="80" y="68" fontSize="11" fill={COLORS.muted} textAnchor="middle" fontFamily="sans-serif">
              ai-viz
            </text>
          </svg>
        </div>

        {/* Right: Diagram output */}
        <div
          style={{
            background: COLORS.diagramBg,
            border: `1px solid ${COLORS.secondary}40`,
            borderRadius: 12,
            padding: "20px 24px",
            width: 300,
            height: 160,
            boxShadow: `0 0 30px ${COLORS.secondary}15`,
            position: "relative",
          }}
        >
          <svg width="260" height="120" viewBox="0 0 260 120">
            {/* API Gateway node */}
            <rect x="80" y="0" width="100" height="32" rx="6" fill={COLORS.node} stroke={COLORS.accent} strokeWidth="1.5" />
            <text x="130" y="20" textAnchor="middle" fill={COLORS.accent} fontSize="11" fontFamily="sans-serif">
              API Gateway
            </text>

            {/* User Service */}
            <rect x="10" y="55" width="100" height="32" rx="6" fill={COLORS.node} stroke={COLORS.primary} strokeWidth="1.5" />
            <text x="60" y="75" textAnchor="middle" fill={COLORS.primary} fontSize="11" fontFamily="sans-serif">
              User Service
            </text>

            {/* Order Service */}
            <rect x="150" y="55" width="100" height="32" rx="6" fill={COLORS.node} stroke={COLORS.secondary} strokeWidth="1.5" />
            <text x="200" y="75" textAnchor="middle" fill={COLORS.secondary} fontSize="11" fontFamily="sans-serif">
              Order Service
            </text>

            {/* Database */}
            <rect x="150" y="95" width="100" height="24" rx="4" fill={COLORS.node} stroke={COLORS.muted} strokeWidth="1" />
            <text x="200" y="111" textAnchor="middle" fill={COLORS.muted} fontSize="10" fontFamily="sans-serif">
              Database
            </text>

            {/* Arrows */}
            <line x1="110" y1="32" x2="70" y2="55" stroke={COLORS.primary} strokeWidth="1.2" markerEnd="url(#arrowhead)" />
            <line x1="150" y1="32" x2="180" y2="55" stroke={COLORS.secondary} strokeWidth="1.2" />
            <line x1="200" y1="87" x2="200" y2="95" stroke={COLORS.muted} strokeWidth="1" />

            <defs>
              <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                <polygon points="0 0, 6 2, 0 4" fill={COLORS.muted} />
              </marker>
            </defs>
          </svg>
        </div>
      </div>

      {/* Bottom: Supported tools badges */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 40,
          zIndex: 1,
        }}
      >
        {["DrawIO", "Excalidraw", "Mermaid", "10+ AI Tools"].map((label, i) => (
          <div
            key={i}
            style={{
              background: `${COLORS.primary}15`,
              border: `1px solid ${COLORS.primary}30`,
              borderRadius: 20,
              padding: "6px 16px",
              fontSize: 12,
              color: COLORS.muted,
              letterSpacing: "0.5px",
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
