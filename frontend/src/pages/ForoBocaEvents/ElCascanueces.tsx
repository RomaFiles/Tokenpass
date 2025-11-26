import type { NextPage } from "next";
import ForoBocaEventPage from "../../components/ForoBocaEventPage";

const ElCascanueces: NextPage = () => {
    return (
        <ForoBocaEventPage
            title="El Cascanueces"
            subtitle="Ballet PROVER"
            backgroundImage="/models/ForoBocaEvents/ElCascanueces.png"
            events={[
                { id: 6, date: "Domingo 23 de Diciembre, 17:00 hrs" }
            ]}
            prices={[
                { label: "CORO", price: 330 },
                { label: "CORO LATERAL", price: 330 },
                { label: "LUNETA ALTA", price: 385 },
                { label: "LUNETA BAJA", price: 500 },
                { label: "PALCO", price: 500 },
            ]}
        />
    );
};

export default ElCascanueces;
