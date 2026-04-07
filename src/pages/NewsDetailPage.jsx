import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

export default function NewsDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadPost() {
    try {
      const response = await api.get(`/news/public/${slug}`);
      setPost(response.data);
    } catch (error) {
      console.error("Erro ao carregar notícia:", error);
      setPost(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPost();
  }, [slug]);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Rede Alerta`;

      let metaDescription = document.querySelector('meta[name="description"]');

      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        document.head.appendChild(metaDescription);
      }

      metaDescription.setAttribute(
        "content",
        post.summary || "Conteúdo público do Rede Alerta."
      );
    }
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 px-4 py-10 text-white">
        <div className="mx-auto max-w-4xl text-sm text-zinc-400">
          Carregando publicação...
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-neutral-950 px-4 py-10 text-white">
        <div className="mx-auto max-w-4xl rounded-[28px] border border-white/10 bg-white/[0.03] p-8">
          <h1 className="text-2xl font-black text-white">
            Publicação não encontrada
          </h1>
          <p className="mt-3 text-sm leading-7 text-zinc-400">
            Esta publicação não está disponível ou pode ter sido removida.
          </p>
          <Link
            to="/informacoes"
            className="mt-6 inline-flex rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-700/30 transition hover:bg-red-500"
          >
            Voltar para informações
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/informacoes"
            className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-300 transition hover:border-red-500/30 hover:bg-red-500/10"
          >
            Voltar para informações
          </Link>
        </div>

        {post.cover_image_url && (
          <div className="mb-8 overflow-hidden rounded-[30px] border border-white/10">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="h-[320px] w-full object-cover sm:h-[420px]"
            />
          </div>
        )}

        <div className="mb-4 flex flex-wrap gap-3">
          <span className="inline-flex rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-300">
            {post.category || "Informações"}
          </span>

          <span className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
            {post.published_at
              ? new Date(post.published_at).toLocaleDateString("pt-BR")
              : "Sem data"}
          </span>
        </div>

        <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl">
          {post.title}
        </h1>

        {post.summary && (
          <p className="mt-5 text-lg leading-8 text-zinc-300">{post.summary}</p>
        )}

        <div className="mt-10 rounded-[28px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <div className="whitespace-pre-line text-sm leading-8 text-zinc-300 sm:text-base">
            {post.content}
          </div>
        </div>
      </article>
    </div>
  );
}