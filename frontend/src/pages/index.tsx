import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Tokenpass</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Bienvenido a <span className={styles.tokenpassTitle}>Tokenpass</span>
        </h1>

        <Descripcion />

        <div className={styles.grid}>
          <Link href="/ForoBoca" className={`${styles.card} ${styles.cardBg} ${styles.ForoBocaCard}`}>
            <h2>Foro Boca &rarr;</h2>
            <p>El espacio del arte y aparador de talento para el país y el mundo</p>
          </Link>

          <Link href="/ArenaMonterrey" className={`${styles.card} ${styles.cardBg} ${styles.ArenaMonterrey}`}>
            <h2>Arena Monterrey &rarr;</h2>
            <p>Lujo y tecnología: la quinta arena más activa del mundo.</p>
          </Link>

          <Link href="/ArenaGuadalajara" className={`${styles.card} ${styles.cardBg} ${styles.ArenaGuadalajaraCard}`}>
            <h2>Arena Guadalajara &rarr;</h2>
            <p>Recinto con acústica superior, el futuro del entretenimiento tapatío.</p>
          </Link>

          <Link href="/PalacioBellasArtes" className={`${styles.card} ${styles.cardBg} ${styles.PalacioBellasArtesCard}`}>
            <h2>Palacio de Bellas Artes &rarr;</h2>
            <p>Sueño porfiriano, concluido en Revolución, centro artístico de México.</p>
          </Link>

          <Link href="/AuditorioNacional" className={`${styles.card} ${styles.cardBg} ${styles.AuditorioNacionalCard}`}>
            <h2>Auditorio Nacional &rarr;</h2>
            <p>Recinto mundial de espectáculos, audio e imagen vanguardista.</p>
          </Link>

          <Link href="/ArenaCDMX" className={`${styles.card} ${styles.cardBg} ${styles.ArenaCiudadDeMexicoCard}`}>
            <h2>Arena Ciudad de México &rarr;</h2>
            <p>El mejor centro de entretenimiento latinoamericano.</p>
          </Link>

          <Link href="/AutodromoHR" className={`${styles.card} ${styles.cardBg} ${styles.AutodromoHRCard}`}>
            <h2>Autódromo Hermanos Rodríguez &rarr;</h2>
            <p>Automovilismo, festivales musicales y Fórmula 1: adrenalina pura.</p>
          </Link>

          <Link href="/AuditorioBanamex" className={`${styles.card} ${styles.cardBg} ${styles.AuditorioBanamexCard}`}>
            <h2>Auditorio Banamex &rarr;</h2>
            <p>El escenario vibrante que define el entretenimiento regional del norte.</p>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://rainbow.me" rel="noopener noreferrer" target="_blank">
          Rodrigo Magaña Barocio
        </a>
      </footer>
    </div>
  );
};

export default Home;

const Descripcion = () => {
  const preText = "Tu lugar para boletos 100% auténticos. Garantía ";
  const codeText = "Blockchain.";
  const totalLength = preText.length + codeText.length;

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= totalLength) return;
    const tick = setInterval(() => {
      setIndex((i) => Math.min(i + 1, totalLength));
    }, 45);
    return () => clearInterval(tick);
  }, [index, totalLength]);

  const shownPre = preText.slice(0, Math.min(index, preText.length));
  const shownCode = index > preText.length ? codeText.slice(0, index - preText.length) : "";
  const hasReachedBlockchain = index >= preText.length;

  return (
    <p className={styles.description}>
      <span>{shownPre}</span>
      {hasReachedBlockchain && (
        <code className={styles.code}>
          {shownCode}
          <span className={styles.cursor}>|</span>
        </code>
      )}
    </p>
  );
};
