import { create } from "zustand";
import * as chatApi from "../api/chat";

const useChatStore = create((set, get) => ({
  sessions: [],
  currentSession: null,
  messages: [],
  loading: false,
  sending: false,

  fetchSessions: async () => {
    set({ loading: true });
    try {
      const res = await chatApi.getSessions();
      set({ sessions: res.data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  createSession: async (title) => {
    try {
      const res = await chatApi.createSession({ title: title || "New Chat" });
      const session = res.data;
      set((s) => ({ sessions: [session, ...s.sessions], currentSession: session, messages: [] }));
      return session;
    } catch {
      return null;
    }
  },

  selectSession: async (id) => {
    set({ loading: true });
    try {
      const [sessionRes, msgRes] = await Promise.all([
        chatApi.getSession(id),
        chatApi.getMessages(id),
      ]);
      set({ currentSession: sessionRes.data, messages: msgRes.data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  sendMessage: async (content) => {
    const { currentSession } = get();
    if (!currentSession) return;
    // Optimistically add user message
    const userMsg = { id: Date.now(), role: "user", content, created_at: new Date().toISOString() };
    set((s) => ({ messages: [...s.messages, userMsg], sending: true }));
    try {
      const res = await chatApi.sendMessage(currentSession.id, { content });
      // API returns single AI message
      set((s) => ({
        messages: [...s.messages, res.data],
        sending: false,
      }));
    } catch {
      set({ sending: false });
    }
  },

  deleteSession: async (id) => {
    try {
      await chatApi.deleteSession(id);
      set((s) => ({
        sessions: s.sessions.filter((sess) => sess.id !== id),
        currentSession: s.currentSession?.id === id ? null : s.currentSession,
        messages: s.currentSession?.id === id ? [] : s.messages,
      }));
      return true;
    } catch {
      return false;
    }
  },

  applyAction: async (actionType) => {
    const { currentSession } = get();
    if (!currentSession) return null;
    set({ sending: true });
    try {
      const res = await chatApi.applyAction(currentSession.id, actionType);
      // Refresh messages to get the confirmation message
      const msgRes = await chatApi.getMessages(currentSession.id);
      set({ messages: msgRes.data, sending: false });
      return res.data;
    } catch (err) {
      set({ sending: false });
      return { error: err.response?.data?.detail || "Action failed" };
    }
  },
}));

export default useChatStore;
