import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiActivity, FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import { ConfirmDialog, PlanCard } from "../../components/ui";
import { useDeleteWorkoutPlan, useWorkoutPlans } from "../../features/workouts/hooks/useWorkoutQueries";

const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };
const list = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };

export default function WorkoutList() {
  const { data: plans = [], isLoading: loading } = useWorkoutPlans();
  const deletePlan = useDeleteWorkoutPlan();
  const [pendingDelete, setPendingDelete] = useState(null);

  const selectedPlan = useMemo(() => plans.find((p) => p.id === pendingDelete), [plans, pendingDelete]);

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deletePlan.mutateAsync(pendingDelete);
      toast.success("Workout plan deleted");
    } catch {
      toast.error("Could not delete workout plan");
    }
    setPendingDelete(null);
  };

  return (
    <section className="space-y-6" aria-label="Workout plans">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 style={{ color: "var(--text-1)" }}>Workout planner</h1>
          <p className="text-sm mt-2" style={{ color: "var(--text-2)" }}>Plan, review, and refine routines with clear structure.</p>
        </div>
        <Link to="/workouts/generate" className="btn btn-primary py-2.5 px-4 rounded-xl text-sm focus-ring" aria-label="Generate workout plan">
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
          <FiActivity size={40} className="mx-auto mb-4" style={{ color: "var(--text-4)" }} />
          <p className="text-sm" style={{ color: "var(--text-2)" }}>No workout plans yet.</p>
          <p className="text-xs mt-1" style={{ color: "var(--text-3)" }}>Start by generating a personalized routine.</p>
          <Link to="/workouts/generate" className="btn btn-accent-soft mt-4 py-2.5 px-4 rounded-xl text-sm focus-ring">
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
                  plan.fitness_goal ? { label: plan.fitness_goal, tone: "accent" } : null,
                  plan.difficulty_level ? { label: plan.difficulty_level } : null,
                  plan.duration_days ? { label: `${plan.duration_days} days` } : null,
                ].filter(Boolean)}
                detailsTo={`/workouts/${plan.id}`}
                onDelete={(id) => setPendingDelete(id)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete workout plan?"
        description={`This will permanently remove "${selectedPlan?.title || "this plan"}".`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
        confirmText="Delete plan"
      />
    </section>
  );
}
