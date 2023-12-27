import { Table, Avatar, Tag, Button, Modal, Select, DatePicker, Divider, Input, Radio, Space } from 'antd';
import RadioGroup from "../../components/radioGroup";
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
  strategy: [],
}

const Overview = ({isAdmin}) => {
  const [ userData, setUserData ] = useState(undefined);
  const [ tableData, setTableData ] = useState(undefined);
  const [ modalOpenE, setModalOpenE ] = useState(false);
  const [ modalOpenR, setModalOpenR ] = useState(false);
  const [ modalOpenRCP, setModalOpenRCP ] = useState(false);
  const [ strategyToRemove, setStrategyToRemove ] = useState(undefined);
  const [ currentUser, setCurrentUser ] = useState(defaultCurrentUser);
  const header = { password: process.env.REACT_APP_API_PASSWORD };

  const columns = [
    {
      title: '用戶',
      dataIndex: 'user',
      width: '10%',
    },
    {
      title: '所選方案',
      dataIndex: 'plan',
      width: '5%',
      render: (text) => <PlanTag plan={text} />,
      filters: [
        {
          text: '普通方案',
          value: '普通方案',
        },
        {
          text: '學生方案',
          value: '學生方案',
        },
        {
          text: '體驗方案',
          value: '體驗方案',
        },
      ],
      onFilter: (value, record) => record.plan.indexOf(value) > -1,
    },
    {
      title: '加入時間',
      dataIndex: 'startDate',
      width: '10%',
    },
    {
      title: '繳費時間',
      dataIndex: 'payday',
      width: '12%',
    },
    {
      title: '跟單策略',
      dataIndex: 'strategy',
      width: '10%',
      render: (data) => <Copying array={data}/>,
      filters: [
        {
          text: '無',
          value: '無',
        },
        {
          text: 'VIP跟單',
          value: 'VIP跟單',
        },
        {
          text: '高倍VIP跟單',
          value: '高倍VIP跟單',
        },
      ],
      onFilter: (value, record) => {
        if (value === "無") {
          return record.strategy.length === 0;
        } else {
          for (let each of record.strategy) {
            if (each.strategyName === value) {
              return true;
            }
          }
          return false;
        }
      },
    },
    {
      title: '修改/刪除',
      dataIndex: 'actions',
      width: '5%',
    },
  ];

  // Modal
  const showModalE = (index) => {
    setCurrentUser({
      id: userData[index].lineUserId,
      plan: userData[index].vipPlan,
      payday: userData[index].payday,
      due: userData[index].due,
      strategy: [],
    });
    setModalOpenE(true);
  };
  const showModalR = (index) => {
    setCurrentUser({
      id: userData[index].lineUserId,
      plan: userData[index].vipPlan,
      payday: userData[index].payday,
      due: userData[index].due,
      strategy: [],
    });
    setModalOpenR(true);
  };
  const showModalRCP = (index) => {
    setCurrentUser({
      id: userData[index].lineUserId,
      plan: userData[index].vipPlan,
      payday: userData[index].payday,
      due: userData[index].due,
      strategy: userData[index].strategy.map((value) => value.strategyName),
    });
    setModalOpenRCP(true);
  };
  const handleAdjust = () => {
    post(`${process.env.REACT_APP_API_URL}/vip/updatePlan`, header, { lineId: currentUser.id, plan: currentUser.plan, payday: currentUser.payday, due: currentUser.due })
    .then((resp)=>{
      if (resp.data.status === 'success') {
        get(`${process.env.REACT_APP_API_URL}/vip/allMember`, header)
        .then((resp)=>{
          setUserData(resp.data.data);
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
          setUserData(resp.data.data);
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
  const handleRemoveCP = () => {
    post(`${process.env.REACT_APP_API_URL}/vip/removeCP`, header, { lineId: currentUser.id, strategyName: strategyToRemove })
    .then((resp)=>{
      if (resp.data.status === 'success') {
        get(`${process.env.REACT_APP_API_URL}/vip/allMember`, header)
        .then((resp)=>{
          setUserData(resp.data.data);
          console.log('update all user data');
        })
        .catch((errorMsg)=>{
          console.log(errorMsg);
        });
      } else {
        window.toast.error("發生錯誤");
      }
      setModalOpenRCP(false);
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
  const handleCancelRCP = () => {
    setModalOpenRCP(false);
    setCurrentUser(defaultCurrentUser);
    setStrategyToRemove(undefined);
  };
  const onSetPlan = (value) => {
    setCurrentUser({
      id: currentUser.id,
      plan: value,
      payday: currentUser.payday,
      due: currentUser.due,
    });
  }
  const onSetPayday = (value) => {
    let payday = value.format('YYYY-MM-DD');
    let due = value.add(3, 'day').format('YYYY-MM-DD');
    setCurrentUser({
      id: currentUser.id,
      plan: currentUser.plan,
      payday: payday,
      due: due,
    });
  }
  const isCopying = (index) => {
    return !(userData[index].strategy.length > 0);
  }
  const onChooseStrategyToRemove = (e) => {
    setStrategyToRemove(e.target.value);
  }
  const Payday = ({payday, due}) => {
    const now = Number(moment( Date.now() ).tz("Asia/Taipei").format("X"));
    const dueTS = Number(moment(`${ due } 23:59:59`).tz("Asia/Taipei").format("X"));
    if (now > dueTS) {
      return (
        <p style={{ color: "#ff4d4f", fontWeight: "700" }}>
          {payday}<br/>➡️ {due}
        </p>
      );
    } else {
      return (
        <p>
          {payday}<br/>➡️ {due}
        </p>
      ); 
    }
  }
  const Copying = ({array}) => {
    if (array.length === 0) {
      return (
        <p style={{ color: "#999999" }}>無</p>
      );
    } else {
      let mapped = array.map((item, index) => {
        if (item.state === 'waiting') {
          return (
            <p key={index}>{item.strategyName}（待審核）</p>
          );
        } else {
          return (
            <p key={index}>{item.strategyName}</p>
          );
        }
      });
      return mapped;
    }
  }
  const User = ({name, imgUrl}) => {
    return (
      <div style={{ display: "flex", flexDirection: "row", gap: "12px", alignItems: "center" }}>
        <Avatar size={"large"} src={imgUrl}/>
        <p style={{ width: '80px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{name}</p>
      </div>
    );
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
      <div style={{ display: "flex", gap: 4 }}>
        <Button key="edit" type="text" onClick={() => {showModalE(index)}}>
          {/* {<EditOutlined />} */}
          <p style={{ color: "var(--highlight-color-1)" }}>變更方案</p>
        </Button>
        <Button key="remove" type="text" onClick={() => {showModalR(index)}} danger>
          {/* {<CloseCircleOutlined />} */}
          解除VIP
        </Button>
        <Button key="removeCopy" type="text" onClick={() => {showModalRCP(index)}} danger disabled={isCopying(index)}>
          解除跟單
        </Button>
      </div>
    );
  };

  if (isAdmin === true) {
    if (userData === undefined) {
      get(`${process.env.REACT_APP_API_URL}/vip/allMember`, header)
      .then((resp)=>{
        console.log(resp.data.data);
        setUserData(resp.data.data);
      })
      .catch((errorMsg)=>{
        console.log(errorMsg);
      });
    }
  } 

  useEffect(() => {
    if (userData !== undefined) {
      let newData = userData.map((item, index) => {
        return {
          key: index,
          user: <User name={item.lineUserName} imgUrl={item.linePFP} />,
          plan: item.vipPlan,
          startDate: `${item.startDate}`,
          payday: <Payday payday={item.payday} due={item.due}/>,
          strategy: item.strategy,
          actions: <Actions index={index}/>,
        }
      });

      setTableData([...newData]);
    }
  }, [userData]);

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
        <h4 style={{ color: "#666666" }}>調整繳費期限</h4>
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
      <Modal title="強制解除跟單" open={modalOpenRCP} onCancel={handleCancelRCP}
        footer={[
          <Button key="cancel" type="default" onClick={handleCancelRCP}>
            取消
          </Button>,
          <Button key="remove" type="primary" onClick={handleRemoveCP} danger>
            強制解除
          </Button>,
        ]}
      >
        <p>請選擇欲強制解除之跟單策略</p>
        <RadioGroup 
          onChange={onChooseStrategyToRemove}
          value={strategyToRemove}
          options={currentUser.strategy}
          style={{ width: "100%", marginTop: "8px" }}
        />
      </Modal>
      <Table columns={columns} dataSource={tableData} style={{ fontWeight: "400" }}
        pagination={{
          position: ['bottomCenter'],
          pageSize: 6,
        }}
      />
    </>
  );
}

export default Overview;