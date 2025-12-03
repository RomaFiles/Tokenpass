import { Section } from '../components/ForoBocaEventPage';

export interface SeatDefinition {
    id: string;
    row: string;
    number: number;
    status?: 'available' | 'occupied' | 'selected';
}

export interface ZoneLayout {
    rows: {
        name: string;
        seats: number[]; // Array of seat numbers in this row
    }[];
}

// Helper to generate a range of numbers
const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

export const SEAT_LAYOUTS: Record<string, Record<string, ZoneLayout>> = {
    'LUNETA_BAJA': {
        'FF': {
            rows: [
                { name: 'A', seats: range(1, 14) },
                { name: 'B', seats: range(1, 16) },
                { name: 'C', seats: range(1, 18) },
                { name: 'D', seats: range(1, 20) },
                { name: 'E', seats: range(1, 22) },
                { name: 'F', seats: range(1, 22) },
                { name: 'G', seats: range(1, 22) },
                { name: 'H', seats: range(1, 22) },
                { name: 'J', seats: range(1, 22) },
                { name: 'K', seats: range(1, 22) },
                { name: 'L', seats: range(1, 22) },
                { name: 'M', seats: range(1, 22) },
            ]
        },
        'DD': {
            rows: [
                { name: 'A', seats: range(1, 14) },
                { name: 'B', seats: range(1, 16) },
                { name: 'C', seats: range(1, 18) },
                { name: 'D', seats: range(1, 20) },
                { name: 'E', seats: range(1, 22) },
                { name: 'F', seats: range(1, 22) },
                { name: 'G', seats: range(1, 22) },
                { name: 'H', seats: range(1, 22) },
                { name: 'J', seats: range(1, 22) },
                { name: 'K', seats: range(1, 22) },
                { name: 'L', seats: range(1, 22) },
                { name: 'M', seats: range(1, 22) },
            ]
        }
    },
    'LUNETA_ALTA': {
        'FF': {
            rows: [
                { name: 'A', seats: range(1, 24) },
                { name: 'B', seats: range(1, 24) },
                { name: 'C', seats: range(1, 24) },
                { name: 'D', seats: range(1, 24) },
                { name: 'E', seats: range(1, 24) },
                { name: 'F', seats: range(1, 24) },
                { name: 'G', seats: range(1, 24) },
                { name: 'H', seats: range(1, 24) },
            ]
        },
        'DD': {
            rows: [
                { name: 'A', seats: range(1, 24) },
                { name: 'B', seats: range(1, 24) },
                { name: 'C', seats: range(1, 24) },
                { name: 'D', seats: range(1, 24) },
                { name: 'E', seats: range(1, 24) },
                { name: 'F', seats: range(1, 24) },
                { name: 'G', seats: range(1, 24) },
                { name: 'H', seats: range(1, 24) },
            ]
        }
    },
    'PLATEA_BAJA': {
        'FF': {
            rows: [
                { name: 'A', seats: range(1, 15) },
                { name: 'B', seats: range(1, 15) },
                { name: 'C', seats: range(1, 15) },
            ]
        },
        'DD': {
            rows: [
                { name: 'A', seats: range(1, 15) },
                { name: 'B', seats: range(1, 15) },
                { name: 'C', seats: range(1, 15) },
            ]
        }
    }
};

export const getSeatLayout = (section: string, subSection: string): ZoneLayout | null => {
    return SEAT_LAYOUTS[section]?.[subSection] || null;
};
