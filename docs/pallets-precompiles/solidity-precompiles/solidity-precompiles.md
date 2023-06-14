---
sidebar_position: 1
---


# Solidity Precompiles

[https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/overview/](https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/overview/)

![img/overview-banner.png](img/overview-banner.png)

## Overview

On Moonbeam, a precompiled contract is native Substrate code that has an Ethereum-style address and can be called using the Ethereum API, like any other smart contract. The precompiles allow you to call the Substrate runtime directly which is not normally accessible from the Ethereum side of Moonbeam.

The Substrate code responsible for implementing precompiles can be found in the [EVM pallet](https://docs.moonbeam.network/learn/features/eth-compatibility/#evm-pallet). The EVM pallet includes the [standard precompiles found on Ethereum and some additional precompiles that are not specific to Ethereum](https://github.com/paritytech/frontier/tree/master/frame/evm/precompile). It also provides the ability to create and execute custom precompiles through the generic [Precompiles trait](https://paritytech.github.io/frontier/rustdocs/pallet_evm/trait.Precompile.html). There are several custom Moonbeam-specific precompiles that have been created, all of which can be found in the [Moonbeam codebase](https://github.com/PureStake/moonbeam/tree/master/precompiles).

The Ethereum precompiled contracts contain complex functionality that is computationally intensive, such as hashing and encryption. The custom precompiled contracts on Moonbeam provide access to Substrate-based functionality such as staking, governance, XCM-related functions, and more.

The Moonbeam-specific precompiles can be interacted with through familiar and easy-to-use Solidity interfaces using the Ethereum API, which are ultimately used to interact with the underlying Substrate interface. This flow is depicted in the following diagram:

![img/overview-1.png](img/overview-1.png)

Note

There can be some unintended consequences when using the precompiled contracts on Moonbeam. Please refer to the [Security Considerations](https://docs.moonbeam.network/builders/get-started/eth-compare/security) page for more information.

## Precompiled Contract Addresses

The precompiled contracts are categorized by address and based on the origin network. If you were to convert the precompiled addresses to decimal format, and break them into categories by numeric value, the categories are as follows:

- **0-1023** - [Ethereum MainNet precompiles](https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/overview/#ethereum-mainnet-precompiles)
- **1024-2047** - precompiles that are [not in Ethereum and not Moonbeam specific](https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/overview/#non-moonbeam-specific-nor-ethereum-precomiles)
- **2048-4095** - [Moonbeam specific precompiles](https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/overview/#moonbeam-specific-precompiles)

### Ethereum MainNet Precompiles

| Contract | Address |
| --- | --- |
| https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/eth-mainnet/#verify-signatures-with-ecrecover | 0x0000000000000000000000000000000000000001 |
| https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/eth-mainnet/#hashing-with-sha256 | 0x0000000000000000000000000000000000000002 |
| https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/eth-mainnet/#hashing-with-ripemd-160 | 0x0000000000000000000000000000000000000003 |
| https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/eth-mainnet/#the-identity-function | 0x0000000000000000000000000000000000000004 |
| https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/eth-mainnet/#modular-exponentiation | 0x0000000000000000000000000000000000000005 |
| https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/eth-mainnet/#bn128add | 0x0000000000000000000000000000000000000006 |
| https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/eth-mainnet/#bn128mul | 0x0000000000000000000000000000000000000007 |
| https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/eth-mainnet/#bn128pairing | 0x0000000000000000000000000000000000000008 |
| https://paritytech.github.io/frontier/rustdocs/pallet_evm_precompile_blake2/struct.Blake2F.html | 0x0000000000000000000000000000000000000009 |

### Non-Moonbeam Specific nor Ethereum Precompiles

| Contract | Address |
| --- | --- |
| https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/eth-mainnet/#hashing-with-sha3fips256 | 0x0000000000000000000000000000000000000400 |
| https://paritytech.github.io/frontier/rustdocs/pallet_evm_precompile_dispatch/struct.Dispatch.html | 0x0000000000000000000000000000000000000401 |
| https://paritytech.github.io/frontier/rustdocs/pallet_evm_precompile_simple/struct.ECRecoverPublicKey.html | 0x0000000000000000000000000000000000000402 |

### Moonbeam Specific Precompiles