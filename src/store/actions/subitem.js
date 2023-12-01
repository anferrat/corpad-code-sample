export const UPDATE_SUBITEM_PROPERTY = 'UPDATE_SUBITEM_PROPERTY'
export const LOAD_SUBITEM_STATE = 'LOAD_SUBITEM_STATE'
export const SAVE_SUBITEM_STATE = 'SAVE_SUBITEM_STATE'
export const RESET_SUBITEM_STATE = 'RESET_SUBITEM_STATE'
export const UPDATE_SUBITEM_SHORTED = 'UPDATE_SUBITEM_SHORTED'
export const UPDATE_SUBITEM_RATIO = 'UPDATE_SUBITEM_RATIO'
export const UPDATE_SUBITEM_FACTOR = 'UPDATE_SUBITEM_FACTOR'
export const UPDATE_SUBITEM_VOLTAGE_DROP = 'UPDATE_SUBITEM_VOLTAGE_DROP'
export const VALIDATE_SUBITEM_PROPERTY = 'VALIDATE_SUBITEM_PROPERTY'
export const UPDATE_SUBITEM_COUPON_PROPERTY = 'UPDATE_SUBITEM_COUPON_PROPERTY'
export const ADD_SUBITEM_SOIL_RESISTIVITY_LAYER =
  'ADD_SUBITEM_SOIL_RESISTIVITY_LAYER'
export const DELETE_SUBITEM_SOIL_RESISTIVITY_LAYER =
  'DELETE_SUBITEM_SOIL_RESISTIVITY_LAYER'
export const UPDATE_SUBITEM_SPACING_UNIT = 'UPDATE_SUBITEM_SPACING_UNIT'
export const UPDATE_SUBITEM_SUB_PROPERTY = 'UPDATE_SUBITEM_SUB_PROPERTY'
export const VALIDATE_SUBITEM_SUB_PROPERTY = 'VALIDATE_SUBITEM_SUB_PROPERTY'
export const ADD_SUBITEM_ANODE_BED_ANODE = 'ADD_SUBITEM_ANODE_BED_ANODE'
export const DELETE_SUBITEM_ANODE_BED_ANODE = 'DELETE_SUBITEM_ANODE_BED_ANODE'
export const SET_SUBITEM_ANODE_WIRE_PROPERTIES =
  'SET_SUBITEM_ANODE_WIRE_PROPERTIES'

export const updateSubitemProperty = (value, property, valid = undefined) => {
  return {
    type: UPDATE_SUBITEM_PROPERTY,
    value: value,
    property: property,
    valid: valid,
  }
}

export const loadSubitemState = cardObject => {
  return {type: LOAD_SUBITEM_STATE, cardObject: cardObject}
}

export const resetSubitemState = () => {
  return {type: RESET_SUBITEM_STATE}
}

export const saveSubitemState = (cardId, testPointId) => {
  return {type: SAVE_SUBITEM_STATE, cardId: cardId, testPointId: testPointId}
}

export const updateShorted = value => {
  return {type: UPDATE_SUBITEM_SHORTED, value: value}
}

export const updateFactor = (value = undefined) => {
  return {type: UPDATE_SUBITEM_FACTOR, value: value}
}

export const updateRatio = (property, value = undefined) => {
  return {type: UPDATE_SUBITEM_RATIO, property: property, value: value}
}

export const updateVoltageDrop = () => {
  return {type: UPDATE_SUBITEM_VOLTAGE_DROP}
}

export const validateSubitemProperty = property => {
  return {type: VALIDATE_SUBITEM_PROPERTY, property: property}
}

export const validateCoupon = property => {
  return {type: UPDATE_SUBITEM_COUPON_PROPERTY, property: property}
}

export const addSoilResistivityLayer = () => ({
  type: ADD_SUBITEM_SOIL_RESISTIVITY_LAYER,
})

export const deleteSoilResistivityLayer = index => ({
  type: DELETE_SUBITEM_SOIL_RESISTIVITY_LAYER,
  index,
})

export const updateSpacingUnit = unit => ({
  type: UPDATE_SUBITEM_SPACING_UNIT,
  unit,
})

export const updateSubitemSubProperty = (
  value,
  property,
  index,
  parentProperty,
) => ({
  type: UPDATE_SUBITEM_SUB_PROPERTY,
  value,
  property,
  index,
  parentProperty,
})

export const validateSubitemSubProperty = (
  property,
  index,
  parentProperty,
) => ({type: VALIDATE_SUBITEM_SUB_PROPERTY, property, index, parentProperty})

export const addAnodeBedAnode = () => ({type: ADD_SUBITEM_ANODE_BED_ANODE})

export const deleteAnodeBedAnode = index => ({
  type: DELETE_SUBITEM_ANODE_BED_ANODE,
  index,
})

export const setAnodeWireProperties = (wireColor, wireGauge) => ({
  type: SET_SUBITEM_ANODE_WIRE_PROPERTIES,
  wireColor,
  wireGauge,
})
