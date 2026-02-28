import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStreak, getSummary, getWeekly } from "../../../api/analytics";


const DASHBOARD_KEYS = {
  summary: ["analytics", "summary"],
  weekly: ["analytics", "weekly"],
  streak: ["analytics", "streak"],
} as const;

export function useDashboardData() {
  const summaryQuery = useQuery({
    queryKey: DASHBOARD_KEYS.summary,
    queryFn: async () => (await getSummary()).data,
  });

  const weeklyQuery = useQuery({
    queryKey: DASHBOARD_KEYS.weekly,
    queryFn: async () => (await getWeekly()).data,
  });

  const streakQuery = useQuery({
    queryKey: DASHBOARD_KEYS.streak,
    queryFn: async () => (await getStreak()).data,
  });

  const loading = useMemo(
    () => summaryQuery.isLoading || weeklyQuery.isLoading || streakQuery.isLoading,
    [summaryQuery.isLoading, weeklyQuery.isLoading, streakQuery.isLoading]
  );

  return {
    summary: summaryQuery.data ?? null,
    weekly: weeklyQuery.data ?? null,
    streak: streakQuery.data ?? null,
    loading,
  };
}
