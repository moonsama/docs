# Ethereum MainNet Precompiles


## Introduction

Precompiled contracts in Ethereum are contracts that include complex cryptographic computations, but do not require the overhead of the EVM. There are nine precompiles that can be used within the EVM that handle specific common operations such as hashing and signature schemes.

The following precompiles are currently included: ecrecover, sha256, sha3FIPS256, ripemd-160, Bn128Add, Bn128Mul, Bn128Pairing, the identity function, and modular exponentiation.

These precompiles are natively available on Ethereum and, to maintain Ethereum compatibility, they are also available on Moonsama Network.

In this guide, you will learn how to use and/or verify these precompiles.

## Checking Prerequisites

You need to install Node.js (for this example, you can use v16.x) and the npm package manager. You can download directly from [Node.js](https://nodejs.org/en/download/) or in your terminal:

UbuntuMacOS

```
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -

sudo apt install -y nodejs

```

You can verify that everything is installed correctly by querying the version for each package:

```
node -v

```

```
npm -v

```

As of writing this guide, the versions used were 15.2.1 and 7.0.8, respectively. You will also need to install the [Web3](https://web3js.readthedocs.io/en/latest/) package by executing:

```
npm install --save web3

```

To verify the installed version of Web3, you can use the `ls` command:

As of writing this guide, the version used was 1.3.0. You will be also using [Remix](builders/build/eth-api/dev-env/remix/), connecting it to the  TestNet via [MetaMask](tokens/connect/metamask/).

To test out the examples in this guide on Moonsama Network or Moonsama Network, you will need to have your own endpoint and API key, which you can get from one of the supported [Endpoint Providers](builders/get-started/endpoints/).

## Verify Signatures with ECRECOVER

The main function of this precompile is to verify the signature of a message. In general terms, you feed `ecrecover` the transaction's signature values and it returns an address. The signature is verified if the address returned is the same as the public address that sent the transaction.

The following will be a small example to showcase how to leverage this precompiled function. You'll need to retrieve the transaction's signature values (`v`, `r`, `s`). Therefore, you'll sign and retrieve the signed message where these values are:

This code will return the following object in the terminal:

With the necessary values, you can go to [Remix](builders/build/eth-api/dev-env/remix/) to test the precompiled contract. Note that this can also be verified with the Web3.js library, but in this case, you can go to Remix to be sure that it is using the precompiled contract on the blockchain. The Solidity code you can use to verify the signature is the following:

Using the [Remix compiler and deployment](builders/build/eth-api/dev-env/remix) and with [MetaMask pointing to ](tokens/connect/metamask/), you can deploy the contract and call the `verify()` method that returns **true** if the address returned by `ecrecover` is equal to the address used to sign the message (related to the private key and needs to be manually set in the contract).

## Hashing with SHA256

This hashing function returns the SHA256 hash from the given data. To test this precompile, you can use this [SHA256 Hash Calculator tool](https://md5calc.com/hash/sha256) to calculate the SHA256 hash of any string you want. In this case, you'll do so with `Hello World!`. You can head directly to Remix and deploy the following code, where the calculated hash is set for the `expectedHash` variable:

Once the contract is deployed, you can call the `checkHash()` method that returns **true** if the hash returned by `calculateHash()` is equal to the hash provided.

## Hashing with SHA3FIPS256

SHA3-256 is part of the SHA-3 family of cryptographic hashes codified in [FIPS202](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.202.pdf) that produces an output 256 bits in length. Although the name is similar to SHA256, the SHA-3 family is built with an entirely different algorithm and accordingly produces a different hash output than SHA256 for the same input. You can verify this yourself using this [SHA3-256 Hash Calculator tool](https://md5calc.com/hash/sha3-256). After calculating the SHA3-256 output, change the algorithm in the drop-down selector to SHA256 and take note of the resulting output.

Currently there is no SHA3-256 support in Solidity, so it needs to be called with inline assembly. The following sample code can be used to call this precompile.

Using the [Remix compiler and deployment](builders/build/eth-api/dev-env/remix/) and with [MetaMask pointing to ](tokens/connect/metamask/), you can deploy the contract and call the `sha3fips(bytes memory data)` method to return the encoded string of the data parameter.

## Hashing with RIPEMD160

This hashing function returns a RIPEMD160 hash from the given data. To test this precompile, you can use this [RIPEMD160 Hash Calculator tool](https://md5calc.com/hash/ripemd160) to calculate the RIPEMD160 hash of any string. In this case, you'll do so again with `Hello World!`. You'll reuse the same code as before, but use the `ripemd160` function. Note that it returns a `bytes20` type variable:

With the contract deployed, you can call the `checkHash()` method that returns **true** if the hash returned by `calculateHash()` is equal to the hash provided.

## BN128Add

The BN128Add precompile implements a native elliptic curve point addition. It returns an elliptic curve point representing `(ax, ay) + (bx, by)` such that `(ax, ay)` and `(bx, by)` are valid points on the curve BN256.

Currently there is no BN128Add support in Solidity, so it needs to be called with inline assembly. The following sample code can be used to call this precompile.

Using the [Remix compiler and deployment](builders/build/eth-api/dev-env/remix/) and with [MetaMask pointing to ](tokens/connect/metamask/), you can deploy the contract and call the `callBn256Add(bytes32 ax, bytes32 ay, bytes32 bx, bytes32 by)` method to return the result of the operation.

## BN128Mul

The BN128Mul precompile implements a native elliptic curve multiplication with a scalar value. It returns an elliptic curve point representing `scalar * (x, y)` such that `(x, y)` is a valid curve point on the curve BN256.

Currently there is no BN128Mul support in Solidity, so it needs to be called with inline assembly. The following sample code can be used to call this precompile.

Using the [Remix compiler and deployment](builders/build/eth-api/dev-env/remix/) and with [MetaMask pointing to ](tokens/connect/metamask/), you can deploy the contract and call the `callBn256ScalarMul(bytes32 x, bytes32 y, bytes32 scalar)` method to return the result of the operation.

## BN128Pairing

The BN128Pairing precompile implements elliptic curve paring operation to perform zkSNARK verification. For more information, check out the [EIP-197 standard](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-197.md).

Currently there is no BN128Pairing support in Solidity, so it needs to be called with inline assembly. The following sample code can be used to call this precompile.

Using the [Remix compiler and deployment](builders/build/eth-api/dev-env/remix/) and with [MetaMask pointing to ](tokens/connect/metamask/), you can deploy the contract and call the `function callBn256Pairing(bytes memory input)` method to return the result of the operation.

## The Identity Function

Also known as datacopy, this function serves as a cheaper way to copy data in memory.

Currently there is no Identity Function support in Solidity, so it needs to be called with inline assembly. The following sample code (adapted to Solidity), can be used to call this precompiled contract:

You can use this [Web3 Type Converter tool](https://web3-type-converter.onbrn.com/) to get bytes from any string, as this is the input of the `callDataCopy()` method.

With the contract deployed, you can call the `callDataCopy()` method and verify if `memoryStored` matches the bytes that you pass in as an input of the function.

## Modular Exponentiation

This precompile calculates the remainder when an integer `b` (base) is raised to the `e`-th power (the exponent), and is divided by a positive integer `m` (the modulus).

The Solidity compiler does not support it, so it needs to be called with inline assembly. The following code was simplified to show the functionality of this precompile:

You can try this in [Remix](builders/build/eth-api/dev-env/remix/). Use the function `verify()`, passing the base, exponent, and modulus. The function will store the value in the `checkResult` variable.
