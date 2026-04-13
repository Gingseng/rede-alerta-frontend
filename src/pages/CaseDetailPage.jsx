import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import TipModal from "../components/TipModal";

function resolveImageUrl(imageUrl) {
  if (!imageUrl) return "";

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  return `${import.meta.env.VITE_API_URL}/${imageUrl}`.replace(/([^:]\/)\/+/g, "$1");
}

export default function CaseDetailPage() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tipOpen, setTipOpen] = useState(false);

  useEffect(() => {
    loadCase();
  }, [id]);

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

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copiado para a área de transferência.");
    } catch (error) {
      console.error(error);
      alert("Não foi possível copiar o link.");
    }
  }

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: person?.full_name || "Caso Rede Alerta",
          text: "Ajude a compartilhar este caso no Rede Alerta.",
          url: window.location.href,
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      handleCopyLink();
    }
  }

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
        <Link
          to="/"
          className="mt-6 inline-flex rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold transition hover:bg-red-500"
        >
          Voltar para a home
        </Link>
      </div>
    );
  }

  const pageUrl = window.location.href;
  const shareText = encodeURIComponent(`Ajude a compartilhar este caso: ${person.full_name}`);
  const encodedUrl = encodeURIComponent(pageUrl);
  const whatsappUrl = `https://wa.me/?text=${shareText}%20${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/dialog/share?app_id=145634995501895&display=popup&href=${encodedUrl}`;

  return (
    <>
      <TipModal open={tipOpen} caseId={person.id} onClose={() => setTipOpen(false)} />

      <div className="min-h-screen bg-neutral-950 text-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.06]"
          >
            ← Voltar
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[420px_1fr]">
            <div className="overflow-hidden rounded-[32px] border border-white/10 bg-neutral-900">
              {person.photo_url ? (
                <img
                  src={resolveImageUrl(person.photo_url)}
                  alt={person.full_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex min-h-[520px] items-center justify-center text-zinc-500">
                  Sem foto
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <span className="inline-flex rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-300">
                  Caso publicado
                </span>

                <h1 className="mt-4 text-4xl font-black">{person.full_name}</h1>

                <p className="mt-3 text-lg text-zinc-300">
                  {person.age} anos • {person.city}/{person.state}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                    Data do desaparecimento
                  </p>
                  <p className="mt-2 text-base text-zinc-200">{person.missing_date}</p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                    Status
                  </p>
                  <p className="mt-2 text-base capitalize text-zinc-200">{person.status}</p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                    Última roupa vista
                  </p>
                  <p className="mt-2 text-base text-zinc-200">
                    {person.last_seen_clothes || "Não informado."}
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                    Características físicas
                  </p>
                  <p className="mt-2 text-base text-zinc-200">
                    {person.physical_traits || "Não informado."}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                  Descrição do caso
                </p>
                <p className="mt-3 text-base leading-7 text-zinc-200">
                  {person.case_description || "Não informado."}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                  Contato do responsável
                </p>
                <p className="mt-3 text-base font-semibold text-white">{person.contact_name}</p>
                <p className="mt-1 text-base text-zinc-300">{person.contact_phone}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setTipOpen(true)}
                  className="rounded-2xl bg-green-600 px-5 py-3 text-sm font-bold transition hover:bg-green-500"
                >
                  Tenho informação
                </button>

                <button
                  onClick={handleCopyLink}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold transition hover:bg-white/[0.08]"
                >
                  Copiar link
                </button>

                <button
                  onClick={handleNativeShare}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold transition hover:bg-white/[0.08]"
                >
                  Compartilhar caso
                </button>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-sm font-semibold text-white">
                  Compartilhe este link em outros sites, grupos e redes sociais para ampliar o alcance.
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl bg-green-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-500"
                  >
                    WhatsApp
                  </a>

                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
                  >
                    Facebook
                  </a>

                  <button
                    onClick={handleCopyLink}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold transition hover:bg-white/[0.08]"
                  >
                    Instagram / copiar
                  </button>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                    Link para incorporar ou divulgar
                  </p>
                  <p className="mt-2 break-all text-sm text-zinc-300">{pageUrl}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}