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
        text: "StEver Docs",
        link: "https://st-ever-docs.netlify.app/",
      }
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

    "src/pages/getting-started/toc.md": "getting-started/toc.md",
    "src/pages/getting-started/basic-project-setup.md":
      "getting-started/basic-project-setup.md",
    "src/pages/getting-started/locklift-config-setup.md":
      "getting-started/locklift-config-setup.md",
    "src/pages/getting-started/local-environment.md":
      "getting-started/local-environment.md",
    "src/pages/getting-started/deploy-account.md":
      "getting-started/deploy-account.md",

    "src/pages/usage-and-deployment/toc.md": "usage-and-deployment/toc.md",
    "src/pages/usage-and-deployment/prerequisites.md":
      "usage-and-deployment/prerequisites.md",
    "src/pages/usage-and-deployment/deploying-collection.md":
      "usage-and-deployment/deploying-collection.md",
    "src/pages/usage-and-deployment/minting-nft.md":
      "usage-and-deployment/minting-nft.md",
    "src/pages/usage-and-deployment/finding-nft.md":
      "usage-and-deployment/finding-nft.md",
    "src/pages/usage-and-deployment/transferring-nft.md":
      "usage-and-deployment/transferring-nft.md",
    "src/pages/usage-and-deployment/burning-nft.md":
      "usage-and-deployment/burning-nft.md",
    "src/pages/usage-and-deployment/upgradeable-nft.md":
      "usage-and-deployment/upgradeable-nft.md",
    "src/pages/api-references.md": "api-references.md",
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
        link: "/getting-started/toc.md",
        items: [
          {
            text: "Setup",
            collapsable: false,
            items: [
              {
                text: "Basic Project Setup",
                collapsable: false,
                link: "/getting-started/basic-project-setup.md",
              },
              {
                text: "Locklift Config Setup",
                collapsable: false,
                link: "/getting-started/locklift-config-setup.md",
              },
            ],
          },
          {
            text: "Local Environment",
            collapsable: false,
            link: "/getting-started/local-environment.md",
          },
          {
            text: "Deploy Account",
            collapsable: false,
            link: "/getting-started/deploy-account.md",
          },
        ],
      },
      {
        text: "Usage and Deployment",
        collapsable: false,
        link: "/usage-and-deployment/toc.md",
        items: [
          {
            text: "Prerequisites",
            collapsable: false,
            link: "/usage-and-deployment/prerequisites.md",
          },
          {
            text: "Deploying Collection",
            collapsable: false,
            link: "/usage-and-deployment/deploying-collection.md",
          },
          {
            text: "Minting Nft",
            collapsable: false,
            link: "/usage-and-deployment/minting-nft.md",
          },
          {
            text: "Finding Nft by Indexes",
            collapsable: false,
            link: "/usage-and-deployment/finding-nft.md",
          },
          {
            text: "Transferring Nft",
            collapsable: false,
            link: "/usage-and-deployment/transferring-nft.md",
          },
          {
            text: "Burning Nft",
            collapsable: false,
            link: "/usage-and-deployment/burning-nft.md",
          },
          {
            text: "Upgradeable Nft",
            collapsable: false,
            link: "/usage-and-deployment/upgradeable-nft.md",
          },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: GITHUB_URL }],
  },

  esbuild: {
    target: ["chrome89", "edge89", "firefox79", "safari14.1"],
  },
};
