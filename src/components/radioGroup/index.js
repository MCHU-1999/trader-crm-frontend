import React, { useState } from 'react';
import { Input, Radio } from 'antd';


const App = ({options, onChange, value, style}) => {
  const getWidth = (list) => {
    if (list.length === 0) {
      return "100%";
    } else {
      return `${100 / list.length}%`;
    }
  }
  const makeBtns = (list) => {
    let result = list.map((value, index) => (
        <Radio.Button 
          key={index}
          style={{ width: getWidth(options) }}
          value={value}
        >
          {value}
        </Radio.Button>
      )
    );
    return result;
  }
  return (
    <Radio.Group buttonStyle='solid' onChange={onChange} value={value} style={style}>
      {makeBtns(options)}
    </Radio.Group>
  );
};
export default App;