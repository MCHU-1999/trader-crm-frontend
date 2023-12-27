import process from 'process';
import toast, { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import liff from "@line/liff";
// import LIFFInspectorPlugin from '@line/liff-inspector';
// import LIFFMockPlugin from '@line/liff-mock';

import Home from "./pages/home";
import Product from "./pages/product";
import SignUp from "./pages/signup";
import Referral from "./pages/referral";
import MyCopy from "./pages/mycopy";
import StartCopy from "./pages/startcopy";
import Backstage from "./pages/backstage";

import logo from './logo.svg';
import './App.css';

window.toast = toast;

function App() {
  let userAgentString = navigator.userAgent;
  let isLIFF = userAgentString.indexOf("LIFF") > -1;
  console.log(`userAgentString: ${userAgentString}`);

  if (isLIFF) {
    liff.init({
      liffId: process.env.REACT_APP_ALLINONE_LIFF_ID,
      withLoginOnExternalBrowser: true,
    })
    .then(() => {
      liff.getProfile().then((result) => {
        console.log(result);
        localStorage.setItem("userProfile", JSON.stringify(result));
      });
      console.log('liff.init - done');
    })
    .catch((e) => {
      console.log(`${e}`);
    });
  } else {
    liff.init({
      liffId: process.env.REACT_APP_ALLINONE_LIFF_ID,
      withLoginOnExternalBrowser: true,
    })
    .then(() => {
      liff.getProfile().then((result) => {
        console.log(result);
        localStorage.setItem("userProfile", JSON.stringify(result));
      });
      console.log('liff.init - done');
    })
    .catch((e) => {
      console.log(`${e}`);
    });
    // localStorage.setItem("userProfile", JSON.stringify({userId: "Uc17989a2bbda9aef52e89393db74e81f"}));
  }

  window.Buffer = window.Buffer || require("buffer").Buffer;
  return (
    <BrowserRouter>
      <div className="App">
        <Toaster />
        <Routes>
          <Route path="/" element={ <Home/> }/>
          {/* <Route path="/liff" element={ <LiffRedirect/> }/> */}
          <Route path="/referral" element={ <Referral/> }/>
          <Route path="/mycopy" element={ <MyCopy/> }/>
          <Route path="/signup" element={ <SignUp/>}/>
          <Route path="/startcopy" element={ <StartCopy/> }/>
          <Route path="/product" element={ <Product defaultKey={"1"}/>}/>
          <Route path="/backstage" element={ <Backstage/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
