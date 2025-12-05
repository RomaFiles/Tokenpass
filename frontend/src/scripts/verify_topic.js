const { keccak256, toBytes } = require('viem');

const signature = 'SeatPurchased(uint16,uint64,address,uint256)';
const hash = keccak256(toBytes(signature));
console.log(`Signature: ${signature}`);
console.log(`Hash: ${hash}`);
