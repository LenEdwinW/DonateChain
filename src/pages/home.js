import React, { useState, useEffect } from "react";
import { Container, Header, Menu, Segment, Statistic, Icon, Dropdown } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import Charities from "./charities";
import MyDonations from "./mydonations";

const Home = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("myDonations");
  const [conversionRates, setConversionRates] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("SGD");
  const [donationAmount, setDonationAmount] = useState(1);

  const currencyOptions = [
    { key: 'SGD', value: 'SGD', text: 'SGD' },
    { key: 'USD', value: 'USD', text: 'USD' },
    { key: 'EUR', value: 'EUR', text: 'EUR' },
    { key: 'GBP', value: 'GBP', text: 'GBP' },
  ];

  useEffect(() => {
    const fetchConversionRates = async () => {
      try {
        console.log("Fetching conversion rates from CryptoCompare...");
        const response = await fetch(
          `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,SGD,EUR,GBP`
        );
        const data = await response.json();
        console.log("Fetched data:", data);
        setConversionRates(data);
      } catch (error) {
        console.error("Error fetching conversion rates:", error);
      }
    };
    fetchConversionRates();
  }, []);

  const handleLogout = () => {
    navigate("/donatechain");
  };

  const handleItemClick = (name) => {
    setActiveItem(name);
  };

  const handleCurrencyChange = (e, { value }) => {
    setSelectedCurrency(value);
  };

  const donationInSelectedCurrency = conversionRates && conversionRates[selectedCurrency]
    ? (donationAmount * conversionRates[selectedCurrency]).toFixed(2)
    : "Loading...";

  const ethToSelectedCurrency = conversionRates && conversionRates[selectedCurrency]
    ? conversionRates[selectedCurrency].toFixed(2)
    : "Loading...";

  return (
    <Container style={{ display: "flex", backgroundColor: "white", height: "100vh", width: "auto", margin: 0, padding: 0 }}>
      <Menu vertical tabularstyle={{ width: "200px", margin: 0 }} color="red">
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
          style={{ marginBottom: '20px' }}
        />
        <Statistic style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
          <Statistic.Value>{selectedCurrency} {donationInSelectedCurrency}</Statistic.Value>
          <Statistic.Label>Contributed to Charity</Statistic.Label>
          <Statistic.Label style = {{padding: "10px 0"}}>
            1 ETH equivalent to {selectedCurrency} {ethToSelectedCurrency}
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
