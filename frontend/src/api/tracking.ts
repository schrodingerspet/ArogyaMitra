import api from "./axios";

export const fetchMedicationsData = async () => {
  const response = await api.get("/tracking/medications");
  return response.data;
};

export const fetchNotifications = async () => {
  const response = await api.get("/tracking/notifications");
  return response.data;
};

export const fetchSymptoms = async () => {
  const response = await api.get("/tracking/symptoms");
  return response.data;
};

export const fetchVaccinations = async () => {
  const response = await api.get("/tracking/vaccinations");
  return response.data;
};
