# Seat & Event Model

## Event Structure
- **Event ID**: Currently hardcoded as `1` in `SeatSelector.tsx`.
- **Venue**: Foro Boca (implied).

## Sections & Subsections
The venue is divided into Sections (e.g., CORO, LUNETA, PLATEA, PALCO).
Each Section is divided into two Subsections:
- **DD**: Right side (Lado Derecho)
- **FF**: Left side (Lado Izquierdo)

## Seat Grid
- **Grid Size**: Fixed 5 rows x 10 columns per Subsection.
- **Total Capacity per Subsection**: 50 seats.
- **Total Capacity per Section**: 100 seats (50 DD + 50 FF).
- **Seat Identification**:
  - `row`: 1 to 5
  - `number`: 1 to 10
  - `id`: Encoded using `encodeSeatId(eventId, section, subsection, row, number)`.

## On-Chain Representation
- **Seat ID**: `uint64`
- **Encoding**: Bit-packed (likely, details in `contracts.ts`).
- **Availability**: Checked via `soldSeats(seatId)` on the contract.
