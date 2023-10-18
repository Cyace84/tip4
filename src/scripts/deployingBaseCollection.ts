// // Import the following libraries
// import {
//   Address,
//   GetExpectedAddressParams,
//   Contract,
//   ProviderApiResponse,
//   FullContractState,
//   ProviderRpcClient,
// } from "everscale-inpage-provider";

// import {
//   CollectionTvc,
//   IndexBasisTvc,
//   IndexTvc,
//   NftTvc,
// } from "./helpers/tvcExporter";
// import { useProviderInfo } from "./helpers/useProviders";
// import { toast } from "../../src/helpers/toast";
// import { factorySource, FactorySource } from "../build/factorySource";
// const defaultCollectionMetadata: string = JSON.stringify({
//   type: "Basic NFT",
//   name: "hell bite",
//   description: "The red daemons from hell",
//   preview: {
//     source:
//       "https://images.pexels.com/photos/16115934/pexels-photo-16115934/free-photo-of-spooky-traditional-figurine.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//     mimetype: "image/JPEG",
//   },
//   files: [
//     {
//       source:
//         "https://images.pexels.com/photos/16115934/pexels-photo-16115934/free-photo-of-spooky-traditional-figurine.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//       mimetype: "image/JPEG",
//     },
//   ],
//   external_url: "https://images.pexels.com",
// });

// export async function deployBaseCollection(
//   json: string = defaultCollectionMetadata
// ): Promise<string> {
//   try {
//     // let provider: ProviderRpcClient, providerAddress: Address;
//     const [provider, providerAddress]: [ProviderRpcClient, Address] =
//       await useProviderInfo();

//     // Collection contract abi
//     const collectionAbi: FactorySource["CollectionWithRoyalty"] =
//       factorySource["CollectionWithRoyalty"];

//     // Define the deployParams type
//     type DeployParams<Abi> = GetExpectedAddressParams<Abi> & {
//       publicKey: string | undefined;
//     };

//     // Fetching the user public key
//     const accountFullState: FullContractState = (
//       await provider.getFullContractState({ address: providerAddress })
//     ).state!;
//     const senderPublicKey: string = await provider.extractPublicKey(
//       accountFullState.boc
//     );

//     // Fetching the tvc and the code of the nft contract
//     const nftCode: string = (await provider.splitTvc(NftTvc)).code!;
//     const indexCode: string = (await provider.splitTvc(IndexTvc)).code!;
//     const indexBasisCode: string = (await provider.splitTvc(IndexBasisTvc))
//       .code!;
//     /**
//      * Preparing deploy params to build the state init with the contract abi
//      * @param deployer_ Its important to set this param to zero address when deploying the token root contract whiteout using an smart contract.
//      */
//     const deployParams: DeployParams<FactorySource["CollectionWithRoyalty"]> = {
//       tvc: CollectionTvc,
//       workchain: 0,
//       publicKey: senderPublicKey,
//       initParams: {
//         nonce_: (Math.random() * 6400) | 0,
//       },
//     };

//     // Get the expected contract address
//     const expectedAddress: Address = await provider.getExpectedAddress(
//       collectionAbi,
//       deployParams
//     );

//     // Get the state init
//     const stateInit: ProviderApiResponse<"getExpectedAddress"> =
//       await provider.getStateInit(collectionAbi, deployParams);
//     stateInit.stateInit;

//     // Send the coins to the calculated address
//     await provider.sendMessage({
//       sender: providerAddress,
//       recipient: expectedAddress,
//       amount: String(2 * 10 ** 9),
//       bounce: false, // it's important to set this param to keep the evers in the contract
//       stateInit: stateInit.stateInit,
//     });

//     // Create a contract instance
//     const collectionContract: Contract<FactorySource["CollectionWithRoyalty"]> =
//       new provider.Contract(collectionAbi, expectedAddress);

//     // Call the contract constructor
//     const { transaction: deployRes } = await collectionContract.methods
//       .constructor({
//         codeNft: nftCode,
//         owner: providerAddress,
//         json: json,
//         codeIndex: indexCode,
//         codeIndexBasis: indexBasisCode,
//         remainOnNft: String(2 * 10 ** 9),
//       })
//       .sendExternal({
//         stateInit: stateInit.stateInit,
//         publicKey: deployParams.publicKey!,
//       });

//     // checking if the token root is deployed successfully by calling its name method
//     const totalSupply: string = (
//       await collectionContract.methods.totalSupply({ answerId: 0 }).call()
//     ).count;

//     if (totalSupply == "0") {
//       toast("Collection deployed successfully", 1);

//       return `TIP4_1 collection deployed to ${expectedAddress.toString()}`;
//     } else {
//       toast("Collection deployment failed", 0);

//       return `TIP4_1 collection deployment failed ! ${
//         (deployRes.exitCode, deployRes.resultCode)
//       }`;
//     }
//   } catch (err: any) {
//     toast(err.message, 0);

//     return err.message;
//   }
// }
// Import the following libraries
import {
  Address,
  GetExpectedAddressParams,
  Contract,
  ProviderApiResponse,
  FullContractState,
  ProviderRpcClient,
  Transaction,
} from "everscale-inpage-provider";

import { factorySource, FactorySource } from "../build/factorySource";
import { useProviderInfo } from "./helpers/useProviders";

// Prepare the nft json metadata
const collectionJsonMetadata: string = JSON.stringify({
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

export async function deployBaseCollection() {
  try {
    // Fetching the provider info from the module we made in the perquisites section
    const [provider, providerAddress]: [ProviderRpcClient, Address] =
      await useProviderInfo();

    // Storing the CollectionWithRoyalty contract abi
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

    /**
      Fetching and storing the tvc and calculating the the codes of the mentioned contracts.
      @notice The replace() function is utilized to avoid any line breaks because of the back slashes in the .base64(tvc) files
    */

    // Fetching the tvc files from build folder that we provided for the project by copying it from our locklift project.
    const collectionTvc: string = await (
      await fetch("/src/build/CollectionWithRoyalty.base64")
    ).text();
    const nftTvc: string = (
      await (await fetch("/src/build/NftWithRoyalty.base64")).text()
    ).replace(/\r?\n|\r/g, "");
    const indexTvc: string = (
      await (await fetch("/src/build/Index.base64")).text()
    ).replace(/\r?\n|\r/g, "");
    const indexBasisTvc: string = (
      await (await fetch("/src/build/IndexBasis.base64")).text()
    ).replace(/\r?\n|\r/g, "");

    // Calculating the codes of the contracts.
    const nftCode: string = (await provider.splitTvc(nftTvc)).code!;
    const indexCode: string = (await provider.splitTvc(indexTvc)).code!;
    const indexBasisCode: string = (await provider.splitTvc(indexBasisTvc))
      .code!;

    /**
     * Preparing deploy params to build the state init with the contract abi
     */
    const deployParams: DeployParams<FactorySource["CollectionWithRoyalty"]> = {
      tvc: collectionTvc,
      workchain: 0,
      publicKey: senderPublicKey,
      initParams: {
        nonce_: (Math.random() * 6400) | 0,
      },
    };

    // Get the expected contract address
    const collectionExpectedAddress: Address =
      await provider.getExpectedAddress(collectionAbi, deployParams);

    // Get the state init
    const stateInit: ProviderApiResponse<"getExpectedAddress"> =
      await provider.getStateInit(collectionAbi, deployParams);
    stateInit.stateInit;

    // Send the coins to the calculated address
    // await provider.sendMessage({
    //   sender: providerAddress,
    //   recipient: collectionExpectedAddress,
    //   amount: String(2 * 10 ** 9),
    //   bounce: false, // it's important to set this param to keep the evers in the contract
    //   stateInit: stateInit.stateInit,
    // });

    // Create a contract instance, notice at this stage the collection contract is in the "uninit" status.
    const collectionContract: Contract<FactorySource["CollectionWithRoyalty"]> =
      new provider.Contract(
        collectionAbi,
        new Address(
          "0:9acb06f2fb00439fa640f75fbe2c5c8782b5ab831508b96ea0788acbe0e36725"
        )
      );

    // Calling the contracts constructor and changing its status from "uninit" to "active"
    // const { transaction: deployRes } = await collectionContract.methods
    //   .constructor({
    //     codeNft: nftCode,
    //     owner: providerAddress,
    //     json: collectionJsonMetadata,
    //     codeIndex: indexCode,
    //     codeIndexBasis: indexBasisCode,
    //     remainOnNft: String(2 * 10 ** 9),
    //   })
    //   .sendExternal({
    //     stateInit: stateInit.stateInit,
    //     publicKey: deployParams.publicKey!,
    //   });

    // checking if the collection contract is deployed by fetching its "totalSupply", must be zero.
    const totalSupply: string = (
      await collectionContract.methods.totalSupply({ answerId: 0 }).call()
    ).count;

    // if (totalSupply == "0") {
    //   console.log(
    //     `Collection deployed to ${collectionExpectedAddress.toString()}`
    //   );
    // } else {
    //   console.log(
    //     `Collection deployment failed ! ${
    //       (deployRes.exitCode, deployRes.resultCode)
    //     }`
    //   );
    // }

    // Preparing the json metadata object
    const nftJsonMetadata: string = JSON.stringify({
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

    // The address of the new owner of the nft
    const nftOwner: Address = providerAddress;

    // Defining an interface for the royalty information
    interface IRoyaltyStructure {
      numerator: string | number;
      denominator: string | number;
      receiver: Address;
    }

    // Preparing the royalty information
    const royalty: IRoyaltyStructure = {
      numerator: 10,
      denominator: 100,
      receiver: nftOwner,
    };

    // // Minting the nft
    // const mintRes: Transaction = await collectionContract.methods
    //   .mintNft({
    //     _owner: nftOwner,
    //     _json: nftJsonMetadata,
    //     _royalty: royalty,
    //   })
    //   .send({
    //     from: providerAddress,
    //     amount: String(3 * 10 ** 9),
    //     bounce: true,
    //   });

    // const nftAddress: Address = (
    //   await collectionContract.methods
    //     .nftAddress({
    //       answerId: 0,
    //       id: totalSupply,
    //     })
    //     .call()
    // ).nft;

    // // Fetching the newly minted nft contract
    const nftContract: Contract<FactorySource["NftWithRoyalty"]> =
      new provider.Contract(
        factorySource["NftWithRoyalty"],
        new Address(
          "0:f166a876974a3152ba79697ad4467f42c10f81e64df295334618e232cbc1e009"
        )
      );

    // // Fetching the newly minted nft data to validate its minting process.
    // const nftContractData = await nftContract.methods
    //   .getInfo({ answerId: 0 })
    //   .call();

    // // Ensuring that the nft is minted correctly and contains the expected info.
    // if (
    //   nftContractData.collection.toString() ==
    //   collectionExpectedAddress.toString()
    // ) {
    //   console.log(
    //     `Nft number ${nftContractData.id} deployed to ${nftAddress.toString()}`
    //   );
    // } else {
    //   console.log(
    //     `Nft deployment failed ! ${(mintRes.exitCode, mintRes.resultCode)}`
    //   );
    // }
    // -----------------------------------
    /*
        THe collection address prepared below helps us with finding all of the nfts owned by the user.
        If you desire to find the nfts owned by the user from a specific collection replace the collection address with the zero address
    */

    // const collectionAddress: Address = new Address(
    //   "0:0000000000000000000000000000000000000000000000000000000000000000"
    // );

    // // Creating an array of the nft addresses in string, we will add the found nft addresses to it later.
    // let nfts: string[] = [];

    // // Building the salt cell for Index contract, we will salt the Index contracts code with it.
    // const indexSaltCell = await provider.packIntoCell({
    //   data: {
    //     name: "nft",
    //     collection: collectionAddress,
    //     owner: providerAddress,
    //   },
    //   structure: [
    //     { name: "name", type: "string" },
    //     { name: "collection", type: "address" },
    //     { name: "owner", type: "address" },
    //   ] as const,
    //   abiVersion: "1.0",
    // });

    // // Salting the Index's contract code
    // const indexSaltedCode = await provider.setCodeSalt({
    //   code: indexCode,
    //   salt: indexSaltCell.boc,
    // });

    // // Calculating the Index's contract code hash using the salted code
    // const indexCodeHash = await provider.getBocHash(indexSaltedCode.code);

    // // Fetching the Index contracts that has the same code hash as the one we prepared.
    // const indexContracts = (
    //   await provider.getAccountsByCodeHash({
    //     codeHash: indexCodeHash,
    //   })
    // ).accounts;

    // // Iterating over the fetched Index contracts, making an instance from each and pushing the related nft address as a string to the nfts array.
    // for (const index of indexContracts) {
    //   console.log(index);
    //   const tempIndex: Contract<FactorySource["Index"]> = new provider.Contract(
    //     factorySource.Index,
    //     index
    //   );
    //   nfts.push(
    //     (await tempIndex.methods.getInfo({ answerId: 0 }).call()).nft.toString()
    //   );
    // }

    // if (nfts.length > 0) {
    //   console.log(`Found ${nfts.length} nfts: ${nfts}`);
    // } else {
    //   console.log(`Found no nfts`);
    // }
    // Preparing the nft's new owner address
    // const receiverAddress: Address = new Address(
    //   "0:c23b6af8f655a50cd1f16e88ca7245e99790d159f7729df92da869934a833558"
    // );

    // // Transferring the nft
    // await nftContract.methods
    //   .transfer({
    //     to: receiverAddress,
    //     sendGasTo: providerAddress,
    //     callbacks: [],
    //   })
    //   .send({
    //     from: providerAddress,
    //     amount: String(2 * 10 ** 9),
    //     bounce: true,
    //   });

    // // fetching the nft contract data
    // const nftContractData = await nftContract.methods
    //   .getInfo({ answerId: 0 })
    //   .call();

    // // Validating the transfer operation
    // if (nftContractData.owner.toString() == receiverAddress.toString()) {
    //   console.log`Nft number ${nftContractData.id} transferred to ${receiverAddress}`;
    // } else {
    //   console.log("Transferring Nft failed");
    // }
    // Burning the nft
    // Burning the nft
    const burnRes: Transaction = await nftContract.methods
      .burn({
        sendGasTo: providerAddress,
        callbackTo: new Address(
          "0:0000000000000000000000000000000000000000000000000000000000000000"
        ),
        callbackPayload: "",
      })
      .send({
        from: providerAddress,
        amount: String(2 * 10 ** 9),
        bounce: true,
      });
  } catch (err: any) {
    console.log(err.message);
  }
}
