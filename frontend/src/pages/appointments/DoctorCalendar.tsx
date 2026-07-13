import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCalendar, FiClock, FiUserCheck, FiStar, FiAward, FiX } from "react-icons/fi";
import { Card } from "../../components/ui";
import AppointmentsTabs from "./AppointmentsTabs";
import { useDoctors, useSubmitFeedback, useDoctor } from "../../features/appointments/useDoctorsQueries";

export default function DoctorCalendar() {
  const { data: doctors = [], isLoading: isLoadingDocs } = useDoctors();
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  
  const submitFeedbackMutation = useSubmitFeedback();

  // Pick the first doctor by default if none selected
  const activeDocId = selectedDoctorId || (doctors.length > 0 ? doctors[0].id : null);
  const { data: activeDoctor } = useDoctor(activeDocId || 0);

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

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDocId) return;
    submitFeedbackMutation.mutate({ doctorId: activeDocId, rating, comment }, {
      onSuccess: () => {
        setComment("");
        setRating(5);
        // Optionally leave modal open to see new feedback
      }
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 relative">
      <AppointmentsTabs />
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "var(--text-1)" }}>Doctor Availability</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>View and book available consultation slots.</p>
        </div>
      </div>
      
      {/* Doctor Selection (simple mock dropdown for demonstration) */}
      {!isLoadingDocs && doctors.length > 1 && (
        <select 
          className="input px-3 py-2 w-full max-w-xs" 
          value={activeDocId || ""} 
          onChange={(e) => setSelectedDoctorId(Number(e.target.value))}
        >
          {doctors.map((d: any) => (
            <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
          ))}
        </select>
      )}

      {activeDoctor ? (
        <Card className="glass-subtle p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl" style={{ background: "var(--surface-2)", color: "var(--accent)" }}>
              👨‍⚕️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg" style={{ color: "var(--text-1)" }}>{activeDoctor.name} ({activeDoctor.specialty})</h3>
                {activeDoctor.is_verified && (
                  <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold border" style={{ color: "var(--color-success)", borderColor: "var(--color-success)", background: "var(--color-success-dim, rgba(34,197,94,0.1))" }} title="Verified Medical Professional">
                    <FiAward /> Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 text-sm">
                <span className="flex items-center gap-1 font-medium" style={{ color: "var(--color-warning)" }}><FiStar /> {activeDoctor.average_rating} <span style={{ color: "var(--text-3)", fontWeight: "normal" }}>({activeDoctor.review_count} reviews)</span></span>
                <span style={{ color: "var(--text-3)" }}>|</span>
                <button onClick={() => setShowFeedbackModal(true)} className="underline text-xs transition-colors hover:text-[var(--accent-light)]" style={{ color: "var(--accent)" }}>Read Feedback</button>
              </div>
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
      ) : (
        <p style={{ color: "var(--text-2)" }}>{isLoadingDocs ? "Loading..." : "No doctors found."}</p>
      )}

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedbackModal && activeDoctor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="glass p-6 rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto flex flex-col gap-4 border"
              style={{ borderColor: "var(--border-subtle)", background: "var(--surface-1)" }}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg" style={{ color: "var(--text-1)" }}>Feedback for {activeDoctor.name}</h3>
                <button onClick={() => setShowFeedbackModal(false)} style={{ color: "var(--text-2)" }}><FiX size={24}/></button>
              </div>

              <div className="space-y-3">
                {activeDoctor.feedbacks?.length === 0 ? (
                  <p className="text-sm" style={{ color: "var(--text-3)" }}>No feedback yet. Be the first to review!</p>
                ) : (
                  activeDoctor.feedbacks?.map((fb: any) => (
                    <div key={fb.id} className="p-3 rounded-xl glass-subtle border" style={{ borderColor: "var(--border-subtle)" }}>
                      <div className="flex items-center gap-1 mb-1" style={{ color: "var(--color-warning)" }}>
                        <FiStar /> <span className="text-sm font-semibold">{fb.rating}</span>
                      </div>
                      {fb.comment && <p className="text-sm" style={{ color: "var(--text-2)" }}>{fb.comment}</p>}
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleFeedbackSubmit} className="mt-4 pt-4 border-t flex flex-col gap-3" style={{ borderColor: "var(--border-subtle)" }}>
                <h4 className="font-medium text-sm" style={{ color: "var(--text-1)" }}>Submit Review</h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: "var(--text-2)" }}>Rating:</span>
                  <input type="number" min="1" max="5" step="0.5" className="input px-2 py-1 w-20" value={rating} onChange={(e) => setRating(Number(e.target.value))} required />
                </div>
                <textarea 
                  placeholder="Share your experience..." 
                  className="input px-3 py-2 w-full h-24 resize-none" 
                  value={comment} 
                  onChange={(e) => setComment(e.target.value)} 
                />
                <button type="submit" disabled={submitFeedbackMutation.isPending} className="btn btn-primary py-2 px-4 rounded-xl w-full">
                  {submitFeedbackMutation.isPending ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
