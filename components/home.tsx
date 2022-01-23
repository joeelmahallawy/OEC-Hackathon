import React from "react";
import { Image } from "@chakra-ui/react";
// import imageOne from "../attachments/imageOne.png";
// import imageTwo from "../attachments/imageTwo.png";

const HomePage = () => {
  return (
    <div className="App">
      <header className="App-header">
        {/* <Image src={imageOne.src} className="imageOne" alt="image" />
        <Image src={imageTwo.src} className="imageTwo" alt="image" /> */}
        <text className="mainText">Save Our Oceans</text>
      </header>
      <div className="smallBox">
        <text className="smallText">Home</text>
        <div className="smallBoxtwo">
          <text className="smallTexttwo">About Us</text>
        </div>
      </div>

      <div className="appBody"></div>
    </div>
  );
};

export default HomePage;
