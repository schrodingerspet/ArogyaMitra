import api from "./axios";

export const fetchAvailableSlots = async (doctorId: number) => {
  const response = await api.get(`/appointments/slots/${doctorId}`);
  return response.data;
};

export const fetchRecommendations = async () => {
  const response = await api.get("/appointments/recommendations");
  return response.data;
};

export const fetchReminders = async () => {
  const response = await api.get("/appointments/reminders");
  return response.data;
};

export const fetchWaitingList = async () => {
  const response = await api.get("/appointments/waiting-list");
  return response.data;
};
