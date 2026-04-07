import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

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

  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error("Erro ao inicializar AdSense:", error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/85 backdrop-blur">
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
              to="/guia"
              className="hidden rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:border-white/30 hover:bg-white/5 sm:inline-flex"
            >
              Guia público
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
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.28),transparent_30%),radial-gradient(circle_at_top_right,rgba(220,38,38,0.14),transparent_25%),linear-gradient(to_bottom,rgba(127,29,29,0.20),transparent)]" />

          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-2 lg:px-8">
            <div className="relative z-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                Plataforma de utilidade pública
              </div>

              <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                Uma rede feita para encontrar quem está desaparecido.
                <span className="block text-zinc-300">
                  E devolver esperança a quem espera.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
                O Rede Alerta foi criado para ajudar famílias, amigos e a
                comunidade a divulgarem casos de desaparecimento com mais
                rapidez, clareza e responsabilidade. Um espaço sério, humano e
                acessível para mobilizar informação quando ela mais importa.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  to="/cadastrar"
                  className="rounded-2xl bg-red-600 px-6 py-3 text-center text-sm font-semibold shadow-lg shadow-red-700/30 transition hover:bg-red-500"
                >
                  Cadastrar desaparecido
                </Link>

                <Link
                  to="/guia"
                  className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-3 text-center text-sm font-semibold text-red-200 transition hover:border-red-400/40 hover:bg-red-500/15"
                >
                  Saiba como agir
                </Link>

                <a
                  href="#como-funciona"
                  className="rounded-2xl border border-white/15 px-6 py-3 text-center text-sm font-semibold text-zinc-100 transition hover:border-white/30 hover:bg-white/5"
                >
                  Entender como funciona
                </a>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  ["24h", "atenção para casos urgentes"],
                  ["Gratuito", "cadastro aberto à população"],
                  ["Em crescimento", "plataforma em expansão"],
                  ["Colaboração", "rede aberta à comunidade"],
                ].map(([value, label]) => (
                  <div
                    key={value}
                    className="flex min-h-[140px] flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="break-words text-[1.75rem] font-black leading-[1.05] tracking-tight text-white">
                      {value}
                    </div>
                    <div className="mt-3 text-xs leading-6 text-zinc-400">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-red-950/30 backdrop-blur">
                <div className="rounded-[24px] border border-white/10 bg-neutral-900 p-4 sm:p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Casos recentes
                      </p>
                      <p className="text-xs text-zinc-400">
                        Alertas públicos disponíveis para consulta e
                        compartilhamento
                      </p>
                    </div>
                    <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-300">
                      Atualizado
                    </span>
                  </div>

                  <div className="space-y-3">
                    {loading && (
                      <p className="text-sm text-zinc-400">Carregando casos...</p>
                    )}

                    {!loading && cases.length === 0 && (
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <p className="text-sm text-zinc-300">
                          Ainda não há casos publicados nesta área.
                        </p>
                        <p className="mt-2 text-xs leading-6 text-zinc-500">
                          Enquanto isso, você pode acessar nosso guia público e
                          entender como agir nas primeiras horas de um
                          desaparecimento.
                        </p>

                        <Link
                          to="/guia"
                          className="mt-4 inline-flex rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-500"
                        >
                          Acessar guia
                        </Link>
                      </div>
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

                  <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                    <p className="text-sm font-semibold text-white">
                      Informação salva tempo. Compartilhamento amplia alcance.
                    </p>
                    <p className="mt-2 text-xs leading-6 text-zinc-300">
                      Quanto mais pessoas tiverem acesso a um caso, maiores são
                      as chances de uma pista chegar até a família.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="apoie" className="border-b border-white/10 bg-white/[0.02]">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                Apoie essa causa
              </p>

              <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                Estamos começando agora. E toda ajuda importa.
              </h2>

              <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
                O Rede Alerta nasceu para ser uma ferramenta de mobilização
                social. Se você acredita na força da informação, da comunidade e
                da solidariedade, pode ajudar essa iniciativa a alcançar mais
                pessoas e fortalecer essa rede.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <a
                  href="#casos"
                  className="rounded-2xl bg-red-600 px-6 py-3 text-center text-sm font-semibold shadow-lg shadow-red-700/30 transition hover:bg-red-500"
                >
                  Quero ajudar divulgando
                </a>

                <a
                  href="#rodape"
                  className="rounded-2xl border border-white/15 px-6 py-3 text-center text-sm font-semibold text-zinc-100 transition hover:border-white/30 hover:bg-white/5"
                >
                  Apoiar o projeto
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-gradient-to-br from-white/[0.02] to-red-500/[0.04]">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid gap-6 rounded-[32px] border border-white/10 bg-white/[0.03] p-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                  Guia público
                </p>

                <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                  Saiba o que fazer nas primeiras horas de um desaparecimento
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
                  Mesmo sem casos publicados no momento, o Rede Alerta também
                  pode ajudar com orientação, preparo e informação útil para
                  famílias e comunidade.
                </p>
              </div>

              <div className="flex flex-col gap-3 lg:items-end">
                <Link
                  to="/guia"
                  className="w-full rounded-2xl bg-red-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-red-700/30 transition hover:bg-red-500 lg:w-auto"
                >
                  Acessar guia completo
                </Link>

                <Link
                  to="/cadastrar"
                  className="w-full rounded-2xl border border-white/15 px-6 py-3 text-center text-sm font-semibold text-zinc-100 transition hover:border-white/30 hover:bg-white/5 lg:w-auto"
                >
                  Cadastrar caso
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section
          id="casos"
          className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
        >
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
              Casos publicados
            </p>
            <h2 className="mt-2 text-3xl font-black text-white">
              Desaparecidos recentes
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              Casos revisados antes da publicação, com foco em clareza,
              responsabilidade e fácil compartilhamento.
            </p>
          </div>

          {loading && <p className="text-zinc-400">Carregando casos...</p>}

          {!loading && cases.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center text-zinc-400">
              <p>Ainda não existem casos publicados.</p>
              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Enquanto a plataforma cresce, você pode acessar nosso guia
                público e entender como agir em uma situação de desaparecimento.
              </p>
              <div className="mt-5">
                <Link
                  to="/guia"
                  className="inline-flex rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-700/30 transition hover:bg-red-500"
                >
                  Acessar guia público
                </Link>
              </div>
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
                      <h3 className="text-2xl font-black text-white">
                        {person.full_name}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-400">
                        {person.age} anos • {person.city}/{person.state}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-red-300">
                        Data
                      </p>
                      <p className="text-sm font-bold text-red-200">
                        {person.missing_date}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-zinc-300">
                    {person.case_description ||
                      "Caso aprovado para divulgação pública e compartilhamento responsável."}
                  </p>

                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-green-600 px-4 py-3 text-center text-sm font-semibold text-white">
                      Tenho uma informação sobre este caso
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-white">
                      Compartilhar caso
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
                Um fluxo pensado para confiança, cuidado e rapidez
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
                O caso é enviado pelo responsável, passa por análise antes da
                publicação e, após aprovação, fica disponível para consulta
                pública e compartilhamento. Tudo para ampliar o alcance da
                informação com mais responsabilidade.
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                [
                  "1",
                  "Envio do caso",
                  "A família ou responsável preenche as informações e envia os dados da pessoa desaparecida.",
                ],
                [
                  "2",
                  "Análise e moderação",
                  "A equipe revisa o conteúdo antes da publicação para manter a clareza e a confiabilidade das informações.",
                ],
                [
                  "3",
                  "Publicação e mobilização",
                  "Após aprovação, o caso ganha visibilidade pública para ampliar as chances de identificação e apoio.",
                ],
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

        <section className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.05] to-red-500/[0.05] p-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                Compromisso
              </p>
              <h2 className="mt-2 text-3xl font-black text-white">
                Mais do que uma plataforma, uma rede de atenção.
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-zinc-400 sm:text-base">
                Nosso objetivo é criar um espaço confiável para tornar cada caso
                mais visível, aproximar informação de quem precisa e fortalecer a
                mobilização em torno de cada desaparecimento.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer
        id="rodape"
        className="mx-auto max-w-7xl px-4 py-10 text-sm text-zinc-400 sm:px-6 lg:px-8"
      >
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
              Plataforma criada para ampliar a divulgação responsável de pessoas
              desaparecidas, fortalecer a mobilização social e oferecer mais
              visibilidade a quem precisa ser encontrado.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <div className="mb-3 text-center text-xs uppercase tracking-[0.18em] text-zinc-500">
            Publicidade
          </div>
        </div>
      </footer>
    </div>
  );
}