// import * as dotenv from 'dotenv';
import process from 'process';
import React, { useState, useEffect, useRef } from 'react';
import styles from "./index.module.scss";
import { Input, Space, Form, Button, Select, DatePicker, Divider, Card, Slider} from 'antd';
import moment from 'moment-timezone';


const VipOpenchat = () => {
  return (
    <div className={styles.container}>
      <div className={styles.chartContainer}>
        <h2 style={{ paddingTop: '12px' }}>VIP 會員賦能</h2>
        <div className={styles.performance}>
          <img src={"https://storage.googleapis.com/toriii-crm-images/images/app-mockup_1.png"} alt="VIP社群示意圖" className={styles.mockupImg} loading='lazy'/>
          <Card>
            <div>
              <p>
              阿兜VIP社群涵蓋：<br/>🔴 LINE VIP報單群<br/>🔴 TAQA群<br/>🔴 Discord VIP身分組
              </p>
            </div>
          </Card>
          <Card>
            <div>
              <p>
              報單群提供AI量化以及主觀交易報單，兩種精選策略詳盡報單點位。
              <br/><br/>
              TAQA群（子聊天室）用於討論行情、技術分析學習、阿兜即時QA以及總體經濟討論，供大家一起交流！
              <br/><br/>
              除LINE報單和TAQA群外，另有開放Discord VIP教學區，把近期的交易機會以課程化的方式呈現在DC群，VIP會員將能輕鬆邊學邊賺！
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VipOpenchat;
// module.exports = Calculator;