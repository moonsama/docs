# XC-20s and Cross-Chain Assets


## Introduction

The [Cross-Consensus Message (XCM)](https://wiki.polkadot.network/docs/learn-crosschain) format defines how messages can be sent between interoperable blockchains. This format opens the door to transferring messages and assets (Substrate assets) between Moonsama Network/Moonsama Network and the relay chain or other parachains in the Polkadot/Kusama ecosystems.

Substrate assets are natively interoperable. However, developers need to tap into the Substrate API to interact with them, with no real visibility into the EVM. Consquently, interoperable Substrate assets are not that attractive for developers building on the EVM. To fix that and to help developers tap into the native interoperability that Polkadot/Kusama offers, Moonsama Network introduced the concept of XC-20s.

XC-20s are a unique asset class on Moonsama Network. It combines the power of Substrate assets (native interoperability) but allows users and developers to interact with them through a familiar [ERC-20 interface](builders/interoperability/xcm/xc20/overview/#the-erc20-interface). On the EVM side, XC-20s have an [ERC-20 interface](builders/interoperability/xcm/xc20/overview/#the-erc20-interface), so smart contracts and users can easily interact with them, and no knowledge of Substrate is required. This ultimately provides greater flexibility for developers when working with these types of assets and allows seamless integrations with EVM-based smart contracts such as DEXs and lending platforms, among others. Moreover, developers can integrate XC-20s with regular [Ethereum development frameworks](builders/build/eth-api/dev-env/) or dApps, and create connected contracts strategies with such assets. Moreover, with the introduction of [RT2301](/tree/runtime-2301), all ERC-20s are XCM-ready, meaning they can also be referred to as XC-20s.


## Types of XC-20s

There are two types of XC-20s: local and external.

### What are Local XC-20s?

Local XC-20s are all ERC-20s that exist on the EVM, and that can be transferred cross-chain through XCM. In order for local XC-20s to be transferred to another parachain, the asset needs to be registered on that chain. When transferring local XC-20s, the actual tokens reside in the destination chain's Sovereign account on Moonsama Network. Local XC-20s must follow [the ERC-20 interface outlined in this guide](builders/interoperability/xcm/xc20/overview/#the-erc20-interface), they cannot be customized ERC-20s.

### What are External XC-20s?

External XC-20s are native cross-chain assets that are transferred from another parachain or the relay chain to Moonsama Network. These assets are Substrate assets at their core. When transferring external XC-20s, the actual tokens reside in Moonsama Network's Sovereign account in each of these chains. External XC-20s will all have *xc* prepended to their names to distinguish them as native cross-chain assets.

### Local XC-20s vs External XC-20s

Both types of XC-20s can be easily sent to other parachains in the ecosystem as if they were Substrate assets, through both the Ethereum and Substrate API. However, using the Substrate API for XCM transfer will emit EVM logs for local XC-20s, but not for external XC-20s. Using the Ethereum API is recommended to provide more visibility into the XCM actions through EVM-based explorers, such as [Moonscan](https://moonscan.io/).

Within Moonsama Network, local XC-20s can only be transferred through their regular ERC-20 interface. On the contrary, external XC-20s can be transferred through both interfaces (Substrate and ERC-20). If external XC-20s are transferred through the Substrate API, the transaction won't be visible from EVM-based block explorers. Only transactions done via the Ethereum API are visible through such explorers.

The main difference between these two types of assets is that local XC-20s are EVM ERC-20s that have XCM capabilities, while external XC-20s are Substrate assets with an ERC-20 interface on top.

Cross-chain transfers of XC-20s are done using the [X-Tokens Pallet](builders/interoperability/xcm/xc20/xtokens/). To learn how to use the X-Tokens Pallet to transfer XC-20s, you can refer to the [Using the X-Tokens Pallet To Send XC-20s](builders/interoperability/xcm/xc20/xtokens) guide.

## Register Local XC-20s on Other Parachains

In order to enable cross-chain transfers of Moonsama Network local XC-20s (XCM-enabled ERC-20s) between your chain and Moonsama Network, you'll need to register the asset(s). To do so, you'll need the multilocation of each asset. The multilocation will include the parachain ID of Moonsama Network, the pallet instance, and the address of the ERC-20. The pallet instance will be `48`, which corresponds to the index of the ERC-20 XCM Bridge Pallet, as this is the pallet that enables any ERC-20 to be transferred via XCM.

**Local XC-20s that are registered on other chains must comply with the standard ERC-20 interface as described in [EIP-20](https://eips.ethereum.org/EIPS/eip-20).**

Currently, support for local XC-20s is only available on . You can use the following multilocation to register a local XC-20:



```
{
  'parents': 1,
  'interior': {
    'X3': [
      {
        'Parachain': 1000
      },
      {
        'PalletInstance': 48
      },
      {
        'AccountKey20': {
          'key': 'ERC20_ADDRESS_GOES_HERE'
        }
      }
    ]
  }
}

```

There are additional steps aside from register assets that will need to be taken to enable a cross-chain integration with Moonsama Network. For more information, please refer to the [Establishing an XC Integration with Moonsama Network](builders/interoperability/xcm/xc-integration) guide.

## Current List of External XC-20s

The current list of available external XC-20 assets per network is as follows:

Moonsama Network

| Origin | Symbol | XC-20 Address |
| --- | --- | --- |
| Polkadot | xcDOT | https://moonscan.io/token/0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080 |
| Acala | xcaUSD | https://moonscan.io/token/0xfFfFFFFF52C56A9257bB97f4B2b6F7B2D624ecda |
| Acala | xcACA | https://moonscan.io/token/0xffffFFffa922Fef94566104a6e5A35a4fCDDAA9f |
| Astar | xcASTR | https://moonscan.io/token/0xFfFFFfffA893AD19e540E172C10d78D4d479B5Cf |
| Bifrost | xcBNC | https://moonscan.io/token/0xffffffff7cc06abdf7201b350a1265c62c8601d2 |
| Darwinia | xcRING | https://moonscan.io/token/0xFfffFfff5e90e365eDcA87fB4c8306Df1E91464f |
| Interlay | xcIBTC | https://moonscan.io/token/0xFFFFFfFf5AC1f9A51A93F5C527385edF7Fe98A52 |
| Interlay | xcINTR | https://moonscan.io/token/0xFffFFFFF4C1cbCd97597339702436d4F18a375Ab |
| Parallel | xcPARA | https://moonscan.io/token/0xFfFffFFF18898CB5Fe1E88E668152B4f4052A947 |
| Phala | xcPHA | https://moonscan.io/token/0xFFFfFfFf63d24eCc8eB8a7b5D0803e900F7b6cED |
| Statemint | xcUSDT | https://moonscan.io/token/0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d |
- *You can check each [Asset ID](https://polkadot.js.org/apps/?rpc=wss://wss.api.Moonsama Network.network#/assets) on Polkadot.js Apps*

### Retrieve List of External XC-20s

To fetch a list of the currently available external XC-20s along with their associated metadata, you can query the chain state using the [Polkadot.js API](builders/build/substrate-api/polkadot-js-api). You'll take the following steps:

1.  Moonsama Network 
    
    Create an API provider for the network you'd like to get the list of assets for. You can use the following WSS endpoints for each network:
    
    ```
    wss://wss.api.moonsama.network
    
    ```
    
2. 
    
    Query the `assets` pallet for all assets
    
3. Iterate over the list of assets to get all of the asset IDs along with their associated metadata

```
import { ApiPromise, WsProvider } from '@polkadot/api'; // Version 9.13.6

const getXc20s = async () => {
  // 1. Create API provider
  const substrateProvider = new WsProvider(
    'wss://wss.api.moonbase.Moonsama Network.network'
  );
  const api = await ApiPromise.create({ provider: substrateProvider });

  // 2. Query the assets pallet for all assets
  const assets = await api.query.assets.asset.entries();

  // 3. Get metadata for each asset using the ID
  assets.forEach(
    async ([
      {
        args: [id],
      },
    ]) => {
      const metadata = await api.query.assets.metadata(id);
      console.log(`Asset ID: ${id}`);
      console.log(`Metadata: ${metadata}`);
      console.log('-----');
    }
  );

  api.disconnect();
};

getXc20s();

```

The result will display the asset ID along with some additional information for all of the registered external XC-20s.

## XC-20s Solidity Interface

Both types of XC-20s have the standard ERC-20 interface. In addition, all external XC-20s also possess the ERC-20 Permit interface. The following two sections describe each of the interfaces separately.

### The ERC-20 Solidity Interface

As mentioned, you can interact with XC-20s via an ERC-20 interface. The [ERC20.sol](/blob/master/precompiles/assets-erc20/ERC20.sol) interface on Moonsama Network follows the [EIP-20 Token Standard](https://eips.ethereum.org/EIPS/eip-20), which is the standard API interface for tokens within smart contracts. The standard defines the required functions and events that a token contract must implement to be interoperable with different applications.

The interface includes the following functions:

- **name()** — read-only function that returns the name of the token
- **symbol()** — read-only function that returns the symbol of the token
- **decimals()** — read-only function that returns the decimals of the token
- **totalSupply()** — read-only function that returns the total number of tokens in existence
- **balanceOf**(*address* who) — read-only function that returns the balance of the specified address
- **allowance**(*address* owner, *address* spender) — read-only function that checks and returns the amount of tokens that a spender is allowed to spend on behalf of the owner
- **transfer**(*address* to, *uint256* value) — transfers a given amount of tokens to a specified address and returns `true` if the transfer was successful
- **approve**(*address* spender, *uint256* value) — approves the provided address to spend a specified amount of tokens on behalf of `msg.sender`. Returns `true` if successful
- **transferFrom**(*address* from, *address* to, *uint256* value) — transfers tokens from one given address to another given address and returns `true` if successful

Note

The ERC-20 standard does not specify the implications of multiple calls to `approve`. Changing an allowance with this function numerous times enables a possible attack vector. To avoid incorrect or unintended transaction ordering, you can first reduce the `spender` allowance to `0` and then set the desired allowance afterward. For more details on the attack vector, you can check out the [ERC-20 API: An Attack Vector on Approve/TransferFrom Methods](https://docs.google.com/document/d/1YLPtQxZu1UAvO9cZ1O2RPXBbT0mooh4DYKjA_jp-RLM/edit#) overview.

The interface also includes the following required events:

- **Transfer**(*address indexed* from, *address indexed* to, *uint256* value) - emitted when a transfer has been performed
- **Approval**(*address indexed* owner, *address indexed* spender, *uint256* value) - emitted when an approval has been registered

### The ERC-20 Permit Solidity Interface

External XC-20s also have the ERC-20 Permit interface. The [Permit.sol](/blob/master/precompiles/assets-erc20/Permit.sol) interface on Moonsama Network follows the [EIP-2612 standard](https://eips.ethereum.org/EIPS/eip-2612), which extends the ERC-20 interface with the `permit` function. Permits are signed messages that can be used to change an account's ERC-20 allowance. Note that local XC-20s can have also the Permit interface, but it is not a requirement for them to be XCM-ready.

The standard ERC-20 `approve` function is limited in its design as the `allowance` can only be modified by the sender of the transaction, the `msg.sender`. This can be seen in [OpenZeppelin's implementation of the ERC-20 interface](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol#L136), which sets the `owner` through the `[msgSender` function](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Context.sol#L17), which ultimately sets it to `msg.sender`.

Instead of signing the `approve` transaction, a user can sign a message, and that signature can be used to call the `permit` function to modify the `allowance`. As such, it allows for gas-less token transfers. In addition, users no longer need to send two transactions to approve and transfer tokens. To see an example of the `permit` function, you can check out [OpenZeppelin's implementation of the ERC-20 Permit extension](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/token/ERC20/extensions/draft-ERC20Permit.sol#L41).

The [Permit.sol](/blob/master/precompiles/assets-erc20/Permit.sol) interface includes the following functions:

- **permit**(*address* owner, *address* spender, *uint256*, value, *uint256*, deadline, *uint8* v, *bytes32* r, *bytes32* s) - consumes an approval permit, which can be called by anyone
- **nonces**(*address* owner) - returns the current nonce for the given owner
- **DOMAIN_SEPARATOR**() - returns the EIP-712 domain separator, which is used to avoid replay attacks. It follows the [EIP-2612](https://eips.ethereum.org/EIPS/eip-2612#specification) implementation

The **DOMAIN_SEPARATOR()** is defined in the [EIP-712 standard](https://eips.ethereum.org/EIPS/eip-712), and is calculated as:

The parameters of the hash can be broken down as follows:

- **PERMIT_DOMAIN** - is the `keccak256` of `EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)`
- **name** - is the token name but with the following considerations:
    - If the token has a name defined, the **name** for the domain is `XC20: <name>`, where `<name>` is the token name
    - If the token has no name defined, the **name** for the domain is `XC20: No name`
- **version** - is the version of the signing domain. For this case, **version** is set to `1`
- **chainId** - is the chain ID of the network
- **verifyingContract** - is the XC-20 address

The calculation of the domain separator can be seen in [Moonsama Network's EIP-2612](/blob/perm-runtime-1502/precompiles/assets-erc20/src/eip2612.rs#L130-L154) implementation, with a practical example shown in [OpenZeppelin's `EIP712` contract](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/utils/cryptography/draft-EIP712.sol#L70-L84).

Aside from the domain separator, the `[hashStruct](https://eips.ethereum.org/EIPS/eip-712#definition-of-hashstruct)` guarantees that the signature can only be used for the `permit` function with the given function arguments. It uses a given nonce to ensure the signature is not subject to a replay attack. The calculation of the hash struct can be seen in [Moonsama Network's EIP-2612](/blob/perm-runtime-1502/precompiles/assets-erc20/src/eip2612.rs#L167-L175) implementation, with a practical example shown in [OpenZeppelin's `ERC20Permit` contract](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/token/ERC20/extensions/draft-ERC20Permit.sol#L52).

The domain separator and the hash struct can be used to build the [final hash](/blob/perm-runtime-1502/precompiles/assets-erc20/src/eip2612.rs#L177-L181) of the fully encoded message. A practical example is shown in [OpenZeppelin's `EIP712` contract](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/utils/cryptography/draft-EIP712.sol#L101).

With the final hash and the `v`, `r`, and `s` values, the signature can be [verified and recovered](/blob/perm-runtime-1502/precompiles/assets-erc20/src/eip2612.rs#L212-L224). If successfully verified, the nonce will increase by one and the allowance will be updated.

## Interact with External XC-20s Using an ERC-20 Interface

This section of the guide will show you how to interact with XC-20s via the ERC-20 interface using [Remix](builders/build/eth-api/dev-env/remix). Because local XC-20s are representations of regular ERC-20s, this section is focused on external XC-20s.

To interact with external XC-20s, you'll need to first calculate the precompile address of the XC-20 asset you want to interact with. Then, you can interact with the ERC-20 interface as you would with any other ERC-20.

You can adapt the instructions in this section to be used with the [Permit.sol](/blob/master/precompiles/assets-erc20/Permit.sol) interface.

### Checking Prerequisites

To approve a spend or transfer external XC-20s via the ERC-20 interface, you will need:

- [MetaMask installed and connected to the ](tokens/connect/metamask/) TestNet
- Create or have two accounts on 
- At least one of the accounts will need to be funded with `DEV` tokens. You can get DEV tokens for testing on  once every 24 hours from the [ Faucet](https://faucet.Moonsama Network.network/)

### Calculate External XC-20 Precompile Addresses

Before you can interact with an external XC-20 via the ERC-20 interface, you need to derive the external XC-20's precompile address from the asset ID.

The external XC-20 precompile address is calculated using the following:

Given the above calculation, the first step is to take the *u128* representation of the asset ID and convert it to a hex value. You can use your search engine of choice to look up a simple tool for converting decimals to hex values. For asset ID `42259045809535163221576417993425387648`, the hex value is `1FCACBD218EDC0EBA20FC2308C778080`.

External XC-20 precompiles can only fall between `0xFFFFFFFF00000000000000000000000000000000` and `0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF`.

Since Ethereum addresses are 40 characters long, you will need to start with the initial eight `F`s and then prepend `0`s to the hex value until the address has 40 characters.

The hex value that was already calculated is 32 characters long, so prepending eight `F`s to the hex value will give you the 40-character address you need to interact with the XC-20 precompile. For this example, the full address is `0xFFFFFFFF1FCACBD218EDC0EBA20FC2308C778080`.

Now that you've calculated the external XC-20 precompile address, you can use the address to interact with the XC-20 like you would with any other ERC-20 in Remix.

### Add & Compile the Interface

You can interact with the ERC-20 interface using [Remix](https://remix.ethereum.org/). First, you will need to add the interface to Remix:

1. Get a copy of [ERC20.sol](/blob/master/precompiles/assets-erc20/ERC20.sol)
2. Paste the file contents into a Remix file named **IERC20.sol**


Once you have the ERC-20 interface loaded in Remix, you will need to compile it:

1. Click on the **Compile** tab, second from top
2. Compile the **IERC20.sol** file


If the interface was compiled successfully, you will see a green checkmark next to the **Compile** tab.

### Access the Precompile

Instead of deploying the ERC-20 precompile, you will access the interface given the address of the XC-20:

1. Click on the **Deploy and Run** tab directly below the **Compile** tab in Remix. Please note that the precompiled contract is already deployed
2. Make sure **Injected Web3** is selected in the **ENVIRONMENT** dropdown. Once you select **Injected Web3**, you might be prompted by MetaMask to connect your account to Remix
3. Make sure the correct account is displayed under **ACCOUNT**
4. Ensure **IERC20 - IERC20.sol** is selected in the **CONTRACT** dropdown. Since this is a precompiled contract, there is no need to deploy any code. Instead, you are going to provide the address of the precompile in the **At Address** field
5. Provide the address of the XC-20. For local XC-20s, which you should have already calculated in the [Calculate External XC-20 Precompile Addresses](builders/interoperability/xcm/xc20/overview/#calculate-xc20-address) section. For this example, you can use `0xFFFFFFFF1FCACBD218EDC0EBA20FC2308C778080` and click **At Address**


The **IERC20** precompile for the XC-20 will appear in the list of **Deployed Contracts**. Now you can feel free to call any of the standard ERC-20 functions to get information about the XC-20 or transfer the XC-20.


To learn how to interact with each of the functions, you can check out the [ERC-20 Precompile](builders/pallets-precompiles/precompiles/erc20/) guide and modify it for interacting with the XC-20 Precompile.