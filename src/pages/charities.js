import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3 from "web3";
import { milestoneContractABI } from "../abis/MilestoneABI";
import { CircularProgress, LinearProgress } from "@mui/material";

// Dummy data for the charity and milestone
const charityDetails = {
    name: "Save the Ocean Foundation",
    description: "A charity focused on protecting marine life and reducing plastic waste in oceans.",
    milestone: {
        address: "0xYourMilestoneContractAddress", // Replace with actual milestone contract address if testing on blockchain
        goal: "0.3",
        description: "Fund for beach clean-up activities and awareness programs.",
    },
};

const Charities = () => {
    const MILESTONE_ADDRESS = "0xbe5c2c9fac4a94fa78edbf5c263b26bce5c62258"
    const [donationAmount, setDonationAmount] = useState("");
    const [message, setMessage] = useState("");
    const [donating, setDonating] = useState(false);
    const [donated, setDonated] = useState(false);
    const [error, setError] = useState(false);
    const [currentBalance, setCurrentBalance] = useState(0);


    const fetchTotalDonations = async () => {
        try {
            if (!window.ethereum) {
                alert("Please install MetaMask.");
                return;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            // Fetch the current balance of the contract directly using provider
            const balance = await provider.getBalance(MILESTONE_ADDRESS);
            setCurrentBalance(balance); // Set current balance
        } catch (error) {
            console.error("Error fetching current balance:", error);
        }
    };

    useEffect(() => {
        fetchTotalDonations();
    }, [MILESTONE_ADDRESS]);

    const donate = async () => {
        try {
            if (!window.ethereum) {
                alert("Please install MetaMask.");
                return;
            }
            setDonating(true)
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const milestoneContract = new ethers.Contract(MILESTONE_ADDRESS, milestoneContractABI, signer);

            const donationInWei = ethers.parseEther(donationAmount);
            const transaction = await milestoneContract.donate({ value: donationInWei });
            await transaction.wait();
            setDonated(true);
            setDonating(false);
            await fetchTotalDonations();

            // setMessage("Thank you for your donation!");
        } catch (error) {
            console.error("Donation failed:", error);
            setError(true);
            setMessage("Donation failed. Please try again.");
        }
    };

    const progressPercentage = (parseFloat(ethers.formatEther(currentBalance)) / parseFloat((charityDetails.milestone.goal))) * 100;


    return (
        // <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: "flex", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", marginTop: "8px" }}>
            <div style={{ flex: 1, marginRight: "20px", maxWidth: "40%" }}>
                <h3>{charityDetails.name}</h3>
                <p>{charityDetails.description}</p>

                <h4>Milestone: {charityDetails.milestone.description}</h4>
                <p>Goal: {charityDetails.milestone.goal} ETH</p>
                <p>Current Balance: {ethers.formatEther(currentBalance)} ETH</p> {/* Display current balance */}

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
                {donating && (
                    <>
                        <p>Processing donation. Please wait...</p>
                        <LinearProgress color="success" style={{ marginTop: "10px" }} />
                    </>
                )}
                {donated && (
                    <>
                        <p>Thank you for your donations</p>
                        <LinearProgress variant = 'determinate' value={100}  color="success" style={{ marginTop: "10px" }} />
                    </>
                )}
                {error && (
                    <>
                        <p>Error has occured in donation</p>
                        <LinearProgress variant = 'determinate' value={100}  color="secondary" style={{ marginTop: "10px" }} />
                    </>
                )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <h4>Milestone Progress</h4>
                <CircularProgress variant="determinate" value={progressPercentage} size={100} />
                <p>{Math.round(progressPercentage)}%</p>
            </div>
        </div>
        // </div>
    );
};


export default Charities;
