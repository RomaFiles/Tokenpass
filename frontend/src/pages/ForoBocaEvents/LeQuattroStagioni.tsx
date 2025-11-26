import type { NextPage } from "next";
import ForoBocaEventPage from "../../components/ForoBocaEventPage";

const LeQuattroStagioni: NextPage = () => {
    return (
        <ForoBocaEventPage
            title="Le quattro Stagioni"
            subtitle="Antonio Vivaldi"
            backgroundImage="/models/ForoBocaEvents/LeQuattroStagioni.png"
            events={[
                { id: 12, date: "Lunes 31 de Diciembre, 18:00 hrs" }
            ]}
            prices={[
                { label: "CORO", price: 280 },
                { label: "CORO LATERAL", price: 280 },
                { label: "LUNETA ALTA", price: 325 },
                { label: "LUNETA BAJA", price: 420 },
                { label: "PALCO", price: 420 },
            ]}
        />
    );
};

export default LeQuattroStagioni;
