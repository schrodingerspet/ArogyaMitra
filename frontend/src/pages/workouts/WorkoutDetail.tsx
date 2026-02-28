import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiClock, FiRepeat, FiPlay } from "react-icons/fi";
import { useWorkoutExercises, useWorkoutPlan } from "../../features/workouts/hooks/useWorkoutQueries";

const card = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };
const list = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };

export default function WorkoutDetail() {
  const { id } = useParams();
  const planQuery = useWorkoutPlan(id);
  const exercisesQuery = useWorkoutExercises(id);
  const currentPlan = planQuery.data;
  const exercises = exercisesQuery.data || [];
  const loading = planQuery.isLoading || exercisesQuery.isLoading;

  if (loading) return (
    <div className="space-y-4">
      <div className="skeleton h-6 w-32 rounded-lg" />
      <div className="skeleton h-36 rounded-2xl" />
      <div className="skeleton h-64 rounded-2xl" />
    </div>
  );
  if (!currentPlan) return <div className="text-center py-12" style={{ color: "var(--text-3)" }}>Plan not found</div>;

  const grouped = exercises.reduce((acc, ex) => {
    const day = ex.day_number || 1;
    if (!acc[day]) acc[day] = [];
    acc[day].push(ex);
    return acc;
  }, {});

  return (
    <motion.div initial="hidden" animate="show" variants={list} className="space-y-5">
      <Link to="/workouts" className="inline-flex items-center gap-1 text-xs font-medium hover:opacity-70 transition" style={{ color: "var(--accent-light)" }}>
        <FiArrowLeft size={13} /> Back to plans
      </Link>

      <motion.div variants={card} className="glass glass-lens rounded-2xl p-6">
        <h1 className="text-xl font-bold" style={{ color: "var(--text-1)" }}>{currentPlan.title}</h1>
        {currentPlan.description && <p className="text-sm mt-1" style={{ color: "var(--text-3)" }}>{currentPlan.description}</p>}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {currentPlan.fitness_goal && <span className="chip chip-accent">🎯 {currentPlan.fitness_goal}</span>}
          {currentPlan.workout_location && <span className="chip">📍 {currentPlan.workout_location}</span>}
          {currentPlan.difficulty_level && <span className="chip">⚡ {currentPlan.difficulty_level}</span>}
          {currentPlan.daily_minutes && <span className="chip">⏱ {currentPlan.daily_minutes} min/day</span>}
        </div>
      </motion.div>

      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-12 glass rounded-2xl" style={{ color: "var(--text-3)" }}>
          No exercises in this plan
        </div>
      ) : (
        Object.entries(grouped)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([day, exs]) => (
            <motion.div key={day} variants={card} className="glass glass-lens rounded-2xl p-6">
              <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-1)" }}>Day {day}</h2>
              <div className="space-y-2">
                {exs.map((ex) => (
                  <div key={ex.id} className="flex items-center justify-between p-3.5 glass-subtle rounded-xl">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{ex.name}</p>
                      {ex.category && <p className="text-[11px] mt-0.5" style={{ color: "var(--text-4)" }}>{ex.category}</p>}
                      {ex.instructions && <p className="text-xs mt-1" style={{ color: "var(--text-3)" }}>{ex.instructions}</p>}
                    </div>
                    <div className="flex items-center gap-3 text-xs ml-4 shrink-0" style={{ color: "var(--text-3)" }}>
                      {ex.sets && ex.reps && (
                        <span className="flex items-center gap-1"><FiRepeat size={12} /> {ex.sets}×{ex.reps}</span>
                      )}
                      {ex.duration_seconds && (
                        <span className="flex items-center gap-1"><FiClock size={12} /> {Math.round(ex.duration_seconds / 60)}m</span>
                      )}
                      {ex.youtube_url && (
                        <a href={ex.youtube_url} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition" style={{ color: "var(--danger)" }}>
                          <FiPlay size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))
      )}
    </motion.div>
  );
}
