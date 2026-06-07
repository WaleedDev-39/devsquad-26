📚 ERC-20 Token Development - Day 1 Complete Learning Guide
Author: [Your Name]
Internship Role: [Your Role, e.g., Blockchain Development Intern]
Date: [Current Date]
Repository: [Link to your GitHub repo after pushing]

This document serves as my complete learning companion for Day 1 of token engineering. It covers fundamental concepts, hands-on implementation, tokenomics design, security practices, and includes verifiable deliverables for mentor review.

🎯 Learning Objectives (Self-Assessment Checklist)
By the end of Day 1, I will be able to check off:

Explain the difference between native currencies and tokens

List and describe all 6 required ERC-20 functions + events

Write and deploy a custom ERC-20 token to a testnet

Implement minting, burning, and pausing features

Connect MetaMask and interact with my token via a frontend

Analyze tokenomics of 3 real-world tokens

Verify a contract on Etherscan

Identify at least 3 common security pitfalls in token contracts

📖 Part 1: Fundamentals (Study & Reflect)
1.1 Native Currency vs. Tokens
Feature	Native Currency (ETH)	Token (ERC-20)
Exists on chain natively	✅ Yes	❌ No (smart contract)
Can pay gas fees	✅ Yes	❌ No
Requires contract deployment	❌ No	✅ Yes
Example	ETH, BTC (on Bitcoin)	USDC, UNI, LINK
Key Insight: Tokens depend on native currency for transactions. You cannot send a token without also owning the chain's native coin for gas.

1.2 The ERC-20 Standard – Required Interface
solidity
// Minimal ERC-20 interface
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}
My Understanding:

approve + transferFrom enable delegated spending (critical for DEXes)

Events allow off-chain apps (wallets, explorers) to track token movements

1.3 Reflection Questions (for mentor discussion)
Why can't a token contract pay for its own transfer gas fees?

What would happen if totalSupply() returned a dynamic value that decreased on every transfer?

How do wallets like MetaMask detect token balances without calling balanceOf for every token?

✍️ Write your answers here before reviewing with mentor.

🔧 Part 2: Hands-On Implementation
2.1 Project Setup
Create a new folder and these files:

text
my-erc20-token/
├── contracts/
│   └── MyToken.sol
├── scripts/
│   ├── deploy.js
│   └── interact.js
├── test/
│   └── MyToken.test.js
├── frontend/
│   ├── index.html
│   └── app.js
├── hardhat.config.js
└── package.json
Install tools:

bash
mkdir my-erc20-token && cd my-erc20-token
npm init -y
npm install --save-dev hardhat @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers
npx hardhat
2.2 Smart Contract – Complete Example
contracts/MyToken.sol

solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract MyToken is ERC20, Ownable, Pausable {
    
    // Custom features
    uint8 private _decimals;
    uint256 public maxSupply;
    
    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals_,
        uint256 initialSupply,
        uint256 _maxSupply
    ) ERC20(name, symbol) {
        _decimals = decimals_;
        maxSupply = _maxSupply;
        _mint(msg.sender, initialSupply * 10**decimals_);
    }
    
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    // Minting (only owner)
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= maxSupply, "Exceeds max supply");
        _mint(to, amount);
    }
    
    // Burning
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
    
    // Pausing (emergency stop)
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // Override required for pausable
    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }
}
2.3 Deployment Script (Hardhat)
scripts/deploy.js

javascript
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const MyToken = await hre.ethers.getContractFactory("MyToken");
  const token = await MyToken.deploy(
    "My Intern Token",   // name
    "MIT",               // symbol
    18,                  // decimals
    1000000,             // initial supply (1M)
    10000000             // max supply (10M)
  );
  
  await token.deployed();
  console.log("Token deployed to:", token.address);
  
  // Verify on Etherscan (if on mainnet/testnet)
  if (hre.network.name !== "hardhat") {
    await hre.run("verify:verify", { address: token.address });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
2.4 Test Suite
test/MyToken.test.js

javascript
const { expect } = require("chai");

describe("MyToken", function () {
  let Token, token, owner, addr1, addr2;
  
  beforeEach(async () => {
    Token = await ethers.getContractFactory("MyToken");
    [owner, addr1, addr2] = await ethers.getSigners();
    token = await Token.deploy("Test Token", "TST", 18, 1000, 10000);
    await token.deployed();
  });
  
  it("Should assign initial supply to owner", async () => {
    const ownerBalance = await token.balanceOf(owner.address);
    expect(await token.totalSupply()).to.equal(ownerBalance);
  });
  
  it("Should transfer tokens between accounts", async () => {
    await token.transfer(addr1.address, 50);
    expect(await token.balanceOf(addr1.address)).to.equal(50);
  });
  
  it("Should fail transfer if insufficient balance", async () => {
    await expect(token.connect(addr1).transfer(owner.address, 1))
      .to.be.revertedWith("ERC20: transfer amount exceeds balance");
  });
  
  it("Should mint new tokens (only owner)", async () => {
    await token.mint(addr1.address, 500);
    expect(await token.balanceOf(addr1.address)).to.equal(500);
  });
  
  it("Should not exceed max supply", async () => {
    await expect(token.mint(addr1.address, 20000))
      .to.be.revertedWith("Exceeds max supply");
  });
});
Run tests:

bash
npx hardhat test
2.5 Deploy to Sepolia Testnet
Get Sepolia ETH from Alchemy Sepolia Faucet

Update hardhat.config.js:

javascript
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY`,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: { apiKey: "YOUR_ETHERSCAN_API_KEY" }
};
Deploy:

bash
npx hardhat run scripts/deploy.js --network sepolia
✅ Deliverable: Provide your deployed contract address to mentor.

💰 Part 3: Tokenomics Design
3.1 Supply Model Comparison
Model	Example	How it works	Use case
Fixed supply	Bitcoin (21M)	No new tokens ever	Store of value
Inflationary	Ethereum	Small annual issuance (~0.5%)	Security & staking rewards
Deflationary	BNB	Quarterly burns reduce supply	Value appreciation
Elastic	Ampleforth	Supply adjusts daily to target price	Synthetic commodity
3.2 Designing My Token's Economics
Token Name: [Your Token Name]
Symbol: [Ticker]
Total Supply: [e.g., 100,000,000]

Allocation Plan:

Community Airdrop: 20%

Liquidity Mining: 30%

Team (4-year vesting, 1-year cliff): 15%

Treasury/DAO: 25%

Initial DEX Offering: 10%

Utility Design (check all that apply):

Governance voting power

Fee discount on platform

Staking rewards (yield)

Access to premium features

Buyback & burn mechanism

3.3 Vesting Contract Example
solidity
// Simplified vesting wallet
contract VestingWallet {
    address public beneficiary;
    uint256 public startTime;
    uint256 public cliffDuration;    // 1 year = 31536000 seconds
    uint256 public vestingDuration;  // 4 years total
    uint256 public totalAmount;
    uint256 public released;
    
    function release() external {
        require(block.timestamp >= startTime + cliffDuration, "Cliff not met");
        uint256 vested = calculateVestedAmount();
        uint256 claimable = vested - released;
        released += claimable;
        payable(beneficiary).transfer(claimable);
    }
}
🌐 Part 4: Frontend Integration
4.1 Simple Web3 Interface
frontend/index.html

html
<!DOCTYPE html>
<html>
<head>
    <title>My ERC-20 Token Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js"></script>
</head>
<body>
    <h1>🚀 My Token Dashboard</h1>
    <button id="connectBtn">Connect MetaMask</button>
    <div>
        <p>Address: <span id="account"></span></p>
        <p>Balance: <span id="balance"></span> MIT</p>
    </div>
    <hr/>
    <h3>Transfer Tokens</h3>
    <input id="toAddress" placeholder="Recipient address" />
    <input id="amount" placeholder="Amount" type="number" />
    <button id="transferBtn">Transfer</button>
    
    <script src="app.js"></script>
</body>
</html>
frontend/app.js

javascript
const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
const ABI = [ /* Paste your contract ABI here */ ];

let provider, signer, contract;

document.getElementById("connectBtn").onclick = async () => {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        
        const account = await signer.getAddress();
        document.getElementById("account").innerText = account;
        
        const balance = await contract.balanceOf(account);
        document.getElementById("balance").innerText = ethers.utils.formatEther(balance);
    }
};

document.getElementById("transferBtn").onclick = async () => {
    const to = document.getElementById("toAddress").value;
    const amount = ethers.utils.parseEther(document.getElementById("amount").value);
    const tx = await contract.transfer(to, amount);
    await tx.wait();
    alert("Transfer complete!");
};
4.2 Add Token to MetaMask
After deployment, click "Add Token" in MetaMask → "Custom Token" → Enter your contract address. MetaMask auto-fills symbol & decimals.

🔒 Part 5: Security & Gas Optimization
5.1 Critical Security Patterns
Pattern	Example	Why it matters
Checks-Effects-Interactions	Update balance before external call	Prevents reentrancy
Input validation	require(amount > 0)	Prevents logical errors
Access control	onlyOwner modifier	Restricts sensitive functions
Emergency stop	Pausable pattern	Halts during exploits
Pull over push	Withdrawal pattern	Avoids DoS on transfers
5.2 Gas Optimization Tips
Use uint256 (not smaller uints) – EVM works in 32-byte words

Cache storage variables → memory (uint256 local = balanceOf[msg.sender])

Use unchecked blocks for math when overflow impossible (Solidity 0.8+)

Pack variables: address owner; uint96 balance; (saves ~2000 gas per slot)

🧪 Part 6: Activities & Deliverables
Activity 1: Token Research (30 min)
Analyze 3 tokens on Etherscan:

Token	Contract Address	Unique Feature	Supply Model	Notable Code Pattern
USDT	0xdAC17F958D2ee523a2206206994597C13D831ec7	Pausable, blacklist	Inflationary	Uses SafeMath (legacy)
UNI	0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984	Governance delegation	Fixed	delegate function
LINK	0x514910771AF9Ca656af840dff83E8264EcF986CA	Oracle nodes pay	Fixed	transferAndCall extension
My summary (write 3-5 sentences):
[Your analysis here]

Activity 2: Gas Cost Analysis
Using Etherscan TXs for USDT:

Operation	Average Gas Used	Cost (USD at 20 gwei)
transfer	~45,000	~$1.20
approve	~25,000	~$0.67
transferFrom	~65,000	~$1.73
Activity 3: Deploy Your Own Token
Contract deployed on Sepolia testnet

Verified on Etherscan (with source code)

3 transactions (mint, transfer, burn) visible

Token added to MetaMask

My Deployment Address: 0x...
Etherscan Link: https://sepolia.etherscan.io/address/0x...

Activity 4: Frontend Demo
Wallet connects successfully

Balance loads automatically

Transfer triggers MetaMask and completes

Balance updates post-transfer

📚 Resources I Used Today
Essential Documentation
EIP-20: ERC-20 Token Standard

OpenZeppelin ERC20 Contract

Solidity Docs – Mappings & Events

Tools
Remix IDE – Browser-based prototyping

Sepolia Faucet – Test ETH

Etherscan – Contract verification

Learning Platforms
CryptoZombies – Solidity gamified lessons

Ethernaut – Security challenges

