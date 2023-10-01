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
  title: "TIP-4 Docs",

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
            text: "Performance Contracts",
            collapsable: false,
            link: "/docs/specifications/performance.md",
          },
          {
            text: "4.1 Non-Fungible Token",
            collapsable: false,
            link: "/docs/specifications/41.md",
          },
          {
            text: "4.2 NFT Metadata",
            collapsable: false,
            link: "/docs/specifications/42.md",
          },
          {
            text: "4.3 On-Chain Indexes",
            collapsable: false,
            link: "/docs/specifications/43.md",
          },
          {
            text: "4.4 Royalty",
            collapsable: false,
            link: "/docs/specifications/44.md",
          },
          {
            text: "4.5 On-Chain Storage",
            collapsable: false,
            link: "/docs/specifications/45.md",
          },
          {
            text: "4.6 Don't be Evil Licensing",
            collapsable: false,
            link: "/docs/specifications/46.md",
          },
          {
            text: "4.7 Upgradeable NFT",
            collapsable: false,
            link: "/docs/specifications/47.md",
          },
          {
            text: "TIP-6",
            collapsable: false,
            link: "/docs/specifications/47.md",
          },
        ],
      },
      {
        text: "Getting Started",
        collapsable: false,
        link: "/docs/QuickStart/ToC.md",
        items: [
          {
            text: "Setup",
            collapsable: false,
            items: [
              {
                text: "Prerequisites",
                collapsable: false,
                link: "/docs/gettingStarted/prerequisites.md",
              },
              {
                text: "Basic Project Setup",
                collapsable: false,
                link: "/docs/gettingStarted/basicProjectSetup.md",
              },
            ],
          },
        ],
      },
      {
        text: "Usage",
        collapsable: false,
        items: [
          { text: "Typical Usage", collapsable: false, link: "" },
          {
            text: "Advanced Usage",
            collapsable: false,
            items: [
              { text: " Indexing", collapsable: false, link: "" },
              { text: "on-chain Metadata ", collapsable: false, link: "" },
            ],
          },
          { text: "Enable Upgradeability", collapsable: false, link: "" },
          { text: "Licensing(Don't Be Evil)", collapsable: false, link: "" },
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
