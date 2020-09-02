import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import DatePickerComponent from 'react-native-date-picker'
import moment from 'moment'

export default function DatePicker ({
  onChange,
  value,
  mode = 'datetime',
  expanded = false
}) {
  const [date, setDate] = useState(value)

  return <View style={[ styles.container ]}>
    {/* <TouchableOpacity style={style} onPress={() => setExpanded(!expanded)}>
      <Text>{date.toString()}</Text>
    </TouchableOpacity> */}
    {expanded && <DatePickerComponent
      // testID='startTime'
      // timeZoneOffsetInMinutes={0}
      // minuteInterval={interval}
      minimumDate={new Date()}
      minuteInterval={5}
      date={date}
      mode={mode}
      onDateChange={onChange}
      // display={display}
      // onChange={onChange}
      // style={styles.iOsPicker}
      // textColor={color || undefined}
    />}
  </View>
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center'
  }
})
