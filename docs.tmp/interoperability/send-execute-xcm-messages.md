# Send & Execute XCM Messages


## Introduction

XCM messages are comprised of a [series of instructions](builders/interoperability/xcm/overview/#xcm-instructions) that are executed by the Cross-Consensus Virtual Machine (XCVM). Combinations of these instructions result in predetermined actions, such as cross-chain token transfers. You can create your own custom XCM messages by combining various XCM instructions.

Pallets such as [X-Tokens](builders/interoperability/xcm/xc20/xtokens) and [XCM Transactor](builders/interoperability/xcm/xcm-transactor/) provide functions with a predefined set of XCM instructions to either send [XC-20s](builders/interoperability/xcm/xc20/overview/) or remotely execute on other chains via XCM. However, to get a better understanding of the results from combining different XCM instructions, you can build and execute custom XCM messages locally on Moonsama Network. You can also send custom XCM messages to another chain (which will start with the `[DecendOrigin](https://github.com/paritytech/xcm-format#descendorigin)` instruction). Nevertheless, for the XCM message to be successfully executed, the target chain needs to be able to understand the instructions.

To execute or send a custom XCM message, you can either use the [Polkadot XCM Pallet](builders/interoperability/xcm/send-execute-xcm/#polkadot-xcm-pallet-interface) directly or through the Ethereum API with the [XCM Utilities Precompile](builders/pallets-precompiles/precompiles/xcm-utils). In this guide, you'll learn how to use both methods to execute and send custom-built XCM messages locally on .

This guide assumes that you are familiar with general XCM concepts, such as [general XCM terminology](builders/interoperability/xcm/overview/#general-xcm-definitions) and [XCM instructions](builders/interoperability/xcm/overview/#xcm-instructions). For more information, you can check out the [XCM Overview](builders/interoperability/xcm/overview) documentation.

## Polkadot XCM Pallet Interface

### Extrinsics

The Polkadot XCM Pallet includes the following relevant extrinsics (functions):

- **execute**(message, maxWeight) — **supported on  only** - executes a custom XCM message given the SCALE encoded XCM versioned XCM message to be executed and the maximum weight to be consumed
- **send**(dest, message) - **supported on  only** - sends a custom XCM message given the multilocation of the destination chain to send the message to and the SCALE encoded XCM versioned XCM message to be sent. For the XCM message to be successfully executed, the target chain needs to be able to understand the instructions in the message

### Storage Methods

The Polkadot XCM Pallet includes the following relevant read-only storage methods:

- **assetTraps**(Option) - returns the existing number of times an asset has been trapped given the Blake2-256 hash of the `MultiAssets` pair. If the hash is omitted, all asset traps are returned
- **palletVersion**() - provides the version of the Polkadot XCM Pallet being used

## Checking Prerequisites

To follow along with this guide, you will need the following:

- Your account must be funded with DEV tokens. You can get DEV tokens for testing on  once every 24 hours from the [ Faucet](<https://faucet.Moonsama> Network.network/)

## Execute an XCM Message Locally

This section of the guide covers the process of building a custom XCM message to be executed locally (i.e., in Moonsama Network) via two different methods: the `execute` function of the Polkadot XCM Pallet and the `xcmExecute` function of the [XCM Utilities Precompile](builders/pallets-precompiles/precompiles/xcm-utils). This functionality provides a playground for you to experiment with different XCM instructions and see firsthand the results of these experiments. This also comes in handy to determine the [fees](builders/interoperability/xcm/fees) associated with a given XCM message on Moonsama Network.

In the following example, you'll transfer DEV tokens from one account to another on . To do so, you'll be building an XCM message that contains the following XCM instructions, which are executed locally (in this case, on ):

- `[WithdrawAsset](https://github.com/paritytech/xcm-format#withdrawasset)` - removes assets and places them into the holding register
- `[DepositAsset](https://github.com/paritytech/xcm-format#depositasset)` - removes the assets from the holding register and deposits the equivalent assets to a beneficiary account

Note

Typically, when you send an XCM message cross-chain to a target chain, the `[BuyExecution` instruction](<https://github.com/paritytech/xcm-format#buyexecution>) is needed to pay for remote execution. However, for local execution, this instruction is not necessary as you are already getting charged via the extrinsic call.

### Execute an XCM Message with the Polkadot.js API

In this example, you'll execute a custom XCM message locally on  using the Polkadot.js API to interact directly with the Polkadot XCM Pallet.

The `execute` function of the Polkadot XCM Pallet accepts two parameters: `message` and `maxWeight`. You can start assembling these parameters by taking the following steps:

1.   
    
    Build the `WithdrawAsset` instruction, which will require you to define:
    
    - The multilocation of the DEV token on 
    - The amount of DEV tokens to transfer
    
    ```
    const instr1 = {
      WithdrawAsset: [
        {
          id: { Concrete: { parents: 0, interior: { X1: { PalletInstance: 3 } } } },
          fun: { Fungible: 100000000000000000n }, // 0.1 DEV
        },
      ],
    };
    
    ```
    
2.   
    
    Build the `DepositAsset` instruction, which will require you to define:
    
    - The multiasset identifier for DEV tokens. You can use the `[WildMultiAsset` format](https://github.com/paritytech/xcm-format/blob/master/README.md#6-universal-asset-identifiers), which allows for wildcard matching, to identify the asset
    - The multilocation of the beneficiary account on 
    
    ```
    const instr2 = {
      DepositAsset: {
        assets: { Wild: 'All' },
        beneficiary: {
          parents: 0,
          interior: {
            X1: {
              AccountKey20: {
                key: moonbeamAccount,
              },
            },
          },
        },
      },
    };
    
    ```
    
3.  
    
    Combine the XCM instructions into a versioned XCM message:
    
    ```
    const message = { V3: [instr1, instr2] };
    
    ```
    
4.   
    
    Specify the `maxWeight`, which includes a value for `refTime` and `proofSize` that you will need to define:
    
    - The `refTime` is the amount of computational time that can be used for execution. For this example, you can set it to `100000000000n`
    - The `proofSize` is the amount of storage in bytes that can be used. You can set this to `0`
    
    ```
    const maxWeight = { refTime: 100000000000n, proofSize: 0 } ;
    
    ```
    

Now that you have the values for each of the parameters, you can write the script for the execution. You'll take the following steps:

1. Provide the input data for the call. This includes:
    - The  endpoint URL to create the provider
    - The values for each of the parameters of the `execute` function
2. Create a Keyring instance that will be used to send the transaction
3. Create the [Polkadot.js API](builders/build/substrate-api/polkadot-js-api/) provider
4. Craft the `polkadotXcm.execute` extrinsic with the `message` and `maxWeight`
5. Send the transaction using the `signAndSend` extrinsic and the Keyring instance you created in the second step

Remember

This is for demo purposes only. Never store your private key in a JavaScript file.

```
import { ApiPromise, WsProvider, Keyring } from '@polkadot/api'; // Version 9.13.6

// 1. Provide input data
const providerWsURL = 'wss://wss.api.moonbase.Moonsama Network.network';
const privateKey = 'INSERT_PRIVATE_KEY';
const moonbeamAccount = 'INSERT_ADDRESS';
const instr1 = {
  WithdrawAsset: [
    {
      id: { Concrete: { parents: 0, interior: { X1: { PalletInstance: 3 } } } },
      fun: { Fungible: 100000000000000000n },
    },
  ],
};
const instr2 = {
  DepositAsset: {
    assets: { Wild: 'All' },
    beneficiary: {
      parents: 0,
      interior: {
        X1: {
          AccountKey20: {
            key: moonbeamAccount,
          },
        },
      },
    },
  },
};
const message = { V3: [instr1, instr2] };
const maxWeight =  { refTime: 100000000000n, proofSize: 0 };

// 2. Create Keyring instance
const keyring = new Keyring({ type: 'ethereum' });
const alice = keyring.addFromUri(privateKey);

const executeXcmMessage = async () => {
  // 3. Create Substrate API provider
  const substrateProvider = new WsProvider(providerWsURL);
  const api = await ApiPromise.create({ provider: substrateProvider });

  // 4. Craft the extrinsic
  const tx = api.tx.polkadotXcm.execute(message, maxWeight);

  // 5. Send the transaction
  const txHash = await tx.signAndSend(alice);
  console.log(`Submitted with hash ${txHash}`);

  api.disconnect();
};

executeXcmMessage();

```

Note

You can view an example of the above script, which sends 1 DEV to Bobs's account on Moonsama Network, on [Polkadot.js Apps](<https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.Moonsama> Network.network#/extrinsics/decode/0x1c03030800040000010403001300008a5d784563010d0100000103003cd0a705a2dc65e5b1e1205896baa2be8a07c6e00700e876481700) using the following encoded calldata: `0x1c03030800040000010403001300008a5d784563010d0100000103003cd0a705a2dc65e5b1e1205896baa2be8a07c6e00700e876481700`.

Once the transaction is processed, the 0.1 DEV tokens should be withdrawn from Alice's account along with the associated XCM fees, and the destination account should have received 0.1 DEV tokens in their account. A `polkadotXcm.Attempted` event will be emitted with the outcome.

### Execute an XCM Message with the XCM Utilities Precompile

In this section, you'll use the `xcmExecute` function of the [XCM Utilities Precompile](builders/pallets-precompiles/precompiles/xcm-utils), which is only supported on , to execute an XCM message locally. The XCM Utilities Precompile is located at the following address:

```
0x000000000000000000000000000000000000080C

```

Under the hood, the `xcmExecute` function of the XCM Utilities Precompile calls the `execute` function of the Polkadot XCM Pallet, which is a Substrate pallet that is coded in Rust. The benefit of using the XCM Utilities Precompile to call `xcmExecute` is that you can do so via the Ethereum API and use [Ethereum libraries](builders/build/eth-api/libraries/) like [Ethers.js](builders/build/eth-api/libraries/ethersjs).

The `xcmExecute` function accepts two parameters: the SCALE encoded versioned XCM message to be executed and the maximum weight to be consumed.

First, you'll learn how to generate the encoded calldata, and then you'll learn how to use the encoded calldata to interact with the XCM Utilities Precompile.

### Generate the Encoded Calldata of an XCM Message

To get the encoded calldata of the XCM message, you can create a script similar to the one you created in the [Execute an XCM Message with the Polkadot.js API](builders/interoperability/xcm/send-execute-xcm/#execute-an-xcm-message-with-polkadotjs-api) section. Instead of building the message and sending the transaction, you'll build the message to get the encoded calldata. You'll take the following steps:

1. Provide the input data for the call. This includes:
    - The  endpoint URL to create the provider
    - The values for each of the parameters of the `execute` function as defined in the [Execute an XCM Message with the Polkadot.js API](builders/interoperability/xcm/send-execute-xcm/#execute-an-xcm-message-with-polkadotjs-api) section
2. Create the [Polkadot.js API](builders/build/substrate-api/polkadot-js-api/) provider
3. Craft the `polkadotXcm.execute` extrinsic with the `message` and `maxWeight`
4. Use the transaction to get the encoded calldata

The entire script is as follows:

```
import { ApiPromise, WsProvider } from '@polkadot/api'; // Version 9.13.6

// 1. Provide input data
const moonbeamAccount = 'INSERT_ADDRESS'
const providerWsURL = 'wss://wss.api.moonbase.Moonsama Network.network';
const instr1 = {
  WithdrawAsset: [
    {
      id: { Concrete: { parents: 0, interior: { X1: { PalletInstance: 3 } } } },
      fun: { Fungible: 100000000000000000n },
    },
  ],
};
const instr2 = {
  DepositAsset: {
    assets: { Wild: 'All' },
    beneficiary: {
      parents: 0,
      interior: {
        X1: {
          AccountKey20: {
            key: moonbeamAccount,
          },
        },
      },
    },
  },
};
const message = { V3: [instr1, instr2] };
const maxWeight =  { refTime: 100000000000n, proofSize: 0 };

const getEncodedXcmMessage = async () => {
  // 2. Create Substrate API provider
  const substrateProvider = new WsProvider(providerWsURL);
  const api = await ApiPromise.create({ provider: substrateProvider });

  // 3. Craft the extrinsic
  const tx = api.tx.polkadotXcm.execute(message, maxWeight);

  // 4. Get the encoded XCM message
  // By using index 0, you'll get just the encoded XCM message.
  // If you wanted to get the maxWeight, you could use index 1
  const encodedXcmMessage = tx.args[0].toHex()
  console.log(`Encoded Calldata for XCM Message: ${encodedXcmMessage}`);

  api.disconnect();
}

getEncodedXcmMessage();

```

### Execute the XCM Message

Now that you have the SCALE encoded XCM message, you can use the following code snippets to programmatically call the `xcmExecute` function of the XCM Utilities Precompile using your [Ethereum library](builders/build/eth-api/libraries/) of choice. Generally speaking, you'll take the following steps:

1. Create a provider and signer
2. Create an instance of the XCM Utilities Precompile to interact with
3. Define parameters required for the `xcmExecute` function, which will be the encoded calldata for the XCM message and the maximum weight to use to execute the message. You can set the `maxWeight` to be `100000000000n`, which corresponds to the `refTime`. The `proofSize` will automatically be set to the default, which is 64KB
4. Execute the XCM message

Remember

The following snippets are for demo purposes only. Never store your private keys in a JavaScript or Python file.

Ethers.jsWeb3.jsWeb3.py

```
import ABI from './xcmUtilsABI.js'; // Import the XCM Utilities Precompile ABI
import { ethers } from 'ethers'; // Import Ethers library

const PRIVATE_KEY = 'INSERT_YOUR_PRIVATE_KEY';
const xcmUtilsAddress = '0x000000000000000000000000000000000000080C';

/* Create Ethers provider and signer */
const provider = new ethers.providers.JsonRpcProvider(
  'https://rpc.api.moonbase.Moonsama Network.network'
);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

/* Create contract instance of the XCM Utilities Precompile */
const xcmUtils = new ethers.Contract(
  xcmUtilsAddress,
  ABI,
  signer
);

const executeXcmMessageLocally = async () => {
  /* Define parameters required for the xcmExecute function */
  const encodedCalldata = 'INSERT_ENCODED_CALLDATA';
  const maxWeight = '100000000000';

  /* Execute the custom XCM message */
  const tx = await xcmUtils.xcmExecute(encodedCalldata, maxWeight);
  await tx.wait();
  console.log(`Transaction receipt: ${tx.hash}`);
};

executeXcmMessageLocally();

```

And that's it! You've successfully used the Polkadot XCM Pallet and the XCM Utilities Precompile to execute a custom XCM message locally on !

## Send an XCM Message Cross-Chain

This section of the guide covers the process of sending a custom XCM message cross-chain (i.e., from Moonsama Network to a target chain, such as the relay chain) via two different methods: the `send` function of the Polkadot XCM Pallet and the `xcmSend` function of the [XCM Utilities Precompile](builders/pallets-precompiles/precompiles/xcm-utils).

For the XCM message to be successfully executed, the target chain needs to be able to understand the instructions in the message. On the contrary, you'll see a `Barrier` filter on the destination chain. For security reasons, the XCM message is prepended with the `[DecendOrigin](https://github.com/paritytech/xcm-format#descendorigin)` instruction to prevent XCM execution on behalf of the origin chain sovereign account.

In the following example, you'll be building an XCM message that contains the following XCM instructions, which will be executed in the Alphanet relay chain:

- `[WithdrawAsset](https://github.com/paritytech/xcm-format#withdrawasset)` - removes assets and places them into the holding register
- `[BuyExecution](https://github.com/paritytech/xcm-format#buyexecution)` - takes the assets from holding to pay for execution fees. The fees to pay are determined by the target chain
- `[DepositAsset](https://github.com/paritytech/xcm-format#depositasset)` - removes the assets from the holding register and deposits the equivalent assets to a beneficiary account

Together, the intention of these instructions is to transfer the native asset of the relay chain, which is UNIT for the Alphanet relay chain, from  to an account on the relay chain. This example is for demonstration purposes only to show you how a custom XCM message could be sent cross-chain. Please keep in mind that the target chain needs to be able to understand the instructions in the message to execute them.

### Send an XCM Message with the Polkadot.js API

In this example, you'll send a custom XCM message from your account on  to the relay chain using the [Polkadot.js API](builders/build/substrate-api/polkadot-js-api) to interact directly with the Polkadot XCM Pallet.

The `send` function of the Polkadot XCM Pallet accepts two parameters: `dest` and `message`. You can start assembling these parameters by taking the following steps:

1.  
    
    Build the multilocation of the relay chain token, UNIT, for the `dest`:
    
    ```
    const dest = { V3: { parents: 1, interior: null } };
    
    ```
    
2.   
    
    Build the `WithdrawAsset` instruction, which will require you to define:
    
    - The multilocation of the UNIT token on the relay chain
    - The amount of UNIT tokens to withdraw
    
    ```
    const instr1 = {
      WithdrawAsset: [
        {
          id: { Concrete: { parents: 1, interior: null } },
          fun: { Fungible: 1000000000000n }, // 1 UNIT
        },
      ],
    };
    
    ```
    
3.   
    
    Build the `BuyExecution` instruction, which will require you to define:
    
    - The multilocation of the UNIT token on the relay chain
    - The amount of UNIT tokens to buy for execution
    - The weight limit
    
    ```
    const instr2 = {
      BuyExecution: [
        {
          id: { Concrete: { parents: 1, interior: null } },
          fun: { Fungible: 1000000000000n }, // 1 UNIT
        },
        { Unlimited: null }
      ],
    };
    
    ```
    
4.   
    
    Build the `DepositAsset` instruction, which will require you to define:
    
    - The multiasset identifier for UNIT tokens. You can use the `[WildMultiAsset` format](https://github.com/paritytech/xcm-format/blob/master/README.md#6-universal-asset-identifiers), which allows for wildcard matching, to identify the asset
    - The multilocation of the beneficiary account on the relay chain
    
    ```
    const instr3 = {
      DepositAsset: {
        assets: { Wild: 'All' },
        beneficiary: {
          parents: 1,
          interior: {
            X1: {
              AccountId32: {
                id: relayAccount,
              },
            },
          },
        },
      },
    };
    
    ```
    
5.  
    
    Combine the XCM instructions into a versioned XCM message:
    
    ```
    const message = { V3: [instr1, instr2, instr3] };
    
    ```
    

Now that you have the values for each of the parameters, you can write the script to send the XCM message. You'll take the following steps:

1. Provide the input data for the call. This includes:
    - The  endpoint URL to create the provider
    - The values for each of the parameters of the `send` function
2. Create a Keyring instance that will be used to send the transaction
3. Create the [Polkadot.js API](builders/build/substrate-api/polkadot-js-api/) provider
4. Craft the `polkadotXcm.send` extrinsic with the `dest` and `message`
5. Send the transaction using the `signAndSend` extrinsic and the Keyring instance you created in the second step

Remember

This is for demo purposes only. Never store your private key in a JavaScript file.

```
import { ApiPromise, WsProvider, Keyring } from '@polkadot/api'; // Version 9.13.6
import { decodeAddress } from '@polkadot/util-crypto';

// 1. Input data
const providerWsURL = 'wss://wss.api.moonbase.Moonsama Network.network';
// You can use the decodeAddress function to ensure that your address is properly
// decoded. If it isn't decoded, it will decode it and if it is, it will ignore it
const privateKey = 'INSERT_PRIVATE_KEY';
const relayAccount = decodeAddress('INSERT_ADDRESS');
const dest = { V3: { parents: 1, interior: null } };
const instr1 = {
  WithdrawAsset: [
    {
      id: { Concrete: { parents: 1, interior: null } },
      fun: { Fungible: 1000000000000n }, // 1 UNIT
    },
  ],
};
const instr2 = {
  BuyExecution: [
    {
      id: { Concrete: { parents: 1, interior: null } },
      fun: { Fungible: 1000000000000n }, // 1 UNIT
    },
    { Unlimited: null }
  ],
};
const instr3 = {
  DepositAsset: {
    assets: { Wild: 'All' },
    beneficiary: {
      parents: 1,
      interior: {
        X1: {
          AccountId32: {
            id: relayAccount,
          },
        },
      },
    },
  },
};
const message = { V3: [instr1, instr2, instr3] };

// 2. Create Keyring instance
const keyring = new Keyring({ type: 'ethereum' });
const alice = keyring.addFromUri(privateKey);

const sendXcmMessage = async () => {
  // 3. Create Substrate API Provider
  const substrateProvider = new WsProvider(providerWsURL);
  const api = await ApiPromise.create({ provider: substrateProvider });

  // 4. Create the extrinsic
  const tx = api.tx.polkadotXcm.send(dest, message);

  // 5. Send the transaction
  const txHash = await tx.signAndSend(alice);
  console.log(`Submitted with hash ${txHash}`);

  api.disconnect();
};

sendXcmMessage();

```

Note

You can view an example of the above script, which sends 1 UNIT to Bobs's relay chain account, on [Polkadot.js Apps](<https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.Moonsama> Network.network#/extrinsics/decode/0x1c00030100030c000400010000070010a5d4e81300010000070010a5d4e8000d0100010101000c36e9ba26fa63c60ec728fe75fe57b86a450d94e7fee7f9f9eddd0d3f400d67) using the following encoded calldata: `0x1c00030100030c000400010000070010a5d4e81300010000070010a5d4e8000d0100010101000c36e9ba26fa63c60ec728fe75fe57b86a450d94e7fee7f9f9eddd0d3f400d67`.

Once the transaction is processed, a `polkadotXcm.sent` event is emitted with the details of the sent XCM message.

### Send an XCM Message with the XCM Utilities Precompile

In this section, you'll use the `xcmSend` function of the [XCM Utilities Precompile](builders/pallets-precompiles/precompiles/xcm-utils), which is only supported on , to send an XCM message cross-chain. The XCM Utilities Precompile is located at the following address:



```
0x000000000000000000000000000000000000080C

```

Under the hood, the `xcmSend` function of the XCM Utilities Precompile calls the `send` function of the Polkadot XCM Pallet, which is a Substrate pallet that is coded in Rust. The benefit of using the XCM Utilities Precompile to call `xcmSend` is that you can do so via the Ethereum API and use Ethereum libraries like [Ethers.js](builders/build/eth-api/libraries/ethersjs). For the XCM message to be successfully executed, the target chain needs to be able to understand the instructions in the message.

The `xcmSend` function accepts two parameters: the multilocation of the destination and the SCALE encoded versioned XCM message to be sent.

First, you'll learn how to generate the encoded calldata for the XCM message, and then you'll learn how to use the encoded calldata to interact with the XCM Utilities Precompile.

### Generate the Encoded Calldata of an XCM Message

To get the encoded calldata of the XCM message, you can create a script similar to the one you created in the [Send an XCM Message with the Polkadot.js API](builders/interoperability/xcm/send-execute-xcm/#send-xcm-message-with-polkadotjs-api) section. Instead of building the message and sending the transaction, you'll build the message to get the encoded calldata. You'll take the following steps:

1. Provide the input data for the call. This includes:
    - The  endpoint URL to create the provider
    - The values for each of the parameters of the `send` function as defined in the [Send an XCM Message with the Polkadot.js API](builders/interoperability/xcm/send-execute-xcm/#send-xcm-message-with-polkadotjs-api) section
2. Create the [Polkadot.js API](builders/build/substrate-api/polkadot-js-api/) provider
3. Craft the `polkadotXcm.execute` extrinsic with the `message` and `maxWeight`
4. Use the transaction to get the encoded calldata

The entire script is as follows:

```
import { ApiPromise, WsProvider } from '@polkadot/api'; // Version 9.13.6
import { decodeAddress } from '@polkadot/util-crypto';

// 1. Input data
const providerWsURL = 'wss://wss.api.moonbase.Moonsama Network.network';
// You can use the decodeAddress function to ensure that your address is properly
// decoded. If it isn't decoded, it will decode it and if it is, it will ignore it
const relayAccount = decodeAddress('INSERT_ADDRESS');
const dest = { V3: { parents: 1, interior: null } };
const instr1 = {
  WithdrawAsset: [
    {
      id: { Concrete: { parents: 1, interior: null } },
      fun: { Fungible: 1000000000000n }, // 1 UNIT
    },
  ],
};
const instr2 = {
  BuyExecution: [
    {
      id: { Concrete: { parents: 1, interior: null } },
      fun: { Fungible: 1000000000000n }, // 1 UNIT
    },
    { Unlimited: null }
  ],
};
const instr3 = {
  DepositAsset: {
    assets: { Wild: 'All' },
    beneficiary: {
      parents: 1,
      interior: {
        X1: {
          AccountId32: {
            id: relayAccount,
          },
        },
      },
    },
  },
};
const message = { V3: [instr1, instr2, instr3] };

const generateEncodedXcmMessage = async () => {
  // 2. Create Substrate API Provider
  const substrateProvider = new WsProvider(providerWsURL);
  const api = await ApiPromise.create({ provider: substrateProvider });

  // 3. Create the extrinsic
  const tx = api.tx.polkadotXcm.send(dest, message);

  // 4. Get the encoded XCM message
  // By using index 1, you'll get just the encoded XCM message.
  // If you wanted to get the dest, you could use index 0
  const encodedXcmMessage = tx.args[1].toHex()
  console.log(`Encoded Calldata for XCM Message: ${encodedXcmMessage}`);

  api.disconnect();
};

generateEncodedXcmMessage();

```

### Send the XCM Message

Before you can send the XCM message, you'll also need to build the multilocation of the destination. For this example, you'll target the relay chain with  as the origin chain:

```
const dest = [
  1, // Parents: 1
  [] // Interior: Here
];

```

Now that you have the SCALE encoded XCM message and the destination multilocation, you can use the following code snippets to programmatically call the `xcmSend` function of the XCM Utilities Precompile using your [Ethereum library](builders/build/eth-api/libraries/) of choice. Generally speaking, you'll take the following steps:

1. Create a provider and signer
2. Create an instance of the XCM Utilities Precompile to interact with
3. Define parameters required for the `xcmSend` function, which will be the destination and the encoded calldata for the XCM message
4. Send the XCM message

Remember

The following snippets are for demo purposes only. Never store your private keys in a JavaScript or Python file.

Ethers.jsWeb3.jsWeb3.py

```
import ABI from './xcmUtilsABI.js'; // Import the XCM Utilities Precompile ABI
import { ethers } from 'ethers'; // Import Ethers library

const privateKey = 'INSERT_PRIVATE_KEY';
const xcmUtilsAddress = '0x000000000000000000000000000000000000080C';

/* Create Ethers provider and signer */
const provider = new ethers.providers.JsonRpcProvider(
  'https://rpc.api.moonbase.Moonsama Network.network'
);
const signer = new ethers.Wallet(privateKey, provider);

/* Create contract instance of the XCM Utilities Precompile */
const xcmUtils = new ethers.Contract(
  xcmUtilsAddress,
  ABI,
  signer
);

const sendXcm = async () => {
  /* Define parameters required for the xcmSend function */
  const encodedCalldata = 'INSERT_ENCODED_CALLDATA';
  const dest = [
    1, // Parents: 1
    [] // Interior: Here
  ];

  /* Send the custom XCM message */
  const tx = await xcmUtils.xcmSend(dest, encodedCalldata);
  await tx.wait();
  console.log(`Transaction receipt: ${tx.hash}`);
};

sendXcm();

```

And that's it! You've successfully used the Polkadot XCM Pallet and the XCM Utilities Precompile to send a message from  to another chain!
