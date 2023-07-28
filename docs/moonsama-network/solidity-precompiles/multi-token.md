---
description: Create, mint and use different token standards
---

# Multi-Token

The Multi-Token precompile set provides interfaces to the collection factory and all collections.

## Collection Factory

### Address

`0xfffffffa00000000000000000000000000000000`

### Interface

```solidity
// SPDX-License-Identifier: GPL-3.0-only
pragma solidity >=0.8.3;

interface ICollectionFactory {
    event CollectionCreated(
        address indexed collection,
        string name,
        string symbol
    );

    /// There are 8 roles in addresses: Governance, Admin, Manager, Minter, Creator, CompositeCreator, Freezer, Trader
    /// @custom:selector 4fc8f3fa
    function createCollection(
        address[] memory addresses,
        string memory name,
        string memory symbol,
        uint8 decimals,
        string memory contractURI,
        string memory defaultTokenURI
    ) external;
}
```

:::note
A collection creator will need to have been granted the `Creator` role in the 
[Roles Management Pallet](/docs/moonsama-network/pallets/roles-management).
:::

### Collections

As stated in [Precompile Sets](./overview#moonsama-network-specific-precompile-sets), collections will have an address
prefixed with the factory contract address, with big endian hex-encoded collection identifer.

The type of applicable interface depends on the *type* of collection (and sometimes item) created. Even within a 
Multi-Token collection, items can be fungible or non-fungible. Therefore it is necessary to know the max supply of an 
item before attaching a precompile interface.

An item with 1 max supply is a non-fungible token. Each item is unique; there are no other tokens
with which it can be swapped 1:1. As such, the token can be used with the standard ERC-721 inteface.

Items with greater than 1 max supply can be used with the ERC-1155 interface.

The following interfaces are available:

- `ERC1155Base`
- `ERC1155Collection`
- `ERC1155Soulbound`
- `ERC721Base`
- `ERC721Burnable`
- `ERC721Collection`
- `HasContractUri`
- `HasSecondarySaleFee`
- `ICollectionFactory`
- `IFractions`
- `IReservable`
