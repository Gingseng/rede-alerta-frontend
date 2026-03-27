import { useState } from "react";
import api from "../services/api";

export default function TipModal({ caseId, open, onClose }) {
  const [isAnonymous, setIsAnonymous] = useState("sim");
  const [reporterName, setReporterName] = useState("");
  const [reporterPhone, setReporterPhone] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/tips/", {
        case_id: caseId,
        is_anonymous: isAnonymous,
        reporter_name: isAnonymous === "nao" ? reporterName : null,
        reporter_phone: isAnonymous === "nao" ? reporterPhone : null,
        reporter_email: isAnonymous === "nao" ? reporterEmail : null,
        message,
      });

      setSuccess(true);
      setMessage("");
      setReporterName("");
      setReporterPhone("");
      setReporterEmail("");
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar informação.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-neutral-950 p-6 text-white shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-300">
              Tenho informação
            </p>
            <h2 className="mt-2 text-2xl font-black">Enviar informação sobre este caso</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Você pode enviar a informação de forma anônima ou identificada.
              O moderador terá acesso ao conteúdo para avaliar a veracidade.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:bg-white/5"
          >
            Fechar
          </button>
        </div>

        {success && (
          <div className="mb-4 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-green-100">
            Informação enviada com sucesso.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="mb-3 text-sm font-semibold text-white">Como deseja enviar?</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="radio"
                  name="anonymous"
                  checked={isAnonymous === "sim"}
                  onChange={() => setIsAnonymous("sim")}
                />
                Anônimo
              </label>

              <label className="flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="radio"
                  name="anonymous"
                  checked={isAnonymous === "nao"}
                  onChange={() => setIsAnonymous("nao")}
                />
                Identificado
              </label>
            </div>
          </div>

          {isAnonymous === "nao" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
                placeholder="Seu nome"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
              />

              <input
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
                placeholder="Seu telefone"
                value={reporterPhone}
                onChange={(e) => setReporterPhone(e.target.value)}
              />

              <input
                className="sm:col-span-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
                placeholder="Seu e-mail"
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
              />
            </div>
          )}

          <textarea
            className="min-h-[160px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
            placeholder="Descreva a informação que você tem sobre este caso..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full rounded-2xl bg-green-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-500"
          >
            {loading ? "Enviando..." : "Enviar informação"}
          </button>
        </form>
      </div>
    </div>
  );
}