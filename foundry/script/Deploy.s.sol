// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {Glb3dNft} from "../src/Glb3dNft.sol";
import {NftMarketplace} from "../src/NftMarketplace.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy GLB3D NFT Contract
        Glb3dNft glb3dNft = new Glb3dNft();
        console.log("GLB3D NFT Contract deployed at:", address(glb3dNft));

        // Deploy NFT Marketplace Contract
        NftMarketplace marketplace = new NftMarketplace();
        console.log("NFT Marketplace Contract deployed at:", address(marketplace));

        vm.stopBroadcast();

        // Save deployment addresses to a file for frontend use
        string memory deploymentInfo = string(
            abi.encodePacked(
                "GLB3D_NFT=",
                vm.toString(address(glb3dNft)),
                "\n",
                "NFT_MARKETPLACE=",
                vm.toString(address(marketplace)),
                "\n"
            )
        );

        vm.writeFile("./deployments.txt", deploymentInfo);
        console.log("Deployment addresses saved to deployments.txt");
    }
}
