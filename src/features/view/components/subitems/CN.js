import React from 'react'
import TextLine from '../../../../components/TextLine'
import Header from '../Header'
import PotentialsView from '../PotentialsView'
import Divider from '../Divider'
import InputWithTitle from '../InputWithTitle'
import {CouponTypeLabels} from '../../../../constants/labels'
import {
  CouponTypes,
  MultimeterMeasurementTypes,
} from '../../../../constants/global'

const areaUnit = {
  main: 'cm',
  script: '2',
  format: 'super',
}

const densityUnit = {
  main: 'A/m',
  script: '2',
  format: 'super',
}

const CN = ({
  data,
  validateCouponCurrent,
  updatePropertyValue,
  onEdit,
  subitemIndex,
  idMap,
  updatePotentialValue,
  validatePotential,
  potentialUnit,
  potentialHint,
  onMultimeterPress,
  availableMeasurementTypes,
}) => {
  const {
    type,
    name,
    current,
    area,
    density,
    pipelineCardId,
    valid,
    potentials,
    couponType,
    wireColor,
    wireGauge,
  } = data

  const measurementType =
    couponType === CouponTypes.AC
      ? MultimeterMeasurementTypes.COUPON_CURRENT_AC
      : MultimeterMeasurementTypes.COUPON_CURRENT

  const onChangeCurrent = React.useCallback(
    value => updatePropertyValue(value, subitemIndex, 'current'),
    [updatePropertyValue, subitemIndex],
  )

  const onEndEditingCurrent = React.useCallback(
    () => validateCouponCurrent(subitemIndex, data),
    [subitemIndex, current, area],
  )

  const pipeSubitem = idMap[pipelineCardId] ?? {}

  const multimeterAvailable =
    ~availableMeasurementTypes.indexOf(measurementType)

  const onMultimeterPressCurrent = React.useCallback(() => {
    onMultimeterPress(measurementType)
  }, [onMultimeterPress, measurementType])

  return (
    <>
      <Header
        wireColor={wireColor}
        wireGauge={wireGauge}
        title={name}
        icon={type}
        onEdit={onEdit}
      />
      <Divider visible={true} />
      <PotentialsView
        availableMeasurementTypes={availableMeasurementTypes}
        onMultimeterPress={onMultimeterPress}
        subitemIndex={subitemIndex}
        updatePotentialValue={updatePotentialValue}
        validatePotential={validatePotential}
        unit={potentialUnit}
        potentialHint={potentialHint}
        potentials={potentials}
      />
      <TextLine
        title="Connected to"
        value={pipeSubitem.name ?? 'Disconnected'}
        icon={pipeSubitem.type ?? null}
        pack="cp"
      />
      <TextLine title="Type" value={CouponTypeLabels[couponType] ?? null} />
      <TextLine title="Area" value={area} unit={areaUnit} />
      <TextLine title="Density" value={density} unit={densityUnit} />
      <InputWithTitle
        multimeterAvailable={multimeterAvailable}
        onMultimeterPress={onMultimeterPressCurrent}
        onEndEditing={onEndEditingCurrent}
        onChangeText={onChangeCurrent}
        keyboardType="numeric"
        value={current}
        valid={valid.current}
        title="Current"
        property="current"
        unit={'\u00B5A'}
      />
    </>
  )
}
export default CN
