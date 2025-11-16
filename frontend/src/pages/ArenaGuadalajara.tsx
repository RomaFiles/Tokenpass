import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/ArenaGuadalajara.module.css";

const ArenaGuadalajara: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Arena Guadalajara | Tokenpass</title>
      </Head>

      <header className={styles.header}>
        <div className={styles.headerOverlay}></div>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>ARENA</h1>
          <h2 className={styles.subtitle}>GUADALAJARA</h2>
        </div>
        <div className={styles.cityLabel}>Guadalajara, Jalisco</div>
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

export default ArenaGuadalajara;
