import { useQuery } from "@tanstack/react-query";
import { 
  fetchMedicationsData, 
  fetchNotifications, 
  fetchSymptoms, 
  fetchVaccinations 
} from "../../api/tracking";

export const useMedicationsData = () => {
  return useQuery({
    queryKey: ["tracking", "medications"],
    queryFn: fetchMedicationsData,
  });
};

export const useNotifications = () => {
  return useQuery({
    queryKey: ["tracking", "notifications"],
    queryFn: fetchNotifications,
  });
};

export const useSymptoms = () => {
  return useQuery({
    queryKey: ["tracking", "symptoms"],
    queryFn: fetchSymptoms,
  });
};

export const useVaccinations = () => {
  return useQuery({
    queryKey: ["tracking", "vaccinations"],
    queryFn: fetchVaccinations,
  });
};
