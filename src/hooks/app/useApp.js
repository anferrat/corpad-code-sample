//Used at the app root (navigation container)
import {useState, useRef, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import useOnboardingScreen from './useOnboardingScreen'
import {
  addFileUrlListener,
  addNetworkStatusListener,
  initializeApp,
} from '../../app/controllers/AppController'
import {
  resetCurrentSurveySettings,
  setActiveMultimeterStatus,
  setSettingsOnAppLoad,
  setSurveySettings,
  updateLoader,
  updateNetworkStatus,
  hideLoader,
} from '../../store/actions/settings'
import {errorHandler} from '../../helpers/error_handler'
import {SurveyLoadingStatuses} from '../../constants/global'
import {addMultimeterStatusListener} from '../../app/controllers/MultimeterController'
import useTimeAdjustment from './useTimeAdjustment'

const useApp = () => {
  //What to display survey control screen or survey file manager screens?
  const isLoaded = useSelector(state => state.settings.currentSurvey.isLoaded)

  //used to determine what survey file list screen to load first (cloud or device), or what survey type is currently opened
  const isCloud = useSelector(
    state => state.settings.currentSurvey.isCloudSurvey,
  )

  //determines if onboarding screen should be shown
  const isOnboardingVisible = useOnboardingScreen()

  useTimeAdjustment()

  const [loading, setLoading] = useState(true)

  const componentMounted = useRef(true)

  const dispatch = useDispatch()

  useEffect(() => {
    const networkStatus = addNetworkStatusListener(isInternetOn =>
      dispatch(updateNetworkStatus(isInternetOn)),
    )

    //fileUrlListener - listens for opened survey files from outside the app and loads them into database
    const urlListener = addFileUrlListener(
      (status, errorCode) => {
        if (status === SurveyLoadingStatuses.SAVING)
          dispatch(updateLoader('Saving survey', null))
        else if (status === SurveyLoadingStatuses.LOADING) {
          dispatch(resetCurrentSurveySettings())
          dispatch(updateLoader('Loading file', null))
        } else if (status === SurveyLoadingStatuses.ERROR)
          errorHandler(errorCode)
      },
      er => {
        er !== 101 ? errorHandler(er) : null
        dispatch(hideLoader())
      },
      ({name, fileName, syncTime, isCloud, isLoaded, uid}) => {
        dispatch(
          setSurveySettings(name, fileName, syncTime, isCloud, isLoaded, uid),
        )
        dispatch(hideLoader())
      },
    )

    const multimeterListener = addMultimeterStatusListener(({isConnected}) =>
      dispatch(setActiveMultimeterStatus(isConnected)),
    )

    //onAppLoad - sets up initial data for database, logs in with Google Drive, checks if survey already loaded
    const onAppLoad = async () => {
      componentMounted.current = true
      const {status, response} = await initializeApp()
      if (status === 200) {
        const {
          isLoaded,
          syncTime,
          name,
          uid,
          fileName,
          isCloud,
          isSigned,
          userName,
          onboarding,
          multimeter,
          subscriptionStatus,
          subscriptionExpirationTime,
        } = response
        dispatch(
          setSettingsOnAppLoad(
            isLoaded,
            syncTime,
            name,
            uid,
            fileName,
            isCloud,
            isSigned,
            userName,
            onboarding,
            multimeter,
            subscriptionStatus,
            subscriptionExpirationTime,
          ),
        )
        if (componentMounted.current) setLoading(false)
      }
    }
    onAppLoad()

    return () => {
      componentMounted.current = false
      if (urlListener.response) urlListener.response.remove()
      if (networkStatus) networkStatus()
      if (multimeterListener.response) multimeterListener.response()
    }
  }, [])

  return {
    loading,
    isCloud,
    isLoaded,
    isOnboardingVisible,
  }
}

export default useApp
