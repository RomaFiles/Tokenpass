import type { NextPage } from "next";
import ForoBocaEventPage from "../../components/ForoBocaEventPage";
import { getFormattedPrices } from "../../data/eventPrices";

const JuanGabriel: NextPage = () => {
    return (
        <ForoBocaEventPage
            title="Juan Gabriel"
            subtitle="Concierto Especial"
            events={[
                { id: 1, date: "Sábado 15 de Diciembre, 20:00 hrs" },
                { id: 2, date: "Domingo 16 de Diciembre, 18:00 hrs" },
            ]}
            prices={getFormattedPrices(1)}
        />
    );
};

export default JuanGabriel;
