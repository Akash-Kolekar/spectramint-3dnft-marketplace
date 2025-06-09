"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNftTokenUri, useNftOwner, useMarketplaceListing } from "@/lib/contracts/hooks";
import { useAccount, useChainId } from "wagmi";
import { getContractAddress } from "@/lib/contracts/addresses";
import { foundry } from "wagmi/chains";
import { formatEther } from "viem";
import { LoaderCircle, Eye } from "lucide-react";
import MarketplaceActions from "./marketplace-actions";
import Link from "next/link";

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
}

interface NFTCardProps {
  tokenId: bigint;
  showMarketplaceActions?: boolean;
  onUpdate?: () => void;
}

export default function NFTCard({ tokenId, showMarketplaceActions = true, onUpdate }: NFTCardProps) {
  const { address } = useAccount();
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

      // Handle test/placeholder URIs
      if (tokenURI.includes('example.com') || tokenURI.includes('placeholder')) {
        // Create mock metadata for test NFTs
        const mockMetadata: NFTMetadata = {
          name: `Test NFT #${tokenId.toString()}`,
          description: 'This is a test NFT created for development purposes.',
          image: 'https://via.placeholder.com/400x400/6366f1/ffffff?text=Test+NFT',
          created_by: owner || '0x0000000000000000000000000000000000000000'
        };
        setMetadata(mockMetadata);
        setIsLoadingMetadata(false);
        return;
      }

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
          // Create fallback metadata for failed fetches
          const fallbackMetadata: NFTMetadata = {
            name: `NFT #${tokenId.toString()}`,
            description: 'Metadata could not be loaded.',
            image: 'https://via.placeholder.com/400x400/ef4444/ffffff?text=Failed+to+Load',
            created_by: owner || '0x0000000000000000000000000000000000000000'
          };
          setMetadata(fallbackMetadata);
          setMetadataError('Failed to load NFT metadata');
        })
        .finally(() => {
          setIsLoadingMetadata(false);
        });
    }
  }, [tokenURI, isLoadingTokenURI, tokenId, owner]);

  const handleUpdate = () => {
    refetchListing();
    onUpdate?.();
  };

  if (isLoadingTokenURI || isLoadingOwner || isLoadingListing) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-64">
          <LoaderCircle className="animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (metadataError) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-destructive">{metadataError}</p>
        </CardContent>
      </Card>
    );
  }

  if (!metadata) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-64">
          {isLoadingMetadata ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <p className="text-muted-foreground">No metadata available</p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative aspect-square">
          {metadata.image && (
            <img
              src={metadata.image}
              alt={metadata.name}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute top-2 left-2 flex gap-2">
            <Badge variant="secondary">#{tokenId.toString()}</Badge>
            {isListed && (
              <Badge variant="default">Listed</Badge>
            )}
            {isOwner && (
              <Badge variant="outline">Owned</Badge>
            )}
          </div>
          <div className="absolute top-2 right-2">
            <Link href={`/market/${tokenId.toString()}`}>
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                <Eye className="w-3 h-3 mr-1" />
                View
              </Badge>
            </Link>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 truncate">{metadata.name}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {metadata.description}
        </p>
        
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Creator:</span>
            <span className="font-mono">
              {metadata.created_by?.slice(0, 6)}...{metadata.created_by?.slice(-4)}
            </span>
          </div>
          
          {owner && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Owner:</span>
              <span className="font-mono">
                {owner.slice(0, 6)}...{owner.slice(-4)}
              </span>
            </div>
          )}
          
          {isListed && listing && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price:</span>
              <span className="font-semibold">
                {formatEther(listing.price)} ETH
              </span>
            </div>
          )}
        </div>
      </CardContent>
      
      {showMarketplaceActions && (
        <CardFooter className="p-4 pt-0">
          <MarketplaceActions
            tokenId={tokenId}
            isOwner={!!isOwner}
            isListed={!!isListed}
            listingPrice={listing?.price}
            seller={listing?.seller}
            onListingUpdate={handleUpdate}
          />
        </CardFooter>
      )}
    </Card>
  );
}
