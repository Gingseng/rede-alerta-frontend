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

function FieldLabel({ children, required = false }) {
  return (
    <label className="mb-2 block text-sm font-semibold text-zinc-200">
      {children}
      {required && <span className="ml-1 text-red-400">*</span>}
    </label>
  );
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
  const [success, setSuccess] = useState(false);

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
    setSuccess(false);

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

      await api.post("/cases/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(true);
      setForm(initialForm);
      setPhoto(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar caso.");
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
            Envie as informações do desaparecimento para análise e publicação.
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300 sm:text-base">
            Preencha os dados com atenção. Após o envio, o caso ficará pendente
            até ser revisado e aprovado para divulgação pública.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm font-bold text-white">1. Preencha o cadastro</p>
              <p className="mt-1 text-xs leading-5 text-zinc-400">
                Informe dados claros para facilitar a identificação.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm font-bold text-white">2. Envie a foto</p>
              <p className="mt-1 text-xs leading-5 text-zinc-400">
                Uma boa imagem ajuda na circulação e reconhecimento.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm font-bold text-white">3. Aguarde aprovação</p>
              <p className="mt-1 text-xs leading-5 text-zinc-400">
                A equipe revisa antes da publicação pública.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {success && (
          <div className="mb-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-green-100">
            <p className="font-semibold">Caso enviado com sucesso.</p>
            <p className="mt-1 text-sm text-green-200/90">
              O cadastro foi recebido e ficará aguardando aprovação antes de aparecer publicamente.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <SectionCard
            title="Informações principais"
            description="Esses dados serão usados para identificar a pessoa desaparecida."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FieldLabel required>Nome completo</FieldLabel>
                <Input
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="Ex.: Maria Aparecida da Silva"
                />
              </div>

              <div>
                <FieldLabel required>Idade</FieldLabel>
                <Input
                  name="age"
                  type="number"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="Ex.: 16"
                />
              </div>

              <div>
                <FieldLabel required>Data do desaparecimento</FieldLabel>
                <Input
                  name="missing_date"
                  type="date"
                  value={form.missing_date}
                  onChange={handleChange}
                />
              </div>

              <div>
                <FieldLabel required>Cidade</FieldLabel>
                <Input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Ex.: Três Lagoas"
                />
              </div>

              <div>
                <FieldLabel required>UF</FieldLabel>
                <Input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Ex.: MS"
                  maxLength={2}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Descrição para identificação"
            description="Quanto mais claro estiver, maior a chance de ajudar quem ver o caso."
          >
            <div className="grid gap-4">
              <div>
                <FieldLabel>Última roupa vista</FieldLabel>
                <Textarea
                  name="last_seen_clothes"
                  value={form.last_seen_clothes}
                  onChange={handleChange}
                  placeholder="Ex.: camiseta azul, calça jeans e tênis branco"
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <FieldLabel>Características físicas</FieldLabel>
                <Textarea
                  name="physical_traits"
                  value={form.physical_traits}
                  onChange={handleChange}
                  placeholder="Ex.: cabelos castanhos, 1,60m, tatuagem no braço direito..."
                  className="min-h-[110px]"
                />
              </div>

              <div>
                <FieldLabel>Descrição do caso</FieldLabel>
                <Textarea
                  name="case_description"
                  value={form.case_description}
                  onChange={handleChange}
                  placeholder="Conte o contexto do desaparecimento, último local visto e outras informações úteis."
                  className="min-h-[140px]"
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Foto da pessoa desaparecida"
            description="No celular, o seletor pode abrir a galeria, arquivos ou câmera, dependendo do aparelho."
          >
            <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
              <div>
                <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-4">
                  <FieldLabel>Selecionar arquivo</FieldLabel>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-zinc-300 file:mr-4 file:rounded-xl file:border-0 file:bg-red-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-red-500"
                  />
                  <p className="mt-3 text-xs leading-5 text-zinc-400">
                    Prefira uma foto nítida, frontal e recente.
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
                <FieldLabel required>Número do B.O.</FieldLabel>
                <Input
                  name="police_report_number"
                  value={form.police_report_number}
                  onChange={handleChange}
                  placeholder="Ex.: BO-123456"
                />
              </div>

              <div>
                <FieldLabel required>Nome do responsável</FieldLabel>
                <Input
                  name="contact_name"
                  value={form.contact_name}
                  onChange={handleChange}
                  placeholder="Ex.: João da Silva"
                />
              </div>

              <div>
                <FieldLabel required>Telefone de contato</FieldLabel>
                <Input
                  name="contact_phone"
                  value={form.contact_phone}
                  onChange={handleChange}
                  placeholder="Ex.: (67) 99999-9999"
                />
              </div>
            </div>
          </SectionCard>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-base font-bold text-white">Enviar caso para análise</p>
                <p className="mt-1 text-sm leading-6 text-zinc-400">
                  O caso será salvo como pendente até passar pela moderação.
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