# TIP-4_4 (Non-Fungible Token On-chain storage)

## Overview
Using the Storage contract, you can store NFT-related bytes in blockchain.
As an use case we can point to off-chain storage of digital assets that each nft might represent such music, videos and images among other digital assets can now be saved on the blockchain.

## Motivation
Fault tolerance. If off-chain services are unavailable, the user will view NFT-related bytes, because it is stored on-chain.

## Contract Specification
* `TIP4_4Collection`
* `TIP4_4Nft`
* `Storage`

### TIP4_4Collection

The collection of this part of the standard will store the storage code and coed hash and helps us to retrieve the the address of a storage contract based on its relevant contract besides the previously described functionalities for collection contract.

### TIP4_4Nft

The only change that `TIP4_4Nft` has than other nft contracts from previous parts is it deploys the storage contract and stores its address.

### Storage

contract that store token byte content. Storage is independent. Storage doesn’t store `NFT` address because `NFT` contract address can be changed by burning and redeployment from another collection.
