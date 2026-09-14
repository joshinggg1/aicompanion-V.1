import React, { useState } from "react";
import { 
  X, 
  Sparkles, 
  Lightbulb, 
  TrendingUp, 
  Layers, 
  FileCode2, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { ProjectDefinition } from "../types";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: ProjectDefinition) => void;
  hasApiKey: boolean;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onProjectCreated,
  hasApiKey,
}) => {
  const [ideaPrompt, setIdeaPrompt] = useState<string>("");
  const [focusArea, setFocusArea] = useState<string>("Full-Stack AI Application");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const sampleIdeas = [
    {
      title: "Context-Aware Meeting Intelligence",
      prompt: "I want to build an application that solves lost action items by automatically extracting verifiable tasks and generating follow-up emails from audio transcripts.",
    },
    {
      title: "Local Offline Vector Search",
      prompt: "I want to build an application that solves private semantic search over confidential PDFs directly in the browser without uploading documents to external clouds.",
    },
    {
      title: "AI Studio Token & Credit Ledger",
      prompt: "I want to build an application that solves runaway LLM API expenses by dynamically calculating token burn and routing low-complexity subtasks to free models.",
    },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaPrompt.trim()) return;

    setIsGenerating(true);
    setErrorMessage(null);
    setGenerationStep(1);

    // Simulated progress steps for visual feedback
    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 1200);

    try {
      const res = await fetch("/api/orchestrator/generate-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: ideaPrompt,
          focusArea,
        }),
      });

      clearInterval(stepInterval);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.details || data.error || "Failed to generate project definition");
      }

      const newProject: ProjectDefinition = await res.json();
      setGenerationStep(5);
      setTimeout(() => {
        onProjectCreated(newProject);
        onClose();
        setIsGenerating(false);
        setGenerationStep(0);
        setIdeaPrompt("");
      }, 500);
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error("Project generation failed:", err);
      setErrorMessage(
        err.message || "Failed to contact Gemini orchestrator. Verify your GEMINI_API_KEY in Secrets."
      );
      setIsGenerating(false);
      setGenerationStep(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-2xl w-full p-6 sm:p-8 relative overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isGenerating}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-800">
              New AI Project Definition
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            Define a New Product Opportunity
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            Enter your core problem statement. The Orchestrator will research the market, establish the §-numbered source of truth, map model allocations, and configure the AI Studio production plan.
          </p>
        </div>

        {isGenerating ? (
          /* Generation Progress Screen */
          <div className="py-8 space-y-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center mx-auto shadow-md">
              <Sparkles className="w-7 h-7 animate-spin" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-stone-900">
                Synthesizing AI Project Definition
              </h3>
              <p className="text-xs text-stone-500">
                Grounding with Gemini 3.8 Flash...
              </p>
            </div>

            {/* Stepper */}
            <div className="max-w-md mx-auto space-y-2.5 text-left text-xs">
              <div className={`flex items-center gap-2.5 p-2 rounded-lg ${generationStep >= 1 ? "bg-amber-50 text-amber-950 font-semibold" : "text-stone-400"}`}>
                <CheckCircle2 className={`w-4 h-4 ${generationStep >= 1 ? "text-amber-600" : "text-stone-300"}`} />
                <span>1. Market intelligence & competitive opportunity score</span>
              </div>
              <div className={`flex items-center gap-2.5 p-2 rounded-lg ${generationStep >= 2 ? "bg-amber-50 text-amber-950 font-semibold" : "text-stone-400"}`}>
                <CheckCircle2 className={`w-4 h-4 ${generationStep >= 2 ? "text-amber-600" : "text-stone-300"}`} />
                <span>2. Product definition, core features & Non-Goals (§1.1 – §2.8)</span>
              </div>
              <div className={`flex items-center gap-2.5 p-2 rounded-lg ${generationStep >= 3 ? "bg-amber-50 text-amber-950 font-semibold" : "text-stone-400"}`}>
                <CheckCircle2 className={`w-4 h-4 ${generationStep >= 3 ? "text-amber-600" : "text-stone-300"}`} />
                <span>3. Build specification, data models & security requirements (§3.1 – §3.18)</span>
              </div>
              <div className={`flex items-center gap-2.5 p-2 rounded-lg ${generationStep >= 4 ? "bg-amber-50 text-amber-950 font-semibold" : "text-stone-400"}`}>
                <CheckCircle2 className={`w-4 h-4 ${generationStep >= 4 ? "text-amber-600" : "text-stone-300"}`} />
                <span>4. AI Studio factory plan, calibrated prompts & model routing</span>
              </div>
            </div>
          </div>
        ) : (
          /* Form Input */
          <form onSubmit={handleGenerate} className="space-y-5">
            <div>
              <label 
                htmlFor="idea-input"
                className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5"
              >
                Core Product Idea (Input: "I want to build an application that solves X")
              </label>
              <textarea
                id="idea-input"
                rows={3}
                required
                value={ideaPrompt}
                onChange={(e) => setIdeaPrompt(e.target.value)}
                placeholder="I want to build an application that solves..."
                className="w-full text-xs font-medium text-stone-900 bg-stone-50 border border-stone-300 rounded-xl p-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 transition-colors leading-relaxed"
              />
            </div>

            {/* Focus Area Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Target Archetype / Scope
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  "Full-Stack AI Application",
                  "Solo Founder MVP",
                  "Privacy / Local Utility",
                  "Enterprise Developer Tool",
                ].map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => setFocusArea(tag)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      focusArea === tag
                        ? "bg-stone-900 text-white border-stone-900"
                        : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Inspiration Presets */}
            <div>
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1.5">
                Or pick an example problem to test:
              </span>
              <div className="space-y-1.5">
                {sampleIdeas.map((s, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setIdeaPrompt(s.prompt)}
                    className="w-full text-left p-2.5 rounded-lg border border-stone-200 hover:border-stone-400 bg-stone-50 hover:bg-stone-100 transition-colors flex items-start gap-2"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-stone-900">{s.title}</div>
                      <div className="text-[11px] text-stone-500 truncate max-w-lg">{s.prompt}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-stone-500">
                {hasApiKey ? "Powered by Gemini 3.8 Flash" : "Requires GEMINI_API_KEY in Secrets"}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!ideaPrompt.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs disabled:opacity-50 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Synthesize Project Definition</span>
                </button>
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
