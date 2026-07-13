import { motion } from "framer-motion";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { Card } from "../../components/ui";
import AppointmentsTabs from "./AppointmentsTabs";
import { useRecommendations } from "../../features/appointments/useAppointmentsQueries";

export default function FollowUpRecommendations() {
  const { data: recommendations = [] } = useRecommendations();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <AppointmentsTabs />
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "var(--text-1)" }}>Follow-Up Recommendations</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>AI-suggested appointments based on your medical history.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((rec: any, i: number) => (
          <Card key={i} className="p-5 glass-subtle relative overflow-hidden" style={{ border: rec.urgency === "High" ? "1px solid var(--color-warning)" : "1px solid var(--border-subtle)" }}>
            {rec.urgency === "High" && (
              <div className="absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase rounded-bl-lg" style={{ background: "var(--color-warning-dim, rgba(245, 158, 11, 0.1))", color: "var(--color-warning)" }}>
                Highly Recommended
              </div>
            )}
            <h3 className="font-semibold text-lg mt-2" style={{ color: "var(--text-1)" }}>{rec.doctor}</h3>
            <p className="text-xs font-medium uppercase mt-1" style={{ color: "var(--accent)" }}>{rec.specialty}</p>
            
            <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--border-subtle)" }}>
              <p className="text-sm mb-2" style={{ color: "var(--text-2)" }}><strong>Reason:</strong> {rec.reason}</p>
              <p className="text-sm" style={{ color: "var(--text-2)" }}><strong>Due by:</strong> {rec.dueDate}</p>
            </div>
            
            <button className="w-full mt-5 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors hover:opacity-90" style={{ background: "var(--accent)", color: "var(--accent-light)" }}>
              Book Now <FiArrowRight />
            </button>
          </Card>
        ))}
      </div>
      
      <Card className="p-5 glass-subtle flex gap-4 items-start">
        <FiCheckCircle className="text-xl shrink-0 mt-1" style={{ color: "var(--color-success)" }} />
        <div>
          <h4 className="font-medium text-sm" style={{ color: "var(--text-1)" }}>You're all caught up!</h4>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--text-3)" }}>
            Your recent blood test results are normal, and no immediate specialist follow-ups are required. Keep maintaining your healthy habits.
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
