import { motion } from "framer-motion";
import { FiFileText, FiShare2, FiDownload, FiFolder } from "react-icons/fi";
import { Card } from "../../components/ui";
import RecordsTabs from "./RecordsTabs";
import { useDocuments } from "../../features/records/hooks/useRecordsQueries";

export default function DocumentOrganizer() {
  const { data: documents = [] } = useDocuments();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <RecordsTabs />
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "var(--text-1)" }}>Medical Documents</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>Organize and securely share your health records.</p>
        </div>
        <button className="btn btn-primary text-sm py-2 px-4 rounded-xl flex items-center gap-2">
          Upload
        </button>
      </div>

      <div className="grid gap-4">
        {documents.map((doc: any, i: number) => (
          <Card key={i} className="p-4 glass-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg" style={{ background: "var(--surface-2)", color: "var(--accent)" }}>
                 <FiFileText />
               </div>
               <div>
                 <h4 className="font-semibold text-sm" style={{ color: "var(--text-1)" }}>{doc.name}</h4>
                 <p className="text-xs mt-1 flex items-center gap-2" style={{ color: "var(--text-3)" }}>
                    <span>{doc.date}</span> • <span>{doc.type}</span> • <span>{doc.size}</span>
                 </p>
               </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
               <button className="text-xs font-semibold px-4 py-2 rounded-xl transition-colors border flex items-center gap-2" style={{ borderColor: "var(--border-subtle)", color: "var(--text-2)", background: "var(--surface-1)" }}>
                 <FiDownload /> Download
               </button>
               <button className="text-xs font-semibold px-4 py-2 rounded-xl transition-colors border flex items-center gap-2" style={{ borderColor: "var(--accent)", color: "var(--accent-light)", background: "var(--accent-dim)" }}>
                 <FiShare2 /> Secure Link
               </button>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
