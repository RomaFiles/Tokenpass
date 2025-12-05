import type { NextPage } from "next";
import ForoBocaEventPage from "../../components/ForoBocaEventPage";
import { getFormattedPrices } from "../../data/eventPrices";

const DanielSosa: NextPage = () => {
    return (
        <ForoBocaEventPage
            title="Daniel Sosa"
            subtitle="Stand up"
            backgroundImage="/models/ForoBocaEvents/DanielSosa.png"
            events={[
                { id: 4, date: "Viernes 21 de Diciembre, 21:00 hrs" }
            ]}
            prices={getFormattedPrices(4)}
        />
    );
};

export default DanielSosa;
