export const updatePotentialAction = (
  subitemIndex,
  potentialIndex,
  value,
  valid = undefined,
) => {
  return {type: 'UPDATE_POTENTIAL', subitemIndex, potentialIndex, value, valid}
}

export const loadSubitemListDataAction = (
  subitems,
  pipelineList,
  potentialUnit,
  referenceCells,
  availableMeasurementTypes,
) => {
  return {
    type: 'LOAD_DATA',
    subitems,
    pipelineList,
    potentialUnit,
    referenceCells,
    availableMeasurementTypes,
  }
}

export const updatePropertyAction = (subitemIndex, value, valid = {}) => {
  return {type: 'UPDATE_SUBITEM_PROPERTY', subitemIndex, value, valid}
}

export const updateSubitemAction = subitem => {
  return {type: 'UPDATE_SUBITEM', subitem}
}

export const refreshSubitemList = () => {
  return {type: 'REFRESH'}
}

export const updatePotentialsAction = (subitemId, potentials) => {
  return {type: 'UPDATE_POTENTIALS', subitemId, potentials}
}

export const deleteSubitemAction = subitemId => {
  return {type: 'DELETE_SUBITEM', subitemId}
}

export const updatePotentialById = (subitemId, potentialId, value, valid) => {
  return {type: 'UPDATE_POTENTIAL_BY_ID', subitemId, potentialId, value, valid}
}
