import React from 'react'
import {View, StyleSheet} from 'react-native'
import StatusIcon from '../StatusIcon'
import IconLine from '../IconLine'
import TextLine from '../../../../components/TextLine'
import {getFullDate} from '../../../../helpers/functions'
import Divider from '../Divider'
import TapView from '../TapView'
import {combineLatLon} from '../../helpers/functions'
import ItemTitleView from '../ItemTitleView'
import {PowerSourceLabels} from '../../../../constants/labels'

const RT = ({data, itemType, updateStatus, submit, update}) => {
  const {
    name,
    status,
    timeModified,
    latitude,
    longitude,
    location,
    comment,
    maxVoltage,
    maxCurrent,
    model,
    serialNumber,
    powerSource,
    tapSetting,
    tapFine,
    tapCoarse,
    tapValue,
    valid,
  } = data

  const displayedTime = React.useMemo(
    () => getFullDate(timeModified),
    [timeModified],
  )

  const displayedCoord = React.useMemo(
    () => combineLatLon(latitude, longitude),
    [latitude, longitude],
  )

  return (
    <View>
      <View style={styles.titleView}>
        <ItemTitleView title={name} itemType={itemType} />
        <StatusIcon status={status} updateStatus={updateStatus} />
      </View>
      <IconLine icon="calendar-outline" value={displayedTime} />
      <IconLine icon="pin-outline" value={displayedCoord} />
      <IconLine icon="map-outline" value={location} />
      <IconLine icon="message-square-outline" value={comment} />
      <Divider visible={true} />
      <TextLine title="Max. voltage" value={maxVoltage} unit="V" />
      <TextLine title="Max. current" value={maxCurrent} unit="A" />
      <TextLine title="Model" value={model} />
      <TextLine title="Serial number" value={serialNumber} />
      <TextLine
        title="Power source"
        value={PowerSourceLabels[powerSource] ?? null}
      />
      <TapView
        tapValue={tapValue}
        valid={valid}
        tapSetting={tapSetting}
        tapFine={tapFine}
        tapCoarse={tapCoarse}
        submit={submit}
        update={update}
      />
    </View>
  )
}
export default React.memo(RT)

const styles = StyleSheet.create({
  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
})
