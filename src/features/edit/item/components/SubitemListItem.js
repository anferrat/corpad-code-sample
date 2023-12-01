import React from 'react'
import {Platform, StyleSheet} from 'react-native'
import {Layout, Icon, Text} from '@ui-kitten/components'
import {basic, basic300} from '../../../../styles/colors'
import {androidRipple} from '../../../../styles/styles'
import Pressable from '../../../../components/Pressable'

const SubitemListItem = props => {
  return (
    <Layout style={cardStyle}>
      <Pressable
        style={styles.pressable}
        onPress={props.onPress}
        android_ripple={androidRipple}>
        <Layout style={styles.leftSide}>
          <Icon
            name={props.iconName}
            pack="cp"
            style={styles.icon}
            fill={basic}
          />
          <Layout style={styles.textView}>
            <Text category="p1">{props.title}</Text>
            <Text category="s2" appearance="hint">
              {props.subtitle}
            </Text>
          </Layout>
        </Layout>
        <Icon
          name="arrow-ios-forward-outline"
          style={styles.icon}
          fill={basic}
        />
      </Pressable>
    </Layout>
  )
}

export default React.memo(
  SubitemListItem,
  (prev, next) => prev.uid === next.uid && prev.title === next.title,
)

const styles = StyleSheet.create({
  card: {
    borderRadius: 6,
    borderWidth: 0,
    margin: 6,
  },
  cardPlatformSpecific: Platform.select({
    android: {
      elevation: 5,
    },
    default: {
      borderWidth: 1,
      borderColor: basic300,
    },
  }),
  pressable: {
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    marginHorizontal: 12,
    width: 25,
    height: 25,
  },
  leftSide: {
    backgroundColor: 'rgba(0,0,0,0)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textView: {
    backgroundColor: 'rgba(0,0,0,0)',
  },
})

const cardStyle = StyleSheet.compose(styles.card, styles.cardPlatformSpecific)
