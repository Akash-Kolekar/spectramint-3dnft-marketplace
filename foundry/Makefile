-include .env

.PHONY: all test clean deploy fund help install snapshot format anvil zktest

DEFAULT_ANVIL_KEY := 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

all: clean remove install update build

# Clean the repo
clean  :; forge clean

# Remove modules
remove :; rm -rf .gitmodules && rm -rf .git/modules/* && rm -rf lib && touch .gitmodules && git add . && git commit -m "modules"

install :; forge install cyfrin/foundry-devops@0.2.2 --no-commit && forge install foundry-rs/forge-std@v1.8.2 --no-commit && forge install openzeppelin/openzeppelin-contracts@v5.0.2 --no-commit

# Update Dependencies
update:; forge update

build:; forge build

test :; forge test 

zktest :; foundryup-zksync && forge test --zksync && foundryup

snapshot :; forge snapshot

format :; forge fmt

anvil :; anvil -m 'test test test test test test test test test test test junk' --steps-tracing --block-time 1

# NETWORK_ARGS := --rpc-url http://localhost:8545 --private-key $(DEFAULT_ANVIL_KEY) --broadcast
NETWORK_ARGS := --rpc-url http://localhost:8545 --account defaultKey --broadcast

ifeq ($(findstring --network sepolia,$(ARGS)),--network sepolia)
	NETWORK_ARGS := --rpc-url $(SEPOLIA_RPC_URL) --account God --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY) -vvvv
endif

# Deploy to Anvil (local testnet)
deploy-anvil:
	@echo "Deploying to Anvil..."
	forge script script/DeployToAnvil.s.sol:DeployToAnvil --rpc-url http://localhost:8545 --private-key $(DEFAULT_ANVIL_KEY) --broadcast -v

# Deploy to any network
deploy:
	@echo "Deploying contracts..."
	forge script script/Deploy.s.sol:Deploy $(NETWORK_ARGS)

# Test specific contracts
test-nft:
	@echo "Testing GLB3D NFT contract..."
	forge test --match-contract Glb3dNftTest -vv

test-marketplace:
	@echo "Testing NFT Marketplace contract..."
	forge test --match-contract NftMarketplaceTest -vv

# Test with gas reporting
test-gas:
	@echo "Running tests with gas reporting..."
	forge test --gas-report

# Test with coverage
test-coverage:
	@echo "Running tests with coverage..."
	forge coverage

# Start Anvil with better settings for development
start-anvil:
	@echo "Starting Anvil with development settings..."
	anvil --host 0.0.0.0 --port 8545 --accounts 10 --balance 10000 --chain-id 31337 --gas-limit 30000000 --gas-price 1000000000

# Quick setup for development
dev-setup: install build deploy-anvil

# Help command
help:
	@echo "Available commands:"
	@echo "  make install          - Install dependencies"
	@echo "  make build           - Build contracts"
	@echo "  make test            - Run all tests"
	@echo "  make test-nft        - Test NFT contract only"
	@echo "  make test-marketplace - Test Marketplace contract only"
	@echo "  make test-gas        - Run tests with gas reporting"
	@echo "  make test-coverage   - Run tests with coverage"
	@echo "  make deploy-anvil    - Deploy to local Anvil"
	@echo "  make deploy          - Deploy to specified network"
	@echo "  make start-anvil     - Start Anvil local testnet"
	@echo "  make dev-setup       - Full development setup"
	@echo "  make clean           - Clean build artifacts"
	@echo "  make format          - Format code"

