import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  FiActivity,
  FiAward,
  FiHeart,
  FiMessageCircle,
  FiPlusCircle,
  FiTarget,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";
import { GiMeal } from "react-icons/gi";
import useAuthStore from "../../stores/authStore";
import { ActionCard, Card, ChartCard, MetricCard } from "../../components/ui";
import { useDashboardData } from "../../features/dashboard/hooks/useDashboardData";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-8 w-64 rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-44 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="skeleton h-80 xl:col-span-2 rounded-2xl" />
        <div className="skeleton h-80 rounded-2xl" />
      </div>
    </div>
  );
}

function WeeklyBars({ daily = [] }) {
  const max = Math.max(...daily.map((d) => d.calories_burned || 0), 1);
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[420px] h-56 flex items-end gap-3">
        {daily.map((d) => {
          const v = d.calories_burned || 0;
          const h = Math.max((v / max) * 100, 6);
          const label = new Date(d.date).toLocaleDateString("en", { weekday: "short" });
          return (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-2">
              <div className="text-[11px]" style={{ color: "var(--text-3)" }}>{v}</div>
              <div className="w-full rounded-xl" style={{ height: `${h}%`, minHeight: 12, background: "linear-gradient(180deg, var(--color-accent-start), var(--color-accent-end))" }} />
              <div className="text-[11px]" style={{ color: "var(--text-4)" }}>{label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StreakCard({ streak }) {
  const current = streak?.current_streak ?? 0;
  const longest = streak?.longest_streak ?? 0;
  const completion = longest > 0 ? Math.min(current / longest, 1) : 0;
  return (
    <ChartCard
      icon={FiAward}
      title="Workout streak"
      subtitle="Gamified consistency tracker"
      className="h-full"
    >
      <div className="space-y-5">
        <div className="w-full rounded-xl h-3" style={{ background: "var(--surface-1)", border: "1px solid var(--border-subtle)" }}>
          <div
            className="h-full rounded-xl"
            style={{ width: `${Math.max(completion * 100, 4)}%`, background: "linear-gradient(90deg, var(--color-warning), #f5d475)" }}
            aria-label={`Streak completion ${Math.round(completion * 100)} percent`}
          />
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-[11px]" style={{ color: "var(--text-3)" }}>Current</p>
            <p className="text-2xl font-bold" style={{ color: "var(--text-1)" }}>{current}</p>
          </div>
          <div>
            <p className="text-[11px]" style={{ color: "var(--text-3)" }}>Longest</p>
            <p className="text-2xl font-bold" style={{ color: "var(--text-1)" }}>{longest}</p>
          </div>
          <div>
            <p className="text-[11px]" style={{ color: "var(--text-3)" }}>Total days</p>
            <p className="text-2xl font-bold" style={{ color: "var(--text-1)" }}>{streak?.total_workout_days ?? 0}</p>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}

function ActivityFeed({ summary, streak }) {
  const items = [
    `You burned ${summary?.total_calories_burned ?? 0} calories this week.`,
    `Current streak: ${streak?.current_streak ?? 0} days.`,
    `${summary?.total_workouts ?? 0} workout sessions completed.`,
  ];
  return (
    <Card className="p-5 h-full">
      <h3 className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>Activity feed</h3>
      <ul className="mt-4 space-y-3" role="list">
        {items.map((item) => (
          <li key={item} className="text-xs p-3 rounded-xl" style={{ color: "var(--text-2)", background: "var(--surface-1)", border: "1px solid var(--border-subtle)" }}>
            {item}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const { summary, weekly, streak, loading } = useDashboardData();
  const reducedMotion = useReducedMotion();

  const daily = useMemo(() => weekly?.daily_breakdown || [], [weekly]);
  const sparkCalories = useMemo(() => (daily.length ? daily.map((d) => d.calories_burned || 0) : [4, 6, 8, 5, 9, 7, 10]), [daily]);
  const sparkWorkouts = useMemo(() => (daily.length ? daily.map((d) => d.workouts_completed || 0) : [1, 1, 2, 1, 0, 2, 1]), [daily]);
  const sparkWeight = useMemo(() => {
    const base = Number(summary?.current_weight) || 0;
    return base ? [base - 0.7, base - 0.4, base - 0.5, base - 0.2, base - 0.1, base] : [55, 55.2, 55.1, 55.4, 55.6, 55.7];
  }, [summary?.current_weight]);
  const sparkStreak = useMemo(() => [1, 2, 3, 4, 4, 5, streak?.current_streak ?? 0], [streak?.current_streak]);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reducedMotion ? 0 : 0.07, delayChildren: reducedMotion ? 0 : 0.05 } },
  };
  const item = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", damping: 20, stiffness: 220 } },
  };

  if (loading && !summary) return <DashboardSkeleton />;

  return (
    <motion.div initial="hidden" animate="show" variants={container} className="space-y-6">
      <motion.div variants={item}>
        <h1 style={{ color: "var(--text-1)" }}>
          {getGreeting()},{" "}
          <span className="text-gradient">{user?.name?.split(" ")[0] || "Athlete"}</span>
        </h1>
        <p className="text-sm mt-2" style={{ color: "var(--text-2)" }}>
          Your wellness dashboard is organized for quick decisions and consistent progress.
        </p>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-3">
          <MetricCard
            icon={FiZap}
            title="Calories burned"
            value={`${summary?.total_calories_burned ?? 0}`}
            subtitle="Weekly total"
            trendLabel="7-day energy burn"
            trend={sparkCalories}
            color="var(--color-warning)"
          />
        </div>
        <div className="xl:col-span-3">
          <MetricCard
            icon={FiActivity}
            title="Workouts completed"
            value={`${summary?.total_workouts ?? 0}`}
            subtitle="Sessions finished"
            trendLabel="Session consistency"
            trend={sparkWorkouts}
            color="var(--color-accent-start)"
          />
        </div>
        <div className="xl:col-span-3">
          <MetricCard
            icon={FiTrendingUp}
            title="Current weight"
            value={summary?.current_weight ? `${summary.current_weight} kg` : "—"}
            subtitle={summary?.weight_change != null ? `${summary.weight_change > 0 ? "+" : ""}${summary.weight_change} kg vs baseline` : "No baseline yet"}
            trendLabel="Weight trend"
            trend={sparkWeight}
            color="var(--color-accent-violet)"
          />
        </div>
        <div className="xl:col-span-3">
          <MetricCard
            icon={FiTarget}
            title="Current streak"
            value={`${streak?.current_streak ?? 0} days`}
            subtitle="Keep momentum"
            trendLabel="Momentum curve"
            trend={sparkStreak}
            color="var(--color-success)"
          />
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <ChartCard
          icon={FiHeart}
          title="Weekly activity"
          subtitle="Calories burned per day"
          className="xl:col-span-8"
        >
          <WeeklyBars daily={daily} />
        </ChartCard>
        <div className="xl:col-span-4">
          <StreakCard streak={streak} />
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <Card className="p-5 xl:col-span-8">
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>Quick actions</h3>
          <p className="text-xs mt-1" style={{ color: "var(--text-3)" }}>Start key flows in one click.</p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ActionCard icon={FiActivity} title="Workout planner" subtitle="Generate adaptive sessions" to="/workouts/generate" buttonLabel="Generate workout" tone="btn-accent-soft" />
            <ActionCard icon={GiMeal} title="Meal planner" subtitle="Build nutrition plans" to="/nutrition/generate" buttonLabel="Generate meals" tone="btn-warning-soft" />
            <ActionCard icon={FiHeart} title="Health assessment" subtitle="Update BMI / BMR profile" to="/health" buttonLabel="Save assessment" tone="btn-rose-soft" />
            <ActionCard icon={FiPlusCircle} title="Progress log" subtitle="Track daily metrics quickly" to="/progress" buttonLabel="Log progress" tone="btn-info-soft" />
          </div>
        </Card>

        <div className="space-y-4 xl:col-span-4">
          <ActivityFeed summary={summary} streak={streak} />
          <Card className="p-5">
            <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--text-1)" }}>
              <FiMessageCircle style={{ color: "var(--accent-light)" }} />
              AI assistant
            </h3>
            <p className="text-xs mt-2" style={{ color: "var(--text-2)" }}>
              AROMI is docked in the bottom-right. Ask for workout tweaks, nutrition swaps, and motivation support.
            </p>
            <Link to="/dashboard" className="btn btn-primary mt-4 w-full py-2.5 text-sm rounded-xl">
              Open assistant widget
            </Link>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}
