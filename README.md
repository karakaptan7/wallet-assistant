
# wallet-assistant

### Setup Instructions

### Installation

Install dependencies:
```bash
npm install
```

### Dependency Management

Ensure you have Node.js and npm installed. You can manage dependencies using npm.

### Commands to Run the Project

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architectural Decisions

- **Next.js Framework**: Chosen for its server-side rendering capabilities and ease of use with React.
- **TypeScript**: Used for type safety and better developer experience.
- **Ethers.js**: Utilized for interacting with the Ethereum blockchain.
- **WebSocket**: Implemented for real-time updates.

## Assumptions and Limitations

- Assumes the user has MetaMask wallet installed.
- The implementation currently supports only Ethereum-based wallets.
- Real-time updates are limited to specific events and may not cover all use cases.


