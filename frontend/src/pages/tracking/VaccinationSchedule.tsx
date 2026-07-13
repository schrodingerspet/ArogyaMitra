import { motion } from "framer-motion";
import { FiCheckCircle, FiClock } from "react-icons/fi";
import { Card } from "../../components/ui";
import TrackingTabs from "./TrackingTabs";

export default function VaccinationSchedule() {
  const vaccines = [
    { name: "COVID-19 Booster", date: "Sep 15, 2026", status: "Upcoming", for: "John Doe" },
    { name: "Annual Flu Shot", date: "Oct 10, 2026", status: "Upcoming", for: "John Doe" },
    { name: "Tetanus Toxoid", date: "May 20, 2022", status: "Completed", for: "John Doe" }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <TrackingTabs />
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "var(--text-1)" }}>Vaccination Schedule</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>Track immunizations and upcoming due dates.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {vaccines.map((vax, i) => (
          <Card key={i} className="p-4 glass-subtle flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ background: vax.status === "Completed" ? "var(--color-success-dim, rgba(34,197,94,0.1))" : "var(--surface-2)", color: vax.status === "Completed" ? "var(--color-success)" : "var(--accent)" }}>
                 {vax.status === "Completed" ? <FiCheckCircle /> : <FiClock />}
               </div>
               <div>
                 <h4 className="font-semibold text-sm" style={{ color: "var(--text-1)" }}>{vax.name}</h4>
                 <p className="text-xs mt-1" style={{ color: "var(--text-3)" }}>For: {vax.for} • Due: {vax.date}</p>
               </div>
            </div>
            <span className="text-xs px-3 py-1 rounded-full font-medium border" style={vax.status === "Completed" ? { borderColor: "var(--color-success)", color: "var(--color-success)" } : { borderColor: "var(--accent)", color: "var(--accent)" }}>
              {vax.status}
            </span>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
