# TIP-4.6 (Upgradeable NFT)

Requires: [TIP-4.1](./tip4_1.md)\
Requires: [TIP-6.1](./tip6.md)
## Overview

This standard describes the operation of upgradeable NFT contracts. This is based on TIP-4.1 and does not describe the functionality proposed there.

The only difference in the minting process is that the Collection deploys an NftPlatform contract rather than an NFT.

Immediately after deployment to the network, the NftPlatform contract calls the tvm.setcode(), tvm.setCurrentCode(), and onCodeUpgrade functions, changing its code to NFT code.

## Motivation

The standard allows the NFT code to be changed in case an error is found in it or there is a need to add new functionality.

## Collection

The NFT collection contract serves as a repository for the most up-to-date version of the NFT code, including its current version number. When an individual NFT contract seeks to upgrade its own codebase, it can initiate a request to the NFT collection contract. Upon receiving this request, the collection contract will automatically update the requesting NFT with the latest version of the code.

## Nft

### Upgrade

The NFT upgrade scenario is as follows:

The user (in the general case, the NFT manager) calls the NFT requestUpgrade function.
The NFT requests an upgrade from the collection, passing information about itself (id, version).
The Collection compares the version it holds with the one passed by the NFT.
If the version in the collection is larger, then an upgrade is available. The collection emits the UpgradeNftRequested event, calls the NFT function and passes it the new code, version and other necessary data
    If the versions are equal, the process aborts and remaining gas is returned to the owner.
NFT sets the new code, emits NftUpgraded event

### NftPlatform

NftPlatform's static variables MUST contain _id(uint256) and nothing else.

The code and interface of the contract are not standardized, except for the previously mentioned static _id(static uint256) (similar to the NFT contract). As described above, when minting, the collection deploys this contract instead of the NFT, then it upgrades its code to TIP4_6Nft.

This approach allows the collection to accept messages from NFTs of any version without retaining all the NFT code used.

An example of this contract is shown below. The NftPlatform code is salted with the address of the Collection that deployed it (similar to the NFT contract) so that the code hash is unique for each Collection.
