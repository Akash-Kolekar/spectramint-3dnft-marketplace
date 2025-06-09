"use client";

import * as React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart, Share, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { NftMetadata } from "@/lib/utils/pinata";
import { MarketItem } from "@/lib/types/market";
import { useAccount } from "wagmi";

export const description = "An interactive bar chart";

const chartData = [
  { month: "January", ether: 0.001, mobile: 80 },
  { month: "February", ether: 0.03, mobile: 200 },
  { month: "March", ether: 0.025, mobile: 120 },
  { month: "April", ether: 0.035, mobile: 190 },
  { month: "May", ether: 0.039, mobile: 130 },
  { month: "June", ether: 0.04, mobile: 140 },
];

const chartConfig = {
  ether: {
    label: "Ether",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function MainInformationSection({
  data,
  ipfsHash,
  onBuyNft,
  loading: externalLoading,
}: {
  data: MarketItem;
  ipfsHash: string;
  onBuyNft?: () => void;
  loading?: boolean;
}) {
  const { address, isConnected } = useAccount();

  const [internalLoading, setInternalLoading] = React.useState(false);
  const loading = externalLoading || internalLoading;
  async function handleSelling() {
    // Example usage
    setInternalLoading(true);
    try {
      const response = await fetch("/api/updateSellingState", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ipfsHash,
          isSelling: !data.isSelling, // Toggle the selling state
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log("Metadata updated successfully:", result.updatedMetadata);
        // Redirect to the new page with the new hash
        window.location.href = `/market/${result.newHash}`;
      } else {
        console.error("Failed to update selling status:", result.error);
      }
    } catch (error) {
      console.error("Error updating selling status:", error);
    } finally {
      setInternalLoading(false);
    }
  }

  return (
    <div className=" rounded-md px-3 py-5 space-y-4">
      <div className="flex items-center justify-between ">
        <h1 className="text-3xl uppercase text-primary font-bold flex items-center gap-3">
          {data.name}
          <Badge variant="default" className="">
            New
          </Badge>
        </h1>
        <div className="space-x-2">
          <Button variant="ghost" size="icon">
            <Heart className="h-5 w-5" />
          </Button>
          <Link
            href={"/"}
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
          >
            <Share className="h-5 w-5" />
          </Link>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{data.description}</p>
      <h3>
        Owned by{" "}
        <Link
          href={data.owned_by}
          className="text-primary hover:underline underline-offset-4 font-bold"
        >
          {data.owned_by}
        </Link>
      </h3>
      <div className="flex flex-wrap gap-2">
        {/* {data.tags.map((tag, _) => (
          <Badge key={_} variant={"secondary"} className="font-normal">
            {tag}
          </Badge>
        ))} */}
      </div>
      <div className="space-y-3 border border-border p-4 rounded-sm">
        <h5 className="text-muted-foreground font-bold">Current price:</h5>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          {data.price} ETH
          <span className="text-sm font-normal text-muted-foreground">
            {"$"}
            {/* {data.dollerPrice} */}
          </span>
        </h1>
        <div className="">
          {" "}
          {data.owned_by === account ? (
            <>
              {data.isSelling ? (
                <Button
                  onClick={handleSelling}
                  disabled={loading || !connected || connecting}
                  variant="outline"
                  className="font-bold flex gap-2 w-full mt-5"
                >
                  {loading ? "Processing..." : "Remove from sale"}{" "}
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              ) : (
                <Button
                  onClick={handleSelling}
                  disabled={loading || !connected || connecting}
                  className="font-bold flex gap-2 w-full mt-5"
                >
                  {loading ? "Processing..." : "Sell now"}{" "}
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              )}
            </>
          ) : (
            <Button
              onClick={onBuyNft}
              className="font-bold flex gap-2 w-full mt-5"
              disabled={!data.isSelling || loading}
            >
              {loading
                ? "Processing..."
                : data.isSelling
                ? "Buy now"
                : "Not for sale"}{" "}
              <ShoppingCart className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      {/*  chart */}
      <Card>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>
              Price History{" "}
              <span className="text-base text-muted-foreground ml-2">2024</span>{" "}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <LineChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              {/* <ChartLegend content={<ChartLegendContent />} /> */}
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis />
              <Line
                type="monotone"
                dataKey="ether"
                stroke="var(--color-ether)"
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
