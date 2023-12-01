import React from 'react'
import {Text, Icon} from '@ui-kitten/components'
import {StyleSheet, View} from 'react-native'
import {basic, primary} from '../../../styles/colors'
import {androidRipple} from '../../../styles/styles'
import {ItemTypeLabels} from '../../../constants/labels'
import {StatusColors} from '../../../styles/colors'
import Pressable from '../../../components/Pressable'

const ListItemSearch = ({
  id,
  name,
  markerType,
  status,
  itemType,
  navigateToView,
}) => {
  const onPress = React.useCallback(
    () => navigateToView(id, itemType),
    [id, itemType, navigateToView],
  )

  return (
    <Pressable
      android_ripple={androidRipple}
      style={styles.pressable}
      onPress={onPress}>
      <View style={styles.mainView}>
        {status !== null ? (
          <Icon
            name="circle"
            pack="cp"
            fill={StatusColors[status]}
            style={styles.statusIcon}
          />
        ) : null}
        <Icon name={markerType} pack="cp" style={styles.icon} fill={basic} />
        <View style={styles.titleView}>
          <Text category="p1">{name}</Text>
          <Text category="s2" appearance="hint">
            {ItemTypeLabels[itemType]}
          </Text>
        </View>
      </View>
      <Icon
        name="diagonal-arrow-right-up-outline"
        style={styles.arrow}
        fill={primary}
      />
    </Pressable>
  )
}

export default ListItemSearch

const styles = StyleSheet.create({
  pressable: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  mainView: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleView: {
    justifyContent: 'center',
  },
  icon: {
    height: 25,
    width: 25,
    marginRight: 10,
  },
  statusIcon: {
    width: 15,
    height: 15,
    marginRight: 6,
  },
  arrow: {
    height: 20,
    width: 20,
    marginRight: 16,
  },
})
