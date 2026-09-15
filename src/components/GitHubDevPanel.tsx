import React, { useState } from "react";
import { Copy, Check, GitBranch, Terminal } from "lucide-react";
import { ReadinessStatus, RepositoryModule, DevPanelState } from "../types";

export const TrafficLight: React.FC<{ status: ReadinessStatus }> = ({ status }) => {
  const statusConfig: Record<ReadinessStatus, { color: string; label: string }> = {
    ready: { color: "bg-green-500", label: "🟢 Ready: Fully specified in canonical project definition" },
    pending: { color: "bg-yellow-400", label: "🟡 Pending: Depends on an unresolved specification decision" },
    blocked: { color: "bg-red-500", label: "🔴 Blocked: Required dependency or architectural logic is missing" },
  };

  const current = statusConfig[status] || statusConfig.pending;

  return (
    <div className="flex items-center gap-2" title={current.label}>
      <span className={`w-2.5 h-2.5 rounded-full ${current.color} shadow-sm border border-stone-700`} />
      <span className="text-xs font-medium text-stone-300 capitalize">{status}</span>
    </div>
  );
};

export const RepoHealthList: React.FC<{ modules: RepositoryModule[] }> = ({ modules }) => {
  return (
    <div className="bg-stone-900 rounded-lg p-4 border border-stone-800">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            Implementation Map
          </h3>
          <p className="text-[10px] text-stone-500 mt-0.5">
            Projection of canonical readiness per module path (governed by the 8-Dimension Gate)
          </p>
        </div>
        <span className="text-[11px] font-mono text-stone-400 font-medium">
          {modules.filter((m) => m.status === "ready").length} / {modules.length} Specified
        </span>
      </div>
      <ul className="space-y-2.5">
        {modules.map((mod) => (
          <li
            key={mod.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 hover:bg-stone-800/80 rounded border border-stone-800/60 transition-colors"
          >
            <div className="flex flex-col min-w-0 pr-2">
              <code className="text-xs text-blue-400 font-mono font-medium truncate">{mod.path}</code>
              <span className="text-[11px] text-stone-400 mt-1 leading-snug">{mod.description}</span>
            </div>
            <div className="mt-2 sm:mt-0 shrink-0 min-w-[130px]">
              <TrafficLight status={mod.status} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const GitHubDevPanel: React.FC<{ devState: DevPanelState }> = ({ devState }) => {
  const [treeCopied, setTreeCopied] = useState(false);
  const [instructionsCopied, setInstructionsCopied] = useState(false);

  const handleCopyTree = () => {
    navigator.clipboard.writeText(devState.rawFileTree);
    setTreeCopied(true);
    setTimeout(() => setTreeCopied(false), 2000);
  };

  const handleCopyInstructions = () => {
    navigator.clipboard.writeText(devState.instructions);
    setInstructionsCopied(true);
    setTimeout(() => setInstructionsCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full space-y-5 p-5 bg-stone-950 text-stone-100 overflow-y-auto font-sans">
      {/* Target Repo Input */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-blue-400" />
            Target GitHub Repository
          </label>
          <span className="text-[10px] font-mono text-stone-500">Developer / Coding Agent Target</span>
        </div>
        <input
          type="text"
          value={devState.targetRepoUrl || "https://github.com/project/workspace"}
          readOnly
          className="bg-stone-900 border border-stone-800 rounded-lg p-2.5 text-xs font-mono text-stone-300 w-full focus:outline-none focus:border-stone-700"
        />
      </div>

      {/* Implementation Instructions */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            Dev Instructions & Plan
          </label>
          <button
            type="button"
            onClick={handleCopyInstructions}
            className="text-[11px] text-stone-400 hover:text-stone-200 flex items-center gap-1 transition-colors"
          >
            {instructionsCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{instructionsCopied ? "Copied" : "Copy"}</span>
          </button>
        </div>
        <textarea
          value={devState.instructions}
          readOnly
          className="bg-stone-900 border border-stone-800 rounded-lg p-3 text-xs font-mono h-36 resize-none text-stone-300 w-full focus:outline-none leading-relaxed"
        />
      </div>

      {/* Traffic Light Health Ratings */}
      <RepoHealthList modules={devState.modules} />

      {/* File Tree & Action */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-end">
          <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            Proposed File Tree
          </label>
          <button
            type="button"
            onClick={handleCopyTree}
            className="text-xs bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium py-1 px-3 rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
          >
            {treeCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{treeCopied ? "Copied Tree!" : "Copy File Tree"}</span>
          </button>
        </div>
        <pre className="bg-stone-900 border border-stone-800 rounded-lg p-3.5 text-xs font-mono text-stone-300 overflow-x-auto whitespace-pre leading-normal">
          {devState.rawFileTree}
        </pre>
      </div>
    </div>
  );
};
