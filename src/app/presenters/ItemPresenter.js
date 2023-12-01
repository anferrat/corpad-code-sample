import {ItemTypes} from '../../constants/global'
import {Error, errors} from '../utils/Error'

export class ItemPreseneter {
  constructor() {}

  _getValidObject(itemType) {
    switch (itemType) {
      case ItemTypes.TEST_POINT:
        return {
          name: true,
          testPointType: true,
          comment: true,
          location: true,
          latitude: true,
          longitude: true,
        }
      case ItemTypes.RECTIFIER:
        return {
          name: true,
          comment: true,
          location: true,
          latitude: true,
          longitude: true,
          model: true,
          serialNumber: true,
          acVoltage: true,
          acCurrent: true,
          tapValue: true,
          maxVoltage: true,
          maxCurrent: true,
        }
      case ItemTypes.PIPELINE:
        return {
          name: true,
          comment: true,
          licenseNumber: true,
        }
      default:
        throw new Error(
          errors.GENERAL,
          `No such item type as ${itemType}`,
          'Wrong item type',
          109,
        )
    }
  }

  execute(item, defaultName, photos) {
    return {
      ...item,
      imageUris: photos.map(({source}) => source.uri),
      defaultName: defaultName,
      valid: this._getValidObject(item.itemType),
    }
  }
}
