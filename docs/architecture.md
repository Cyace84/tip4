# Architecture

## TIP-4 Design
The TIP-4 distributed NFT standard, explained in this documentation, involves dispersing the information of NFTs across multiple smart contracts instead of consolidating them into a single contract.

For example, if an artist has 1000 artworks, it would be necessary to deploy 1001 contracts. One contract functions as the collection contract, while the remaining 1000 contracts are specifically assigned to individual NFTs.

The deployment of these NFT contracts is managed by the collection contract and the addresses of the deployed NFT contracts can be derived via the collection contract However, the collection contract does not directly store the addresses of these contracts in its state. Instead, the address of each NFT contract is derived using different elements, including the NFT contract code and it's ID.

::: tip
To learn more about addresses, you can refer to the Everscale documentation at [https://docs.everscale.network/arch/basics#address](https://docs.everscale.network/arch/basics#address).
:::

This workflow allows for a more organized management of various aspects, including:
- Paymaster
- Storage of NFT information
- Storage of NFT metadata
- Ownership management of NFTs

### TIP-4 Concept Simple Scheme
<ImgContainer src= '/tip4scheme.png' width="100%" altText="deployAccountOutput" />

## Difference with ERC-721
In contrast to TIP-4, ERC-721 is typically a monolithic smart contract that stores mappings showing token ownership based on token IDs. Token metadata can also be stored within this contract, either in a separate mapping or through tokenURI. However, this approach significantly increases the contract's byte code and occupied state, resulting in higher computational requirements and gas fees.

### ERC-721 Concept Simple Scheme
<ImgContainer src= '/erc721scheme.png' width="100%" altText="deployAccountOutput"/>

<script lang="ts" >
import { defineComponent, ref, onMounted } from "vue";
import ImgContainer from "../.vitepress/theme/components/shared/BKDImgContainer.vue"

export default defineComponent({
  name: "Diagrams",
  components :{
    ImgContainer
  },
  setup() {
    return {
    };
  },
});

</script>