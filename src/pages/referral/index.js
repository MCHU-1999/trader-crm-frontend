// import * as dotenv from 'dotenv';
import process from 'process';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import { get, post } from '../../util/io'
import liff from "@line/liff";


const Referral = () => {
  const navigate = useNavigate();
  const userProfile = JSON.parse(localStorage.getItem("userProfile"));
  const header = { password: process.env.REACT_APP_API_PASSWORD };
  const idToken = useRef({});
  const from = useRef("");

  let referralURL = new URL(window.location.href);
  let params = referralURL.searchParams;
  for (let pair of params.entries()) {
    if (pair[0] === 'id') {
      console.log(`id: ${pair[1]}`);
      from.current = pair[1];
    }
  }

  if (userProfile !== null || userProfile !== undefined) {
    post(`${process.env.REACT_APP_API_URL}/referral/updateTempData`, header, {
      from: from.current,
      toId: userProfile.userId,
    })
    .then((resp)=>{
      let status = resp.data.status;
      if (status === 'success') {
        console.log('update temp data successfully.');
      }else{
        console.log('fail to update temp data.');
      }
    }).finally(() => {
      window.location.replace("https://line.me/R/ti/p/@555dqvcz");
    })
    .catch((errorMsg)=>{
      console.log(errorMsg);
    })
  }

  return (
    <div className={styles.main}>
      <h3 style={{ color: '#FFFFFF' }}>{JSON.stringify(idToken.current)}</h3>
    </div>
  );
};

export default Referral;