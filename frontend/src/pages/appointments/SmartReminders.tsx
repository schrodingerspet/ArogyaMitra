import { motion } from "framer-motion";
import { FiBell, FiCalendar, FiClock } from "react-icons/fi";
import { Card } from "../../components/ui";
import AppointmentsTabs from "./AppointmentsTabs";
import { useReminders } from "../../features/appointments/useAppointmentsQueries";

export default function SmartReminders() {
  const { data: reminders = [] } = useReminders();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <AppointmentsTabs />
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "var(--text-1)" }}>Smart Reminders</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>Automated alerts for your schedule and health routines.</p>
        </div>
        <button className="btn btn-primary text-sm py-2 px-4 rounded-xl flex items-center gap-2">
          <FiBell /> New Reminder
        </button>
      </div>

      <div className="grid gap-4">
        {reminders.map((reminder: any, i: number) => (
          <Card key={i} className="p-4 glass-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg" style={{ background: "var(--surface-2)", color: "var(--accent)" }}>
                 {reminder.type === "Appointment" ? <FiCalendar /> : reminder.type === "Medication" ? "💊" : "🧪"}
               </div>
               <div>
                 <h4 className="font-semibold text-sm" style={{ color: "var(--text-1)" }}>{reminder.details}</h4>
                 <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--text-3)" }}>
                    <FiClock /> {reminder.time}
                 </p>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: "var(--accent-dim)", color: "var(--accent)" }}>
                 {reminder.status}
               </span>
               <button className="text-xs font-semibold px-4 py-2 rounded-xl transition-colors border" style={{ borderColor: "var(--border-subtle)", color: "var(--text-2)" }}>
                 Acknowledge
               </button>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
