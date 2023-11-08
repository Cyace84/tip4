import { ProviderRpcClient, Address } from "everscale-inpage-provider";

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
