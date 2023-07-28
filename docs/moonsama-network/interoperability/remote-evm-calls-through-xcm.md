# Remote EVM Calls Through XCM


## Introduction

The [XCM Transactor Pallet](builders/interoperability/xcm/xcm-transactor/) provides a simple interface to perform remote cross-chain calls through XCM. However, this does not consider the possibility of doing remote calls to Moonsama Network's EVM, only to Substrate specific pallets (functionalities).

Moonsama Network's EVM is only accessible through the [Ethereum Pallet](https://github.com/paritytech/frontier/tree/master/frame/ethereum). Among many other things, this pallet handles certain validations of transactions before getting them into the transaction pool. Then, it performs other validation step before inserting a transaction from the pool in a block. Lastly, it provides the interface through a `transact` function to execute a validated transaction. All these steps follow the same behavior as an Ethereum transaction in terms of structure and signature scheme.

However, calling the [Ethereum Pallet](https://github.com/paritytech/frontier/tree/master/frame/ethereum) directly through an XCM `[Transact](https://github.com/paritytech/xcm-format#transact)` is not feasible. Mainly because the dispatcher account for the remote EVM call (referred to as `msg.sender` in Ethereum) does not sign the XCM transaction on the Moonsama Network side. The XCM extrinsic is signed in the origin chain, and the XCM executor dispatches the call, through the `[Transact](https://github.com/paritytech/xcm-format#transact)` instruction, from a known caller linked to the sender in the origin chain. In this context, the Ethereum Pallet will not be able to verify the signature and, ultimately, validate the transaction.

To this end, the [Ethereum XCM Pallet](/tree/master/pallets/ethereum-xcm) was introduced. It acts as a middleware between the XCM `[Transact](https://github.com/paritytech/xcm-format#transact)` instruction and the [Ethereum Pallet](https://github.com/paritytech/frontier/tree/master/frame/ethereum), as special considerations need to be made when performing EVM calls remotely through XCM. The pallet performs the necessary checks and validates the transaction. Next, the pallet calls the Ethereum Pallet to dispatch the transaction to the EVM. Due to how the EVM is accessed, there are some differences between regular and remote EVM calls.

The happy path for both regular and remote EVM calls through XCM is portrayed in the following diagram:


This guide will go through the differences between regular and remote EVM calls. In addition, it will show you how to perform remote EVM calls through the extrinsic exposed by the [Ethereum XCM pallet](/tree/master/pallets/ethereum-xcm).

Note

Remote EVM calls are done through the [XCM Transactor Pallet](builders/interoperability/xcm/xcm-transactor/). Therefore, it is recommended to get familiar with XCM Transactor concepts before trying to perform remote EVM calls through XCM.

**Note that remote calls to Moonsama Network's EVM through XCM are still being actively developed**. In addition, **developers must understand that sending incorrect XCM messages can result in the loss of funds.** Consequently, it is essential to test XCM features on a TestNet before moving to a production environment.

## Relevant XCM Definitions

- **Sovereign account** — an account each chain in the ecosystem has, one for the relay chain and the other for other parachains. It is calculated as the `blake2` hash of a specific word and parachain ID concatenated (`blake2(para+ParachainID)` for the Sovereign account in the relay chain, and `blake2(sibl+ParachainID)` for the Sovereign account in other parachains), truncating the hash to the correct length. The account is owned by root and can only be used through SUDO (if available) or [governance (referenda)](learn/features/governance). The Sovereign account typically signs XCM messages in other chains in the ecosystem
- 
    
    **Multilocation** — a way to specify a point in the entire relay chain/parachain ecosystem relative to a given origin. For example, it can be used to specify a specific parachain, asset, account, or even a pallet inside a parachain. In general terms, a multilocation is defined with a `parents` and an `interior`:
    
    - `parents` - refers to how many "hops" into a parent blockchain you need to take from a given origin
    - `interior` - refers to how many fields you need to define the target point.
    
    For example, to target a parachain with ID `1000` from another parachain, the multilocation would be `{ "parents": 1, "interior": { "X1": [{ "Parachain": 1000 }]}}`
    
- 
    
    **Multilocation-derivative account** — an account derivated from the new origin set by the [Descend Origin](https://github.com/paritytech/xcm-format#descendorigin) XCM instruction and the provided multilocation, which is typically the sovereign account from which the XCM originated. Derivative accounts are keyless (the private key is unknown). Consequently, derivative accounts related to XCM-specific use cases can only be accessed through XCM extrinsics. For Moonsama Network-based networks, [the derivation method](/blob/master/primitives/xcm/src/location_conversion.rs#L31-L37) is calculating the `blake2` hash of the multilocation, which includes the origin parachain ID, and truncating the hash to the correct length (20 bytes for an Ethereum-styled account). The XCM call [origin conversion](https://github.com/paritytech/polkadot/blob/master/xcm/xcm-executor/src/lib.rs#L343) happens when the `Transact` instruction gets executed. Consequently, each parachain can convert the origin with its own desired procedure, so the user who initiated the transaction might have a different derivative account per parachain. This derivative account pays for transaction fees, and it is set as the dispatcher of the call
    
- **Transact information** — relates to extra weight and fee information for the XCM remote execution part of the XCM Transactor extrinsic. This is needed because the sovereign account pays the XCM transaction fee. Therefore, XCM Transactor calculates what the fee is and charges the sender of the XCM Transactor extrinsic the estimated amount in the corresponding [XC-20 token](builders/interoperability/xcm/xc20/overview/) to repay the sovereign account

## Differences Between Regular and Remote EVM Calls Through XCM

As explained in the [Introduction](builders/interoperability/xcm/remote-evm-calls/#introduction), the paths that regular and remote EVM calls take to get to the EVM are quite different. The main reason behind this difference is the dispatcher of the transaction.

A regular EVM call has an apparent sender who signs the Ethereum transaction with its private key. The signature, of ECDSA type, can be verified with the signed message and the `r-s` values that are produced from the signing algorithm. Ethereum signatures use an additional variable, called `v`, which is the recovery identifier.

With remote EVM calls, the signer signed an XCM transaction in another chain. Moonsama Network receives that XCM message which must be constructed with the following instructions:

- `[DescendOrigin](https://github.com/paritytech/xcm-format#descendorigin)`
- `[WithdrawAsset](https://github.com/paritytech/xcm-format#withdrawasset)`
- `[BuyExecution](https://github.com/paritytech/xcm-format#buyexecution)`
- `[Transact](https://github.com/paritytech/xcm-format#transact)`

The first instruction, `DescendOrigin`, will mutate the origin of the XCM call on the Moonsama Network side to a keyless account through the **multilocation-derivative account** mechanism described in the [Relevant XCM Definitions section](builders/interoperability/xcm/remote-evm-calls/#general-xcm-definitions). The remote EVM call is dispatched from that keyless account (or a related [proxy](tokens/manage/proxy-accounts/)). Therefore, because the transaction is not signed, it does not have the real `v-r-s` values of the signature, but `0x1` instead.

Because a remote EVM call does not have the actual `v-r-s` values of the signature, there could be collision problems of the EVM transaction hash, as it is calculated as the keccak256 hash of the signed transaction blob. In consequence, if two accounts with the same nonce submit the same transaction object, they will end up with the same EVM transaction hash. Therefore, all remote EVM transactions use a global nonce that is attached to the [Ethereum XCM pallet](/tree/master/pallets/ethereum-xcm).

Another significant difference is in terms of the gas price. The fee for remote EVM calls is charged at an XCM execution level. Consequently, the gas price at an EVM level is zero, and the EVM will not charge for the execution itself. This can also be seen in the receipt of a remote EVM call transaction. Accordingly, the XCM message must be configured so that the `BuyExecution` buys enough weight to cover the gas cost.

The last difference is in terms of gas limit. Ethereum uses a gas-metered system to moderate the amount of execution that can be done in a block. On the contrary, Moonsama Network uses a [weight-based system](https://docs.substrate.io/build/tx-weights-fees/), in which each call is characterized by the time it takes to execute in a block. Each unit of weight corresponds to one picosecond of execution time.

The configuration of the XCM queue suggests that XCM messages should be executable within `20,000,000,000` weight units (that is, `0.02` seconds of block execution time). Suppose the XCM message can't be executed due to the lack of execution time in a given block, and the weight requirement is over `20,000,000,000`. In that case, the XCM message will be marked as `overweight` and would only be executable through democracy.

The `20,000,000,000` weight limit per XCM message constrains the gas limit available for remote EVM calls through XCM. For all Moonsama Network-based networks, there is a ratio of `[25,000` units of gas per unit of weight](/blob/master/runtime/moonbase/src/lib.rs#L379) (`[WEIGHT_REF_TIME_PER_SECOND](https://paritytech.github.io/substrate/master/frame_support/weights/constants/constant.WEIGHT_REF_TIME_PER_SECOND.html)` / `[GAS_PER_SECOND](/blob/master/runtime/moonbase/src/lib.rs#L375)`). Considering that you need some of the XCM message weight to execute the XCM instructions themselves. Therefore, a remote EVM call might have around `18,000,000,000` weight left, which is `720,000` gas units. Consequently, the maximum gas limit you can provide for a remote EVM call is around `720,000` gas units. Note that this might change in the future.

In summary, these are the main differences between regular and remote EVM calls:

- Remote EVM calls use a global nonce (owned by the [Ethereum-XCM pallet](/tree/master/pallets/ethereum-xcm)) instead of a nonce per account
- The `v-r-s` values of the signature for remote EVM calls are `0x1`. The sender can't be retrieved from the signature through standard methods (for example, through [ECRECOVER](builders/pallets-precompiles/precompiles/eth-mainnet/#verify-signatures-with-ecrecover)). Nevertheless, the `from` is included in both the transaction receipt and when getting the transaction by hash (using the Ethereum JSON RPC)
- The gas price for all remote EVM calls is zero. The EVM execution is charged at an XCM execution level and not at an EVM level
- The current maximum gas limit you can set for a remote EVM call is `720,000` gas units

## Ethereum XCM Pallet Interface

### Extrinsics

The Ethereum XCM pallet provides the following extrinsics (functions) that can be called by the `Transact` instruction to access Moonsama Network's EVM through XCM:

- **transact**(xcmTransaction) — function to remotely call the EVM through XCM. Only callable through the execution of an XCM message
- **transactThroughProxy**(transactAs, xcmTransaction) — similar to the `transact` extrinsic, but with `transactAs` as an additional field. This function allows the remote EVM call to be dispatched from a given account with known keys (the `msg.sender`). This account needs to have set the **multilocation-derivative account** as a [proxy](tokens/manage/proxy-accounts) of type `any` on Moonsama Network. On the contrary, the dispatch of the remote EVM call will fail. Transaction fees are still paid by the **multilocation-derivative account**

Where the inputs that need to be provided can be defined as:

- **xcmTransaction** — contains the Ethereum transaction details of the call that will be dispatched. This includes the call data, `msg.value` and gas limit
- **transactAs** — account from which the remote EVM call will be dispatched (the `msg.sender`). The account set in this field needs to have set the **multilocation-derivative account** as a proxy of type `any` on Moonsama Network. Transaction fees are still paid by the **multilocation-derivative account**

## Building a Remote EVM call through XCM

This guide covers building an XCM message for remote EVM calls using the [XCM Pallet](https://github.com/paritytech/polkadot/blob/master/xcm/pallet-xcm/src/lib.rs) from the relay chain to . More specifically, it will use the `transact` function. The steps to use the `transactThroughProxy` function are identical. However, you'll need to provide the `transactAs` account and ensure that this account has set the **multilocation-derivative account** as a proxy of type `any` on .

Note

When using `transactThroughProxy`, the EVM call is dispatched by the **transactAs** account you provide, acting as the `msg.sender`, as long as this account has set the the **multilocation-derivative account** as a proxy of type `any` in the Moonsama Network-based network you are using. However, transaction fees are still paid by the **multilocation-derivative account**, so you need to ensure it has enough funds to cover them.

### Checking Prerequisites

To be able to send the call from the relay chain, you need to have the following:

- 
    
    An [account](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.Moonsama Network.network#/accounts) on the relay chain with funds (UNIT) to pay for the transaction fees. You can acquire some xcUNIT by swapping for DEV tokens ('s native token) on [Moonsama Network-Swap](https://Moonsama Network-swap.netlify.app/), a demo Uniswap-V2 clone on , and then [send them to the relay chain](builders/interoperability/xcm/xc20/xtokens/). Additionally, you can [contact us](https://discord.gg/PfpUATX) to get some UNIT tokens directly
    
- 
    
    Fund the **multilocation-derivative account**, which you can obtain by following the steps [in the next section](builders/interoperability/xcm/remote-evm-calls/#calculate-multilocation-derivative). The account must have enough DEV tokens (or GLMR/MOVR for Moonsama Network/Moonsama Network) to cover the cost of the XCM execution of the remote EVM call. Note that this is the account from which the remote EVM call will be dispatched (the `msg.sender`). Consequently, the account must satisfy whatever conditions are required for the EVM call to be executed correctly. For example, hold any relevant ERC-20 token if you are doing an ERC-20 transfer
    

Note

Suppose you are using the `transactThroughProxy` function. In that case, the `transactAs` account must satisfy whatever conditions are required for the EVM call to be executed correctly, as it acts as the `msg.sender`. However, the **multilocation-derivative account** is the one that needs to hold the DEV tokens (or GLMR/MOVR for Moonsama Network/Moonsama Network) to cover the cost of the XCM execution of the remote EVM call.

### Calculating the Multilocation-Derivative Account

As mentioned before, a remote EVM call is dispatched from an account called the **multilocation-derivative account**. This is calculated using the information provided by the `[Descend Origin](https://github.com/paritytech/xcm-format#descendorigin)` instruction. Consequently, the computed account depends directly on how the instruction is constructed.

For example, from the relay chain, the `[DescendOrigin](https://github.com/paritytech/xcm-format#descendorigin)` instruction is natively injected by the [XCM Pallet](https://github.com/paritytech/polkadot/blob/master/xcm/pallet-xcm/src/lib.rs). In the case of 's relay chain (based on Westend), is with the following format (a multilocation junction):

```
{
  DescendOrigin: {
    X1: {
      AccountId32: {
        network: 'Westend',
        id: decodedAddress,
      },
    },
  },
}

```

Where the `decodedAddress` corresponds to the address of the account who signed the transaction on the relay chain (in a decoded 32 bytes format). You can make sure that your address is properly decoded by using the following snippet, which will decode an address if needed and ignore it if not:

When the XCM instruction gets executed in Moonsama Network ( in this example), the origin will have mutated to the following multilocation:

This is the multilocation used to calculate the **multilocation-derivative account**. You can use the [calculate **multilocation-derivative account** script](https://github.com/PureStake/xcm-tools) to help you obtain its value. To do so, you can use the following command:

The parameters that you need to pass along with this command are:

- The `w` flag corresponds to the endpoint you’re using to fetch this information
- The `a` flag corresponds to your Moonbase relay chain address
- The `p` flag corresponds to the parachain ID of the origin chain (if applies), if you are sending the XCM from the relay chain you don't need to provide this parameter
- The `n` flag corresponds to the name of the relay chain that Moonbase relay is based on

For example, for Alice's relay chain account is `5EnnmEp2R92wZ7T8J2fKMxpc1nPW5uP8r5K3YUQGiFrw8uG6`, you can calculate her  **multilocation-derivative account** by running:

The relevant values for this calculation are summarized in the following table:

Consequently, for this example, the **multilocation-derivative account** for  is `0xda51eac6eb3502b0a113effcb3950c52e873a24c`. Note that Alice is the only person who can access this account through a remote transact from the relay chain, as she is the owner of its private keys and the **multilocation-derivative account** is keyless.

### Ethereum XCM Transact Call Data

Before you send the XCM message from the relay chain to , you need to get the encoded call data that will be dispatched through the execution of the `[Transact](https://github.com/paritytech/xcm-format#transact)` XCM instruction.

In this example, you'll be interacting with the `transact` function of the [Ethereum XCM Pallet](/tree/master/pallets/ethereum-xcm), which accepts an `xcmTransaction` as a parameter.

The `xcmTransaction` parameter requires you to define:

- A gas limit
- The action to be executed, which provides two options: `Call` and `Create`. The current implementation of the [Ethereum XCM pallet](/tree/master/pallets/ethereum-xcm) does not support the `CREATE` operation. Therefore, you can't deploy a smart contract through remote EVM calls. For `Call`, you'll need to specify the contract address you're interacting with
- The value of native tokens to send
- The input, which is the encoded call data of the contract interaction

For the action to be executed, you'll be performing a contract interaction with a simple [incrementer contract](https://moonbase.moonscan.io/address/0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8#code), which is located at `0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8`. You'll be calling the `increment` function, which has no input argument and will increase the value of the `number` by one. Also, it will store the block's timestamp in which the function is executed to the `timestamp` variable.

The encoded call data of the interaction with the `increment` function is `0xd09de08a`, which is the first eight hexadecimal characters (or 4 bytes) of the keccak256 hash of `increment()`. If you choose to interact with a function that has input parameters, they also need to be encoded. The easiest way to get the encoded call data is to emulate a transaction either in [Remix](builders/build/eth-api/dev-env/remix/#interacting-with-a-Moonsama Network-based-erc-20-from-metamask) or [Moonscan](https://moonbase.moonscan.io/address/0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8#code). Next, in Metamask, check the **HEX DATA: 4 BYTES** selector under the **HEX** tab before signing it. You don't need to sign the transaction.

Now that you have the encoded contract interaction data, you can determine the gas limit for this call using the `[eth_estimateGas` JSON RPC method](<https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_estimategas>). For this example, you can set the gas limit to `71000`.

For the value, you can set it to `0` since this particular interaction does not need DEV (or GLMR/MOVR for Moonsama Network/Moonsama Network). For an interaction that requires DEV, you'll need to modify this value accordingly.

Now that you have all of the components required for the `xcmTransaction` parameter, you can build it:

Next, you can write the script to get the encoded call data for the transaction. You'll take the following steps:

1. Provide the input data for the call. This includes:
    - The  endpoint URL to create the provider
    - The value for the `xcmTransaction` parameter of the `transact` function
2. Create the [Polkadot.js API](builders/build/substrate-api/polkadot-js-api/) provider
3. Craft the `ethereumXcm.transact` extrinsic with the `xcmTransaction` value
4. Get the encoded call data for the extrinsic. You don't need to sign and send the transaction

You'll use the encoded call data in the `Transact` instruction in the following section.

### Building the XCM for Remote XCM Execution

In this example, you'll build an XCM message to execute a remote EVM call in  from its relay chain through the `[Transact](https://github.com/paritytech/xcm-format#transact)` XCM instruction and the `transact` function of the [Ethereum XCM pallet](/tree/master/pallets/ethereum-xcm).

Now that you've generated the [Ethereum XCM pallet](/tree/master/pallets/ethereum-xcm) [encoded call data](builders/interoperability/xcm/remote-evm-calls/#ethereumxcm-transact-data), you're going to use the XCM Pallet on the relay chain to perform a remote execution. To do so, you'll use the `send` function, which accepts two parameters: `dest` and `message`. You can start assembling these parameters by taking the following steps:

1.  
    
    Build the multilocation of the destination, which is :
    
    ```
    const dest = { V3: { parents: 0, interior: { X1: { Parachain: 1000 } } } };
    
    ```
    
2.   
    
    Build the `WithdrawAsset` instruction, which will require you to define:
    
    - The multilocation of the DEV token on 
    - The amount of DEV tokens to withdraw
    
    ```
    const instr1 = {
      WithdrawAsset: [
        {
          id: { Concrete: { parents: 0, interior: { X1: { PalletInstance: 3 } } } },
          fun: { Fungible: 100000000000000000n }, // 1 DEV
        },
      ],
    };
    
    ```
    
3.   
    
    Build the `BuyExecution` instruction, which will require you to define:
    
    - The multilocation of the DEV token on 
    - The amount of DEV tokens to buy for execution
    - The weight limit
    
    ```
    const instr2 = {
      BuyExecution: [
        {
          id: { Concrete: { parents: 0, interior: { X1: { PalletInstance: 3 } } } },
          fun: { Fungible: 100000000000000000n }, // 1 DEV
        },
        { Unlimited: null },
      ],
    };
    
    ```
    
4.   
    
    Build the `Transact` instruction, which will require you to define:
    
    - The origin kind
    - The required weight for the transaction. You'll need to define a value for `refTime`, which is the amount of computational time that can be used for execution, and the `proofSize`, which is the amount of storage in bytes that can be used. It is recommended that the weight given to this instruction needs to be around 10% more of `25000` times the gas limit for the EVM call you want to execute via XCM
    - The encoded call data, which you generated in the [Ethereum XCM Transact Call Data](builders/interoperability/xcm/remote-evm-calls/#ethereumxcm-transact-data) section
    
    ```
    const instr3 = {
      Transact: {
        originKind: 'SovereignAccount',
        requireWeightAtMost: { refTime: 4000000000n, proofSize: 0 },
        call: {
          encoded:
            '0x260001581501000000000000000000000000000000000000000000000000000000000000a72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8000000000000000000000000000000000000000000000000000000000000000010d09de08a00',
        },
      },
    };
    
    ```
    
5.  
    
    Combine the XCM instructions into a versioned XCM message:
    
    ```
    const message = { V3: [instr1, instr2, instr3] };
    
    ```
    

Now that you have the values for each of the parameters, you can write the script for the execution. You'll take the following steps:

1. Provide the input data for the call. This includes:
    - The relay chain endpoint URL to create the provider
    - The values for each of the parameters of the `send` function
2. Create a Keyring instance that will be used to send the transaction
3. Create the [Polkadot.js API](builders/build/substrate-api/polkadot-js-api/) provider
4. Craft the `xcmPallet.send` extrinsic with the `dest` and `message` values
5. Send the transaction using the `signAndSend` extrinsic and the Keyring instance you created in the second step

Once the transaction is processed, you can check the relevant extrinsics and events in the [relay chain](<https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.Moonsama> Network.network#/explorer/query/0x2a0e40a2e5261e792190826ce338ed513fe44dec16dd416a12f547d358773f98) and [](<https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.Moonsama> Network.network#/explorer/query/0x7570d6fa34b9dccd8b8839c2986260034eafef732bbc09f8ae5f857c28765145).

In the relay chain, the extrinsic is `xcmPallet.send`, and the associated event is `xcmPallet.Sent` (among others related to the fee). In , the XCM execution happens within the `parachainSystem.setValidationData` extrinsic, and there are multiple associated events that can be highlighted:

- **parachainSystem.DownwardMessagesReceived** — event that signals that a message from the relay chain was received. With the current XCM implementation, messages from other parachains will show the same event
- **balances.Withdraw** — event related to the withdrawing of tokens to pay for the execution of the call. Note that the `who` address is the **multilocation-derivative account** calculated before
- **ethereum.Executed** — event associated with the execution of the remote EVM call. It provides the `from`, `to`, `transactionHash` (calculated with the non-standard signature and global pallet nonce), and the `exitReason`. Currently, some common EVM errors, like out of gas, will show `Reverted` in the exit reason
- **polkadotXcm.AssetsTrapped** — event that is emitted when part of the tokens withdrawn from the account (for fees) are not used. Generally, when there are leftover tokens in the registry that are not allocated to an account. These tokens are temporarily burned and can be retrieved through a democracy proposal. A combination of both `RefundSurplus` and `DepositAsset` XCM instructions can prevent assets from getting trapped

To verify that the remote EVM call through XCM was successful, you can head to the [contract's page in Moonscan](https://moonbase.moonscan.io/address/0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8#readContract) and verify the new value for the number and its timestamp.

## Remote EVM Call Transaction by Hash

As mentioned before, there are some [differences between regular and remote XCM EVM calls](builders/interoperability/xcm/remote-evm-calls/#differences-regular-remote-evm). Some main differences can be seen when retrieving the transaction by its hash using the Ethereum JSON RPC.

To do so, you first need to retrieve the transaction hash you want to query. For this example, you can use the transaction hash from the [previous section](builders/interoperability/xcm/remote-evm-calls/#build-remove-evm-call-xcm), which is [0x85735a6be6aa0b3ad5f6ce877d8b9048137876517d9ca5b309bcd93ae997bf7a](https://moonbase.moonscan.io/tx/0x85735a6be6aa0b3ad5f6ce877d8b9048137876517d9ca5b309bcd93ae997bf7a). Open the terminal, and execute the following command:

If the JSON RPC request is sent correctly, the response should look like this:

Note that the `v-r-s` values are set to `0x1`, and the gas price-related fields are set to `0x0`. In addition, the `nonce` field corresponds to a global nonce of the [Ethereum XCM pallet](/tree/master/pallets/ethereum-xcm), and not the transaction count of the dispatcher account.
