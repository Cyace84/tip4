// Import the following libraries
import {
  Address,
  GetExpectedAddressParams,
  Contract,
  ProviderApiResponse,
  FullContractState,
  ProviderRpcClient,
} from "everscale-inpage-provider";

import { factorySource, FactorySource } from "./build/factorySource";
import { useProviderInfo } from "./helpers/useProviders";
import { toast } from "../../src/helpers/toast";

const defaultCollectionMetadata: string = JSON.stringify({
  type: "Basic NFT",
  name: "hell bite",
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
});

export async function deployBaseCollection(
  json: string = defaultCollectionMetadata
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
      await fetch("/scripts/build/Collection.base64")
    ).text();
    const nftTvc: string = (
      await (await fetch("/scripts/build/Nft.base64")).text()
    ).replace(/\r?\n|\r/g, "");
    const indexTvc: string = (
      await (await fetch("/scripts/build/Index.base64")).text()
    ).replace(/\r?\n|\r/g, "");
    const indexBasisTvc: string = (
      await (await fetch("/scripts/build/IndexBasis.base64")).text()
    ).replace(/\r?\n|\r/g, "");
    const nftCode: string = (await provider.splitTvc(nftTvc)).code!;
    const indexCode: string = (await provider.splitTvc(indexTvc)).code!;
    const indexBasisCode: string = (await provider.splitTvc(indexBasisTvc))
      .code!;
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
        json: json,
        codeIndex: indexCode,
        codeIndexBasis: indexBasisCode,
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
