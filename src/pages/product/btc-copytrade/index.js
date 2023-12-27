// import * as dotenv from 'dotenv';
import process from 'process';
import React, { useState, useEffect, useRef } from 'react';
import styles from "./index.module.scss";
import { Input, Space, Form, Button, Select, Avatar, Divider, Collapse} from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import axios from "axios";
import moment from 'moment-timezone';
import { get, post } from '../../../util/io';
import Diagram from './chart';


const BtcCopytrade = () => {
  const [ withData, setWithData ] = useState(false);
  const [ vipDataA, setVipDataA ] = useState({});
  const [ vipDataB, setVipDataB ] = useState({});
  const header = {
    password: process.env.REACT_APP_API_PASSWORD,
  };

  if (withData === false) {
    get(`${process.env.REACT_APP_API_URL}/copyTrade/performance/btc`, header)
    .then((resp)=>{
      let data = resp.data.data;
      console.log(data[0]);
      setWithData(true);
      setVipDataA(data[0]);
      // setVipDataB(data[1]);
    })
    .catch((errorMsg)=>{
      console.log(errorMsg);
    })
  }

  const items = [
    {
      key: `1`,
      label: (
        <Space size={[12, 0]} style={{ flexWrap: 'wrap', margin: '0px', padding: '0px' }}>
          <Avatar size="small" src={`https://static-app.bb-os.com/avatar/20231002/27f40314f1ae9323112493797425f2e8.jpg?x-oss-process=image/resize,h_320,m_lfit`} />
          <p>10/11 BTC抄底列車 - 1</p>
        </Space>
      ),
      children: (
        <div>
          <Space size={[40, 20]} align='top' style={{ flexWrap: 'wrap', margin: '0px 8px', padding: '0px' }}>
            <div >
              <h5>初始資金</h5>
              <h4 style={{ color: 'var(--black-2)' }}>{ vipDataA.initialEquity } U</h4>
            </div>
            <div >
              <h5>總收益</h5>
              <h4 style={{ color: 'var(--black-2)' }}>{ vipDataA.pnl } U</h4>
            </div>
            <div >
              <h5>ROI</h5>
              <h4 style={{ color: 'var(--black-2)' }}>{ vipDataA.roi } %</h4>
            </div>
          </Space>
          <Divider style={{ margin: '20px 0px' }}/>
          <Diagram data={vipDataA} color='SeaGreen'/>
        </div>
      ),
      extra: (
        <Button target="_blank" size="small" shape="circle" type="default" href='https://general.bingx.com/1VwwzH'>
          <LinkOutlined />
        </Button>
      )
    },
    {
      key: `2`,
      label: (
        <Space size={[12, 0]} style={{ flexWrap: 'wrap', margin: '0px', padding: '0px' }}>
          <Avatar size="small" src={`https://static-app.bb-os.com/avatar/20231002/27f40314f1ae9323112493797425f2e8.jpg?x-oss-process=image/resize,h_320,m_lfit`} />
          <p>11/11 BTC抄底列車 - 2</p>
        </Space>
      ),
      children: (
        <div>
          <p>尚未啟動</p>
          {/* <Diagram data={vipDataA} color='SeaGreen'/> */}
        </div>
      ),
      extra: (
        <Button target="_blank" size="small" shape="circle" type="default" disabled href='https://general.bingx.com/1VwwzH'>
          <LinkOutlined />
        </Button>
      )
    },
  ];
  
  return (
    <div className={styles.container}>
      <div className={styles.chartContainer}>
        <h2 style={{ paddingTop: '12px' }}>BTC抄底策略 - BingX 跟單</h2>
        <p>距離第四次比特幣減半剩餘不足一年，多數交易者以及機構將此視為BTC牛市的某個起漲點或催化劑。BTC抄底策略便是在此一假設之下應運而生的策略，目的是要幫助使用者在BTC價格低點進場，並在長期持倉後高價出場。</p>
        <div className={styles.space}>
          <Collapse items={items} bordered={false} defaultActiveKey={['1']} style={{ width: '100%' }}/>
          <Divider style={{ margin: '12px 0px' }}/>
        </div>
        <Button ghost type="primary" href='https://adou-copytrade.gitbook.io/adou/services/btc-strategy'>
          查看詳細產品文件
        </Button>
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

export default BtcCopytrade;