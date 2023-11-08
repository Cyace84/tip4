// Import the following libraries
import {
  Address,
  Contract,
  ProviderRpcClient,
  Transaction,
} from "everscale-inpage-provider";

import isValidEverAddress from "./helpers/isValideverAddress";
import { useProviderInfo } from "./helpers/useProviders";
import { toast } from "../../src/helpers/toast";
import { factorySource, FactorySource } from "../build/factorySource";

export async function transferNft(
  nftAddress: string,
  receiverAddress: string
): Promise<string> {
  try {
    const [provider, providerAddress]: [ProviderRpcClient, Address] =
      await useProviderInfo();

    if (!isValidEverAddress(provider, nftAddress)) {
      toast("Please enter a valid nft address !", 0);

      return "Failed";
    }
    if (!isValidEverAddress(provider, receiverAddress)) {
      toast("Please enter a valid receiver address !", 0);

      return "Failed";
    }

    // Nft contract abi
    const nftAbi: FactorySource["NftWithRoyalty"] =
      factorySource["NftWithRoyalty"];

    const nftContract: Contract<FactorySource["NftWithRoyalty"]> =
      new provider.Contract(nftAbi, new Address(nftAddress));

    // deploying an nft from the collection contract
    const transferRes: Transaction = await nftContract.methods
      .transfer({
        to: new Address(receiverAddress),
        sendGasTo: providerAddress,
        callbacks: [],
      })
      .send({
        from: providerAddress,
        amount: String(2 * 10 ** 9),
        bounce: true,
      });

    if (transferRes.aborted) {
      return `Transferring Nft failed ${
        (transferRes.exitCode, transferRes.resultCode)
      }`;
    }

    // fetching the nft contract data
    const nftContractData = await nftContract.methods
      .getInfo({ answerId: 0 })
      .call();

    if (nftContractData.owner.toString() == receiverAddress) {
      toast(`Nft number ${nftContractData.id} transferred successfully`, 1);

      return `Nft number ${nftContractData.id} transferred to ${receiverAddress}`;
    } else {
      toast("Transferring Nft failed", 0);

      return `Transferring Nft failed ! ${
        (transferRes.exitCode, transferRes.resultCode)
      }`;
    }
  } catch (err: any) {
    toast(err.message, 0);

    return err.message;
  }
}
