import vue from "@vitejs/plugin-vue";

const HELP_URL = "https://t.me/everdev";
const FEEDBACK_URL = "https://t.me/everdev";
const GITHUB_URL = "https://github.com/broxus/tip4";
const NAV = [
  {
    text: "Broxus Docs",
    items: [
      { text: "Home", link: "https://docs.broxus.com" },
      { text: "Inpage Provider", link: "https://provider-docs.broxus.com/" },
      { text: "Locklift", link: "https://docs.locklift.io/" },
      {
        text: "OctusBridge Integration",
        link: "https://integrate.octusbridge.io",
      },
      {
        text: "TIP-4 Api Reference",
        link: "https://tip4-api-reference.netlify.app/",
      },
      {
        text: "TIP-3 Docs",
        link: "https://tip-3-docs-javadyakuza.vercel.app/",
      },
      {
        text: "TIP-4 Docs",
        link: "/",
      },
    ],
  },
  { text: "Feedback", link: FEEDBACK_URL },
  { text: "Community", link: HELP_URL },
];
module.exports = {
  title: "TIP-4 Docs",
  base: "/",

  plugins: [vue()],
  rewrites: {
    "src/pages/index.md": "index.md",
    "src/pages/architecture.md": "architecture.md",

    "src/pages/specification/toc.md": "specification/toc.md",
    "src/pages/specification/collection.md": "specification/collection.md",
    "src/pages/specification/NFT.md": "specification/NFT.md",
    "src/pages/specification/tip4_1.md": "specification/tip4_1.md",
    "src/pages/specification/tip4_2.md": "specification/tip4_2.md",
    "src/pages/specification/tip4_3.md": "specification/tip4_3.md",
    "src/pages/specification/tip4_royalty.md": "specification/tip4_royalty.md",
    "src/pages/specification/tip4_4.md": "specification/tip4_4.md",
    "src/pages/specification/tip4_5.md": "specification/tip4_5.md",
    "src/pages/specification/tip4_6.md": "specification/tip4_6.md",
    "src/pages/specification/tip6.md": "specification/tip6.md",

    "src/pages/gettingStarted/toc.md": "gettingStarted/toc.md",
    "src/pages/gettingStarted/basicProjectSetup.md":
      "gettingStarted/basicProjectSetup.md",
    "src/pages/gettingStarted/lockliftConfigSetup.md":
      "gettingStarted/lockliftConfigSetup.md",
    "src/pages/gettingStarted/localEnvironment.md":
      "gettingStarted/localEnvironment.md",
    "src/pages/gettingStarted/deployAccount.md":
      "gettingStarted/deployAccount.md",

    "src/pages/usageAndDeployment/toc.md": "usageAndDeployment/toc.md",
    "src/pages/usageAndDeployment/prerequisites.md":
      "usageAndDeployment/prerequisites.md",
    "src/pages/usageAndDeployment/deployingCollection.md":
      "usageAndDeployment/deployingCollection.md",
    "src/pages/usageAndDeployment/mintingNft.md":
      "usageAndDeployment/mintingNft.md",
    "src/pages/usageAndDeployment/findingNftByIndexes.md":
      "usageAndDeployment/findingNftByIndexes.md",
    "src/pages/usageAndDeployment/transferringNft.md":
      "usageAndDeployment/transferringNft.md",
    "src/pages/usageAndDeployment/burningNft.md":
      "usageAndDeployment/burningNft.md",
    "src/pages/usageAndDeployment/upgradeableNft.md":
      "usageAndDeployment/upgradeableNft.md",
    "src/pages/apiReferences.md": "apiReferences.md",
    "src/pages/FAQ.md": "FAQ.md",
  },

  themeConfig: {
    search: {
      provider: "local",
    },
    editLink: {
      pattern: "https://github.com/JavadYakuzaa/TIP4-Docs/edit/main/:path",
    },
    nav: NAV,
    sidebar: [
      {
        text: "Introduction",
        collapsable: false,
        link: "/",
      },
      {
        text: "Architecture",
        collapsable: false,
        link: "/architecture.md",
      },
      {
        text: "Specification",
        collapsable: false,
        link: "/specification/toc.md",
        items: [
          {
            text: "Collection",
            collapsable: false,
            link: "/specification/collection.md",
          },
          {
            text: "NFT",
            collapsable: false,
            link: "/specification/NFT.md",
          },
          {
            text: "TIP4-1 Non-Fungible Token",
            collapsable: false,
            link: "/specification/tip4_1.md",
          },
          {
            text: "TIP4-2 NFT Metadata",
            collapsable: false,
            link: "/specification/tip4_2.md",
          },
          {
            text: "TIP4-3 On-Chain Indexes",
            collapsable: false,
            link: "/specification/tip4_3.md",
          },
          {
            text: "TIP4_Royalty",
            collapsable: false,
            link: "/specification/tip4_royalty.md",
          },
          {
            text: "TIP4-4 On-Chain Storage",
            collapsable: false,
            link: "/specification/tip4_4.md",
          },
          {
            text: "TIP4-5 Don't be Evil Licensing",
            collapsable: false,
            link: "/specification/tip4_5.md",
          },
          {
            text: "TIP4-6 Upgradeable NFT",
            collapsable: false,
            link: "/specification/tip4_6.md",
          },
          {
            text: "TIP-6.1",
            collapsable: false,
            link: "/specification/tip6.md",
          },
        ],
      },
      {
        text: "Getting Started",
        collapsable: false,
        link: "/gettingStarted/toc.md",
        items: [
          {
            text: "Setup",
            collapsable: false,
            items: [
              {
                text: "Basic Project Setup",
                collapsable: false,
                link: "/gettingStarted/basicProjectSetup.md",
              },
              {
                text: "Locklift Config Setup",
                collapsable: false,
                link: "/gettingStarted/lockliftConfigSetup.md",
              },
            ],
          },
          {
            text: "Local Environment",
            collapsable: false,
            link: "/gettingStarted/localEnvironment.md",
          },
          {
            text: "Deploy Account",
            collapsable: false,
            link: "/gettingStarted/deployAccount.md",
          },
        ],
      },
      {
        text: "Usage and Deployment",
        collapsable: false,
        link: "/usageAndDeployment/toc.md",
        items: [
          {
            text: "Prerequisites",
            collapsable: false,
            link: "/usageAndDeployment/prerequisites.md",
          },
          {
            text: "Deploying Collection",
            collapsable: false,
            link: "/usageAndDeployment/deployingCollection.md",
          },
          {
            text: "Minting Nft",
            collapsable: false,
            link: "/usageAndDeployment/mintingNft.md",
          },
          {
            text: "Finding Nft by Indexes",
            collapsable: false,
            link: "/usageAndDeployment/findingNftByIndexes.md",
          },
          {
            text: "Transferring Nft",
            collapsable: false,
            link: "/usageAndDeployment/transferringNft.md",
          },
          {
            text: "Burning Nft",
            collapsable: false,
            link: "/usageAndDeployment/burningNft.md",
          },
          {
            text: "Upgradeable Nft",
            collapsable: false,
            link: "/usageAndDeployment/upgradeableNft.md",
          },
        ],
      },
      { text: "FAQ", collapsable: false, link: "FAQ.md" },
      {
        text: "API Reference",
        collapsable: false,
        link: "apiReferences.md",
      },
    ],

    socialLinks: [{ icon: "github", link: GITHUB_URL }],
  },

  esbuild: {
    target: ["chrome89", "edge89", "firefox79", "safari14.1"],
  },
};
