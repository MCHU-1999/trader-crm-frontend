import { Avatar, List, Button, Modal, Select, DatePicker } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect, useRef } from 'react';
import { get, post } from '../../util/io';
import moment from 'moment-timezone';


const App = ({isAdmin}) => {
  const [ listData, setListData ] = useState(undefined);
  const [ modalOpenA, setModalOpenA ] = useState(false);
  const [ modalOpenR, setModalOpenR ] = useState(false);
  const [ id, setId ] = useState("");
  const [ str, setStr ] = useState("");
  const header = { password: process.env.REACT_APP_API_PASSWORD };

  const showModalA = (id, strategyName) => {
    setModalOpenA(true);
    setId(id);
    setStr(strategyName);
    // console.log(`id: ${id}`);
  };
  const showModalR = (id, strategyName) => {
    setModalOpenR(true);
    setId(id);
    setStr(strategyName);
    // console.log(`id: ${id}`);
  };
  const handleApprove = () => {
    post(`${process.env.REACT_APP_API_URL}/vip/confirmWaitingCP`, header, { lineId: id, strategyName: str })
    .then((resp)=>{
      if (resp.data.status === 'success') {
        get(`${process.env.REACT_APP_API_URL}/vip/waitingCP`, header)
        .then((resp)=>{
          setListData(resp.data.data);
        })
        .catch((errorMsg)=>{
          console.log(errorMsg);
        });
      } else {
        window.toast.error("發生錯誤");
      }
    })
    .catch((errorMsg)=>{
      console.log(errorMsg);
    });
    setModalOpenA(false);
  };
  const handleRemove = () => {
    post(`${process.env.REACT_APP_API_URL}/vip/removeCP`, header, { lineId: id, strategyName: str })
    .then((resp)=>{
      if (resp.data.status === 'success') {
        get(`${process.env.REACT_APP_API_URL}/vip/waitingCP`, header)
        .then((resp)=>{
          setListData(resp.data.data);
        })
        .catch((errorMsg)=>{
          console.log(errorMsg);
        });
      } else {
        window.toast.error("發生錯誤");
      }
      setModalOpenR(false);
    })
    .catch((errorMsg)=>{
      console.log(errorMsg);
    });
  };
  const handleCancelA = () => {
    setModalOpenA(false);
    setId("");
  };
  const handleCancelR = () => {
    setModalOpenR(false);
    setId("");
  };
  const paydayColor = (due) => {
    const now = Number(moment( Date.now() ).tz("Asia/Taipei").format("X"));
    const dueTS = Number(moment(`${ due } 23:59:59`).tz("Asia/Taipei").format("X"));
    if (now > dueTS) {
      return '#ff4d4f';
    } else {
      return 'rgba(0, 0, 0, 0.45)';
    }
  }

  const Actions = ({lineId, strategyName}) => {
    return (
      <div style={{ display: "flex", gap: 8 }}>
        <Button key="edit" type="default" onClick={() => {showModalA(lineId, strategyName)}}>
          {<CheckCircleOutlined />}
        </Button>
        <Button key="remove" type="primary" onClick={() => {showModalR(lineId, strategyName)}} danger>
          {<CloseCircleOutlined />}
        </Button>
      </div>
    );
  };

  if (isAdmin === true) {
    let header = {
      password: process.env.REACT_APP_API_PASSWORD,
    };
    if (listData === undefined) {
      get(`${process.env.REACT_APP_API_URL}/vip/waitingCP`, header)
      .then((resp)=>{
        console.log(resp.data.data);
        setListData(resp.data.data);
      })
      .catch((errorMsg)=>{
        console.log(errorMsg);
      });
    }
  }

  return (
    <>
      <Modal title="確認跟單申請" open={modalOpenA} onCancel={handleCancelA}
        footer={[
          <Button key="cancel" type="default" onClick={handleCancelA}>
            取消
          </Button>,
          <Button key="adjust" type="primary" onClick={handleApprove}>
            啟動跟單
          </Button>,
        ]}
      >
        <p>請確定已核對此會員之OKX帳號。</p>
      </Modal>

      <Modal title="移除跟單申請" open={modalOpenR} onCancel={handleCancelR}
        footer={[
          <Button key="cancel" type="default" onClick={handleCancelR}>
            取消
          </Button>,
          <Button key="remove" type="primary" onClick={handleRemove} danger>
            確認移除
          </Button>,
        ]}
      >
        <p>確定要移除此跟單申請嗎？</p>
      </Modal>

      <List
        pagination={{
          position: 'bottom',
          align: 'center',
          hideOnSinglePage: true,
          pageSize: 10,
        }}
        bordered
        itemLayout="horizontal"
        dataSource={ isAdmin ? listData : [] }
        renderItem={(item, index) => (
          <List.Item actions={[<Actions lineId={item.lineUserId} strategyName={item.strategyName}/>]} style={{ padding: 12 }}>
            <List.Item.Meta
              avatar={<Avatar size={"large"} src={item.linePFP}/>}
              title={item.lineUserName}
              description={
                <>
                  <p>{item.strategyName}</p>
                  {/* <p style={{ color: paydayColor(item.due) }}>{item.payday}<br/>- {item.due}</p> */}
                </>
              }
            />
          </List.Item>
        )}
      />
    </>
  );
}

export default App;