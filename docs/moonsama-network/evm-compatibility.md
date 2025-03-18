---
sidebar_position: 2
description: Empowering builders with familiar tooling
---

:::warning 
The development of Moonsama Network was discontinued. The documentation of the chain however is preserved to keep track of history. Please note that this information is not relevant any more. Contributors of the [crowdloan](https://parachains.info/details/moonsama) can connect their EVM addresses and receive their rewards on [https://crowdloan.moonsama.com/](https://crowdloan.moonsama.com/).
:::

# EVM Compatibility

Moonsama Network uses a "unified" account system. That means a single account can be used to modify state using 
both EVM and native Substrate interfaces. 

The unified account system uses the Secp256k1 curve for its cryptography and "Etheruem-style" addresses (42 character
hexidecimal string, or 20 bytes), to ensure maximum EVM compatibility.

Example address: `0xc0ffee254729296a45a3885639AC7E10F9d54979`.

## Pallets & Precompiles

Native Substrate runtime logic is implemented in [FRAME pallets](https://docs.substrate.io/reference/frame-pallets/) and
can be accessed using the 
[Substrate extrinsics interface](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frpc.moonsama.com%2Fws#/extrinsics) 
or with a suitable Polkadot client library (e.g. [`@polkadot/api`](https://www.npmjs.com/package/@polkadot/api)).
These are not exposed to the EVM RPC interface of Moonsama Network by default. Where necessary Moonsama Network
provides Solidity Precompiles, much like other EVM chains provide their own precompiles (e.g. `ecrecover` and `sha256`),
which are accessible to Solidity developers and end-users alike (they exist at a particular address in the EVM).

These precompiles provide a thin wrapper around the pallet interface, to allow Solidity developers and EVM users to 
access and modify the state of the native Substrate runtime. 

![Pallets & Precompiles](./img/pallets-precompiles.png)

For information on the pallets available on Moonsama Network, see [Pallets](/docs/category/pallets).

For information on the Solidity precompiles available on Moonsama Network, see 
[Solidity Precompiles](/docs/category/solidity-precompiles/).

## Smart Contracts

Moonsama Network is open to builders and offers multiple ways to incorporate applications into the runtime.

Through the EVM RPC interface, Solidity developers can create smart contracts in the same way they can for other 
EVM networks. 

Through the Contracts pallet, ink! developers can create smart contracts just like on other Polkadot parachains. 

## Event Data

When modifying state on Moonsama Network, it is often useful to receive and store events which confirm the 
result and additional data of the state modification. This is a practice particularly important for DApps that rely
on on-chain data, but where large amounts of reads can be expensive (computationally). Such DApps commonly use
an "indexer", software which is continuously monitoring chain state and saving changes to a local database. Examples
of indexing software includes Subsquid (both Substrate and EVM) and TheGraph (EVM only).

![Events](./img/events.png)

When modifying state through a Solidity precompile, the precompiled contract will produce receipts containing logs
with the event data. The pallet will also produce its own event data as a result of the state modification. For the 
indexing software, it is important to be aware that precompiles will not be able to capture all possible event data.

For that reason, Moonsama provides a set of default indexers for the most important pallets on Moonsama Network. These 
are implemented using Subsquid to help developers capture the data they need without reinventing the wheel.
