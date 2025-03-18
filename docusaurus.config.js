// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Moonsama',
  tagline: 'Moonsama docs page',
  favicon: 'img/favicon.png',

  // Set the production url of your site here
  url: 'https://docs.moonsama.com',
  // Set the /<baseUrl>/ pathname under which your site is 
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'moonsama', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    localeConfigs: {
      en: { htmlLang: 'en-US' },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/moonsama/docs/blob/main/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/moonsama/docs',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        // algolia crawler
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      // SEO and link previews
      metadata: [
        {name: 'keywords', content: 'moonsama, docs, documentation, nft, gaming'},
      ],
      // Replace with your project's social card
      navbar: {
        title: '',
        logo: {
          alt: 'Moonsama Site Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://medium.com/@MoonsamaNFT',
            label: 'Medium',
            position: 'left',
          },
          {
            href: 'https://x.com/MoonsamaNFT',
            label: 'X',
            position: 'left',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            href: 'https://moonsama.com',
            label: 'Moonsama',
            position: 'right',
          },
          {
            href: 'https://github.com/moonsama',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Quick Start',
                to: '/docs/category/about-moonsama'
              },
              {
                label: 'SAMA Token',
                to: '/docs/category/what-is-sama'
              },
            ],
          },
          {
            title: 'Learn',
            items: [
              {
                label: 'The Products',
                to: '/docs/category/products'
              },
              {
                label: 'The Technology',
                to: '/docs/category/moonsama-network'
              }
            ]
          },
          {
            title: 'Guides',
            items: [
              // {
              //   label: 'For Builders',
              //   to: '/docs/category/builder-guides',
              // },
              {
                label: 'For Users',
                to: '/docs/category/user-guides'
              },
            ]
          },
          {
            title: 'Community',
            items: [
              {
                href: 'https://x.com/MoonsamaNFT',
                label: 'X',
              },
              {
                href: 'https://discord.gg/moonsama',
                label: 'Discord',
              },
              {
                href: 'https://t.me/MoonsamaNFT',
                label: 'Telegram',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                href: 'https://medium.com/@MoonsamaNFT',
                label: 'Medium',
              },
              {
                href: 'https://moonsama.com',
                label: 'Moonsama',
              },
              {
                href: 'https://github.com/moonsama',
                label: 'GitHub',
              },
            ],
          },
        ],
        copyright: `Copyright © 2023 Moonsama. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['rust', 'toml', 'solidity']
      },
      algolia: {
        // The application ID provided by Algolia
        appId: 'QTJKUSWKT3',

        // Public API key: it is safe to commit it
        apiKey: '504953decf97dc1ceeb85e26375a6aa7',

        indexName: 'moonsama-docs',

        // Optional: see doc section below
        contextualSearch: true,

        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        externalUrlRegex: 'moonsama\\.com',

        // Optional: Algolia search parameters
        searchParameters: {},

        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search',

        //... other Algolia params
      },
    }),
};

module.exports = config;
