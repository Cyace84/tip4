# TIP-4_3 ( Non-Fungible Token on-chain indexes)

## Overview
Using the `Index` contract code hash, you can find all your NFTs with one simple dApp query to the desired network graphql endpoint.
This makes blockchain application less dependent on different off-chain parsers and indexers

On-chain Indexes solves easy and fast searching any data in blockchain.
This document shows standard for basic query.

## Contract Specification

The third part of the standard contains following contracts to perform the the on-chain indexing:

- [`TIP-4_3Collection`](https://github.com/broxus/tip4/tree/master/contracts/TIP4_3/TIP4_3Collection.tsol)
- [`TIP-4_3NFT`](https://github.com/broxus/tip4/tree/master/contracts/TIP4_3/TIP4_3NFT.tsol)
- [`IndexBasis`](https://github.com/broxus/tip4/tree/master/contracts/TIP4_3/IndexBasis.tsol)
- [`Index`](https://github.com/broxus/tip4/tree/master/contracts/TIP4_3/Index.tsol)

### TIP-4_3Collection

Beside the previously described functionalities of the TIP-4Collection contract, This contract will handle the storing the `Index` and `indexBasis` contracts basic information such as code and code hash and building their initial data required for deployment although, it will not handle deploying them both, it only handles the process of deploying and destructing the `indexBasis` contract.

### TIP4_3NFT

TIP-4_3NFT contract is also containing the added functionalities to the `TIP-4_3Collection` but also handles the deploying, fetching and deleting the `Index` contract.

### Index

The  `Index`  contracts are deployed by the NFT contract, with two  `Index`  contracts deployed per each NFT contract.
Each  `Index`  contract will have a specific code hash based on its associated collection and owner.

The `Index` contracts code hashes are generated from its salted code with the following salting params:
- The word "nft"
- The owner address of the nft
- The collection address associated with the nft contract

In one of the  `Index`  contracts, the  `zero address`  is passed as the collection address, while the other one utilizes the actual  `collection address`.

Utilizing one of the `Index` contracts code hash we are able to find all of the nft by the owner and we can find only the nfts associated with a specific collection when using the other one.


### IndexBasis

contract, that helps to find all collections by the **code hash** of which.
The index basis contract also has a specific code hash based on the word `"nft"`, using this unique property we will be able to find all of the nft collection contracts.

::: tip
Please refer to the [TON solidity compiler API](https://github.com/tonlabs/TON-Solidity-Compiler/blob/master/API.md) to understand what is salting in the TVM.
:::

## Query Example

```graphql
query {
  accounts(
    filter: {
      code_hash: {
        eq: "207dc560c5956de1a2c1479356f8f3ee70a59767db2bf4788b1d61ad42cdad82"
      }
    }
  ){
    id
  }
}
```

Part of response example
```json
{
  "data": {
    "accounts": [
      {
        "id": "0:000001b0422f6a7069786fa9a27aa7bb8042f58e1df01dfebc51dcb2baa5eeae"
      },
      {
        "id": "0:00022772794253c1bf8cb4fa59d6161d574033c13d881f3eea14675b911e61b0"
      }
    ]
  }
}
```

