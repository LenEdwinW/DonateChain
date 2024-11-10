import React, { useEffect, useState } from "react";
import DonationCard from "../components/donationcard";
import { ethers } from "ethers";
import axios from "axios";
import MainContractABI from "../abis/MainContractABI";
import MilestoneABI from "../abis/MilestoneABI";
import { charityDetails1, charityDetails2, charityDetails3 } from "./charities";

const MAIN_CONTRACT_ADDRESS = "0x9c611e65196ea3e0028bbc3ea45b6f2ede65f90a";
const CHARITY_ADDRESS = "0x4980D1CBE02332B11d9fC3AcCD637689ED889716";
const ETHERSCAN_API_KEY = "YXB5S9WR2F4SSXIFUZ249I5S4W2ST793E6";

const milestoneAddressToCharityName = {
    [charityDetails1.milestone.address]: charityDetails1.name,
    [charityDetails2.milestone.address]: charityDetails2.name,
    [charityDetails3.milestone.address]: charityDetails3.name,
};

const MyDonations = () => {
    const [donations, setDonations] = useState([]);

    useEffect(() => {
        const fetchDonations = async () => {
            if (typeof window.ethereum === "undefined") {
                console.error("MetaMask is not installed.");
                return;
            }

            try {
                // Connect to MetaMask and get user address
                await window.ethereum.request({ method: "eth_requestAccounts" });
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const userAddress = await signer.getAddress();

                // Initialize main contract
                const mainContract = new ethers.Contract(MAIN_CONTRACT_ADDRESS, MainContractABI, provider);

                // Fetch milestones for the charity
                const milestones = await mainContract.getCharityMilestones(CHARITY_ADDRESS);
                const userDonations = [];

                for (const milestone of milestones) {
                    const milestoneContract = new ethers.Contract(milestone.milestoneContract, MilestoneABI, provider);
                    const donationAmount = await milestoneContract.donations(userAddress);

                    // If user has made a donation, fetch transaction hash and add to list
                    if (donationAmount > 0) {
                        // Fetch transaction history from Etherscan for the user
                        const response = await axios.get(
                            `https://api-sepolia.etherscan.io/api`, {
                                params: {
                                    module: "account",
                                    action: "txlist",
                                    address: userAddress,
                                    startblock: 0,
                                    endblock: 99999999,
                                    sort: "asc",
                                    apikey: ETHERSCAN_API_KEY
                                }
                            }
                        );

                        const transactions = response.data.result;
                        const transactionHash = transactions.find(
                            tx => 
                                tx.to.toLowerCase() === milestone.milestoneContract.toLowerCase() &&
                                tx.from.toLowerCase() === userAddress.toLowerCase() &&
                                ethers.formatEther(tx.value) === ethers.formatEther(donationAmount)
                        )?.hash;

                        userDonations.push({
                            charity: milestoneAddressToCharityName[milestone.milestoneContract],
                            amount: ethers.formatEther(donationAmount),
                            transactionHash: transactionHash || "",
                        });
                    }
                }

                setDonations(userDonations);
            } catch (error) {
                console.error("Error fetching donations:", error);
            }
        };

        fetchDonations();
    }, []);

    return (
        <div>
            {donations.map((donation, index) => (
                <DonationCard
                    key={index}
                    charity={donation.charity}
                    amount={donation.amount}
                    etherscanLink={donation.transactionHash ? `https://sepolia.etherscan.io/tx/${donation.transactionHash}` : ""}
                />
            ))}
        </div>
    );
};

export default MyDonations;
