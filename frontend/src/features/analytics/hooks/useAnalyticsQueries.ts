import { useQuery } from "@tanstack/react-query";
import { getHealthMetrics, getInsights, getReports, getWeekly } from "../../../api/analytics";
import { useMemo } from "react";

export const ANALYTICS_KEYS = {
  healthMetrics: ["analytics", "healthMetrics"],
  insights: ["analytics", "insights"],
  reports: (b: string, r: string) => ["analytics", "reports", b, r],
  weekly: ["analytics", "weekly"], // reusing weekly for report dates
} as const;

export function useAnalyticsMetrics() {
  return useQuery({
    queryKey: ANALYTICS_KEYS.healthMetrics,
    queryFn: async () => (await getHealthMetrics()).data,
  });
}

export function useAnalyticsInsights() {
  return useQuery({
    queryKey: ANALYTICS_KEYS.insights,
    queryFn: async () => (await getInsights()).data,
  });
}

export function useAnalyticsReportDates() {
  // We fetch the weekly data to get a list of recent dates that have data
  const { data, isLoading } = useQuery({
    queryKey: ANALYTICS_KEYS.weekly,
    queryFn: async () => (await getWeekly()).data,
  });

  const availableDates = useMemo(() => {
    if (!data?.daily_breakdown) return [];
    return data.daily_breakdown.map((d: any) => d.date);
  }, [data]);

  return { availableDates, isLoading };
}

export function useAnalyticsReport(baseDate: string, recentDate: string) {
  return useQuery({
    queryKey: ANALYTICS_KEYS.reports(baseDate, recentDate),
    queryFn: async () => (await getReports(baseDate, recentDate)).data,
    enabled: !!baseDate && !!recentDate,
  });
}
