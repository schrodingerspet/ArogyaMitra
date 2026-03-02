import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiDroplet, FiStar, FiTrendingUp, FiZap } from "react-icons/fi";
import { getSummary, getStreak, getWeekly } from "../api/analytics";

const PANEL_ID = "right-utility-panel";
const HYDRATION_KEY = "hydration-ml";

const tipsByRoute = {
  "/dashboard": [
    "Review your streak first, then adjust today's session intensity.",
    "Hydration consistency improves recovery and energy output.",
  ],
  "/workouts": [
    "Keep warm-up and cooldown non-negotiable to reduce injury risk.",
    "If energy is low, lower volume before lowering movement quality.",
  ],
  "/nutrition": [
    "Pair meals with hydration checkpoints for steadier appetite control.",
    "Prioritize protein distribution across all major meals.",
  ],
  "/health": [
    "Update your assessment monthly for better AI recommendations.",
    "Track sleep quality with the same consistency as workouts.",
  ],
  "/progress": [
    "Use weekly averages instead of single-day fluctuations.",
    "Measure trend direction first, then absolute changes.",
  ],
  "/profile": [
    "Keep profile details current for more accurate adaptive plans.",
    "Short, specific goals improve plan quality and tracking.",
  ],
};

const getBaseRoute = (pathname: string) => {
  if (pathname.startsWith("/workouts")) return "/workouts";
  if (pathname.startsWith("/nutrition")) return "/nutrition";
  if (pathname.startsWith("/health")) return "/health";
  if (pathname.startsWith("/progress")) return "/progress";
  if (pathname.startsWith("/profile")) return "/profile";
  return "/dashboard";
};

function StatsSparkline({ values = [] }: { values?: number[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-1 h-16">
      {values.map((value, idx) => {
        const pct = Math.max((value / max) * 100, 8);
        return (
          <div
            key={`${value}-${idx}`}
            className="flex-1 rounded-md"
            style={{
              height: `${pct}%`,
              background: "linear-gradient(180deg, var(--accent-light), var(--accent))",
              opacity: 0.9,
            }}
          />
        );
      })}
    </div>
  );
}

export default function RightUtilityPanel({
  pathname,
  mode,
  open,
  onClose,
}: {
  pathname: string;
  mode: "desktop" | "tablet" | "mobile";
  open: boolean;
  onClose: () => void;
}) {
  const [hydrationMl, setHydrationMl] = useState(() => {
    const cached = Number(localStorage.getItem(HYDRATION_KEY));
    return Number.isFinite(cached) && cached > 0 ? cached : 1200;
  });

  const summaryQuery = useQuery({
    queryKey: ["utility", "summary"],
    queryFn: async () => (await getSummary()).data,
  });

  const streakQuery = useQuery({
    queryKey: ["utility", "streak"],
    queryFn: async () => (await getStreak()).data,
  });

  const weeklyQuery = useQuery({
    queryKey: ["utility", "weekly"],
    queryFn: async () => (await getWeekly()).data,
  });

  useEffect(() => {
    localStorage.setItem(HYDRATION_KEY, String(hydrationMl));
  }, [hydrationMl]);

  useEffect(() => {
    if (mode === "desktop" || !open) return;
    const panel = document.getElementById(PANEL_ID);
    const focusables = () =>
      [...(panel?.querySelectorAll("button, a[href], [tabindex]:not([tabindex='-1'])") ?? [])] as HTMLElement[];
    const first = focusables()[0];
    first?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const nodes = focusables();
      if (!nodes.length) return;
      const start = nodes[0];
      const end = nodes[nodes.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && active === start) {
        event.preventDefault();
        end.focus();
      } else if (!event.shiftKey && active === end) {
        event.preventDefault();
        start.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mode, open, onClose]);

  const summary = summaryQuery.data;
  const streak = streakQuery.data;
  const weekly = weeklyQuery.data;
  const bars = useMemo(
    () => (weekly?.daily_breakdown?.slice(-7)?.map((item: { calories_burned?: number }) => item.calories_burned || 0) ?? [80, 64, 92, 71, 99, 85, 90]),
    [weekly]
  );

  const routeTips = tipsByRoute[getBaseRoute(pathname)] || tipsByRoute["/dashboard"];
  const hydrationTarget = 2500;
  const hydrationPct = Math.min(hydrationMl / hydrationTarget, 1);
  const insightText = `You're at ${streak?.current_streak ?? 0} day streak with ${summary?.total_workouts ?? 0} workouts this period. Keep today's intensity steady and prioritize recovery.`;

  const panelBody = (
    <div id={PANEL_ID} className="utility-panel-body surface-frosted">
      <section className="surface-frosted p-4 space-y-3">
        <div className="flex items-center gap-2">
          <FiStar size={18} style={{ color: "var(--accent-light)" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>Daily AI insight</h3>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-2)" }}>{insightText}</p>
      </section>

      <section className="surface-frosted p-4 space-y-3">
        <div className="flex items-center gap-2">
          <FiDroplet size={18} style={{ color: "var(--info)" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>Hydration tracker</h3>
        </div>
        <div className="w-full h-2.5 rounded-full" style={{ background: "var(--surface-2)" }}>
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{ width: `${hydrationPct * 100}%`, background: "linear-gradient(90deg, var(--info), var(--accent))" }}
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs" style={{ color: "var(--text-2)" }}>{hydrationMl}ml / {hydrationTarget}ml</p>
          <button
            type="button"
            className="btn btn-info-soft px-3 py-1.5 text-xs"
            onClick={() => setHydrationMl((curr) => Math.min(curr + 250, hydrationTarget))}
          >
            +250ml
          </button>
        </div>
      </section>

      <section className="surface-frosted p-4 space-y-3">
        <div className="flex items-center gap-2">
          <FiTrendingUp size={18} style={{ color: "var(--success)" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>Streak motivation</h3>
        </div>
        <p className="text-2xl font-bold" style={{ color: "var(--text-1)" }}>{streak?.current_streak ?? 0} days</p>
        <p className="text-xs" style={{ color: "var(--text-2)" }}>
          {streak?.current_streak ? "Stay consistent today to keep the chain alive." : "Start with one focused session today."}
        </p>
      </section>

      <section className="surface-frosted p-4 space-y-3">
        <div className="flex items-center gap-2">
          <FiZap size={18} style={{ color: "var(--warning)" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>Quick stats</h3>
        </div>
        <StatsSparkline values={bars} />
      </section>

      <section className="surface-frosted p-4 space-y-3">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>Contextual tips</h3>
        <ul className="space-y-2">
          {routeTips.map((tip) => (
            <li key={tip} className="text-xs leading-relaxed" style={{ color: "var(--text-2)" }}>• {tip}</li>
          ))}
        </ul>
      </section>
    </div>
  );

  if (mode === "desktop") {
    return <aside className="utility-panel utility-panel-desktop">{panelBody}</aside>;
  }

  if (!open) return null;

  return (
    <>
      <button type="button" className="utility-backdrop" aria-label="Close utility panel" onClick={onClose} />
      <aside className={`utility-panel ${mode === "mobile" ? "utility-panel-mobile" : "utility-panel-tablet"}`} aria-label="Utility panel">
        {panelBody}
      </aside>
    </>
  );
}
