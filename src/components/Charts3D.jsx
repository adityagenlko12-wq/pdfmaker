import React, { useState } from 'react';

/**
 * 3D Isometric Bar Chart
 * Features:
 * - 3D extruded cuboid geometry (front, top, side faces)
 * - Exact value hover tooltips with smooth positioning
 * - Multi-series support or single series
 * - Smooth CSS transitions and responsive container
 */
export function BarChart3D({
  data = [],
  height = 240,
  color = '#3B82F6',
  secondaryColor = '#10B981',
  valuePrefix = '',
  valueSuffix = '',
  dataKey = 'value',
  labelKey = 'label'
}) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        No chart data available
      </div>
    );
  }

  const getItemValue = (item) => {
    if (!item) return 0;
    const v = item[dataKey] !== undefined ? item[dataKey] : item.value !== undefined ? item.value : item.count;
    const num = Number(v);
    return isNaN(num) ? 0 : num;
  };

  const getItemLabel = (item) => {
    if (!item) return '';
    return item[labelKey] || item.label || item.name || item.toolId || '';
  };

  const maxValue = Math.max(...data.map(d => getItemValue(d)), 1);

  return (
    <div className="w-full select-none" style={{ minHeight: height + 60 }}>
      {/* 3D Stage Container */}
      <div
        className="relative w-full flex items-end justify-between px-4 pt-12 pb-6 perspective-1000"
        style={{ height }}
      >
        {/* Depth Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
          <div className="border-b border-gray-400 border-dashed w-full" />
          <div className="border-b border-gray-400 border-dashed w-full" />
          <div className="border-b border-gray-400 border-dashed w-full" />
          <div className="border-b border-gray-400 w-full" />
        </div>

        {/* 3D Base Floor Shadow */}
        <div className="absolute bottom-6 left-2 right-2 h-4 bg-gradient-to-b from-gray-300/30 to-transparent transform -skew-x-12 rounded pointer-events-none" />

        {/* Cuboid Bars */}
        {data.map((item, idx) => {
          const val = getItemValue(item);
          const label = getItemLabel(item);
          const heightPercent = Math.max(8, Math.round((val / maxValue) * 85));
          const isHovered = hoveredIdx === idx;
          const barColor = item.color || color;

          return (
            <div
              key={idx}
              className="relative flex-1 mx-1.5 flex flex-col items-center justify-end h-full group cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Interactive 3D Tooltip */}
              {isHovered && (
                <div className="absolute -top-12 z-30 px-2.5 py-1 text-xs font-semibold text-white bg-gray-900/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-700 whitespace-nowrap transform -translate-y-1 transition-all pointer-events-none animate-in fade-in">
                  <div className="text-[10px] text-gray-400 font-normal">{label}</div>
                  <div>
                    {valuePrefix}{(val ?? 0).toLocaleString()}{valueSuffix}
                    {item.secondaryValue !== undefined && (
                      <span className="ml-1.5 text-emerald-400">
                        ({item.secondaryLabel || ''}{item.secondaryValue})
                      </span>
                    )}
                  </div>
                  {/* Tooltip caret */}
                  <div className="absolute left-1/2 -bottom-1 w-2 h-2 bg-gray-900 transform -translate-x-1/2 rotate-45" />
                </div>
              )}

              {/* Cuboid 3D Bar Structure */}
              <div
                className="relative w-full max-w-[42px] transition-all duration-500 ease-out"
                style={{
                  height: `${heightPercent}%`,
                  transformStyle: 'preserve-3d',
                  transform: isHovered ? 'translateY(-6px) translateZ(10px) scale(1.04)' : 'none'
                }}
              >
                {/* FRONT FACE */}
                <div
                  className="absolute inset-0 rounded-t-sm shadow-md transition-colors"
                  style={{
                    backgroundColor: barColor,
                    backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 80%)'
                  }}
                />
                {/* TOP FACE (Tilted Isometric Roof) */}
                <div
                  className="absolute -top-2 left-1.5 right-[-6px] h-2 rounded-tl-sm transition-all"
                  style={{
                    backgroundColor: barColor,
                    filter: 'brightness(1.35)',
                    transform: 'skewX(-45deg)'
                  }}
                />
                {/* RIGHT FACE (Shaded Depth Wall) */}
                <div
                  className="absolute -top-1 right-[-6px] bottom-0 w-1.5 rounded-tr-sm transition-all"
                  style={{
                    backgroundColor: barColor,
                    filter: 'brightness(0.72)',
                    transform: 'skewY(-45deg)'
                  }}
                />
              </div>

              {/* Bottom Label */}
              <div className="mt-3 text-xs font-medium text-gray-500 group-hover:text-gray-900 transition-colors truncate max-w-[50px] text-center">
                {label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Axis Footer / Legend */}
      <div className="flex items-center justify-between px-4 text-xs text-gray-400 border-t border-gray-100 pt-2">
        <span>Min: {valuePrefix}0</span>
        <span className="font-semibold text-gray-600">Peak: {valuePrefix}{(maxValue ?? 0).toLocaleString()}{valueSuffix}</span>
      </div>
    </div>
  );
}

/**
 * 3D Donut / Pie Chart
 * Features:
 * - 3D cylindrical tiered ring
 * - Wedge extrusion on hover
 * - Center summary counter
 * - Interactive legend with percentage and exact values
 */
export function DonutChart3D({ data = [], title = '', totalLabel = 'Total', size = 200 }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const total = data.reduce((sum, d) => sum + (Number(d.value) || 0), 0);

  // Calculate angles for conic-gradient
  let currentAngle = 0;
  const slices = data.map((d, idx) => {
    const val = Number(d.value) || 0;
    const percent = total > 0 ? (val / total) * 100 : 0;
    const startDeg = currentAngle;
    const sliceDeg = (percent / 100) * 360;
    currentAngle += sliceDeg;
    return {
      ...d,
      percent: Math.round(percent),
      startDeg,
      endDeg: currentAngle
    };
  });

  const gradientString = slices.length > 0
    ? slices.map(s => `${s.color || '#3B82F6'} ${s.startDeg}deg ${s.endDeg}deg`).join(', ')
    : '#3B82F6 0deg 360deg';

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-4">
      {/* 3D Donut Cylinder */}
      <div
        className="relative flex items-center justify-center select-none"
        style={{
          width: size,
          height: size,
          perspective: 800
        }}
      >
        {/* 3D Depth Shadow Ring */}
        <div
          className="absolute inset-2 rounded-full blur-md opacity-25"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 100%)',
            transform: 'translateY(12px) rotateX(40deg)'
          }}
        />

        {/* 3D Bottom Layer Cylinder Edge */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(${gradientString})`,
            transform: 'rotateX(36deg) translateY(8px)',
            filter: 'brightness(0.65)'
          }}
        />

        {/* 3D Top Donut Surface */}
        <div
          className="relative w-full h-full rounded-full transition-transform duration-300 shadow-xl"
          style={{
            background: `conic-gradient(${gradientString})`,
            transform: hoveredIdx !== null ? 'rotateX(34deg) translateY(-4px) scale(1.03)' : 'rotateX(36deg)',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Inner Donut Hole */}
          <div className="absolute inset-7 rounded-full bg-white shadow-inner flex flex-col items-center justify-center p-2 text-center">
            {hoveredIdx !== null && slices[hoveredIdx] ? (
              <div className="animate-in fade-in">
                <div className="text-[11px] font-medium text-gray-400 truncate max-w-[80px]">
                  {slices[hoveredIdx].name}
                </div>
                <div className="text-base font-bold text-gray-900">
                  {(Number(slices[hoveredIdx].value) || 0).toLocaleString()}
                </div>
                <div className="text-[10px] font-semibold text-blue-600">
                  {slices[hoveredIdx].percent}%
                </div>
              </div>
            ) : (
              <div>
                <div className="text-[10px] text-gray-400 font-medium">{totalLabel}</div>
                <div className="text-lg font-bold text-gray-900">{(total || 0).toLocaleString()}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend & Breakdown */}
      <div className="flex flex-col gap-2 min-w-[140px]">
        {slices.map((slice, idx) => {
          const isHovered = hoveredIdx === idx;
          return (
            <div
              key={idx}
              className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg cursor-pointer transition-all ${
                isHovered ? 'bg-gray-100 font-semibold shadow-sm translate-x-1' : 'hover:bg-gray-50'
              }`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ backgroundColor: slice.color || '#3B82F6' }}
                />
                <span className="text-gray-700 truncate max-w-[90px]">{slice.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-medium">{slice.value}</span>
                <span className="text-[10px] text-gray-400 font-normal">({slice.percent}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 3D Area / Line Chart
 * Volumetric gradient elevation with interactive data points
 */
export function AreaChart3D({
  data = [],
  height = 180,
  color = '#3B82F6',
  labelKey = 'label',
  valueKey = 'value',
  dataKey
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!data || data.length === 0) return null;

  const resolvedValueKey = dataKey || valueKey;

  const getItemValue = (d) => {
    if (!d) return 0;
    const v = d[resolvedValueKey] !== undefined ? d[resolvedValueKey] : d.value !== undefined ? d.value : d.count;
    const num = Number(v);
    return isNaN(num) ? 0 : num;
  };

  const getItemLabel = (d) => {
    if (!d) return '';
    return d[labelKey] || d.date || d.label || d.day || d.name || '';
  };

  const values = data.map(d => getItemValue(d));
  const maxValue = Math.max(...values, 1);
  const width = 500;
  const padding = 20;

  // Compute SVG Points
  const points = data.map((d, idx) => {
    const val = getItemValue(d);
    const x = padding + (idx / Math.max(data.length - 1, 1)) * (width - padding * 2);
    const y = height - padding - ((val / maxValue) * (height - padding * 2));
    return { x, y, data: d, value: val };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="relative w-full select-none" style={{ height }}>
      {/* 3D Depth Floor Background */}
      <div className="absolute inset-x-4 bottom-5 h-8 bg-blue-50/50 transform -skew-x-6 rounded pointer-events-none" />

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id={`area3d-grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.45" />
            <stop offset="70%" stopColor={color} stopOpacity="0.08" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <filter id="shadow3d" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor={color} floodOpacity="0.3" />
          </filter>
        </defs>

        {/* 3D Floor Grid Lines */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#E5E7EB" strokeWidth="1.5" />
        <line x1={padding} y1={(height - padding) / 2} x2={width - padding} y2={(height - padding) / 2} stroke="#F3F4F6" strokeWidth="1" strokeDasharray="3,3" />

        {/* Filled Area */}
        <path d={areaD} fill={`url(#area3d-grad-${color.replace('#', '')})`} />

        {/* 3D Ribbon Line with drop shadow */}
        <path d={pathD} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#shadow3d)" />

        {/* Interactive Glowing Nodes */}
        {points.map((p, idx) => {
          const isHovered = hoveredPoint?.idx === idx;
          return (
            <g key={idx}>
              {/* Hit area */}
              <circle
                cx={p.x}
                cy={p.y}
                r="12"
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint({ ...p, idx })}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              {/* Visible circle */}
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? '6' : '3.5'}
                fill="#FFFFFF"
                stroke={color}
                strokeWidth={isHovered ? '3' : '2'}
                className="transition-all duration-200 pointer-events-none"
              />
            </g>
          );
        })}
      </svg>

      {/* Hover Floating Tooltip */}
      {hoveredPoint && (
        <div
          className="absolute z-30 px-2.5 py-1 text-xs font-semibold text-white bg-gray-900/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-700 whitespace-nowrap pointer-events-none transform -translate-x-1/2 -translate-y-8"
          style={{
            left: `${(hoveredPoint.x / width) * 100}%`,
            top: hoveredPoint.y
          }}
        >
          <div className="text-[10px] text-gray-400 font-normal">{getItemLabel(hoveredPoint.data)}</div>
          <div>{(Number(hoveredPoint.value) || 0).toLocaleString()}</div>
        </div>
      )}
    </div>
  );
}

/**
 * 3D Interactive Statistics Card
 * Dynamic depth hover effect with tilt, glowing accent, and exact metric display
 */
export function StatCard3D({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  trend,
  trendPositive = true,
  trendUp,
  onClick
}) {
  const colorMap = {
    blue: {
      bg: 'from-blue-500/10 to-transparent',
      text: 'text-blue-600',
      border: 'border-blue-200 hover:border-blue-400',
      glow: 'shadow-blue-500/10',
      badge: 'bg-blue-50 text-blue-700'
    },
    emerald: {
      bg: 'from-emerald-500/10 to-transparent',
      text: 'text-emerald-600',
      border: 'border-emerald-200 hover:border-emerald-400',
      glow: 'shadow-emerald-500/10',
      badge: 'bg-emerald-50 text-emerald-700'
    },
    purple: {
      bg: 'from-purple-500/10 to-transparent',
      text: 'text-purple-600',
      border: 'border-purple-200 hover:border-purple-400',
      glow: 'shadow-purple-500/10',
      badge: 'bg-purple-50 text-purple-700'
    },
    indigo: {
      bg: 'from-indigo-500/10 to-transparent',
      text: 'text-indigo-600',
      border: 'border-indigo-200 hover:border-indigo-400',
      glow: 'shadow-indigo-500/10',
      badge: 'bg-indigo-50 text-indigo-700'
    },
    cyan: {
      bg: 'from-cyan-500/10 to-transparent',
      text: 'text-cyan-600',
      border: 'border-cyan-200 hover:border-cyan-400',
      glow: 'shadow-cyan-500/10',
      badge: 'bg-cyan-50 text-cyan-700'
    },
    amber: {
      bg: 'from-amber-500/10 to-transparent',
      text: 'text-amber-600',
      border: 'border-amber-200 hover:border-amber-400',
      glow: 'shadow-amber-500/10',
      badge: 'bg-amber-50 text-amber-700'
    },
    rose: {
      bg: 'from-rose-500/10 to-transparent',
      text: 'text-rose-600',
      border: 'border-rose-200 hover:border-rose-400',
      glow: 'shadow-rose-500/10',
      badge: 'bg-rose-50 text-rose-700'
    }
  };

  const scheme = colorMap[color] || colorMap.blue;
  const trendLabel = typeof trend === 'object' && trend !== null ? trend.label : trend;
  const isPositive = typeof trend === 'object' && trend !== null && 'positive' in trend
    ? Boolean(trend.positive)
    : trendUp !== undefined
    ? Boolean(trendUp)
    : Boolean(trendPositive);

  return (
    <div
      onClick={onClick}
      className={`card-3d relative p-5 bg-white rounded-2xl border ${scheme.border} shadow-lg ${scheme.glow} overflow-hidden group cursor-pointer`}
    >
      {/* 3D Top Corner Gradient Sheen */}
      <div className={`absolute -right-8 -top-8 w-28 h-28 bg-gradient-to-br ${scheme.bg} rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500`} />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          <h4 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 tracking-tight">
            {value}
          </h4>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${scheme.badge} shadow-sm group-hover:scale-110 transition-transform`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-gray-500 relative z-10">
        <span>{subtitle}</span>
        {trendLabel && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
            isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
          }`}>
            {trendLabel}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * 3D Cylindrical Progress / Usage Gauge
 */
export function Progress3D({
  label,
  value,
  max,
  percentage,
  unit = '',
  color = '#3B82F6'
}) {
  const computedPercent = percentage !== undefined
    ? Number(percentage || 0)
    : (max && Number(max) > 0 ? Math.min(100, Math.round(((Number(value) || 0) / Number(max)) * 100)) : 0);
  const safePercent = Math.max(0, Math.min(100, isNaN(computedPercent) ? 0 : computedPercent));

  // Support Tailwind gradient classes if passed in color (e.g., 'from-blue-500 to-indigo-600')
  const isTailwindGradient = typeof color === 'string' && color.includes('from-');

  return (
    <div className="w-full">
      {(label || value !== undefined || max !== undefined) && (
        <div className="flex items-center justify-between text-xs mb-1.5">
          {label && <span className="font-medium text-gray-700">{label}</span>}
          <span className="font-semibold text-gray-900 ml-auto">
            {value !== undefined && max !== undefined
              ? `${(Number(value) || 0).toLocaleString()}${unit} / ${(Number(max) || 0).toLocaleString()}${unit} (${safePercent}%)`
              : `${safePercent}%`}
          </span>
        </div>
      )}

      {/* 3D Bar Track */}
      <div className="relative h-3.5 w-full bg-gray-100 rounded-full p-0.5 shadow-inner overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out relative shadow-sm ${
            isTailwindGradient ? `bg-gradient-to-r ${color}` : ''
          }`}
          style={{
            width: `${safePercent}%`,
            ...(isTailwindGradient ? {} : {
              backgroundColor: color,
              backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 60%)'
            })
          }}
        >
          {/* Specular Highlight */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  );
}
