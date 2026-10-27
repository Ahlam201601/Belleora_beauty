import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { supabase } from "../../utils/supabase";
import logo from "../../assets/images/logo.png";

const ADMIN_EMAIL = "ahlam@belleorabeauty.com";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail !== ADMIN_EMAIL) {
      setError("Access denied. Admin only.");
      return;
    }

    setLoading(true);

    try {
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

      if (loginError) {
        setError("Invalid email or password. Please try again.");
        return;
      }

      navigate("/admin", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fff8f8] px-4 py-8 sm:px-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl lg:min-h-150 lg:grid-cols-2">
        {/* Brand section */}
        <section className="relative hidden flex-col items-center justify-center overflow-hidden bg-[#38232c] p-10 text-center text-white lg:flex">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#89505f]/30 blur-2xl" />
          <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-[#89505f]/30 blur-2xl" />

          <div className="relative z-10 max-w-sm">
            <img
              src={logo}
              alt="Belleora Beauty logo"
              className="mx-auto mb-8 h-28 w-28 rounded-2xl bg-white object-contain p-2"
            />

            <p className="mb-3 text-xs uppercase tracking-[4px] text-[#e8c8d0]">
              Beauty & Wellness
            </p>

            <h1 className="font-serif text-4xl leading-tight">
              Welcome to
              <br />
              Belleora Beauty
            </h1>

            <p className="mt-5 text-sm leading-7 text-gray-300">
              Your beauty studio, beautifully managed.
              Access your dashboard to manage appointments
              and keep everything organized.
            </p>

            <div className="mx-auto mt-8 h-1 w-16 rounded-full bg-[#c993a2]" />
          </div>
        </section>

        {/* Login form */}
        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <img
                src={logo}
                alt="Belleora Beauty logo"
                className="mx-auto mb-5 h-20 w-20 rounded-2xl object-contain lg:hidden"
              />

              <p className="mb-2 text-xs font-medium uppercase tracking-[3px] text-[#89505f]">
                Admin Portal
              </p>

              <h2 className="font-serif text-3xl text-[#38232c] sm:text-4xl">
                Sign in
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Enter your admin credentials to access your dashboard.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#38232c]"
                >
                  Email address
                </label>

                <div className="flex items-center rounded-xl border border-gray-200 bg-[#fffdfd] transition focus-within:border-[#89505f] focus-within:ring-2 focus-within:ring-[#89505f]/10">
                  <Mail size={18} className="ml-4 shrink-0 text-gray-400" />

                  <input
                    id="email"
                    type="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full min-w-0 rounded-xl bg-transparent px-3 py-3.5 text-sm text-[#38232c] outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-[#38232c]"
                >
                  Password
                </label>

                <div className="flex items-center rounded-xl border border-gray-200 bg-[#fffdfd] transition focus-within:border-[#89505f] focus-within:ring-2 focus-within:ring-[#89505f]/10">
                  <LockKeyhole
                    size={18}
                    className="ml-4 shrink-0 text-gray-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full min-w-0 rounded-xl bg-transparent px-3 py-3.5 text-sm text-[#38232c] outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="mr-3 rounded-lg p-1.5 text-gray-400 transition hover:bg-[#f8eef1] hover:text-[#89505f]"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-[#89505f] px-5 py-3.5 text-sm font-medium text-white shadow-md shadow-[#89505f]/15 transition hover:bg-[#70404d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In to Dashboard"}
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-gray-400">
              Belleora Beauty Studio · Admin Access
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminLogin;
