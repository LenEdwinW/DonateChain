// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

contract CharityMilestone {
    address payable public charity;
    uint public milestoneAmount;
    uint public milestoneEndTime;
    bool public milestoneCompleted;
    string public milestoneDescription;

    mapping(address => uint256) public donations;
    address[] public donors;

    event DonationReceived(address donor, uint amount);
    event MilestoneCompleted();
    event MilestoneFailed();
    event DonationRefunded(address donor, uint amount);

    constructor(address payable _charity, uint _milestoneAmount, uint _duration,string memory _description) {
        charity = _charity;
        milestoneAmount = _milestoneAmount;
        milestoneEndTime = block.timestamp + _duration;
        milestoneCompleted = false;
        milestoneDescription = _description;
    }

    modifier onlyCharity() {
        require(msg.sender == charity, "Only charity can call this.");
        _;
    }

    modifier milestoneActive() {
        require(block.timestamp <= milestoneEndTime, "Milestone ended.");
        require(!milestoneCompleted, "Milestone already completed.");
        _;
    }

    function donate() external payable milestoneActive {
        require(msg.value > 0, "Donation must be greater than 0.");

        if (donations[msg.sender] == 0) {
            donors.push(msg.sender);
        }

        donations[msg.sender] += msg.value;

        emit DonationReceived(msg.sender, msg.value);

        if (address(this).balance >= milestoneAmount) {
            milestoneCompleted = true;
            emit MilestoneCompleted();
            charity.transfer(address(this).balance);
        }
    }

    function getMilestoneStatus() public view returns (string memory status) {
        if (milestoneCompleted) {
            return "Milestone completed.";
        } else if (block.timestamp > milestoneEndTime) {
            return "Milestone failed.";
        } else {
            return "Milestone ongoing.";
        }
    }

    function checkMilestoneFailure() public {
        require(block.timestamp >= milestoneEndTime, "Milestone is still active.");
        require(!milestoneCompleted, "Milestone already completed.");

        if (address(this).balance < milestoneAmount) {
            milestoneCompleted = true;
            emit MilestoneFailed();
            refundDonations();
        }
    }

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
