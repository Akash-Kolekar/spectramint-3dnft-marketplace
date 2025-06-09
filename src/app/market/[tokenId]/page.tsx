"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNftTokenUri, useNftOwner, useMarketplaceListing } from "@/lib/contracts/hooks";
import { useAccount, useChainId } from "wagmi";
import { getContractAddress } from "@/lib/contracts/addresses";
import { foundry } from "wagmi/chains";
import { formatEther } from "viem";
import { LoaderCircle, ArrowLeft, ExternalLink } from "lucide-react";
import MarketplaceActions from "@/components/nft/marketplace-actions";
import Link from "next/link";
import ConnectWalletButton from "@/components/auth/connect-wallet-button";
import ModelView from "@/components/nft/model-view";

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  created_by: string;
  model_extension: string;
  image_extension: string;
  attributes: {
    background_color: string;
  };
  glb_file_hash?: string;
}

export default function NFTDetailPage() {
  const params = useParams();
  const tokenId = BigInt(params.tokenId as string);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [metadataError, setMetadataError] = useState<string | null>(null);

  // Contract hooks
  const { data: tokenURI, isLoading: isLoadingTokenURI } = useNftTokenUri(tokenId, chainId as 31337);
  const { data: owner, isLoading: isLoadingOwner } = useNftOwner(tokenId, chainId as 31337);
  const { data: listing, isLoading: isLoadingListing, refetch: refetchListing } = useMarketplaceListing(
    chainId === foundry.id ? getContractAddress(chainId as 31337, 'GLB3D_NFT') : '0x0',
    tokenId,
    chainId as 31337
  );

  const isOwner = address && owner && address.toLowerCase() === owner.toLowerCase();
  const isListed = listing && listing.price > 0n;

  // Fetch metadata from IPFS
  useEffect(() => {
    if (tokenURI && !isLoadingTokenURI) {
      setIsLoadingMetadata(true);
      setMetadataError(null);
      
      fetch(tokenURI)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data: NFTMetadata) => {
          setMetadata(data);
        })
        .catch(error => {
          console.error('Error fetching metadata:', error);
          setMetadataError('Failed to load NFT metadata');
        })
        .finally(() => {
          setIsLoadingMetadata(false);
        });
    }
  }, [tokenURI, isLoadingTokenURI]);

  const handleUpdate = () => {
    refetchListing();
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="mb-4 text-lg font-bold">
          Please connect your wallet to view NFT details.
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

  if (isLoadingTokenURI || isLoadingOwner || isLoadingListing || isLoadingMetadata) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoaderCircle className="animate-spin mr-2" />
        <span>Loading NFT details...</span>
      </div>
    );
  }

  if (metadataError || !metadata) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-destructive mb-4">
          {metadataError || "Failed to load NFT metadata"}
        </p>
        <Link href="/market">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Market
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/market">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Market
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side - 3D Model and Image */}
        <div className="space-y-4">
          {/* 3D Model Viewer */}
          {metadata.glb_file_hash && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">3D Model</h3>
              </CardHeader>
              <CardContent>
                <div className="aspect-square">
                  <ModelView 
                    modelUrl={`https://gateway.pinata.cloud/ipfs/${metadata.glb_file_hash}`}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Image Preview */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Preview Image</h3>
            </CardHeader>
            <CardContent>
              <div className="aspect-square relative">
                <img
                  src={metadata.image}
                  alt={metadata.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - NFT Details and Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">{metadata.name}</h1>
                <Badge variant="secondary">#{tokenId.toString()}</Badge>
              </div>
              <div className="flex gap-2">
                {isListed && <Badge variant="default">Listed</Badge>}
                {isOwner && <Badge variant="outline">Owned</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{metadata.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Creator:</span>
                  <p className="font-mono break-all">
                    {metadata.created_by}
                  </p>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Owner:</span>
                  <p className="font-mono break-all">
                    {owner}
                  </p>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Token ID:</span>
                  <p className="font-semibold">{tokenId.toString()}</p>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Format:</span>
                  <p className="uppercase">{metadata.model_extension}</p>
                </div>
              </div>

              {isListed && listing && (
                <div className="border-t pt-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Current Price</p>
                    <p className="text-3xl font-bold">
                      {formatEther(listing.price)} ETH
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Listed by: {listing.seller?.slice(0, 6)}...{listing.seller?.slice(-4)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Marketplace Actions */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Actions</h3>
            </CardHeader>
            <CardContent>
              <MarketplaceActions
                tokenId={tokenId}
                isOwner={!!isOwner}
                isListed={!!isListed}
                listingPrice={listing?.price}
                seller={listing?.seller}
                onListingUpdate={handleUpdate}
              />
            </CardContent>
          </Card>

          {/* External Links */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">External Links</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              <a
                href={tokenURI}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Metadata on IPFS
              </a>
              {metadata.glb_file_hash && (
                <a
                  href={`https://gateway.pinata.cloud/ipfs/${metadata.glb_file_hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Download 3D Model
                </a>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
