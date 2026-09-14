import React from "react";
import { AIProductionStrategy } from "../types";
import { 
  Sliders, 
  Coins, 
  Cpu, 
  GitFork, 
  UserCheck, 
  Sparkles,
  Zap,
  Layers,
  ArrowRight
} from "lucide-react";

interface ProductionStrategyViewProps {
  strategy: AIProductionStrategy;
  projectTitle: string;
}

export const ProductionStrategyView: React.FC<ProductionStrategyViewProps> = ({
  strategy,
  projectTitle,
}) => {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-800">
              AI Resource Allocation & Routing
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            Model Routing & Million-Credit Strategy
          </h2>
          <p className="text-xs text-stone-600 max-w-2xl mt-1">
            Treating your AI Studio quota as an intelligent production resource. Routes heavy reasoning to Gemini 3.8/Pro, while offloading boilerplate to Flash-Lite to conserve allowance.
          </p>
        </div>

        {/* Credit Allowance Counter */}
        <div className="bg-stone-900 text-stone-100 rounded-xl p-4 flex items-center gap-4 shrink-0 border border-stone-800">
          <div className="w-10 h-10 rounded-lg bg-amber-400 text-stone-900 flex items-center justify-center font-bold">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono text-stone-400 uppercase">Estimated Consumption</div>
            <div className="text-sm font-bold font-mono text-amber-300">
              {strategy.estimatedCredits}
            </div>
          </div>
        </div>
      </div>

      {/* Model Tier Allocation Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-stone-700" />
            Model Tier Routing Matrix
          </h3>
          <span className="text-xs font-mono text-stone-500">
            Automated Cost Optimization
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {strategy.modelAllocation.map((tier, idx) => {
            const isStrong = tier.tier.includes("Strongest");
            const isFast = tier.tier.includes("Fast") || tier.tier.includes("Flash");
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-stone-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded-full border ${
                        isStrong
                          ? "bg-purple-50 text-purple-900 border-purple-200"
                          : isFast
                          ? "bg-sky-50 text-sky-900 border-sky-200"
                          : "bg-stone-100 text-stone-800 border-stone-300"
                      }`}
                    >
                      {tier.creditBudgetPct}% Token Budget
                    </span>
                    <span className="text-xs font-mono text-stone-400">
                      {isStrong ? "Gemini 3.8 / Pro" : isFast ? "Gemini Flash-Lite" : "Deterministic"}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-stone-900">
                    {tier.tier}
                  </h4>

                  <div className="mt-3 space-y-2">
                    <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                      Assigned Tasks:
                    </span>
                    <ul className="space-y-1 text-xs text-stone-700">
                      {tier.tasks.map((task, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-1.5">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 text-xs text-stone-500 italic">
                  <strong>Rationale:</strong> {tier.reasoning}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Parallelization Plan & Human Decision Gates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Parallelization Execution Strategy */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <GitFork className="w-4 h-4 text-sky-700" />
              Concurrent AI Studio Workstreams
            </h3>
            <span className="text-xs font-mono text-sky-800 bg-sky-50 px-2 py-0.5 rounded">
              Parallel Execution
            </span>
          </div>

          <p className="text-xs text-stone-700 leading-relaxed">
            {strategy.parallelizationPlan}
          </p>

          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-600 space-y-1.5">
            <div className="font-semibold text-stone-900">Production Manager Tip:</div>
            <p>
              Open independent tabs in AI Studio for decoupled modules (e.g. Data Types vs UI styling). Feed both outputs into the Drift Supervisor before merging into the main branch.
            </p>
          </div>
        </div>

        {/* Human Decision Gates */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-amber-700" />
              Human Decision Checkpoints
            </h3>
            <span className="text-xs font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
              Manual Sign-Off
            </span>
          </div>

          <p className="text-xs text-stone-600">
            Critical junctions where AI Studio must pause for founder or architect review:
          </p>

          <div className="space-y-2 pt-1">
            {strategy.humanDecisionCheckpoints.map((cp, idx) => (
              <div
                key={idx}
                className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg text-xs text-amber-950 flex items-start gap-2.5 font-medium"
              >
                <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{cp}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
