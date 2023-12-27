import { Avatar, List, Button, Modal } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { EditOutlined, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { get, post } from '../../util/io';
import moment from 'moment-timezone';


const App = ({isAdmin}) => {
  const [ listData, setListData ] = useState(undefined);
  const [ modalOpenA, setModalOpenA ] = useState(false);
  const [ modalOpenR, setModalOpenR ] = useState(false);
  const [ id, setId ] = useState("");
  const header = { password: process.env.REACT_APP_API_PASSWORD };


  // Modal
  const showModalA = (id) => {
    setModalOpenA(true);
    setId(id);
    // console.log(`id: ${id}`);
  };
  const showModalR = (id) => {
    setModalOpenR(true);
    setId(id);
    // console.log(`id: ${id}`);
  };
  const handleApprove = () => {
    post(`${process.env.REACT_APP_API_URL}/vip/confirm`, header, { lineId: id })
    .then((resp)=>{
      if (resp.data.status === 'success') {
        get(`${process.env.REACT_APP_API_URL}/vip/waitingList`, header)
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
    post(`${process.env.REACT_APP_API_URL}/vip/removeWaiting`, header, { lineId: id })
    .then((resp)=>{
      if (resp.data.status === 'success') {
        get(`${process.env.REACT_APP_API_URL}/vip/waitingList`, header)
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

  const Actions = ({lineId}) => {
    return (
      <div style={{ display: "flex", gap: 8 }}>
        <Button key="edit" type="default" onClick={() => {showModalA(lineId)}}>
          {<CheckCircleOutlined />}
          {/* 確認收款 */}
        </Button>
        <Button key="remove" type="primary" onClick={() => {showModalR(lineId)}} danger>
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
      get(`${process.env.REACT_APP_API_URL}/vip/waitingList`, header)
      .then((resp)=>{
        setListData(resp.data.data);
      })
      .catch((errorMsg)=>{
        console.log(errorMsg);
      });
    }
  }

  return (
    <>
      <Modal title="調整 VIP 會員方案" open={modalOpenA} onCancel={handleCancelA}
        footer={[
          <Button key="cancel" type="default" onClick={handleCancelA}>
            取消
          </Button>,
          <Button key="adjust" type="primary" onClick={handleApprove}>
            確認收款
          </Button>,
        ]}
      >
        <p>請確定已收到此會員費用</p>
      </Modal>

      <Modal title="確認移除此會員" open={modalOpenR} onCancel={handleCancelR}
        footer={[
          <Button key="cancel" type="default" onClick={handleCancelR}>
            取消
          </Button>,
          <Button key="remove" type="primary" onClick={handleRemove} danger>
            確認移除
          </Button>,
        ]}
      >
        <p>確定要移除此申請者嗎？</p>
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
          <List.Item actions={[<Actions lineId={item.lineUserId}/>]} style={{ padding: 12 }}>
            <List.Item.Meta
              avatar={<Avatar size={"large"} src={item.linePFP}/>}
              title={item.lineUserName}
              description={<p>{item.vipPlan}</p>}
            />
          </List.Item>
        )}
      />
    </>
  );
}

export default App;