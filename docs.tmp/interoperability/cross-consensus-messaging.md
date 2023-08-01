# Cross-Consensus Messaging (XCM)

## Introduction

[Polkadot's architecture](https://wiki.polkadot.network/docs/learn-architecture) allows parachains to natively
interoperate with each other, enabling cross-blockchain transfers of any type of data or asset.

To do so, a [Cross-Consensus Message (XCM)](https://wiki.polkadot.network/docs/learn-crosschain) format defines a
language around how the message transfer between two interoperating blockchains should be performed. XCM is not specific
to Polkadot, as it aims to be a generic and extensible language between different consensus systems.

This page is a brief introduction and overview of XCM and other related elements. More information can be found in
[Polkadot's Wiki](https://wiki.polkadot.network/docs/learn-crosschain).

## General XCM Definitions

- **XCM** — stands for cross-consensus message. It is a general way for consensus systems to communicate with each other
- **VMP** — stands for vertical message passing, one of the transport methods for XCMs. It allows parachains to exchange
  messages with the relay chain. *UMP* (upward message passing) enables parachains to send messages to their relay
  chain, while *DMP* (downward message passing) enables the relay chain to pass messages down to one of their parachains
- **XCMP** — stands for cross-consensus message passing, one of the transport methods for XCMs. It allows parachains to
  exchange messages with other parachains on the same relay chain
- **HRMP** — stands for horizontal relay-routed message passing, a stop-gap protocol while a full XCMP implementation is
  launched. It has the same interface as XCMP, but messages are stored on the relay chain
- **Sovereign account** — an account each chain in the ecosystem has, one for the relay chain and the other for other
  parachains. It is calculated as the `blake2` hash of a specific word and parachain ID concatenated
  (`blake2(para+ParachainID)` for the Sovereign account in the relay chain, and `blake2(sibl+ParachainID)` for the
  Sovereign account in other parachains), truncating the hash to the correct length. The account is owned by root and
  can only be used through SUDO (if available) or [governance (referenda)](/docs/about-moonsama/governance). The Sovereign
  account typically signs XCM messages in other chains in the ecosystem
- 
    
    **Multilocation** — a way to specify a point in the entire relay chain/parachain ecosystem relative to a given 
    origin. For example, it can be used to specify a specific parachain, asset, account, or even a pallet inside a 
    parachain. In general terms, a multilocation is defined with a `parents` and an `interior`:
    
    - `parents` - refers to how many "hops" into a parent blockchain you need to take from a given origin
    - `interior` - refers to how many fields you need to define the target point.
    
    For example, to target a parachain with ID `1000` from another parachain, the multilocation would be 
    `{ "parents": 1, "interior": { "X1": [{ "Parachain": 1000 }]}}`
    

## XCM Instructions

XCM messages contain a series of
[actions/instructions](https://github.com/paritytech/xcm-format#5-the-xcvm-instruction-set) that are executed by the
Cross-Consensus Virtual Machine (XCVM). An action (for example, transferring a token from one blockchain to another)
consists of instructions that the XCVM partly executes in the origin and destination chains.

For example, an XCM message that transfers DOT from Polkadot to Moonsama Network will include the following XCM
instructions (in that order), which are partly executed on Polkadot and partly executed on Moonsama Network:

1. [TransferReserveAsset](https://github.com/paritytech/xcm-format#transferreserveasset) — executed in Polkadot
2. [ReserveAssetDepossited](https://github.com/paritytech/xcm-format#reserveassetdeposited) — executed in Moonsama
   Network
3. [ClearOrigin](https://github.com/paritytech/xcm-format#clearorigin) — executed in Moonsama Network
4. [BuyExecution](https://github.com/paritytech/xcm-format#buyexecution) — executed in Moonsama Network
5. [DepositAsset](https://github.com/paritytech/xcm-format#depositasset) — executed in Moonsama Network

## XCM Transport Protocols

Polkadot implements two cross-consensus or transport protocols for acting on XCM messages between its constituent
parachains, Moonsama Network being one of them:

- 
    
    **Vertical Message Passing (VMP)** — is divided into two kinds of message-passing transport protocols:
    
    - **Upward Message Passing (UMP)** — allows parachains to send messages to their relay chain, for example, from
      Moonsama Network to Polkadot
    - **Downward Message Passing (DMP)** — allows the relay chain to pass messages down to one of their parachains, for
      example, from Polkadot to Moonsama Network

- 
    
    **Cross-Chain Message Passing (XCMP)** — allows two parachains to exchange messages as long as they are connected to
    the same relay chain. Cross-chain transactions are resolved using a simple queuing mechanism based on a Merkle tree
    to ensure fidelity. Collators exchange messages between parachains, while the relay chain validators will verify
    that the message transmission happened
    

:::note
Currently, while XCMP is being developed, a stop-gap protocol is implemented called Horizontal Relay-routed Message
Passing (HRMP), in which the messages are stored in and read from the relay chain. This will be deprecated in the future
for the full XCMP implementation.
:::

Furthermore, the two most common use-cases for XCM messages, at least in the early stages of its implementations, are:

- **Asset Teleporting** — consists of moving an asset from one blockchain to another by destroying the amount being
  transferred in the origin chain and creating a clone (same amount as destroyed) on the target chain. In such cases,
  each chain holds the native asset as reserve, similar to a burn-mint bridging mechanism. The model requires a certain
  degree of trust, as any of the two chains could maliciously mint more assets
- **Remote Transfers** — consists of moving an asset from one blockchain to another via an intermediate account in the
  origin chain that is trustlessly owned by the target chain. This intermediate account is known as the "sovereign"
  account. In such cases, the origin chain asset is not destroyed but held by the sovereign account. The XCM execution
  in the target chain mints a wrapped (also referred to as "virtual" or "cross-chain" asset) representation to a target
  address. The wrapped representation is always interchangeable on a 1:1 basis with the native asset. This is similar to
  a lock-mint / burn-unlock bridging mechanism


A much more detailed article about XCM can be found in the [Polkadot
Wiki](https://wiki.polkadot.network/docs/learn-crosschain).

Initially, Moonsama Network will only support remote transfers. All cross-chain assets on Moonsama Network will be known
as *xc + TokenName*. For example, Polkadot's DOT representation on Moonsama Network is known as *xcDOT* and Kusama's KSM
representation on Moonsama Network is *xcKSM*. You can read more about the XC-20 standard in the [XC-20s and Cross Chain
Assets](builders/interoperability/xcm/xc20) overview.

**Developers must understand that sending incorrect XCM messages can result in the loss of funds.** Consequently, it is
essential to test XCM features on a TestNet before moving to a production environment.

## Channel Registration

Before two chains can start communicating, a messaging channel must be opened. Channels are unidirectional, meaning that
a channel from chain A to chain B will only pass messages from A to B. Consequently, asset transfers will be possible
only from chains A to B. Therefore, two channels must be opened to send messages (or transfer assets) back and forth.

A channel for XCMs between the relay chain and parachain is automatically opened when a connection is established.
However, when parachain A wants to open a communication channel with parachain B, parachain A must send an open channel
extrinsic in its network. This extrinsic is an XCM as well! This XCM message consists at least of the following [XCM
instructions](builders/interoperability/xcm/overview/#xcm-instructions) (in that specific order):

1. [WithdrawAsset](https://github.com/paritytech/xcm-format#withdrawasset)
2. [BuyExecution](https://github.com/paritytech/xcm-format#buyexecution)
3. [Transact](https://github.com/paritytech/xcm-format#transact)

Here, **Transact** will include the encoded call data to execute a channel open/accept action in the relay chain.
Additional instructions can be included to refund assets that were not consumed during the execution.

The XCM message sent to the relay chain consists of at least:

- The destination where the message will be executed (relay chain in this case)
- The account that will pay the fees (paid in the relay chain token)
- Fees that the transaction can consume when executed
- Encoded call data, obtained by mimicking the extrinsic on the relay chain. This includes the following encoded
  information:
    - Method to be called in the relay chain (open channel)
    - Parachain ID of the target chain (parachain B in this example)
    - Maximum number of messages in the destination queue
    - Maximum size of the messages to be sent

The transaction fees are paid in the cross-chain (xc) representation of the relay chain asset (*xcRelayChainAsset*). For
example, for Polkadot/Moonsama Network, the transaction fees are paid in *xcDOT*. Similarly, for Kusama/Moonsama
Network, the transaction fees are paid in *xcKSM*. Therefore, the account paying for the fees must have enough
*xcRelayChainAsset*. This might be tackled on Moonsama Network/Moonsama Network by having fees from incoming XCM
messages, which are paid in the origin chain asset, sent to the treasury, and using the treasury account to pay for the
channel registration extrinsic.

Even though parachain A has expressed its intentions of opening an XCM channel with parachain B, the latter has not
signaled to the relay chain its intentions to receive messages from parachain A. Therefore, to have an established
channel, parachain B must send an extrinsic (an XCM) to the relay chain. The accepting channel extrinsic is similar to
the previous one. However, the encoded call data only includes the new method (accept channel) and the parachain ID of
the sender (parachain A in this example). Once both parachains have agreed, the channel is opened within the following
epoch change.


All the actions mentioned above can be executed via SUDO (if available), or through democracy (technical committee or
referenda).

Once the channel is established, assets need to be registered before being transferred through XCMs, either by being
baked into the runtime as a constant, or through a pallet. The asset registration process for Moonsama Network is
explained in the next section.

## XCM Asset Registration

Once a channel is established between parachains (or relay chain-parachain), asset registration can occur.

In general, asset registration can happen at a runtime level, which means that a runtime upgrade is required, after
which the asset is now registered and supported by XCM. However, Moonsama Network included a Substrate pallet to handle
asset registration without the need for runtime upgrades, making the process a lot simpler.

When registering an XCM asset, the extrinsic must include (among other things):

- Parachain ID of where the origin asset is located
- Type of asset. At the time of writing, you can register either the native parachain token or an asset created via the
  [Pallet Assets](https://github.com/paritytech/substrate/blob/master/frame/assets/src/lib.rs), by providing its index
- An asset name, symbol, and decimal count
- Minimum balance

After the XCM asset is registered, the units per second of execution may be set. This is a metric used to charge the
incoming XCM message for its execution in the target parachain, similar to gas fees in the Ethereum world. Nevertheless,
fees can be charged in another token, for example, DOT. If the amount of tokens being sent via the XCM is not enough to
cover the XCM execution, the XCM transaction fails, and the spent fee is not refunded.

Once the channel has been successfully established, the XCM asset registered in the target parachain, and the units per
second of execution set, users should be able to start transferring assets.

All the actions mentioned above can be executed via SUDO (if available), or through Democracy (technical committee or
referenda).

## Moonsama Network and XCM

As Moonsama Network is a parachain within the Polkadot ecosystems, one of the most direct implementations of XCM is to
enable asset transfer from Polkadot and other parachains from/to Moonsama Network. This will allow users to bring their
tokens to Moonsama Network and all its dApps.

Expanding on Moonsama Network's unique Ethereum compatibility features, foreign assets will be represented via a
standard ERC-20 interfacethrough a precompiled contract. XCM assets on Moonsama Network are called XC-20s, to
differentiate native XCM assets from ERC-20 generated via the EVM. The precompile contract will access the necessary
Substrate functions to perform the required actions. Nevertheless, from a developer's perspective, XC-20s are ERC-20
tokens with the added benefit of being an XCM cross-chain asset, and dApps can easily support them through a familiar
ERC-20 interface.

The precompile does not support cross-chain transfers to stay as close as possible to the original ERC-20 interface.
Consequently, developers will have to rely on the Substrate API and XCMs to move the assets back to their original
chain, or on a different [precompile contract](/tree/master/precompiles/xtokens) to access XCM based features from the
Ethereum API.

Depending on the target blockchain, asset transfers can be done via teleporting or remote transfers, the latter being
the most common method used. Initially, Moonsama Network will only support remote transfers.

The following sections provide a high-level overview of the two initial use cases for XCM on Moonsama Network: asset
transfers from/to Polkadot (via VMP) and asset transfers from/to other parachains (via XCMP). This page will be expanded
as more interoperability features become available, such as movements of ERC-20 tokens from Moonsama Network to other
parachains, or movement of other assets to Moonsama Network as ERC-20 representations.

### Moonsama Network & Polkadot

As Moonsama Network is a parachain within the Polkadot ecosystem, XCM + VMP allows DOT transfers from/to
Polkadot/Moonsama Network. This section goes through a high-level overview of all the actions involved during the
execution of such XCM messages.

Once a project is onboarded as a parachain it automatically has a bi-directional communication channel with the relay
chain. Therefore, there is no need for chain registration. However, the relay chain native token needs to be registered
on the parachain.

Alice (Polkadot) wants to transfer a certain amount of DOT from Polkadot to her account on Moonsama Network, named
Alith. Therefore, she initiates an XCM that expresses her intentions. For such transfers, Moonsama Network owns a
sovereign account on Polkadot.

Consequently, the XCM message execution on Polkadot will transfer the amount of DOT to Moonsama Network's sovereign
account on Polkadot. Once the assets are deposited, the second part of the message is sent to Moonsama Network.

Moonsama Network will locally execute the action the XCM message is programmed to do. In this case, it is to mint and
transfer the same amount of *xcDOT* (cross-chain DOT) to the account defined by Alice, which in this case is Alith. The
fee to execute the XCM in the target parachain is paid in the asset being transferred (*xcDOT* for this example).


Note the following:

- Alice and Alith accounts can be different. For example, Polkadot's accounts are SR25519 (or ED25519), while Moonsama
  Network's are ECDSA (Ethereum styled) accounts. They can also have different owners
- There is a certain degree of trust, where one chain relies on the other to execute its part of the XCM message. This
  is programmed at a runtime level, so that it can be easily verified
- For this example, cross-chain DOT (*xcDOT*) are a wrapped representation of the original DOT being held in Moonsama
  Network's sovereign account on Polkadot. *xcDOT* can be transferred within Moonsama Network at any time, and they can
  be redeemed for DOT on a 1:1 basis as well

Alith deposited her *xcDOT* in a liquidity pool. Next, Charleth acquires some *xcDOT* by swapping against that liquidity
pool, and he wants to transfer some *xcDOT* to Charley's Polkadot account. Therefore, he initiates an XCM that expresses
his intentions.

Consequently, the XCM message execution on Moonsama Network will burn the number of *xcDOT*. Once the assets are burned,
the second part of the message is sent to Polkadot.

Polkadot will execute the action the XCM message is programmed to do locally. In this case, it is to transfer the same
amount of *xcDOT* burned from the Moonsama Network sovereign account to the account defined by Charleth, which in this
case is Charley.


### Moonsama Network & Other Parachains

As Moonsama Network is a parachain within the Polkadot ecosystem, XCM + XCMP allows asset transfers from/to Moonsama
Network and other parachains. This section goes through a high-level overview of the main differences compared to XCMs
from/to Polkadot/Moonsama Network.

The first requirement is that a channel between the parachains must exist, and the asset being transferred must be
registered in the target parachain. Only when both conditions are met can XCMs be sent between parachains.

Then, when Alith (Moonsama Network) transfers a certain amount of GLMR from Moonsama Network to another account (Alice)
in a target parachain, tokens are sent to a sovereign Account owned by that target parachain on Moonsama Network.

As the XCM message is executed in the target parachain, it is expected that this will mint and transfer the same amount
of *xcGLMR* (cross-chain GLMR) to the account defined by Alith, which in this case is Alice. The fee to execute the XCM
in the target parachain is paid in the transferred asset (*xcGLMR* for this example).

As explained in the previous section, the process is similar for *xcGLMR* to move back to Moonsama Network. First, the
XCM message execution burns the number of *xcGLMR* returned to Moonsama Network. Once burned, the remnant part of the
message is sent to Moonsama Network via the relay chain. Moonsama Network will locally execute the XCM message's, and
transfer GLMR (the same amount of burned *xcGLMR*) from the target parachain sovereign account to the specified address.
