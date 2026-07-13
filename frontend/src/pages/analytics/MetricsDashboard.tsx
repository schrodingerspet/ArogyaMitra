import { motion } from "framer-motion";
import { FiActivity, FiDroplet, FiHeart, FiTrendingUp } from "react-icons/fi";
import { MetricCard, ChartCard } from "../../components/ui";
import AnalyticsTabs from "./AnalyticsTabs";

import { useAnalyticsMetrics } from "../../features/analytics/hooks/useAnalyticsQueries";

export default function MetricsDashboard() {
  const { data, isLoading } = useAnalyticsMetrics();

  const heartRateTrend = data?.heart_rate?.map((d: any) => d.value) || [];
  const latestHeartRate = heartRateTrend.length ? `${heartRateTrend[heartRateTrend.length - 1]} bpm` : "—";

  const bpTrend = data?.blood_pressure_systolic?.map((d: any) => d.value) || [];
  const latestBp = bpTrend.length ? `${bpTrend[bpTrend.length - 1]} mmHg` : "—";

  const sugarTrend = data?.blood_sugar?.map((d: any) => d.value) || [];
  const latestSugar = sugarTrend.length ? `${sugarTrend[sugarTrend.length - 1]} mg/dL` : "—";

  const bmiTrend = data?.bmi?.map((d: any) => d.value) || [];
  const latestBmi = bmiTrend.length ? `${bmiTrend[bmiTrend.length - 1]}` : "—";
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <AnalyticsTabs />
      <h1 style={{ color: "var(--text-1)" }}>Health Metrics</h1>
      <p className="text-sm" style={{ color: "var(--text-2)" }}>Track your key health indicators over time.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard icon={FiHeart} title="Heart Rate" value={latestHeartRate} subtitle="Resting average" trendLabel="Weekly trend" trend={heartRateTrend} color="var(--color-rose)" />
        <MetricCard icon={FiActivity} title="Blood Pressure" value={latestBp} subtitle="Normal" trendLabel="Weekly trend" trend={bpTrend} color="var(--color-primary)" />
        <MetricCard icon={FiDroplet} title="Blood Sugar" value={latestSugar} subtitle="Fasting" trendLabel="Weekly trend" trend={sugarTrend} color="var(--color-warning)" />
        <MetricCard icon={FiTrendingUp} title="BMI" value={latestBmi} subtitle="Healthy weight" trendLabel="Monthly trend" trend={bmiTrend} color="var(--color-success)" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard icon={FiHeart} title="Heart Rate History" subtitle="Beats per minute over 7 days">
          <div className="h-48 flex items-end gap-2 mt-4">
             {heartRateTrend.length ? heartRateTrend.map((v: number, i: number) => (
               <div key={i} className="flex-1 rounded-t transition-all duration-500 hover:opacity-80" style={{ height: `${Math.min((v / 150) * 100, 100)}%`, background: "var(--color-rose)" }} />
             )) : <div className="text-xs w-full text-center mt-10" style={{ color: "var(--text-3)" }}>No data available</div>}
          </div>
        </ChartCard>
        <ChartCard icon={FiActivity} title="Blood Pressure History" subtitle="Systolic over 7 days">
           <div className="h-48 flex items-end gap-2 mt-4">
             {bpTrend.length ? bpTrend.map((v: number, i: number) => (
               <div key={i} className="flex-1 rounded-t transition-all duration-500 hover:opacity-80" style={{ height: `${Math.min((v / 180) * 100, 100)}%`, background: "var(--color-primary)" }} />
             )) : <div className="text-xs w-full text-center mt-10" style={{ color: "var(--text-3)" }}>No data available</div>}
          </div>
        </ChartCard>
      </div>
    </motion.div>
  );
}
