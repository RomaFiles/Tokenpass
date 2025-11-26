import type { NextPage } from "next";
import ForoBocaEventPage from "../../components/ForoBocaEventPage";

const DanielSosa: NextPage = () => {
    return (
        <ForoBocaEventPage
            title="Daniel Sosa"
            subtitle="Stand up"
            backgroundImage="/models/ForoBocaEvents/DanielSosa.png"
            events={[
                { id: 4, date: "Viernes 21 de Diciembre, 21:00 hrs" }
            ]}
            prices={[
                { label: "CORO", price: 290 },
                { label: "CORO LATERAL", price: 290 },
                { label: "LUNETA ALTA", price: 340 },
                { label: "LUNETA BAJA", price: 440 },
                { label: "PALCO", price: 440 },
            ]}
        />
    );
};

export default DanielSosa;
