import { MarketItem } from "@/lib/types/market";
import { Box } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const SingleOwnedItem = ({
  ipfsHash,
  image,
  name = "Item Name",
  description = "Item Description",
  price,
  created_by,
}: {
  ipfsHash: string;
  image?: string;
  name: string;
  description?: string;
  price?: string;
  created_by: string;
}) => {
  const [item, setItem] = useState<MarketItem | null>(null);

  // if(isOwned && !item.is_owned) {}

  return (
    <Link
      href={`/market/${ipfsHash}`}
      className="p-4 flex flex-col gap-2 border-border border rounded-lg hover:border-primary transition-all hover:-translate-y-1 cursor-pointer"
    >
      {image ? (
        <Image
          height={512}
          width={512}
          className="h-56 w-full object-cover rounded-lg"
          src={image}
          alt=""
        />
      ) : (
        <div className="h-56 w-full flex items-center justify-center object-cover rounded-lg">
          <Box />
        </div>
      )}
      <div className="flex items-center gap-2 justify-between">
        <div>
          <h3 className="text-2xl font-bold whitespace-nowrap">
            {name.slice(0, 9)}
          </h3>
          <p>{description.slice(0, 9)}</p>
        </div>
        <div className="flex flex-col items-end">
          {price && <p className="text-lg font-bold">{price} ETH</p>}
          <p className="text-sm text-gray-500">
            Created by {created_by.slice(0, 8)}
          </p>
        </div>
      </div>
      {/* Add more details about the item here */}
    </Link>
  );
};

export default SingleOwnedItem;
