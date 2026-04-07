import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function ContentCard({ post }) {
  return (
    <motion.article
      variants={fadeUp}
      className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-red-500/20"
    >
      <div className="h-52 overflow-hidden bg-neutral-900">
        {post.cover_image_url ? (
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.22),transparent_35%),linear-gradient(135deg,#171717,#0a0a0a)]" />
        )}
      </div>

      <div className="p-6">
        <div className="inline-flex rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-300">
          {post.category || "Informações"}
        </div>

        <h3 className="mt-4 text-xl font-black text-white">{post.title}</h3>

        <p className="mt-3 text-sm leading-7 text-zinc-400">
          {post.summary || "Leia mais sobre esta publicação do Rede Alerta."}
        </p>

        <div className="mt-4 text-xs text-zinc-500">
          {post.published_at
            ? new Date(post.published_at).toLocaleDateString("pt-BR")
            : "Sem data"}
        </div>

        <Link
          to={`/informacoes/${post.slug}`}
          className="mt-5 inline-flex text-sm font-semibold text-red-300 transition hover:text-red-200"
        >
          Ler mais →
        </Link>
      </div>
    </motion.article>
  );
}

export default function RedeInformaPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadPosts() {
    try {
      const response = await api.get("/news/public");
      setPosts(response.data);
    } catch (error) {
      console.error("Erro ao carregar notícias públicas:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    document.title = "Informações e Alertas | Rede Alerta";

    let metaDescription = document.querySelector('meta[name="description"]');

    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }

    metaDescription.setAttribute(
      "content",
      "Orientações, atualizações, conteúdos educativos e informações públicas do Rede Alerta."
    );

    loadPosts();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.25),transparent_30%),linear-gradient(to_bottom,rgba(127,29,29,0.18),transparent)]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-red-300"
            >
              Informações e alertas
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-5 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl"
            >
              Conteúdo público para manter o Rede Alerta vivo, útil e relevante
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg"
            >
              Esta área reúne orientações, atualizações, notícias relacionadas e
              conteúdos educativos pensados para informar a comunidade e ampliar
              a utilidade pública do projeto.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                to="/guia"
                className="rounded-2xl bg-red-600 px-6 py-3 text-center text-sm font-semibold shadow-lg shadow-red-700/30 transition hover:bg-red-500"
              >
                Acessar guia
              </Link>

              <Link
                to="/"
                className="rounded-2xl border border-white/15 px-6 py-3 text-center text-sm font-semibold text-zinc-100 transition hover:border-white/30 hover:bg-white/5"
              >
                Voltar ao início
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-10 max-w-3xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
            Publicações
          </p>
          <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
            Informações e conteúdos do projeto
          </h2>
          <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
            Um espaço para orientar, atualizar e manter a comunidade conectada
            ao propósito do Rede Alerta.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-sm text-zinc-400">Carregando publicações...</div>
        ) : posts.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8 text-center">
            <p className="text-lg font-semibold text-white">
              Ainda não há publicações disponíveis.
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              Em breve, esta área contará com orientações, atualizações e
              conteúdos relevantes.
            </p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            {posts.map((post) => (
              <ContentCard key={post.id} post={post} />
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}