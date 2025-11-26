import type { NextPage } from "next";
import ForoBocaEventPage from "../../components/ForoBocaEventPage";

const ConciertoNavideno: NextPage = () => {
    return (
        <ForoBocaEventPage
            title="Concierto Navideño"
            subtitle="Coro de voces blancas"
            backgroundImage="/models/ForoBocaEvents/ConciertoNavideño.png"
            events={[
                { id: 9, date: "Viernes 28 de Diciembre, 19:00 hrs" }
            ]}
            prices={[
                { label: "CORO", price: 225 },
                { label: "CORO LATERAL", price: 225 },
                { label: "LUNETA ALTA", price: 260 },
                { label: "LUNETA BAJA", price: 340 },
                { label: "PALCO", price: 340 },
            ]}
        />
    );
};

export default ConciertoNavideno;
