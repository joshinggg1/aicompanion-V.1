import React from "react";
import { BuildSpecification } from "../types";
import { 
  TerminalSquare, 
  Database, 
  ShieldCheck, 
  Layout, 
  Cpu, 
  TestTube2, 
  Cloud,
  Layers,
  Code2
} from "lucide-react";

interface BuildSpecificationViewProps {
  buildSpec: BuildSpecification;
  projectTitle: string;
}

export const BuildSpecificationView: React.FC<BuildSpecificationViewProps> = ({
  buildSpec,
  projectTitle,
}) => {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-sky-800">
              Technical Architecture & Specification
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            Build Specification Clauses (§3.1 – §3.18)
          </h2>
          <p className="text-xs text-stone-600 max-w-2xl mt-1">
            The authoritative engineering contract. AI Studio prompts must adhere strictly to these architectural tiers, schemas, security standards, and deployment rules.
          </p>
        </div>

        <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs font-mono text-stone-700 shrink-0">
          Enforcement: <span className="font-bold text-stone-900">Strict TypeScript & ESLint</span>
        </div>
      </div>

      {/* §3.1 Architecture Overview */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <TerminalSquare className="w-4 h-4 text-stone-700" />
            Application Architecture ({buildSpec.architecture.code})
          </h3>
          <span className="text-xs font-mono text-stone-500">Full-Stack Topology</span>
        </div>

        <p className="text-xs text-stone-800 leading-relaxed">
          {buildSpec.architecture.overview}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Frontend Stack */}
          <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200 space-y-2">
            <span className="text-xs font-semibold text-stone-700 block">Frontend Stack</span>
            <div className="flex flex-wrap gap-1">
              {buildSpec.architecture.frontendStack.map((stk, idx) => (
                <span key={idx} className="text-[11px] font-mono px-2 py-0.5 rounded bg-white text-stone-800 border border-stone-200">
                  {stk}
                </span>
              ))}
            </div>
          </div>

          {/* Backend Stack */}
          <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200 space-y-2">
            <span className="text-xs font-semibold text-stone-700 block">Backend Stack</span>
            <div className="flex flex-wrap gap-1">
              {buildSpec.architecture.backendStack.map((stk, idx) => (
                <span key={idx} className="text-[11px] font-mono px-2 py-0.5 rounded bg-white text-stone-800 border border-stone-200">
                  {stk}
                </span>
              ))}
            </div>
          </div>

          {/* Data Storage */}
          <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200 space-y-2">
            <span className="text-xs font-semibold text-stone-700 block">Data Storage</span>
            <p className="text-xs text-stone-700 font-medium">
              {buildSpec.architecture.dataStorage}
            </p>
          </div>
        </div>
      </div>

      {/* §3.2-§3.4 UX & Functional Requirements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* UX Requirements */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <Layout className="w-4 h-4 text-stone-700" />
            UX Design & Layout Requirements (§3.2 – §3.4)
          </h3>
          <div className="space-y-2">
            {buildSpec.uxRequirements.map((ux, idx) => (
              <div key={idx} className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded text-[11px]">
                    {ux.code}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-stone-500">
                    {ux.criticality} Priority
                  </span>
                </div>
                <p className="text-stone-800 pt-0.5">{ux.rule}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Functional Requirements */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-stone-700" />
            Functional Logic & State (§3.5 – §3.7)
          </h3>
          <div className="space-y-2">
            {buildSpec.functionalRequirements.map((fn, idx) => (
              <div key={idx} className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sky-900 bg-sky-100 px-1.5 py-0.2 rounded text-[11px]">
                    {fn.code}
                  </span>
                  <span className="font-semibold text-stone-900">
                    {fn.title}
                  </span>
                </div>
                <p className="text-stone-700 pt-0.5">{fn.details}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* §3.8 Data Models Schemas */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-stone-700" />
            Data Model & Entity Contracts ({buildSpec.dataModel[0]?.code || "§3.8"})
          </h3>
          <span className="text-xs font-mono text-stone-500">
            {buildSpec.dataModel.length} Entities Specified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {buildSpec.dataModel.map((model, idx) => (
            <div key={idx} className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-stone-900 font-mono">
                  {model.entity}
                </h4>
                <span className="text-[10px] font-mono text-stone-500 bg-stone-200/70 px-1.5 py-0.5 rounded">
                  {model.code}
                </span>
              </div>
              <div className="bg-stone-900 text-stone-100 p-2.5 rounded-lg font-mono text-xs space-y-1 overflow-x-auto">
                {model.fields.map((f, fIdx) => (
                  <div key={fIdx} className="text-stone-300">
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security, Testing & Deployment */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Security Requirements */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            Security & Auth Clauses
          </h4>
          <div className="space-y-2 text-xs">
            {buildSpec.securityRequirements.map((sec, idx) => (
              <div key={idx} className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                <span className="font-mono font-bold text-stone-900 block mb-0.5">{sec.code}</span>
                <span className="text-stone-700">{sec.rule}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testing Requirements */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <TestTube2 className="w-4 h-4 text-sky-700" />
            Testing Verification
          </h4>
          <ul className="space-y-2 text-xs text-stone-700">
            {buildSpec.testingRequirements.map((t, idx) => (
              <li key={idx} className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Deployment Requirements */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <Cloud className="w-4 h-4 text-amber-700" />
            Deployment Architecture
          </h4>
          <ul className="space-y-2 text-xs text-stone-700">
            {buildSpec.deploymentRequirements.map((d, idx) => (
              <li key={idx} className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                {d}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};
