import { Migration } from "./migration";

const migration = new Migration();
const BigNumber = require("bignumber.js");
const fs = require("fs");
const prompts = require("prompts");

export type AddressN = `0:${string}`;
export const isValidEverAddress = (address: string): address is AddressN =>
  /^(?:-1|0):[0-9a-fA-F]{64}$/.test(address);
let array_json: any;

async function main() {
  const signer = await locklift.keystore.getSigner("0");
  const account = await migration.loadAccount("Account1");

  const response = await prompts([
    {
      type: "text",
      name: "owner",
      message: "Get Collection Owner Address (default " + account.address + ")",
      validate: (value: any) =>
        isValidEverAddress(value) || value === ""
          ? true
          : "Invalid Everscale address",
    },
  ]);

  const data = fs.readFileSync("metadata-template.json", "utf8");
  if (data) array_json = JSON.parse(data);

  const requiredGas = new BigNumber(array_json.length)
    .times(3.4)
    .plus(5)
    .shiftedBy(9);
  const balanceStart = await locklift.provider.getBalance(account.address);

  if (requiredGas.gt(balanceStart)) {
    throw Error(
      "NOT ENOUGH BALANCE ON " +
        account.address +
        ". REQUIRES: " +
        requiredGas.shiftedBy(-9).toString() +
        " EVER"
    );
  }

  const Nft = (await locklift.factory.getContractArtifacts("NftUpgradable"));
  const Index = (await locklift.factory.getContractArtifacts("Index"));
  const IndexBasis = (await locklift.factory.getContractArtifacts("IndexBasis"));
  const Platform = (await locklift.factory.getContractArtifacts("Platform"));

  console.log("Start deploy collection");

  const { contract: collection, tx } = await locklift.factory.deployContract({
    contract: "CollectionWithUpgradableNft",
    publicKey: signer?.publicKey as string,
    constructorParams: {
      codeNft: Nft.code,
      codePlatform: Nft.code,
      codeIndex: Index.code,
      codeIndexBasis: IndexBasis.code,
      owner: account.address,
      remainOnNft: locklift.utils.toNano(0.2),
      json: JSON.stringify(array_json.collection),
    },
    initParams: {
      nonce_: locklift.utils.getRandomNonce(),
    },
    value: locklift.utils.toNano(4),
  });

  // const collection = (await locklift.factory.getDeployedContract('Collection', new Address('0:432da1db5a47e400ab62570938ec95310610fa483483b3fd7fa25db98cd144e0')));
  console.log("Collection", collection.address);
  migration.store(collection, "Collection");

  if (array_json.nfts) {
    for (const element of array_json.nfts) {
      console.log(`Mint ${element.name}`);
      let item = {
        type: "Basic NFT",
        name: element.name,
        description: element.description,
        preview: {
          source: element.preview_url,
          mimetype: element.mimetype_preview,
        },
        files: [
          {
            source: element.url,
            mimetype: element.mimetype,
          },
        ],
        external_url: element.external_url,
      };

      await collection.methods
        .mintNft({
          _owner: element.address != "" ? element.address : account.address,
          _json: JSON.stringify(item),
        })
        .send({
          from: account.address,
          amount: locklift.utils.toNano(5),
        });

      //console.log(` Tx: ${tx.transaction.id}`)
    }
  }

  if (response.owner) {
    console.log(`Transfer ownership for collection`);
    await collection.methods
      .transferOwnership({
        newOwner: response.owner,
      })
      .send({
        from: account.address,
        amount: locklift.utils.toNano(1),
      });
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
