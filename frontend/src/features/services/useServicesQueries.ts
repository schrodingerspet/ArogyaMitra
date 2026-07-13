import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getHospitals, getLabBookings, bookLabTest } from '../../api/services';

export const useHospitals = (type?: string) => {
  return useQuery({
    queryKey: ['hospitals', type],
    queryFn: () => getHospitals(type),
  });
};

export const useLabBookings = () => {
  return useQuery({
    queryKey: ['labBookings'],
    queryFn: getLabBookings,
  });
};

export const useBookLabTest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookLabTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labBookings'] });
    },
  });
};
