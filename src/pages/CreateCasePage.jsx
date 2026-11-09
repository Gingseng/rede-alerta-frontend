import { useMemo, useState } from "react";
import api from "../services/api";

const initialForm = {
  full_name: "",
  age: "",
  city: "",
  state: "",
  missing_date: "",
  last_seen_clothes: "",
  physical_traits: "",
  case_description: "",
  police_report_number: "",
  contact_name: "",
  contact_phone: "",
};

function FieldLabel({ htmlFor, children, required = false }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-zinc-200">
      {children}
      {required && <span className="ml-1 text-red-400">*</span>}
    </label>
  );
}

function FieldTip({ children }) {
  return <p className="mt-2 text-sm leading-6 text-zinc-400">Dica: {children}</p>;
}

function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-red-500/40 focus:bg-white/[0.07] ${className}`}
    />
  );
}

function Textarea({ className = "", ...props }) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-red-500/40 focus:bg-white/[0.07] ${className}`}
    />
  );
}

function SectionCard({ title, description, children }) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-black text-white">{title}</h2>
        {description && (
          <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export default function CreateCasePage() {
  const [form, setForm] = useState(initialForm);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [submissionError, setSubmissionError] = useState("");

  const photoPreview = useMemo(() => {
    if (!photo) return null;
    return URL.createObjectURL(photo);
  }, [photo]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0] || null;
    setPhoto(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setSubmission(null);
    setSubmissionError("");

    try {
      const formData = new FormData();

      formData.append("full_name", form.full_name);
      formData.append("age", form.age);
      formData.append("city", form.city);
      formData.append("state", form.state);
      formData.append("missing_date", form.missing_date);
      formData.append("last_seen_clothes", form.last_seen_clothes);
      formData.append("physical_traits", form.physical_traits);
      formData.append("case_description", form.case_description);
      formData.append("police_report_number", form.police_report_number);
      formData.append("contact_name", form.contact_name);
      formData.append("contact_phone", form.contact_phone);

      if (photo) {
        formData.append("photo", photo);
      }

      const response = await api.post("/cases/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSubmission(response.data);
      setForm(initialForm);
      setPhoto(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error(error);
      setSubmissionError("Não foi possível enviar o cadastro. Confira sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.20),transparent_28%),linear-gradient(to_bottom,rgba(127,29,29,0.15),transparent)]">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
            Cadastro de caso
          </div>

          <h1 className="max-w-3xl text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
            Cadastre uma pessoa desaparecida
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300 sm:text-base">
            Conte o que aconteceu e preencha os campos com asterisco. A foto e a descrição são opcionais.
            Depois do envio, nossa equipe confere as informações antes de divulgar o caso.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-sm font-bold text-white">1. Informe os dados principais</p>
              <p className="mt-1 text-xs leading-5 text-zinc-400">
                  As dicas ao lado dos campos ajudam no preenchimento.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-sm font-bold text-white">2. Adicione uma foto, se tiver</p>
              <p className="mt-1 text-xs leading-5 text-zinc-400">
                  A foto é opcional, mas pode ajudar no reconhecimento.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-sm font-bold text-white">3. A equipe confere o cadastro</p>
              <p className="mt-1 text-xs leading-5 text-zinc-400">
                  As informações são verificadas antes de qualquer divulgação.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {submission && (
          <div role="status" className="mb-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-green-100">
            <p className="font-semibold">
              {submission.triage_status === "published_automatically"
                ? "Caso publicado automaticamente."
                : "Caso enviado para revisão segura."}
            </p>
            <p className="mt-1 text-sm text-green-200/90">
              {submission.triage_status === "published_automatically"
                ? "A publicação no site foi concluída. A divulgação em redes sociais depende da configuração administrativa."
                : "Encontramos pontos que precisam de conferência antes de qualquer divulgação pública."}
            </p>
            {submission.review_reasons?.length > 0 && (
              <p className="mt-2 text-sm text-green-200/90">
                Motivos: {submission.review_reasons.join(", ")}.
              </p>
            )}
          </div>
        )}

        {submissionError && (
          <div role="alert" className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm leading-6 text-red-100">
            {submissionError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <SectionCard
            title="Informações principais"
            description="Esses dados serão usados para identificar a pessoa desaparecida."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FieldLabel htmlFor="full_name" required>Nome completo</FieldLabel>
                <Input
                  id="full_name"
                  name="full_name"
                  required
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="Ex.: Maria Aparecida da Silva"
                />
                <FieldTip>Use o nome completo como aparece nos documentos.</FieldTip>
              </div>

              <div>
                <FieldLabel htmlFor="age" required>Idade</FieldLabel>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  min="0"
                  required
                  value={form.age}
                  onChange={handleChange}
                  placeholder="Ex.: 16"
                />
              </div>

              <div>
                <FieldLabel htmlFor="missing_date" required>Data do desaparecimento</FieldLabel>
                <Input
                  id="missing_date"
                  name="missing_date"
                  type="date"
                  required
                  value={form.missing_date}
                  onChange={handleChange}
                />
                <FieldTip>Selecione no calendário a data em que a pessoa foi vista pela última vez.</FieldTip>
              </div>

              <div>
                <FieldLabel htmlFor="city" required>Cidade</FieldLabel>
                <Input
                  id="city"
                  name="city"
                  required
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Ex.: Três Lagoas"
                />
              </div>

              <div>
                <FieldLabel htmlFor="state" required>Estado (UF)</FieldLabel>
                <Input
                  id="state"
                  name="state"
                  required
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Ex.: MS"
                  maxLength={2}
                />
                <FieldTip>Informe a sigla de duas letras do estado, como MS ou SP.</FieldTip>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Descrição para identificação"
            description="Quanto mais claro estiver, maior a chance de ajudar quem ver o caso."
          >
            <div className="grid gap-4">
              <div>
                <FieldLabel htmlFor="last_seen_clothes">Última roupa vista (opcional)</FieldLabel>
                <Textarea
                  id="last_seen_clothes"
                  name="last_seen_clothes"
                  value={form.last_seen_clothes}
                  onChange={handleChange}
                  placeholder="Ex.: camiseta azul, calça jeans e tênis branco"
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <FieldLabel htmlFor="physical_traits">Características físicas (opcional)</FieldLabel>
                <Textarea
                  id="physical_traits"
                  name="physical_traits"
                  value={form.physical_traits}
                  onChange={handleChange}
                  placeholder="Ex.: cabelos castanhos, 1,60m, tatuagem no braço direito..."
                  className="min-h-[110px]"
                />
              </div>

              <div>
                <FieldLabel htmlFor="case_description">Descrição do caso (opcional)</FieldLabel>
                <Textarea
                  id="case_description"
                  name="case_description"
                  value={form.case_description}
                  onChange={handleChange}
                  placeholder="Conte o contexto do desaparecimento, último local visto e outras informações úteis."
                  className="min-h-[140px]"
                />
                <FieldTip>Conte apenas o que foi confirmado. Você pode deixar este campo em branco.</FieldTip>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Foto da pessoa desaparecida"
            description="Opcional. Uma foto recente e nítida ajuda outras pessoas a reconhecerem quem está sendo procurado."
          >
            <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
              <div>
                <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-4">
                  <FieldLabel htmlFor="photo">Escolher uma foto</FieldLabel>
                  <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-zinc-300 file:mr-4 file:rounded-xl file:border-0 file:bg-red-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-red-500"
                  />
                  <p className="mt-3 text-xs leading-5 text-zinc-400">
                    No celular, escolha uma imagem da galeria ou tire uma foto. Não é preciso enviar para continuar.
                  </p>

                  {photo && (
                    <p className="mt-3 text-sm text-zinc-300">
                      Arquivo selecionado: <span className="font-medium">{photo.name}</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
                  <div className="flex h-[280px] items-center justify-center bg-neutral-900">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Pré-visualização"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="px-6 text-center text-sm text-zinc-500">
                        A pré-visualização da foto aparecerá aqui.
                      </div>
                    )}
                  </div>
                  <div className="border-t border-white/10 p-4 text-xs text-zinc-400">
                    Prévia da imagem enviada
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Validação e contato"
            description="Esses dados ajudam na moderação e no retorno ao responsável pelo cadastro."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FieldLabel htmlFor="police_report_number" required>Número do boletim de ocorrência (B.O.)</FieldLabel>
                <Input
                  id="police_report_number"
                  name="police_report_number"
                  required
                  value={form.police_report_number}
                  onChange={handleChange}
                  placeholder="Ex.: BO-123456"
                />
                <FieldTip>Esse número é informado pela autoridade policial após o registro.</FieldTip>
              </div>

              <div>
                <FieldLabel htmlFor="contact_name" required>Seu nome (responsável pelo cadastro)</FieldLabel>
                <Input
                  id="contact_name"
                  name="contact_name"
                  required
                  value={form.contact_name}
                  onChange={handleChange}
                  placeholder="Ex.: João da Silva"
                />
              </div>

              <div>
                <FieldLabel htmlFor="contact_phone" required>Seu telefone de contato</FieldLabel>
                <Input
                  id="contact_phone"
                  name="contact_phone"
                  type="tel"
                  required
                  value={form.contact_phone}
                  onChange={handleChange}
                  placeholder="Ex.: (67) 99999-9999"
                />
                <FieldTip>Usaremos este número para falar com você. Ele não será exibido publicamente.</FieldTip>
              </div>
            </div>
          </SectionCard>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-base font-bold text-white">Pronto para enviar?</p>
                <p className="mt-1 text-sm leading-6 text-zinc-400">
                  Confira os dados. Depois do envio, o caso passa por triagem antes da divulgação.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Enviando..." : "Cadastrar caso"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
