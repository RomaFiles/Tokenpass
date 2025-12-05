import type { NextPage } from "next";
import ForoBocaEventPage from "../../components/ForoBocaEventPage";
import { getFormattedPrices } from "../../data/eventPrices";

const MemoriasEnAerosol: NextPage = () => {
    return (
        <ForoBocaEventPage
            title="Memorias en aerosol"
            subtitle="Inauguración de Exposición"
            backgroundImage="/models/ForoBocaEvents/MemoriasEnAerosol.png"
            events={[
                { id: 3, date: "Jueves 20 de Diciembre, 19:00 hrs" }
            ]}
            prices={getFormattedPrices(3)}
        />
    );
};

export default MemoriasEnAerosol;
