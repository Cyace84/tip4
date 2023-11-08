# Transferring Nfts

<div class="deployToken">

In this section, we will learn how to use the  `Index`  contract to transfer non-fungible tokens (NFTs) from one account to another. This is a fundamental concept of the standard, and it involves changing the ownership of the NFT.

The following steps outline the process of transferring NFTs:

1. Destruct the two index contracts associated with the NFT before the transfer. These contracts will be redeployed with the new owner data as the salt of their code hash.

2. Update the ownership information of the NFT to reflect the new owner.

## Step 1: Write Transfer Script

<span  :class="LLdis"  >

The code sample below uses the locklift tool and the previously written script to perform the NFT transferring operation.

Add the following lines of code to the [previously written script](./finding-nft.md#step-1-write-searching-script) in the finding NFts by indexes section.

::: info
Before we start to write our scripts we need to make sure that there is a file named `04-transfer-nft.ts` in the `script` folder in the project root.
:::

</span>

<span :class="EIPdis"  >

Utilize the code sample below to transfer the NFTs using the `everscale-inpage-provider` tool.

add the following lines of code to the [previously written script](./finding-nft.md#step-1-write-searching-script) in the finding NFts by indexes section.

</span>

<div @click="codeBlockSwitchHandler" >

::: code-group

```` typescript [locklift]

  // Crating another signer in order to perform the transferring nft from one account to another
  const signerBob: Signer = (await locklift.keystore.getSigner("0"))!;

  // uncomment if deploying a new account
  // const { contract: BobAccount } = await locklift.factory.deployContract({
  //   contract: "Account",
  //   publicKey: signerBob.publicKey,
  //   constructorParams: {},
  //   initParams: { _randomNonce: locklift.utils.getRandomNonce() },
  //   value: locklift.utils.toNano(20),
  // });


  // Fetching the owner of the nft before transferring to be able to validate the transfer process.
  const newOldOwner: Address = (await nftContract.methods.getInfo({ answerId: 0 }).call()).owner;
  console.log("Nft old owner: ", newOldOwner.toString());

  // Transferring the nft
  await nftContract.methods
    .transfer({
      to: BobAccount.address,
      sendGasTo: account.address,
      callbacks: [],
    })
    .send({
      from: account.address,
      amount: locklift.utils.toNano(2),
      bounce: true,
    });

  // Fetching the new owner of the nft to validate the transfer operation
  const newNftOwner: Address = (await nftContract.methods.getInfo({ answerId: 0 }).call()).owner;
  console.log("Nft new owner: ", newNftOwner.toString());

````

````typescript [everscale-inpage-provider]

// Preparing the nft's new owner address
const receiverAddress: Address = new Address("<RECEIVER_ADDRESS>");

// Transferring the nft
await nftContract.methods
      .transfer({
        to: receiverAddress,
        sendGasTo: providerAddress,
        callbacks: [],
      })
      .send({
        from: providerAddress,
        amount: String(2 * 10 ** 9),
        bounce: true,
      });

    // fetching the nft contract data
    const nftContractData = await nftContract.methods
      .getInfo({ answerId: 0 })
      .call();

    // Validating the transfer operation
    if (nftContractData.owner.toString() == receiverAddress.toString()) {
      console.log `Nft number ${nftContractData.id} transferred to ${receiverAddress}`;
    } else {
      console.log("Transferring Nft failed");
    }
````

:::

</div>


<div class="action">

## Step 2: Transfer the NFT

<div :class="llAction">

Use this command to find the nfts using indexing:

```shell
npx locklift run -s ./scripts/03-find-nft-by-index.ts
```
<ImgContainer src= '/transferNft.png' width="100%" altText="deployTip3Output" />

Congratulations, you have could find the your owned nfts using the indexing functionality 🎉

</div>

<div :class="eipAction" >


<p style="margin-bottom: 0;">Nft Address</p>

<input ref="actionNftAddress" type="text" class="action Ain" />

<p style="margin-bottom: 0;">Receiver Address</p>

<input ref="actionReceiverAddress" type="text" class="action Ain" />

<button @click="_transferNft" class="deployTokenBut" > Transfer Nft </button>

<p id="output-p" :class="EIPdis"><loading :text="loadingText"/></p>

</div>

</div>

</div>

<script lang="ts" >

import { defineComponent, ref, onMounted } from "vue";
import {toast} from "/src/helpers/toast";
import ImgContainer from "../../../.vitepress/theme/components/shared/BKDImgContainer.vue"
import loading from "../../../.vitepress/theme/components/shared/BKDLoading.vue"
import { transferNft } from "../../scripts/transferNft";

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



async function _transferNft(){
        this.loadingText = ""
        if (
            this.$refs.actionNftAddress.value == ''

        ){
            toast("Nft address field is required !", 0)
            this.loadingText = "Failed"
            return
        }
        if (
            this.$refs.actionReceiverAddress.value == ''

        ){
            toast("Receiver address field is required !", 0)
            this.loadingText = "Failed"
            return
        }
        let  deployTokenRes = await transferNft(
            this.$refs.actionNftAddress.value,
            this.$refs.actionReceiverAddress.value
        )

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
        _transferNft,
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
  background-color: var(--vp-c-brand);
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