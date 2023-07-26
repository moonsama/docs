---
sidebar_position: 1
---

# Solidity Precompiles

## Overview

On Moonsama Network, a precompiled contract is native Substrate code that has an Ethereum-style address and can be called using the Ethereum API, like any other smart contract. The precompiles allow you to call the Substrate runtime directly which is not normally accessible from the Ethereum side of Moonsama Network.

The Substrate code responsible for implementing precompiles can be found in the [EVM pallet](learn/features/eth-compatibility/#evm-pallet). The EVM pallet includes the [standard precompiles found on Ethereum and some additional precompiles that are not specific to Ethereum](https://github.com/paritytech/frontier/tree/master/frame/evm/precompile). It also provides the ability to create and execute custom precompiles through the generic [Precompiles trait](https://paritytech.github.io/frontier/rustdocs/pallet_evm/trait.Precompile.html). There are several custom Moonsama Network-specific precompiles that have been created, all of which can be found in the [Moonsama Network codebase](/tree/master/precompiles).

The Ethereum precompiled contracts contain complex functionality that is computationally intensive, such as hashing and encryption. The custom precompiled contracts on Moonsama Network provide access to Substrate-based functionality such as staking, governance, XCM-related functions, and more.

The Moonsama Network-specific precompiles can be interacted with through familiar and easy-to-use Solidity interfaces using the Ethereum API, which are ultimately used to interact with the underlying Substrate interface. This flow is depicted in the following diagram:

Note

There can be some unintended consequences when using the precompiled contracts on Moonsama Network. Please refer to the [Security Considerations](builders/get-started/eth-compare/security) page for more information.

## Precompiled Contract Addresses

The precompiled contracts are categorized by address and based on the origin network. If you were to convert the precompiled addresses to decimal format, and break them into categories by numeric value, the categories are as follows:

- **0-1023** - [Ethereum MainNet precompiles](builders/pallets-precompiles/precompiles/overview/#ethereum-mainnet-precompiles)
- **1024-2047** - precompiles that are [not in Ethereum and not Moonsama Network specific](builders/pallets-precompiles/precompiles/overview/#non-Moonsama Network-specific-nor-ethereum-precomiles)
- **2048-4095** - [Moonsama Network specific precompiles](builders/pallets-precompiles/precompiles/overview/#Moonsama Network-specific-precompiles)

### Ethereum MainNet Precompiles

| Contract | Address |
| --- | --- |
| builders/pallets-precompiles/precompiles/eth-mainnet/#verify-signatures-with-ecrecover | 0x0000000000000000000000000000000000000001 |
| builders/pallets-precompiles/precompiles/eth-mainnet/#hashing-with-sha256 | 0x0000000000000000000000000000000000000002 |
| builders/pallets-precompiles/precompiles/eth-mainnet/#hashing-with-ripemd-160 | 0x0000000000000000000000000000000000000003 |
| builders/pallets-precompiles/precompiles/eth-mainnet/#the-identity-function | 0x0000000000000000000000000000000000000004 |
| builders/pallets-precompiles/precompiles/eth-mainnet/#modular-exponentiation | 0x0000000000000000000000000000000000000005 |
| builders/pallets-precompiles/precompiles/eth-mainnet/#bn128add | 0x0000000000000000000000000000000000000006 |
| builders/pallets-precompiles/precompiles/eth-mainnet/#bn128mul | 0x0000000000000000000000000000000000000007 |
| builders/pallets-precompiles/precompiles/eth-mainnet/#bn128pairing | 0x0000000000000000000000000000000000000008 |
| <https://paritytech.github.io/frontier/rustdocs/pallet_evm_precompile_blake2/struct.Blake2F.html> | 0x0000000000000000000000000000000000000009 |

### Non-Moonsama Network Specific nor Ethereum Precompiles

| Contract | Address |
| --- | --- |
| builders/pallets-precompiles/precompiles/eth-mainnet/#hashing-with-sha3fips256 | 0x0000000000000000000000000000000000000400 |
| <https://paritytech.github.io/frontier/rustdocs/pallet_evm_precompile_dispatch/struct.Dispatch.html> | 0x0000000000000000000000000000000000000401 |
| <https://paritytech.github.io/frontier/rustdocs/pallet_evm_precompile_simple/struct.ECRecoverPublicKey.html> | 0x0000000000000000000000000000000000000402 |

### Moonsama Network Specific Precompiles
