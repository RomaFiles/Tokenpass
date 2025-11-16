import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/PalacioBellasArtes.module.css";

const PalacioBellasArtes: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Palacio de Bellas Artes | Tokenpass</title>
      </Head>

      <header className={styles.header}>
        <div className={styles.headerOverlay}></div>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>PALACIO</h1>
          <h2 className={styles.subtitle}>DE BELLAS ARTES</h2>
        </div>
        <div className={styles.cityLabel}>Ciudad de México, CDMX</div>
      </header>

      <div className={styles.content}>
        <p>Bienvenido al foro. Aquí podrás ver eventos y contenidos.</p>

        <Link href="/" className={styles.backLink}>
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default PalacioBellasArtes;
