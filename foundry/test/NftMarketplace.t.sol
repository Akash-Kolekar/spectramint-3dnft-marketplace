// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {NftMarketplace} from "../src/NftMarketplace.sol";
import {Glb3dNft} from "../src/Glb3dNft.sol";

contract NftMarketplaceTest is Test {
    NftMarketplace public marketplace;
    Glb3dNft public nft;

    address public seller;
    address public buyer;
    address public owner;

    uint256 public constant TOKEN_ID = 0;
    uint256 public constant PRICE = 1 ether;
    uint256 public constant NEW_PRICE = 2 ether;
    string constant TEST_TOKEN_URI = "ipfs://QmTestHash123456789";

    event ItemListed(address indexed seller, address indexed nftAddress, uint256 indexed tokenId, uint256 price);

    event ItemBought(address indexed buyer, address indexed nftAddress, uint256 indexed tokenId, uint256 price);

    event ItemCanceled(address indexed seller, address indexed nftAddress, uint256 indexed tokenId);

    function setUp() public {
        owner = makeAddr("owner");
        seller = makeAddr("seller");
        buyer = makeAddr("buyer");

        // Deploy contracts
        marketplace = new NftMarketplace();

        vm.prank(owner);
        nft = new Glb3dNft();

        // Mint NFT to seller
        vm.prank(seller);
        nft.mintNft(TEST_TOKEN_URI);

        // Give buyer some ETH
        vm.deal(buyer, 10 ether);
    }

    modifier nftListed() {
        vm.startPrank(seller);
        nft.approve(address(marketplace), TOKEN_ID);
        marketplace.listItem(address(nft), TOKEN_ID, PRICE);
        vm.stopPrank();
        _;
    }

    function testListItem() public {
        vm.startPrank(seller);
        nft.approve(address(marketplace), TOKEN_ID);

        vm.expectEmit(true, true, true, true);
        emit ItemListed(seller, address(nft), TOKEN_ID, PRICE);

        marketplace.listItem(address(nft), TOKEN_ID, PRICE);
        vm.stopPrank();

        NftMarketplace.Listing memory listing = marketplace.getListing(address(nft), TOKEN_ID);
        assertEq(listing.price, PRICE);
        assertEq(listing.seller, seller);
    }

    function testRevertWhenListItemNotOwner() public {
        vm.startPrank(buyer);
        vm.expectRevert(abi.encodeWithSelector(NftMarketplace.NotOwner.selector));
        marketplace.listItem(address(nft), TOKEN_ID, PRICE);
        vm.stopPrank();
    }

    function testRevertWhenListItemNotApproved() public {
        vm.expectRevert(abi.encodeWithSelector(NftMarketplace.NotApprovedForMarketplace.selector));
        vm.prank(seller);
        marketplace.listItem(address(nft), TOKEN_ID, PRICE);
    }

    function testRevertWhenListItemZeroPrice() public {
        vm.startPrank(seller);
        vm.expectRevert(abi.encodeWithSelector(NftMarketplace.PriceMustBeAboveZero.selector));
        marketplace.listItem(address(nft), TOKEN_ID, 0);
        vm.stopPrank();
    }

    function testRevertWhenListItemAlreadyListed() public nftListed {
        vm.startPrank(seller);
        vm.expectRevert(abi.encodeWithSelector(NftMarketplace.AlreadyListed.selector, address(nft), TOKEN_ID));
        marketplace.listItem(address(nft), TOKEN_ID, PRICE);
        vm.stopPrank();
    }

    function testBuyItem() public nftListed {
        vm.expectEmit(true, true, true, true);
        emit ItemBought(buyer, address(nft), TOKEN_ID, PRICE);

        vm.prank(buyer);
        marketplace.buyItem{value: PRICE}(address(nft), TOKEN_ID);

        assertEq(nft.ownerOf(TOKEN_ID), buyer);
        assertEq(marketplace.getProceeds(seller), PRICE);

        // Check that listing is removed
        NftMarketplace.Listing memory listing = marketplace.getListing(address(nft), TOKEN_ID);
        assertEq(listing.price, 0);
    }

    function testRevertWhenBuyItemNotListed() public {
        vm.expectRevert(abi.encodeWithSelector(NftMarketplace.NotListed.selector, address(nft), TOKEN_ID));
        vm.prank(buyer);
        marketplace.buyItem{value: PRICE}(address(nft), TOKEN_ID);
    }

    function testRevertWhenBuyItemInsufficientPayment() public nftListed {
        vm.expectRevert(abi.encodeWithSelector(NftMarketplace.Glb3dMarketplace__PriceNotMet.selector));
        vm.prank(buyer);
        marketplace.buyItem{value: PRICE - 1}(address(nft), TOKEN_ID);
    }

    function testBuyItemWithExcessPayment() public nftListed {
        uint256 excessPayment = PRICE + 0.5 ether;

        vm.prank(buyer);
        marketplace.buyItem{value: excessPayment}(address(nft), TOKEN_ID);

        assertEq(nft.ownerOf(TOKEN_ID), buyer);
        assertEq(marketplace.getProceeds(seller), PRICE);
    }

    function testCancelListing() public nftListed {
        vm.expectEmit(true, true, true, false);
        emit ItemCanceled(seller, address(nft), TOKEN_ID);

        vm.prank(seller);
        marketplace.cancelListing(address(nft), TOKEN_ID);

        NftMarketplace.Listing memory listing = marketplace.getListing(address(nft), TOKEN_ID);
        assertEq(listing.price, 0);
    }

    function testRevertWhenCancelListingNotOwner() public nftListed {
        vm.expectRevert(abi.encodeWithSelector(NftMarketplace.NotOwner.selector));
        vm.prank(buyer);
        marketplace.cancelListing(address(nft), TOKEN_ID);
    }

    function testRevertWhenCancelListingNotListed() public {
        vm.expectRevert(abi.encodeWithSelector(NftMarketplace.NotListed.selector, address(nft), TOKEN_ID));
        vm.prank(seller);
        marketplace.cancelListing(address(nft), TOKEN_ID);
    }

    function testUpdateListing() public nftListed {
        vm.expectEmit(true, true, true, true);
        emit ItemListed(seller, address(nft), TOKEN_ID, NEW_PRICE);

        vm.prank(seller);
        marketplace.updateListing(address(nft), TOKEN_ID, NEW_PRICE);

        NftMarketplace.Listing memory listing = marketplace.getListing(address(nft), TOKEN_ID);
        assertEq(listing.price, NEW_PRICE);
        assertEq(listing.seller, seller);
    }

    function testRevertWhenUpdateListingNotOwner() public nftListed {
        vm.expectRevert(abi.encodeWithSelector(NftMarketplace.NotOwner.selector));
        vm.prank(buyer);
        marketplace.updateListing(address(nft), TOKEN_ID, NEW_PRICE);
    }

    function testRevertWhenUpdateListingNotListed() public {
        vm.expectRevert(abi.encodeWithSelector(NftMarketplace.NotListed.selector, address(nft), TOKEN_ID));
        vm.prank(seller);
        marketplace.updateListing(address(nft), TOKEN_ID, NEW_PRICE);
    }

    function testRevertWhenUpdateListingZeroPrice() public nftListed {
        vm.expectRevert(abi.encodeWithSelector(NftMarketplace.PriceMustBeAboveZero.selector));
        vm.prank(seller);
        marketplace.updateListing(address(nft), TOKEN_ID, 0);
    }

    function testWithdrawProceeds() public nftListed {
        // Buy the item first
        vm.prank(buyer);
        marketplace.buyItem{value: PRICE}(address(nft), TOKEN_ID);

        uint256 sellerBalanceBefore = seller.balance;

        vm.prank(seller);
        marketplace.withdrawProceeds();

        assertEq(seller.balance, sellerBalanceBefore + PRICE);
        assertEq(marketplace.getProceeds(seller), 0);
    }

    function testRevertWhenWithdrawNoProceeds() public {
        vm.expectRevert(abi.encodeWithSelector(NftMarketplace.NoProceeds.selector));
        vm.prank(seller);
        marketplace.withdrawProceeds();
    }

    function testMultipleListingsAndSales() public {
        // Mint another NFT
        vm.prank(seller);
        uint256 tokenId2 = nft.mintNft(TEST_TOKEN_URI);

        // List both NFTs
        vm.startPrank(seller);
        nft.approve(address(marketplace), TOKEN_ID);
        nft.approve(address(marketplace), tokenId2);
        marketplace.listItem(address(nft), TOKEN_ID, PRICE);
        marketplace.listItem(address(nft), tokenId2, NEW_PRICE);
        vm.stopPrank();

        // Buy both NFTs
        vm.startPrank(buyer);
        marketplace.buyItem{value: PRICE}(address(nft), TOKEN_ID);
        marketplace.buyItem{value: NEW_PRICE}(address(nft), tokenId2);
        vm.stopPrank();

        // Check proceeds
        assertEq(marketplace.getProceeds(seller), PRICE + NEW_PRICE);
        assertEq(nft.ownerOf(TOKEN_ID), buyer);
        assertEq(nft.ownerOf(tokenId2), buyer);
    }

    function testGetListing() public nftListed {
        NftMarketplace.Listing memory listing = marketplace.getListing(address(nft), TOKEN_ID);
        assertEq(listing.price, PRICE);
        assertEq(listing.seller, seller);
    }

    function testGetListingNotListed() public view {
        NftMarketplace.Listing memory listing = marketplace.getListing(address(nft), TOKEN_ID);
        assertEq(listing.price, 0);
        assertEq(listing.seller, address(0));
    }

    function testGetProceeds() public {
        assertEq(marketplace.getProceeds(seller), 0);

        // List and buy item
        vm.startPrank(seller);
        nft.approve(address(marketplace), TOKEN_ID);
        marketplace.listItem(address(nft), TOKEN_ID, PRICE);
        vm.stopPrank();

        vm.prank(buyer);
        marketplace.buyItem{value: PRICE}(address(nft), TOKEN_ID);

        assertEq(marketplace.getProceeds(seller), PRICE);
    }
}
