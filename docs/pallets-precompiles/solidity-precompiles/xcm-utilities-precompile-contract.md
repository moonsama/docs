# XCM Utilities Precompile Contract

[https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/xcm-utils/](https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/xcm-utils/)

![img/xcm-utils-banner.png](img/xcm-utils-banner.png)

## Introduction

The XCM Utilities Precompile contract gives developers XCM-related utility functions directly within the EVM. This allows for easier transactions and interactions with other XCM-related precompiles.

Similar to other [precompile contracts](https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/), the XCM Utilities Precompile is located at the following addresses:

MoonbeamMoonriverMoonbase Alpha

```
0x000000000000000000000000000000000000080C

```

Note

There can be some unintended consequences when using the precompiled contracts on Moonbeam. Please refer to the [Security Considerations](https://docs.moonbeam.network/builders/get-started/eth-compare/security) page for more information.

## The XCM Utilities Solidity Interface

[XcmUtils.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/xcm-utils/XcmUtils.sol) is an interface to interact with the precompile.

Note

The precompile will be updated in the future to include additional features. Feel free to suggest additional utility functions in the [Discord](https://discord.gg/PfpUATX).

The interface includes the following functions:

- **multilocationToAddress**(*Multilocation memory* multilocation) — read-only function that returns the multilocation-derivative account from a given multilocation
- **weightMessage**(*bytes memory* message) — read-only function that returns the weight that an XCM message will consume on the chain. The message parameter must be a SCALE encoded XCM versioned XCM message
- **getUnitsPerSecond**(*Multilocation memory* multilocation) — read-only function that gets the units per second for a given asset in the form of a `Multilocation`. The multilocation must describe an asset that can be supported as a fee payment, such as an [external XC-20](https://docs.moonbeam.network/builders/interoperability/xcm/xc20/overview/#external-xc20s), or else this function will revert
- **xcmExecute**(*bytes memory* message, *uint64* maxWeight) - **available on Moonbase Alpha only** - executes a custom XCM message given the SCALE encoded versioned message to be executed and the maximum weight to be consumed. This function *cannot* be called from a smart contract due to the nature of the `Transact` instruction
- **xcmSend**(*Multilocation memory* dest, *bytes memory* message) - **available on Moonbase Alpha only** - sends a custom XCM message given the multilocation of the destination chain to send the message to and the SCALE encoded versioned message to be sent

The `Multilocation` struct in the XCM Utilities Precompile is built the [same as the XCM Transactor](https://docs.moonbeam.network/builders/interoperability/xcm/xcm-transactor#building-the-precompile-multilocation) precompile's `Multilocation`.

## Using the XCM Utilities Precompile

The XCM Utilities precompile allows users to read data off of the Ethereum JSON-RPC instead of having to go through a Polkadot library. The functions are more for convenience, and less for smart contract use cases.

For `multilocationToAddress`, one example use case is being able to allow transactions that originate from other parachains by whitelisting their multilocation-derived addresses. A user can whitelist a multilocation by calculating and storing an address. EVM transactions can originate from other parachains via [remote EVM calls](https://docs.moonbeam.network/builders/interoperability/xcm/remote-evm-calls).

```
// SPDX-License-Identifier: GPL-3.0-only
pragma solidity >=0.8.3;

import "https://github.com/PureStake/moonbeam/blob/master/precompiles/xcm-utils/XcmUtils.sol";

contract MultilocationWhitelistExample {
    XcmUtils xcmutils = XcmUtils(0x000000000000000000000000000000000000080C);
    mapping(address => bool) public whitelistedAddresses;

    modifier onlyWhitelisted(address addr) {
        _;
        require(whitelistedAddresses[addr], "Address not whitelisted!");
        _;
    }

    function addWhitelistedMultilocation(
        XcmUtils.Multilocation calldata externalMultilocation
    ) external onlyWhitelisted(msg.sender) {
        address derivedAddress = xcmutils.multilocationToAddress(
            externalMultilocation
        );
        whitelistedAddresses[derivedAddress] = true;
    }

    ...
}

```

To check out an example of how to use the `xcmExecute` function to execute a custom XCM message locally, please refer to the [Create and Execute Custom XCM Messages](https://docs.moonbeam.network/builders/interoperability/xcm/send-execute-xcm/#execute-xcm-utils-precompile) guide.