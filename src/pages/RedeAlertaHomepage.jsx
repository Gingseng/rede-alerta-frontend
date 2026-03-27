import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

const sponsors = [
  "Patrocinador Master",
  "Parceiro Regional",
  "Apoiador Social",
  "Mídia Parceira",
];

export default function RedeAlertaHomepage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadCases() {
    try {
      const response = await api.get("/cases/public");
      setCases(response.data);
    } catch (error) {
      console.error("Erro ao carregar casos:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCases();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600 shadow-lg shadow-red-700/30">
              <span className="text-xl font-black">!</span>
            </div>
            <div>
              <p className="text-lg font-black tracking-wide">REDE ALERTA</p>
              <p className="text-xs text-red-300">Cada minuto conta</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin/login"
              className="hidden rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-white/30 hover:bg-white/5 sm:block"
            >
              Entrar
            </Link>

            <Link
              to="/cadastrar"
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold shadow-lg shadow-red-700/30 transition hover:bg-red-500"
            >
              Cadastrar caso
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.30),transparent_30%),radial-gradient(circle_at_top_right,rgba(220,38,38,0.18),transparent_25%),linear-gradient(to_bottom,rgba(127,29,29,0.22),transparent)]" />
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-2 lg:px-8">
            <div className="relative z-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                Plataforma de utilidade pública
              </div>

              <h1 className="max-w-xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                Ajude a localizar pessoas desaparecidas com rapidez.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
                O Rede Alerta reúne casos verificados, facilita o compartilhamento e conecta famílias,
                comunidade, mídia e apoiadores em um só lugar.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/cadastrar"
                  className="rounded-2xl bg-red-600 px-6 py-3 text-center text-sm font-semibold shadow-lg shadow-red-700/30 transition hover:bg-red-500"
                >
                  Cadastrar desaparecido
                </Link>

                <a
                  href="#como-funciona"
                  className="rounded-2xl border border-white/15 px-6 py-3 text-center text-sm font-semibold text-zinc-100 transition hover:border-white/30 hover:bg-white/5"
                >
                  Como funciona
                </a>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["24h", "prioridade para casos urgentes"],
                  ["+120", "cidades alcançadas"],
                  ["+450", "mídias parceiras"],
                  ["100%", "cadastro gratuito"],
                ].map(([value, label]) => (
                  <div key={value} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-2xl font-black text-white">{value}</div>
                    <div className="mt-1 text-xs leading-5 text-zinc-400">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-red-950/30 backdrop-blur">
                <div className="rounded-[24px] border border-white/10 bg-neutral-900 p-4 sm:p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">Casos recentes</p>
                      <p className="text-xs text-zinc-400">Acompanhe os alertas mais urgentes</p>
                    </div>
                    <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-300">
                      Ao vivo
                    </span>
                  </div>

                  <div className="space-y-3">
                    {loading && <p className="text-sm text-zinc-400">Carregando casos...</p>}

                    {!loading && cases.length === 0 && (
                      <p className="text-sm text-zinc-400">
                        Nenhum caso publicado ainda.
                      </p>
                    )}

                    {cases.slice(0, 4).map((person) => (
                      <Link
                        to={`/caso/${person.id}`}
                        key={person.id}
                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition hover:bg-white/[0.06]"
                      >
                        <div className="h-16 w-16 overflow-hidden rounded-2xl bg-neutral-800">
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
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-semibold text-white">
                              {person.full_name}
                            </p>
                            <span className="rounded-full bg-red-600/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-red-300">
                              Publicado
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-zinc-400">
                            {person.age} anos • {person.city}/{person.state}
                          </p>
                          <p className="mt-2 text-sm font-medium text-red-300">
                            Desaparecido em {person.missing_date}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="parceiros" className="border-b border-white/10 bg-white/[0.02]">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                  Apoio e patrocinadores
                </p>
                <h2 className="mt-2 text-xl font-bold text-white">
                  Espaço institucional para marcas parceiras da causa
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {sponsors.map((sponsor) => (
                  <div
                    key={sponsor}
                    className="flex min-h-[72px] items-center justify-center rounded-2xl border border-white/10 bg-neutral-900 px-4 text-center text-sm font-medium text-zinc-300"
                  >
                    {sponsor}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="casos" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
              Casos publicados
            </p>
            <h2 className="mt-2 text-3xl font-black text-white">Desaparecidos recentes</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              Casos moderados antes da publicação, com foco em velocidade, clareza e fácil compartilhamento.
            </p>
          </div>

          {loading && <p className="text-zinc-400">Carregando casos...</p>}

          {!loading && cases.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center text-zinc-400">
              Ainda não existem casos publicados.
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {cases.map((person) => (
              <Link
                to={`/caso/${person.id}`}
                key={person.id}
                className="block overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-red-500/30"
              >
                <div className="relative">
                  {person.photo_url ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}${person.photo_url}`}
                      alt={person.full_name}
                      className="h-72 w-full object-cover sm:h-80"
                    />
                  ) : (
                    <div className="flex h-72 w-full items-center justify-center bg-neutral-900 text-zinc-500 sm:h-80">
                      Sem foto
                    </div>
                  )}

                  <div className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-red-800/40">
                    Publicado
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-black text-white">{person.full_name}</h3>
                      <p className="mt-1 text-sm text-zinc-400">
                        {person.age} anos • {person.city}/{person.state}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-red-300">
                        Data
                      </p>
                      <p className="text-sm font-bold text-red-200">{person.missing_date}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-zinc-300">
                    {person.case_description || "Caso aprovado para divulgação pública e compartilhamento."}
                  </p>

                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-green-600 px-4 py-3 text-center text-sm font-semibold text-white">
                      Tenho informação
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-white">
                      Compartilhar
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="como-funciona" className="border-t border-white/10 bg-white/[0.02]">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                Como funciona
              </p>
              <h2 className="mt-2 text-3xl font-black text-white">
                Fluxo pensado para confiança e rapidez
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
                O caso é enviado pelo responsável, passa por moderação e, após aprovação,
                entra na plataforma para ganhar visibilidade pública e compartilhamento.
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                ["1", "Cadastro do caso", "A família envia as informações e a foto da pessoa desaparecida."],
                ["2", "Moderação", "A equipe revisa o conteúdo antes da publicação."],
                ["3", "Divulgação", "O caso entra no ar para ganhar alcance e compartilhamento."],
              ].map(([step, title, desc]) => (
                <div
                  key={step}
                  className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-lg font-black text-white shadow-lg shadow-red-700/30">
                    {step}
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer id="rodape" className="mx-auto max-w-7xl px-4 py-10 text-sm text-zinc-400 sm:px-6 lg:px-8">
        <div className="grid gap-8 border-t border-white/10 pt-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-600 font-black">
                !
              </div>
              <div>
                <p className="font-black text-white">REDE ALERTA</p>
                <p className="text-xs text-red-300">Cada minuto conta</p>
              </div>
            </div>

            <p className="mt-4 max-w-xl leading-7">
              Plataforma pensada para divulgação responsável de pessoas desaparecidas, com foco em alcance, confiança e mobilização social.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}