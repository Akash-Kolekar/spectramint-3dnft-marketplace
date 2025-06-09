// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {Glb3dNft} from "../src/Glb3dNft.sol";
import {NftMarketplace} from "../src/NftMarketplace.sol";

contract DeployToAnvil is Script {
    function run() external {
        // Use the default Anvil private key (account 0)
        uint256 deployerPrivateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying contracts with account:", deployer);
        console.log("Account balance:", deployer.balance);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy GLB3D NFT Contract
        Glb3dNft glb3dNft = new Glb3dNft();
        console.log("GLB3D NFT Contract deployed at:", address(glb3dNft));

        // Deploy NFT Marketplace Contract
        NftMarketplace marketplace = new NftMarketplace();
        console.log("NFT Marketplace Contract deployed at:", address(marketplace));

        vm.stopBroadcast();

        // Create a JavaScript/TypeScript formatted output for easy frontend integration
        string memory jsOutput = string(
            abi.encodePacked(
                "// Auto-generated contract addresses for Anvil\n",
                "export const ANVIL_CONTRACTS = {\n",
                "  GLB3D_NFT: \"",
                vm.toString(address(glb3dNft)),
                "\",\n",
                "  NFT_MARKETPLACE: \"",
                vm.toString(address(marketplace)),
                "\",\n",
                "} as const;\n\n",
                "export const CONTRACT_ADDRESSES = {\n",
                "  31337: ANVIL_CONTRACTS, // Anvil chain ID\n",
                "} as const;\n"
            )
        );

        vm.writeFile("../src/lib/contract-addresses.ts", jsOutput);
        console.log("Contract addresses saved to ../src/lib/contract-addresses.ts");

        // Also create a simple .env format for backup
        string memory envOutput = string(
            abi.encodePacked(
                "GLB3D_NFT_ADDRESS=",
                vm.toString(address(glb3dNft)),
                "\n",
                "NFT_MARKETPLACE_ADDRESS=",
                vm.toString(address(marketplace)),
                "\n"
            )
        );

        vm.writeFile("./deployments.env", envOutput);
        console.log("Deployment addresses also saved to ./deployments.env");
    }
}
