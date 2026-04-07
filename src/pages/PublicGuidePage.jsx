import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

function SectionTitle({ eyebrow, title, description, light = false }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="mx-auto mb-10 max-w-3xl"
    >
      <p
        className={`text-xs font-semibold uppercase tracking-[0.22em] ${
          light ? "text-red-200" : "text-red-300"
        }`}
      >
        {eyebrow}
      </p>

      <h2
        className={`mt-2 text-3xl font-black sm:text-4xl ${
          light ? "text-white" : "text-white"
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`mt-4 text-sm leading-7 sm:text-base ${
            light ? "text-zinc-300" : "text-zinc-400"
          }`}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}

function InfoCard({ title, text, icon }) {
  return (
    <motion.article
      variants={fadeUp}
      className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/10 backdrop-blur"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600/15 text-xl text-red-300 ring-1 ring-red-500/20">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-bold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-zinc-400">{text}</p>
    </motion.article>
  );
}

function StepCard({ number, title, text }) {
  return (
    <motion.article
      variants={fadeUp}
      className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-6 transition hover:border-red-500/20"
    >
      <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.14),transparent_30%)]" />

      <div className="relative z-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-lg font-black text-white shadow-lg shadow-red-700/30">
          {number}
        </div>

        <h3 className="mt-5 text-xl font-bold text-white">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-zinc-400">{text}</p>
      </div>
    </motion.article>
  );
}

function WarningCard({ title, text }) {
  return (
    <motion.article
      variants={fadeUp}
      className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6"
    >
      <div className="mb-4 inline-flex rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-300">
        Atenção
      </div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-zinc-400">{text}</p>
    </motion.article>
  );
}

export default function PublicGuidePage() {
  useEffect(() => {
    document.title = "Guia de Ação | Rede Alerta";

    const description =
      "Saiba o que fazer nas primeiras horas após um desaparecimento. Orientações, documentos importantes, divulgação responsável e apoio da Rede Alerta.";

    let metaDescription = document.querySelector('meta[name="description"]');

    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }

    metaDescription.setAttribute("content", description);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.28),transparent_30%),radial-gradient(circle_at_top_right,rgba(220,38,38,0.14),transparent_25%),linear-gradient(to_bottom,rgba(127,29,29,0.20),transparent)]" />
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-red-400/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl"
          >
            <motion.div
              variants={fadeUp}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-red-300"
            >
              Utilidade pública
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl"
            >
              Saiba como agir nas primeiras horas de um desaparecimento
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg"
            >
              Informação correta, organização e rapidez podem fazer diferença.
              Esta página reúne orientações essenciais para famílias, amigos e
              comunidade agirem com mais clareza diante de um desaparecimento.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            >
              <Link
                to="/cadastrar"
                className="rounded-2xl bg-red-600 px-6 py-3 text-center text-sm font-semibold shadow-lg shadow-red-700/30 transition hover:bg-red-500"
              >
                Cadastrar caso
              </Link>

              <a
                href="#primeiros-passos"
                className="rounded-2xl border border-white/15 px-6 py-3 text-center text-sm font-semibold text-zinc-100 transition hover:border-white/30 hover:bg-white/5"
              >
                Ver orientações
              </a>

              <Link
                to="/"
                className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-3 text-center text-sm font-semibold text-red-200 transition hover:border-red-400/40 hover:bg-red-500/15"
              >
                Voltar ao início
              </Link>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="mt-10 grid gap-4 sm:grid-cols-3"
            >
              <motion.div
                variants={fadeUp}
                className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5"
              >
                <p className="text-2xl font-black text-white">Organização</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Reúna informações úteis sem transformar o caso em confusão.
                </p>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5"
              >
                <p className="text-2xl font-black text-white">Clareza</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Uma divulgação objetiva ajuda mais do que muitas mensagens
                  desencontradas.
                </p>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5"
              >
                <p className="text-2xl font-black text-white">Rapidez</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Quanto antes a mobilização começa, maiores podem ser as
                  chances de alcance útil.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <main>
        <section
          id="primeiros-passos"
          className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
        >
          <SectionTitle
            eyebrow="Primeiros passos"
            title="O que fazer logo no início"
            description="Em uma situação assim, agir com calma não significa agir devagar. O ideal é organizar as informações certas e começar a mobilização de forma responsável."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
          >
            <StepCard
              number="1"
              title="Reúna as informações principais"
              text="Separe nome completo, idade, foto recente, roupas usadas pela última vez, horário aproximado do último contato e características físicas marcantes."
            />
            <StepCard
              number="2"
              title="Verifique locais próximos"
              text="Procure em casa de familiares, amigos, hospitais, escola, trabalho, vizinhança e lugares que a pessoa costuma frequentar."
            />
            <StepCard
              number="3"
              title="Registre a ocorrência"
              text="Busque a autoridade policial e formalize o desaparecimento com o máximo de detalhes possível, levando documentos e uma imagem atual."
            />
            <StepCard
              number="4"
              title="Divulgue com responsabilidade"
              text="Compartilhe informações verificadas, objetivas e com um contato centralizado para evitar ruídos e aumentar a utilidade do alerta."
            />
          </motion.div>
        </section>

        <section className="border-y border-white/10 bg-white/[0.02]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="grid gap-6 rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.05] to-red-500/[0.05] p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
            >
              <div>
                <div className="inline-flex rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                  Importante
                </div>
                <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
                  Tempo importa. Organização também.
                </h2>
              </div>

              <p className="text-sm leading-7 text-zinc-300 sm:text-base">
                Muita gente trava porque não sabe por onde começar. O papel da
                Rede Alerta é transformar angústia em ação mais clara,
                organizada e compartilhável.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionTitle
            eyebrow="Informações essenciais"
            title="O que separar para ajudar na busca"
            description="Quanto mais útil e clara for a informação, melhor será a mobilização de quem receber o alerta."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            <InfoCard
              icon="📷"
              title="Foto recente e nítida"
              text="Prefira uma imagem atual, bem iluminada e com o rosto claramente visível."
            />
            <InfoCard
              icon="🪪"
              title="Dados pessoais"
              text="Nome completo, idade, altura aproximada, sinais particulares e qualquer detalhe importante para identificação."
            />
            <InfoCard
              icon="📍"
              title="Último local visto"
              text="Informe bairro, cidade, horário estimado e contexto do último contato."
            />
            <InfoCard
              icon="👕"
              title="Roupa e aparência"
              text="Descreva como a pessoa estava vestida e se havia mochila, boné, tatuagem, cicatriz ou acessório específico."
            />
            <InfoCard
              icon="📞"
              title="Contato principal"
              text="Use um único número para centralizar informações e evitar desencontro entre família e comunidade."
            />
            <InfoCard
              icon="📝"
              title="Descrição objetiva"
              text="Textos claros e diretos ajudam muito mais do que mensagens confusas ou longas demais."
            />
          </motion.div>
        </section>

        <section className="border-y border-white/10 bg-neutral-900/70">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionTitle
              eyebrow="Atenção"
              title="Erros comuns que atrapalham a divulgação"
              description="Evitar esses pontos já melhora muito a qualidade da mobilização."
            />

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
            >
              <WarningCard
                title="Informação sem checagem"
                text="Boatos e detalhes errados confundem buscas e prejudicam a credibilidade do alerta."
              />
              <WarningCard
                title="Foto antiga ou ruim"
                text="Imagem desatualizada ou de baixa qualidade dificulta reconhecimento."
              />
              <WarningCard
                title="Muitos contatos diferentes"
                text="Quando cada pessoa passa um número, a comunicação vira desencontro."
              />
              <WarningCard
                title="Texto confuso"
                text="Mensagens longas demais ou desorganizadas perdem força no compartilhamento."
              />
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionTitle
            eyebrow="Rede Alerta"
            title="Como a plataforma pode ajudar"
            description="Mesmo sem casos ativos no momento, o site pode funcionar como uma central pública de orientação, preparo e conscientização."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid gap-5 md:grid-cols-3"
          >
            <InfoCard
              icon="✓"
              title="Cadastro mais claro"
              text="Um fluxo simples para reunir informações importantes e preparar uma divulgação mais útil."
            />
            <InfoCard
              icon="↗"
              title="Compartilhamento facilitado"
              text="Organização ajuda familiares, amigos e comunidade a compartilhar melhor cada caso."
            />
            <InfoCard
              icon="◎"
              title="Valor público contínuo"
              text="Mesmo quando não há casos publicados, o projeto continua servindo à população com orientação e informação."
            />
          </motion.div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 lg:px-8 lg:pb-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-red-500/[0.06] p-8 text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
              Próximo passo
            </p>

            <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
              O Rede Alerta também pode ser uma central de informação
            </h2>

            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-zinc-400 sm:text-base">
              Além do guia, a próxima etapa é reunir conteúdos, notícias,
              atualizações e orientações em uma área pública do projeto para
              manter o site ativo, útil e relevante.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/cadastrar"
                className="rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-700/30 transition hover:bg-red-500"
              >
                Cadastrar caso
              </Link>

              <Link
                to="/"
                className="rounded-2xl border border-white/15 px-6 py-3 text-sm font-semibold text-zinc-100 transition hover:border-white/30 hover:bg-white/5"
              >
                Voltar para homepage
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}