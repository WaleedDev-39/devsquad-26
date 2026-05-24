# Decentralized Todo List 📝 (Kasplex Hackathon)

A beautiful, premium, and fully functional decentralized Todo List application built with React, Vite, Wagmi, Viem, and Solidity.

## ✨ Features Implemented

**Core Requirements:**
- **✅ Create Task**: Users can add tasks with descriptions, securely stored on the blockchain.
- **✅ Toggle Task Completion**: Easily mark tasks as completed or incomplete.
- **✅ View Tasks**: Users only see their own tasks.
- **✅ View Details**: All task details are available directly from the smart contract.

**Bonus Features (Implemented 🎉):**
- **Delete Tasks**: Remove tasks completely from the blockchain state.
- **Task Categories**: Attach tags like "Work" or "Personal" to tasks.
- **Priority Levels**: Set Low, Medium, or High priority to effectively manage your tasks.
- **Premium UI**: Designed with Glassmorphism, dynamic animations, and vibrant modern themes.

## 🛠 Prerequisites

- Node.js (v18+)
- MetaMask Wallet extension installed in your browser
- Test KAS tokens (from the Kasplex Testnet faucet or mentor)

## 🚀 Getting Started

### 1. Smart Contract Deployment

1. Open [Remix IDE](https://remix.ethereum.org).
2. Create a new file `TodoList.sol` in the `contracts` folder and paste the code from `contracts/TodoList.sol` in this repository.
3. Compile the contract using Solidity Compiler `^0.8.19`.
4. In the "Deploy & Run Transactions" tab:
   - Select **Injected Provider - MetaMask** as the environment.
   - Make sure your MetaMask is connected to **Kasplex zkEVM Testnet**:
     - **Network Name:** Kasplex zkEVM Testnet
     - **RPC URL:** `https://rpc.kasplextest.xyz`
     - **Chain ID:** `167012`
     - **Currency Symbol:** `KAS`
5. Click **Deploy** and confirm the transaction in MetaMask.
6. Once deployed, copy the **Contract Address**.

### 2. Frontend Setup

1. Open `src/abi.ts` in your code editor.
2. Replace the `CONTRACT_ADDRESS` constant on line 1 with your newly deployed contract address.
   ```typescript
   export const CONTRACT_ADDRESS = '0xYOUR_DEPLOYED_CONTRACT_ADDRESS_HERE';
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser!

## 💡 Assumptions Made
- The app operates such that each user connected via MetaMask manages their **own personal tasks**. You won't see other people's tasks, making it truly personal and decentralized.
- Hard deletes were implemented for the "Delete Task" feature (removes the entire struct from the mapping) to optimize state storage on the EVM.
- The UI filters out deleted items natively when the smart contract returns an empty task `id = 0`.

## 🎨 Tech Stack
- Frontend: React + TypeScript + Vite
- Styling: Vanilla CSS (Custom Glassmorphism Design System)
- Web3: Wagmi + Viem
- Smart Contracts: Solidity
