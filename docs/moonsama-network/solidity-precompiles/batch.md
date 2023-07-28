---
description: Combine multiple EVM calls
---

# Batch

The batch precompiled contract on Moonsama Network allows developers to combine multiple EVM calls into one.

Currently, having users interact with multiple contracts would require multiple transaction confirmations in the user's
wallet. An example would be approving a smart contract's access to a token, then transferring it. With the batch
precompile, developers can enhance user experience with batched transactions as it minimizes the number of transactions
a user is required to confirm to one. Additionally, gas fees can be reduced since batching avoids multiple base gas fees
(the initial 21000 units of gas spent to begin a transaction).

The precompile interacts directly with [Substrate's EVM pallet](/docs/moonsama-network/pallets/evm). The caller
of the batch function will have their address act as the `msg.sender` for all subtransactions, but unlike [delegate
calls](https://docs.soliditylang.org/en/v0.8.15/introduction-to-smart-contracts.html#delegatecall-callcode-and-libraries),
the target contract will still affect its own storage. It is effectively the same as if the user signed multiple
transactions, but with only one confirmation.

<!--:::note
There can be some unintended consequences when using the precompiled contracts on Moonsama Network. Please refer to the
[Security Considerations](builders/get-started/eth-compare/security) page for more information.
:::-->


## Address

`0x0000000000000000000000000000000000000805`


## Interface

```solidity
pragma solidity >=0.8.3;

interface Batch {
    function batchSome(
        address[] memory to,
        uint256[] memory value,
        bytes[] memory callData,
        uint64[] memory gasLimit
    ) external;

    function batchSomeUntilFailure(
        address[] memory to,
        uint256[] memory value,
        bytes[] memory callData,
        uint64[] memory gasLimit
    ) external;

    function batchAll(
        address[] memory to,
        uint256[] memory value,
        bytes[] memory callData,
        uint64[] memory gasLimit
    ) external;

    event SubcallSucceeded(uint256 index);
    event SubcallFailed(uint256 index);
}
```
