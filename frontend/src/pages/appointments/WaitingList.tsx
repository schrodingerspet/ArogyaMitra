import { motion } from "framer-motion";
import { FiUsers, FiClock, FiAlertCircle } from "react-icons/fi";
import { Card } from "../../components/ui";
import AppointmentsTabs from "./AppointmentsTabs";

export default function WaitingList() {
  const waitingPatients = [
    { name: "John Doe", doctor: "Dr. Smith", waitTime: "45 mins", priority: "High" },
    { name: "Jane Roe", doctor: "Dr. Smith", waitTime: "20 mins", priority: "Normal" },
    { name: "Mike Tyson", doctor: "Dr. Adams", waitTime: "5 mins", priority: "Normal" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <AppointmentsTabs />
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "var(--text-1)" }}>Waiting List</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>Live view of patients waiting for their appointment.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {waitingPatients.map((patient, i) => (
          <Card key={i} className="p-4 glass-subtle flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--surface-2)", color: "var(--text-1)" }}>
                 <FiUsers />
               </div>
               <div>
                 <h4 className="font-semibold text-sm" style={{ color: "var(--text-1)" }}>{patient.name}</h4>
                 <p className="text-xs mt-1" style={{ color: "var(--text-3)" }}>Waiting for {patient.doctor}</p>
               </div>
            </div>
            <div className="text-right">
               <span className={`text-xs px-2 py-1 rounded-full font-bold`} style={{ 
                 background: patient.priority === "High" ? "var(--color-danger-dim, rgba(239, 68, 68, 0.1))" : "var(--surface-2)",
                 color: patient.priority === "High" ? "var(--color-danger)" : "var(--text-2)"
               }}>
                 {patient.priority}
               </span>
               <div className="text-xs font-medium mt-2 flex items-center justify-end gap-1" style={{ color: "var(--color-warning)" }}>
                 <FiClock /> {patient.waitTime}
               </div>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
