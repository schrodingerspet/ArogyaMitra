import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiCode } from "react-icons/fi";

const contributors = [
  {
    name: "Pankaj Bhoge",
    role: "Team Lead",
    contributions: "AI Integration, AROMI Chat, Backend Services",
    github: "schrodingerspet",
    linkedin: "pankaj-bhoge",
    avatar: "PB",
  },
  {
    name: "Rohit Dake",
    role: "Developer",
    contributions: "YouTube & Spoonacular API Integration",
    github: "rohitdake",
    linkedin: "rohit-dake",
    avatar: "RD",
  },
  {
    name: "Dhiraj Dattaray Holkar",
    role: "Developer",
    contributions: "JWT Auth, API Routers, Zustand Stores",
    github: "dhirajholkar",
    linkedin: "dhiraj-holkar",
    avatar: "DH",
  },
  {
    name: "Aditya Akolkar",
    role: "Developer",
    contributions: "ORM Models, Calendar API, Frontend Pages",
    github: "adityaakolkar",
    linkedin: "aditya-akolkar",
    avatar: "AA",
  },
];

export default function Contributors() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-1)" }}>
          Contributors
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-3)" }}>
          The people who built ArogyaMitra
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {contributors.map((person, i) => (
          <motion.div
            key={person.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className="rounded-2xl p-5 flex flex-col gap-4"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold shrink-0"
                style={{
                  background: "var(--accent-dim)",
                  color: "var(--accent-light)",
                }}
              >
                {person.avatar}
              </div>
              <div className="min-w-0">
                <p className="text-base font-semibold truncate" style={{ color: "var(--text-1)" }}>
                  {person.name}
                </p>
                <p className="text-xs font-medium" style={{ color: "var(--accent)" }}>
                  {person.role}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <FiCode size={14} className="shrink-0 mt-0.5" style={{ color: "var(--text-3)" }} />
              <p className="text-sm" style={{ color: "var(--text-2)" }}>
                {person.contributions}
              </p>
            </div>

            <div className="flex items-center gap-3 mt-auto pt-2" style={{ borderTop: "1px solid var(--border-subtle)" }}>
              <a
                href={`https://github.com/${person.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium rounded-lg px-2.5 py-1.5 transition-colors hover:opacity-80"
                style={{ background: "var(--surface-3)", color: "var(--text-2)" }}
              >
                <FiGithub size={13} /> GitHub
              </a>
              <a
                href={`https://linkedin.com/in/${person.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium rounded-lg px-2.5 py-1.5 transition-colors hover:opacity-80"
                style={{ background: "var(--surface-3)", color: "var(--text-2)" }}
              >
                <FiLinkedin size={13} /> LinkedIn
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      <div
        className="mt-8 rounded-2xl p-5 text-center"
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <p className="text-sm" style={{ color: "var(--text-2)" }}>
          Want to contribute?{" "}
          <a
            href="https://github.com/schrodingerspet/ArogyaMitra"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline"
            style={{ color: "var(--accent)" }}
          >
            Fork us on GitHub
          </a>
        </p>
      </div>
    </motion.div>
  );
}
