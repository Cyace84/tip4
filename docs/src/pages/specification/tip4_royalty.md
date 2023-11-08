# TIP-4_Royalty

Requires: [TIP-6.1](./tip6.md)

## Overview
This standard enables NFT marketplaces and owners of NFT collections to retrieve royalty data for desired collections and associated NFTs. It adapts the Ethereum [`EIP-2981`](https://eips.ethereum.org/EIPS/eip-2981) standard to the TVM (Ton Virtual Machine) based blockchains.

NFT marketplaces should consider implementing this feature into their platforms to retrieve royalty amounts and pay the NFT creators right from each sell on the specific nft. While this feature is optional, many NFT marketplaces voluntarily provide it to attract artists and NFT creators.

# Royalty
Royalty is an percentage deducted from the total sale price paid to the original creator of an NFT each time the NFT is sold to another person and is set into the contract by creator of the NFT.

In the TIP-4 standard, the royalty amount can be specified separately for each nft.

Royalty provides a passive income source for NFT creators and encourages other creators to utilize this feature alongside the promotional power of the NFT marketplace platform.

::: tip
For precise specification, you can refer to the Venom Foundation documentation on NFT royalty (VEP-2981) at the following link:\
https://docs.venom.foundation/standards/VEP/vep-2981
:::

---

## Contract Specification

The `TIP-4_1` contains two contracts:

- [ `TIP-4RoyaltyCollection` ](https://github.com/broxus/tip4/blob/master/contracts/TIP4_1/TIP4_1Collection.tsol)
- [ `TIP-4RoyaltyNFT` ](https://github.com/broxus/tip4/blob/master/contracts/TIP4_1/TIP4_1Nft.tsol)



### TIP-4RoyaltyCollection
This contract has no more added functionality or state variable than previous implementation of the collection contract. see[TIP4_3Collection](./tip4_3.md#contract-specification) implementation

### TIP-4RoyaltyNft
This contract accept the royalty parameters in its constructor and is able to calculate, represent and save the royalty information of the nft in its state.


