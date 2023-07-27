---
sidebar_position: 4
---


# Call Permit Precompile Contract


## Introduction

The Call Permit Precompile on Moonsama Network allows a user to sign a permit, an [EIP-712](https://eips.ethereum.org/EIPS/eip-712) signed message, for any EVM call and it can be dispatched by anyone or any smart contract. It is similar to the [ERC-20 Permit Solidity Interface](builders/interoperability/xcm/xc20/overview/#the-erc20-permit-interface), except it applies to any EVM call instead of approvals only.

When the call permit is dispatched, it is done so on behalf of the user who signed the permit and the user or contract that dispatches the permit is responsible for paying transaction fees. As such, the precompile can be used to perform gas-less transactions.

For example, Alice signs a call permit and Bob dispatches it and performs the call on behalf of Alice. Bob pays for the transaction fees and as such, Alice doesn't need to have any of the native currency to pay for the transaction, unless the call includes a transfer.

The Call Permit Precompile is located at the following address:

Moonsama Network

```
0x000000000000000000000000000000000000080a

```

Note

There can be some unintended consequences when using the precompiled contracts on Moonsama Network. Please refer to the [Security Considerations](builders/get-started/eth-compare/security) page for more information.

## The Call Permit Solidity Interface

`[CallPermit.sol](/blob/master/precompiles/call-permit/CallPermit.sol)` is a Solidity interface that allows developers to interact with the precompile's three methods.

The interface includes the following functions:

- 
    
    **dispatch**(*address* from, *address* to, *uint256* value, *bytes* data, *uint64[]* gaslimit, *uint256* deadline, *uint8* v, *bytes32* r, *bytes32* s) — dispatches a call on the behalf of another user with a EIP-712 permit. This function can be called by anyone or any smart contract. The transaction will revert if the permit is not valid or if the dispatched call reverts or errors (such as out of gas). If successful, the nonce of the signer is increased to prevent this permit to be replayed. An overview of the parameters is as follows:
    
    - `from` - the signer of the permit. The call will be dispatched on behalf of this address
    - `to` - the address the call is made to
    - `value` - the value being transferred from the `from` account
    - `data` - the call data, or action to be executed
    - `gasLimit` - the gas limit the dispatched call requires. Providing an argument for this parameter prevents the dispatcher from manipulating the gas limit
    - `deadline` - the time in UNIX seconds after which the permit will no longer be valid. In JavaScript, you can get the current time in UNIX seconds by running `console.log(Date.now())` in a JavaScript script or a browser console
    - `v` - the recovery ID of the signature. The last one byte of the concatenated signature
    - `r` - the first 32 bytes of the concatenated signature
    - `s` - the second 32 bytes of the concatenated signature

- 
    
    **nonces**(*address* owner) - returns the current nonce for given owner
    
- **DOMAIN_SEPARATOR**() - returns the EIP-712 domain separator which is used to avoid replay attacks. It follows the [EIP-2612](https://eips.ethereum.org/EIPS/eip-2612#specification) implementation

The domain separator is defined in the [EIP-712 standard](https://eips.ethereum.org/EIPS/eip-712) and is calculated as:

```
keccak256(PERMIT_DOMAIN, name, version, chain_id, address)

```

The parameters of the hash can be broken down as follows:

- **PERMIT_DOMAIN** - is the `keccak256` of `EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)`
- **name** - is the name of the signing domain and must be `'Call Permit Precompile'` exactly
- **version** - is the version of the signing domain. For this case **version** is set to `1`
- **chainId** - is the chain ID of the network
- **verifyingContract** - is the address of the contract that will verify the signature. In this case, the Call Permit Precompile address

When `dispatch` is called, the permit needs to be verified before the call is dispatched. The first step is to [compute the domain separator](/blob/ae705bb2e9652204ace66c598a00dcd92445eb81/precompiles/call-permit/src/lib.rs#L138). The calculation can be seen in [Moonsama Network's implementation](/blob/ae705bb2e9652204ace66c598a00dcd92445eb81/precompiles/call-permit/src/lib.rs#L112-L126) or you can check out a practical example in [OpenZeppelin's EIP712 contract](ttps://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/utils/cryptography/draft-EIP712.sol#L70-L84).

From there, a [hash of the signature and the given arguments](/blob/ae705bb2e9652204ace66c598a00dcd92445eb81/precompiles/call-permit/src/lib.rs#L140-L151) is generated which guarantees that the signature can only be used for the call permit. It uses a given nonce to ensure the signature is not subject to a replay attack. It is similar to [OpenZeppelin's `ERC20Permit` contract](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/token/ERC20/extensions/draft-ERC20Permit.sol#L52), except the `PERMIT_TYPEHASH` is for a call permit, and the arguments match that of the [dispatch function](about:blank#:~:text=The%20interface%20includes%20the%20following%20functions) plus the nonce.

The domain separator and the hash struct can be used to build the [final hash](/blob/ae705bb2e9652204ace66c598a00dcd92445eb81/precompiles/call-permit/src/lib.rs#L153-L157) of the fully encoded message. A practical example is shown in [OpenZeppelin's EIP712 contract](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/utils/cryptography/draft-EIP712.sol#L101).

With the final hash and the v, r, and s values, the signature can be [verified and recovered](/blob/ae705bb2e9652204ace66c598a00dcd92445eb81/precompiles/call-permit/src/lib.rs#L211-L223). If successfully verified, the nonce will increase by one and the call will be dispatched.

## Setup the Contracts

For this example, you'll learn how to sign a call permit that updates a message in a simple example contract, `[SetMessage.sol](builders/pallets-precompiles/precompiles/call-permit/#example-contract)`. Before you can generate the call permit signature, you'll need to deploy the contract and define the `dispatch` function arguments for the call permit.

Once you've setup the example contract, then you can setup the Call Permit Precompile contract.

### Checking Prerequisites

To follow along with this tutorial, you will need to have:

- [MetaMask installed and connected to ](tokens/connect/metamask/)
- Create or have two accounts on  to test out the different features in the Call Permit Precompile
- At least one of the accounts will need to be funded with `DEV` tokens. You can get DEV tokens for testing on  once every 24 hours from the [ Faucet](<https://faucet.Moonsama> Network.network/)

### Example Contract

The `SetMessage.sol` contract will be used as an example of using a call permit, but in practice, any contract can be interacted with.

```
// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.7;

contract SetMessage {
    string storedMessage;

    function set(string calldata x) public {
        storedMessage = x;
    }

    function get() public view returns (string memory) {
        return storedMessage;
    }
}

```

### Remix Set Up

You can use [Remix](https://remix.ethereum.org/) to compile the example contract and deploy it. You'll need a copy of `[SetMessage.sol](builders/pallets-precompiles/precompiles/call-permit/#example-contract)` and `[CallPermit.sol](/blob/master/precompiles/call-permit/CallPermit.sol)`. To add the contracts to Remix, you can take the following steps:

1. Click on the **File explorer** tab
2. Paste the `SetMessage.sol` contract into a Remix file named `SetMessage.sol`
3. Paste the `CallPermit.sol` contract into a Remix file named `CallPermit.sol`

![img/call-1-new.png](img/call-1-new.png)

### Compile & Deploy the Example Contract

First you'll need to compile the example contract:

1. Click on the **Compile** tab, second from top
2. Then to compile the interface, click on **Compile SetMessage.sol**

Note

With the release of [Solidity v0.8.20](https://github.com/ethereum/solidity/releases/tag/v0.8.20), support for the Shanghai hard fork has been introduced, which includes `PUSH0` opcodes in the generated bytecode. Support for the `PUSH0` opcode on Moonsama Network hasn't been rolled out yet. As such, if you'd like to use Solidity v0.8.20, you'll need to modify some configurations. From the **Advanced Configurations** dropdown, you can set the **EVM VERSION** to **london**.

If you attempt to use the default compiler of Solidity v0.8.20, you will see the following error:

```
{'code': -32603, 'message': 'evm error: InvalidCode(Opcode(95))', 'data': '0x'}

```

![img/call-2.png](img/call-2.png)

Then you can deploy it:

1. Click on the **Deploy and Run** tab, directly below the **Compile** tab in Remix. Note: you are not deploying a contract here, instead you are accessing a precompiled contract that is already deployed
2. Make sure **Injected Provider - Metamask** is selected in the **ENVIRONMENT** drop down
3. Ensure **SetMessage.sol** is selected in the **CONTRACT** dropdown
4. Click **Deploy**
5. MetaMask will pop up and you'll need to **Confirm** the transaction

![img/call-3.png](img/call-3.png)

The contract will appear under the list of **Deployed Contracts** on the left side panel. Copy the contract address as you will need to use it to generate the call permit signature in the next section.

### Compile & Access the Call Permit Precompile

First you'll need to compile the Call Permit Precompile contract:

1. Click on the **Compile** tab, second from top
2. Then to compile the interface, click on **Compile CallPermit.sol**

![img/call-4.png](img/call-4.png)

Then instead of deploying the contract, you'll just need to access it given the address of the precompile:

1. Click on the **Deploy and Run** tab, directly below the **Compile** tab in Remix. Note: you are not deploying a contract here, instead you are accessing a precompiled contract that is already deployed
2. Make sure **Injected Provider - Metamask** is selected in the **ENVIRONMENT** drop down
3. Ensure **CallPermit.sol** is selected in the **CONTRACT** dropdown. Since this is a precompiled contract there is no need to deploy, instead you are going to provide the address of the precompile in the **At Address** field
4. Provide the address of the Call Permit Precompile for : `0x000000000000000000000000000000000000080a` and click **At Address**
5. The Call Permit Precompile will appear in the list of **Deployed Contracts**

![img/call-5.png](img/call-5.png)

## Generate Call Permit Signature

In order to interact with the Call Permit Precompile, you have to have or generate a signature to dispatch the call permit with. There are several ways you can generate the signature, this guide will show you two different ways to generate it: in the browser using the [MetaMask extension](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn) and [JSFiddle](https://jsfiddle.net/) and using MetaMask's `[@metamask/eth-sig-util` npm package](<https://www.npmjs.com/package/@metamask/eth-sig-util>).

Regardless of which method you choose to generate the signature, the following steps will be taken:

1. The `message` will be created and includes some of the data that is needed to create the call permit. It includes the arguments that will be passed into the `dispatch` function and the nonce of the signer
2. A JSON structure of the data the user needs to sign will be assembled for the call permit and include all of the types for the `dispatch` arguments and the nonce. This will result in the `CallPermit` type and will be saved as the `primaryType`
3. The domain separator will be created using `"Call Permit Precompile"` exactly for the name, the version of your DApp or platform, the chain ID of the network the signature is to be used on, and the address of the contract that will verify the signature
4. All of the assembled data, the `types`, `domain`, `primaryType` and `message`, will be signed using MetaMask (either in the browser or through the MetaMask's JavaScript signing library)
5. The signature will be returned and you can use [Ethers.js](https://docs.ethers.io/) `[Signature.from` method](<https://docs.ethers.org/v6/api/crypto/#Signature_from>) to return the `v`, `r`, and `s` values of the signature

### The Call Permit Arguments

As seen in the [Call Permit Interface](builders/pallets-precompiles/precompiles/call-permit/#the-call-permit-interface) section, the `dispatch` function takes the following parameters: `from`, `to`, `value`, `data`, `gasLimit`, `deadline`, `v`, `r`, and `s`.

In order to get the signature arguments (`v`, `r`, and `s`), you'll need to sign a message containing the arguments for the remainder of the aforementioned parameters, plus the nonce of the signer.

- `from` - the address of the account you want to sign the call permit with
- `to` - the contract address for the `SetMessage.sol` contract
- `value` - can be `0` for this example as you'll just be setting a message instead of transferring any funds
- `data` - you can send any message you would like, you'll just need the hex representation of the message you want to set using the `SetMessage.sol` contract. This will contain the function selector of the `set` function and the string of the message. For this example, you can send `hello world`. To do so, you can use this hex representation:
    
    ```
    0x4ed3885e0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b68656c6c6f20776f726c64000000000000000000000000000000000000000000
    
    ```
    
- `gasLimit` - `100000` will be enough to send the dispatched call
- `deadline` - you can get the current time in UNIX seconds by running `console.log(Date.now())` in a JavaScript script or a browser console. Once you have the current time, you can add additional time in seconds to represent when the call permit will expire

The nonce of the signer will also be needed. If this is your first time signing a call permit the nonce will be `0`. You can also check the nonce in Remix:

1. Expand the call permit contract
2. Next to the **nonces** function, enter the address of the signer and click on **nonces**
3. The result will be returned directly under the function

![img/call-6.png](img/call-6.png)

### Use the Browser

To get started, you can open [JSFiddle](https://jsfiddle.net/) or another JavaScript playground in the browser. First, you'll need to add [Ethers.js](builders/build/eth-api/libraries/ethersjs) as it will be used to get the `v`, `r`, and `s` values of the signature:

1. Click on **Resources**
2. Start to type in `ethers` and the dropdown should populate matching libraries. Choose **ethers**
3. Click on the **+** button

The CDN for Ethers.js will appear in the list of libraries under **Resources**.

![img/call-7.png](img/call-7.png)

In the **Javascript** code box, copy and paste the following JavaScript snippet, making sure to replace the `to` variables (and any other variables as you see fit):

```
const main = async () => {
  await window.ethereum.enable();
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });

  const from = accounts[0];
  const to = 'INSERT-TO-ADDRESS-HERE';
  const value = 0;
  const data =
    '0x4ed3885e0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b68656c6c6f20776f726c64000000000000000000000000000000000000000000';
  const gaslimit = 100000;
  const nonce = 'INSERT-SIGNERS-NONCE-HERE';
  const deadline = 'INSERT-DEADLINE-HERE';

  const createPermitMessageData = function () {
    const message = {
      from: from,
      to: to,
      value: value,
      data: data,
      gaslimit: gaslimit,
      nonce: nonce,
      deadline: deadline,
    };

    const typedData = JSON.stringify({
      types: {
        EIP712Domain: [
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'version',
            type: 'string',
          },
          {
            name: 'chainId',
            type: 'uint256',
          },
          {
            name: 'verifyingContract',
            type: 'address',
          },
        ],
        CallPermit: [
          {
            name: 'from',
            type: 'address',
          },
          {
            name: 'to',
            type: 'address',
          },
          {
            name: 'value',
            type: 'uint256',
          },
          {
            name: 'data',
            type: 'bytes',
          },
          {
            name: 'gaslimit',
            type: 'uint64',
          },
          {
            name: 'nonce',
            type: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
          },
        ],
      },
      primaryType: 'CallPermit',
      domain: {
        name: 'Call Permit Precompile',
        version: '1',
        chainId: 1287,
        verifyingContract: '0x000000000000000000000000000000000000080a',
      },
      message: message,
    });

    return {
      typedData,
      message,
    };
  };

  const method = 'eth_signTypedData_v4';
  const messageData = createPermitMessageData();
  const params = [from, messageData.typedData];

  web3.currentProvider.sendAsync(
    {
      method,
      params,
      from,
    },
    function (err, result) {
      if (err) return console.dir(err);
      if (result.error) {
        alert(result.error.message);
        return console.error('ERROR', result);
      }
      console.log('Signature:' + JSON.stringify(result.result));

      const ethersSignature = ethers.Signature.from(result.result);
      const formattedSignature = {
        r: ethersSignature.r,
        s: ethersSignature.s,
        v: ethersSignature.v,
      };
      console.log(formattedSignature);
    }
  );
};

main();

```

To run the code, click **Run** at the top of the page (or you can also use `control` and `s`). MetaMask should pop up and prompt you to connect an account. Make sure to choose the account you want to sign the message with. Then go ahead and sign the message.

![img/call-8.png](img/call-8.png)

Once you've signed the message, go back to JSFiddle and if the console isn't already open, go ahead and open it to see the signature values include the `v`, `r`, and `s`, values. Copy these values as you'll need them when interacting with the Call Permit Precompile in the following sections.

![img/call-9.png](img/call-9.png)

### Use MetaMask's JS Signing Library

To generate the call permit signature using JavaScript and MetaMask's `[@metamask/eth-sig-util` npm package](<https://www.npmjs.com/package/@metamask/eth-sig-util>), you'll first need to create a project locally. You can do so with the following commands:

```
mkdir call-permit-example && cd call-permit-example && touch getSignature.js
npm init -y

```

You should now have a file where you can create the script to get the signature along with a `package.json` file. Open the `package.json` file, and below the `"dependencies"` section, add:

```
"type": "module"

```

Next, you can install the MetaMask signing library and [Ethers.js](https://docs.ethers.io/):

```
npm i @metamask/eth-sig-util ethers

```

Note

Never reveal your private keys as they give direct access to your funds. The following steps are for demonstration purposes only.

In the `getSignature.js` file, you can copy the following code snippet:

```
import { ethers } from 'ethers';
import { signTypedData, SignTypedDataVersion } from '@metamask/eth-sig-util';

const from = 'INSERT-FROM-ADDRESS-HERE';
const to = 'INSERT-TO-ADDRESS-HERE';
const value = 0;
const data =
  '0x4ed3885e0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b68656c6c6f20776f726c64000000000000000000000000000000000000000000';
const gaslimit = 100000;
const nonce = 'INSERT-SIGNERS-NONCE-HERE';
const deadline = 'INSERT-DEADLINE-HERE';

const createPermitMessageData = () => {
  const message = {
    from: from,
    to: to,
    value: value,
    data: data,
    gaslimit: gaslimit,
    nonce: nonce,
    deadline: deadline,
  };

  const typedData = {
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      CallPermit: [
        { name: 'from', type: 'address' },
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'data', type: 'bytes' },
        { name: 'gaslimit', type: 'uint64' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
    },
    primaryType: 'CallPermit',
    domain: {
      name: 'Call Permit Precompile',
      version: '1',
      chainId: 1287,
      verifyingContract: '0x000000000000000000000000000000000000080a',
    },
    message: message,
  };

  return {
    typedData,
    message,
  };
};

const messageData = createPermitMessageData();

// For demo purposes only. Never store your private key in a JavaScript/TypeScript file
const signature = signTypedData({
  privateKey: Buffer.from('INSERT-FROM-ACCOUNT-PRIVATE-KEY', 'hex'),
  data: messageData.typedData,
  version: SignTypedDataVersion.V4,
});

console.log(`Transaction successful with hash: ${signature}`);

const ethersSignature = ethers.Signature.from(signature);
const formattedSignature = {
  r: ethersSignature.r,
  s: ethersSignature.s,
  v: ethersSignature.v,
};
console.log(formattedSignature);

```

To run the script, use the following command:

```
node getSignature.js

```

In the console, you should see the concatenated signature along with the values for the signature including the `v`, `r`, and `s` values. Copy these values as you'll need them when interacting with the Call Permit Precompile in the following sections.

![img/call-10.png](img/call-10.png)

## Interact with the Solidity Interface

Now that you have generated the call permit signature you will be able to test out calling the `dispatch` function of the Call Permit Precompile.

### Dispatch a Call

When you send the `dispatch` function, you'll need the same arguments as you used to sign the call permit. To get started, go back to the **Deploy and Run** tab in Remix and under the **Deployed Contracts** section expand the call permit contract. Make sure that you're connected to the account that you want to consume the call permit and pay the transaction fees with. Then take the following steps:

1. For the **from** field, enter the account address you used to sign the call permit with
2. Copy and paste the contract address of `SetMessage.sol`
3. Enter `0` for the **value** field
4. Enter the hex representation of the function selector for the `set` function and the string you want to set as the message for the `SetMessage.sol` contract. For this example, `hello world` can be used:
    
    ```
    0x4ed3885e0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b68656c6c6f20776f726c64000000000000000000000000000000000000000000
    
    ```
    
5. Enter `100000` for the **gasLimit** field
6. Enter the `deadline` you used when signing the call permit
7. Copy the `v` value you should have retrieved while generating the call permit signature and paste it into the **v** field
8. Copy the `r` value you should have retrieved while generating the call permit signature and paste it into the **r** field
9. Copy the `s` value you should have retrieved while generating the call permit signature and paste it into the **s** field
10. Click **transact** to send the transaction
11. MetaMask should pop-up and you can confirm the transaction

![img/call-11.png](img/call-11.png)

Once the transaction goes through, you can verify that the message was updated to `hello world`. To do so, you can:

1. Expand the `SetMessage.sol` contract
2. Click on **get**
3. The result will appear below the function, and it should show `hello world`

![img/call-12.png](img/call-12.png)

Congratulations! You've successfully generated a call permit signature and used it to dispatch a call on behalf of the call permit signer.
