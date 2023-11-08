# TIP-4_2 (Non-Fungible Token JSON Metadata)

## Overview
The metadata related to an specific NFT is stored as a string in the smart contract. To facilitate off-chain work with metadata, it is stored as a JSON object. The JSON object should have a specific structure with some required fields, and additional data about the NFT can be added next to those fields. This standard provides optional JSON fields and a contract interface.

---

## Contract Specification
This part of the standard consists of two contracts:

- [ `TIP-4_2Collection` ](https://github.com/broxus/tip4/blob/master/contracts/TIP4_2/TIP4_2Collection.tsol)
- [ `TIP-4_2NFT` ](https://github.com/broxus/tip4/blob/master/contracts/TIP4_2/TIP4_2Nft.tsol)

Both this contracts have one additional functionality compared to the previously described standard part, which is the ability to store and return the JSON metadata as a string and this will be achieved by implementing the [`ITIP-4_2JSON-Metadata`](https://github.com/broxus/tip4/blob/master/contracts/TIP4_2/interfaces/ITIP4_2JSON_Metadata.tsol) interface.

## JSON Metadata

### Basic

````json
{
    "type": "Basic NFT",
    "name": "Sample Name",
    "description": "Hello world!",
    "preview": {
        "source": "https://everscale.network/images/Backgrounds/Main/main-hero.png",
        "mimetype": "image/png"
    },
    "files": [
        {
            "source": "https://everscale.network/images/Backgrounds/Main/main-hero.png",
            "mimetype": "image/png"
        }
    ],
    "external_url": "https://everscale.network"
}
````

The source files' URLs can be [IPFSs](https://www.ipfs.com/) links where all the files with their relevant IDs are stored.
The collection contract and each NFT contract will have a separate json field stored in their code.

### Advanced

Here you can find a bit more advanced implementation of the JSON objects that are used as the metadata of the NFTs:


### Collection Metadata Example

The JSON object below is utilized for the metadata of the `TIP-4_2Collection` contract metadata:

````json
{
  "type": "Basic NFT",
  "name": "hell bite",
  "description": "The red daemons from hell",
  "preview": {
    "source":
      "https://images.pexels.com/photos/16115934/pexels-photo-16115934/free-photo-of-spooky-traditional-figurine.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "mimetype": "image/JPEG",
  },
  "files": [
    {
      "source":
        "https://images.pexels.com/photos/16115934/pexels-photo-16115934/free-photo-of-spooky-traditional-figurine.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "mimetype": "image/JPEG",
    },
  ],
  "external_url": "https://images.pexels.com",
}

````

### NFT Metadata Example

The JSON object is used as the `TIP-4_2NFT` metadata ans as we can see it has more fields:

````json
{
    "type": "Basic NFT",
    "name": "Daemon #1",
    "description": "The red daemons from hell",
    "preview": {
      "source":
        "https://images.pexels.com/photos/16115934/pexels-photo-16115934/free-photo-of-spooky-traditional-figurine.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "mimetype": "image/JPEG",
    },
    "files": [
      {
        "source":
          "https://images.pexels.com/photos/16115934/pexels-photo-16115934/free-photo-of-spooky-traditional-figurine.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "mimetype": "image/JPEG",
      },
    ],
    "external_url": "https://images.pexels.com",
    "image": "/1.jpeg",
    "attributes": [
      { "trait_type": "Background", "value": "hell" },
      { "trait_type": "Skin Color", "value": "red" },
      { "trait_type": "teeth", "value": "sharp white" },
      { "trait_type": "nationality", "value": "utbvir" },
      { "trait_type": "jewelry", "value": "fire water fire" },
      { "trait_type": "crown", "value": "golden" },
      { "trait_type": "Rarity Rank", "value": 1 },
    ],
  }
````


::: tip

The provided link below will assist you further in preparing the JSON metadata if you need more information.

[youtube tutorial](https://www.youtube.com/watch?v=NiTSfDwNwg0&t=623s)

[Example implementation](https://github.com/Javadyakuza/Revolt_Venom_NFT)

[IPFS, web3 storage tutorial](https://www.youtube.com/watch?v=Obnxs_GC9Bk)


:::

