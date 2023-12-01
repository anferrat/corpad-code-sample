import {IconTypes, ItemTypes} from '../../../../constants/global'

export class SurveyItem {
  constructor(
    id,
    uid,
    name,
    status,
    timeCreated,
    timeModified,
    comment,
    itemType,
    testPointType,
  ) {
    this.id = id
    this.uid = uid
    this.name = name
    this.itemType = itemType
    this.status = status
    this.timeCreated = timeCreated
    this.timeModified = timeModified
    this.comment = comment
    this.markerType =
      itemType === ItemTypes.TEST_POINT
        ? IconTypes[itemType][testPointType]
        : IconTypes[itemType]
    this.subitems = []
  }

  reset() {}

  setSubitems(subitems) {
    this.subitems = subitems
  }
}

export const ItemStatuses = {
  GOOD: 0,
  ATTENTION: 1,
  BAD: 2,
  UNKNOWN: 3,
  NO_STATUS: null,
}

export const TestPointTypes = Object.freeze({
  TEST_STATION: 0,
  JUNCTION_BOX: 1,
  HEADER: 2,
  FIELD_NOTE: 3,
})
