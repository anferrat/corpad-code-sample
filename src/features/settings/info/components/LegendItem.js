import React from 'react'
import {View, StyleSheet} from 'react-native'
import {Text, Icon} from '@ui-kitten/components'

const LegendItem = props => {
  return (
    <View style={styles.mainView}>
      <Icon name={props.icon} fill={props.color} style={styles.icon} />
      <Text
        style={styles.text}
        category="s1"
        numberOfLines={1}
        ellipsizeMode={'middle'}>
        {props.text}
      </Text>
    </View>
  )
}

export default LegendItem

const styles = StyleSheet.create({
  mainView: {
    alignItems: 'center',
    padding: 6,
    flexDirection: 'row',
  },
  numberRow: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    flex: 1,
    marginLeft: 12,
  },
  icon: {
    width: 20,
    height: 20,
  },
})
