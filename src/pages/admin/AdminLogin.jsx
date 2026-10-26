
import { useState } from "react";
import { supabase } from "../../utils/supabase";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Email ou mot de passe incorrect.");
      return;
    }

    window.location.href = "/admin";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f1f3] px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
      >
        <h1 className="mb-2 text-2xl font-semibold text-[#89505f]">
          Admin Login
        </h1>

        <p className="mb-6 text-sm text-gray-500">
          Connectez-vous pour accéder au tableau de bord.
        </p>

        <label className="mb-2 block text-sm font-medium">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-lg border p-3 outline-none focus:border-[#89505f]"
          placeholder="admin@example.com"
        />

        <label className="mb-2 block text-sm font-medium">Mot de passe</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-lg border p-3 outline-none focus:border-[#89505f]"
          placeholder="Votre mot de passe"
        />

        {error && (
          <p className="mb-4 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#89505f] p-3 font-medium text-white hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
