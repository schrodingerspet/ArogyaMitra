import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import useAuthStore from "../../stores/authStore";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(form);
    if (ok) {
      toast.success("Welcome back!");
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center auth-bg px-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="glass-elevated glass-lens rounded-2xl p-8 w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-lg">AM</span>
          </div>
          <h1 className="text-2xl font-bold text-gradient">ArogyaMitra</h1>
          <p className="text-sm mt-1.5" style={{ color: "var(--text-3)" }}>
            Sign in to your wellness dashboard
          </p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium" style={{
            background: "var(--danger-dim)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-3)" }}>Email</label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-3.5" style={{ color: "var(--text-4)" }} size={16} />
              <input
                type="email"
                placeholder="you@example.com"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 input rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-3)" }}>Password</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-3.5" style={{ color: "var(--text-4)" }} size={16} />
              <input
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full pl-10 pr-10 py-3 input rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-3 p-0.5 rounded transition"
                style={{ color: "var(--text-4)" }}
              >
                {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary py-3 rounded-xl text-sm"
          >
            <FiLogIn size={16} /> {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm" style={{ color: "var(--text-3)" }}>
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-semibold hover:opacity-80 transition" style={{ color: "var(--accent-light)" }}>
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
