import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import api from "../services/api";

function resolveImageUrl(imageUrl) {
  if (!imageUrl) return "";

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  return `${import.meta.env.VITE_API_URL}/${imageUrl}`.replace(/([^:]\/)\/+/g, "$1");
}

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

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 px-6 py-20 text-center text-white">
        Carregando publicação...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-neutral-950 px-6 py-20 text-center text-white">
        <h1 className="text-3xl font-black">Publicação não encontrada</h1>
        <p className="mt-3 text-zinc-400">
          Esta publicação não está disponível ou pode ter sido removida.
        </p>
        <Link
          to="/informacoes"
          className="mt-6 inline-flex rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold transition hover:bg-red-500"
        >
          Voltar para informações
        </Link>
      </div>
    );
  }

  const publicUrl = `https://www.redealerta.ong.br/informacoes/${post.slug}`;
  const shareLink = `${import.meta.env.VITE_API_URL}/share/news/${post.slug}`;

  const pageTitle = `${post.title} | Rede Alerta`;
  const pageDescription =
    post.summary ||
    (post.content ? post.content.slice(0, 160) : "Conteúdo público do Rede Alerta.");

  const resolvedCoverImage = resolveImageUrl(post.cover_image_url);
  const pageImage = resolvedCoverImage || "https://www.redealerta.ong.br/og-default.jpg";

  function shareWhatsApp() {
    const url = encodeURIComponent(shareLink);
    const text = encodeURIComponent(`Veja esta publicação do Rede Alerta: ${post?.title || ""}`);
    window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, "_blank");
  }

  function shareFacebook() {
    const url = encodeURIComponent(shareLink);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
  }

  async function shareCopy() {
    try {
      await navigator.clipboard.writeText(shareLink);
      alert("Link de compartilhamento copiado com sucesso.");
    } catch (error) {
      console.error("Erro ao copiar link:", error);
      alert("Não foi possível copiar o link.");
    }
  }

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={publicUrl} />

        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:image:secure_url" content={pageImage} />
        <meta property="og:image:alt" content={post.title} />
        <meta property="og:url" content={publicUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Rede Alerta" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
      </Helmet>

      <div className="min-h-screen bg-neutral-950 text-white">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            to="/informacoes"
            className="inline-flex rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold transition hover:bg-white/[0.08]"
          >
            Voltar para informações
          </Link>

          <article className="mt-8 overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03]">
            {post.cover_image_url && (
              <img
                src={resolvedCoverImage}
                alt={post.title}
                className="h-[320px] w-full object-cover"
              />
            )}

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-red-300">
                  {post.category || "Informações"}
                </span>
                <span>
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString("pt-BR")
                    : "Sem data"}
                </span>
              </div>

              <h1 className="mt-5 text-4xl font-black">{post.title}</h1>

              {post.summary && (
                <p className="mt-4 text-lg leading-8 text-zinc-300">{post.summary}</p>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={shareWhatsApp}
                  className="rounded-2xl bg-green-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-500"
                >
                  Compartilhar no WhatsApp
                </button>

                <button
                  onClick={shareFacebook}
                  className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
                >
                  Compartilhar no Facebook
                </button>

                <button
                  onClick={shareCopy}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold transition hover:bg-white/[0.08]"
                >
                  Copiar link
                </button>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                  Link de compartilhamento
                </p>
                <p className="mt-2 break-all text-sm text-zinc-300">{shareLink}</p>
              </div>

              <div className="prose prose-invert mt-8 max-w-none whitespace-pre-line">
                {post.content}
              </div>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}