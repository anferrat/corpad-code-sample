import React from 'react'
import TextLine from '../../../../components/TextLine'
import Header from '../Header'
import PotentialsView from '../PotentialsView'
import Divider from '../Divider'
import {ReferenceCellTypeLabels} from '../../../../constants/labels'

const RE = ({
  data,
  potentialUnit,
  potentialHint,
  updatePotentialValue,
  validatePotential,
  subitemIndex,
  onEdit,
  onMultimeterPress,
  availableMeasurementTypes,
}) => {
  const {name, type, wireColor, wireGauge, potentials, rcType} = data
  return (
    <>
      <Header
        wireColor={wireColor}
        wireGauge={wireGauge}
        title={name}
        icon={type}
        onEdit={onEdit}
      />
      <Divider visible={potentials.length > 0 || rcType !== null} />
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
        title="Material"
        value={ReferenceCellTypeLabels[rcType] ?? null}
      />
    </>
  )
}
export default RE
