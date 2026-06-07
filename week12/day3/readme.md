📖 Part 1: DeFi Fundamentals
1.1 What is DeFi?
DeFi = Decentralized Finance – financial services built on smart contracts, without banks or central intermediaries.

Traditional Finance	DeFi
Banks control your money	You control your money (self‑custody)
Need approval to use (KYC)	Anyone can use (permissionless)
9–5 banking hours	24/7 global access
Days to settle trades	Minutes (or seconds)
Main DeFi application we build today:
🔄 DEX (Decentralized Exchange) – swap tokens without a middleman.

1.2 How a DEX Works (vs Centralized Exchange)
Centralized (CEX):
You → Give tokens to exchange → Exchange holds them → Gives you other tokens
❌ Trust required, custody risk.

Decentralized (DEX):
You → Smart contract holds tokens in a liquidity pool → You swap directly from pool
✅ No middleman, you stay in control.

1.3 Liquidity Pools – The Heart of a DEX
A liquidity pool is a smart contract that holds two tokens (e.g., ETH and USDT). Anyone can trade against this pool.

Example pool:

100 ETH

200,000 USDT
👉 Current price: 1 ETH = 2,000 USDT

The Magic Formula: x * y = k
x = reserve of token A

y = reserve of token B

k = constant product (never changes during a swap)

Why it works:
When someone buys token A, they add token B and remove A. The product x*y must stay the same, so the price adjusts automatically.

Simple example (buying 1 ETH from the pool):

Step	ETH reserve (x)	USDT reserve (y)	Product (k)
Start	100	200,000	20,000,000
User buys 1 ETH	99	?	20,000,000
Solve 99 * y = 20,000,000 → y = 202,020.20			
User must add USDT = 202,020.20 – 200,000 = 2,020.20 USDT			
Key insight: The more you buy, the higher the price (because you’re draining the pool).

1.4 Reflection Questions (for mentor)
In the formula x * y = k, what happens to the price of token A if someone adds a huge amount of token B without removing token A?

Why does a DEX need users to approve the swap contract before swapping?

What is “impermanent loss” (advanced) – and why might a liquidity provider lose value compared to just holding?

✍️ Write your answers before the mentor review.

🔧 Part 2: Build a Simple Swap Contract
2.1 Project Setup
Create a new Hardhat project (or reuse Day 1’s folder):

bash
mkdir defi-swap && cd defi-swap
npm init -y
npm install --save-dev hardhat @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers
npm install @openzeppelin/contracts
npx hardhat
Folder structure:

text
defi-swap/
├── contracts/
│   ├── SimpleSwap.sol
│   └── (your ERC-20 from Day 1 - optional)
├── scripts/
│   ├── deploy.js
│   └── interact.js
├── test/
│   └── SimpleSwap.test.js
├── frontend/
│   ├── index.html
│   └── app.js
├── hardhat.config.js
└── package.json
2.2 Complete Swap Contract
contracts/SimpleSwap.sol

solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

contract SimpleSwap {
    IERC20 public tokenA;
    IERC20 public tokenB;
    
    uint256 public reserveA;
    uint256 public reserveB;
    
    event LiquidityAdded(address indexed provider, uint256 amountA, uint256 amountB);
    event Swapped(address indexed user, bool aToB, uint256 amountIn, uint256 amountOut);
    
    constructor(address _tokenA, address _tokenB) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }
    
    // Add liquidity (must approve tokens first)
    function addLiquidity(uint256 amountA, uint256 amountB) external {
        require(amountA > 0 && amountB > 0, "Amounts > 0");
        
        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);
        
        reserveA += amountA;
        reserveB += amountB;
        
        emit LiquidityAdded(msg.sender, amountA, amountB);
    }
    
    // Swap A → B
    function swapAforB(uint256 amountAIn) external {
        require(amountAIn > 0, "Amount > 0");
        require(reserveB > 0, "No liquidity");
        
        uint256 amountBOut = getSwapOutput(amountAIn, reserveA, reserveB);
        require(amountBOut < reserveB, "Insufficient liquidity");
        
        tokenA.transferFrom(msg.sender, address(this), amountAIn);
        tokenB.transfer(msg.sender, amountBOut);
        
        reserveA += amountAIn;
        reserveB -= amountBOut;
        
        emit Swapped(msg.sender, true, amountAIn, amountBOut);
    }
    
    // Swap B → A
    function swapBforA(uint256 amountBIn) external {
        require(amountBIn > 0, "Amount > 0");
        require(reserveA > 0, "No liquidity");
        
        uint256 amountAOut = getSwapOutput(amountBIn, reserveB, reserveA);
        require(amountAOut < reserveA, "Insufficient liquidity");
        
        tokenB.transferFrom(msg.sender, address(this), amountBIn);
        tokenA.transfer(msg.sender, amountAOut);
        
        reserveB += amountBIn;
        reserveA -= amountAOut;
        
        emit Swapped(msg.sender, false, amountBIn, amountAOut);
    }
    
    // View function to preview swap output
    function getSwapAmount(uint256 amountIn, bool aToB) external view returns (uint256) {
        if (aToB) {
            return getSwapOutput(amountIn, reserveA, reserveB);
        } else {
            return getSwapOutput(amountIn, reserveB, reserveA);
        }
    }
    
    // Internal: calculates output using x*y=k
    function getSwapOutput(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) private pure returns (uint256) {
        return (reserveOut * amountIn) / (reserveIn + amountIn);
    }
    
    function getReserves() external view returns (uint256, uint256) {
        return (reserveA, reserveB);
    }
    
    // Current price of tokenA in terms of tokenB
    function getPrice() external view returns (uint256) {
        if (reserveA == 0) return 0;
        return reserveB / reserveA;
    }
}
2.3 Deployment Script
scripts/deploy.js

javascript
const hre = require("hardhat");

async function main() {
  // Assume you have two ERC-20 tokens from Day 1
  const tokenAAddress = "0x...your first ERC-20 address";
  const tokenBAddress = "0x...your second ERC-20 address";
  
  const SimpleSwap = await hre.ethers.getContractFactory("SimpleSwap");
  const swap = await SimpleSwap.deploy(tokenAAddress, tokenBAddress);
  await swap.deployed();
  
  console.log("SimpleSwap deployed to:", swap.address);
  console.log("Token A:", tokenAAddress);
  console.log("Token B:", tokenBAddress);
}

main().catch(console.error);
2.4 Testing the Contract
test/SimpleSwap.test.js

javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleSwap", function () {
  let tokenA, tokenB, swap, owner, user;
  
  beforeEach(async () => {
    // Deploy two mock ERC-20 tokens
    const ERC20 = await ethers.getContractFactory("MyToken"); // from Day 1
    tokenA = await ERC20.deploy("TokenA", "TA", 18, 1000000, 10000000);
    tokenB = await ERC20.deploy("TokenB", "TB", 18, 1000000, 10000000);
    await tokenA.deployed();
    await tokenB.deployed();
    
    const SimpleSwap = await ethers.getContractFactory("SimpleSwap");
    swap = await SimpleSwap.deploy(tokenA.address, tokenB.address);
    await swap.deployed();
    
    [owner, user] = await ethers.getSigners();
    
    // Give some tokens to user
    await tokenA.mint(user.address, 10000);
    await tokenB.mint(user.address, 10000);
  });
  
  it("Should add liquidity and update reserves", async () => {
    await tokenA.approve(swap.address, 1000);
    await tokenB.approve(swap.address, 2000);
    await swap.addLiquidity(1000, 2000);
    
    const reserves = await swap.getReserves();
    expect(reserves[0]).to.equal(1000);
    expect(reserves[1]).to.equal(2000);
  });
  
  it("Should swap A for B correctly", async () => {
    // Add liquidity
    await tokenA.approve(swap.address, 1000);
    await tokenB.approve(swap.address, 2000);
    await swap.addLiquidity(1000, 2000);
    
    // User approves and swaps 10 A
    await tokenA.connect(user).approve(swap.address, 10);
    await swap.connect(user).swapAforB(10);
    
    // Check user received ~19.8 B
    const userB = await tokenB.balanceOf(user.address);
    expect(userB).to.be.closeTo(ethers.utils.parseEther("9980.2"), ethers.utils.parseEther("1"));
  });
  
  it("Should calculate preview correctly", async () => {
    await tokenA.approve(swap.address, 1000);
    await tokenB.approve(swap.address, 2000);
    await swap.addLiquidity(1000, 2000);
    
    const amountOut = await swap.getSwapAmount(10, true);
    expect(amountOut).to.equal(19); // integer math: (2000*10)/(1000+10)=19.8 -> 19
  });
  
  it("Should revert if not enough liquidity", async () => {
    await tokenA.connect(user).approve(swap.address, 10000);
    await expect(swap.connect(user).swapAforB(10000)).to.be.revertedWith("No liquidity");
  });
});
Run tests:

bash
npx hardhat test
🧪 Part 3: Understanding Price Impact & Slippage
3.1 Price Impact Example
Pool: 100 ETH and 200,000 USDT

Trade size (ETH)	ETH left in pool	USDT received	Average price (USDT/ETH)	Price impact
1	99	~2,020	2,020	~1%
5	95	~9,524	1,905	~4.8%
10	90	~18,182	1,818	~9.1%
50	50	~66,667	1,333	~33%
Key takeaway: Large trades in low‑liquidity pools cause significant price deterioration.

3.2 Slippage Protection
In a real DEX (like Uniswap), you always specify a minAmountOut to protect against front‑running or sudden price moves.

Add to your contract (optional enhancement):

solidity
function swapAforB(uint256 amountAIn, uint256 minAmountBOut) external {
    uint256 amountBOut = getSwapOutput(...);
    require(amountBOut >= minAmountBOut, "Slippage too high");
    // ... rest
}
🌐 Part 4: Frontend Swap Interface
4.1 HTML Structure
frontend/index.html

html
<!DOCTYPE html>
<html>
<head>
    <title>My DEX - Swap Tokens</title>
    <style>
        body { font-family: Arial; max-width: 600px; margin: auto; padding: 20px; }
        .card { background: #f5f5f5; padding: 20px; border-radius: 12px; margin: 10px 0; }
        input, button { padding: 10px; margin: 5px; width: 100%; }
        button { background: #4CAF50; color: white; border: none; cursor: pointer; }
        .status { color: #666; }
    </style>
</head>
<body>
    <h1>🔄 SimpleSwap DEX</h1>
    <button id="connectBtn">Connect MetaMask</button>
    <div class="card">
        <h3>Pool Reserves</h3>
        <p>Token A: <span id="reserveA">-</span></p>
        <p>Token B: <span id="reserveB">-</span></p>
        <p>Price: 1 A = <span id="price">-</span> B</p>
    </div>
    <div class="card">
        <h3>Add Liquidity</h3>
        <input id="liqA" placeholder="Amount A" />
        <input id="liqB" placeholder="Amount B" />
        <button id="addLiqBtn">Add Liquidity</button>
    </div>
    <div class="card">
        <h3>Swap A → B</h3>
        <input id="swapAmountA" placeholder="Amount A" />
        <p>You will get ≈ <span id="previewAB">0</span> B</p>
        <button id="swapABtn">Swap A for B</button>
    </div>
    <div class="card">
        <h3>Swap B → A</h3>
        <input id="swapAmountB" placeholder="Amount B" />
        <p>You will get ≈ <span id="previewBA">0</span> A</p>
        <button id="swapBBtn">Swap B for A</button>
    </div>
    <div id="status" class="status"></div>
    
    <script src="https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js"></script>
    <script src="app.js"></script>
</body>
</html>
4.2 JavaScript Logic
frontend/app.js

javascript
// Replace with your deployed contract addresses
const TOKEN_A_ADDRESS = "0x...";
const TOKEN_B_ADDRESS = "0x...";
const SWAP_ADDRESS = "0x...";

// Minimal ERC-20 ABI (transfer, approve, balanceOf)
const ERC20_ABI = [
    "function approve(address spender, uint256 amount) public returns (bool)",
    "function balanceOf(address account) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)"
];

// Swap contract ABI
const SWAP_ABI = [
    "function addLiquidity(uint256 amountA, uint256 amountB) external",
    "function swapAforB(uint256 amountAIn) external",
    "function swapBforA(uint256 amountBIn) external",
    "function getSwapAmount(uint256 amountIn, bool aToB) view returns (uint256)",
    "function getReserves() view returns (uint256, uint256)",
    "function getPrice() view returns (uint256)"
];

let provider, signer, tokenA, tokenB, swap, userAddress;

async function init() {
    if (!window.ethereum) return alert("Install MetaMask");
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();
    
    tokenA = new ethers.Contract(TOKEN_A_ADDRESS, ERC20_ABI, signer);
    tokenB = new ethers.Contract(TOKEN_B_ADDRESS, ERC20_ABI, signer);
    swap = new ethers.Contract(SWAP_ADDRESS, SWAP_ABI, signer);
    
    document.getElementById("status").innerHTML = `Connected: ${userAddress.slice(0,6)}...`;
    updatePoolInfo();
}

async function updatePoolInfo() {
    if (!swap) return;
    const reserves = await swap.getReserves();
    const reserveA = ethers.utils.formatEther(reserves[0]);
    const reserveB = ethers.utils.formatEther(reserves[1]);
    document.getElementById("reserveA").innerHTML = reserveA;
    document.getElementById("reserveB").innerHTML = reserveB;
    
    const price = await swap.getPrice();
    document.getElementById("price").innerHTML = ethers.utils.formatEther(price);
}

async function addLiquidity() {
    const amountA = ethers.utils.parseEther(document.getElementById("liqA").value);
    const amountB = ethers.utils.parseEther(document.getElementById("liqB").value);
    
    await tokenA.approve(SWAP_ADDRESS, amountA);
    await tokenB.approve(SWAP_ADDRESS, amountB);
    const tx = await swap.addLiquidity(amountA, amountB);
    await tx.wait();
    alert("Liquidity added!");
    updatePoolInfo();
}

async function previewSwap(amount, aToB) {
    if (!swap || amount === "0") return "0";
    const amountWei = ethers.utils.parseEther(amount);
    const out = await swap.getSwapAmount(amountWei, aToB);
    return ethers.utils.formatEther(out);
}

async function swapAtoB() {
    const amount = document.getElementById("swapAmountA").value;
    const amountWei = ethers.utils.parseEther(amount);
    await tokenA.approve(SWAP_ADDRESS, amountWei);
    const tx = await swap.swapAforB(amountWei);
    document.getElementById("status").innerHTML = "Swapping...";
    await tx.wait();
    document.getElementById("status").innerHTML = "Swap complete!";
    updatePoolInfo();
}

async function swapBtoA() {
    const amount = document.getElementById("swapAmountB").value;
    const amountWei = ethers.utils.parseEther(amount);
    await tokenB.approve(SWAP_ADDRESS, amountWei);
    const tx = await swap.swapBforA(amountWei);
    await tx.wait();
    updatePoolInfo();
}

// Event listeners
document.getElementById("connectBtn").onclick = init;
document.getElementById("addLiqBtn").onclick = addLiquidity;
document.getElementById("swapABtn").onclick = swapAtoB;
document.getElementById("swapBBtn").onclick = swapBtoA;

document.getElementById("swapAmountA").oninput = async (e) => {
    const preview = await previewSwap(e.target.value, true);
    document.getElementById("previewAB").innerHTML = preview;
};
document.getElementById("swapAmountB").oninput = async (e) => {
    const preview = await previewSwap(e.target.value, false);
    document.getElementById("previewBA").innerHTML = preview;
};

📘 DAY 4 – DeFi Advanced: Staking, Yield Farming & Lending
Author: [Your Name]
Prerequisites: Day 3 (DEX basics)

Now that you understand swaps and liquidity pools, Day 4 moves into passive income primitives: staking tokens to earn rewards, yield farming (LP staking), and a simple lending pool. You will build contracts that let users deposit assets and earn yield.

🎯 Learning Objectives (Day 4)
By the end of Day 4, I will be able to:

Build a staking contract where users lock tokens and earn rewards

Implement a yield farming contract that rewards LP token holders

Create a lending pool with deposits, withdrawals, and interest accrual

Understand key DeFi primitives: staking, farming, lending

Write tests for reward distribution and edge cases

📖 Part 1: Staking Contracts (Single Asset)
1.1 What is Staking?
Users lock their tokens in a contract to earn rewards (usually in a different token). Rewards are distributed proportionally to the amount staked and time.

Use cases:

Securing Proof‑of‑Stake networks (like Ethereum)

Earning yield on governance tokens

Boosting voting power

1.2 Simple Staking Contract
contracts/Staking.sol

solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Staking is Ownable, ReentrancyGuard {
    IERC20 public stakingToken;
    IERC20 public rewardToken;
    
    uint256 public rewardRate;        // rewards per second per token staked (scaled)
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;
    
    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public balanceOf;
    
    uint256 private _totalSupply;
    
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    
    constructor(address _stakingToken, address _rewardToken) {
        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);
    }
    
    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }
    
    function rewardPerToken() public view returns (uint256) {
        if (_totalSupply == 0) return rewardPerTokenStored;
        return rewardPerTokenStored + (rewardRate * (block.timestamp - lastUpdateTime) * 1e18) / _totalSupply;
    }
    
    function earned(address account) public view returns (uint256) {
        return ((balanceOf[account] * (rewardPerToken() - userRewardPerTokenPaid[account])) / 1e18) + rewards[account];
    }
    
    function stake(uint256 amount) external nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");
        balanceOf[msg.sender] += amount;
        _totalSupply += amount;
        stakingToken.transferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount);
    }
    
    function withdraw(uint256 amount) public nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot withdraw 0");
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        _totalSupply -= amount;
        stakingToken.transfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }
    
    function getReward() public nonReentrant updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardToken.transfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }
    
    // Owner: fund the contract with reward tokens and set reward rate (per second)
    function setRewardRate(uint256 _rewardRate) external onlyOwner {
        rewardRate = _rewardRate;
        lastUpdateTime = block.timestamp;
    }
    
    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }
}
1.3 How Reward Calculation Works
rewardPerToken() tracks cumulative rewards per staked token (scaled by 1e18).

Each user earns proportionally to their stake and time.

Rewards are distributed when getReward() is called.

Test example:
If rewardRate = 100 (tokens per second) and total staked = 1000 tokens, each token earns 0.1 reward tokens per second.

📖 Part 2: Yield Farming (LP Token Staking)
Yield farming = staking liquidity provider (LP) tokens from a DEX to earn additional rewards.

2.1 LP Token Recap
When you add liquidity to a DEX (Day 3), you receive LP tokens that represent your share of the pool. These LP tokens can be staked elsewhere to earn extra yield.

2.2 Farming Contract
contracts/LPStaking.sol (simplified version, similar to above but stakes LP tokens)

solidity
// Same as Staking.sol but with:
// - stakingToken is an LP token (from Uniswap or your SimpleSwap)
// - RewardToken is a governance token (e.g., your Day 1 ERC-20)
You can reuse the same staking logic – just deploy it with the LP token address as the staking token.

📖 Part 3: Lending Pool (Borrowing & Lending)
3.1 How Lending Pools Work
Suppliers deposit tokens and earn interest.

Borrowers deposit collateral and borrow tokens, paying interest.

Interest rates adjust algorithmically based on pool utilisation.

3.2 Simple Lending Pool (Deposit-only + Interest)
contracts/LendingPool.sol

solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract LendingPool is Ownable, ReentrancyGuard {
    IERC20 public asset;
    
    uint256 public totalDeposits;
    uint256 public interestRatePerSecond = 1e11; // 0.000001% per sec (~3.15% APR)
    uint256 public lastUpdateTime;
    uint256 public accruedInterest;
    
    mapping(address => uint256) public depositAmount;
    mapping(address => uint256) public lastClaimTime;
    
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event InterestClaimed(address indexed user, uint256 interest);
    
    constructor(address _asset) {
        asset = IERC20(_asset);
        lastUpdateTime = block.timestamp;
    }
    
    function updatePool() internal {
        uint256 timePassed = block.timestamp - lastUpdateTime;
        if (timePassed > 0 && totalDeposits > 0) {
            uint256 interest = (totalDeposits * interestRatePerSecond * timePassed) / 1e18;
            accruedInterest += interest;
        }
        lastUpdateTime = block.timestamp;
    }
    
    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot deposit 0");
        updatePool();
        
        asset.transferFrom(msg.sender, address(this), amount);
        depositAmount[msg.sender] += amount;
        totalDeposits += amount;
        
        emit Deposited(msg.sender, amount);
    }
    
    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0 && depositAmount[msg.sender] >= amount, "Invalid amount");
        updatePool();
        
        depositAmount[msg.sender] -= amount;
        totalDeposits -= amount;
        asset.transfer(msg.sender, amount);
        
        emit Withdrawn(msg.sender, amount);
    }
    
    function claimInterest() external nonReentrant {
        updatePool();
        uint256 userShare = (depositAmount[msg.sender] * accruedInterest) / totalDeposits;
        require(userShare > 0, "No interest");
        
        accruedInterest -= userShare;
        asset.transfer(msg.sender, userShare);
        emit InterestClaimed(msg.sender, userShare);
    }
    
    function getCurrentInterest(address user) external view returns (uint256) {
        // Simplified - in practice you'd calculate pending interest since lastUpdate
        return 0;
    }
}
Note: A full lending pool requires collateralisation, liquidation, and borrowing – this simplified version focuses on depositing to earn yield.

🧪 Part 4: Activities for Day 4
Activity 1: Deploy & Test Staking
Deploy two ERC-20 tokens (staking token & reward token)

Deploy Staking contract

Fund staking contract with reward tokens (transfer from owner)

Set reward rate (e.g., 100 tokens per second)

Users stake and claim rewards

Activity 2: Yield Farming with LP Tokens
Create a liquidity pool using Day 3's SimpleSwap (add liquidity to get LP tokens)

Deploy LPStaking using the LP token address

Stake LP tokens and earn reward tokens

Activity 3: Lending Pool
Deploy LendingPool with a stablecoin or your ERC-20

Deposit tokens from two different accounts

Wait a few minutes (or simulate time with evm_increaseTime in tests)

Claim interest for each user