# Performance
Within the NFT Project contract development section, two performance contracts are involved:
- Collection
- NFT

These contracts are responsible for the logic defined in each part of the TIP-4 standard.

## Collection
The performance collection contract differs from the TIP-4_nCollection contract. In simple terms, the performance collection contract is implemented to consolidate the functionalities provided by the TIP-4_nCollection contracts into a single contract. On the other hand, the TIP-4_nCollection contracts are responsible for providing the specific logic for each part of the standard.

For example, when it comes to minting NFTs, the [TIP-4_1 collection](https://github.com/itgoldio/everscale-tip/blob/main/contracts/TIP4_1/TIP4_1Collection.sol) contract provides the functionality to prepare the initial values required for minting and deploying the NFTs. However, it is the performance collection contract that fetches this data and deploys the NFT contract.

## NFT
As explained earlier, a performance NFT contract is written to handle the logic of the TIP-4_nNFT contracts. Unlike the collection contract, the performance NFT contract does not require any additional functionality implementation. It simply feeds the constructor of the desired TIP-4_nNFT contract.

::: tip
For further reference on the implementation of performance contracts, you can explore the [itgoldio](https://github.com/itgoldio/everscale-tip) repository to see how they are implemented. Check the [performance contracts section](https://github.com/itgoldio/everscale-tip#how-to-use-library) for more details.
:::