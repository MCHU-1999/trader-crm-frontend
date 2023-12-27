// import * as dotenv from 'dotenv';
import process from 'process';
import React, { useState, useEffect, useRef } from 'react';
import styles from "./index.module.scss";
import { Input, Space, Form, Button, Select, Radio, Divider, Skeleton, Modal, Card} from 'antd';
import { CopyOutlined, ExclamationCircleFilled, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { get, post } from '../../util/io';
import liff from "@line/liff";


const SignUp = () => {
  const userProfile = JSON.parse(localStorage.getItem("userProfile"));
  let userAgentString = navigator.userAgent;
  let isLIFF = userAgentString.indexOf("LIFF") > -1;

  const [ withInputData, setWithInputData ] = useState(false);
  const [ inputData, setInputData ] = useState({});
  const [ plan, setPlan ] = useState("普通方案"); 
  const [ loading, setLoading ] = useState(false);

  const onSetPlan = (e) => {
    setPlan(e.target.value);
  }

  const copyText = () => {
    // Copy the text inside the text field
    navigator.clipboard.writeText("THV7BfNnEr9E7ncsEkrvvmfJGRjFxqUYW8");
    window.toast.success('TRC地址已複製');
  }

  const howmuch = () => {
    switch (plan) {
      case "普通方案":
        return "提幣 200U 至以下TRC地址並截圖紀錄";
      case "學生方案":
        return "提幣 150U 至以下TRC地址並截圖紀錄";
      case "體驗方案":
        return "提幣 70U 至以下TRC地址並截圖紀錄";
      default:
        return "提幣 200U 至以下TRC地址";
    }
  }

  const done = () => {
    setInputData({
      lineId: userProfile.userId,
      lineUserName: userProfile.displayName,
      linePFP: userProfile.pictureUrl,
      plan: plan,
    });
    // console.log({
    //   lineId: userProfile.userId,
    //   lineUserName: userProfile.displayName,
    //   linePFP: userProfile.pictureUrl,
    //   plan: plan,
    // });
    setWithInputData(true);
    setLoading(true);
  }

  useEffect(() => {
    let header = {
      password: process.env.REACT_APP_API_PASSWORD,
    };
    if (withInputData) {
      console.log('inputData: ', inputData);
      post(`${process.env.REACT_APP_API_URL}/vip/signUp`, header, inputData)
      .then((resp) => {
        setLoading(false);
        let status = resp.data.status;
        if (status === 'success') {
          liff.sendMessages([
            {
              type: "text",
              text: "加入申請",
            },
          ])
          .then(() => {
            liff.closeWindow();
          });
        } else {
          window.toast.error('系統錯誤，請稍候再試');
        }
      })
      .catch((errorMsg)=>{
        console.log(errorMsg);
      })
    }
  }, [inputData, withInputData]);

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <h2>申請加入VIP</h2>
        { isLIFF ? null : <p style={{ fontSize: '12px', color: 'white' }}>請使用line開啟此頁</p>}
      </div>
      <div className={styles.formContainer}>
        <>
          <h4>入群方案</h4>
          <Card>
            <p>
            🔴 普通方案：
            200U / 三個月
            <br/><br/>
            🔴 學生方案：
            150U / 三個月<br/>
            （提幣後於官方帳號內驗證身分）
            <br/><br/>
            🔴 體驗方案：
            70U / 一個月
            </p>
          </Card>
          <Divider/>
          <h4>付費流程</h4>
          <p>1️⃣ 於下方選單選擇方案</p>
          <Radio.Group value={plan} onChange={onSetPlan} buttonStyle="default" style={{ width: "100%" }}>
            <Radio.Button value="普通方案">
              普通方案
            </Radio.Button>
            <Radio.Button value="學生方案">
              學生方案
            </Radio.Button>
            <Radio.Button value="體驗方案">
              體驗方案
            </Radio.Button>
          </Radio.Group>
          <p><br/>2️⃣ {howmuch()}</p>
          <Button key="copyText" type="default" onClick={copyText} style={{ fontWeight: 500 }}>
            THV7BfNnEr9E7ncsEkrvvmfJGRjFxqUYW8
            {/* {<CopyOutlined/>} */}
          </Button>
          <p><br/>3️⃣ 點擊以下『我已轉帳』按鈕，並於聊天室內附上提幣紀錄圖，審核通過後管理員會立即將您加入社群</p>
          <Button key="done" type="primary" onClick={done} disabled={loading} size='large'>
            我已轉帳 {<CheckCircleOutlined />}
          </Button>
        </>
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

export default SignUp;
// module.exports = Calculator;