---
description: MainNet and additional precompiles
---

# Ethereum Precompiles

Ethereum MainNet precompiles are included in [Frontier](https://paritytech.github.io/frontier/) and as such are
supported out of the box on Moonsama Network. 

Some of the precompiles have Solidity interfaces for ease of use. To find these interfaces, see 
[Mathematical and Cryptographic Functions in Solidity](https://docs.soliditylang.org/en/latest/units-and-global-variables.html#mathematical-and-cryptographic-functions).

Elsewhere, inline assembly needs to be used (e.g. `SHA3FIPS256`). For now, there is example usage of these cases in the
Moonbeam's 
[Ethereum MainNet Precompiles](https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/eth-mainnet/).
Since Moonbeam also uses Frontier, the examples can also be used with Moonsama Network.
