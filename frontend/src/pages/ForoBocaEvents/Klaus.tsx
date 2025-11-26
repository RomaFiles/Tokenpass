import type { NextPage } from "next";
import ForoBocaEventPage from "../../components/ForoBocaEventPage";

const Klaus: NextPage = () => {
    return (
        <ForoBocaEventPage
            title="Klaus"
            subtitle="Cinema Foro"
            backgroundImage="/models/ForoBocaEvents/Klaus.png"
            events={[
                { id: 11, date: "Domingo 30 de Diciembre, 16:00 hrs" }
            ]}
            prices={[
                { label: "CORO", price: 130 },
                { label: "CORO LATERAL", price: 130 },
                { label: "LUNETA ALTA", price: 155 },
                { label: "LUNETA BAJA", price: 200 },
                { label: "PALCO", price: 200 },
            ]}
        />
    );
};

export default Klaus;
