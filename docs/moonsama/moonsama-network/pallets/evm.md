---
description: Frontier EVM implementation
---

# EVM

:::note
This pallet is part of [Frontier](https://paritytech.github.io/frontier/) which has been incorporated into the 
Moonsama Network runtime.
:::

The EVM pallet provides runtime access to the Ethereum Virtual Machine (EVM). It supports state read and modification 
(`call`) and address creation (`create` and `create2`). It is also responsible for determining the gas fees
associated with a transaction.

End users are not permitted to interact with the EVM pallet directly. To call into the EVM from the Substrate side,
users must interact with the [Ethereum Pallet](./ethereum). While this is technically possible, there are no benefits 
to doing so over using the EVM RPC.
