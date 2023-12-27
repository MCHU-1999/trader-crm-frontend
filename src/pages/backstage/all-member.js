import { Avatar, List, Button, Modal, Select, DatePicker, Tag, Divider } from 'antd';
import RangePicker3d from "../../components/rangepicker3d";
import { EditOutlined, CloseCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect, useRef } from 'react';
import { get, post } from '../../util/io';
import moment from 'moment-timezone';
import * as dayjs from 'dayjs';
dayjs().format();

const defaultCurrentUser = {
  id: undefined,
  plan: undefined,
  payday: undefined,
  due: undefined,
}

const App = ({isAdmin}) => {
  const [ listData, setListData ] = useState(undefined);
  const [ modalOpenE, setModalOpenE ] = useState(false);
  const [ modalOpenR, setModalOpenR ] = useState(false);
  const [ currentUser, setCurrentUser ] = useState(defaultCurrentUser);
  const [ currentPage, setCurrentPage ] = useState(1);

  const header = { password: process.env.REACT_APP_API_PASSWORD };

  // Modal
  const showModalE = (index) => {
    setCurrentUser({
      id: listData[index].lineUserId,
      plan: listData[index].vipPlan,
      payday: listData[index].payday,
      due: listData[index].due,
    });
    setModalOpenE(true);
  };
  const showModalR = (index) => {
    // console.log(listData[index]);
    setCurrentUser({
      id: listData[index].lineUserId,
      plan: listData[index].vipPlan,
      payday: listData[index].payday,
      due: listData[index].due,
    });
    setModalOpenR(true);
  };
  const handleAdjust = () => {
    post(`${process.env.REACT_APP_API_URL}/vip/updatePlan`, header, { lineId: currentUser.id, plan: currentUser.plan, payday: currentUser.payday, due: currentUser.due })
    .then((resp)=>{
      if (resp.data.status === 'success') {
        get(`${process.env.REACT_APP_API_URL}/vip/allMember`, header)
        .then((resp)=>{
          setListData(resp.data.data);
          console.log('update all user data');
        })
        .catch((errorMsg)=>{
          console.log(errorMsg);
        });
      } else {
        window.toast.error("發生錯誤");
      }
      setModalOpenE(false);
    })
    .catch((errorMsg)=>{
      console.log(errorMsg);
    });
  };
  const handleRemove = () => {
    post(`${process.env.REACT_APP_API_URL}/vip/removeVip`, header, { lineId: currentUser.id })
    .then((resp)=>{
      if (resp.data.status === 'success') {
        get(`${process.env.REACT_APP_API_URL}/vip/allMember`, header)
        .then((resp)=>{
          setListData(resp.data.data);
          console.log('update all user data');
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
  const handleCancelE = () => {
    setModalOpenE(false);
    setCurrentUser(defaultCurrentUser);
  };
  const handleCancelR = () => {
    setModalOpenR(false);
    setCurrentUser(defaultCurrentUser);
  };
  const onSetPlan = (value) => {
    // setPlan(value);
    setCurrentUser({
      id: currentUser.id,
      plan: value,
      payday: currentUser.payday,
      due: currentUser.due,
    });
  }
  const onSetPayday = (value) => {
    // console.log(value);
    let payday = value.format('YYYY-MM-DD');
    let due = value.add(3, 'day').format('YYYY-MM-DD');
    setCurrentUser({
      id: currentUser.id,
      plan: currentUser.plan,
      payday: payday,
      due: due,
    });
  }
  const paydayColor = (due) => {
    const now = Number(moment( Date.now() ).tz("Asia/Taipei").format("X"));
    const dueTS = Number(moment(`${ due } 23:59:59`).tz("Asia/Taipei").format("X"));
    if (now > dueTS) {
      return '#ff4d4f';
    } else {
      return 'rgba(0, 0, 0, 0.45)';
    }
  }

  const PlanTag = ({plan}) => {
    var C;
    if (plan === "普通方案") {
      C = '#20ABA4';
    } else if (plan === "學生方案") {
      C = '#1F84A1';
    } else {
      C = '#999999';
    }
    return (
      <Tag color={C}>
        {plan}
      </Tag>
    );
  }

  const Actions = ({index}) => {
    return (
      <div style={{ display: "flex", gap: 8 }}>
        <Button key="edit" type="default" onClick={() => {showModalE(index)}}>
          {<EditOutlined />}
          {/* 編輯 */}
        </Button>
        <Button key="remove" type="primary" onClick={() => {showModalR(index)}} danger>
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
      get(`${process.env.REACT_APP_API_URL}/vip/allMember`, header)
      .then((resp)=>{
        setListData(resp.data.data);
      })
      .catch((errorMsg)=>{
        console.log(errorMsg);
      });
    }
  } 
  const customFormat = () => `${currentUser.payday} ~ ${currentUser.due}`;

  return (
    <>
      <Modal title="調整 VIP 會員方案" open={modalOpenE} onCancel={handleCancelE}
        footer={[
          <Button key="cancel" type="default" onClick={handleCancelE}>
            取消
          </Button>,
          <Button key="adjust" type="primary" onClick={handleAdjust}>
            變更方案
          </Button>,
        ]}
      >
        <h4 style={{ color: "#666666", marginTop: "20px"  }}>調整方案</h4>
        <Select style={{ width: "100%", marginTop: "8px" }}
          onChange={onSetPlan}
          placeholder="選擇方案"
          value={currentUser.plan}
          options={[
            {
              value: '普通方案',
              label: '普通方案',
            },
            {
              value: '學生方案',
              label: '學生方案',
            },
            {
              value: '體驗方案',
              label: '體驗方案',
            },
          ]}
        />
        <Divider />
        <h4 style={{ color: "#666666" }}>調整繳費期間</h4>
        <DatePicker 
          cellRender={(current, info) => {
            if (info.type !== 'date') return info.originNode;
            const style = {};
            let yearAndMonth = currentUser.payday.split('-');
            let date = Number(yearAndMonth[2]);
            yearAndMonth = yearAndMonth[0] + '-' + yearAndMonth[1];
            if (current.format("YYYY-MM") === yearAndMonth) {
              if (current.format("YYYY-MM-DD") === currentUser.payday ) {
                style.border = '1px solid #24936E';
                style.backgroundColor = '#24936E';
              } else if (current.date() >= date && current.date() <= date+3) {
                style.border = '1px solid #79E0BE';
                style.backgroundColor = '#79E0BE';
                style.color = 'white';
              }
            }
            return (
              <div className="ant-picker-cell-inner" style={style}>
                {current.date()}
              </div>
            );
          }}
          placeholder='繳費日期'
          format={customFormat}
          onChange={onSetPayday}
          value={dayjs(currentUser.payday)}
          style={{ width: "100%", marginTop: "8px" }}
        />
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
        <p>確定要移除此會員身分嗎？</p>
      </Modal>
      <List
        pagination={{
          position: 'bottom',
          align: 'center',
          hideOnSinglePage: true,
          pageSize: 5,
          onChange: page => {
            setCurrentPage(page);
          },
        }}
        bordered
        itemLayout="horizontal"
        dataSource={ isAdmin ? listData : [] }
        renderItem={(item, index) => {
          const serialIndex = (currentPage - 1) * 5 + index;
          return (
            <List.Item actions={[<Actions index={serialIndex}/>]} style={{ padding: 12 }}>
              <List.Item.Meta
                avatar={<Avatar size={"large"} src={item.linePFP}/>}
                title={
                  <p style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {item.lineUserName}
                  </p>
                }
                description={
                  <>
                    <PlanTag plan={item.vipPlan}/>
                    <p style={{ color: paydayColor(item.due), fontSize: '10px' }}>{item.payday}<br/>~ {item.due}</p>
                  </>
                }
              />
            </List.Item>
          );
        }}
      />
    </>
  );
}

export default App;