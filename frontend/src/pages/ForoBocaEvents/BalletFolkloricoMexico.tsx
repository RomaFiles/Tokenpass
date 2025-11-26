import type { NextPage } from "next";
import ForoBocaEventPage from "../../components/ForoBocaEventPage";

const BalletFolkloricoMexico: NextPage = () => {
    return (
        <ForoBocaEventPage
            title="Ballet Folklórico de México"
            subtitle="De Amalia Hernández"
            backgroundImage="/models/ForoBocaEvents/BalletFolkloricoMexico.png"
            events={[
                { id: 5, date: "Sábado 22 de Diciembre, 18:00 hrs" }
            ]}
            prices={[
                { label: "CORO", price: 320 },
                { label: "CORO LATERAL", price: 320 },
                { label: "LUNETA ALTA", price: 370 },
                { label: "LUNETA BAJA", price: 480 },
                { label: "PALCO", price: 480 },
            ]}
        />
    );
};

export default BalletFolkloricoMexico;
