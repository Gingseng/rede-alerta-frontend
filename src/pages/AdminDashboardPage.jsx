import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function AdminDashboardPage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }

    loadPendingCases();
  }, []);

  async function loadPendingCases() {
    try {
      setLoading(true);

      const response = await api.get("/admin/pending", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCases(response.data);
    } catch (error) {
      console.error(error);
      alert("Sessão inválida ou expirada");
      localStorage.removeItem("admin_token");
      navigate("/admin/login");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(caseId, action) {
    try {
      setActionLoading(`${caseId}-${action}`);

      await api.patch(
        `/admin/${caseId}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await loadPendingCases();
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar o caso");
    } finally {
      setActionLoading(null);
    }
  }

  function logout() {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.18),transparent_28%),linear-gradient(to_bottom,rgba(127,29,29,0.12),transparent)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-300">
                Painel administrativo
              </p>
              <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                Casos pendentes
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                Revise os cadastros enviados antes de publicar no site. Aqui você
                pode validar as informações, conferir contato, B.O. e decidir o
                status de cada caso.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/admin/informacoes"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-semibold transition hover:bg-white/10"
              >
                Ver informações recebidas
              </Link>

              <button
                onClick={logout}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold transition hover:bg-white/10"
              >
                Sair
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                Status atual
              </p>
              <p className="mt-2 text-2xl font-black text-white">
                {loading ? "..." : cases.length}
              </p>
              <p className="mt-1 text-sm text-zinc-400">casos pendentes de moderação</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                Fluxo
              </p>
              <p className="mt-2 text-base font-bold text-white">Publicar, rejeitar ou encerrar</p>
              <p className="mt-1 text-sm text-zinc-400">
                Marcar como encontrado também tira o caso do ar.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                Observação
              </p>
              <p className="mt-2 text-base font-bold text-white">Valide antes de publicar</p>
              <p className="mt-1 text-sm text-zinc-400">
                Confira descrição, contato e dados do desaparecimento.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center text-zinc-400">
            Carregando casos...
          </div>
        )}

        {!loading && cases.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center text-zinc-400">
            Nenhum caso pendente.
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-2">
          {cases.map((person) => (
            <article
              key={person.id}
              className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] shadow-xl shadow-black/20"
            >
              <div className="grid lg:grid-cols-[260px_1fr]">
                <div className="h-72 bg-neutral-900 lg:h-full">
                  {person.photo_url ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}${person.photo_url}`}
                      alt={person.full_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-zinc-500">
                      Sem foto
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="mb-2 inline-flex rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-yellow-300">
                        Pendente
                      </div>
                      <h2 className="text-2xl font-black text-white">
                        {person.full_name}
                      </h2>
                      <p className="mt-2 text-sm text-zinc-400">
                        {person.age} anos • {person.city}/{person.state}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-red-300">
                        Desaparecimento
                      </p>
                      <p className="mt-1 text-sm font-bold text-red-100">
                        {person.missing_date}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                        Responsável
                      </p>
                      <p className="mt-2 text-sm text-zinc-300">
                        {person.contact_name || "Não informado"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                        Telefone
                      </p>
                      <p className="mt-2 text-sm text-zinc-300">
                        {person.contact_phone || "Não informado"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:col-span-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                        Número do B.O.
                      </p>
                      <p className="mt-2 text-sm text-zinc-300">
                        {person.police_report_number || "Não informado"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                        Última roupa vista
                      </p>
                      <p className="mt-2 text-sm leading-6 text-zinc-300">
                        {person.last_seen_clothes || "Não informado."}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                        Características físicas
                      </p>
                      <p className="mt-2 text-sm leading-6 text-zinc-300">
                        {person.physical_traits || "Não informado."}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                        Descrição do caso
                      </p>
                      <p className="mt-2 text-sm leading-6 text-zinc-300">
                        {person.case_description || "Sem descrição informada."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <button
                      onClick={() => updateStatus(person.id, "publish")}
                      disabled={actionLoading === `${person.id}-publish`}
                      className="rounded-2xl bg-green-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-500 disabled:opacity-70"
                    >
                      {actionLoading === `${person.id}-publish` ? "Publicando..." : "Publicar"}
                    </button>

                    <button
                      onClick={() => updateStatus(person.id, "reject")}
                      disabled={actionLoading === `${person.id}-reject`}
                      className="rounded-2xl bg-zinc-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-zinc-600 disabled:opacity-70"
                    >
                      {actionLoading === `${person.id}-reject` ? "Rejeitando..." : "Rejeitar"}
                    </button>

                    <button
                      onClick={() => updateStatus(person.id, "found")}
                      disabled={actionLoading === `${person.id}-found`}
                      className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-500 disabled:opacity-70"
                    >
                      {actionLoading === `${person.id}-found` ? "Encerrando..." : "Encontrado"}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}