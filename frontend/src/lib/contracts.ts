import { sepolia, mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";

export const CONTRACT_ADDRESSES: Record<number, `0x${string}`> = {
    [sepolia.id]: "0x0B7c99D0e942c3762569286d9965cB03532da384",
    // Add other networks here when deployed
    // [mainnet.id]: "0x...",
};

export const getContractAddress = (chainId: number): `0x${string}` | undefined => {
    return CONTRACT_ADDRESSES[chainId];
};

export const CONTRACT_ADDRESS = CONTRACT_ADDRESSES[sepolia.id]; // Default/Fallback


export const TICKETPASS_ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_ethUsdFeed",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_usdPerMxnE6",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "approved",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "ApprovalForAll",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint16",
                "name": "eventId",
                "type": "uint16"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "baseURI",
                "type": "string"
            }
        ],
        "name": "BaseURIUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_fromTokenId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_toTokenId",
                "type": "uint256"
            }
        ],
        "name": "BatchMetadataUpdate",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
            }
        ],
        "name": "MetadataUpdate",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "pause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Paused",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint16",
                "name": "eventId",
                "type": "uint16"
            },
            {
                "indexed": false,
                "internalType": "uint8",
                "name": "section",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint8",
                "name": "subSection",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "mxnCents",
                "type": "uint256"
            }
        ],
        "name": "PriceMXNUpdated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint16",
                "name": "eventId",
                "type": "uint16"
            },
            {
                "internalType": "uint64[]",
                "name": "seatIds",
                "type": "uint64[]"
            }
        ],
        "name": "purchase",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "ethUsdFeed",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "usdPerMxnE6",
                "type": "uint256"
            }
        ],
        "name": "RatesUpdated",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint16",
                "name": "eventId",
                "type": "uint16"
            },
            {
                "indexed": true,
                "internalType": "uint64",
                "name": "seatId",
                "type": "uint64"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "priceWei",
                "type": "uint256"
            }
        ],
        "name": "SeatPurchased",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint16",
                "name": "eventId",
                "type": "uint16"
            },
            {
                "internalType": "string",
                "name": "uri",
                "type": "string"
            }
        ],
        "name": "setEventBaseURI",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_ethUsdFeed",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_usdPerMxnE6",
                "type": "uint256"
            }
        ],
        "name": "setRates",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint16",
                "name": "eventId",
                "type": "uint16"
            },
            {
                "internalType": "uint8",
                "name": "section",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "subSection",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "mxnCents",
                "type": "uint256"
            }
        ],
        "name": "setSectionPriceMXN",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "unpause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Unpaused",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address payable",
                "name": "to",
                "type": "address"
            }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Withdraw",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint64",
                "name": "seatId",
                "type": "uint64"
            }
        ],
        "name": "decodeSeatId",
        "outputs": [
            {
                "internalType": "uint16",
                "name": "eventId",
                "type": "uint16"
            },
            {
                "internalType": "uint8",
                "name": "section",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "subSection",
                "type": "uint8"
            },
            {
                "internalType": "uint16",
                "name": "row",
                "type": "uint16"
            },
            {
                "internalType": "uint16",
                "name": "number_",
                "type": "uint16"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "ethUsdFeed",
        "outputs": [
            {
                "internalType": "contract AggregatorV3Interface",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint16",
                "name": "",
                "type": "uint16"
            }
        ],
        "name": "eventBaseURIs",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "getApproved",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint64",
                "name": "seatId",
                "type": "uint64"
            }
        ],
        "name": "getEventId",
        "outputs": [
            {
                "internalType": "uint16",
                "name": "",
                "type": "uint16"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "name": "isApprovedForAll",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ownerOf",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "paused",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint64",
                "name": "seatId",
                "type": "uint64"
            }
        ],
        "name": "quoteSeatPriceWei",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint16",
                "name": "eventId",
                "type": "uint16"
            },
            {
                "internalType": "uint64[]",
                "name": "seatIds",
                "type": "uint64[]"
            }
        ],
        "name": "quoteTotalWei",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "totalWei",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint16",
                "name": "",
                "type": "uint16"
            },
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "name": "sectionPricesMXN",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint64",
                "name": "",
                "type": "uint64"
            }
        ],
        "name": "soldSeats",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "tokenURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "usdPerMxnE6",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
] as const;

export enum SectionCode {
    CORO = 1,
    CORO_LATERAL = 2,
    LUNETA_ALTA = 3,
    LUNETA_BAJA = 4,
    PALCO = 5,
    PLATEA_ALTA = 6,
    PLATEA_BAJA = 7,
}

export enum SubSectionCode { FF = 1, DD = 2 }

export function encodeSeatId(
    eventId: number,
    section: SectionCode,
    sub: SubSectionCode,
    row: number,
    number_: number
): bigint {
    // uint64: eventId(16) | section(8) | sub(8) | row(16) | number(16)
    return (BigInt(eventId & 0xffff) << BigInt(48))
        | (BigInt(section & 0xff) << BigInt(40))
        | (BigInt(sub & 0xff) << BigInt(32))
        | (BigInt(row & 0xffff) << BigInt(16))
        | BigInt(number_ & 0xffff);
}

export function decodeSeatId(seatId: bigint) {
    const eventId = Number((seatId >> 48n) & 0xffffn);
    const section = Number((seatId >> 40n) & 0xffn);
    const subSection = Number((seatId >> 32n) & 0xffn);
    const row = Number((seatId >> 16n) & 0xffffn);
    const number = Number(seatId & 0xffffn);
    return { eventId, section, subSection, row, number };
}

// Mapea los strings de la UI al código on-chain
export function mapSectionToCode(label: string): SectionCode {
    if (label.includes("LUNETA_ALTA")) return SectionCode.LUNETA_ALTA;
    if (label.includes("LUNETA_BAJA")) return SectionCode.LUNETA_BAJA;
    if (label.includes("CORO_LATERAL")) return SectionCode.CORO_LATERAL;
    if (label.includes("PALCO")) return SectionCode.PALCO;
    if (label.includes("PLATEA_ALTA")) return SectionCode.PLATEA_ALTA;
    if (label.includes("PLATEA_BAJA")) return SectionCode.PLATEA_BAJA;
    return SectionCode.CORO;
}
