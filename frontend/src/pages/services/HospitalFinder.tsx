import { motion } from "framer-motion";
import { FiMapPin, FiStar, FiPhone, FiFilter } from "react-icons/fi";
import { Card } from "../../components/ui";
import ServicesTabs from "./ServicesTabs";

export default function HospitalFinder() {
  const hospitals = [
    { name: "City General Hospital", distance: "2.5 km", rating: 4.8, type: "Multi-Specialty", contact: "+1-555-0192" },
    { name: "Sunrise Care Clinic", distance: "5.1 km", rating: 4.5, type: "Urgent Care", contact: "+1-555-0100" }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <ServicesTabs />
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "var(--text-1)" }}>Hospital & Clinic Finder</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>Locate nearby healthcare facilities.</p>
        </div>
        <button className="text-sm py-2 px-4 rounded-xl flex items-center gap-2 border transition-colors" style={{ background: "var(--surface-2)", color: "var(--text-1)", borderColor: "var(--border-subtle)" }}>
          <FiFilter /> Filters
        </button>
      </div>

      <div className="grid gap-4">
        {hospitals.map((h, i) => (
          <Card key={i} className="p-4 glass-subtle flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h4 className="font-semibold text-base" style={{ color: "var(--text-1)" }}>{h.name}</h4>
              <p className="text-xs mt-1 font-medium" style={{ color: "var(--accent)" }}>{h.type}</p>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-xs flex items-center gap-1" style={{ color: "var(--text-3)" }}><FiMapPin /> {h.distance}</p>
                <p className="text-xs flex items-center gap-1" style={{ color: "var(--color-warning)" }}><FiStar /> {h.rating}</p>
              </div>
            </div>
            <button className="text-xs font-semibold px-4 py-2 rounded-xl border flex items-center gap-2 transition-colors hover:bg-surface-2" style={{ color: "var(--text-1)", borderColor: "var(--border-subtle)", background: "var(--surface-1)" }}>
              <FiPhone /> Call Now
            </button>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
