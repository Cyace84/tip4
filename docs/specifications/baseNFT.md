# Base NFT
As explained earlier, a `BaseNFT` contract is developed to handle the logic of the TIP-4_nNFT contracts.`BaseNFT` simply feeds the constructor of the inheriting TIP-4_nNFT contract.

When it comes to indexing functionality, the `BaseNFT` contract must implement the methods that handles the deployment and destruction of the index contracts when ever its required.

::: tip

- Please refer to the [`BaseNft Contract Implementation`](../usage/deployingCollection.md#nft-contract) to find out how its implemented and its usage.

:::