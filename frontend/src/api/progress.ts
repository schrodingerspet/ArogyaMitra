import API from "./axios";

export const createProgress = (data) => API.post("/progress/", data);
export const getProgressRecords = () => API.get("/progress/");
export const getProgressRecord = (id) => API.get(`/progress/${id}`);
export const deleteProgressRecord = (id) => API.delete(`/progress/${id}`);
