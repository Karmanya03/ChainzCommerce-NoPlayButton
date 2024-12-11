import axios from "axios";
import { useState } from "react";
import { ethers } from "ethers";
import { Nav } from "react-bootstrap";
import { GrInstagram, GrTwitter } from "react-icons/gr";
import { FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "./assets/logo.jpeg";

const Create = ({ marketplace, nft }) => {
  const [fileImg, setFile] = useState(null);
  const [name, setName] = useState("");
  const [desc, setDescription] = useState("");
  const [modelUrl, setModelUrl] = useState(""); // New state for Model URL
  const [price, setPrice] = useState("");

  const sendJSONtoIPFS = async (ImgHash) => {
    try {
      const resJSON = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJsonToIPFS",
        data: {
          name: name,
          description: desc,
          image: ImgHash,
          modelUrl: modelUrl, // Include Model URL in metadata
        },
        headers: {
          pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
          pinata_secret_api_key:
            process.env.REACT_APP_PINATA_SECRET_API_KEY,
        },
      });

      const tokenURI = `https://gateway.pinata.cloud/ipfs/${resJSON.data.IpfsHash}`;
      console.log("Token URI", tokenURI);
      mintThenList(tokenURI);
    } catch (error) {
      console.log("JSON to IPFS error:", error);
    }
  };

  const sendFileToIPFS = async (e) => {
    e.preventDefault();

    if (fileImg) {
      try {
        const formData = new FormData();
        formData.append("file", fileImg);
        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
            pinata_secret_api_key:
              process.env.REACT_APP_PINATA_SECRET_API_KEY,
            "Content-Type": "multipart/form-data",
          },
        });

        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        console.log("Image Hash:", ImgHash);
        sendJSONtoIPFS(ImgHash);
      } catch (error) {
        console.log("File to IPFS error:", error);
      }
    }
  };

  const mintThenList = async (uri) => {
    await (await nft.mint(uri)).wait();
    const id = await nft.tokenCount();
    await (await nft.setApprovalForAll(marketplace.address, true)).wait();
    const listingPrice = ethers.utils.parseEther(price.toString());
    await (await marketplace.makeItem(nft.address, id, listingPrice)).wait();
  };

  return (
    <>
      <div className="container mx-auto py-10 p-10 sm:mt-20 min-h-screen relative">
        <main className="max-w-2xl p-8 mx-auto mt-14 bg-none border-3 border-gray-500 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-white">
            Create Your NFT
          </h1>
          <div className="space-y-4">
            <div className="mb-4">
              <label className="block text-white text-lg">
                Upload NFT File
              </label>
              <input
                onChange={(e) => setFile(e.target.files[0])}
                className="form-input-lg mt-2 text-white border border-gray-300 p-2 w-full rounded-md"
                required
                type="file"
                name="file"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white text-lg">Name</label>
              <input
                onChange={(e) => setName(e.target.value)}
                className="form-input-lg mt-2 border border-gray-300 p-2 w-full rounded-md"
                required
                type="text"
                placeholder="Name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white text-lg">Description</label>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                className="form-input-lg mt-2 border border-gray-300 p-2 w-full rounded-md"
                required
                placeholder="Description"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-white text-lg">Model URL</label>
              <input
                onChange={(e) => setModelUrl(e.target.value)}
                className="form-input-lg mt-2 border border-gray-300 p-2 w-full rounded-md"
                required
                type="url"
                placeholder="https://example.com/model.glb"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white text-lg">Price in ETH</label>
              <input
                onChange={(e) => setPrice(e.target.value)}
                className="form-input-lg mt-2 border border-gray-300 p-2 w-full rounded-md"
                required
                type="number"
                placeholder="Price in ETH"
              />
            </div>
            <div className="flex items-center justify-center">
              <button
                onClick={sendFileToIPFS}
                className="bg-none border-3 border-blue-600 text-white py-3 px-8 rounded-none hover:bg-blue-600 transition duration-300"
              >
                Create & List Your NFT!
              </button>
            </div>
          </div>
        </main>
      </div>

      <div className="bg-none text-white p-4 flex flex-row justify-between items-center">
        <div className="flex-shrink-0">
          <img src={logo} className="w-20 h-20 rounded-full" alt="logo" />
        </div>
        <div className="flex flex-row space-x-4">
          <Nav.Link
            as={Link}
            to="/"
            className="hover:text-white text-white hover:scale-110"
          >
            Home
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/"
            href="about"
            className="hover:text-white text-white hover:scale-110"
          >
            About
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/"
            href="help"
            className="hover:text-white text-white hover:scale-110"
          >
            Help
          </Nav.Link>
        </div>
        <div className="flex flex-row space-x-4">
          <a href="#" className="text-xl hover:text-white hover:scale-110">
            <GrTwitter />
          </a>
          <a href="#" className="text-xl hover:text-white hover:scale-110">
            <FaFacebook />
          </a>
          <a href="#" className="text-xl hover:text-white hover:scale-110">
            <GrInstagram />
          </a>
        </div>
      </div>
    </>
  );
};

export default Create;
