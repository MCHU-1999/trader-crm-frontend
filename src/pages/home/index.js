// import * as dotenv from 'dotenv';
import process from 'process';
import React, { useState, useEffect, useRef } from 'react';
import styles from "./index.module.scss";
import liff from "@line/liff";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";


const Home = () => {
  const to = useRef("");
  const navigate = useNavigate();
  const userString = localStorage.getItem("userProfile");
  // const userProfile = JSON.parse(userString);
  // let url = new URL(window.location.href);
  // let params = url.searchParams;
  // for (let pair of params.entries()) {
  //   if (pair[0] === 'liff.state') {
  //     console.log(`liff.state=${pair[1]}`);
  //     to.current = pair[1];
  //     // navigate(`${pair[1]}`);
  //     window.location.replace(`https://trader-adou.netlify.app${pair[1]}`);
  //     console.log('我們經過NAV了');
  //   }
  // }

  // const toProduct = () => {
  //   navigate('/product');
  // }

  return (
    // 這邊就是個跳轉頁面而已，請別介意
    <div className={styles.main}>
      <h4>redirecting...</h4>
    </div>
  );
};

export default Home;