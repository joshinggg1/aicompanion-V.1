import React from "react";
import { MarketIntelligence } from "../types";
import { 
  TrendingUp, 
  ShieldAlert, 
  Target, 
  Sparkles, 
  Users, 
  Compass, 
  BarChart3 
} from "lucide-react";

interface MarketIntelligenceViewProps {
  marketIntel: MarketIntelligence;
  projectTitle: string;
}

export const MarketIntelligenceView: React.FC<MarketIntelligenceViewProps> = ({
  marketIntel,
  projectTitle,
}) => {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-800">
              Opportunity Intelligence
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            Market Research & Competitor Landscape
          </h2>
          <p className="text-xs text-stone-600 max-w-2xl mt-1">
            Validates market viability, identifies competitor vulnerabilities, and establishes the product thesis before writing a single line of code in AI Studio.
          </p>
        </div>

        {/* Opportunity Score Badge */}
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex items-center gap-4 shrink-0">
          <div className="text-center">
            <div className="text-3xl font-black font-mono text-emerald-700 tracking-tight">
              {marketIntel.opportunityScore}
            </div>
            <div className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
              Viability Score / 100
            </div>
          </div>
          <div className="h-10 w-px bg-stone-200" />
          <div className="text-xs text-stone-600 max-w-[140px]">
            {marketIntel.opportunityScore >= 80 
              ? "High market demand with distinct gap" 
              : "Moderate opportunity; tight differentiation required"}
          </div>
        </div>
      </div>

      {/* Market Summary */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-emerald-700" />
          Market Landscape Synthesis
        </h3>
        <p className="text-sm text-stone-800 leading-relaxed">
          {marketIntel.marketSummary}
        </p>
      </div>

      {/* Competitors Matrix */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-stone-700" />
            Competitive Analysis Matrix
          </h3>
          <span className="text-xs font-mono text-stone-500">
            {marketIntel.competitors.length} Key Players Tracked
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {marketIntel.competitors.map((comp, idx) => {
            const isHigh = comp.threatLevel === "High";
            const isMed = comp.threatLevel === "Medium";
            return (
              <div
                key={idx}
                className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="font-semibold text-stone-900 text-sm">
                      {comp.name}
                    </h4>
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                        isHigh
                          ? "bg-rose-50 text-rose-800 border-rose-200"
                          : isMed
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-emerald-50 text-emerald-800 border-emerald-200"
                      }`}
                    >
                      {comp.threatLevel} Threat
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-stone-500 block font-medium">Strength:</span>
                      <p className="text-stone-800">{comp.strengths}</p>
                    </div>
                    <div>
                      <span className="text-stone-500 block font-medium">Vulnerability / Weakness:</span>
                      <p className="text-rose-900 font-medium">{comp.weaknesses}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200/60 text-[11px] text-stone-500">
                  Opportunity: Exploit pricing, API drift, or complexity barrier.
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Underserved Gaps & Differentiation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Underserved Gaps */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-sky-700" />
            Unaddressed User Pain Points
          </h3>
          <ul className="space-y-2 text-xs text-stone-800">
            {marketIntel.underservedGaps.map((gap, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-stone-50 p-2.5 rounded-lg border border-stone-200/80">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-1.5 shrink-0" />
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Differentiation Opportunity */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-emerald-700" />
            Core Differentiation Thesis
          </h3>
          <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs text-emerald-950 font-medium leading-relaxed">
            {marketIntel.differentiationOpportunity}
          </div>
          <p className="text-[11px] text-stone-500 italic">
            This thesis guides all subsequent feature definitions (§2.1-§2.4) and ensures the product solves a real gap rather than cloning existing SaaS.
          </p>
        </div>

      </div>
    </div>
  );
};
