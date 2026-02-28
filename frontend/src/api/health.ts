import API from "./axios";

export const createAssessment = (data) => API.post("/health/assessment", data);
export const getAssessments = () => API.get("/health/assessments");
export const getLatestAssessment = () => API.get("/health/assessment/latest");
export const getInsights = () => API.get("/health/insights");
export const deleteAssessment = (id) => API.delete(`/health/assessment/${id}`);
