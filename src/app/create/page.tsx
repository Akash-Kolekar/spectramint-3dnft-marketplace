"use client";

import ConnectWalletButton from "@/components/auth/connect-wallet-button";
import React, { useState } from "react";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { uploadToIPFS } from "@/lib/utils/pinata";
import { toast } from "sonner";
import { Expand, LoaderCircle, Send, CheckCircle } from "lucide-react";
import DragAndDropInputFilePreview from "@/components/ui/drag-drop-file-input";
import CreateModelView from "@/components/nft/create-model-view";
import { Badge } from "@/components/ui/badge";
import { useMintNft } from "@/lib/contracts/hooks";
import { useAccount, useChainId } from "wagmi";
import { foundry } from "wagmi/chains";

// Define form schema with zod
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  // We'll validate these manually since zod doesn't handle File objects directly
});

const Create = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [glbFile, setGlbFile] = useState<File | null>(null);
  const [glbFileError, setGlbFileError] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [thumbnailBase64, setThumbnailBase64] = useState<string | null>(null);
  const [glbFileUrl, setGlbFileUrl] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [fullPreview, setFullPreview] = useState(false);
  const [mintingStep, setMintingStep] = useState<'upload' | 'minting' | 'completed'>('upload');

  // Smart contract hooks
  const { mintNft, hash, isPending, isConfirming, isConfirmed, error: mintError } = useMintNft();

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  // We've moved the fileToBase64 functionality into our DragAndDropInputFilePreview component
  // We don't need the handleThumbnailChange function anymore as it's handled by the DragAndDropInputFilePreview component
  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("clicked");

    // Reset file errors
    setIsUploading(true);
    setThumbnailError(null);
    setGlbFileError(null);

    try {
      if (!address || !isConnected) {
        toast.error("Please connect your wallet");
        setIsUploading(false);
        return;
      }

      if (chainId !== foundry.id) {
        toast.error("Please switch to Anvil network (Chain ID: 31337)");
        setIsUploading(false);
        return;
      }

      if (!thumbnail || !thumbnailBase64) {
        setThumbnailError("Thumbnail is required");
        setIsUploading(false);
        return;
      }

      if (!glbFile) {
        setGlbFileError("GLB file is required");
        setIsUploading(false);
        return;
      }

      // Step 1: Upload to IPFS
      setMintingStep('upload');
      toast.info("Uploading to IPFS...");

      const result = await uploadToIPFS(glbFile, {
        name: values.name,
        description: values.description,
        image: thumbnailBase64,
        created_by: address,
        model_extension: "glb",
        image_extension: thumbnail.type.split("/")[1] as "png" | "jpg" | "jpeg",
        attributes: {
          background_color: backgroundColor,
        },
      });

      if (
        result.fileResponse.status !== 200 ||
        result.metadataResponse.status !== 200
      ) {
        toast.error("Error uploading to IPFS");
        setIsUploading(false);
        return;
      }

      const metadataUriForNFT = `https://gateway.pinata.cloud/ipfs/${result.metadataHash}`;
      console.log("IPFS Upload Result:", result);
      toast.success("Successfully uploaded to IPFS!");

      // Step 2: Mint NFT on blockchain
      setMintingStep('minting');
      toast.info("Minting NFT on blockchain...");

      mintNft(metadataUriForNFT, chainId as 31337);

    } catch (error) {
      console.error("Error creating NFT:", error);
      toast.error(
        error instanceof Error ? error.message : "Error creating NFT"
      );
      setIsUploading(false);
      setMintingStep('upload');
    }
  };

  // Handle transaction status changes
  React.useEffect(() => {
    if (isConfirmed && mintingStep === 'minting') {
      setMintingStep('completed');
      toast.success("NFT minted successfully!");
      setIsUploading(false);

      // Reset form after successful mint
      setTimeout(() => {
        form.reset();
        setThumbnail(null);
        setThumbnailBase64(null);
        setGlbFile(null);
        setGlbFileUrl(null);
        setBackgroundColor("#000000");
        setMintingStep('upload');
      }, 3000);
    }
  }, [isConfirmed, mintingStep, form]);

  React.useEffect(() => {
    if (mintError) {
      toast.error(`Minting failed: ${mintError.message}`);
      setIsUploading(false);
      setMintingStep('upload');
    }
  }, [mintError]);

  // Cleanup blob URL on unmount
  React.useEffect(() => {
    return () => {
      if (glbFileUrl) {
        URL.revokeObjectURL(glbFileUrl);
      }
    };
  }, [glbFileUrl]);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="mb-4 text-lg font-bold">
          Please connect your wallet to create an NFT.
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
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 w-full max-w-screen-xl mx-auto">
      <h2 className="mb-6 text-2xl font-bold text-center w-full">Create NFT</h2>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-8 w-full">
        {/* Left side - Form fields */}
        <div className="space-y-6 bg-background p-6 rounded-lg shadow-sm border border-border">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <FormLabel>Thumbnail</FormLabel>
                <DragAndDropInputFilePreview
                  onFileChange={(file, base64) => {
                    setThumbnail(file);
                    setThumbnailBase64(base64);
                    setThumbnailError(null);
                  }}
                  imagePreview={thumbnailBase64}
                  accept="image/jpeg, image/png, image/jpg, image/webp"
                  name="thumbnail"
                  error={thumbnailError}
                />
              </div>
              <div className="space-y-2">
                <FormLabel>GLB File</FormLabel>
                <Input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setGlbFile(file);
                    setGlbFileError(null);

                    // Create blob URL for preview
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setGlbFileUrl(url);
                    } else {
                      setGlbFileUrl(null);
                    }
                  }}
                  accept=".glb, .gltf"
                />
                {glbFileError && (
                  <p className="text-sm font-medium text-destructive">
                    {glbFileError}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <FormLabel>Background Color</FormLabel>
                <div className="flex items-center gap-3">
                  <Input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="NFT Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your NFT"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.001"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <Button type="submit" disabled={isUploading || isPending || isConfirming} className="w-full">
                {mintingStep === 'upload' && isUploading && (
                  <LoaderCircle className="animate-spin mr-2" />
                )}
                {mintingStep === 'minting' && (isPending || isConfirming) && (
                  <LoaderCircle className="animate-spin mr-2" />
                )}
                {mintingStep === 'completed' && (
                  <CheckCircle className="mr-2" />
                )}
                {!isUploading && !isPending && !isConfirming && mintingStep === 'upload' && (
                  <Send className="mr-2" />
                )}

                {mintingStep === 'upload' && isUploading && "Uploading to IPFS..."}
                {mintingStep === 'minting' && isPending && "Confirm in Wallet..."}
                {mintingStep === 'minting' && isConfirming && "Minting NFT..."}
                {mintingStep === 'completed' && "NFT Created Successfully!"}
                {!isUploading && !isPending && !isConfirming && mintingStep === 'upload' && "Create NFT"}
              </Button>

              {hash && (
                <div className="text-sm text-muted-foreground">
                  <p>Transaction Hash: {hash}</p>
                  {isConfirming && <p>Waiting for confirmation...</p>}
                  {isConfirmed && <p className="text-green-600">Transaction confirmed!</p>}
                </div>
              )}
            </form>
          </Form>
        </div>

        {/* Right side - 3D model preview */}
        <div className="bg-background border border-border rounded-lg shadow-sm flex flex-col h-[600px]">
          {glbFileUrl ? (
            <div className="relative h-full w-full">
              <div className="absolute w-full p-2 top-0 z-10 flex items-center justify-between">
                <Badge className="font-bold" variant={"secondary"}>
                  Model Preview
                </Badge>
                <Button
                  type="button"
                  onClick={() => {
                    setFullPreview((prev) => !prev);
                  }}
                  variant="outline"
                  size="icon"
                >
                  <Expand className="h-4 w-4" />
                </Button>
              </div>
              {fullPreview && (
                <div className="fixed top-0 left-0 w-full h-full bg-background/80 z-50 p-8">
                  <div className="relative h-full w-full bg-background border border-border rounded-lg">
                    <Button
                      type="button"
                      onClick={() => setFullPreview(false)}
                      variant="outline"
                      size="icon"
                      className="absolute top-2 right-2 z-10"
                    >
                      <Expand className="h-4 w-4" />
                    </Button>
                    <CreateModelView modelUrl={glbFileUrl} />
                  </div>
                </div>
              )}
              <CreateModelView modelUrl={glbFileUrl} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full w-full flex-col gap-2 text-muted-foreground">
              <span className="text-lg">
                Upload a GLB file to preview your 3D model
              </span>
              <p className="text-sm max-w-md text-center">
                The 3D preview will appear here once you select a GLB file
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Create;
