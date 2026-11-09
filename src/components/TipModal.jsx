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
  const [errorMessage, setErrorMessage] = useState("");

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

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
      setErrorMessage("Não foi possível enviar agora. Confira sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setSuccess(false);
    setErrorMessage("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4" onMouseDown={(event) => event.target === event.currentTarget && handleClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="tip-modal-title" className="my-auto w-full max-w-2xl rounded-[28px] border border-white/10 bg-neutral-950 p-5 text-white shadow-2xl sm:p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-300">
              Tenho informação
            </p>
            <h2 id="tip-modal-title" className="mt-2 text-2xl font-black">Enviar informação sobre este caso</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Você pode enviar a informação de forma anônima ou identificada.
              O moderador terá acesso ao conteúdo para avaliar a veracidade.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Fechar janela"
            className="min-h-11 rounded-xl border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:bg-white/5"
          >
            Fechar
          </button>
        </div>

        {success ? (
          <div role="status" className="rounded-2xl border border-green-500/30 bg-green-500/10 p-5 text-green-100">
            <p className="font-bold">Informação enviada com sucesso.</p>
            <p className="mt-2 text-sm leading-6 text-green-100/80">Obrigado por ajudar. A equipe responsável poderá verificar o que você enviou.</p>
            <button type="button" onClick={handleClose} className="mt-4 min-h-11 rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-500">
              Concluir
            </button>
          </div>
        ) : (

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="mb-3 text-sm font-semibold text-white">Como deseja enviar?</p>
            <p className="mb-3 text-sm leading-6 text-zinc-400">Anônimo: seu nome e contato não são solicitados. Identificado: você pode deixar um contato para a equipe.</p>
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
                type="text"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
                placeholder="Seu nome"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
              />

              <input
                type="tel"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
                placeholder="Seu telefone"
                value={reporterPhone}
                onChange={(e) => setReporterPhone(e.target.value)}
              />

              <input
                type="email"
                className="sm:col-span-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
                placeholder="Seu e-mail"
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
              />
            </div>
          )}

          <textarea
            aria-label="Descreva a informação sobre o caso"
            className="min-h-[160px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
            placeholder="Descreva a informação que você tem sobre este caso..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          {errorMessage && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{errorMessage}</p>}

          <button
            type="submit"
            disabled={loading}
            className="min-h-12 w-full rounded-2xl bg-green-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-500 disabled:cursor-wait disabled:opacity-70"
          >
            {loading ? "Enviando..." : "Enviar informação"}
          </button>
        </form>
        )}
      </div>
    </div>
  );
}