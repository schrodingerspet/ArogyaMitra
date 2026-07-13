import { motion } from "framer-motion";
import { FiActivity, FiHeart, FiThermometer } from "react-icons/fi";
import { Card } from "../../components/ui";
import RecordsTabs from "./RecordsTabs";
import { useTimeline } from "../../features/records/hooks/useRecordsQueries";

const IconMap: Record<string, any> = {
  thermometer: FiThermometer,
  heart: FiHeart,
  activity: FiActivity
};

export default function HealthTimeline() {
  const { data: events = [] } = useTimeline();

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
        {events.map((ev: any, i: number) => {
          const Icon = IconMap[ev.icon] || FiActivity;
          return (
          <div key={i} className="relative pl-8">
            <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full flex items-center justify-center border-4" style={{ background: ev.color, borderColor: "var(--bg)", color: "#fff" }}>
              <Icon className="text-sm" />
            </div>
            <Card className="p-4 glass-subtle">
              <span className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: ev.color }}>{ev.type} • {ev.date}</span>
              <h4 className="font-semibold text-base" style={{ color: "var(--text-1)" }}>{ev.title}</h4>
              <p className="text-sm mt-2" style={{ color: "var(--text-2)" }}>{ev.desc}</p>
            </Card>
          </div>
        )})}
      </div>
    </motion.div>
  );
}
