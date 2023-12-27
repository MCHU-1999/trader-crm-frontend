// import * as dotenv from 'dotenv';
import process from 'process';
import React, { useState, useEffect, useRef } from 'react';
import styles from "./index.module.scss";
import { Input, Space, Form, Button, Select, Collapse, Divider, Empty, Modal} from 'antd';
import axios from "axios";
import moment from 'moment-timezone';
import { useNavigate } from "react-router-dom";
import { get, post } from '../../util/io';
import Diagram from './chart';
import Strategies from './strategies';
import liff from "@line/liff";

const defaultUserData = {
  state: "default",
  strategy: []
}

const MyCopy = () => {
  const navigate = useNavigate();
  const [ modalOpen, setModalOpen ] = useState(false);
  const [ userData, setUserData ] = useState(defaultUserData);
  const userProfile = JSON.parse(localStorage.getItem("userProfile"));
  const header = { password: process.env.REACT_APP_API_PASSWORD };
  let userAgentString = navigator.userAgent;
  let isLIFF = userAgentString.indexOf("LIFF") > -1;

  if (userProfile !== null || userProfile !== undefined) {
    console.log(userProfile);
    if (userData.state === "default") {
      post(`${process.env.REACT_APP_API_URL}/copyTrade/getUserData`, header, { lineId: userProfile.userId })
      .then((resp)=>{
        if (Object.keys(resp.data.data).length === 0) {
          setUserData(defaultUserData);
        } else {
          setUserData(resp.data.data);
          console.log('U DATA');
        }
      });
    }
  } else {
    // pass
  }

  // Adjust modal
  const showModal = () => {
    setModalOpen(true);
  };
  const handleAdjust = () => {
    setModalOpen(false);
    liff.sendMessages([
      {
        type: "text",
        text: "調整跟單",
      },
    ])
    .then(() => {
      liff.closeWindow();
    });
  };
  const handleStopCopy = () => {
    setModalOpen(false);
    liff.sendMessages([
      {
        type: "text",
        text: "停止跟單",
      },
    ])
    .then(() => {
      liff.closeWindow();
    });
  };
  const handleCancel = () => {
    setModalOpen(false);
  };

  return (
    <div className={styles.main}>
      <Modal title="調整倉位 / 停止跟單" open={modalOpen} onCancel={handleCancel}
        footer={[
          <Button key="adjust" type="primary" onClick={handleAdjust}>
            資金/倉位調整
          </Button>,
          <Button key="stop" type="primary" danger onClick={handleStopCopy}>
            停止跟單
          </Button>,
        ]}
      >
        <p>量化策略最少使用三個月才能看出長期績效，團隊將嚴格控管回撤績效，最大回撤控制在10%之內，若要停止服務或調整倉位，須先與團隊聯絡。</p>
        <p>請選擇您欲執行的操作：</p>
      </Modal>
      <div className={styles.header}>
        <h2>我的跟單</h2>
        { isLIFF ? null : <p style={{ fontSize: '12px', color: 'white' }}>請使用line開啟此頁</p>}
      </div>
      { userData.strategy.length !== 0 ?
      <div className={styles.data}>
        <Strategies userData={userData}/>
        <>
          <Divider style={{ margin: '12px 0px' }}/>
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'end',
            }}>     
            <Space size={[12, 20]} align='start' style={{ flexWrap: 'wrap', margin: '0px', padding: '0px' }}>
              <Button type="default" onClick={showModal} disabled={ !isLIFF }>
                加倉/停止跟單
              </Button>
            </Space>
          </div>
        </>
      </div>
      :
      <div className={styles.data}>
        <Empty description={ "您尚未啟動社群跟單服務" }/>
        <Button type="primary"onClick={() => {navigate('/product')}}>
          前往產品列表
        </Button>
      </div>
      }
    </div>
  );
};

export default MyCopy;