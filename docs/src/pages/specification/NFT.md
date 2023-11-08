# NFT
As explained earlier, a `NFT` contract is developed to handle the logic of the TIP-4_nNft contracts.`NFT` simply feeds the constructor of the inheriting TIP-4_nNft contracts.

When it comes to indexing functionality, the `NFT` contract must implement the methods that handles the deployment and destruction of the index contracts when ever its required.

::: tip

- Please note that `Broxus` provides two implementations for the Nft contract:

  - [ `Nft` ](https://github.com/broxus/tip4/blob/master/contracts/Nft.tsol)
  - [ `NftWithRoyalty` ](https://github.com/broxus/tip4/blob/master/contracts/NftWithRoyalty.tsol)

In this documentation, we will be utilizing the  `NftWithRoyalty`  contract as it supports the royalty functionality. However, individual users have the flexibility to choose either version based on their preferred approach.

- Please refer to the [`Minting Nft`](../usage-and-deployment/minting-nft.md) section to find out how to mint and use the `NftWithRoyalty` contract.

:::