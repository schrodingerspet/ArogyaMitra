import { motion } from "framer-motion";
import { FiClock, FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import { Card } from "../../components/ui";
import TrackingTabs from "./TrackingTabs";
import { useMedicationsData } from "../../features/tracking/hooks/useTrackingQueries";

export default function MedicationReminders() {
  const { data = { medications: [], renewals: [] } } = useMedicationsData();
  const { medications, renewals } = data;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <TrackingTabs />
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "var(--text-1)" }}>Medications & Renewals</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>Track daily adherence and prescription refills.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium text-sm" style={{ color: "var(--text-2)" }}>Today's Schedule</h3>
          {medications.map((med: any, i: number) => (
            <Card key={i} className="p-4 glass-subtle flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: "var(--surface-2)" }}>{med.icon}</div>
                 <div>
                   <h4 className="font-semibold text-sm" style={{ color: "var(--text-1)" }}>{med.name} - {med.dose}</h4>
                   <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--text-3)" }}><FiClock /> {med.schedule}</p>
                 </div>
              </div>
              <button className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors" 
                style={med.status === "Taken" ? { background: "var(--color-success-dim, rgba(34,197,94,0.1))", color: "var(--color-success)", borderColor: "var(--color-success)" } : { background: "var(--surface-1)", color: "var(--text-2)", borderColor: "var(--border-subtle)" }}>
                {med.status}
              </button>
            </Card>
          ))}
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium text-sm flex items-center gap-2" style={{ color: "var(--color-warning)" }}>
            <FiAlertCircle /> Needs Renewal Soon
          </h3>
          {renewals.map((ren: any, i: number) => (
            <Card key={i} className="p-4 relative overflow-hidden" style={{ background: "var(--color-warning-dim, rgba(245,158,11,0.05))", border: "1px solid var(--color-warning)" }}>
              <h4 className="font-bold text-sm" style={{ color: "var(--text-1)" }}>{ren.name}</h4>
              <p className="text-xs mt-1" style={{ color: "var(--text-3)" }}>Refills Remaining: <strong style={{ color: "var(--text-1)" }}>{ren.refills}</strong></p>
              <p className="text-xs mt-1" style={{ color: "var(--text-3)" }}>Next Refill By: <strong style={{ color: "var(--color-warning)" }}>{ren.nextRefill}</strong></p>
              <button className="w-full mt-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2" style={{ background: "var(--color-warning)", color: "#fff" }}>
                <FiRefreshCw /> Request Renewal
              </button>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
