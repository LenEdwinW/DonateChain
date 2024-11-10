export const mainContractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
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
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
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
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
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
				],
				"internalType": "struct Main.MilestoneStructure[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
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
	}
]