import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle, FiX, FiSend, FiPlus, FiTrash2, FiActivity, FiUser } from "react-icons/fi";
import { GiMeal } from "react-icons/gi";
import toast from "react-hot-toast";
import useChatStore from "../stores/chatStore";
import useAuthStore from "../stores/authStore";

export default function AromiChat() {
  const token = useAuthStore((s) => s.token);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const {
    sessions, currentSession, messages, sending,
    fetchSessions, createSession, selectSession, sendMessage, deleteSession, applyAction,
  } = useChatStore();

  useEffect(() => { if (token) fetchSessions(); }, [token]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  if (!token) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    if (!currentSession) { const s = await createSession("AROMI Chat"); if (!s) return; }
    const msg = input.trim();
    setInput("");
    await sendMessage(msg);
  };

  const handleNewChat = () => createSession("AROMI Chat");

  const handleAction = async (type) => {
    const result = await applyAction(type);
    if (!result) return;
    if (result.error) { toast.error(result.error); return; }
    const labels = { workout: "Workout plan saved!", nutrition: "Nutrition plan saved!", profile: `Profile updated: ${result.updated_fields?.join(", ") || "done"}` };
    toast.success(labels[type] || "Done!");
  };

  const showActions = currentSession && messages.length >= 2 && !sending;

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!open && (
          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center z-50 transition-all duration-200 focus-ring"
            style={{ background: "var(--accent-dim)", border: "1px solid var(--accent)", backdropFilter: "blur(16px)", boxShadow: "0 0 24px var(--accent-dim)" }}>
            <span className="sr-only">Open AROMI assistant</span>
            <FiMessageCircle size={24} style={{ color: "var(--accent)" }} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 w-[min(380px,calc(100vw-24px))] h-[min(560px,calc(100vh-24px))] rounded-2xl flex flex-col z-50 overflow-hidden"
            style={{ background: "var(--surface-0)", border: "1px solid var(--border)", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}
            role="dialog"
            aria-modal="false"
            aria-label="AROMI assistant"
          >

            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between shrink-0" style={{ borderBottom: "1px solid var(--border-subtle)", background: "var(--surface-1)" }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid var(--accent)" }}>
                  AI
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--text-1)" }}>AROMI</p>
                  <p className="text-[11px]" style={{ color: "var(--text-4)" }}>Your wellness coach</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={handleNewChat} className="btn btn-ghost p-1.5 rounded-lg focus-ring" title="New chat" aria-label="Start new chat">
                  <FiPlus size={16} />
                </button>
                <button onClick={() => setOpen(false)} className="btn btn-ghost p-1.5 rounded-lg focus-ring" aria-label="Close assistant">
                  <FiX size={16} />
                </button>
              </div>
            </div>

            {/* Session Tabs */}
            {sessions.length > 1 && (
              <div className="flex gap-1 px-3 py-2 overflow-x-auto shrink-0" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                {sessions.slice(0, 5).map((s) => (
                  <button key={s.id} onClick={() => selectSession(s.id)}
                    className={`select-chip text-[11px] focus-ring ${currentSession?.id === s.id ? "active" : ""}`}
                    aria-label={`Open chat session ${s.title}`}
                  >
                    <span className="truncate max-w-[80px]">{s.title}</span>
                    <span onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }} className="ml-1 opacity-40 hover:opacity-100" role="button" tabIndex={0} aria-label={`Delete session ${s.title}`} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); deleteSession(s.id); } }}>
                      <FiTrash2 size={10} />
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" role="log" aria-live="polite" aria-label="AROMI chat messages">
              {!currentSession && messages.length === 0 && (
                <div className="text-center text-sm mt-16" style={{ color: "var(--text-4)" }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: "var(--accent-dim)" }}>
                    <FiMessageCircle size={28} style={{ color: "var(--accent)", opacity: 0.6 }} />
                  </div>
                  <p className="font-medium" style={{ color: "var(--text-2)" }}>Hi! I&apos;m AROMI 👋</p>
                  <p className="mt-1">Your AI wellness coach. Ask me about workouts, nutrition, or any health topic!</p>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <article className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === "user" ? "rounded-br-md" : "rounded-bl-md"}`}
                    style={msg.role === "user"
                      ? { background: "var(--accent-dim)", border: "1px solid var(--accent)", color: "var(--text-1)" }
                      : { background: "var(--surface-1)", border: "1px solid var(--border-subtle)", color: "var(--text-2)" }
                    }>
                    {msg.content}
                  </article>
                </div>
              ))}

              {sending && (
                <div className="flex justify-start">
                  <div className="px-4 py-2.5 rounded-2xl rounded-bl-md text-sm"
                    style={{ background: "var(--surface-1)", border: "1px solid var(--border-subtle)", color: "var(--text-4)" }}>
                    <span className="inline-flex gap-1">
                      <span className="animate-bounce" style={{ color: "var(--accent)" }}>●</span>
                      <span className="animate-bounce" style={{ color: "var(--violet)", animationDelay: "0.1s" }}>●</span>
                      <span className="animate-bounce" style={{ color: "var(--accent)", animationDelay: "0.2s" }}>●</span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Action Buttons */}
            {showActions && (
              <div className="px-3 py-2 shrink-0" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                <p className="text-[11px] mb-1.5" style={{ color: "var(--text-4)" }}>Save from this conversation:</p>
                <div className="flex gap-1.5">
                  <button onClick={() => handleAction("workout")} className="btn btn-accent-soft py-1.5 px-2.5 rounded-lg text-[11px] focus-ring" aria-label="Save workout plan from chat">
                    <FiActivity size={12} /> Workout
                  </button>
                  <button onClick={() => handleAction("nutrition")} className="btn btn-warning-soft py-1.5 px-2.5 rounded-lg text-[11px] focus-ring" aria-label="Save nutrition plan from chat">
                    <GiMeal size={12} /> Nutrition
                  </button>
                  <button onClick={() => handleAction("profile")} className="btn btn-violet-soft py-1.5 px-2.5 rounded-lg text-[11px] focus-ring" aria-label="Update profile from chat">
                    <FiUser size={12} /> Profile
                  </button>
                </div>
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 shrink-0" style={{ borderTop: "1px solid var(--border-subtle)" }}>
              <div className="flex gap-2">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask AROMI anything..." disabled={sending}
                  className="flex-1 px-3 py-2.5 input rounded-xl text-sm"
                  aria-label="Message AROMI assistant"
                />
                <button type="submit" disabled={!input.trim() || sending}
                  className="btn btn-primary p-2.5 rounded-xl disabled:opacity-40 focus-ring"
                  aria-label="Send message"
                >
                  <FiSend size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
