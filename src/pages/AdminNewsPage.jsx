import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminNewsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function loadPosts() {
    try {
      const token = localStorage.getItem("admin_token");

      if (!token) {
        navigate("/colaborador/login", { replace: true });
        return;
      }

      const response = await api.get("/news/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erro ao carregar notícias:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("admin_token");
        navigate("/colaborador/login", { replace: true });
        return;
      }

      alert("Não foi possível carregar as notícias.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(postId) {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir esta notícia?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("admin_token");

      if (!token) {
        navigate("/colaborador/login", { replace: true });
        return;
      }

      await api.delete(`/news/admin/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Erro ao excluir notícia:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("admin_token");
        navigate("/colaborador/login", { replace: true });
        return;
      }

      alert("Não foi possível excluir a notícia.");
    }
  }

  useEffect(() => {
    document.title = "Administração de Notícias | Rede Alerta";
    loadPosts();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
              Colaborador
            </p>
            <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
              Notícias e Informações
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
              Gerencie as postagens públicas da área de informações do Rede
              Alerta.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/colaborador"
              className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:border-white/30 hover:bg-white/5"
            >
              Voltar ao painel
            </Link>

            <Link
              to="/colaborador/noticias/nova"
              className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-700/30 transition hover:bg-red-500"
            >
              Nova postagem
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]">
          {loading ? (
            <div className="p-6 text-sm text-zinc-400">Carregando notícias...</div>
          ) : posts.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-lg font-semibold text-white">
                Nenhuma notícia cadastrada ainda.
              </p>
              <p className="mt-2 text-sm text-zinc-400">
                Crie a primeira postagem para começar a alimentar a área pública.
              </p>

              <Link
                to="/colaborador/noticias/nova"
                className="mt-5 inline-flex rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-700/30 transition hover:bg-red-500"
              >
                Criar primeira postagem
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="border-b border-white/10 bg-white/[0.03]">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      Título
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      Categoria
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      Status
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      Publicação
                    </th>
                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {posts.map((post) => (
                    <tr
                      key={post.id}
                      className="border-b border-white/5 transition hover:bg-white/[0.03]"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-semibold text-white">{post.title}</p>
                          <p className="mt-1 text-xs text-zinc-500">
                            /informacoes/{post.slug}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-zinc-300">
                        {post.category || "Sem categoria"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                            post.status === "publicado"
                              ? "bg-green-500/10 text-green-300"
                              : "bg-amber-500/10 text-amber-300"
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-zinc-400">
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString("pt-BR")
                          : "Não publicada"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/colaborador/noticias/${post.id}/editar`}
                            className="rounded-xl border border-white/15 px-4 py-2 text-xs font-semibold text-zinc-100 transition hover:border-white/30 hover:bg-white/5"
                          >
                            Editar
                          </Link>

                          <button
                            onClick={() => handleDelete(post.id)}
                            className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-500"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}