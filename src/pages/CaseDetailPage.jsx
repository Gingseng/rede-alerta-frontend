import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import TipModal from "../components/TipModal";

function resolveImageUrl(imageUrl) {
  if (!imageUrl) return "";

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
  return `${apiBaseUrl}/${imageUrl}`.replace(/([^:]\/)\/+/g, "$1");
}

export default function CaseDetailPage() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tipOpen, setTipOpen] = useState(false);

  async function loadCase() {
    try {
      const response = await api.get(`/cases/${id}`);
      setPerson(response.data);
    } catch (error) {
      console.error("Erro ao carregar caso:", error);
      setPerson(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCase();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 px-6 py-20 text-center text-white">
        Carregando caso...
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen bg-neutral-950 px-6 py-20 text-center text-white">
        <h1 className="text-3xl font-black">Caso não encontrado</h1>
        <p className="mt-3 text-zinc-400">
          Este caso não está disponível ou pode ter sido removido.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold transition hover:bg-red-500"
        >
          Voltar para o início
        </Link>
      </div>
    );
  }

  const siteUrl = (import.meta.env.VITE_SITE_URL || "https://www.redealerta.ong.br").replace(/\/+$/, "");
  const publicUrl = `${siteUrl}/caso/${person.id}`;
  const shareUrl = `${siteUrl}/share/case/${person.id}`;

  const resolvedPhotoUrl = resolveImageUrl(person.photo_url);

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `Ajude a compartilhar este caso no Rede Alerta: ${shareUrl}`
  )}`;

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    shareUrl
  )}`;

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copiado para a área de transferência.");
    } catch (error) {
      console.error("Erro ao copiar link:", error);
      alert("Não foi possível copiar o link.");
    }
  }

  async function handleNativeShare() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Caso: ${person.full_name}`,
          text: "Ajude a compartilhar este caso no Rede Alerta.",
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      alert("Link copiado para a área de transferência.");
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  }

  return (
    <>
      <div className="min-h-screen bg-neutral-950 text-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold transition hover:bg-white/[0.08]"
          >
            Voltar
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[380px,1fr]">
            <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03]">
              {person.photo_url ? (
                <img
                  src={resolvedPhotoUrl}
                  alt={person.full_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex min-h-[420px] items-center justify-center px-6 text-center text-zinc-500">
                  Foto não disponível
                </div>
              )}
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-red-300">
                  Caso publicado
                </span>
                <span>{person.city} - {person.state}</span>
              </div>

              <h1 className="mt-5 text-4xl font-black">{person.full_name}</h1>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                    Idade
                  </p>
                  <p className="mt-2 text-zinc-200">{person.age || "Não informado"}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                    Data do desaparecimento
                  </p>
                  <p className="mt-2 text-zinc-200">
                    {person.missing_date
                      ? new Date(person.missing_date).toLocaleDateString("pt-BR")
                      : "Não informado"}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wide text-red-300">
                    Última roupa vista
                  </h2>
                  <p className="mt-2 whitespace-pre-line text-zinc-300">
                    {person.last_seen_clothes || "Não informado."}
                  </p>
                </div>

                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wide text-red-300">
                    Características físicas
                  </h2>
                  <p className="mt-2 whitespace-pre-line text-zinc-300">
                    {person.physical_traits || "Não informado."}
                  </p>
                </div>

                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wide text-red-300">
                    Descrição do caso
                  </h2>
                  <p className="mt-2 whitespace-pre-line text-zinc-300">
                    {person.case_description || "Não informado."}
                  </p>
                </div>

                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wide text-red-300">
                    Boletim de ocorrência
                  </h2>
                  <p className="mt-2 whitespace-pre-line text-zinc-300">
                    {person.police_report_number || "Não informado."}
                  </p>
                </div>

                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wide text-red-300">
                    Contato responsável
                  </h2>
                  <p className="mt-2 whitespace-pre-line text-zinc-300">
                    {person.contact_name || "Não informado."}
                  </p>
                  <p className="mt-1 whitespace-pre-line text-zinc-300">
                    {person.contact_phone || "Não informado."}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => setTipOpen(true)}
                  className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-500"
                >
                  Tenho informação
                </button>

                <button
                  onClick={handleNativeShare}
                  className="rounded-2xl bg-yellow-400 px-4 py-3 text-sm font-bold text-black transition hover:bg-yellow-300"
                >
                  Compartilhar caso
                </button>

                <button
                  onClick={handleCopyLink}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold transition hover:bg-white/[0.08]"
                >
                  Copiar link
                </button>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                  Link de compartilhamento
                </p>
                <p className="mt-2 break-all text-sm text-zinc-300">{shareUrl}</p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl bg-green-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-500"
                  >
                    Compartilhar no WhatsApp
                  </a>

                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
                  >
                    Compartilhar no Facebook
                  </a>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                  Link público da página
                </p>
                <p className="mt-2 break-all text-sm text-zinc-300">{publicUrl}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TipModal
        open={tipOpen}
        onClose={() => setTipOpen(false)}
        caseId={person.id}
      />
    </>
  );
}