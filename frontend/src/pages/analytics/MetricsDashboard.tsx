import { motion } from "framer-motion";
import { FiActivity, FiDroplet, FiHeart, FiTrendingUp } from "react-icons/fi";
import { MetricCard, ChartCard } from "../../components/ui";
import AnalyticsTabs from "./AnalyticsTabs";

export default function MetricsDashboard() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <AnalyticsTabs />
      <h1 style={{ color: "var(--text-1)" }}>Health Metrics</h1>
      <p className="text-sm" style={{ color: "var(--text-2)" }}>Track your key health indicators over time.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard icon={FiHeart} title="Heart Rate" value="72 bpm" subtitle="Resting average" trendLabel="Weekly trend" trend={[75, 74, 72, 73, 71, 72]} color="var(--color-rose)" />
        <MetricCard icon={FiActivity} title="Blood Pressure" value="120/80" subtitle="Normal" trendLabel="Weekly trend" trend={[122, 120, 118, 120, 121, 120]} color="var(--color-primary)" />
        <MetricCard icon={FiDroplet} title="Blood Sugar" value="95 mg/dL" subtitle="Fasting" trendLabel="Weekly trend" trend={[98, 95, 94, 96, 92, 95]} color="var(--color-warning)" />
        <MetricCard icon={FiTrendingUp} title="BMI" value="22.4" subtitle="Healthy weight" trendLabel="Monthly trend" trend={[22.6, 22.5, 22.4, 22.4]} color="var(--color-success)" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard icon={FiHeart} title="Heart Rate History" subtitle="Beats per minute over 7 days">
          <div className="h-48 flex items-end gap-2 mt-4">
             {[70, 72, 75, 71, 69, 72, 74].map((v, i) => (
               <div key={i} className="flex-1 rounded-t transition-all duration-500 hover:opacity-80" style={{ height: `${(v / 100) * 100}%`, background: "var(--color-rose)" }} />
             ))}
          </div>
        </ChartCard>
        <ChartCard icon={FiActivity} title="Blood Pressure History" subtitle="Systolic over 7 days">
           <div className="h-48 flex items-end gap-2 mt-4">
             {[120, 118, 122, 119, 121, 117, 120].map((v, i) => (
               <div key={i} className="flex-1 rounded-t transition-all duration-500 hover:opacity-80" style={{ height: `${(v / 140) * 100}%`, background: "var(--color-primary)" }} />
             ))}
          </div>
        </ChartCard>
      </div>
    </motion.div>
  );
}
