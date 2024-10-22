import React, {useState} from "react";
import {Container, Header, Menu, Segment, Statistic, Icon, StatisticLabel} from "semantic-ui-react";
import {useNavigate} from "react-router-dom";
import Charities from "./charities"; 
import MyDonations from "./mydonations";
const Home = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("myDonations");
  const handleLogout = () => {
    navigate("/donatechain");
  };
  const handleItemClick = (name) => {
    setActiveItem(name);
  };

  return (
    <Container style={{display: "flex", backgroundColor: "white", height: "100vh", width: "auto", margin: 0, padding: 0}}>
      <Menu vertical tabularstyle={{width: "200px", margin: 0}} color = "red">
        <Menu.Item name="myDonations" active={activeItem === "myDonations"} onClick={() => handleItemClick("myDonations")}>
          <Icon name="money"/>
          My Donations
        </Menu.Item>
        <Menu.Item name="charities" active={activeItem === "charities"} onClick={() => handleItemClick("charities")}>
          <Icon name="home"/>
          Charities
        </Menu.Item>
        <Menu.Item name="logout" active={activeItem === "logout"} onClick={handleLogout}>
          <Icon name="sign-out"/>
          Logout
        </Menu.Item>
      </Menu>
      <Container style={{flex: 1, padding: "20px", margin: 0}}>
        <Header as="h1" style={{padding: "10px 0"}}>DonateChain</Header>
        <Statistic style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
          <Statistic.Value>SGD XXXXX.XX</Statistic.Value>
          <Statistic.Label>Contributed to Charity</Statistic.Label>
          <Statistic.Label>1 ETH equivalent to SGD 3131.09</Statistic.Label>
        </Statistic>
        <Segment>
          {activeItem === "myDonations" && <MyDonations/>}
          {activeItem === "charities" && <Charities/>}
        </Segment>
      </Container>
    </Container>
  );
};

export default Home;
