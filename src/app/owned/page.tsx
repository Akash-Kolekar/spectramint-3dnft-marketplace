"use client";

import ConnectWalletButton from "@/components/auth/connect-wallet-button";
import SingleMarketItem from "@/components/market/single-item";
import SingleOwnedItem from "@/components/market/single-owned-item";
import MaxWidthWrapper from "@/components/wrappers/max-width-wrapper";
import { MarketItem } from "@/lib/types/market";
import { getAllFilesFromIPFS } from "@/lib/utils/pinata";

import { LoaderCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import NFTCard from "@/components/nft/nft-card";
import UserProceeds from "@/components/nft/user-proceeds";
import { useAccount, useChainId, useReadContract } from "wagmi";
import { getContractAddress } from "@/lib/contracts/addresses";
import { GLB3D_NFT_ABI } from "@/lib/contracts/abis";
import { foundry } from "wagmi/chains";

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

type EnhancedIPFSFile = Omit<IPFSFile, "metadata"> & {
  metadata: {
    name: string | null;
    keyvalues: Record<string, any> | null;
    description?: string;
    image?: string;
    price?: string;
    created_by?: string;
    owned_by?: boolean;
  } | null;
};

const Owned = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [ownedTokenIds, setOwnedTokenIds] = useState<bigint[]>([]);
  const [isLoadingOwnedNFTs, setIsLoadingOwnedNFTs] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Get user's NFT balance
  const { data: balance, isLoading: isLoadingBalance } = useReadContract({
    address: chainId === foundry.id ? getContractAddress(chainId as 31337, 'GLB3D_NFT') : undefined,
    abi: GLB3D_NFT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Fetch owned token IDs using events
  useEffect(() => {
    if (address && chainId === foundry.id) {
      setIsLoadingOwnedNFTs(true);

      const fetchOwnedTokens = async () => {
        try {
          console.log('Fetching owned tokens for address:', address);
          const tokenIds: bigint[] = [];
          const contractAddress = getContractAddress(chainId as 31337, 'GLB3D_NFT');
          console.log('Contract address:', contractAddress);

          // Format address properly for topic
          const paddedAddress = `0x000000000000000000000000${address.slice(2).toLowerCase()}`;
          console.log('Padded address for topic:', paddedAddress);

          // Get all Transfer events to this address (both mints and transfers)
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
                address: contractAddress,
                topics: [
                  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // Transfer event signature
                  null, // from (any address)
                  paddedAddress // to (user's address)
                ]
              }],
              id: 1,
            }),
          });

          const result = await response.json();
          console.log('Transfer events result:', result);

          if (result.result && Array.isArray(result.result)) {
            // Extract token IDs from the logs
            const transferLogs = result.result;
            const potentialTokenIds = new Set<bigint>();

            transferLogs.forEach((log: any) => {
              if (log.topics && log.topics[3]) {
                // Token ID is in the 4th topic (index 3)
                const tokenId = BigInt(log.topics[3]);
                potentialTokenIds.add(tokenId);
                console.log('Found potential token ID:', tokenId.toString());
              }
            });

            console.log('Potential token IDs:', Array.from(potentialTokenIds).map(id => id.toString()));

            // Now verify current ownership for each token
            for (const tokenId of potentialTokenIds) {
              try {
                console.log(`Checking ownership for token ${tokenId}...`);
                const ownerResponse = await fetch('http://localhost:8545', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'eth_call',
                    params: [
                      {
                        to: contractAddress,
                        data: `0x6352211e${tokenId.toString(16).padStart(64, '0')}`, // ownerOf(tokenId)
                      },
                      'latest'
                    ],
                    id: 1,
                  }),
                });

                const ownerResult = await ownerResponse.json();
                console.log(`Owner result for token ${tokenId}:`, ownerResult);

                if (ownerResult.result && ownerResult.result !== '0x') {
                  // Parse the owner address from the result
                  const owner = '0x' + ownerResult.result.slice(-40);
                  console.log(`Parsed owner: ${owner}, User address: ${address}`);

                  if (owner.toLowerCase() === address.toLowerCase()) {
                    tokenIds.push(tokenId);
                    console.log(`✅ Token ${tokenId} is owned by user`);
                  } else {
                    console.log(`❌ Token ${tokenId} is NOT owned by user`);
                  }
                }
              } catch (error) {
                console.error(`Error checking ownership for token ${tokenId}:`, error);
              }
            }
          }

          console.log('Final owned token IDs:', tokenIds.map(id => id.toString()));
          setOwnedTokenIds(tokenIds.sort((a, b) => Number(a - b)));
          setIsLoadingOwnedNFTs(false);
        } catch (error) {
          console.error('Error fetching owned tokens:', error);
          setOwnedTokenIds([]);
          setIsLoadingOwnedNFTs(false);
        }
      };

      // Add a small delay to ensure wallet is fully connected
      setTimeout(fetchOwnedTokens, 1000);
    } else {
      setOwnedTokenIds([]);
      setIsLoadingOwnedNFTs(false);
    }
  }, [address, chainId, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="mb-4 text-lg font-bold">
          Please connect your wallet to see your owned NFTs.
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

  if (isLoadingBalance || isLoadingOwnedNFTs) {
    return (
      <div className="flex items-center justify-center pt-20">
        <LoaderCircle className="animate-spin mr-2" />
        <span>Loading your NFTs...</span>
      </div>
    );
  }

  return (
    <MaxWidthWrapper className="p-5 sm:p-2 sm:pt-20 pt-20">
      <h1 className="text-4xl font-bold mb-10">Owned NFTs</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <p className="text-muted-foreground">
              You own {ownedTokenIds.length} NFT{ownedTokenIds.length !== 1 ? 's' : ''}
            </p>
            <Button
              onClick={handleRefresh}
              disabled={isLoadingOwnedNFTs}
              variant="outline"
              size="sm"
            >
              {isLoadingOwnedNFTs ? (
                <LoaderCircle className="animate-spin h-4 w-4 mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </div>
        <div className="lg:col-span-1">
          <UserProceeds />
        </div>
      </div>

      {ownedTokenIds.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">No NFTs owned yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Create your first NFT to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 gap-6">
          {ownedTokenIds.map((tokenId) => (
            <NFTCard
              key={tokenId.toString()}
              tokenId={tokenId}
              showMarketplaceActions={true}
              onUpdate={handleRefresh}
            />
          ))}
        </div>
      )}
    </MaxWidthWrapper>
  );
};

export default Owned;
