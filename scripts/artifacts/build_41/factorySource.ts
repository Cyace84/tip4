const accountAbi = {
  ABIversion: 2,
  version: "2.2",
  header: ["pubkey", "time", "expire"],
  functions: [
    { name: "constructor", inputs: [], outputs: [] },
    {
      name: "sendTransaction",
      inputs: [
        { name: "dest", type: "address" },
        { name: "value", type: "uint128" },
        { name: "bounce", type: "bool" },
        { name: "flags", type: "uint8" },
        { name: "payload", type: "cell" },
      ],
      outputs: [],
    },
    {
      name: "transferOwnership",
      inputs: [{ name: "newOwner", type: "uint256" }],
      outputs: [],
    },
    {
      name: "owner",
      inputs: [],
      outputs: [{ name: "owner", type: "uint256" }],
    },
    {
      name: "_randomNonce",
      inputs: [],
      outputs: [{ name: "_randomNonce", type: "uint256" }],
    },
  ],
  data: [{ key: 1, name: "_randomNonce", type: "uint256" }],
  events: [
    {
      name: "OwnershipTransferred",
      inputs: [
        { name: "previousOwner", type: "uint256" },
        { name: "newOwner", type: "uint256" },
      ],
      outputs: [],
    },
  ],
  fields: [
    { name: "_pubkey", type: "uint256" },
    { name: "_timestamp", type: "uint64" },
    { name: "_constructorFlag", type: "bool" },
    { name: "owner", type: "uint256" },
    { name: "_randomNonce", type: "uint256" },
  ],
} as const;
const collectionAbi = {
  ABIversion: 2,
  version: "2.2",
  header: ["pubkey", "time", "expire"],
  functions: [
    {
      name: "constructor",
      inputs: [
        { name: "codeNft", type: "cell" },
        { name: "ownerPubkey", type: "uint256" },
      ],
      outputs: [],
    },
    { name: "mintNft", inputs: [], outputs: [] },
    {
      name: "setRemainOnNft",
      inputs: [{ name: "remainOnNft", type: "uint128" }],
      outputs: [],
    },
    {
      name: "owner",
      inputs: [{ name: "answerId", type: "uint32" }],
      outputs: [{ name: "value0", type: "uint256" }],
    },
    {
      name: "transferOwnership",
      inputs: [{ name: "newOwner", type: "uint256" }],
      outputs: [],
    },
    {
      name: "totalSupply",
      inputs: [{ name: "answerId", type: "uint32" }],
      outputs: [{ name: "count", type: "uint128" }],
    },
    {
      name: "nftCode",
      inputs: [{ name: "answerId", type: "uint32" }],
      outputs: [{ name: "code", type: "cell" }],
    },
    {
      name: "nftCodeHash",
      inputs: [{ name: "answerId", type: "uint32" }],
      outputs: [{ name: "codeHash", type: "uint256" }],
    },
    {
      name: "nftAddress",
      inputs: [
        { name: "answerId", type: "uint32" },
        { name: "id", type: "uint256" },
      ],
      outputs: [{ name: "nft", type: "address" }],
    },
    {
      name: "supportsInterface",
      inputs: [
        { name: "answerId", type: "uint32" },
        { name: "interfaceID", type: "uint32" },
      ],
      outputs: [{ name: "value0", type: "bool" }],
    },
  ],
  data: [{ key: 1, name: "_randomNonce", type: "uint32" }],
  events: [
    {
      name: "OwnershipTransferred",
      inputs: [
        { name: "oldOwner", type: "uint256" },
        { name: "newOwner", type: "uint256" },
      ],
      outputs: [],
    },
    {
      name: "NftCreated",
      inputs: [
        { name: "id", type: "uint256" },
        { name: "nft", type: "address" },
        { name: "owner", type: "address" },
        { name: "manager", type: "address" },
        { name: "creator", type: "address" },
      ],
      outputs: [],
    },
    {
      name: "NftBurned",
      inputs: [
        { name: "id", type: "uint256" },
        { name: "nft", type: "address" },
        { name: "owner", type: "address" },
        { name: "manager", type: "address" },
      ],
      outputs: [],
    },
  ],
  fields: [
    { name: "_pubkey", type: "uint256" },
    { name: "_timestamp", type: "uint64" },
    { name: "_constructorFlag", type: "bool" },
    { name: "_supportedInterfaces", type: "optional(cell)" },
    { name: "_codeNft", type: "cell" },
    { name: "_totalSupply", type: "uint128" },
    { name: "owner_", type: "uint256" },
    { name: "_randomNonce", type: "uint32" },
    { name: "_remainOnNft", type: "uint128" },
  ],
} as const;
const indexAbi = {
  ABIversion: 2,
  version: "2.2",
  header: ["time"],
  functions: [
    {
      name: "constructor",
      inputs: [{ name: "collection", type: "address" }],
      outputs: [],
    },
    {
      name: "getInfo",
      inputs: [{ name: "answerId", type: "uint32" }],
      outputs: [
        { name: "collection", type: "address" },
        { name: "owner", type: "address" },
        { name: "nft", type: "address" },
      ],
    },
    {
      name: "destruct",
      inputs: [{ name: "gasReceiver", type: "address" }],
      outputs: [],
    },
  ],
  data: [{ key: 1, name: "_nft", type: "address" }],
  events: [],
  fields: [
    { name: "_pubkey", type: "uint256" },
    { name: "_timestamp", type: "uint64" },
    { name: "_constructorFlag", type: "bool" },
    { name: "_nft", type: "address" },
    { name: "_collection", type: "address" },
    { name: "_owner", type: "address" },
  ],
} as const;
const indexBasisAbi = {
  ABIversion: 2,
  version: "2.2",
  header: ["time"],
  functions: [
    { name: "constructor", inputs: [], outputs: [] },
    {
      name: "getInfo",
      inputs: [{ name: "answerId", type: "uint32" }],
      outputs: [{ name: "collection", type: "address" }],
    },
    {
      name: "destruct",
      inputs: [{ name: "gasReceiver", type: "address" }],
      outputs: [],
    },
  ],
  data: [{ key: 1, name: "_collection", type: "address" }],
  events: [],
  fields: [
    { name: "_pubkey", type: "uint256" },
    { name: "_timestamp", type: "uint64" },
    { name: "_constructorFlag", type: "bool" },
    { name: "_collection", type: "address" },
  ],
} as const;
const nftAbi = {
  ABIversion: 2,
  version: "2.2",
  header: ["pubkey", "time", "expire"],
  functions: [
    {
      name: "constructor",
      inputs: [
        { name: "owner", type: "address" },
        { name: "sendGasTo", type: "address" },
        { name: "remainOnNft", type: "uint128" },
      ],
      outputs: [],
    },
    {
      name: "transfer",
      inputs: [
        { name: "to", type: "address" },
        { name: "sendGasTo", type: "address" },
        {
          components: [
            { name: "value", type: "uint128" },
            { name: "payload", type: "cell" },
          ],
          name: "callbacks",
          type: "map(address,tuple)",
        },
      ],
      outputs: [],
    },
    {
      name: "changeOwner",
      inputs: [
        { name: "newOwner", type: "address" },
        { name: "sendGasTo", type: "address" },
        {
          components: [
            { name: "value", type: "uint128" },
            { name: "payload", type: "cell" },
          ],
          name: "callbacks",
          type: "map(address,tuple)",
        },
      ],
      outputs: [],
    },
    {
      name: "changeManager",
      inputs: [
        { name: "newManager", type: "address" },
        { name: "sendGasTo", type: "address" },
        {
          components: [
            { name: "value", type: "uint128" },
            { name: "payload", type: "cell" },
          ],
          name: "callbacks",
          type: "map(address,tuple)",
        },
      ],
      outputs: [],
    },
    {
      name: "getInfo",
      inputs: [{ name: "answerId", type: "uint32" }],
      outputs: [
        { name: "id", type: "uint256" },
        { name: "owner", type: "address" },
        { name: "manager", type: "address" },
        { name: "collection", type: "address" },
      ],
    },
    {
      name: "supportsInterface",
      inputs: [
        { name: "answerId", type: "uint32" },
        { name: "interfaceID", type: "uint32" },
      ],
      outputs: [{ name: "value0", type: "bool" }],
    },
  ],
  data: [{ key: 1, name: "_id", type: "uint256" }],
  events: [
    {
      name: "NftCreated",
      inputs: [
        { name: "id", type: "uint256" },
        { name: "owner", type: "address" },
        { name: "manager", type: "address" },
        { name: "collection", type: "address" },
      ],
      outputs: [],
    },
    {
      name: "OwnerChanged",
      inputs: [
        { name: "oldOwner", type: "address" },
        { name: "newOwner", type: "address" },
      ],
      outputs: [],
    },
    {
      name: "ManagerChanged",
      inputs: [
        { name: "oldManager", type: "address" },
        { name: "newManager", type: "address" },
      ],
      outputs: [],
    },
    {
      name: "NftBurned",
      inputs: [
        { name: "id", type: "uint256" },
        { name: "owner", type: "address" },
        { name: "manager", type: "address" },
        { name: "collection", type: "address" },
      ],
      outputs: [],
    },
  ],
  fields: [
    { name: "_pubkey", type: "uint256" },
    { name: "_timestamp", type: "uint64" },
    { name: "_constructorFlag", type: "bool" },
    { name: "_supportedInterfaces", type: "optional(cell)" },
    { name: "_id", type: "uint256" },
    { name: "_collection", type: "address" },
    { name: "_owner", type: "address" },
    { name: "_manager", type: "address" },
  ],
} as const;

export const factorySource = {
  Account: accountAbi,
  Collection: collectionAbi,
  Index: indexAbi,
  IndexBasis: indexBasisAbi,
  Nft: nftAbi,
} as const;

export type FactorySource = typeof factorySource;
export type AccountAbi = typeof accountAbi;
export type CollectionAbi = typeof collectionAbi;
export type IndexAbi = typeof indexAbi;
export type IndexBasisAbi = typeof indexBasisAbi;
export type NftAbi = typeof nftAbi;
