import React from "react";
import { ProductDefinition } from "../types";
import { 
  Target, 
  ShieldAlert, 
  CheckCircle2, 
  Layers, 
  DollarSign, 
  Sparkles,
  Ban,
  UserCheck
} from "lucide-react";

interface ProductDefinitionViewProps {
  productDef: ProductDefinition;
  projectTitle: string;
}

export const ProductDefinitionView: React.FC<ProductDefinitionViewProps> = ({
  productDef,
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
              Product Definition & Scope Railings
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            Source of Truth: Section Clauses (§1.1 – §2.8)
          </h2>
          <p className="text-xs text-stone-600 max-w-2xl mt-1">
            The canonical definition of what will be built, who it serves, and critically: what is strictly forbidden (Non-Goals) to prevent AI Studio conversational drift.
          </p>
        </div>

        <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs font-mono text-stone-700 shrink-0">
          Source of Truth ID: <span className="font-bold text-stone-900">PRD-SPEC-V1</span>
        </div>
      </div>

      {/* §1 Pillars: Problem, Audience, Proposition */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* §1.1 Problem */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
              §1.1
            </span>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Problem Statement
            </span>
          </div>
          <p className="text-xs text-stone-800 leading-relaxed pt-1">
            {productDef.problemStatement}
          </p>
        </div>

        {/* §1.2 Target Audience */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
              §1.2
            </span>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Target User
            </span>
          </div>
          <p className="text-xs text-stone-800 leading-relaxed pt-1">
            {productDef.targetAudience}
          </p>
        </div>

        {/* §1.3 Value Proposition */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
              §1.3
            </span>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Product Proposition
            </span>
          </div>
          <p className="text-xs text-stone-800 leading-relaxed pt-1 font-medium text-stone-900">
            {productDef.valueProposition}
          </p>
        </div>

      </div>

      {/* §2 Core Features */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-stone-700" />
            Approved Core Features (§2.1 – §2.4)
          </h3>
          <span className="text-xs text-stone-500 font-mono">
            {productDef.coreFeatures.length} Scope Clauses
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productDef.coreFeatures.map((feat) => (
            <div
              key={feat.id}
              className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2 hover:border-stone-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-stone-900 bg-stone-200/80 px-2 py-0.5 rounded">
                  {feat.code}
                </span>
                <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Approved Scope
                </span>
              </div>
              <h4 className="font-semibold text-sm text-stone-900">
                {feat.name}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* §2.5 Non-Goals: CRITICAL DRIFT PROTECTION */}
      <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5 font-mono">
            <Ban className="w-4 h-4 text-rose-700" />
            Non-Goals: Strictly Forbidden Out-of-Scope (§2.5+)
          </h3>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-300 font-bold">
            Zero Tolerance for Drift
          </span>
        </div>

        <p className="text-xs text-rose-900 leading-relaxed">
          AI Studio models naturally suffer from feature hallucination (e.g. inventing unrequested chat channels, analytics dashboards, or auth workflows). If any of these appear in AI Studio code, the Drift Supervisor will immediately trigger a rejection.
        </p>

        <div className="space-y-2 pt-1">
          {productDef.nonGoals.map((ng, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 p-2.5 bg-white rounded-lg border border-rose-200/80 text-xs text-rose-950 font-medium"
            >
              <span className="text-rose-600 font-bold font-mono">✕</span>
              <span>{ng}</span>
            </div>
          ))}
        </div>
      </div>

      {/* §2.7 Business & Use-Case Model */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-stone-700" />
            Business & Use-Case Model (§2.7)
          </h3>
          <span className="text-xs font-mono text-stone-500">Commercial Alignment</span>
        </div>
        <p className="text-xs text-stone-800 leading-relaxed">
          {productDef.businessModel}
        </p>
      </div>
    </div>
  );
};
