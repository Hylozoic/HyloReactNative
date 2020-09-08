import React, { useState } from 'react'
import DatePickerComponent from 'react-native-date-picker'

export function onDateChange (newDate, onChange) {
  onChange(newDate)
  setDate
  return newDate
}

export default function DatePicker ({
  onChange,
  date: value,
  minimumDate,
  minuteInterval = 5,
  mode = 'datetime'
}) {
  // onDateChange not called if no value is changed:
  // https://github.com/henninghall/react-native-date-picker/issues/238
  if (!value) {
    onChange(minimumDate)
    return null
  }

  const [date, setDate] = useState(value)
  const onDateChange = newDate => {
    setDate(newDate)  
    onChange(newDate)
  }

  return <DatePickerComponent
    minimumDate={minimumDate}
    minuteInterval={minuteInterval}
    date={date}
    mode={mode}
    onDateChange={onDateChange}
  />
}
