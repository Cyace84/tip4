# Introduction
This documentation describes the concept of implementing distributed non-fungible tokens (NFTs) on the TVM (Ton Virtual Machine) based blockchains. The standard aims to provide a professional and standardized API for NFTs within smart contracts.

## Abstract
This standard defines the implementation of NFTs within smart contracts, specifically focusing on the storage and management of NFT collections. Each NFT is deployed in its own smart contract and linked to the NFT collection contract.

Non-fungible tokens, also known as NFTs, are unique cryptographic tokens that exist on a blockchain and cannot be duplicated. Unlike fungible tokens, NFTs have distinct properties and cannot be exchanged on a one-to-one basis.

TIP-4 standard provides beyond what is presented by the ERC-721 standard on the Ethereum or other NFT standards. TIP-4 was designed to align with the distributed system design of the mentioned blockchains and offers lower gas fees.

Besides the expected functionalities from a NFT standard which are:
- Minting and burning of NFTs
- Transferring NFTs between accounts
- Selling NFTs

TIP-4 offers more practical functionalities such as:
- [On-Chain Indexing](/docs/specifications/43.md)
- [On-chain Storage](/docs/specifications/45.md)
- [Upgradeability](/docs/specifications/47.md)



## Motivation

The proposed standard differs significantly from Ethereum's ERC721 and other NFT standards with single registry due to the unique characteristics of these blockchains. As TVM imposes storage fees, TIP-4 takes a distributed approach, ensuring separate storage of each NFT contract.

## Implementations and References

[TIP-4 Implementation](https://github.com/broxus/tip4)

[TIP-4 itgold Implementation](https://github.com/itgoldio/everscale-tip)

[TIP-4 grandbazar.io Implementation](https://github.com/grandbazar-io/everscale-tip4.6-contracts)

[Ethereum EIP-721](https://eips.ethereum.org/EIPS/eip-721)

[Solana v1.2.0](https://docs.metaplex.com/token-metadata/specification)

[TON NFT](https://github.com/ton-blockchain/TIPs/issues/62), [TON DATA](https://github.com/ton-blockchain/TIPs/issues/64)

[Tezos TZIP12](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-12/tzip-12.md)