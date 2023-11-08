// Import the following libraries
import {
  Address,
  GetExpectedAddressParams,
  Contract,
  ProviderApiResponse,
  FullContractState,
  ProviderRpcClient,
} from "everscale-inpage-provider";

import {
  CollectionTvc,
  IndexBasisTvc,
  IndexTvc,
  NftTvc,
} from "./helpers/tvcExporter";
import { useProviderInfo } from "./helpers/useProviders";
import { toast } from "../../src/helpers/toast";
import { factorySource, FactorySource } from "../build/factorySource";
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
    const collectionAbi: FactorySource["CollectionWithRoyalty"] =
      factorySource["CollectionWithRoyalty"];

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
    const nftCode: string = (await provider.splitTvc(NftTvc)).code!;
    const indexCode: string = (await provider.splitTvc(IndexTvc)).code!;
    const indexBasisCode: string = (await provider.splitTvc(IndexBasisTvc))
      .code!;
    /**
     * Preparing deploy params to build the state init with the contract abi
     * @param deployer_ Its important to set this param to zero address when deploying the token root contract whiteout using an smart contract.
     */
    const deployParams: DeployParams<FactorySource["CollectionWithRoyalty"]> = {
      tvc: CollectionTvc,
      workchain: 0,
      publicKey: senderPublicKey,
      initParams: {
        nonce_: (Math.random() * 6400) | 0,
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
    const collectionContract: Contract<FactorySource["CollectionWithRoyalty"]> =
      new provider.Contract(collectionAbi, expectedAddress);

    // Call the contract constructor
    const { transaction: deployRes } = await collectionContract.methods
      .constructor({
        codeNft: nftCode,
        owner: providerAddress,
        json: json,
        codeIndex: indexCode,
        codeIndexBasis: indexBasisCode,
        remainOnNft: String(2 * 10 ** 9),
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
