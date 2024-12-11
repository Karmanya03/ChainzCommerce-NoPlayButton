// ProductARView.js
import React from "react";
import "@google/model-viewer";

const ProductARView = ({ modelUrl, iosModelUrl, productName }) => {
  return (
    <div>
      <h1>{productName}</h1>
      <model-viewer
        src={modelUrl}
        ios-src={iosModelUrl}
        alt={`${productName} 3D Model`}
        ar
        ar-modes="scene-viewer quick-look"
        camera-controls
        shadow-intensity="1"
        style={{ width: "100%", height: "500px" }}
      ></model-viewer>
    </div>
  );
};

export default ProductARView;
