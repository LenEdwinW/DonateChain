import React, { useState, useEffect } from "react";
import { Container, Header, Menu, Segment, Statistic, Icon, Dropdown } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import Charities from "./charities";
import MyDonations from "./mydonations";
import { ethers, formatEther } from "ethers";
import MainContractABI from "../abis/MainContractABI";
import MilestoneABI from "../abis/MilestoneABI";

const MAIN_CONTRACT_ADDRESS = "0x80C775eE3840569F2a7952Ed52f68e95c321E921";
const CHARITY_ADDRESS = "0x4980D1CBE02332B11d9fC3AcCD637689ED889716";

const Home = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("myDonations");
  const [conversionRates, setConversionRates] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("SGD");
  const [donationAmount, setDonationAmount] = useState(0);

  const currencyOptions = [
    { key: "SGD", value: "SGD", text: "SGD" },
    { key: "USD", value: "USD", text: "USD" },
    { key: "EUR", value: "EUR", text: "EUR" },
    { key: "GBP", value: "GBP", text: "GBP" },
    { key: "AUD", value: "AUD", text: "AUD" },
    { key: "CAD", value: "CAD", text: "CAD" },
    { key: "NZD", value: "NZD", text: "NZD" },
  ];

  useEffect(() => {
    const fetchConversionRates = async () => {
      console.log("Fetching conversion rates...");
      try {
        const response = await fetch(
          `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,SGD,EUR,GBP,AUD,CAD,NZD`
        );
        const data = await response.json();
        console.log("Conversion rates fetched:", data);
        setConversionRates(data);
      } catch (error) {
        console.error("Error fetching conversion rates:", error);
      }
    };

    const fetchTotalDonationAmount = async () => {
      if (typeof window.ethereum === "undefined") {
        console.error("MetaMask is not installed.");
        return;
      }

      console.log("Fetching total donation amount...");
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        console.log("User address:", userAddress);

        const mainContract = new ethers.Contract(MAIN_CONTRACT_ADDRESS, MainContractABI, provider);
        console.log("Main contract initialized at address:", MAIN_CONTRACT_ADDRESS);

        const milestones = await mainContract.getCharityMilestones(CHARITY_ADDRESS);
        console.log("Fetched milestones:", milestones);
        let totalDonations = 0;

        for (const milestone of milestones) {
          const milestoneContract = new ethers.Contract(milestone.milestoneContract, MilestoneABI, provider);
          
          if (!milestone.milestoneContract) {
            console.warn(`Invalid milestone contract address for ${milestone}`);
            continue;
          }

          const donationAmount = await milestoneContract.donations(userAddress);

          // Check if donationAmount is defined and valid before adding
          if (donationAmount && donationAmount > 0) {
            const donationInEther = parseFloat(formatEther(donationAmount)); // Convert to float
            console.log(`Donation for milestone ${milestone.milestoneContract}: ${donationInEther} ETH`);
            totalDonations += donationInEther;
          } else {
            console.log(`No donation found for milestone ${milestone.milestoneContract} for user ${userAddress}`);
          }
        }

        console.log("Total donation amount in ETH:", totalDonations);
        setDonationAmount(totalDonations.toFixed(4));
      } catch (error) {
        console.error("Error fetching total donation amount:", error);
      }
    };

    fetchConversionRates();
    fetchTotalDonationAmount();
  }, []);

  const handleLogout = () => {
    console.log("Logging out and navigating to /donatechain");
    navigate("/donatechain");
  };

  const handleItemClick = (name) => {
    console.log(`Menu item clicked: ${name}`);
    setActiveItem(name);
  };

  const handleCurrencyChange = (e, { value }) => {
    console.log("Selected currency:", value);
    setSelectedCurrency(value);
  };

  const donationInSelectedCurrency =
    conversionRates && conversionRates[selectedCurrency]
      ? (donationAmount * conversionRates[selectedCurrency]).toFixed(2)
      : "Loading...";

  const ethToSelectedCurrency =
    conversionRates && conversionRates[selectedCurrency]
      ? conversionRates[selectedCurrency].toFixed(2)
      : "Loading...";

  return (
    <Container style={{ display: "flex", backgroundColor: "white", height: "100vh", width: "auto", margin: 0, padding: 0 }}>
      <Menu vertical tabular style={{ width: "200px", margin: 0 }} color="red">
        <Menu.Item name="myDonations" active={activeItem === "myDonations"} onClick={() => handleItemClick("myDonations")}>
          <Icon name="money" />
          My Donations
        </Menu.Item>
        <Menu.Item name="charities" active={activeItem === "charities"} onClick={() => handleItemClick("charities")}>
          <Icon name="home" />
          Charities
        </Menu.Item>
        <Menu.Item name="logout" active={activeItem === "logout"} onClick={handleLogout}>
          <Icon name="sign-out" />
          Logout
        </Menu.Item>
      </Menu>
      <Container style={{ flex: 1, padding: "20px", margin: 0 }}>
        <Header as="h1" style={{ padding: "5px 0" }}>DonateChain</Header>
        <Dropdown
          placeholder="Select Currency"
          selection
          options={currencyOptions}
          value={selectedCurrency}
          onChange={handleCurrencyChange}
          style={{ marginBottom: "20px" }}
        />
        <Statistic style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Statistic.Value>{selectedCurrency} {donationInSelectedCurrency}</Statistic.Value>
          <Statistic.Label>Total Donated to Charity</Statistic.Label>
          <Statistic.Label style={{ padding: "10px 0" }}>
            1 ETH = {selectedCurrency} {ethToSelectedCurrency}
          </Statistic.Label>
        </Statistic>
        <Segment>
          {activeItem === "myDonations" && <MyDonations />}
          {activeItem === "charities" && <Charities />}
        </Segment>
      </Container>
    </Container>
  );
};

export default Home;
