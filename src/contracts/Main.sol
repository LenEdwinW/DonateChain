// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./Milestone.sol";

contract Main {
    //data structure for storing all the milestones
    struct MilestoneStructure {
        address milestoneContract;
        bool isComplete;
    }

    //map for storing all milestones
    mapping(address => MilestoneStructure[]) public charityMilestones;

    //adress of creator of the contract (most likely charity or donationOrganization or individual)
    address public owner;

    //creates this main Contract
    constructor() {
        owner = msg.sender;
    }

    //events
    event MilestoneCreated(address indexed charity, address milestoneContract);

    //creates a new milestone contract for this charity
    function createMilestone(address payable _charity, uint _milestoneAmount, uint _duration, string memory _description) external {
        require(msg.sender == owner, "Only owner can create milestones");

        // Deploy new milestone contract
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
