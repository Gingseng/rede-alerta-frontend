import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminTipsPage() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }

    loadTips();
  }, []);

  async function loadTips() {
    try {
      const response = await api.get("/tips/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTips(response.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar informações");
      localStorage.removeItem("admin_token");
      navigate("/admin/login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-300">
            Painel administrativo
          </p>
          <h1 className="mt-2 text-3xl font-black">Informações recebidas</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Aqui o moderador vê tudo que chegou, inclusive denúncias anônimas e identificadas.
          </p>
        </div>

        {loading && <p className="text-zinc-400">Carregando...</p>}

        {!loading && tips.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center text-zinc-400">
            Nenhuma informação recebida ainda.
          </div>
        )}

        <div className="space-y-4">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-white">Caso #{tip.case_id}</p>
                  <p className="mt-1 text-sm text-zinc-400">
                    Tipo: {tip.is_anonymous === "sim" ? "Anônimo" : "Identificado"}
                  </p>
                </div>

                <div className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-300">
                  {tip.status}
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm leading-7 text-zinc-300">{tip.message}</p>
              </div>

              {tip.is_anonymous !== "sim" && (
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-red-300">Nome</p>
                    <p className="mt-2 text-sm text-zinc-300">{tip.reporter_name || "-"}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-red-300">Telefone</p>
                    <p className="mt-2 text-sm text-zinc-300">{tip.reporter_phone || "-"}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-red-300">E-mail</p>
                    <p className="mt-2 text-sm text-zinc-300">{tip.reporter_email || "-"}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}