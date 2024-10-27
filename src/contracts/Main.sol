// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./Milestone.sol";

contract Main {
    struct MilestoneStructure {
        address milestoneContract;
        bool isComplete;
    }

    mapping(address => MilestoneStructure[]) public charityMilestones;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    event MilestoneCreated(address indexed charity, address milestoneContract);

    // Create a new milestone contract for a charity
    function createMilestone(address payable _charity, uint _milestoneAmount, uint _duration, string memory _description) external {
        require(msg.sender == owner, "Only owner can create milestones");

        // Deploy new milestone contract
        // 
        Milestone milestone = new Milestone(_charity, _milestoneAmount, _duration, _description);
        
        // Store the milestone details
        charityMilestones[_charity].push(MilestoneStructure({
            milestoneContract: address(milestone),
            isComplete: false
        }));

        emit MilestoneCreated(_charity, address(milestone));
    }

    // Mark milestone as complete, called by the milestone contract
    function markMilestoneComplete(address _charity, address _milestone) external {
        for (uint i = 0; i < charityMilestones[_charity].length; i++) {
            if (charityMilestones[_charity][i].milestoneContract == _milestone) {
                charityMilestones[_charity][i].isComplete = true;
                break;
            }
        }
    }

    // Retrieve all milestones for a charity
    function getCharityMilestones(address _charity) external view returns (MilestoneStructure[] memory) {
        return charityMilestones[_charity];
    }
}