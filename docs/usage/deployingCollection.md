# Deploying Collection

<div class="deployToken">

In this section, we will explore the process of deploying the  `base collection`  contract. As explained earlier in the [Base Collection](../specifications/baseCollection.md) section, the base collection contract inherits from other TIP4 Collection contracts and provides all the functionalities of the inherited contracts in one. We utilize the collection contracts of the following parts of the standard to deploy the base collection contract:

- [TIP4_1](../specifications/41.md)
- [TIP4_2](../specifications/42.md)
- [TIP4_3](../specifications/43.md)
- [TIP4_royalty](../specifications/royalty.md)

The mentioned collection contracts will provide us with the base functionality of the existing NFT standards, along with an additional one, which is [ `Indexing` ](../specifications/43.md). Follow the steps below to learn how to deploy the base collection contract:

## Step 1: Prepare the Contracts

### Nft Contract

The base NFT contract will inherit from other parts of the standard NFT contracts. It must implement the burning logic and override the functions that handle index contract deployment or destruction. The code below demonstrates the implementation of the base NFT contract with these explanations.

<details>
<summary> show code</summary>

````solidity
pragma ever-solidity >= 0.61.2;

pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;

import '@broxus/tip4/contracts/TIP4_2/TIP4_2Nft.tsol';
import '@broxus/tip4/contracts/TIP4_3/TIP4_3Nft.tsol';
import '@broxus/tip4/contracts/TIP4_royalty/TIP4_royaltyNft.tsol';
import '@broxus/tip4/contracts/TIP4_royalty/structures/IRoyaltyStructure.tsol';
import "@broxus/tip4/contracts/interfaces/IBurnableCollection.tsol";


contract Nft is TIP4_2Nft, TIP4_3Nft, TIP4_royaltyNft {

    constructor(
        address owner,
        address sendGasTo,
        uint128 remainOnNft,
        string json,
        Royalty royalty,
        uint128 indexDeployValue,
        uint128 indexDestroyValue,
        TvmCell codeIndex
    ) TIP4_1Nft (
        owner,
        sendGasTo,
        remainOnNft
    ) TIP4_2Nft (
        json
    ) TIP4_3Nft (
        indexDeployValue,
        indexDestroyValue   ,
        codeIndex
    ) TIP4_royaltyNft (
        royalty
    ) public {
        tvm.accept();
    }

    function _beforeTransfer(
        address to,
        address sendGasTo,
        mapping(address => CallbackParams) callbacks
    ) internal virtual override(TIP4_1Nft, TIP4_3Nft) {
        TIP4_3Nft._destructIndex(sendGasTo);
    }

    function _afterTransfer(
        address to,
        address sendGasTo,
        mapping(address => CallbackParams) callbacks
    ) internal virtual override(TIP4_1Nft, TIP4_3Nft) {
        TIP4_3Nft._deployIndex();
    }

    function _beforeChangeOwner(
        address oldOwner,
        address newOwner,
        address sendGasTo,
        mapping(address => CallbackParams) callbacks
    ) internal virtual override(TIP4_1Nft, TIP4_3Nft) {
        TIP4_3Nft._destructIndex(sendGasTo);
    }

    function _afterChangeOwner(
        address oldOwner,
        address newOwner,
        address sendGasTo,
        mapping(address => CallbackParams) callbacks
    ) internal virtual override(TIP4_1Nft, TIP4_3Nft) {
        TIP4_3Nft._deployIndex();
    }

    function burn(
        address sendGasTo,
        address callbackTo,
        TvmCell callbackPayload
    ) external virtual onlyManager {
        tvm.accept();
        IBurnableCollection(_collection).acceptNftBurn{
            value: 0,
            flag: 128 + 32,
            bounce: false
        }(
            _id,
            _owner,
            _manager,
            sendGasTo,
            callbackTo,
            callbackPayload
        );
    }
}

````

</details>


### Collection Contract

As mentioned earlier, the base collection contract also inherits from other parts of the standard collection contracts. The base collection contract must import them and feed their constructors. It also must manage the process of deploying the NFT contract as well.

Additionally, some functions of the other collection contracts must be re-implemented and overwritten by the base collection. The contract code below will provide us with the expected functionality:

<details>
<summary> show code</summary>

```` solidity
pragma ever-solidity >= 0.61.2;

pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;


import '@broxus/tip4/contracts/access/OwnableExternal.tsol';
import '@broxus/tip4/contracts/TIP4_2/TIP4_2Collection.tsol';
import '@broxus/tip4/contracts/TIP4_3/TIP4_3Collection.tsol';
import '@broxus/tip4/contracts/TIP4_royalty/structures/IRoyaltyStructure.tsol';
import './Nft.tsol';

contract Collection is TIP4_2Collection, TIP4_3Collection, OwnableExternal, IRoyaltyStructure {

    uint32 static _randomNonce;

    /**
    * Errors
    **/

    uint8 constant sender_is_not_owner = 100;
    uint8 constant value_is_less_than_required = 101;

    /// _remainOnNft - the number of crystals that will remain after the entire mint
    /// process is completed on the Nft contract
    uint128 _remainOnNft = 0.3 ever;

    constructor(
        TvmCell codeNft,
        uint256 ownerPubkey,
        string json,
        TvmCell codeIndex,
        TvmCell codeIndexBasis
    ) OwnableExternal (
        ownerPubkey
    ) TIP4_1Collection (
        codeNft
    ) TIP4_2Collection (
        json
    ) TIP4_3Collection (
        codeIndex,
        codeIndexBasis
    ) public {
        tvm.accept();
    }

    function mintNft(string json, Royalty royalty) external virtual {
        require(msg.value > _remainOnNft + 0.1 ever, value_is_less_than_required);
        tvm.rawReserve(0, 4);

        uint256 id = uint256(_totalSupply);
        _totalSupply++;
        TvmCell codeNft = _buildNftCode(address(this));
        TvmCell stateNft = _buildNftState(codeNft, id);
        address nftAddr = new Nft{
            stateInit: stateNft,
            value: 0,
            flag: 128
        }(
            msg.sender,
            msg.sender,
            _remainOnNft,
            json,
            royalty,
            _indexDeployValue,
            _indexDestroyValue,
            _codeIndex
        );

        emit NftCreated(
            id,
            nftAddr,
            msg.sender,
            msg.sender,
            msg.sender
        );

    }

    function setRemainOnNft(uint128 remainOnNft) external virtual {
        require(TIP4_1Collection._isOwner(), sender_is_not_owner);
        _remainOnNft = remainOnNft;
    }

    function _isOwner() internal override onlyOwner returns(bool){
        return true;
    }

    function _buildNftState(
        TvmCell code,
        uint256 id
    ) internal virtual override(TIP4_2Collection, TIP4_3Collection) pure returns (TvmCell) {
        return tvm.buildStateInit({
            contr: Nft,
            varInit: {_id: id},
            code: code
        });
    }

}

````
</details>

### Build the Contracts Artifacts

run the command below into your terminal to build the written contracts artifacts:

````shell

npx locklift build

````

### Store Contracts Code and tvc

In order to deploy a contract using the `everscale-inpage-provider` tool we need the target contracts code and tvc.

Copy the build folder generated by the mentioned commend into the scripts folder of your project that using the `everscale-inpage-provider`.

## Step 2: Write Deployment Script

<span  :class="LLdis"  >

The code sample below written in `TS` will deploy the base collection contract with the help of the `Locklift` tool.

::: info
Before we start to write our scripts we need to make sure that there is a file named `01-deploy-base-collection.ts` in the `script` folder in the project root.
:::

</span>

<span :class="EIPdis"  >

The code sample below is utilized to deploy the base collection contract using `everscale-inpage-provider` tool.

</span>

<div @click="codeBlockSwitchHandler" >

::: code-group

```` typescript [locklift]
// Import the following libraries
import { Account, Signer } from "everscale-standalone-client";
import { Address, Contract, WalletTypes } from "locklift";
import { FactorySource } from "../build/factorySource";

// Prepare the collection json metadata
const collectionJsonMetadata: string = JSON.stringify({
  type: "Basic NFT",
  name: "Revolt Agents",
  description:
    "A curated collection of 10,000 Agents from the Venom blockchain deployed on a mission to take over Web3",
  preview: {
    source: "https://bafybeify5q7od6cthzgxjkdy22qtrxtxzl5hro7rbh3oyg2rxs736eept4.ipfs.w3s.link/images/1.jpeg",
    mimetype: "image/JPEG",
  },
  files: [
    {
      source: "https://bafybeify5q7od6cthzgxjkdy22qtrxtxzl5hro7rbh3oyg2rxs736eept4.ipfs.w3s.link/images/1.jpeg",
      mimetype: "image/JPEG",
    },
  ],
  external_url: "https://venom.network",
});

async function main() {
  // Fetching the signer key pair from locklift.config.ts
  const signer: Signer = (await locklift.keystore.getSigner("0"))!;

  // uncomment if deploying a new account
  //   const { contract: Account } = await locklift.factory.deployContract({
  //     contract: "Account",
  //     publicKey: signer.publicKey,
  //     constructorParams: {},
  //     initParams: { _randomNonce: locklift.utils.getRandomNonce() },
  //     value: locklift.utils.toNano(20),
  //   });

  // Adding an existing SafeMultiSig Account using its address
  const account: Account = await locklift.factory.accounts.addExistingAccount({
    type: WalletTypes.MsigAccount,
    address: new Address("YOUR_ACCOUNT_ADDRESS"), // if deploying new account >> Account.address
    mSigType: "SafeMultisig",
    publicKey: signer.publicKey,
  });

  const indexCode = locklift.factory.getContractArtifacts("Index").code;
  const indexBasisCode = locklift.factory.getContractArtifacts("IndexBasis").code;

  const { contract: collectionContract } = await locklift.factory.deployContract({
    contract: "Collection",
    publicKey: signer.publicKey,
    constructorParams: {
      codeNft: locklift.factory.getContractArtifacts("Nft").code,
      ownerPubkey: `0x${signer.publicKey}`,
      json: collectionJsonMetadata,
      codeIndex: indexCode,
      codeIndexBasis: indexBasisCode,
    },
    initParams: {
      _randomNonce: locklift.utils.getRandomNonce(),
    },
    value: locklift.utils.toNano(10),
  });

  console.log(`collection deployed to: ${collectionContract.address.toString()}`);
}
main()
  .then(res => {
    process.exit(0);
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });

````

````typescript [everscale-inpage-provider]

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

import { factorySource, FactorySource } from "./artifacts/build/factorySource"; // copied build folder
import { useProviderInfo } from "./helpers/useProviders";

const collectionJsonMetadata: string = JSON.stringify({
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

export async function main(
  json: string = collectionJsonMetadata
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
      await fetch("/scripts/artifacts/build/Collection.base64")
    ).text();
    const nftTvc: string = await (
      await fetch("/scripts/artifacts/build/Nft.base64")
    ).text();
    const indexTvc: string = await (
      await fetch("/scripts/artifacts/build/Index.base64")
    ).text();
    const indexBasisTvc: string = await (
      await fetch("/scripts/artifacts/build/IndexBasis.base64")
    ).text();
    const nftCode: string = (await provider.splitTvc(nftTvc)).code!;
    const indexCode: string = (await provider.splitTvc(indexTvc)).code!;
    const indexBasisCode: string = (await provider.splitTvc(indexBasisTvc)).code!;

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
      console.log( `TIP4_1 collection deployed to ${expectedAddress.toString()}`);
    } else {
      throw new Error( `TIP4_1 collection deployment failed ! ${
        (deployRes.exitCode, deployRes.resultCode)
      }`);
    }
  } catch (err: any) {
    throw new Error(err.message);
  }
}

````

:::

</div>


<div class="action">

## Step 3: Deploy the Base Collection

<div :class="llAction">

Use this command to deploy base collection contract:

```shell
npx locklift run -s ./scripts/01-deploy-base-collection.ts -n local
```
<ImgContainer src= '/deployingBaseCollection.png' width="100%" altText="deployTip3Output" />

Congratulations, you have successfully deployed collection contract using the TIP4 standard 🎉

</div>

<div :class="eipAction" >

<label class="container collectionMetaCheck"> Use default metadata
<input class="checkboxInput" ref="actionCollectionMetaDefault" type="checkbox" @click="defaultMetaHandler" checked="true">
<span class="checkmark"></span>
</label>

<textarea style="resize:none;" ref="actionCollectionMeta" :class="collMeta" type="text" placeholder="collection json metadata"></textarea>

<button @click="deployCollection" class="deployTokenBut" >deploy collection</button>

<p id="output-p" :class="EIPdis"><loading :text="loadingText"/></p>

</div>

</div>

</div>

<script lang="ts" >
import { defineComponent, ref, onMounted } from "vue";
import {toast} from "/src/helpers/toast";
import ImgContainer from "../../.vitepress/theme/components/shared/BKDImgContainer.vue"
import loading from "../../.vitepress/theme/components/shared/BKDLoading.vue"
import {deployBaseCollection} from "../../scripts/deployingBaseCollection";
import { IRoyaltyStructure } from "../../scripts/types";

export default defineComponent({
  name: "deployToken",
      components :{
    ImgContainer,
    loading
  },
  data(){
    return{
        LLdis: "cbShow",
        EIPdis: "cbHide",
        llAction: "llAction cbShow",
        eipAction: "eipAction cbHide",
        collMeta: "cbHide",
        nftMeta: "cbHide",
        loadingText: " ",
        loadingText2: " "
        }
  },
  setup() {

  async function defaultMetaHandler(e){
        if(e.target.checked){

        if(e.target.parentElement.className.includes("collectionMetaCheck"))
         {
            this.collMeta = "cbHide"
         } else if(e.target.parentElement.className.includes("nftMetaCheck"))
         {
            this.nftMeta = "cbHide"
         }
        }else{

        if(e.target.parentElement.className.includes("collectionMetaCheck"))
         {
            this.collMeta = "action Ain"
         } else if(e.target.parentElement.className.includes("nftMetaCheck"))
         {
            this.nftMeta = "action Ain"
         }
        }

    }
  async function deployCollection(){
        this.loadingText = ""
        if (
            !this.$refs.actionCollectionMetaDefault.checked &&
            this.$refs.actionCollectionMeta.value == ''

        ){
            toast("Collection metadata field is required !", 0)
            this.loadingText = "Failed"
            return
        }
        let deployTokenRes;
        if(this.$refs.actionCollectionMetaDefault.checked){
            deployTokenRes = await deployBaseCollection()

        }else{
            deployTokenRes = await deployBaseCollection(this.$refs.actionCollectionMeta.value)
        }
          // Rendering the output
          deployTokenRes = !deployTokenRes ? "Failed" :  deployTokenRes;
          this.loadingText = deployTokenRes;
  }

  async function codeBlockSwitchHandler(e){
     if(e.target.innerHTML.includes("everscale-inpage-provider")){
        this.LLdis = "cbHide"
        this.EIPdis = "cbShow"
        this.llAction = "llAction cbHide"
        this.eipAction = "eipAction cbShow"
     }else if(e.target.innerHTML.includes("locklift")){
        this.EIPdis = "cbHide"
        this.LLdis = "cbShow"
        this.llAction = "llAction cbShow"
        this.eipAction = "eipAction cbHide"

     }
  }
return {
        defaultMetaHandler,
        deployCollection,
        codeBlockSwitchHandler
    };
  },
});

</script>


<style>

textarea{
 width:100%;
 height: 400px;
}

.action{
    display:inline-block;
}

.actionInName{
    font-size: .9rem;
}

.deployTokenBut, .Ain, details
{
  background-color: var(--vp-c-bg-mute);
  transition: background-color 0.1s;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  font-weight: 600;
  cursor : pointer;
}

details{
    padding : 0 10px 0 10px;
}
.Ain{
    padding-left : 10px;
    margin : 0;
}
.deployTokenBut{
    cursor:pointer;
    padding: 5px 12px;
    display: flex;
    transition: all ease .3s;
}

.deployTokenBut:hover{
      border: 1px solid var(--light-color-ts-class);
}

#output-p{
    /* height: 30px; */
    padding: 2px 10px;
    border-radius: 8px;
    border: 1px solid var(--vp-c-divider);
    }

.cbShow{
    display: block;
}
.cbHide{
    display: none;
}

.eipAction{
    font-weight: 600;
}

* {box-sizing: border-box;}

.container {
  display: flex;
  position: relative;
  margin-bottom: 12px;
  font-size: .9rem;
}

.container .checkboxInput {
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;

}

.checkmark {
  cursor: pointer;
  position: relative;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: var(--vp-c-bg-mute);
  border: 1px solid var(--vp-c-divider);
  border-radius : 8px;
  margin-left: 10px;
}

.container input:checked ~ .checkmark {
  background-color: var(--light-color-ts-class);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.container input:checked ~ .checkmark:after {
  display: block;
}

.container .checkmark:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

</style>