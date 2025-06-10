"use client";

import React, { useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMintNft } from "@/lib/contracts/hooks";
import { foundry } from "wagmi/chains";
import { getContractAddress } from "@/lib/contracts/addresses";

export default function DebugMintPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [testResults, setTestResults] = useState<string[]>([]);
  
  // Use the same hook as the create page
  const { mintNft, hash, isPending, isConfirming, isConfirmed, error } = useMintNft();

  const addLog = (message: string) => {
    console.log(message);
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testMintFunction = async () => {
    try {
      addLog("🚀 Starting mint test...");
      
      // Check wallet connection
      if (!isConnected || !address) {
        addLog("❌ Wallet not connected");
        return;
      }
      addLog(`✅ Wallet connected: ${address}`);

      // Check network
      if (chainId !== foundry.id) {
        addLog(`❌ Wrong network. Current: ${chainId}, Expected: ${foundry.id}`);
        return;
      }
      addLog(`✅ On correct network: ${chainId}`);

      // Check contract address
      try {
        const contractAddress = getContractAddress(chainId as 31337, 'GLB3D_NFT');
        addLog(`✅ Contract address: ${contractAddress}`);
      } catch (err) {
        addLog(`❌ Contract address error: ${err}`);
        return;
      }

      // Test metadata URI
      const testTokenURI = "http://localhost:3001/test-metadata.json";
      addLog(`📝 Using test metadata: ${testTokenURI}`);

      // Call mint function
      addLog("🔄 Calling mintNft function...");
      addLog("⚠️ MetaMask should popup now!");
      
      mintNft(testTokenURI, chainId as 31337);
      
    } catch (error) {
      addLog(`❌ Error in test: ${error}`);
    }
  };

  const clearLogs = () => {
    setTestResults([]);
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-8">Debug Mint Function</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Wallet & Network Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Connected:</strong> {isConnected ? "✅ Yes" : "❌ No"}</p>
            <p><strong>Address:</strong> {address || "Not connected"}</p>
            <p><strong>Chain ID:</strong> {chainId}</p>
            <p><strong>Expected Chain:</strong> {foundry.id} (Anvil)</p>
            <p><strong>Network Match:</strong> {chainId === foundry.id ? "✅ Yes" : "❌ No"}</p>
          </CardContent>
        </Card>

        {/* Transaction Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Pending:</strong> {isPending ? "🔄 Yes" : "❌ No"}</p>
            <p><strong>Confirming:</strong> {isConfirming ? "🔄 Yes" : "❌ No"}</p>
            <p><strong>Confirmed:</strong> {isConfirmed ? "✅ Yes" : "❌ No"}</p>
            <p><strong>Hash:</strong> {hash ? `${hash.slice(0, 10)}...` : "None"}</p>
            {error && (
              <p className="text-red-600"><strong>Error:</strong> {error.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testMintFunction}
              disabled={!isConnected || chainId !== foundry.id || isPending}
              className="w-full"
            >
              {isPending ? "🔄 Minting..." : "🧪 Test Mint Function"}
            </Button>
            
            <Button 
              onClick={clearLogs}
              variant="outline"
              className="w-full"
            >
              Clear Logs
            </Button>

            <div className="text-sm text-muted-foreground">
              <p>This will attempt to mint a test NFT.</p>
              <p>MetaMask should popup for transaction confirmation.</p>
            </div>
          </CardContent>
        </Card>

        {/* Debug Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Debug Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-y-auto space-y-1">
              {testResults.length === 0 ? (
                <p className="text-muted-foreground">No logs yet. Click "Test Mint Function" to start.</p>
              ) : (
                testResults.map((result, index) => (
                  <p key={index} className="text-xs font-mono bg-muted p-1 rounded">
                    {result}
                  </p>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Make sure your wallet is connected and on Anvil network (Chain ID: 31337)</li>
            <li>Click "Test Mint Function" button</li>
            <li>MetaMask should popup asking for transaction confirmation</li>
            <li>Check the debug logs for detailed information</li>
            <li>If MetaMask doesn't popup, check the browser console for errors</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
