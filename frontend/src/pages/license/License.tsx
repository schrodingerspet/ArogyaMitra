import { motion } from "framer-motion";
import { FiFileText, FiExternalLink } from "react-icons/fi";

const LICENSE_TEXT = `MIT License

Copyright (c) 2025 ArogyaMitra Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

const dependencies = [
  { name: "React", license: "MIT", url: "https://github.com/facebook/react" },
  { name: "FastAPI", license: "MIT", url: "https://github.com/tiangolo/fastapi" },
  { name: "Tailwind CSS", license: "MIT", url: "https://github.com/tailwindlabs/tailwindcss" },
  { name: "Framer Motion", license: "MIT", url: "https://github.com/framer/motion" },
  { name: "Zustand", license: "MIT", url: "https://github.com/pmndrs/zustand" },
  { name: "React Router", license: "MIT", url: "https://github.com/remix-run/react-router" },
  { name: "SQLAlchemy", license: "MIT", url: "https://github.com/sqlalchemy/sqlalchemy" },
  { name: "Axios", license: "MIT", url: "https://github.com/axios/axios" },
];

export default function License() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-1)" }}>
          Open Source License
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-3)" }}>
          ArogyaMitra is open source software
        </p>
      </div>

      <div
        className="rounded-2xl p-6 mb-6"
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <FiFileText size={18} style={{ color: "var(--accent)" }} />
          <h2 className="text-base font-semibold" style={{ color: "var(--text-1)" }}>
            MIT License
          </h2>
        </div>
        <pre
          className="text-xs leading-relaxed whitespace-pre-wrap rounded-xl p-4 overflow-auto"
          style={{
            background: "var(--surface-1)",
            color: "var(--text-2)",
            border: "1px solid var(--border-subtle)",
            maxHeight: "400px",
          }}
        >
          {LICENSE_TEXT}
        </pre>
      </div>

      <div
        className="rounded-2xl p-6"
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <h2 className="text-base font-semibold mb-4" style={{ color: "var(--text-1)" }}>
          Open Source Dependencies
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {dependencies.map((dep, i) => (
            <motion.a
              key={dep.name}
              href={dep.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
              className="flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:opacity-80"
              style={{
                background: "var(--surface-3)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>
                  {dep.name}
                </p>
                <p className="text-xs" style={{ color: "var(--text-3)" }}>
                  {dep.license}
                </p>
              </div>
              <FiExternalLink size={14} style={{ color: "var(--text-3)" }} />
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
