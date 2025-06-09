"use client";

import React from "react";
import { useAccount, useChainId } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getContractAddress } from "@/lib/contracts/addresses";
import { foundry } from "wagmi/chains";

export default function DebugPage() {
  const { address, isConnected, isConnecting } = useAccount();
  const chainId = useChainId();

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-8">Debug Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wallet Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle>Wallet Connection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p><strong>Connected:</strong> {isConnected ? "Yes" : "No"}</p>
              <p><strong>Connecting:</strong> {isConnecting ? "Yes" : "No"}</p>
              <p><strong>Address:</strong> {address || "Not connected"}</p>
              <p><strong>Chain ID:</strong> {chainId || "Unknown"}</p>
              <p><strong>Expected Chain:</strong> {foundry.id} (Anvil)</p>
            </div>
            
            <div className="space-y-2">
              <p><strong>RainbowKit Connect Button:</strong></p>
              <ConnectButton />
            </div>
          </CardContent>
        </Card>

        {/* Contract Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contract Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p><strong>Chain ID:</strong> {chainId}</p>
              {chainId === foundry.id ? (
                <div className="space-y-2">
                  <p className="text-green-600">✅ On correct network (Anvil)</p>
                  <div>
                    <p><strong>GLB3D NFT:</strong></p>
                    <code className="text-xs bg-gray-100 p-1 rounded">
                      {getContractAddress(chainId as 31337, 'GLB3D_NFT')}
                    </code>
                  </div>
                  <div>
                    <p><strong>NFT Marketplace:</strong></p>
                    <code className="text-xs bg-gray-100 p-1 rounded">
                      {getContractAddress(chainId as 31337, 'NFT_MARKETPLACE')}
                    </code>
                  </div>
                </div>
              ) : (
                <p className="text-red-600">❌ Wrong network. Please switch to Anvil (31337)</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Test Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => {
                console.log("Wallet state:", { address, isConnected, chainId });
              }}
            >
              Log Wallet State
            </Button>
            
            <Button 
              onClick={() => {
                if (chainId === foundry.id) {
                  console.log("Contract addresses:", {
                    nft: getContractAddress(chainId as 31337, 'GLB3D_NFT'),
                    marketplace: getContractAddress(chainId as 31337, 'NFT_MARKETPLACE')
                  });
                }
              }}
            >
              Log Contract Addresses
            </Button>
          </CardContent>
        </Card>

        {/* Environment Info */}
        <Card>
          <CardHeader>
            <CardTitle>Environment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Window:</strong> {typeof window !== 'undefined' ? 'Available' : 'Not available'}</p>
              <p><strong>Ethereum:</strong> {typeof window !== 'undefined' && window.ethereum ? 'Available' : 'Not available'}</p>
              <p><strong>User Agent:</strong> {typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
