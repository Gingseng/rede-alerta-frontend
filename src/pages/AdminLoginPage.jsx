import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      localStorage.setItem("admin_token", response.data.access_token);
      navigate("/colaborador");
    } catch (error) {
      alert("Login inválido");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 p-6 text-white">
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-xl shadow-black/20">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-300">
            Área administrativa
          </p>
          <h1 className="mt-2 text-3xl font-black">Entrar no painel</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Use seu acesso administrativo para moderar os casos enviados.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-zinc-500"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-zinc-500"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full rounded-2xl bg-red-600 py-3 font-bold text-white transition hover:bg-red-500"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}