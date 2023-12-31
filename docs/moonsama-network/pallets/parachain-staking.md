---
description: 🚧 This section in currently under construction 🚧 
---

# Parachain Staking

## Introduction

Moonsama Network uses a Delegated Proof of Stake (DPoS) system that determines which collators are eligible to produce 
blocks based on their total stake in the network. For general information on staking, such as general terminology, 
staking variables, and more, please refer to the [Staking on Moonsama Network](/docs/about-sama/sama-staking) page.

The DPoS system is powered by the Parachain Staking Pallet, allowing token holders (delegators) to express exactly which
collator candidates they would like to support and with what quantity of stake. The design of the parachain staking 
pallet is such that it enforces shared risk/reward on-chain between delegators and candidates.

## Exit Delays

Some of the staking pallet extrinsics include exit delays that you must wait for before the request can be executed. 
The exit delays to note are as follows:

| Variable | Value |
| --- | --- |
| Decrease candidate bond | 28 rounds (168 hours) |
| Decrease delegator bond | 28 rounds (168 hours) |
| Revoke delegation | 28 rounds (168 hours) |
| Leave candidates | 28 rounds (168 hours) |
| Leave delegators | 28 rounds (168 hours) |

## Parachain Staking Pallet Interface

### Extrinsics

The parachain staking pallet provides the following extrinsics (functions):

- **cancelCandidateBondLess**() - cancels a pending scheduled request to decrease a candidate's self bond amount.
- **cancelDelegationRequest**(candidate) - cancels any pending delegation requests provided the address of a candidate.
- **cancelLeaveCandidates**(candidateCount) - cancels a candidate's pending scheduled request to leave the candidate 
pool given the current number of candidates in the pool.
- **cancelLeaveDelegators**() - *deprecated as of runtime 1800* - cancels a pending scheduled request to leave the set 
of delegators. Use the 
[batch utility](https://docs.rs/pallet-utility/latest/pallet_utility/pallet/enum.Call.html#variant.batch) 
with `cancelDelegationRequest` for all delegations instead.
- **candidateBondMore**(more) - request to increase a candidate's self bond by a specified amount.
- **delegate**(candidate, amount, candidateDelegationCount, delegationCount) - request to add a delegation to a 
specific candidate for a given amount and sets the percentage of rewards to auto-compound automatically to `0`. If the 
caller is not a delegator, this function adds them to the set of delegators. If the caller is already a delegator, then 
it adjusts their delegation amount.
- **delegateWithAutoCompound**(candidate, amount, autoCompound, candidateDelegationCount, 
candidateAutoCompoundingDelegationCount, delegationCount) - delegates a collator candidate and sets the percentage of 
rewards to auto-compound given an integer (no decimals) for the `amount` between 0-100. If the caller is not a 
delegator, this function adds them to the set of delegators. If the caller is already a delegator, then it adjusts 
their delegation amount.
- **delegatorBondMore**(candidate, more) - request to increase a delegator's amount delegated for a specific candidate.
- **executeCandidateBondLess**(candidate) - executes any scheduled due requests to decrease a candidate's self bond 
amount.
- **executeDelegationRequest**(delegator, candidate) - executes any scheduled due delegation requests for a specific 
delegator provided the address of the candidate.
- **executeLeaveCandidates**(candidate, candidateDelegationCount) - executes any scheduled due requests to leave the 
set of collator candidates
- **executeLeaveDelegators**(delegator, delegationCount) - *deprecated as of runtime 1800* - executes a scheduled due 
request to leave the set of delegators and revoke all delegations. Use the 
[batch utility](https://docs.rs/pallet-utility/latest/pallet_utility/pallet/enum.Call.html#variant.batch) with 
`executeDelegationRequest` for all delegations instead
- **goOffline**() - allows a collator candidate to temporarily leave the pool of candidates without unbonding
- **goOnline**() - allows a collator candidate to rejoin the pool of candidates after previously calling `goOffline()`
- **joinCandidates**(bond, candidateCount) - request to join the set of collator candidates with a specified bond 
amount and provided the current candidate count
- **scheduleCandidateBondLess**(less) - schedules a request to decrease a candidate's self bond by a specified amount. 
There is an [exit delay](#exit-delays) that must be waited before you can 
execute the request via the `executeCandidateBondLess` extrinsic
- **scheduleDelegatorBondLess**(candidate, less) - schedules a request for a delegator to bond less with respect to a 
specific candidate. There is an [exit delay](#exit-delays) that must be 
waited before you can execute the request via the `executeDelegationRequest` extrinsic
- **scheduleLeaveCandidates**(candidateCount) - schedules a request for a candidate to remove themselves from the 
candidate pool. There is an [exit delay](#exit-delays) that must be waited
before you can execute the request via the `executeLeaveCandidates` extrinsic
- **scheduleLeaveDelegators**() - *deprecated as of runtime 1800* - schedules a request to leave the set of delegators 
and revoke all ongoing delegations. Use the 
[batch utility](https://docs.rs/pallet-utility/latest/pallet_utility/pallet/enum.Call.html#variant.batch) with 
`scheduleRevokeDelegation` for all delegations instead
- **scheduleRevokeDelegation**(collator) - schedules a request to revoke a delegation given the address of a candidate. 
There is an [exit delay](#exit-delays) that must be waited before you can 
execute the request via the `executeDelegationRequest` extrinsic
- **setAutoCompound**(candidate, value, candidateAutoCompoundingDelegationCountHint, delegationCountHint) - sets the 
percentage of rewards to be auto-compounded for an existing delegation given an integer (no decimals) for the `value` 
between 0-100
- **setBlocksPerRound**(new) - sets the blocks per round. If the `new` value is less than the length of the current
 round, the next block will transition immediately
- **setCollatorCommission**(new) - sets the commission to a `new` value for all collators
- **setInflation**(schedule) - sets the annual inflation rate to derive per-round inflation
- **setParachainBondAccount**(new) - sets the account that will hold funds set aside for parachain bond
- **setParachainBondReservePercent**(new) - sets the percent of inflation set aside for parachain bond
- **setStakingExpectations**(expectations) - sets the expectations for total staked
- **setTotalSelected**(new) - sets the total number of collator candidates selected per round

### Storage Methods

The parachain staking pallet includes the following read-only storage methods to obtain chain state data:

- **atStake**(u32, AccountId20) - provides a snapshot of a collator's delegation stake and the percentage of rewards 
set to auto-compound given a round number and, optionally, the collator's address
- **autoCompoundingDelegations**(AccountId20) - returns a list of delegators for a given candidate that have set up 
auto-compounding along with the percentage of rewards set to be auto-compounded
- **awardedPts**(u32, AccountId20) - returns the awarded points for each collator per round given a round number and, 
optionally, the collator's address
- **bottomDelegations**(AccountId20) - returns at the most the bottom 50 delegations for all candidates or for a given 
candidate's address
- **candidateInfo**(AccountId20) - returns candidate information such as the candidate's bond, delegation count, and
more for all candidates or for a given candidate's address
- **candidatePool**() - returns a list of each of the candidates in the pool and their total backing stake
- **candidateState**(AccountId20) - *deprecated as of runtime 1200* - use `candidateInfo` instead
- **collatorCommission**() - returns the commission percent taken off of rewards for all collators
- **collatorState2**(AccountId20) - *deprecated as of runtime 1001* - use `candidateInfo` instead
- **delayedPayouts**(u32) - returns the delayed payouts for all rounds or for a given round
- **delegationScheduledRequests**(AccountId20) - returns the outstanding scheduled delegation requests for all collators
or for a given collator's address
- **delegatorState**(AccountId20) - returns delegator information such as their delegations, delegation status, and 
total delegation amount for all delegators or for a given delegator's address
- **inflationConfig**() - returns the inflation configuration
- **nominatorState2**(AccountId20) - *deprecated as of runtime 1001* - use `delegatorState` instead
- **palletVersion**() - returns the current pallet version
- **parachainBondInfo**() - returns the parachain bond reserve account and the percentage of annual inflation
- **points**(u32) - returns the total points awarded to collators for block production in all rounds or for a given 
round
- **round**() - returns the current round number, the first block of the current round, and the length of the round
- **selectedCandidates**() - returns the collator candidates selected to be in the active set for the current round
- **staked**(u32) - returns the total counted stake for collator candidates in the active set for all rounds or for a 
given round
- **topDelegations**(AccountId20) - returns at the most the top 300 delegations for all collators or for a given 
collator's address
- **total**() - returns the total capital locked in the staking pallet
- **totalSelected**() - returns the total number of collator candidates that can be selected for the active set

### Pallet Constants

The parachain staking pallet includes the following read-only functions to obtain pallet constants:

- **candidateBondLessDelay**() - returns the number of rounds that must be waited until a candidate's scheduled request 
to decrease their self bond can be executed
- **defaultBlocksPerRound**() - returns the default number of blocks per round
- **defaultCollatorCommission**() - returns the default commission due to collators
- **defaultParachainBondReservePercent**() - returns the default percent of inflation set aside for the parachain bond 
account
- **delegationBondLessDelay**() - returns the number of rounds that must be waited until a scheduled request to 
decrease a delegation can be executed
- **leaveCandidatesDelay**() - returns the number of rounds that must be waited before a scheduled request for a
 candidate to leave the candidate pool can be executed
- **leaveDelegatorsDelay**() - returns the number of rounds that must be waited before a scheduled request for a 
delegator to leave the set of delegators can be executed
- **maxBottomDelegationsPerCandidate**() - returns the maximum number of bottom delegations per candidate
- **maxDelegationsPerDelegator**() - returns the maximum number of delegations per delegator
- **maxTopDelegationsPerCandidate**() - returns the maximum number of top delegations per candidate
- **minBlocksPerRound**() - returns the minimum number of blocks per round
- **minCandidateStk**() - returns the minimum stake required for a candidate to be a collator candidate
- **minCollatorStk**() - returns the minimum stake required for a candidate to be in the active set
- **minDelegation**() - returns the minimum delegation amount
- **minDelegatorStk**() - returns the minimum stake for an account to be a delegator
- **minSelectedCandidates**() - returns the minimum number of selected candidates in the active set every round
- **revokeDelegationDelay**() - returns the number of rounds that must be waited before a scheduled request to revoke 
a delegation can be executed
- **rewardPaymentDelay**() - returns the number of rounds that must be waited after which block authors are rewarded
