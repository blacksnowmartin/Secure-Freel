import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🚀 Starting FreelanceEscrow contract deployment...\n");

  // Get the contract factory
  const FreelanceEscrow = await ethers.getContractFactory("FreelanceEscrow");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Set treasury address (use deployer as treasury for testing)
  const treasuryAddress = process.env.TREASURY_ADDRESS || deployer.address;
  console.log("Treasury address:", treasuryAddress);

  // Deploy the contract
  const contract = await FreelanceEscrow.deploy(treasuryAddress);
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("\n✅ FreelanceEscrow deployed to:", contractAddress);

  // Save deployment info
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId,
    contractAddress: contractAddress,
    treasuryAddress: treasuryAddress,
    deployerAddress: deployer.address,
    deploymentBlock: (await ethers.provider.getBlockNumber()),
    timestamp: new Date().toISOString(),
  };

  // Save to file
  const deploymentPath = path.join(__dirname, "../deployments.json");
  let deployments: any = {};

  if (fs.existsSync(deploymentPath)) {
    deployments = JSON.parse(fs.readFileSync(deploymentPath, "utf-8"));
  }

  const networkName = deploymentInfo.network;
  deployments[networkName] = deploymentInfo;

  fs.writeFileSync(deploymentPath, JSON.stringify(deployments, null, 2));
  console.log("\n📝 Deployment info saved to deployments.json");

  // Verify contract
  console.log("\n📜 Contract Details:");
  console.log("- Platform fee: 200 basis points (2%)");
  console.log("- Treasury address:", treasuryAddress);
  console.log("- Owner:", deployer.address);

  console.log("\n✨ Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
