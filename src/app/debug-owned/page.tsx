"use client";

import React, { useEffect, useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { getContractAddress } from "@/lib/contracts/addresses";
import { foundry } from "wagmi/chains";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DebugOwnedPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const testOwnedNFTs = async () => {
    if (!address || chainId !== foundry.id) {
      setDebugInfo({ error: "Not connected or wrong network" });
      return;
    }

    setIsLoading(true);
    const debug: any = {
      address,
      chainId,
      contractAddress: getContractAddress(chainId as 31337, 'GLB3D_NFT'),
      steps: []
    };

    try {
      // Step 1: Get Transfer events
      debug.steps.push("Fetching Transfer events...");
      const response = await fetch('http://localhost:8545', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getLogs',
          params: [{
            fromBlock: '0x0',
            toBlock: 'latest',
            address: getContractAddress(chainId as 31337, 'GLB3D_NFT'),
            topics: [
              '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
              null,
              `0x000000000000000000000000${address.slice(2)}`
            ]
          }],
          id: 1,
        }),
      });

      const result = await response.json();
      debug.transferEvents = result;
      debug.steps.push(`Found ${result.result?.length || 0} transfer events`);

      if (result.result && Array.isArray(result.result)) {
        const tokenIds = new Set<string>();
        
        result.result.forEach((log: any) => {
          if (log.topics && log.topics[3]) {
            const tokenId = BigInt(log.topics[3]).toString();
            tokenIds.add(tokenId);
            debug.steps.push(`Found token ID: ${tokenId}`);
          }
        });

        debug.potentialTokenIds = Array.from(tokenIds);

        // Step 2: Check ownership for each token
        const ownedTokens = [];
        for (const tokenId of tokenIds) {
          debug.steps.push(`Checking ownership for token ${tokenId}...`);
          
          const ownerResponse = await fetch('http://localhost:8545', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_call',
              params: [
                {
                  to: getContractAddress(chainId as 31337, 'GLB3D_NFT'),
                  data: `0x6352211e${BigInt(tokenId).toString(16).padStart(64, '0')}`,
                },
                'latest'
              ],
              id: 1,
            }),
          });

          const ownerResult = await ownerResponse.json();
          debug.steps.push(`Owner result for token ${tokenId}: ${ownerResult.result}`);

          if (ownerResult.result && ownerResult.result !== '0x') {
            const owner = '0x' + ownerResult.result.slice(-40);
            debug.steps.push(`Parsed owner: ${owner}, User address: ${address}`);
            
            if (owner.toLowerCase() === address.toLowerCase()) {
              ownedTokens.push(tokenId);
              debug.steps.push(`✅ Token ${tokenId} is owned by user`);
            } else {
              debug.steps.push(`❌ Token ${tokenId} is NOT owned by user`);
            }
          }
        }

        debug.ownedTokens = ownedTokens;
        debug.steps.push(`Final result: ${ownedTokens.length} owned tokens`);
      }

    } catch (error) {
      debug.error = error;
      debug.steps.push(`Error: ${error}`);
    }

    setDebugInfo(debug);
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-8">Debug Owned NFTs</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Connected:</strong> {isConnected ? "Yes" : "No"}</p>
          <p><strong>Address:</strong> {address || "Not connected"}</p>
          <p><strong>Chain ID:</strong> {chainId}</p>
          <p><strong>Expected Chain:</strong> {foundry.id}</p>
          {chainId === foundry.id && (
            <p><strong>NFT Contract:</strong> {getContractAddress(chainId as 31337, 'GLB3D_NFT')}</p>
          )}
        </CardContent>
      </Card>

      <Button 
        onClick={testOwnedNFTs} 
        disabled={!isConnected || chainId !== foundry.id || isLoading}
        className="mb-6"
      >
        {isLoading ? "Testing..." : "Test Owned NFTs Logic"}
      </Button>

      {debugInfo.steps && (
        <Card>
          <CardHeader>
            <CardTitle>Debug Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {debugInfo.steps.map((step: string, index: number) => (
                <p key={index} className="text-sm font-mono">
                  {index + 1}. {step}
                </p>
              ))}
            </div>
            
            {debugInfo.transferEvents && (
              <details className="mt-4">
                <summary className="cursor-pointer font-semibold">Raw Transfer Events</summary>
                <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
                  {JSON.stringify(debugInfo.transferEvents, null, 2)}
                </pre>
              </details>
            )}

            {debugInfo.error && (
              <div className="mt-4 p-2 bg-red-100 rounded">
                <p className="text-red-600">Error: {debugInfo.error.toString()}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
