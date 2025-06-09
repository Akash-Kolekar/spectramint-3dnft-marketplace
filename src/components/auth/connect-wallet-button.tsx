import React from "react";
import { Button } from "../ui/button";
import { WalletIcon } from "lucide-react";
import { useAccount, useConnect, useDisconnect, useChainId } from "wagmi";
import { formatAddress } from "@/lib/utils/balanceFormat";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { foundry } from "wagmi/chains";

const ConnectWalletButton = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();

  const handleConnect = () => {
    // Use the first available connector (usually MetaMask/Injected)
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    }
  };

  const isWrongNetwork = chainId !== foundry.id;

  return (
    <div className="relative">
      {isConnected && address ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={isWrongNetwork ? "destructive" : "default"}>
              {isWrongNetwork ? "Wrong Network" : formatAddress(address)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="gap-2 flex flex-col">
            <div className="text-sm">
              <p><strong>Address:</strong> {formatAddress(address)}</p>
              <p><strong>Network:</strong> {chainId}</p>
              {isWrongNetwork && (
                <p className="text-destructive text-xs mt-1">
                  Please switch to Anvil (Chain ID: 31337)
                </p>
              )}
            </div>
            <Button
              className="w-full"
              onClick={() => disconnect()}
              variant={"destructive"}
            >
              Disconnect
            </Button>
          </PopoverContent>
        </Popover>
      ) : (
        <Button disabled={isPending} onClick={handleConnect}>
          <WalletIcon className="mr-2 h-4 w-4" />
          {isPending ? "Connecting..." : "Connect Wallet"}
        </Button>
      )}
    </div>
  );
};

export default ConnectWalletButton;
