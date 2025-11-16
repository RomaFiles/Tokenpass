import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/AuditorioBanamex.module.css";

const AuditorioBanamex: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Auditorio Banamex | Tokenpass</title>
      </Head>

      <header className={styles.header}>
        <div className={styles.headerOverlay}></div>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>AUDITORIO</h1>
          <h2 className={styles.subtitle}>BANAMEX</h2>
        </div>
        <div className={styles.cityLabel}>Monterrey, Nuevo León</div>
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

export default AuditorioBanamex;
