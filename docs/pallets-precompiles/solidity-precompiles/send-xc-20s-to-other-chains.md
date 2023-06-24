# Send XC-20s to Other Chains


![img/xtokens-banner.png](img/xtokens-banner.png)

- 
    
    ![img/xtokens-1.png](img/xtokens-1.png)
    

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