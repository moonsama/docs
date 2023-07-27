# XCM SDK Reference


## Introduction

The Moonsama Network XCM SDK enables developers to easily deposit and withdraw assets to Moonsama Network/Moonsama Network from the relay chain and other parachains in the Polkadot/Kusama ecosystem. With the SDK, you don't need to worry about determining the multilocation of the origin or destination assets or which extrinsics are used on which networks to send XCM transfers.

The SDK provides an API which includes a series of interfaces to get asset information for each of the supported assets, chain information for the initialized network, utility methods, and methods to enable deposits, withdrawals, and subscription to balance information.

This page includes a list of the interfaces and methods available in the XCM SDK. For information on how to use the XCM SDK interfaces and methods, please refer to the [Using the XCM SDK](builders/interoperability/xcm/xcm-sdk/xcm-sdk) guide.

## Core Interfaces

The SDK provides the following core interfaces, which can be accessed after [initialization](builders/interoperability/xcm/xcm-sdk/xcm-sdk/#initializing):

| Interface | Description |
| --- | --- |
| builders/interoperability/xcm/xcm-sdk/xcm-sdk/#symbols | A list containing the asset's origin chain symbol for each of the supported assets for the initialized Moonsama Network network |
| builders/interoperability/xcm/xcm-sdk/xcm-sdk/#assets | A list of the supported assets for the initialized Moonsama Network network along with their asset ID, precompiled address on Moonsama Network, and the asset symbol |
| builders/interoperability/xcm/xcm-sdk/xcm-sdk/#native-assets | Contains the asset ID, precompile contract address, and native asset symbol for the initialized Moonsama Network network |
| builders/interoperability/xcm/xcm-sdk/xcm-sdk/#native-chain-data | Contains the chain key, name, WSS endpoint, parachain ID, decimals of the native asset, chain ID, and units per second for the initialized Moonsama Network network |

## Core Methods

The SDK provides the following core methods:

| Method | Description |
| --- | --- |
| builders/interoperability/xcm/xcm-sdk/xcm-sdk/#initializing | Initializes the XCM SDK. Must be called first before any other SDK methods |
| builders/interoperability/xcm/xcm-sdk/xcm-sdk/#deposit | Initiates a deposit to transfer assets from another chain to Moonsama Network |
| builders/interoperability/xcm/xcm-sdk/xcm-sdk/#withdraw | Initiates a withdraw to transfer assets from Moonsama Network to another chain |
| builders/interoperability/xcm/xcm-sdk/xcm-sdk/#subscribe | Listens for balance changes for a given account for each of the supported assets |
| builders/interoperability/xcm/xcm-sdk/xcm-sdk/#deposit-check | Returns a boolean indicating whether the given transfer data is for a deposit or not |
| builders/interoperability/xcm/xcm-sdk/xcm-sdk/#withdraw-check | Returns a boolean indicating whether the given transfer data is for a withdraw or not |
| builders/interoperability/xcm/xcm-sdk/xcm-sdk/#decimals | Returns a given balance in decimal format |
| builders/interoperability/xcm/xcm-sdk/xcm-sdk/#decimals | Returns a given decimal in BigInt format |

## Deposit Methods

When building the transfer data needed for a deposit, you'll use multiple methods to build the underlying XCM message and send it:

| Method | Description |
| --- | --- |
| builders/interoperability/xcm/xcm-sdk/xcm-sdk/#deposit | Initiates a deposit to transfer assets from another chain to Moonsama Network |
| builders/interoperability/xcm/xcm-sdk/xcm-sdk/#from | Sets the source chain where the deposit will originate from.  This function is returned from the deposit() function.  Must call deposit() first |
| builders/interoperability/xcm/xcm-sdk/xcm-sdk/#get-deposit | Sets the account on Moonsama Network to deposit the funds to and the  source account where the deposit will be sent from.  This function is returned from the from() function.  Must call from() first |
| builders/interoperability/xcm/xcm-sdk/xcm-sdk/#send-deposit | Sends the deposit transfer data given an amount to send.  This function is returned from the get() function.  Must call get() first |
| builders/interoperability/xcm/xcm-sdk/xcm-sdk/#get-fee-deposit | Returns an estimate of the fee for transferring a given amount,  which will be paid in the asset specified in the deposit() function.  This function is returned from the get() function.  Must call get() first |

## Withdraw Methods

When building the transfer data needed for a withdraw, you'll use multiple methods to build the underlying XCM message and send it:

| Method | Description |
| --- | --- |
| builders/interoperability/xcm/xcm-sdk/xcm-sdk/#withdraw | Initiates a withdraw to transfer assets from Moonsama Network to another chain |
| builders/interoperability/xcm/xcm-sdk/xcm-sdk/#to | Sets the destination chain where the assets will be withdrawn to.  This function is returned from the withdraw() function.  Must call withdraw() first |
| builders/interoperability/xcm/xcm-sdk/xcm-sdk/#get-withdraw | Sets the account on the destination chain to send the withdrawn funds to.  This function is returned from the to() function.  Must call to() first |
| builders/interoperability/xcm/xcm-sdk/xcm-sdk/#send-withdraw | Sends the withdraw transfer data given an amount to send.  This function is returned from the get() function.  Must call get() first |
| builders/interoperability/xcm/xcm-sdk/xcm-sdk/#get-fee-withdraw | Returns an estimate of the fee for transferring a given amount,  which will be paid in the asset specified in the withdraw() function.  This function is returned from the get() function.  Must call get() first |
