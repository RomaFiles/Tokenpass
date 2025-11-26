import type { NextPage } from "next";
import ForoBocaEventPage from "../../components/ForoBocaEventPage";

const EinaudiZimmer: NextPage = () => {
    return (
        <ForoBocaEventPage
            title="Einaudi & Zimmer"
            subtitle="Vivaldi Solisti Orchestra"
            backgroundImage="/models/ForoBocaEvents/Einaudi&Zimmer.png"
            events={[
                { id: 10, date: "Sábado 29 de Diciembre, 20:00 hrs" }
            ]}
            prices={[
                { label: "CORO", price: 305 },
                { label: "CORO LATERAL", price: 305 },
                { label: "LUNETA ALTA", price: 355 },
                { label: "LUNETA BAJA", price: 460 },
                { label: "PALCO", price: 460 },
            ]}
        />
    );
};

export default EinaudiZimmer;
