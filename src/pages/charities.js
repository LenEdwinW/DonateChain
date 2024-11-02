import React, { useState } from "react";
import { ethers } from "ethers";
import { MILESTONE_ABI } from "../contracts/config";
import Web3 from "web3";

// Dummy data for the charity and milestone
const charityDetails = {
    name: "Save the Ocean Foundation",
    description: "A charity focused on protecting marine life and reducing plastic waste in oceans.",
    milestone: {
        address: "0xYourMilestoneContractAddress", // Replace with actual milestone contract address if testing on blockchain
        goal: "10 ETH",
        description: "Fund for beach clean-up activities and awareness programs.",
    },
};


const Charities = () => {
    const MILESTONE_ADDRESS = "0x204a3aE7B6921100655640eD3cB42ED533f3EF74"

    const [donationAmount, setDonationAmount] = useState("");
    const [message, setMessage] = useState("");

    const donate = async () => {
        try {
            if (!window.ethereum) {
                alert("Please install MetaMask.");
                return;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const milestoneContract = new ethers.Contract(MILESTONE_ADDRESS, MILESTONE_ABI, signer);

            const donationInWei = ethers.parseEther(donationAmount);
            const transaction = await milestoneContract.donate({ value: donationInWei });
            await transaction.wait(); // Wait for the transaction to be mined

            setMessage("Thank you for your donation!");
        } catch (error) {
            console.error("Donation failed:", error);
            setMessage("Donation failed. Please try again.");
        }
    };

    return (
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", marginTop: "20px" }}>
            <h3>{charityDetails.name}</h3>
            <p>{charityDetails.description}</p>

            <h4>Milestone: {charityDetails.milestone.description}</h4>
            <p>Goal: {charityDetails.milestone.goal}</p>

            <input
                type="number"
                placeholder="Enter amount in ETH"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                style={{ marginRight: "10px", padding: "5px" }}
            />
            <button onClick={donate} style={{ padding: "5px 15px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "4px" }}>
                Donate
            </button>
            {message && <p>{message}</p>}
        </div>
    );
};



export default Charities;
