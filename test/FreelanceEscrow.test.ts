import { expect } from "chai";
import { ethers } from "hardhat";
import { FreelanceEscrow } from "../typechain-types";
import { parseEther, ZeroAddress } from "ethers";

describe("FreelanceEscrow", function () {
  let escrow: FreelanceEscrow;
  let client: any;
  let freelancer: any;
  let treasury: any;
  let otherUser: any;

  beforeEach(async function () {
    [client, freelancer, treasury, otherUser] = await ethers.getSigners();

    const FreelanceEscrow = await ethers.getContractFactory("FreelanceEscrow");
    escrow = await FreelanceEscrow.deploy(treasury.address);
    await escrow.waitForDeployment();
  });

  describe("Project Creation", function () {
    it("Should create a project successfully", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
      const tx = await escrow.connect(client).createProject(
        "Test Project",
        parseEther("1.0"),
        ZeroAddress,
        deadline
      );

      await expect(tx).to.emit(escrow, "ProjectCreated");

      const totalProjects = await escrow.getTotalProjects();
      expect(totalProjects).to.equal(1);
    });

    it("Should reject invalid deadline", async function () {
      const pastDeadline = Math.floor(Date.now() / 1000) - 1000;
      await expect(
        escrow.connect(client).createProject(
          "Test Project",
          parseEther("1.0"),
          ZeroAddress,
          pastDeadline
        )
      ).to.be.revertedWith("Deadline must be in the future");
    });
  });

  describe("Project Funding", function () {
    beforeEach(async function () {
      const deadline = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
      await escrow.connect(client).createProject(
        "Test Project",
        parseEther("1.0"),
        ZeroAddress,
        deadline
      );

      await escrow.connect(freelancer).acceptProject(0);
    });

    it("Should fund a project with ETH", async function () {
      const tx = await escrow.connect(client).fundProject(0, {
        value: parseEther("1.0"),
      });

      await expect(tx).to.emit(escrow, "ProjectFunded");

      const project = await escrow.getProject(0);
      expect(project.status).to.equal(1); // Funded
    });

    it("Should reject if wrong ETH amount", async function () {
      await expect(
        escrow.connect(client).fundProject(0, {
          value: parseEther("0.5"),
        })
      ).to.be.revertedWith("Incorrect ETH amount");
    });
  });

  describe("Project Workflow", function () {
    beforeEach(async function () {
      const deadline = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
      await escrow.connect(client).createProject(
        "Web3 Development",
        parseEther("2.0"),
        ZeroAddress,
        deadline
      );

      await escrow.connect(freelancer).acceptProject(0);
      await escrow.connect(client).fundProject(0, {
        value: parseEther("2.0"),
      });
    });

    it("Should complete full workflow", async function () {
      // Start work
      let tx = await escrow.connect(freelancer).startWork(0);
      await expect(tx).to.emit(escrow, "ProjectStarted");

      let project = await escrow.getProject(0);
      expect(project.status).to.equal(2); // InProgress

      // Submit work
      tx = await escrow.connect(freelancer).submitWork(0, "QmXxxx");
      await expect(tx).to.emit(escrow, "WorkSubmitted");

      project = await escrow.getProject(0);
      expect(project.status).to.equal(3); // UnderReview

      // Approve completion
      tx = await escrow.connect(client).approveCompletion(0);
      await expect(tx).to.emit(escrow, "ProjectCompleted");

      project = await escrow.getProject(0);
      expect(project.status).to.equal(4); // Completed
    });

    it("Should update reputation on completion", async function () {
      await escrow.connect(freelancer).startWork(0);
      await escrow.connect(freelancer).submitWork(0, "QmXxxx");
      await escrow.connect(client).approveCompletion(0);

      const reputation = await escrow.getReputation(freelancer.address);
      expect(reputation.completedProjects).to.equal(1);
      expect(reputation.karma).to.equal(100);
    });

    it("Should deduct platform fee on completion", async function () {
      const balanceBefore = await ethers.provider.getBalance(treasury.address);

      await escrow.connect(freelancer).startWork(0);
      await escrow.connect(freelancer).submitWork(0, "QmXxxx");
      await escrow.connect(client).approveCompletion(0);

      const balanceAfter = await ethers.provider.getBalance(treasury.address);
      const feeCollected = balanceAfter - balanceBefore;

      // 2% of 2.0 ETH = 0.04 ETH
      expect(feeCollected).to.equal(parseEther("0.04"));
    });
  });

  describe("Reputation System", function () {
    it("Should track user reputation correctly", async function () {
      let reputation = await escrow.getReputation(freelancer.address);
      expect(reputation.completedProjects).to.equal(0);
      expect(reputation.karma).to.equal(0);
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to change platform fee", async function () {
      await escrow.setPlatformFee(300); // 3%
      const platformFee = await escrow.platformFeePercentage();
      expect(platformFee).to.equal(300);
    });

    it("Should reject fee above max", async function () {
      await expect(escrow.setPlatformFee(1500)).to.be.revertedWith(
        "Fee cannot exceed 10%"
      );
    });

    it("Should allow owner to change treasury address", async function () {
      await escrow.setTreasuryAddress(otherUser.address);
      const newTreasury = await escrow.treasuryAddress();
      expect(newTreasury).to.equal(otherUser.address);
    });
  });
});
