"use client";

import SingleMarketItem from "@/components/market/single-item";
import MaxWidthWrapper from "@/components/wrappers/max-width-wrapper";
import { getAllFilesFromIPFS } from "@/lib/utils/pinata";
import { LoaderCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import NFTCard from "@/components/nft/nft-card";
import { useAccount, useChainId, useReadContract } from "wagmi";
import { getContractAddress } from "@/lib/contracts/addresses";
import { GLB3D_NFT_ABI } from "@/lib/contracts/abis";
import { foundry } from "wagmi/chains";
import ConnectWalletButton from "@/components/auth/connect-wallet-button";

interface IPFSFile {
  id: string;
  ipfs_pin_hash: string;
  size: number;
  user_id: string;
  date_pinned: string;
  date_unpinned: string | null;
  metadata: {
    name: string | null;
    keyvalues: Record<string, any> | null;
  };
  regions: Array<{
    regionId: string;
    currentReplicationCount: number;
    desiredReplicationCount: number;
  }>;
  mime_type: string;
  number_of_files: number;
}

const Market = () => {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const [nftTokenIds, setNftTokenIds] = useState<bigint[]>([]);
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(false);

  // Get total supply of NFTs to know how many exist
  const { data: totalSupply, isLoading: isLoadingSupply } = useReadContract({
    address: chainId === foundry.id ? getContractAddress(chainId as 31337, 'GLB3D_NFT') : undefined,
    abi: GLB3D_NFT_ABI,
    functionName: 'balanceOf',
    args: chainId === foundry.id ? [getContractAddress(chainId as 31337, 'GLB3D_NFT')] : undefined,
  });

  // Fetch all minted NFTs using Transfer events
  useEffect(() => {
    if (chainId === foundry.id) {
      setIsLoadingNFTs(true);

      const fetchAllNFTs = async () => {
        try {
          const tokenIds: bigint[] = [];

          // Get all Transfer events from zero address (mints)
          const response = await fetch('http://localhost:8545', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_getLogs',
              params: [{
                fromBlock: '0x0',
                toBlock: 'latest',
                address: getContractAddress(chainId as 31337, 'GLB3D_NFT'),
                topics: [
                  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // Transfer event signature
                  '0x0000000000000000000000000000000000000000000000000000000000000000', // from zero address (mints)
                ]
              }],
              id: 1,
            }),
          });

          const result = await response.json();

          if (result.result && Array.isArray(result.result)) {
            // Extract token IDs from the mint logs
            const mintLogs = result.result;

            mintLogs.forEach((log: any) => {
              if (log.topics && log.topics[3]) {
                // Token ID is in the 4th topic (index 3)
                const tokenId = BigInt(log.topics[3]);
                tokenIds.push(tokenId);
              }
            });
          }

          setNftTokenIds(tokenIds.sort((a, b) => Number(a - b)));
          setIsLoadingNFTs(false);
        } catch (error) {
          console.error('Error fetching NFTs:', error);
          setNftTokenIds([]);
          setIsLoadingNFTs(false);
        }
      };

      fetchAllNFTs();
    }
  }, [chainId]);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="mb-4 text-lg font-bold">
          Please connect your wallet to view the marketplace.
        </p>
        <ConnectWalletButton />
      </div>
    );
  }

  if (chainId !== foundry.id) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="mb-4 text-lg font-bold text-destructive">
          Please switch to Anvil network (Chain ID: 31337)
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Current network: {chainId}
        </p>
        <ConnectWalletButton />
      </div>
    );
  }

  if (isLoadingNFTs || isLoadingSupply) {
    return (
      <div className="flex items-center justify-center pt-20">
        <LoaderCircle className="animate-spin mr-2" />
        <span>Loading NFTs...</span>
      </div>
    );
  }

  if (nftTokenIds.length === 0) {
    return (
      <div className="p-5 sm:p-2 sm:pt-20 pt-20">
        <h1 className="text-4xl font-bold mb-10 text-center">Explore Market</h1>
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">No NFTs have been minted yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Be the first to create an NFT!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-2 sm:pt-20 pt-20">
      <h1 className="text-4xl font-bold mb-10 text-center">Explore Market</h1>
      <MaxWidthWrapper className="grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 gap-6">
        {nftTokenIds.map((tokenId) => (
          <NFTCard
            key={tokenId.toString()}
            tokenId={tokenId}
            showMarketplaceActions={true}
          />
        ))}
      </MaxWidthWrapper>
    </div>
  );
};

export default Market;
