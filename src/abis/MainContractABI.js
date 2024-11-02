export const mainContractABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "_charity",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_milestoneAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_duration",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_description",
          "type": "string"
        }
      ],
      "name": "createMilestone",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_charity",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_milestone",
          "type": "address"
        }
      ],
      "name": "markMilestoneComplete",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_charity",
          "type": "address"
        }
      ],
      "name": "getCharityMilestones",
      "outputs": [
        {
          "internalType": "MilestoneStructure[]",
          "name": "",
          "type": "tuple[]",
          "components": [
            {
              "internalType": "address",
              "name": "milestoneContract",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "isComplete",
              "type": "bool"
            }
          ]
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "charity",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "milestoneContract",
          "type": "address"
        }
      ],
      "name": "MilestoneCreated",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "charityMilestones",
      "outputs": [
        {
          "internalType": "address",
          "name": "milestoneContract",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "isComplete",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
