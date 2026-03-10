# Escrow Engine

Time-based escrow protocol on Solana. Lock SOL in a vault with defined conditions for trustless, non-custodial transactions.

## Features

- **Initialize Escrow** – Create an escrow account with receiver, amount, and deadline
- **Deposit Funds** – Maker deposits SOL into the escrow vault
- **Claim Funds** – Receiver claims funds after deadline passes
- **Cancel Escrow** – Maker cancels and retrieves funds before deadline

## Quick Start

### Prerequisites

- Rust 1.89.0
- Solana CLI
- Anchor 0.32.1
- Node.js / Yarn

### Install Dependencies

```bash
yarn install
cd app && npm install
```

### Build Program

```bash
anchor build
```

### Run Tests

```bash
anchor test
```

### Deploy

```bash
anchor deploy
```

### Run Frontend

```bash
cd app
npm run dev
```

## Program Architecture

**Program ID**: `7Brc92uzycCySEN6Ma6G7qFRapDTkSiw7HZG2roqq2nb`

**Network**: Solana Devnet

### Escrow States

- `Created` – Escrow initialized, awaiting deposit
- `Funded` – Deposit complete, funds locked
- `Claimed` – Receiver claimed funds
- `Cancelled` – Maker cancelled before deadline

### Instructions

**initialize_escrow** – Create escrow with ID, receiver, amount, deadline

**deposite** – Maker deposits specified SOL amount

**claim** – Receiver claims funds (only after deadline)

**cancel** – Maker cancels and retrieves funds (only before deadline)

## Security

- Time-locked withdrawals
- Role-based access control (maker/receiver)
- PDA-based account derivation
- On-chain state validation

## License

ISC
