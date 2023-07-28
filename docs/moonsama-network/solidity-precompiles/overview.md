---
sidebar_position: 1
description: Available Precompiles
---

# Overview

On Moonsama Network, a precompiled contract is native Substrate code that has an Ethereum-style address and can be
called using the Ethereum API, like any other smart contract. The precompiles allow you to call the Substrate runtime
directly which is not normally accessible from the Ethereum side of Moonsama Network.

The EVM on Moonsama includes a
[default set of precompiles](https://github.com/moonsama/frontier/tree/master/frame/evm/precompile). They typically 
expose computationally expensive functionality, like hashing and encryption, to smart contract developers.  

There are also several custom Moonsama Network-specific precompiles that are available at launch, to aid
interaction with native Substrate modules ([see pallets](/docs/category/pallets)). The precompiles can be interacted 
with through familiar and easy-to-use Solidity interfaces using the Ethereum API, to access native Substrate 
functionality such as staking, governance, XCM, tokens and trading.

The aforementioned interaction between users, pallets and precompiles is depicted in the following diagram:

![Pallets & Precompiles](../img/pallets-precompiles.png)

<!--:::note
There can be some unintended consequences when using the precompiled contracts on Moonsama Network. Please refer to the
[Security Considerations](builders/get-started/eth-compare/security) page for more information.
:::-->

## Precompiled Contract Addresses

### Ethereum MainNet Precompiles

Usage information can be found at [Ethereum Precompiles](./ethereum).

| Contract | Address |
| --- | --- |
| ECRecover | `0x0000000000000000000000000000000000000001` |
| Sha256 | `0x0000000000000000000000000000000000000002` |
| Ripemd160 | `0x0000000000000000000000000000000000000003` |
| Identity | `0x0000000000000000000000000000000000000004` |
| Modexp | `0x0000000000000000000000000000000000000005` |
| Bn128Add | `0x0000000000000000000000000000000000000006` |
| Bn128Mul | `0x0000000000000000000000000000000000000007` |
| Bn128Pairing | `0x0000000000000000000000000000000000000008` |
| Blake2F | `0x0000000000000000000000000000000000000009` |

### Additional Precompiles

Usage information can be found at [Ethereum Precompiles](./ethereum).

| Contract | Address |
| --- | --- |
| Sha3FIPS256 | `0x0000000000000000000000000000000000000400` |
| Dispatch | `0x0000000000000000000000000000000000000401` |
| ECRecoverPublicKey | `0x0000000000000000000000000000000000000402` |
| Ed25519Verify | `0x0000000000000000000000000000000000000403` |

### Moonsama Network-specific Precompiles

| Contract | Address |
| --- | --- |
| [SAMA ERC-20](/docs/moonsama-network/solidity-precompiles/sama-erc20) | `0x0000000000000000000000000000000000000800` |
| [X-Tokens](/docs/moonsama-network/solidity-precompiles/x-tokens) | `0x0000000000000000000000000000000000000801` |
| [Call Permit](/docs/moonsama-network/solidity-precompiles/call-permit) | `0x0000000000000000000000000000000000000802` |
| [Randomness](/docs/moonsama-network/solidity-precompiles/randomness) | `0x0000000000000000000000000000000000000803` |
| Crowdloan Rewards | `0x0000000000000000000000000000000000000804` |
| [Batch](/docs/moonsama-network/solidity-precompiles/batch) | `0x0000000000000000000000000000000000000805` |
| Mint | `0x0000000000000000000000000000000000000806` |


### Moonsama Network-specific Precompile Sets

In addition to standalone precompiles, Moonsama Network features a dynamic set of asset precompiles. These precompiles 
sets are added to whenever a new asset class (e.g. XC-20 or Multi-Token collection) is created. They have a special 
prefix pertaining to their type and are suffixed with a unique identifer.

| Contract | Address Prefix |
| --- | --- |
| Foreign Asset | `0xffffffff` |
| Local Asset | `0xfffffffe` |
| [Multi-token Collection](/docs/moonsama-network/solidity-precompiles/multi-token) | `0xfffffffa` |

For example, when a new collection is created in the [Multi-Token pallet](/docs/moonsama-network/pallets/multi-token),
it will get assigned a unique identifier (incrementing starting from 1). To derive the collection precompile address,
we take the appropriate prefix (`0xfffffffa`) and add the collection ID in hex-encoded, big endian format.

| Contract | Address |
| --- | --- |
| Collection Factory | `0xfffffffa00000000000000000000000000000000` |
| Collection 1 | `0xfffffffa00000000000000000000000000000001` |
| Collection 1000 | `0xfffffffa000000000000000000000000000003e8` |
