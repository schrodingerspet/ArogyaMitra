import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAssessment, getInsights, getLatestAssessment } from "../../../api/health";

const healthKeys = {
  latest: ["health", "latest"] as const,
  insights: ["health", "insights"] as const,
};

export function useLatestAssessment() {
  return useQuery({
    queryKey: healthKeys.latest,
    queryFn: async () => (await getLatestAssessment()).data,
  });
}

export function useHealthInsights() {
  return useQuery({
    queryKey: healthKeys.insights,
    queryFn: async () => (await getInsights()).data,
  });
}

export function useCreateAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => (await createAssessment(payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: healthKeys.latest });
      queryClient.invalidateQueries({ queryKey: healthKeys.insights });
    },
  });
}
