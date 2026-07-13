import api from './axios';

export const getHospitals = async (type?: string) => {
  const params = type ? { type } : {};
  const response = await api.get('/services/hospitals', { params });
  return response.data;
};

export const getLabBookings = async () => {
  const response = await api.get('/services/labs');
  return response.data;
};

export const bookLabTest = async (data: { test_name: string; lab_name: string; booking_date: string }) => {
  const response = await api.post('/services/labs', data);
  return response.data;
};
