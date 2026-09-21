import React, { useState, useEffect } from 'react';
import { ProbabilityChart } from '../components/ProbabilityChart';
import { apiService } from '../services/api';
import type { MLMetrics } from '../types/facial';
import {
  TrendingUp,
  BrainCircuit,
  RefreshCw,
  Sliders,
  AlertCircle,
} from 'lucide-react';

export const Probabilidades: React.FC = () => {
  const [metrics, setMetrics] = useState<MLMetrics | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('LogisticRegression');
  const [isTraining, setIsTraining] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Simulador interactivo de calibración
  const [similitudInput, setSimilitudInput] = useState<number>(0.82);
  const [calidadInput, setCalidadInput] = useState<string>('Buena');
  const [iluminacionInput, setIluminacionInput] = useState<string>('Alta');
  const [probabilidadCalculada, setProbabilidadCalculada] = useState<number>(0.88);

  useEffect(() => {
    loadMetrics();
  }, []);

  useEffect(() => {
    try {
      const prob = apiService.calculateCalibratedProbability(
        similitudInput,
        calidadInput,
        iluminacionInput
      );
      setProbabilidadCalculada(prob);
    } catch (err) {
      console.error('Error calculando probabilidad:', err);
    }
  }, [similitudInput, calidadInput, iluminacionInput]);

  const loadMetrics = async () => {
    try {
      const data = await apiService.getMetrics();
      setMetrics(data);
      setErrorMsg(null);
    } catch (err: any) {
      console.error('Error cargando métricas ML:', err);
      setErrorMsg('No se pudieron obtener las métricas del modelo desde la API.');
    }
  };

  const handleRetrain = async () => {
    setIsTraining(true);
    setErrorMsg(null);
    try {
      const res = await apiService.trainModel(selectedModel);
      if (res && res.metrics) {
        setMetrics(res.metrics);
      }
    } catch (err: any) {
      console.error('Error al reentrenar modelo:', err);
      setErrorMsg('Error durante el entrenamiento del modelo.');
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-400" />
          Laboratorio de Machine Learning & Calibración de Probabilidades
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Análisis del modelo clasificador que transforma la similitud coseno y variables ambientales en probabilidades estadísticas calibradas.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Gráfico y Simulador de Calibración */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <ProbabilityChart
            currentSimilitud={similitudInput}
            currentProbabilidad={probabilidadCalculada}
            umbral={0.75}
          />
        </div>

        {/* Simulador Interactivo de Inferencia */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Simulador de Calibración
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Prueba cómo la calidad y la iluminación alteran la certeza estadística de la predicción:
            </p>
          </div>

          {/* Control Similitud Coseno */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-medium">Similitud Coseno de Entrada</span>
              <span className="font-mono text-cyan-400 font-bold">{similitudInput.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.30"
              max="0.99"
              step="0.01"
              value={similitudInput}
              onChange={(e) => setSimilitudInput(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Calidad de Imagen */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium block">
              Calidad de la Fotografía
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Baja', 'Buena', 'Alta'].map((cal) => (
                <button
                  key={cal}
                  type="button"
                  onClick={() => setCalidadInput(cal)}
                  className={`py-1.5 text-xs font-medium rounded-lg border transition cursor-pointer ${
                    calidadInput === cal
                      ? 'bg-cyan-950 border-cyan-700 text-cyan-300'
                      : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {cal}
                </button>
              ))}
            </div>
          </div>

          {/* Nivel de Iluminación */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium block">
              Iluminación de la Escena
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Baja', 'Media', 'Alta'].map((ilu) => (
                <button
                  key={ilu}
                  type="button"
                  onClick={() => setIluminacionInput(ilu)}
                  className={`py-1.5 text-xs font-medium rounded-lg border transition cursor-pointer ${
                    iluminacionInput === ilu
                      ? 'bg-indigo-950 border-indigo-700 text-indigo-300'
                      : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {ilu}
                </button>
              ))}
            </div>
          </div>

          {/* Resultado Calibrado */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">Probabilidad Calibrada Resultante:</span>
              <span className="text-xs font-medium text-slate-300">
                {probabilidadCalculada >= 0.75 ? 'Alta Confiabilidad' : 'Incertidumbre / Rechazo'}
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {(probabilidadCalculada * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      {/* Métricas del Modelo de Machine Learning */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-indigo-400" />
              Métricas de Evaluación del Clasificador ML
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Rendimiento estadístico sobre el conjunto de validación histórico.
            </p>
          </div>

          {/* Selector de Modelo y Botón de Reentrenamiento */}
          <div className="flex items-center gap-2">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="LogisticRegression">Regresión Logística</option>
              <option value="RandomForest">Random Forest</option>
              <option value="GradientBoosting">Gradient Boosting</option>
            </select>

            <button
              onClick={handleRetrain}
              disabled={isTraining}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTraining ? 'animate-spin' : ''}`} />
              {isTraining ? 'Entrenando...' : 'Reentrenar'}
            </button>
          </div>
        </div>

        {/* Tarjetas de Métricas Estadísticas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block">Precisión (Precision)</span>
            <span className="text-xl font-bold font-mono text-cyan-400 mt-1 block">
              {metrics?.precision !== undefined ? (metrics.precision * 100).toFixed(1) + '%' : '--'}
            </span>
            <span className="text-[10px] text-slate-500">Mínimos falsos positivos</span>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block">Sensibilidad (Recall)</span>
            <span className="text-xl font-bold font-mono text-indigo-400 mt-1 block">
              {metrics?.recall !== undefined ? (metrics.recall * 100).toFixed(1) + '%' : '--'}
            </span>
            <span className="text-[10px] text-slate-500">Capacidad de detección</span>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block">F1-Score</span>
            <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
              {metrics?.f1_score !== undefined ? (metrics.f1_score * 100).toFixed(1) + '%' : '--'}
            </span>
            <span className="text-[10px] text-slate-500">Media armónica</span>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block">ROC - AUC</span>
            <span className="text-xl font-bold font-mono text-amber-400 mt-1 block">
              {metrics?.roc_auc !== undefined ? metrics.roc_auc.toFixed(3) : '--'}
            </span>
            <span className="text-[10px] text-slate-500">Separabilidad global</span>
          </div>
        </div>

        {/* Matriz de Confusión */}
        {metrics?.matriz_confusion && (
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
            <h4 className="text-xs font-semibold text-slate-300 mb-3 font-mono uppercase tracking-wider">
              Matriz de Confusión ({metrics.total_muestras ?? 0} muestras analizadas)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-emerald-950/40 border border-emerald-800/60 p-3 rounded-lg">
                <span className="text-[11px] text-emerald-400 font-medium block">Verdaderos Positivos</span>
                <span className="text-lg font-mono font-bold text-white mt-1 block">
                  {metrics.matriz_confusion.verdaderos_positivos ?? 0}
                </span>
              </div>
              <div className="bg-rose-950/40 border border-rose-800/60 p-3 rounded-lg">
                <span className="text-[11px] text-rose-400 font-medium block">Falsos Positivos (Alarma)</span>
                <span className="text-lg font-mono font-bold text-white mt-1 block">
                  {metrics.matriz_confusion.falsos_positivos ?? 0}
                </span>
              </div>
              <div className="bg-slate-900 border border-slate-850 p-3 rounded-lg">
                <span className="text-[11px] text-slate-400 font-medium block">Verdaderos Negativos</span>
                <span className="text-lg font-mono font-bold text-white mt-1 block">
                  {metrics.matriz_confusion.verdaderos_negativos ?? 0}
                </span>
              </div>
              <div className="bg-amber-950/40 border border-amber-800/60 p-3 rounded-lg">
                <span className="text-[11px] text-amber-400 font-medium block">Falsos Negativos (Omisión)</span>
                <span className="text-lg font-mono font-bold text-white mt-1 block">
                  {metrics.matriz_confusion.falsos_negativos ?? 0}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
