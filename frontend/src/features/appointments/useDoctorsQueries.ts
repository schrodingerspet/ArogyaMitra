import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDoctors, getDoctor, submitFeedback } from '../../api/doctors';

export const useDoctors = () => {
  return useQuery({
    queryKey: ['doctors'],
    queryFn: getDoctors,
  });
};

export const useDoctor = (doctorId: number) => {
  return useQuery({
    queryKey: ['doctors', doctorId],
    queryFn: () => getDoctor(doctorId),
    enabled: !!doctorId,
  });
};

export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitFeedback,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['doctors', variables.doctorId] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });
};
