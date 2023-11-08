# TIP-4_1 (Non-Fungible Token)

## Overview

The following standard allows for implementing a standard API for NFTs within smart contracts. General information about NFT collection is stored in the NFT collection contract. Each NFT deployed in separate smart contracts and links to NFT collection contract.

This standard provides basic functionality to create, track transfer and destroy NFTs.

---
## Contract Specification

The `TIP-4_1` contains two contracts:

- [ `TIP-4_2Collection` ](https://github.com/broxus/tip4/blob/master/contracts/TIP4_1/TIP4_1Collection.tsol)
- [ `TIP-4_2NFT` ](https://github.com/broxus/tip4/blob/master/contracts/TIP4_1/TIP4_1Nft.tsol)


### TIP-4_1Collection

The contract represents shared information about NFT collection such as `totalSupply` and `supportedInterfaces` and logic for creation of NFTs.

### TIP-4_1NFT

The contract represents information about current NFT such as:

- `current owner`
- `current manager`
- `ID`
- `associated collection`

Two roles are responsible for the control logic of the NFT contract:

- `owner logic`
- `manager logic`

The owner's address is where the NFT is held and can be used for authorization and proof in games etc. The manager's address controls the NFT and can change ownership or burn it. The manager's address is typically the smart contract address for selling or farming logic.


