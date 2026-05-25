# 📦 Intro to Blockchain – My Learning Notes

> A conceptual foundation of blockchain technology, covering how it works, why it matters, and the key differences between Bitcoin and Ethereum.

---

## 🧱 What is a Blockchain?

A **blockchain** is a shared, immutable ledger that records transactions across many computers in a network.

- **Blocks** – groups of transactions bundled together.
- **Chain** – each block contains a cryptographic hash of the previous block, linking them.
- **Data storage** – once a block is added, its data cannot be changed without changing all subsequent blocks (computationally infeasible).

📘 *Think of it as a Google Doc that everyone can read, but no one can edit history – only append new pages.*

---

## 🌍 Decentralization & Peer-to-Peer Networks

| Centralized (e.g., bank) | Decentralized (blockchain) |
|--------------------------|-----------------------------|
| Single point of control | No single owner |
| Trust in a third party | Trust in math & consensus |
| Can be shut down | Highly resilient |

- **Peer-to-peer (P2P)** – every node (computer) talks directly to others.
- No central server → no single point of failure.

✅ *Result:* Censorship resistance + transparency.

---

## ⚖️ Consensus Mechanisms

### Proof of Work (PoW)
- Used by **Bitcoin** (and Ethereum pre-2022).
- Miners solve complex math puzzles.
- First to solve gets to add the next block and earn rewards.
- ✅ Secure, ❌ High energy use.

### Proof of Stake (PoS)
- Used by **Ethereum now** (and many others).
- Validators lock up (“stake”) their own coins.
- Randomly chosen to propose/validate blocks.
- ✅ Energy efficient, ❌ More complex to design fairly.

> **Why consensus?** Without it, anyone could spend the same coin twice (double-spend problem).

---

## 🔐 Cryptography Basics (Simplified)

### Hashing
- A function that turns any input into a fixed-size output (e.g., `keccak256` in Ethereum).
- One-way: you cannot get the input from the hash.
- Any tiny change → completely different hash.

**Example**  
`"hello"` → `0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8`

### Digital Signatures
- Like a handwritten signature but mathematically verified.
- You sign with your **private key** (secret).
- Anyone can verify with your **public key**.
- Proves: “I, and only I, authorized this transaction.”

---

## ₿ Bitcoin vs 🔷 Ethereum – Differences & Purposes

| Feature | Bitcoin | Ethereum |
|---------|---------|----------|
| **Purpose** | Digital gold / peer-to-peer cash | World computer for decentralized apps (dApps) |
| **Smart contracts** | No (very limited scripting) | Yes (Turing-complete) |
| **Consensus** | PoW (will it change? unlikely) | PoS (since “The Merge” 2022) |
| **Block time** | ~10 minutes | ~12 seconds |
| **Transaction cost** | Bitcoin fees | Gas (paid in ETH) |
| **Example use** | Store of value, payments | NFTs, DeFi, DAOs, games |

**Both** are blockchains, but Ethereum is programmable – you can deploy code that runs exactly as written.

---

## 📚 Resources I Used

- [IBM Blockchain Basics](https://www.ibm.com/think/topics/blockchain)
- [Bitcoin Whitepaper (Satoshi Nakamoto)](https://bitcoin.org/bitcoin.pdf)
- [Ethereum Whitepaper (Vitalik Buterin)](https://ethereum.org/en/whitepaper/)
- [Alchemy University – Blockchain Cryptography](https://university.alchemy.com)

---

## 🧠 My Key Takeaways (3 bullet points)

1. **Blockchain = append-only log** secured by hashing and distributed among peers.
2. **Consensus** replaces central authority – PoW is energy-heavy but proven, PoS is newer and greener.
3. **Bitcoin is a single-purpose ledger**, while **Ethereum is a programmable platform** for smart contracts.

---