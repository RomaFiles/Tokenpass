import { SectionCode } from "../lib/contracts";

export interface EventPriceConfig {
    eventId: number;
    eventName?: string;
    venue: string;
    prices: {
        [key in keyof typeof SectionCode]?: number; // Price in MXN
    };
}

// Predefined prices for all 12 events
export const EVENT_PRICES: EventPriceConfig[] = [
    {
        eventId: 1,
        eventName: "Juan Gabriel",
        venue: "Foro Boca",
        prices: {
            LUNETA_BAJA: 1500,
            LUNETA_ALTA: 1200,
            PLATEA_BAJA: 1000,
            PLATEA_ALTA: 800,
            PALCO: 2000,
            CORO_LATERAL: 500,
            CORO: 400
        }
    },
    {
        eventId: 2,
        eventName: "Harry Potter",
        venue: "Arena CDMX",
        prices: {
            LUNETA_BAJA: 1800,
            LUNETA_ALTA: 1500,
            PLATEA_BAJA: 1200,
            PLATEA_ALTA: 1000,
            PALCO: 2500,
            CORO_LATERAL: 600,
            CORO: 500
        }
    },
    {
        eventId: 3,
        eventName: "Memorias en Aerosol",
        venue: "Foro Boca",
        prices: {
            LUNETA_BAJA: 800,
            LUNETA_ALTA: 600,
            PLATEA_BAJA: 500,
            PLATEA_ALTA: 400,
            PALCO: 1000,
            CORO_LATERAL: 300,
            CORO: 200
        }
    },
    {
        eventId: 4,
        eventName: "Daniel Sosa",
        venue: "Foro Boca",
        prices: {
            LUNETA_BAJA: 600,
            LUNETA_ALTA: 500,
            PLATEA_BAJA: 400,
            PLATEA_ALTA: 300,
            PALCO: 800,
            CORO_LATERAL: 250,
            CORO: 200
        }
    },
    {
        eventId: 5,
        eventName: "Ballet Folklórico de México",
        venue: "Foro Boca",
        prices: {
            LUNETA_BAJA: 480,
            LUNETA_ALTA: 370,
            PALCO: 480,
            CORO_LATERAL: 320,
            CORO: 320
        }
    },
    {
        eventId: 6,
        eventName: "El Cascanueces",
        venue: "Foro Boca",
        prices: {
            LUNETA_BAJA: 500,
            LUNETA_ALTA: 385,
            PALCO: 500,
            CORO_LATERAL: 330,
            CORO: 330
        }
    },
    {
        eventId: 7,
        eventName: "Concierto de Danzón",
        venue: "Foro Boca",
        prices: {
            LUNETA_BAJA: 360,
            LUNETA_ALTA: 280,
            PALCO: 360,
            CORO_LATERAL: 240,
            CORO: 240
        }
    },
    {
        eventId: 8,
        eventName: "Concierto Arcano",
        venue: "Foro Boca",
        prices: {
            LUNETA_BAJA: 398,
            LUNETA_ALTA: 309,
            PALCO: 398,
            CORO_LATERAL: 265,
            CORO: 265
        }
    },
    {
        eventId: 9,
        eventName: "Concierto Navideño",
        venue: "Foro Boca",
        prices: {
            LUNETA_BAJA: 340,
            LUNETA_ALTA: 260,
            PALCO: 340,
            CORO_LATERAL: 225,
            CORO: 225
        }
    },
    {
        eventId: 10,
        eventName: "Einaudi & Zimmer",
        venue: "Foro Boca",
        prices: {
            LUNETA_BAJA: 460,
            LUNETA_ALTA: 355,
            PALCO: 460,
            CORO_LATERAL: 305,
            CORO: 305
        }
    },
    {
        eventId: 11,
        eventName: "Klaus",
        venue: "Foro Boca",
        prices: {
            LUNETA_BAJA: 200,
            LUNETA_ALTA: 155,
            PALCO: 200,
            CORO_LATERAL: 130,
            CORO: 130
        }
    },
    {
        eventId: 12,
        eventName: "Le quattro Stagioni",
        venue: "Foro Boca",
        prices: {
            LUNETA_BAJA: 420,
            LUNETA_ALTA: 325,
            PALCO: 420,
            CORO_LATERAL: 280,
            CORO: 280
        }
    }
];

export const getFormattedPrices = (eventId: number) => {
    const config = EVENT_PRICES.find(e => e.eventId === eventId);
    if (!config) return [];

    const labels: Record<string, string> = {
        LUNETA_BAJA: "LUNETA BAJA",
        LUNETA_ALTA: "LUNETA ALTA",
        PLATEA_BAJA: "PLATEA BAJA",
        PLATEA_ALTA: "PLATEA ALTA",
        PALCO: "PALCO",
        CORO_LATERAL: "CORO LATERAL",
        CORO: "CORO"
    };

    return Object.entries(config.prices).map(([key, price]) => ({
        label: labels[key] || key,
        price: price || 0
    }));
};
