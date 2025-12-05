// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts@4.9.5/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@4.9.5/access/Ownable.sol";
import "@openzeppelin/contracts@4.9.5/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts@4.9.5/security/Pausable.sol";
import "@openzeppelin/contracts@4.9.5/utils/Strings.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/// seatId (uint64): eventId(16) | section(8) | subSection(8) | row(16) | number(16)
/// Sections: CORO=1, CORO_LATERAL=2, LUNETA_ALTA=3, LUNETA_BAJA=4, PALCO=5, PLATEA_ALTA=6, PLATEA_BAJA=7
/// SubSección: FF=1, DD=2
contract TicketPass is ERC721URIStorage, Ownable, ReentrancyGuard, Pausable {
    using Strings for uint256;

    // Precios por sección/subsección en centavos MXN: eventId -> section -> subSection -> mxnCents
    mapping(uint16 => mapping(uint8 => mapping(uint8 => uint256))) public sectionPricesMXN;

    // Asientos vendidos
    mapping(uint64 => bool) public soldSeats;

    // baseURI por evento
    mapping(uint16 => string) public eventBaseURIs;

    // Oráculo ETH/USD de Chainlink (8 decimales)
    AggregatorV3Interface public ethUsdFeed;

    // USD por 1 MXN con 6 decimales (ej: 0.058000 USD/MXN => 58000)
    uint256 public usdPerMxnE6;

    event SeatPurchased(uint16 indexed eventId, uint64 indexed seatId, address indexed buyer, uint256 priceWei);
    event PriceMXNUpdated(uint16 indexed eventId, uint8 section, uint8 subSection, uint256 mxnCents);
    event BaseURIUpdated(uint16 indexed eventId, string baseURI);
    event RatesUpdated(address ethUsdFeed, uint256 usdPerMxnE6);
    event Withdraw(address indexed to, uint256 amount);

    /// Sepolia ETH/USD feed: 0x694AA1769357215DE4FAC081bf1f309aDC325306
    constructor(address _ethUsdFeed, uint256 _usdPerMxnE6) ERC721("TicketPass", "TKT") {
        ethUsdFeed = AggregatorV3Interface(_ethUsdFeed);
        usdPerMxnE6 = _usdPerMxnE6;
        emit RatesUpdated(_ethUsdFeed, _usdPerMxnE6);
    }

    // ============ Compra ============
    function purchase(uint16 eventId, uint64[] calldata seatIds)
        external
        payable
        nonReentrant
        whenNotPaused
    {
        uint256 requiredWei = 0;

        // Validar y acumular costo en wei
        for (uint256 i = 0; i < seatIds.length; i++) {
            uint64 seatId = seatIds[i];
            require(!soldSeats[seatId], "Seat already sold");
            require(getEventId(seatId) == eventId, "Seat/event mismatch");

            ( , uint8 section, uint8 subSection, , ) = decodeSeatId(seatId);
            uint256 mxnCents = sectionPricesMXN[eventId][section][subSection];
            require(mxnCents > 0, "Seat price not set (MXN)");
            requiredWei += _mxnCentsToWei(mxnCents);
        }

        require(msg.value >= requiredWei, "Incorrect ETH amount");

        // Refund excess ETH (Added by Antigravity)
        if (msg.value > requiredWei) {
            (bool success, ) = payable(msg.sender).call{value: msg.value - requiredWei}("");
            require(success, "Refund failed");
        }

        string memory baseURI = eventBaseURIs[eventId];

        // Marcar vendidos y mintear
        for (uint256 i = 0; i < seatIds.length; i++) {
            uint64 seatId = seatIds[i];
            soldSeats[seatId] = true;

            _safeMint(msg.sender, uint256(seatId));

            if (bytes(baseURI).length > 0) {
                _setTokenURI(uint256(seatId), string(abi.encodePacked(baseURI, uint256(seatId).toString())));
            }

            ( , uint8 section, uint8 subSection, , ) = decodeSeatId(seatId);
            uint256 priceWei = _mxnCentsToWei(sectionPricesMXN[eventId][section][subSection]);
            emit SeatPurchased(eventId, seatId, msg.sender, priceWei);
        }
    }

    // ============ Quotes (view) ============
    function quoteSeatPriceWei(uint64 seatId) public view returns (uint256) {
        (uint16 eventId, uint8 section, uint8 subSection, , ) = decodeSeatId(seatId);
        uint256 mxnCents = sectionPricesMXN[eventId][section][subSection];
        require(mxnCents > 0, "Seat price not set (MXN)");
        return _mxnCentsToWeiView(mxnCents);
    }

    function quoteTotalWei(uint16 eventId, uint64[] calldata seatIds) external view returns (uint256 totalWei) {
        for (uint256 i = 0; i < seatIds.length; i++) {
            require(getEventId(seatIds[i]) == eventId, "Seat/event mismatch");
            totalWei += quoteSeatPriceWei(seatIds[i]);
        }
    }

    // ============ Admin ============
    function setSectionPriceMXN(uint16 eventId, uint8 section, uint8 subSection, uint256 mxnCents) external onlyOwner {
        sectionPricesMXN[eventId][section][subSection] = mxnCents;
        emit PriceMXNUpdated(eventId, section, subSection, mxnCents);
    }

    function setEventPricesMXN(
        uint16 eventId, 
        uint8[] calldata sections, 
        uint8[] calldata subSections, 
        uint256[] calldata pricesMXN
    ) external onlyOwner {
        require(sections.length == subSections.length && sections.length == pricesMXN.length, "Array length mismatch");
        
        for(uint256 i = 0; i < sections.length; i++) {
            sectionPricesMXN[eventId][sections[i]][subSections[i]] = pricesMXN[i];
            emit PriceMXNUpdated(eventId, sections[i], subSections[i], pricesMXN[i]);
        }
    }

    function setEventBaseURI(uint16 eventId, string calldata uri) external onlyOwner {
        eventBaseURIs[eventId] = uri;
        emit BaseURIUpdated(eventId, uri);
    }

    function setRates(address _ethUsdFeed, uint256 _usdPerMxnE6) external onlyOwner {
        if (_ethUsdFeed != address(0)) ethUsdFeed = AggregatorV3Interface(_ethUsdFeed);
        usdPerMxnE6 = _usdPerMxnE6;
        emit RatesUpdated(address(ethUsdFeed), _usdPerMxnE6);
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    function withdraw(address payable to) external onlyOwner nonReentrant {
        uint256 bal = address(this).balance;
        (bool ok, ) = to.call{value: bal}("");
        require(ok, "Withdraw failed");
        emit Withdraw(to, bal);
    }

    // ============ Helpers ============
    // mxnCents -> wei usando ETH/USD de Chainlink (8 dec) y usdPerMxnE6 (6 dec)
    // Formula Correcta:
    // USD_Value = mxnCents / 100 * usdPerMxnE6 / 1e6
    // ETH_Value = USD_Value / (ethUsd / 1e8)
    // Wei = ETH_Value * 1e18
    // Wei = (mxnCents * usdPerMxnE6 * 1e18) / (100 * 1e6 * ethUsd / 1e8)
    // Wei = (mxnCents * usdPerMxnE6 * 1e18 * 1e8) / (1e8 * ethUsd)
    // Wei = (mxnCents * usdPerMxnE6 * 1e18) / ethUsd
    function _mxnCentsToWei(uint256 mxnCents) internal view returns (uint256) {
        (, int256 ethUsd, , ,) = ethUsdFeed.latestRoundData(); // 8 dec
        require(ethUsd > 0, "Bad ETH/USD feed");
        return (mxnCents * usdPerMxnE6 * 1e18) / uint256(ethUsd);
    }

    function _mxnCentsToWeiView(uint256 mxnCents) internal view returns (uint256) {
        (, int256 ethUsd, , ,) = ethUsdFeed.latestRoundData(); // 8 dec
        require(ethUsd > 0, "Bad ETH/USD feed");
        return (mxnCents * usdPerMxnE6 * 1e18) / uint256(ethUsd);
    }

    function decodeSeatId(uint64 seatId)
        public
        pure
        returns (uint16 eventId, uint8 section, uint8 subSection, uint16 row, uint16 number_)
    {
        eventId    = uint16(seatId >> 48);
        section    = uint8(seatId >> 40);
        subSection = uint8(seatId >> 32);
        row        = uint16(seatId >> 16);
        number_    = uint16(seatId);
    }

    function getEventId(uint64 seatId) public pure returns (uint16) {
        return uint16(seatId >> 48);
    }
}
