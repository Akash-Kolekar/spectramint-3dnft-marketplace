#!/bin/bash

# SpectraMint v2 Development Setup Script
# This script sets up the local development environment

set -e

echo "🚀 Setting up SpectraMint v2 Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the foundry directory
if [ ! -f "foundry.toml" ]; then
    print_error "Please run this script from the foundry directory"
    exit 1
fi

# Step 1: Install Foundry dependencies
print_status "Installing Foundry dependencies..."
make install

# Step 2: Build contracts
print_status "Building contracts..."
make build

# Step 3: Run tests
print_status "Running contract tests..."
make test

if [ $? -eq 0 ]; then
    print_status "✅ All tests passed!"
else
    print_error "❌ Tests failed. Please check the output above."
    exit 1
fi

# Step 4: Check if Anvil is running
print_status "Checking if Anvil is running..."
if curl -s http://localhost:8545 > /dev/null 2>&1; then
    print_warning "Anvil is already running on port 8545"
else
    print_status "Starting Anvil..."
    echo "You can start Anvil manually with: make start-anvil"
    echo "Or run in background: nohup make start-anvil > anvil.log 2>&1 &"
fi

# Step 5: Deploy contracts
read -p "Do you want to deploy contracts to Anvil now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Deploying contracts to Anvil..."
    if make deploy-anvil; then
        print_status "✅ Contracts deployed successfully!"
        
        # Show contract addresses
        if [ -f "../src/lib/contract-addresses.ts" ]; then
            print_status "Contract addresses saved to: ../src/lib/contract-addresses.ts"
            echo "Contract addresses:"
            grep -E "(GLB3D_NFT|NFT_MARKETPLACE)" ../src/lib/contract-addresses.ts
        fi
    else
        print_error "❌ Deployment failed. Make sure Anvil is running."
        echo "Start Anvil with: make start-anvil"
        exit 1
    fi
else
    print_warning "Skipping deployment. You can deploy later with: make deploy-anvil"
fi

# Step 6: Setup frontend
print_status "Setting up frontend dependencies..."
cd ..
if [ -f "package.json" ]; then
    print_status "Installing frontend dependencies with yarn..."
    yarn install
    
    print_status "✅ Setup complete!"
    echo ""
    echo "🎉 SpectraMint v2 is ready for development!"
    echo ""
    echo "Next steps:"
    echo "1. Start Anvil (if not already running): cd foundry && make start-anvil"
    echo "2. Deploy contracts: cd foundry && make deploy-anvil"
    echo "3. Start the frontend: yarn dev"
    echo "4. Connect MetaMask to localhost:8545 with chain ID 31337"
    echo ""
    echo "Useful commands:"
    echo "- make test              # Run all tests"
    echo "- make test-gas          # Run tests with gas reporting"
    echo "- make deploy-anvil      # Deploy to local Anvil"
    echo "- make help              # Show all available commands"
else
    print_error "package.json not found in parent directory"
fi
