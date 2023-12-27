// import * as dotenv from 'dotenv';
import process from 'process';
import React, { useState, useEffect, useRef } from 'react';
import { Input, Space, Form, Button, Select, DatePicker, Divider, Tabs } from 'antd';
import styles from "./index.module.scss";
import { useNavigate } from "react-router-dom";
import { get, post } from '../../util/io';
import WaitingList from './waiting';
import ChargeList from './to-be-charge';
import MemberList from './all-member';
import Overview from './overview';
import Cptrader from './copytrader';
import liff from "@line/liff";


const Backstage = () => {
  var items = [];
  const [ isAdmin, setIsAdmin ] = useState(false);
  const userProfile = JSON.parse(localStorage.getItem("userProfile"));
  const adm = JSON.parse(process.env.REACT_APP_ADMIN) || { admins: [] };

  // let navigate = useNavigate();
  let userAgentString = navigator.userAgent;
  let isLIFF = userAgentString.indexOf("LIFF") > -1;

  useEffect(() => {
    let array = [...adm.admins];
    // console.log(array);
    if (array.includes(userProfile.userId)) {
      setIsAdmin(true);
    }
    console.log(`isAdmin: ${isAdmin}`);
  }, [userProfile, isAdmin]);

  if (isLIFF) {
    items = [
      {
        key: '1',
        label: `會員總覽`,
        children: (<MemberList isAdmin={isAdmin}/>),
        lineWidth: 3,
      },
      {
        key: '2',
        label: `待收月費`,
        children: (<ChargeList isAdmin={isAdmin}/>),
        lineWidth: 3,
      },
      {
        key: '3',
        label: `加入申請`,
        children: (<WaitingList isAdmin={isAdmin}/>),
        lineWidth: 3,
      },
      {
        key: '4',
        label: `跟單申請`,
        children: (<Cptrader isAdmin={isAdmin}/>),
        lineWidth: 3,
      },
    ];
  } else {
    items = [
      {
        key: '1',
        label: `會員總覽`,
        children: (<Overview isAdmin={isAdmin}/>),
        lineWidth: 3,
      },
      {
        key: '2',
        label: `收費/申請`,
        children: (
          <Space align="start" size={8}>
            <div className={styles.pcViewContainer}>
              <h5>待收月費</h5>
              <ChargeList isAdmin={isAdmin}/>
            </div>
            <div className={styles.pcViewContainer}>
              <h5>加入申請</h5>
              <WaitingList isAdmin={isAdmin}/>
            </div>
            <div className={styles.pcViewContainer}>
              <h5>跟單申請</h5>
              <Cptrader isAdmin={isAdmin}/>
            </div>
          </Space>
        ),
        lineWidth: 3,
      },
    ];
  }

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <h2>VIP會員管理</h2>
      </div>
      <div className={styles.formContainer}>
        { !isAdmin ? <h5>無管理員權限</h5> : 
        <Tabs 
          animated={false}
          defaultActiveKey={'1'}
          items={items}
          style={{ fontWeight: '700' }}
        />
        }
      </div>
      <footer>
      <p>
        技術支援 &copy; 2023 &nbsp;
        <a href="https://toriiitech.pse.is/co-wrote" target="_blank" rel="noopener noreferrer" style={{ color: "#24936E",  textalign: "left", fontWeight: 400 }}>
           鳥居科技 Toriii
        </a>
      </p>
      </footer>
    </div>
  );
};

export default Backstage;
// module.exports = Calculator;