import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import Web3 from "web3";
import {Button, Container, Header, Segment} from "semantic-ui-react";

const Login = () => {
  const navigate = useNavigate();
  const [, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({method: "eth_requestAccounts"});
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        navigate("/donatechain/home");
      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <Container textAlign="center" style={{height: "100vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
      <div>
        <Header as="h1" style={{fontSize: "5em", fontWeight: "bold"}}>
          DonateChain
        </Header>
        <Header as="h1" style={{fontSize: "2em", fontWeight: "normal", marginBottom: "50px"}}>
          Revolutionizing Charity with Blockchain Transparency
        </Header>
        <Button onClick={connectWallet} className="ui animated fade google plus huge button circular">
            <div className="visible content">Connect to ETH Wallet</div>
            <div className="hidden content"><i aria-hidden="true" className="ethereum icon"></i>Connect Wallet</div>
        </Button>
        <Segment basic style={{marginTop: "10px"}}>
          <p style={{color: "#555", fontSize: "1.1em"}}>
            Please connect your Ethereum wallet to continue
          </p>
        </Segment>
      </div>
    </Container>
  );
};

export default Login;
