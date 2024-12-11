// ProductARViewWrapper.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductARView from "./ProductARView";

const ProductARViewWrapper = ({ nft }) => {
  const { id } = useParams();
  const [productModelUrl, setProductModelUrl] = useState("");
  const [productName, setProductName] = useState("");

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        if (!nft || !nft.tokenURI) {
          console.error("NFT contract not loaded.");
          return;
        }

        // Fetch metadata URI from contract
        const uri = await nft.tokenURI(id);
        const metadata = await fetch(uri).then((res) => res.json());

        setProductModelUrl(metadata.modelUrl); // Assuming metadata includes `modelUrl`
        setProductName(metadata.name);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [id, nft]);

  return productModelUrl ? (
    <ProductARView
      modelUrl={productModelUrl}
      iosModelUrl={`${productModelUrl}.usdz`} // For iOS compatibility
      productName={productName}
    />
  ) : (
    <p>Loading product details...</p>
  );
};

export default ProductARViewWrapper;
