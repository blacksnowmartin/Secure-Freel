// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FreelanceEscrow
 * @dev Escrow system for freelance projects with reputation, dispute resolution, and platform fees
 */
contract FreelanceEscrow is ReentrancyGuard, Ownable {
    // ============ Enums ============
    enum ProjectStatus {
        Open,           // 0 - Project created, waiting for freelancer to accept
        Funded,         // 1 - Client has funded the project
        InProgress,     // 2 - Freelancer is working on the project
        UnderReview,    // 3 - Work submitted for review
        Completed,      // 4 - Project completed successfully
        Disputed,       // 5 - Project under dispute
        Cancelled       // 6 - Project cancelled
    }

    enum DisputeStatus {
        None,           // 0 - No dispute
        Initiated,      // 1 - Dispute has been initiated
        Resolved        // 2 - Dispute has been resolved
    }

    // ============ Structs ============
    struct Project {
        uint256 projectId;
        address client;
        address freelancer;
        string title;
        uint256 amount;
        address paymentToken;           // address(0) for ETH, ERC20 address for tokens
        uint256 deadline;
        ProjectStatus status;
        uint256 createdAt;
        uint256 completedAt;
        DisputeStatus disputeStatus;
        string deliverableURI;          // IPFS hash or link to work submission
    }

    struct UserReputation {
        uint256 completedProjects;
        uint256 totalEarnings;
        uint256 karma;                  // Reputation score
        uint256 totalDisputes;
        uint256 successRate;            // Percentage: 0-10000 (100.00%)
    }

    // ============ State Variables ============
    mapping(uint256 => Project) public projects;
    mapping(address => UserReputation) public userReputations;
    mapping(address => uint256[]) public userProjects;       // Projects where user is involved
    mapping(uint256 => mapping(address => bool)) public projectApprovals; // For dispute resolution

    uint256 public projectCounter = 0;
    uint256 public platformFeePercentage = 200;             // 2% = 200 basis points
    address public treasuryAddress;
    uint256 public totalFeesCollected;

    // ============ Events ============
    event ProjectCreated(
        uint256 indexed projectId,
        address indexed client,
        string title,
        uint256 amount,
        address paymentToken
    );

    event ProjectFunded(
        uint256 indexed projectId,
        address indexed client,
        uint256 amount
    );

    event ProjectAccepted(
        uint256 indexed projectId,
        address indexed freelancer
    );

    event ProjectStarted(uint256 indexed projectId);

    event WorkSubmitted(
        uint256 indexed projectId,
        address indexed freelancer,
        string deliverableURI
    );

    event ProjectCompleted(
        uint256 indexed projectId,
        address indexed freelancer,
        uint256 paymentAmount
    );

    event DisputeInitiated(
        uint256 indexed projectId,
        address indexed initiator,
        string reason
    );

    event DisputeResolved(
        uint256 indexed projectId,
        address indexed winner,
        string resolution
    );

    event ReputationUpdated(
        address indexed user,
        uint256 completedProjects,
        uint256 karma
    );

    // ============ Modifiers ============
    modifier projectExists(uint256 _projectId) {
        require(_projectId < projectCounter, "Project does not exist");
        _;
    }

    modifier onlyProjectParticipant(uint256 _projectId) {
        Project storage project = projects[_projectId];
        require(
            msg.sender == project.client || msg.sender == project.freelancer,
            "Not a project participant"
        );
        _;
    }

    modifier onlyClient(uint256 _projectId) {
        require(msg.sender == projects[_projectId].client, "Only client can call this");
        _;
    }

    modifier onlyFreelancer(uint256 _projectId) {
        require(msg.sender == projects[_projectId].freelancer, "Only freelancer can call this");
        _;
    }

    // ============ Constructor ============
    constructor(address _treasury) Ownable(msg.sender) {
        treasuryAddress = _treasury;
    }

    // ============ Client Functions ============
    /**
     * @dev Create a new project
     * @param _title Project title
     * @param _amount Amount to be escrowed
     * @param _paymentToken Token address (address(0) for ETH)
     * @param _deadline Project deadline (unix timestamp)
     */
    function createProject(
        string memory _title,
        uint256 _amount,
        address _paymentToken,
        uint256 _deadline
    ) external returns (uint256) {
        require(_amount > 0, "Amount must be greater than 0");
        require(_deadline > block.timestamp, "Deadline must be in the future");

        uint256 projectId = projectCounter;
        projectCounter++;

        Project storage newProject = projects[projectId];
        newProject.projectId = projectId;
        newProject.client = msg.sender;
        newProject.title = _title;
        newProject.amount = _amount;
        newProject.paymentToken = _paymentToken;
        newProject.deadline = _deadline;
        newProject.status = ProjectStatus.Open;
        newProject.createdAt = block.timestamp;
        newProject.disputeStatus = DisputeStatus.None;

        userProjects[msg.sender].push(projectId);

        emit ProjectCreated(projectId, msg.sender, _title, _amount, _paymentToken);

        return projectId;
    }

    /**
     * @dev Client funds a project (locks funds in escrow)
     * @param _projectId Project ID
     */
    function fundProject(uint256 _projectId)
        external
        payable
        projectExists(_projectId)
        onlyClient(_projectId)
        nonReentrant
    {
        Project storage project = projects[_projectId];
        require(project.status == ProjectStatus.Open, "Project is not open for funding");
        require(project.freelancer != address(0), "Freelancer not assigned yet");

        if (project.paymentToken == address(0)) {
            // ETH payment
            require(msg.value == project.amount, "Incorrect ETH amount");
        } else {
            // ERC20 payment
            require(msg.value == 0, "ETH not expected for ERC20 payment");
            IERC20(project.paymentToken).transferFrom(
                msg.sender,
                address(this),
                project.amount
            );
        }

        project.status = ProjectStatus.Funded;
        emit ProjectFunded(_projectId, msg.sender, project.amount);
    }

    /**
     * @dev Approve project completion (by client)
     * @param _projectId Project ID
     */
    function approveCompletion(uint256 _projectId)
        external
        projectExists(_projectId)
        onlyClient(_projectId)
        nonReentrant
    {
        Project storage project = projects[_projectId];
        require(
            project.status == ProjectStatus.UnderReview,
            "Project is not under review"
        );
        require(project.disputeStatus == DisputeStatus.None, "Project is under dispute");

        _completeProject(_projectId);
    }

    /**
     * @dev Initiate a dispute on a project
     * @param _projectId Project ID
     * @param _reason Reason for dispute
     */
    function initiateDispute(uint256 _projectId, string memory _reason)
        external
        projectExists(_projectId)
        onlyProjectParticipant(_projectId)
    {
        Project storage project = projects[_projectId];
        require(
            project.status == ProjectStatus.UnderReview ||
            project.status == ProjectStatus.InProgress,
            "Cannot dispute at this stage"
        );
        require(project.disputeStatus == DisputeStatus.None, "Dispute already initiated");

        project.disputeStatus = DisputeStatus.Initiated;
        project.status = ProjectStatus.Disputed;

        emit DisputeInitiated(_projectId, msg.sender, _reason);
    }

    /**
     * @dev Resolve a dispute (only owner/moderator can call)
     * @param _projectId Project ID
     * @param _winner Address of the winner of the dispute
     * @param _resolution Description of resolution
     */
    function resolveDispute(
        uint256 _projectId,
        address _winner,
        string memory _resolution
    ) external onlyOwner projectExists(_projectId) nonReentrant {
        Project storage project = projects[_projectId];
        require(project.disputeStatus == DisputeStatus.Initiated, "No active dispute");

        project.disputeStatus = DisputeStatus.Resolved;

        if (_winner == project.freelancer) {
            // Freelancer wins - release funds
            _completeProject(_projectId);
        } else if (_winner == project.client) {
            // Client wins - return funds
            project.status = ProjectStatus.Cancelled;
            _refundClient(_projectId);
            // Reduce reputation for freelancer
            userReputations[project.freelancer].totalDisputes++;
            userReputations[project.freelancer].karma = userReputations[project.freelancer].karma > 50
                ? userReputations[project.freelancer].karma - 50
                : 0;
        }

        emit DisputeResolved(_projectId, _winner, _resolution);
    }

    // ============ Freelancer Functions ============
    /**
     * @dev Accept a project as freelancer
     * @param _projectId Project ID
     */
    function acceptProject(uint256 _projectId)
        external
        projectExists(_projectId)
    {
        Project storage project = projects[_projectId];
        require(project.status == ProjectStatus.Open, "Project is not open");
        require(project.freelancer == address(0), "Freelancer already assigned");

        project.freelancer = msg.sender;
        userProjects[msg.sender].push(_projectId);

        emit ProjectAccepted(_projectId, msg.sender);
    }

    /**
     * @dev Start work on a project (transition from Funded to InProgress)
     * @param _projectId Project ID
     */
    function startWork(uint256 _projectId)
        external
        projectExists(_projectId)
        onlyFreelancer(_projectId)
    {
        Project storage project = projects[_projectId];
        require(project.status == ProjectStatus.Funded, "Project not funded yet");

        project.status = ProjectStatus.InProgress;
        emit ProjectStarted(_projectId);
    }

    /**
     * @dev Submit work for review
     * @param _projectId Project ID
     * @param _deliverableURI IPFS hash or link to deliverables
     */
    function submitWork(uint256 _projectId, string memory _deliverableURI)
        external
        projectExists(_projectId)
        onlyFreelancer(_projectId)
    {
        Project storage project = projects[_projectId];
        require(project.status == ProjectStatus.InProgress, "Project not in progress");

        project.status = ProjectStatus.UnderReview;
        project.deliverableURI = _deliverableURI;

        emit WorkSubmitted(_projectId, msg.sender, _deliverableURI);
    }

    // ============ Internal Functions ============
    /**
     * @dev Complete a project and release funds to freelancer
     * @param _projectId Project ID
     */
    function _completeProject(uint256 _projectId) internal {
        Project storage project = projects[_projectId];
        require(project.status != ProjectStatus.Completed, "Project already completed");

        project.status = ProjectStatus.Completed;
        project.completedAt = block.timestamp;

        // Calculate platform fee (2%)
        uint256 platformFee = (project.amount * platformFeePercentage) / 10000;
        uint256 freelancerPayment = project.amount - platformFee;

        // Update reputation
        userReputations[project.freelancer].completedProjects++;
        userReputations[project.freelancer].totalEarnings += freelancerPayment;
        userReputations[project.freelancer].karma += 100;

        // Update success rate (simple calculation)
        UserReputation storage rep = userReputations[project.freelancer];
        if (rep.completedProjects > 0) {
            rep.successRate = (rep.completedProjects * 10000) / (rep.completedProjects + rep.totalDisputes);
        }

        totalFeesCollected += platformFee;

        // Transfer funds
        _transferPayment(project.paymentToken, project.freelancer, freelancerPayment);
        _transferPayment(project.paymentToken, treasuryAddress, platformFee);

        emit ProjectCompleted(_projectId, project.freelancer, freelancerPayment);
        emit ReputationUpdated(
            project.freelancer,
            rep.completedProjects,
            rep.karma
        );
    }

    /**
     * @dev Refund client for a cancelled/disputed project
     * @param _projectId Project ID
     */
    function _refundClient(uint256 _projectId) internal {
        Project storage project = projects[_projectId];
        _transferPayment(project.paymentToken, project.client, project.amount);
    }

    /**
     * @dev Transfer payment (ETH or ERC20)
     * @param _token Token address (address(0) for ETH)
     * @param _to Recipient address
     * @param _amount Amount to transfer
     */
    function _transferPayment(
        address _token,
        address _to,
        uint256 _amount
    ) internal {
        if (_token == address(0)) {
            // Transfer ETH
            (bool success, ) = payable(_to).call{value: _amount}("");
            require(success, "ETH transfer failed");
        } else {
            // Transfer ERC20
            IERC20(_token).transfer(_to, _amount);
        }
    }

    // ============ View Functions ============
    /**
     * @dev Get project details
     */
    function getProject(uint256 _projectId)
        external
        view
        projectExists(_projectId)
        returns (Project memory)
    {
        return projects[_projectId];
    }

    /**
     * @dev Get user reputation
     */
    function getReputation(address _user)
        external
        view
        returns (UserReputation memory)
    {
        return userReputations[_user];
    }

    /**
     * @dev Get user's projects
     */
    function getUserProjects(address _user)
        external
        view
        returns (uint256[] memory)
    {
        return userProjects[_user];
    }

    /**
     * @dev Get total projects
     */
    function getTotalProjects() external view returns (uint256) {
        return projectCounter;
    }

    // ============ Admin Functions ============
    /**
     * @dev Update platform fee percentage
     */
    function setPlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 1000, "Fee cannot exceed 10%"); // Max 10%
        platformFeePercentage = _newFee;
    }

    /**
     * @dev Update treasury address
     */
    function setTreasuryAddress(address _newTreasury) external onlyOwner {
        require(_newTreasury != address(0), "Invalid treasury address");
        treasuryAddress = _newTreasury;
    }

    /**
     * @dev Withdraw accumulated fees
     */
    function withdrawFees(address _token) external onlyOwner nonReentrant {
        uint256 amount = totalFeesCollected;
        require(amount > 0, "No fees to withdraw");

        totalFeesCollected = 0;
        _transferPayment(_token, treasuryAddress, amount);
    }

    // ============ Fallback ============
    receive() external payable {}
}
