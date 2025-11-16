import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/AutodromoHR.module.css";
import homeStyles from "../styles/Home.module.css";

const AutodromoHR: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Autódromo Hermanos Rodríguez | Tokenpass</title>
      </Head>

      <header className={styles.header}>
        <div className={styles.headerOverlay}></div>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>AUTÓDROMO</h1>
          <h2 className={styles.subtitle}>HERMANOS RODRÍGUEZ</h2>
        </div>
        <div className={styles.cityLabel}>Ciudad de México, CDMX</div>
      </header>

      <div className={styles.content}>
        <Link href="/" className={styles.backLink}>
          ← Volver al inicio
        </Link>
        <h1>Eventos próximos</h1>

        <div className={homeStyles.grid}>
          <Link href="#" className={`${homeStyles.card} ${homeStyles.cardBg}`}>
            <h2>Concierto Sinfónico &rarr;</h2>
            <p>Una noche de música clásica con orquesta completa.</p>
          </Link>

          <Link href="#" className={`${homeStyles.card} ${homeStyles.cardBg}`}>
            <h2>Noche de Jazz &rarr;</h2>
            <p>Improvisación y ritmo con grandes talentos del jazz.</p>
          </Link>

          <Link href="#" className={`${homeStyles.card} ${homeStyles.cardBg}`}>
            <h2>Ópera Gala &rarr;</h2>
            <p>Voces extraordinarias en arias legendarias.</p>
          </Link>

          <Link href="#" className={`${homeStyles.card} ${homeStyles.cardBg}`}>
            <h2>Ballet Contemporáneo &rarr;</h2>
            <p>Danza, expresión y movimiento en escena.</p>
          </Link>

          <Link href="#" className={`${homeStyles.card} ${homeStyles.cardBg}`}>
            <h2>Recital de Piano &rarr;</h2>
            <p>Virtuosismo al teclado con repertorio inolvidable.</p>
          </Link>

          <Link href="#" className={`${homeStyles.card} ${homeStyles.cardBg}`}>
            <h2>Festival de Cámara &rarr;</h2>
            <p>Ensamble íntimo con obras maestras.</p>
          </Link>

          <Link href="#" className={`${homeStyles.card} ${homeStyles.cardBg}`}>
            <h2>Coral y Orquesta &rarr;</h2>
            <p>Grandes coros en armonía monumental.</p>
          </Link>

          <Link href="#" className={`${homeStyles.card} ${homeStyles.cardBg}`}>
            <h2>Noche de Rock &rarr;</h2>
            <p>Clásicos eléctricos y energía en vivo.</p>
          </Link>

          <Link href="#" className={`${homeStyles.card} ${homeStyles.cardBg}`}>
            <h2>Festival Familiar &rarr;</h2>
            <p>Actividades y música para todas las edades.</p>
          </Link>

          <Link href="#" className={`${homeStyles.card} ${homeStyles.cardBg}`}>
            <h2>Gala Navideña &rarr;</h2>
            <p>Tradición y villancicos en temporada decembrina.</p>
          </Link>

          <Link href="#" className={`${homeStyles.card} ${homeStyles.cardBg}`}>
            <h2>Cine Musical &rarr;</h2>
            <p>Proyección con orquesta en vivo.</p>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AutodromoHR;
