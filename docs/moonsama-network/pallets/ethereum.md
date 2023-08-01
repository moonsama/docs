---
description: Frontier EVM block production
---

# Ethereum

:::note
This pallet is part of [Frontier](https://paritytech.github.io/frontier/) which has been incorporated into the 
Moonsama Network runtime.
:::

The Ethereum pallet uses the [EVM Pallet](./evm) to execute calls in the Ethereum Virtual Machine (EVM). 
The Ethereum pallet is responsible for processing and storing Ethereum blocks as well as the status and receipt of 
each transaction.

The pallet interface provides `call`, `create` and `create2` extrinsics, mapping to their respective `eth` commands.
A transaction must include a valid signature and conform to one of 
[Legacy](https://docs.rs/ethereum/latest/ethereum/struct.LegacyTransaction.html), 
[EIP-1559](https://docs.rs/ethereum/latest/ethereum/struct.EIP1559Transaction.html) or 
[EIP-2930](https://docs.rs/ethereum/latest/ethereum/struct.EIP2930Transaction.html).

Where possible, it is strongly advised to use well-established Ethereum ecosystem tooling, such as 
[`ethers`](https://docs.ethers.org/v6/), to interact with Moonsama Network's EVM RPC, instead of using this pallet
directly.

See [EVM Compatibility](../evm-compatibility) for more information on how Frontier provides the Ethereum ecosystem
compatibility layer for Moonsama Newtork.
