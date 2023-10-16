# TIP-4_2 (Non-Fungible Token JSON Metadata)
Requires: [TIP-6.1](./tip6.md)

## Overview
The metadata related to an specific NFT is stored as a string in the smart contract. To facilitate off-chain work with metadata, it is stored as a JSON object. The JSON object should have a specific structure with some required fields, and additional data about the NFT can be added next to those fields. This standard provides optional JSON fields and a contract interface.

## Motivation
Standard fields facilitate the display of NFT data for wallets, explorers, marketplaces, etc.

---

## Contract Specification
This part of the standard consists of two contracts:

- [ `TIP-4_2Collection` ](https://github.com/broxus/tip4/blob/master/contracts/TIP4_2/TIP4_2Collection.tsol)
- [ `TIP-4_2NFT` ](https://github.com/broxus/tip4/blob/master/contracts/TIP4_2/TIP4_2Nft.tsol)

Both this contracts have one additional functionality compared to the previously described standard part, which is the ability to store and return the JSON metadata as a string and this will be achieved by implementing the [`ITIP-4_2JSON-Metadata`](https://github.com/broxus/tip4/blob/master/contracts/TIP4_2/interfaces/ITIP4_2JSON_Metadata.tsol) interface.

## JSON Metadata

### Basic
The  `Basic NFT`  is used for links to files stored on the web. The JSON fields contain information about the item, files, and preview info. The  `Basic NFT`  describes the fields that must be present in the JSON.

| Field name           | Type   | Value                                                                                              | Description                 |
|----------------------|--------|----------------------------------------------------------------------------------------------------|-----------------------------|
| **type**             | string | "Basic NFT"                                                                                        | Constant name for this type |
| **name**             | string | Name of the object                                                                                 |                             |
| **description**      | string | Description of the object                                                                          |                             |
| **preview**          | object | Object preview                                                                                    |                             |
| **preview.source**   | string | Link to the object. Contains protocol and data source. Delimiter is **:**                              |                             |
| **preview.mimetype** | string | [Mime type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) of the object |                             |
| **files**            | array  | Array of objects.                                                                                  |                             |
| **file.source**      | string | Link to the object. Contains protocol and data source. Delimiter is **:**                              |                             |
| **file.mimetype**    | string | [Mime type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) of the object |                             |
| **external_url**     | string | URL to website                                                                                     |                             |

### Basic Example

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
The collection contract and each NFT contract will have a separate json field stored in their code and the off-chain services will read and render the asset based on the motioned filed.

Please note that the collection contracts will typically have the same JSON metadata as the first NFT ID within the collection.
`
### Advanced

Here you can find a bit more advanced implementation of the JSON objects that are used as the metadata of the NFTs:


### Collection Metadata Example

The JSON object below is utilized for the metadata of the `TIP-4_2Collection` contract metadata:

````json
{
  "type": "Basic NFT",
  "name": "Revolt Agents",
  "description":
    "A curated collection of 10,000 Agents from the Venom blockchain deployed on a mission to take over Web3",
  "preview": {
    "source": "https://bafybeify5q7od6cthzgxjkdy22qtrxtxzl5hro7rbh3oyg2rxs736eept4.ipfs.w3s.link/images/1.jpeg",
    "mimetype": "image/JPEG",
  },
  "files": [
    {
      "source": "https://bafybeify5q7od6cthzgxjkdy22qtrxtxzl5hro7rbh3oyg2rxs736eept4.ipfs.w3s.link/images/1.jpeg",
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

### JSON Metadata Type
A non-empty JSON must have a "type" field.

```` json
{"type":"string"}
````

Applications that read JSON metadata use the "type" field for parsing standard or custom JSON fields.

You can extend the  `Basic NFT`  type for your custom fields.

## Contribution
To add a new metadata type of  `TIP-4.2` :
- Create a product that uses the new JSON type.
- Send a pull request to change the documentation in the [TIP-4 official repository](https://github.com/broxus/tip4).
- Explain why it should be included in the standard.