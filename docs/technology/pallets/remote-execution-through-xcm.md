# Remote Execution Through XCM

🚧 This section in currently under construction 🚧 

For example, to target a parachain with ID  from another parachain, the multilocation would be an account derivated 
from the new origin set by the XCM instruction and the provided multilocation, which is typically the sovereign 
account from which the XCM originated. Derivative accounts are keyless (the private key is 
unknown). Consequently, derivative accounts related to XCM-specific use cases can only be accessed through XCM 
extrinsics. For Moonsama Network-based networks,  is calculating the  hash of the multilocation, which includes the 
origin parachain ID, and truncating the hash to the correct length (20 bytes for an Ethereum-styled account). The XCM 
call  happens when the  instruction gets executed. Consequently, each parachain can convert the origin with its own 
desired procedure, so the user who initiated the transaction might have a different derivative account per parachain. 
This derivative account pays for transaction fees, and it is set as the dispatcher of the call -  — relates to extra 
weight and fee information for the XCM remote execution part of the XCM Transactor extrinsic. This is needed because 
the XCM transaction fee is paid by the sovereign account. Therefore, XCM Transactor calculates what this fee is and 
charges the sender of the XCM Transactor extrinsic the estimated amount in the corresponding 
[XC-20 token](/docs/technology/interoperability/xc-20s-and-cross-chain-assets) to repay the sovereign account.
    

## XCM Transactor Pallet Interface

### Extrinsics

The XCM Transactor Pallet provides the following extrinsics (functions):

- **hrmpManage**(action, fee, weightInfo) - manages HRMP operations related to opening, accepting, and closing an HRMP 
channel. The given action can be any of these four actions: `InitOpen`, `Accept`, `Close`, and `Cancel`.
- **removeFeePerSecond**(assetLocation) — remove the fee per second information for a given asset in its reserve chain. 
The asset is defined as a multilocation.
- **removeTransactInfo**(location) — remove the transact information for a given chain, defined as a multilocation.
- **setFeePerSecond**(assetLocation, feePerSecond) — sets the fee per second information for a given asset on its 
reserve chain. The asset is defined as a multilocation. The `feePerSecond` is the token units per second of XCM 
execution that will be charged to the sender of the XCM Transactor extrinsic.
- **setTransactInfo**(location, transactExtraWeight, maxWeight) — sets the transact information for a given chain, 
defined as a multilocation. The transact information includes:
  - **transactExtraWeight** — weight to cover execution fees of the XCM instructions (`WithdrawAsset`, 
  `BuyExecution`, and `Transact`), which is estimated to be at least 10% over what the remote XCM instructions 
  execution uses.
  - **maxWeight** — maximum weight units allowed for the remote XCM execution.
  - **transactExtraWeightSigned** — (optional) weight to cover execution fees of the XCM instructions 
  (`DescendOrigin`, `WithdrawAsset`, `BuyExecution`, and `Transact`), which is estimated to be at least 10% over what 
  the remote XCM instructions execution uses.
- **transactThroughSigned**(destination, fee, call, weightInfo) — sends an XCM message with instructions to remotely 
execute a given call in the given destination. The remote call will be signed and executed by a new account that the 
destination parachain must derivate. For Moonsama Network-based networks, this account is the `blake2` hash of the 
descended multilocation, truncated to the correct length. The XCM Transactor Pallet calculates the fees for the remote 
execution and charges the sender of the extrinsic the estimated amount in the corresponding 
[XC-20 token](/docs/technology/interoperability/xc-20s-and-cross-chain-assets) given by the asset ID.
- **transactThroughSovereign**(destination, feePayer, fee, call, originKind, weightInfo) — sends an XCM message with 
instructions to remotely execute a given call in the given destination. The remote call will be signed by the origin 
parachain sovereign account (who pays the fees), but the transaction is dispatched from a given origin. The XCM 
Transactor Pallet calculates the fees for the remote execution and charges the given account the estimated amount in 
the corresponding [XC-20 token](/docs/technology/interoperability/xc-20s-and-cross-chain-assets) given by the asset 
multilocation.

Where the inputs that need to be provided can be defined as:

- **assetLocation** — a multilocation representing an asset on its reserve chain. The value is used to set or retrieve 
the fee per second information.
- **location** — a multilocation representing a chain in the ecosystem. The value is used to set or retrieve the 
transact information.
- **destination** — a multilocation representing a chain in the ecosystem where the XCM message is being sent to.
- **fee** — an enum that provides developers two options on how to define the XCM execution fee item. Both options 
rely on the `feeAmount`, which is the units of the asset per second of XCM execution you provide to execute the XCM 
message you are sending. The two different ways to set the fee item are:
  - **AsCurrencyID** — is the ID of the currency being used to pay for the remote call execution. Different runtimes 
  have different ways of defining the IDs. In the case of Moonsama Network-based networks, `SelfReserve` refers to 
  the native token, `ForeignAsset` refers to the asset ID of an 
  [external XC-20](builders/interoperability/xcm/xc20/overview#external-xc20s) (not to be confused with the XC-20 
  address), and `Erc20` refers to the contract address of a 
  [local XC-20](builders/interoperability/xcm/xc20/overview#local-xc20s).
  - **AsMultiLocation** — is the multilocation that represents the asset to be used for fee payment when executing 
  the XCM.
- **innerCall** — encoded call data of the call that will be executed in the destination chain. This is wrapped with 
the `asDerivative` option if transacting through the sovereign derivative account.
- **weightInfo** — a structure that contains all the weight related information. If not enough weight is provided, the 
execution of the XCM will fail, and funds might get locked in either the sovereign account or a special pallet. 
Consequently, **it is essential to correctly set the destination weight to avoid failed XCM executions**. The structure 
contains two fields:
  - **transactRequiredWeightAtMost** — weight related to the execution of the `Transact` call itself. For transacts 
  through sovereign-derivative, you have to take into account the weight of the `asDerivative` extrinsic as well. 
  However, this does not include the cost (in weight) of all the XCM instructions.
  - **overallWeight** — the total weight the XCM Transactor extrinsic can use. This includes all the XCM instructions 
  plus the weight of the call itself (**transactRequiredWeightAtMost**).
- **call** — similar to `innerCall`, but it is not wrapped with the `asDerivative` extrinsic
- **feePayer** — the address that will pay for the remote XCM execution in the transact through sovereign extrinsic. The 
fee is charged in the corresponding [XC-20 token](builders/interoperability/xcm/xc20/overview/).
- **originKind** — dispatcher of the remote call in the destination chain. There are 
[four types of dispatchers](https://github.com/paritytech/polkadot/blob/0a34022e31c85001f871bb4067b7d5f5cab91207/xcm/src/v0/mod.rs#L60) 
available.

### Storage Methods

The XCM Transactor Pallet includes the following read-only storage method:

- **destinationAssetFeePerSecond**() - returns the fee per second for an asset given a multilocation. This enables the 
conversion from weight to fee. The storage element is read by the pallet extrinsics if `feeAmount` is set to `None`.
- **palletVersion**() — returns current pallet version from storage
- **transactInfoWithWeightLimit**(location) — returns the transact information for a given multilocation. The storage 
element is read by the pallet extrinsics if `feeAmount` is set to `None`.

### Pallet Constants

The XCM Transactor Pallet includes the following read-only functions to obtain pallet constants:

- **baseXcmWeight**() - returns the base XCM weight required for execution, per XCM instruction.
- **selfLocation**() - returns the multilocation of the chain.

## XCM Transactor Transact Through Signed

This section covers building an XCM message for remote executions using the XCM Transactor Pallet, specifically with 
the `transactThroughSigned` function. However, you'll not be able to follow along as the destination parachain is not 
publicly available.

Note

You need to ensure that the call you are going to execute remotely is allowed in the destination chain!

### Checking Prerequisites

To be able to send the extrinsics in this section, you need to have:

- An account in the origin chain with [funds](builders/get-started/networks/moonbase/#get-tokens)
- Funds in the multilocation-derivative account on the target chain. You can calculate this address by using the 
[`calculate-multilocation-derivative-account.ts` script](https://github.com/PureStake/xcm-tools/blob/main/scripts/calculate-multilocation-derivative-account.ts)

For this example, the following accounts will be used:

- Alice's account in the origin parachain with address `0x44236223aB4291b93EEd10E4B511B37a398DEE55`
- Its multilocation-derivative address in the target parachain is `0x5c27c4bb7047083420eddff9cddac4a0a120b45c`

### Building the XCM

Since you'll be interacting with the `transactThroughSigned` function of the XCM Transactor Pallet, you'll need to 
assemble the `dest`, `fee`, `call`, and `weightInfo` parameters. To do so, you can take the following steps:

1. Define the destination multilocation, which will target parachain 888:

  ```js
  const dest = {
    V3: {
      parents: 1,
      interior: { X1: { Parachain: 888 } },
    },
  };
  
  ```

2. External XC-20sLocal XC-20s 
    
  Define the `fee` information, which will require you to:
  
    - Define the currency ID and provide the asset details
    - Set the fee amount
    
  ```js
  const fee = {
    currency: {
      AsCurrencyId: { ForeignAsset: 35487752324713722007834302681851459189n },
    },
    feeAmount: 50000000000000000n,
  };
  
  ```
    
3. Define the `call` that will be executed in the destination chain. This is the encoded call data of the pallet, 
method, and input values to be called. It can be constructed in [Polkadot.js Apps](https://polkadot.js.org/apps/) 
(must be connected to the destination chain) or using the 
[Polkadot.js API](builders/build/substrate-api/polkadot-js-api/). For this example, the inner call is a simple 
balance transfer of 1 token of the destination chain to Alice's account there:
    
  ```js
  const call =
    '0x030044236223ab4291b93eed10e4b511b37a398dee5513000064a7b3b6e00d';
  
  ```
    
4. Set the `weightInfo`, which includes the required `transactRequiredWeightAtMost` weight and the optional 
  `overallWeight` parameters. Both weight parameters require you to specify `refTime` and `proofSize`, where 
  `refTime` is the amount of computational time that can be used for execution and `proofSize` is the amount of 
  storage in bytes that can be used. For each parameter, you can follow these guidelines:
  
    - For `transactRequiredAtMost`, the value must include the `asDerivative` extrinsic as well. However, this does not 
    include the weight of the XCM instructions. For this example, set `refTime` to `1000000000` weight units and 
    `proofSize` to `0`.
    - For `overallWeight`, the value must be the total of **transactRequiredWeightAtMost** plus the weight needed to 
    cover the XCM instructions execution costs in the destination chain. If you do not provide this value, the pallet 
    will use the element in storage (if exists), and add it to **transactRequiredWeightAtMost**. For this example, 
    set `refTime` to `2000000000` weight units and `proofSize` to `0`.
    
    ```js
    const weightInfo = {
      transactRequiredWeightAtMost: { refTime: 1000000000n, proofSize: 0 },
      overallWeight: { refTime: 2000000000n, proofSize: 0 },
    };
    
    ```
    

Now that you have the values for each of the parameters, you can write the script for the transaction. You'll take the 
following steps:

1. Provide the input data for the call. This includes:
    - The  endpoint URL to create the provider.
    - The values for each of the parameters of the `transactThroughSigned` function.
2. Create a Keyring instance that will be used to send the transaction.
3. Create the [Polkadot.js API](https://polkadot.js.org/docs/api/start/create) provider.
4. Craft the `xcmTransactor.transactThroughSigned` extrinsic with the `dest`, `fee`, `call` and `weightInfo` values.
5. Send the transaction using the `signAndSend` extrinsic and the Keyring instance you created in the second step.

Remember this is for demo purposes only. Never store your private key in a JavaScript file.

```js
import { ApiPromise, WsProvider, Keyring } from '@polkadot/api'; // Version 9.13.6

// 1. Provide input data
const providerWsURL = 'wss://rpc.moonsama.com/ws';
const privateKey = 'INSERT_PRIVATE_KEY';
const dest = {
  V3: {
    parents: 1,
    interior: { X1: { Parachain: 888 } },
  },
};
const fee = {
  currency: {
    AsCurrencyId: { ForeignAsset: 35487752324713722007834302681851459189n },
  },
  feeAmount: 50000000000000000n,
};
const call = '0x030044236223ab4291b93eed10e4b511b37a398dee5513000064a7b3b6e00d';
const weightInfo = {
  transactRequiredWeightAtMost: { refTime: 1000000000n, proofSize: 0 },
  overallWeight: { refTime: 2000000000n, proofSize: 0 },
};

// 2. Create Keyring instance
const keyring = new Keyring({ type: 'ethereum' });
const alice = keyring.addFromUri(privateKey);

const transactThroughSigned = async () => {
  // 3. Create Substrate API provider
  const substrateProvider = new WsProvider(providerWsURL);
  const api = await ApiPromise.create({ provider: substrateProvider });

  // 4. Craft the extrinsic
  const tx = api.tx.xcmTransactor.transactThroughSigned(
    dest,
    fee,
    call,
    weightInfo
  );

  // 5. Send the transaction
  const txHash = await tx.signAndSend(alice);
  console.log(`Submitted with hash ${txHash}`);

  api.disconnect();
};

transactThroughSigned();

```

> **FIXME**

You can view an example of the above script, which sends 1 xcUNIT to Alice's account on the relay chain, on 
[Polkadot.js.org](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frpc.moonsama.com%2Fws#/extrinsics/decode/0x210603010100e10d00017576e5e612ff054915d426c546b1b21a010000c52ebca2b10000000000000000007c030044236223ab4291b93eed10e4b511b37a398dee5513000064a7b3b6e00d02286bee0001030094357700) 
using the following encoded calldata: `0x210603010100e10d00017576e5e612ff054915d426c546b1b21a010000c52ebca2b10000000000000000007c030044236223ab4291b93eed10e4b511b37a398dee5513000064a7b3b6e00d02286bee0001030094357700`.

Once the transaction is processed, Alice should've received one token in her address on the destination chain.

## XCM Transactor Precompile

The XCM Transactor Precompile contract allows developers to access the XCM Transactor Pallet features through the 
Ethereum API of Moonsama Network-based networks. Similar to other 
[precompile contracts](/docs/technology/solidity-precompiles/), the XCM Transactor Precompile is located at the 
following addresses:

The XCM Transactor Legacy Precompile is still available on all Moonsama Network-based networks. However, **the legacy 
version will be deprecated in the near future**, so all implementations must migrate to the newer interface. The XCM 
Transactor Legacy Precompile is located at the following addresses:

### The XCM Transactor Solidity Interface

> **NOTE:** we don't have this

[XcmTransactor.sol](https://github.com/moonsama/moonsama-network/blob/main/precompiles/xcm-transactor/src/v2/XcmTransactorV2.sol) 
is an interface through which developers can interact with the XCM Transactor Pallet using the Ethereum API.

The interface includes the following functions:

- **indexToAccount**(*uint16* index) — read-only function that returns the registered address authorized to operate 
using a derivative account of the Moonsama Network-based network sovereign account for the given index.
- **transactInfoWithSigned**(*Multilocation* *memory* multilocation) — read-only function that, for a given chain 
defined as a multilocation, returns the transact information considering the three XCM instructions associated with 
the external call execution (`transactExtraWeight`). It also returns extra weight information associated with the 
`DescendOrigin` XCM instruction for the transact through signed extrinsic (`transactExtraWeightSigned`).
- **feePerSecond**(*Multilocation* *memory* multilocation) — read-only function that, for a given asset as a 
multilocation, returns units of token per second of the XCM execution that is charged as the XCM execution fee. This is
useful when, for a given chain, there are multiple assets that can be used for fee payment.
- **transactThroughSignedMultilocation**(*Multilocation* *memory* dest, *Multilocation* *memory* feeLocation, 
*uint64* transactRequiredWeightAtMost, *bytes* *memory* call, *uint256* feeAmount, *uint64* overallWeight) — function 
that represents the `transactThroughSigned` method described in the 
[previous example](#xcm-transactor-transact-through-signed), setting 
the **fee** type to **AsMultiLocation**. You need to provide the asset multilocation of the token that is used for 
fee payment instead of the XC-20 token `address`.
- **transactThroughSigned**(*Multilocation* *memory* dest, *address* feeLocationAddress, 
*uint64* transactRequiredWeightAtMost, *bytes* *memory* call, *uint256* feeAmount, *uint64* overallWeight) — function 
that represents the `transactThroughSigned` method described in the 
[previous example](#xcm-transactor-transact-through-signed), setting the 
**fee** type to **AsCurrencyId**. Instead of the asset ID, you'll need to provide the <!-- FIXME: broken link -->
[asset XC-20 address](/docs/technology/interoperability/xcm/xc20/overview/#current-xc20-assets) of the token that is 
used for fee payment.
- **encodeUtilityAsDerivative**(*uint8* transactor, *uint16* index, *bytes memory* innerCall) - encodes an 
`asDerivative` wrapped call given the transactor to be used, the index of the derivative account, and the inner call 
to be executed from the derivated address.

### Building the Precompile Multilocation

In the XCM Transactor Precompile interface, the `Multilocation` structure is defined as follows:

Note that each multilocation has a `parents` element, defined in this case by a `uint8`, and an array of bytes. Parents 
refer to how many "hops" in the upwards direction you have to do if you are going through the relay chain. Being a 
`uint8`, the normal values you would see are:

The bytes array (`bytes[]`) defines the interior and its content within the multilocation. The size of the array defines
the `interior` value as follows:

Suppose the bytes array contains data. Each element's first byte (2 hexadecimal numbers) corresponds to the selector of 
that `XN` field. For example:

Next, depending on the selector and its data type, the following bytes correspond to the actual data being provided. 
Note that for `AccountId32`, `AccountIndex64`, and `AccountKey20`, the `network` field seen in the Polkadot.js Apps 
example is appended at the end. For example:

The following code snippet goes through some examples of `Multilocation` structures, as they would need to be fed into 
the XCM Transactor Precompile functions:

> **TODO**
