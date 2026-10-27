
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import { supabase } from "../utils/supabase";

export default function ClientLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      navigate("/booking", { replace: true });
    } catch (error) {
      setMessage(error.message || "Login failed. Please try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#89505f] focus:ring-2 focus:ring-[#89505f]/10";

  return (
    <main className="min-h-screen bg-[#fffaf8] px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-lg">
        <div className="mb-8 text-center">
          <p className="mb-3 text-sm uppercase tracking-[3px] text-[#89505f]">
            Belleora Beauty
          </p>

          <h1 className="font-serif text-4xl text-[#3d2930]">
            Welcome Back
          </h1>

          <p className="mt-3 text-sm text-gray-600">
            Sign in to manage your appointments.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
        >
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#3d2930]">
              Email Address
            </label>

            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#3d2930]">
              Password
            </label>

            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          {message && (
            <p
              role="alert"
              className={`rounded-xl p-3 text-sm ${
                isError
                  ? "bg-red-50 text-red-700"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#89505f] px-6 py-3.5 font-medium text-white transition hover:bg-[#70404d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogIn size={18} />
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/client/register"
              className="font-medium text-[#89505f] hover:underline"
            >
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
