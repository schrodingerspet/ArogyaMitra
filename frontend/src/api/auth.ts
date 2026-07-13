import API from "./axios";

export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);
export const getProfile = () => API.get("/auth/profile");
export const updateProfile = async (data: any) => {
  const response = await API.put('/auth/profile', data);
  return response.data;
};

export const getDependents = async () => {
  const response = await API.get('/auth/dependents');
  return response.data;
};
