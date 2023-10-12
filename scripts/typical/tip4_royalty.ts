// Import the following libraries
import {
  Address,
  GetExpectedAddressParams,
  Contract,
  ProviderApiResponse,
  FullContractState,
  Transaction,
  ProviderRpcClient,
} from "everscale-inpage-provider";

import { toast } from "../../src/helpers/toast";
import {
  factorySource,
  FactorySource,
} from "../artifacts/build_royalty/factorySource";
import isValidEverAddress from "../helpers/isValideverAddress";
import { useProviderInfo } from "../helpers/useProviders";
import { IRoyaltyStructure } from "../types";
const defaultNft: string = JSON.stringify({
  type: "Basic NFT",
  name: "Daemon #1",
  description:
    "A curated collection of 10,000 Agents from the Venom blockchain deployed on a mission to take over Web3",
  preview: {
    source:
      "https://images.pexels.com/photos/16115934/pexels-photo-16115934/free-photo-of-spooky-traditional-figurine.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    mimetype: "image/JPEG",
  },
  files: [
    {
      source:
        "https://images.pexels.com/photos/16115934/pexels-photo-16115934/free-photo-of-spooky-traditional-figurine.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      mimetype: "image/JPEG",
    },
  ],
  external_url: "https://images.pexels.com",
  image: "/1.jpeg",
  attributes: [
    { trait_type: "Background", value: "Orange 2" },
    { trait_type: "Skin Color", value: "Lightskin 2" },
    { trait_type: "Apparel", value: "Vest" },
    { trait_type: "Eyes", value: "Werewolf" },
    { trait_type: "Mask", value: "Villain" },
    { trait_type: "Hair", value: "Prettyboy 2" },
    { trait_type: "Rarity Rank", value: 6001, display_type: "number" },
  ],
});
const defaultCollection: string = JSON.stringify({
  type: "Basic NFT",
  name: "Revolt Agents",
  description:
    "A curated collection of 10,000 Agents from the Venom blockchain deployed on a mission to take over Web3",
  preview: {
    source:
      "https://images.pexels.com/photos/16115934/pexels-photo-16115934/free-photo-of-spooky-traditional-figurine.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    mimetype: "image/JPEG",
  },
  files: [
    {
      source:
        "https://images.pexels.com/photos/16115934/pexels-photo-16115934/free-photo-of-spooky-traditional-figurine.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      mimetype: "image/JPEG",
    },
  ],
  external_url: "https://venom.network",
});

export async function deployTip4_RoyaltyCollection(
  jsonObj: string = defaultCollection
): Promise<string> {
  try {
    // let provider: ProviderRpcClient, providerAddress: Address;
    const [provider, providerAddress]: [ProviderRpcClient, Address] =
      await useProviderInfo();
    // Collection contract abi
    const collectionAbi: FactorySource["Collection"] =
      factorySource["Collection"];

    // Define the deployParams type
    type DeployParams<Abi> = GetExpectedAddressParams<Abi> & {
      publicKey: string | undefined;
    };

    // Fetching the user public key
    const accountFullState: FullContractState = (
      await provider.getFullContractState({ address: providerAddress })
    ).state!;
    const senderPublicKey: string = await provider.extractPublicKey(
      accountFullState.boc
    );

    // Fetching the tvc and the code of the nft contract
    const collectionTvc: string = await (
      await fetch("/scripts/artifacts/build_royalty/Collection.base64")
    ).text();
    const nftTvc: string = await (
      await fetch("/scripts/artifacts/build_royalty/Nft.base64")
    ).text();
    const nftCode: string = (await provider.splitTvc(nftTvc)).code!;

    /**
     * Preparing deploy params to build the state init with the contract abi
     * @param deployer_ Its important to set this param to zero address when deploying the token root contract whiteout using an smart contract.
     */
    const deployParams: DeployParams<FactorySource["Collection"]> = {
      tvc: collectionTvc,
      workchain: 0,
      publicKey: senderPublicKey,
      initParams: {
        _randomNonce: (Math.random() * 6400) | 0,
      },
    };

    // Get the expected contract address
    const expectedAddress: Address = await provider.getExpectedAddress(
      collectionAbi,
      deployParams
    );

    // Get the state init
    const stateInit: ProviderApiResponse<"getExpectedAddress"> =
      await provider.getStateInit(collectionAbi, deployParams);
    stateInit.stateInit;

    // Send the coins to the calculated address
    await provider.sendMessage({
      sender: providerAddress,
      recipient: expectedAddress,
      amount: String(2 * 10 ** 9),
      bounce: false, // it's important to set this param to keep the evers in the contract
      stateInit: stateInit.stateInit,
    });

    // Create a contract instance
    const collectionContract: Contract<FactorySource["Collection"]> =
      new provider.Contract(collectionAbi, expectedAddress);

    // Call the contract constructor
    const { transaction: deployRes } = await collectionContract.methods
      .constructor({
        codeNft: nftCode,
        ownerPubkey: `0x${deployParams.publicKey!}`,
        json: jsonObj,
      })
      .sendExternal({
        stateInit: stateInit.stateInit,
        publicKey: deployParams.publicKey!,
      });

    // checking if the token root is deployed successfully by calling its name method
    const totalSupply: string = (
      await collectionContract.methods.totalSupply({ answerId: 0 }).call()
    ).count;

    if (totalSupply == "0") {
      toast("Collection deployed successfully", 1);

      return `TIP4_1 collection deployed to ${expectedAddress.toString()}`;
    } else {
      toast("Collection deployment failed", 0);

      return `TIP4_1 collection deployment failed ! ${
        (deployRes.exitCode, deployRes.resultCode)
      }`;
    }
  } catch (err: any) {
    toast(err.message, 0);

    return err.message;
  }
}

export async function deployTip4_RoyaltyNft(
  CollectionAddr: string,
  royalty: IRoyaltyStructure,
  jsonObj: string = defaultNft
): Promise<string> {
  try {
    const [provider, providerAddress]: [ProviderRpcClient, Address] =
      await useProviderInfo();

    if (!isValidEverAddress(provider, CollectionAddr)) {
      toast("Please enter a valid collection address !", 0);

      return "Failed";
    }
    if (!isValidEverAddress(provider, royalty.receiver)) {
      toast("Please enter a valid royalty receiver address !", 0);

      return "Failed";
    }
    // Collection and the Nft contracts abis
    const collectionAbi: FactorySource["Collection"] =
      factorySource["Collection"];
    const nftAbi: FactorySource["Nft"] = factorySource["Nft"];

    const collectionContract: Contract<FactorySource["Collection"]> =
      new provider.Contract(collectionAbi, new Address(CollectionAddr));
    collectionContract.getFullState;
    // deploying an nft from the collection contract
    const totalSupply = Number(
      (await collectionContract.methods.totalSupply({ answerId: 0 }).call())
        .count
    );

    const mintRes: Transaction = await collectionContract.methods
      .mintNft({
        json: jsonObj,
        royalty: {
          numerator: royalty.numerator,
          denominator: royalty.denominator,
          receiver: new Address(royalty.receiver),
        },
      })
      .send({
        from: providerAddress,
        amount: String(2 * 10 ** 9),
        bounce: true,
      });

    if (mintRes.aborted) {
      return `minting Nft failed ${(mintRes.exitCode, mintRes.resultCode)}`;
    }

    const nftAddr: Address = (
      await collectionContract.methods
        .nftAddress({
          answerId: 0,
          id: totalSupply,
        })
        .call()
    ).nft;

    // fetching the newly deployed nft contract
    const nftContract: Contract<FactorySource["Nft"]> = new provider.Contract(
      nftAbi,
      nftAddr
    );

    // fetching
    const nftContractData = await nftContract.methods
      .getInfo({ answerId: 0 })
      .call();

    if (nftContractData.collection.toString() == CollectionAddr.toString()) {
      toast(`Nft number ${nftContractData.id} Minted successfully`, 1);

      return `Nft number ${
        nftContractData.id
      } deployed to ${nftAddr.toString()}`;
    } else {
      toast("Minting Nft failed", 0);

      return `TIP4_1 Nft deployment failed ! ${
        (mintRes.exitCode, mintRes.resultCode)
      }`;
    }
  } catch (err: any) {
    toast(err.message, 0);

    return err.message;
  }
}
