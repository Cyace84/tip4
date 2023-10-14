import vue from "@vitejs/plugin-vue";

const HELP_URL = "https://t.me/everdev";
const FEEDBACK_URL = "https://t.me/everdev";
const GITHUB_URL = "https://github.com/Javadyakuza/TIP3-Docs";
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
  themeConfig: {
    search: {
      provider: "local",
    },
    editLink: {
      pattern: "https://github.com/Javadyakuza/TIP3-Docs/edit/main/:path",
    },
    nav: NAV,
    sidebar: [
      {
        text: "Introduction",
        collapsable: false,
        link: "/",
        items: [
          {
            text: "Architecture",
            collapsable: false,
            link: "/docs/architecture",
          },
        ],
      },
      {
        text: "Specifications",
        collapsable: false,
        link: "/docs/specifications/ToC.md",
        items: [
          {
            text: "Base Collection",
            collapsable: false,
            link: "/docs/specifications/baseCollection.md",
          },
          {
            text: "Base NFT",
            collapsable: false,
            link: "/docs/specifications/baseNFT.md",
          },
          {
            text: "TIP4-1 Non-Fungible Token",
            collapsable: false,
            link: "/docs/specifications/41.md",
          },
          {
            text: "TIP4-2 NFT Metadata",
            collapsable: false,
            link: "/docs/specifications/42.md",
          },
          {
            text: "TIP4-3 On-Chain Indexes",
            collapsable: false,
            link: "/docs/specifications/43.md",
          },
          {
            text: "TIP4_Royalty",
            collapsable: false,
            link: "/docs/specifications/royalty.md",
          },
          {
            text: "TIP4-4 On-Chain Storage",
            collapsable: false,
            link: "/docs/specifications/44.md",
          },
          {
            text: "TIP4-5 Don't be Evil Licensing",
            collapsable: false,
            link: "/docs/specifications/45.md",
          },
          {
            text: "TIP4-6 Upgradeable NFT",
            collapsable: false,
            link: "/docs/specifications/46.md",
          },
          {
            text: "TIP-6.1",
            collapsable: false,
            link: "/docs/specifications/6.md",
          },
        ],
      },
      {
        text: "Getting Started",
        collapsable: false,
        link: "/docs/gettingStarted/ToC.md",
        items: [
          {
            text: "Setup",
            collapsable: false,
            items: [
              {
                text: "Basic Project Setup",
                collapsable: false,
                link: "/docs/gettingStarted/BasicProjectSetup.md",
              },
              {
                text: "Locklift Config Setup",
                collapsable: false,
                link: "/docs/gettingStarted/LockliftConfigSetting.md",
              },
            ],
          },
          {
            text: "Local Environment",
            collapsable: false,
            link: "/docs/gettingStarted/HelperScripts.md",
          },
          {
            text: "Deploy Account",
            collapsable: false,
            link: "/docs/gettingStarted/DeployAccount.md",
          },
        ],
      },
      {
        text: "Usage and Deployment",
        collapsable: false,
        items: [
          {
            text: "Prerequisites",
            collapsable: false,
            link: "/docs/usage/pre.md",
          },
          {
            text: "Deploying Collection",
            collapsable: false,
            link: "/docs/usage/deployingCollection.md",
          },
          {
            text: "Minting Nft",
            collapsable: false,
            link: "/docs/usage/mintingNft.md",
          },
          {
            text: "Finding Nft by Indexes",
            collapsable: false,
            link: "/docs/usage/findingNftByIndexes.md",
          },
          {
            text: "Transferring Nft",
            collapsable: false,
            link: "/docs/usage/transferringNft.md",
          },
          {
            text: "Burning Nft",
            collapsable: false,
            link: "/docs/usage/typical/ToC.md",
          },
          {
            text: "Upgradeable Nft",
            collapsable: false,
            link: "/docs/usage/typical/ToC.md",
          },
        ],
        link: "",
      },
      { text: "FAQ", collapsable: false, link: "" },
      { text: "API Reference", collapsable: false, link: "" },
    ],

    socialLinks: [{ icon: "github", link: GITHUB_URL }],
  },

  esbuild: {
    target: ["chrome89", "edge89", "firefox79", "safari14.1"],
  },
};
