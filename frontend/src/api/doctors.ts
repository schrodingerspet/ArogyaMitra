import api from './axios';

export const getDoctors = async () => {
  const response = await api.get('/doctors');
  return response.data;
};

export const getDoctor = async (doctorId: number) => {
  const response = await api.get(`/doctors/${doctorId}`);
  return response.data;
};

export const submitFeedback = async ({ doctorId, rating, comment }: { doctorId: number; rating: number; comment?: string }) => {
  const response = await api.post(`/doctors/${doctorId}/feedbacks`, { rating, comment });
  return response.data;
};
