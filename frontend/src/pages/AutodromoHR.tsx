import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const AutodromoHR: NextPage = () => {
  return (
    <div style={{ padding: 24 }}>
      <Head>
        <title>Autodromo Hermanos Rodriguez | Tokenpass</title>
      </Head>

      <h1>Autodromo Hermanos Rodriguez</h1>
      <p>Bienvenido al foro. Aquí podrás ver eventos y contenidos.</p>

      <Link href="/" style={{ display: "inline-block", marginTop: 16 }}>
        ← Volver al inicio
      </Link>
    </div>
  );
};

export default AutodromoHR;
