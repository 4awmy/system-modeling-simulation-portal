import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Play, RotateCcw, Compass, Cpu, Move, Tv, Activity, Layers } from 'lucide-react';

export interface Point {
  x: number;
  y: number;
}

interface LineStep {
  k: number;
  pk: string | number;
  x: number;
  y: number;
  plotX?: number;
  plotY?: number;
}

interface CircleStep {
  k: number;
  pk: string | number;
  x: number;
  y: number;
  points: Point[];
}

interface EllipseStep {
  k: number;
  region: number;
  pk: number;
  x: number;
  y: number;
  points: Point[];
}

// ==========================================
// 1. LINE VISUALIZER (DDA & Bresenham)
// ==========================================
export const LineVisualizer: React.FC<{ defaultAlg?: 'direct' | 'dda' | 'bresenham' }> = ({ defaultAlg = 'bresenham' }) => {
  const [lineParams, setLineParams] = useState({ x1: 2, y1: 3, x2: 12, y2: 9 });
  const [lineAlg, setLineAlg] = useState<'direct' | 'dda' | 'bresenham'>(defaultAlg);

  const lineSteps = useMemo<LineStep[]>(() => {
    const { x1, y1, x2, y2 } = lineParams;
    const steps: LineStep[] = [];
    
    if (lineAlg === 'direct') {
      const dx = x2 - x1;
      const dy = y2 - y1;
      if (dx === 0 && dy === 0) {
        steps.push({ k: 0, pk: 'y = y₁', x: x1, y: y1, plotX: x1, plotY: y1 });
      } else if (Math.abs(dx) >= Math.abs(dy)) {
        const m = dy / dx;
        const c = y1 - m * x1;
        const stepX = x1 <= x2 ? 1 : -1;
        let k = 0;
        for (let x = x1; stepX > 0 ? x <= x2 : x >= x2; x += stepX) {
          const yVal = m * x + c;
          steps.push({
            k,
            pk: `y = ${m.toFixed(2)}x + ${c.toFixed(2)} = ${yVal.toFixed(2)}`,
            x: Number(x.toFixed(2)),
            y: Number(yVal.toFixed(2)),
            plotX: x,
            plotY: Math.round(yVal),
          });
          k++;
        }
      } else {
        const m = dy / dx;
        const c = y1 - m * x1;
        const stepY = y1 <= y2 ? 1 : -1;
        let k = 0;
        for (let y = y1; stepY > 0 ? y <= y2 : y >= y2; y += stepY) {
          const xVal = (y - c) / m;
          steps.push({
            k,
            pk: `x = (y - ${c.toFixed(2)}) / ${m.toFixed(2)} = ${xVal.toFixed(2)}`,
            x: Number(xVal.toFixed(2)),
            y: Number(y.toFixed(2)),
            plotX: Math.round(xVal),
            plotY: y,
          });
          k++;
        }
      }
    } else if (lineAlg === 'dda') {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const stepsCount = Math.max(Math.abs(dx), Math.abs(dy));
      const xInc = stepsCount === 0 ? 0 : dx / stepsCount;
      const yInc = stepsCount === 0 ? 0 : dy / stepsCount;
      let x = x1;
      let y = y1;
      for (let k = 0; k <= stepsCount; k++) {
        steps.push({
          k,
          pk: 'N/A',
          x: Number(x.toFixed(2)),
          y: Number(y.toFixed(2)),
          plotX: Math.round(x),
          plotY: Math.round(y),
        });
        x += xInc;
        y += yInc;
      }
    } else {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const isStandard = dx > 0 && dy >= 0 && dy <= dx;
      
      if (!isStandard) {
        const adx = Math.abs(dx);
        const ady = Math.abs(dy);
        const sx = x1 < x2 ? 1 : -1;
        const sy = y1 < y2 ? 1 : -1;
        let err = adx - ady;
        let x = x1;
        let y = y1;
        let k = 0;
        steps.push({ k, pk: 'N/A', x, y, plotX: x, plotY: y });
        while (x !== x2 || y !== y2) {
          k++;
          const e2 = 2 * err;
          if (e2 > -ady) {
            err -= ady;
            x += sx;
          }
          if (e2 < adx) {
            err += adx;
            y += sy;
          }
          steps.push({ k, pk: err, x, y, plotX: x, plotY: y });
          if (k > 50) break;
        }
      } else {
        let x = x1;
        let y = y1;
        let p = 2 * dy - dx;
        let k = 0;
        
        steps.push({ k, pk: p, x, y, plotX: x, plotY: y });

        while (x < x2) {
          k++;
          const pOld = p;
          x++;
          if (p < 0) {
            p = p + 2 * dy;
          } else {
            y++;
            p = p + 2 * dy - 2 * dx;
          }
          steps.push({ k, pk: pOld, x, y, plotX: x, plotY: y });
        }
      }
    }
    return steps;
  }, [lineParams, lineAlg]);

  const getLineGridPixels = () => {
    const pixels = Array(20).fill(null).map(() => Array(20).fill(false));
    lineSteps.forEach(s => {
      const px = s.plotX !== undefined ? s.plotX : s.x;
      const py = s.plotY !== undefined ? s.plotY : s.y;
      if (px >= 0 && px < 20 && py >= 0 && py < 20) {
        pixels[py][px] = true;
      }
    });
    return pixels;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-aast-navy text-sm">Line Parameters</h3>
            <div className="grid grid-cols-4 gap-3">
              {(['x1', 'y1', 'x2', 'y2'] as const).map((key) => (
                <div key={key}>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">{key}</label>
                  <input
                    type="number"
                    value={lineParams[key]}
                    onChange={(e) => setLineParams({ ...lineParams, [key]: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs font-semibold px-2 py-1 border border-slate-200 rounded focus:border-aast-navy"
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <span className="text-xs text-slate-500 font-medium">Algorithm:</span>
              <label className="flex items-center space-x-1.5 text-xs font-medium cursor-pointer text-slate-700">
                <input
                  type="radio"
                  checked={lineAlg === 'direct'}
                  onChange={() => setLineAlg('direct')}
                  className="text-aast-navy focus:ring-aast-navy"
                />
                <span>Direct (y=mx+c)</span>
              </label>
              <label className="flex items-center space-x-1.5 text-xs font-medium cursor-pointer text-slate-700">
                <input
                  type="radio"
                  checked={lineAlg === 'dda'}
                  onChange={() => setLineAlg('dda')}
                  className="text-aast-navy focus:ring-aast-navy"
                />
                <span>DDA</span>
              </label>
              <label className="flex items-center space-x-1.5 text-xs font-medium cursor-pointer text-slate-700">
                <input
                  type="radio"
                  checked={lineAlg === 'bresenham'}
                  onChange={() => setLineAlg('bresenham')}
                  className="text-aast-navy focus:ring-aast-navy"
                />
                <span>Bresenham's</span>
              </label>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[300px]">
            <h4 className="font-bold text-xs text-slate-700 mb-2">Algorithm Trace Table</h4>
            <div className="overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold bg-slate-50">
                    <th className="p-2">k</th>
                    {lineAlg === 'bresenham' ? (
                      <>
                        <th className="p-2">P_k</th>
                        <th className="p-2">{"x_{k+1}"}</th>
                        <th className="p-2">{"y_{k+1}"}</th>
                      </>
                    ) : lineAlg === 'dda' ? (
                      <>
                        <th className="p-2">x</th>
                        <th className="p-2">y</th>
                        <th className="p-2">Plotted Pixel</th>
                      </>
                    ) : (
                      <>
                        <th className="p-2">Calculation</th>
                        <th className="p-2">(x, y)</th>
                        <th className="p-2">Plotted Pixel</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {lineSteps.map((step, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-2 font-semibold text-slate-500">{step.k}</td>
                      {lineAlg === 'bresenham' ? (
                        <>
                          <td className="p-2 font-mono">{step.pk}</td>
                          <td className="p-2 font-mono">{step.x}</td>
                          <td className="p-2 font-mono text-aast-navy font-bold">({step.x}, {step.y})</td>
                        </>
                      ) : lineAlg === 'dda' ? (
                        <>
                          <td className="p-2 font-mono">{step.x}</td>
                          <td className="p-2 font-mono">{step.y}</td>
                          <td className="p-2 font-mono text-aast-navy font-bold">({step.plotX}, {step.plotY})</td>
                        </>
                      ) : (
                        <>
                          <td className="p-2 font-mono text-[10px]">{step.pk}</td>
                          <td className="p-2 font-mono">({step.x}, {step.y})</td>
                          <td className="p-2 font-mono text-aast-navy font-bold">({step.plotX}, {step.plotY})</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <h4 className="font-bold text-xs text-slate-600 mb-3 self-start">Plotted Line (20x20 Frame Buffer)</h4>
          <div className="grid grid-cols-20 gap-[1px] bg-slate-200 border border-slate-300 p-1.5 rounded">
            {getLineGridPixels().reverse().map((row, rIdx) => 
              row.map((active, cIdx) => {
                const actualY = 19 - rIdx;
                const actualX = cIdx;
                return (
                  <div
                    key={`${actualX}-${actualY}`}
                    title={`Pixel: (${actualX}, ${actualY})`}
                    className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 ${
                      active 
                        ? 'bg-aast-navy shadow-inner rounded-sm scale-95 border border-aast-gold' 
                        : 'bg-white hover:bg-slate-100'
                    }`}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
        <h4 className="font-bold text-xs text-aast-navy uppercase tracking-wider flex items-center space-x-1.5">
          <Cpu className="h-4 w-4 text-aast-gold" />
          <span>{lineAlg === 'direct' ? 'Direct Scan Conversion' : lineAlg === 'dda' ? 'DDA' : "Bresenham's"} Algorithm Rules & Steps</span>
        </h4>
        <div className="grid gap-4 md:grid-cols-2 text-xs text-slate-650 leading-relaxed font-medium">
          <div className="bg-white p-3 rounded-lg border border-slate-150">
            <span className="font-bold text-aast-navy block mb-1">Mathematical Rules</span>
            {lineAlg === 'direct' ? (
              <ul className="list-disc pl-4 space-y-1">
                <li>Uses slope-intercept formula: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">y = mx + c</code></li>
                <li>Slope: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">m = (y₂ - y₁) / (x₂ - x₁)</code>, Intercept: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">c = y₁ - m · x₁</code></li>
                <li><strong>Steepness rule:</strong> If |m| ≤ 1, step x and compute y. If |m| &gt; 1, step y and compute x (solving x = (y - c)/m) to avoid plotting gaps.</li>
                <li>Requires floating-point multiplication and division at every step.</li>
              </ul>
            ) : lineAlg === 'dda' ? (
              <ul className="list-disc pl-4 space-y-1">
                <li>Incremental approach: eliminates float multiplication by calculating increments.</li>
                <li>If |dx| ≥ |dy| (gentle slope), step x by 1, increment y by m: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">y_{`{k+1}`} = y_k + m</code>.</li>
                <li>If |dx| &lt; |dy| (steep slope), step y by 1, increment x by 1/m: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">x_{`{k+1}`} = x_k + 1/m</code>.</li>
                <li>Requires floating-point additions and rounding at each coordinate step, accumulating floating-point drift.</li>
              </ul>
            ) : (
              <ul className="list-disc pl-4 space-y-1">
                <li>Uses pure integer arithmetic (additions and bit-shifting) to find the closest pixel, making it extremely fast.</li>
                <li>Decision parameter: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">P₀ = 2·dy - dx</code>.</li>
                <li>If <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">P_k &lt; 0</code>: next pixel is <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">(x_k+1, y_k)</code>, update: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">P_{`{k+1}`} = P_k + 2·dy</code>.</li>
                <li>If <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">P_k ≥ 0</code>: next pixel is <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">(x_k+1, y_k+1)</code>, update: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">P_{`{k+1}`} = P_k + 2·dy - 2·dx</code>.</li>
              </ul>
            )}
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-150">
            <span className="font-bold text-aast-navy block mb-1">Execution Steps</span>
            {lineAlg === 'direct' ? (
              <ol className="list-decimal pl-4 space-y-1">
                <li>Input endpoints <code className="font-mono font-bold">(x₁, y₁)</code> and <code className="font-mono font-bold">(x₂, y₂)</code>.</li>
                <li>Calculate slope m and intercept c.</li>
                <li>Determine if slope is steep or gentle to choose the step coordinate.</li>
                <li>For each unit step along the independent axis, compute the dependent coordinate.</li>
                <li>Round the computed coordinate to the nearest integer and plot.</li>
              </ol>
            ) : lineAlg === 'dda' ? (
              <ol className="list-decimal pl-4 space-y-1">
                <li>Calculate <code className="font-mono font-bold">dx = x₂ - x₁</code> and <code className="font-mono font-bold">dy = y₂ - y₁</code>.</li>
                <li>Choose total steps: <code className="font-mono font-bold">Steps = max(|dx|, |dy|)</code>.</li>
                <li>Determine coordinate increments: <code className="font-mono font-bold">xInc = dx / Steps</code>, <code className="font-mono font-bold">yInc = dy / Steps</code>.</li>
                <li>Initialize start values <code className="font-mono font-bold">(x, y) = (x₁, y₁)</code>.</li>
                <li>Loop <code className="font-mono font-bold">Steps</code> times: Plot <code className="font-mono font-bold">(round(x), round(y))</code>, then add increments.</li>
              </ol>
            ) : (
              <ol className="list-decimal pl-4 space-y-1">
                <li>Input endpoints <code className="font-mono font-bold">(x₀, y₀)</code> and <code className="font-mono font-bold">(x_end, y_end)</code>.</li>
                <li>Calculate constants: <code className="font-mono font-bold">dx, dy, 2·dy, 2·dy - 2·dx</code>.</li>
                <li>Initialize decision parameter: <code className="font-mono font-bold">P₀ = 2·dy - dx</code>.</li>
                <li>Plot starting point. Loop x from x₀ to x_end.</li>
                <li>At each step, check sign of P_k to choose next y pixel, and update P_k incrementally.</li>
              </ol>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. CIRCLE VISUALIZER (Midpoint Circle)
// ==========================================
export const CircleVisualizer: React.FC = () => {
  const [circleParams, setCircleParams] = useState({ xc: 0, yc: 0, r: 8 });
  const [circleAlg, setCircleAlg] = useState<'midpoint' | 'polar' | 'naive'>('midpoint');

  const circleSteps = useMemo<CircleStep[]>(() => {
    const { r } = circleParams;
    const steps: CircleStep[] = [];
    
    const getSymmetricPoints = (cx: number, cy: number): Point[] => [
      { x: cx, y: cy },
      { x: cy, y: cx },
      { x: -cy, y: cx },
      { x: -cx, y: cy },
      { x: -cx, y: -cy },
      { x: -cy, y: -cx },
      { x: cy, y: -cx },
      { x: cx, y: -cy },
    ];

    if (circleAlg === 'midpoint') {
      let x = 0;
      let y = r;
      let p = 1 - r;
      let k = 0;

      steps.push({
        k,
        pk: p,
        x,
        y,
        points: getSymmetricPoints(x, y),
      });

      while (x < y) {
        k++;
        const pOld = p;
        x++;
        if (p < 0) {
          p = p + 2 * x + 3;
        } else {
          y--;
          p = p + 2 * x - 2 * y + 5;
        }
        steps.push({
          k,
          pk: pOld,
          x,
          y,
          points: getSymmetricPoints(x, y),
        });
        if (k > 50) break;
      }
    } else if (circleAlg === 'naive') {
      let k = 0;
      for (let x = 0; x <= r; x++) {
        const yVal = Math.sqrt(r * r - x * x);
        const yRound = Math.round(yVal);
        steps.push({
          k,
          pk: `y = √(${r}² - ${x}²) = ${yVal.toFixed(2)}`,
          x,
          y: yRound,
          points: getSymmetricPoints(x, yRound),
        });
        k++;
      }
    } else {
      let k = 0;
      const dTheta = r > 0 ? 1 / r : 0.2;
      const limit = Math.PI / 4;
      for (let theta = 0; theta <= limit + 0.001; theta += dTheta) {
        const xVal = r * Math.cos(theta);
        const yVal = r * Math.sin(theta);
        const xRound = Math.round(xVal);
        const yRound = Math.round(yVal);
        const deg = (theta * 180) / Math.PI;
        steps.push({
          k,
          pk: `θ = ${deg.toFixed(1)}°`,
          x: xRound,
          y: yRound,
          points: getSymmetricPoints(xRound, yRound),
        });
        k++;
      }
    }
    return steps;
  }, [circleParams, circleAlg]);

  const getCircleGridPixels = () => {
    const pixels = Array(25).fill(null).map(() => Array(25).fill(false));
    const cx = 12;
    const cy = 12;
    circleSteps.forEach(s => {
      if (s.points) {
        s.points.forEach((p: Point) => {
          const px = p.x + cx;
          const py = p.y + cy;
          if (px >= 0 && px < 25 && py >= 0 && py < 25) {
            pixels[py][px] = true;
          }
        });
      }
    });
    return pixels;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-aast-navy text-sm">Circle Parameters</h3>
            <div className="grid grid-cols-3 gap-3">
              {(['xc', 'yc', 'r'] as const).map((key) => (
                <div key={key}>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">{key}</label>
                  <input
                    type="number"
                    value={circleParams[key]}
                    onChange={(e) => setCircleParams({ ...circleParams, [key]: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs font-semibold px-2 py-1 border border-slate-200 rounded focus:border-aast-navy"
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <span className="text-xs text-slate-500 font-medium">Algorithm:</span>
              <label className="flex items-center space-x-1.5 text-xs font-medium cursor-pointer text-slate-700">
                <input
                  type="radio"
                  checked={circleAlg === 'naive'}
                  onChange={() => setCircleAlg('naive')}
                  className="text-aast-navy focus:ring-aast-navy"
                />
                <span>Naive Cartesian</span>
              </label>
              <label className="flex items-center space-x-1.5 text-xs font-medium cursor-pointer text-slate-700">
                <input
                  type="radio"
                  checked={circleAlg === 'polar'}
                  onChange={() => setCircleAlg('polar')}
                  className="text-aast-navy focus:ring-aast-navy"
                />
                <span>Polar Coordinates</span>
              </label>
              <label className="flex items-center space-x-1.5 text-xs font-medium cursor-pointer text-slate-700">
                <input
                  type="radio"
                  checked={circleAlg === 'midpoint'}
                  onChange={() => setCircleAlg('midpoint')}
                  className="text-aast-navy focus:ring-aast-navy"
                />
                <span>Midpoint Circle</span>
              </label>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[300px]">
            <h4 className="font-bold text-xs text-slate-700 mb-2">Symmetric Octant Trace Table</h4>
            <div className="overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold bg-slate-50">
                    <th className="p-2">k</th>
                    {circleAlg === 'midpoint' ? (
                      <>
                        <th className="p-2">P_k</th>
                        <th className="p-2">Octant 1 (x, y)</th>
                      </>
                    ) : circleAlg === 'naive' ? (
                      <>
                        <th className="p-2">Formula Calculation</th>
                        <th className="p-2">Octant 1 (x, y)</th>
                      </>
                    ) : (
                      <>
                        <th className="p-2">Angle (θ)</th>
                        <th className="p-2">Octant 1 (x, y)</th>
                      </>
                    )}
                    <th className="p-2">8-way Symmetric Pixels</th>
                  </tr>
                </thead>
                <tbody>
                  {circleSteps.map((step, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-2 font-semibold text-slate-500">{step.k}</td>
                      <td className="p-2 font-mono text-[10px]">{step.pk}</td>
                      <td className="p-2 font-mono font-bold text-aast-navy">({step.x}, {step.y})</td>
                      <td className="p-2 font-mono text-[9px] text-slate-500 truncate max-w-[200px]" title={step.points.map(p => `(${p.x},${p.y})`).join(', ')}>
                        {step.points.map(p => `(${p.x},${p.y})`).join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <h4 className="font-bold text-xs text-slate-600 mb-3 self-start">Plotted Circle (25x25, CenterOffset: 12,12)</h4>
          <div className="grid grid-cols-25 gap-[1px] bg-slate-200 border border-slate-300 p-1.5 rounded">
            {getCircleGridPixels().reverse().map((row, rIdx) => 
              row.map((active, cIdx) => {
                const actualY = 24 - rIdx;
                const actualX = cIdx;
                return (
                  <div
                    key={`${actualX}-${actualY}`}
                    title={`Pixel: (${actualX - 12}, ${actualY - 12})`}
                    className={`h-3 w-3 sm:h-3.5 sm:w-3.5 transition-all duration-300 ${
                      active 
                        ? 'bg-aast-navy shadow-inner rounded-sm scale-95 border border-aast-gold' 
                        : 'bg-white hover:bg-slate-100'
                    }`}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
        <h4 className="font-bold text-xs text-aast-navy uppercase tracking-wider flex items-center space-x-1.5">
          <Cpu className="h-4 w-4 text-aast-gold" />
          <span>{circleAlg === 'naive' ? 'Naive Cartesian' : circleAlg === 'polar' ? 'Polar Coordinate' : 'Midpoint'} Circle Algorithm Rules & Steps</span>
        </h4>
        <div className="grid gap-4 md:grid-cols-2 text-xs text-slate-650 leading-relaxed font-medium">
          <div className="bg-white p-3 rounded-lg border border-slate-150">
            <span className="font-bold text-aast-navy block mb-1">Mathematical Rules</span>
            {circleAlg === 'naive' ? (
              <ul className="list-disc pl-4 space-y-1">
                <li>Equation: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">x² + y² = r² ⇒ y = ±√(r² - x²)</code></li>
                <li>Plots 8 octants using symmetry relative to the center <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">(xc, yc)</code>.</li>
                <li><strong>Drawback:</strong> Uniformly steps x, which causes large gaps in y when slope |dy/dx| &gt; 1 (steep parts near the sides of the circle).</li>
                <li>Requires floating-point squares, subtractions, square roots, and rounding at every step.</li>
              </ul>
            ) : circleAlg === 'polar' ? (
              <ul className="list-disc pl-4 space-y-1">
                <li>Equations: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">x = r · cos(θ)</code>, <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">y = r · sin(θ)</code></li>
                <li>Step size: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">dθ ≈ 1/r</code> to avoid gaps between adjacent plotted pixels.</li>
                <li>Uses 8-way symmetry by calculating points in the first octant (0 to 45° / π/4 radians).</li>
                <li>Requires floating-point trigonometric functions (cos, sin) which are computationally slow.</li>
              </ul>
            ) : (
              <ul className="list-disc pl-4 space-y-1">
                <li>Uses pure integer arithmetic (no floats, multiplication, divisions, or trig functions) using decision parameters.</li>
                <li>Initial parameter: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">P₀ = 1 - r</code>.</li>
                <li>At step k, if <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">P_k &lt; 0</code>: next point is <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">(x_k+1, y_k)</code>, update: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">P_{`{k+1}`} = P_k + 2·x + 3</code>.</li>
                <li>If <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">P_k ≥ 0</code>: next point is <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">(x_k+1, y_k-1)</code>, update: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">P_{`{k+1}`} = P_k + 2·x - 2·y + 5</code>.</li>
              </ul>
            )}
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-150">
            <span className="font-bold text-aast-navy block mb-1">Execution Steps</span>
            {circleAlg === 'naive' ? (
              <ol className="list-decimal pl-4 space-y-1">
                <li>Input radius r and center <code className="font-mono font-bold">(xc, yc)</code>.</li>
                <li>Initialize start values <code className="font-mono font-bold">x = 0</code>.</li>
                <li>Loop <code className="font-mono font-bold">x</code> from 0 to r: calculate <code className="font-mono font-bold">y = √(r² - x²)</code>, round y, plot symmetric coordinates.</li>
                <li>Symmetric plotting checks: <code className="font-mono font-bold">(x, y)</code>, <code className="font-mono font-bold">(-x, y)</code>, <code className="font-mono font-bold">(x, -y)</code>, <code className="font-mono font-bold">(-x, -y)</code>, <code className="font-mono font-bold">(y, x)</code>, etc.</li>
              </ol>
            ) : circleAlg === 'polar' ? (
              <ol className="list-decimal pl-4 space-y-1">
                <li>Input radius r and center <code className="font-mono font-bold">(xc, yc)</code>.</li>
                <li>Initialize <code className="font-mono font-bold">θ = 0</code> and set step increment <code className="font-mono font-bold">dθ = 1/r</code>.</li>
                <li>Loop from <code className="font-mono font-bold">θ = 0</code> to <code className="font-mono font-bold">π/4</code>: calculate <code className="font-mono font-bold">x = r · cos(θ)</code> and <code className="font-mono font-bold">y = r · sin(θ)</code>.</li>
                <li>Round coordinates to integers and plot the 8-way symmetric points.</li>
              </ol>
            ) : (
              <ol className="list-decimal pl-4 space-y-1">
                <li>Input radius r and center <code className="font-mono font-bold">(xc, yc)</code>.</li>
                <li>Initialize <code className="font-mono font-bold">(x₀, y₀) = (0, r)</code>.</li>
                <li>Initialize decision parameter <code className="font-mono font-bold">P₀ = 1 - r</code>.</li>
                <li>Loop while <code className="font-mono font-bold">x &lt; y</code>: increment x, check P_k to update y and compute next decision parameter P_k+1.</li>
                <li>Plot the 8 symmetric points around <code className="font-mono font-bold">(xc, yc)</code> at each step.</li>
              </ol>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. ELLIPSE VISUALIZER (Midpoint Ellipse)
// ==========================================
export const EllipseVisualizer: React.FC = () => {
  const [ellipseParams, setEllipseParams] = useState({ xc: 0, yc: 0, rx: 8, ry: 5 });

  const ellipseSteps = useMemo<EllipseStep[]>(() => {
    const { rx, ry } = ellipseParams;
    const steps: EllipseStep[] = [];
    let k = 0;
    let x = 0;
    let y = ry;
    let p1 = ry * ry - rx * rx * ry + 0.25 * rx * rx;
    let dx = 2 * ry * ry * x;
    let dy = 2 * rx * rx * y;

    const getSymmetricPoints = (cx: number, cy: number): Point[] => [
      { x: cx, y: cy },
      { x: -cx, y: cy },
      { x: cx, y: -cy },
      { x: -cx, y: -cy }
    ];

    steps.push({
      k,
      region: 1,
      pk: p1,
      x,
      y,
      points: getSymmetricPoints(x, y)
    });

    while (dx < dy) {
      k++;
      const pOld = p1;
      x++;
      dx = dx + 2 * ry * ry;
      if (p1 < 0) {
        p1 = p1 + ry * ry + dx;
      } else {
        y--;
        dy = dy - 2 * rx * rx;
        p1 = p1 + ry * ry + dx - dy;
      }
      steps.push({
        k,
        region: 1,
        pk: pOld,
        x,
        y,
        points: getSymmetricPoints(x, y)
      });
      if (k > 50) break;
    }

    let p2 = ry * ry * (x + 0.5) * (x + 0.5) + rx * rx * (y - 1) * (y - 1) - rx * rx * ry * ry;
    
    while (y > 0) {
      k++;
      const pOld = p2;
      y--;
      dy = dy - 2 * rx * rx;
      if (p2 > 0) {
        p2 = p2 + rx * rx - dy;
      } else {
        x++;
        dx = dx + 2 * ry * ry;
        p2 = p2 + rx * rx - dy + dx;
      }
      steps.push({
        k,
        region: 2,
        pk: pOld,
        x,
        y,
        points: getSymmetricPoints(x, y)
      });
      if (k > 50) break;
    }
    return steps;
  }, [ellipseParams]);

  const getEllipseGridPixels = () => {
    const pixels = Array(25).fill(null).map(() => Array(25).fill(false));
    const cx = 12;
    const cy = 12;
    ellipseSteps.forEach(s => {
      if (s.points) {
        s.points.forEach((p: Point) => {
          const px = p.x + cx;
          const py = p.y + cy;
          if (px >= 0 && px < 25 && py >= 0 && py < 25) {
            pixels[py][px] = true;
          }
        });
      }
    });
    return pixels;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-aast-navy text-sm">Ellipse Parameters (Midpoint Ellipse)</h3>
            <div className="grid grid-cols-4 gap-3">
              {(['xc', 'yc', 'rx', 'ry'] as const).map((key) => (
                <div key={key}>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">{key}</label>
                  <input
                    type="number"
                    value={ellipseParams[key]}
                    onChange={(e) => setEllipseParams({ ...ellipseParams, [key]: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs font-semibold px-2 py-1 border border-slate-200 rounded focus:border-aast-navy"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[300px]">
            <h4 className="font-bold text-xs text-slate-700 mb-2">Quadrant Trace Table</h4>
            <div className="overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold bg-slate-50">
                    <th className="p-2">k</th>
                    <th className="p-2">Reg.</th>
                    <th className="p-2">P_k</th>
                    <th className="p-2">Quadrant 1 (x, y)</th>
                    <th className="p-2">Symmetric Pixels</th>
                  </tr>
                </thead>
                <tbody>
                  {ellipseSteps.map((step, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-2 font-semibold text-slate-500">{step.k}</td>
                      <td className="p-2 font-semibold">{step.region}</td>
                      <td className="p-2 font-mono">{step.pk.toFixed(1)}</td>
                      <td className="p-2 font-mono font-bold text-aast-navy">({step.x}, {step.y})</td>
                      <td className="p-2 font-mono text-[9px] text-slate-405 truncate max-w-[150px]">
                        {step.points.map(p => `(${p.x},${p.y})`).join(' ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <h4 className="font-bold text-xs text-slate-600 mb-3 self-start">Plotted Ellipse (25x25)</h4>
          <div className="grid grid-cols-25 gap-[1px] bg-slate-200 border border-slate-300 p-1.5 rounded">
            {getEllipseGridPixels().reverse().map((row, rIdx) => 
              row.map((active, cIdx) => {
                const actualY = 24 - rIdx;
                const actualX = cIdx;
                return (
                  <div
                    key={`${actualX}-${actualY}`}
                    title={`Pixel: (${actualX - 12}, ${actualY - 12})`}
                    className={`h-3 w-3 sm:h-3.5 sm:w-3.5 transition-all duration-300 ${
                      active 
                        ? 'bg-aast-navy shadow-inner rounded-sm scale-95 border border-aast-gold' 
                        : 'bg-white hover:bg-slate-100'
                    }`}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
        <h4 className="font-bold text-xs text-aast-navy uppercase tracking-wider flex items-center space-x-1.5">
          <Cpu className="h-4 w-4 text-aast-gold" />
          <span>Midpoint Ellipse Algorithm Rules & Steps</span>
        </h4>
        <div className="grid gap-4 md:grid-cols-2 text-xs text-slate-650 leading-relaxed font-medium">
          <div className="bg-white p-3 rounded-lg border border-slate-150">
            <span className="font-bold text-aast-navy block mb-1">Mathematical Rules</span>
            <ul className="list-disc pl-4 space-y-1">
              <li>Equation: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">ry²·x² + rx²·y² = rx²·ry²</code></li>
              <li>Symmetry: 4-way symmetry is used since reflection is valid across major/minor axes.</li>
              <li><strong>Region 1 (slope |dy/dx| &lt; 1):</strong> Steps along x. Boundary is when <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">2·ry²·x ≥ 2·rx²·y</code>.</li>
              <li>Initial parameter: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">P1₀ = ry² - rx²·ry + ¼·rx²</code>. If <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">P1_k &lt; 0</code>: update <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">P1_{`{k+1}`} = P1_k + 2·ry²·x + ry²</code>. Otherwise, decrement y and update: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">P1_{`{k+1}`} = P1_k + 2·ry²·x - 2·rx²·y + ry²</code>.</li>
              <li><strong>Region 2 (slope |dy/dx| ≥ 1):</strong> Steps along y. Terminate when <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">y = 0</code>.</li>
              <li>Initial parameter: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">P2₀ = ry²(x_0+0.5)² + rx²(y_0-1)² - rx²·ry²</code>. If <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">P2_k &gt; 0</code>: update <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">P2_{`{k+1}`} = P2_k - 2·rx²·y + rx²</code>. Otherwise, increment x and update: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">P2_{`{k+1}`} = P2_k + 2·ry²·x - 2·rx²·y + rx²</code>.</li>
            </ul>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-150">
            <span className="font-bold text-aast-navy block mb-1">Execution Steps</span>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Input semi-major axis <code className="font-mono font-bold">rx</code>, semi-minor axis <code className="font-mono font-bold">ry</code>, and center <code className="font-mono font-bold">(xc, yc)</code>.</li>
              <li>Initialize Region 1 starting coordinates at <code className="font-mono font-bold">(x₀, y₀) = (0, ry)</code>.</li>
              <li>Compute initial decision parameter <code className="font-mono font-bold">P1₀</code>.</li>
              <li>In Region 1, loop x: plot 4 symmetric points around <code className="font-mono font-bold">(xc, yc)</code>. Update decision parameters and decrement y when parameter is positive. Stop when <code className="font-mono font-bold">2·ry²·x ≥ 2·rx²·y</code>.</li>
              <li>Initialize Region 2 starting coordinates with the final coordinates from Region 1.</li>
              <li>Compute initial decision parameter <code className="font-mono font-bold">P2₀</code>.</li>
              <li>In Region 2, loop y decreasing: plot 4 symmetric points. Update parameters and increment x when parameter is negative. Stop when <code className="font-mono font-bold">y = 0</code>.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. REGION FILLING VISUALIZER (Boundary & Flood Fill)
// ==========================================
export const FillingVisualizer: React.FC<{ defaultType?: 'boundary' | 'flood'; defaultConnectivity?: 4 | 8 }> = ({
  defaultType = 'boundary',
  defaultConnectivity = 4
}) => {
  const GRID_SIZE = 16;
  const [fillGrid, setFillGrid] = useState<string[][]>(
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('empty'))
  );
  const [fillType, setFillType] = useState<'boundary' | 'flood'>(defaultType);
  const [connectivity, setConnectivity] = useState<4 | 8>(defaultConnectivity);
  const [fillSpeed, setFillSpeed] = useState<number>(300);
  const [isFilling, setIsFilling] = useState<boolean>(false);
  const [fillMode, setFillMode] = useState<'draw-wall' | 'set-seed'>('draw-wall');
  const [seedPoint, setSeedPoint] = useState<Point | null>(null);
  const [fillStack, setFillStack] = useState<Point[]>([]);

  const fillTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleGridClick = (x: number, y: number) => {
    if (isFilling) return;
    
    if (fillMode === 'draw-wall') {
      const newGrid = fillGrid.map((row, rIdx) => 
        row.map((val, cIdx) => {
          if (rIdx === y && cIdx === x) {
            return val === 'wall' ? 'empty' : 'wall';
          }
          return val;
        })
      );
      setFillGrid(newGrid);
    } else {
      if (fillGrid[y][x] === 'wall') return;
      setSeedPoint({ x, y });
    }
  };

  const clearFillGrid = () => {
    if (isFilling) {
      setIsFilling(false);
      if (fillTimeoutRef.current) clearTimeout(fillTimeoutRef.current);
    }
    setFillGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('empty')));
    setSeedPoint(null);
    setFillStack([]);
  };

  const triggerFilling = () => {
    if (!seedPoint) {
      alert("Please select a seed point first!");
      return;
    }
    if (isFilling) return;
    
    setIsFilling(true);
    const gridCopy = fillGrid.map(row => [...row]);
    const localStack: Point[] = [{ ...seedPoint }];
    setFillStack([...localStack]);

    const stepFill = () => {
      if (localStack.length === 0) {
        setIsFilling(false);
        return;
      }

      const curr = localStack.pop()!;
      const { x, y } = curr;

      if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) {
        fillTimeoutRef.current = setTimeout(stepFill, fillSpeed);
        return;
      }

      const currentCell = gridCopy[y][x];

      if (fillType === 'boundary') {
        if (currentCell !== 'wall' && currentCell !== 'filled') {
          gridCopy[y][x] = 'filled';
          setFillGrid([...gridCopy]);
          const neighbors = getNeighbors(x, y);
          neighbors.forEach(n => localStack.push(n));
        }
      } else {
        if (currentCell === 'empty') {
          gridCopy[y][x] = 'filled';
          setFillGrid([...gridCopy]);
          const neighbors = getNeighbors(x, y);
          neighbors.forEach(n => localStack.push(n));
        }
      }

      setFillStack([...localStack]);
      fillTimeoutRef.current = setTimeout(stepFill, fillSpeed);
    };

    fillTimeoutRef.current = setTimeout(stepFill, fillSpeed);
  };

  const getNeighbors = (x: number, y: number) => {
    const list = [];
    list.push({ x: x + 1, y });
    list.push({ x: x - 1, y });
    list.push({ x, y: y + 1 });
    list.push({ x, y: y - 1 });

    if (connectivity === 8) {
      list.push({ x: x + 1, y: y + 1 });
      list.push({ x: x - 1, y: y - 1 });
      list.push({ x: x + 1, y: y - 1 });
      list.push({ x: x - 1, y: y + 1 });
    }
    return list;
  };

  const applyPresetShape = () => {
    clearFillGrid();
    const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('empty'));
    const bounds = { minX: 4, maxX: 11, minY: 4, maxY: 11 };
    
    for (let x = bounds.minX; x <= bounds.maxX; x++) {
      newGrid[bounds.minY][x] = 'wall';
      newGrid[bounds.maxY][x] = 'wall';
    }
    for (let y = bounds.minY; y <= bounds.maxY; y++) {
      newGrid[y][bounds.minX] = 'wall';
      newGrid[y][bounds.maxX] = 'wall';
    }
    newGrid[bounds.minY][bounds.minX] = 'empty';

    setFillGrid(newGrid);
    setSeedPoint({ x: 7, y: 7 });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-1">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-aast-navy text-sm">Region Fill Options</h3>
          
          <div className="flex flex-col space-y-2">
            <span className="text-xs text-slate-500 font-medium">Draw Mode:</span>
            <div className="flex space-x-2">
              <button
                onClick={() => setFillMode('draw-wall')}
                className={`flex-1 py-1 text-xs font-bold rounded border ${
                  fillMode === 'draw-wall'
                    ? 'bg-aast-navy text-white border-aast-navy'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Draw Wall
              </button>
              <button
                onClick={() => setFillMode('set-seed')}
                className={`flex-1 py-1 text-xs font-bold rounded border ${
                  fillMode === 'set-seed'
                    ? 'bg-aast-gold text-aast-navy border-aast-gold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Set Seed
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <span className="text-xs text-slate-500 font-medium">Filling Type:</span>
            <div className="flex space-x-2">
              <button
                onClick={() => setFillType('boundary')}
                className={`flex-1 py-1 text-xs font-semibold rounded border ${
                  fillType === 'boundary' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                Boundary Fill
              </button>
              <button
                onClick={() => setFillType('flood')}
                className={`flex-1 py-1 text-xs font-semibold rounded border ${
                  fillType === 'flood' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                Flood Fill
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Connectivity:</span>
            <div className="flex space-x-2">
              <button
                onClick={() => setConnectivity(4)}
                className={`px-3 py-1 font-bold rounded border ${
                  connectivity === 4 ? 'bg-aast-navy text-aast-gold' : 'bg-slate-100 text-slate-600'
                }`}
              >
                4-Way
              </button>
              <button
                onClick={() => setConnectivity(8)}
                className={`px-3 py-1 font-bold rounded border ${
                  connectivity === 8 ? 'bg-aast-navy text-aast-gold' : 'bg-slate-100 text-slate-600'
                }`}
              >
                8-Way
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>Speed:</span>
              <span className="font-bold font-mono">{fillSpeed}ms</span>
            </div>
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={fillSpeed}
              onChange={(e) => setFillSpeed(parseInt(e.target.value))}
              className="w-full accent-aast-navy"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={triggerFilling}
              disabled={isFilling}
              className="flex-1 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center justify-center space-x-1 shadow disabled:opacity-50"
            >
              <Play className="h-3 w-3" />
              <span>Start Fill</span>
            </button>
            <button
              onClick={clearFillGrid}
              className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-lg"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={applyPresetShape}
            className="w-full py-1.5 border border-dashed border-aast-navy text-aast-navy text-xs font-semibold hover:bg-aast-navy-soft rounded-lg transition-colors flex items-center justify-center space-x-1"
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Load Leakage Preset</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center lg:col-span-1 select-none">
        <h4 className="font-bold text-xs text-slate-600 mb-3 self-start">Canvas Grid (16x16)</h4>
        <div className="grid grid-cols-16 gap-[1px] bg-slate-200 border border-slate-300 p-1.5 rounded">
          {fillGrid.map((row, y) => 
            row.map((cellType, x) => {
              const isSeed = seedPoint?.x === x && seedPoint?.y === y;
              return (
                <div
                  key={`${x}-${y}`}
                  onClick={() => handleGridClick(x, y)}
                  className={`h-4 w-4 sm:h-5 sm:w-5 cursor-crosshair transition-colors duration-200 relative ${
                    cellType === 'wall'
                      ? 'bg-slate-800'
                      : cellType === 'filled'
                      ? 'bg-aast-navy scale-95 rounded-sm border border-aast-gold'
                      : 'bg-white hover:bg-slate-100'
                  }`}
                >
                  {isSeed && (
                    <div className="absolute inset-0 bg-aast-gold rounded-sm flex items-center justify-center text-[9px] font-black text-aast-navy">
                      S
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col max-h-[320px] lg:col-span-1">
        <h4 className="font-bold text-xs text-slate-600 mb-2">Recursion Stack ({fillStack.length} items)</h4>
        <div className="flex-1 overflow-y-auto custom-scrollbar border border-slate-100 rounded p-2 bg-slate-50 space-y-1">
          {fillStack.length === 0 ? (
            <span className="text-[10px] text-slate-400 italic">Stack empty.</span>
          ) : (
            fillStack.slice().reverse().map((coord, idx) => (
              <div key={idx} className="bg-white border border-slate-200 px-2.5 py-1 rounded text-[10px] font-mono flex justify-between text-slate-600 shadow-sm">
                <span>Stack [{fillStack.length - 1 - idx}]</span>
                <span className="font-bold text-aast-navy">({coord.x}, {coord.y})</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. FRAMEBUFFER CALCULATOR (Weeks 1 & 3)
// ==========================================
export const FramebufferCalculator: React.FC = () => {
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(768);
  const [depth, setDepth] = useState(24);
  const [refreshRate, setRefreshRate] = useState(60);

  const totalPixels = width * height;
  const sizeBits = totalPixels * depth;
  const sizeBytes = sizeBits / 8;
  const sizeKB = sizeBytes / 1024;
  const sizeMB = sizeKB / 1024;

  const bandwidthMBs = sizeMB * refreshRate;
  const dotClockMHz = (totalPixels * refreshRate) / 1000000;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
        <h3 className="font-bold text-aast-navy text-sm flex items-center space-x-2">
          <Cpu className="h-4 w-4 text-aast-gold" />
          <span>Display Parameters</span>
        </h3>
        
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-600 font-semibold">
              <span>Resolution: {width} × {height}</span>
              <span className="text-slate-400">({totalPixels.toLocaleString()} pixels)</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full text-xs font-semibold px-2 py-1.5 border border-slate-200 rounded"
                placeholder="Width"
              />
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full text-xs font-semibold px-2 py-1.5 border border-slate-200 rounded"
                placeholder="Height"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-600 font-semibold block">Color Depth (Bits Per Pixel):</label>
            <div className="grid grid-cols-5 gap-1">
              {([1, 8, 16, 24, 32] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDepth(d)}
                  className={`py-1 text-xs font-bold rounded border ${
                    depth === d 
                      ? 'bg-aast-navy text-aast-gold border-aast-navy' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {d}b
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-600 font-semibold">
              <span>Refresh Rate:</span>
              <span className="text-aast-navy font-bold font-mono">{refreshRate} Hz</span>
            </div>
            <input
              type="range"
              min="30"
              max="240"
              step="10"
              value={refreshRate}
              onChange={(e) => setRefreshRate(parseInt(e.target.value))}
              className="w-full accent-aast-navy"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
        <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Calculated Memory Footprint</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Frame Buffer Size</span>
            <div className="text-lg font-black text-aast-navy font-mono mt-1">
              {sizeMB.toFixed(2)} <span className="text-xs font-semibold">MB</span>
            </div>
            <span className="text-[9px] text-slate-400 block mt-0.5">({sizeBytes.toLocaleString()} bytes)</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Video Bandwidth</span>
            <div className="text-lg font-black text-aast-navy font-mono mt-1">
              {bandwidthMBs.toFixed(1)} <span className="text-xs font-semibold">MB/s</span>
            </div>
            <span className="text-[9px] text-slate-400 block mt-0.5">At refresh rate of {refreshRate}Hz</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 col-span-2 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Pixel Dot Clock</span>
              <span className="text-xs text-slate-500">Scan conversion speed</span>
            </div>
            <div className="text-xl font-black text-emerald-600 font-mono">
              ~{dotClockMHz.toFixed(2)} <span className="text-xs font-semibold">MHz</span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-amber-50 rounded-lg border border-amber-250 text-[10px] text-amber-700 leading-relaxed">
          <strong>Academic Fact:</strong> True system video bandwidth is typically 20-30% higher than calculated here to accommodate horizontal and vertical scan retrace intervals (overscan / blanking periods).
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. BÉZIER CURVE VISUALIZER (Week 8 Splines)
// ==========================================
export const BezierCurveVisualizer: React.FC = () => {
  const [splineType, setSplineType] = useState<'bezier' | 'bspline'>('bezier');
  const [points, setPoints] = useState<Point[]>([
    { x: 50, y: 220 },
    { x: 120, y: 40 },
    { x: 200, y: 150 },
    { x: 280, y: 40 },
    { x: 350, y: 220 },
  ]);
  const [activePt, setActivePt] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const getBezierPoint = (t: number, pts: Point[]): Point => {
    const omt = 1 - t;
    const omt2 = omt * omt;
    const omt3 = omt2 * omt;
    const t2 = t * t;
    const t3 = t2 * t;

    return {
      x: omt3 * pts[0].x + 3 * omt2 * t * pts[1].x + 3 * omt * t2 * pts[2].x + t3 * pts[3].x,
      y: omt3 * pts[0].y + 3 * omt2 * t * pts[1].y + 3 * omt * t2 * pts[2].y + t3 * pts[3].y,
    };
  };

  const getBSplinePoint = (t: number, pts: Point[], i: number): Point => {
    // Cubic B-Spline blending functions for segment i (using pts[i], pts[i+1], pts[i+2], pts[i+3])
    const t2 = t * t;
    const t3 = t2 * t;

    const b0 = (1 - 3*t + 3*t2 - t3) / 6;
    const b1 = (4 - 6*t2 + 3*t3) / 6;
    const b2 = (1 + 3*t + 3*t2 - 3*t3) / 6;
    const b3 = t3 / 6;

    const p0 = pts[i];
    const p1 = pts[i + 1];
    const p2 = pts[i + 2];
    const p3 = pts[i + 3];

    return {
      x: b0 * p0.x + b1 * p1.x + b2 * p2.x + b3 * p3.x,
      y: b0 * p0.y + b1 * p1.y + b2 * p2.y + b3 * p3.y,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid background
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    const numPoints = splineType === 'bezier' ? 4 : 5;

    // Draw control polygon lines
    ctx.strokeStyle = '#94a3b8';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < numPoints; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    // Draw Curve(s)
    if (splineType === 'bezier') {
      ctx.strokeStyle = '#0d2c54'; // AAST Navy
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      const startPoint = getBezierPoint(0, points);
      ctx.moveTo(startPoint.x, startPoint.y);
      for (let t = 0.01; t <= 1; t += 0.01) {
        const p = getBezierPoint(t, points);
        ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    } else {
      // B-Spline: 5 control points, 2 segments
      // Segment 1 (P0, P1, P2, P3)
      ctx.strokeStyle = '#0d2c54'; // AAST Navy
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      const startPoint1 = getBSplinePoint(0, points, 0);
      ctx.moveTo(startPoint1.x, startPoint1.y);
      for (let t = 0.01; t <= 1; t += 0.01) {
        const p = getBSplinePoint(t, points, 0);
        ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();

      // Segment 2 (P1, P2, P3, P4)
      ctx.strokeStyle = '#c5a059'; // AAST Gold
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      const startPoint2 = getBSplinePoint(0, points, 1);
      ctx.moveTo(startPoint2.x, startPoint2.y);
      for (let t = 0.01; t <= 1; t += 0.01) {
        const p = getBSplinePoint(t, points, 1);
        ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }

    // Draw control points
    for (let idx = 0; idx < numPoints; idx++) {
      const pt = points[idx];
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, (idx === 0 || idx === numPoints - 1) ? 7 : 6, 0, 2 * Math.PI);
      ctx.fillStyle = (idx === 0 || idx === numPoints - 1) ? '#c5a059' : '#0d2c54'; // endpoints Gold, inner Navy
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label control points
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(`P${idx}`, pt.x + 10, pt.y + 4);
    }
  }, [points, splineType]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const numPoints = splineType === 'bezier' ? 4 : 5;

    // Detect click near control points
    const hitIdx = points.slice(0, numPoints).findIndex(pt => {
      const dx = pt.x - x;
      const dy = pt.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 15;
    });

    if (hitIdx !== -1) {
      setActivePt(hitIdx);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activePt === null) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    
    // Constraint points to canvas boundary
    const x = Math.max(10, Math.min(canvas.width - 10, e.clientX - rect.left));
    const y = Math.max(10, Math.min(canvas.height - 10, e.clientY - rect.top));

    setPoints(pts => pts.map((p, i) => i === activePt ? { x, y } : p));
  };

  const handleMouseUp = () => {
    setActivePt(null);
  };

  const activePointsList = splineType === 'bezier' ? points.slice(0, 4) : points;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <div className="w-full flex justify-between items-center mb-3">
            <h4 className="font-bold text-xs text-slate-600">Interactive {splineType === 'bezier' ? 'Cubic Bézier' : 'Cubic B-Spline'} Canvas</h4>
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setSplineType('bezier')}
                className={`px-3 py-1 rounded font-bold text-[10px] transition-all ${
                  splineType === 'bezier' ? 'bg-aast-navy text-white' : 'text-slate-600'
                }`}
              >
                Cubic Bézier
              </button>
              <button
                onClick={() => setSplineType('bspline')}
                className={`px-3 py-1 rounded font-bold text-[10px] transition-all ${
                  splineType === 'bspline' ? 'bg-aast-navy text-white' : 'text-slate-600'
                }`}
              >
                Cubic B-Spline
              </button>
            </div>
          </div>
          <canvas
            ref={canvasRef}
            width={400}
            height={280}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="border border-slate-200 bg-slate-50 rounded-lg shadow-inner cursor-pointer"
          />
          <span className="text-[10px] text-slate-400 font-semibold flex items-center space-x-1 mt-2">
            <Move className="h-3 w-3" />
            <span>Drag points {splineType === 'bezier' ? 'P₀ - P₃' : 'P₀ - P₄'}</span>
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <h4 className="font-bold text-aast-navy text-xs uppercase tracking-wider">Spline Mathematics</h4>
          
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-600">Cubic Polynomial Blending:</span>
            {splineType === 'bezier' ? (
              <div className="bg-slate-50 p-2.5 rounded border border-slate-100 text-[10px] font-mono text-slate-600 space-y-1">
                <p className="font-bold text-aast-navy">P(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃</p>
                <p className="text-[9px] text-slate-400">Where t ∈ [0, 1]. Sum of Bernstein coefficients = 1.</p>
              </div>
            ) : (
              <div className="bg-slate-50 p-2.5 rounded border border-slate-100 text-[10px] font-mono text-slate-600 space-y-1">
                <p className="font-bold text-aast-navy">Q_i(t) = ⅙[ (1-t)³P_i + (3t³ - 6t² + 4)P_{`{i+1}`} + (-3t³ + 3t² + 3t + 1)P_{`{i+2}`} + t³P_{`{i+3}`} ]</p>
                <p className="text-[9px] text-slate-400">Segment 0 (Navy) uses P₀-P₃. Segment 1 (Gold) uses P₁-P₄. t ∈ [0, 1].</p>
              </div>
            )}

            <span className="text-xs font-semibold text-slate-600">Current Control Points:</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {activePointsList.map((pt, idx) => (
                <div key={idx} className="bg-slate-100 p-2 rounded flex justify-between font-mono">
                  <span className="font-bold text-aast-navy">P{idx}</span>
                  <span>({Math.round(pt.x)}, {Math.round(pt.y)})</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[10px] text-amber-700 leading-relaxed">
            {splineType === 'bezier' ? (
              <p><strong>Bernstein Polynomials:</strong> Bézier curve blends control points. Observe how the curve starts tangent to line <strong>P₀P₁</strong> and ends tangent to line <strong>P₂P₃</strong>. <em>Moving any control point alters the entire curve shape globally.</em></p>
            ) : (
              <p><strong>B-Splines & Local Control:</strong> Notice that the curve does not touch the endpoints. Try dragging <strong>P₄</strong>: only the second segment (Gold) shifts, whereas the first segment (Navy) remains perfectly static! This demonstrates <strong>local control</strong>.</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
        <h4 className="font-bold text-xs text-aast-navy uppercase tracking-wider flex items-center space-x-1.5">
          <Cpu className="h-4 w-4 text-aast-gold" />
          <span>{splineType === 'bezier' ? 'Cubic Bézier' : 'Cubic B-Spline'} Spline Comparison & Continuity Rules</span>
        </h4>
        <div className="grid gap-4 md:grid-cols-2 text-xs text-slate-650 leading-relaxed font-medium">
          <div className="bg-white p-3 rounded-lg border border-slate-150">
            <span className="font-bold text-aast-navy block mb-1">Parametric & Geometric Continuity</span>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>C⁰ / G⁰ Continuity:</strong> Curve segments join together at a common boundary point.</li>
              <li><strong>C¹ Continuity:</strong> The first-order derivatives (tangent vectors) are equal at the junction, ensuring smooth velocity.</li>
              <li><strong>G¹ Continuity:</strong> Tangents point in the same direction, but their magnitudes can differ: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">P'(1) = k · Q'(0)</code>.</li>
              <li><strong>C² Continuity:</strong> Second-order derivatives match (curvature matches). B-Splines exhibit automatic C² continuity across segments. Bézier curves only have C² if control points are specifically aligned.</li>
            </ul>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-150">
            <span className="font-bold text-aast-navy block mb-1">Key Differences</span>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Global vs Local Control:</strong> Bézier curves lack local control; moving a single point alters the entire curve. B-Splines restrict control to local spans (order k spans).</li>
              <li><strong>Convex Hull Property:</strong> The curve is guaranteed to lie inside the boundary formed by the polygon vertices, protecting against out-of-bound errors.</li>
              <li><strong>Interpolation vs Approximation:</strong> Bézier curves interpolate (pass through) their first and last control points. B-Splines approximate control points and do not touch the endpoints.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const ORIGINAL_TRIANGLE: Point[] = [
  { x: 1, y: 1 },
  { x: 4, y: 1 },
  { x: 2, y: 3 },
];

export const Transform2DVisualizer: React.FC = () => {
  const [tx, setTx] = useState(2);
  const [ty, setTy] = useState(1);
  const [scale, setScale] = useState(1.5);
  const [angle, setAngle] = useState(45);

  const transformedTriangle = useMemo<Point[]>(() => {
    const rad = (angle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    return ORIGINAL_TRIANGLE.map(p => {
      // 1. Scale
      const sx = p.x * scale;
      const sy = p.y * scale;
      // 2. Rotate around origin
      const rx = sx * cos - sy * sin;
      const ry = sx * sin + sy * cos;
      // 3. Translate
      return {
        x: Number((rx + tx).toFixed(2)),
        y: Number((ry + ty).toFixed(2))
      };
    });
  }, [tx, ty, scale, angle]);

  // Canvas drawing
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const margin = 20;
    const cw = canvas.width;
    const ch = canvas.height;
    
    // Coordinate mapping: from [-6, 8] to canvas pixels
    const minCoord = -5;
    const maxCoord = 8;
    const range = maxCoord - minCoord;
    
    const toPxX = (x: number) => margin + ((x - minCoord) / range) * (cw - 2 * margin);
    const toPxY = (y: number) => ch - margin - ((y - minCoord) / range) * (ch - 2 * margin);

    // Draw Grid Lines
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let c = minCoord; c <= maxCoord; c++) {
      // vertical lines
      ctx.beginPath();
      ctx.moveTo(toPxX(c), toPxY(minCoord));
      ctx.lineTo(toPxX(c), toPxY(maxCoord));
      ctx.stroke();
      // horizontal lines
      ctx.beginPath();
      ctx.moveTo(toPxX(minCoord), toPxY(c));
      ctx.lineTo(toPxX(maxCoord), toPxY(c));
      ctx.stroke();
    }

    // Draw Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(toPxX(0), toPxY(minCoord));
    ctx.lineTo(toPxX(0), toPxY(maxCoord));
    ctx.stroke();
    // X-axis
    ctx.beginPath();
    ctx.moveTo(toPxX(minCoord), toPxY(0));
    ctx.lineTo(toPxX(maxCoord), toPxY(0));
    ctx.stroke();

    // Draw Original Shape
    ctx.fillStyle = 'rgba(148, 163, 184, 0.2)';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(toPxX(ORIGINAL_TRIANGLE[0].x), toPxY(ORIGINAL_TRIANGLE[0].y));
    ctx.lineTo(toPxX(ORIGINAL_TRIANGLE[1].x), toPxY(ORIGINAL_TRIANGLE[1].y));
    ctx.lineTo(toPxX(ORIGINAL_TRIANGLE[2].x), toPxY(ORIGINAL_TRIANGLE[2].y));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw Transformed Shape
    ctx.fillStyle = 'rgba(13, 44, 84, 0.25)'; // Navy semi-transparent
    ctx.strokeStyle = '#0d2c54'; // Navy
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(toPxX(transformedTriangle[0].x), toPxY(transformedTriangle[0].y));
    ctx.lineTo(toPxX(transformedTriangle[1].x), toPxY(transformedTriangle[1].y));
    ctx.lineTo(toPxX(transformedTriangle[2].x), toPxY(transformedTriangle[2].y));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Vertex points & labels
    transformedTriangle.forEach((pt) => {
      ctx.beginPath();
      ctx.arc(toPxX(pt.x), toPxY(pt.y), 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#c5a059'; // AAST Gold
      ctx.fill();
      ctx.strokeStyle = '#0d2c54';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#0d2c54';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`(${pt.x}, ${pt.y})`, toPxX(pt.x) + 6, toPxY(pt.y) - 6);
    });

  }, [transformedTriangle]);

  const rad = (angle * Math.PI) / 180;
  const cosVal = Number(Math.cos(rad).toFixed(2));
  const sinVal = Number(Math.sin(rad).toFixed(2));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-aast-navy text-sm">Matrix Operation Controls</h3>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span>Translation (Tx, Ty):</span>
              <span className="font-mono text-aast-navy font-bold">({tx}, {ty})</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="range"
                min="-4"
                max="4"
                step="1"
                value={tx}
                onChange={(e) => setTx(parseInt(e.target.value))}
                className="w-full accent-aast-navy"
              />
              <input
                type="range"
                min="-4"
                max="4"
                step="1"
                value={ty}
                onChange={(e) => setTy(parseInt(e.target.value))}
                className="w-full accent-aast-navy"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span>Scaling Factor (Sx = Sy):</span>
              <span className="font-mono text-aast-navy font-bold">{scale}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-full accent-aast-navy"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span>Rotation Angle (θ):</span>
              <span className="font-mono text-aast-navy font-bold">{angle}°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              step="15"
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value))}
              className="w-full accent-aast-navy"
            />
          </div>
        </div>

        {/* 3x3 Homogeneous Matrix Visual */}
        <div className="pt-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Homogeneous Combined Matrix [M]</span>
          <div className="flex items-center space-x-2 font-mono text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div className="text-[20px] font-light text-slate-300">[</div>
            <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-center flex-1">
              <span>{(cosVal * scale).toFixed(2)}</span>
              <span>{(-sinVal * scale).toFixed(2)}</span>
              <span>{tx}</span>
              
              <span>{(sinVal * scale).toFixed(2)}</span>
              <span>{(cosVal * scale).toFixed(2)}</span>
              <span>{ty}</span>
              
              <span>0</span>
              <span>0</span>
              <span>1</span>
            </div>
            <div className="text-[20px] font-light text-slate-300">]</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
        <h4 className="font-bold text-xs text-slate-600 mb-3 self-start">Affine transformation (Grid view)</h4>
        <canvas
          ref={canvasRef}
          width={350}
          height={320}
          className="border border-slate-200 bg-slate-50 rounded-lg shadow-inner"
        />
        <div className="mt-3 flex items-center space-x-3 text-[10px] text-slate-400 uppercase font-semibold">
          <div className="flex items-center space-x-1">
            <div className="h-3 w-3 bg-slate-200 border border-slate-300 rounded" />
            <span>Original</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-3 w-3 bg-aast-navy-soft border border-aast-navy rounded" />
            <span>Transformed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const COMPOSITE_SHAPE: Point[] = [
  { x: 1, y: 1 },
  { x: 3, y: 1 },
  { x: 3, y: 3 },
  { x: 1, y: 3 }
];

type Matrix3x3 = [
  [number, number, number],
  [number, number, number],
  [number, number, number]
];

const multiply3x3 = (A: Matrix3x3, B: Matrix3x3): Matrix3x3 => {
  const C = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ] as Matrix3x3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      C[r][c] = A[r][0] * B[0][c] + A[r][1] * B[1][c] + A[r][2] * B[2][c];
    }
  }
  return C;
};

const apply3x3 = (M: Matrix3x3, p: Point): Point => {
  const x = M[0][0] * p.x + M[0][1] * p.y + M[0][2];
  const y = M[1][0] * p.x + M[1][1] * p.y + M[1][2];
  const w = M[2][0] * p.x + M[2][1] * p.y + M[2][2];
  return {
    x: Number((x / (w || 1)).toFixed(2)),
    y: Number((y / (w || 1)).toFixed(2))
  };
};

export const CompositeTransformVisualizer: React.FC = () => {
  const [txType, setTxType] = useState<'rotation' | 'scaling' | 'shear' | 'reflection'>('rotation');
  const [px, setPx] = useState(3);
  const [py, setPy] = useState(2);
  const [angle, setAngle] = useState(45);
  const [sx, setSx] = useState(1.5);
  const [sy, setSy] = useState(1.5);
  const [shx, setShx] = useState(0.5);
  const [shy, setShy] = useState(0.0);
  const [reflectAxis, setReflectAxis] = useState<'x' | 'y' | 'y=x'>('x');
  const [step, setStep] = useState<0 | 1 | 2 | 3>(3);

  // Compute matrices based on inputs
  const mTranslateToOrigin: Matrix3x3 = useMemo(() => [
    [1, 0, -px],
    [0, 1, -py],
    [0, 0, 1]
  ], [px, py]);

  const mTranslateBack: Matrix3x3 = useMemo(() => [
    [1, 0, px],
    [0, 1, py],
    [0, 0, 1]
  ], [px, py]);

  const mRotate: Matrix3x3 = useMemo(() => {
    const rad = (angle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return [
      [cos, -sin, 0],
      [sin, cos, 0],
      [0, 0, 1]
    ];
  }, [angle]);

  const mScale: Matrix3x3 = useMemo(() => [
    [sx, 0, 0],
    [0, sy, 0],
    [0, 0, 1]
  ], [sx, sy]);

  const mShear: Matrix3x3 = useMemo(() => [
    [1, shx, 0],
    [shy, 1, 0],
    [0, 0, 1]
  ], [shx, shy]);

  const mReflect: Matrix3x3 = useMemo(() => {
    if (reflectAxis === 'x') {
      return [
        [1, 0, 0],
        [0, -1, 0],
        [0, 0, 1]
      ];
    } else if (reflectAxis === 'y') {
      return [
        [-1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
      ];
    } else {
      return [
        [0, 1, 0],
        [1, 0, 0],
        [0, 0, 1]
      ];
    }
  }, [reflectAxis]);

  // Intermediate shapes depending on type & pipeline step
  const step0 = COMPOSITE_SHAPE;
  
  const step1 = useMemo(() => {
    if (txType === 'rotation' || txType === 'scaling') {
      return COMPOSITE_SHAPE.map(p => apply3x3(mTranslateToOrigin, p));
    }
    return COMPOSITE_SHAPE;
  }, [txType, mTranslateToOrigin]);

  const step2 = useMemo(() => {
    if (txType === 'rotation') {
      return step1.map(p => apply3x3(mRotate, p));
    } else if (txType === 'scaling') {
      return step1.map(p => apply3x3(mScale, p));
    } else if (txType === 'shear') {
      return step0.map(p => apply3x3(mShear, p));
    } else {
      return step0.map(p => apply3x3(mReflect, p));
    }
  }, [txType, step1, step0, mRotate, mScale, mShear, mReflect]);

  const step3 = useMemo(() => {
    if (txType === 'rotation' || txType === 'scaling') {
      return step2.map(p => apply3x3(mTranslateBack, p));
    }
    return step2; // Same as step2 for Shear/Reflection (which are 1-step)
  }, [txType, step2, mTranslateBack]);

  const activePoints = step === 0 ? step0 : step === 1 ? step1 : step === 2 ? step2 : step3;

  const compositeMatrix: Matrix3x3 = useMemo(() => {
    if (txType === 'rotation') {
      return multiply3x3(mTranslateBack, multiply3x3(mRotate, mTranslateToOrigin));
    } else if (txType === 'scaling') {
      return multiply3x3(mTranslateBack, multiply3x3(mScale, mTranslateToOrigin));
    } else if (txType === 'shear') {
      return mShear;
    } else {
      return mReflect;
    }
  }, [txType, mTranslateToOrigin, mTranslateBack, mRotate, mScale, mShear, mReflect]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const margin = 25;
    const cw = canvas.width;
    const ch = canvas.height;
    
    // Grid bounds [-8, 8]
    const minCoord = -8;
    const maxCoord = 8;
    const range = maxCoord - minCoord;
    
    const toPxX = (x: number) => margin + ((x - minCoord) / range) * (cw - 2 * margin);
    const toPxY = (y: number) => ch - margin - ((y - minCoord) / range) * (ch - 2 * margin);

    // Draw Grid
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let c = minCoord; c <= maxCoord; c++) {
      ctx.beginPath();
      ctx.moveTo(toPxX(c), toPxY(minCoord));
      ctx.lineTo(toPxX(c), toPxY(maxCoord));
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(toPxX(minCoord), toPxY(c));
      ctx.lineTo(toPxX(maxCoord), toPxY(c));
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(toPxX(0), toPxY(minCoord));
    ctx.lineTo(toPxX(0), toPxY(maxCoord));
    ctx.stroke();
    // X-axis
    ctx.beginPath();
    ctx.moveTo(toPxX(minCoord), toPxY(0));
    ctx.lineTo(toPxX(maxCoord), toPxY(0));
    ctx.stroke();

    // If reflection, draw axis line helper
    if (txType === 'reflection') {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      if (reflectAxis === 'x') {
        ctx.beginPath();
        ctx.moveTo(toPxX(minCoord), toPxY(0));
        ctx.lineTo(toPxX(maxCoord), toPxY(0));
        ctx.stroke();
      } else if (reflectAxis === 'y') {
        ctx.beginPath();
        ctx.moveTo(toPxX(0), toPxY(minCoord));
        ctx.lineTo(toPxX(0), toPxY(maxCoord));
        ctx.stroke();
      } else {
        // y = x line
        ctx.beginPath();
        ctx.moveTo(toPxX(minCoord), toPxY(minCoord));
        ctx.lineTo(toPxX(maxCoord), toPxY(maxCoord));
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    // Draw original shape reference
    ctx.fillStyle = 'rgba(226, 232, 240, 0.4)';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(toPxX(step0[0].x), toPxY(step0[0].y));
    for (let i = 1; i < 4; i++) ctx.lineTo(toPxX(step0[i].x), toPxY(step0[i].y));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw active transformed shape
    ctx.fillStyle = 'rgba(13, 44, 84, 0.2)';
    ctx.strokeStyle = '#0d2c54';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(toPxX(activePoints[0].x), toPxY(activePoints[0].y));
    for (let i = 1; i < 4; i++) ctx.lineTo(toPxX(activePoints[i].x), toPxY(activePoints[i].y));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw pivot dot if applicable
    if (txType === 'rotation' || txType === 'scaling') {
      if (step !== 1 && step !== 2) {
        ctx.beginPath();
        ctx.arc(toPxX(px), toPxY(py), 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#ef4444'; // Red pivot
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText(`Pivot (${px},${py})`, toPxX(px) + 8, toPxY(py) + 3);
      } else {
        // Draw origin pivot reference
        ctx.beginPath();
        ctx.arc(toPxX(0), toPxY(0), 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#10b981'; // Green origin
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }
  }, [activePoints, px, py, step, step0, txType, reflectAxis]);

  const stepsLabel = txType === 'rotation' ? [
    'Original Object',
    'Translate to Origin (-Xr, -Yr)',
    'Rotate around Origin (θ)',
    'Translate Back to Pivot (Xr, Yr)'
  ] : txType === 'scaling' ? [
    'Original Object',
    'Translate to Origin (-Xr, -Yr)',
    'Scale relative to Origin (Sx, Sy)',
    'Translate Back to Pivot (Xr, Yr)'
  ] : txType === 'shear' ? [
    'Original Object',
    'Unused Step',
    'Shear (Shx, Shy)',
    'Finished Shear'
  ] : [
    'Original Object',
    'Unused Step',
    'Reflect about Axis',
    'Finished Reflection'
  ];

  const renderMatrix = (m: Matrix3x3) => {
    return (
      <div className="inline-grid grid-cols-3 gap-x-1.5 gap-y-1 bg-slate-550 border border-slate-200 p-1.5 rounded font-mono text-[9px] text-slate-750 font-bold relative before:content-['['] before:absolute before:left-0.5 before:-top-0.5 before:text-sm before:text-slate-400 after:content-[']'] after:absolute after:right-0.5 after:-top-0.5 after:text-sm after:text-slate-400 px-3">
        {m.map(row => row.map((val, idx) => (
          <span key={idx} className="w-10 text-center">{val.toFixed(2)}</span>
        )))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-aast-navy text-sm">2D Composition Controls</h3>
              <select
                value={txType}
                onChange={(e) => {
                  setTxType(e.target.value as 'rotation' | 'scaling' | 'shear' | 'reflection');
                  setStep(3);
                }}
                className="text-xs font-bold px-2 py-1 border border-slate-200 rounded text-slate-700 bg-slate-50"
              >
                <option value="rotation">Pivot Rotation</option>
                <option value="scaling">Fixed Scaling</option>
                <option value="shear">2D Shear</option>
                <option value="reflection">2D Reflection</option>
              </select>
            </div>
            
            {/* Mode Controls */}
            {txType === 'rotation' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Pivot Xr</label>
                    <input
                      type="number"
                      value={px}
                      onChange={(e) => setPx(parseInt(e.target.value) || 0)}
                      className="w-full text-xs font-semibold px-2 py-1 border border-slate-200 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Pivot Yr</label>
                    <input
                      type="number"
                      value={py}
                      onChange={(e) => setPy(parseInt(e.target.value) || 0)}
                      className="w-full text-xs font-semibold px-2 py-1 border border-slate-200 rounded"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Rotation Angle (θ):</span>
                    <span className="font-mono text-aast-navy font-bold">{angle}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="15"
                    value={angle}
                    onChange={(e) => setAngle(parseInt(e.target.value))}
                    className="w-full accent-aast-navy"
                  />
                </div>
              </div>
            )}

            {txType === 'scaling' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Fixed Xf</label>
                    <input
                      type="number"
                      value={px}
                      onChange={(e) => setPx(parseInt(e.target.value) || 0)}
                      className="w-full text-xs font-semibold px-2 py-1 border border-slate-200 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Fixed Yf</label>
                    <input
                      type="number"
                      value={py}
                      onChange={(e) => setPy(parseInt(e.target.value) || 0)}
                      className="w-full text-xs font-semibold px-2 py-1 border border-slate-200 rounded"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Scale Sx</label>
                    <input
                      type="number"
                      step="0.1"
                      value={sx}
                      onChange={(e) => setSx(parseFloat(e.target.value) || 1)}
                      className="w-full text-xs font-semibold px-2 py-1 border border-slate-200 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Scale Sy</label>
                    <input
                      type="number"
                      step="0.1"
                      value={sy}
                      onChange={(e) => setSy(parseFloat(e.target.value) || 1)}
                      className="w-full text-xs font-semibold px-2 py-1 border border-slate-200 rounded"
                    />
                  </div>
                </div>
              </div>
            )}

            {txType === 'shear' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Shear X (shx)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={shx}
                      onChange={(e) => setShx(parseFloat(e.target.value) || 0)}
                      className="w-full text-xs font-semibold px-2 py-1 border border-slate-200 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Shear Y (shy)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={shy}
                      onChange={(e) => setShy(parseFloat(e.target.value) || 0)}
                      className="w-full text-xs font-semibold px-2 py-1 border border-slate-200 rounded"
                    />
                  </div>
                </div>
              </div>
            )}

            {txType === 'reflection' && (
              <div className="space-y-3">
                <span className="text-xs text-slate-500 font-medium">Reflection Axis:</span>
                <div className="flex space-x-3">
                  {(['x', 'y', 'y=x'] as const).map((axis) => (
                    <label key={axis} className="flex items-center space-x-1.5 text-xs font-bold cursor-pointer text-slate-700">
                      <input
                        type="radio"
                        checked={reflectAxis === axis}
                        onChange={() => setReflectAxis(axis)}
                        className="text-aast-navy focus:ring-aast-navy"
                      />
                      <span>{axis === 'x' ? 'X-Axis (y=0)' : axis === 'y' ? 'Y-Axis (x=0)' : 'Line y = x'}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pipeline Trace Visualizer */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pipeline Matrix Math</span>
            <div className="flex flex-col space-y-2 border border-slate-100 p-2.5 rounded-lg bg-slate-50">
              {(txType === 'rotation' || txType === 'scaling') ? (
                <>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-aast-navy">M₁: T(-Xr, -Yr)</span>
                    {renderMatrix(mTranslateToOrigin)}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-aast-navy">M₂: {txType === 'rotation' ? 'Rotate(θ)' : 'Scale(S)'}</span>
                    {renderMatrix(txType === 'rotation' ? mRotate : mScale)}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-aast-navy">M₃: T(Xr, Yr)</span>
                    {renderMatrix(mTranslateBack)}
                  </div>
                </>
              ) : null}
              <div className="flex flex-wrap items-center gap-2 text-xs border-t border-slate-200 pt-2">
                <span className="font-extrabold text-aast-navy">M_composite:</span>
                {renderMatrix(compositeMatrix)}
              </div>
            </div>
          </div>

          {/* Pipeline Step Selector */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Animation Pipeline Steps</span>
            <div className="grid grid-cols-4 gap-1.5">
              {stepsLabel.map((_, idx) => (
                <button
                  key={idx}
                  disabled={(txType === 'shear' || txType === 'reflection') && (idx === 1 || idx === 2)}
                  onClick={() => setStep(idx as 0 | 1 | 2 | 3)}
                  className={`py-1 px-1.5 text-center text-[10px] font-bold rounded border transition-all flex flex-col items-center justify-center leading-none h-10 ${
                    ((txType === 'shear' || txType === 'reflection') && (idx === 1 || idx === 2)) 
                      ? 'opacity-30 cursor-not-allowed bg-slate-100 text-slate-400' 
                      : step === idx 
                      ? 'bg-aast-navy text-aast-gold border-aast-navy shadow' 
                      : 'bg-slate-50 text-slate-700 border-slate-150 hover:bg-slate-100'
                  }`}
                >
                  <span className="uppercase text-[8px] opacity-75 font-mono">Step {idx}</span>
                  <span className="truncate w-full mt-0.5">{idx === 0 ? 'Init' : idx === 1 ? 'Translate' : idx === 2 ? 'Transform' : 'TranslateBack'}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <h4 className="font-bold text-xs text-slate-600 mb-2 self-start">{stepsLabel[step]}</h4>
          <canvas
            ref={canvasRef}
            width={350}
            height={320}
            className="border border-slate-200 bg-slate-50 rounded-lg shadow-inner"
          />
          <div className="mt-3 flex items-center space-x-3 text-[10px] text-slate-400 uppercase font-semibold">
            <div className="flex items-center space-x-1">
              <div className="h-3 w-3 bg-slate-100 border border-slate-200 rounded" />
              <span>Original</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-3 w-3 bg-aast-navy-soft border border-aast-navy rounded" />
              <span>Active Step</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
        <h4 className="font-bold text-xs text-aast-navy uppercase tracking-wider flex items-center space-x-1.5">
          <Cpu className="h-4 w-4 text-aast-gold" />
          <span>Homogeneous Coordinate System & Composition Rules</span>
        </h4>
        <div className="grid gap-4 md:grid-cols-2 text-xs text-slate-650 leading-relaxed font-medium">
          <div className="bg-white p-3 rounded-lg border border-slate-150">
            <span className="font-bold text-aast-navy block mb-1">Homogeneous Coordinates (2D to 3D)</span>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Why homogeneous coordinates?</strong> Coordinates are expressed as 3-element vectors: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">[x, y, 1]ᵀ</code>. This allows translation to be written as a matrix multiplication, just like scaling and rotation.</li>
              <li>Allows nesting series of transformations into a single 3x3 compound matrix, avoiding multiplying vectors individually.</li>
              <li>Matrix dimensions: 2D transforms require 3x3 matrices; 3D transforms require 4x4 matrices.</li>
            </ul>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-150">
            <span className="font-bold text-aast-navy block mb-1">Non-Commutative Rule & Composition Order</span>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Order matters:</strong> Matrix multiplication is non-commutative: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">A × B ≠ B × A</code>. Rotating then translating yields a different result than translating then rotating.</li>
              <li>Compound calculations apply right-to-left: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">P' = (M_n × ... × M₂ × M₁) × P</code>. M₁ is applied first, then M₂, etc.</li>
              <li><strong>Pivot rotations/Fixed scaling:</strong> Rotate/scale about arbitrary coordinates requires first translating to origin, executing rotation/scaling, and translating back: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">T(Xr, Yr) × R(θ) × T(-Xr, -Yr)</code>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 9. 3D WIREFRAME PROJECTION (Week 11)
// ==========================================
const CUBE_VERTICES = [
  { x: -1, y: -1, z: -1 }, // 0
  { x: 1, y: -1, z: -1 },  // 1
  { x: 1, y: 1, z: -1 },   // 2
  { x: -1, y: 1, z: -1 },  // 3
  { x: -1, y: -1, z: 1 },  // 4
  { x: 1, y: -1, z: 1 },   // 5
  { x: 1, y: 1, z: 1 },    // 6
  { x: -1, y: 1, z: 1 }    // 7
];

const CUBE_EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 0],
  [4, 5], [5, 6], [6, 7], [7, 4],
  [0, 4], [1, 5], [2, 6], [3, 7]
];

// Matrix helpers for 3D computations
type Matrix4 = number[][];

const identity4 = (): Matrix4 => [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1]
];

const makeTranslation4 = (tx: number, ty: number, tz: number): Matrix4 => [
  [1, 0, 0, tx],
  [0, 1, 0, ty],
  [0, 0, 1, tz],
  [0, 0, 0,  1]
];

const multiply4x4 = (A: Matrix4, B: Matrix4): Matrix4 => {
  const C = Array(4).fill(0).map(() => Array(4).fill(0));
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      C[r][c] = A[r][0] * B[0][c] + A[r][1] * B[1][c] + A[r][2] * B[2][c] + A[r][3] * B[3][c];
    }
  }
  return C;
};

export const Transform3DVisualizer: React.FC = () => {
  const [rotationMode, setRotationMode] = useState<'standard' | 'arbitrary'>('standard');
  
  // Camera view angle states (Yaw/Pitch)
  const [viewPitch, setViewPitch] = useState(25);
  const [viewYaw, setViewYaw] = useState(35);
  
  // Standard mode rotation states
  const [rx, setRx] = useState(25);
  const [ry, setRy] = useState(35);
  const [rz, setRz] = useState(0);

  // Arbitrary axis rotation states
  const [axPoint, setAxPoint] = useState({ x: 0.5, y: 0.5, z: 0 });
  const [axDir, setAxDir] = useState({ x: 1, y: 1, z: 1 });
  const [theta, setTheta] = useState(45);

  const [distance, setDistance] = useState(4.0); // Camera distance for perspective projection
  const [projType, setProjType] = useState<'parallel' | 'perspective'>('perspective');

  // Compute normalized unit direction vector and intermediate angles
  const { ux, uy, uz, alphaDeg, betaDeg, dVal } = useMemo(() => {
    const { x, y, z } = axDir;
    const lenVal = Math.sqrt(x * x + y * y + z * z);
    if (lenVal < 1e-6) {
      return { ux: 0, uy: 0, uz: 1, len: 0, alphaDeg: 0, betaDeg: 0, dVal: 1 };
    }
    const uxVal = x / lenVal;
    const uyVal = y / lenVal;
    const uzVal = z / lenVal;
    
    // Tangent calculations
    const d = Math.sqrt(uyVal * uyVal + uzVal * uzVal);
    const alpha = d > 1e-6 ? Math.atan2(uyVal, uzVal) : 0;
    const beta = Math.atan2(-uxVal, d);

    return {
      ux: uxVal,
      uy: uyVal,
      uz: uzVal,
      len: lenVal,
      alphaDeg: Math.round((alpha * 180) / Math.PI),
      betaDeg: Math.round((beta * 180) / Math.PI),
      dVal: d
    };
  }, [axDir]);

  // Compute 5 step matrices & the final model rotation matrix
  const { steps, modelMatrix } = useMemo(() => {
    if (rotationMode === 'standard') {
      const radX = (rx * Math.PI) / 180;
      const radY = (ry * Math.PI) / 180;
      const radZ = (rz * Math.PI) / 180;

      const cosX = Math.cos(radX), sinX = Math.sin(radX);
      const cosY = Math.cos(radY), sinY = Math.sin(radY);
      const cosZ = Math.cos(radZ), sinZ = Math.sin(radZ);

      const Rx = [
        [1, 0, 0, 0],
        [0, cosX, -sinX, 0],
        [0, sinX, cosX, 0],
        [0, 0, 0, 1]
      ];
      const Ry = [
        [cosY, 0, sinY, 0],
        [0, 1, 0, 0],
        [-sinY, 0, cosY, 0],
        [0, 0, 0, 1]
      ];
      const Rz = [
        [cosZ, -sinZ, 0, 0],
        [sinZ, cosZ, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
      ];

      const m = multiply4x4(Rz, multiply4x4(Ry, Rx));
      return {
        steps: [Rx, Ry, Rz],
        modelMatrix: m
      };
    } else {
      const px = axPoint.x;
      const py = axPoint.y;
      const pz = axPoint.z;
      const radT = (theta * Math.PI) / 180;
      const cosT = Math.cos(radT), sinT = Math.sin(radT);

      // Step 1: Translation to origin T0
      const T0 = makeTranslation4(-px, -py, -pz);
      const T0_inv = makeTranslation4(px, py, pz);

      // Step 2: Rotate around X-axis by alpha
      let Rx = identity4();
      let Rx_inv = identity4();
      if (dVal > 1e-6) {
        const cosA = uz / dVal;
        const sinA = uy / dVal;
        Rx = [
          [1, 0, 0, 0],
          [0, cosA, -sinA, 0],
          [0, sinA, cosA, 0],
          [0, 0, 0, 1]
        ];
        Rx_inv = [
          [1, 0, 0, 0],
          [0, cosA, sinA, 0],
          [0, -sinA, cosA, 0],
          [0, 0, 0, 1]
        ];
      }

      // Step 3: Rotate around Y-axis by beta
      const cosB = dVal;
      const sinB = -ux;
      const Ry = [
        [cosB, 0, -sinB, 0],
        [0, 1, 0, 0],
        [sinB, 0, cosB, 0],
        [0, 0, 0, 1]
      ];
      const Ry_inv = [
        [cosB, 0, sinB, 0],
        [0, 1, 0, 0],
        [-sinB, 0, cosB, 0],
        [0, 0, 0, 1]
      ];

      // Step 4: Rotate around Z-axis by theta
      const Rz = [
        [cosT, -sinT, 0, 0],
        [sinT, cosT, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
      ];

      // Step 5: Reverse transformations
      const RyRxT0 = multiply4x4(Ry, multiply4x4(Rx, T0));
      const RzRyRxT0 = multiply4x4(Rz, RyRxT0);
      const RyInvRzRyRxT0 = multiply4x4(Ry_inv, RzRyRxT0);
      const RxInvRyInvRzRyRxT0 = multiply4x4(Rx_inv, RyInvRzRyRxT0);
      const m = multiply4x4(T0_inv, RxInvRyInvRzRyRxT0);

      // Composed Step 5 (for visualization)
      const Step5_invCombined = multiply4x4(T0_inv, multiply4x4(Rx_inv, Ry_inv));

      return {
        steps: [T0, Rx, Ry, Rz, Step5_invCombined],
        modelMatrix: m
      };
    }
  }, [rotationMode, rx, ry, rz, axPoint, theta, ux, uy, uz, dVal]);

  // Apply model rotation and view rotation to cube and axes
  const projectedVertices = useMemo(() => {
    const radPitch = (viewPitch * Math.PI) / 180;
    const radYaw = (viewYaw * Math.PI) / 180;
    const cosP = Math.cos(radPitch), sinP = Math.sin(radPitch);
    const cosY = Math.cos(radYaw), sinY = Math.sin(radYaw);

    const applyViewAndProject = (p: { x: number; y: number; z: number }) => {
      // 1. Rotate Yaw (Y)
      const x1 = p.x * cosY + p.z * sinY;
      const z1 = -p.x * sinY + p.z * cosY;

      // 2. Rotate Pitch (X)
      const y2 = p.y * cosP - z1 * sinP;
      const z2 = p.y * sinP + z1 * cosP;

      // 3. Project
      if (projType === 'perspective') {
        const factor = distance / (distance - z2);
        return { x: x1 * factor, y: y2 * factor, z: z2 };
      } else {
        return { x: x1, y: y2, z: z2 };
      }
    };

    // Transform Cube vertices
    const cubeTransformed = CUBE_VERTICES.map(v => {
      // Apply modelMatrix
      const x_m = modelMatrix[0][0]*v.x + modelMatrix[0][1]*v.y + modelMatrix[0][2]*v.z + modelMatrix[0][3];
      const y_m = modelMatrix[1][0]*v.x + modelMatrix[1][1]*v.y + modelMatrix[1][2]*v.z + modelMatrix[1][3];
      const z_m = modelMatrix[2][0]*v.x + modelMatrix[2][1]*v.y + modelMatrix[2][2]*v.z + modelMatrix[2][3];
      const w_m = modelMatrix[3][0]*v.x + modelMatrix[3][1]*v.y + modelMatrix[3][2]*v.z + modelMatrix[3][3] || 1;

      return applyViewAndProject({ x: x_m / w_m, y: y_m / w_m, z: z_m / w_m });
    });

    // Reference axes: X (red), Y (green), Z (blue)
    const axesTransformed = [
      { start: { x: 0, y: 0, z: 0 }, end: { x: 1.5, y: 0, z: 0 }, color: '#ef4444', label: 'X' },
      { start: { x: 0, y: 0, z: 0 }, end: { x: 0, y: 1.5, z: 0 }, color: '#22c55e', label: 'Y' },
      { start: { x: 0, y: 0, z: 0 }, end: { x: 0, y: 0, z: 1.5 }, color: '#3b82f6', label: 'Z' }
    ].map(axis => ({
      pStart: applyViewAndProject(axis.start),
      pEnd: applyViewAndProject(axis.end),
      color: axis.color,
      label: axis.label
    }));

    // Rotation Axis (if arbitrary mode)
    let rotAxisTransformed = null;
    if (rotationMode === 'arbitrary') {
      const p1 = {
        x: axPoint.x - 2 * ux,
        y: axPoint.y - 2 * uy,
        z: axPoint.z - 2 * uz
      };
      const p2 = {
        x: axPoint.x + 2 * ux,
        y: axPoint.y + 2 * uy,
        z: axPoint.z + 2 * uz
      };
      rotAxisTransformed = {
        pStart: applyViewAndProject(p1),
        pEnd: applyViewAndProject(p2),
        pPoint: applyViewAndProject(axPoint)
      };
    }

    return {
      cube: cubeTransformed,
      axes: axesTransformed,
      rotAxis: rotAxisTransformed
    };
  }, [modelMatrix, viewPitch, viewYaw, distance, projType, rotationMode, axPoint, ux, uy, uz]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const scale = 75; // Coordinate scale

    // Draw reference axes (X, Y, Z)
    ctx.lineWidth = 1.5;
    projectedVertices.axes.forEach(axis => {
      ctx.strokeStyle = axis.color;
      ctx.beginPath();
      ctx.moveTo(cx + axis.pStart.x * scale, cy - axis.pStart.y * scale);
      ctx.lineTo(cx + axis.pEnd.x * scale, cy - axis.pEnd.y * scale);
      ctx.stroke();

      // Draw label
      ctx.fillStyle = axis.color;
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText(axis.label, cx + axis.pEnd.x * scale + 4, cy - axis.pEnd.y * scale + 3);
    });

    // Draw arbitrary rotation axis if visible
    if (projectedVertices.rotAxis) {
      const rot = projectedVertices.rotAxis;
      ctx.strokeStyle = '#eab308'; // Gold
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(cx + rot.pStart.x * scale, cy - rot.pStart.y * scale);
      ctx.lineTo(cx + rot.pEnd.x * scale, cy - rot.pEnd.y * scale);
      ctx.stroke();
      ctx.setLineDash([]); // Reset

      // Draw pivot point indicator
      ctx.beginPath();
      ctx.arc(cx + rot.pPoint.x * scale, cy - rot.pPoint.y * scale, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#eab308';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#d97706';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('Axis Pivot P₀', cx + rot.pPoint.x * scale + 6, cy - rot.pPoint.y * scale - 4);
    }

    // Draw cube edges
    ctx.strokeStyle = '#0d2c54'; // AAST Navy
    ctx.lineWidth = 2;
    CUBE_EDGES.forEach(([u, v]) => {
      const p1 = projectedVertices.cube[u];
      const p2 = projectedVertices.cube[v];
      ctx.beginPath();
      ctx.moveTo(cx + p1.x * scale, cy - p1.y * scale);
      ctx.lineTo(cx + p2.x * scale, cy - p2.y * scale);
      ctx.stroke();
    });

    // Draw vertices
    projectedVertices.cube.forEach((p, idx) => {
      ctx.beginPath();
      ctx.arc(cx + p.x * scale, cy - p.y * scale, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#c5a059'; // AAST Gold
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#475569';
      ctx.font = 'bold 8px monospace';
      ctx.fillText(`V${idx}`, cx + p.x * scale + 5, cy - p.y * scale - 3);
    });

  }, [projectedVertices]);

  const renderMatrix4 = (M: Matrix4) => {
    return (
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-50 border border-slate-200 rounded font-mono text-[8px] text-slate-700 text-center w-full max-w-[170px] mx-auto">
        {M.map((row) =>
          row.map((val, cIdx) => (
            <div key={cIdx} className="bg-white py-0.5 border border-slate-100 rounded truncate" title={val.toFixed(4)}>
              {val.toFixed(2)}
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h3 className="font-bold text-aast-navy text-sm">3D Transformation Mode</h3>
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setRotationMode('standard')}
                className={`px-3 py-1 rounded font-bold text-[10px] transition-all ${
                  rotationMode === 'standard' ? 'bg-aast-navy text-white' : 'text-slate-650'
                }`}
              >
                Standard Axes
              </button>
              <button
                onClick={() => setRotationMode('arbitrary')}
                className={`px-3 py-1 rounded font-bold text-[10px] transition-all ${
                  rotationMode === 'arbitrary' ? 'bg-aast-navy text-white' : 'text-slate-650'
                }`}
              >
                Arbitrary Axis
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* View Camera Sliders */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-150">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-500">
                  <span>Camera Pitch:</span>
                  <span className="font-mono text-aast-navy">{viewPitch}°</span>
                </div>
                <input
                  type="range"
                  min="-90"
                  max="90"
                  value={viewPitch}
                  onChange={(e) => setViewPitch(parseInt(e.target.value))}
                  className="w-full accent-aast-navy"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-500">
                  <span>Camera Yaw:</span>
                  <span className="font-mono text-aast-navy">{viewYaw}°</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={viewYaw}
                  onChange={(e) => setViewYaw(parseInt(e.target.value))}
                  className="w-full accent-aast-navy"
                />
              </div>
            </div>

            {rotationMode === 'standard' ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>X-Axis Rotation:</span>
                    <span className="font-mono text-aast-navy font-bold">{rx}°</span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="5"
                    value={rx}
                    onChange={(e) => setRx(parseInt(e.target.value))}
                    className="w-full accent-aast-navy"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Y-Axis Rotation:</span>
                    <span className="font-mono text-aast-navy font-bold">{ry}°</span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="5"
                    value={ry}
                    onChange={(e) => setRy(parseInt(e.target.value))}
                    className="w-full accent-aast-navy"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Z-Axis Rotation:</span>
                    <span className="font-mono text-aast-navy font-bold">{rz}°</span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="5"
                    value={rz}
                    onChange={(e) => setRz(parseInt(e.target.value))}
                    className="w-full accent-aast-navy"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wide">Axis Definitions</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Pivot X₀</label>
                    <input
                      type="number"
                      step="0.1"
                      value={axPoint.x}
                      onChange={(e) => setAxPoint({ ...axPoint, x: parseFloat(e.target.value) || 0 })}
                      className="w-full text-xs font-semibold px-2 py-1 border border-slate-200 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Pivot Y₀</label>
                    <input
                      type="number"
                      step="0.1"
                      value={axPoint.y}
                      onChange={(e) => setAxPoint({ ...axPoint, y: parseFloat(e.target.value) || 0 })}
                      className="w-full text-xs font-semibold px-2 py-1 border border-slate-200 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Pivot Z₀</label>
                    <input
                      type="number"
                      step="0.1"
                      value={axPoint.z}
                      onChange={(e) => setAxPoint({ ...axPoint, z: parseFloat(e.target.value) || 0 })}
                      className="w-full text-xs font-semibold px-2 py-1 border border-slate-200 rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Vector U_x</label>
                    <input
                      type="number"
                      step="0.1"
                      value={axDir.x}
                      onChange={(e) => setAxDir({ ...axDir, x: parseFloat(e.target.value) || 0 })}
                      className="w-full text-xs font-semibold px-2 py-1 border border-slate-200 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Vector U_y</label>
                    <input
                      type="number"
                      step="0.1"
                      value={axDir.y}
                      onChange={(e) => setAxDir({ ...axDir, y: parseFloat(e.target.value) || 0 })}
                      className="w-full text-xs font-semibold px-2 py-1 border border-slate-200 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Vector U_z</label>
                    <input
                      type="number"
                      step="0.1"
                      value={axDir.z}
                      onChange={(e) => setAxDir({ ...axDir, z: parseFloat(e.target.value) || 0 })}
                      className="w-full text-xs font-semibold px-2 py-1 border border-slate-200 rounded"
                    />
                  </div>
                </div>

                <div className="p-2 bg-slate-100 border border-slate-200 rounded text-[9px] font-mono text-slate-500 flex justify-between items-center">
                  <span>Unit Axis Vector u:</span>
                  <span className="font-bold text-aast-navy">
                    [{ux.toFixed(2)}, {uy.toFixed(2)}, {uz.toFixed(2)}]ᵀ
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Rotation Angle (θ):</span>
                    <span className="font-mono text-aast-navy font-bold">{theta}°</span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="5"
                    value={theta}
                    onChange={(e) => setTheta(parseInt(e.target.value))}
                    className="w-full accent-aast-navy"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-2">
              <span className="text-slate-600 font-semibold">Projection Mode:</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setProjType('parallel')}
                  className={`px-3 py-1 font-bold text-xs rounded border ${
                    projType === 'parallel' ? 'bg-aast-navy text-aast-gold' : 'bg-slate-50 text-slate-600'
                  }`}
                >
                  Parallel
                </button>
                <button
                  onClick={() => setProjType('perspective')}
                  className={`px-3 py-1 font-bold text-xs rounded border ${
                    projType === 'perspective' ? 'bg-aast-navy text-aast-gold' : 'bg-slate-50 text-slate-600'
                  }`}
                >
                  Perspective
                </button>
              </div>
            </div>

            {projType === 'perspective' && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Projection Distance (d):</span>
                  <span className="font-mono text-aast-navy font-bold">{distance.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="8.0"
                  step="0.2"
                  value={distance}
                  onChange={(e) => setDistance(parseFloat(e.target.value))}
                  className="w-full accent-aast-navy"
                />
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <h4 className="font-bold text-xs text-slate-600 mb-2 self-start">3D Projection Canvas</h4>
          <canvas
            ref={canvasRef}
            width={350}
            height={320}
            className="border border-slate-200 bg-slate-50 rounded-lg shadow-inner"
          />
          <div className="mt-3 flex items-center space-x-3 text-[10px] text-slate-400 uppercase font-semibold">
            <span className="font-bold text-aast-navy">Vertices (V0-V7)</span>
            <div className="flex items-center space-x-1">
              <span className="h-2 w-2 rounded-full bg-[#ef4444]" /><span>X</span>
              <span className="h-2 w-2 rounded-full bg-[#22c55e]" /><span>Y</span>
              <span className="h-2 w-2 rounded-full bg-[#3b82f6]" /><span>Z</span>
              {rotationMode === 'arbitrary' && (
                <>
                  <span className="h-2 w-2 rounded-full bg-[#eab308]" /><span>Axis</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Step by step matrices display */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
        <h4 className="font-bold text-xs text-aast-navy uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-200 pb-2">
          <Layers className="h-4 w-4 text-aast-gold" />
          <span>Matrix Decomposition Pipeline & Math (4x4 Homogeneous Coordinate Space)</span>
        </h4>
        
        {rotationMode === 'standard' ? (
          <div className="space-y-3">
            <p className="text-xs text-slate-600">
              In Standard Mode, the final composed matrix is formed by rotating about the X axis, then Y axis, and then Z axis: 
              <code className="font-mono font-bold bg-slate-200 px-1 py-0.5 rounded ml-1 text-aast-navy">M = R_z(rz) × R_y(ry) × R_x(rx)</code>.
            </p>
            <div className="grid gap-4 sm:grid-cols-4 items-center">
              <div className="space-y-1">
                <span className="font-bold text-[9px] text-slate-450 block uppercase text-center">1. R_x({rx}°)</span>
                {renderMatrix4(steps[0])}
              </div>
              <div className="space-y-1">
                <span className="font-bold text-[9px] text-slate-450 block uppercase text-center">2. R_y({ry}°)</span>
                {renderMatrix4(steps[1])}
              </div>
              <div className="space-y-1">
                <span className="font-bold text-[9px] text-slate-450 block uppercase text-center">3. R_z({rz}°)</span>
                {renderMatrix4(steps[2])}
              </div>
              <div className="space-y-1 bg-amber-50 p-2 border border-amber-250 rounded">
                <span className="font-bold text-[9px] text-amber-800 block uppercase text-center">Composed Matrix</span>
                {renderMatrix4(modelMatrix)}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-2.5 bg-blue-50 border border-blue-200 text-[10px] text-blue-800 rounded leading-relaxed">
              <strong>Decomposition Pipeline:</strong> To rotate by angle <strong>θ ({theta}°)</strong> around an arbitrary axis, we:
              <ol className="list-decimal pl-4 mt-1 font-semibold space-y-0.5">
                <li>Translate the axis pivot point to the origin <code className="font-mono text-blue-900">T₀ = T(-{axPoint.x}, -{axPoint.y}, -{axPoint.z})</code>.</li>
                <li>Rotate the vector about X by <code className="font-mono text-blue-900">α ({alphaDeg}°)</code> into the XZ plane: <code className="font-mono text-blue-900">R_x(α)</code>.</li>
                <li>Rotate the vector about Y by <code className="font-mono text-blue-900">β ({betaDeg}°)</code> to align with Z-axis: <code className="font-mono text-blue-900">R_y(β)</code>.</li>
                <li>Perform rotation by <code className="font-mono text-blue-900">θ ({theta}°)</code> about the aligned Z-axis: <code className="font-mono text-blue-900">R_z(θ)</code>.</li>
                <li>Apply inverses in reverse order to return the axis: <code className="font-mono text-blue-900">M = T₀⁻¹ × R_x⁻¹ × R_y⁻¹ × R_z(θ) × R_y(β) × R_x(α) × T₀</code>.</li>
              </ol>
            </div>
            
            <div className="grid gap-3 sm:grid-cols-5 items-start">
              <div className="space-y-1">
                <span className="font-bold text-[9px] text-slate-450 block uppercase text-center" title="Translate pivot to origin">1. T₀</span>
                {renderMatrix4(steps[0])}
              </div>
              <div className="space-y-1">
                <span className="font-bold text-[9px] text-slate-450 block uppercase text-center" title="Rotate to XZ plane">2. R_x(α)</span>
                {renderMatrix4(steps[1])}
              </div>
              <div className="space-y-1">
                <span className="font-bold text-[9px] text-slate-450 block uppercase text-center" title="Align to Z axis">3. R_y(β)</span>
                {renderMatrix4(steps[2])}
              </div>
              <div className="space-y-1">
                <span className="font-bold text-[9px] text-slate-450 block uppercase text-center" title="Rotate about Z axis">4. R_z(θ)</span>
                {renderMatrix4(steps[3])}
              </div>
              <div className="space-y-1">
                <span className="font-bold text-[9px] text-slate-450 block uppercase text-center" title="Reverse alignment and translate back">5. Inverses (Step 5)</span>
                {renderMatrix4(steps[4])}
              </div>
            </div>
            
            <div className="bg-amber-50 p-3 border border-amber-250 rounded flex flex-col md:flex-row justify-between items-center gap-3">
              <div className="text-xs text-amber-800 font-semibold text-center md:text-left">
                <span>Final Composed Rotation Matrix:</span>
                <p className="text-[10px] text-amber-600 font-normal mt-0.5">Calculated by multiplying all 5 pipeline matrices together from right to left.</p>
              </div>
              <div>
                {renderMatrix4(modelMatrix)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// ==========================================
// 10. CRT SWEEP vs VECTOR STROKE (Week 1)
// ==========================================
export const CRTVectRasterVisualizer: React.FC = () => {
  const [mode, setMode] = useState<'raster' | 'vector'>('raster');
  const [resolution, setResolution] = useState<number>(8); // 8x8 or 16x16
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(150); // ms per step

  // Raster sweep coordinates
  const [rasterX, setRasterX] = useState<number>(0);
  const [rasterY, setRasterY] = useState<number>(0);
  const [isRetrace, setIsRetrace] = useState<boolean>(false);
  const [framebuffer, setFramebuffer] = useState<boolean[][]>(() => 
    Array(16).fill(null).map(() => Array(16).fill(false))
  );

  // Vector stroke indices
  const [vectorIdx, setVectorIdx] = useState<number>(0);
  const [vectorProgress, setVectorProgress] = useState<number>(0); // 0 to 1

  const vectorLines = useMemo(() => [
    { x1: 2, y1: 2, x2: 6, y2: 2 },
    { x1: 6, y1: 2, x2: 6, y2: 6 },
    { x1: 6, y1: 6, x2: 2, y2: 6 },
    { x1: 2, y1: 6, x2: 2, y2: 2 },
    { x1: 2, y1: 6, x2: 4, y2: 8 },
    { x1: 4, y1: 8, x2: 6, y2: 6 },
  ], []);

  // Reset function
  const handleReset = () => {
    setRasterX(0);
    setRasterY(0);
    setIsRetrace(false);
    setFramebuffer(Array(16).fill(null).map(() => Array(16).fill(false)));
    setVectorIdx(0);
    setVectorProgress(0);
  };

  // Check if pixel should be activated (circle mask target shape)
  const isTargetPixel = (x: number, y: number, res: number) => {
    const cx = res / 2;
    const cy = res / 2;
    const r = res * 0.35;
    const dist = Math.sqrt((x - cx + 0.5) ** 2 + (y - cy + 0.5) ** 2);
    return Math.abs(dist - r) < 0.8;
  };

  // Timer loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (mode === 'raster') {
        if (isRetrace) {
          // Vertical retrace finished, start at top
          setIsRetrace(false);
          setRasterX(0);
          setRasterY(0);
        } else {
          // Move electron beam to next pixel
          const nextX = rasterX + 1;
          if (nextX >= resolution) {
            const nextY = rasterY + 1;
            if (nextY >= resolution) {
              // Trigger vertical retrace
              setIsRetrace(true);
            } else {
              setRasterX(0);
              setRasterY(nextY);
            }
          } else {
            setRasterX(nextX);
          }
        }
      } else {
        // Vector stroke interpolation
        setVectorProgress((prev) => {
          const next = prev + 0.15;
          if (next >= 1.0) {
            setVectorIdx((prevIdx) => (prevIdx + 1) % vectorLines.length);
            return 0;
          }
          return next;
        });
      }
    }, speed);

    return () => clearInterval(interval);
  }, [isPlaying, mode, rasterX, rasterY, isRetrace, resolution, speed, vectorLines.length]);

  // Update framebuffer during raster sweep
  useEffect(() => {
    if (mode === 'raster' && !isRetrace) {
      const active = isTargetPixel(rasterX, rasterY, resolution);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFramebuffer((prev) => {
        const copy = prev.map(row => [...row]);
        copy[rasterY][rasterX] = active;
        return copy;
      });
    }
  }, [rasterX, rasterY, mode, resolution, isRetrace]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render animation canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 20;
    const cellSize = (canvas.width - padding * 2) / resolution;

    if (mode === 'raster') {
      // 1. Draw Grid boundary
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      for (let i = 0; i <= resolution; i++) {
        const pos = padding + i * cellSize;
        // Verticals
        ctx.beginPath();
        ctx.moveTo(pos, padding);
        ctx.lineTo(pos, canvas.height - padding);
        ctx.stroke();
        // Horizontals
        ctx.beginPath();
        ctx.moveTo(padding, pos);
        ctx.lineTo(canvas.width - padding, pos);
        ctx.stroke();
      }

      // 2. Draw Framebuffer active pixels
      for (let r = 0; r < resolution; r++) {
        for (let c = 0; c < resolution; c++) {
          if (framebuffer[r] && framebuffer[r][c]) {
            ctx.fillStyle = 'rgba(22, 163, 74, 0.7)'; // Glow green
            ctx.beginPath();
            ctx.arc(
              padding + c * cellSize + cellSize / 2,
              padding + r * cellSize + cellSize / 2,
              cellSize * 0.4,
              0,
              2 * Math.PI
            );
            ctx.fill();
            // Glow border
            ctx.strokeStyle = '#16a34a';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
      }

      // 3. Draw Scan Sweep Trace lines
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.6)';
      ctx.lineWidth = 1;
      for (let r = 0; r < rasterY; r++) {
        ctx.beginPath();
        ctx.moveTo(padding, padding + r * cellSize + cellSize / 2);
        ctx.lineTo(canvas.width - padding, padding + r * cellSize + cellSize / 2);
        ctx.stroke();
      }
      // Current row trace line
      ctx.strokeStyle = 'rgba(22, 163, 74, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(padding, padding + rasterY * cellSize + cellSize / 2);
      ctx.lineTo(padding + rasterX * cellSize + cellSize / 2, padding + rasterY * cellSize + cellSize / 2);
      ctx.stroke();

      // 4. Draw Electron Beam spot
      if (!isRetrace) {
        const bx = padding + rasterX * cellSize + cellSize / 2;
        const by = padding + rasterY * cellSize + cellSize / 2;
        
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#22c55e';
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(bx, by, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      } else {
        // Vertical Retrace dotted line
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(padding + (resolution - 1) * cellSize + cellSize / 2, padding + (resolution - 1) * cellSize + cellSize / 2);
        ctx.lineTo(padding + cellSize / 2, padding + cellSize / 2);
        ctx.stroke();
        ctx.setLineDash([]); // Reset
        
        // Retrace gun spot
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('VERTICAL RETRACE', padding + 10, padding + 15);
      }

    } else {
      // Vector stroke mode
      // Draw grid coordinates lightly
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 10; i++) {
        const pos = padding + i * ((canvas.width - padding * 2) / 10);
        ctx.beginPath();
        ctx.moveTo(pos, padding);
        ctx.lineTo(pos, canvas.height - padding);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(padding, pos);
        ctx.lineTo(canvas.width - padding, pos);
        ctx.stroke();
      }

      // Convert coordinates (0-10 scale) to canvas pixels
      const scaleX = (x: number) => padding + x * ((canvas.width - padding * 2) / 10);
      const scaleY = (y: number) => canvas.height - padding - y * ((canvas.height - padding * 2) / 10);

      // Draw all line commands already rendered
      ctx.strokeStyle = 'rgba(13, 44, 84, 0.15)'; // Faint navy
      ctx.lineWidth = 2;
      vectorLines.forEach((l) => {
        ctx.beginPath();
        ctx.moveTo(scaleX(l.x1), scaleY(l.y1));
        ctx.lineTo(scaleX(l.x2), scaleY(l.y2));
        ctx.stroke();
      });

      // Draw completed lines in full Navy
      ctx.strokeStyle = '#0d2c54';
      ctx.lineWidth = 3.5;
      for (let i = 0; i < vectorIdx; i++) {
        const l = vectorLines[i];
        ctx.beginPath();
        ctx.moveTo(scaleX(l.x1), scaleY(l.y1));
        ctx.lineTo(scaleX(l.x2), scaleY(l.y2));
        ctx.stroke();
      }

      // Draw active line under stroke
      const activeLine = vectorLines[vectorIdx];
      if (activeLine) {
        const curX = activeLine.x1 + (activeLine.x2 - activeLine.x1) * vectorProgress;
        const curY = activeLine.y1 + (activeLine.y2 - activeLine.y1) * vectorProgress;

        ctx.strokeStyle = '#16a34a'; // Laser green
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(scaleX(activeLine.x1), scaleY(activeLine.y1));
        ctx.lineTo(scaleX(curX), scaleY(curY));
        ctx.stroke();

        // Draw Electron gun tip
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#22c55e';
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(scaleX(curX), scaleY(curY), 5.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      }
    }
  }, [mode, resolution, framebuffer, rasterX, rasterY, isRetrace, vectorIdx, vectorProgress, vectorLines]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h3 className="font-bold text-aast-navy text-sm flex items-center space-x-2">
              <Tv className="h-4.5 w-4.5 text-aast-gold" />
              <span>CRT Deflection Sweep Control</span>
            </h3>
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => { setMode('raster'); handleReset(); }}
                className={`px-3 py-1 rounded font-bold text-[10px] transition-all ${
                  mode === 'raster' ? 'bg-aast-navy text-white' : 'text-slate-650'
                }`}
              >
                Raster-Scan Display
              </button>
              <button
                onClick={() => { setMode('vector'); handleReset(); }}
                className={`px-3 py-1 rounded font-bold text-[10px] transition-all ${
                  mode === 'vector' ? 'bg-aast-navy text-white' : 'text-slate-650'
                }`}
              >
                Random-Scan (Vector)
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-3 py-1.5 rounded flex items-center space-x-1 border font-bold text-[10px] ${
                    isPlaying ? 'bg-amber-500 text-white' : 'bg-aast-navy text-aast-gold'
                  }`}
                >
                  <Play className="h-3 w-3" />
                  <span>{isPlaying ? 'Pause Sweep' : 'Start Sweep'}</span>
                </button>
                <button
                  onClick={handleReset}
                  className="px-2 py-1.5 rounded border border-slate-200 bg-slate-50 text-slate-600 flex items-center space-x-1 text-[10px] font-bold"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              </div>

              {mode === 'raster' && (
                <div className="flex space-x-3">
                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      checked={resolution === 8}
                      onChange={() => { setResolution(8); handleReset(); }}
                      className="text-aast-navy"
                    />
                    <span>8x8 Grid</span>
                  </label>
                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      checked={resolution === 16}
                      onChange={() => { setResolution(16); handleReset(); }}
                      className="text-aast-navy"
                    />
                    <span>16x16 Grid</span>
                  </label>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Sweep Deflection Speed:</span>
                <span className="font-mono text-aast-navy font-bold">{speed} ms/step</span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="25"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-full accent-aast-navy"
              />
            </div>

            {/* Supplementary state visualizer */}
            {mode === 'raster' ? (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-aast-navy uppercase text-[10px] tracking-wide block">Refresh Buffer Address Trace</span>
                <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                  <div className="bg-white p-1.5 rounded border border-slate-100 flex justify-between">
                    <span className="text-slate-400">Beam Position (X, Y):</span>
                    <span className="font-bold text-slate-700">({rasterX}, {rasterY})</span>
                  </div>
                  <div className="bg-white p-1.5 rounded border border-slate-100 flex justify-between">
                    <span className="text-slate-400">Memory Offset:</span>
                    <span className="font-bold text-aast-navy">
                      0x{(rasterY * resolution + rasterX).toString(16).toUpperCase().padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-aast-navy uppercase text-[10px] tracking-wide block">Display List Commands (Vector)</span>
                <div className="font-mono text-[9px] bg-white border border-slate-150 rounded max-h-[85px] overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
                  {vectorLines.map((line, idx) => (
                    <div
                      key={idx}
                      className={`px-1.5 py-0.5 rounded flex justify-between ${
                        idx === vectorIdx ? 'bg-green-50 text-green-700 font-bold border-l-2 border-green-500' : 'text-slate-500'
                      }`}
                    >
                      <span>{idx === 0 ? 'MOVE' : 'DRAW'} TO ({line.x2}, {line.y2})</span>
                      <span className="text-[8px] text-slate-400">Cmd #{idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <h4 className="font-bold text-xs text-slate-650 mb-3 self-start">
            CRT Phosphor Screen ({mode === 'raster' ? `${resolution}x${resolution}` : 'Vector stroke'} simulation)
          </h4>
          <canvas
            ref={canvasRef}
            width={340}
            height={340}
            className="bg-black border-2 border-slate-800 rounded-xl shadow-2xl"
          />
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
        <h4 className="font-bold text-xs text-aast-navy uppercase tracking-wider flex items-center space-x-1.5">
          <Cpu className="h-4 w-4 text-aast-gold" />
          <span>Raster vs Vector Cathode Ray Tube Operations</span>
        </h4>
        <div className="grid gap-4 md:grid-cols-2 text-xs text-slate-650 leading-relaxed font-medium">
          <div className="bg-white p-3 rounded-lg border border-slate-150">
            <span className="font-bold text-aast-navy block mb-1">Deflection & Sweep Physics</span>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Beam Deflection:</strong> Relies on electro-magnetic deflection coils to generate precise magnetic fields, deflecting the high-velocity electron beam horizontally and vertically.</li>
              <li><strong>Raster Sweep:</strong> The beam intensity is modulated at each pixel. When a line sweep ends, horizontal retrace (off-beam return) triggers. After sweeping all lines, vertical retrace restarts the cycle from the top.</li>
              <li><strong>Vector Writing:</strong> Directly alters deflection voltages to steer the beam dynamically along designated coordinate line segments (no row-by-row sweeps).</li>
            </ul>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-150">
            <span className="font-bold text-aast-navy block mb-1">Refresh Rate & Memory Math</span>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Refresh Rate:</strong> Display frequency (e.g. 60Hz = 60 frames/sec) required to prevent visible human flicker.</li>
              <li><strong>Persistence:</strong> Phosphor crystal luminance duration. High persistence reduces flicker but causes blur/trails in animation.</li>
              <li><strong>Frame Buffer Memory size calculation:</strong>
                <div className="my-1.5 bg-slate-100 p-1.5 rounded font-mono text-[10px] text-aast-navy">
                  Size = Width × Height × Color Depth (bits)
                </div>
                For example, a 1024×768 resolution display operating at 24-bit True Color requires:
                <code className="font-mono block mt-1 bg-slate-100 px-1 py-0.5 rounded text-amber-700">1024 × 768 × 24 = 18,874,368 bits ≈ 2.25 Megabytes</code>.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 11. SCANLINE POLYGON FILLING (Week 2)
// ==========================================
interface EdgeNode {
  ymax: number;
  x: number;
  invSlope: number;
  id: string;
}

interface ActiveEdgeNode extends EdgeNode {
  currentX: number;
}

export const ScanLineVisualizer: React.FC = () => {
  const [currentY, setCurrentY] = useState<number>(4);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playSpeed = 1000; // ms per step

  const vertices: Point[] = useMemo(() => [
    { x: 2, y: 1 },
    { x: 5, y: 5 },
    { x: 8, y: 1 },
    { x: 10, y: 9 },
    { x: 6, y: 7 },
    { x: 4, y: 9 },
  ], []);

  // Compute Edge Table (ET) sorted by y_min
  const edgeTable = useMemo(() => {
    const et: { [key: number]: EdgeNode[] } = {};
    for (let i = 0; i < 12; i++) {
      et[i] = [];
    }

    for (let i = 0; i < vertices.length; i++) {
      const p1 = vertices[i];
      const p2 = vertices[(i + 1) % vertices.length];

      if (p1.y === p2.y) continue; // ignore horizontal edges

      const ymin = Math.min(p1.y, p2.y);
      const ymax = Math.max(p1.y, p2.y);
      const xVal = p1.y === ymin ? p1.x : p2.x;
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const invSlope = dx / dy;

      et[ymin].push({
        ymax,
        x: xVal,
        invSlope,
        id: `E${i+1}`
      });
    }

    // Sort each bucket by x
    for (let i = 0; i < 12; i++) {
      et[i].sort((a, b) => a.x - b.x);
    }
    return et;
  }, [vertices]);

  // Compute Active Edge Table (AET) history for scanlines 0-11
  const aetData = useMemo(() => {
    let aet: ActiveEdgeNode[] = [];
    const history: { [key: number]: ActiveEdgeNode[] } = {};

    for (let y = 0; y <= 11; y++) {
      // 1. Remove edges that expire (ymax == y)
      aet = aet.filter(edge => edge.ymax !== y);

      // 2. Add edges entering at ymin == y
      const newEdges = edgeTable[y] || [];
      newEdges.forEach(e => {
        aet.push({ ...e, currentX: e.x });
      });

      // 3. Sort AET by currentX
      aet.sort((a, b) => a.currentX - b.currentX);

      // Store AET state before moving to the next scanline
      history[y] = aet.map(e => ({ ...e }));

      // 4. Increment x coordinate for all active edges
      aet = aet.map(edge => ({
        ...edge,
        currentX: edge.currentX + edge.invSlope
      }));
      aet.sort((a, b) => a.currentX - b.currentX);
    }

    return history;
  }, [edgeTable]);

  const currentAET = aetData[currentY] || [];

  // Play animation loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentY(y => (y + 1) % 11);
    }, playSpeed);
    return () => clearInterval(interval);
  }, [isPlaying, playSpeed]);

  const isPixelFilled = (px: number, py: number) => {
    const aet = aetData[py] || [];
    for (let i = 0; i < aet.length; i += 2) {
      if (i + 1 < aet.length) {
        const xStart = Math.ceil(aet[i].currentX);
        const xEnd = Math.floor(aet[i+1].currentX);
        if (px >= xStart && px <= xEnd) {
          return true;
        }
      }
    }
    return false;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h3 className="font-bold text-aast-navy text-sm flex items-center space-x-2">
              <Activity className="h-4.5 w-4.5 text-aast-gold" />
              <span>Edge Table (ET) & Active Edge Table (AET)</span>
            </h3>
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-2 py-1 rounded font-bold text-[9px] transition-all ${
                  isPlaying ? 'bg-amber-500 text-white' : 'bg-aast-navy text-aast-gold'
                }`}
              >
                {isPlaying ? 'Pause' : 'Auto Play'}
              </button>
              <input
                type="range"
                min="0"
                max="10"
                value={currentY}
                onChange={(e) => { setCurrentY(parseInt(e.target.value)); setIsPlaying(false); }}
                className="w-20 accent-aast-navy"
              />
              <span className="font-mono font-bold text-xs text-aast-navy w-8 text-right">Y={currentY}</span>
            </div>
          </div>

          <div className="space-y-3">
            {/* Active Edge Table Rendering */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Active Edge Table (AET) at Y = {currentY}
              </span>
              {currentAET.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-400 bg-slate-50 border border-slate-150 rounded">
                  No active edges at this scanline height.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2.5">
                  {currentAET.map((edge, idx) => (
                    <div
                      key={idx}
                      className="bg-aast-navy text-white p-2 rounded-lg border border-aast-gold text-[10px] font-mono shadow-sm flex flex-col space-y-0.5"
                    >
                      <span className="font-bold text-aast-gold text-[11px]">{edge.id}</span>
                      <span>ymax: {edge.ymax}</span>
                      <span>curX: {edge.currentX.toFixed(2)}</span>
                      <span>1/m: {edge.invSlope.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Edge Table (ET) Bucket List */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Edge Table (ET) Structure
              </span>
              <div className="border border-slate-150 rounded-lg overflow-hidden max-h-[140px] overflow-y-auto custom-scrollbar font-mono text-[9px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 border-b border-slate-200">
                      <th className="p-1.5 w-10 text-center font-bold">Bucket</th>
                      <th className="p-1.5">Edge Nodes List [ ymax, x_val, 1/m ]</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array(12).fill(null).map((_, yIdx) => {
                      const bucketIdx = 11 - yIdx; // Render descending
                      const bucketEdges = edgeTable[bucketIdx] || [];
                      const isActiveRow = currentY === bucketIdx;
                      return (
                        <tr
                          key={bucketIdx}
                          className={`border-b border-slate-100 hover:bg-slate-50 ${
                            isActiveRow ? 'bg-amber-50 font-bold border-l-4 border-l-amber-500' : ''
                          }`}
                        >
                          <td className="p-1.5 text-center font-bold text-slate-500 border-r border-slate-100">
                            ET[{bucketIdx}]
                          </td>
                          <td className="p-1.5 flex gap-2 overflow-x-auto">
                            {bucketEdges.length === 0 ? (
                              <span className="text-slate-350">NIL</span>
                            ) : (
                              bucketEdges.map((e, idx) => (
                                <span
                                  key={idx}
                                  className="bg-slate-150 px-1.5 py-0.5 rounded text-slate-700 border border-slate-200"
                                >
                                  {e.id} [ ymax:{e.ymax}, x:{e.x}, 1/m:{e.invSlope.toFixed(2)} ]
                                </span>
                              ))
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Scanline Grid Visualization */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center relative">
          <h4 className="font-bold text-xs text-slate-650 mb-3 self-start">Plotted Grid (12x12 Cartesian Coordinate Space)</h4>
          
          <div className="relative border border-slate-300 rounded p-1.5 bg-slate-50">
            {/* SVG Polygon overlay and scanline representation */}
            <svg
              className="absolute top-1.5 left-1.5 pointer-events-none"
              width={264} // 12 columns * 22px
              height={264} // 12 rows * 22px
              viewBox="0 0 12 12"
            >
              {/* Polygon Outline */}
              <polygon
                points={vertices.map(v => `${v.x},${12 - v.y}`).join(' ')}
                fill="rgba(13, 44, 84, 0.06)"
                stroke="#0d2c54"
                strokeWidth="0.12"
              />

              {/* Grid vertex circles */}
              {vertices.map((v, i) => (
                <circle
                  key={i}
                  cx={v.x}
                  cy={12 - v.y}
                  r="0.25"
                  fill="#c5a059"
                  stroke="#ffffff"
                  strokeWidth="0.05"
                />
              ))}

              {/* Active scanline representation */}
              <line
                x1="0"
                y1={11.5 - currentY}
                x2="12"
                y2={11.5 - currentY}
                stroke="#ef4444"
                strokeWidth="0.15"
              />

              {/* Intersection red circles */}
              {currentAET.map((edge, idx) => (
                <circle
                  key={idx}
                  cx={edge.currentX}
                  cy={11.5 - currentY}
                  r="0.2"
                  fill="#ef4444"
                  stroke="#ffffff"
                  strokeWidth="0.04"
                />
              ))}
            </svg>

            {/* Cartesian grid of pixel boxes */}
            <div className="grid grid-cols-12 gap-[1px]">
              {Array(12).fill(null).map((_, rIdx) => {
                const actualY = 11 - rIdx;
                return Array(12).fill(null).map((_, cIdx) => {
                  const actualX = cIdx;
                  const filled = isPixelFilled(actualX, actualY);
                  const isCurrentRow = actualY === currentY;
                  return (
                    <div
                      key={`${actualX}-${actualY}`}
                      title={`Pixel: (${actualX}, ${actualY})`}
                      className={`h-5 w-5 border transition-all duration-300 text-[6px] text-slate-300 text-center flex items-center justify-center ${
                        filled 
                          ? 'bg-aast-navy border-aast-gold text-white font-bold' 
                          : 'bg-white border-slate-100 hover:bg-slate-100'
                      } ${isCurrentRow ? 'bg-red-50 border-red-200' : ''}`}
                    >
                      {actualX},{actualY}
                    </div>
                  );
                });
              })}
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-3 text-[10px] text-slate-400 uppercase font-semibold">
            <span className="flex items-center space-x-1">
              <span className="h-2.5 w-2.5 bg-aast-navy border border-aast-gold rounded-sm" />
              <span>Filled Pixel</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="h-0.5 w-3 bg-[#ef4444]" />
              <span>Scanline Y</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
              <span>Edge Intersect</span>
            </span>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
        <h4 className="font-bold text-xs text-aast-navy uppercase tracking-wider flex items-center space-x-1.5">
          <Cpu className="h-4 w-4 text-aast-gold" />
          <span>Scanline filling Odd-Parity & Sorting Rules</span>
        </h4>
        <div className="grid gap-4 md:grid-cols-2 text-xs text-slate-650 leading-relaxed font-medium">
          <div className="bg-white p-3 rounded-lg border border-slate-150">
            <span className="font-bold text-aast-navy block mb-1">Odd-Even Parity Rule</span>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Parity Bit check:</strong> Step from left to right along the scanline. For every edge intersection, flip the parity bit (0 or 1).</li>
              <li>Paint pixels only when parity is **1 (Odd)**, and stop painting when parity returns to **0 (Even)**.</li>
              <li><strong>Vertex cases:</strong> Local minima/maxima contribute 2 intersections (preserving parity). Non-extreme vertices contribute 1 intersection (shorten the incoming edge by 1 in Y to count the vertex once).</li>
            </ul>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-150">
            <span className="font-bold text-aast-navy block mb-1">Bucket Sorting (ET & AET)</span>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Edge Table (ET):</strong> Pre-sorts all non-horizontal edges by their {"y_{min}"} values. This avoids checking inactive edges on every scanline.</li>
              <li><strong>Active Edge Table (AET):</strong> Stores only the edges currently intersecting the active scanline $Y$, sorted by current $x$ coordinate.</li>
              <li><strong>AET Update loop:</strong> For scanline $Y + 1$, increment $x \leftarrow x + 1/m$, filter out expired edges ($Y \ge$ {"y_{max}"}), append new edges entering at {"y_{min} = Y + 1"}, and re-sort by $x$.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};


// ==========================================
// BACKWARD COMPATIBLE EMPTY SANDBOX WRAPPER
// ==========================================
export const Demos: React.FC = () => {
  return (
    <div className="p-4 text-center text-slate-500 font-semibold">
      All visualizers have been integrated directly inside their respective syllabus weeks in the Lectures & Sheets timeline.
    </div>
  );
};
