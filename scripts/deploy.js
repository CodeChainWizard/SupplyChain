const { ethers } = require("hardhat");

// scripts/deploy.js
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Example: Deploying a contract (change with your contract)
  const Contract = await ethers.getContractFactory("SupplyChain");
  const contract = await Contract.deploy();

  console.log("Contract deployed to address:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
