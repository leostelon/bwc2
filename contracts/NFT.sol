// SPDX-License-Identifier: MITX
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter public _assetCount;

    function totalSupply() external view returns (uint256) {
        return _assetCount.current();
    }

    constructor() ERC721("CELO - ID", "CID") {}

    function mint(string memory _tokeURI) external returns (uint256) {
        _assetCount.increment();
        uint256 currentAssetId = _assetCount.current();

        _mint(msg.sender, currentAssetId);
        _setTokenURI(currentAssetId, _tokeURI);

        return currentAssetId;
    }
}