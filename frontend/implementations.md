# Future Implementations & Improvements

## Backend for Cross-Device Check-in Synchronization

### Problem
Currently, the Check-in system uses **Local Storage** on the scanning device to track used tickets. This leads to the following limitations:
1.  **No Cross-Device Sync**: If a staff member scans a ticket on Device A, Device B (another staff member or the user's device) does not know it has been used.
2.  **Data Persistence**: If the staff member clears their browser cache, the check-in history is lost.
3.  **Security**: A user could potentially "reset" their used status by using a different device.

### Proposed Solution: Centralized Backend
To solve this, we need a centralized database to store the state of each ticket.

#### Architecture
1.  **Database**: A simple database (PostgreSQL, MongoDB, or Firebase) to store:
    *   `tokenId` (Primary Key)
    *   `eventId`
    *   `isUsed` (Boolean)
    *   `checkedInAt` (Timestamp)
    *   `checkedInBy` (Staff ID/Address)

2.  **API Endpoints**:
    *   `POST /api/check-in`:
        *   Input: `{ tokenId, signature }`
        *   Action: Verifies staff signature, marks `tokenId` as used in DB.
        *   Returns: Success/Failure.
    *   `GET /api/status/:tokenId`:
        *   Returns: `{ isUsed: boolean, checkedInAt: string }`

#### Alternative: On-Chain Check-in
Instead of a Web2 backend, we could update the **Smart Contract**:
1.  Add a mapping: `mapping(uint256 => bool) public isUsed;`
2.  Add a function: `function checkIn(uint256 tokenId) external onlyStaff`
    *   **Pros**: Fully decentralized, immutable history.
    *   **Cons**: Requires gas fees for every check-in (unless using a relayer or L2), slower confirmation time (seconds vs milliseconds).

### Recommendation
For a high-volume event, a **Hybrid Approach** is best:
1.  **Fast Check-in**: Use a Web2 backend for instant "entry allowed" feedback at the gate.
2.  **Lazy Sync**: Periodically batch-update the smart contract or keep the "used" status off-chain if on-chain immutability isn't strictly required for the "used" bit.
