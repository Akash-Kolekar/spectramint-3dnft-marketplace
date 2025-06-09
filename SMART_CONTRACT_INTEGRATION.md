# 3D NFT Marketplace - Smart Contract Integration

## Overview

This project is a 3D NFT marketplace built with Next.js, wagmi/viem, and Foundry smart contracts. Users can create, buy, sell, list, and delist 3D NFTs on the Anvil local blockchain.

## Smart Contracts

### 1. Glb3dNft.sol
- **Purpose**: ERC721 NFT contract for 3D models
- **Key Functions**:
  - `mintNft(string tokenURI)`: Mint a new NFT with metadata URI
  - Standard ERC721 functions (transfer, approve, etc.)

### 2. NftMarketplace.sol
- **Purpose**: Marketplace for buying/selling NFTs
- **Key Functions**:
  - `listItem(address nftAddress, uint256 tokenId, uint256 price)`: List NFT for sale
  - `buyItem(address nftAddress, uint256 tokenId)`: Purchase listed NFT
  - `cancelListing(address nftAddress, uint256 tokenId)`: Cancel listing
  - `updateListing(address nftAddress, uint256 tokenId, uint256 newPrice)`: Update price
  - `withdrawProceeds()`: Withdraw sales proceeds
  - `getListing(address nftAddress, uint256 tokenId)`: Get listing details
  - `getProceeds(address seller)`: Get seller's proceeds

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Yarn
- Foundry (forge, anvil)

### 1. Start Anvil Chain
```bash
cd foundry
anvil
```
This starts a local blockchain on `http://localhost:8545` with Chain ID `31337`.

### 2. Deploy Smart Contracts
In a new terminal:
```bash
cd foundry
forge script script/DeployToAnvil.s.sol --rpc-url http://localhost:8545 --broadcast
```

This will deploy both contracts and output their addresses:
- GLB3D NFT Contract: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- NFT Marketplace Contract: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`

### 3. Start UI Server
In a new terminal:
```bash
yarn install
yarn dev
```

The application will be available at `http://localhost:3000` (or `3001` if 3000 is in use).

## Features Implemented

### 1. NFT Creation (`/create`)
- Upload 3D GLB files and thumbnail images
- Store metadata on IPFS via Pinata
- Mint NFTs on blockchain with IPFS metadata URI
- Real-time transaction status tracking
- 3D model preview

### 2. Marketplace (`/market`)
- View all minted NFTs
- See listing status and prices
- Buy listed NFTs
- 3D model previews in cards

### 3. Owned NFTs (`/owned`)
- View user's owned NFTs
- List NFTs for sale
- Cancel listings
- Update listing prices
- Withdraw sales proceeds
- Approve marketplace for transfers

### 4. Individual NFT View (`/market/[tokenId]`)
- Detailed NFT information
- 3D model viewer
- Marketplace actions (buy/list/cancel)
- Transaction history
- External IPFS links

## Technical Implementation

### Wagmi Configuration
- Configured for Anvil (foundry) chain
- Support for MetaMask and injected wallets
- HTTP transport for local blockchain

### Contract Integration
- Type-safe contract interactions using wagmi hooks
- Custom hooks for common operations:
  - `useMintNft()`: Mint new NFTs
  - `useListItem()`: List NFTs for sale
  - `useBuyItem()`: Purchase NFTs
  - `useCancelListing()`: Cancel listings
  - `useWithdrawProceeds()`: Withdraw proceeds

### IPFS Integration
- Pinata for decentralized storage
- Metadata includes:
  - Name, description, image
  - 3D model file hash
  - Creator address
  - Attributes (background color, etc.)

### UI Components
- `NFTCard`: Reusable NFT display component
- `MarketplaceActions`: Buy/sell/list actions
- `UserProceeds`: Sales proceeds management
- Responsive design with Tailwind CSS

## Wallet Setup

### MetaMask Configuration
1. Add Anvil network:
   - Network Name: Anvil
   - RPC URL: http://localhost:8545
   - Chain ID: 31337
   - Currency Symbol: ETH

2. Import Anvil account:
   - Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - This gives you 10,000 ETH for testing

## Testing Workflow

1. **Create NFT**:
   - Go to `/create`
   - Upload GLB file and thumbnail
   - Fill in name/description
   - Submit to mint NFT

2. **List for Sale**:
   - Go to `/owned`
   - Click "Approve Marketplace" on your NFT
   - Click "List for Sale" and set price
   - Confirm transaction

3. **Buy NFT**:
   - Go to `/market`
   - Find listed NFT
   - Click "Buy Now"
   - Confirm transaction

4. **Withdraw Proceeds**:
   - Go to `/owned`
   - Check "Sales Proceeds" card
   - Click "Withdraw Proceeds"

## Contract Addresses (Anvil)
- GLB3D NFT: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- NFT Marketplace: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`

## Key Files Modified/Created

### Smart Contract Integration
- `src/lib/contracts/addresses.ts` - Contract addresses
- `src/lib/contracts/abis.ts` - Contract ABIs
- `src/lib/contracts/hooks.ts` - Wagmi hooks
- `src/lib/wagmi.ts` - Wagmi configuration

### UI Components
- `src/components/nft/nft-card.tsx` - NFT display component
- `src/components/nft/marketplace-actions.tsx` - Buy/sell actions
- `src/components/nft/user-proceeds.tsx` - Proceeds management
- `src/components/ui/dialog.tsx` - Modal dialogs

### Pages
- `src/app/create/page.tsx` - NFT creation with minting
- `src/app/market/page.tsx` - Marketplace with blockchain data
- `src/app/owned/page.tsx` - User's NFTs with management
- `src/app/market/[tokenId]/page.tsx` - Individual NFT view

### Utilities
- `src/lib/utils/pinata.ts` - Updated with GLB file hash

## Error Handling
- Network validation (must be on Anvil)
- Wallet connection checks
- Transaction error handling
- Loading states for all operations
- Toast notifications for user feedback

## Next Steps
- Add event listening for real-time updates
- Implement offer/auction system
- Add royalty support
- Deploy to testnets/mainnet
- Add more 3D model formats
- Implement collection features
