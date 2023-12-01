import React, {useState, useRef} from 'react'
import {Animated, Easing, View, StyleSheet} from 'react-native'
import {Icon, Text} from '@ui-kitten/components'
import {
  primary,
  basic200,
  basic300,
  primary200,
  control,
} from '../../../styles/colors'
import Pressable from '../../../components/Pressable'

const ExpandedBar = props => {
  const [barDisplayed, setBarDisplayed] = useState(false)
  const height = useRef(new Animated.Value(0)).current
  const move = height.interpolate({
    inputRange: [0, 80],
    outputRange: [-50, 0],
  })

  const rotate = height.interpolate({
    inputRange: [0, 110],
    outputRange: ['0deg', '180deg'],
  })
  const toggleBar = bar => {
    if (bar) closeBarAnimation()
    else openBarAnimation()
    setBarDisplayed(!bar)
  }

  const openBarAnimation = () =>
    Animated.timing(height, {
      toValue: 110,
      duration: 200,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start()

  const closeBarAnimation = () =>
    Animated.timing(height, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start()

  return (
    <View style={styles.mainView}>
      <Animated.View
        style={{
          ...styles.bar,
          height: height,
          transform: [{translateY: move}],
        }}>
        {props.children}
      </Animated.View>
      <Pressable
        android_ripple={{color: basic300}}
        onPress={toggleBar.bind(this, barDisplayed)}
        style={styles.pressable}>
        <Text status="primary">{barDisplayed ? 'Hide' : 'Show'} controls</Text>
        <Animated.View style={{transform: [{rotate: rotate}], marginLeft: 12}}>
          <Icon
            name="arrow-ios-downward-outline"
            fill={primary}
            style={styles.icon}
          />
        </Animated.View>
      </Pressable>
    </View>
  )
}

export default ExpandedBar

const styles = StyleSheet.create({
  mainView: {
    overflow: 'hidden',
  },
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: control,
    height: 50,
    marginTop: 12,
  },
  icon: {
    width: 25,
    height: 25,
  },
})
