# Staking Precompile Contract

[https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/staking/](https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/staking/)

![img/staking-banner.png](img/staking-banner.png)

## Introduction

Moonbeam uses a Delegated Proof of Stake system through the [parachain staking](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking) pallet, allowing token holders (delegators) to express exactly which collator candidates they would like to support and with what quantity of stake. The design of the parachain staking pallet is such that it enforces shared risk/reward on chain between delegators and candidates. For general information on staking, such as general terminology, staking variables, and more, please refer to the [Staking on Moonbeam](https://docs.moonbeam.network/learn/features/staking) page.

The staking module is coded in Rust and it is part of a pallet that is normally not accessible from the Ethereum side of Moonbeam. However, a staking precompile allows developers to access the staking features using the Ethereum API in a precompiled contract located at address:

MoonbeamMoonriverMoonbase Alpha

```
0x0000000000000000000000000000000000000800

```

This guide will cover the available methods in the staking precompile interface. In addition, it will show you how to interact with the staking pallet through the staking precompile and the Ethereum API. The examples in this guide are done on Moonbase Alpha, but they can be adapted for Moonbeam or Moonriver.

Note

There can be some unintended consequences when using the precompiled contracts on Moonbeam. Please refer to the [Security Considerations](https://docs.moonbeam.network/builders/get-started/eth-compare/security) page for more information.

## Exit Delays

Some of the staking pallet extrinsics include exit delays that you must wait before the request can be executed. The exit delays to note are as follows:

MoonbeamMoonriverMoonbase Alpha

| Variable | Value |
| --- | --- |
| Decrease candidate bond | 28 rounds (168 hours) |
| Decrease delegator bond | 28 rounds (168 hours) |
| Revoke delegation | 28 rounds (168 hours) |
| Leave candidates | 28 rounds (168 hours) |
| Leave delegators | 28 rounds (168 hours) |

## Parachain Staking Solidity Interface

`[StakingInterface.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol)` is an interface through which Solidity contracts can interact with parachain-staking. The beauty is that Solidity developers don’t have to learn the Substrate API. Instead, they can interact with staking functions using the Ethereum interface they are familiar with.

The Solidity interface includes the following functions:

- **isDelegator**(*address* delegator) — read-only function that checks whether the specified address is currently a staking delegator. Uses the `[delegatorState](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking/#:~:text=delegatorState(AccountId20))` method of the staking pallet
- **isCandidate**(*address* candidate) — read-only function that checks whether the specified address is currently a collator candidate. Uses the `[candidateState](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking/#:~:text=candidateState(AccountId20))` method of the staking pallet
- **isSelectedCandidate**(*address* candidate) - read-only function that checks whether the specified address is currently part of the active collator set. Uses the `[selectedCandidates](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking/#:~:text=selectedCandidates())` method of the staking pallet
- **points**(*uint256* round) - read-only function that gets the total points awarded to all collators in a given round. Uses the `[points](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking/#:~:text=points(u32))` method of the staking pallet
- **awardedPoints**(*uint32* round, *address* candidate) - read-only function that returns the total points awarded in a given round to a given collator. If `0` is returned, it could be because no blocks were produced or the storage for that round has been removed. Uses the `[points](/builders/pallets-precompiles/pallets/staking/#:~:text=awardedPts(u32, AccountId20))` method of the staking pallet
- **delegationAmount**(*address* delegator, *address* candidate) - read-only function that returns the amount delegated by a given delegator in support of a given candidate. Uses the `[delegatorState](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking/#:~:text=delegatorState(AccountId20))` method of the staking pallet
- **isInTopDelegations**(*address* delegator, *address* candidate) - read-only function that returns a boolean indicating whether the a given delegator is in the top delegations for the given candidate. Uses the `[topDelegations](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking/#:~:text=topDelegations(AccountId20))` method of the staking pallet
- **minDelegation**() — read-only function that gets the minimum delegation amount. Uses the `[minDelegation](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking/#:~:text=minDelegation())` method of the staking pallet
- **candidateCount**() - read-only function that gets the current amount of collator candidates. Uses the `[candidatePool](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking/#:~:text=candidatePool())` method of the staking pallet
- **round**() - read-only function that returns the current round number. Uses the `[round](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking/#:~:text=round())` method of the staking pallet
- **candidateDelegationCount**(*address* candidate) - read-only function that returns the number of delegations for the specified collator candidate address. Uses the `[candidateInfo](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking/#:~:text=candidateInfo(AccountId20))` method of the staking pallet
- **candidateAutoCompoundingDelegationCount**(*address* candidate) - a read-only function that returns the number of auto-compounding delegations for the specified candidate. Uses the `[autoCompoundingDelegations](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking/#:~:text=autoCompoundingDelegations(AccountId20))` method of the staking pallet
- **delegatorDelegationCount**(*address* delegator) - read-only function that returns the number of delegations for the specified delegator address. Uses the `[delegatorState](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking/#:~:text=delegatorState(AccountId20))` method of the staking pallet
- **selectedCandidates**() - read-only function that gets the selected candidates for the current round. Uses the `[selectedCandidates](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking/#:~:text=selectedCandidates())` method of the staking pallet
- **delegationRequestIsPending**(*address* delegator, *address* candidate) - returns a boolean to indicate whether there is a pending delegation request made by a given delegator for a given candidate
- **candidateExitIsPending**(*address* candidate) - returns a boolean to indicate whether a pending exit exists for a specific candidate. Uses the `[candidateInfo](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking/#:~:text=candidateInfo(AccountId20))` method of the staking pallet
- **candidateRequestIsPending**(*address* candidate) - returns a boolean to indicate whether there is a pending bond less request made by a given candidate. Uses the `[candidateInfo](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking/#:~:text=candidateInfo(AccountId20))` method of the staking pallet
- **delegationAutoCompound**(*address* delegator, *address* candidate) - returns the auto-compound percentage for a delegation given the delegator and candidate
- **joinCandidates**(*uint256* amount, *uint256* candidateCount) — allows the account to join the set of collator candidates with the specified bond amount and the current candidate count. Uses the `[joinCandidates](/builders/pallets-precompiles/pallets/staking/#:~:text=joinCandidates(bond, candidateCount))` method of the staking pallet
- **scheduleLeaveCandidates**(*uint256* candidateCount) - schedules a request for a candidate to remove themselves from the candidate pool. Scheduling the request does not automatically execute it. There is an [exit delay](https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/staking/#exit-delays) that must be waited before you can execute the request via the `executeLeaveCandidates` extrinsic. Uses the `[scheduleLeaveCandidates](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking/#:~:text=scheduleLeaveCandidates(candidateCount))` method of the staking pallet
- **executeLeaveCandidates**(*address* candidate, *uint256* candidateDelegationCount) - executes the due request to leave the set of collator candidates. Uses the `[executeLeaveCandidates](/builders/pallets-precompiles/pallets/staking/#:~:text=executeLeaveCandidates(candidate, candidateDelegationCount))` method of the staking pallet
- **cancelLeaveCandidates**(*uint256* candidateCount) - allows a candidate to cancel a pending scheduled request to leave the candidate pool. Given the current number of candidates in the pool. Uses the `[cancelLeaveCandidates](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking/#:~:text=cancelLeaveCandidates(candidateCount))` method of the staking pallet
- **goOffline**() — temporarily leave the set of collator candidates without unbonding. Uses the `[goOffline](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking/#:~:text=goOffline())` method of the staking pallet
- **goOnline**() — rejoin the set of collator candidates after previously calling `goOffline()`. Uses the `[goOnline](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking/#:~:text=goOnline())` method of the staking pallet
- **candidateBondMore**(*uint256* more) — collator candidate increases bond by the specified amount. Uses the `[candidateBondMore](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking/#:~:text=candidateBondMore(more))` method of the staking pallet
- **scheduleCandidateBondLess**(*uint256* less) - schedules a request to decrease a candidates bond by the specified amount. Scheduling the request does not automatically execute it. There is an [exit delay](https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/staking/#exit-delays) that must be waited before you can execute the request via the `execute_candidate_bond_request` extrinsic. Uses the `[scheduleCandidateBondLess](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking/#:~:text=scheduleCandidateBondLess(less))` method of the staking pallet
- **executeCandidateBondLess**(*address* candidate) - executes any due requests to decrease a specified candidates bond amount. Uses the `[executeCandidateBondLess](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking/#:~:text=executeCandidateBondLess(candidate))` method of the staking pallet
- **cancelCandidateBondLess**() - allows a candidate to cancel a pending scheduled request to decrease a candidates bond. Uses the `[cancelCandidateBondLess](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking/#:~:text=cancelCandidateBondLess())` method of the staking pallet
- **delegate**(*address* candidate, *uint256* amount, *uint256* candidateDelegationCount, *uint256* delegatorDelegationCount) — makes a delegation in support of a collator candidate and automatically sets the percent of rewards to auto-compound to `0`. If you want to set the percentage to auto-compound, you can use `delegateWithAutoCompound` instead or this extrinsic in conjuction with `setAutoCompoud`. If the caller is not a delegator, this function adds them to the set of delegators. If the caller is already a delegator, then it adjusts their delegation amount. Uses the `[delegate](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking/#:~:text=delegate)` method of the staking pallet
- **delegateWithAutoCompound**(*address* candidate, *uint256* amount, *uint8* autoCompound, *uint256* candidateDelegationCount, *uint256* candidateAutoCompoundingDelegationCount, *uint256* delegatorDelegationCount) - similar to `delegate` where it makes a delegation in support of a collator candidate. However, this also sets the percentage of rewards to be auto-compounded given an integer (no decimals) for the `amount` between 0-100. Uses the `[delegateWithAutoCompound](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking/#:~:text=delegateWithAutoCompound)` method of the staking pallet
- **scheduleRevokeDelegation**(*address* candidate) — schedules a request to revoke a delegation given the address of a candidate. Scheduling the request does not automatically execute it. There is an [exit delay](https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/staking/#exit-delays) that must be waited before you can execute the request via the `executeDelegationRequest` extrinsic. Uses the `[scheduleRevokeDelegation](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking/#:~:text=scheduleRevokeDelegation(collator))` method of the staking pallet
- **delegatorBondMore**(*address* candidate, *uint256* more) — delegator increases bond to a collator by the specified amount. Uses the `[delegatorBondMore](/builders/pallets-precompiles/pallets/staking/#:~:text=delegatorBondMore(candidate, more))` method of the staking pallet
- **scheduleDelegatorBondLess**(*address* candidate, *uint256* less) — schedules a request for a delegator to bond less with respect to a specific candidate. Scheduling the request does not automatically execute it. There is an [exit delay](https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/staking/#exit-delays) that must be waited before you can execute the request via the `executeDelegationRequest` extrinsic. Uses the `[scheduleDelegatorBondLess](/builders/pallets-precompiles/pallets/staking/#:~:text=scheduleDelegatorBondLess(candidate, less))` method of the staking pallet
- **executeDelegationRequest**(*address* delegator, *address* candidate) - executes any due delegation requests provided the address of a delegator and a candidate. Uses the `[executeDelegationRequest](/builders/pallets-precompiles/pallets/staking/#:~:text=executeDelegationRequest(delegator, candidate))` method of the staking pallet
- **cancelDelegationRequest**(*address* candidate) - cancels any pending delegation requests provided the address of a candidate. Uses the `[cancelDelegationRequest](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking/#:~:text=cancelDelegationRequest(candidate))` method of the staking pallet
- **setAutoCompound**(*address* candidate, *uint8* value, *uint256* candidateAutoCompoundingDelegationCount, *uint256* delegatorDelegationCount) - sets an auto-compound value for an existing delegation given an integer (no decimals) for the `value` between 0-100. Uses the `[setAutoCompound](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking/#:~:text=setAutoCompound)` method of the staking pallet
- **getDelegatorTotalStaked**(*address* delegator) - read-only function that returns the total staked amount of a given delegator, regardless of the candidate. Uses the `[delegatorState](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking/#:~:text=delegatorState(AccountId20))` method of the staking pallet
- **getCandidateTotalCounted**(*address* candidate) - read-only function that returns the total amount staked for a given candidate. Uses the `[candidateInfo](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking/#:~:text=candidateInfo(AccountId20))` method of the staking pallet

As of runtime 1800, the following methods are **deprecated**:

- **scheduleLeaveDelegators**() — schedules a request to leave the set of delegators and revoke all ongoing delegations. Scheduling the request does not automatically execute it. There is an [exit delay](https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/staking/#exit-delays) that must be waited before you can execute the request via the `executeLeaveDelegators` extrinsic. Use the [batch utility](https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/batch) with `scheduleRevokeDelegation` for all delegations instead
- **executeLeaveDelegators**(*address* delegator, *uint256* delegatorDelegationCount) - executes the due request to leave the set of delegators and revoke all delegations. Use the [batch utility](https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/batch) with `executeDelegationRequest` for all delegations instead
- **cancelLeaveDelegators**() - cancels a pending scheduled request to leave the set of delegators. Use the [batch utility](https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/batch) with `cancelDelegationRequest` for all delegations instead

As of runtime 1001, the following methods are **deprecated** and, as of runtime 1800, have been removed:

- **is_nominator**(*address* nominator) — read-only function that checks whether the specified address is currently a staking delegator. Use `isDelegator` instead
- **min_nomination**() — read-only function that gets the minimum delegation amount. Use `minDelegation` instead
- **collator_nomination_count**(*address* collator) - read-only function that returns the number of delegations for the specified collator address. Use `candidateDelegationCount` instead
- **nominator_nomination_count**(*address* nominator) - read-only function that returns the number of delegations for the specified delegator address. Use `delegatorDelegationCount` instead
- **leave_candidates**(*uint256* amount, *uint256* candidateCount) — immediately removes the account from the candidate pool to prevent others from selecting it as a collator and triggers unbonding. Use `scheduleLeaveCandidates` and `executeLeaveCandidates` instead
- **candidate_bond_less**(*uint256* less) — collator candidate decreases bond by the specified amount. Use `scheduleCandidateBondLess` and `executeCandidateBondLess` instead
- **nominate**(*address* collator, *uint256* amount, *uint256* collatorNominationCount, *uint256* nominatorNominationCount) — if the caller is not a delegator, this function adds them to the set of delegators. If the caller is already a delegator, then it adjusts their delegation amount. Use `delegate` instead
- **leave_nominators**(*uint256* nominatorNominationCount) — leave the set of delegators and revoke all ongoing delegations. Use `scheduleLeaveDelegators` and `executeLeaveDelegators` instead
- **revoke_nominations**(*address* collator) — revoke a specific delegation. Use `scheduleRevokeDelegation` and `executeDelegationRequest` instead
- **nominator_bond_more**(*address* collator, *uint256* more) — delegator increases bond to a collator by the specified amount. Use `delegatorBondMore` instead
- **nominator_bond_less**(*address* collator, *uint256* less) — delegator decreases bond to a collator by the specified amount. Use `scheduleDelegatorBondLess` and `executeDelegationRequest` instead

## Interact with the Solidity Interface

### Checking Prerequisites

The below example is demonstrated on Moonbase Alpha, however, similar steps can be taken for Moonbeam and Moonriver.

- Have MetaMask installed and [connected to Moonbase Alpha](https://docs.moonbeam.network/tokens/connect/metamask/)
- Have an account with at least `1` token. You can get DEV tokens for testing on Moonbase Alpha once every 24 hours from the [Moonbase Alpha Faucet](https://faucet.moonbeam.network/)

Note

The example below requires more than `1` token due to the minimum delegation amount plus gas fees. If you need more than the faucet dispenses, please contact us on Discord and we will be happy to help you.

### Remix Set Up

1. Click on the **File explorer** tab
2. Get a copy of `[StakingInterface.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol)` and paste the file contents into a Remix file named `StakingInterface.sol`

![img/staking-1.png](img/staking-1.png)

### Compile the Contract

1. Click on the **Compile** tab, second from top
2. Then to compile the interface, click on **Compile StakingInterface.sol**

![img/staking-2.png](img/staking-2.png)

### Access the Contract

1. Click on the **Deploy and Run** tab, directly below the **Compile** tab in Remix. Note: you are not deploying a contract here, instead you are accessing a precompiled contract that is already deployed
2. Make sure **Injected Provider - Metamask** is selected in the **ENVIRONMENT** drop down
3. Ensure **ParachainStaking - StakingInterface.sol** is selected in the **CONTRACT** dropdown. Since this is a precompiled contract there is no need to deploy, instead you are going to provide the address of the precompile in the **At Address** field
4. Provide the address of the staking precompile for Moonbase Alpha: `0x0000000000000000000000000000000000000800` and click **At Address**
5. The Parachain Staking precompile will appear in the list of **Deployed Contracts**

![img/staking-3.png](img/staking-3.png)

### Delegate a Collator with Auto-Compounding

For this example, you are going to be delegating a collator and setting up the percentage of rewards to auto-compound on Moonbase Alpha. Delegators are token holders who stake tokens, vouching for specific candidates. Any user that holds a minimum amount of 1 token in their free balance can become a delegator. When delegating a candidate, you can simultaneously set up auto-compounding. You'll be able to specify a percentage of your rewards that will automatically be applied to your total delegation. You don't have to set up auto-compounding right away, you can always do it at a later time.

You can do your own research and select the candidate you desire. For this guide, the following candidate address will be used: `0x4c5A56ed5A4FF7B09aA86560AfD7d383F4831Cce`.

In order to delegate a candidate, you'll need to determine the candidate's current delegation count, their auto-compounding delegation count, and your own delegation count.

The candidate delegation count is the number of delegations backing a specific candidate. To obtain the candidate delegator count, you can call a function that the staking precompile provides. Expand the **PARACHAINSTAKING** contract found under the **Deployed Contracts** list, then:

1. Find and expand the **candidateDelegationCount** function
2. Enter the candidate address (`0x4c5A56ed5A4FF7B09aA86560AfD7d383F4831Cce`)
3. Click **call**
4. After the call is complete, the results will be displayed

![img/staking-4.png](img/staking-4.png)

The auto-compounding delegation count is the amount of delegations that have auto-compounding configured. To determine the number of delegations that have auto-compounding set up, you can

1. Find and expand the **candidateAutoCompoundingDelegationCount** function
2. Enter the candidate address (`0x4c5A56ed5A4FF7B09aA86560AfD7d383F4831Cce`)
3. Click **call**
4. After the call is complete, the results will be displayed

![img/staking-5.png](img/staking-5.png)

The last item you'll need to retrieve is your delegation count. If you don't know your existing number of delegations, you can easily get them by following these steps:

1. Find and expand the **delegatorDelegationCount** function
2. Enter your address
3. Click **call**
4. After the call is complete, the results will be displayed

![img/staking-6.png](img/staking-6.png)

Now that you have obtained the [candidate delegator count](about:blank#:~:text=To%20obtain%20the%20candidate%20delegator%20count), the [auto-compounding delegation count](about:blank#:~:text=To%20determine%20the%20number%20of%20delegations%20that%20have%20auto-compounding%20set%20up), and your [number of existing delegations](about:blank#:~:text=If%20you%20don't%20know%20your%20existing%20number%20of%20delegations), you have all of the information you need to delegate a candidate and set up auto-compounding. To get started:

1. Find and expand the **delegateWithAutoCompound** function
2. Enter the candidate address you would like to delegate. For this example you can use `0x4c5A56ed5A4FF7B09aA86560AfD7d383F4831Cce`
3. Provide the amount to delegate in Wei. There is a minimum of `1` token to delegate, so the lowest amount in Wei is `1000000000000000000`
4. Enter an integer (no decimals) between 0-100 to represent the percentage of rewards to auto-compound
5. Enter the delegation count for the candidate
6. Enter the auto-compounding delegation count for the candidate
7. Enter your delegation count
8. Press **transact**
9. MetaMask will pop-up, you can review the details and confirm the transaction

![img/staking-7.png](img/staking-7.png)

If you want to delegate without setting up auto-compounding, you can follow the previous steps, but instead of using **delegateWithAutoCompound**, you can use the **delegate** extrinsic.

### Verify Delegation

To verify your delegation was successful, you can check the chain state in Polkadot.js Apps. First, add your MetaMask address to the [address book in Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/addresses).

Navigate to **Accounts** and then **Address Book**, click on **Add contact**, and enter the following information:

1. Add your MetaMask address
2. Provide a nickname for the account
3. Click **Save**

![img/staking-8.png](img/staking-8.png)

To verify your delegation was successful, head to [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/chainstate) and navigate to **Developer** and then **Chain State**

1. Select the **parachainStaking** pallet
2. Select the **delegatorState** query
3. Enter your address
4. Optionally, you can enable the **include option** slider if you want to provide a specific blockhash to query
5. Click the **+** button to return the results and verify your delegation

![img/staking-9.png](img/staking-9.png)

### Confirm Auto-Compounding Percentage

You can confirm the percentage of rewards you've set to auto-compound in Remix using the `delegationAutoCompound` function of the Solidity interface:

1. Find and expand the **delegationAutoCompound** function
2. Enter your account you used to delegate with
3. Enter the candidate you've delegated
4. Click **call**
5. The response will appear below the **call** button

![img/staking-10.png](img/staking-10.png)

### Set or Change the Auto-Compounding Percentage

If you initially set up your delegation without auto-compounding or if you want to update the percentage on an existing delegation with auto-compounding set up, you can use the `setAutoCompound` function of the Solidity interface.

You'll need to get the number of delegations with auto-compounding set up for the candidate you want to set or update auto-compounding for. You'll also need to retrieve your own delegation count. You can follow the instructions in the [Delegate a Collator with Auto-Compounding](https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/staking/#delegate-a-collator) section to get both of these items.

Once you have the necessary information, you can take the following steps in Remix:

1. Find and expand the **setAutoCompound** function
2. Enter the candidate's account you want to set or update auto-compounding for
3. Enter a number 0-100 to represent the percentage of rewards you want to auto-compound
4. Enter the auto-compounding delegation count for the candidate
5. Enter your delegation count
6. Press **transact**
7. MetaMask will pop-up, you can review the details and confirm the transaction

![img/staking-11.png](img/staking-11.png)

### Revoke a Delegation

As of [runtime version 1001](https://moonbeam.network/announcements/staking-changes-moonriver-runtime-upgrade/), there have been significant changes to the way users can interact with various staking features. Including the way staking exits are handled.

Exits now require you to schedule a request to exit or revoke a delegation, wait a delay period, and then execute the request.

To revoke a delegation for a specific candidate and receive your tokens back, you can use the `scheduleRevokeDelegation` extrinsic. Scheduling a request does not automatically revoke your delegation, you must wait an [exit delay](https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/staking/#exit-delays), and then execute the request by using the `executeDelegationRequest` method.

To revoke a delegation and receive your tokens back, head back over to Remix, then:

1. Find and expand the **scheduleRevokeDelegation** function
2. Enter the candidate address you would like to revoke the delegation for
3. Click **transact**
4. MetaMask will pop, you can review the transaction details, and click **Confirm**

![img/staking-12.png](img/staking-12.png)

Once the transaction is confirmed, you must wait the duration of the exit delay before you can execute and revoke the delegation request. If you try to revoke it before the exit delay is up, your extrinsic will fail.

After the exit delay has passed, you can go back to Remix and follow these steps to execute the due request:

1. Find and expand the **executeDelegationRequest** function
2. Enter the address of the delegator you would like to revoke the delegation for
3. Enter the candidate address you would like to revoke the delegation from
4. Click **transact**
5. MetaMask will pop, you can review the transaction details, and click **Confirm**

After the call is complete, the results will be displayed and the delegation will be revoked for the given delegator and from the specified candidate. You can also check your delegator state again on Polkadot.js Apps to confirm.

If for any reason you need to cancel a pending scheduled request to revoke a delegation, you can do so by following these steps in Remix:

1. Find and expand the **cancelDelegationRequest** function
2. Enter the candidate address you would like to cancel the pending request for
3. Click **transact**
4. MetaMask will pop, you can review the transaction details, and click **Confirm**

You can check your delegator state again on Polkadot.js Apps to confirm that your delegation is still in tact.