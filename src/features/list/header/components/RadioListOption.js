import React from 'react'
import {Radio, Text} from '@ui-kitten/components'
import {StyleSheet} from 'react-native'

const RadioListOptiion = props => {
  return (
    <Radio
      style={styles.radio}
      onChange={props.onChange}
      checked={props.checked}>
      {() => (
        <Text style={styles.text} category={'s1'}>
          {props.title}
        </Text>
      )}
    </Radio>
  )
}

export default React.memo(RadioListOptiion)

const styles = StyleSheet.create({
  radio: {
    height: 60,
    paddingLeft: 12,
  },
  text: {
    paddingLeft: 12,
  },
})
