import type { NextPage } from "next";
import ForoBocaEventPage from "../../components/ForoBocaEventPage";

const Danzon: NextPage = () => {
    return (
        <ForoBocaEventPage
            title="Concierto de Danzón"
            subtitle="Orquesta Filarmónica de Boca del Rio"
            backgroundImage="/models/ForoBocaEvents/Danzon.png"
            events={[
                { id: 7, date: "Miércoles 26 de Diciembre, 20:00 hrs" }
            ]}
            prices={[
                { label: "CORO", price: 240 },
                { label: "CORO LATERAL", price: 240 },
                { label: "LUNETA ALTA", price: 280 },
                { label: "LUNETA BAJA", price: 360 },
                { label: "PALCO", price: 360 },
            ]}
        />
    );
};

export default Danzon;
