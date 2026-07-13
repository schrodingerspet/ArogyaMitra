import { motion } from "framer-motion";
import { FiPhoneCall, FiAlertTriangle, FiHeart } from "react-icons/fi";
import { Card } from "../../components/ui";
import RecordsTabs from "./RecordsTabs";

export default function EmergencyCard() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <RecordsTabs />
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "var(--text-1)" }}>Emergency Card</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>Crucial medical info for first responders.</p>
        </div>
      </div>

      <Card className="p-6 relative overflow-hidden" style={{ background: "var(--color-danger-dim, rgba(239, 68, 68, 0.05))", border: "1px solid var(--color-danger)" }}>
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <FiHeart className="text-3xl" style={{ color: "var(--color-danger)" }} />
            <div>
              <h2 className="text-xl font-bold" style={{ color: "var(--text-1)" }}>MEDICAL ALERT</h2>
              <p className="text-sm font-semibold uppercase" style={{ color: "var(--color-danger)" }}>In Case of Emergency</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <span className="text-xs font-bold uppercase" style={{ color: "var(--text-3)" }}>Patient Name</span>
            <p className="text-lg font-semibold" style={{ color: "var(--text-1)" }}>John Doe</p>
          </div>
          <div>
            <span className="text-xs font-bold uppercase" style={{ color: "var(--text-3)" }}>Blood Type</span>
            <p className="text-lg font-semibold" style={{ color: "var(--color-danger)" }}>O Positive (O+)</p>
          </div>
        </div>

        <div className="space-y-4 border-t pt-4" style={{ borderColor: "var(--color-danger-dim, rgba(239, 68, 68, 0.2))" }}>
          <div>
            <span className="text-xs font-bold uppercase flex items-center gap-1" style={{ color: "var(--color-warning)" }}>
              <FiAlertTriangle /> Allergies
            </span>
            <p className="text-sm font-medium mt-1" style={{ color: "var(--text-1)" }}>Penicillin, Peanuts</p>
          </div>
          <div>
            <span className="text-xs font-bold uppercase" style={{ color: "var(--text-3)" }}>Chronic Conditions</span>
            <p className="text-sm font-medium mt-1" style={{ color: "var(--text-1)" }}>Type 2 Diabetes, Hypertension</p>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl" style={{ background: "var(--bg)", border: "1px solid var(--border-subtle)" }}>
          <span className="text-xs font-bold uppercase flex items-center gap-1 mb-2" style={{ color: "var(--text-3)" }}>
             Emergency Contacts
          </span>
          <div className="flex justify-between items-center py-2 border-b last:border-0" style={{ borderColor: "var(--border-subtle)" }}>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>Sarah Smith (Spouse)</p>
              <p className="text-xs" style={{ color: "var(--text-2)" }}>+1 (555) 019-2834</p>
            </div>
            <button className="w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{ background: "var(--color-success-dim, rgba(34, 197, 94, 0.1))", color: "var(--color-success)" }}>
              <FiPhoneCall />
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
