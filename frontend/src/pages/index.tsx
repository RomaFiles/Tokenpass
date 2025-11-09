import { ConnectButton } from "@rainbow-me/rainbowkit";
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
        <div className={styles.connectButtonContainer}>
          <ConnectButton />
        </div>

        <h1 className={styles.title}>
          Bienvenido a <span className={styles.tokenpassTitle}>Tokenpass</span>
        </h1>

        <Descripcion />

        <div className={styles.grid}>
          <Link href="/ForoBoca" className={`${styles.card} ${styles.cardBg} ${styles.ForoBocaCard}`}>
            <h2>Foro Boca &rarr;</h2>
            <p>El espacio del arte y aparador de talento para el país y el mundo</p>
          </Link>

          <a className={`${styles.card} ${styles.cardBg} ${styles.BenitoJuarezCard}`} href="https://wagmi.sh">
            <h2>Auditorio Benito Juarez &rarr;</h2>
            <p>Espacio cultural dedicado a eventos teatrales y artísticos.</p>
          </a>

          <a
            className={`${styles.card} ${styles.cardBg} ${styles.WorldTradeCenterCard}`}
            href="https://github.com/rainbow-me/rainbowkit/tree/main/examples"
          >
            <h2>World Trade Center Veracruz &rarr;</h2>
            <p>Moderno centro de negocios y exposiciones.</p>
          </a>

          <a className={`${styles.card} ${styles.cardBg} ${styles.PalacioBellasArtesCard}`} href="https://nextjs.org/docs">
            <h2>Palacio de Bellas Artes &rarr;</h2>
            <p>Sueño porfiriano, concluido en Revolución, epicentro artístico de México.</p>
          </a>

          <a
            className={`${styles.card} ${styles.cardBg} ${styles.AuditorioNacionalCard}`}
            href="https://github.com/vercel/next.js/tree/canary/examples"
          >
            <h2>Auditorio Nacional &rarr;</h2>
            <p>Recinto mundial de espectáculos, audio e imagen vanguardista.</p>
          </a>

          <a
            className={`${styles.card} ${styles.cardBg} ${styles.ArenaCiudadDeMexicoCard}`}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          >
            <h2>Arena Ciudad de México &rarr;</h2>
            <p>El mejor centro de entretenimiento latinoamericano, con tecnología de punta 360.</p>
          </a>

          <a className={`${styles.card} ${styles.cardBg} ${styles.AutodromoHRCard}`} href="https://nextjs.org/docs">
            <h2>Autódromo Hermanos Rodríguez &rarr;</h2>
            <p>Automovilismo, festivales musicales y Fórmula 1: adrenalina pura.</p>
          </a>

          <a className={`${styles.card} ${styles.cardBg} ${styles.AuditorioBanamexCard}`} href="https://nextjs.org/docs">
            <h2>Auditorio Banamex &rarr;</h2>
            <p>El escenario vibrante que define el entretenimiento regional del norte.</p>
          </a>
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
