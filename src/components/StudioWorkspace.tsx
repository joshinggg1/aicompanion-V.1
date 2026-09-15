import React, { useState, useEffect } from "react";
import { 
  RotateCcw, 
  ExternalLink,
  AlertTriangle,
  X,
  Check
} from "lucide-react";
import { ConversationPane } from "./ConversationPane";
import { ProjectStatusPane } from "./ProjectStatusPane";
import { ChatMessage, ProjectState, TargetOutputMode } from "../types";
import { deriveTargetProjections } from "../utils/targetProjections";

interface StudioWorkspaceProps {
  hasApiKey: boolean;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: "msg-init",
  role: "assistant",
  content: "Talk naturally about what you want to build. I'll help you understand the problem, investigate what already exists, identify opportunities, and develop the build prompt.",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

const STORAGE_KEY = "ai_studio_orchestrator_project_v2";
const LEGACY_STORAGE_KEY = "ai_studio_orchestrator_project_v1";

const createDefaultProject = (): ProjectState => ({
  identity: {
    id: `proj-${Date.now()}`,
    title: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "exploring",
  },
  understanding: "",
  messages: [INITIAL_MESSAGE],
  requirements: {
    purpose: "",
    architecture: {
      stack: ["React 19", "TypeScript", "Tailwind CSS"],
      storage: "Client-side key-value / LocalStorage",
      pattern: "Single-view SPA",
    },
    coreCapabilities: [],
    constraintsAndNonGoals: [],
    importantDecisions: [],
  },
  buildPrompt: "",
  isPromptAchieved: false,
  masterPromptStatus: "discovering",
  activeTargetMode: "build",
  targetProjections: {
    build: "",
    dev: "",
    create: "",
  },
  feedbackHistory: [],
});

export const StudioWorkspace: React.FC<StudioWorkspaceProps> = ({ hasApiKey }) => {
  // Authoritative persistent project state
  const [project, setProject] = useState<ProjectState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.identity && parsed.messages) {
          return parsed;
        }
      }
      // Migration from v1
      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacy) {
        const parsed = JSON.parse(legacy);
        const migrated = createDefaultProject();
        if (parsed.messages) migrated.messages = parsed.messages;
        if (parsed.currentIdeaTitle) migrated.identity.title = parsed.currentIdeaTitle;
        if (parsed.workingPrompt) migrated.buildPrompt = parsed.workingPrompt;
        return migrated;
      }
    } catch (e) {
      console.error("Failed to restore project", e);
    }
    return createDefaultProject();
  });

  const [inputPrompt, setInputPrompt] = useState<string>("");
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>("gemini-3.1-flash-lite");
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Keep project synchronized to localStorage across sessions
  useEffect(() => {
    try {
      if (project.messages.length > 1 || project.buildPrompt.trim() || project.identity.title.trim()) {
        const updatedProject = {
          ...project,
          identity: {
            ...project.identity,
            updatedAt: new Date().toISOString(),
            status: (project.buildPrompt.trim() ? "in_development" : "exploring") as ProjectState["identity"]["status"],
          },
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProject));
      }
    } catch (e) {
      console.error("Failed to persist project continuity", e);
    }
  }, [project]);

  // Send message to conversational PM endpoint with full authoritative project context
  const handleSendMessage = async (textOverride?: string) => {
    const text = textOverride || inputPrompt;
    if (!text.trim() || isThinking) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...project.messages, userMsg];
    setInputPrompt("");
    setIsThinking(true);

    // Optimistically update message history
    setProject((prev) => ({
      ...prev,
      messages: newHistory,
    }));

    try {
      const res = await fetch("/api/orchestrator/market-hole-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory,
          activeIdea: project.identity.title || text,
          currentWorkingPrompt: project.buildPrompt,
          activeTargetMode: project.activeTargetMode || "build",
          project: {
            ...project,
            messages: newHistory,
          },
        }),
      });

      if (!res.ok) throw new Error("Conversation endpoint failed");

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      if (data.targetModel) {
        setSelectedModel(data.targetModel);
      }

      setProject((prev) => {
        const nextTitle = prev.identity.title || (data.projectUpdate?.title || text.substring(0, 45));
        const nextPrompt = data.workingPrompt !== undefined ? data.workingPrompt : prev.buildPrompt;
        
        // Track feedback iterations if applicable
        const isFeedback = /broken|error|doesn't work|not working|works, but|works but|ai studio|changed|failing/i.test(text);
        const newFeedbackHistory = [...prev.feedbackHistory];
        if (isFeedback) {
          newFeedbackHistory.push({
            id: `fb-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            source: "ai_studio_feedback",
            reportedObservation: text,
            targetedChanges: [data.content.substring(0, 100)],
          });
        }

        const nextDownstream = data.downstreamRepresentation !== undefined ? data.downstreamRepresentation : prev.downstreamRepresentation;
        const nextProjections = data.targetProjections || deriveTargetProjections(
          nextTitle,
          nextPrompt,
          data.projectUpdate?.requirements || prev.requirements,
          nextDownstream
        );

        return {
          ...prev,
          identity: {
            ...prev.identity,
            title: nextTitle,
            updatedAt: new Date().toISOString(),
            status: nextPrompt.trim() ? "in_development" : "exploring",
          },
          understanding: data.projectUpdate?.understanding || prev.understanding || `Focused solution for ${text}`,
          requirements: data.projectUpdate?.requirements || prev.requirements,
          messages: [...newHistory, assistantMsg],
          buildPrompt: nextPrompt,
          isPromptAchieved: data.isPromptAchieved !== undefined ? data.isPromptAchieved : Boolean(nextPrompt.trim()),
          masterPromptStatus: data.masterPromptStatus || (nextPrompt.trim() ? "prompt_achieved" : "readiness_withheld"),
          readinessChecks: data.readinessChecks || prev.readinessChecks,
          downstreamRepresentation: nextDownstream,
          targetProjections: nextProjections,
          feedbackHistory: newFeedbackHistory,
        };
      });
    } catch (err) {
      console.error(err);
      setProject((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            id: `assistant-err-${Date.now()}`,
            role: "assistant",
            content: `I know where we are with this project. Let's look at what happened in AI Studio and make the specific adjustment needed. I've updated the Build Prompt on the right. What do you think?`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ],
      }));
    } finally {
      setIsThinking(false);
    }
  };

  // Trigger reset with confirmation check
  const promptResetSession = () => {
    // If the project has user messages or existing build prompt/title, confirm before clearing
    const hasWork = project.messages.length > 1 || project.buildPrompt.trim().length > 0 || Boolean(project.identity.title.trim());
    if (hasWork) {
      setShowResetModal(true);
    } else {
      executeReset();
    }
  };

  // Perform full authoritative workspace reset
  const executeReset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch (e) {
      console.error("Storage clear failed", e);
    }
    setProject(createDefaultProject());
    setInputPrompt("");
    setIsThinking(false);
    setShowResetModal(false);
    setToastMessage("Workspace and project reset to a clean state.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePromptChange = (newPrompt: string) => {
    setProject((prev) => {
      const currentProjections = prev.targetProjections || { build: newPrompt, dev: "", create: "" };
      return {
        ...prev,
        buildPrompt: newPrompt,
        targetProjections: {
          ...currentProjections,
          build: newPrompt,
        },
      };
    });
  };

  const handleSelectTargetMode = (mode: TargetOutputMode) => {
    setProject((prev) => ({
      ...prev,
      activeTargetMode: mode,
    }));
  };

  const handleUpdateProjection = (mode: TargetOutputMode, text: string) => {
    setProject((prev) => {
      const currentProjections = prev.targetProjections || { build: prev.buildPrompt, dev: "", create: "" };
      return {
        ...prev,
        targetProjections: {
          ...currentProjections,
          [mode]: text,
        },
        ...(mode === "build" ? { buildPrompt: text } : {}),
      };
    });
  };

  return (
    <div className="h-screen bg-stone-100 text-stone-900 flex flex-col antialiased overflow-hidden relative">
      {/* Top Header */}
      <header className="bg-stone-900 text-stone-100 border-b border-stone-800 px-4 sm:px-6 py-2.5 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center font-black text-xs shadow-xs">
              AI
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-white">
                  AI Studio Project Orchestrator
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-stone-800 text-amber-300 border border-stone-700">
                  Conversational Project Manager
                </span>
              </div>
              <div className="text-[11px] text-stone-400 flex items-center gap-1.5">
                {project.identity.title ? (
                  <>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Project: <strong className="text-stone-200">{project.identity.title}</strong></span>
                    <span className="text-stone-500 text-[10px] font-mono hidden md:inline">• Ongoing project context</span>
                  </>
                ) : (
                  <span className="text-stone-500 italic">Intelligent blank workspace — talk about your idea</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Direct Link to Google AI Studio */}
            <a
              href="https://ai.studio/build"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-200 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors border border-stone-700 font-medium shadow-2xs"
            >
              <span>Open Google AI Studio</span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            </a>

            {/* Reset Workspace & Project */}
            <button
              id="btn-topbar-reset"
              type="button"
              onClick={promptResetSession}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-200 hover:text-white bg-stone-800 hover:bg-stone-700 active:bg-stone-900 rounded-lg transition-colors border border-stone-700 font-medium shadow-2xs"
              title="Reset conversation and start a new project"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace: 2-Panel Layout (Conversation + Build Prompt) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
          {/* LEFT: CONVERSATION (PRIMARY INTERFACE) */}
          <section className="h-full min-h-0 flex flex-col" aria-label="Conversation">
            <ConversationPane
              messages={project.messages}
              inputPrompt={inputPrompt}
              setInputPrompt={setInputPrompt}
              onSendMessage={handleSendMessage}
              isThinking={isThinking}
              onTriggerBuild={() => {
                handleSendMessage("Okay. Build this");
              }}
              onReset={promptResetSession}
              hasWorkingPrompt={Boolean(project.buildPrompt.trim())}
            />
          </section>

          {/* RIGHT: PROJECT STATUS & DISCOVERED INTELLIGENCE */}
          <section className="h-full min-h-0 flex flex-col" aria-label="Project Status">
            <ProjectStatusPane
              project={project}
              onSelectTargetMode={handleSelectTargetMode}
              onTriggerBuild={() => {
                handleSendMessage("Okay. Build this");
              }}
              onUpdatePrompt={handlePromptChange}
            />
          </section>
        </div>
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-stone-100 border border-stone-700 px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2.5 text-xs font-sans animate-fade-in">
          <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3" />
          </div>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-stone-400 hover:text-stone-200 ml-2"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Custom Reset Confirmation Modal (In-App, Sandbox/iFrame Safe) */}
      {showResetModal && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-modal-title"
          className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="bg-white rounded-xl border border-stone-200 shadow-2xl max-w-md w-full p-5 space-y-4 font-sans text-stone-900 animate-scale-in">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 id="reset-modal-title" className="text-sm font-bold text-stone-900 tracking-tight">
                  Reset Project & Workspace?
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  This action will clear all current conversation history, canonical requirements, and active projections for:
                </p>
                {project.identity.title ? (
                  <div className="p-2 bg-stone-100 rounded-md text-xs font-mono font-semibold text-stone-800 border border-stone-200 truncate">
                    {project.identity.title}
                  </div>
                ) : (
                  <div className="p-2 bg-stone-100 rounded-md text-xs font-mono text-stone-600 border border-stone-200">
                    Current active session
                  </div>
                )}
              </div>
            </div>

            <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 text-[11px] text-stone-600 space-y-1.5 font-sans">
              <div className="font-semibold text-stone-800">What will happen:</div>
              <ul className="list-disc list-inside space-y-0.5 pl-1 text-stone-600">
                <li>Conversation restarts with the initial prompt coach greeting</li>
                <li>Living master prompt & target projections (BUILD, DEV, CREATE) reset</li>
                <li>Readiness gate is re-engaged for your next idea</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                id="btn-cancel-reset"
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-3.5 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-reset"
                type="button"
                onClick={executeReset}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Confirm Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
