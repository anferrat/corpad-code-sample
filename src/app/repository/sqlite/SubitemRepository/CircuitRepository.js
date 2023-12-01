import {SQLiteRepository} from '../../../utils/SQLite'
import {Circuit} from '../../../entities/survey/subitems/Circuit'
import {Error, errors} from '../../../utils/Error'
import {SubitemTypes} from '../../../../constants/global'

export class CircuitRepository extends SQLiteRepository {
  constructor() {
    super()
  }

  async getAll() {
    try {
      const result = await this.runSingleQueryTransaction(
        'SELECT id, rectifierId, uid, name, ratioCurrent, ratioVoltage, current, voltage, targetMin, targetMax, voltageDrop FROM circuits WHERE type=?',
        [SubitemTypes.CIRCUIT],
      )
      return super
        .generateArray(result.rows.length, result.rows.item)
        .map(
          ({
            id,
            rectifierId,
            uid,
            name,
            ratioCurrent,
            ratioVoltage,
            current,
            voltage,
            targetMin,
            targetMax,
            voltageDrop,
          }) =>
            new Circuit(
              id,
              rectifierId,
              uid,
              name,
              ratioCurrent,
              ratioVoltage,
              targetMin,
              targetMax,
              current,
              voltage,
              voltageDrop,
            ),
        )
    } catch (err) {
      throw new Error(errors.DATABASE, 'Unable to get all circuits', err)
    }
  }

  async create(circuit) {
    try {
      const {
        id,
        uid,
        type,
        parentId,
        name,
        ratioCurrent,
        ratioVoltage,
        current,
        voltage,
        targetMin,
        targetMax,
        voltageDrop,
      } = circuit
      const result = await this.runSingleQueryTransaction(
        'INSERT INTO circuits (id, uid, type, rectifierId, name, ratioCurrent, ratioVoltage, current, voltage, targetMin, targetMax, voltageDrop) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
        [
          id,
          uid,
          type,
          parentId,
          name,
          ratioCurrent,
          ratioVoltage,
          current,
          voltage,
          targetMin,
          targetMax,
          voltageDrop,
        ],
      )
      return new Circuit(
        result.insertId,
        parentId,
        uid,
        name,
        ratioCurrent,
        ratioVoltage,
        targetMin,
        targetMax,
        current,
        voltage,
        voltageDrop,
      )
    } catch (err) {
      throw new Error(errors.DATABASE, `Unable to create circuit`, err)
    }
  }

  async getById(id) {
    try {
      const result = await this.runSingleQueryTransaction(
        'SELECT rectifierId, uid, name, ratioCurrent, ratioVoltage, current, voltage, targetMin, targetMax, voltageDrop FROM circuits WHERE id=? AND type=?',
        [id, SubitemTypes.CIRCUIT],
      )
      const {
        rectifierId,
        uid,
        name,
        ratioCurrent,
        ratioVoltage,
        current,
        voltage,
        targetMin,
        targetMax,
        voltageDrop,
      } = result.rows.item(0)
      return new Circuit(
        id,
        rectifierId,
        uid,
        name,
        ratioCurrent,
        ratioVoltage,
        targetMin,
        targetMax,
        current,
        voltage,
        voltageDrop,
      )
    } catch (err) {
      throw new Error(
        errors.DATABASE,
        `Unable to get circuit with id ${id}`,
        err,
      )
    }
  }

  async update(circuit, currentTime) {
    const {
      id,
      name,
      parentId,
      ratioCurrent,
      ratioVoltage,
      current,
      voltage,
      targetMin,
      targetMax,
      voltageDrop,
    } = circuit
    try {
      const result = await this.runMultiQueryTransaction(tx => [
        this.runQuery(
          tx,
          'UPDATE circuits SET name=?, ratioCurrent=?, ratioVoltage=?, current=?, voltage=?, targetMin=?, targetMax=?, voltageDrop=? WHERE id=?',
          [
            name,
            ratioCurrent,
            ratioVoltage,
            current,
            voltage,
            targetMin,
            targetMax,
            voltageDrop,
            id,
          ],
        ),
        this.runQuery(
          tx,
          'UPDATE rectifiers SET timeModified = ? WHERE id = ?',
          [currentTime, parentId],
        ),
      ])
      if (result[0].rowsAffected === 0) throw 'Item not found'
      else return circuit
    } catch (err) {
      throw new Error(
        errors.DATABASE,
        `Unable to update circuit with id ${id}`,
        err,
      )
    }
  }
}
