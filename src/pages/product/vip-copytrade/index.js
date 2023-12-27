// import * as dotenv from 'dotenv';
import process from 'process';
import React, { useState, useEffect, useRef } from 'react';
import styles from "./index.module.scss";
import { Input, Space, Form, Button, Select, DatePicker, Divider, Skeleton, Radio} from 'antd';
import axios from "axios";
import moment from 'moment-timezone';
import { get, post } from '../../../util/io'
import Diagram from './chart'


const Vip = () => {
  const [ withData, setWithData ] = useState(false);
  const [ vipDataA, setVipDataA ] = useState({});
  const [ vipDataB, setVipDataB ] = useState({});
  const header = {
    password: process.env.REACT_APP_API_PASSWORD,
  };

  if (withData === false) {
    get(`${process.env.REACT_APP_API_URL}/copyTrade/performance/demo`, header)
    .then((resp)=>{
      let data = resp.data.data[0].data;
      setWithData(true);
      setVipDataA(data[0]);
      setVipDataB(data[1]);
      // console.log(data);
    })
    .catch((errorMsg)=>{
      console.log(errorMsg);
    })
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.chartContainer}>
        <h2 style={{ paddingTop: '12px' }}>VIP社群跟單服務 - OKX</h2>
        <div className={styles.space}>
          <div className={styles.performance}>
            <h5>AI量化交易</h5>
            <p>此策略屬低風險穩健策略，融合13種不同技術分析方法交由AI做交叉驗證（Cross Validation），依據市場行情找出最適合的策略並採用。</p>
          </div>
          <Diagram data={vipDataA} color='YellowGreen'/>
          <Divider style={{ margin: '12px 0px' }}/>
          <div className={styles.performance}>
            <h5>阿兜主觀交易</h5>
            <p>除擁有八年交易經驗外，更為現職私募基金操盤手。阿兜屬於訂單流和價格行為交易員，亦會依照消息面、鏈上數據、道瓊、美元美債狀況進行相關性分析，以確保策略彈性適應市場。</p>
          </div>
          <Diagram data={vipDataB} color='#24936E'/>
          <Divider style={{ margin: '12px 0px' }}/>
        </div>
        <Button ghost type="primary" href='https://adou-copytrade.gitbook.io/adou/services/vip-copytrade'>
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

export default Vip;
// module.exports = Calculator;