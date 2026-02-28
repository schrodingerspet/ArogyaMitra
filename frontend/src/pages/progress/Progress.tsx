import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiTrash2, FiTrendingUp } from "react-icons/fi";
import toast from "react-hot-toast";
import useProgressStore from "../../stores/progressStore";
import useAnalyticsStore from "../../stores/analyticsStore";
import { ConfirmDialog } from "../../components/ui";

const moods = ["great", "good", "okay", "bad", "terrible"];
const moodEmoji = { great: "😄", good: "🙂", okay: "😐", bad: "😔", terrible: "😢" };
const card = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };
const list = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };

/* ─── SVG Weight Trend Chart ────────────────────────── */
function WeightChart({ weightTrend }) {
  if (!weightTrend?.data_points?.length) return null;
  const pts = weightTrend.data_points.slice(-14);
  const weights = pts.map((p) => p.weight_kg);
  const min = Math.min(...weights) - 1;
  const max = Math.max(...weights) + 1;
  const range = max - min || 1;
  const W = 400;
  const H = 120;
  const points = pts.map((p, i) => ({
    x: (i / Math.max(pts.length - 1, 1)) * W,
    y: H - ((p.weight_kg - min) / range) * H,
  }));
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaD = pathD + ` L ${W} ${H} L 0 ${H} Z`;

  return (
    <motion.div variants={card} className="glass glass-lens rounded-2xl p-6">
      <h3 className="text-sm font-semibold mb-1 flex items-center gap-2" style={{ color: "var(--text-1)" }}>
        <FiTrendingUp size={15} style={{ color: "var(--info)" }} /> Weight Trend
      </h3>
      <div className="grid grid-cols-3 gap-4 text-center mb-4">
        <div>
          <p className="text-[11px]" style={{ color: "var(--text-4)" }}>Starting</p>
          <p className="text-lg font-bold" style={{ color: "var(--text-1)" }}>{weightTrend.starting_weight ?? "—"} kg</p>
        </div>
        <div>
          <p className="text-[11px]" style={{ color: "var(--text-4)" }}>Current</p>
          <p className="text-lg font-bold" style={{ color: "var(--text-1)" }}>{weightTrend.current_weight ?? "—"} kg</p>
        </div>
        <div>
          <p className="text-[11px]" style={{ color: "var(--text-4)" }}>Change</p>
          <p className="text-lg font-bold" style={{
            color: weightTrend.total_change < 0 ? "var(--success)" : weightTrend.total_change > 0 ? "var(--danger)" : "var(--text-1)"
          }}>
            {weightTrend.total_change > 0 ? "+" : ""}{weightTrend.total_change?.toFixed(1) ?? "0"} kg
          </p>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-24" preserveAspectRatio="none">
        <defs>
          <linearGradient id="weightArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--info)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--info)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#weightArea)" />
        <path d={pathD} fill="none" stroke="var(--info)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--bg)" stroke="var(--info)" strokeWidth="1.5" />
        ))}
      </svg>
    </motion.div>
  );
}

export default function Progress() {
  const { records, loading, fetchRecords, createRecord, deleteRecord } = useProgressStore();
  const { weightTrend, fetchWeightTrend } = useAnalyticsStore();
  const [showForm, setShowForm] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    weight_kg: "", calories_burned: "", calories_consumed: "",
    workouts_completed: "", steps: "", water_intake_liters: "",
    sleep_hours: "", mood: "good", notes: "",
  });

  useEffect(() => { fetchRecords(); fetchWeightTrend(); }, []);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {};
    Object.entries(form).forEach(([k, v]) => {
      if (v === "" || v === null) return;
      if (["weight_kg","calories_burned","calories_consumed","workouts_completed","steps","water_intake_liters","sleep_hours"].includes(k)) {
        payload[k] = Number(v);
      } else { payload[k] = v; }
    });
    const result = await createRecord(payload);
    if (result) { toast.success("Progress logged!"); setShowForm(false); fetchWeightTrend(); }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    const ok = await deleteRecord(pendingDelete);
    if (ok) toast.success("Deleted");
    setPendingDelete(null);
  };

  return (
    <motion.div initial="hidden" animate="show" variants={list} className="space-y-6">
      <motion.div variants={card} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text-1)" }}>Progress Tracking</h1>
          <p className="text-xs mt-1" style={{ color: "var(--text-3)" }}>Log and view your daily progress</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-info-soft py-2.5 px-4 rounded-xl text-sm">
          <FiPlus size={15} /> Log Progress
        </button>
      </motion.div>

      <WeightChart weightTrend={weightTrend} />

      {/* Log Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass glass-lens rounded-2xl p-6">
          <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-1)" }}>Log Daily Progress</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { k: "date", label: "Date", type: "date" },
                { k: "weight_kg", label: "Weight (kg)", type: "number", step: "0.1" },
                { k: "calories_burned", label: "Cal Burned", type: "number" },
                { k: "calories_consumed", label: "Cal Consumed", type: "number" },
                { k: "workouts_completed", label: "Workouts", type: "number" },
                { k: "steps", label: "Steps", type: "number" },
                { k: "water_intake_liters", label: "Water (L)", type: "number", step: "0.5" },
                { k: "sleep_hours", label: "Sleep (h)", type: "number", step: "0.5" },
              ].map(({ k, label, ...rest }) => (
                <div key={k}>
                  <label className="text-[11px] font-medium mb-1 block" style={{ color: "var(--text-3)" }}>{label}</label>
                  <input value={form[k]} onChange={(e) => set(k, e.target.value)}
                    className="w-full px-3 py-2 input rounded-xl text-sm" {...rest} />
                </div>
              ))}
            </div>
            <div>
              <label className="text-[11px] font-medium mb-1 block" style={{ color: "var(--text-3)" }}>Mood</label>
              <div className="flex gap-2">
                {moods.map((m) => (
                  <button key={m} type="button" onClick={() => set("mood", m)}
                    className={`select-chip text-xs ${form.mood === m ? "active-info" : ""}`}>
                    {moodEmoji[m]} {m}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[11px] font-medium mb-1 block" style={{ color: "var(--text-3)" }}>Notes</label>
              <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={2}
                className="w-full px-3 py-2 input rounded-xl text-sm" />
            </div>
            <button type="submit" disabled={loading} className="w-full btn btn-info-soft py-2.5 rounded-xl text-sm">
              {loading ? "Saving..." : "Save Progress"}
            </button>
          </form>
        </motion.div>
      )}

      {/* Records */}
      {loading && records.length === 0 ? (
        <div className="space-y-3">
          {[1,2,3].map((i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl">
          <FiTrendingUp size={40} className="mx-auto mb-4" style={{ color: "var(--text-4)" }} />
          <p style={{ color: "var(--text-3)" }}>No progress records yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {[...records].reverse().map((r) => (
            <motion.div key={r.id} variants={card} className="glass rounded-xl p-3.5 flex items-center justify-between">
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-sm">
                <div>
                  <span className="text-[11px]" style={{ color: "var(--text-4)" }}>Date</span>
                  <p className="font-medium text-sm" style={{ color: "var(--text-1)" }}>{r.date}</p>
                </div>
                {r.weight_kg && <div>
                  <span className="text-[11px]" style={{ color: "var(--text-4)" }}>Weight</span>
                  <p className="font-medium text-sm" style={{ color: "var(--text-1)" }}>{r.weight_kg} kg</p>
                </div>}
                {r.calories_burned != null && <div>
                  <span className="text-[11px]" style={{ color: "var(--text-4)" }}>Burned</span>
                  <p className="font-medium text-sm" style={{ color: "var(--text-1)" }}>{r.calories_burned} cal</p>
                </div>}
                {r.steps != null && <div>
                  <span className="text-[11px]" style={{ color: "var(--text-4)" }}>Steps</span>
                  <p className="font-medium text-sm" style={{ color: "var(--text-1)" }}>{r.steps}</p>
                </div>}
                {r.mood && <div>
                  <span className="text-[11px]" style={{ color: "var(--text-4)" }}>Mood</span>
                  <p className="font-medium text-sm" style={{ color: "var(--text-1)" }}>{moodEmoji[r.mood]} {r.mood}</p>
                </div>}
                {r.sleep_hours != null && <div>
                  <span className="text-[11px]" style={{ color: "var(--text-4)" }}>Sleep</span>
                  <p className="font-medium text-sm" style={{ color: "var(--text-1)" }}>{r.sleep_hours}h</p>
                </div>}
              </div>
              <button onClick={() => setPendingDelete(r.id)} className="btn btn-ghost p-1.5 rounded-lg ml-2" style={{ color: "var(--text-4)" }}>
                <FiTrash2 size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete progress entry?"
        description="This action cannot be undone."
        confirmText="Delete entry"
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </motion.div>
  );
}
