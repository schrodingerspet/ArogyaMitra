import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { Card } from "../../components/ui";
import AnalyticsTabs from "./AnalyticsTabs";

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
          <select className="input flex-1 w-full p-2 rounded-xl" defaultValue="2026-06-01" style={{ background: "var(--surface-1)", border: "1px solid var(--border-subtle)", color: "var(--text-1)" }}>
             <option value="2026-06-01">June 1, 2026 (Baseline)</option>
          </select>
          <span style={{ color: "var(--text-3)" }}>vs</span>
          <select className="input flex-1 w-full p-2 rounded-xl" defaultValue="2026-07-01" style={{ background: "var(--surface-1)", border: "1px solid var(--border-subtle)", color: "var(--text-1)" }}>
             <option value="2026-07-01">July 1, 2026 (Recent)</option>
          </select>
          <button className="btn btn-primary px-4 py-2 rounded-xl text-sm w-full sm:w-auto">Compare</button>
        </div>

        <div className="rounded-xl p-4 border" style={{ background: "var(--surface-1)", borderColor: "var(--border-subtle)" }}>
          <div className="flex items-center justify-between pb-3 border-b" style={{ borderBottomColor: "var(--border-subtle)" }}>
            <span className="text-xs uppercase font-bold" style={{ color: "var(--text-3)", width: "30%" }}>Metric</span>
            <span className="text-xs uppercase font-bold text-center" style={{ color: "var(--text-3)", width: "20%" }}>Baseline</span>
            <span className="w-[12px]" />
            <span className="text-xs uppercase font-bold text-center" style={{ color: "var(--text-3)", width: "20%" }}>Recent</span>
            <span className="text-xs uppercase font-bold text-right" style={{ color: "var(--text-3)", width: "20%" }}>Change</span>
          </div>
          
          <MetricRow label="Weight" oldVal={82.5} newVal={79.2} unit="kg" betterIs="lower" />
          <MetricRow label="Blood Sugar" oldVal={105} newVal={95} unit="mg/dL" betterIs="lower" />
          <MetricRow label="Heart Rate" oldVal={76} newVal={72} unit="bpm" betterIs="lower" />
          <MetricRow label="VO2 Max" oldVal={38.5} newVal={41.2} unit="mL/kg" betterIs="higher" />
        </div>
      </Card>
    </motion.div>
  );
}
