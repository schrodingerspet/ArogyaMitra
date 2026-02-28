import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteWorkout,
  generateWorkout,
  getExercises,
  getWorkout,
  getWorkouts,
} from "../../../api/workouts";

export const workoutKeys = {
  all: ["workouts"] as const,
  plan: (id: string | undefined) => ["workouts", "plan", id] as const,
  exercises: (id: string | undefined) => ["workouts", "exercises", id] as const,
};

export function useWorkoutPlans() {
  return useQuery({
    queryKey: workoutKeys.all,
    queryFn: async () => (await getWorkouts()).data,
  });
}

export function useWorkoutPlan(id: string | undefined) {
  return useQuery({
    queryKey: workoutKeys.plan(id),
    queryFn: async () => (await getWorkout(id)).data,
    enabled: Boolean(id),
  });
}

export function useWorkoutExercises(id: string | undefined) {
  return useQuery({
    queryKey: workoutKeys.exercises(id),
    queryFn: async () => (await getExercises(id)).data,
    enabled: Boolean(id),
  });
}

export function useGenerateWorkoutPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => (await generateWorkout(payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workoutKeys.all });
    },
  });
}

export function useDeleteWorkoutPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => deleteWorkout(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workoutKeys.all });
    },
  });
}
