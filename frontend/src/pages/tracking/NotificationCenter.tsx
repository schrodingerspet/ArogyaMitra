import { motion } from "framer-motion";
import { FiInfo, FiAlertCircle, FiCheck } from "react-icons/fi";
import { Card } from "../../components/ui";
import TrackingTabs from "./TrackingTabs";

export default function NotificationCenter() {
  const notifications = [
    { type: "Alert", msg: "Dr. Smith requested a follow-up appointment.", time: "1 hour ago", read: false },
    { type: "Info", msg: "Your lab results (Blood Test) are ready.", time: "3 hours ago", read: false },
    { type: "Success", msg: "Prescription for Vitamin D3 renewed successfully.", time: "1 day ago", read: true }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <TrackingTabs />
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "var(--text-1)" }}>Notification Center</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>Stay updated with recent activities and alerts.</p>
        </div>
        <button className="text-xs font-semibold px-4 py-2 rounded-xl transition-colors hover:bg-surface-2" style={{ color: "var(--text-2)", background: "var(--surface-1)" }}>
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((notif, i) => (
          <Card key={i} className="p-4 flex gap-4 relative overflow-hidden" style={{ background: notif.read ? "var(--surface-1)" : "var(--surface-2)", border: "1px solid var(--border-subtle)" }}>
            {!notif.read && <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: "var(--accent)" }} />}
            <div className="text-lg mt-0.5" style={{ color: notif.type === "Alert" ? "var(--color-warning)" : notif.type === "Info" ? "var(--color-info)" : "var(--color-success)" }}>
              {notif.type === "Alert" ? <FiAlertCircle /> : notif.type === "Info" ? <FiInfo /> : <FiCheck />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{notif.msg}</p>
              <span className="text-xs mt-1 block" style={{ color: "var(--text-3)" }}>{notif.time}</span>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
