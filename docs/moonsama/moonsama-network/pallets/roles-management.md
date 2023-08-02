---
description: 🚧 This section in currently under construction 🚧 
---

# Roles Management

This pallet is for managing system-wide roles, used by other pallets for identity access management.

The following roles are commonly used:

| Name | Used in Pallet | Description |
| --- | --- |
| Creator | Multi-Token | Can create collections |
| Minter | Minting | Can mint tokens |
| Operator | All | Can submit root extrinsics |
| FreeCallsDistributor | Free Calls Registry | Can enable free calls for account |

Roles can be granted and revoked by a root extrinsic. Roles can also be renounced by the holder.
