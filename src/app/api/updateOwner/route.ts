import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const PINATA_API_KEY = "741ed7bec89e49a83bcf";
const PINATA_SECRET_KEY =
  "88ea1247813aa6a4d4e692b6ed1deea154d4cd2c222fa0a1c24eb495240a52e9";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ipfsHash, newOwner } = body;

    // Validate inputs
    if (!ipfsHash || !newOwner) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // First, get the current metadata from IPFS using the hash
    const response = await axios.get(
      `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      {
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
      }
    );

    const currentMetadata = response.data;

    // Update the owned_by property to the new owner address
    const updatedMetadata = {
      ...currentMetadata,
      owned_by: newOwner,
      isSelling: false, // Set to not selling after purchase
    };

    // Unpin the old metadata
    await axios.delete(`https://api.pinata.cloud/pinning/unpin/${ipfsHash}`, {
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
    });

    // Upload the updated metadata
    const metadataResponse = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      updatedMetadata,
      {
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
      }
    );

    const newMetadataHash = metadataResponse.data.IpfsHash;

    // Return successful response with the updated data
    return NextResponse.json({
      success: true,
      newHash: newMetadataHash,
      updatedMetadata,
    });
  } catch (error) {
    console.error("Error updating owner:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update owner" },
      { status: 500 }
    );
  }
}
