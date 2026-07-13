import API from "./axios";

export const getSummary = () => API.get("/analytics/summary");
export const getWeekly = () => API.get("/analytics/weekly");
export const getWeightTrend = () => API.get("/analytics/weight-trend");
export const getStreak = () => API.get("/analytics/streak");
export const getHealthMetrics = () => API.get("/analytics/health-metrics");
export const getInsights = () => API.get("/analytics/insights");
export const getReports = (base_date: string, recent_date: string) => 
    API.get(`/analytics/reports?base_date=${base_date}&recent_date=${recent_date}`);
