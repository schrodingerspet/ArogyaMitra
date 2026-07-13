import { motion } from "framer-motion";
import { FiCpu, FiStar, FiTrendingUp } from "react-icons/fi";
import { Card } from "../../components/ui";
import AnalyticsTabs from "./AnalyticsTabs";

import { useAnalyticsInsights } from "../../features/analytics/hooks/useAnalyticsQueries";

export default function InsightsDashboard() {
  const { data, isLoading } = useAnalyticsInsights();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <AnalyticsTabs />
      <h1 style={{ color: "var(--text-1)" }}>AI Health Insights</h1>
      <p className="text-sm" style={{ color: "var(--text-2)" }}>Synthesized AI summaries based on your metrics and workouts.</p>

      <Card className="glass-subtle p-6 relative overflow-hidden" style={{ border: "1px solid var(--accent)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--accent)", opacity: 0.05 }} />
        <div className="relative flex gap-4">
          <div className="p-3 rounded-full self-start" style={{ background: "var(--surface-2)" }}>
            <FiCpu className="text-2xl" style={{ color: "var(--accent-light)" }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold" style={{ color: "var(--text-1)" }}>Weekly AI Summary</h3>
            <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--text-2)" }}>
              {isLoading ? "Generating insights..." : data?.summary || "No insights available for this period."}
            </p>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="glass-subtle p-5">
           <h4 className="font-medium flex items-center gap-2" style={{ color: "var(--text-1)" }}>
             <FiTrendingUp style={{ color: "var(--color-success)" }} /> Positive Trends
           </h4>
           <ul className="mt-4 space-y-2 text-sm" style={{ color: "var(--text-2)" }}>
             {data?.positive_trends?.length ? data.positive_trends.map((pt: string, i: number) => (
               <li key={i}>• {pt}</li>
             )) : <li>• Not enough data to spot trends</li>}
           </ul>
        </Card>
        <Card className="glass-subtle p-5">
           <h4 className="font-medium flex items-center gap-2" style={{ color: "var(--text-1)" }}>
             <FiStar style={{ color: "var(--color-warning)" }} /> Areas for Improvement
           </h4>
           <ul className="mt-4 space-y-2 text-sm" style={{ color: "var(--text-2)" }}>
             {data?.improvement_areas?.length ? data.improvement_areas.map((ia: string, i: number) => (
               <li key={i}>• {ia}</li>
             )) : <li>• No critical areas identified right now</li>}
           </ul>
        </Card>
      </div>
    </motion.div>
  );
}
