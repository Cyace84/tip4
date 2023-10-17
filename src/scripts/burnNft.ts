// Import the following libraries
import {
  Address,
  Contract,
  ProviderRpcClient,
  Transaction,
} from "everscale-inpage-provider";

import isValidEverAddress from "./helpers/isValideverAddress";
import { useProviderInfo } from "./helpers/useProviders";
import { zeroAddress } from "./helpers/zeroAddress";
import { toast } from "../../src/helpers/toast";
import { factorySource, FactorySource } from "../build/factorySource";

export async function burnNft(nftAddress: string): Promise<string> {
  try {
    const [provider, providerAddress]: [ProviderRpcClient, Address] =
      await useProviderInfo();

    if (!isValidEverAddress(provider, nftAddress)) {
      toast("Please enter a valid nft address !", 0);

      return "Failed";
    }

    // Nft contract abi
    const nftAbi: FactorySource["NftWithRoyalty"] =
      factorySource["NftWithRoyalty"];

    const nftContract: Contract<FactorySource["NftWithRoyalty"]> =
      new provider.Contract(nftAbi, new Address(nftAddress));
    const nftContractData = await nftContract.methods
      .getInfo({ answerId: 0 })
      .call();

    // deploying an nft from the collection contract
    const burnRes: Transaction = await nftContract.methods
      .burn({
        sendGasTo: providerAddress,
        callbackTo: zeroAddress,
        callbackPayload: "",
      })
      .send({
        from: providerAddress,
        amount: String(2 * 10 ** 9),
        bounce: true,
      });

    if (burnRes.aborted) {
      return `Burning Nft failed ${(burnRes.exitCode, burnRes.resultCode)}`;
    }

    const isNftContractDestructed: boolean | undefined = (
      await provider.getFullContractState({ address: new Address(nftAddress) })
    ).state?.isDeployed;

    if (!isNftContractDestructed) {
      toast(`Nft number ${nftContractData.id} burnt successfully`, 1);

      return `tx hash ${burnRes.id.hash}`;
    } else {
      toast("Burning Nft failed", 0);

      return `Burning Nft failed ! ${(burnRes.exitCode, burnRes.resultCode)}`;
    }
  } catch (err: any) {
    toast(err.message, 0);

    return err.message;
  }
}
