import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { GLB3D_NFT_ABI, NFT_MARKETPLACE_ABI } from './abis'
import { getContractAddress, type SupportedChainId } from './addresses'
import { parseEther } from 'viem'

// GLB3D NFT Contract Hooks
export function useGlb3dNftRead(
  functionName: string,
  args?: any[],
  chainId?: SupportedChainId
) {
  return useReadContract({
    address: chainId ? getContractAddress(chainId, 'GLB3D_NFT') : undefined,
    abi: GLB3D_NFT_ABI,
    functionName,
    args,
  })
}

export function useGlb3dNftWrite() {
  return useWriteContract()
}

// NFT Marketplace Contract Hooks
export function useNftMarketplaceRead(
  functionName: string,
  args?: any[],
  chainId?: SupportedChainId
) {
  return useReadContract({
    address: chainId ? getContractAddress(chainId, 'NFT_MARKETPLACE') : undefined,
    abi: NFT_MARKETPLACE_ABI,
    functionName,
    args,
  })
}

export function useNftMarketplaceWrite() {
  return useWriteContract()
}

// Specific hooks for common operations
export function useMintNft() {
  const { writeContract, data: hash, isPending, error } = useGlb3dNftWrite()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const mintNft = (tokenURI: string, chainId: SupportedChainId) => {
    writeContract({
      address: getContractAddress(chainId, 'GLB3D_NFT'),
      abi: GLB3D_NFT_ABI,
      functionName: 'mintNft',
      args: [tokenURI],
    })
  }

  return {
    mintNft,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

export function useListItem() {
  const { writeContract, data: hash, isPending, error } = useNftMarketplaceWrite()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const listItem = (
    nftAddress: `0x${string}`,
    tokenId: bigint,
    priceInEth: string,
    chainId: SupportedChainId
  ) => {
    writeContract({
      address: getContractAddress(chainId, 'NFT_MARKETPLACE'),
      abi: NFT_MARKETPLACE_ABI,
      functionName: 'listItem',
      args: [nftAddress, tokenId, parseEther(priceInEth)],
    })
  }

  return {
    listItem,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

export function useBuyItem() {
  const { writeContract, data: hash, isPending, error } = useNftMarketplaceWrite()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const buyItem = (
    nftAddress: `0x${string}`,
    tokenId: bigint,
    priceInEth: string,
    chainId: SupportedChainId
  ) => {
    writeContract({
      address: getContractAddress(chainId, 'NFT_MARKETPLACE'),
      abi: NFT_MARKETPLACE_ABI,
      functionName: 'buyItem',
      args: [nftAddress, tokenId],
      value: parseEther(priceInEth),
    })
  }

  return {
    buyItem,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

// Hook to get NFT balance
export function useNftBalance(address: `0x${string}` | undefined, chainId?: SupportedChainId) {
  return useGlb3dNftRead('balanceOf', address ? [address] : undefined, chainId)
}

// Hook to get NFT owner
export function useNftOwner(tokenId: bigint, chainId?: SupportedChainId) {
  return useGlb3dNftRead('ownerOf', [tokenId], chainId)
}

// Hook to get NFT token URI
export function useNftTokenUri(tokenId: bigint, chainId?: SupportedChainId) {
  return useGlb3dNftRead('tokenURI', [tokenId], chainId)
}

// Hook to get marketplace listing
export function useMarketplaceListing(
  nftAddress: `0x${string}`,
  tokenId: bigint,
  chainId?: SupportedChainId
) {
  return useNftMarketplaceRead('getListing', [nftAddress, tokenId], chainId)
}

// Hook to cancel listing
export function useCancelListing() {
  const { writeContract, data: hash, isPending, error } = useNftMarketplaceWrite()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const cancelListing = (
    nftAddress: `0x${string}`,
    tokenId: bigint,
    chainId: SupportedChainId
  ) => {
    writeContract({
      address: getContractAddress(chainId, 'NFT_MARKETPLACE'),
      abi: NFT_MARKETPLACE_ABI,
      functionName: 'cancelListing',
      args: [nftAddress, tokenId],
    })
  }

  return {
    cancelListing,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

// Hook to withdraw proceeds
export function useWithdrawProceeds() {
  const { writeContract, data: hash, isPending, error } = useNftMarketplaceWrite()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const withdrawProceeds = (chainId: SupportedChainId) => {
    writeContract({
      address: getContractAddress(chainId, 'NFT_MARKETPLACE'),
      abi: NFT_MARKETPLACE_ABI,
      functionName: 'withdrawProceeds',
    })
  }

  return {
    withdrawProceeds,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

// Hook to get user's proceeds
export function useUserProceeds(address: `0x${string}` | undefined, chainId?: SupportedChainId) {
  return useNftMarketplaceRead('getProceeds', address ? [address] : undefined, chainId)
}
