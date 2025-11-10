import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const ArenaCDMX: NextPage = () => {
  return (
    <div style={{ padding: 24 }}>
      <Head>
        <title>Arena Ciudad de Mexico | Tokenpass</title>
      </Head>

      <h1>Arena Ciudad de Mexico</h1>
      <p>Bienvenido al foro. Aquí podrás ver eventos y contenidos.</p>

      <Link href="/" style={{ display: "inline-block", marginTop: 16 }}>
        ← Volver al inicio
      </Link>
    </div>
  );
};

export default ArenaCDMX;
