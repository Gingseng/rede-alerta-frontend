import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import TipModal from "../components/TipModal";

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
      <div className="min-h-screen bg-neutral-950 p-6 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="text-zinc-400">Carregando caso...</p>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen bg-neutral-950 p-6 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-black">Caso não encontrado</h1>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white"
          >
            Voltar para a home
          </Link>
        </div>
      </div>
    );
  }

  const pageUrl = window.location.href;
  const shareText = encodeURIComponent(`Ajude a compartilhar este caso: ${person.full_name}`);
  const encodedUrl = encodeURIComponent(pageUrl);

  const whatsappUrl = `https://wa.me/?text=${shareText}%20${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/dialog/share?app_id=145634995501895&display=popup&href=${encodedUrl}`;

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <TipModal caseId={person.id} open={tipOpen} onClose={() => setTipOpen(false)} />

      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.18),transparent_28%),linear-gradient(to_bottom,rgba(127,29,29,0.12),transparent)]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="mb-6 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/10"
          >
            ← Voltar
          </Link>

          <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
            <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03]">
              <div className="h-[420px] bg-neutral-900">
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
            </div>

            <div>
              <div className="mb-4 inline-flex rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Caso publicado
              </div>

              <h1 className="text-4xl font-black leading-tight">
                {person.full_name}
              </h1>

              <p className="mt-3 text-lg text-zinc-300">
                {person.age} anos • {person.city}/{person.state}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                    Data do desaparecimento
                  </p>
                  <p className="mt-2 text-base font-semibold text-white">
                    {person.missing_date}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                    Status
                  </p>
                  <p className="mt-2 text-base font-semibold text-white capitalize">
                    {person.status}
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-5">
                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-sm font-bold text-white">Última roupa vista</p>
                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    {person.last_seen_clothes || "Não informado."}
                  </p>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-sm font-bold text-white">Características físicas</p>
                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    {person.physical_traits || "Não informado."}
                  </p>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-sm font-bold text-white">Descrição do caso</p>
                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    {person.case_description || "Não informado."}
                  </p>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-sm font-bold text-white">Contato do responsável</p>
                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    {person.contact_name}
                  </p>
                  <p className="mt-1 text-sm leading-7 text-zinc-300">
                    {person.contact_phone}
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => setTipOpen(true)}
                  className="rounded-2xl bg-green-600 px-5 py-3 text-sm font-bold transition hover:bg-green-500"
                >
                  Tenho informação
                </button>

                <button
                  onClick={handleCopyLink}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold transition hover:bg-white/10"
                >
                  Copiar link
                </button>
              </div>

              <div className="mt-4 rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm font-bold text-white">Compartilhar caso</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Compartilhe este link em outros sites, grupos e redes sociais para ampliar o alcance.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <button
                    onClick={handleNativeShare}
                    className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-neutral-950 transition hover:opacity-90"
                  >
                    Compartilhar
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl bg-green-600 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-green-500"
                  >
                    WhatsApp
                  </a>

                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl bg-blue-600 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-500"
                  >
                    Facebook
                  </a>

                  <button
                    onClick={handleCopyLink}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    Instagram / copiar
                  </button>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                    Link para incorporar ou divulgar
                  </p>
                  <p className="mt-2 break-all text-sm text-zinc-300">
                    {pageUrl}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}