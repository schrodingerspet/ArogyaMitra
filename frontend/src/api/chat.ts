import API from "./axios";

export const createSession = (data) => API.post("/chat/sessions", data);
export const getSessions = () => API.get("/chat/sessions");
export const getSession = (id) => API.get(`/chat/sessions/${id}`);
export const sendMessage = (sessionId, data) =>
  API.post(`/chat/sessions/${sessionId}/messages`, data);
export const getMessages = (sessionId) =>
  API.get(`/chat/sessions/${sessionId}/messages`);
export const deleteSession = (id) => API.delete(`/chat/sessions/${id}`);
export const applyAction = (sessionId, actionType) =>
  API.post(`/chat/sessions/${sessionId}/apply-action`, { action_type: actionType });
