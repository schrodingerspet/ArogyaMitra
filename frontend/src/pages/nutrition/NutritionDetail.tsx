import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import useNutritionStore from "../../stores/nutritionStore";

const mealTypeEmoji = { breakfast: "🌅", lunch: "☀️", dinner: "🌙", snack: "🍎" };
const card = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };
const list = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };

export default function NutritionDetail() {
  const { id } = useParams();
  const { currentPlan, meals, loading, fetchPlan, fetchMeals } = useNutritionStore();

  useEffect(() => { fetchPlan(id); fetchMeals(id); }, [id]);

  if (loading) return (
    <div className="space-y-4">
      <div className="skeleton h-6 w-32 rounded-lg" />
      <div className="skeleton h-28 rounded-2xl" />
      <div className="skeleton h-64 rounded-2xl" />
    </div>
  );
  if (!currentPlan) return <div className="text-center py-12" style={{ color: "var(--text-3)" }}>Plan not found</div>;

  const grouped = meals.reduce((acc, m) => {
    const day = m.day_number || 1;
    if (!acc[day]) acc[day] = [];
    acc[day].push(m);
    return acc;
  }, {});

  return (
    <motion.div initial="hidden" animate="show" variants={list} className="space-y-5">
      <Link to="/nutrition" className="inline-flex items-center gap-1 text-xs font-medium hover:opacity-70 transition" style={{ color: "#fbbf24" }}>
        <FiArrowLeft size={13} /> Back to plans
      </Link>

      <motion.div variants={card} className="glass glass-lens rounded-2xl p-6">
        <h1 className="text-xl font-bold" style={{ color: "var(--text-1)" }}>{currentPlan.title}</h1>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {currentPlan.calorie_target && (
            <span className="chip" style={{ color: "#fbbf24", borderColor: "rgba(251,191,36,0.2)", background: "var(--warning-dim)" }}>
              🔥 {currentPlan.calorie_target} cal/day
            </span>
          )}
          {currentPlan.diet_type && <span className="chip chip-accent">🥗 {currentPlan.diet_type}</span>}
          {currentPlan.cuisine_preference && <span className="chip">🍽 {currentPlan.cuisine_preference}</span>}
        </div>
      </motion.div>

      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-12 glass rounded-2xl" style={{ color: "var(--text-3)" }}>No meals in this plan</div>
      ) : (
        Object.entries(grouped)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([day, dayMeals]) => (
            <motion.div key={day} variants={card} className="glass glass-lens rounded-2xl p-6">
              <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-1)" }}>Day {day}</h2>
              <div className="space-y-2">
                {dayMeals.map((meal) => (
                  <div key={meal.id} className="p-3.5 glass-subtle rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium" style={{ color: "var(--text-1)" }}>
                          {mealTypeEmoji[meal.meal_type] || "🍽"} {meal.name}
                        </span>
                        {meal.meal_type && <span className="ml-2 text-[11px] capitalize" style={{ color: "var(--text-4)" }}>{meal.meal_type}</span>}
                      </div>
                      {meal.calories && <span className="text-xs font-medium" style={{ color: "#fbbf24" }}>{meal.calories} cal</span>}
                    </div>
                    {(meal.protein_g || meal.carbs_g || meal.fat_g) && (
                      <div className="flex gap-4 mt-2 text-[11px]" style={{ color: "var(--text-3)" }}>
                        {meal.protein_g && <span>Protein: {meal.protein_g}g</span>}
                        {meal.carbs_g && <span>Carbs: {meal.carbs_g}g</span>}
                        {meal.fat_g && <span>Fat: {meal.fat_g}g</span>}
                        {meal.fiber_g && <span>Fiber: {meal.fiber_g}g</span>}
                      </div>
                    )}
                    {meal.ingredients && <p className="text-[11px] mt-2" style={{ color: "var(--text-4)" }}>Ingredients: {meal.ingredients}</p>}
                    {meal.recipe && <p className="text-xs mt-2" style={{ color: "var(--text-3)" }}>{meal.recipe}</p>}
                  </div>
                ))}
              </div>
            </motion.div>
          ))
      )}
    </motion.div>
  );
}
