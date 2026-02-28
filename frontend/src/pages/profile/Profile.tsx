import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { FiChevronDown, FiChevronUp, FiSave, FiUser } from "react-icons/fi";
import toast from "react-hot-toast";
import useAuthStore from "../../stores/authStore";
import { Card, FormField } from "../../components/ui";

const defaults = {
  name: "",
  age: "",
  gender: "",
  height_cm: "",
  weight_kg: "",
  fitness_level: "",
  goals: "",
  medical_conditions: "",
  allergies: "",
  activity_level: "",
};

export default function Profile() {
  const { user, loading, fetchProfile, updateProfile } = useAuthStore();
  const [showMedical, setShowMedical] = useState(false);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: defaults, mode: "onBlur" });

  useEffect(() => {
    if (!user) fetchProfile();
  }, []);

  useEffect(() => {
    if (!user) return;
    reset({
      name: user.name || "",
      age: user.age || "",
      gender: user.gender || "",
      height_cm: user.height_cm || "",
      weight_kg: user.weight_kg || "",
      fitness_level: user.fitness_level || "",
      goals: user.goals || "",
      medical_conditions: user.medical_conditions || "",
      allergies: user.allergies || "",
      activity_level: user.activity_level || "",
    });
    if (user.medical_conditions || user.allergies) setShowMedical(true);
  }, [user, reset]);

  const onSubmit = async (values) => {
    const payload = {};
    Object.entries(values).forEach(([k, v]) => {
      if (v === "" || v == null) return;
      payload[k] = ["age", "height_cm", "weight_kg"].includes(k) ? Number(v) : v;
    });
    const ok = await updateProfile(payload);
    if (ok) toast.success("Profile updated");
  };

  const initial = user?.name?.[0]?.toUpperCase() || "U";

  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6" aria-label="Profile settings">
      <header>
        <h1 style={{ color: "var(--text-1)" }}>Profile</h1>
        <p className="text-sm mt-2" style={{ color: "var(--text-2)" }}>
          Keep your wellness profile accurate for better recommendations.
        </p>
      </header>

      <Card className="p-6">
        <div className="flex items-center gap-4 pb-6" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold"
            style={{ background: "var(--surface-2)", color: "var(--text-1)", border: "1px solid var(--border-subtle)" }}
            aria-hidden="true"
          >
            {initial}
          </div>
          <div>
            <p className="font-semibold text-base" style={{ color: "var(--text-1)" }}>{user?.name || "User"}</p>
            <p className="text-xs" style={{ color: "var(--text-3)" }}>{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6" noValidate>
          <section className="space-y-4" aria-label="Basic profile">
            <h2 className="text-base font-semibold" style={{ color: "var(--text-2)" }}>Basic details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField id="name" label="Name" required hint="Displayed in your dashboard header." error={errors.name?.message}>
                <input
                  id="name"
                  type="text"
                  className="w-full px-3 py-2.5 input"
                  {...register("name", {
                    required: "Name is required",
                    minLength: { value: 2, message: "Name should be at least 2 characters" },
                  })}
                />
              </FormField>
              <FormField id="age" label="Age" hint="Used for recommendations." error={errors.age?.message}>
                <input
                  id="age"
                  type="number"
                  className="w-full px-3 py-2.5 input"
                  {...register("age", {
                    min: { value: 10, message: "Minimum age is 10" },
                    max: { value: 100, message: "Maximum age is 100" },
                  })}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FormField id="gender" label="Gender" error={errors.gender?.message}>
                <select id="gender" className="w-full px-3 py-2.5 input" {...register("gender")}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </FormField>
              <FormField id="fitness_level" label="Fitness level" error={errors.fitness_level?.message}>
                <select id="fitness_level" className="w-full px-3 py-2.5 input" {...register("fitness_level")}>
                  <option value="">Select</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </FormField>
              <FormField id="activity_level" label="Activity level" error={errors.activity_level?.message}>
                <select id="activity_level" className="w-full px-3 py-2.5 input" {...register("activity_level")}>
                  <option value="">Select</option>
                  <option value="sedentary">Sedentary</option>
                  <option value="lightly_active">Lightly active</option>
                  <option value="moderately_active">Moderately active</option>
                  <option value="active">Active</option>
                  <option value="very_active">Very active</option>
                </select>
              </FormField>
            </div>
          </section>

          <section className="space-y-4" aria-label="Body metrics">
            <h2 className="text-base font-semibold" style={{ color: "var(--text-2)" }}>Body metrics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField id="height_cm" label="Height (cm)" hint="For BMI and activity metrics." error={errors.height_cm?.message}>
                <input
                  id="height_cm"
                  type="number"
                  className="w-full px-3 py-2.5 input"
                  {...register("height_cm", {
                    min: { value: 100, message: "Height must be at least 100 cm" },
                    max: { value: 250, message: "Height must be less than 250 cm" },
                  })}
                />
              </FormField>
              <FormField id="weight_kg" label="Weight (kg)" hint="Used for progress tracking." error={errors.weight_kg?.message}>
                <input
                  id="weight_kg"
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2.5 input"
                  {...register("weight_kg", {
                    min: { value: 30, message: "Weight must be at least 30 kg" },
                    max: { value: 300, message: "Weight must be less than 300 kg" },
                  })}
                />
              </FormField>
            </div>
          </section>

          <section className="space-y-3" aria-label="Goals and optional medical context">
            <FormField id="goals" label="Goals" hint="Examples: maintenance, weight_loss, muscle_gain." error={errors.goals?.message}>
              <input id="goals" type="text" className="w-full px-3 py-2.5 input" {...register("goals")} />
            </FormField>

            <button
              type="button"
              onClick={() => setShowMedical((v) => !v)}
              className="btn btn-ghost px-0 text-sm focus-ring"
              aria-expanded={showMedical}
              aria-controls="profile-medical-section"
            >
              {showMedical ? <FiChevronUp size={15} /> : <FiChevronDown size={15} />}
              Optional medical details
            </button>

            {showMedical ? (
              <div id="profile-medical-section" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField id="medical_conditions" label="Medical conditions" hint="Optional. Helps personalize plans safely.">
                  <input id="medical_conditions" type="text" className="w-full px-3 py-2.5 input" {...register("medical_conditions")} />
                </FormField>
                <FormField id="allergies" label="Allergies" hint="Optional. Used for nutrition filtering.">
                  <input id="allergies" type="text" className="w-full px-3 py-2.5 input" {...register("allergies")} />
                </FormField>
              </div>
            ) : null}
          </section>

          <button
            type="submit"
            disabled={loading || isSubmitting}
            className="w-full btn btn-primary py-3 rounded-xl text-sm flex items-center justify-center gap-2 focus-ring"
            aria-label="Save profile"
          >
            <FiSave size={15} /> {loading || isSubmitting ? "Saving..." : "Save profile"}
          </button>
        </form>
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--text-1)" }}>
          <FiUser size={15} style={{ color: "var(--accent-light)" }} />
          Profile quality tips
        </h3>
        <ul className="mt-3 space-y-2 text-xs" style={{ color: "var(--text-2)" }}>
          <li>• Keep height and weight current for accurate BMI and calorie calculations.</li>
          <li>• Add optional medical data only if you want safer recommendations.</li>
          <li>• Use simple goals like “maintenance” or “muscle_gain” for clearer plan generation.</li>
        </ul>
      </Card>
    </motion.section>
  );
}
