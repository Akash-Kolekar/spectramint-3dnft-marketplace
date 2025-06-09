"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserProceeds, useWithdrawProceeds } from "@/lib/contracts/hooks";
import { useAccount, useChainId } from "wagmi";
import { foundry } from "wagmi/chains";
import { formatEther } from "viem";
import { LoaderCircle, Wallet } from "lucide-react";
import { toast } from "sonner";

export default function UserProceeds() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  // Get user's proceeds
  const { data: proceeds, isLoading: isLoadingProceeds, refetch } = useUserProceeds(
    address,
    chainId as 31337
  );

  // Withdraw proceeds hook
  const {
    withdrawProceeds,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  } = useWithdrawProceeds();

  // Handle withdrawal confirmation
  React.useEffect(() => {
    if (isConfirmed) {
      toast.success("Proceeds withdrawn successfully!");
      refetch(); // Refresh the proceeds balance
    }
  }, [isConfirmed, refetch]);

  // Handle withdrawal errors
  React.useEffect(() => {
    if (error) {
      toast.error(`Withdrawal failed: ${error.message}`);
    }
  }, [error]);

  const handleWithdraw = () => {
    if (!isConnected || chainId !== foundry.id) {
      toast.error("Please connect to Anvil network");
      return;
    }

    if (!proceeds || proceeds === 0n) {
      toast.error("No proceeds to withdraw");
      return;
    }

    withdrawProceeds(chainId as 31337);
    toast.info("Withdrawing proceeds...");
  };

  if (!isConnected || chainId !== foundry.id) {
    return null;
  }

  if (isLoadingProceeds) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <LoaderCircle className="animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const hasProceeds = proceeds && proceeds > 0n;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Sales Proceeds
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-2xl font-bold">
            {proceeds ? formatEther(proceeds) : "0"} ETH
          </p>
          <p className="text-sm text-muted-foreground">
            Available to withdraw
          </p>
        </div>

        {hasProceeds && (
          <Button
            onClick={handleWithdraw}
            disabled={isPending || isConfirming}
            className="w-full"
          >
            {isPending || isConfirming ? (
              <LoaderCircle className="animate-spin mr-2" />
            ) : (
              <Wallet className="mr-2 h-4 w-4" />
            )}
            {isPending && "Confirm in Wallet..."}
            {isConfirming && "Withdrawing..."}
            {!isPending && !isConfirming && "Withdraw Proceeds"}
          </Button>
        )}

        {hash && (
          <div className="text-xs text-muted-foreground">
            <p>Transaction: {hash}</p>
            {isConfirming && <p>Waiting for confirmation...</p>}
            {isConfirmed && <p className="text-green-600">Withdrawal confirmed!</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
