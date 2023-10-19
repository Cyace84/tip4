# Introduction
This documentation is describes the concept of implementing distributed non-fungible tokens (NFTs) on the [TVM (TON Virtual Machine)](https://github.com/tonlabs/TON-Solidity-Compiler/tree/master) based blockchains. The standard aims to provide a professional and standardized API for NFTs within smart contracts.

::: info

This documentation has been developed by the [Broxus team](https://broxus.com/) and provides a unique implementation of the TIP4 standard contracts.
:::

## Abstract
This standard defines the implementation of NFTs within smart contracts, with a specific focus on the storage and management of NFT collections. Each NFT is deployed in its own smart contract and linked to the NFT collection contract.

Non-fungible tokens, also known as NFTs, are unique cryptographic tokens that exist on a blockchain and cannot be duplicated. Unlike fungible tokens, NFTs have distinct properties and cannot be exchanged on a one-to-one basis.

The TIP-4 standard provides more useful and practical functionalities compared to the ERC-721 standard on Ethereum or other NFT standards. TIP-4 was designed to align with the distributed system design of the mentioned blockchains and offers lower gas fees.

In addition to the expected functionalities of an NFT standard, such as minting and burning of NFTs, transferring NFTs between accounts, and selling NFTs, TIP-4 offers other functionalities including:

- [On-Chain Indexing](/specification/tip4_3.md)
- [On-chain Storage](/specification/tip4_4.md)
- [Upgradeability](/specification/tip4_6.md)

## Motivation
The proposed standard differs significantly from Ethereum's ERC721 and other NFT standards with a single registry due to the unique characteristics of these blockchains. As TVM imposes storage fees, TIP-4 takes a distributed approach, ensuring separate storage for each NFT contract.

## Implementations and References
- [TIP-4 Broxus Implementation ](https://github.com/broxus/tip4/tree/master/contracts)
- [TIP-4 itgold Implementation](https://github.com/itgoldio/everscale-tip)
- [TIP-4 grandbazar.io Implementation](https://github.com/grandbazar-io/everscale-tip4.6-contracts)
- [Ethereum EIP-721](https://eips.ethereum.org/EIPS/eip-721)
- [Solana v1.2.0](https://docs.metaplex.com/token-metadata/specification)
- [TON NFT](https://github.com/ton-blockchain/TIPs/issues/62), [TON DATA](https://github.com/ton-blockchain/TIPs/issues/64)
- [Tezos TZIP12](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-12/tzip-12.md)