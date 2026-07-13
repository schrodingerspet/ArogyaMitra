import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCalendar, FiClock, FiFileText, FiPlus, FiX } from "react-icons/fi";
import { Card } from "../../components/ui";
import ServicesTabs from "./ServicesTabs";
import { useLabBookings, useBookLabTest } from "../../features/services/useServicesQueries";

export default function LabTestBooking() {
  const { data: tests = [], isLoading } = useLabBookings();
  const bookMutation = useBookLabTest();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({ test_name: "", lab_name: "", booking_date: "" });

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.test_name || !formData.lab_name || !formData.booking_date) return;
    bookMutation.mutate(formData, {
      onSuccess: () => {
        setShowBookingForm(false);
        setFormData({ test_name: "", lab_name: "", booking_date: "" });
      }
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <ServicesTabs />
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "var(--text-1)" }}>Lab Tests</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>Book new tests and track your results.</p>
        </div>
        <button 
          onClick={() => setShowBookingForm(!showBookingForm)}
          className="btn btn-primary text-sm py-2 px-4 rounded-xl flex items-center gap-2">
          {showBookingForm ? <FiX /> : <FiCalendar />} {showBookingForm ? 'Cancel' : 'Book Test'}
        </button>
      </div>

      <AnimatePresence>
        {showBookingForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleBook}
            className="p-4 glass-subtle rounded-2xl border flex flex-col gap-3"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input type="text" placeholder="Test Name (e.g. Lipid Profile)" className="input px-3 py-2" value={formData.test_name} onChange={(e) => setFormData({ ...formData, test_name: e.target.value })} required />
              <input type="text" placeholder="Lab Name (e.g. LabCorp)" className="input px-3 py-2" value={formData.lab_name} onChange={(e) => setFormData({ ...formData, lab_name: e.target.value })} required />
              <input type="date" className="input px-3 py-2" value={formData.booking_date} onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })} required />
            </div>
            <button type="submit" disabled={bookMutation.isPending} className="btn btn-primary py-2 px-4 rounded-xl self-end flex items-center gap-2">
              <FiPlus /> {bookMutation.isPending ? 'Booking...' : 'Confirm Booking'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid gap-4">
        {isLoading ? (
          <p style={{ color: "var(--text-2)" }}>Loading tests...</p>
        ) : tests.length === 0 ? (
          <p style={{ color: "var(--text-2)" }}>No tests found.</p>
        ) : (
          tests.map((t: any) => (
            <Card key={t.id} className="p-4 glass-subtle flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h4 className="font-semibold text-base" style={{ color: "var(--text-1)" }}>{t.test_name}</h4>
                <p className="text-xs mt-1" style={{ color: "var(--text-3)" }}>{t.lab_name}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-2)" }}><FiClock /> {t.booking_date}</span>
                </div>
              </div>
              <span className="text-xs px-3 py-1 rounded-full font-medium border" 
                style={t.status === "Results Ready" ? { borderColor: "var(--color-success)", color: "var(--color-success)", background: "var(--color-success-dim, rgba(34,197,94,0.1))" } : { borderColor: "var(--accent)", color: "var(--accent)" }}>
                {t.status === "Results Ready" ? <span className="flex items-center gap-1"><FiFileText /> View Results</span> : t.status}
              </span>
            </Card>
          ))
        )}
      </div>
    </motion.div>
  );
}
