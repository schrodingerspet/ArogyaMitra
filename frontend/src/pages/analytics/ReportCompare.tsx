import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { Card } from "../../components/ui";
import AnalyticsTabs from "./AnalyticsTabs";
import { useAnalyticsReportDates, useAnalyticsReport } from "../../features/analytics/hooks/useAnalyticsQueries";

function MetricRow({ label, oldVal, newVal, unit, betterIs }: any) {
  const diff = newVal - oldVal;
  const isBetter = betterIs === "higher" ? diff >= 0 : diff <= 0;
  const color = diff === 0 ? "var(--text-3)" : isBetter ? "var(--color-success)" : "var(--color-danger)";
  
  return (
    <div className="flex items-center justify-between py-3 border-b border-subtle last:border-0" style={{ borderBottomColor: "var(--border-subtle)" }}>
      <span className="text-sm font-medium" style={{ color: "var(--text-2)", width: "30%" }}>{label}</span>
      <span className="text-sm text-center" style={{ color: "var(--text-3)", width: "20%" }}>{oldVal} {unit}</span>
      <FiArrowRight className="text-xs" style={{ color: "var(--text-4)" }} />
      <span className="text-sm text-center" style={{ color: "var(--text-1)", width: "20%" }}>{newVal} {unit}</span>
      <span className="text-sm font-bold text-right" style={{ color, width: "20%" }}>
        {diff > 0 ? "+" : ""}{diff.toFixed(1)}
      </span>
    </div>
  );
}

export default function ReportCompare() {
  const { availableDates, isLoading: datesLoading } = useAnalyticsReportDates();
  const [baseDate, setBaseDate] = useState("");
  const [recentDate, setRecentDate] = useState("");

  useEffect(() => {
    if (availableDates.length > 0 && !baseDate && !recentDate) {
      setBaseDate(availableDates[0]);
      setRecentDate(availableDates[availableDates.length - 1]);
    }
  }, [availableDates, baseDate, recentDate]);

  const { data, isLoading } = useAnalyticsReport(baseDate, recentDate);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <AnalyticsTabs />
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "var(--text-1)" }}>Report Comparison</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>Compare health metrics across different dates.</p>
        </div>
      </div>

      <Card className="p-6 glass-subtle">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <select 
            className="input flex-1 w-full p-2 rounded-xl" 
            value={baseDate}
            onChange={(e) => setBaseDate(e.target.value)}
            disabled={datesLoading || !availableDates.length}
            style={{ background: "var(--surface-1)", border: "1px solid var(--border-subtle)", color: "var(--text-1)" }}
          >
             {availableDates.map((d: string) => <option key={d} value={d}>{d}</option>)}
             {!availableDates.length && <option value="">No dates available</option>}
          </select>
          <span style={{ color: "var(--text-3)" }}>vs</span>
          <select 
            className="input flex-1 w-full p-2 rounded-xl" 
            value={recentDate}
            onChange={(e) => setRecentDate(e.target.value)}
            disabled={datesLoading || !availableDates.length}
            style={{ background: "var(--surface-1)", border: "1px solid var(--border-subtle)", color: "var(--text-1)" }}
          >
             {availableDates.map((d: string) => <option key={d} value={d}>{d}</option>)}
             {!availableDates.length && <option value="">No dates available</option>}
          </select>
        </div>

        <div className="rounded-xl p-4 border" style={{ background: "var(--surface-1)", borderColor: "var(--border-subtle)" }}>
          <div className="flex items-center justify-between pb-3 border-b" style={{ borderBottomColor: "var(--border-subtle)" }}>
            <span className="text-xs uppercase font-bold" style={{ color: "var(--text-3)", width: "30%" }}>Metric</span>
            <span className="text-xs uppercase font-bold text-center" style={{ color: "var(--text-3)", width: "20%" }}>Baseline</span>
            <span className="w-[12px]" />
            <span className="text-xs uppercase font-bold text-center" style={{ color: "var(--text-3)", width: "20%" }}>Recent</span>
            <span className="text-xs uppercase font-bold text-right" style={{ color: "var(--text-3)", width: "20%" }}>Change</span>
          </div>
          
          {isLoading ? (
            <div className="text-sm text-center py-4" style={{ color: "var(--text-3)" }}>Loading comparison...</div>
          ) : data?.metrics?.length ? (
            data.metrics.map((m: any, i: number) => (
              <MetricRow key={i} label={m.label} oldVal={m.old_val} newVal={m.new_val} unit={m.unit} betterIs={m.better_is} />
            ))
          ) : (
             <div className="text-sm text-center py-4" style={{ color: "var(--text-3)" }}>No matching data found for the selected dates.</div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
