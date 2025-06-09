# SpectraMint - 3D NFT Marketplace

A decentralized marketplace for creating, buying, and selling 3D NFTs built with Next.js, Foundry, and wagmi.

## 🌟 Features

- **3D NFT Creation**: Upload GLB files and create unique 3D NFTs
- **Decentralized Marketplace**: List, buy, and sell NFTs on-chain
- **IPFS Storage**: Secure and decentralized file storage via Pinata
- **Wallet Integration**: Seamless MetaMask connection
- **Real-time Updates**: Event-based NFT tracking and ownership verification
- **Responsive Design**: Modern UI with dark/light mode support

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Blockchain**: Foundry, Solidity, Anvil (local development)
- **Web3**: wagmi, viem
- **Storage**: Pinata IPFS
- **UI Components**: shadcn/ui, Lucide React

## 📋 Prerequisites

- Node.js 18+ and yarn
- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- MetaMask browser extension
- Pinata account (for IPFS storage)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd spectramint
yarn install
```

### 2. Environment Setup

Create `.env.local` in the root directory:

```env
# Pinata IPFS Configuration
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_token
NEXT_PUBLIC_PINATA_GATEWAY_URL=your_pinata_gateway_url

# Example:
# NEXT_PUBLIC_PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# NEXT_PUBLIC_PINATA_GATEWAY_URL=https://gateway.pinata.cloud
```

**Get Pinata Credentials:**
1. Sign up at [Pinata](https://pinata.cloud)
2. Go to API Keys → Create New Key
3. Copy the JWT token
4. Use the gateway URL: `https://gateway.pinata.cloud`

### 3. Start the Development Environment

**Terminal 1 - Start Anvil (Local Blockchain):**
```bash
cd foundry
anvil
```
Keep this running. Note the private keys shown - you'll need the first one.

**Terminal 2 - Deploy Smart Contracts:**
```bash
cd foundry
forge script script/DeployToAnvil.s.sol --rpc-url http://localhost:8545 --broadcast
```

**Terminal 3 - Start Frontend:**
```bash
yarn dev
```

The app will be available at `http://localhost:3000` (or next available port).

### 4. Configure MetaMask

1. **Add Anvil Network:**
   - Network Name: `Anvil Local`
   - RPC URL: `http://localhost:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

2. **Import Test Account:**
   - Use the first private key from Anvil output
   - Default: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - This account has 10,000 ETH for testing

## 🎮 Usage Guide

### Creating Your First NFT

1. **Connect Wallet**: Click "Connect Wallet" and select MetaMask
2. **Navigate to Create**: Go to `/create` page
3. **Upload Files**:
   - GLB File: Your 3D model file
   - Thumbnail: Preview image (PNG/JPG)
4. **Add Metadata**:
   - Name: Your NFT name
   - Description: Detailed description
5. **Mint NFT**: Click "Create NFT" and confirm transaction

### Viewing Your NFTs

- **Owned NFTs**: Visit `/owned` to see all your minted NFTs
- **Marketplace**: Visit `/market` to browse all available NFTs
- **Refresh**: Use the refresh button to update NFT lists

### Marketplace Operations

**Listing an NFT:**
1. Go to your owned NFTs
2. Click "List for Sale" on any NFT
3. Set your price in ETH
4. Confirm the transaction

**Buying an NFT:**
1. Browse the marketplace
2. Click on any listed NFT
3. Click "Buy Now"
4. Confirm the transaction

**Managing Listings:**
- Cancel listings anytime from your owned NFTs
- Update prices through the marketplace
- Withdraw proceeds from sales

## 🏗️ Project Structure

```
spectramint/
├── foundry/                 # Smart contracts
│   ├── src/
│   │   ├── Glb3dNft.sol    # ERC721 NFT contract
│   │   └── NftMarketplace.sol # Marketplace contract
│   └── script/
│       └── DeployToAnvil.s.sol # Deployment script
├── src/
│   ├── app/                 # Next.js app router
│   ├── components/          # React components
│   ├── lib/
│   │   ├── contracts/       # Contract ABIs and addresses
│   │   └── utils/           # Utility functions
│   └── types/               # TypeScript types
└── public/                  # Static assets
```

## 🔧 Smart Contracts

### GLB3D NFT Contract
- **Address**: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
- **Functions**: `mintNft()`, `ownerOf()`, `tokenURI()`
- **Standard**: ERC721 with URI storage

### NFT Marketplace Contract
- **Address**: `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`
- **Functions**: `listItem()`, `buyItem()`, `cancelListing()`
- **Features**: Escrow system, proceeds withdrawal

## 🐛 Troubleshooting

### Common Issues

**"Connect Wallet" button not visible:**
- Ensure MetaMask is installed and unlocked
- Check that you're on the correct network (Anvil - Chain ID 31337)

**NFTs not appearing in owned page:**
- Click the "Refresh" button
- Check browser console for errors
- Verify you're using the correct wallet address

**Transaction failures:**
- Ensure Anvil is running
- Check you have sufficient ETH balance
- Verify contract addresses are correct

**Metadata loading issues:**
- Check Pinata configuration
- Verify IPFS URLs are accessible
- Check network connectivity

### Debug Tools

**Debug Page**: Visit `/debug` for wallet and contract status
**Debug Owned**: Visit `/debug-owned` for NFT detection analysis
**Console Logs**: Check browser console for detailed operation logs

## 🔄 Restarting the Environment

If you need to restart everything:

1. **Stop all processes** (Ctrl+C in all terminals)
2. **Restart Anvil**: `cd foundry && anvil`
3. **Redeploy contracts**: `cd foundry && forge script script/DeployToAnvil.s.sol --rpc-url http://localhost:8545 --broadcast`
4. **Restart frontend**: `yarn dev`
5. **Reset MetaMask**: Settings → Advanced → Reset Account (if needed)

## 📚 Additional Resources

- [Foundry Documentation](https://book.getfoundry.sh/)
- [wagmi Documentation](https://wagmi.sh/)
- [Pinata IPFS Guide](https://docs.pinata.cloud/)
- [MetaMask Developer Docs](https://docs.metamask.io/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Happy Building! 🚀**

For support or questions, please open an issue in the repository.
