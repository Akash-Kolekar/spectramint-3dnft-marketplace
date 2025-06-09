# SpectraMint v2 - Smart Contracts

This directory contains the smart contracts for SpectraMint v2, a 3D NFT marketplace built with Foundry.

## Contracts

- **Glb3dNft.sol**: ERC721 contract for minting 3D GLB NFTs
- **NftMarketplace.sol**: Marketplace contract for buying/selling NFTs

## Quick Start

### Prerequisites
- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- [Node.js](https://nodejs.org/) (for the frontend)
- [Yarn](https://yarnpkg.com/) package manager

### Automated Setup
Run the setup script to get everything configured:

```bash
cd foundry
./setup.sh
```

### Manual Setup

1. **Install dependencies:**
   ```bash
   make install
   ```

2. **Build contracts:**
   ```bash
   make build
   ```

3. **Run tests:**
   ```bash
   make test
   ```

4. **Start Anvil (local blockchain):**
   ```bash
   make start-anvil
   ```

5. **Deploy contracts to Anvil:**
   ```bash
   make deploy-anvil
   ```

## Available Commands

| Command | Description |
|---------|-------------|
| `make install` | Install Foundry dependencies |
| `make build` | Compile smart contracts |
| `make test` | Run all tests |
| `make test-nft` | Test only the NFT contract |
| `make test-marketplace` | Test only the Marketplace contract |
| `make test-gas` | Run tests with gas reporting |
| `make test-coverage` | Run tests with coverage reporting |
| `make deploy-anvil` | Deploy contracts to local Anvil |
| `make start-anvil` | Start Anvil local testnet |
| `make dev-setup` | Full development setup |
| `make clean` | Clean build artifacts |
| `make format` | Format Solidity code |
| `make help` | Show all available commands |

## Testing

### Run All Tests
```bash
make test
```

### Run Specific Test Files
```bash
# Test NFT contract
make test-nft

# Test Marketplace contract
make test-marketplace
```

### Gas Reporting
```bash
make test-gas
```

### Coverage Report
```bash
make test-coverage
```

## Deployment

### Local Development (Anvil)
1. Start Anvil:
   ```bash
   make start-anvil
   ```

2. Deploy contracts:
   ```bash
   make deploy-anvil
   ```

The deployed contract addresses will be automatically saved to `../src/lib/contract-addresses.ts` for use in the frontend.

## Contract Addresses (Anvil)

After deployment, contract addresses are saved to:
- `../src/lib/contract-addresses.ts` (for frontend)
- `./deployments.env` (environment variables)

## MetaMask Setup for Local Development

1. Add Anvil network to MetaMask:
   - Network Name: `Anvil Local`
   - RPC URL: `http://localhost:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

2. Import Anvil account:
   - Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - This is the default first account with plenty of test ETH

## Architecture

### Glb3dNft Contract
- Inherits from OpenZeppelin's ERC721URIStorage
- Simple minting function that takes a tokenURI (IPFS metadata)
- Auto-incrementing token IDs
- Ownable for future admin functions

### NftMarketplace Contract
- Handles listing, buying, and managing NFT sales
- Uses pull payment pattern for security
- Supports ETH payments
- Emits events for frontend integration
