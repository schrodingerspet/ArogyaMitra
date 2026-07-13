import { motion } from "framer-motion";
import { FiCalendar, FiClock, FiUserCheck } from "react-icons/fi";
import { Card } from "../../components/ui";
import AppointmentsTabs from "./AppointmentsTabs";

export default function DoctorCalendar() {
  const timeSlots = [
    { time: "09:00 AM", status: "available" },
    { time: "09:30 AM", status: "booked" },
    { time: "10:00 AM", status: "available" },
    { time: "10:30 AM", status: "available" },
    { time: "11:00 AM", status: "break" },
    { time: "11:30 AM", status: "booked" },
    { time: "12:00 PM", status: "available" },
    { time: "12:30 PM", status: "booked" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <AppointmentsTabs />
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "var(--text-1)" }}>Doctor Availability</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>View and book available consultation slots.</p>
        </div>
      </div>

      <Card className="glass-subtle p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl" style={{ background: "var(--surface-2)", color: "var(--accent)" }}>
            👨‍⚕️
          </div>
          <div>
            <h3 className="font-semibold text-lg" style={{ color: "var(--text-1)" }}>Dr. Smith (Cardiology)</h3>
            <p className="text-sm" style={{ color: "var(--text-3)" }}>Select a date to view availability</p>
          </div>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
          {[12, 13, 14, 15, 16].map((day, i) => (
             <button key={day} className={`flex flex-col items-center justify-center w-16 h-20 rounded-xl border ${i === 0 ? 'border-[var(--accent)] bg-[var(--accent-dim)]' : 'border-subtle bg-surface-1'}`} style={i === 0 ? { borderColor: "var(--accent)", background: "var(--accent-dim)" } : { borderColor: "var(--border-subtle)", background: "var(--surface-1)" }}>
               <span className="text-xs font-semibold" style={{ color: i === 0 ? "var(--accent)" : "var(--text-3)" }}>Jul</span>
               <span className="text-lg font-bold" style={{ color: i === 0 ? "var(--accent-light)" : "var(--text-1)" }}>{day}</span>
             </button>
          ))}
        </div>

        <h4 className="font-medium text-sm mb-4" style={{ color: "var(--text-2)" }}>Available Slots</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {timeSlots.map((slot, i) => {
            const isAvailable = slot.status === "available";
            const isBreak = slot.status === "break";
            return (
              <button 
                key={i} 
                disabled={!isAvailable}
                className={`py-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                  isAvailable 
                    ? 'hover:border-[var(--accent)] cursor-pointer' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
                style={{ 
                  background: isAvailable ? "var(--surface-1)" : "var(--surface-2)",
                  borderColor: "var(--border-subtle)",
                  color: isAvailable ? "var(--text-1)" : "var(--text-3)"
                }}
              >
                <FiClock /> {slot.time}
              </button>
            )
          })}
        </div>
      </Card>
    </motion.div>
  );
}
