
import React, { useState } from 'react';
import LiquidBackground from './components/LiquidBackground';
import { checkPhishing } from './services/api';
import { analyzeUrlWithAI } from './services/gemini';
import { PredictionStatus, PredictionResult, AIAnalysis } from './types';

const App: React.FC = () => {
  console.log(
    'VITE_API_BASE =',
    import.meta.env.VITE_API_BASE
  );
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<PredictionStatus>(PredictionStatus.IDLE);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setStatus(PredictionStatus.LOADING);
    setError(null);
    setResult(null);
    setAiAnalysis(null);

    try {
      // 1. Backend Detection
      const prediction = await checkPhishing(url);
      setResult(prediction);

      // 2. AI Threat Analysis
      const analysis = await analyzeUrlWithAI(url, prediction.isPhishing);
      setAiAnalysis(analysis);

      setStatus(PredictionStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || 'Detection service unavailable. Please try again later.');
      setStatus(PredictionStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 pb-24">
      <LiquidBackground />

      <div className="w-full max-w-xl bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-700">
        <header className="text-center mb-8">
          <div className="inline-block px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] tracking-widest uppercase mb-4 text-white/50 font-bold">
            Security Intelligence
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-2 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            PhishGuard AI
          </h1>
          <p className="text-gray-500 text-sm font-light">
            Enter a URL to verify its legitimacy using our neural detection engine.
          </p>
        </header>

        <form onSubmit={handleCheck} className="relative group mb-6">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-gray-700 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all group-hover:bg-white/10"
            disabled={status === PredictionStatus.LOADING}
          />
          <button
            type="submit"
            disabled={status === PredictionStatus.LOADING}
            className="absolute right-2 top-2 bottom-2 bg-white text-black font-bold px-6 rounded-xl transition-all hover:bg-gray-200 active:scale-95 disabled:opacity-50"
          >
            {status === PredictionStatus.LOADING ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : 'Analyze'}
          </button>
        </form>

        <div className="space-y-4">
          {status === PredictionStatus.SUCCESS && result && (
            <div className={`p-6 rounded-2xl border transition-colors duration-500 ${result.isPhishing ? 'bg-red-500/5 border-red-500/30' : 'bg-emerald-500/5 border-emerald-500/30'
              }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-2 h-2 rounded-full animate-pulse ${result.isPhishing ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-emerald-500 shadow-[0_0_10px_emerald]'}`} />
                <h2 className={`text-lg font-bold tracking-tight ${result.isPhishing ? 'text-red-400' : 'text-emerald-400'}`}>
                  {result.isPhishing ? 'Phishing Detected' : 'Verified Legitimate'}
                </h2>
              </div>

              {aiAnalysis && (
                <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-500">
                  <p className="text-xs text-gray-300 leading-relaxed italic">
                    "{aiAnalysis.summary}"
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {aiAnalysis.reasons.slice(0, 3).map((reason, i) => (
                      <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] text-gray-400">
                        {reason}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-tighter">Threat Level</div>
                      <div className={`text-sm font-bold ${aiAnalysis.threatLevel === 'High' ? 'text-red-500' : 'text-emerald-500'}`}>
                        {aiAnalysis.threatLevel}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-gray-500 uppercase tracking-tighter">Recommendation</div>
                      <div className="text-[11px] text-gray-200">{aiAnalysis.recommendation}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {status === PredictionStatus.ERROR && (
            <div className="p-4 bg-red-900/20 border border-red-500/20 rounded-xl text-red-400 text-[11px] text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
