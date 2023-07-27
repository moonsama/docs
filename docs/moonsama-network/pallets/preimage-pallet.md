---
sidebar_position: 2
---

# Preimage Pallet

🚧 This section in currently under construction 🚧 

## Introduction

The Preimage Pallet allows for the users and the runtime to store the preimage of a hash on chain. This can be used by 
other pallets for storing and managing large byte-blobs. For example, token holders can submit a democracy proposal 
through the Democracy Pallet using a preimage hash.

With the rollout of [OpenGov](learn/features/governance/#opengov) (also referred to as Governance v2), several 
modifications have been introduced to the governance process. As a result, the governance system in Governance v1 uses 
the [Democracy Pallet](builders/pallets-precompiles/pallets/democracy) and 
[Democracy Precompile](builders/pallets-precompiles/precompiles/democracy) for all governance-related functionality. 
In OpenGov, governance-related functionality is based on three new pallets and precompiles: the 
[Preimage Pallet](builders/pallets-precompiles/pallets/preimage) and 
[Preimage Precompile](builders/pallets-precompiles/precompiles/preimage), the 
[Referenda Pallet](builders/pallets-precompiles/pallets/referenda) and 
[Referenda Precompile](builders/pallets-precompiles/precompiles/referenda), and the 
[Conviction Voting Pallet](builders/pallets-precompiles/pallets/conviction-voting) and 
[Conviction Voting Precompile](builders/pallets-precompiles/precompiles/conviction-voting). **OpenGov has launched on 
Moonsama Network, and once it has been rigorously tested, a proposal will be made for it to be launched on Moonsama 
Network. Until then, Moonsama Network still uses Goverance v1.** The aforementioned precompiles are Solidity interfaces 
that enable you to perform governance functions using the Ethereum API. Some of the functionality of the Preimage Pallet
is available through the [Preimage Precompile](builders/pallets-precompiles/precompiles/preimage/).

This guide will provide an overview of the extrinsics, storage methods, and getters for the pallet constants available 
in the Preimage Pallet on Moonsama Network. This guide assumes you are familiar with governance-related terminology, 
if not, please check out the [governance overview page](learn/features/governance/#opengov) for more information.

## Preimage Pallet Interface

### Extrinsics

The Preimage Pallet provides the following extrinsics (functions):

- **notePreimage**(encodedProposal) - registers a preimage for an upcoming proposal given the encoded preimage of a 
proposal. If the preimage was previously requested, no fees or deposits are taken for providing the preimage. 
Otherwise, a deposit is taken proportional to the size of the preimage. Emits a `Noted` event.
- **requestPreimage**(bytes) - requests a preimage to be uploaded to the chain without paying any fees or deposits. 
If the preimage request has already been provided on-chain by a user, their related deposit is unreserved, and they no
longer control the preimage. Emits a `Requested` event.
- **unnotePreimage**(hash) - clears an unrequested preimage from the runtime storage given the hash of the preimage to 
be removed. Emits a `Cleared` event.
- **unrequestPreimage**(hash) - clears a previously made request for a preimage. Emits a `Cleared` event.

### Storage Methods

The Preimage Pallet includes the following read-only storage methods to obtain chain state data:

- **palletVersion**() - returns the current pallet version.
- **preimageFor**((H256, u32)) - returns a list of the proposal hashes of all preimages along with their associated 
data. If given a proposal hash and the length of the associated data, a specific preimage is returned.
- **statusFor**(H256) - returns the request status of all preimages or for a given preimage hash.
