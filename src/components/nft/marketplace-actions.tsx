"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useListItem, useBuyItem, useNftMarketplaceWrite } from "@/lib/contracts/hooks";
import { useAccount, useChainId, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { getContractAddress } from "@/lib/contracts/addresses";
import { GLB3D_NFT_ABI, NFT_MARKETPLACE_ABI } from "@/lib/contracts/abis";
import { parseEther, formatEther } from "viem";
import { toast } from "sonner";
import { LoaderCircle, ShoppingCart, Tag, X } from "lucide-react";
import { foundry } from "wagmi/chains";

interface MarketplaceActionsProps {
  tokenId: bigint;
  isOwner: boolean;
  isListed: boolean;
  listingPrice?: bigint;
  seller?: string;
  onListingUpdate?: () => void;
}

export default function MarketplaceActions({
  tokenId,
  isOwner,
  isListed,
  listingPrice,
  seller,
  onListingUpdate,
}: MarketplaceActionsProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [listPrice, setListPrice] = useState("");
  const [isListDialogOpen, setIsListDialogOpen] = useState(false);

  // Contract hooks
  const { listItem, hash: listHash, isPending: isListPending, isConfirming: isListConfirming, isConfirmed: isListConfirmed, error: listError } = useListItem();
  const { buyItem, hash: buyHash, isPending: isBuyPending, isConfirming: isBuyConfirming, isConfirmed: isBuyConfirmed, error: buyError } = useBuyItem();
  
  // For approval and cancel listing
  const { writeContract, data: txHash, isPending: isTxPending } = useWriteContract();
  const { isLoading: isTxConfirming, isSuccess: isTxConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Handle listing confirmation
  React.useEffect(() => {
    if (isListConfirmed) {
      toast.success("NFT listed successfully!");
      setIsListDialogOpen(false);
      setListPrice("");
      onListingUpdate?.();
    }
  }, [isListConfirmed, onListingUpdate]);

  // Handle buy confirmation
  React.useEffect(() => {
    if (isBuyConfirmed) {
      toast.success("NFT purchased successfully!");
      onListingUpdate?.();
    }
  }, [isBuyConfirmed, onListingUpdate]);

  // Handle transaction confirmation
  React.useEffect(() => {
    if (isTxConfirmed) {
      toast.success("Transaction completed successfully!");
      onListingUpdate?.();
    }
  }, [isTxConfirmed, onListingUpdate]);

  // Handle errors
  React.useEffect(() => {
    if (listError) {
      toast.error(`Listing failed: ${listError.message}`);
    }
    if (buyError) {
      toast.error(`Purchase failed: ${buyError.message}`);
    }
  }, [listError, buyError]);

  const handleApproveMarketplace = async () => {
    if (!isConnected || chainId !== foundry.id) {
      toast.error("Please connect to Anvil network");
      return;
    }

    try {
      writeContract({
        address: getContractAddress(chainId as 31337, 'GLB3D_NFT'),
        abi: GLB3D_NFT_ABI,
        functionName: 'approve',
        args: [getContractAddress(chainId as 31337, 'NFT_MARKETPLACE'), tokenId],
      });
      toast.info("Approving marketplace...");
    } catch (error) {
      console.error("Approval error:", error);
      toast.error("Failed to approve marketplace");
    }
  };

  const handleListItem = async () => {
    if (!listPrice || parseFloat(listPrice) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (!isConnected || chainId !== foundry.id) {
      toast.error("Please connect to Anvil network");
      return;
    }

    try {
      const nftAddress = getContractAddress(chainId as 31337, 'GLB3D_NFT');
      listItem(nftAddress, tokenId, listPrice, chainId as 31337);
      toast.info("Listing NFT...");
    } catch (error) {
      console.error("Listing error:", error);
      toast.error("Failed to list NFT");
    }
  };

  const handleBuyItem = async () => {
    if (!listingPrice) {
      toast.error("No listing price available");
      return;
    }

    if (!isConnected || chainId !== foundry.id) {
      toast.error("Please connect to Anvil network");
      return;
    }

    try {
      const nftAddress = getContractAddress(chainId as 31337, 'GLB3D_NFT');
      const priceInEth = formatEther(listingPrice);
      buyItem(nftAddress, tokenId, priceInEth, chainId as 31337);
      toast.info("Purchasing NFT...");
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("Failed to purchase NFT");
    }
  };

  const handleCancelListing = async () => {
    if (!isConnected || chainId !== foundry.id) {
      toast.error("Please connect to Anvil network");
      return;
    }

    try {
      writeContract({
        address: getContractAddress(chainId as 31337, 'NFT_MARKETPLACE'),
        abi: NFT_MARKETPLACE_ABI,
        functionName: 'cancelListing',
        args: [getContractAddress(chainId as 31337, 'GLB3D_NFT'), tokenId],
      });
      toast.info("Canceling listing...");
    } catch (error) {
      console.error("Cancel listing error:", error);
      toast.error("Failed to cancel listing");
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className="space-y-2">
      {isOwner && !isListed && (
        <div className="space-y-2">
          <Button
            onClick={handleApproveMarketplace}
            disabled={isTxPending || isTxConfirming}
            variant="outline"
            className="w-full"
          >
            {isTxPending || isTxConfirming ? (
              <LoaderCircle className="animate-spin mr-2" />
            ) : null}
            Approve Marketplace
          </Button>

          <Dialog open={isListDialogOpen} onOpenChange={setIsListDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Tag className="mr-2 h-4 w-4" />
                List for Sale
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>List NFT for Sale</DialogTitle>
                <DialogDescription>
                  Set a price for your NFT in ETH
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="price">Price (ETH)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.001"
                    placeholder="0.1"
                    value={listPrice}
                    onChange={(e) => setListPrice(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleListItem}
                  disabled={isListPending || isListConfirming}
                  className="w-full"
                >
                  {isListPending || isListConfirming ? (
                    <LoaderCircle className="animate-spin mr-2" />
                  ) : null}
                  List NFT
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {isOwner && isListed && (
        <Button
          onClick={handleCancelListing}
          disabled={isTxPending || isTxConfirming}
          variant="destructive"
          className="w-full"
        >
          {isTxPending || isTxConfirming ? (
            <LoaderCircle className="animate-spin mr-2" />
          ) : (
            <X className="mr-2 h-4 w-4" />
          )}
          Cancel Listing
        </Button>
      )}

      {!isOwner && isListed && listingPrice && (
        <div className="space-y-2">
          <div className="text-center">
            <p className="text-lg font-bold">
              {formatEther(listingPrice)} ETH
            </p>
            <p className="text-sm text-muted-foreground">
              Listed by: {seller?.slice(0, 6)}...{seller?.slice(-4)}
            </p>
          </div>
          <Button
            onClick={handleBuyItem}
            disabled={isBuyPending || isBuyConfirming}
            className="w-full"
          >
            {isBuyPending || isBuyConfirming ? (
              <LoaderCircle className="animate-spin mr-2" />
            ) : (
              <ShoppingCart className="mr-2 h-4 w-4" />
            )}
            Buy Now
          </Button>
        </div>
      )}
    </div>
  );
}
