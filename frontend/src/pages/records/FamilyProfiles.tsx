import { motion } from "framer-motion";
import { FiUser, FiUserPlus, FiHeart } from "react-icons/fi";
import { Card } from "../../components/ui";
import RecordsTabs from "./RecordsTabs";
import { useQuery } from "@tanstack/react-query";
import { getDependents } from "../../api/auth";

export default function FamilyProfiles() {
  const { data: dependents = [], isLoading } = useQuery({
    queryKey: ['dependents'],
    queryFn: getDependents,
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <RecordsTabs />
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "var(--text-1)" }}>Family Members</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>Manage health profiles for your dependents.</p>
        </div>
        <button className="btn btn-primary text-sm py-2 px-4 rounded-xl flex items-center gap-2">
          <FiUserPlus /> Add Member
        </button>
      </div>

      {isLoading ? (
        <p style={{ color: "var(--text-2)" }}>Loading dependents...</p>
      ) : dependents.length === 0 ? (
        <Card className="p-6 text-center glass-subtle">
          <p style={{ color: "var(--text-2)" }}>No dependents found. Any patient who registers with your email as their caregiver will appear here.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {dependents.map((member: any) => (
            <Card key={member.id} className="p-5 glass-subtle">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl" style={{ background: "var(--surface-2)", color: "var(--text-1)" }}>
                   <FiUser />
                 </div>
                 <div>
                   <h3 className="font-semibold text-lg" style={{ color: "var(--text-1)" }}>{member.name}</h3>
                   <p className="text-sm font-medium" style={{ color: "var(--accent)" }}>Patient (ID: {member.id})</p>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t pt-4" style={{ borderColor: "var(--border-subtle)" }}>
                <div>
                  <span className="text-xs" style={{ color: "var(--text-3)" }}>Language</span>
                  <p className="text-sm font-semibold capitalize" style={{ color: "var(--text-1)" }}>{member.language || "Not set"}</p>
                </div>
                <div>
                  <span className="text-xs" style={{ color: "var(--text-3)" }}>Status</span>
                  <p className="text-sm font-semibold" style={{ color: "var(--color-success)" }}>Active</p>
                </div>
              </div>
              <button className="w-full mt-5 py-2 rounded-xl text-sm font-semibold border transition-colors hover:bg-surface-2" style={{ borderColor: "var(--border-subtle)", color: "var(--text-2)" }}>
                View Full Profile
              </button>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}

