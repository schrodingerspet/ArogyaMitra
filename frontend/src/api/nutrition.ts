import API from "./axios";

export const generateNutrition = (data) => API.post("/nutrition/generate", data);
export const createNutrition = (data) => API.post("/nutrition/", data);
export const getNutritionPlans = () => API.get("/nutrition/");
export const getNutritionPlan = (id) => API.get(`/nutrition/${id}`);
export const deleteNutritionPlan = (id) => API.delete(`/nutrition/${id}`);
export const getMeals = (id) => API.get(`/nutrition/${id}/meals`);
