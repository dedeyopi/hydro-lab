import React from 'react';

export const DiverScene: React.FC<{ depth?: number }> = ({ depth = 3 }) => {
  const maxDepth = 8;
  const waterTop = 55;
  const depthStartY = 82;    // y untuk h = 0
  const depthEndY = 330;     // y untuk h = maxDepth
  const rangeY = depthEndY - depthStartY;

  const clampedDepth = Math.min(Math.max(depth, 0), maxDepth);
  const diverY = depthStartY + (clampedDepth / maxDepth) * rangeY;
  const intensity = clampedDepth / maxDepth;

  const diverX = 320;        // pusat horizontal kanvas

  return (
    <svg
      viewBox="0 0 640 360"
      className="w-full h-full block"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Ilustrasi penyelam pada kedalaman ${clampedDepth.toFixed(1)} meter`}
    >
      <defs>
        <linearGradient id="sea-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="55%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>
        <marker
          id="diver-arrowhead"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 6 3, 0 6" fill="#fef08a" />
        </marker>
      </defs>

      {/* ===== SKY ===== */}
      <rect x="0" y="0" width="640" height={waterTop} fill="url(#sky-grad)" />
      <circle cx="560" cy="26" r="16" fill="#fde047" opacity="0.9" />
      <circle cx="560" cy="26" r="24" fill="#fde047" opacity="0.25" />

      {/* ===== WATER (fills everything below) ===== */}
      <rect
        x="0"
        y={waterTop}
        width="640"
        height={360 - waterTop}
        fill="url(#sea-grad)"
      />

      {/* Wavy surface */}
      <path
        d={`M0,${waterTop} Q60,${waterTop - 8} 130,${waterTop} T260,${waterTop} T390,${waterTop} T520,${waterTop} T640,${waterTop} L640,${waterTop + 12} L0,${waterTop + 12} Z`}
        fill="#ffffff"
        opacity="0.45"
      />

      {/* ===== DEPTH SCALE (label dipindah lebih ke dalam) ===== */}
      <g>
        {[1, 2, 3, 4, 5, 6, 7].map((d) => {
          const y = depthStartY + (d / maxDepth) * rangeY;
          return (
            <g key={d}>
              {/* garis tick dari kiri */}
              <line
                x1="62"
                y1={y}
                x2="98"
                y2={y}
                stroke="#ffffff"
                strokeOpacity="0.55"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              {/* label angka */}
              <text
                x="54"
                y={y + 4}
                textAnchor="end"
                fill="#ffffff"
                fontSize="13"
                fontWeight="700"
                opacity="0.95"
              >
                {d} m
              </text>
            </g>
          );
        })}
      </g>

      {/* ===== GARIS PENANDA KEDALAMAN PENYELAM ===== */}
      <g>
        <line
          x1="98"
          y1={diverY}
          x2={diverX - 60}
          y2={diverY}
          stroke="#fbbf24"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          opacity="0.75"
        />
        <g transform={`translate(200 ${diverY - 4})`}>
          <rect x="-52" y="-15" width="104" height="24" rx="12" fill="#fbbf24" />
          <text
            x="0"
            y="4"
            fill="#78350f"
            fontSize="13"
            fontWeight="800"
            textAnchor="middle"
          >
            h = {clampedDepth.toFixed(1)} m
          </text>
        </g>
      </g>

      {/* ===== PANAH TEKANAN (segala arah) ===== */}
      <g>
        {[
          { dx: 0, dy: -1 },
          { dx: 0, dy: 1 },
          { dx: -1, dy: 0 },
          { dx: 1, dy: 0 },
        ].map((a, i) => {
          const startDist = 44;
          const arrowLen = 22 + intensity * 26;
          return (
            <line
              key={i}
              x1={diverX + a.dx * startDist}
              y1={diverY + a.dy * startDist}
              x2={diverX + a.dx * (startDist + arrowLen)}
              y2={diverY + a.dy * (startDist + arrowLen)}
              stroke="#fef08a"
              strokeWidth={2.5 + intensity * 1.5}
              strokeLinecap="round"
              markerEnd="url(#diver-arrowhead)"
              opacity={0.55 + intensity * 0.45}
            />
          );
        })}
      </g>

      {/* ===== PENYELAM ===== */}
      {/* PENTING: <g> LUAR = posisi (SVG transform), <g> DALAM = animasi (CSS) */}
      <g transform={`translate(${diverX} ${diverY})`}>
        <g className="float-slow">
          {/* Tabung oksigen di belakang */}
          <rect x="-28" y="-14" width="11" height="30" rx="5" fill="#f43f5e" />
          <rect x="-28" y="-14" width="11" height="30" rx="5" fill="#ffffff" opacity="0.2" />
          <circle cx="-22.5" cy="-16" r="3" fill="#9f1239" />

          {/* Kaki */}
          <path d="M-8,26 L-16,48 L-8,50 L-2,28 Z" fill="#0f172a" />
          <path d="M8,26 L16,48 L8,50 L2,28 Z" fill="#0f172a" />

          {/* Sirip (fins) */}
          <path d="M-14,46 L-28,60 L-14,62 L-6,50 Z" fill="#0ea5e9" />
          <path d="M14,46 L28,60 L14,62 L6,50 Z" fill="#0ea5e9" />

          {/* Lengan */}
          <path d="M-14,-2 Q-26,10 -24,20 L-18,20 Q-18,12 -10,4 Z" fill="#0f172a" />
          <path d="M14,-2 Q26,10 24,20 L18,20 Q18,12 10,4 Z" fill="#0f172a" />

          {/* Badan (wetsuit) */}
          <ellipse cx="0" cy="6" rx="15" ry="24" fill="#0f172a" />
          <ellipse cx="0" cy="6" rx="15" ry="24" fill="#1e293b" opacity="0.5" />

          {/* Sabuk kuning */}
          <rect x="-15" y="8" width="30" height="4" rx="2" fill="#fbbf24" />

          {/* Kepala / hood */}
          <circle cx="0" cy="-24" r="13" fill="#0f172a" />
          <circle cx="0" cy="-24" r="13" fill="#1e293b" opacity="0.5" />

          {/* Wajah */}
          <ellipse cx="0" cy="-22" rx="8" ry="8" fill="#fbbf24" />

          {/* Masker */}
          <rect
            x="-11"
            y="-27"
            width="22"
            height="11"
            rx="5"
            fill="#0ea5e9"
            opacity="0.9"
            stroke="#0f172a"
            strokeWidth="1.5"
          />
          <rect x="-8" y="-25" width="6" height="7" rx="2" fill="#bae6fd" opacity="0.85" />
          <rect x="2" y="-25" width="6" height="7" rx="2" fill="#bae6fd" opacity="0.85" />

          {/* Regulator */}
          <circle cx="5" cy="-14" r="3" fill="#0f172a" />
          <rect x="3" y="-12" width="4" height="6" rx="1.5" fill="#334155" />

          {/* Gelembung napas */}
          {[0, 1, 2, 3, 4].map((i) => (
            <circle
              key={i}
              cx={10 + i * 2}
              cy={-40 - i * 12}
              r={2 + i * 0.6}
              fill="#ffffff"
              opacity={0.65 - i * 0.1}
            />
          ))}
        </g>
      </g>

      {/* ===== INDIKATOR TEKANAN (kanan bawah) ===== */}
      <g transform="translate(568 312)">
        <rect x="-52" y="-20" width="104" height="46" rx="12" fill="#ffffff" opacity="0.22" />
        <text
          x="0"
          y="-2"
          fill="#ffffff"
          fontSize="11"
          fontWeight="700"
          textAnchor="middle"
          opacity="0.9"
        >
          Tekanan
        </text>
        <text
          x="0"
          y="18"
          fill="#fef08a"
          fontSize="17"
          fontWeight="900"
          textAnchor="middle"
        >
          {Math.round(intensity * 100)}%
        </text>
      </g>
    </svg>
  );
};

export const WaterTank: React.FC<{
  fluidColor?: string;
  fluidColorLight?: string;
  probeDepth?: number;
  maxDepth?: number;
  showArrows?: boolean;
  arrowIntensity?: number;
}> = ({
  fluidColor = '#38bdf8',
  fluidColorLight = '#bae6fd',
  probeDepth = 3,
  maxDepth = 6,
  showArrows = true,
  arrowIntensity = 0.6,
}) => {
  const tankTop = 40;
  const tankHeight = 260;
  const probeY = tankTop + (probeDepth / maxDepth) * tankHeight;

  return (
    <svg viewBox="0 0 260 340" className="w-full h-full" role="img" aria-label="Tangki air dengan probe tekanan">
      <defs>
        <linearGradient id="tank-fluid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fluidColorLight} />
          <stop offset="100%" stopColor={fluidColor} />
        </linearGradient>
      </defs>

      {/* Tank outline */}
      <rect x="20" y={tankTop} width="220" height={tankHeight} rx="12" fill="none" stroke="#0f172a" strokeWidth="3" opacity="0.5" />
      {/* Fluid */}
      <rect x="24" y={tankTop + 4} width="212" height={tankHeight - 8} rx="10" fill="url(#tank-fluid)" opacity="0.85" />
      {/* Surface */}
      <path d={`M24,${tankTop + 4} Q70,${tankTop - 4} 130,${tankTop + 4} T236,${tankTop + 4}`} fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.8" />

      {/* Depth ruler */}
      {[1, 2, 3, 4, 5].map((d) => {
        const y = tankTop + (d / maxDepth) * tankHeight;
        return (
          <g key={d}>
            <line x1="240" y1={y} x2="252" y2={y} stroke="#0f172a" strokeWidth="1.5" opacity="0.5" />
            <text x="246" y={y + 4} fill="#0f172a" fontSize="10" opacity="0.7">{d}m</text>
          </g>
        );
      })}

      {/* Probe */}
      <g transform={`translate(130 ${probeY})`}>
        {showArrows && (
          <g opacity={Math.min(1, 0.35 + arrowIntensity)}>
            {[
              { dx: 0, dy: -1 },
              { dx: 0, dy: 1 },
              { dx: -1, dy: 0 },
              { dx: 1, dy: 0 },
            ].map((a, i) => (
              <line
                key={i}
                x1={a.dx * 10} y1={a.dy * 10}
                x2={a.dx * (18 + arrowIntensity * 14)}
                y2={a.dy * (18 + arrowIntensity * 14)}
                stroke="#fbbf24"
                strokeWidth={2 + arrowIntensity * 1.5}
                strokeLinecap="round"
                markerEnd="url(#arrowhead)"
              />
            ))}
          </g>
        )}
        <circle r="9" fill="#0f172a" />
        <circle r="4" fill="#fbbf24" />
        <circle r="14" fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.6" className="pulse-ring" />
      </g>

      <defs>
        <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <polygon points="0 0, 6 3, 0 6" fill="#fbbf24" />
        </marker>
      </defs>
    </svg>
  );
};

export const DamIllustration: React.FC = () => (
  <svg viewBox="0 0 400 240" className="w-full h-full" role="img" aria-label="Ilustrasi bendungan">
    <defs>
      <linearGradient id="dam-water" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#bae6fd" />
        <stop offset="100%" stopColor="#0c4a6e" />
      </linearGradient>
      <linearGradient id="dam-wall" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="240" fill="#f0f9ff" />
    {/* Water */}
    <rect x="0" y="40" width="240" height="200" fill="url(#dam-water)" />
    {/* Ground */}
    <rect x="0" y="220" width="400" height="20" fill="#a16207" opacity="0.4" />
    {/* Trapezoid dam wall - thicker at bottom */}
    <polygon points="240,30 280,30 320,220 220,220" fill="url(#dam-wall)" />
    {/* Wall thickness labels */}
    <line x1="245" y1="45" x2="275" y2="45" stroke="#fff" strokeWidth="1.5" />
    <text x="252" y="42" fontSize="9" fill="#fff">tipis</text>
    <line x1="228" y1="205" x2="312" y2="205" stroke="#fff" strokeWidth="1.5" />
    <text x="255" y="200" fontSize="9" fill="#fff">tebal</text>
    {/* Water pressure arrows */}
    {[80, 120, 160, 200].map((y, i) => (
      <g key={i} stroke="#fbbf24" strokeWidth={1.5 + i * 0.5} strokeLinecap="round">
        <line x1={230 - i * 4} y1={y} x2={245} y2={y} />
      </g>
    ))}
    <text x="120" y="30" fontSize="11" fontWeight="600" fill="#0369a1">Permukaan air</text>
  </svg>
);

export const WaterTowerIllustration: React.FC<{ level?: number }> = ({ level = 0.7 }) => {
  const W = 400;
  const H = 340;

  // ===== TANK =====
  const tankX = 120;
  const tankY = 35;
  const tankW = 160;
  const tankH = 80;
  const tankBottom = tankY + tankH; // 115

  // Water level: 15% minimum agar tetap terlihat, sampai 90% saat level=1
  const waterH = tankH * (0.15 + 0.75 * Math.min(1, Math.max(0, level)));
  const waterY = tankBottom - waterH;

  // ===== GROUND & LEGS =====
  const groundY = 300;
  const legBottomY = 290;

  // ===== PIPE & HOUSE =====
  const pipeX = tankX + tankW / 2;      // 200
  const pipeBendY = 255;
  const houseX = 285;
  const houseY = 240;
  const houseW = 95;
  const houseH = 60;
  const pipeEndX = houseX;               // pipe berakhir di dinding kiri rumah

  // ===== PRESSURE POINT =====
  const pressureX = pipeEndX - 12;
  const pressureY = pipeBendY;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-full block"
      role="img"
      aria-label="Ilustrasi menara air yang mengalirkan air ke rumah"
    >
      <defs>
        <linearGradient id="wt-tank-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0f9ff" />
          <stop offset="100%" stopColor="#e0f2fe" />
        </linearGradient>
        <linearGradient id="wt-water-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
      </defs>

      {/* ===== BACKGROUND ===== */}
      <rect width={W} height={H} fill="#f0f9ff" />

      {/* ===== GROUND ===== */}
      <rect x="0" y={groundY} width={W} height={H - groundY} fill="#e2e8f0" />
      <line x1="0" y1={groundY} x2={W} y2={groundY} stroke="#94a3b8" strokeWidth="1.5" />

      {/* ===== BACK LEG ===== */}
      <line
        x1={tankX + tankW - 40}
        y1={tankBottom}
        x2={tankX + tankW - 55}
        y2={legBottomY}
        stroke="#94a3b8"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* ===== PIPE (di belakang tank) ===== */}
      <path
        d={`M ${pipeX},${tankBottom} L ${pipeX},${pipeBendY} L ${pipeEndX},${pipeBendY}`}
        fill="none"
        stroke="#0284c7"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Highlight pada pipa */}
      <path
        d={`M ${pipeX - 1.5},${tankBottom + 4} L ${pipeX - 1.5},${pipeBendY - 2}`}
        fill="none"
        stroke="#7dd3fc"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* ===== TANK BODY ===== */}
      <rect
        x={tankX}
        y={tankY}
        width={tankW}
        height={tankH}
        rx="10"
        fill="url(#wt-tank-grad)"
        stroke="#0284c7"
        strokeWidth="2.5"
      />

      {/* ===== WATER INSIDE TANK ===== */}
      <rect
        x={tankX + 3}
        y={waterY}
        width={tankW - 6}
        height={tankBottom - waterY - 3}
        rx="7"
        fill="url(#wt-water-grad)"
      />
      {/* Water surface highlight */}
      <path
        d={`M ${tankX + 10},${waterY + 5} Q ${tankX + 50},${waterY - 2} ${tankX + tankW / 2},${waterY + 5} T ${tankX + tankW - 10},${waterY + 5}`}
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        opacity="0.75"
      />

      {/* ===== FRONT LEGS (A-frame) ===== */}
      <line
        x1={tankX + 15}
        y1={tankBottom}
        x2={tankX - 15}
        y2={legBottomY}
        stroke="#475569"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <line
        x1={tankX + tankW - 15}
        y1={tankBottom}
        x2={tankX + tankW + 15}
        y2={legBottomY}
        stroke="#475569"
        strokeWidth="8"
        strokeLinecap="round"
      />
      {/* Cross brace */}
      <line
        x1={tankX - 5}
        y1={(tankBottom + legBottomY) / 2}
        x2={tankX + tankW + 5}
        y2={(tankBottom + legBottomY) / 2}
        stroke="#475569"
        strokeWidth="3"
        opacity="0.55"
      />

      {/* ===== HOUSE ===== */}
      {/* Atap */}
      <polygon
        points={`${houseX - 8},${houseY} ${houseX + houseW / 2},${houseY - 24} ${houseX + houseW + 8},${houseY}`}
        fill="#dc2626"
        stroke="#991b1b"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Badan rumah */}
      <rect
        x={houseX}
        y={houseY}
        width={houseW}
        height={houseH}
        fill="#fef3c7"
        stroke="#92400e"
        strokeWidth="1.5"
      />
      {/* Pintu */}
      <rect
        x={houseX + houseW / 2 - 9}
        y={houseY + houseH - 22}
        width="18"
        height="22"
        rx="1.5"
        fill="#78350f"
      />
      {/* Jendela kiri */}
      <rect
        x={houseX + 14}
        y={houseY + 15}
        width="16"
        height="16"
        fill="#bae6fd"
        stroke="#0369a1"
        strokeWidth="1.5"
      />
      <line x1={houseX + 22} y1={houseY + 15} x2={houseX + 22} y2={houseY + 31} stroke="#0369a1" strokeWidth="1" />
      <line x1={houseX + 14} y1={houseY + 23} x2={houseX + 30} y2={houseY + 23} stroke="#0369a1" strokeWidth="1" />
      {/* Jendela kanan */}
      <rect
        x={houseX + houseW - 30}
        y={houseY + 15}
        width="16"
        height="16"
        fill="#bae6fd"
        stroke="#0369a1"
        strokeWidth="1.5"
      />
      <line x1={houseX + houseW - 22} y1={houseY + 15} x2={houseX + houseW - 22} y2={houseY + 31} stroke="#0369a1" strokeWidth="1" />
      <line x1={houseX + houseW - 30} y1={houseY + 23} x2={houseX + houseW - 14} y2={houseY + 23} stroke="#0369a1" strokeWidth="1" />

      {/* ===== PRESSURE INDICATOR (di ujung pipa) ===== */}
      <circle cx={pressureX} cy={pressureY} r="13" fill="#06b6d4" stroke="#ffffff" strokeWidth="2.5" />
      <text
        x={pressureX}
        y={pressureY + 5}
        textAnchor="middle"
        fontSize="13"
        fill="#ffffff"
        fontWeight="900"
      >
        P
      </text>

      {/* ===== HEIGHT INDICATOR (h) ===== */}
      <g>
        {/* Garis vertikal dashed dari permukaan air ke titik ukur */}
        <line
          x1="50"
          y1={waterY}
          x2="50"
          y2={pressureY}
          stroke="#0f172a"
          strokeWidth="1.5"
          strokeDasharray="5 4"
          opacity="0.55"
        />
        {/* Panah atas */}
        <polygon points={`50,${waterY} 46,${waterY + 8} 54,${waterY + 8}`} fill="#0f172a" />
        {/* Panah bawah */}
        <polygon points={`50,${pressureY} 46,${pressureY - 8} 54,${pressureY - 8}`} fill="#0f172a" />
        {/* Label pill h */}
        <rect
          x="28"
          y={(waterY + pressureY) / 2 - 11}
          width="44"
          height="22"
          rx="11"
          fill="#0f172a"
        />
        <text
          x="50"
          y={(waterY + pressureY) / 2 + 5}
          textAnchor="middle"
          fontSize="13"
          fill="#ffffff"
          fontWeight="900"
          fontStyle="italic"
        >
          h
        </text>
      </g>

      {/* ===== HELPER LINE dari permukaan air ke indikator ===== */}
      <line
        x1="50"
        y1={waterY}
        x2={tankX}
        y2={waterY}
        stroke="#0284c7"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        opacity="0.45"
      />

      {/* ===== LABEL AIR DI TANK ===== */}
      <g transform={`translate(${tankX + tankW - 8} ${tankY + 14})`}>
        <rect x="-52" y="-10" width="52" height="16" rx="8" fill="#0284c7" opacity="0.9" />
        <text
          x="-26"
          y="1"
          textAnchor="middle"
          fontSize="9"
          fill="#ffffff"
          fontWeight="800"
          letterSpacing="0.3"
        >
          AIR {Math.round(level * 100)}%
        </text>
      </g>
    </svg>
  );
};

export const UShapeTube: React.FC = () => (
  <svg viewBox="0 0 300 220" className="w-full h-full" role="img" aria-label="Pipa U berisi air">
    <defs>
      <linearGradient id="utube" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#bae6fd" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
    </defs>
    <rect width="300" height="220" fill="#f0f9ff" />
    {/* U shape */}
    <path d="M60,30 L60,150 Q60,190 100,190 L200,190 Q240,190 240,150 L240,30" fill="none" stroke="#0f172a" strokeWidth="6" opacity="0.4" />
    <path d="M63,50 L63,150 Q63,187 100,187 L200,187 Q237,187 237,150 L237,50" fill="url(#utube)" opacity="0.85" />
    {/* Points */}
    <circle cx="63" cy="120" r="7" fill="#fbbf24" stroke="#0f172a" strokeWidth="2" />
    <text x="40" y="118" fontSize="11" fontWeight="700" fill="#0f172a">A</text>
    <circle cx="237" cy="120" r="7" fill="#fbbf24" stroke="#0f172a" strokeWidth="2" />
    <text x="250" y="118" fontSize="11" fontWeight="700" fill="#0f172a">B</text>
    <line x1="63" y1="120" x2="237" y2="120" stroke="#0f172a" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
    <text x="150" y="112" fontSize="10" textAnchor="middle" fill="#0f172a" opacity="0.8">kedalaman sama</text>
  </svg>
);

export const CommunicatingVessels: React.FC<{
  fillFraction?: number;
  probeDepth?: number;
}> = ({ fillFraction = 0.7, probeDepth = 0.4 }) => {
  const W = 400, H = 280;
  const vTop = 50;        // mulut bejana
  const vBottom = 205;    // dasar bejana (mulut saluran)
  const chBottom = 250;   // dasar saluran

  const waterY = vTop + (1 - fillFraction) * (vBottom - vTop);
  const probeY = waterY + probeDepth * (vBottom - waterY);

  // ===== DINDING BEJANA =====
  // Setiap bejana punya dinding KIRI dan KANAN yang TERBUKA di bawah
  // (tidak ada garis horizontal penutup, sehingga air mengalir bebas)
  const vesselWalls: string[] = [
    // V1 — tabung lurus
    `M 60,${vTop} L 60,${vBottom}`,
    `M 84,${vTop} L 84,${vBottom}`,
    // V2 — tabung berkelok (S-curve)
    `M 122,${vTop} C 134,100 116,150 130,${vBottom}`,
    `M 152,${vBottom} C 138,150 156,100 144,${vTop}`,
    // V3 — gelas lebar (wide wine glass)
    `M 168,${vTop} L 188,160 L 188,${vBottom}`,
    `M 232,${vTop} L 212,160 L 212,${vBottom}`,
    // V4 — jam pasir / botol
    `M 264,${vTop} L 264,100 L 244,100 L 244,${vBottom}`,
    `M 302,${vTop} L 302,100 L 282,100 L 282,${vBottom}`,
    // V5 — tabung lurus
    `M 320,${vTop} L 320,${vBottom}`,
    `M 344,${vTop} L 344,${vBottom}`,
  ];

  // ===== SALURAN HORIZONTAL (U-shape tanpa tutup atas) =====
  // Inilah kunci: tidak ada garis horizontal di bagian atas saluran,
  // sehingga air dari kelima bejana menyatu di sini.
  const channelWall = `M 60,${vBottom} L 60,${chBottom} L 344,${chBottom} L 344,${vBottom}`;

  // ===== REGION AIR UNTUK CLIPPING =====
  // Extend sedikit ke dalam saluran untuk menghindari seam subpixel
  const ext = 4;
  const vesselInteriors: string[] = [
    // V1 interior
    `M 62,${vTop} L 62,${vBottom + ext} L 82,${vBottom + ext} L 82,${vTop} Z`,
    // V2 interior
    `M 124,${vTop} C 136,100 118,150 132,${vBottom + ext} L 150,${vBottom + ext} C 136,150 154,100 142,${vTop} Z`,
    // V3 interior
    `M 170,${vTop} L 188,160 L 188,${vBottom + ext} L 212,${vBottom + ext} L 212,160 L 230,${vTop} Z`,
    // V4 interior
    `M 264,${vTop} L 264,100 L 246,100 L 246,${vBottom + ext} L 280,${vBottom + ext} L 280,100 L 262,100 L 262,${vTop} Z`,
    // V5 interior
    `M 322,${vTop} L 322,${vBottom + ext} L 342,${vBottom + ext} L 342,${vTop} Z`,
  ];
  // Saluran: menyatukan semua bejana
  const channelInterior = `M 62,${vBottom} L 62,${chBottom - 3} L 342,${chBottom - 3} L 342,${vBottom} Z`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-full block"
      role="img"
      aria-label="Ilustrasi bejana berhubungan: lima wadah dengan bentuk berbeda, terhubung oleh saluran di bagian bawah"
    >
      <defs>
        <linearGradient id="cv-water-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <clipPath id="cv-water-clip">
          {vesselInteriors.map((d, i) => (
            <path key={`v${i}`} d={d} />
          ))}
          <path d={channelInterior} />
        </clipPath>
      </defs>

      {/* Background */}
      <rect width={W} height={H} fill="#f0f9ff" />

      {/* ===== AIR (satu tubuh kontinu) ===== */}
      <rect
        x="0"
        y={waterY}
        width={W}
        height={H - waterY}
        fill="url(#cv-water-grad)"
        clipPath="url(#cv-water-clip)"
      />

      {/* ===== GARIS PERMUKAAN ===== */}
      <line
        x1="30"
        y1={waterY}
        x2="370"
        y2={waterY}
        stroke="#0284c7"
        strokeWidth="1.5"
        strokeDasharray="6 4"
        opacity="0.75"
      />

      {/* Label PERMUKAAN (pill di dalam kanvas) */}
      <g transform={`translate(${W - 78} ${waterY - 20})`}>
        <rect width="72" height="14" rx="7" fill="#0284c7" />
        <text
          x="36"
          y="10"
          textAnchor="middle"
          fontSize="8.5"
          fill="#fff"
          fontWeight="700"
          letterSpacing="0.5"
        >
          PERMUKAAN
        </text>
      </g>

      {/* ===== DINDING (digambar setelah air, agar di atas) ===== */}
      <g
        fill="none"
        stroke="#334155"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {vesselWalls.map((d, i) => (
          <path key={i} d={d} />
        ))}
        {/* Saluran bawah: hanya kiri, bawah, kanan — TIDAK ada tutup atas */}
        <path d={channelWall} />
      </g>

      {/* ===== LABEL BENTUK WADAH ===== */}
      <g fontSize="9" fill="#64748b" fontWeight="700" textAnchor="middle">
        <text x="72" y="42">lurus</text>
        <text x="138" y="42">berkelok</text>
        <text x="200" y="42">lebar</text>
        <text x="283" y="42">botol</text>
        <text x="332" y="42">lurus</text>
      </g>

      {/* ===== PROBE A & B ===== */}
      <g>
        <line
          x1="72"
          y1={probeY}
          x2="332"
          y2={probeY}
          stroke="#0f172a"
          strokeWidth="1.5"
          strokeDasharray="5 4"
          opacity="0.5"
        />
        <text
          x="202"
          y={probeY - 8}
          textAnchor="middle"
          fontSize="10"
          fill="#0f172a"
          opacity="0.75"
          fontWeight="700"
        >
          kedalaman sama
        </text>

        {/* Probe A */}
        <circle cx="72" cy={probeY} r="8" fill="#fbbf24" stroke="#0f172a" strokeWidth="2.5" />
        <circle cx="72" cy={probeY} r="3" fill="#0f172a" />
        <rect x="30" y={probeY - 11} width="26" height="22" rx="11" fill="#0f172a" />
        <text x="43" y={probeY + 4} textAnchor="middle" fontSize="12" fontWeight="900" fill="#fbbf24">
          A
        </text>

        {/* Probe B */}
        <circle cx="332" cy={probeY} r="8" fill="#fbbf24" stroke="#0f172a" strokeWidth="2.5" />
        <circle cx="332" cy={probeY} r="3" fill="#0f172a" />
        <rect x="344" y={probeY - 11} width="26" height="22" rx="11" fill="#0f172a" />
        <text x="357" y={probeY + 4} textAnchor="middle" fontSize="12" fontWeight="900" fill="#fbbf24">
          B
        </text>
      </g>
    </svg>
  );
};

export const UTubeSimulator: React.FC<{
  oilDensity: number;
  waterDensity?: number;
  oilHeightCm: number;
  showMeasurements?: boolean;
  oilLabel?: string;
}> = ({
  oilDensity,
  waterDensity = 1000,
  oilHeightCm,
  showMeasurements = true,
  oilLabel = 'minyak',
}) => {
  const pxPerCm = 20;
  const h1 = oilHeightCm;
  const h2 = (oilDensity / waterDensity) * oilHeightCm;
  const h1_px = h1 * pxPerCm;
  const h2_px = h2 * pxPerCm;

  const leftX = 140;
  const rightX = 340;
  const tubeW = 40;
  const tubeTop = 70;
  const tubeBottom = 340;
  const channelTop = 300;

  const yInterface = channelTop - 15;
  const yWaterSurface = yInterface - h2_px;
  const yOilSurface = yInterface - h1_px;

  const interiorPath = `M ${leftX} ${tubeTop} L ${leftX} ${tubeBottom} L ${rightX + tubeW} ${tubeBottom} L ${rightX + tubeW} ${tubeTop} L ${rightX} ${tubeTop} L ${rightX} ${channelTop} L ${leftX + tubeW} ${channelTop} L ${leftX + tubeW} ${tubeTop} Z`;

  return (
    <svg
      viewBox="0 0 520 400"
      className="w-full h-full block"
      role="img"
      aria-label={`Pipa U berisi air dan ${oilLabel}. Tinggi kolom minyak ${h1.toFixed(1)} cm, tinggi kolom air ${h2.toFixed(1)} cm`}
    >
      <defs>
        <linearGradient id="utube-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="utube-oil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <clipPath id="utube-interior">
          <path d={interiorPath} />
        </clipPath>
      </defs>

      <rect width="520" height="400" fill="#f0f9ff" />

      <g clipPath="url(#utube-interior)">
        <rect x="0" y={yWaterSurface} width="520" height={400 - yWaterSurface} fill="url(#utube-water)" />
      </g>

      <g clipPath="url(#utube-interior)">
        <rect x={rightX} y={yOilSurface} width={tubeW} height={yInterface - yOilSurface} fill="url(#utube-oil)" />
      </g>

      <path d={interiorPath} fill="none" stroke="#1e293b" strokeWidth="4" strokeLinejoin="round" />

      <line x1="30" y1={yWaterSurface} x2="490" y2={yWaterSurface} stroke="#0284c7" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.75" />
      <line x1="30" y1={yInterface} x2="490" y2={yInterface} stroke="#1e293b" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.55" />
      <line x1="30" y1={yOilSurface} x2="490" y2={yOilSurface} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.75" />

      <text x={leftX + tubeW / 2} y={tubeBottom - 20} textAnchor="middle" fontSize="14" fontWeight="700" fill="#0c4a6e">air</text>
      <text x={rightX + tubeW / 2} y={(yOilSurface + yInterface) / 2 + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill="#78350f">{oilLabel}</text>

      {showMeasurements && (
        <g>
          <line x1="440" y1={yOilSurface} x2="440" y2={yInterface} stroke="#0f172a" strokeWidth="1.5" />
          <line x1="435" y1={yOilSurface} x2="445" y2={yOilSurface} stroke="#0f172a" strokeWidth="1.5" />
          <line x1="435" y1={yInterface} x2="445" y2={yInterface} stroke="#0f172a" strokeWidth="1.5" />
          <text x="455" y={(yOilSurface + yInterface) / 2 + 5} fontSize="15" fontWeight="700" fontStyle="italic" fill="#0f172a">h₁</text>
        </g>
      )}

      {showMeasurements && (
        <g>
          <line x1="80" y1={yWaterSurface} x2="80" y2={yInterface} stroke="#0f172a" strokeWidth="1.5" />
          <line x1="75" y1={yWaterSurface} x2="85" y2={yWaterSurface} stroke="#0f172a" strokeWidth="1.5" />
          <line x1="75" y1={yInterface} x2="85" y2={yInterface} stroke="#0f172a" strokeWidth="1.5" />
          <text x="60" y={(yWaterSurface + yInterface) / 2 + 5} fontSize="15" fontWeight="700" fontStyle="italic" textAnchor="end" fill="#0f172a">h₂</text>
        </g>
      )}
    </svg>
  );
};