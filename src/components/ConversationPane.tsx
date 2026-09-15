import React, { useRef, useEffect } from "react";
import { 
  Sparkles, 
  Send, 
  Lightbulb, 
  Hammer,
  RotateCcw
} from "lucide-react";
import { ChatMessage } from "../types";

interface ConversationPaneProps {
  messages: ChatMessage[];
  inputPrompt: string;
  setInputPrompt: (val: string) => void;
  onSendMessage: (text?: string) => void;
  isThinking: boolean;
  onTriggerBuild: () => void;
  onReset?: () => void;
  hasWorkingPrompt?: boolean;
}

export const ConversationPane: React.FC<ConversationPaneProps> = ({
  messages,
  inputPrompt,
  setInputPrompt,
  onSendMessage,
  isThinking,
  onTriggerBuild,
  onReset,
  hasWorkingPrompt = false,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const quickTriggers = hasWorkingPrompt
    ? [
        "The auth works, but data import is broken",
        "AI Studio changed this, but now...",
        "I want this workflow to work differently",
        "Okay. Build this",
      ]
    : [
        "I've got this idea...",
        "What existing products do this?",
        "Where is the hole in the market?",
        "Okay. Build this",
      ];

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
      {/* Pane Header */}
      <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-800 shrink-0">
            Conversation
          </span>
          <span className="text-[11px] text-stone-600 hidden sm:inline truncate">
            — Understand problem & develop master prompt
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {onReset && (
            <button
              id="btn-pane-reset"
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 active:bg-stone-200 border border-stone-200 rounded-md transition-colors shadow-2xs"
              title="Reset conversation and project state"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
              <span>Reset</span>
            </button>
          )}
          <button
            id="btn-trigger-build"
            type="button"
            onClick={onTriggerBuild}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-amber-300 rounded-md shadow-2xs transition-colors"
            title="Agree on what should be built and generate the build prompt for AI Studio"
          >
            <Hammer className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xs:inline">"Okay. Build this"</span>
            <span className="xs:hidden">Build</span>
          </button>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}

              <div className={`max-w-2xl space-y-2 ${isUser ? "text-right" : "text-left"}`}>
                <div
                  className={`p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? "bg-stone-900 text-stone-100 rounded-br-xs inline-block text-left"
                      : "bg-stone-50 border border-stone-200 text-stone-900 rounded-bl-xs shadow-2xs"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  <div
                    className={`text-[10px] mt-2 font-mono ${
                      isUser ? "text-stone-400" : "text-stone-600"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 mt-0.5 font-semibold text-xs">
                  You
                </div>
              )}
            </div>
          );
        })}

        {isThinking && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center shrink-0 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl rounded-bl-xs text-xs text-stone-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>
                {hasWorkingPrompt
                  ? "Evaluating project continuity, isolating delta, and applying targeted update..."
                  : "Understanding intent, investigating existing tools, and developing the build prompt..."}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input / Quick Triggers Footer */}
      <div className="p-3 bg-stone-50/80 border-t border-stone-200 space-y-2">
        {/* Quick Trigger Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[10px] font-mono text-stone-600 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-600" />
            Try:
          </span>
          {quickTriggers.map((qt, i) => (
            <button
              key={i}
              onClick={() => {
                if (qt === "Okay. Build this" || qt === "Okay. This is what we're building.") {
                  onTriggerBuild();
                } else {
                  onSendMessage(qt);
                }
              }}
              disabled={isThinking}
              className="text-[11px] bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-md px-2 py-0.5 whitespace-nowrap transition-colors shadow-2xs"
            >
              {qt}
            </button>
          ))}
        </div>

        {/* Input Textarea & Send Button */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSendMessage();
          }}
          className="flex items-end gap-2"
        >
          <div className="flex-1 relative">
            <textarea
              id="conversation-input"
              rows={2}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSendMessage();
                }
              }}
              placeholder="Talk naturally about your idea... (e.g. 'I want to build a tool that solves X for Y')"
              className="w-full text-xs sm:text-sm bg-white border border-stone-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-stone-900 transition-colors resize-none leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={!inputPrompt.trim() || isThinking}
            className="px-3.5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg shadow-xs font-semibold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-40 shrink-0 mb-0.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
