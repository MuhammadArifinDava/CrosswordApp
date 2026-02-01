import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { api } from "../lib/api";
import { useAuth } from "../context/useAuth";
import { Container } from "../components/Container";
import { Alert } from "../components/Alert";

function RegisterPage() {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const nm = name.trim();
    const un = username.trim();
    const em = email.trim();
    const pw = password;
    if (!nm || !un || !em || !pw) {
      setError("Field required");
      return;
    }
    setBusy(true);
    try {
      const { data } = await api.post("/auth/register", {
        name: nm,
        username: un,
        email: em,
        password: pw,
      });
      setToken(data.token);
      setUser(data.user);
      navigate("/");
    } catch (err) {
      const message = err?.response?.data?.message || "Server error";
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, amount: 0.6 }}
        className="w-full max-w-md mx-auto p-4 [perspective:1200px]"
      >
        <div className="card-3d surface rounded-[32px] bg-white p-8 shadow-xl">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Create account</p>
            <h1 className="mt-4 font-display text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
              Start sharing your ideas.
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Join the archive and publish with confidence.
            </p>
          </div>

          {error ? (
            <div className="mt-5">
              <Alert>{error}</Alert>
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-[0.24em] text-slate-500">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-3 w-full rounded-full border border-white/70 bg-white/80 px-5 py-3 text-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-black/10"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.24em] text-slate-500">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-3 w-full rounded-full border border-white/70 bg-white/80 px-5 py-3 text-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-black/10"
                  placeholder="yourname"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.24em] text-slate-500">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-3 w-full rounded-full border border-white/70 bg-white/80 px-5 py-3 text-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-black/10"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.24em] text-slate-500">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-3 w-full rounded-full border border-white/70 bg-white/80 px-5 py-3 text-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-black/10"
                  placeholder="Minimum 8 characters"
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:bg-black disabled:opacity-50"
              >
                {busy ? "Creating..." : "Register"}
              </button>
            </form>

            <div className="mt-6 text-sm text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-slate-900">
                Login
              </Link>
            </div>
          </div>
        </Motion.div>
      </div>
  );
}

export default RegisterPage;
