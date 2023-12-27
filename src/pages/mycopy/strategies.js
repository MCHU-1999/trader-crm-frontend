// import * as dotenv from 'dotenv';
import process from 'process';
import React, { useState, useEffect, useRef } from 'react';
// import styles from "./index.module.scss";
import { Input, Space, Tabs, Button, Select, Collapse, Divider, Empty, Modal } from 'antd';
import axios from "axios";
import moment from 'moment-timezone';
import { useNavigate } from "react-router-dom";
import { get, post } from '../../util/io';
import Diagram from './chart';

const Strategies = ({userData}) => {
  const [ items, setItems ] = useState([]);

  useEffect(() => {
    let item = [];
    if (userData === false) {
      // pass
    } else {
      for (let i=0; i<userData.strategy.length; i++) {
        let child = (
          <div>
            <h3>績效概覽</h3>
            <Space size={[40, 20]} align='top' style={{ flexWrap: 'wrap', margin: '0px', padding: '0px' }}>
              <div >
                <h5>初始資金</h5>
                <h4 style={{ color: 'var(--black-2)' }}>{userData.strategy[i].initialEquity} USDT</h4>
              </div>
              <div >
                <h5>總收益</h5>
                <h4 style={{ color: 'var(--black-2)' }}>{userData.strategy[i].pnl} USDT</h4>
              </div>
              <div >
                <h5>ROI</h5>
                <h4 style={{ color: 'var(--black-2)' }}>{userData.strategy[i].roi} %</h4>
              </div>
            </Space>
            <Divider style={{ margin: '12px 0px' }}/>
            <div>
              <h3>權益走勢（每小時更新）</h3>
              <Diagram data={userData.strategy[i]}/>
            </div>
          </div>
        );
        item.push({
          key: `${i+1}`,
          label: `${userData.strategy[i].strategyName}`,
          children: child,
        });
      }
      setItems(item);
    }
  },[userData]);

  return (
    <Collapse items={items} bordered={false} defaultActiveKey={['1']}/>
  )
};

export default Strategies;