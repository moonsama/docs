---
sidebar_position: 1
description: Available pallets
---

# Overview

Pallets are native runtime modules on the Moonsama Network that enable our token-based runtime logic and governance.
They can hook into various parachain utilities, such as the native SAMA token, staking and more. They can interact
with EVM and WASM smart contracts. They can even send messages to other parachains via [XCM](/docs/category/xcm).

## Available Pallets

| Name| Description |
| --- | --- |
| Asset Manager | Permissioned currency management |
| [Assets](https://docs.rs/pallet-assets/latest/pallet_assets/) | Currencies |
| [Balances](https://paritytech.github.io/substrate/master/pallet_balances/index.html) | SAMA currency |
| [Contracts](https://docs.rs/pallet-contracts/latest/pallet_contracts/) | WASM smart contracts |
| Crowdloan Rewards | Claim rewards for crowdloan participation |
| [DMP Queue](https://github.com/paritytech/cumulus/blob/master/pallets/dmp-queue/src/lib.rs) | Downward Message Passing queue used for XCM |
| [Ethereum](./ethereum) | EVM block and transaction processing |
| [EVM](./evm) | Ethereum Virtual Machine runtime implementation |
| Free Calls Registry | Permits an account a quota of calls without fees |
| [Identity](https://docs.rs/pallet-identity/latest/pallet_identity/) | Maps on-chain identity |
| Local Assets | Currencies on Moonsama Network |
| Maintenance Mode | Toggle maintenance mode for Moonsama Network |
| Minting | Permissioned token minting |
| [Multi-Token](./multi-token) | Implements multiple token standards |
| [Multi-Sig](https://paritytech.github.io/substrate/master/pallet_multisig/index.html) | Multiple signature approval |
| Parachain Staking | Delegated Proof of Stake implementation |
| Parachain System | Coordination with relay chain |
| [Polkadot XCM](https://github.com/paritytech/cumulus/blob/master/pallets/xcm/src/lib.rs) | Cross-Chain Messaging |
| [Preimage](https://docs.rs/pallet-preimage/latest/pallet_preimage/) | Storage of preimages |
| [Proxy](https://docs.rs/pallet-proxy/latest/pallet_proxy/) | Permit accounts to make proxy calls |
| Randomness | On-chain randomness implementation |
| [Roles Management](./roles-management) | Identy and Access Management |
| [Scheduler](https://docs.rs/pallet-scheduler/latest/pallet_scheduler/) | Schedules dispatches at certain blocks or periods |
| [Session](https://docs.rs/pallet-session/latest/pallet_session/) | Session management for validators |
| Sudo | Root origin extrinsics (temporary) |
| System | Base layer pallet utilities | 
| [Timestamp](https://paritytech.github.io/substrate/master/pallet_timestamp/index.html) | Validators set and verify timestamps |
| Treasury | Stakeholder fund management |
| Utility | Various extrinsic utilities |
| [X-Tokens](https://github.com/open-web3-stack/open-runtime-module-library/blob/master/xtokens/src/lib.rs) | Cross-Chain Currencies |
| [XCMP Queue](https://github.com/paritytech/cumulus/blob/master/pallets/xcmp-queue/src/lib.rs) | Parachain message queue for XCM |



## Runtime Versioning

The Moonsama Network runtime is easily upgradable via 
[Forkless Upgrades](https://docs.substrate.io/maintain/runtime-upgrades/#forkless-runtime-upgrades). To query
the current runtime version and available APIs, use the 
[RPC interface](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frpc.moonsama.com%2Fws#/rpc) as shown below:

![Runtime Version RPC](../img/runtime-version.png)
