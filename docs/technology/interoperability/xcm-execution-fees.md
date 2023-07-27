# XCM Execution Fees

## Introduction

XCM aims to be a language that communicates ideas between consensus systems. Sending an XCM message consists of a series of instructions that are executed in both the origin and the destination chain. The combination of XCM instructions results in actions such as token transfers. In order to process and execute each XCM instruction, there are typically associated fees that must be paid.

However, XCM is designed to be general, extensible, and efficient so that it remains valuable and future-proof throughout a growing ecosystem. As such, the generality applies to concepts including payments of fees for XCM execution. In Ethereum, fees are baked into the transaction protocol, whereas in the Polkadot ecosystem, each chain has the flexibility to define how XCM fees are handled.

This guide will cover aspects of fee payment, such as who is responsible for paying XCM execution fees, how it is paid for, and how the fees are calculated on Moonsama Network.

Note

**The following information is provided for general information purposes only.** The weight and extrinsic base cost might have changed since the time of writing. Please ensure you check the actual values, and never use the following information for production apps.

## Payment of Fees

Generally speaking, the fee payment process can be described as follows:

1. Some assets need to be provided
2. The exchange of assets for computing time (or weight) must be negotiated
3. The XCM operations will be performed as instructed, with the provided weight limit or funds available for execution

Each chain can configure what happens with the XCM fees and in which tokens they can be paid (either the native reserve token or an external one). For example, on Polkadot and Kusama, the fees are paid in DOT or KSM (respectively) and given to the validator of the block. On Moonsama Network and Moonsama Network, the XCM execution fees can be paid in the reserve asset (GLMR or MOVR, respectively), but also in assets originated in other chains, and fees are sent to the treasury.

Consider the following scenario: Alice has some DOT on Polkadot, and she wants to transfer it to Alith on Moonsama Network. She sends an XCM message with a set of XCM instructions that will retrieve a given amount of DOT from her account on Polkadot and mint them as xcDOT into Alith's account. Part of the instructions are executed on Polkadot, and the other part are executed on Moonsama Network.

How does Alice pay Moonsama Network to execute these instructions and fulfill her request? Her request is fulfilled through a series of XCM instructions that are included in the XCM message, which enables her to buy execution time minus any related XCM execution fees. The execution time is used to issue and transfer xcDOT, a representation of DOT on Moonsama Network. This means that when Alice sends some DOT to Alith's account on Moonsama Network, she'll receive a 1:1 representation of her DOT as xcDOT minus any XCM execution fees. Note that in this scenario, XCM execution fees are paid in xcDOT.

The exact process for Alice's transfer is as follows:

1. Assets are sent to an account on Polkadot that is owned by Moonsama Network, known as the sovereign account. After the assets are received, an XCM message is sent to Moonsama Network
2. The XCM message in Moonsama Network will:
    1. Mint the corresponding asset representation
    2. Buy the corresponding execution time
    3. Use that execution time to deposit the representation (minus fees) to the destination account

### XCM Instructions

An XCM message is comprised of a series of XCM instructions. As a result, different combinations of XCM instructions result in different actions. For example, to move DOT to Moonsama Network, the following XCM instructions are used:

1. `[TransferReserveAsset](https://github.com/paritytech/xcm-format#transferreserveasset)` - gets executed in Polkadot. Moves assets from the origin account and deposits them into a destination account. In this case, the destination account is Moonsama Network's sovereign account on Polkadot. It then sends an XCM message to the destination, which is Moonsama Network, with the XCM instructions that are to be executed
2. `[ReserveAssetDeposited](https://github.com/paritytech/xcm-format#reserveassetdeposited)` - gets executed in Moonsama Network. Takes a representation of the assets received in the sovereign account and places them into the holding register, a temporary position in the Cross-Consensus Virtual Machine (XCVM)
3. `[ClearOrigin](https://github.com/paritytech/xcm-format#clearorigin)` - gets executed in Moonsama Network. Ensures that later XCM instructions cannot command the authority of the XCM author
4. `[BuyExecution](https://github.com/paritytech/xcm-format#buyexecution)` - gets executed in Moonsama Network. Takes the assets from holding to pay for execution fees. The fees to pay are determined by the target chain, which in this case is Moonsama Network
5. `[DepositAsset](https://github.com/paritytech/xcm-format#depositasset)` - gets executed in Moonsama Network. Removes the assets from holding and sends them to a destination account on Moonsama Network

To check how the instructions for an XCM message are built to transfer self-reserve assets to a target chain, such as DOT to Moonsama Network, you can refer to the [X-Tokens Open Runtime Module Library](https://github.com/open-web3-stack/open-runtime-module-library/tree/polkadot-v0.9.37/xtokens) repository (as an example). You'll want to take a look at the `[transfer_self_reserve_asset](https://github.com/open-web3-stack/open-runtime-module-library/blob/polkadot-v0.9.37/xtokens/src/lib.rs#L666)` function. You'll notice it calls `TransferReserveAsset` and passes in `assets`, `dest`, and `xcm` as parameters. In particular, the `xcm` parameter includes the `BuyExecution` and `DepositAsset` instructions. If you then head over to the Polkadot GitHub repository, you can find the `[TransferReserveAsset` instruction](<https://github.com/paritytech/polkadot/blob/v0.9.37/xcm/xcm-executor/src/lib.rs#L306>). The XCM message is constructed by combining the `ReserveAssetDeposited` and `ClearOrigin` instructions with the `xcm` parameter, which as mentioned includes the `BuyExecution` and `DepositAsset` instructions.

To move xcDOT from Moonsama Network back to Polkadot, the instructions that are used are:

1. `[WithdrawAsset](https://github.com/paritytech/xcm-format#withdrawasset)` - gets executed in Moonsama Network. Removes assets and places them into the holding register
2. `[InitiateReserveWithdraw](https://github.com/paritytech/xcm-format#initiatereservewithdraw)` - gets executed in Moonsama Network. Removes the assets from holding (essentially burning them) and sends an XCM message to the destination chain starting with the `WithdrawAsset` instruction
3. `[WithdrawAsset](https://github.com/paritytech/xcm-format#withdrawasset)` - gets executed in Polkadot. Removes assets and places them into the holding register
4. `[ClearOrigin](https://github.com/paritytech/xcm-format#clearorigin)` - gets executed in Polkadot. Ensures that later XCM instructions cannot command the authority of the XCM author
5. `[BuyExecution](https://github.com/paritytech/xcm-format#buyexecution)` - gets executed in Polkadot. Takes the assets from holding to pay for execution fees. The fees to pay are determined by the target chain, which in this case is Polkadot
6. `[DepositAsset](https://github.com/paritytech/xcm-format#depositasset)` - gets executed in Polkadot. Removes the assets from holding and sends them to a destination account on Polkadot

To check how the instructions for an XCM message are built to transfer reserve assets to a target chain, such as xcDOT to Polkadot, you can refer to the [X-Tokens Open Runtime Module Library](https://github.com/open-web3-stack/open-runtime-module-library/tree/polkadot-v0.9.37/xtokens) repository. You'll want to take a look at the `[transfer_to_reserve](https://github.com/open-web3-stack/open-runtime-module-library/blob/polkadot-v0.9.37/xtokens/src/lib.rs#L683)` function. You'll notice that it calls `WithdrawAsset`, then `InitiateReserveWithdraw` and passes in `assets`, `dest`, and `xcm` as parameters. In particular, the `xcm` parameter includes the `BuyExecution` and `DepositAsset` instructions. If you then head over to the Polkadot GitHub repository, you can find the `[InitiateReserveWithdraw` instruction](<https://github.com/paritytech/polkadot/blob/v0.9.37/xcm/xcm-executor/src/lib.rs#L412>). The XCM message is constructed by combining the `WithdrawAsset` and `ClearOrigin` instructions with the `xcm` parameter, which as mentioned includes the `BuyExecution` and `DepositAsset` instructions.

## Relay Chain XCM Fee Calculation

Substrate has introduced a weight system that determines how heavy or, in other words, how expensive from a computational cost perspective an extrinsic is. One unit of weight is defined as one picosecond of execution time. When it comes to paying fees, users will pay a transaction fee based on the weight of the call that is being made, in addition to factors such as network congestion.

The following sections will break down how to calculate XCM fees for Polkadot and Kusama. It's important to note that Kusama, in particular, uses benchmarked data to determine the total weight costs for XCM instructions and that some XCM instructions might include database reads/writes, which add weight to the call.

There are two databases available in Polkadot and Kusama, RocksDB (which is the default) and ParityDB, both of which have their own associated weight costs for each network.

### Polkadot

As previously mentioned, Polkadot currently uses a [fixed amount of weight](https://github.com/paritytech/polkadot/blob/v0.9.37/runtime/polkadot/src/xcm_config.rs#L94) for all XCM instructions, which is `1,000,000,000` weight units per instruction.

Although Polkadot doesn't currently use database weight units to calculate costs, the weight units for database operations, which have been benchmarked, are shared here for reference.

| Database | Read | Write |
| --- | --- | --- |
| <https://github.com/paritytech/polkadot/blob/v0.9.37/runtime/polkadot/constants/src/weights/rocksdb_weights.rs> | 20,499,000 | 83,471,000 |
| <https://github.com/paritytech/polkadot/blob/v0.9.37/runtime/polkadot/constants/src/weights/paritydb_weights.rs> | 11,826,000 | 38,052,000 |

With the instruction weight cost established, you can calculate the cost of each instruction in DOT.

In Polkadot, the `[ExtrinsicBaseWeight](https://github.com/paritytech/polkadot/blob/v0.9.37/runtime/polkadot/constants/src/weights/extrinsic_weights.rs#L55)` is set to `94,914,000` which is [mapped to 1/10th](https://github.com/paritytech/polkadot/blob/v0.9.37/runtime/polkadot/constants/src/lib.rs#L88) of a cent. Where 1 cent is `10^10 / 100`.

Therefore, to calculate the cost of executing an XCM instruction, you can use the following formula:

```
XCM-DOT-Cost = XCMInstrWeight * DOTWeightToFeeCoefficient

```

Where `DOTWeightToFeeCoefficient` is a constant (map to 1 cent), and can be calculated as:

```
DOTWeightToFeeCoefficient = ( 10^10 / ( 10 * 100 )) * ( 1 / DOTExtrinsicBaseWeight )

```

Using the actual values:

As a result, `DOTWeightToFeeCoefficient` is equal to `0.105358535 Planck-DOT`. Now, you can begin to calculate the final fee in DOT, using `DOTWeightToFeeCoefficient` as a constant and `TotalWeight` as the variable:

Therefore, the actual calculation for one XCM instruction is:

The total cost is `0.0105358535 DOT` per instruction.

As an example, you can calculate the total cost of DOT for sending an XCM message that transfers xcDOT to DOT on Polkadot using the following weights and instruction costs:

### Kusama

The total weight costs on Kusama take into consideration database reads and writes in addition to the weight required for a given instruction. Database read and write operations have not been benchmarked, while instruction weights have been. The breakdown of weight costs for the database operations is as follows:

Now that you are aware of the weight costs for database reads and writes on Kusama, you can calculate the weight cost for a given instruction using the base weight for an instruction.

For example, the `[WithdrawAsset` instruction](<https://github.com/paritytech/polkadot/blob/v0.9.38/runtime/kusama/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L49-L53>) has a base weight of `20,385,000`, and performs one database read, and one database write. Therefore, the total weight cost of the `WithdrawAsset` instruction is calculated as:

The `[BuyExecution` instruction](<https://github.com/paritytech/polkadot/blob/v0.9.38/runtime/kusama/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L59-L61>) has a base weight of `3,697,000` and doesn't include any database reads or writes. Therefore, the total weight cost of the `BuyExecution` instruction is `3,697,000`.

On Kusama, the benchmarked base weights are broken up into two categories: fungible and generic. Fungible weights are for XCM instructions that involve moving assets, and generic weights are for everything else. You can view the current weights for [fungible assets](https://github.com/paritytech/polkadot/blob/v0.9.38/runtime/kusama/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L45) and [generic assets](https://github.com/paritytech/polkadot/blob/v0.9.38/runtime/kusama/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L46) directly in the Kusama Runtime code.

With the instruction weight cost established, you can calculate the cost of the instruction in KSM.

In Kusama, the `[ExtrinsicBaseWeight](https://github.com/paritytech/polkadot/blob/v0.9.38/runtime/kusama/constants/src/weights/extrinsic_weights.rs#L55)` is set to `110,575,000` which is [mapped to 1/10th](https://github.com/paritytech/polkadot/blob/v0.9.38/runtime/kusama/constants/src/lib.rs#L87) of a cent. Where 1 cent is `10^12 / 30,000`.

Therefore, to calculate the cost of executing an XCM instruction, you can use the following formula:

Where `KSMWeightToFeeCoefficient` is a constant (map to 1 cent), and can be calculated as:

Using the actual values:

As a result, `KSMWeightToFeeCoefficient` is equal to `0.30145451805 Planck-KSM`. Now, you can begin to calculate the final fee in KSM, using `KSMWeightToFeeCoefficient` as a constant and `TotalWeight` (145,385,000) as the variable:

Therefore, the actual calculation for the `WithdrawAsset` instruction is:

The total cost for that particular instruction is `0.00005095435 KSM`.

As an example, you can calculate the total cost of KSM for sending an XCM message that transfers xcKSM to KSM on Kusama using the following weights and instruction costs:

## Moonsama Network-based Networks XCM Fee Calculation

Substrate has introduced a weight system that determines how heavy or, in other words, how expensive an extrinsic is from a computational cost perspective. One unit of weight is defined as one picosecond of execution time. When it comes to paying fees, users will pay a transaction fee based on the weight of the call that is being made, and each parachain can decide how to convert from weight to fee, for example, accounting for additional costs for transaction size, and storage costs.

Both Moonsama Network and Moonsama Network use a fixed amount of weight for each XCM instruction. However,  (TestNet) has the generic XCM instructions benchmarked, while the fungible XCM instructions still use a fixed amount of weight per instruction. Consequently, the total weight cost of the benchmarked XCM instructions considers the number of database reads/writes in addition to the weight required for a given instruction. The breakdown of weight cost for the database operations is as follows:

Now that you know the weight costs for database reads and writes for , you can calculate the weight cost for both fungible and generic XCM instruction using the base weight for instruction and the extra database read/writes if applicable.

For example, the `WithdrawAsset` instruction is part of the fungible XCM instructions set. Therefore, it is not benchmarked, and the total weight cost of the `WithdrawAsset` instruction is `200,000,000`.

The `[BuyExecution` instruction](/blob/v0.31.1/pallets/moonsama-network-xcm-benchmarks/src/weights/moonsama_xcm_benchmarks_generic.rs#L136) has a base weight of `158,702,000`, and performs four database reads (`assetManager` pallet to get the `unitsPerSecond`). Therefore, the total weight cost of the `BuyExecution` instruction is calculated as follows:

You can find all the weight values for all the XCM instructions in the following table:

The following sections will break down how to calculate XCM fees for Moonsama Network-based networks. There are two main scenarios:

- Fees paid in the reserve token (native tokens like GLMR, MOVR, or DEV)
- Fees paid in external assets (XC-20s)

### Fee Calculation for Reserve Assets

For each XCM instruction, the weight units are converted to balance units as part of the fee calculation. The amount of Wei per weight unit for each of the Moonsama Network-based networks is as follows:

This means that on Moonsama Network, for example, the formula to calculate the cost of one XCM instruction in the reserve asset is as follows:

Therefore, the actual calculation is:

The total cost is `0.001 GLMR` for an XCM instruction on Moonsama Network.

### Fee Calculation for External Assets

Considering the scenario with Alice sending DOT to Alith's account on Moonsama Network, the fees are taken from the amount of xcDOT Alith receives. To determine how much to charge, Moonsama Network uses a concept called `UnitsPerSecond`, which refers to the units of tokens that the network charges per second of XCM execution time (considering decimals). This concept is used by Moonsama Network (and maybe other parachains) to determine how much to charge for XCM execution using a different asset than its reserve.

Moreover, XCM execution on Moonsama Network can be paid by multiple assets ([XC-20s](builders/interoperability/xcm/xc20/overview/)) that originate in the chain where the asset is coming from. For example, at the time of writing, an XCM message sent from [Statemine](https://polkadot.js.org/apps/?rpc=wss://statemine-rpc.polkadot.io#/explorer) can be paid in xcKSM, xcRMRK or xcUSDT. As long as that asset has an `UnitsPerSecond` set in Moonsama Network/Moonsama Network, it can be used to pay XCM execution for an XCM message coming from that specific chain.

To find out the `UnitsPerSecond` for a given asset, you can query `assetManager.assetTypeUnitsPerSecond` and pass in the multilocation of the asset in question.

If you're unsure of the multilocation, you can retrieve it using the `assetManager.assetIdType` query.

For example, you can navigate to the [Polkadot.js Apps page for Moonsama Network](<https://polkadot.js.org/apps/?rpc=wss://wss.api.Moonsama> Network.network#/chainstate) and under the **Developer** dropdown, choose **Chain State**. From there, you can take the following steps:

1. For the **selected state query** dropdown, choose **assetManager**
2. Select the **assetIdType** extrinsic
3. Under **Option** enter in the asset ID or toggle the **include option** off to return information for all of the assets. This example will get information for xcUNIT which has an asset ID of `42259045809535163221576417993425387648`
4. Click the **+** button to submit the query

![img/fees-1.png](img/fees-1.png)

You can take the result of the query and then use it to query the **assetTypeUnitsPerSecond** extrinsic:

1. Make sure **assetManager** is selected
2. Select the **assetTypeUnitsPerSecond** extrinsic
3. For **MoonbeamRuntimeXcmConfigAssetType**, choose **Xcm**
4. Enter `1` for **parents**
5. Select `Here` for **interior**
6. Click the **+** button to submit the query

The `UnitsPerSecond` for xcDOT is `11,285,231,116`.

![img/fees-2.png](img/fees-2.png)

Remember that one unit of weight is defined as one picosecond of execution time. Therefore, the formula to determine execution time is as follows:

To determine the execution time for Alice's transfer of DOT to Moonsama Network, which contains four XCM instructions, you can use the following calculation:

Which means that four XCM instructions cost `0.0008` seconds of block execution time.

To calculate the total cost in xcDOT, you'll also need the number of decimals the asset in question uses, which for xcDOT is 10 decimals. You can determine the number of decimals for any asset by [querying the asset metadata](builders/interoperability/xcm/xc20/overview/#list-xchain-assets).

The block execution formula can then be used to determine how much Alice's transfer of DOT to Alith's account on Moonsama Network costs. The formula for finding the total cost is as follows:

Then the calculation for the transfer is:

The total cost to transfer Alice's DOT to Alith's account for xcDOT is `0.00090281848 xcDOT`.

## XCM Transactor Fees

The [XCM Transactor Pallet](builders/interoperability/xcm/xcm-transactor/) builds an XCM message to remotely transact in other chains of the ecosystem.

There are two different ways developers can remotely transact through the pallet:

1. `[transactThroughDerivative](builders/interoperability/xcm/xcm-transactor/#xcmtransactor-transact-through-derivative)`
2. `[transactThroughSigned](builders/interoperability/xcm/xcm-transactor/#xcmtransactor-transact-through-signed)`, in which the dispatcher account in the destination chain is a multilocation-derived account and must have enough funds to cover XCM execution fees plus whatever call is being remotely executed

Generally speaking, the XCM instructions normally involved for remote execution are:

- The first instruction handles tokens in the origin chain. This can be either moving tokens to a sovereign account or burning the corresponding [XC-20](builders/interoperability/xcm/xc20/overview/) so that it can be used in the target chain. These instructions get executed in the origin chain
- `[DescendOrigin](https://github.com/paritytech/xcm-format#descendorigin)` (optional) - mutates the origin with the multilocation provided in the instruction. This is only used for the `transactThroughSigned` and `transactThroughSignedMultilocation` extrinsics, as the origin is no longer the sovereign account, but the [multilocation-derivative account](builders/interoperability/xcm/xcm-transactor/#general-xcm-definitions)
- `[WithdrawAsset](https://github.com/paritytech/xcm-format#withdrawasset)` - gets executed in the target chain. Removes assets and places them into the holding register
- `[BuyExecution](https://github.com/paritytech/xcm-format#buyexecution)` - gets executed in the target chain. Takes the assets from holding to pay for execution fees. The fees to pay are determined by the target chain
- `[Transact](https://github.com/paritytech/xcm-format#transact)` - gets executed in the target chain. Dispatches the encoded call data from a given origin

Therefore, XCM execution in the target chain consists of three to four XCM instructions, depending on the extrinsic being used. This section covers how XCM fees are estimated for each of the scenarios described above, as it is handled very differently.

### Transact Through Derivative Fees

The transacting through derivative method consists of three XCM instructions: `[WithdrawAsset](https://github.com/paritytech/xcm-format#withdrawasset)`, `[BuyExecution](https://github.com/paritytech/xcm-format#buyexecution)` and `[Transact](https://github.com/paritytech/xcm-format#transact)`.

When [transacting through the sovereign-derivative account](builders/interoperability/xcm/xcm-transactor/#xcmtransactor-transact-through-derivative), the transaction fees are paid by the sovereign account of the origin chain in the destination chain, but the derivative account dispatches the transaction. Consequently, the XCM Transactor Pallet will burn a certain amount of the corresponding XC-20 token to free up some balance in the sovereign account for XCM execution fee payment.

Consider the following scenario: Alice wants to remotely transact in Polkadot from Moonsama Network using the transact through sovereign extrinsic (she already has an index registered to her account). To estimate how many XC-20 tokens will be burned from Alice's account, you need to check the transact information specific to the relay chain. To do so, head to the chain state page of [Polkadot.js Apps](<https://polkadot.js.org/apps/?rpc=wss://wss.api.Moonsama> Network.network#/chainstate) and set the following options:

1. Choose the **xcmTransactor** pallet
2. Choose the **transactInfoWithWeightLimit** method
3. Set the multilocation for the destination chain from which you want to query the transact information. For this example, you can set **parents** to `1`
4. Select `Here` for **interior**
5. Click on **+**

![img/fees-3.png](img/fees-3.png)

From the response, you can see that the `transactExtraWeight` is `3,000,000,000`. This is the weight needed to execute the three XCM instructions for this remote call in that specific destination chain. Next, you need to find the `UnitsPerSecond` for that particular chain. In the same [Polkadot.js Apps page](<https://polkadot.js.org/apps/?rpc=wss://wss.api.Moonsama> Network.network#/chainstate), set the following options:

1. Choose the **xcmTransactor** pallet
2. Choose the **destinationAssetFeePerSecond** method
3. Set the multilocation for the destination chain from which you want to query the transact information. For this example, you can set **parents** to `1`
4. Select `Here` for **interior**
5. Click on **+**

![img/fees-4.png](img/fees-4.png)

Note that this `UnitsPerSecond` is related to the cost estimated in the [Relay Chain XCM Fee Calculation](builders/interoperability/xcm/fees/#polkadot) section, or to the [Wei per weight](builders/interoperability/xcm/fees/#Moonsama Network-reserve-assets) if the target is another parachain. As before, calculating the associated XCM execution fee is as simple as multiplying the `transactExtraWeight` times the `UnitsPerSecond`:

Therefore, the actual calculation for one XCM Transactor transact through derivative call is:

The cost for transacting through derivative is `0.0316075605 DOT`. **Note that this does not include the cost of the call being remotely executed, only XCM execution fees.** Consequently, the amount of XC-20 tokens that are burned, consider also the destination weight provided as input in the function call, which can be added to the `transactExtraWeight` in the calculations.

### Transact Through Signed Fees

The transacting through signed method (multilocation derivative account) consists of four XCM instructions: `[DescendOrigin](https://github.com/paritytech/xcm-format#descendorigin)`, `[WithdrawAsset](https://github.com/paritytech/xcm-format#withdrawasset)`, `[BuyExecution](https://github.com/paritytech/xcm-format#buyexecution)` and `[Transact](https://github.com/paritytech/xcm-format#transact)`.

When [transacting through the multilocation-derivative account](builders/interoperability/xcm/xcm-transactor/#xcmtransactor-transact-through-derivative), the transaction fees are paid by the same account from which the call is dispatched, which is a multilocation-derived account in the destination chain. Consequently, multilocation-derived account must hold the necessary funds to pay for the entire execution. Note that the destination token, in which fees are paid, does not need to be register as an XC-20 in the origin chain.

Consider the following scenario: Alice wants to remotely transact in another chain (Parachain ID 888, in the  relay chain ecosystem) from  using the transact through signed extrinsic. To estimate the amount of tokens Alice's multilocation-derivative account will need to have to execute the remote call, you need to check the transact information specific to the destination chain. To do so, head to the chain state page of [Polkadot.js Apps](<https://polkadot.js.org/apps/?rpc=wss://wss.api.Moonsama> Network.network#/chainstate) and set the following options:

1. Choose the **xcmTransactor** pallet
2. Choose the **transactInfoWithWeightLimit** method
3. Set the multilocation for the destination chain from which you want to query the transact information. For this example, you can set **parents** to `1`
4. Select `X1` for **interior**
5. Select `Parachain` in the **X1** field
6. Set **Parachain** to `888`
7. Click on **+**

![img/fees-5.png](img/fees-5.png)

From the response, you can see that the `transactExtraWeightSigned` is `400,000,000`. This is the weight needed to execute the four XCM instructions for this remote call in that specific destination chain. Next, you need to find how much the destination chain charges per weight of XCM execution. Normally, you would look into the `UnitsPerSecond` for that particular chain. But in this scenario, no XC-20 tokens are burned. Therefore, `UnitsPerSecond` can be use for reference, but do not ensure that the amount of tokens estimated are correct. To get the `UnitsPerSecond` as a reference value, in the same [Polkadot.js Apps page](<https://polkadot.js.org/apps/?rpc=wss://wss.api.Moonsama> Network.network#/chainstate), set the following options:

1. Choose the **xcmTransactor** pallet
2. Choose the **destinationAssetFeePerSecond** method
3. Set the multilocation for the destination chain from which you want to query the transact information. For this example, you can set **parents** to `1`
4. Select `X2` for **interior**
5. Select `Parachain` in the **X1** field
6. Set **Parachain** to `888`
7. Select `PalletInstance` in the **X2** field
8. Set **PalletInstance** to `3`
9. Click on **+**

![img/fees-6.png](img/fees-6.png)

Note that this `UnitsPerSecond` is related to the cost estimated in the [Relay Chain XCM Fee Calculation](builders/interoperability/xcm/fees/#polkadot) section, or to the one shown in the [Units per weight](builders/interoperability/xcm/fees/#Moonsama Network-reserve-assets) section if the target is another parachain. You'll need to find the correct value to ensure that the amount of tokens the multilocation-derivative account holds is correct. As before, calculating the associated XCM execution fee is as simple as multiplying the `transactExtraWeight` times the `UnitsPerSecond` (for an estimation):

Therefore, the actual calculation for one XCM Transactor transact through derivative call is:

The cost for transacting through signed is `0.00002 TOKEN`. **Note that this does not include the cost of the call being remotely executed, only XCM execution fees.**
