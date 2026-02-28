import API from "./axios";

export const getSummary = () => API.get("/analytics/summary");
export const getWeekly = () => API.get("/analytics/weekly");
export const getWeightTrend = () => API.get("/analytics/weight-trend");
export const getStreak = () => API.get("/analytics/streak");
