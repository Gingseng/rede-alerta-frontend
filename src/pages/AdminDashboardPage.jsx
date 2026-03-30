import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toPng } from "html-to-image";
import api from "../services/api";

const menuItems = [
  { id: "overview", label: "Visão geral" },
  { id: "cases", label: "Casos" },
  { id: "instagram", label: "Postagens Instagram" },
];

const statusOptions = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Pendentes" },
  { value: "published", label: "Publicados" },
  { value: "found", label: "Encontrados" },
  { value: "rejected", label: "Rejeitados" },
];

const presetOptions = [
  { value: "feed", label: "Feed 1080x1080" },
  { value: "story", label: "Story 1080x1920" },
  { value: "portrait", label: "Feed retrato 1080x1350" },
  { value: "urgent", label: "Urgente" },
  { value: "found", label: "Caso encontrado" },
];

function formatDate(value) {
  if (!value) return "Não informado";
  return value;
}

function normalizeStatus(person) {
  const raw =
    person?.status ||
    person?.case_status ||
    person?.situation ||
    person?.state_case ||
    "";

  const value = String(raw).toLowerCase();

  if (["pending", "pendente", "aguardando"].includes(value)) return "pending";
  if (["published", "publicado", "ativo", "approved"].includes(value)) return "published";
  if (["found", "encontrado", "resolved", "encerrado"].includes(value)) return "found";
  if (["rejected", "rejeitado", "recusado"].includes(value)) return "rejected";

  if (raw) return value;
  return "pending";
}

function buildInstagramCaption(person, preset) {
  if (!person) return "";

  if (preset === "found") {
    return `✅ ATUALIZAÇÃO DE CASO

${person.full_name || "Nome não informado"} foi localizado(a).

Agradecemos a todos que compartilharam e ajudaram a ampliar o alcance deste caso.

#RedeAlerta #CasoEncerrado #InformaçãoImporta`;
  }

  const urgencyLine =
    preset === "urgent"
      ? "⚠️ DIVULGAÇÃO URGENTE\n\n"
      : "🚨 PESSOA DESAPARECIDA\n\n";

  return `${urgencyLine}${person.full_name || "Nome não informado"}, ${person.age || "idade não informada"} anos.
Última informação em ${person.city || "cidade não informada"}/${person.state || "UF"} no dia ${formatDate(person.missing_date)}.

${person.case_description || "Qualquer informação pode ser essencial para ajudar neste caso."}

Compartilhe esta publicação para ampliar o alcance.

#RedeAlerta #Desaparecidos #AjudeACompartilhar #CadaMinutoConta`;
}

function getStatusBadge(status) {
  const map = {
    pending: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
    published: "bg-green-500/10 text-green-300 border-green-500/20",
    found: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    rejected: "bg-zinc-500/10 text-zinc-300 border-zinc-500/20",
  };

  return map[status] || "bg-white/10 text-zinc-300 border-white/20";
}

function getStatusLabel(status) {
  const map = {
    pending: "Pendente",
    published: "Publicado",
    found: "Encontrado",
    rejected: "Rejeitado",
  };

  return map[status] || status;
}

function getInstagramDotClass(instagramStatus) {
  if (!instagramStatus) return "bg-red-500";

  if (instagramStatus.ready) return "bg-green-500";

  if (instagramStatus.configured) return "bg-yellow-500";

  return "bg-red-500";
}

export default function AdminDashboardPage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [selectedPreset, setSelectedPreset] = useState("feed");
  const [caption, setCaption] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [dataMode, setDataMode] = useState("pending-only");

  const [instagramStatus, setInstagramStatus] = useState(null);
  const [instagramLoading, setInstagramLoading] = useState(false);
  const [postingInstagram, setPostingInstagram] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("admin_token");
  const postRef = useRef(null);

  useEffect(() => {
    if (!token) {
      navigate("/colaborador/login", { replace: true });
      return;
    }

    loadCases();
  }, []);

  useEffect(() => {
    if (activeSection === "instagram" && token) {
      loadInstagramStatus();
    }
  }, [activeSection]);

  async function loadCases() {
    try {
      setLoading(true);

      try {
        const response = await api.get("/admin/cases", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const loadedCases = Array.isArray(response.data) ? response.data : [];
        setCases(
          loadedCases.map((item) => ({
            ...item,
            normalized_status: normalizeStatus(item),
          }))
        );
        setDataMode("full");

        if (loadedCases.length > 0) {
          setSelectedCaseId((prev) => prev || String(loadedCases[0].id));
        }

        return;
      } catch (fullError) {
        console.warn("Endpoint /admin/cases ainda não disponível, usando fallback:", fullError);
      }

      const response = await api.get("/admin/pending", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const loadedCases = Array.isArray(response.data) ? response.data : [];
      const normalized = loadedCases.map((item) => ({
        ...item,
        normalized_status: "pending",
      }));

      setCases(normalized);
      setDataMode("pending-only");

      if (normalized.length > 0) {
        setSelectedCaseId((prev) => prev || String(normalized[0].id));
      }
    } catch (error) {
      console.error(error);
      alert("Sessão inválida ou expirada");
      localStorage.removeItem("admin_token");
      navigate("/colaborador/login", { replace: true });
    } finally {
      setLoading(false);
    }
  }

  async function loadInstagramStatus() {
    try {
      setInstagramLoading(true);

      const response = await api.get("/admin/instagram/status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInstagramStatus(response.data);
    } catch (error) {
      console.error(error);
      setInstagramStatus({
        ready: false,
        configured: false,
        message: "Erro ao verificar conexão do Instagram.",
      });
    } finally {
      setInstagramLoading(false);
    }
  }

  async function updateStatus(caseId, action) {
    try {
      setActionLoading(`${caseId}-${action}`);

      await api.patch(
        `/admin/${caseId}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await loadCases();

      if (activeSection === "instagram") {
        await loadInstagramStatus();
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar o caso");
    } finally {
      setActionLoading(null);
    }
  }

  async function handlePostToInstagram() {
    if (!selectedCase) return;

    try {
      setPostingInstagram(true);

      const response = await api.post(
        `/admin/${selectedCase.id}/instagram/publish`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data?.message || "Post enviado para o Instagram.");
      await loadInstagramStatus();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "Erro ao postar no Instagram");
    } finally {
      setPostingInstagram(false);
    }
  }

  function logout() {
    localStorage.removeItem("admin_token");
    navigate("/colaborador/login", { replace: true });
  }

  const filteredCases = useMemo(() => {
    let result = [...cases];

    if (statusFilter !== "all") {
      result = result.filter((person) => person.normalized_status === statusFilter);
    }

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((person) => {
        return (
          person.full_name?.toLowerCase().includes(query) ||
          person.city?.toLowerCase().includes(query) ||
          person.state?.toLowerCase().includes(query) ||
          person.contact_name?.toLowerCase().includes(query) ||
          person.contact_phone?.toLowerCase().includes(query)
        );
      });
    }

    return result;
  }, [cases, search, statusFilter]);

  const selectedCase = useMemo(() => {
    const found = cases.find((item) => String(item.id) === String(selectedCaseId));
    return found || null;
  }, [cases, selectedCaseId]);

  useEffect(() => {
    if (selectedCase) {
      setCaption(buildInstagramCaption(selectedCase, selectedPreset));
    } else {
      setCaption("");
    }
  }, [selectedCase, selectedPreset]);

  const counts = useMemo(() => {
    return {
      all: cases.length,
      pending: cases.filter((c) => c.normalized_status === "pending").length,
      published: cases.filter((c) => c.normalized_status === "published").length,
      found: cases.filter((c) => c.normalized_status === "found").length,
      rejected: cases.filter((c) => c.normalized_status === "rejected").length,
    };
  }, [cases]);

  async function handleDownloadPost() {
    if (!postRef.current || !selectedCase) return;

    try {
      setDownloading(true);

      const dataUrl = await toPng(postRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });

      const presetName = selectedPreset || "post";
      const safeName = (selectedCase.full_name || "caso").replace(/\s+/g, "-").toLowerCase();

      const link = document.createElement("a");
      link.download = `rede-alerta-${presetName}-${safeName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error(error);
      alert("Não foi possível gerar a imagem do post.");
    } finally {
      setDownloading(false);
    }
  }

  async function handleCopyCaption() {
    try {
      await navigator.clipboard.writeText(caption || "");
      alert("Legenda copiada com sucesso.");
    } catch (error) {
      console.error(error);
      alert("Não foi possível copiar a legenda.");
    }
  }

  function renderPostPreview() {
    const person = selectedCase;
    const preset = selectedPreset;

    if (preset === "story") {
      return (
        <div
          ref={postRef}
          className="mx-auto w-full max-w-[420px] overflow-hidden rounded-[36px] border border-white/10 bg-neutral-950 shadow-2xl shadow-black/30"
          style={{ aspectRatio: "9 / 16" }}
        >
          <div className="flex h-full flex-col bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.35),transparent_28%),linear-gradient(180deg,rgba(127,29,29,0.25),rgba(10,10,10,0.98))] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-white">REDE ALERTA</p>
                <p className="text-[11px] uppercase tracking-[0.22em] text-red-300">
                  story
                </p>
              </div>
              <div className="rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                Alerta
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-[28px] border border-white/10 bg-black/20">
              {person?.photo_url ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}${person.photo_url}`}
                  alt={person.full_name}
                  className="h-[420px] w-full object-cover"
                />
              ) : (
                <div className="flex h-[420px] items-center justify-center text-sm text-zinc-500">
                  Sem foto
                </div>
              )}
            </div>

            <div className="mt-5 rounded-[28px] border border-white/10 bg-white/[0.05] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                Pessoa desaparecida
              </p>
              <h3 className="mt-3 text-3xl font-black leading-tight text-white">
                {person?.full_name || "Selecione um caso"}
              </h3>
              <p className="mt-2 text-sm text-zinc-300">
                {person
                  ? `${person.age || "Idade"} anos • ${person.city || "Cidade"}/${person.state || "UF"}`
                  : "Nenhum caso selecionado"}
              </p>

              <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-red-300">
                  Data
                </p>
                <p className="mt-1 text-lg font-bold text-white">
                  {person ? formatDate(person.missing_date) : "--"}
                </p>
              </div>

              <p className="mt-4 text-sm leading-6 text-zinc-300">
                Compartilhe para ampliar o alcance deste caso.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (preset === "portrait") {
      return (
        <div
          ref={postRef}
          className="mx-auto w-full max-w-[520px] overflow-hidden rounded-[36px] border border-white/10 bg-neutral-950 shadow-2xl shadow-black/30"
          style={{ aspectRatio: "4 / 5" }}
        >
          <div className="flex h-full flex-col bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.30),transparent_28%),linear-gradient(135deg,rgba(127,29,29,0.22),rgba(10,10,10,0.98))] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-white">REDE ALERTA</p>
                <p className="text-[11px] uppercase tracking-[0.22em] text-red-300">
                  feed retrato
                </p>
              </div>
              <div className="rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                Alerta
              </div>
            </div>

            <div className="mt-5 grid flex-1 gap-5">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black/20">
                {person?.photo_url ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${person.photo_url}`}
                    alt={person.full_name}
                    className="h-[360px] w-full object-cover"
                  />
                ) : (
                  <div className="flex h-[360px] items-center justify-center text-sm text-zinc-500">
                    Sem foto
                  </div>
                )}
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                  Ajude a compartilhar
                </p>
                <h3 className="mt-3 text-3xl font-black leading-tight text-white">
                  {person?.full_name || "Selecione um caso"}
                </h3>
                <p className="mt-3 text-sm text-zinc-300">
                  {person
                    ? `${person.age || "Idade"} anos • ${person.city || "Cidade"}/${person.state || "UF"}`
                    : "Nenhum caso selecionado"}
                </p>
                <p className="mt-4 text-sm leading-6 text-zinc-300">
                  Desaparecido em {person ? formatDate(person.missing_date) : "--"}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (preset === "urgent") {
      return (
        <div
          ref={postRef}
          className="mx-auto w-full max-w-[540px] overflow-hidden rounded-[36px] border border-red-500/30 bg-neutral-950 shadow-2xl shadow-red-950/40"
          style={{ aspectRatio: "1 / 1" }}
        >
          <div className="flex h-full flex-col bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.45),transparent_28%),linear-gradient(135deg,rgba(127,29,29,0.35),rgba(10,10,10,0.98))] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-white">REDE ALERTA</p>
                <p className="text-[11px] uppercase tracking-[0.22em] text-red-200">
                  urgente
                </p>
              </div>
              <div className="rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                Prioridade
              </div>
            </div>

            <div className="mt-6 grid flex-1 gap-5 md:grid-cols-[1fr_1.1fr]">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black/20">
                {person?.photo_url ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${person.photo_url}`}
                    alt={person.full_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-[280px] items-center justify-center text-sm text-zinc-500">
                    Sem foto
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between rounded-[28px] border border-red-500/20 bg-white/[0.05] p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-200">
                    Divulgação urgente
                  </p>
                  <h3 className="mt-3 text-3xl font-black leading-tight text-white">
                    {person?.full_name || "Selecione um caso"}
                  </h3>
                  <p className="mt-3 text-sm text-zinc-200">
                    {person
                      ? `${person.age || "Idade"} anos • ${person.city || "Cidade"}/${person.state || "UF"}`
                      : "Nenhum caso selecionado"}
                  </p>
                </div>

                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-red-200">
                    Desaparecido em
                  </p>
                  <p className="mt-1 text-xl font-bold text-white">
                    {person ? formatDate(person.missing_date) : "--"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (preset === "found") {
      return (
        <div
          ref={postRef}
          className="mx-auto w-full max-w-[540px] overflow-hidden rounded-[36px] border border-blue-500/20 bg-neutral-950 shadow-2xl shadow-black/30"
          style={{ aspectRatio: "1 / 1" }}
        >
          <div className="flex h-full flex-col bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.25),transparent_28%),linear-gradient(135deg,rgba(30,64,175,0.18),rgba(10,10,10,0.98))] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-white">REDE ALERTA</p>
                <p className="text-[11px] uppercase tracking-[0.22em] text-blue-300">
                  atualização
                </p>
              </div>
              <div className="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                Encerrado
              </div>
            </div>

            <div className="mt-6 grid flex-1 gap-5 md:grid-cols-[1fr_1.1fr]">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black/20">
                {person?.photo_url ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${person.photo_url}`}
                    alt={person.full_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-[280px] items-center justify-center text-sm text-zinc-500">
                    Sem foto
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-300">
                    Caso atualizado
                  </p>
                  <h3 className="mt-3 text-3xl font-black leading-tight text-white">
                    {person?.full_name || "Selecione um caso"}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-zinc-300">
                    Este caso foi atualizado como localizado. Obrigado a todos que ajudaram compartilhando.
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 px-4 py-4">
                  <p className="text-lg font-bold text-white">Pessoa encontrada</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={postRef}
        className="mx-auto w-full max-w-[540px] overflow-hidden rounded-[36px] border border-white/10 bg-neutral-950 shadow-2xl shadow-black/30"
        style={{ aspectRatio: "1 / 1" }}
      >
        <div className="flex h-full flex-col bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.30),transparent_28%),linear-gradient(135deg,rgba(127,29,29,0.24),rgba(10,10,10,0.98))] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-white">REDE ALERTA</p>
              <p className="text-[11px] uppercase tracking-[0.22em] text-red-300">
                pessoa desaparecida
              </p>
            </div>

            <div className="rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              Alerta
            </div>
          </div>

          <div className="mt-6 grid flex-1 gap-5 md:grid-cols-[1fr_1.1fr]">
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black/20">
              {person?.photo_url ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}${person.photo_url}`}
                  alt={person.full_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[280px] items-center justify-center text-sm text-zinc-500">
                  Sem foto
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                  Ajude a compartilhar
                </p>

                <h3 className="mt-3 text-3xl font-black leading-tight text-white">
                  {person?.full_name || "Selecione um caso"}
                </h3>

                <p className="mt-3 text-sm text-zinc-300">
                  {person
                    ? `${person.age || "Idade"} anos • ${person.city || "Cidade"}/${person.state || "UF"}`
                    : "Nenhum caso selecionado"}
                </p>

                <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-red-300">
                    Desaparecido em
                  </p>
                  <p className="mt-1 text-lg font-bold text-white">
                    {person ? formatDate(person.missing_date) : "--"}
                  </p>
                </div>

                <p className="mt-5 text-sm leading-6 text-zinc-300">
                  {person?.case_description
                    ? person.case_description.slice(0, 180)
                    : "As informações do caso aparecerão aqui para gerar a postagem."}
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                <p className="text-sm font-semibold text-white">
                  Qualquer informação pode ser essencial.
                </p>
                <p className="mt-1 text-xs leading-5 text-zinc-400">
                  Compartilhe para ampliar o alcance deste caso.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!token) return null;

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col border-r border-white/10 bg-black/20 xl:flex">
          <div className="border-b border-white/10 px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 shadow-lg shadow-red-700/30">
                <span className="text-xl font-black">!</span>
              </div>
              <div>
                <p className="text-lg font-black tracking-wide text-white">REDE ALERTA</p>
                <p className="text-xs uppercase tracking-[0.22em] text-red-300">
                  Admin Dashboard
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6">
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Navegação
            </p>

            <div className="space-y-2">
              {menuItems.map((item) => {
                const isActive = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                      isActive
                        ? "bg-red-600 text-white shadow-lg shadow-red-700/20"
                        : "border border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                Fonte de dados
              </p>
              <p className="mt-3 text-lg font-black text-white">
                {dataMode === "full" ? "Completa" : "Fallback atual"}
              </p>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                {dataMode === "full"
                  ? "Lendo todos os casos por status."
                  : "Usando apenas o fluxo atual de pendentes até o novo endpoint existir."}
              </p>
            </div>
          </nav>

          <div className="border-t border-white/10 px-4 py-4">
            <button
              onClick={logout}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.08]"
            >
              Sair do painel
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.18),transparent_28%),linear-gradient(to_bottom,rgba(127,29,29,0.12),transparent)]">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-300">
                    Painel administrativo
                  </p>
                  <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                    Controle central do Rede Alerta
                  </h1>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
                    Agora com base pronta para tratar casos por status, gerar artes e
                    integrar a publicação no Instagram.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/colaborador/informacoes"
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-semibold transition hover:bg-white/10"
                  >
                    Ver informações recebidas
                  </Link>

                  <button
                    onClick={logout}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold transition hover:bg-white/10 xl:hidden"
                  >
                    Sair
                  </button>
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-5">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                    Todos
                  </p>
                  <p className="mt-3 text-3xl font-black text-white">{counts.all}</p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-yellow-300">
                    Pendentes
                  </p>
                  <p className="mt-3 text-3xl font-black text-white">{counts.pending}</p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-green-300">
                    Publicados
                  </p>
                  <p className="mt-3 text-3xl font-black text-white">{counts.published}</p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-300">
                    Encontrados
                  </p>
                  <p className="mt-3 text-3xl font-black text-white">{counts.found}</p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-300">
                    Rejeitados
                  </p>
                  <p className="mt-3 text-3xl font-black text-white">{counts.rejected}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-col gap-4">
              <div className="flex flex-wrap gap-3">
                {menuItems.map((item) => {
                  const isActive = activeSection === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                        isActive
                          ? "bg-red-600 text-white"
                          : "border border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
                <input
                  type="text"
                  placeholder="Buscar por nome, cidade, estado ou responsável..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-red-500/40"
                />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none"
                >
                  {statusOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {activeSection === "overview" && (
              <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                        Visão operacional
                      </p>
                      <h2 className="mt-2 text-2xl font-black text-white">
                        Casos filtrados agora
                      </h2>
                    </div>

                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-red-300">
                        Total
                      </p>
                      <p className="text-lg font-black text-red-100">
                        {loading ? "..." : filteredCases.length}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {loading && (
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-400">
                        Carregando visão geral...
                      </div>
                    )}

                    {!loading && filteredCases.length === 0 && (
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-400">
                        Nenhum caso encontrado nesse filtro.
                      </div>
                    )}

                    {filteredCases.slice(0, 5).map((person) => (
                      <div
                        key={person.id}
                        className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/20 p-4"
                      >
                        <div className="h-16 w-16 overflow-hidden rounded-2xl bg-neutral-900">
                          {person.photo_url ? (
                            <img
                              src={`${import.meta.env.VITE_API_URL}${person.photo_url}`}
                              alt={person.full_name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
                              Sem foto
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-white">
                            {person.full_name}
                          </p>
                          <p className="mt-1 text-xs text-zinc-400">
                            {person.age} anos • {person.city}/{person.state}
                          </p>
                        </div>

                        <div
                          className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${getStatusBadge(
                            person.normalized_status
                          )}`}
                        >
                          {getStatusLabel(person.normalized_status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                      Ações rápidas
                    </p>
                    <div className="mt-5 grid gap-3">
                      <button
                        onClick={() => setActiveSection("cases")}
                        className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-500"
                      >
                        Abrir gestão de casos
                      </button>

                      <button
                        onClick={() => setActiveSection("instagram")}
                        className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.06]"
                      >
                        Abrir gerador de posts
                      </button>
                    </div>
                  </div>

                  <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                      Situação atual
                    </p>
                    <p className="mt-3 text-sm leading-7 text-zinc-400">
                      {dataMode === "full"
                        ? "O painel já está lendo uma base mais completa de casos."
                        : "O painel ainda está usando fallback de pendentes. Assim que o endpoint geral existir, os filtros por status passarão a refletir todo o histórico automaticamente."}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {activeSection === "cases" && (
              <section>
                {loading && (
                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center text-zinc-400">
                    Carregando casos...
                  </div>
                )}

                {!loading && filteredCases.length === 0 && (
                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center text-zinc-400">
                    Nenhum caso encontrado para esse filtro.
                  </div>
                )}

                <div className="grid gap-6 xl:grid-cols-2">
                  {filteredCases.map((person) => (
                    <article
                      key={person.id}
                      className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] shadow-xl shadow-black/20"
                    >
                      <div className="grid lg:grid-cols-[260px_1fr]">
                        <div className="h-72 bg-neutral-900 lg:h-full">
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

                        <div className="p-5">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <div
                                className={`mb-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getStatusBadge(
                                  person.normalized_status
                                )}`}
                              >
                                {getStatusLabel(person.normalized_status)}
                              </div>
                              <h2 className="text-2xl font-black text-white">
                                {person.full_name}
                              </h2>
                              <p className="mt-2 text-sm text-zinc-400">
                                {person.age} anos • {person.city}/{person.state}
                              </p>
                            </div>

                            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-right">
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-red-300">
                                Desaparecimento
                              </p>
                              <p className="mt-1 text-sm font-bold text-red-100">
                                {formatDate(person.missing_date)}
                              </p>
                            </div>
                          </div>

                          <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                                Responsável
                              </p>
                              <p className="mt-2 text-sm text-zinc-300">
                                {person.contact_name || "Não informado"}
                              </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                                Telefone
                              </p>
                              <p className="mt-2 text-sm text-zinc-300">
                                {person.contact_phone || "Não informado"}
                              </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:col-span-2">
                              <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                                Número do B.O.
                              </p>
                              <p className="mt-2 text-sm text-zinc-300">
                                {person.police_report_number || "Não informado"}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                              Descrição do caso
                            </p>
                            <p className="mt-2 text-sm leading-6 text-zinc-300">
                              {person.case_description || "Sem descrição informada."}
                            </p>
                          </div>

                          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-4">
                            <button
                              onClick={() => updateStatus(person.id, "publish")}
                              disabled={actionLoading === `${person.id}-publish`}
                              className="rounded-2xl bg-green-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-500 disabled:opacity-70"
                            >
                              {actionLoading === `${person.id}-publish`
                                ? "Publicando..."
                                : "Publicar"}
                            </button>

                            <button
                              onClick={() => updateStatus(person.id, "reject")}
                              disabled={actionLoading === `${person.id}-reject`}
                              className="rounded-2xl bg-zinc-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-zinc-600 disabled:opacity-70"
                            >
                              {actionLoading === `${person.id}-reject`
                                ? "Rejeitando..."
                                : "Rejeitar"}
                            </button>

                            <button
                              onClick={() => updateStatus(person.id, "found")}
                              disabled={actionLoading === `${person.id}-found`}
                              className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-500 disabled:opacity-70"
                            >
                              {actionLoading === `${person.id}-found`
                                ? "Encerrando..."
                                : "Encontrado"}
                            </button>

                            <button
                              onClick={() => {
                                setSelectedCaseId(String(person.id));
                                setActiveSection("instagram");
                              }}
                              className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                            >
                              Gerar post
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {activeSection === "instagram" && (
              <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
                <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                    Postagens Instagram
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-white">
                    Gerador com presets
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-zinc-400">
                    Gere arte para casos pendentes, publicados, encontrados ou antigos,
                    dependendo da base já disponível no backend.
                  </p>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${getInstagramDotClass(instagramStatus)}`} />
                        <p className="text-sm font-semibold text-white">
                          Status do Instagram
                        </p>
                      </div>

                      <button
                        onClick={loadInstagramStatus}
                        disabled={instagramLoading}
                        className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-white/[0.08] disabled:opacity-70"
                      >
                        {instagramLoading ? "Verificando..." : "Atualizar"}
                      </button>
                    </div>

                    <p className="mt-3 text-xs leading-6 text-zinc-400">
                      {instagramLoading
                        ? "Verificando conexão com o Instagram..."
                        : instagramStatus?.message || "Status ainda não carregado."}
                    </p>

                    {instagramStatus?.account_id && (
                      <p className="mt-2 text-[11px] leading-5 text-zinc-500">
                        Account ID: {instagramStatus.account_id}
                      </p>
                    )}

                    {instagramStatus?.backend_public_url && (
                      <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                        Backend público: {instagramStatus.backend_public_url}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-red-300">
                        Caso
                      </label>
                      <select
                        value={selectedCaseId}
                        onChange={(e) => setSelectedCaseId(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none"
                      >
                        {filteredCases.length === 0 && (
                          <option value="">Nenhum caso disponível</option>
                        )}

                        {filteredCases.map((person) => (
                          <option key={person.id} value={String(person.id)}>
                            {person.full_name} - {person.city}/{person.state} - {getStatusLabel(person.normalized_status)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-red-300">
                        Preset
                      </label>
                      <select
                        value={selectedPreset}
                        onChange={(e) => setSelectedPreset(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none"
                      >
                        {presetOptions.map((preset) => (
                          <option key={preset.value} value={preset.value}>
                            {preset.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedCase && (
                      <>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                              Nome
                            </p>
                            <p className="mt-2 text-sm text-zinc-300">
                              {selectedCase.full_name}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                              Status
                            </p>
                            <p className="mt-2 text-sm text-zinc-300">
                              {getStatusLabel(selectedCase.normalized_status)}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                              Local
                            </p>
                            <p className="mt-2 text-sm text-zinc-300">
                              {selectedCase.city}/{selectedCase.state}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
                              Data
                            </p>
                            <p className="mt-2 text-sm text-zinc-300">
                              {formatDate(selectedCase.missing_date)}
                            </p>
                          </div>
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-red-300">
                            Legenda editável
                          </label>
                          <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            rows={11}
                            className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none"
                          />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <button
                            onClick={handleCopyCaption}
                            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                          >
                            Copiar legenda
                          </button>

                          <button
                            onClick={handleDownloadPost}
                            disabled={!selectedCase || downloading}
                            className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-500 disabled:opacity-70"
                          >
                            {downloading ? "Gerando imagem..." : "Baixar post em PNG"}
                          </button>
                        </div>

                        <button
                          onClick={handlePostToInstagram}
                          disabled={!selectedCase || postingInstagram || !instagramStatus?.ready}
                          className="mt-3 w-full rounded-2xl bg-green-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-500 disabled:opacity-70"
                        >
                          {postingInstagram ? "Postando..." : "Postar no Instagram 🚀"}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                    Preview do preset
                  </p>

                  <div className="mt-5">{renderPostPreview()}</div>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}