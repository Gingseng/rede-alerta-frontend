import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const initialForm = {
  title: "",
  summary: "",
  content: "",
  cover_image_url: "",
  category: "",
  status: "rascunho",
};

export default function AdminNewsEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  async function loadPost() {
    try {
      const token = localStorage.getItem("admin_token");

      const response = await api.get("/news/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const post = response.data.find((item) => String(item.id) === String(id));

      if (!post) {
        alert("Notícia não encontrada.");
        navigate("/colaborador/noticias");
        return;
      }

      setForm({
        title: post.title || "",
        summary: post.summary || "",
        content: post.content || "",
        cover_image_url: post.cover_image_url || "",
        category: post.category || "",
        status: post.status || "rascunho",
      });
    } catch (error) {
      console.error("Erro ao carregar notícia:", error);
      if (error.response?.status === 401) {
        navigate("/colaborador/login");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("admin_token");

      if (isEditing) {
        await api.put(`/news/admin/${id}`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await api.post("/news/admin", form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      navigate("/colaborador/noticias");
    } catch (error) {
      console.error("Erro ao salvar notícia:", error);
      alert("Não foi possível salvar a notícia.");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    document.title = isEditing
      ? "Editar Notícia | Rede Alerta"
      : "Nova Notícia | Rede Alerta";

    if (isEditing) {
      loadPost();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 px-4 py-10 text-white">
        <div className="mx-auto max-w-4xl text-sm text-zinc-400">
          Carregando notícia...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
              Colaborador
            </p>
            <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
              {isEditing ? "Editar postagem" : "Nova postagem"}
            </h1>
            <p className="mt-3 text-sm leading-7 text-zinc-400 sm:text-base">
              Preencha as informações da notícia para publicar na área pública.
            </p>
          </div>

          <Link
            to="/colaborador/noticias"
            className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:border-white/30 hover:bg-white/5"
          >
            Voltar
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-[30px] border border-white/10 bg-white/[0.03] p-6 sm:p-8"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Título
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-white outline-none transition focus:border-red-500/40"
              placeholder="Digite o título da notícia"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Resumo
            </label>
            <textarea
              name="summary"
              value={form.summary}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-white outline-none transition focus:border-red-500/40"
              placeholder="Resumo curto para exibir na listagem"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Conteúdo
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={12}
              required
              className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-white outline-none transition focus:border-red-500/40"
              placeholder="Escreva o conteúdo completo da notícia"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-white">
                URL da imagem de capa
              </label>
              <input
                type="text"
                name="cover_image_url"
                value={form.cover_image_url}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-white outline-none transition focus:border-red-500/40"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-white">
                Categoria
              </label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-white outline-none transition focus:border-red-500/40"
                placeholder="Ex: Orientações, Notícias, Atualizações"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-white outline-none transition focus:border-red-500/40"
            >
              <option value="rascunho">Rascunho</option>
              <option value="publicado">Publicado</option>
            </select>
          </div>

          {form.cover_image_url && (
            <div>
              <p className="mb-3 text-sm font-semibold text-white">
                Prévia da capa
              </p>
              <div className="overflow-hidden rounded-[24px] border border-white/10 bg-neutral-900">
                <img
                  src={form.cover_image_url}
                  alt="Prévia da capa"
                  className="h-64 w-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-700/30 transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Salvando..."
                : isEditing
                ? "Salvar alterações"
                : "Criar postagem"}
            </button>

            <Link
              to="/colaborador/noticias"
              className="rounded-2xl border border-white/15 px-6 py-3 text-center text-sm font-semibold text-zinc-100 transition hover:border-white/30 hover:bg-white/5"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}