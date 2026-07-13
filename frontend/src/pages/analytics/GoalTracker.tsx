import { motion } from "framer-motion";
import { FiCheckCircle, FiTarget } from "react-icons/fi";
import { Card } from "../../components/ui";
import AnalyticsTabs from "./AnalyticsTabs";

function GoalProgress({ title, current, target, unit, colorVar }: any) {
  const percent = Math.min((current / target) * 100, 100);
  return (
    <Card className="p-5 glass-subtle">
      <div className="flex justify-between items-end mb-3">
        <div>
          <h4 className="font-medium text-sm" style={{ color: "var(--text-1)" }}>{title}</h4>
          <p className="text-xs mt-1" style={{ color: "var(--text-3)" }}>{current} / {target} {unit}</p>
        </div>
        <span className="text-xs font-bold" style={{ color: "var(--text-1)" }}>{Math.round(percent)}%</span>
      </div>
      <div className="w-full rounded-xl h-3" style={{ background: "var(--surface-1)", border: "1px solid var(--border-subtle)" }}>
        <div
          className="h-full rounded-xl"
          style={{ width: `${Math.max(percent, 2)}%`, background: `var(${colorVar})` }}
        />
      </div>
    </Card>
  );
}

export default function GoalTracker() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <AnalyticsTabs />
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "var(--text-1)" }}>Health Goals</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>Monitor your daily milestones.</p>
        </div>
        <button className="btn btn-primary text-sm py-2 px-4 rounded-xl flex items-center gap-2">
          <FiTarget /> New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GoalProgress title="Water Intake" current={1.2} target={2.5} unit="Liters" colorVar="--color-info" />
        <GoalProgress title="Sleep" current={6.5} target={8.0} unit="Hours" colorVar="--color-accent-violet" />
        <GoalProgress title="Active Calories" current={450} target={500} unit="kcal" colorVar="--color-warning" />
        <GoalProgress title="Steps" current={8500} target={10000} unit="steps" colorVar="--color-success" />
      </div>

      <Card className="p-5 mt-6 glass-subtle">
        <h3 className="font-semibold text-sm flex items-center gap-2" style={{ color: "var(--text-1)" }}>
          <FiCheckCircle style={{ color: "var(--color-success)" }} /> Recent Achievements
        </h3>
        <ul className="mt-4 space-y-3">
          <li className="text-sm p-3 rounded-lg border" style={{ background: "var(--surface-1)", color: "var(--text-2)", borderColor: "var(--border-subtle)" }}>
            🎉 <strong>7-Day Streak:</strong> You hit your water goal for a full week!
          </li>
          <li className="text-sm p-3 rounded-lg border" style={{ background: "var(--surface-1)", color: "var(--text-2)", borderColor: "var(--border-subtle)" }}>
            🏆 <strong>Calorie Crusher:</strong> Burned over 3000 active calories this month.
          </li>
        </ul>
      </Card>
    </motion.div>
  );
}
