# Checklist de cumplimiento — Tokenpass

- Fecha: 2025-11-25
- Versión: v1.0
- Documento base: Vision Tokenpass.pdf (ubicado en la raíz del repo)

Este documento compara el estado actual del frontend con los requisitos del documento “Vision Tokenpass”, clasifica el cumplimiento en tres categorías (Cumple, Parcial, Faltante) y propone un backlog priorizado con dependencias y fases. Incluye además preguntas abiertas para alinear decisiones de contrato/redes y políticas operativas.

## Índice

- [1) Requisitos del documento (resumen por dominio)](#1-requisitos-del-documento-resumen-por-dominio)
- [2) Inventario del repositorio (frontend)](#2-inventario-del-repositorio-frontend)
- [3) Checklist comparativa (Cumple / Parcial / Faltante)](#3-checklist-comparativa-cumple--parcial--faltante)
- [4) Backlog priorizado por fases, tamaños y dependencias](#4-backlog-priorizado-por-fases-tamaños-y-dependencias)
- [5) Cambios de contrato sugeridos (si aplica)](#5-cambios-de-contrato-sugeridos-si-aplica)
- [6) Preguntas abiertas e incertidumbres](#6-preguntas-abiertas-e-incertidumbres)
- [7) Referencias de archivos y símbolos](#7-referencias-de-archivos-y-símbolos)

## 1) Requisitos del documento (resumen por dominio)

### Must-have
- Wallet/Auth: conexión de wallets no custodiadas (RainbowKit/Wagmi/WalletConnect), UX de conexión/firma.
- Ciclo de vida del boleto: emisión/compra, transferencia controlada, validación/check-in en tiempo real; trazabilidad y prevención de duplicidad.
- Seat map UX: selección por sección/subsección/fila/asiento, disponibilidad en tiempo real.
- Verificación/QR: QR dinámico o mecanismo anti-captura; validación de propiedad/estado del ticket.
- Admin/Backoffice: seteo de precios por sección/subsección, baseURI por evento, tasas/feeds, pausa/operación, retiros.
- Pricing/Moneda: precios en MXN con conversión confiable a wei (oráculo, p. ej., Chainlink).
- Chains/Networks: operación en EVM multired (test/main), conmutación clara y segura.
- Integración de contratos: ABI/funciones para quote/purchase/sold/sectionPrice/rates/baseURI/withdraw/pause.

### Should-have
- Seguridad/Compliance: roles/propietarios, antifraude, posibles requerimientos KYC/AML según evento/región.
- Performance/Escalabilidad: lecturas eficientes, batch/caché, UI responsiva para aforos grandes.

### Nice-to-have
- Analytics/Reporting: métricas de ventas, ocupación, auditoría de transferencias.

## 2) Inventario del repositorio (frontend)

- Config Web3
  - wagmi.ts: RainbowKit + Wagmi; chains configuradas (mainnet, polygon, optimism, arbitrum, base, sepolia); `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`.
- Contratos/ABI/utilidades
  - contracts.ts:
    - `CONTRACT_ADDRESS = "0x0B7c99D0e942c3762569286d9965cB03532da384"`.
    - `TICKETPASS_ABI`: `purchase`, `quoteTotalWei`, `quoteSeatPriceWei`, `soldSeats`, `setSectionPriceMXN`, `setRates`, `setEventBaseURI`, `withdraw`, `pause/unpause`, `tokenURI`, `usdPerMxnE6`, `ethUsdFeed`, eventos (`SeatPurchased`, `RatesUpdated`, `PriceMXNUpdated`, etc.).
    - `encodeSeatId`, `mapSectionToCode`, enums `SectionCode`, `SubSectionCode`.
- Componentes UX
  - SeatMap.tsx: mapa de secciones clicable (CORO, LUNETA, PLATEA, PALCO).
  - SeatSelector.tsx: subsección FF/DD, cantidad, grilla 5x10; disponibilidad con `soldSeats` (batch `useReadContracts`); arma `seatIds` vía `encodeSeatId`.
  - TicketSummary.tsx: `quoteTotalWei`, `purchase`, cambio a Sepolia (11155111), mensajes de estado/errores; helpers admin (`setRates`, `setSectionPriceMXN`); `ConnectButton`.
- Páginas
  - _app.tsx: proveedores Wagmi/RainbowKit y botón de conexión global.
  - index.tsx: home con links a venues.
  - ForoBoca.tsx: grilla de eventos.
  - JuanGabriel.tsx: flujo completo (SeatMap → SeatSelector → TicketSummary).
  - Otras páginas de venues (estáticas).
- Dependencias
  - package.json: Next 16, React 19, Wagmi 2, Viem 2, RainbowKit 2, React Query 5.

## 3) Checklist comparativa (Cumple / Parcial / Faltante)

### Cumple
- Wallet/Auth: conexión de wallet con RainbowKit/Wagmi; botón global. Referencias: wagmi.ts, `src/pages/_app.tsx`.
- Compra y cotización on-chain: `quoteTotalWei` + `purchase` con `value` exacto; manejo de confirmación y errores. Referencias: TicketSummary.tsx.
- Seat map UX básico: selección de sección/subsección, asientos con disponibilidad on-chain (`soldSeats`). Referencias: SeatMap.tsx, SeatSelector.tsx.
- Integración ABI/utilidades: `encodeSeatId`, enums, mapping UI→on-chain. Referencias: contracts.ts.
- Multired (config base): chains definidas y switch forzado a Sepolia para compra. Referencias: wagmi.ts, TicketSummary.tsx.

### Parcial
- Pricing/Moneda (MXN→ETH): contrato soporta `setRates`/`usdPerMxnE6` y `quote*`; UI muestra precios mock y no refleja `sectionPricesMXN` en listas. Faltan equivalentes ETH/CL feed visibles. Referencias: TicketSummary.tsx.
- Admin/Backoffice: helpers embebidos para `setRates` y `setSectionPriceMXN`, sin panel ni gating por rol; no hay UI para `withdraw`, `pause/unpause`, `setEventBaseURI`. Referencias: TicketSummary.tsx, contracts.ts.
- Ciclo de vida (transfer UI): ABI ERC-721 presente, pero sin interfaz de transferencia/restricciones. Referencias: contracts.ts.
- Multired operativo: compra fuerza Sepolia; no hay mapeo por red/env para direcciones ni gating consistente para lecturas. Referencias: wagmi.ts, contracts.ts, TicketSummary.tsx.
- Performance: `soldSeats` consulta un ítem por asiento (batch de 50); sin virtualización/caché para aforos grandes. Referencias: SeatSelector.tsx.
- UX multi-evento: flujo completo sólo en `ForoBocaEvents/JuanGabriel`. Otras páginas son estáticas. Referencias: `pages/ForoBocaEvents/*`.

### Faltante
- Verificación/QR y check-in: generación/rotación de QR, protocolo de validación (en puerta), UI de staff. Sin evidencia en el repo.
- Marketplace/Reventa: UI/flows para reventa, reglas de precio/royalties, integración marketplace. Sin evidencia.
- Mis boletos: dashboard de tokens (`balanceOf`/`ownerOf`/`tokenURI`), visualización QR, historial. Sin evidencia.
- Analytics/Reporting: métricas de ventas/ocupación, paneles. Sin evidencia.
- Seguridad/Compliance: términos/privacidad, antifraude/rate-limit/captcha, KYC (si aplica). Sin evidencia.
- Admin completo: `withdraw`, `pause/unpause`, `setEventBaseURI` en UI; CRUD/masivo de precios. Sin evidencia.
- Direcciones por red/env: mapeo por network para contratos y entornos. Sin evidencia.

## 4) Backlog priorizado por fases, tamaños y dependencias

Escala de tamaños: S (≤1 día), M (2–4 días), L (≥1 semana)

### Fase 0 — Fundaciones
- F0.1 Mapeo de direcciones por red/env en contracts.ts (S). Dep: ninguna. Refs: contracts.ts.
- F0.2 Configurar `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` y chains objetivo en wagmi.ts (S). Dep: ninguna. Refs: wagmi.ts.
- F0.3 Documento de modelo de asientos/eventos (secciones, subsecciones, filas, aforos) (S). Dep: stakeholders.

### Fase 1 — MVP compra consistente
- F1.1 Mostrar precios por sección desde on-chain en panel lateral y listados (M). Dep: F0.1, F0.3. Refs: TicketSummary.tsx, JuanGabriel.tsx.
- F1.2 Sincronizar total MXN en UI con `quoteTotalWei` y mostrar equivalente estimado en ETH (S). Dep: F1.1. Refs: TicketSummary.tsx.
- F1.3 Prechecks de compra: validar tasas/feeds y precios configurados; mensajes claros (S). Dep: F1.1. Refs: TicketSummary.tsx.
- F1.4 Manejo uniforme de errores/estados (pausa, insuficiente `value`, no disponible) (S). Dep: F1.3. Refs: TicketSummary.tsx.
- F1.5 Optimizar lectura de `soldSeats` (chunking/caché/estrategia por subsección) (M). Dep: F0.3. Refs: SeatSelector.tsx.

### Fase 2 — Admin/Backoffice
- F2.1 Panel Admin con gating por owner/operator: `setRates`, `setSectionPriceMXN`, `setEventBaseURI`, `pause/unpause`, `withdraw` (M). Dep: F0.1. Refs: TicketSummary.tsx (refactor), nuevas páginas `pages/admin/*`.
- F2.2 Carga/edición masiva de precios (CSV/JSON) por sección/subsección (M). Dep: F2.1. Refs: `pages/admin/*`.
- F2.3 Dirección de retiro y logs de `Withdraw` en UI (S). Dep: F2.1. Refs: contracts.ts.

### Fase 3 — Mis Boletos
- F3.1 Página “Mis boletos”: listar `tokenIds` del `owner`, mostrar detalles (`tokenURI`) (M). Dep: F1.x. Refs: nueva `pages/tickets.tsx`, contracts.ts.
- F3.2 QR por token (dinámico): render y descarga; especificación de formato (M). Dep: F3.1, F4.1 si comparten esquema. Refs: nueva `components/TicketQR.tsx`.
- F3.3 Transferir ticket en UI (con restricciones si aplican) (M). Dep: F5.1 (política). Refs: contracts.ts, nueva UI en `pages/tickets.tsx`.

### Fase 4 — Verificación/Check-in
- F4.1 Protocolo de verificación: QR dinámico (nonce+firma) o `checkIn(eventId, tokenId)` on-chain (M). Dep: cambio de contrato C4.1. Refs: contrato + `pages/checkin/*`.
- F4.2 App/página de staff para escaneo y validación (M). Dep: F4.1. Refs: `pages/checkin/*`, `components/Scanner.tsx`.
- F4.3 Mostrar estado de uso por token en “Mis boletos” (S). Dep: F4.1. Refs: `pages/tickets.tsx`.

### Fase 5 — Reventa/Marketplace
- F5.1 Política de transferencias: ventanas, tope de precio, royalties, operadores (S). Dep: stakeholders. Refs: doc de políticas.
- F5.2 UI de reventa P2P o integración marketplace (M/L según alcance) (M/L). Dep: F5.1, posibles cambios de contrato C5.1. Refs: nuevas páginas `pages/marketplace/*`.

### Fase 6 — Analytics/Reporting
- F6.1 Métricas básicas (ventas, ocupación, ingresos) a partir de eventos on-chain (M). Dep: F1.x, F2.x. Refs: `lib/events.ts` (nuevo), `pages/admin/analytics.tsx`.
- F6.2 Panel organizador con filtros por evento/sección (M). Dep: F6.1.

### Fase 7 — Performance y Seguridad
- F7.1 Virtualización y paginación en seat maps grandes; skeletons/caché (M). Dep: F1.5. Refs: SeatSelector.tsx.
- F7.2 Antibot/abuso: límites por wallet, cooldown, CAPTCHA si aplica (M). Dep: política (S). Refs: TicketSummary.tsx y middleware.
- F7.3 Hardening multired: auto-switch de lectura/escritura, tolerancia de red, reintentos (S). Dep: F0.1. Refs: wagmi.ts, hooks.

## 5) Cambios de contrato sugeridos (si aplica)

- C4.1 Check-in on-chain: `checkIn(eventId, tokenId)` + mapping “usado” y evento `CheckedIn`. Soporta verificación y estado en “Mis boletos”. Dep: F4.1.
- C5.1 Reventa: restricción de transferencias (bloqueos temporales, whitelist de operadores), `setResalePolicy(...)`, eventos. Dep: F5.1.
- C2.1 Roles: owner/operator (RBAC) para administración fina desde UI (evitar exponer funciones críticas a cualquier caller). Dep: F2.x.
- C1.1 Multi-evento robusto (si se requiere): supply/aforo por evento, validaciones y URIs específicas. Dep: F1.x.

### Notas
- El backend es el contrato (script + ABI). Ajustar el contrato para alinear gaps del documento es viable y recomendado en Fases 4 y 5.

## 6) Preguntas abiertas e incertidumbres

- Redes objetivo: ¿producción en Base/Polygon/Ethereum? ¿Direcciones por red? (Impacta F0.1, F7.3)
- Verificación/QR: ¿QR dinámico con nonce/firma o check-in on-chain? ¿Modo offline tolerado? (Impacta F4.x, C4.1)
- Reventa/transferencias: ¿restricciones (ventanas, tope), royalties y operadores permitidos? (Impacta F5.x, C5.1, F3.3)
- Inventario real de asientos: ¿filas/aforos por sección y subsección? ¿Necesidad de virtualización inmediata? (Impacta F1.5, F7.1)
- Oráculos/rates: ¿feed Chainlink por red objetivo? ¿Política para `usdPerMxnE6` y fallback? (Impacta F1.3, F2.1)
- Roles/admin: ¿Gnosis Safe para owner? ¿Operadores secundarios? (Impacta F2.x, C2.1)
- TokenURI/media: ¿IPFS o HTTP? ¿BaseURI por evento definida y flujo de carga? (Impacta F2.1, F3.1)

## 7) Referencias de archivos y símbolos

- Config y providers
  - wagmi.ts: `getDefaultConfig(...)`, chains, `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`.
  - _app.tsx: `WagmiProvider`, `RainbowKitProvider`, `ConnectButton`.
- Contratos/ABI/utils
  - contracts.ts: `CONTRACT_ADDRESS`, `TICKETPASS_ABI`, `encodeSeatId`, `mapSectionToCode`, `SectionCode`, `SubSectionCode`.
- Componentes clave
  - SeatMap.tsx: UI de secciones.
  - SeatSelector.tsx: `useReadContracts` → `soldSeats`, generación grilla 5x10, `seatIds`.
  - TicketSummary.tsx: `useReadContract(quoteTotalWei)`, `useWriteContract(purchase)`, switch Sepolia, helpers admin, estados/errores.
- Páginas y flujo
  - JuanGabriel.tsx: flujo completo de compra.
  - ForoBoca.tsx: listado de eventos.
  - index.tsx: home.