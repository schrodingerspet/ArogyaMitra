import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiZap } from "react-icons/fi";
import toast from "react-hot-toast";
import useNutritionStore from "../../stores/nutritionStore";

const dietTypes = ["vegetarian", "non-veg"];
const goals = ["weight_loss", "muscle_gain", "maintenance", "flexibility", "endurance"];

export default function NutritionGenerate() {
  const navigate = useNavigate();
  const { generatePlan, generating } = useNutritionStore();
  const [form, setForm] = useState({
    fitness_goal: "weight_loss",
    diet_type: "vegetarian",
    calorie_target: 2000,
    duration_days: 7,
    allergies: "",
    cuisine_preference: "indian",
    use_ai: false,
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, allergies: form.allergies || null };
    const plan = await generatePlan(payload);
    if (plan) {
      toast.success("Nutrition plan generated!");
      navigate(`/nutrition/${plan.plan_id || plan.id}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <button onClick={() => navigate("/nutrition")} className="inline-flex items-center gap-1 text-xs font-medium hover:opacity-70 transition" style={{ color: "#fbbf24" }}>
        <FiArrowLeft size={13} /> Back to plans
      </button>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass glass-lens rounded-2xl p-6">
        <h1 className="text-xl font-bold mb-6" style={{ color: "var(--text-1)" }}>Generate Meal Plan</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: "var(--text-2)" }}>Fitness Goal</label>
            <div className="flex flex-wrap gap-2">
              {goals.map((g) => (
                <button key={g} type="button" onClick={() => set("fitness_goal", g)}
                  className={`select-chip ${form.fitness_goal === g ? "active-warning" : ""}`}
                >{g.replace(/_/g, " ")}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: "var(--text-2)" }}>Diet Type</label>
            <div className="flex gap-2">
              {dietTypes.map((d) => (
                <button key={d} type="button" onClick={() => set("diet_type", d)}
                  className={`select-chip ${form.diet_type === d ? "active-success" : ""}`}
                >{d}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: "var(--text-2)" }}>Calorie Target</label>
              <input type="number" min={1000} max={5000} value={form.calorie_target} onChange={(e) => set("calorie_target", Number(e.target.value))}
                className="w-full px-4 py-2.5 input rounded-xl" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: "var(--text-2)" }}>Duration (days)</label>
              <input type="number" min={1} max={30} value={form.duration_days} onChange={(e) => set("duration_days", Number(e.target.value))}
                className="w-full px-4 py-2.5 input rounded-xl" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: "var(--text-2)" }}>Allergies (optional)</label>
            <input type="text" placeholder="e.g., peanuts, dairy" value={form.allergies} onChange={(e) => set("allergies", e.target.value)}
              className="w-full px-4 py-2.5 input rounded-xl" />
          </div>

          {/* AI Toggle */}
          <div
            className="flex items-center gap-3 p-4 rounded-xl cursor-pointer"
            onClick={() => set("use_ai", !form.use_ai)}
            style={{
              background: form.use_ai ? "var(--warning-dim)" : "var(--surface-1)",
              border: `1px solid ${form.use_ai ? "rgba(245,158,11,0.25)" : "var(--border)"}`,
            }}
          >
            <div className={`toggle-track ${form.use_ai ? "active" : ""}`} style={form.use_ai ? { background: "var(--warning-dim)", borderColor: "rgba(245,158,11,0.3)" } : undefined}>
              <div className="toggle-thumb" style={form.use_ai ? { background: "#fbbf24" } : undefined} />
            </div>
            <div>
              <span className="text-sm font-medium" style={{ color: form.use_ai ? "#fbbf24" : "var(--text-2)" }}>
                Use AI (Groq)
              </span>
              <p className="text-xs" style={{ color: "var(--text-3)" }}>Generate personalized Indian meal plan with AI</p>
            </div>
          </div>

          <button type="submit" disabled={generating} className="w-full btn btn-warning-soft py-3 rounded-xl text-sm">
            <FiZap size={15} /> {generating ? "Generating..." : "Generate Plan"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
