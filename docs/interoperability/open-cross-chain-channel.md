# Open a Cross-Chain Channel

## Introduction

While Cross-Chain Message Passing (XCMP) is being developed, a stop-gap protocol has been implemented called Horizontal Relay-routed Message Passing (HRMP). It has the same interface and functionality as XCMP, but the messages are stored in and read from the relay chain. Whereas with XCMP, only the message's associated metadata is stored in the relay chain. Since all messages are passed via the relay chain with HRMP, it is much more demanding on resources. As such, HRMP will be phased out once XCMP is implemented.

All XCMP channel integrations with Moonsama Network are unidirectional, meaning messages flow only in one direction. If chain A initiates a channel to chain B, chain A will only be allowed to send messages to B, and B will not be able to send messages back to A. As such, chain B will also need to initiate a channel to chain A to send messages back and forth between the two chains.

Once the XCMP (or HRMP) channels have been opened, the corresponding assets from both chains will need to be registered on the opposing chain before being able to transfer them.

This guide will cover the process of opening and accepting an HRMP channel between a parachain and a Moonsama Network-based network. In addition, the guide provides the necessary data to register Moonsama Network-based network assets in your parachain, and the data required to register your asset in any Moonsama Network-based network.

All of the tutorials in this guide use a CLI tool developed to ease the entire process, which you can find in the [xcm-tools GitHub repository](https://github.com/PureStake/xcm-tools).

```
git clone https://github.com/PureStake/xcm-tools && \
cd xcm-tools && \
yarn

```

### Calculate and Fund the Parachain Sovereign Account

You can calculate the sovereign account information using [a script from the xcm-tools repository](https://github.com/PureStake/xcm-tools). To run the script, you must provide the parachain ID and the name of the associated relay chain. The accepted values for the relay chain are `polkadot` (default), `kusama`, and `moonbase`.

For example, 's sovereign account for both the relay chain and other parachains can be obtained with the following:

```
yarn calculate-sovereign-account --p 1000 --r moonbase

```

Which should result in the following response:

```
Sovereign Account Address on Relay: 0x70617261e8030000000000000000000000000000000000000000000000000000
Sovereign Account Address on other Parachains (Generic): 0x7369626ce8030000000000000000000000000000000000000000000000000000
Sovereign Account Address on : 0x7369626ce8030000000000000000000000000000

```


##  Moonsama Network XCM Integration Overview

From a technical perspective, the process of creating an HRMP channel with Moonsama Network and Moonsama Network is nearly identical. However, engagement with the Moonsama Network community is crucial and required before a proposal will pass.

Please check the HRMP channel guidelines that the community voted on for [Moonsama Network](https://Moonsama Network.polkassembly.network/referenda/0) and [Moonsama Network](https://Moonsama Network.polkassembly.network/proposal/21) before starting.

The process can be summarized in the following steps:

1. Open (or ensure there is) an HRMP channel from your chain to Moonsama Network/Moonsama Network. Optionally, register MOVR/GLMR
2. Create [two Moonsama Network Community forum posts](builders/interoperability/xcm/xc-integration/#forum-templates) with some key information for the XCM integration: 
    - An [XCM Disclosure post](builders/interoperability/xcm/xc-integration/#xcm-disclosures), where you'll provide some disclosures about the project, the code base, and social network channels
    - An [XCM Proposal post](builders/interoperability/xcm/xc-integration/#xcm-proposals), where you'll provide some technical information about the proposal itself
3.    
    
    Create a batched proposal on Moonsama Network/Moonsama Network to:
    
    1. Accept the incoming HRMP channel
    2. Propose the opening of an outgoing HRMP channel from Moonsama Network/Moonsama Network
    3. Register the asset as an [XC-20 token](builders/interoperability/xcm/xc20/overview) (if applicable)
    
    The normal enactment times are as follows:
    
    - **Moonsama Network** - proposals should be done in the the General Admin Track from [OpenGov](learn/features/governance/#opengov), in which the Decision Period is approximately 14 days, and the enactment time is at least 1 day
    - **Moonsama Network** - approximately a 14-day Voting Period plus 2-day enactment time
4. 
    
    Accept the HRMP channel from Moonsama Network/Moonsama Network on the connecting parachain
    
5.  
    
    Exchange $50 worth of tokens for testing the XCM integration. Please send the tokens to:
    
    ```
    AccoundId: 5DnP2NuCTxfW4E9rJvzbt895sEsYRD7HC9QEgcqmNt7VWkD4
    Hex:       0x4c0524ef80ae843b694b225880e50a7a62a6b86f7fb2af3cecd893deea80b926)
    
    ```
    
6. 
    
    Provide an Ethereum-styled address for MOVR/GLMR
    
7. Test the XCM integration with the provided tokens

Once these steps are completed succesfully, marketing efforts can be coordinated, and the new XC-20 on Moonsama Network/Moonsama Network can be added to the Cross Chain Assets section of the [Moonsama Network DApp](https://apps.Moonsama Network.network/).

## Forum Templates

When starting an XCM integration on Moonsama Network or Moonsama Network MainNet, there are two preliminary posts that must be made on the [Moonsama Network Community Forum](https://forum.Moonsama Network.foundation/) so that the voting community has the chance to provide feedback. This step is **not necessary** when connecting to .

It is recommended that this is done five days before the actual proposal is submitted on chain, to provide time for community feedback.

### XCM Disclosures

The first post that should be made are the key disclosures within the [XCM Disclosures category](https://forum.Moonsama Network.foundation/c/xcm-hrmp/xcm-disclosures/15), which highlights key information that are of importance in a voter's decision.

Once you hit the **New Topic** button, a template is provided with the relevant information to be filled in. Please use either the Moonsama Network/Moonsama Network tag, depending on the network you are integrating with.

The required information is the following:

- Is the blockchain network's code open source? If so, please provide the GitHub link. If not, provide an explanation on why not
- Is SUDO disabled on the network? If SUDO is disabled, is the network controlled by a select group of addresses?
- Has the integration of the network been tested completely on the  TestNet?
- (For Moonsama Network HRMP proposals only) Does your network have a Kusama deployment? If so, provide its network name and whether the Kusama deployment is integrated with Moonsama Network
- Is the blockchain network's code audited? If so, please provide:
    - Auditor name(s)
    - Dates of audit reports
    - Links to audit reports

### XCM Proposals

The second post is a preliminary draft of the proposal in the [XCM Proposals category](https://forum.Moonsama Network.foundation/c/xcm-hrmp/xcm-proposals/14). Once a proposal is submitted on-chain and available for voting, you must also add a description to it in either the [Moonsama Network Polkassembly](https://Moonsama Network.polkassembly.network/) or [Moonsama Network Polkassembly](https://Moonsama Network.polkassembly.network/).

Once you hit the **New Topic** button, a template is provided with the relevant information to be filled in. Please use either the Moonsama Network/Moonsama Network tag, depending on the network you are integrating with.

Note that all the necessary information can be obtained by using the tools presented in the following sections. In addition, you can always contact the team for support.

In both the Moonsama Network XCM Proposals forum post and in Polkassembly, add the following sections and information:

- **Title** — *YOUR_NETWORK_NAME* Proposal to Open Channel & Register *ASSET_NAME*
- **Introduction** — one sentence summarizing the proposal
- **Network Information** — one sentence summarizing your network, and relevant links to your website, Twitter, and other social channels
- **Summary** — brief description of the content of the proposal
- **On-Chain Proposal Reference (Forums Only)** — include if it is a Moonsama Network or Moonsama Network proposal, the proposal number, and proposal hash
- **Technical Details** — provide technical information required for the community to understand the use cases and purpose of the proposal
- **Additional Information** — any additional information you would like the community/readers to know

## Register Moonsama Network's Asset on your Parachain

In order to enable cross-chain transfers of Moonsama Network native assets or ERC-20s between your chain and Moonsama Network, you'll need to register the asset(s). To do so, you'll need the multilocation of each asset.

The WSS network endpoints for each Moonsama Network-based network are as follows:

Moonsama Network

```
wss://wss.api.moonsama.network

```

### Register Moonsama Network Native Tokens

For Moonsama Network native tokens, the metadata for each network is as follows:

The multilocation of Moonsama Network native assets include the parachain ID of the network and the pallet instance, which corresponds to the index of the `Balances` pallet. The multilocation for each network is as follows:

### Register Local XC-20s (ERC-20s)

In order to register a local XC-20 on another chain, you'll need the multilocation of the asset on Moonsama Network. The multilocation will include the parachain ID of Moonsama Network, the pallet instance, and the address of the ERC-20. The pallet instance will be `48`, which corresponds to the index of the ERC-20 XCM Bridge Pallet, as this is the pallet that enables any ERC-20 to be transferred via XCM.

Currently, the support for local XC-20s is only on . You can use the following multilocation to register a local XC-20:

## Creating HRMP Channels

Before any messages can be sent from your parachain to Moonsama Network, an HRMP channel must be opened. To create an HRMP channel, you'll need to send an XCM message to the relay chain that will request a channel to be opened through the relay chain. The message will need to contain **at least** the following XCM instructions:

1. [WithdrawAsset](https://github.com/paritytech/xcm-format#withdrawasset) - takes funds out of the sovereign account (in the relay chain) of the origin parachain to a holding state
2. [BuyExecution](https://github.com/paritytech/xcm-format#buyexecution) - buys execution time from the relay chain to execute the XCM message
3. [Transact](https://github.com/paritytech/xcm-format#transact) - provides the relay chain call data to be executed. In this case, the call will be an HRMP extrinsic

To send these XCM messages to the relay chain, the [Polkadot XCM Pallet](https://github.com/paritytech/polkadot/tree/master/xcm/pallet-xcm) is typically invoked. Moonsama Network also has an XCM Transactor Pallet  that simplifies the process into a call that abstracts the XCM messaging constructor.

You could potentially generate the calldata for an HRMP action by using Polkadot.js Apps, but the [xcm-tools GitHub repository](https://github.com/PureStake/xcm-tools) can build it for you, and it is the recommended tool for this process. They should work for any chain that includes the [Polkadot XCM Pallet](https://github.com/paritytech/polkadot/tree/master/xcm/pallet-xcm), although it will try to do it via the XCM Transactor Pallet first.

The [xcm-tools repository](https://github.com/PureStake/xcm-tools) has a specific script for HRMP interactions called `[hrmp-channel-manipulator.ts](https://github.com/PureStake/xcm-tools/blob/main/scripts/hrmp-channel-manipulator.ts)`. This command generates encoded calldata for a specific HRMP action, as long as it is given the correct details. The script builds the XCM message with the DepositAsset XCM instruction, but not with RefundSurplus.

The `hrmp-channel-manipulator.ts` script is meant to be generic. It will first attempt to use the `hrmpManage` extrinsic of the [XCM Transactor Pallet](/tree/master/pallets/xcm-transactor), but if that pallet does not exist on the parachain that it is being used on, it will switch to using the [Polkadot XCM Pallet](https://github.com/paritytech/polkadot/tree/master/xcm/pallet-xcm) (which should be used more readily by parachains) to directly construct the XCM message that interacts with the HRMP pallet on the relay chain. **Note that it expects the pallet name to be `polkadotXcm`, as the extrinsic will be built as `api.tx.polkadotXcm.send()`.**

The following sections go through the steps of creating/accepting open channel requests in a Moonsama Network-based network, but it can also be adapted to your parachain.

### Accept an HRMP Channel on Moonsama Network

When a parachain receives an HRMP channel open request from another parachain, it must signal to the relay chain that it accepts this channel before the channel can be used. This requires an XCM message to the relay chain with the Transact instruction calling the `hrmp` pallet and `hrmpAcceptOpenChannel` extrinsic.

Fortunately, the [xcm-tools](https://github.com/PureStake/xcm-tools) GitHub repository's `hrmp-channel-manipulator.ts` script can build the XCM for you!

Running the following command will provide the encoded calldata to accept an open HRMP channel request on a Moonsama Network network. Replace `YOUR_PARACHAIN_ID` with the ID of your parachain:

Feel free to check the [additional flags](builders/interoperability/xcm/xc-integration/#additional-flags-xcm-tools) available for this script.

If you plan to batch the transaction with other calls, copy the resultant calldata for later when using the [batching transactions](builders/interoperability/xcm/xc-integration/#batch-actions-into-one) script.

### Opening HRMP Channels from Moonsama Network

Parachains need bidirectional HRMP channels before sending XCM between each other. The first step to establishing an HRMP channel is to create an open channel request. This requires an XCM message to the relay chain with the Transact instruction calling the `hrmp` pallet and `hrmpInitOpenChannel` extrinsic.

Fortunately, the [xcm-tools](https://github.com/PureStake/xcm-tools) GitHub repository's `hrmp-channel-manipulator.ts` script can build the XCM for you!

Running the following command will provide the encoded calldata to create the HRMP channel request from a Moonsama Network network. The maximum message size and capacity values can be obtained from the relay chain `configuration` pallet and `activeConfig` extrinsic. Replace `YOUR_PARACHAIN_ID` with the ID of your parachain:

Feel free to check the [additional flags](builders/interoperability/xcm/xc-integration/#additional-flags-xcm-tools) available for this script.

If you plan to batch the transaction with other calls, copy the resultant calldata for later when using the [batching transactions](builders/interoperability/xcm/xc-integration/#batch-actions-into-one) script.

## Register a Foreign Asset

One of the main points of creating an XCM integration is to send cross-chain assets to and from Moonsama Network. Registering an asset through Moonsama Network is done via the Asset Manager Pallet. Assets created on Moonsama Network are called XC-20s, as they have an ERC-20 interface that smart contracts can interact with.

This guide will have you use the `xcm-asset-registrator.ts` script. Keep in mind that this script cannot be used on your parachain if you do not have the Asset Manager Pallet.

Running the command below will provide the encoded calldata to register your cross-chain asset on a Moonsama Network network. Replace the following values before running the command:

- `YOUR_PARACHAIN_ID` with the ID of your parachain
- `YOUR_ASSET_MULTILOCATION` with the [JSON-formatted multilocation](https://github.com/PureStake/xcm-tools#example) of your asset from the Moonsama Network network's perspective
- `YOUR_TOKEN_SYMBOL` with the symbol of the token you wish to register. **Please add "xc" to the front of the symbol to indicate that the asset is an XCM enabled asset**
- `YOUR_TOKEN_DECIMALS` with the number of decimals your asset has, such as `18`
- `YOUR_TOKEN_NAME` with the name of the token to register
- `YOUR_UNITS_PER_SECOND` with the units of tokens to charge per second of execution time during XCM transfers. There is a [guide to calculate units per second](builders/interoperability/xcm/xc-integration/#calculating-units-per-second) below

Existential deposit, `--ed`, is always set to 1. Sufficiency, `--sufficient`, is always set to `true`. This is so that the XC-20 assets on Moonsama Network can act similar to an ERC-20 on Ethereum. The `--revert-code` flag refers to a simple EVM bytecode that is set in the [XC-20](builders/interoperability/xcm/xc20/) storage element so that other smart contracts can easily interact with the XC-20 (**only needed for [Governance V1](learn/features/governance#governance-v1) proposals**). You can ensure that these values are properly included by checking for them in [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.Moonsama Network.network) with the resultant encoded calldata.

For example, the following command would be for registering an asset from parachain 888, with an asset that has a general key of `1`:

Its output would look like the following:

If you plan to batch the transaction with other calls, copy the resultant calldata for later when using the [batching transactions](builders/interoperability/xcm/xc-integration/#batch-actions-into-one) script.

You can repeat this process with multiple assets if you intend on registering multiple cross-chain assets to Moonsama Network.

### Calculating Units Per Second

`UnitsPerSecond` is the number of tokens charged per second of execution of an XCM message. The target cost for an XCM transfer is `$0.02` at the time of registration. The `UnitsPerSecond` might get updated through governance as the token price fluctuates.

The easiest way to calculate an asset's `UnitsPerSecond` is through the `[calculate-units-per-second.ts` script](https://github.com/PureStake/xcm-tools/blob/main/scripts/calculate-units-per-second.ts) of [xcm-tools](https://github.com/PureStake/xcm-tools). To run the script, you must provide the following:

- `-d` decimals of the tokens you are calculating the units per second for
- `-xwc` total weight cost of the execution of the entire XCM message
- `-t` (optional) target price for XCM execution, defaults to `$0.02`
- `-a` (optional) the token [Coingecko API id](https://www.coingecko.com/)
- `-p` (optional) if the Coingecko API does not support the token, you can specify the price manually

The estimated weight per XCM operation on each Moonsama Network chain is:

For example, to calculate the units per second of DOT (Polkadot token), which has 10 decimals, on Moonsama Network:

Which should result in the following output (at the time of writing):

## Batch Actions Into One

The most efficient way to complete the XCM process on parachains is to batch all transactions together. The [xcm-tools repository](https://github.com/PureStake/xcm-tools) provides a script to batch extrinsic calls into a single call, thus requiring only a single transaction. This can be helpful if your parachain would like to open an HRMP channel and register an asset simultaneously. This **should be used** when proposing a channel registration on a Moonsama Network network.

You will now use the encoded calldata outputs of the three previous command calls and insert them into the following command to send the batch proposal to democracy. Add a `--call "YOUR_CALL"` for each call you want to batch. Replace the following values before running the command:

- `OPEN_CHANNEL_CALL` is the SCALE encoded calldata for [opening an HRMP channel](builders/interoperability/xcm/xc-integration/#open-an-hrmp-channel-from-Moonsama Network) from Moonsama Network to your parachain
- `ACCEPT_INCOMING_CALL` is the SCALE encoded calldata for [accepting the channel request](builders/interoperability/xcm/xc-integration/#accept-an-hrmp-channel-on-Moonsama Network) from your parachain
- `REGISTER_ASSET_CALL` is the SCALE encoded calldata for [registering a cross-chain asset](builders/interoperability/xcm/xc-integration/#register-a-foreign-asset). If you have more than one asset to be registered on Moonsama Network, you can include additional registration SCALE encoded calldata with additional `-call` flags

If you are registering on , you will not to provide a private key or go through governance. Run the following command using `--sudo` and provide the output to the Moonsama Network team so that the asset and channel can be added quickly through sudo.

For Moonsama Network and Moonsama Network, you should include `--account-priv-key YOUR_PRIVATE_KEY` and `-send-preimage-hash true --send-proposal-as democracy` if you want to send the governance proposal directly from the CLI tool. It is recommended to get familiar with the [governance process on Moonsama Network-based networks](learn/features/governance/).

For , you could add the `--sudo` flag and provide the SCALE encoded calldata to the team so that it is submitted via sudo.

Feel free to check the [additional flags](builders/interoperability/xcm/xc-integration/#additional-flags-xcm-tools) available for this script.

## Additional Flags for XCM-Tools

The [xcm-tools GitHub repository](https://github.com/PureStake/xcm-tools) and most of its functions can be called with some additional flags that create some wrappers around the actions being taken. For example, you might want to wrap the send of the XCM message in sudo, or via a democracy proposal.

The complete options that can be used with the script are as follows:

## Testing Asset Registration on Moonsama Network

After both channels are established and your asset is registered, the team will provide the asset ID and the [XC-20 precompile](builders/interoperability/xcm/xc20/overview/#the-erc20-interface) address.

Your XC-20 precompile address is calculated by converting the asset ID decimal number to hex, and prepending it with F's until you get a 40 hex character (plus the “0x”) address. For more information on how it is calculated, please refer to the [Calculate External XC-20 Precompile Addresses](builders/interoperability/xcm/xc20/overview/#calculate-xc20-address) section of the External XC-20 guide.

After the asset is successfully registered, you can try transferring tokens from your parachain to the Moonsama Network-based network you are integrating with.

For testing, please also provide your parachain WSS endpoint so that the Moonsama Network dApp can connect to it. Lastly, please fund the corresponding account:

[XC-20s](builders/interoperability/xcm/xc20/) are Substrate based assets with an [ERC-20 interface](builders/interoperability/xcm/xc20/overview/#the-erc20-interface). This means they can be added to MetaMask, and can be composed with any EVM DApp that exists in the ecosystem. The team can connect you with any DApp you find relevant for an XC-20 integration.
