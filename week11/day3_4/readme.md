# 🧟‍♂️ My CryptoZombies Solidity Journey
**Course:** [CryptoZombies - Solidity: Beginner to Intermediate](https://cryptozombies.io/en/solidity)

## 📌 About This Repository

This repository documents my completion of the **CryptoZombies** Solidity tutorial. My objective was to gain hands-on familiarity with Solidity for Ethereum smart contract development. This README serves as the deliverable for my mentor, containing proof of progress, a learning summary, and questions that arose during the process.

The CryptoZombies course is an interactive, game-based tutorial that teaches you to write smart contracts by building a zombie-collecting game.

---

## 🎯 Deliverables

I have completed the following core modules:
*   **Lesson 1:** Making the Zombie Factory
*   **Lesson 2:** Zombies Attack Their Victims
*   **Lesson 3:** Advanced Solidity Concepts
*   **Lesson 4:** Zombie Battle System
*   **Lesson 5:** ERC721 & Crypto-Collectibles

---

### 1. 📝 Summary of What I Learned

This course was an effective and practical introduction. I built a fully-functional, multi-contract game while learning core Solidity principles. My key learnings include:

*   **Solidity Fundamentals:** I learned the core structure of a Solidity contract, including `pragma` directives, state variables, integers, structs, functions, arrays, and various data types.
*   **Managing Game State:** I used `mapping` to create key-value stores for ownership (e.g., linking a `zombieId` to an `owner address`) and used `require()` statements for input validation and access control.
*   **Data Locations:** I learned to navigate the critical difference between `storage` (permanent) and `memory` (temporary) data locations, which is essential for optimizing gas costs.
*   **Inheritance & Interacting with Other Contracts:** I used `import` to bring in other contract files and used `interface`s to allow my contract to interact with other deployed contracts on the blockchain.
*   **Advanced Concepts:** I implemented **ownership** for access control, created **events** to log actions for the frontend, and used **function modifiers** to add pre-conditions to functions.
*   **Blockchain Integration:** In the final lesson, I learned how to use Web3.js to connect a basic HTML/JavaScript frontend to my deployed smart contract, making the DApp fully interactive.

---

### 2. ❓ Question & Difficulty I Faced

**The Difficulty:**
The most challenging concept to grasp was the distinction between **`storage`** and **`memory`** , especially when working with structs and arrays within functions. I initially struggled with compiler errors that forced me to explicitly declare data locations. I now understand that `storage` is permanent data on the blockchain, while `memory` is temporary and is erased between external function calls, similar to a computer's RAM.
**My Question for My Mentor:**
*"The course covered gas optimization in Lesson 3. Given that writing to `storage` is expensive, what are the most common gas optimization patterns in professional development? For example, is it always better to use `memory` for temporary data, and are there specific data structures that are more gas-efficient than others?"*

---

## 🧠 Smart Contract Concept I Built & Understood

**Concept:** The `ZombieFactory` Contract from Lesson 1.

This foundational contract creates new zombies. Here is a simplified version of the logic I implemented:

```solidity
pragma solidity >=0.5.0 <0.6.0;

contract ZombieFactory {
    // Event to notify the frontend when a zombie is created
    event NewZombie(uint zombieId, string name, uint dna);

    uint dnaDigits = 16;
    uint dnaModulus = 10 ** dnaDigits;

    // A struct to define a Zombie
    struct Zombie {
        string name;
        uint dna;
    }

    // A public array to store all zombies on the blockchain
    Zombie[] public zombies;

    // Function to generate a random DNA from a string
    function _generateRandomDna(string memory _str) private view returns (uint) {
        uint rand = uint(keccak256(abi.encodePacked(_str)));
        return rand % dnaModulus;
    }

    // Function to create a new zombie
    function createRandomZombie(string memory _name) public {
        uint randDna = _generateRandomDna(_name);
        uint id = zombies.push(Zombie(_name, randDna)) - 1;
        // Emit the event for the frontend to catch
        emit NewZombie(id, _name, randDna);
    }
}