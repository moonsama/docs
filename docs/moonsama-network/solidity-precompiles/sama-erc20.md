---
description: Interact with SAMA
---

# SAMA ERC-20

This precompile allows developers to interact with the [SAMA Token](/docs/about-sama) through an ERC0-20
interface. The precompile directly interfaces with the 
[Balances pallet](https://paritytech.github.io/substrate/master/pallet_balances/index.html) to read from and write to 
Moonsama Network's native SAMA implementation.

## Address

`0x0000000000000000000000000000000000000800`

## Interface

The ERC-20 interface has been implemented by [OpenZeppelin](https://www.openzeppelin.com/) and can be found at 
[`IERC20.sol`](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol).
