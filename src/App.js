import React, { Component } from "react";
import "./styles.css";
import fra from "../public/fra.png";

export default class App extends Component {
  state = {
    frameX: 0,
    frameY: 0,
    profilX: 0,
    profilY: 0
  };

  render() {
    return (
      <div className="App w-full flex flex-col justify-center items-center">
        <h1>Hello CodeSandbox</h1>

        <div className="max-w-3xl w-full flex justify-center h-full">
          <div
            className="relative w-full flex h-full justify-center"
            style={{ transform: "scale(.5)" }}
          >
            <img
              src={fra}
              alt="fra"
              className="absolute top-0 left-0 w-full h-auto"
            />
            <img src={fra} alt="fra" className="absolute" />
          </div>
        </div>
      </div>
    );
  }
}
