import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Route, Routes, useNavigate} from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';
import Login from "./pages/login";
import Home from "./pages/home";

const MainApp = () => {
  const [, setAccount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        setAccount(null);
        navigate("/donatechain");
      });
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/donatechain" element={<Login />} />
      <Route path="/donatechain/home" element={<Home />} />
    </Routes>
  );
};

ReactDOM.render(
  <Router>
    <MainApp />
  </Router>,
  document.getElementById("root")
);
