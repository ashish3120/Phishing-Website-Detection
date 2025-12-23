import React from "react";
import { PredictionResult, AIAnalysis } from "../types";
import "./resultAnimations.css";

interface Props {
    result: PredictionResult;
    aiAnalysis: AIAnalysis | null;
}

const ResultCard: React.FC<Props> = ({ result, aiAnalysis }) => {
    const isPhishing = result.isPhishing;

    return (
        <div
            className={`relative mt-6 p-6 rounded-3xl border backdrop-blur-xl animate-rise ${isPhishing
                    ? "bg-red-500/10 border-red-500/30 animate-soft-pulse"
                    : "bg-emerald-500/10 border-emerald-500/30"
                }`}
        >
            {/* Top glow accent */}
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div
                    className={`w-2.5 h-2.5 rounded-full ${isPhishing
                            ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)]"
                            : "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.9)]"
                        }`}
                />
                <h2
                    className={`text-lg font-bold tracking-tight ${isPhishing ? "text-red-400" : "text-emerald-400"
                        }`}
                >
                    {isPhishing ? "⚠ Phishing Risk Detected" : "✓ Website Appears Safe"}
                </h2>

                {result.confidence !== undefined && (
                    <span className="ml-auto text-xs text-white/60">
                        Confidence: {(result.confidence * 100).toFixed(1)}%
                    </span>
                )}
            </div>

            {/* AI Summary */}
            {aiAnalysis && (
                <div className="space-y-4">
                    <p
                        className="text-xs text-gray-300 leading-relaxed italic animate-slide"
                        style={{ animationDelay: "0.15s" }}
                    >
                        “{aiAnalysis.summary}”
                    </p>

                    {/* Threat Level */}
                    <div
                        className="animate-slide"
                        style={{ animationDelay: "0.25s" }}
                    >
                        <div className="text-[10px] uppercase tracking-widest text-gray-500">
                            Threat Level
                        </div>
                        <div
                            className={`text-sm font-bold tracking-wide ${aiAnalysis.threatLevel === "High"
                                    ? "text-red-500"
                                    : aiAnalysis.threatLevel === "Medium"
                                        ? "text-yellow-400"
                                        : "text-emerald-400"
                                }`}
                        >
                            {aiAnalysis.threatLevel}
                        </div>
                    </div>

                    {/* Detected Signals */}
                    <div className="space-y-2">
                        <div className="text-[10px] uppercase tracking-widest text-gray-500">
                            Detected Signals
                        </div>

                        <div className="flex flex-col gap-2">
                            {aiAnalysis.reasons.slice(0, 3).map((reason, i) => (
                                <div
                                    key={i}
                                    style={{ animationDelay: `${0.35 + i * 0.12}s` }}
                                    className="flex gap-2 rounded-xl bg-black/30 border border-white/10 p-3 
                             text-[11px] text-gray-300 animate-slide"
                                >
                                    <span className="text-yellow-400">⚠</span>
                                    <span>{reason}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recommendation */}
                    <div
                        className="mt-4 rounded-xl bg-black/40 border border-white/10 p-4 animate-slide"
                        style={{ animationDelay: "0.75s" }}
                    >
                        <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                            Recommended Action
                        </div>
                        <div className="text-[11px] text-gray-200 leading-snug">
                            {aiAnalysis.recommendation}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResultCard;
