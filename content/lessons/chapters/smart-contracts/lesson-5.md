---
id: "smart-contracts-lesson4-dev"
title: "Creating Your First Smart Contract (For Developers)"
description: "Step-by-step guide to creating and deploying your first smart contract on the Ethereum blockchain using Solidity and Remix IDE."
xpReward: 100
estimatedTime: 90
order: 5
---

# Creating Your First Smart Contract (For Developers)

In this lesson, we'll walk through the process of creating and deploying your first smart contract on the Ethereum blockchain using Solidity and the Remix IDE.

## Setting Up the Development Environment

1. Open the Remix IDE in your web browser: [https://remix.ethereum.org/](https://remix.ethereum.org/)
2. Create a new file by clicking the "+" button in the "File Explorer" panel on the left side of the screen
3. Name the file "MyFirstContract.sol"

## Writing the Smart Contract

Copy and paste the following code into the "MyFirstContract.sol" file:

```solidity
pragma solidity ^0.8.0;

contract MyFirstContract {
    string private greeting;

    constructor(string memory _greeting) {
        greeting = _greeting;
    }

    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
    }

    function greet() public view returns (string memory) {
        return greeting;
    }
}
```

This simple contract allows users to set and retrieve a greeting message.

## Compiling the Smart Contract

1. In the "Solidity Compiler" panel on the left side of the screen, select the appropriate compiler version (e.g., 0.8.0)
2. Click the "Compile MyFirstContract.sol" button

If there are no errors, your contract has been successfully compiled.

## Deploying the Smart Contract

1. In the "Deploy & Run Transactions" panel on the left side of the screen, select the "MyFirstContract" contract from the dropdown menu
2. Enter a greeting message in the "Deploy" section (e.g., "Hello, World!")
3. Click the "Deploy" button

Your contract has now been deployed to the Remix IDE's built-in Ethereum test environment.

## Interacting with the Smart Contract

1. In the "Deployed Contracts" section, you should see your deployed "MyFirstContract"
2. Click on the "greet" button to retrieve the greeting message
3. To change the greeting, enter a new message in the "setGreeting" input field and click the "setGreeting" button
4. Click the "greet" button again to see the updated greeting message

## Key Takeaways

- Remix IDE is a web-based IDE for writing, compiling, and deploying Solidity smart contracts
- Smart contracts are written in Solidity and consist of state variables, functions, and events
- Contracts can be deployed to the Ethereum blockchain, and users can interact with them by calling their functions
- The Remix IDE provides a built-in Ethereum test environment for deploying and testing contracts

## Practice Exercise

Extend the "MyFirstContract" by adding the following features:
1. A state variable `owner` (address) that stores the address of the contract deployer
2. A modifier `onlyOwner` that restricts access to certain functions to only the contract owner
3. A function `transferOwnership` that allows the current owner to transfer ownership to a new address
4. Emit an event `OwnershipTransferred` when the ownership is transferred