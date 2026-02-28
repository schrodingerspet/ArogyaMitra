import API from "./axios";

export const generateWorkout = (data) => API.post("/workouts/generate", data);
export const createWorkout = (data) => API.post("/workouts/", data);
export const getWorkouts = () => API.get("/workouts/");
export const getWorkout = (id) => API.get(`/workouts/${id}`);
export const deleteWorkout = (id) => API.delete(`/workouts/${id}`);
export const getExercises = (id) => API.get(`/workouts/${id}/exercises`);
