// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./JobToken.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract JobPosting is Pausable, Ownable {
    using SafeMath for uint256;

    struct Job {
        uint256 id;
        string description;
        uint256 reward;
        address freelancer;
        bool completed;
    }

    Job[] public jobs;

    JobToken public jobToken;

    constructor(address _jobTokenAddress) {
        jobToken = JobToken(_jobTokenAddress);
    }

    function postJob(string memory _description, uint256 _reward) public onlyOwner {
        jobs.push(Job(jobs.length, _description, _reward, address(0), false));
    }

    function submitWork(uint256 _jobId) public {
        require(!jobs[_jobId].completed, "Job already completed");
        jobs[_jobId].freelancer = msg.sender;
    }

    function completeJob(uint256 _jobId) public onlyOwner {
        require(jobs[_jobId].freelancer != address(0), "No freelancer assigned");
        require(!jobs[_jobId].completed, "Job already completed");

        address freelancer = jobs[_jobId].freelancer;
        uint256 reward = jobs[_jobId].reward;

        jobToken.transfer(freelancer, reward);
        jobs[_jobId].completed = true;
    }
}
