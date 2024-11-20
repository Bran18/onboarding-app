---
id: "smart-contracts-lesson3-dev"
title: "Solidity Fundamentals (For Developers)"
description: "Learn the basics of Solidity, the primary programming language for writing smart contracts on the Ethereum blockchain."
xpReward: 100  
estimatedTime: 60
order: 3
---

# Solidity Fundamentals (For Developers)

Solidity is a high-level, contract-oriented programming language designed for implementing smart contracts on the Ethereum blockchain. It is influenced by C++, Python, and JavaScript and is statically typed, supporting inheritance, libraries, and complex user-defined types. In this lesson, we'll cover the basics of Solidity programming.

## Basic Syntax and Data Types

Solidity contracts are similar to classes in object-oriented programming. They contain state variables, functions, function modifiers, events, and struct types. Here's a basic example of a Solidity contract:

```solidity
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private data;

    function set(uint256 x) public {
        data = x;
    }

    function get() public view returns (uint256) {
        return data;
    }
}
```

Basic data types in Solidity include:
- `uint` / `int`: Unsigned and signed integers of various sizes
- `bool`: Boolean values (`true` or `false`)
- `address`: 20-byte Ethereum address
- `bytes`: Fixed-size byte arrays
- `string`: Unicode string (avoid using, as they can be expensive)

## Functions and Visibility

Functions in Solidity can be declared as `public`, `private`, `internal`, or `external`. 

- `public`: Accessible from anywhere, including external contracts and transactions
- `private`: Only accessible within the contract itself
- `internal`: Accessible within the contract and derived contracts
- `external`: Only accessible from external contracts and transactions (more efficient than public for external calls)

Functions can also be marked as `view` (read-only, does not modify contract state) or `pure` (neither reads nor modifies contract state).

## Control Structures

Solidity supports common control structures such as `if`, `else`, `while`, `do`, `for`, `break`, `continue`, and `return`. It also includes the `require` function for checking conditions and throwing exceptions if the condition is not met.

Example:
```solidity
function divide(uint256 a, uint256 b) public pure returns (uint256) {
    require(b > 0, "Division by zero");
    return a / b;
}
```

## Inheritance and Interfaces

Solidity supports inheritance, allowing contracts to inherit properties and methods from other contracts. Inherited contracts can override functions, and multiple inheritances are possible.

```solidity
contract A {
    function foo() public pure virtual returns (string memory) {
        return "A";
    }
}

contract B is A {
    function foo() public pure virtual override returns (string memory) {
        return "B";
    }
}
```

Interfaces are similar to abstract contracts and are used to specify the expected behavior of other contracts.

## Events and Logs

Solidity allows contracts to emit events, which can be used to log data to the blockchain. Events are declared using the `event` keyword and can be triggered using the `emit` keyword.

```solidity
event DataSet(uint256 indexed x);

function set(uint256 x) public {
    data = x;
    emit DataSet(x);
}
```

## Key Takeaways

- Solidity is a contract-oriented programming language for writing smart contracts on the Ethereum blockchain
- Contracts in Solidity are similar to classes in object-oriented programming
- Functions can have different visibility specifiers (`public`, `private`, `internal`, `external`) and state mutability (`view`, `pure`)
- Solidity supports common control structures, inheritance, and interfaces
- Events can be used to log data to the blockchain

## Practice Exercise

Create a simple Solidity contract called "BankAccount" with the following features:
1. A state variable `balance` (uint256) to store the account balance
2. A `deposit` function that allows users to add funds to their account
3. A `withdraw` function that allows users to withdraw funds from their account (ensure the withdrawal amount is not greater than the balance)
4. An event `Withdrawal` that logs the amount withdrawn and the remaining balance