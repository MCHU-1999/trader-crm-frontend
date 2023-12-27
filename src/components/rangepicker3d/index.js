import React, { useState } from 'react';
import { DatePicker } from 'antd';
import styles from "./index.module.scss";
const { RangePicker } = DatePicker;


const App = ({placeholder, format, onChange, value, style}) => {
  const [dates, setDates] = useState(null);
  // const [value, setValue] = useState(null);
  const disabledDate = (current) => {
    if (!dates) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') >= 4;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') >= 4;
    return !!tooEarly || !!tooLate;
  };
  const onOpenChange = (open) => {
    if (open) {
      setDates([null, null]);
    } else {
      setDates(null);
    }
  };
  return (
    <RangePicker
      picker='date'
      style={style}
      placeholder={placeholder}
      format={format}
      value={dates || value}
      disabledDate={disabledDate}
      onCalendarChange={(val) => {
        setDates(val);
      }}
      onChange={(val) => {
        onChange(val);
      }}
      onOpenChange={onOpenChange}
      changeOnBlur
    />
  );
};
export default App;