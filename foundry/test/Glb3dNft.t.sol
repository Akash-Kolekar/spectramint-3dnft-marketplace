// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {Glb3dNft} from "../src/Glb3dNft.sol";

contract Glb3dNftTest is Test {
    Glb3dNft public glb3dNft;
    address public owner;
    address public user1;
    address public user2;

    string constant TEST_TOKEN_URI = "ipfs://QmTestHash123456789";
    string constant TEST_TOKEN_URI_2 = "ipfs://QmTestHash987654321";

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    function setUp() public {
        owner = makeAddr("owner");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");

        vm.prank(owner);
        glb3dNft = new Glb3dNft();
    }

    function testInitialState() public view {
        assertEq(glb3dNft.name(), "3D GLB NFT");
        assertEq(glb3dNft.symbol(), "GLB3D");
        assertEq(glb3dNft.owner(), owner);
    }

    function testMintNft() public {
        vm.prank(user1);

        vm.expectEmit(true, true, true, false);
        emit Transfer(address(0), user1, 0);

        uint256 tokenId = glb3dNft.mintNft(TEST_TOKEN_URI);

        assertEq(tokenId, 0);
        assertEq(glb3dNft.ownerOf(tokenId), user1);
        assertEq(glb3dNft.tokenURI(tokenId), TEST_TOKEN_URI);
    }

    function testMintMultipleNfts() public {
        // Mint first NFT
        vm.prank(user1);
        uint256 tokenId1 = glb3dNft.mintNft(TEST_TOKEN_URI);

        // Mint second NFT
        vm.prank(user2);
        uint256 tokenId2 = glb3dNft.mintNft(TEST_TOKEN_URI_2);

        assertEq(tokenId1, 0);
        assertEq(tokenId2, 1);
        assertEq(glb3dNft.ownerOf(tokenId1), user1);
        assertEq(glb3dNft.ownerOf(tokenId2), user2);
        assertEq(glb3dNft.tokenURI(tokenId1), TEST_TOKEN_URI);
        assertEq(glb3dNft.tokenURI(tokenId2), TEST_TOKEN_URI_2);
    }

    function testMintWithEmptyTokenURI() public {
        vm.prank(user1);
        uint256 tokenId = glb3dNft.mintNft("");

        assertEq(tokenId, 0);
        assertEq(glb3dNft.ownerOf(tokenId), user1);
        assertEq(glb3dNft.tokenURI(tokenId), "");
    }

    function testTokenCounter() public {
        // Mint 3 NFTs and check token counter increments
        vm.prank(user1);
        uint256 tokenId1 = glb3dNft.mintNft(TEST_TOKEN_URI);

        vm.prank(user1);
        uint256 tokenId2 = glb3dNft.mintNft(TEST_TOKEN_URI);

        vm.prank(user2);
        uint256 tokenId3 = glb3dNft.mintNft(TEST_TOKEN_URI);

        assertEq(tokenId1, 0);
        assertEq(tokenId2, 1);
        assertEq(tokenId3, 2);
    }

    function testTransferNft() public {
        // Mint NFT to user1
        vm.prank(user1);
        uint256 tokenId = glb3dNft.mintNft(TEST_TOKEN_URI);

        // Transfer from user1 to user2
        vm.prank(user1);
        glb3dNft.transferFrom(user1, user2, tokenId);

        assertEq(glb3dNft.ownerOf(tokenId), user2);
    }

    function testApproveAndTransfer() public {
        // Mint NFT to user1
        vm.prank(user1);
        uint256 tokenId = glb3dNft.mintNft(TEST_TOKEN_URI);

        // Approve user2 to transfer the NFT
        vm.prank(user1);
        glb3dNft.approve(user2, tokenId);

        assertEq(glb3dNft.getApproved(tokenId), user2);

        // Transfer via approved user
        vm.prank(user2);
        glb3dNft.transferFrom(user1, user2, tokenId);

        assertEq(glb3dNft.ownerOf(tokenId), user2);
    }

    function testSetApprovalForAll() public {
        // Mint NFT to user1
        vm.prank(user1);
        uint256 tokenId = glb3dNft.mintNft(TEST_TOKEN_URI);

        // Set approval for all
        vm.prank(user1);
        glb3dNft.setApprovalForAll(user2, true);

        assertTrue(glb3dNft.isApprovedForAll(user1, user2));

        // Transfer via approved operator
        vm.prank(user2);
        glb3dNft.transferFrom(user1, user2, tokenId);

        assertEq(glb3dNft.ownerOf(tokenId), user2);
    }

    function testRevertWhenMintToZeroAddress() public {
        vm.expectRevert();
        vm.prank(address(0));
        glb3dNft.mintNft(TEST_TOKEN_URI);
    }

    function testRevertWhenTransferFromNotOwner() public {
        vm.prank(user1);
        uint256 tokenId = glb3dNft.mintNft(TEST_TOKEN_URI);

        // Try to transfer without permission
        vm.expectRevert();
        vm.prank(user2);
        glb3dNft.transferFrom(user1, user2, tokenId);
    }

    function testRevertWhenTransferNonExistentToken() public {
        vm.expectRevert();
        vm.prank(user1);
        glb3dNft.transferFrom(user1, user2, 999);
    }
}
