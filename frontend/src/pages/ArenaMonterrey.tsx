import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/ArenaMonterrey.module.css";
import homeStyles from "../styles/Home.module.css";

const ArenaMonterrey: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Arena Monterrey | Tokenpass</title>
      </Head>

      <header className={styles.header}>
        <div className={styles.headerOverlay}></div>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>ARENA</h1>
          <h2 className={styles.subtitle}>MONTERREY</h2>
        </div>
        <div className={styles.cityLabel}>Monterrey, Nuevo León</div>
      </header>

      <div className={styles.content}>
        <Link href="/" className={styles.backLink}>
          ← Volver al inicio
        </Link>
        <h1>Eventos próximos</h1>

        <div className={homeStyles.grid}>
          <Link href="#" className={`${homeStyles.card} ${homeStyles.cardBg} ${homeStyles.cardLight}`}
            style={{ ["--card-bg" as any]: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%), url('/models/ArenaMonterreyEvents/concierto-sinfonico.jpg')" }}>
            <h2>Concierto Sinfónico &rarr;</h2>
            <p>Una noche de música clásica con orquesta completa.</p>
          </Link>

          <Link href="#" className={`${homeStyles.card} ${homeStyles.cardBg} ${homeStyles.cardLight}`}
            style={{ ["--card-bg" as any]: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%), url('/models/ArenaMonterreyEvents/noche-jazz.jpg')" }}>
            <h2>Noche de Jazz &rarr;</h2>
            <p>Improvisación y ritmo con grandes talentos del jazz.</p>
          </Link>

          <Link href="#" className={`${homeStyles.card} ${homeStyles.cardBg} ${homeStyles.cardLight}`}
            style={{ ["--card-bg" as any]: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%), url('/models/ArenaMonterreyEvents/opera-gala.jpg')" }}>
            <h2>Ópera Gala &rarr;</h2>
            <p>Voces extraordinarias en arias legendarias.</p>
          </Link>

          <Link href="#" className={`${homeStyles.card} ${homeStyles.cardBg} ${homeStyles.cardLight}`}
            style={{ ["--card-bg" as any]: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%), url('/models/ArenaMonterreyEvents/ballet-contemporaneo.jpg')" }}>
            <h2>Ballet Contemporáneo &rarr;</h2>
            <p>Danza, expresión y movimiento en escena.</p>
          </Link>

          <Link href="#" className={`${homeStyles.card} ${homeStyles.cardBg} ${homeStyles.cardLight}`}
            style={{ ["--card-bg" as any]: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%), url('/models/ArenaMonterreyEvents/recital-piano.jpg')" }}>
            <h2>Recital de Piano &rarr;</h2>
            <p>Virtuosismo al teclado con repertorio inolvidable.</p>
          </Link>

          <Link href="#" className={`${homeStyles.card} ${homeStyles.cardBg} ${homeStyles.cardLight}`}
            style={{ ["--card-bg" as any]: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%), url('/models/ArenaMonterreyEvents/festival-camara.jpg')" }}>
            <h2>Festival de Cámara &rarr;</h2>
            <p>Ensamble íntimo con obras maestras.</p>
          </Link>

          <Link href="#" className={`${homeStyles.card} ${homeStyles.cardBg} ${homeStyles.cardLight}`}
            style={{ ["--card-bg" as any]: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%), url('/models/ArenaMonterreyEvents/coral-orquesta.jpg')" }}>
            <h2>Coral y Orquesta &rarr;</h2>
            <p>Grandes coros en armonía monumental.</p>
          </Link>

          <Link href="#" className={`${homeStyles.card} ${homeStyles.cardBg} ${homeStyles.cardLight}`}
            style={{ ["--card-bg" as any]: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%), url('/models/ArenaMonterreyEvents/noche-rock.jpg')" }}>
            <h2>Noche de Rock &rarr;</h2>
            <p>Clásicos eléctricos y energía en vivo.</p>
          </Link>

          <Link href="#" className={`${homeStyles.card} ${homeStyles.cardBg} ${homeStyles.cardLight}`}
            style={{ ["--card-bg" as any]: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%), url('/models/ArenaMonterreyEvents/festival-familiar.jpg')" }}>
            <h2>Festival Familiar &rarr;</h2>
            <p>Actividades y música para todas las edades.</p>
          </Link>

          <Link href="#" className={`${homeStyles.card} ${homeStyles.cardBg} ${homeStyles.cardLight}`}
            style={{ ["--card-bg" as any]: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%), url('/models/ArenaMonterreyEvents/gala-navidena.jpg')" }}>
            <h2>Gala Navideña &rarr;</h2>
            <p>Tradición y villancicos en temporada decembrina.</p>
          </Link>

          <Link href="#" className={`${homeStyles.card} ${homeStyles.cardBg} ${homeStyles.cardLight}`}
            style={{ ["--card-bg" as any]: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%), url('/models/ArenaMonterreyEvents/cine-musical.jpg')" }}>
            <h2>Cine Musical &rarr;</h2>
            <p>Proyección con orquesta en vivo.</p>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ArenaMonterrey;
