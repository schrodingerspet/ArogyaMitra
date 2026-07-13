import { motion } from "framer-motion";
import { FiCalendar, FiClock, FiFileText } from "react-icons/fi";
import { Card } from "../../components/ui";
import ServicesTabs from "./ServicesTabs";

export default function LabTestBooking() {
  const tests = [
    { name: "Comprehensive Blood Count", lab: "Quest Diagnostics", date: "Jul 15, 2026", status: "Scheduled" },
    { name: "Vitamin D levels", lab: "LabCorp", date: "Jun 10, 2026", status: "Results Ready" }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <ServicesTabs />
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "var(--text-1)" }}>Lab Tests</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>Book new tests and track your results.</p>
        </div>
        <button className="btn btn-primary text-sm py-2 px-4 rounded-xl flex items-center gap-2">
          <FiCalendar /> Book Test
        </button>
      </div>

      <div className="grid gap-4">
        {tests.map((t, i) => (
          <Card key={i} className="p-4 glass-subtle flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h4 className="font-semibold text-base" style={{ color: "var(--text-1)" }}>{t.name}</h4>
              <p className="text-xs mt-1" style={{ color: "var(--text-3)" }}>{t.lab}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-2)" }}><FiClock /> {t.date}</span>
              </div>
            </div>
            <span className="text-xs px-3 py-1 rounded-full font-medium border" 
              style={t.status === "Results Ready" ? { borderColor: "var(--color-success)", color: "var(--color-success)", background: "var(--color-success-dim, rgba(34,197,94,0.1))" } : { borderColor: "var(--accent)", color: "var(--accent)" }}>
              {t.status === "Results Ready" ? <span className="flex items-center gap-1"><FiFileText /> View Results</span> : t.status}
            </span>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
