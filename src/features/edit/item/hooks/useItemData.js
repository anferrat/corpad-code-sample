import {useRef, useEffect, useCallback} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {errorHandler} from '../../../../helpers/error_handler'
import {
  addEditImage,
  loadEditState,
  resetEditState,
  resetState,
  updateCurrentCoordinates,
  updateEditItemProperty,
  updateTapSetting,
  validateProperty,
} from '../../../../store/actions/item'
import {useNavigation} from '@react-navigation/native'
import {
  deleteItem,
  getItemById,
  updateItem,
} from '../../../../app/controllers/survey/items/ItemController'
import {EventRegister} from 'react-native-event-listeners'
import {createSubitem as createSubitemRequest} from '../../../../app/controllers/survey/subitems/SubitemController'
import {updateItemPhotos} from '../../../../app/controllers/survey/other/MediaController'
import {isProStatus} from '../../../../helpers/functions'

const useItemData = ({
  itemId,
  itemType,
  isNew,
  navigateToView,
  navigateToSubitem,
}) => {
  const item = useSelector(state => state.item.edit)
  const loading = useSelector(state => state.item.edit.loading)
  const subscriptionStatus = useSelector(
    state => state.settings.subscription.status,
  )
  const isPro = isProStatus(subscriptionStatus)
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const deleteOnExit = useRef(isNew)
  const componentMounted = useRef(true)

  useEffect(() => {
    componentMounted.current === true
    const loadData = async () => {
      const {status, response} = await getItemById({id: itemId, itemType})
      if (status === 200 && componentMounted.current)
        dispatch(loadEditState(response))
      else errorHandler(status, navigation.goBack)
    }

    if (loading) loadData()
  }, [loading])

  useEffect(() => {
    const onSaveHandler = EventRegister.addEventListener(
      'onItemSave',
      async item => {
        const images = await updateItemPhotos(
          {imageUris: item.imageUris, itemId, itemType},
          er => errorHandler(er),
        )
        const {status} = await updateItem(
          {itemType, ...item},
          er => errorHandler(er),
          result => {
            EventRegister.emit('ITEM_UPDATED', result)
            EventRegister.emit('GLOBAL_ITEM_UPDATED', {itemId, itemType})
          },
        )
        if (status === 200 && images.status === 200) {
          deleteOnExit.current = false
          navigateToView()
        } else {
          dispatch(updateEditItemProperty(false, 'saving'))
        }
      },
    )

    const onPhotoAdded = EventRegister.addEventListener(
      'PHOTO_ADDED',
      photo => {
        if (photo.itemId === itemId && photo.itemType === itemType) {
          dispatch(addEditImage(photo.uri))
        }
      },
    )
    return () => {
      dispatch(resetEditState())
      EventRegister.removeEventListener(onSaveHandler)
      EventRegister.removeEventListener(onPhotoAdded)
      componentMounted.current = false
      if (deleteOnExit.current) {
        deleteItem({id: itemId, itemType})
        dispatch(resetState())
      }
    }
  }, [dispatch, navigateToView, deleteOnExit])

  const update = useCallback(
    (value, property) => dispatch(updateEditItemProperty(value, property)),
    [dispatch],
  )

  const validate = useCallback(
    property => dispatch(validateProperty(property)),
    [dispatch],
  )

  const updateLatAndLon = useCallback(
    (latitude, longitude) =>
      dispatch(updateCurrentCoordinates(latitude, longitude)),
    [dispatch],
  )

  const createSubitem = useCallback(
    async type => {
      const {response, status, errorMessage} = await createSubitemRequest(
        {subitemType: type, itemId},
        er => errorHandler(er),
      )

      if (status === 200) navigateToSubitem(response.id, true, type)
    },
    [itemId],
  )

  const updateTap = useCallback(
    value => {
      dispatch(updateTapSetting(value))
    },
    [dispatch],
  )

  return {
    item,
    loading,
    isPro,
    update,
    validate,
    createSubitem,
    updateLatAndLon,
    updateTap,
  }
}

export default useItemData
