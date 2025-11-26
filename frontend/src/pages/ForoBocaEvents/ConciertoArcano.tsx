import type { NextPage } from "next";
import ForoBocaEventPage from "../../components/ForoBocaEventPage";

const ConciertoArcano: NextPage = () => {
    return (
        <ForoBocaEventPage
            title="Concierto Arcano"
            subtitle="Tour 2025"
            backgroundImage="/models/ForoBocaEvents/ConciertoArcano.png"
            events={[
                { id: 8, date: "Jueves 27 de Diciembre, 20:30 hrs" }
            ]}
            prices={[
                { label: "CORO", price: 265 },
                { label: "CORO LATERAL", price: 265 },
                { label: "LUNETA ALTA", price: 309 },
                { label: "LUNETA BAJA", price: 398 },
                { label: "PALCO", price: 398 },
            ]}
        />
    );
};

export default ConciertoArcano;
