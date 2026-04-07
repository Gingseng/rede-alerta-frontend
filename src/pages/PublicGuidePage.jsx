import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function PublicGuidePage() {
  useEffect(() => {
    document.title = "Guia de Ação | Rede Alerta";

    const description =
      "Saiba o que fazer nas primeiras horas após um desaparecimento. Veja orientações, documentos importantes e como agir com rapidez através da Rede Alerta.";

    let metaDescription = document.querySelector('meta[name="description"]');

    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }

    metaDescription.setAttribute("content", description);
  }, []);

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroGlowOne} />
        <div style={styles.heroGlowTwo} />

        <div style={styles.container}>
          <div style={styles.heroContent}>
            <span style={styles.badge}>Utilidade pública</span>

            <h1 style={styles.heroTitle}>
              Saiba como agir nas primeiras horas de um desaparecimento
            </h1>

            <p style={styles.heroText}>
              Informação certa, no momento certo, pode fazer diferença. Esta
              página foi criada para orientar famílias, amigos e toda a
              comunidade sobre os primeiros passos diante de um desaparecimento.
            </p>

            <div style={styles.heroButtons}>
              <Link to="/cadastrar" style={styles.primaryButton}>
                Cadastrar caso
              </Link>

              <a href="#primeiros-passos" style={styles.secondaryButton}>
                Ver orientações
              </a>
            </div>

            <div style={styles.heroMiniCards}>
              <div style={styles.miniCard}>
                <strong style={styles.miniCardStrong}>Ação rápida</strong>
                <span style={styles.miniCardText}>
                  Organize informações sem perder tempo.
                </span>
              </div>

              <div style={styles.miniCard}>
                <strong style={styles.miniCardStrong}>Divulgação correta</strong>
                <span style={styles.miniCardText}>
                  Compartilhe com clareza e responsabilidade.
                </span>
              </div>

              <div style={styles.miniCard}>
                <strong style={styles.miniCardStrong}>Rede de apoio</strong>
                <span style={styles.miniCardText}>
                  Prepare a comunidade antes de um caso acontecer.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main style={styles.main}>
        <section id="primeiros-passos" style={styles.section}>
          <div style={styles.container}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionEyebrow}>Primeiros passos</span>
              <h2 style={styles.sectionTitle}>
                O que fazer logo no início
              </h2>
              <p style={styles.sectionDescription}>
                Em situações assim, o mais importante é agir com calma, reunir
                dados confiáveis e começar a mobilização com responsabilidade.
              </p>
            </div>

            <div style={styles.stepsGrid}>
              <article style={styles.stepCard}>
                <div style={styles.stepNumber}>1</div>
                <h3 style={styles.stepTitle}>Reúna as informações principais</h3>
                <p style={styles.stepText}>
                  Separe nome completo, idade, foto recente, roupas usadas pela
                  última vez, características físicas e horário aproximado do
                  último contato.
                </p>
              </article>

              <article style={styles.stepCard}>
                <div style={styles.stepNumber}>2</div>
                <h3 style={styles.stepTitle}>Verifique lugares próximos</h3>
                <p style={styles.stepText}>
                  Procure em locais que a pessoa costuma frequentar, como casa
                  de familiares, amigos, escola, trabalho, hospitais e
                  vizinhança.
                </p>
              </article>

              <article style={styles.stepCard}>
                <div style={styles.stepNumber}>3</div>
                <h3 style={styles.stepTitle}>Registre a ocorrência</h3>
                <p style={styles.stepText}>
                  Procure a autoridade policial e formalize o caso com o máximo
                  de detalhes possível. Leve documentos e foto recente.
                </p>
              </article>

              <article style={styles.stepCard}>
                <div style={styles.stepNumber}>4</div>
                <h3 style={styles.stepTitle}>Divulgue com clareza</h3>
                <p style={styles.stepText}>
                  Use informações corretas, um contato centralizado e uma imagem
                  atual. Isso aumenta a utilidade da divulgação e evita ruídos.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section style={styles.highlightSection}>
          <div style={styles.container}>
            <div style={styles.highlightCard}>
              <div style={styles.highlightLeft}>
                <span style={styles.highlightTag}>Importante</span>
                <h2 style={styles.highlightTitle}>
                  Tempo importa. Organização também.
                </h2>
              </div>

              <div style={styles.highlightRight}>
                <p style={styles.highlightText}>
                  Muitas famílias travam por não saber por onde começar. O papel
                  da Rede Alerta é justamente transformar angústia em ação
                  organizada, com uma comunicação mais clara e acessível.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.container}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionEyebrow}>Informações essenciais</span>
              <h2 style={styles.sectionTitle}>
                O que separar para ajudar na busca
              </h2>
            </div>

            <div style={styles.infoGrid}>
              <article style={styles.infoCard}>
                <h3 style={styles.infoTitle}>Foto recente e nítida</h3>
                <p style={styles.infoText}>
                  Prefira uma imagem atual, com boa iluminação e rosto visível.
                </p>
              </article>

              <article style={styles.infoCard}>
                <h3 style={styles.infoTitle}>Dados pessoais</h3>
                <p style={styles.infoText}>
                  Nome completo, idade, altura aproximada, sinais particulares e
                  qualquer detalhe útil para identificação.
                </p>
              </article>

              <article style={styles.infoCard}>
                <h3 style={styles.infoTitle}>Último local visto</h3>
                <p style={styles.infoText}>
                  Informe bairro, cidade, horário estimado e circunstâncias do
                  último contato.
                </p>
              </article>

              <article style={styles.infoCard}>
                <h3 style={styles.infoTitle}>Roupa e aparência</h3>
                <p style={styles.infoText}>
                  Diga como a pessoa estava vestida e se havia mochila, boné,
                  tatuagem, cicatriz ou algum acessório específico.
                </p>
              </article>

              <article style={styles.infoCard}>
                <h3 style={styles.infoTitle}>Contato principal</h3>
                <p style={styles.infoText}>
                  Tenha um único número de telefone para concentrar as
                  informações e evitar desencontro.
                </p>
              </article>

              <article style={styles.infoCard}>
                <h3 style={styles.infoTitle}>Descrição objetiva</h3>
                <p style={styles.infoText}>
                  Quanto mais clara for a descrição, mais útil será a
                  mobilização das pessoas que receberem o alerta.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section style={styles.sectionDark}>
          <div style={styles.container}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionEyebrowDark}>Atenção</span>
              <h2 style={styles.sectionTitleDark}>
                Erros comuns que atrapalham a divulgação
              </h2>
              <p style={styles.sectionDescriptionDark}>
                Evitar esses erros ajuda o caso a circular de forma mais clara e
                mais confiável.
              </p>
            </div>

            <div style={styles.warningGrid}>
              <article style={styles.warningCard}>
                <h3 style={styles.warningTitle}>Informação sem checagem</h3>
                <p style={styles.warningText}>
                  Boatos e detalhes errados confundem buscas e reduzem a
                  credibilidade do alerta.
                </p>
              </article>

              <article style={styles.warningCard}>
                <h3 style={styles.warningTitle}>Foto antiga ou ruim</h3>
                <p style={styles.warningText}>
                  Imagens desatualizadas dificultam o reconhecimento no dia a
                  dia.
                </p>
              </article>

              <article style={styles.warningCard}>
                <h3 style={styles.warningTitle}>Muitos contatos diferentes</h3>
                <p style={styles.warningText}>
                  Centralizar o recebimento das informações facilita a
                  organização da família e da equipe de apoio.
                </p>
              </article>

              <article style={styles.warningCard}>
                <h3 style={styles.warningTitle}>Descrição confusa</h3>
                <p style={styles.warningText}>
                  Textos longos demais ou desorganizados fazem a mensagem perder
                  força na hora do compartilhamento.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.container}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionEyebrow}>Rede Alerta</span>
              <h2 style={styles.sectionTitle}>Como a plataforma pode ajudar</h2>
              <p style={styles.sectionDescription}>
                Mesmo antes de um caso ser registrado, o site pode funcionar
                como uma central de orientação, preparo e conscientização.
              </p>
            </div>

            <div style={styles.helpGrid}>
              <article style={styles.helpCard}>
                <div style={styles.helpIcon}>✓</div>
                <h3 style={styles.helpTitle}>Cadastro simples</h3>
                <p style={styles.helpText}>
                  Um fluxo mais claro para reunir informações importantes e
                  deixar o caso pronto para divulgação.
                </p>
              </article>

              <article style={styles.helpCard}>
                <div style={styles.helpIcon}>✓</div>
                <h3 style={styles.helpTitle}>Compartilhamento facilitado</h3>
                <p style={styles.helpText}>
                  Informações organizadas ajudam familiares, amigos e a
                  comunidade a compartilhar melhor.
                </p>
              </article>

              <article style={styles.helpCard}>
                <div style={styles.helpIcon}>✓</div>
                <h3 style={styles.helpTitle}>Valor público contínuo</h3>
                <p style={styles.helpText}>
                  Mesmo sem casos ativos, a plataforma continua útil para
                  orientar, informar e atrair visitantes.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section style={styles.ctaSection}>
          <div style={styles.container}>
            <div style={styles.ctaCard}>
              <div style={styles.ctaContent}>
                <span style={styles.ctaEyebrow}>Rede Alerta</span>
                <h2 style={styles.ctaTitle}>
                  Transforme o site em uma central pública de orientação
                </h2>
                <p style={styles.ctaText}>
                  Esta página é o começo. Além de ajudar famílias e visitantes,
                  ela também fortalece o tráfego orgânico e dá mais utilidade ao
                  projeto mesmo quando não há casos publicados.
                </p>

                <div style={styles.ctaButtons}>
                  <Link to="/cadastrar" style={styles.primaryButton}>
                    Cadastrar um caso
                  </Link>

                  <Link to="/" style={styles.ctaSecondaryButton}>
                    Voltar para o início
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #061019 0%, #08131d 35%, #0a141d 100%)",
    color: "#ffffff",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  main: {
    position: "relative",
    zIndex: 1,
  },

  container: {
    width: "100%",
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "0 20px",
    boxSizing: "border-box",
  },

  hero: {
    position: "relative",
    overflow: "hidden",
    padding: "96px 0 72px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    background:
      "linear-gradient(135deg, rgba(10,22,34,0.95) 0%, rgba(11,28,44,0.98) 50%, rgba(8,18,28,1) 100%)",
  },

  heroGlowOne: {
    position: "absolute",
    width: "420px",
    height: "420px",
    borderRadius: "999px",
    background: "rgba(36, 143, 255, 0.18)",
    filter: "blur(80px)",
    top: "-80px",
    right: "-100px",
    pointerEvents: "none",
  },

  heroGlowTwo: {
    position: "absolute",
    width: "300px",
    height: "300px",
    borderRadius: "999px",
    background: "rgba(111, 230, 255, 0.10)",
    filter: "blur(70px)",
    bottom: "-60px",
    left: "-60px",
    pointerEvents: "none",
  },

  heroContent: {
    maxWidth: "900px",
    position: "relative",
    zIndex: 1,
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.09)",
    color: "#cfe7ff",
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "0.03em",
    marginBottom: "18px",
  },

  heroTitle: {
    fontSize: "clamp(2.2rem, 5vw, 4rem)",
    lineHeight: 1.06,
    letterSpacing: "-0.03em",
    margin: "0 0 18px",
    maxWidth: "860px",
  },

  heroText: {
    margin: "0 0 28px",
    maxWidth: "760px",
    fontSize: "1.08rem",
    lineHeight: 1.8,
    color: "#d4e2ee",
  },

  heroButtons: {
    display: "flex",
    flexWrap: "wrap",
    gap: "14px",
    marginBottom: "30px",
  },

  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 22px",
    borderRadius: "14px",
    background:
      "linear-gradient(135deg, #2391ff 0%, #167dff 100%)",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "0.98rem",
    boxShadow: "0 14px 34px rgba(35, 145, 255, 0.25)",
    border: "1px solid rgba(255,255,255,0.06)",
  },

  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 22px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.03)",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "0.98rem",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(8px)",
  },

  heroMiniCards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
    marginTop: "10px",
  },

  miniCard: {
    padding: "18px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    backdropFilter: "blur(10px)",
  },

  miniCardStrong: {
    display: "block",
    fontSize: "0.98rem",
    marginBottom: "6px",
  },

  miniCardText: {
    display: "block",
    color: "#c7d7e5",
    fontSize: "0.95rem",
    lineHeight: 1.6,
  },

  section: {
    padding: "80px 0 16px",
  },

  sectionDark: {
    padding: "80px 0 22px",
    background:
      "linear-gradient(180deg, rgba(7,12,18,0.95) 0%, rgba(10,12,16,1) 100%)",
    borderTop: "1px solid rgba(255,255,255,0.04)",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    marginTop: "34px",
  },

  sectionHeader: {
    marginBottom: "28px",
    maxWidth: "760px",
  },

  sectionEyebrow: {
    display: "inline-block",
    color: "#84c5ff",
    fontWeight: 700,
    fontSize: "0.82rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "10px",
  },

  sectionEyebrowDark: {
    display: "inline-block",
    color: "#ffc98a",
    fontWeight: 700,
    fontSize: "0.82rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "10px",
  },

  sectionTitle: {
    fontSize: "clamp(1.7rem, 3vw, 2.5rem)",
    lineHeight: 1.15,
    letterSpacing: "-0.02em",
    margin: "0 0 12px",
    color: "#ffffff",
  },

  sectionTitleDark: {
    fontSize: "clamp(1.7rem, 3vw, 2.5rem)",
    lineHeight: 1.15,
    letterSpacing: "-0.02em",
    margin: "0 0 12px",
    color: "#ffffff",
  },

  sectionDescription: {
    color: "#bfd0de",
    fontSize: "1rem",
    lineHeight: 1.8,
    margin: 0,
  },

  sectionDescriptionDark: {
    color: "#d4d8dd",
    fontSize: "1rem",
    lineHeight: 1.8,
    margin: 0,
  },

  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "18px",
  },

  stepCard: {
    background:
      "linear-gradient(180deg, rgba(15,28,39,1) 0%, rgba(11,22,31,1) 100%)",
    borderRadius: "22px",
    padding: "24px",
    border: "1px solid rgba(255,255,255,0.06)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
  },

  stepNumber: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg, #2391ff 0%, #47b0ff 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    marginBottom: "16px",
    boxShadow: "0 10px 22px rgba(35, 145, 255, 0.18)",
  },

  stepTitle: {
    fontSize: "1.05rem",
    lineHeight: 1.35,
    margin: "0 0 10px",
  },

  stepText: {
    margin: 0,
    color: "#c9d7e2",
    lineHeight: 1.75,
    fontSize: "0.97rem",
  },

  highlightSection: {
    padding: "36px 0 0",
  },

  highlightCard: {
    display: "grid",
    gridTemplateColumns: "1.1fr 1fr",
    gap: "24px",
    padding: "30px",
    borderRadius: "24px",
    background:
      "linear-gradient(135deg, #eaf7ff 0%, #f6fbff 48%, #ffffff 100%)",
    color: "#08131d",
    border: "1px solid rgba(255,255,255,0.55)",
  },

  highlightLeft: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  highlightRight: {
    display: "flex",
    alignItems: "center",
  },

  highlightTag: {
    display: "inline-block",
    width: "fit-content",
    padding: "7px 12px",
    borderRadius: "999px",
    background: "rgba(8,19,29,0.08)",
    color: "#0b2840",
    fontSize: "0.78rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "14px",
  },

  highlightTitle: {
    margin: 0,
    fontSize: "clamp(1.5rem, 2.8vw, 2.3rem)",
    lineHeight: 1.15,
    letterSpacing: "-0.02em",
  },

  highlightText: {
    margin: 0,
    color: "#314454",
    fontSize: "1rem",
    lineHeight: 1.8,
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
  },

  infoCard: {
    padding: "22px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
  },

  infoTitle: {
    margin: "0 0 10px",
    fontSize: "1rem",
    lineHeight: 1.35,
  },

  infoText: {
    margin: 0,
    color: "#c9d7e2",
    lineHeight: 1.7,
    fontSize: "0.96rem",
  },

  warningGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
  },

  warningCard: {
    padding: "22px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
  },

  warningTitle: {
    margin: "0 0 10px",
    color: "#ffcc8f",
    fontSize: "1rem",
    lineHeight: 1.35,
  },

  warningText: {
    margin: 0,
    color: "#dcd6cf",
    lineHeight: 1.72,
    fontSize: "0.96rem",
  },

  helpGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px",
  },

  helpCard: {
    padding: "24px",
    borderRadius: "22px",
    background:
      "linear-gradient(180deg, rgba(15,28,39,1) 0%, rgba(11,22,31,1) 100%)",
    border: "1px solid rgba(255,255,255,0.06)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.14)",
  },

  helpIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(35, 145, 255, 0.12)",
    color: "#7cc1ff",
    fontWeight: 800,
    marginBottom: "14px",
    border: "1px solid rgba(35,145,255,0.18)",
  },

  helpTitle: {
    margin: "0 0 10px",
    fontSize: "1.03rem",
  },

  helpText: {
    margin: 0,
    color: "#c8d6e1",
    lineHeight: 1.75,
    fontSize: "0.97rem",
  },

  ctaSection: {
    padding: "84px 0 100px",
  },

  ctaCard: {
    borderRadius: "28px",
    overflow: "hidden",
    background:
      "linear-gradient(135deg, #ffffff 0%, #edf7ff 48%, #dbeeff 100%)",
    boxShadow: "0 22px 50px rgba(0,0,0,0.18)",
  },

  ctaContent: {
    padding: "40px",
    color: "#08131d",
  },

  ctaEyebrow: {
    display: "inline-block",
    color: "#22649f",
    fontWeight: 700,
    fontSize: "0.82rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "12px",
  },

  ctaTitle: {
    margin: "0 0 14px",
    fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
    lineHeight: 1.12,
    letterSpacing: "-0.02em",
    maxWidth: "860px",
  },

  ctaText: {
    margin: "0 0 24px",
    color: "#3b4c5a",
    lineHeight: 1.8,
    fontSize: "1rem",
    maxWidth: "820px",
  },

  ctaButtons: {
    display: "flex",
    flexWrap: "wrap",
    gap: "14px",
  },

  ctaSecondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 22px",
    borderRadius: "14px",
    background: "transparent",
    color: "#08131d",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "0.98rem",
    border: "1px solid rgba(8,19,29,0.14)",
  },
};