import {useNavigation} from '@react-navigation/native'
import {useRef, useReducer, useEffect, useCallback} from 'react'
import {reducer, initialState} from '../store/reducers/subitemList'
import {getSubitemListData} from '../../../app/controllers/survey/subitems/SubitemController'
import {errorHandler} from '../../../helpers/error_handler'
import {
  loadSubitemListDataAction,
  updateSubitemAction,
  deleteSubitemAction,
  updatePotentialsAction,
  refreshSubitemList,
} from '../store/actions/subitemList'
import {EventRegister} from 'react-native-event-listeners'

//local reducer is used here, mostly global one from redux is used

const useSubitemListData = ({itemId, itemType}) => {
  const navigation = useNavigation()
  const [state, dispatch] = useReducer(reducer, initialState)
  const {
    potentialUnit,
    subitems,
    pipelineList,
    loading,
    availableMeasurementTypes,
  } = state
  const componentMounted = useRef(true)

  const idMap = Object.fromEntries(
    state.subitems.map(({id, name, type}) => [id, {id, name, type}]),
  )
  //in case of multiple reference cells, we display hint at potential field with ref cell name
  const potentialHint = state.referenceCells.length > 1

  useEffect(() => {
    componentMounted.current = true

    const loadData = async () => {
      const {response, status} = await getSubitemListData(
        {itemId, itemType},
        er => errorHandler(er, navigation.goBack),
      )
      if (status === 200 && componentMounted.current)
        dispatch(
          loadSubitemListDataAction(
            response.subitems,
            response.pipelineList,
            response.potentialUnit,
            response.referenceCells,
            response.availableMeasurementTypes,
          ),
        )
    }

    if (loading) loadData()

    const onSubitemUpdate = EventRegister.addEventListener(
      'SUBITEM_UPDATED',
      ({subitem}) => {
        //RE updates will change potential values for all items. lazy way here is to re-render entire list in case of RE changes
        if (!loading)
          if (subitem.type === 'RE') dispatch(refreshSubitemList())
          else dispatch(updateSubitemAction(subitem))
      },
    )

    const onSubitemDelete = EventRegister.addEventListener(
      'SUBITEM_DELETED',
      ({subitemId, subitemType}) => {
        if (!loading)
          if (subitemType === 'RE') dispatch(refreshSubitemList())
          else dispatch(deleteSubitemAction(subitemId))
      },
    )

    const onPotentialsUpdate = EventRegister.addEventListener(
      'POTENTIALS_UPDATED',
      ({subitemId, potentials}) => {
        if (!loading && potentials)
          dispatch(updatePotentialsAction(subitemId, potentials.potentials))
      },
    )
    return () => {
      componentMounted.current = false
      EventRegister.removeEventListener(onSubitemUpdate)
      EventRegister.removeEventListener(onSubitemDelete)
      EventRegister.removeEventListener(onPotentialsUpdate)
    }
  }, [loading])

  return {
    idMap,
    potentialUnit,
    potentialHint,
    subitems,
    pipelineList,
    loading,
    availableMeasurementTypes,
    dispatch,
  }
}

export default useSubitemListData
