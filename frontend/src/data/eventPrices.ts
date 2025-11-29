import { SectionCode } from "../lib/contracts";

export interface EventPriceConfig {
    eventId: number;
    prices: {
        [key in keyof typeof SectionCode]?: number; // Price in MXN
    };
}

// Predefined prices for all 12 events
export const EVENT_PRICES: EventPriceConfig[] = [
    {
        eventId: 1, // Juan Gabriel
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
        eventId: 2, // Harry Potter
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
        eventId: 3, // Memorias en Aerosol
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
        eventId: 4, // Daniel Sosa
        prices: {
            LUNETA_BAJA: 900,
            LUNETA_ALTA: 700,
            PLATEA_BAJA: 600,
            PLATEA_ALTA: 500,
            PALCO: 1200,
            CORO_LATERAL: 350,
            CORO: 250
        }
    },
    {
        eventId: 5, // Ballet Folklorico
        prices: {
            LUNETA_BAJA: 1100,
            LUNETA_ALTA: 900,
            PLATEA_BAJA: 700,
            PLATEA_ALTA: 600,
            PALCO: 1500,
            CORO_LATERAL: 400,
            CORO: 300
        }
    },
    {
        eventId: 6, // El Cascanueces
        prices: {
            LUNETA_BAJA: 1300,
            LUNETA_ALTA: 1100,
            PLATEA_BAJA: 900,
            PLATEA_ALTA: 800,
            PALCO: 1800,
            CORO_LATERAL: 450,
            CORO: 350
        }
    },
    {
        eventId: 7, // Danzon
        prices: {
            LUNETA_BAJA: 600,
            LUNETA_ALTA: 500,
            PLATEA_BAJA: 400,
            PLATEA_ALTA: 300,
            PALCO: 800,
            CORO_LATERAL: 200,
            CORO: 150
        }
    },
    {
        eventId: 8, // Concierto Arcano
        prices: {
            LUNETA_BAJA: 700,
            LUNETA_ALTA: 600,
            PLATEA_BAJA: 500,
            PLATEA_ALTA: 400,
            PALCO: 900,
            CORO_LATERAL: 250,
            CORO: 200
        }
    },
    {
        eventId: 9, // Concierto Navideno
        prices: {
            LUNETA_BAJA: 1000,
            LUNETA_ALTA: 800,
            PLATEA_BAJA: 700,
            PLATEA_ALTA: 600,
            PALCO: 1400,
            CORO_LATERAL: 350,
            CORO: 300
        }
    },
    {
        eventId: 10, // Einaudi Zimmer
        prices: {
            LUNETA_BAJA: 1400,
            LUNETA_ALTA: 1200,
            PLATEA_BAJA: 1000,
            PLATEA_ALTA: 800,
            PALCO: 1900,
            CORO_LATERAL: 500,
            CORO: 400
        }
    },
    {
        eventId: 11, // Klaus
        prices: {
            LUNETA_BAJA: 1600,
            LUNETA_ALTA: 1300,
            PLATEA_BAJA: 1100,
            PLATEA_ALTA: 900,
            PALCO: 2200,
            CORO_LATERAL: 550,
            CORO: 450
        }
    },
    {
        eventId: 12, // Le Quattro Stagioni
        prices: {
            LUNETA_BAJA: 1200,
            LUNETA_ALTA: 1000,
            PLATEA_BAJA: 800,
            PLATEA_ALTA: 700,
            PALCO: 1600,
            CORO_LATERAL: 400,
            CORO: 350
        }
    }
];
