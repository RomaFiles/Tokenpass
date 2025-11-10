import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const PalacioBellasArtes: NextPage = () => {
  return (
    <div style={{ padding: 24 }}>
      <Head>
        <title>Palacio de Bellas Artes | Tokenpass</title>
      </Head>

      <h1>Palacio de Bellas Artes</h1>
      <p>Bienvenido al foro. Aquí podrás ver eventos y contenidos.</p>

      <Link href="/" style={{ display: "inline-block", marginTop: 16 }}>
        ← Volver al inicio
      </Link>
    </div>
  );
};

export default PalacioBellasArtes;
