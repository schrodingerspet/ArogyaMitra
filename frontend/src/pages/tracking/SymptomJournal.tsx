import { motion } from "framer-motion";
import { FiPlus, FiFrown, FiMeh, FiSmile } from "react-icons/fi";
import { Card } from "../../components/ui";
import TrackingTabs from "./TrackingTabs";

export default function SymptomJournal() {
  const symptoms = [
    { date: "Jul 13, 2026", time: "10:30 AM", symptom: "Headache", severity: "Mild", notes: "Felt a dull ache after screen time." },
    { date: "Jul 11, 2026", time: "08:00 PM", symptom: "Joint Pain", severity: "Moderate", notes: "Knee pain after evening run." }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <TrackingTabs />
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "var(--text-1)" }}>Symptom Journal</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>Log and track daily symptoms for your doctor.</p>
        </div>
        <button className="btn btn-primary text-sm py-2 px-4 rounded-xl flex items-center gap-2">
          <FiPlus /> Add Log
        </button>
      </div>

      <div className="grid gap-4">
        {symptoms.map((log, i) => (
          <Card key={i} className="p-4 glass-subtle relative overflow-hidden" style={{ borderLeft: log.severity === "Moderate" ? "4px solid var(--color-warning)" : "4px solid var(--color-success)" }}>
             <div className="flex justify-between items-start">
               <div>
                 <h4 className="font-semibold text-base" style={{ color: "var(--text-1)" }}>{log.symptom}</h4>
                 <p className="text-xs font-bold uppercase mt-1" style={{ color: "var(--text-3)" }}>{log.date} • {log.time}</p>
               </div>
               <div className="flex flex-col items-end">
                 {log.severity === "Mild" ? <FiSmile className="text-xl" style={{ color: "var(--color-success)" }} /> : <FiMeh className="text-xl" style={{ color: "var(--color-warning)" }} />}
                 <span className="text-xs font-semibold mt-1" style={{ color: "var(--text-2)" }}>{log.severity}</span>
               </div>
             </div>
             <p className="text-sm mt-3 pt-3 border-t" style={{ borderColor: "var(--border-subtle)", color: "var(--text-2)" }}>
               {log.notes}
             </p>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
