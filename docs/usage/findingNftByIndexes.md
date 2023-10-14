# Finding Nft by Indexes

<div class="deployToken">

In this section, we will learn how to use the  `Index`  and  `IndexBasis`  contracts to find the NFT contracts owned by a user. As you already know, indexing helps locate all the NFTs owned by a user across all collections existing in the TVM-based blockchains.

In this tutorial we will learn how to find all of the nfts owned by a user using the `Index` contract functionality.
We also will explore through the process of finding all of the collections using the `IndexBasis` contract functionality.


## How to Find all of the Collection Contracts ?

The collection contracts that are desiring to support the indexing functionality will have a specific code hash which is salted with the word `"nft"`. We can calculate the the code hash of which and send a request to the api endpoint of our relevant blockchain and get the accounts that their code hash is matching with the one we provided.

::: tip

THe apis are probably having a limit on the size of the values returned, for example when using the everscale-inpage-provider or the locklift tool we only get "50" collection contracts as the out put which is sorted by acceding numeric and then alphabetic algorithm, therefor if we are desiring to find all of collection contracts existing on the blockchain we must send the request multiple times

:::


### Searching for All Collections

The following script written in typescript uses the locklift tool to find all of the collection contracts.

make a file name `find-all-collections.ts` in the scripts folder of your locklift project root and copy the following content into it.

````typescript
import { Address, Contract, zeroAddress } from "locklift";
import { FactorySource } from "../build/factorySource";

async function main() {
  // Building the salt cell for IndexBasis
  const indexBasisSaltCell = await locklift.provider.packIntoCell({
    data: {
      name: "nft",
    },
    structure: [{ name: "name", type: "string" }] as const,
    abiVersion: "1.0", // Extremely important to set the abi version
  });

  // Salting the code of the IndexBasis contract
  const indexBasisSaltedCode = await locklift.provider.setCodeSalt({
    code: locklift.factory.getContractArtifacts("IndexBasis").code,
    salt: indexBasisSaltCell.boc,
  });

  // Calculating the code hash of the salted code
  const indexBasisCodeHash = await locklift.provider.getBocHash(indexBasisSaltedCode.code);

  let fetchedCollectionAddresses: string[] = [];
  // Fetching the contracts that has the same code hash as what we built
  let continuation: string | undefined = zeroAddress.toString();
  while (continuation != undefined) {

    const tempIndexBasisContractsBatch = await locklift.provider.getAccountsByCodeHash({
      codeHash: indexBasisCodeHash,
      continuation: continuation,
      limit: 50, // more limit amounts are ignored
    });

    continuation = tempIndexBasisContractsBatch.continuation;

    for (let account in tempIndexBasisContractsBatch.accounts) {
      const tempIndexBasisContract: Contract<FactorySource["IndexBasis"]> = locklift.factory.getDeployedContract(
        "IndexBasis",
        tempIndexBasisContractsBatch.accounts[account],
      );
      fetchedCollectionAddresses.push(
        (await tempIndexBasisContract.methods.getInfo({ answerId: 0 }).call()).collection.toString(),
      );
    }
  }
  // extracting the collections address from the indexBasis contacts
  console.log(fetchedCollectionAddresses);
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


run the following command to find all of the collection contracts:

````shell

npx locklift run -s scripts/find-all-collections.ts -n local

````
## Step 1: Write Searching Script

<span  :class="LLdis"  >

The code sample below utilizes the state of the previously written script in the minting nft's section and the Locklift tool to provide us with the indexing functionality represented by the standard.
It first all of the nft contracts owned by the user and then uses the collection contract address to find the specific nfts related to a collection contract.

Add the following lines of code to the [previously written script](./mintingNft.md#step-2-write-minting-script) on minting the nft's section.

::: info
Before we start to write our scripts we need to make sure that there is a file named `03-find-nft-by-index.ts` in the `script` folder in the project root.
:::

</span>

<span :class="EIPdis"  >

The code sample below is utilized to deploy the base collection contract using `everscale-inpage-provider` tool.

add the following lines of code to the [previously written script](./mintingNft.md#step-2-write-minting-script) on deploying the base collection contract section.

</span>

<div @click="codeBlockSwitchHandler" >

::: code-group

```` typescript [locklift]

  let allNfts: string[] = [];

  // Building the salt cell for IndexBasis
  let indexSaltCell = await locklift.provider.packIntoCell({
    data: {
      name: "nft",
      collection: zeroAddress,
      owner: account.address,
    },
    structure: [
      { name: "name", type: "string" },
      { name: "collection", type: "address" },
      { name: "owner", type: "address" },
    ] as const,
    abiVersion: "1.0",
  });

  // Salting the index contracts code
  let indexSaltedCode = await locklift.provider.setCodeSalt({
    code: indexCode,
    salt: indexSaltCell.boc,
  });

  // Calculating the index contracts code hah using the salted code hash
  let indexCodeHash = await locklift.provider.getBocHash(indexSaltedCode.code);

  let indexContracts = (await locklift.provider.getAccountsByCodeHash({ codeHash: indexCodeHash })).accounts;

  for (let index in indexContracts) {
    let tempIndex = locklift.factory.getDeployedContract("Index", indexContracts[index]);
    allNfts.push((await tempIndex.methods.getInfo({ answerId: 0 }).call()).nft.toString());
  }
  console.log("All of the user's Nft's: ", allNfts);

  // Finding the nfts from one collection
  let NftsFromCollection: string[] = [];

  // Building the salt cell for IndexBasis
  indexSaltCell = await locklift.provider.packIntoCell({
    data: {
      name: "nft",
      collection: collectionContract.address,
      owner: account.address,
    },
    structure: [
      { name: "name", type: "string" },
      { name: "collection", type: "address" },
      { name: "owner", type: "address" },
    ] as const,
    abiVersion: "1.0",
  });

  // Salting the index contracts code
  indexSaltedCode = await locklift.provider.setCodeSalt({
    code: indexCode,
    salt: indexSaltCell.boc,
  });

  // Calculating the index contracts code hah using the salted code hash
  indexCodeHash = await locklift.provider.getBocHash(indexSaltedCode.code);

  indexContracts = (await locklift.provider.getAccountsByCodeHash({ codeHash: indexCodeHash })).accounts;

  indexContracts.forEach(async index => {
    let tempIndex = locklift.factory.getDeployedContract("Index", index);
    NftsFromCollection.push((await tempIndex.methods.getInfo({ answerId: 0 }).call()).nft.toString());
    console.log("Users Nft's from the collection: ", NftsFromCollection);
  });

````

````typescript [everscale-inpage-provider]

    /*
        THe collection address prepared below helps us with finding all fo the nfts owned by the user.
        If you desire to find the nfts owned by the user from a specific collection replace the collection address with the zero address
    */
    const collectionAddress: Address = new Address(
          "0:0000000000000000000000000000000000000000000000000000000000000000"
        );

    let nfts: string[] = [];

    // Building the salt cell for IndexBasis
    const indexSaltCell = await provider.packIntoCell({
      data: {
        name: "nft",
        collection: collectionAddress,
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

    indexContracts.forEach(async (index) => {
      const tempIndex: Contract<FactorySource["Index"]> = new provider.Contract(
        factorySource.Index,
        index
      );
      nfts.push(
        (await tempIndex.methods.getInfo({ answerId: 0 }).call()).nft.toString()
      );
    });

    console.log("every thing passed");
    if (nfts.length > 0) {
      console.log(`Found ${nfts.length} nfts: ${nfts}`);
    } else {
      console.log(`Found no nfts`);
    }

````

:::

</div>


<div class="action">

## Step 2: Find the NFT's

<div :class="llAction">

Use this command to find the nfts using indexing:

```shell
npx locklift run -s ./scripts/03-find-nft-by-index.ts -n local
```
<ImgContainer src= '/findNftByIndex.png' width="100%" altText="deployTip3Output" />

Congratulations, you have could find the your owned nfts using the indexing functionality 🎉

</div>

<div :class="eipAction" >


<label class="container nftMetaCheck"> Search for All Nfts
<input class="checkboxInput" ref="actionSearchForAllCollections" type="checkbox" @click="defaultCollectionAddress" checked="true">
<span class="checkmark"></span>
</label>

<div class="cbHide" ref="collectionAddressContainer" >
<p style="margin-bottom: 0;">Collection Address</p>

<input ref="actionCollectionAddress" type="text" class="action Ain" />

</div>

<button @click="searchForNfts" class="deployTokenBut" >{{findNftButText}}</button>

<p id="output-p" :class="EIPdis"><loading :text="loadingText"/></p>

</div>

</div>

</div>

<script lang="ts" >

import { defineComponent, ref, onMounted } from "vue";
import {toast} from "/src/helpers/toast";
import ImgContainer from "../../.vitepress/theme/components/shared/BKDImgContainer.vue"
import loading from "../../.vitepress/theme/components/shared/BKDLoading.vue"
import { findNfts } from "../../scripts/findNftByIndex";

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
        loadingText2: " ",
        findNftButText: "find Nfts"
        }
  },
  setup() {

  async function defaultCollectionAddress(e){
        if(e.target.checked){
            this.$refs.collectionAddressContainer.className = "cbHide";
            this.findNftButText = "find Nfts";
        }else{
            this.$refs.collectionAddressContainer.className = "cbShow";
            this.findNftButText = "find Nfts from Collection";
        }

    }

async function searchForNfts(){
        this.loadingText = ""
        if (
            this.$refs.actionCollectionAddress.value == '' &&
            !this.$refs.actionSearchForAllCollections.checked

        ){
            toast("Collection address field is required !", 0)
            this.loadingText = "Failed"
            return
        }
        let deployTokenRes = "";
        if(!this.$refs.actionSearchForAllCollections.checked){
            deployTokenRes =  await findNfts(this.$refs.actionCollectionAddress.value);
        }else{
            deployTokenRes = await findNfts();
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
        defaultCollectionAddress,
        searchForNfts,
        codeBlockSwitchHandler
    };
  }
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