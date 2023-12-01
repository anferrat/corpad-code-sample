import React from 'react'
import {Text, Icon} from '@ui-kitten/components'
import {StyleSheet, View} from 'react-native'
import {primary} from '../../../../styles/colors'
import {androidRipple} from '../../../../styles/styles'
import Pressable from '../../../../components/Pressable'

const ListItem = props => {
  return (
    <Pressable
      android_ripple={androidRipple}
      style={styles.pressable}
      onPress={props.onPress}>
      <View style={styles.iconLayout}>
        <Icon
          name={props.iconName}
          pack={props.pack}
          style={styles.icon}
          fill={'#fff'}
        />
      </View>
      <Text style={styles.text}>{props.title}</Text>
    </Pressable>
  )
}

export default ListItem

const styles = StyleSheet.create({
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingLeft: 15,
  },
  iconLayout: {
    backgroundColor: primary,
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 20,
    width: 20,
  },
  text: {
    fontSize: 15,
    paddingLeft: 15,
  },
})
