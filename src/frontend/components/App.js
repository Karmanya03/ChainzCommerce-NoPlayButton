// App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { ethers } from "ethers";

import Navigation from "./Navbar";
import Home from "./Home.js";
import Create from "./Create.js";
import MyListedItems from "./MyListedItems.js";
import MyPurchases from "./MyPurchases.js";
import Connect from "./Connect.js";
import { MyMarketPlace } from "./MyMarketPlace.js";
import ProductARViewWrapper from "./ProductARViewWrapper.js";

import MarketplaceAbi from "../contractsData/Marketplace.json";
import MarketplaceAddress from "../contractsData/Marketplace-address.json";
import NFTAbi from "../contractsData/NFT.json";
import NFTAddress from "../contractsData/NFT-address.json";

import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [nft, setNFT] = useState({});
  const [marketplace, setMarketplace] = useState({});

  // MetaMask Login/Connect
  const web3Handler = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);

      // Get provider from Metamask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // Set signer
      const signer = provider.getSigner();

      // Reload page on chain change
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });

      // Update account on change
      window.ethereum.on("accountsChanged", async function (accounts) {
        setAccount(accounts[0]);
        await web3Handler();
      });

      // Load contracts
      await loadContracts(signer);
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  };

  // Load contracts
  const loadContracts = async (signer) => {
    try {
      const marketplace = new ethers.Contract(
        MarketplaceAddress.address,
        MarketplaceAbi.abi,
        signer
      );
      setMarketplace(marketplace);

      const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);
      setNFT(nft);

      setLoading(false);
    } catch (error) {
      console.error("Error loading contracts:", error);
    }
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Navigation web3Handler={web3Handler} account={account} />
        <div>
          {loading ? (
            <Connect onConnect={web3Handler} />
          ) : (
            <Routes>
              <Route
                path="/"
                element={<Home account={account} web3Handler={web3Handler} />}
              />
              <Route
                path="/my-marketplace"
                element={
                  <MyMarketPlace
                    account={account}
                    marketplace={marketplace}
                    nft={nft}
                    web3Handler={web3Handler}
                  />
                }
              />
              <Route
                path="/create"
                element={<Create marketplace={marketplace} nft={nft} />}
              />
              <Route
                path="/my-listed-items"
                element={
                  <MyListedItems
                    marketplace={marketplace}
                    nft={nft}
                    account={account}
                  />
                }
              />
              <Route
                path="/my-purchases"
                element={
                  <MyPurchases
                    marketplace={marketplace}
                    nft={nft}
                    account={account}
                  />
                }
              />
              <Route
                path="/product-ar/:id"
                element={
                  <ProductARViewWrapper
                    nft={nft}
                    account={account}
                    marketplace={marketplace}
                  />
                }
              />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
