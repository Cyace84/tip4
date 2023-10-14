// Import the following libraries
import {
  Address,
  Contract,
  ProviderRpcClient,
  Transaction,
} from "everscale-inpage-provider";

import { factorySource, FactorySource } from "./build/factorySource";
import isValidEverAddress from "./helpers/isValideverAddress";
import { useProviderInfo } from "./helpers/useProviders";
import { toast } from "../src/helpers/toast";

// Preparing the json metadata object
const defaultNftMetadata: string = JSON.stringify({
  type: "Basic NFT",
  name: "Daemon #1",
  description: "The red daemons from hell",
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
    { trait_type: "Background", value: "hell" },
    { trait_type: "Skin Color", value: "red" },
    { trait_type: "teeth", value: "sharp white" },
    { trait_type: "nationality", value: "utbvir" },
    { trait_type: "jewelry", value: "fire water fire" },
    { trait_type: "crown", value: "golden" },
    { trait_type: "Rarity Rank", value: 1 },
  ],
});

interface IRoyaltyStructure {
  numerator: string | number;
  denominator: string | number;
  receiver: string;
}

export async function mintNft(
  CollectionAddr: string,
  royalty: IRoyaltyStructure,
  json: string = defaultNftMetadata
): Promise<string> {
  try {
    const [provider, providerAddress]: [ProviderRpcClient, Address] =
      await useProviderInfo();

    if (!isValidEverAddress(provider, CollectionAddr)) {
      toast("Please enter a valid collection address !", 0);

      return "Failed";
    }
    if (!isValidEverAddress(provider, royalty.receiver)) {
      toast("Please enter a valid collection address !", 0);

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
    const royaltyInfo = {
      numerator: royalty.numerator,
      denominator: royalty.denominator,
      receiver: new Address(royalty.receiver),
    };
    const mintRes: Transaction = await collectionContract.methods
      .mintNft({ json: json, royalty: royaltyInfo })
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

      return `Nft deployment failed ! ${
        (mintRes.exitCode, mintRes.resultCode)
      }`;
    }
  } catch (err: any) {
    toast(err.message, 0);

    return err.message;
  }
}
