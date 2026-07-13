import { useQuery } from "@tanstack/react-query";
import { 
  fetchAvailableSlots, 
  fetchRecommendations, 
  fetchReminders, 
  fetchWaitingList 
} from "../../api/appointments";

export const useAvailableSlots = (doctorId: number | null) => {
  return useQuery({
    queryKey: ["appointments", "slots", doctorId],
    queryFn: () => fetchAvailableSlots(doctorId as number),
    enabled: !!doctorId,
  });
};

export const useRecommendations = () => {
  return useQuery({
    queryKey: ["appointments", "recommendations"],
    queryFn: fetchRecommendations,
  });
};

export const useReminders = () => {
  return useQuery({
    queryKey: ["appointments", "reminders"],
    queryFn: fetchReminders,
  });
};

export const useWaitingList = () => {
  return useQuery({
    queryKey: ["appointments", "waiting-list"],
    queryFn: fetchWaitingList,
  });
};
