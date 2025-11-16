import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/ForoBoca.module.css";

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
        <p>Bienvenido al foro. Aquí podrás ver eventos y contenidos.</p>

        <Link href="/" className={styles.backLink}>
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default ForoBoca;
