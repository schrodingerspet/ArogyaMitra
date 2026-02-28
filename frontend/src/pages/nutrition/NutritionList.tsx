import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import { GiMeal } from "react-icons/gi";
import toast from "react-hot-toast";
import useNutritionStore from "../../stores/nutritionStore";
import { ConfirmDialog, PlanCard } from "../../components/ui";

const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };
const list = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };

export default function NutritionList() {
  const { plans, loading, fetchPlans, deletePlan } = useNutritionStore();
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const selectedPlan = useMemo(() => plans.find((p) => p.id === pendingDelete), [plans, pendingDelete]);

  const handleDelete = async () => {
    if (!pendingDelete) return;
    const ok = await deletePlan(pendingDelete);
    if (ok) toast.success("Nutrition plan deleted");
    setPendingDelete(null);
  };

  return (
    <section className="space-y-6" aria-label="Nutrition plans">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 style={{ color: "var(--text-1)" }}>Nutrition planner</h1>
          <p className="text-sm mt-2" style={{ color: "var(--text-2)" }}>Build meal plans with clear calorie and macro context.</p>
        </div>
        <Link to="/nutrition/generate" className="btn btn-warning-soft py-2.5 px-4 rounded-xl text-sm focus-ring" aria-label="Generate nutrition plan">
          <FiPlus size={15} /> Generate plan
        </Link>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-36 rounded-2xl" />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl">
          <GiMeal size={40} className="mx-auto mb-4" style={{ color: "var(--text-4)" }} />
          <p className="text-sm" style={{ color: "var(--text-2)" }}>No nutrition plans yet.</p>
          <p className="text-xs mt-1" style={{ color: "var(--text-3)" }}>Create a plan to populate your meal schedule.</p>
          <Link to="/nutrition/generate" className="btn btn-warning-soft mt-4 py-2.5 px-4 rounded-xl text-sm focus-ring">
            Create first plan
          </Link>
        </div>
      ) : (
        <motion.div initial="hidden" animate="show" variants={list} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map((plan) => (
            <motion.div key={plan.id} variants={item}>
              <PlanCard
                id={plan.id}
                title={plan.title}
                description={plan.description}
                chips={[
                  plan.calorie_target
                    ? { label: `${plan.calorie_target} cal`, style: { color: "var(--warning)", background: "var(--warning-dim)", borderColor: "rgba(246,200,76,0.35)" } }
                    : null,
                  plan.diet_type ? { label: plan.diet_type, tone: "accent" } : null,
                  plan.duration_days ? { label: `${plan.duration_days} days` } : null,
                ].filter(Boolean)}
                detailsTo={`/nutrition/${plan.id}`}
                onDelete={(id) => setPendingDelete(id)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete nutrition plan?"
        description={`This will permanently remove "${selectedPlan?.title || "this plan"}".`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
        confirmText="Delete plan"
      />
    </section>
  );
}
