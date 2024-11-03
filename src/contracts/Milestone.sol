// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./Main.sol";

contract Milestone {

    //adresses for charity and the main Contract(charity)
    address payable public charity;
    address public mainContract;

    //milestone attributes
    uint public milestoneAmount;
    uint public milestoneEndTime;
    bool public milestoneCompleted;
    string public milestoneDescription;

    //keeping track of donations
    mapping(address => uint256) public donations;
    address[] public donors;

    //events
    event DonationReceived(address donor, uint amount);
    event MilestoneCompleted();
    event MilestoneFailed();
    event DonationRefunded(address donor, uint amount);

    //create a new milestone (only called by the main contract)
    constructor(address payable _charity, uint _milestoneAmount, uint _duration, string memory _description) {
        charity = _charity;
        milestoneAmount = _milestoneAmount;
        milestoneEndTime = block.timestamp + _duration;
        milestoneCompleted = false;
        milestoneDescription = _description;
        mainContract = msg.sender;  // Set the main contract as the caller
    }

    //checks that the milestone end time is not in the past
    modifier milestoneActive() {
        require(block.timestamp <= milestoneEndTime, "Milestone ended.");
        require(!milestoneCompleted, "Milestone already completed.");
        _;
    }

    //checks that the main contract called this specific method
    modifier onlyMainContract() {
        require(msg.sender == mainContract, "Only Main contract can call this");
        _;
    }

    //method which enables donors to donate (main part of project)
    function donate() external payable milestoneActive {
        require(msg.value > 0, "Donation must be greater than 0.");

        if (donations[msg.sender] == 0) {
            donors.push(msg.sender);
        }

        donations[msg.sender] += msg.value;

        emit DonationReceived(msg.sender, msg.value);

        if (address(this).balance >= milestoneAmount) {
            completeMilestone();
        }
    }

    //completes the milestone, transfers the money to the charity
    function completeMilestone() private onlyMainContract {
        milestoneCompleted = true;
        emit MilestoneCompleted();
        charity.transfer(address(this).balance);
        
        // Notify the main contract that this milestone is complete
        Main(mainContract).markMilestoneComplete(charity, address(this));
    }

    //method returns whether milestone is still active or not
    function getMilestoneStatus() public view returns (string memory status) {
        if (milestoneCompleted) {
            return "Milestone completed.";
        } else if (block.timestamp > milestoneEndTime) {
            return "Milestone failed.";
        } else {
            return "Milestone ongoing.";
        }
    }

    //method checks whether milestone already failed, if yes refunds donations
    function checkMilestoneFailure() public onlyMainContract {
        require(block.timestamp >= milestoneEndTime, "Milestone is still active.");
        require(!milestoneCompleted, "Milestone already completed.");

        if (address(this).balance < milestoneAmount) {
            milestoneCompleted = true;
            emit MilestoneFailed();
            refundDonations();
        }
    }

    //refunds the donations to all donors
    function refundDonations() private {
        for (uint i = 0; i < donors.length; i++) {
            address donor = donors[i];
            uint amount = donations[donor];

            if (amount > 0) {
                donations[donor] = 0;
                payable(donor).transfer(amount);
                emit DonationRefunded(donor, amount);
            }
        }
    }
}