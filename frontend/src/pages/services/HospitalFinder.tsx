import { useState } from "react";
import { motion } from "framer-motion";
import { FiMapPin, FiStar, FiPhone, FiFilter } from "react-icons/fi";
import { Card } from "../../components/ui";
import ServicesTabs from "./ServicesTabs";
import { useHospitals } from "../../features/services/useServicesQueries";

export default function HospitalFinder() {
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const { data: hospitals = [], isLoading } = useHospitals(filterType);

  const handleFilter = () => {
    // Basic toggle for demonstration; in a real app this would be a dropdown
    if (filterType === undefined) setFilterType("Urgent Care");
    else if (filterType === "Urgent Care") setFilterType("Cardiology");
    else setFilterType(undefined);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <ServicesTabs />
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "var(--text-1)" }}>Hospital & Clinic Finder</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>Locate nearby healthcare facilities.</p>
        </div>
        <button 
          onClick={handleFilter}
          className="text-sm py-2 px-4 rounded-xl flex items-center gap-2 border transition-colors hover:bg-surface-2" 
          style={{ background: "var(--surface-2)", color: "var(--text-1)", borderColor: "var(--border-subtle)" }}>
          <FiFilter /> {filterType ? `Filter: ${filterType}` : "Filters"}
        </button>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <p style={{ color: "var(--text-2)" }}>Loading facilities...</p>
        ) : hospitals.length === 0 ? (
          <p style={{ color: "var(--text-2)" }}>No facilities found.</p>
        ) : (
          hospitals.map((h: any) => (
            <Card key={h.id} className="p-4 glass-subtle flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h4 className="font-semibold text-base" style={{ color: "var(--text-1)" }}>{h.name}</h4>
                <p className="text-xs mt-1 font-medium" style={{ color: "var(--accent)" }}>{h.facility_type}</p>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-xs flex items-center gap-1" style={{ color: "var(--text-3)" }}><FiMapPin /> {h.distance_km} km</p>
                  <p className="text-xs flex items-center gap-1" style={{ color: "var(--color-warning)" }}><FiStar /> {h.rating}</p>
                </div>
              </div>
              <button className="text-xs font-semibold px-4 py-2 rounded-xl border flex items-center gap-2 transition-colors hover:bg-surface-2" style={{ color: "var(--text-1)", borderColor: "var(--border-subtle)", background: "var(--surface-1)" }}>
                <FiPhone /> Call Now
              </button>
            </Card>
          ))
        )}
      </div>
    </motion.div>
  );
}
