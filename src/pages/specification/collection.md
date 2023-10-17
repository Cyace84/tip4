# Collection

The `Collection` contract differs from the TIP-4_nCollection contract. In simple terms, the `Collection` contract is implemented to consolidate the functionalities provided by the TIP-4_nCollection contracts into a single contract. On the other hand, the TIP-4_nCollection contracts are responsible for providing the specific logic for each part of the standard.

For example, when it comes to minting NFTs, the [TIP-4_1 collection](https://github.com/broxus/tip4/blob/master/contracts/TIP4_1/TIP4_1Collection.tsol) contract provides the functionality to prepare the initial values required for minting and deploying the NFTs. However, it is the `Collection` contract that fetches this data and deploys the NFT contract.


::: tip

- Please note that `Broxus` provides two implementations for the Collection contract:

  - [ `Collection` ](https://github.com/broxus/tip4/blob/master/contracts/Collection.tsol)
  - [ `CollectionWithRoyalty` ](https://github.com/broxus/tip4/blob/master/contracts/CollectionWithRoyalty.tsol)

In this documentation, we will be utilizing the  `CollectionWithRoyalty`  contract as it supports the royalty functionality. However, individual users have the flexibility to choose either version based on their preferred approach.

- Please refer to the [`Deploying Collection`](..//usageAndDeployment/deployingCollection.md) section to find out how to deploy and use the `CollectionWithRoyalty` contract.

:::