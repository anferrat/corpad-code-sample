import {SubscriptionStatuses} from '../../constants/global'
import {
  UPDATE_SETTING,
  LOAD_SETTINGS,
  SET_SURVEY_SAVING_STATUS,
  UPDATE_SURVEY_NAME,
  RESET_CURRENT_SURVEY_SETTINGS,
  LOAD_SESSION_STATE,
  UPDATE_ONBOARDING,
  SET_EXPORT_MODAL,
  UPDATE_LOADER,
  UPDATE_SESSION,
  UPDATE_NETWORK_STATUS,
  SET_SESSION_MODAL_VISIBLE,
  UPDATE_CURRENT_SURVEY_SETTINGS,
  SET_SETTINGS_ON_APP_LOAD,
  SET_SURVEY_SETTINGS,
  UPDATE_BOTTOM_SHEET_CONTENT,
  SET_BLUETOOTH_SCANNING,
  SET_ACTIVE_MULTIMETER,
  SET_ACTIVE_MULTIMETER_STATUS,
  SET_TIME_ADJUSTMENT,
  SET_ACTIVE_MULTIMETER_SETTINGS,
  UPDATE_LOADER_PROGRESS,
  HIDE_LOADER,
  UPDATE_SUBSCRIPTION_STATUS,
  SHOW_PAYWALL,
  HIDE_PAYWALL,
} from '../actions/settings'

const initialState = {
  bottomSheetContent: {
    //BottomSheet component
    itemType: 'TEST_POINT',
    content: 'sorting',
    params: {},
  },
  subscription: {
    status: SubscriptionStatuses.PENDING,
    paywallVisible: false,
    expirationTime: 0,
  },
  lastImport: {
    itemType: null,
    idList: [],
    importTime: null,
  },
  loader: {
    //Loader component
    title: null,
    text: null,
    visible: false,
    progress: {
      visible: false,
      title: null,
      total: 0,
      count: 0,
    },
  },
  exportModal: {
    // ExportModalComponent
    visible: false,
    fileUrl: undefined,
    mimeType: undefined,
  },
  activeMultimeter: {
    id: null,
    paired: false,
    name: null,
    multimeterType: null,
    connected: false,
    syncMode: null,
    delay: null,
    firstCycle: null,
  },
  timeAdjustment: {
    timeFix: false,
  },
  bluetooth: {
    scanning: false,
  },
  session: {
    userName: null,
    isSigned: null,
    signing: false,
    isInternetOn: true,
    sessionModalVisible: false,
  },
  onboarding: {
    main: false,
    map: false,
    editTestPoint: false,
    editBond: false,
    editReferenceCell: false,
    potentialTypes: false,
    versionOnboarding: null, // displays onboarding screen after updates
  },
  //all currentSurvey props are only for DISPLAY purposes. don't use it for operations with data
  currentSurvey: {
    name: null, // survey name for display purposes only, database 'surveyName' setting is primary for any data related operations
    uid: null, //survey unique id, used as folder name for assets
    fileName: null, //file name of current survey. mainly used to be displayed when saving or loading file. the one in db settings has priority over this one
    isLoaded: false, //survey is loaded. if not it'll display survey list screen, if yes it'll display testPoint list
    isCloudSurvey: false, //is current survey on cloud
    savingInProgress: false, //survey is being saved
    lastSyncTime: null, // last time survey was saved or the time when survey was opened
  },
}

const settings = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SETTING:
      if (action.value)
        return {
          ...state,
          [action.setting]: action.value,
        }
      else
        return {
          ...state,
          [action.setting]: initialState[action.setting],
        }
    case UPDATE_LOADER:
      return {
        ...state,
        loader: {
          ...state.loader,
          title: action.title ?? state.loader.title,
          text: action.text ?? state.loader.text,
          visible: true,
        },
      }
    case UPDATE_LOADER_PROGRESS:
      return {
        ...state,
        loader: {
          ...state.loader,
          progress: {
            visible: action.visible,
            title: action.title,
            total: action.total,
            count: action.count,
          },
        },
      }
    case HIDE_LOADER:
      return {
        ...state,
        loader: initialState.loader,
      }
    case LOAD_SETTINGS:
      return {
        ...state,
        ...action.settings,
      }
    case RESET_CURRENT_SURVEY_SETTINGS:
      return {
        ...state,
        lastImport: initialState.lastImport,
        currentSurvey: {
          ...initialState.currentSurvey,
          isCloudSurvey: state.currentSurvey.isCloudSurvey,
        },
        loader: initialState.loader,
      }
    case SET_SETTINGS_ON_APP_LOAD: {
      const multimeterPaired = action.multimeter.peripheralId !== null
      return {
        ...state,
        subscription: {
          ...state.subscription,
          status: action.subscriptionStatus,
          expirationTime: action.subscriptionExpirationTime,
        },
        currentSurvey: {
          ...state.currentSurvey,
          name: action.name,
          uid: action.uid,
          fileName: action.fileName,
          isLoaded: action.isLoaded,
          lastSyncTime: action.syncTime,
          isCloudSurvey: action.isCloud,
        },
        session: {
          ...state.session,
          isSigned: action.isSigned,
          userName: action.userName,
        },
        onboarding: {
          ...state.onboarding,
          main: action.onboarding.main,
          map: action.onboarding.map,
          editTestPoint: action.onboarding.editTestPoint,
          editBond: action.onboarding.editBond,
          editReferenceCell: action.onboarding.editReferenceCell,
          potentialTypes: action.onboarding.potentialTypes,
          versionOnboarding: action.onboarding.versionOnboarding,
        },
        activeMultimeter: {
          ...state.activeMultimeter,
          paired: multimeterPaired,
          id: multimeterPaired ? action.multimeter.peripheralId : null,
          name: multimeterPaired ? action.multimeter.name : null,
          multimeterType: multimeterPaired ? action.multimeter.type : null,
          syncMode: action.multimeter.syncMode,
          onTime: action.multimeter.onTime,
          offTime: action.multimeter.offTime,
          firstCycle: action.multimeter.fisrtCycle,
          delay: action.multimeter.delay,
        },
      }
    }
    case UPDATE_BOTTOM_SHEET_CONTENT:
      return {
        ...state,
        bottomSheetContent: {
          itemType: action.itemType,
          content: action.content,
          params: action.params,
        },
      }
    case UPDATE_CURRENT_SURVEY_SETTINGS:
      return {
        ...state,
        currentSurvey: {
          ...state.currentSurvey,
          lastSyncTime: action.syncTime,
          fileName: action.fileName,
          savingInProgress: false,
        },
      }
    case SET_SURVEY_SAVING_STATUS:
      return {
        ...state,
        currentSurvey: {
          ...state.currentSurvey,
          savingInProgress: action.savingInProgress,
        },
      }
    case SET_SURVEY_SETTINGS:
      return {
        ...state,
        currentSurvey: {
          ...state.currentSurvey,
          name: action.name,
          fileName: action.fileName,
          isCloudSurvey: action.isCloudSurvey,
          lastSyncTime: action.syncTime,
          isLoaded: action.isLoaded,
          uid: action.uid,
        },
      }
    case UPDATE_SURVEY_NAME:
      return {
        ...state,
        currentSurvey: {
          ...state.currentSurvey,
          name: action.name,
        },
      }
    case LOAD_SESSION_STATE:
      return {
        ...state,
        session: {
          userName: action.userName ?? state.session.userName,
          isSigned: action.isSigned ?? state.session.isSigned,
          signing: action.signing ?? state.session.signing,
          isInternetOn: action.isInternetOn ?? state.session.isInternetOn,
          sessionModalVisible:
            action.sessionModalVisible ?? state.session.sessionModalVisible,
        },
      }
    case UPDATE_SESSION:
      return {
        ...state,
        session: {
          ...state.session,
          isSigned: action.isSigned ?? state.session.isSigned,
          signing: action.signing ?? state.session.signing,
          userName: action.userName ?? state.session.userName,
        },
      }
    case UPDATE_NETWORK_STATUS:
      return {
        ...state,
        session: {
          ...state.session,
          isInternetOn: action.isInternetOn,
        },
      }
    case SET_SESSION_MODAL_VISIBLE:
      return {
        ...state,
        session: {
          ...state.session,
          sessionModalVisible: action.visible,
        },
      }

    case UPDATE_ONBOARDING:
      if (!state.onboarding.hasOwnProperty(action.onboardingScreen))
        return state
      else
        return {
          ...state,
          onboarding: {
            ...state.onboarding,
            [action.onboardingScreen]: false,
            versionOnboarding:
              action.versionOnboarding ?? state.onboarding.versionOnboarding,
          },
        }
    case SET_EXPORT_MODAL:
      return {
        ...state,
        exportModal: {
          visible: action.visible ?? state.exportModal.visible,
          fileUrl: action.fileUrl ?? state.exportModal.fileUrl,
          mimeType: action.mimeType ?? state.exportModal.mimeType,
        },
      }
    case SET_BLUETOOTH_SCANNING:
      return {
        ...state,
        bluetooth: {
          ...state.bluetooth,
          scanning: action.scanning,
        },
      }
    case SET_ACTIVE_MULTIMETER:
      return {
        ...state,
        activeMultimeter: {
          ...state.activeMultimeter,
          paired: action.paired,
          id: action.paired ? action.id : null,
          name: action.paired ? action.name : null,
          connected:
            action.connected === undefined
              ? state.activeMultimeter.connected
              : action.connected,
          multimeterType: action.paired ? action.multimeterType : null,
        },
      }
    case SET_ACTIVE_MULTIMETER_STATUS:
      return {
        ...state,
        activeMultimeter: {
          ...state.activeMultimeter,
          connected: action.connected,
        },
      }
    case SET_ACTIVE_MULTIMETER_SETTINGS:
      return {
        ...state,
        activeMultimeter: {
          ...state.activeMultimeter,
          syncMode: action.syncMode,
          onTime: action.onTime,
          offTime: action.offTime,
          firstCycle: action.firstCycle,
          delay: action.delay,
        },
      }
    case SET_TIME_ADJUSTMENT:
      return {
        ...state,
        timeAdjustment: {
          timeFix: action.timeFix,
        },
      }
    case UPDATE_SUBSCRIPTION_STATUS:
      return {
        ...state,
        subscription: {
          ...state.subscription,
          status: action.status,
          expirationTime: action.expirationTime,
        },
      }
    case SHOW_PAYWALL:
      return {
        ...state,
        subscription: {
          ...state.subscription,
          paywallVisible: true,
        },
      }
    case HIDE_PAYWALL:
      return {
        ...state,
        subscription: {
          ...state.subscription,
          paywallVisible: false,
        },
      }
    default:
      return state
  }
}

export default settings
