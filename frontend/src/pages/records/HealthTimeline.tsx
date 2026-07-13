import { motion } from "framer-motion";
import { FiActivity, FiHeart, FiThermometer } from "react-icons/fi";
import { Card } from "../../components/ui";
import RecordsTabs from "./RecordsTabs";

export default function HealthTimeline() {
  const events = [
    { date: "Jul 12, 2026", title: "Fever & Chills", type: "Symptom", desc: "Reported mild fever (100.2°F). Rested at home.", icon: FiThermometer, color: "var(--color-warning)" },
    { date: "Jul 05, 2026", title: "Cardiology Follow-up", type: "Visit", desc: "ECG normal. Blood pressure stable.", icon: FiHeart, color: "var(--color-success)" },
    { date: "Jun 28, 2026", title: "Started new Workout Plan", type: "Milestone", desc: "Completed 5 days of cardio.", icon: FiActivity, color: "var(--color-primary)" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <RecordsTabs />
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "var(--text-1)" }}>Digital Health Timeline</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>Your medical history at a glance.</p>
        </div>
      </div>

      <div className="relative border-l-2 ml-4 mt-6 space-y-8" style={{ borderColor: "var(--border-subtle)" }}>
        {events.map((ev, i) => (
          <div key={i} className="relative pl-8">
            <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full flex items-center justify-center border-4" style={{ background: ev.color, borderColor: "var(--bg)", color: "#fff" }}>
              <ev.icon className="text-sm" />
            </div>
            <Card className="p-4 glass-subtle">
              <span className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: ev.color }}>{ev.type} • {ev.date}</span>
              <h4 className="font-semibold text-base" style={{ color: "var(--text-1)" }}>{ev.title}</h4>
              <p className="text-sm mt-2" style={{ color: "var(--text-2)" }}>{ev.desc}</p>
            </Card>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
