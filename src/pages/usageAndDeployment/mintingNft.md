# Minting Nfts

<div class="deployToken">

This section provides a tutorial on minting NFTs using the base collection that was deployed in the [previous section](./deployingCollection.md). The NFT contract, which was also discussed in the previous section, is the contract that will be minted.

To mint an NFT, we require the relevant JSON object and the associated royalty information. Follow the steps below to learn how to prepare these parameters and mint an NFT through the base collection.

::: info
Please note that the deployable NFT contract inherits from the  `TIP4_3Nft` , resulting in the deployment of two index contracts via the constructor of the Base NFT contract.
:::

## Step 2: Write Minting Script

<span  :class="LLdis"  >

The code sample below utilizes the state of the previously written script in the base collection deployment section and the Locklift tool to provide us with NFT minting functionality

add the following lines of code to the [previously written script](./deployingCollection.md#step-2-write-deployment-script) on deploying the base collection contract section.

::: info
Before we start to write our scripts we need to make sure that there is a file named `02-mint-nft.ts` in the `script` folder in the project root.
:::

</span>

<span :class="EIPdis"  >

The code sample below is utilized to mint the nfts using `everscale-inpage-provider` tool.

add the following lines of code to the [previously written script](./deployingCollection.md#step-2-write-deployment-script) on deploying the base collection contract section.

</span>

<div @click="codeBlockSwitchHandler" >

::: code-group

```` typescript [locklift]

  // Fetching the total supply in order to be aware of the nft id that is going to be deployed
  const totalSupply: string = (await collectionContract.methods.totalSupply({ answerId: 0 }).call()).count;

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

  // Defining the interface for the royalty information
  interface IRoyaltyStructure {
    numerator: string | number;
    denominator: string | number;
    receiver: Address;
  }

  // Preparing the royalty information
  const royalty: IRoyaltyStructure = {
    numerator: 10,
    denominator: 100,
    receiver: account.address,
  };

  // Minting the nft
  await collectionContract.methods
    .mintNft({ json: nftJsonMetadata, royalty: royalty })
    .send({ from: account.address, amount: locklift.utils.toNano(3) });

  // Fetching thw newly minted nft data and making an instance of it
  const nftAddress: Address = (await collectionContract.methods.nftAddress({ answerId: 0, id: totalSupply }).call())
    .nft;
  const nftContract: Contract<FactorySource["Nft"]> = locklift.factory.getDeployedContract("Nft", nftAddress);

  console.log(`Nft number ${totalSupply} minted on: ${nftContract.address.toString()}`);

  // Fetching the nft royalty on 100 USDTs sale price
  const royaltyInfo = await nftContract.methods.royaltyInfo({ answerId: 0, salePrice: 100_000_000 }).call();
  console.log("Nft royalty: ", royaltyInfo);

  // Fetching the metadata info
  const metadata: JSON = JSON.parse((await nftContract.methods.getJson({ answerId: 0 }).call()).json);

  console.log("Nft metadata:", metadata);

````

````typescript [everscale-inpage-provider]

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
  receiver: Address;
}

await collectionContract.methods
      .mintNft({ json: json, royalty: royalty })
      .send({
        from: providerAddress,
        amount: String(3 * 10 ** 9),
        bounce: true,
      });

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


````

:::

</div>


<div class="action">

## Step 3: Mint the NFT

<div :class="llAction">

Use this command to mint an nft:

```shell
npx locklift run -s ./scripts/02-mint-nft.ts -n local
```
<ImgContainer src= '/mintingNft.png' width="100%" altText="deployTip3Output" />

Congratulations, you have successfully deployed collection contract using the TIP4 standard 🎉

</div>

<div :class="eipAction" >

<p class=actionInName style="margin-bottom: 0;">Collection Address</p>

<input ref="actionCollectionAddress" type="text" class="action Ain" />

<p class=actionInName style="margin-bottom: 0;">Royalty Percentage</p>

<input ref="actionRoyaltyPercent" type="number" min="0" max="100" step="0.01" class="action Ain percent" />

<p class=actionInName style="margin-bottom: 0;">Royalty Receiver Address</p>

<input ref="actionRoyaltyReceiverAddress" class="action Ain" type="text"/>

<label class="container nftMetaCheck"> Use default metadata
<input class="checkboxInput" ref="actionNftMetaDefault" type="checkbox" @click="defaultMetaHandler" checked="true">
<span class="checkmark"></span>
</label>

<textarea style="resize:none;" ref="actionNftMeta" :class="collMeta" type="text" placeholder="Nft json metadata"></textarea>

<button @click="deployNft" class="deployTokenBut" >Mint Nft</button>

<p id="output-p" :class="EIPdis"><loading :text="loadingText"/></p>

</div>

</div>

</div>

<script lang="ts" >
import { defineComponent, ref, onMounted } from "vue";
import {toast} from "/src/helpers/toast";
import ImgContainer from "../../../.vitepress/theme/components/shared/BKDImgContainer.vue"
import loading from "../../../.vitepress/theme/components/shared/BKDLoading.vue"
import { mintNft } from "../../scripts/mintingNft";
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
   async function deployNft(){
          this.loadingText = ""
        if (
            this.$refs.actionCollectionAddress.value == ''

        ){
            toast("collection address field is required !", 0)
            this.loadingText = "Failed"
            return
        }
        if (
            !this.$refs.actionNftMetaDefault.checked &&
            this.$refs.actionNftMeta.value == ''

        ){
            toast("Nft metadata field is required !", 0)
            this.loadingText = "Failed"
            return
        }
        if (
            isNaN(Number(this.$refs.actionRoyaltyPercent.value))
        ){
            toast("Royalty percentage field is required !", 0)
            this.loadingText = "Failed"
            return
        }
        if (
            this.$refs.actionRoyaltyReceiverAddress.value == ''

        ){
            toast("Royalty receiver address field is required !", 0)
            this.loadingText = "Failed"
            return
        }
        let deployTokenRes;
        const royalty: IRoyaltyStructure =
        {
            numerator: Number(this.$refs.actionRoyaltyPercent.value),
            denominator: 100,
            receiver: this.$refs.actionRoyaltyReceiverAddress.value
        }
        if(this.$refs.actionNftMetaDefault.checked){
            deployTokenRes = await mintNft(
                this.$refs.actionCollectionAddress.value,
                royalty
            )
        }else{
            deployTokenRes = await mintNft(
                this.$refs.actionCollectionAddress.value,
                this.$refs.actionNftMeta.value,
                royalty
            )
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
        deployNft,
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