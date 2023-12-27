// import * as dotenv from 'dotenv';
import process from 'process';
import React, { useState, useEffect, useRef } from 'react';
import styles from "./index.module.scss";
import { Input, Space, Form, Button, Select, DatePicker, Divider, Tabs } from 'antd';
import axios from "axios";
import moment from 'moment-timezone';
import { get, post } from '../../util/io'
import Vip from './vip-copytrade';
// import VipOpenchat from './vip-chat';
import BtcCopytrade from './btc-copytrade';
import StickyBox from 'react-sticky-box';
import { string } from 'mathjs';
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowRightOutlined } from '@ant-design/icons';
import liff from "@line/liff";


const Product = ({defaultKey}) => {
  const navigate = useNavigate();
  const [ copying, setCopying ] = useState(undefined);
  const userProfile = JSON.parse(localStorage.getItem("userProfile"));
  // liff.sendMessages([{ type: "text", text: "localStorage.getItem" }]);
  let userAgentString = navigator.userAgent;
  let isLIFF = userAgentString.indexOf("LIFF") > -1;

  const renderTabBar = (props, DefaultTabBar) => (
    <StickyBox className={styles.header}>
      <DefaultTabBar {...props}/>
    </StickyBox>
  );

  useEffect(() => {
    if (copying === undefined && userProfile.userId !== undefined) {
      // liff.sendMessages([{ type: "text", text: "useEffect" }]);
      let header = { password: process.env.REACT_APP_API_PASSWORD, };
      post(`${process.env.REACT_APP_API_URL}/vip/userRole`, header, { lineId: userProfile.userId })
      .then((resp)=>{
        setCopying(resp.data.data);
      })
      .catch((errorMsg)=>{
        console.log(errorMsg);
      });
    }
  }, [userProfile, copying]);


  const Operations = () => {
    if (copying === 'not found' || !isLIFF ) {
    // if (copying === 'not found') {
      return (
        <Button
          disabled={copying === undefined}
          type="primary"
          icon={<ArrowRightOutlined />}
          onClick={() => {navigate('/signup')}}
        >
          加入VIP
        </Button>
      )
    } else {
      return (
        <Button
          disabled={copying === undefined}
          type="default"
          icon={<ArrowRightOutlined />}
          onClick={() => {navigate('/startcopy')}}
        >
          啟動跟單
        </Button>
      )
    }
  }

  const items = [
    {
      key: '1',
      label: `VIP跟單`,
      children: (<Vip/>),
      lineWidth: 3,
    },
    {
      key: '2',
      label: `BTC抄底策略`,
      children: (<BtcCopytrade/>),
      lineWidth: 3,
    },
  ];

  return (
    <div className={styles.main}>
      <Tabs 
        animated={false}
        className={styles.tab}
        defaultActiveKey={String(defaultKey)}
        renderTabBar={renderTabBar}
        items={items}
        style={{ fontWeight: '700' }}
        tabBarExtraContent={<Operations />}
      />
    </div>
    
  );
};

export default Product;