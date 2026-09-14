import React, { useState } from "react";
import { 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Code2, 
  CheckCircle2,
  FileCheck
} from "lucide-react";

interface PromptBuildPaneProps {
  workingPrompt: string;
  setWorkingPrompt: (val: string) => void;
  selectedModel: string;
}

export const PromptBuildPane: React.FC<PromptBuildPaneProps> = ({
  workingPrompt,
  setWorkingPrompt,
  selectedModel,
}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(workingPrompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const lineCount = workingPrompt.trim() ? workingPrompt.split("\n").length : 0;
  const wordCount = workingPrompt.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
      {/* Pane Header */}
      <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-stone-700" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-800">
              Build Prompt
            </span>
            {workingPrompt.trim().length > 0 && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 font-semibold">
                Ready for AI Studio
              </span>
            )}
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">
            The finished build prompt developed by the conversational brain. Copy it directly into Google AI Studio Build.
          </div>
        </div>

        {/* Action Buttons: Copy & Open AI Studio */}
        <div className="flex items-center gap-2">
          <a
            href="https://ai.studio/build"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg transition-colors shadow-2xs"
            title="Open Google AI Studio in a new tab"
          >
            <span>Open Google AI Studio</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
          </a>

          <button
            onClick={handleCopy}
            disabled={!workingPrompt.trim()}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg shadow-xs transition-all ${
              !workingPrompt.trim()
                ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                : isCopied
                ? "bg-emerald-600 text-white shadow-emerald-600/20"
                : "bg-stone-900 hover:bg-stone-800 text-amber-300 hover:text-amber-200"
            }`}
            title={workingPrompt.trim() ? "Copy prompt to clipboard" : "No build prompt yet. Continue the conversation to develop the project."}
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>Copy Prompt for AI Studio</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Metadata Strip */}
      <div className="px-4 py-1.5 bg-stone-900 text-stone-400 border-b border-stone-800 flex items-center justify-between text-[11px] font-mono select-none">
        <div className="flex items-center gap-3">
          <span className="text-stone-300">Format: AI Studio Spec</span>
          <span>•</span>
          <span>{lineCount} lines</span>
          <span>•</span>
          <span>{wordCount} words</span>
        </div>
        <div className="flex items-center gap-2 text-stone-400">
          <span className={`w-1.5 h-1.5 rounded-full ${workingPrompt.trim() ? "bg-emerald-400" : "bg-stone-500"}`} />
          <span>{workingPrompt.trim() ? `Recommended Model: ${selectedModel || "Gemini 3.1 Flash-Lite"}` : "Waiting for conversation"}</span>
        </div>
      </div>

      {/* Editor Canvas / Empty State */}
      <div className="flex-1 bg-stone-950 text-stone-200 font-mono text-xs overflow-y-auto leading-relaxed relative flex flex-col">
        {!workingPrompt.trim() ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none">
            <div className="w-12 h-12 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-600 mb-4 shadow-inner">
              <Code2 className="w-6 h-6 text-stone-500" />
            </div>
            <div className="text-stone-300 font-medium text-sm font-sans mb-1">
              No build prompt yet.
            </div>
            <div className="text-stone-500 text-xs font-sans max-w-sm">
              Continue the conversation to develop the project. When you agree on what to build, the finished prompt will appear here.
            </div>
          </div>
        ) : (
          <textarea
            value={workingPrompt}
            onChange={(e) => setWorkingPrompt(e.target.value)}
            className="w-full h-full p-4 bg-transparent text-stone-200 resize-none focus:outline-none leading-relaxed font-mono selection:bg-amber-500/30"
            spellCheck={false}
          />
        )}
      </div>

      {/* Step-by-Step AI Studio Usage Footer */}
      <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-4 text-stone-600 text-[11px]">
          <span className="font-semibold text-stone-800">Next Step:</span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-[10px]">1</span>
            Copy prompt
          </span>
          <span className="text-stone-300">→</span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-[10px]">2</span>
            Go to AI Studio Build
          </span>
          <span className="text-stone-300">→</span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-[10px]">3</span>
            Paste and build
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="text-[11px] font-mono font-bold text-stone-800 hover:text-stone-950 underline underline-offset-2 flex items-center gap-1"
        >
          {isCopied ? "Prompt copied!" : "Click to copy prompt"}
        </button>
      </div>
    </div>
  );
};
