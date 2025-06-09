"use client";

import dynamic from "next/dynamic";
import ColorList from "@/components/nft/color-list";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useBlobEditorStore } from "@/stores/blobEditorStore";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ColorInput from "@/components/ui/color-input";
import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoaderCircle, RefreshCw } from "lucide-react";
import { uploadBlobToIPFS } from "@/lib/utils/pinata";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAccount } from "wagmi";

// Dynamically import the BlobView component to reduce initial load time
const BlobView = dynamic(() => import("@/components/nft/blob-viewer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        <p className="text-lg">Loading 3D View...</p>
      </div>
    </div>
  ),
});

const Page = () => {
  const { address, isConnected } = useAccount();

  const [isLoading, setIsLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [blobName, setBlobName] = useState("");
  const [blobDescription, setBlobDescription] = useState("");

  useEffect(() => {
    // Set a minimum time for the loading state to prevent UI flashing
    let timer: NodeJS.Timeout;

    const handleSetLoaded = () => {
      // Start with a minimum display time of 1.5 seconds
      timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    };

    // Check if we have all assets and 3D environment available
    if (typeof window !== "undefined") {
      // If window resources are already loaded, set a timer
      if (document.readyState === "complete") {
        handleSetLoaded();
      } else {
        // Otherwise wait for everything to load
        window.addEventListener("load", handleSetLoaded);
      }
    }

    return () => {
      clearTimeout(timer);
      if (typeof window !== "undefined") {
        window.removeEventListener("load", handleSetLoaded);
      }
    };
  }, []);
  const {
    // Basic parameters
    widthSegments,
    setWidthSegments,
    heightSegments,
    setHeightSegments,
    radius,
    setRadius,

    // Scale parameters
    scaleX,
    setScaleX,
    scaleY,
    setScaleY,
    scaleZ,
    setScaleZ, // Color parameters
    colors,
    setColors,
    gradientDirection,
    setGradientDirection,
    gradientMultiply,
    setGradientMultiply,
    gradientIntersection,
    setGradientIntersection,

    // Material parameters
    roughness,
    setRoughness,
    metalness,
    setMetalness, // Environment map parameters
    environmentMapEnabled,
    setEnvironmentMapEnabled,
    environmentMapType,
    setEnvironmentMapType,
    environmentMapIntensity,
    setEnvironmentMapIntensity,
    showEnvironmentBackground,
    setShowEnvironmentBackground, // Lighting parameters
    lightIntensity,
    setLightIntensity,
    bloomEnabled,
    setBloomEnabled,
    bloomIntensity,
    setBloomIntensity, // Wireframe parameter
    wireframeEnabled,
    setWireframeEnabled,

    // Camera controls
    autoRotateEnabled,
    setAutoRotateEnabled,
    autoRotateSpeed,
    setAutoRotateSpeed,

    // Horizontal strip parameters
    horizontalStrips,
    setHorizontalStrips,
    horizontalStripColor,
    setHorizontalStripColor,
    horizontalStripWidth,
    setHorizontalStripWidth,
    horizontalStripCount,
    setHorizontalStripCount,

    // Vertical strip parameters
    verticalStrips,
    setVerticalStrips,
    verticalStripColor,
    setVerticalStripColor,
    verticalStripWidth,
    setVerticalStripWidth,
    verticalStripCount,
    setVerticalStripCount,

    // Reset function
    resetAllSettings,
  } = useBlobEditorStore();

  const handleWidthSegmentsChange = (value: number[]) => {
    setWidthSegments(value[0]);
  };

  const handleHeightSegmentsChange = (value: number[]) => {
    setHeightSegments(value[0]);
  };
  const handleRadiusChange = (value: number[]) => {
    setRadius(value[0]);
  };

  const handleScaleXChange = (value: number[]) => {
    setScaleX(value[0]);
  };

  const handleScaleYChange = (value: number[]) => {
    setScaleY(value[0]);
  };

  const handleScaleZChange = (value: number[]) => {
    setScaleZ(value[0]);
  };

  // Horizontal strip handlers
  const handleHorizontalStripsChange = (checked: boolean) => {
    setHorizontalStrips(checked);
  };

  const handleHorizontalStripWidthChange = (value: number[]) => {
    setHorizontalStripWidth(value[0]);
  };

  const handleHorizontalStripCountChange = (value: number[]) => {
    setHorizontalStripCount(value[0]);
  };
  // Vertical strip handlers
  const handleVerticalStripsChange = (checked: boolean) => {
    setVerticalStrips(checked);
  };

  const handleVerticalStripWidthChange = (value: number[]) => {
    setVerticalStripWidth(value[0]);
  };

  const handleVerticalStripCountChange = (value: number[]) => {
    setVerticalStripCount(value[0]);
  }; // Gradient handlers
  const handleGradientDirectionChange = (
    direction: "horizontal" | "vertical"
  ) => {
    setGradientDirection(direction);
  };

  const handleGradientMultiplyChange = (value: number[]) => {
    setGradientMultiply(value[0]);
  };

  const handleGradientIntersectionChange = (value: number[]) => {
    setGradientIntersection(value[0]);
  };

  // Material handlers
  const handleRoughnessChange = (value: number[]) => {
    setRoughness(value[0]);
  };

  const handleMetalnessChange = (value: number[]) => {
    setMetalness(value[0]);
  };
  // Environment Map handlers
  const handleEnvironmentMapEnabledChange = (checked: boolean) => {
    setEnvironmentMapEnabled(checked);
  };

  const handleEnvironmentMapTypeChange = (
    type: "studio" | "city" | "dawn" | "night" | "warehouse" | "forest"
  ) => {
    setEnvironmentMapType(type);
  };

  const handleEnvironmentMapIntensityChange = (value: number[]) => {
    setEnvironmentMapIntensity(value[0]);
  };

  const handleShowEnvironmentBackgroundChange = (checked: boolean) => {
    setShowEnvironmentBackground(checked);
  };

  // Lighting handlers
  const handleLightIntensityChange = (value: number[]) => {
    setLightIntensity(value[0]);
  };

  const handleBloomEnabledChange = (checked: boolean) => {
    setBloomEnabled(checked);
  };
  const handleBloomIntensityChange = (value: number[]) => {
    setBloomIntensity(value[0]);
  };
  const handleWireframeEnabledChange = (checked: boolean) => {
    setWireframeEnabled(checked);
  };

  // Camera control handlers
  const handleAutoRotateEnabledChange = (checked: boolean) => {
    setAutoRotateEnabled(checked);
  };

  const handleAutoRotateSpeedChange = (value: number[]) => {
    setAutoRotateSpeed(value[0]);
  };

  async function uploadBlob() {
    setSubmitting(true);

    if (!account) {
      toast.error("Please connect your wallet");
      setSubmitting(false);
      return;
    }

    if (!blobName || blobName.trim() === "") {
      toast.error("Please enter a name for the blob.");
      setSubmitting(false);
      return;
    }

    if (!blobDescription || blobDescription.trim() === "") {
      toast.error("Please enter a description for the blob.");
      setSubmitting(false);
      return;
    }

    try {
      const blobData = {
        name: blobName,
        description: blobDescription,
        created_by: account,
        attributes: {
          widthSegments,
          heightSegments,
          radius,
          scaleX,
          scaleY,
          scaleZ,
          colors,
          gradientDirection,
          gradientMultiply,
          gradientIntersection,
          roughness,
          metalness,
          environmentMapEnabled,
          environmentMapType,
          environmentMapIntensity,
          showEnvironmentBackground,
          lightIntensity,
          bloomEnabled,
          bloomIntensity,
          wireframeEnabled,
          autoRotateEnabled,
          autoRotateSpeed,
          horizontalStrips,
          horizontalStripColor,
          horizontalStripWidth,
          horizontalStripCount,
          verticalStrips,
          verticalStripColor,
          verticalStripWidth,
          verticalStripCount,
        },
      };

      // Call the upload function with the blob data
      const result: any = await uploadBlobToIPFS(blobData);

      if (result) {
        toast.success("NFT created successfully!");
        console.log(result);
        setSubmitting(false);
      }
    } catch (e) {
      console.error("Error uploading blob to IPFS:", e);
      alert("Failed to upload blob. Please try again later.");
      setSubmitting(false);
      return;
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        {" "}
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-4xl font-bold mb-2">Create Blob</h1>
          <div className="relative">
            <div className="animate-spin rounded-full h-24 w-24 border-4 border-primary border-t-transparent"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="animate-pulse w-12 h-12 bg-primary/20 rounded-full"></div>
            </div>
          </div>
          <p className="text-lg font-medium">Loading Blob Creator...</p>
          <p className="text-sm text-muted-foreground max-w-md text-center">
            Initializing the 3D environment and preparing your creative space...
          </p>
        </div>
      </div>
    );
  }
  // Handler for reset button
  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all settings to default values?"
      )
    ) {
      resetAllSettings();
    }
  };

  return (
    <div className="grid grid-cols-[30%_70%] p-4 gap-4 h-screen pt-20">
      <ScrollArea className="h-full pr-6">
        <div className="flex flex-col mb-10">
          <h1 className="text-4xl font-bold text-center">Create Blob</h1>{" "}
          <Button
            onClick={handleReset}
            variant="outline"
            className="mt-4 mx-auto flex items-center gap-2"
          >
            <RefreshCw size={16} /> Reset All Settings
          </Button>
        </div>

        <div className="space-y-2 mb-3">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter blob name"
            value={blobName}
            onChange={(e) => setBlobName(e.target.value)}
          />
        </div>

        <div className="space-y-2 mb-3">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            type="text"
            placeholder="Enter blob description"
            value={blobDescription}
            onChange={(e) => setBlobDescription(e.target.value)}
          />
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="width-segments"
              className="flex justify-between items-center"
            >
              <span>Width Segments</span>
              <span className="text-sm text-muted-foreground">
                {widthSegments}
              </span>
            </label>
            <Slider
              id="width-segments"
              value={[widthSegments]}
              onValueChange={handleWidthSegmentsChange}
              max={100}
              step={1}
              min={1}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="height-segments"
              className="flex justify-between items-center"
            >
              <span>Height Segments</span>
              <span className="text-sm text-muted-foreground">
                {heightSegments}
              </span>
            </label>
            <Slider
              id="height-segments"
              value={[heightSegments]}
              onValueChange={handleHeightSegmentsChange}
              max={100}
              step={1}
              min={1}
            />
          </div>{" "}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="radius"
              className="flex justify-between items-center"
            >
              <span>Radius</span>
              <span className="text-sm text-muted-foreground">
                {radius.toFixed(2)}
              </span>
            </label>
            <Slider
              id="radius"
              value={[radius]}
              onValueChange={handleRadiusChange}
              max={3}
              step={0.1}
              min={0.1}
            />
          </div>{" "}
          <div className="pt-4 border-t">
            <h2 className="text-lg font-medium mb-4">Scale/Deform</h2>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="scale-x"
                className="flex justify-between items-center"
              >
                <span>Scale X</span>
                <span className="text-sm text-muted-foreground">
                  {scaleX.toFixed(2)}
                </span>
              </label>
              <Slider
                id="scale-x"
                value={[scaleX]}
                onValueChange={handleScaleXChange}
                max={2}
                step={0.05}
                min={0.1}
              />
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <label
                htmlFor="scale-y"
                className="flex justify-between items-center"
              >
                <span>Scale Y</span>
                <span className="text-sm text-muted-foreground">
                  {scaleY.toFixed(2)}
                </span>
              </label>
              <Slider
                id="scale-y"
                value={[scaleY]}
                onValueChange={handleScaleYChange}
                max={2}
                step={0.05}
                min={0.1}
              />
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <label
                htmlFor="scale-z"
                className="flex justify-between items-center"
              >
                <span>Scale Z</span>
                <span className="text-sm text-muted-foreground">
                  {scaleZ.toFixed(2)}
                </span>
              </label>
              <Slider
                id="scale-z"
                value={[scaleZ]}
                onValueChange={handleScaleZChange}
                max={2}
                step={0.05}
                min={0.1}
              />
            </div>{" "}
          </div>
          {/* Color Controls */}
          <div className="pt-4 border-t">
            <h2 className="text-lg font-medium mb-4">Colors</h2>
            <div className="space-y-4">
              {/* Color List */}
              <ColorList
                colors={colors}
                onChange={setColors}
                maxColors={6}
              />{" "}
              {/* Gradient Direction */}
              {colors.length > 1 && (
                <>
                  <div>
                    <label className="font-medium block mb-2">
                      Gradient Direction
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={gradientDirection === "horizontal"}
                          onChange={() =>
                            handleGradientDirectionChange("horizontal")
                          }
                          className="accent-primary"
                        />
                        <span className="flex items-center">
                          Horizontal
                          <span className="ml-2 inline-block w-8 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-sm"></span>
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={gradientDirection === "vertical"}
                          onChange={() =>
                            handleGradientDirectionChange("vertical")
                          }
                          className="accent-primary"
                        />
                        <span className="flex items-center">
                          Vertical
                          <span className="ml-2 inline-block w-4 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-sm"></span>
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Gradient Multiply */}
                  <div className="flex flex-col gap-2 mt-4">
                    <label
                      htmlFor="gradient-multiply"
                      className="flex justify-between items-center"
                    >
                      <span>Gradient Multiply</span>
                      <span className="text-sm text-muted-foreground">
                        {gradientMultiply.toFixed(1)}
                      </span>
                    </label>
                    <Slider
                      id="gradient-multiply"
                      value={[gradientMultiply]}
                      onValueChange={handleGradientMultiplyChange}
                      max={5}
                      step={0.1}
                      min={0.1}
                    />
                    <p className="text-xs text-muted-foreground">
                      Controls how many times the gradient repeats
                    </p>
                  </div>

                  {/* Gradient Intersection */}
                  <div className="flex flex-col gap-2 mt-4">
                    <label
                      htmlFor="gradient-intersection"
                      className="flex justify-between items-center"
                    >
                      <span>Gradient Intersection</span>
                      <span className="text-sm text-muted-foreground">
                        {gradientIntersection.toFixed(1)}
                      </span>
                    </label>
                    <Slider
                      id="gradient-intersection"
                      value={[gradientIntersection]}
                      onValueChange={handleGradientIntersectionChange}
                      max={1}
                      step={0.1}
                      min={0}
                    />
                    <p className="text-xs text-muted-foreground">
                      0 = smooth gradient, 1 = sharp color boundaries
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
          {/* Lighting Controls */}
          <div className="pt-4 border-t">
            <h2 className="text-lg font-medium mb-4">Lighting</h2>
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="light-intensity"
                  className="flex justify-between items-center"
                >
                  <span>Light Intensity</span>
                  <span className="text-sm text-muted-foreground">
                    {lightIntensity.toFixed(1)}
                  </span>
                </label>
                <Slider
                  id="light-intensity"
                  value={[lightIntensity]}
                  onValueChange={handleLightIntensityChange}
                  max={10}
                  step={0.1}
                  min={0}
                />
                <p className="text-xs text-muted-foreground">
                  Controls the intensity of the main directional light
                </p>
              </div>
            </div>
          </div>
          {/* Bloom Effect Controls */}
          <div className="pt-4 border-t">
            <h2 className="text-lg font-medium mb-4">Bloom Effect</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="bloom-enabled" className="text-sm font-medium">
                  Enable Bloom
                </label>
                <Switch
                  id="bloom-enabled"
                  checked={bloomEnabled}
                  onCheckedChange={handleBloomEnabledChange}
                />
              </div>

              {bloomEnabled && (
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="bloom-intensity"
                    className="flex justify-between items-center"
                  >
                    <span>Bloom Intensity</span>
                    <span className="text-sm text-muted-foreground">
                      {bloomIntensity.toFixed(2)}
                    </span>
                  </label>
                  <Slider
                    id="bloom-intensity"
                    value={[bloomIntensity]}
                    onValueChange={handleBloomIntensityChange}
                    max={2}
                    step={0.05}
                    min={0}
                  />
                  <p className="text-xs text-muted-foreground">
                    Controls the intensity of the glow effect around bright
                    areas
                  </p>
                </div>
              )}
            </div>{" "}
          </div>
          {/* Camera Controls */}
          <div className="pt-4 border-t">
            <h2 className="text-lg font-medium mb-4">Camera Controls</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="auto-rotate-enabled"
                  className="text-sm font-medium"
                >
                  Auto Rotate
                </label>
                <Switch
                  id="auto-rotate-enabled"
                  checked={autoRotateEnabled}
                  onCheckedChange={handleAutoRotateEnabledChange}
                />
              </div>

              {autoRotateEnabled && (
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="auto-rotate-speed"
                    className="flex justify-between items-center"
                  >
                    <span>Rotation Speed</span>
                    <span className="text-sm text-muted-foreground">
                      {autoRotateSpeed.toFixed(1)}
                    </span>
                  </label>
                  <Slider
                    id="auto-rotate-speed"
                    value={[autoRotateSpeed]}
                    onValueChange={handleAutoRotateSpeedChange}
                    max={5}
                    step={0.1}
                    min={0.1}
                  />
                  <p className="text-xs text-muted-foreground">
                    Controls the speed of auto-rotation
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* Material Controls */}
          <div className="pt-4 border-t">
            <h2 className="text-lg font-medium mb-4">Material</h2>
            <div className="space-y-6">
              {/* Roughness */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="roughness"
                  className="flex justify-between items-center"
                >
                  <span>Roughness</span>
                  <span className="text-sm text-muted-foreground">
                    {roughness.toFixed(2)}
                  </span>
                </label>
                <Slider
                  id="roughness"
                  value={[roughness]}
                  onValueChange={handleRoughnessChange}
                  max={1}
                  step={0.01}
                  min={0}
                />{" "}
                <p className="text-xs text-muted-foreground">
                  Controls surface texture: 0 = glossy (shiny reflections), 1 =
                  rough (diffuse)
                </p>
              </div>

              {/* Metalness */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="metalness"
                  className="flex justify-between items-center"
                >
                  <span>Metalness</span>
                  <span className="text-sm text-muted-foreground">
                    {metalness.toFixed(2)}
                  </span>
                </label>
                <Slider
                  id="metalness"
                  value={[metalness]}
                  onValueChange={handleMetalnessChange}
                  max={1}
                  step={0.01}
                  min={0}
                />
                <p className="text-xs text-muted-foreground">
                  Controls reflectivity: 0 = non-metallic, 1 = metallic
                  (enhances environment maps)
                </p>{" "}
              </div>

              {/* Wireframe Toggle */}
              <div className="flex items-center justify-between mt-4">
                <label htmlFor="wireframe-enabled" className="font-medium">
                  Wireframe Mode
                </label>
                <Switch
                  id="wireframe-enabled"
                  checked={wireframeEnabled}
                  onCheckedChange={handleWireframeEnabledChange}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Display the blob as a wireframe structure
              </p>
            </div>
          </div>{" "}
          {/* Environment Map Controls */}
          <div className="pt-4 border-t">
            <h2 className="text-lg font-medium mb-4">Environment Map</h2>
            <div className="space-y-4">
              {/* Environment Map Toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="environment-map" className="font-medium">
                  Enable Environment Map
                </Label>
                <Switch
                  id="environment-map"
                  checked={environmentMapEnabled}
                  onCheckedChange={handleEnvironmentMapEnabledChange}
                />
              </div>{" "}
              <p className="text-xs text-muted-foreground">
                When environment maps are enabled, the blob uses standard
                materials for realistic reflections. Some advanced shader
                effects may render differently.
              </p>
              <div className="flex items-center justify-between mt-4">
                <Label htmlFor="environment-background" className="font-medium">
                  Show Environment Background
                </Label>
                <Switch
                  id="environment-background"
                  checked={showEnvironmentBackground}
                  onCheckedChange={handleShowEnvironmentBackgroundChange}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                When enabled, the environment will be visible as a backdrop
                behind the blob
              </p>
              {environmentMapEnabled && (
                <div className="pl-2 border-l-2 border-primary/20 space-y-4">
                  {/* Environment Map Type */}
                  <div>
                    <label className="font-medium block mb-2">
                      Environment Map Type
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={environmentMapType === "studio"}
                          onChange={() =>
                            handleEnvironmentMapTypeChange("studio")
                          }
                          className="accent-primary"
                        />
                        <span className="text-sm">Studio</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={environmentMapType === "city"}
                          onChange={() =>
                            handleEnvironmentMapTypeChange("city")
                          }
                          className="accent-primary"
                        />
                        <span className="text-sm">City</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={environmentMapType === "dawn"}
                          onChange={() =>
                            handleEnvironmentMapTypeChange("dawn")
                          }
                          className="accent-primary"
                        />
                        <span className="text-sm">Dawn</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={environmentMapType === "night"}
                          onChange={() =>
                            handleEnvironmentMapTypeChange("night")
                          }
                          className="accent-primary"
                        />
                        <span className="text-sm">Night</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={environmentMapType === "warehouse"}
                          onChange={() =>
                            handleEnvironmentMapTypeChange("warehouse")
                          }
                          className="accent-primary"
                        />
                        <span className="text-sm">Warehouse</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={environmentMapType === "forest"}
                          onChange={() =>
                            handleEnvironmentMapTypeChange("forest")
                          }
                          className="accent-primary"
                        />
                        <span className="text-sm">Forest</span>
                      </label>
                    </div>
                  </div>

                  {/* Environment Map Intensity */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="environment-map-intensity"
                      className="flex justify-between items-center"
                    >
                      <span>Environment Map Intensity</span>
                      <span className="text-sm text-muted-foreground">
                        {environmentMapIntensity.toFixed(2)}
                      </span>
                    </label>
                    <Slider
                      id="environment-map-intensity"
                      value={[environmentMapIntensity]}
                      onValueChange={handleEnvironmentMapIntensityChange}
                      max={2}
                      step={0.01}
                      min={0}
                    />{" "}
                    <p className="text-xs text-muted-foreground">
                      Controls the brightness of the environment map reflections
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Strips Controls */}
          <div className="pt-4 border-t">
            <h2 className="text-lg font-medium mb-4">Strips</h2>

            {/* Horizontal Strips */}
            <div className="mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="horizontal-strips" className="font-medium">
                  Horizontal Strips
                </Label>
                <Switch
                  id="horizontal-strips"
                  checked={horizontalStrips}
                  onCheckedChange={handleHorizontalStripsChange}
                />
              </div>

              {horizontalStrips && (
                <div className="pl-2 border-l-2 border-primary/20 space-y-4">
                  <ColorInput
                    label="Strip Color"
                    value={horizontalStripColor}
                    onChange={setHorizontalStripColor}
                  />

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="horizontal-strip-width"
                      className="flex justify-between items-center"
                    >
                      <span>Strip Width</span>
                      <span className="text-sm text-muted-foreground">
                        {horizontalStripWidth.toFixed(2)}
                      </span>
                    </label>
                    <Slider
                      id="horizontal-strip-width"
                      value={[horizontalStripWidth]}
                      onValueChange={handleHorizontalStripWidthChange}
                      max={0.5}
                      step={0.01}
                      min={0.01}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="horizontal-strip-count"
                      className="flex justify-between items-center"
                    >
                      <span>Strip Count</span>
                      <span className="text-sm text-muted-foreground">
                        {horizontalStripCount}
                      </span>
                    </label>
                    <Slider
                      id="horizontal-strip-count"
                      value={[horizontalStripCount]}
                      onValueChange={handleHorizontalStripCountChange}
                      max={20}
                      step={1}
                      min={1}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Vertical Strips */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="vertical-strips" className="font-medium">
                  Vertical Strips
                </Label>
                <Switch
                  id="vertical-strips"
                  checked={verticalStrips}
                  onCheckedChange={handleVerticalStripsChange}
                />
              </div>

              {verticalStrips && (
                <div className="pl-2 border-l-2 border-primary/20 space-y-4">
                  <ColorInput
                    label="Strip Color"
                    value={verticalStripColor}
                    onChange={setVerticalStripColor}
                  />

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="vertical-strip-width"
                      className="flex justify-between items-center"
                    >
                      <span>Strip Width</span>
                      <span className="text-sm text-muted-foreground">
                        {verticalStripWidth.toFixed(2)}
                      </span>
                    </label>
                    <Slider
                      id="vertical-strip-width"
                      value={[verticalStripWidth]}
                      onValueChange={handleVerticalStripWidthChange}
                      max={0.5}
                      step={0.01}
                      min={0.01}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="vertical-strip-count"
                      className="flex justify-between items-center"
                    >
                      <span>Strip Count</span>
                      <span className="text-sm text-muted-foreground">
                        {verticalStripCount}
                      </span>
                    </label>
                    <Slider
                      id="vertical-strip-count"
                      value={[verticalStripCount]}
                      onValueChange={handleVerticalStripCountChange}
                      max={20}
                      step={1}
                      min={1}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>{" "}
      <div className="relative border border-border rounded-lg min-h-[50rem]">
        <BlobView />
        <Button
          disabled={submitting}
          className="absolute top-5 right-5 z-10"
          onClick={uploadBlob}
        >
          {submitting ? (
            <span>
              {" "}
              <LoaderCircle className="animate-spin" />
            </span>
          ) : (
            "Create NFT"
          )}
        </Button>
      </div>
    </div>
  );
};

export default Page;
