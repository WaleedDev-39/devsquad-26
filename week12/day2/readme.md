📖 Part 1: Fundamentals – NFTs vs Fungible Tokens
1.1 Core Differences
Aspect	ERC‑20 (Fungible)	ERC‑721 (Non‑Fungible)
Uniqueness	All tokens identical	Each token unique (by tokenId)
Divisibility	Yes (0.5 USDT possible)	No (whole units only)
Exchange	1:1 same value	Different values per token
Use Case	Currency, utility tokens	Collectibles, ownership proofs
Example	USDT, UNI, DAI	CryptoPunks, BAYC, gaming items
1.2 Why NFTs Matter
Prove digital ownership and authenticity

Enable digital scarcity without central authority

Represent real‑world assets (real estate, deeds, luxury goods)

Creator royalties – earn forever on secondary sales

1.3 Reflection Questions (for mentor discussion)
An NFT contract has a balanceOf(address owner) function. What does this balance represent if each token is unique?

How does the setApprovalForAll function differ from the single approve in ERC‑20?

Why is IPFS preferred over storing images directly on‑chain for most NFT projects?

✍️ Write your answers here before reviewing with mentor.

🔧 Part 2: Hands‑On Implementation – Basic ERC‑721
2.1 Project Setup
bash
mkdir my-nft-project && cd my-nft-project
npm init -y
npm install --save-dev hardhat @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers
npm install @openzeppelin/contracts
npx hardhat
Create folder structure:

text
my-nft-project/
├── contracts/
│   └── MyNFT.sol
├── scripts/
│   ├── deploy.js
│   └── mint.js
├── test/
│   └── MyNFT.test.js
├── frontend/
│   ├── index.html
│   └── app.js
├── ipfs/
│   ├── images/
│   └── metadata/
├── hardhat.config.js
└── package.json
2.2 Smart Contract – Using OpenZeppelin
contracts/MyNFT.sol

solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MyNFT is ERC721Enumerable, Ownable, Pausable {
    using Strings for uint256;
    
    uint256 public constant MAX_SUPPLY = 10_000;
    uint256 public mintPrice = 0.05 ether;
    uint256 public maxMintPerTx = 10;
    
    string public baseURI;
    string public notRevealedURI;
    bool public revealed = false;
    
    // Whitelist
    mapping(address => bool) public whitelist;
    uint256 public whitelistMintPrice = 0.03 ether;
    
    constructor(
        string memory _name,
        string memory _symbol,
        string memory _initBaseURI,
        string memory _initNotRevealedURI
    ) ERC721(_name, _symbol) {
        baseURI = _initBaseURI;
        notRevealedURI = _initNotRevealedURI;
    }
    
    // ========== Minting ==========
    function mint(uint256 _mintAmount) public payable {
        uint256 supply = totalSupply();
        require(_mintAmount > 0 && _mintAmount <= maxMintPerTx, "Invalid amount");
        require(supply + _mintAmount <= MAX_SUPPLY, "Sold out");
        
        if (whitelist[msg.sender]) {
            require(msg.value >= whitelistMintPrice * _mintAmount, "Insufficient WL payment");
        } else {
            require(msg.value >= mintPrice * _mintAmount, "Insufficient payment");
        }
        
        for (uint256 i = 0; i < _mintAmount; i++) {
            _safeMint(msg.sender, supply + i);
        }
    }
    
    // ========== Admin ==========
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }
    
    function setNotRevealedURI(string memory _notRevealedURI) public onlyOwner {
        notRevealedURI = _notRevealedURI;
    }
    
    function reveal() public onlyOwner {
        revealed = true;
    }
    
    function addToWhitelist(address[] calldata _addresses) public onlyOwner {
        for (uint256 i = 0; i < _addresses.length; i++) {
            whitelist[_addresses[i]] = true;
        }
    }
    
    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    // ========== Metadata ==========
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        
        if (!revealed) {
            return notRevealedURI;
        }
        
        return string(abi.encodePacked(baseURI, tokenId.toString(), ".json"));
    }
    
    // ========== Overrides ==========
    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        whenNotPaused
        override(ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
2.3 Deployment Script
scripts/deploy.js

javascript
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const MyNFT = await hre.ethers.getContractFactory("MyNFT");
  const nft = await MyNFT.deploy(
    "My Awesome NFT",
    "MANFT",
    "ipfs://QmHiddenBase/",      // placeholder baseURI before reveal
    "ipfs://QmHiddenReveal/placeholder.json"  // notRevealedURI
  );
  
  await nft.deployed();
  console.log("NFT contract deployed to:", nft.address);
}

main().catch(console.error);
Deploy to Sepolia:

bash
npx hardhat run scripts/deploy.js --network sepolia
2.4 Test Suite
test/MyNFT.test.js

javascript
const { expect } = require("chai");

describe("MyNFT", function () {
  let nft, owner, addr1, addr2;
  
  beforeEach(async () => {
    const MyNFT = await ethers.getContractFactory("MyNFT");
    [owner, addr1, addr2] = await ethers.getSigners();
    nft = await MyNFT.deploy("TestNFT", "TNFT", "ipfs://base/", "ipfs://hidden/");
    await nft.deployed();
  });
  
  it("Should mint an NFT to the caller", async () => {
    await nft.connect(addr1).mint(1, { value: ethers.utils.parseEther("0.05") });
    expect(await nft.balanceOf(addr1.address)).to.equal(1);
    expect(await nft.ownerOf(0)).to.equal(addr1.address);
  });
  
  it("Should enforce max supply", async () => {
    // Mint max supply
    for (let i = 0; i < 10000; i+=10) {
      await nft.mint(10, { value: ethers.utils.parseEther("0.5") });
    }
    await expect(nft.mint(1, { value: ethers.utils.parseEther("0.05") }))
      .to.be.revertedWith("Sold out");
  });
  
  it("Should apply whitelist discount", async () => {
    await nft.addToWhitelist([addr1.address]);
    await nft.connect(addr1).mint(1, { value: ethers.utils.parseEther("0.03") });
    expect(await nft.balanceOf(addr1.address)).to.equal(1);
  });
  
  it("Should reveal metadata only after reveal()", async () => {
    const tokenId = 0;
    await nft.connect(addr1).mint(1, { value: ethers.utils.parseEther("0.05") });
    let uri = await nft.tokenURI(tokenId);
    expect(uri).to.equal("ipfs://hidden/");
    
    await nft.reveal();
    uri = await nft.tokenURI(tokenId);
    expect(uri).to.include("ipfs://base/0.json");
  });
});
Run tests:

bash
npx hardhat test
🗂️ Part 3: IPFS & Metadata Preparation
3.1 Upload Images & Create Metadata
Folder structure for 10 NFTs:

text
ipfs/
├── images/
│   ├── 1.png
│   ├── 2.png
│   └── ... (up to 10)
└── metadata/
    ├── 1.json
    ├── 2.json
    └── ...
Example metadata 1.json:

json
{
  "name": "My Awesome NFT #1",
  "description": "Part of my internship NFT collection",
  "image": "ipfs://QmYourImageHash/image1.png",
  "attributes": [
    { "trait_type": "Background", "value": "Blue" },
    { "trait_type": "Rarity", "value": "Common" },
    { "trait_type": "Power", "value": 42 }
  ]
}
3.2 Upload to Pinata
Create free account at pinata.cloud

Upload images/ folder → Copy the root CID (e.g., QmXyz...)

Update each JSON file's image field: "image": "ipfs://QmXyz.../1.png"

Upload metadata/ folder → Copy its root CID (e.g., QmAbc...)

Your baseURI will be: ipfs://QmAbc.../ (trailing slash required)

3.3 Set Metadata in Contract
After deployment, call:

javascript
await nft.setBaseURI("ipfs://QmAbc.../");
await nft.setNotRevealedURI("ipfs://QmPlaceholder/placeholder.json");
When ready to reveal:

javascript
await nft.reveal();
✅ Deliverable: Provide the IPFS folder CIDs and the final revealed metadata link.

🌐 Part 4: Frontend Minting DApp
4.1 HTML Interface
frontend/index.html

html
<!DOCTYPE html>
<html>
<head>
    <title>My NFT Minting DApp</title>
    <style>
        body { font-family: Arial; text-align: center; margin-top: 50px; }
        button { padding: 10px 20px; font-size: 16px; margin: 10px; }
        #status { margin-top: 20px; font-weight: bold; }
        #gallery img { width: 150px; margin: 5px; border-radius: 8px; }
    </style>
</head>
<body>
    <h1>🖼️ My Awesome NFT Collection</h1>
    <p>Mint Price: 0.05 ETH | Max per tx: 10</p>
    <button id="connectBtn">Connect MetaMask</button>
    <div>
        <input id="mintAmount" type="number" min="1" max="10" value="1" />
        <button id="mintBtn">Mint NFT(s)</button>
    </div>
    <div id="status"></div>
    <h3>Your NFT Gallery</h3>
    <div id="gallery"></div>
    
    <script src="https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js"></script>
    <script src="app.js"></script>
</body>
</html>
4.2 JavaScript Logic
frontend/app.js

javascript
const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
const ABI = [ /* Paste your contract ABI from artifacts/MyNFT.json */ ];

let provider, signer, contract, userAddress;

document.getElementById("connectBtn").onclick = async () => {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        userAddress = await signer.getAddress();
        document.getElementById("status").innerHTML = `Connected: ${userAddress.substring(0,6)}...`;
        loadUserNFTs();
    } else {
        alert("Please install MetaMask");
    }
};

document.getElementById("mintBtn").onclick = async () => {
    const amount = document.getElementById("mintAmount").value;
    const mintPrice = await contract.mintPrice();
    const totalCost = mintPrice.mul(amount);
    
    const tx = await contract.mint(amount, { value: totalCost });
    document.getElementById("status").innerHTML = "Minting... wait for confirmation";
    await tx.wait();
    document.getElementById("status").innerHTML = "Minted!";
    loadUserNFTs();
};

async function loadUserNFTs() {
    if (!contract) return;
    const balance = await contract.balanceOf(userAddress);
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";
    
    for (let i = 0; i < balance; i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(userAddress, i);
        const uri = await contract.tokenURI(tokenId);
        // Convert IPFS URI to gateway
        const httpUri = uri.replace("ipfs://", "https://ipfs.io/ipfs/");
        const response = await fetch(httpUri);
        const metadata = await response.json();
        const imgUrl = metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/");
        gallery.innerHTML += `<img src="${imgUrl}" title="${metadata.name}" />`;
    }
}
🔒 Part 5: Security & Gas Optimisation for NFTs
5.1 Common Vulnerabilities
Issue	Example	Mitigation
Reentrancy in withdrawal	External call before balance update	Use Checks-Effects-Interactions
Front-running mint	Attacker observes high‑demand mint and pays higher gas	Commit‑reveal or private mempool
Missing supply limit	Infinite minting	require(totalSupply() <= MAX_SUPPLY)
Royalty hardcoding	Royalty receiver is fixed address	Use owner() or configurable splitter
On-chain randomness for reveals	Use blockhash which can be manipulated	Chainlink VRF
5.2 Gas Optimisation Tips
Use ERC721Enumerable only if you need tokenOfOwnerByIndex (expensive)

Batch minting (mint multiple in one loop) saves gas per token

Pack variables: uint96 for supply counters (fits with address)

Use unchecked blocks inside loops when overflow impossible

🧪 Part 6: Activities & Deliverables
Activity 1: Create a Mini Collection (1 hour)
Design 5 unique images (any tool – Canva, Photoshop, or AI)

Write metadata JSON files for each

Upload to Pinata (images + metadata)

Deploy contract with MAX_SUPPLY = 5

Mint all 5 NFTs to your wallet

Activity 2: Minting DApp (1.5 hours)
HTML/JS frontend connects to MetaMask

Displays mint price and remaining supply

Allows minting 1–10 NFTs

Shows transaction status and updates gallery automatically

Deliverable: Short Loom video demonstrating minting.

Activity 3: Advanced Features (optional, but encouraged)
Add whitelist (hardhat task to add addresses)

Implement EIP‑2981 royalties (2.5%)

Create a reveal mechanism (set revealed=false first, then change after mint)

Deliverable: Link to a tx that reveals metadata on testnet.

✅ Final Deliverables for Mentor
Upon completing Day 2, I am submitting:

GitHub Repository containing:

Full ERC‑721 contract (MyNFT.sol)

Deployment & minting scripts

Test suite (minimum 4 tests)

Frontend DApp (HTML/JS)

Testnet Deployment:

Contract address on Sepolia

Etherscan verification link (optional but recommended)

OpenSea testnet collection link

Live Demo:

Minting from DApp

Viewing minted NFTs in gallery

(Optional) reveal before/after

Learning Reflections (written):

Answers to Part 1 reflection questions

One security issue I learned to avoid

One gas optimisation I applied

How IPFS ensures metadata immutability

📚 Resources I Used Today
EIP‑721 Standard

OpenZeppelin ERC‑721 docs

Pinata IPFS upload guide

OpenSea testnet

NFT School

Tools:

Remix IDE

IPFS Gateway Checker

EIP‑2981 Royalty Calculator