//SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {ERC721, ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
// import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

contract Glb3dNft is ERC721URIStorage, Ownable {
    uint256 private s_tokenCounter;

    // struct GlbMetadata {
    //     string glbUri;
    //     string previewUri;
    //     string name;
    //     string description;
    //     address creator;
    // }

    //mapping from tokenId to Glb3dMetadata
    // mapping(uint256 => GlbMetadata) private s_glbMetadata;

    constructor() ERC721("3D GLB NFT", "GLB3D") Ownable(msg.sender) {}

    function mintNft(string memory tokenURI) external returns (uint256) {
        uint256 newTokenId = s_tokenCounter;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        s_tokenCounter++;
        return newTokenId;
    }

    //     function mintNft(
    //         string memory glbUri,
    //         string memory previewUri,
    //         string memory name,
    //         string memory description,
    //         address to,
    //         string memory tokenURI
    //     ) external returns (uint256) {
    //         uint256 newTokenId = s_tokenCounter;

    //         // Store 3D metadata
    //         s_glbMetadata[newTokenId] = GlbMetadata({
    //             glbUri: glbUri,
    //             previewUri: previewUri,
    //             name: name,
    //             description: description,
    //             creator: msg.sender
    //         });

    //         _safeMint(to, newTokenId);
    //         _setTokenURI(newTokenId, tokenURI);

    //         s_tokenCounter++;
    //         return s_tokenCounter;
    //     }
}
