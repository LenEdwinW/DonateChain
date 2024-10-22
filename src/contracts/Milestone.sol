// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

contract Milestone {

    address payable public charity;

    uint public milestoneAmount;
    uint milestoneEndTime;
    bool milestoneCompleted;

    mapping(address => uint256) public donations;
    address[] public donors;

    event DonationReceived(address payable donor, uint amount);
    event MilestoneCompleted();
    event MilestoneFailed();

    constructor(address payable charityAddress, uint _milestoneAmount, uint duration) {
        charity = charityAddress;
        milestoneAmount = _milestoneAmount;
        milestoneCompleted = false;
        milestoneEndTime = block.timestamp + duration;
    }

    modifier onlyCharity() {
        require(msg.sender == charity, "Only charity can call this function.");
        _;
    }

    modifier milestoneNotCompleted() {
        require(!milestoneCompleted, "Milestone already completed.");
        _;
    }

    modifier checkMilestoneFailure() {
        if (block.timestamp >= milestoneEndTime && !milestoneCompleted) {
            milestoneCompleted = true;
            emit MilestoneFailed();
        }
        _;
    }

    function donate() external payable checkMilestoneFailure milestoneNotCompleted {
        require(msg.value > 0, "Must donate a positive amount.");

        if (donations[msg.sender] == 0) {
            donors.push(msg.sender); // Add donor to the list if it's their first donation
        }
        donations[msg.sender] += msg.value; // Keep track or donor's donations

        if (address(this).balance >= milestoneAmount) { // mileStone amount reached
            milestoneCompleted = true;
            emit MilestoneCompleted();
            charity.transfer(address(this).balance); // Transfer funds to charity
        }

        emit DonationReceived(payable(msg.sender), msg.value);
    }

    function retrieveDonations() external {
        require(milestoneCompleted, "Milestone not completed or failed.");
        require(donations[msg.sender] > 0, "No funds to withdraw.");

        uint256 amount = donations[msg.sender];
        donations[msg.sender] = 0; // Reset the donation amount to prevent double withdrawal

        payable(msg.sender).transfer(amount); // Transfer the funds back to the donor
    }

    

  
}
