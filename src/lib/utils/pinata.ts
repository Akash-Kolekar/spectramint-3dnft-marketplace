// utils/pinata.js
import axios from "axios";

export interface NftMetadata {
  name: string;
  description: string;
  image: string;
  created_by: string;
  model_extension: "glb";
  image_extension: "png" | "jpg" | "jpeg";
  attributes: {
    background_color: string;
  };
  // price: string;
}

export interface FinalNftMetadata {
  name: string;
  description: string;
  image: string;
  created_by: string;
  owned_by: string;
  model_url: string;
  model_extension: "glb";
  image_extension: "png" | "jpg" | "jpeg";
  attributes: {
    background_color: string;
  };
  isSelling: boolean;
  created_at: string;
  // price: string;
  model_id: string;
  glb_file_hash: string;
}
const PINATA_API_KEY = "741ed7bec89e49a83bcf";
const PINATA_SECRET_KEY =
  "88ea1247813aa6a4d4e692b6ed1deea154d4cd2c222fa0a1c24eb495240a52e9";

export const uploadToIPFS = async (file: File, metadata: NftMetadata) => {
  try {
    // call mint function (price)

    // Upload file to Pinata
    const formData = new FormData();
    formData.append("file", file);

    const fileResponse = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
      }
    );

    const fileHash = fileResponse.data.IpfsHash;

    // Create complete metadata
    const completeMetadata: FinalNftMetadata = {
      ...metadata,
      model_url: `https://gateway.pinata.cloud/ipfs/${fileHash}`,
      model_id: fileHash,
      glb_file_hash: fileHash,
      isSelling: false,
      owned_by: metadata.created_by,
      created_at: new Date().toISOString(),
    };

    // Upload metadata
    const metadataResponse = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      completeMetadata,
      {
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
      }
    );

    const metadataHash = metadataResponse.data.IpfsHash;

    console.log("File uploaded successfully:", fileResponse);
    console.log("Metadata uploaded successfully:", metadataResponse);

    return {
      fileResponse,
      metadataResponse,
      metadataHash,
    };
  } catch (error) {
    console.error("Pinata upload error:", error);
    throw error;
  }
};

export const uploadBlobToIPFS = async (metadata: any) => {
  try {
    // call mint function (price)

    // Create complete metadata
    const completeMetadata: FinalNftMetadata = {
      ...metadata,
      owned_by: metadata.created_by,
      isSelling: false,
      created_at: new Date().toISOString(),
    };

    // Upload metadata
    const metadataResponse = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      completeMetadata,
      {
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
      }
    );

    const metadataHash = metadataResponse.data.IpfsHash;

    console.log("Metadata uploaded successfully:", metadataResponse);

    return {
      metadataResponse,
      metadataHash,
    };
  } catch (error) {
    console.error("Pinata upload error:", error);
    throw error;
  }
};

export const getAllFilesFromIPFS = async () => {
  try {
    const response = await axios.get(
      "https://api.pinata.cloud/data/pinList?status=pinned", // Fetches all successfully pinned files
      {
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
      }
    );
    return response.data.rows; // The list of files is in the 'rows' property
  } catch (error) {
    console.error("Pinata get all files error:", error);
    throw error;
  }
};

export const updateIpfsMetadataSellingStatus = async (
  ipfsHash: string,
  isSelling: boolean
) => {
  try {
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

    // Update the isSelling property
    const updatedMetadata = {
      ...currentMetadata,
      isSelling: isSelling,
    };

    // Unpin the old metadata
    await axios.delete(`https://api.pinata.cloud/pinning/unpin/${ipfsHash}`, {
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
    }); // Upload the updated metadata
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

    console.log("Metadata updated successfully:", metadataResponse);

    return {
      success: true,
      oldHash: ipfsHash,
      newHash: newMetadataHash,
      updatedMetadata,
    };
  } catch (error) {
    console.error("Pinata update metadata error:", error);
    throw error;
  }
};

export const updateIpfsMetadataOwner = async (
  ipfsHash: string,
  newOwner: string
) => {
  try {
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

    console.log("Owner updated successfully:", metadataResponse);

    return {
      success: true,
      oldHash: ipfsHash,
      newHash: newMetadataHash,
      updatedMetadata,
    };
  } catch (error) {
    console.error("Pinata update owner error:", error);
    throw error;
  }
};
