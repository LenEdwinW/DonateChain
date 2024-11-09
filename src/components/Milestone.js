
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3 from "web3";
import { milestoneContractABI } from "../abis/MilestoneABI";
import { CircularProgress, LinearProgress } from "@mui/material";


const Milestone = ({ charityDetails }) => {
	const MILESTONE_ADDRESS = charityDetails.milestone.address;
	console.log("hello", MILESTONE_ADDRESS);
	const [donationAmount, setDonationAmount] = useState("");
	const [donating, setDonating] = useState(false);
	const [donated, setDonated] = useState(false);
	const [checking, setChecking] = useState(false);
	const [checked, setChecked] = useState(false);
	const [error, setError] = useState(false);
	const [currentBalance, setCurrentBalance] = useState(0);
	const [milestoneCompleted, setMilestoneCompleted] = useState(false);
	const [milestoneFailed, setMilestoneFailed] = useState(false);


	const fetchTotalDonations = async () => {
		try {
			if (!window.ethereum) {
				alert("Please install MetaMask.");
				return;
			}

			const provider = new ethers.BrowserProvider(window.ethereum);
			const balance = await provider.getBalance(MILESTONE_ADDRESS);
			setCurrentBalance(balance);
		} catch (error) {
			console.error("Error fetching current balance:", error);
		}
	};

	const fetchMilestoneStatus = async () => {
		try {
			console.log("Running")
			if (!window.ethereum) {
				alert("Please install MetaMask.");
				return;
			}
			const provider = new ethers.BrowserProvider(window.ethereum);
			const signer = await provider.getSigner();
			const milestoneContract = new ethers.Contract(MILESTONE_ADDRESS, milestoneContractABI, signer);
			milestoneContract.on("MilestoneFailed", () => {
				console.log("MilestoneFailed event detected");
				setMilestoneFailed(true);
			});
			milestoneContract.on("MilestoneCompleted", () => {
				console.log("MilestoneCompleted event detected");
				setMilestoneCompleted(true);
			});

			const pastFailedEvents = await milestoneContract.queryFilter("MilestoneFailed");
			if (pastFailedEvents.length > 0) {
				setMilestoneFailed(true);
				console.log("Past MilestoneFailed events:", pastFailedEvents);
			}

			const pastCompletedEvents = await milestoneContract.queryFilter("MilestoneCompleted");
			if (pastCompletedEvents.length > 0) {
				setMilestoneCompleted(true);
				console.log("Past MilestoneCompleted events:", pastCompletedEvents);
			}

		} catch (error) {
			console.error("Error fetching milestone status:", error);
		}
	};

	useEffect(() => {
		fetchTotalDonations();
		fetchMilestoneStatus();
		const intervalId = setInterval(fetchMilestoneStatus, 5000);
		return () => {
			clearInterval(intervalId);
		};
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

		} catch (error) {
			console.error("Donation failed:", error);
			setError(true);
		}
	};


	const withdrawDonation = async () => {
		try {
			if (!window.ethereum) {
				alert("Please install MetaMask.");
				return;
			}
			setChecking(true)
			const provider = new ethers.BrowserProvider(window.ethereum);
			const signer = await provider.getSigner();
			const milestoneContract = new ethers.Contract(MILESTONE_ADDRESS, milestoneContractABI, signer);

			const transaction = await milestoneContract.checkMilestoneFailure();
			await transaction.wait();
			setChecked(true);
			setChecking(false);

		} catch (error) {
			console.error("Checking milestone failed:", error);
			setError(true);
		}
	};


	const progressPercentage = Math.floor((parseFloat(ethers.formatEther(currentBalance)) / parseFloat(charityDetails.milestone.goal)) * 100);



	return (
		<div style={{ display: "flex", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", marginTop: "8px" }}>
			<div style={{ flex: 1, marginRight: "20px", maxWidth: "40%" }}>
				<h3>{charityDetails.name}</h3>
				<p>{charityDetails.description}</p>

				<h4>Milestone: {charityDetails.milestone.description}</h4>
				<p>Goal: {charityDetails.milestone.goal} ETH</p>
				<p>Current Balance: {ethers.formatEther(currentBalance)} ETH</p>

				<div >
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
							<LinearProgress variant='determinate' value={100} color="success" style={{ marginTop: "10px" }} />
						</>
					)}
					{error && (
						<>
							<p>Error has occured in donation</p>
							<LinearProgress variant='determinate' value={100} color="secondary" style={{ marginTop: "10px" }} />
						</>
					)}
				</div>
			</div>

			<div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
				{!milestoneCompleted && !milestoneFailed && (
					<>
						<h4>Milestone Progress</h4>
						<CircularProgress variant="determinate" value={progressPercentage} size={100} />
						<p>{Math.round(progressPercentage)}%</p>
					</>
				)}

				{milestoneCompleted && (
					<>
						<h4> Milestone successfully completed. Funds disbursed to charity.</h4>
					</>
				)}

				{milestoneFailed && (
					<>
						<h4>Milestone Failed. Please withdraw your donations.</h4>

						<div>
							<button onClick={withdrawDonation} style={{ padding: "5px 15px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "4px" }}>
								Withdraw Donations
							</button>
							{checking && (
								<>
									<p>Checking milestone status. Please wait...</p>
									<LinearProgress color="success" style={{ marginTop: "10px" }} />
								</>
							)}
							{checked && (
								<>
									<p>retrieved</p>
									<LinearProgress variant='determinate' value={100} color="success" style={{ marginTop: "10px" }} />
								</>
							)}
							{error && (
								<>
									<p>Error has occured in donation</p>
									<LinearProgress variant='determinate' value={100} color="secondary" style={{ marginTop: "10px" }} />
								</>
							)}
						</div>
					</>
				)}

			</div>
		</div>
	);
}

export default Milestone;