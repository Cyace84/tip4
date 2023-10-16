# Prerequisites

## Packages

In order to perform the operations mentioned in this documentation using  [`everscale-inpage-provider`](https://github.com/broxus/everscale-inpage-provider) , the target contracts artifacts, including the contract tvc and code, are required. These artifacts can be obtained using the `locklift build` command, which generates the necessary files which we can provide them by simply copying and pasting the these required files from the build folder as we generated them earlier in [lockliftConfigSetup](/src/pages/gettingStarted/lockliftConfigSetting.md#step-3-build-the-artifacts).

::: tip

in the everscale-inpage-provider code samples provided in next sections, the contract artifacts are imported from build folder, we must make this folder and copy ans paste the the previously mentioned artifacts in this folder.

:::


The necessary npm packages are as follows:

-  `everscale-inpage-provider`
-  `everscale-standalone-client`

::: info
Here is the propose of using the mentioned packages in our scripts:

- `everscale-inpage-provider` is used to interact with blockchain in Dapps.
- `everscale-standalone-client` Facilitates usage of the Accounts when interacting with them.
:::


To install these packages, run the following command in your shell:

```` shell
npm install --save-dev everscale-inpage-provider everscale-standalone-client
````

::: warning
The following steps are only required when building Dapps and using decentralized wallets. If you are using **locklift** to make transactions, you can skip this step.
:::

## Provider

The  `everscale-inpage-provider`  is used as a provider for TVM based blockchains such as [Venom](https://venom.foundation/) and [Everscale](https://everscale.network/). Follow the steps below to initialize and use  `everscale-inpage-provider`  in your scripts.

You can also refer to the [everscale-inpage-provider Docs](https://provider-docs.broxus.com/guides/deploy.html#deploy-a-contract) for detailed instructions.

### Step 1: Create the module

Create a file named `useProvider.ts`.

### Step 2: Add Scripts

Add the following script to the file you just made:

````typescript
import { ProviderRpcClient, Address } from "everscale-inpage-provider";

import { useProvider } from "../../src/providers/useProvider";
/**
 * Fetches the data about the EVER Wallet
 * @returns Either the Tvm provider, Tvm wallet address or undefined
 */
export async function useProviderInfo(): Promise<[ProviderRpcClient, Address]> {
  try {
    // Initialize the provider
    const provider: ProviderRpcClient = new ProviderRpcClient();

    // Make sure the provider is initialized.
    await provider.ensureInitialized();

    // Request permissions from the user to execute API
    await provider.requestPermissions({
      permissions: ["basic", "accountInteraction"],
    });

    // setting the ever sender address
    const providerAddress: Address = (await provider.getProviderState())
      .permissions.accountInteraction!.address;

    return [provider, providerAddress];
  } catch (e: any) {
    throw new Error(e.message);
  }
}

````

From now we can use the provider object and the provider address in our scripts by just simply importing and initiating this function.

::: tip
You can also refer to the Documentation of the everscale-inpage-provider.

https://provider-docs.broxus.com/

:::