// Import the following libraries
import {
  Address,
  Contract,
  ProviderRpcClient,
} from "everscale-inpage-provider";

import isValidEverAddress from "./helpers/isValideverAddress";
import { IndexTvc } from "./helpers/tvcExporter";
import { useProviderInfo } from "./helpers/useProviders";
import { zeroAddress } from "./helpers/zeroAddress";
import { toast } from "../../src/helpers/toast";
import { factorySource, FactorySource } from "../build/factorySource";
export async function findNfts(
  collectionAddress: string = zeroAddress.toString()
): Promise<string[] | undefined | string> {
  try {
    const [provider, providerAddress]: [ProviderRpcClient, Address] =
      await useProviderInfo();

    if (
      !isValidEverAddress(provider, collectionAddress) &&
      collectionAddress != zeroAddress.toString()
    ) {
      toast("Please enter a valid collection address !", 0);

      return "Failed";
    }

    const indexCode: string = (await provider.splitTvc(IndexTvc)).code!;

    const nfts: string[] = [];

    // for (let collection in fetchedCollections) {
    // Building the salt cell for IndexBasis
    const indexSaltCell = await provider.packIntoCell({
      data: {
        name: "nft",
        collection: new Address(collectionAddress),
        owner: providerAddress,
      },
      structure: [
        { name: "name", type: "string" },
        { name: "collection", type: "address" },
        { name: "owner", type: "address" },
      ] as const,
      abiVersion: "1.0",
    });

    // Salting the index contracts code
    const indexSaltedCode = await provider.setCodeSalt({
      code: indexCode,
      salt: indexSaltCell.boc,
    });

    // Calculating the index contracts code hah using the salted code hash
    const indexCodeHash = await provider.getBocHash(indexSaltedCode.code);

    const indexContracts = (
      await provider.getAccountsByCodeHash({
        codeHash: indexCodeHash,
      })
    ).accounts;

    for (const index of indexContracts) {
      const tempIndex: Contract<FactorySource["Index"]> = new provider.Contract(
        factorySource.Index,
        index
      );
      nfts.push(
        (await tempIndex.methods.getInfo({ answerId: 0 }).call()).nft.toString()
      );
    }

    if (nfts.length > 0) {
      toast(`Found ${nfts.length} nfts`, 1);

      return nfts;
    } else {
      toast(`Found no nfts`, 0);

      return undefined;
    }
  } catch (err: any) {
    toast(err.message, 0);

    return err.message;
  }
}
