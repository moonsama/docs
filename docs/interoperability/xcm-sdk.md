# XCM SDK

[https://docs.moonbeam.network/builders/interoperability/xcm/xcm-sdk/xcm-sdk/](https://docs.moonbeam.network/builders/interoperability/xcm/xcm-sdk/xcm-sdk/)

![img/xcm-sdk-banner.png](img/xcm-sdk-banner.png)

## Introduction

The Moonbeam XCM SDK enables developers to easily deposit and withdraw assets to Moonbeam/Moonriver from the relay chain and other parachains in the Polkadot/Kusama ecosystem. With the SDK, you don't need to worry about determining the multilocation of the origin or destination assets or which extrinsics are used on which networks to send XCM transfers. To deposit or withdraw assets, you simply define the asset and origin chain you want to deposit from or withdraw back to, along with the sending account's signer, and the amount to send.

The XCM SDK offers simple helper functions like `deposit` and `withdraw`, that provide a very simple interface to execute XCM transfers between chains in the Polkadot/Kusama ecosystem. In addition, the XCM config package allows any parachain project to add their information in a standard way, so they can be immediately supported by the XCM SDK.

For an overview of the available methods and interfaces in the Moonbeam XCM SDK, please refer to the [Reference](https://docs.moonbeam.network/builders/interoperability/xcm/xcm-sdk/reference) page.

The examples in this guide are shown on Moonbeam, but can be adapted to be used on Moonriver or Moonbase Alpha.

## Getting Started

To get started with the XCM SDK, you'll first need to install the corresponding NPM package. Next, you'll also need to create signers to be used to sign transactions to transfer assets between Moonbeam and another chain within the Polkadot ecosystem. Lastly, you'll need to initialize the API which will provide you with asset and chain information and the necessary functions to deposit, withdraw, and subscribe to balance information.

### Installation

For the purposes of this guide you'll need to install two packages: the XCM SDK package, and the XCM config package.

The XCM SDK package will enable you to easily deposit and withdraw assets, and subscribe to balance information for each of the supported assets.

The XCM config package will be used to obtain origin asset and chain information for each of the supported assets. The config package also includes native asset and chain information for each of the Moonbeam-based networks, as well as some underlying functions of the SDK.

To install the XCM SDK and XCM config packages, you can run the following command:

```
npm install @moonbeam-network/xcm-sdk @moonbeam-network/xcm-config

```

You need to have peer dependencies, like [Ethers.js](https://docs.ethers.io/) and the [Polkadot.js API](https://polkadot.js.org/docs/api/) installed.

You can install them by running the following command:

```
npm i @polkadot/api-augment @polkadot/types @polkadot/util @polkadot/util-crypto ethers

```

Note

There is a [known issue](https://github.com/polkadot-js/api/issues/4315) when using the Moonbeam XCM packages alongside Polkadot.s with Node.js (JavaScript) that will cause package conflict warnings to appear in the console. Using TypeScript is recommended.

### Creating Signers

When interacting with the `deposit` and `withdraw` functions of the XCM SDK, you'll need to provide an [Ethers.js](https://docs.ethers.io/) and [Polkadot.js](https://polkadot.js.org/docs/api/) signer, which will be used to sign and send the transactions. The Ethers signer is used to sign transactions on Moonbeam, and the Polkadot signer will be used to sign transactions on the origin chain you're depositing assets from.

You can pass, for example, a [MetaMask signer into Ethers](https://docs.ethers.org/v6/getting-started/#starting-connecting) or another compatible wallet. Similarly with Polkadot, you can [pass a compatible wallet to the signer using the `@polkadot/extension-dapp` library](https://polkadot.js.org/docs/extension/).

To create a signer for Ethers.js and Polkadot.js, you can refer to the following code snippets. In this example, you can use a Polkadot.js Keyring to sign transactions on the origin chain for deposits. Please note that this approach is not recommended for production applications. **Never store your private key or mnemonic in a JavaScript or TypeScript file.**

MoonbeamMoonriverMoonbase Alpha

```
import { ethers } from "ethers";
import { Keyring } from '@polkadot/api';

// Set up Ethers provider and signer
const providerRPC = {
  moonbeam: {
    name: 'moonbeam',
    rpc: 'INSERT_RPC_API_ENDPOINT',
    chainId: 1284, // 0x504 in hex,
  },
};
const provider = new ethers.JsonRpcProvider(
  providerRPC.moonbeam.rpc,
  {
    chainId: providerRPC.moonbeam.chainId,
    name: providerRPC.moonbeam.name,
  }
);
const ethersSigner = new ethers.Wallet('INSERT-PRIVATE-KEY', provider);

// Set up Polkadot keyring
const keyring = new Keyring({ type: 'sr25519' });
const polkadotKeyring = keyring.addFromUri(mnemonic);

```

### Initialization

To be able to deposit, withdraw, and subscribe to balance information for all of the supported assets, you'll need to start off by importing the `init` function from the XCM SDK and call it:

If you intend to support a specific wallet, you can pass a signer into the `init` function right away. Otherwise, you'll be able to pass a signer directly when building the transfer data for a deposit or withdraw. To pass in a signer for [Ethers](https://docs.moonbeam.network/builders/build/eth-api/libraries/ethersjs) and [Polkadot](https://docs.moonbeam.network/builders/build/substrate-api/polkadot-js-api), you can use the following snippet:

## Using the SDK Interfaces

The Moonbeam SDK provides an API which includes a series of [interfaces](https://docs.moonbeam.network/builders/interoperability/xcm/xcm-sdk/reference/#core-sdk-interfaces) to get asset information for each of the supported assets, chain information for the initialized network, and functions to enable deposits, withdrawals, and subscription to balance information.

Make sure you have [intialized](https://docs.moonbeam.network/builders/interoperability/xcm/xcm-sdk/xcm-sdk/#initialization) the Moonbeam network you want to interact with first.

### Asset Symbols

An asset symbol refers to the symbol of the asset on the origin chain. For example, `GLMR` is the native asset on Moonbeam.

To get a list of the supported asset symbols for each network, you can access the `symbols` property:

An example of the data contained in the `symbols` property is as follows:

### Assets

To get a list of the supported assets along with their asset ID, precompiled contract address on Moonbeam, and their origin asset symbols, you can access the `assets` property:

An example of the data contained in the `assets` property is as follows:

Where the `id` refers to the asset ID, the `erc20id` refers to the asset's precompiled contract address, and the `originSymbol` refers to the asset's symbol on the origin chain.

### Moonbeam Native Asset Data

To get information about each of the Moonbeam network's native protocol asset, such as the [precompile contract address](https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/erc20) and the origin symbol, you can access the `moonAsset` property:

An example of the data contained in the `moonAsset` property is as follows:

Where the `erc20Id` refers to the precompile contract address on Moonbeam, the `originSymbol` is the symbol for the native asset, and `isNative` is a boolean indicating whether the asset is a native asset.

### Moonbeam Native Chain Data

To get information about each of the Moonbeam network's chain information including the chain key, name, WSS endpoint, parachain ID, protocol asset symbols, chain ID, and units per second, you can access the `moonChain` property:

An example of the data contained in the `moonChain` property is as follows:

Here, the units per second refer to units of token (in this case Wei) that is charged per second of execution of the XCM message. You can find more information in the [XCM fees page](https://docs.moonbeam.network/builders/interoperability/xcm/fees/#moonbeam-reserve-assets).

## Using the SDK Methods

The Moonbeam SDK provides an API that includes [functions](https://docs.moonbeam.network/builders/interoperability/xcm/xcm-sdk/reference/#core-sdk-methods) which enable deposits, withdrawals, and subscription to balance information, in addition to a few utility functions.

Make sure you have [intialized](https://docs.moonbeam.network/builders/interoperability/xcm/xcm-sdk/xcm-sdk/#initialization) the Moonbeam network you want to interact with first. You'll also need to make sure you've [created signers](https://docs.moonbeam.network/builders/interoperability/xcm/xcm-sdk/xcm-sdk/#creating-signers) in order to sign and send deposit and withdraw transfer data.

### Deposit

To deposit an asset to Moonbeam from another network, you'll have to first build the transfer data using information from the origin chain before you can send it. You'll need to use a series of deposit methods to build the transfer data.

The process for building and sending a deposit transfer data is as follows:

1. Call the `deposit` function and pass in the [asset symbol](https://docs.moonbeam.network/builders/interoperability/xcm/xcm-sdk/xcm-sdk/#asset-symbols) or the [asset object](https://docs.moonbeam.network/builders/interoperability/xcm/xcm-sdk/xcm-sdk/#assets) for the asset to be deposited. This will return a `[chains` array](https://docs.moonbeam.network/builders/interoperability/xcm/xcm-sdk/xcm-sdk/#chains-deposit) containing the asset's origin network information and a `from` function which will be used to build the transfer data
2. Call the `from` function and pass in the chain key or the chain object of the origin network. You can get the chain object from the `chains` array returned from the `deposit` function. You can get the chain key one of two ways: by accessing the key property of the chain object (`chain.key`) or by directly importing `ChainKey` from the XCM config package (as seen in the example below)
3. Call `get` and pass in the address of the account on Moonbeam you want to deposit the funds to and a signer or Polkadot address depending on how your code is configured, please refer to the [Get](https://docs.moonbeam.network/builders/interoperability/xcm/xcm-sdk/xcm-sdk/#get-deposit) section for more information. For the purposes of this guide, you'll need to pass in a Polkadot.js `Keyring` to sign the transaction as created in the [Creating Signers](https://docs.moonbeam.network/builders/interoperability/xcm/xcm-sdk/xcm-sdk/#creating-signers) section. The `get` function returns a `send` function which already contains all the necessary info to perform the deposit, and it is used in the next step. In addition, other elements such as information about the origin chain asset and the `xc` representation of the asset on Moonbeam are returned and might be important for logging purposes
4. The `send` function is used to send the built deposit transfer data along with the amount to send. You can optionally provide a callback function to handle the extrinsic events

To obtain some of the data required to build the deposit transfer data, such as the asset symbol and chain key of the origin network, you can import `AssetSymbol` and `ChainKey` from the `@moonbeam-network/xcm-config` package.

An example of the steps described above to deposit DOT from the Polkadot relay chain to xcDOT on Moonbeam is as follows:

### Chains

As previously mentioned, the `deposit` function returns a `chains` array and a `[from` function](https://docs.moonbeam.network/builders/interoperability/xcm/xcm-sdk/xcm-sdk/#from). The `chains` array corresponds to the chains you can deposit the given asset from (for the asset that was initially passed into the `deposit` function). An example of the `chains` array is as follows:

### From

The `from` function requires a chain key to be passed into it for the origin chain in which the assets are sent from and returns a `get` function.

### Get

The `get` function requires that you pass in the receiving account on Moonbeam and a [Polkadot signer](https://docs.moonbeam.network/builders/build/substrate-api/polkadot-js-api) or the sending account on Polkadot depending on how you set up your Polkadot signer, and it gets the data required for the deposit.

If you have a Polkadot compatible signer, you can pass the signer into the `init` function, then in the `get` function you can pass the Polkadot address for the second argument:

If you have a Polkadot compatible signer but haven't passed it into the `init` function, then in the `get` function you can pass in the Polkadot address for the second argument and the Polkadot signer for the third argument:

If you have a Polkadot Keyring pair, as originally was set up in the [Initialization](https://docs.moonbeam.network/builders/interoperability/xcm/xcm-sdk/xcm-sdk/#initializing) section, you'll pass in the `polkadotKeyring` as the second parameter:

An example of the response for calling `get` to send DOT from Polkadot to Moonbeam is as follows:

Where the returned values are as follows:

### Send

When calling `send`, you will actually send the deposit transfer data that has been built using the `deposit`, `from`, and `get` functions. You simply have to pass in a specified amount to send and an optional callback for handling the extrinsic event. For example, entering `10000000000n` will send `1` DOT from Polkadot to Moonbeam, as DOT has 10 decimals.

You can refer back to the example in the [Deposit](https://docs.moonbeam.network/builders/interoperability/xcm/xcm-sdk/xcm-sdk/#deposit) section to see how the `send` function is used.

### Get Fee

The `getFee` function estimates the fees for transferring a given amount of the asset specified in the `deposit` function. An example of getting the fee in Polkadot for transferring DOT to Moonbeam is as follows:

### Withdraw

To withdraw an asset from Moonbeam to send back to the origin network, you'll have to first build the transfer data using information from the origin chain before you can send it. To do so, you'll take the following steps:

1. Call the `withdraw` function and pass in the [asset symbol](https://docs.moonbeam.network/builders/interoperability/xcm/xcm-sdk/xcm-sdk/#asset-symbols) or the [asset object](https://docs.moonbeam.network/builders/interoperability/xcm/xcm-sdk/xcm-sdk/#assets). This will return a `[chains` array](https://docs.moonbeam.network/builders/interoperability/xcm/xcm-sdk/xcm-sdk/#chains-withdraw) containing the asset's origin network information and a `to` function which will be used to build the transfer data
2. Call the `to` function and pass in the chain key of the origin network. You can get the chain object from the `chains` array returned from the `withdraw` function. You can get the chain key one of two ways: by accessing the key property of the chain object (`chain.key`) or by directly importing `ChainKey` from the XCM config package (as seen in the example below)
3. Call `get` and pass in the address of the account on the origin network you want to withdraw the funds from and pass in the [Ethers signer](https://docs.moonbeam.network/builders/interoperability/xcm/xcm-sdk/xcm-sdk/#creating-signers) if you haven't already done so during [intialization](https://docs.moonbeam.network/builders/interoperability/xcm/xcm-sdk/xcm-sdk/#initializing). This will return information about the origin (destination) chain asset, the `xc` representation of the asset on Moonbeam. This will return a `send` function which already contains all the necessary info to perform the withdrawal, and it is used in the next step. In addition, other elements, such as information about the asset, are returned and might be important for logging purposes
4. The `send` function is used to send the built withdraw transfer data along with the amount to send. You can optionally provide a callback function to handle the extrinsic events

To obtain some of the data required to build the withdraw transfer data, such as the asset symbol and chain key of the origin network, you can import `AssetSymbol` and `ChainKey` from the `@moonbeam-network/xcm-config` package.

An example of the steps described above to withdraw xcDOT from Moonbeam to send back to DOT on Polkadot is as follows:

### Chains

As previously mentioned, the `withdraw` function returns a `chains` array and a `to` function. The `chains` array corresponds to the chains you can withdraw the given asset from (for the asset that was initially passed into the `withdraw` function). An example of the `chains` array is as follows:

### To

The `to` function requires a chain key to be passed into it for the origin chain in which the assets are being withdrawn back to and returns a `get` function.

### Get

The `get` function requires that you pass in the receiving account on the destination chain and the [Ethers signer](https://docs.moonbeam.network/builders/interoperability/xcm/xcm-sdk/xcm-sdk/#creating-signers) for the sending account on Moonbeam, and it gets the data required for the withdraw.

An example of the response for calling `get` to send xcDOT from Moonbeam back to DOT on Polkadot is as follows:

Where the returned values are as follows:

### Send

When calling `send`, you will actually send the withdraw transfer data that has been built using the `withdraw`, `to`, and `get` functions. You simply have to pass in a specified amount to send and an optional callback for handling the extrinsic event. For example, entering `10000000000n` will send `1` xcDOT on Moonbeam back to DOT on Polkadot.

You can refer back to the example in the [Withdraw](https://docs.moonbeam.network/builders/interoperability/xcm/xcm-sdk/xcm-sdk/#withdraw) section to see how the `send` function is used.

### Get Fee

The `getFee` function estimates the fees for transferring a given amount of the asset specified in the `withdraw` function. An example of getting the fee in GLMR for transferring xcDOT from Moonbeam back to DOT on Polkadot is as follows:

### Subscribe to Assets Balance Information

To subscribe to balance information and get a given account's latest balance for each of the supported assets, you can use the `subscribeToAssetsBalanceInfo` function and pass in the address you want to get the balance for and a callback function to handle the data:

The following example retrieves the balance information for a given account on Moonbeam and prints the balance for each of the supported assets to the console:

### Utility Functions

There are utility functions in both the XCM SDK and the XCM Utilities packages. The XCM SDK provides the following SDK-related utility functions:

- `[isXcmSdkDeposit](https://docs.moonbeam.network/builders/interoperability/xcm/xcm-sdk/xcm-sdk/#deposit-check)`
- `[isXcmSdkWithdraw](https://docs.moonbeam.network/builders/interoperability/xcm/xcm-sdk/xcm-sdk/#withdraw-check)`

And the XCM Utilities package provides the following generic utility functions:

- `[toDecimal](https://docs.moonbeam.network/builders/interoperability/xcm/xcm-sdk/xcm-sdk/#decimals)`
- `[toBigInt](https://docs.moonbeam.network/builders/interoperability/xcm/xcm-sdk/xcm-sdk/#decimals)`
- `[hasDecimalOverflow](https://docs.moonbeam.network/builders/interoperability/xcm/xcm-sdk/xcm-sdk/#decimals)`

### Check if Transfer Data is for a Deposit

To determine whether transfer data is for a deposit, you can pass in transfer data to the `isXcmSdkDeposit` function and a boolean will be returned. If `true` is returned the transfer data is for a deposit, and `false` is returned if it is not.

The following are some examples:

### Check if Transfer Data is for a Withdrawal

To determine whether transfer data is for a withdrawal, you can pass in transfer data to the `isXcmSdkWithdraw` function and a boolean will be returned. If `true` is returned the transfer data is for a withdrawal, and `false` is returned if it is not.

The following are some examples:

### Convert Balance to Decimal or BigInt

To convert a balance to decimal format, you can use the `toDecimal` function, which returns a given number in decimal format based on the number of decimals provided. You can optionally pass in a value for a third argument to dictate the maximum number of decimal places used; otherwise, the default is `6`; and a fourth argument that dictates the [rounding method](https://mikemcl.github.io/big.js/#rm) of the number. The `toDecimal` function returns a Big number type that you can convert to a number or string using its methods `toNumber`, `toFixed`, `toPrecision`, and `toExponential`. We recommend using them as a string, since big numbers or numbers with a lot of decimals can lose precision when using number types.

To convert from decimal number back to BigInt, you can use the `toBigInt` function which returns a given number in BigInt format based on the number of decimals provided.

For example, to convert a balance on Moonbeam from Wei to Glimmer you can use the following code:

You can also use `hasDecimalOverflow` to make sure that a given number does not have more decimal places than allowed. This is helpful for form inputs.