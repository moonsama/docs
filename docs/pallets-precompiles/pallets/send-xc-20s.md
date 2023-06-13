# Send XC-20s to Other Chains

[https://docs.moonbeam.network/builders/interoperability/xcm/xc20/xtokens/#x-tokens-pallet-interface](https://docs.moonbeam.network/builders/interoperability/xcm/xc20/xtokens/#x-tokens-pallet-interface)

![img/xtokens-banner.png](img/xtokens-banner.png)

- 
    - - refers to how many "hops" into a parent blockchain you need to take from a given origin
    - `interior` - refers to how many fields you need to define the target point.
    
    For example, to target a parachain with ID `1000` from another parachain, the multilocation would be `{ "parents": 1, "interior": { "X1": [{ "Parachain": 1000 }]}}`
    

## X-Tokens Pallet Interface

### Extrinsics

The X-Tokens Pallet provides the following extrinsics (functions):

- **transfer**(currencyId, amount, dest, destWeightLimit) — transfer a currency, defined as either the native token (self reserved), or with the asset ID
- **transferMultiasset**(asset, dest, destWeightLimit) — transfer a fungible asset, defined by its multilocation
- **transferMultiassetWithFee**(asset, fee, dest, destWeightLimit) — transfer a fungible asset, but it allows the sender to pay the fee with a different asset. Both are defined by their multilocation
- **transferMultiassets**(assets, feeItem, dest, destWeightLimit) — transfer several fungible assets, specifying which is used as the fee. Each asset is defined by its multilocation
- **transferMulticurrencies**(currencies, feeItem, dest, destWeightLimit) — transfer different currencies, specifying which is used as the fee. Each currency is defined as either the native token (self reserved) or with the asset ID
- **transferWithFee**(currencyId, amount, fee, dest, destWeightLimit) — transfer a currency, but it allows the sender to pay the fee with a different asset. Both are defined by their multilocation

Where the inputs that need to be provided can be defined as:

- 
    
    **currencyId/currencies** — the ID/IDs of the currency/currencies being sent via XCM. Different runtimes have different ways to define the IDs. In the case of Moonbeam-based networks, a currency can be defined as one of the following:
    
    - `SelfReserve` - refers to the native token
    - `ForeignAsset` - refers to the asset ID of an [External XC-20](https://docs.moonbeam.network/builders/interoperability/xcm/xc20/overview/#external-xc20s) (not to be confused with the XC-20 address)
    - `LocalAssetReserve` - refers to the asset ID of a [Mintable XC-20](https://docs.moonbeam.network/builders/interoperability/xcm/xc20/mintable-xc20) (not to be confused with the XC-20 address). It is recommended to use [Local XC-20s](https://docs.moonbeam.network/builders/interoperability/xcm/xc20/overview/#local-xc20s) instead via the `Erc20` currency type
    - `Erc20` - refers to the contract address of a [Local XC-20 (ERC-20)](https://docs.moonbeam.network/builders/interoperability/xcm/xc20/overview/#local-xc20s)
- 
    
    **amount** — the number of tokens that are going to be sent via XCM
    
- **dest** — a multilocation to define the destination address for the tokens being sent via XCM. It supports different address formats, such as 20 or 32-byte addresses (Ethereum or Substrate)
- 
    
    **destWeightLimit** — an enum that represents the maximum amount of execution time you want to provide in the destination chain to execute the XCM message being sent. The enum contains the following options:
    
    - `Unlimited` - allows for the entire amount used for gas to be used to pay for weight
    - `Limited` - limits the amount used for gas to a particular value
    
    If not enough weight is provided, the execution of the XCM will fail, and funds might get locked in either the Sovereign account or a special pallet. **It is important to correctly set the destination weight to avoid failed XCM executions**
    
- 
    
    **asset/assets** — a multilocation to define the asset/assets being sent via XCM. Each parachain has a different way to reference assets. For example, Moonbeam-based networks reference their native tokens with the Balances Pallet index
    
- **fee** — a multilocation to define the asset used to pay for the XCM execution in the target chain
- **feeItem** — an index to define the asset position of an array of assets being sent, used to pay for the XCM execution in the target chain. For example, if only one asset is being sent, the `feeItem` would be `0`

### Storage Methods

The X-Tokens Pallet includes the following read-only storage method:

- **palletVersion**() - provides the version of the X-Tokens Pallet being used

### Pallet Constants

The X-Tokens Pallet includes the following read-only functions to obtain pallet constants:

- **baseXcmWeight**() - returns the base XCM weight required for execution
- **selfLocation**() - returns the multilocation of the chain

## Building an XCM Message with the X-Tokens Pallet

This guide covers the process of building an XCM message using the X-Tokens Pallet, more specifically, with the `transfer` and `transferMultiasset` functions. Nevertheless, these two cases can be extrapolated to the other functions, especially once you become familiar with multilocations.

Note

Each parachain can allow/forbid specific methods from a pallet. Consequently, developers must ensure that they use methods that are allowed. On the contrary, the transaction will fail with an error similar to `system.CallFiltered`.

You'll be transferring xcUNIT tokens, which are the [XC-20](https://docs.moonbeam.network/builders/interoperability/xcm/xc20/overview) representation of the Alphanet relay chain token, UNIT. You can adapt this guide for any other XC-20.

### Checking Prerequisites

To follow along with the examples in this guide, you need to have the following:

- An account with funds. You can get DEV tokens for testing on Moonbase Alpha once every 24 hours from the [Moonbase Alpha Faucet](https://faucet.moonbeam.network/)
- 
    
    Some xcUNIT tokens. You can swap DEV tokens (Moonbase Alpha's native token) for xcUNITs on [Moonbeam-Swap](https://moonbeam-swap.netlify.app/#/swap), a demo Uniswap-V2 clone on Moonbase Alpha
    
    ![img/xtokens-1.png](img/xtokens-1.png)
    

To check your xcUNIT balance, you can add the XC-20 to MetaMask with the following address:

```
0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080

```

Note

If you're interested in how the precompile address is calculated, you can check out the [Calculate External XC-20 Precompile Addresses](https://docs.moonbeam.network/builders/interoperability/xcm/xc20/overview/#calculate-xc20-address) guide.

You can adapt this guide for another [external XC-20 or a local XC-20](https://docs.moonbeam.network/builders/interoperability/xcm/xc20/overview). If you're adapting this guide for another external XC-20, you'll need to have the asset ID of the asset you're transferring and the number of decimals the asset has, which you can get by following the [Retrieve List of External XC-20s](https://docs.moonbeam.network/builders/interoperability/xcm/xc20/overview/#list-xchain-assets) guide. If you're adapting this guide for a local XC-20, you'll need to have the contract address of the XC-20.

### X-Tokens Transfer Function

In this example, you'll build an XCM message to transfer xcUNIT from Moonbase Alpha back to its relay chain through the `transfer` function of the X-Tokens Pallet. To do this, you can use the [Polkadot.js API](https://docs.moonbeam.network/builders/build/substrate-api/polkadot-js-api).

Since you'll be interacting with the `transfer` function of the X-Tokens Pallet, you can take the following steps to gather the arguments for the `currencyId`, `amount`, `dest`, and `destWeightLimit`:

1.  External XC-20Local XC-20 
    
    Define the `currencyId`. For external XC-20s, you'll use the `ForeignAsset` currency type and the asset ID of the asset, which in this case is `42259045809535163221576417993425387648`. For a local XC-20, you'll need the address of the token. In JavaScript, this translates to:
    
    ```
    const currencyId = {
      ForeignAsset: {
        ForeignAsset: 42259045809535163221576417993425387648n
      }
    };
    
    ```
    
2.  
    
    Specify the `amount` to transfer. For this example, you are sending 1 xcUNIT, which has 12 decimals:
    
    ```
    const amount = 1000000000000n;
    
    ```
    
3.    
    
    Define the multilocation of the destination, which will target an account on the relay chain from Moonbase Alpha. Note that the only asset that the relay chain can receive is its own:
    
    ```
    const dest = {
      V3: {
        parents: 1,
        interior: { X1: { AccountId32: { id: relayAccount } } }
      }
    };
    
    ```
    
    Note
    
    For an `AccountId32`, `AccountIndex64`, or `AccountKey20`, you have the option of specify a `network` parameter. If you don't specify one, it will default to `None`.
    
4.      
    
    Set the `destWeightLimit` to `Unlimited`. In JavaScript, you'll need to set `Unlimited` to `null` (as outlined in the [TypeScript interface for `XcmV3WeightLimit`](https://github.com/PureStake/moonbeam/blob/v0.31.1/typescript-api/src/moonbase/interfaces/augment-api-tx.ts#L5796)):
    
    ```
    const destWeightLimit = { Unlimited: null };
    
    ```
    
    Note
    
    If you wanted to limit the destination weight, you could do so by using `Limited`, which requires you to enter values for `refTime` and `proofSize`. Where `refTime` is the amount of computational time that can be used for execution and `proofSize` is the amount of storage in bytes that can be used.
    
    In JavaScript, this translates to:
    
    ```
    { Limited: { refTime: 'INSERT_ALLOWED_AMOUNT', proofSize: 'INSERT_ALLOWED_AMOUNT' } };
    
    ```
    

Now that you have the values for each of the parameters, you can write the script for the transfer. You'll take the following steps:

1. Provide the input data for the call. This includes:
    - The Moonbase Alpha endpoint URL to create the provider
    - The values for each of the parameters of the `transfer` function
2. Create a Keyring instance that will be used to send the transaction
3. Create the [Polkadot.js API](https://docs.moonbeam.network/builders/build/substrate-api/polkadot-js-api/) provider
4. Craft the `xTokens.transfer` extrinsic with the `currencyId`, `amount`, `dest`, and `destWeightLimit`
5. Send the transaction using the `signAndSend` extrinsic and the Keyring instance you created in the second step

Remember

This is for demo purposes only. Never store your private key in a JavaScript file.

Once the transaction is processed, the target account on the relay chain should have received the transferred amount minus a small fee that is deducted to execute the XCM on the destination chain.

### X-Tokens Transfer MultiAsset Function

In this example, you'll build an XCM message to transfer xcUNIT from Moonbase Alpha back to its relay chain using the `transferMultiasset` function of the X-Tokens Pallet.

Since you'll be interacting with the `transferMultiasset` function of the X-Tokens Pallet, you can take the following steps to gather the arguments for the `asset`, `dest`, and `destWeightLimit`:

1.  External XC-20Local XC-20 
    
    Define the XCM asset multilocation of the `asset`, which will target UNIT tokens in the relay chain from Moonbase Alpha as the origin. Each chain sees its own asset differently. Therefore, you will have to set a different asset multilocation for each destination
    
    ```
    // Multilocation for UNIT in the relay chain
    const asset = {
      V3: {
        id: {
          Concrete: {
            parents: 1,
            interior: null,
          },
        },
        fun: {
          Fungible: { Fungible: 1000000000000n }, // 1 token
        },
      },
    };
    
    ```
    
2.    
    
    Define the XCM destination multilocation of the `dest`, which will target an account in the relay chain from Moonbase Alpha as the origin:
    
    ```
    const dest = {
      V3: {
        parents: 1,
        interior: { X1: { AccountId32: { id: relayAccount } } },
      },
    };
    
    ```
    
    Note
    
    For an `AccountId32`, `AccountIndex64`, or `AccountKey20`, you have the option of specify a `network` parameter. If you don't specify one, it will default to `None`.
    
3.      
    
    Set the destination weight limit to `Unlimited`. In JavaScript, you'll need to set `Unlimited` to `null` (as outlined in the [TypeScript interface for `XcmV3WeightLimit`](https://github.com/PureStake/moonbeam/blob/v0.31.1/typescript-api/src/moonbase/interfaces/augment-api-tx.ts#L5796)):
    
    ```
    const destWeightLimit = { Unlimited: null };
    
    ```
    
    Note
    
    If you wanted to limit the destination weight, you could do so by using `Limited`, which requires you to enter values for `refTime` and `proofSize`. Where `refTime` is the amount of computational time that can be used for execution and `proofSize` is the amount of storage in bytes that can be used.
    
    In JavaScript, this translates to:
    
    ```
    { Limited: { refTime: 'INSERT_ALLOWED_AMOUNT', proofSize: 'INSERT_ALLOWED_AMOUNT' } };
    
    ```
    

Now that you have the values for each of the parameters, you can write the script for the transfer. You'll take the following steps:

1. Provide the input data for the call. This includes:
    - The Moonbase Alpha endpoint URL to create the provider
    - The values for each of the parameters of the `transferMultiasset` function
2. Create a Keyring instance that will be used to send the transaction
3. Create the [Polkadot.js API](https://docs.moonbeam.network/builders/build/substrate-api/polkadot-js-api/) provider
4. Craft the `xTokens.transferMultiasset` extrinsic with the `asset`, `dest`, and `destWeightLimit`
5. Send the transaction using the `signAndSend` extrinsic and the Keyring instance you created in the second step

Once the transaction is processed, the account on the relay chain should have received the transferred amount minus a small fee that is deducted to execute the XCM on the destination chain.

## X-Tokens Precompile

The X-Tokens Precompile contract allows developers to access XCM token transfer features through the Ethereum API of Moonbeam-based networks. As with other [precompile contracts](https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/), the X-Tokens Precompile is located at the following addresses:

### The X-Tokens Solidity Interface

[Xtokens.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/xtokens/Xtokens.sol) is an interface through which developers can interact with the X-Tokens Pallet using the Ethereum API.

The interface includes the following functions:

- 
    
    **transfer**(*address* currencyAddress, *uint256* amount, *Multilocation* *memory* destination, *uint64* weight) — function that represents the `transfer` method described in the [previous example](https://docs.moonbeam.network/builders/interoperability/xcm/xc20/xtokens/#xtokens-transfer-function). Instead of using the currency ID, you'll need to provide the asset's address for the `currencyAddress`:
    
    - For [External XC-20s](https://docs.moonbeam.network/builders/interoperability/xcm/xc20/overview/#external-xc20s), provide the [XC-20 precompile address](https://docs.moonbeam.network/builders/interoperability/xcm/xc20/overview/#current-xc20-assets)
    - For native tokens (i.e., GLMR, MOVR, and DEV), provide the [ERC-20 precompile](https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/erc20/#the-erc20-interface) address, which is `0x0000000000000000000000000000000000000802`
    - For [Local XC-20s](https://docs.moonbeam.network/builders/interoperability/xcm/xc20/overview/#local-xc20s), provide the token's address
    
    The `destination` multilocation is built in a particular way that is described in the following section
    
- 
    
    **transferMultiasset**(*Multilocation* *memory* asset, *uint256* amount, *Multilocation* *memory* destination, *uint64* weight) — function that represents the `transferMultiasset` method described in the [previous example](https://docs.moonbeam.network/builders/interoperability/xcm/xc20/xtokens/#xtokens-transfer-multiasset-function). Both multilocations are built in a particular way that is described in the following section
    

### Building the Precompile Multilocation

In the X-Tokens Precompile interface, the `Multilocation` structure is defined as follows:

Note that each multilocation has a `parents` element, defined in this case by a `uint8`, and an array of bytes. Parents refer to how many "hops" in the upwards direction you have to do if you are going through the relay chain. Being a `uint8`, the normal values you would see are:

The bytes array (`bytes[]`) defines the interior and its content within the multilocation. The size of the array defines the `interior` value as follows:

Suppose the bytes array contains data. Each element's first byte (2 hexadecimal numbers) corresponds to the selector of that `XN` field. For example:

Next, depending on the selector and its data type, the following bytes correspond to the actual data being provided. Note that for `AccountId32`, `AccountIndex64`, and `AccountKey20`, the `network` field seen in the Polkadot.js Apps example is appended at the end. For example:

The following code snippet goes through some examples of `Multilocation` structures, as they would need to be fed into the X-Tokens Precompile functions:

### Using Libraries to Interact with X-Tokens

The Multilocation structs can be formatted like any other struct when using libraries to interact with the Ethereum API. The following code snippet include the previous [X-Tokens transfer function](https://docs.moonbeam.network/builders/interoperability/xcm/xc20/xtokens/#xtokens-transfer-function), the [X-Tokens multiasset transfer function](https://docs.moonbeam.network/builders/interoperability/xcm/xc20/xtokens/#xtokens-transfer-multiasset-function), and sample Multilocation struct examples. You can find the [X-Tokens ABI on Github](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/xtokens/abi.js).