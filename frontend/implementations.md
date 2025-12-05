# Pricing Restructuring & "First Buyer" Fix

## Goal
Decouple the frontend pricing display from the smart contract state to avoid "Seat price not set" errors for the first buyer. The frontend will display MXN prices from a local config and estimate ETH costs using an external API. The contract will handle the final conversion and purchase validation.

## User Review Required
> [!IMPORTANT]
> **Contract Update**: The `TicketPass` contract will be updated to include a refund mechanism for excess ETH sent. This ensures that if the estimated ETH amount is slightly higher than the actual required amount (due to price fluctuations), the user is refunded the difference.

## Proposed Changes

### Contract
#### [NEW] [TicketPass.sol](file:///Users/rodrigo.mb89/Documents/escuela/Blockchain/Tokenpass/frontend/src/contracts/TicketPass.sol)
- Create file with user-provided code.
- **Modification**: Add logic to refund excess ETH: `if (msg.value > requiredWei) payable(msg.sender).transfer(msg.value - requiredWei);`

### Frontend
#### [MODIFY] [TicketSummary.tsx](file:///Users/rodrigo.mb89/Documents/escuela/Blockchain/Tokenpass/frontend/src/components/TicketSummary.tsx)
- **Remove**: Calls to `quoteSeatPriceWei` and `quoteTotalWei` for initial display.
- **Add**: Import `EVENT_PRICES` from `../data/eventPrices`.
- **Add**: Logic to fetch current ETH/MXN rate from an external API (e.g., CryptoCompare) for estimation.
- **Update**: Display total in MXN (from config) and estimated ETH.
- **Update**: `handlePayment` to calculate `value` based on the *contract's* expected rate (by querying the Chainlink feed directly or using a safe buffer with the new refund logic). *Decision*: Query Chainlink feed from frontend to be precise, plus add a small buffer (e.g., 1%) which will be refunded.

## Verification Plan
### Automated Tests
- None (Visual verification).

### Manual Verification
1.  **Price Display**: Verify that selecting seats shows the correct MXN price from `eventPrices.ts` immediately, without waiting for contract calls.
2.  **ETH Estimate**: Verify that the estimated ETH amount is calculated and displayed correctly.
3.  **Purchase**: Attempt a purchase.
    - **Scenario A (Price Set)**: Transaction should succeed.
    - **Scenario B (Price Not Set)**: Transaction should fail (revert) with "Seat price not set". We should handle this error gracefully in the UI (e.g., "Venta no iniciada").
