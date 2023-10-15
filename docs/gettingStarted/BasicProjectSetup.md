# Setup of TIP-4 Contracts in a Project

This guide will walk you through the process of setting up a project with TIP-4 contracts.
Although the TIP4 standard already has couple of implementations such as [itgoldio](https://github.com/itgoldio/everscale-tip) or [grandbazar](https://github.com/grandbazar-io/everscale-tip4-contracts) implementations, we prefer to implement the TIP4 `BaseCollection` and `BaseNft` contracts ourselves and understand what happens under the hood.

## Prerequisites
First, make sure you have the nodeJs and npm installed on your machine.

And it will be very good if you are already familiar with the basics of [Everscale-solidity](https://github.com/ever-guild/ever-solidity).

## Step 1: Create a New Project Directory

First, let's create a new directory for our project. We'll call it "TIP4Implementation", but you can name it anything you want.

```shell
mkdir TIP4Implementation
cd TIP4Implementation
```

## Step 2: Initialize a Locklift Project

Locklift is a tool that simplifies the development and management of smart contracts in the nodejs environment. We can initialize a locklift project in our new directory. This command will also install locklift if it's not already installed.

``` shell
npx locklift init
```
<ImgContainer src= '/llOutput.png' width="100%" altText="locklift initialization output" />

We should get such a project structure:

<ImgContainer src= '/llStructureTip4.png' width="70%" altText="locklift structure after initialization" />

## Step 3: Install Contract Packages

Next, we'll install the `@broxus/tip4` and the `@broxus/contracts` packages. `@broxus/tip4` contracts represent non-fungible tokens standard contracts for the TVM based networks, and `@broxus/contracts`provides smart contract interfaces.

```` shell
npm i @broxus/contracts @broxus/tip4
````

And that's it! You've set up a project with TIP4 contracts and prepared it for TIP4 implementation integration.

::: tip
You can also refer to below provided links for more guidance.

https://www.youtube.com/watch?v=NiTSfDwNwg0

https://docs.locklift.io/
:::

<script lang="ts" >
import { defineComponent, ref, onMounted } from "vue";
import ImgContainer from "../../.vitepress/theme/components/shared/BKDImgContainer.vue"

export default defineComponent({
  name: "Diagrams",
  components :{
    ImgContainer
  },
  setup() {
    return {
    };
  },
});

</script>