import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { CALIBRATION_DATA } from '../services/mockData';

interface ProbabilityChartProps {
  currentSimilitud?: number;
  currentProbabilidad?: number;
  umbral?: number;
}

export const ProbabilityChart: React.FC<ProbabilityChartProps> = ({
  currentSimilitud,
  currentProbabilidad,
  umbral = 0.75,
}) => {
  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Curva de Calibración: Similitud vs. Probabilidad Real
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Diferencia entre métrica vectorial (Coseno) y probabilidad estimada por Machine Learning.
          </p>
        </div>

        {currentSimilitud !== undefined && (
          <div className="bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-3 text-xs">
            <div>
              <span className="text-slate-400">Similitud:</span>{' '}
              <strong className="text-cyan-400 font-mono">{currentSimilitud.toFixed(2)}</strong>
            </div>
            <div className="border-l border-slate-700 pl-3">
              <span className="text-slate-400">P. Calibrada:</span>{' '}
              <strong className="text-emerald-400 font-mono">
                {currentProbabilidad !== undefined ? `${(currentProbabilidad * 100).toFixed(0)}%` : 'N/A'}
              </strong>
            </div>
          </div>
        )}
      </div>

      <div className="w-full min-h-[260px] h-[260px]">
        <ResponsiveContainer width="100%" height={260} minHeight={240}>
          <LineChart
            data={CALIBRATION_DATA}
            margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis
              dataKey="similitud"
              stroke="#94a3b8"
              fontSize={11}
              domain={[0.3, 1]}
              tickFormatter={(v) => (typeof v === 'number' ? v.toFixed(2) : String(v))}
              label={{ value: 'Similitud Matemática (Coseno)', position: 'insideBottom', offset: -4, fill: '#64748b', fontSize: 10 }}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              domain={[0, 1]}
              tickFormatter={(v) => (typeof v === 'number' ? `${(v * 100).toFixed(0)}%` : String(v))}
              label={{ value: 'Probabilidad ML', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-950 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs space-y-1">
                      <p className="text-slate-300 font-medium font-mono">
                        Similitud: <span className="text-cyan-400 font-bold">{data.similitud}</span>
                      </p>
                      <p className="text-slate-300 font-medium font-mono">
                        Prob. Calibrada: <span className="text-emerald-400 font-bold">{(data.probabilidad * 100).toFixed(1)}%</span>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Decisión: <span className="text-slate-200">{data.decision}</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine
              x={umbral}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              label={{ value: `Umbral (${umbral})`, fill: '#f59e0b', fontSize: 10, position: 'top' }}
            />
            <Line
              type="monotone"
              dataKey="probabilidad"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ fill: '#818cf8', r: 4 }}
              activeDot={{ r: 6, fill: '#38bdf8' }}
              name="Probabilidad Calibrada"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
        <div className="flex items-start gap-1.5">
          <span className="text-cyan-400 font-bold">•</span>
          <span>
            <strong>Similitud (Deep Learning):</strong> Medida geométrica del ángulo entre vectores faciales (InsightFace/ArcFace).
          </span>
        </div>
        <div className="flex items-start gap-1.5">
          <span className="text-indigo-400 font-bold">•</span>
          <span>
            <strong>Probabilidad (Machine Learning):</strong> Calibración empírica con scikit-learn incorporando calidad y ruido de luz.
          </span>
        </div>
      </div>
    </div>
  );
};
