import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/ForoBoca.module.css";
import homeStyles from "../styles/Home.module.css";

const ForoBoca: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Foro Boca | Tokenpass</title>
      </Head>

      <header className={styles.header}>
        <div className={styles.headerOverlay}></div>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>FORO</h1>
          <h2 className={styles.subtitle}>BOCA</h2>
        </div>
        <div className={styles.cityLabel}>Boca del Río, Veracruz</div>
      </header>

      <div className={styles.content}>
        <Link href="/" className={styles.backLink}>
          ← Volver al inicio
        </Link>
        <h1>Eventos próximos</h1>

        <div className={homeStyles.grid}>
          <Link
            href="ForoBocaEvents/MemoriasEnAerosol"
            className={`${homeStyles.card} ${homeStyles.cardBg} ${homeStyles.cardLight}`}
            style={{ ["--card-bg" as any]: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%),url('/models/ForoBocaEvents/MemoriasEnAerosol.png')" }}
          >
            <h2>Inauguración de Exposición &rarr;</h2>
            <p>Memorias en aerosol</p>
          </Link>

          <Link
            href="#"
            className={`${homeStyles.card} ${homeStyles.cardBg} ${homeStyles.cardLight}`}
            style={{ ["--card-bg" as any]: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%), url('/models/ForoBocaEvents/DanielSosa.png')" }}
          >
            <h2>Daniel Sosa &rarr;</h2>
            <p>Stand up</p>
          </Link>

          <Link
            href="#"
            className={`${homeStyles.card} ${homeStyles.cardBg} ${homeStyles.cardLight}`}
            style={{ ["--card-bg" as any]: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%), url('/models/ForoBocaEvents/JuanGabrielHomenaje.png')" }}
          >
            <h2>Temático IV | Juan Gabriel Homenaje al divo &rarr;</h2>
            <p>Orquesta Filarmónica de Boca del Rio Veracruz Foro Boca</p>
          </Link>

          <Link
            href="#"
            className={`${homeStyles.card} ${homeStyles.cardBg} ${homeStyles.cardLight}`}
            style={{ ["--card-bg" as any]: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%), url('/models/ForoBocaEvents/BalletFolkloricoMexico.png')" }}
          >
            <h2>Ballet Folklórico de México &rarr;</h2>
            <p>De Amalia Hernández | Director Gral: Salvador López López</p>
          </Link>

          <Link
            href="#"
            className={`${homeStyles.card} ${homeStyles.cardBg} ${homeStyles.cardLight}`}
            style={{ ["--card-bg" as any]: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%), url('/models/ForoBocaEvents/ElCascanueces.png')" }}
          >
            <h2>Temático V | El Cascanueces &rarr;</h2>
            <p>Ballet PROVER Orquesta Filarmónica de Boca del Rio Veracruz Foro Boca</p>
          </Link>

          <Link
            href="#"
            className={`${homeStyles.card} ${homeStyles.cardBg} ${homeStyles.cardLight}`}
            style={{ ["--card-bg" as any]: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%), url('/models/ForoBocaEvents/Danzon.png')" }}
          >
            <h2>Temático VI | Concierto de Danzón &rarr;</h2>
            <p>Orquesta Filarmónica de Boca del Rio – Veracruz Foro Boca</p>
          </Link>

          <Link
            href="#"
            className={`${homeStyles.card} ${homeStyles.cardBg} ${homeStyles.cardLight}`}
            style={{ ["--card-bg" as any]: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%), url('/models/ForoBocaEvents/ConciertoArcano.png')" }}
          >
            <h2>Concierto Arcano &rarr;</h2>
            <p>Tour 2025 | Sala Mester</p>
          </Link>

          <Link
            href="#"
            className={`${homeStyles.card} ${homeStyles.cardBg} ${homeStyles.cardLight}`}
            style={{ ["--card-bg" as any]: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%), url('/models/ForoBocaEvents/ConciertoNavideño.png')" }}
          >
            <h2>Temático VII | Concierto Navideño &rarr;</h2>
            <p>Coro de voces blancas – Orquesta Filarmónica de Boca del Rio – Veracruz Foro Boca</p>
          </Link>

          <Link
            href="#"
            className={`${homeStyles.card} ${homeStyles.cardBg} ${homeStyles.cardLight}`}
            style={{ ["--card-bg" as any]: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%), url('/models/ForoBocaEvents/Einaudi&Zimmer.png')" }}
          >
            <h2>Einaudi & Zimmer &rarr;</h2>
            <p>Vivaldi Solisti Orchestra | Ágora</p>
          </Link>

          <Link
            href="#"
            className={`${homeStyles.card} ${homeStyles.cardBg} ${homeStyles.cardLight}`}
            style={{ ["--card-bg" as any]: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%), url('/models/ForoBocaEvents/Klaus.png')" }}
          >
            <h2>Klaus &rarr;</h2>
            <p>Cinema Foro</p>
          </Link>

          <Link
            href="#"
            className={`${homeStyles.card} ${homeStyles.cardBg} ${homeStyles.cardLight}`}
            style={{ ["--card-bg" as any]: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%), url('/models/ForoBocaEvents/LeQuattroStagioni.png')" }}
          >
            <h2>Le quattro Stagioni &rarr;</h2>
            <p>Antonio Vivaldi | Camerata Opus 11</p>
          </Link>
        </div>

        
      </div>
    </div>
  );
};

export default ForoBoca;
