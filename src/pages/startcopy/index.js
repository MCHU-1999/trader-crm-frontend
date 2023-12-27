// import * as dotenv from 'dotenv';
import process from 'process';
import React, { useState, useEffect, useRef } from 'react';
import styles from "./index.module.scss";
import { Input, Space, Form, Button, Select, Radio, Divider, Skeleton, Modal} from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from 'moment-timezone';
import { get, post } from '../../util/io';
import { encrypt } from '../../util/crypto';
import liff from "@line/liff";


const StartCopy = () => {
  const navigate = useNavigate();
  const header = { password: process.env.REACT_APP_API_PASSWORD };
  const userProfile = JSON.parse(localStorage.getItem("userProfile"));
  let userAgentString = navigator.userAgent;
  let isLIFF = userAgentString.indexOf("LIFF") > -1;

  const [ form ] = Form.useForm();
  const [ modalOpen, setModalOpen ] = useState(false);
  const [ withInputData, setWithInputData ] = useState(false);
  // const [ inputData, setInputData ] = useState({});
  const [ plan, setPlan ] = useState(undefined); 
  const [ loading, setLoading ] = useState(false);
  const [ agree, setAgree ] = useState(false);
  const [ copying, setCopying ] = useState([]);

  const showConfirm = () => {
    setModalOpen(true);
    Modal.confirm({
      title: '跟單前請確認您已閱讀過以下風險：',
      centered: true,
      icon: <ExclamationCircleFilled/>,
      content: (
        <div style={{ 
          width: '100%',
          height: 'calc(60vh)',
          overflowY: 'scroll',
        }}>
          <p><br/>
            　　本團隊作為「量化交易服務提供」的第三方角色，有關 OKX 平台內持有、買賣或交易虛擬通貨等行為，皆可能具有高度風險，且涉及高度波動性。並非所有的投資者都適合從事持有、買賣或交易虛擬通貨等行為。<br/><br/>
            　　本風險揭露及免責聲明（下稱「本聲明」），僅能簡要說明您在持有、買賣或交易虛擬通貨的過程中可能會涉及的部分風險事項，但無法窮盡列舉所有的風險及各種相關面向。建議您在持有或交易虛擬通貨前，必須考慮各種相關因素，包含但不限於您個人投資目標、投資經驗及您所能承擔的風險能力等。<br/><br/>
            　　本聲明內容可能無法隨時提供當時最正確、完整或最新之資訊，也可能會發生若干包括技術失準或其他等錯誤。因此所載的任何信息、內容或服務、任何第三方之資料或任何第三方網站上所載的任何信息、內容或服務，本公司概不負責。您在此確認並同意，本團隊對您所作出的任何決策、應由您自行核實所有訊息後作為您判斷或投資的依據，投資結果亦需由您自行負責。<br/><br/>
            　　本團隊亦無法擔保所提供的服務不會中斷，對於服務之及時性、安全性都不作擔保，且不承擔非因本團隊所導致的責任。<br/><br/>
            在使用本團隊的服務之前，您至少必須注意以下風險：<br/><br/>
            1. 流動性與交易風險：請注意，虛擬通貨的市場流動性可能存有很大的差異。如果市場交易量稀少，則其波動率可能會增大。現有的虛擬通貨交易市場未來可能會繼續存在，也可能停止經營不復存在。虛擬通貨的價值是波動，您有責任對您個人條件情形仔細評估，以避免造成您在虛擬通貨上的投資潛在損失。<br/><br/>
            2. 法律風險：依照使用者居住地不同，所適用的法律、虛擬通貨的保障可能是不確定的。您有責任自行諮詢律師或專業顧問，以瞭解持有、投資或交易虛擬通貨的法律地位和稅務待遇，並且，對於遵守任何及所有相關法律和稅務要求一事，使用者應自行負擔全部責任。<br/><br/>
            3. 交易對手風險：將虛擬通貨儲存於任何第三方交由其基於保管一事，可能會產生部分風險，包括但不限於安全漏洞、契約違約風險及損失等。<br/><br/>
            4. 網路安全風險：所有資訊技術系統、個人電腦、行動電話及/或網站，都可能會基於惡意駭客、病毒、特洛伊木馬、電腦程式或其他方式，而被入侵或遭未經授權進入。本團隊無法控制您訪問網站所使用的電腦、行動電話或終端機的安全性，對於確保上述電腦、行動電話或終端機應隨時處於安全狀態一事，使用者應自行負擔全部責任。<br/><br/>
            5. 網路及電子交易風險：關於使用本團隊的風險，可能包括由於任何電腦設備、硬體、軟體和網路連結造成無法傳輸或延遲傳輸，進而導致本網站延遲或故障的情形。<br/><br/>
            綜上所述，在使用量化交易服務時請確保以上風險在您的可控範圍內，並請詳閱本服務之公開說明。<br/>
          </p>
        </div>
      ),
      okText: '我已閱讀並同意以上聲明',
      cancelText: '取消',
      onOk() {
        setAgree(true);
      },
      onCancel() {
        setAgree(false);
        // liff.closeWindow();
      },
    });
  };


  const onSetPlan = (e) => {
    setPlan(e.target.value);
    console.log(e.target.value);
  }

  const onFinish = (values) => {
    let inputData = {
      lineId: userProfile.userId,
      strategy: plan,
      uid: values.uid,
      api: encrypt(JSON.stringify({
        apiKey: values.apiKey,
        apiSecret: values.apiSecret,
        passphrase: values.passphrase,
      }))
    };
    setWithInputData(true);
    setLoading(true);

    console.log('inputData: ', inputData);
    post(`${process.env.REACT_APP_API_URL}/copyTrade/newUser`, header, inputData)
    .then((resp)=>{
      setLoading(false);
      let data = resp.data.data;
      if (data === 'low equity') {
        window.toast.error('合約錢包資金不足3000');
      } else if (data === 'wrong key') {
        window.toast.error('API 資訊錯誤');
      } else if (data === 'unknown') {
        window.toast.error('發生未知的錯誤');
      } else if (data === 'ok') {
        // window.toast.success('使用者資料建立成功');
        if (inputData.strategy === '高倍VIP跟單') {
          liff.sendMessages([
            {
              type: "text",
              text: "高倍VIP跟單-資料已建立",
            },
          ]);
        } else if (inputData.strategy === 'VIP跟單') {
          liff.sendMessages([
            {
              type: "text",
              text: "VIP跟單-資料已建立",
            },
          ]);
        }
        navigate('/mycopy');
      }
    })
    .catch((errorMsg)=>{
      console.log(errorMsg);
    })
  };

  const onReset = () => {
    form.resetFields();
    // setInputData({});
    setWithInputData(false);
    setLoading(false);
  };

  useEffect(() => {
    if (!agree && !modalOpen) {
      showConfirm();
    }
    if ((copying.length === 0)) {
      post(`${process.env.REACT_APP_API_URL}/vip/userRole`, header, { lineId: userProfile.userId })
      .then((resp)=>{
        setCopying(resp.data.data);
      })
      .catch((errorMsg)=>{
        console.log(errorMsg);
      });
    }
  }, [ agree, userProfile ]);

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <h2>啟動跟單</h2>
        { isLIFF ? null : <p style={{ fontSize: '12px', color: 'white' }}>請使用line開啟此頁</p>}
      </div>
      <div className={styles.formContainer}>
        { agree?
          <>
            <h3>請選擇欲使用服務</h3>
            <Radio.Group value={plan} onChange={onSetPlan} buttonStyle="solid">
              <Radio.Button value="VIP跟單" disabled={ copying.includes("VIP跟單") }>
                VIP跟單
              </Radio.Button>
              <Radio.Button value="高倍VIP跟單" disabled={ copying.includes("高倍VIP跟單") }>
                高倍VIP跟單
              </Radio.Button>
            </Radio.Group>
            { plan === undefined ? null : plan === 'VIP跟單' ? 
              <>
                <p style={{ fontSize: 12 }}>最小本金1100U，若合約權益不足將無法跟單。</p>
                <p style={{ fontSize: 14, fontWeight: "600", color: "var(--highlight-red)" }}>
                  請注意：<br/>
                  跟單系統將自動調整您的倉位模式為『開平倉模式』，保證金模式調整為『全倉』，帳戶模式調整為『單幣種保證金模式』。<br/><br/>
                  進行跟單前請務必清空所有倉位，並隨時注意您的合約權益高於我們的建議值，若因您的帳號設定導致的財產損失將由您自行負責！
                </p>
              </>
              :
              <>
                <p style={{ fontSize: 12 }}>最小本金550U，若合約權益不足將無法跟單。</p>
                <p style={{ fontSize: 14, fontWeight: "600", color: "var(--highlight-red)" }}>
                  請注意：<br/>
                  跟單系統將自動調整您的倉位模式為『開平倉模式』，保證金模式調整為『全倉』，帳戶模式調整為『單幣種保證金模式』。<br/><br/>
                  進行跟單前請務必清空所有倉位，並隨時注意您的合約權益高於我們的建議值，若因您的帳號設定導致的財產損失將由您自行負責！
                </p>
              </>
            }
            <Divider style={{ margin: '24px 0px' }}/>
            <Form
              layout="vertical"
              form={form}
              name="start-copy-form"
              onFinish={onFinish}
              style={{ width: '100%' }}
            >
              <h3 style={{ paddingBottom: '4px' }}>輸入跟單用API資訊</h3>
              <p style={{ paddingBottom: '12px' }}>
                請於欲申請跟單之OKX帳號申請一組API，我們將經由您開通的AP進行交易及自動下單。
                （如欲跟單多個策略請使用子帳號搭配子帳號之API）
                <a href='https://adou-copytrade.gitbook.io/adou/services/manual/create-api-key'>如何申請API</a>
              </p>
              
              <Form.Item
                label="OKX UID"
                name="uid"
                rules={[{ required: true, message: '此為必填欄位！' }]}
              >
                <Input placeholder='765432109876543210' pattern='^[^\s].+[^\s]$' title='請檢查字元前後是否有空格' />
              </Form.Item>
    
              <Form.Item 
                label="API key"
                name="apiKey"
                rules={[{ required: true, message: '此為必填欄位！' }]}
              >
                <Input placeholder='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' pattern='^[^\s].+[^\s]$' title='請檢查字元前後是否有空格' />
              </Form.Item>
    
              <Form.Item 
                label="API secret（密鑰）"
                name="apiSecret"
                rules={[{ required: true, message: '此為必填欄位！' }]}
              >
                <Input placeholder='OKX api secret' pattern='^[^\s].+[^\s]$' title='請檢查字元前後是否有空格' />
              </Form.Item>
    
              <Form.Item
                label="API passphrase（密碼）"
                name="passphrase"
                rules={[{ required: true, message: '此為必填欄位！' }]}
              >
                <Input placeholder='OKX api passphrase' pattern='^[^\s].+[^\s]$' title='請檢查字元前後是否有空格' />
              </Form.Item>
    
              <Form.Item style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                marginBottom: 4
              }}>
                <Space style={{ marginTop: 20 }}>
                  <Button htmlType="button" onClick={onReset} disabled={loading}>
                    清除重設
                  </Button>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    送出資料
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </>
          :
          <Button key="showModal" type="default" danger onClick={showConfirm}>
            使用前需閱讀使用條款及風險聲明
          </Button>
        }
      </div>
    </div>
  );
};

export default StartCopy;
// module.exports = Calculator;