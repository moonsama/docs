---
description: Permit users to make calls on another user's behalf
---

# Call Permit

The Call Permit Precompile on Moonsama Network allows a user to sign a permit, an
[EIP-712](https://eips.ethereum.org/EIPS/eip-712) signed message, for any EVM call and it can be dispatched by anyone or
any smart contract.

When the call permit is dispatched, it is done so on behalf of the user who signed the permit and the user or contract
that dispatches the permit is responsible for paying transaction fees. As such, the precompile can be used to perform
gas-less transactions.

For example, Alice signs a call permit and Bob dispatches it and performs the call on behalf of Alice. Bob pays for the
transaction fees and as such, Alice doesn't need to have any of the native currency to pay for the transaction, unless
the call includes a transfer.

## Address

`0x0000000000000000000000000000000000000802`

## Interface

```solidity
pragma solidity >=0.8.3;

interface CallPermit {
    function dispatch(
        address from,
        address to,
        uint256 value,
        bytes memory data,
        uint64 gaslimit,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (bytes memory output);

    function nonces(address owner) external view returns (uint256);

    function DOMAIN_SEPARATOR() external view returns (bytes32);
}
```
