import type { NextPage } from "next";
import ForoBocaEventPage from "../../components/ForoBocaEventPage";

const MemoriasEnAerosol: NextPage = () => {
    return (
        <ForoBocaEventPage
            title="Memorias en aerosol"
            subtitle="Inauguración de Exposición"
            backgroundImage="/models/ForoBocaEvents/MemoriasEnAerosol.png"
            events={[
                { id: 3, date: "Jueves 20 de Diciembre, 19:00 hrs" }
            ]}
            prices={[
                { label: "CORO", price: 200 },
                { label: "CORO LATERAL", price: 200 },
                { label: "LUNETA ALTA", price: 230 },
                { label: "LUNETA BAJA", price: 300 },
                { label: "PALCO", price: 300 },
            ]}
        />
    );
};

export default MemoriasEnAerosol;
