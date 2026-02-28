import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { FiActivity, FiChevronDown, FiChevronUp, FiDroplet, FiHeart, FiInfo, FiSun } from "react-icons/fi";
import toast from "react-hot-toast";
import { FormField } from "../../components/ui";
import {
  useCreateAssessment,
  useHealthInsights,
  useLatestAssessment,
} from "../../features/health/hooks/useHealthQueries";

const activityLevels = ["sedentary", "lightly_active", "moderately_active", "active", "very_active"];
const fitnessLevels = ["beginner", "intermediate", "advanced"];
const stressLevels = ["low", "medium", "high"];

const defaultValues = {
  age: "",
  gender: "male",
  height_cm: "",
  weight_kg: "",
  fitness_level: "beginner",
  goals: "maintenance",
  medical_conditions: "",
  allergies: "",
  activity_level: "moderately_active",
  sleep_hours: 7,
  water_intake_liters: 2,
  stress_level: "medium",
  notes: "",
};

function InsightCard({ icon: Icon, label, value, sub, color, formula }) {
  return (
    <article className="glass rounded-2xl p-4" aria-label={`${label} insight`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}22` }}>
            <Icon size={15} style={{ color }} />
          </div>
          <span className="text-xs font-medium" style={{ color: "var(--text-2)" }}>{label}</span>
        </div>
        {formula ? (
          <span title={formula} aria-label={`${label} formula: ${formula}`} style={{ color: "var(--text-3)" }}>
            <FiInfo size={13} />
          </span>
        ) : null}
      </div>
      <p className="text-2xl font-bold mt-3" style={{ color: "var(--text-1)" }}>{value ?? "—"}</p>
      {sub ? <p className="text-[11px] mt-1" style={{ color: "var(--text-3)" }}>{sub}</p> : null}
    </article>
  );
}

export default function HealthAssessment() {
  const latestQuery = useLatestAssessment();
  const insightsQuery = useHealthInsights();
  const createAssessment = useCreateAssessment();
  const latest = latestQuery.data;
  const insights = insightsQuery.data;
  const loading = createAssessment.isPending;
  const [showMedical, setShowMedical] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    mode: "onBlur",
  });

  useEffect(() => {
    if (!latest) return;
    reset({
      ...defaultValues,
      age: latest.age ?? "",
      gender: latest.gender || "male",
      height_cm: latest.height_cm ?? "",
      weight_kg: latest.weight_kg ?? "",
      activity_level: latest.activity_level || "moderately_active",
      fitness_level: latest.fitness_level || "beginner",
      goals: latest.goals || "maintenance",
      sleep_hours: latest.sleep_hours ?? 7,
      water_intake_liters: latest.water_intake_liters ?? 2,
      stress_level: latest.stress_level || "medium",
      medical_conditions: latest.medical_conditions || "",
      allergies: latest.allergies || "",
      notes: latest.notes || "",
    });
    setShowMedical(Boolean(latest.medical_conditions || latest.allergies || latest.notes));
  }, [latest, reset]);

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      age: Number(values.age),
      height_cm: Number(values.height_cm),
      weight_kg: Number(values.weight_kg),
      sleep_hours: Number(values.sleep_hours),
      water_intake_liters: Number(values.water_intake_liters),
      medical_conditions: values.medical_conditions || null,
      allergies: values.allergies || null,
      notes: values.notes || null,
    };
    try {
      await createAssessment.mutateAsync(payload);
      toast.success("Assessment saved");
    } catch {
      toast.error("Could not save assessment");
    }
  };

  return (
    <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6" aria-label="Health assessment page">
      <header>
        <h1 style={{ color: "var(--text-1)" }}>Health assessment</h1>
        <p className="text-sm mt-2" style={{ color: "var(--text-2)" }}>
          Update your profile with clear metrics and accessible guidance.
        </p>
      </header>

      {insights ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <InsightCard icon={FiHeart} label="BMI" value={insights.bmi?.toFixed(1)} sub={insights.bmi_category || "Body Mass Index"} color="var(--color-error)" formula="BMI = weight (kg) / height² (m²)" />
          <InsightCard icon={FiActivity} label="BMR" value={insights.bmr?.toFixed(0)} sub="Basal calories/day" color="var(--color-warning)" formula="Mifflin-St Jeor equation" />
          <InsightCard icon={FiSun} label="TDEE" value={insights.tdee?.toFixed(0)} sub="Daily energy burn" color="var(--color-info)" formula="BMR × activity factor" />
          <InsightCard icon={FiDroplet} label="Target" value={insights.recommended_calories?.toFixed(0)} sub="Suggested daily calories" color="var(--color-success)" />
        </div>
      ) : null}

      <article className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold" style={{ color: "var(--text-1)" }}>Assessment form</h2>
        <p className="text-xs mt-1" style={{ color: "var(--text-3)" }}>Fields marked * are required.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-5" noValidate>
          <section className="space-y-4" aria-label="Body metrics">
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-2)" }}>Body metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              <FormField id="age" label="Age" required hint="Used for metabolic estimates." error={errors.age?.message}>
                <input
                  id="age"
                  type="number"
                  className="w-full px-3 py-2.5 input"
                  {...register("age", {
                    required: "Age is required",
                    min: { value: 10, message: "Minimum age is 10" },
                    max: { value: 100, message: "Maximum age is 100" },
                  })}
                />
              </FormField>

              <FormField id="gender" label="Gender" required error={errors.gender?.message}>
                <select id="gender" className="w-full px-3 py-2.5 input" {...register("gender", { required: "Gender is required" })}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </FormField>

              <FormField id="height_cm" label="Height (cm)" required hint="For BMI and BMR calculations." error={errors.height_cm?.message}>
                <input
                  id="height_cm"
                  type="number"
                  className="w-full px-3 py-2.5 input"
                  {...register("height_cm", {
                    required: "Height is required",
                    min: { value: 100, message: "Height must be at least 100 cm" },
                    max: { value: 250, message: "Height must be less than 250 cm" },
                  })}
                />
              </FormField>

              <FormField id="weight_kg" label="Weight (kg)" required hint="Used for weight trend and calorie targets." error={errors.weight_kg?.message}>
                <input
                  id="weight_kg"
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2.5 input"
                  {...register("weight_kg", {
                    required: "Weight is required",
                    min: { value: 30, message: "Weight must be at least 30 kg" },
                    max: { value: 300, message: "Weight must be less than 300 kg" },
                  })}
                />
              </FormField>
            </div>
          </section>

          <section className="space-y-4" aria-label="Lifestyle profile">
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-2)" }}>Lifestyle profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FormField id="activity_level" label="Activity level" required error={errors.activity_level?.message}>
                <select id="activity_level" className="w-full px-3 py-2.5 input" {...register("activity_level", { required: "Activity level is required" })}>
                  {activityLevels.map((level) => (
                    <option key={level} value={level}>{level.replace(/_/g, " ")}</option>
                  ))}
                </select>
              </FormField>

              <FormField id="fitness_level" label="Fitness level" required error={errors.fitness_level?.message}>
                <select id="fitness_level" className="w-full px-3 py-2.5 input" {...register("fitness_level", { required: "Fitness level is required" })}>
                  {fitnessLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </FormField>

              <FormField id="stress_level" label="Stress level" required error={errors.stress_level?.message}>
                <select id="stress_level" className="w-full px-3 py-2.5 input" {...register("stress_level", { required: "Stress level is required" })}>
                  {stressLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField id="sleep_hours" label="Sleep (hours)" required error={errors.sleep_hours?.message}>
                <input
                  id="sleep_hours"
                  type="number"
                  step="0.5"
                  className="w-full px-3 py-2.5 input"
                  {...register("sleep_hours", {
                    required: "Sleep hours are required",
                    min: { value: 3, message: "Minimum is 3 hours" },
                    max: { value: 12, message: "Maximum is 12 hours" },
                  })}
                />
              </FormField>

              <FormField id="water_intake_liters" label="Water intake (liters)" required error={errors.water_intake_liters?.message}>
                <input
                  id="water_intake_liters"
                  type="number"
                  step="0.5"
                  className="w-full px-3 py-2.5 input"
                  {...register("water_intake_liters", {
                    required: "Water intake is required",
                    min: { value: 0.5, message: "Minimum is 0.5 liters" },
                    max: { value: 8, message: "Maximum is 8 liters" },
                  })}
                />
              </FormField>
            </div>

            <FormField id="goals" label="Goals" required hint="Examples: maintenance, weight_loss, muscle_gain." error={errors.goals?.message}>
              <input
                id="goals"
                type="text"
                className="w-full px-3 py-2.5 input"
                {...register("goals", { required: "Goal is required" })}
              />
            </FormField>
          </section>

          <section className="space-y-3" aria-label="Optional medical context">
            <button
              type="button"
              className="btn btn-ghost px-0 text-sm focus-ring"
              onClick={() => setShowMedical((v) => !v)}
              aria-expanded={showMedical}
              aria-controls="optional-medical-section"
            >
              {showMedical ? <FiChevronUp size={15} /> : <FiChevronDown size={15} />}
              Optional medical details
            </button>

            {showMedical ? (
              <div id="optional-medical-section" className="space-y-3">
                <FormField id="medical_conditions" label="Medical conditions" hint="Optional. Example: asthma, thyroid.">
                  <input id="medical_conditions" type="text" className="w-full px-3 py-2.5 input" {...register("medical_conditions")} />
                </FormField>
                <FormField id="allergies" label="Allergies" hint="Optional. Example: peanuts, shellfish.">
                  <input id="allergies" type="text" className="w-full px-3 py-2.5 input" {...register("allergies")} />
                </FormField>
                <FormField id="notes" label="Notes" hint="Optional context for your coach.">
                  <textarea id="notes" rows={3} className="w-full px-3 py-2.5 input" {...register("notes")} />
                </FormField>
              </div>
            ) : null}
          </section>

          <button
            type="submit"
            disabled={loading || isSubmitting}
            className="w-full btn btn-primary py-3 rounded-xl text-sm focus-ring"
            aria-label="Save assessment"
          >
            {loading || isSubmitting ? "Saving..." : "Save assessment"}
          </button>
        </form>
      </article>

      {latest ? (
        <article className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-1)" }}>Latest snapshot</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-sm">
            {[
              ["Age", latest.age],
              ["Height", `${latest.height_cm} cm`],
              ["Weight", `${latest.weight_kg} kg`],
              ["BMI", latest.bmi?.toFixed(1)],
              ["Activity", latest.activity_level?.replace(/_/g, " ")],
              ["Sleep", `${latest.sleep_hours} h`],
              ["Water", `${latest.water_intake_liters} L`],
              ["Goal", latest.goals || "—"],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[11px]" style={{ color: "var(--text-3)" }}>{label}</p>
                <p className="font-medium mt-1" style={{ color: "var(--text-1)" }}>{value}</p>
              </div>
            ))}
          </div>
        </article>
      ) : null}
    </motion.section>
  );
}
