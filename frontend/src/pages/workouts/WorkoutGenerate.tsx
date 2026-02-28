import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiZap } from "react-icons/fi";
import toast from "react-hot-toast";
import { useGenerateWorkoutPlan } from "../../features/workouts/hooks/useWorkoutQueries";

const goals = ["weight_loss", "muscle_gain", "maintenance", "flexibility", "endurance"];
const locations = ["home", "gym", "outdoor"];
const difficulties = ["beginner", "intermediate", "advanced"];

export default function WorkoutGenerate() {
  const navigate = useNavigate();
  const generatePlan = useGenerateWorkoutPlan();
  const [form, setForm] = useState({
    fitness_goal: "weight_loss",
    workout_location: "home",
    difficulty_level: "beginner",
    duration_days: 7,
    daily_minutes: 30,
    use_ai: false,
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const plan = await generatePlan.mutateAsync(form);
      toast.success("Workout plan generated!");
      navigate(`/workouts/${plan.plan_id || plan.id}`);
    } catch {
      toast.error("Could not generate workout plan");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <button onClick={() => navigate("/workouts")} className="inline-flex items-center gap-1 text-xs font-medium hover:opacity-70 transition" style={{ color: "var(--accent-light)" }}>
        <FiArrowLeft size={13} /> Back to plans
      </button>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass glass-lens rounded-2xl p-6">
        <h1 className="text-xl font-bold mb-6" style={{ color: "var(--text-1)" }}>Generate Workout Plan</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: "var(--text-2)" }}>Fitness Goal</label>
            <div className="flex flex-wrap gap-2">
              {goals.map((g) => (
                <button key={g} type="button" onClick={() => set("fitness_goal", g)}
                  className={`select-chip ${form.fitness_goal === g ? "active" : ""}`}
                >{g.replace(/_/g, " ")}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: "var(--text-2)" }}>Location</label>
            <div className="flex flex-wrap gap-2">
              {locations.map((l) => (
                <button key={l} type="button" onClick={() => set("workout_location", l)}
                  className={`select-chip ${form.workout_location === l ? "active-info" : ""}`}
                >{l}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: "var(--text-2)" }}>Difficulty</label>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((d) => (
                <button key={d} type="button" onClick={() => set("difficulty_level", d)}
                  className={`select-chip ${form.difficulty_level === d ? "active-violet" : ""}`}
                >{d}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: "var(--text-2)" }}>Duration (days)</label>
              <input type="number" min={1} max={30} value={form.duration_days} onChange={(e) => set("duration_days", Number(e.target.value))}
                className="w-full px-4 py-2.5 input rounded-xl" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: "var(--text-2)" }}>Daily Minutes</label>
              <input type="number" min={10} max={120} value={form.daily_minutes} onChange={(e) => set("daily_minutes", Number(e.target.value))}
                className="w-full px-4 py-2.5 input rounded-xl" />
            </div>
          </div>

          {/* AI Toggle */}
          <div
            className="flex items-center gap-3 p-4 rounded-xl cursor-pointer"
            onClick={() => set("use_ai", !form.use_ai)}
            style={{
              background: form.use_ai ? "var(--accent-dim)" : "var(--surface-1)",
              border: `1px solid ${form.use_ai ? "rgba(6,182,212,0.25)" : "var(--border)"}`,
            }}
          >
            <div className={`toggle-track ${form.use_ai ? "active" : ""}`}>
              <div className="toggle-thumb" />
            </div>
            <div>
              <span className="text-sm font-medium" style={{ color: form.use_ai ? "var(--accent-light)" : "var(--text-2)" }}>
                Use AI (Groq)
              </span>
              <p className="text-xs" style={{ color: "var(--text-3)" }}>Generate personalized plan with AI</p>
            </div>
          </div>

          <button type="submit" disabled={generatePlan.isPending} className="w-full btn btn-primary py-3 rounded-xl text-sm">
            <FiZap size={15} /> {generatePlan.isPending ? "Generating..." : "Generate Plan"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
