import api from "./axios";

export const fetchDocuments = async () => {
  const response = await api.get("/records/documents");
  return response.data;
};

export const fetchTimeline = async () => {
  const response = await api.get("/records/timeline");
  return response.data;
};
